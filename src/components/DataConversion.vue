<script setup>
import { ref, nextTick } from 'vue'
import { Liquid } from 'liquidjs'
import Papa from 'papaparse'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import LocaleSelect from '@/components/LocaleSelect.vue'
const { locale } = useI18n()

// Tester..
const testTemplate1 = `
{%- for row in data -%}
{% if row.concept_id %}
{%- capture CONCEPTURI -%}http://tempuri/schemes/1/concepts/{{ row.concept_id | strip | url_encode }}{%- endcapture -%}
<{{ CONCEPTURI }}> .
{% endif %}
{%- endfor -%}
`
const template = ref(testTemplate1)
const delimitedData = ref([])
const results = ref('')
const working = ref(false)

const selectDelimitedFile = () => {
  // click the underlying file control
  const control = document.getElementById('csv_input')
  control.click()
}

const selectTemplateFile = () => {
  // click the underlying file control
  const control = document.getElementById('template_input')
  control.click()
}

const delimitedFileSelected = (e) => {
  const csvFile = e.target.files[0]

  // change text on wrapper control to display chosen file name
  // (wrapper used to display translated labels for file input control)
  let control = document.getElementById('selectedCsvFileName')
  control.value = csvFile.name

  loadDelimitedDataFromFile(csvFile).then((data) => (delimitedData.value = data))
}

const templateFileSelected = (e) => {
  const templateFile = e.target.files[0]

  // change text on wrapper control to display chosen file name
  // (wrapper used to display translated labels for file input control)
  let control = document.getElementById('selectedTemplateFileName')
  control.value = templateFile.name

  loadTextFromFile(templateFile).then((data) => (template.value = data))
}

const loadTextFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (res) => {
      resolve(res.target.result)
    }
    reader.onerror = (err) => reject(err)
    reader.readAsText(file)
  })
}

//const loadJsonDataFromFile = file => {
//const contents = {}
//return { data: contents }
//}

const loadDelimitedDataFromFile = (file, delimiter = '\t', hasHeader = true) => {
  // const defaults = {}
  // const options = { ...defaults, ...config }
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      encoding: 'UTF-8',
      delimiter: delimiter,
      header: hasHeader,
      skipEmptyLines: 'greedy',
      complete: function (results) {
        resolve(results.data)
      },
      error: function (err) {
        reject(err)
      }
    })
  })
}

const doDataConversion = async () => {
  working.value = false
  working.value = true // doesn't show spinner?
  results.value = '' // control not refreshing before doing the conversion?
  nextTick() // none of this forces spinner to show...
  const control = document.getElementById('myspinnercontainer')
  control.setAttribute('key', new Date().getTime())
  // none of this forces spinner to show...

  nextTick(() => {
    const engine = new Liquid()

    engine.parseAndRender(template.value, { data: delimitedData.value }).then((text) => {
      results.value = text
      working.value = false
    })
  })
}

const saveResultsToFile = (fileName = null) => {
  //const fileName = `results-12345.txt`
  //console.log(fileName)
  if (results.value.trim().length == 0)
    return
  
  if (!fileName) fileName = `steleto-${moment().format('YYYYMMDDHHmmss')}.txt`

  saveTextToFile(results.value, fileName)
}

const saveTextToFile = (textData, fileName) => {
  let blob = new Blob([textData], { type: 'text/plain;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, fileName)
  } else {
    let link = document.createElement('a')
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

/* 
TODO:
* display CSV input data (sample?) in table 
* allow for chaining of workflow?
*/
</script>

<template>
  <div class="container">
    <div class="row align-items-end">
      <div class="col">
        <h3 class="text-capitalize" :lang="locale">STELETO&nbsp;{{ $t('dataConversion') }}</h3>
      </div>   
      <div class="col-3">
        <LocaleSelect/>
      </div> 
    </div>
    
    <!--CSV file input wrapped to allow for translated text "select file" and "no file selected"-->
    <div class="row mb-3">
      <div class="col">
        <label 
          for="csv_input" 
          class="col-form-label-sm  text-capitalize" 
          :lang="locale">{{ $t('delimitedDataFile') }}</label>
        <div class="input-group">
          <button
            class="btn btn-sm btn-outline-secondary rounded"
            :lang="locale"
            @click.stop.prevent="selectDelimitedFile"
            >&#128441;&nbsp;{{ $t('selectFile') }}</button>
          <input
            id="selectedCsvFileName"
            :placeholder="$t('noFileSelected')"
            readonly
            class="form-control form-control-sm rounded"
            :lang="locale"
          />
          <input
            class="form-control-file"
            type="file"
            id="csv_input"
            name="csv_input"
            accept="text/csv,.txt"
            :lang="locale"
            style="width: 100%; display: none"
            @change="delimitedFileSelected"
          />
        </div>
      </div>
    

      <!--template file input wrapped to allow for translated text "select file" and "no file selected"-->
      <div class="col">
        <label 
          for="template_input" 
          class="col-form-label-sm text-capitalize" 
          :lang="locale">LIQUID {{ $t('templateFile') }}</label>
        <div class="input-group">
          <button
            class="btn btn-sm btn-outline-secondary rounded"
            :lang="locale"
            @click.stop.prevent="selectTemplateFile"
            >&#128441;&nbsp;{{ $t('selectFile') }}</button>
          <input
            id="selectedTemplateFileName"
            :placeholder="$t('noFileSelected')"
            readonly
            :lang="locale"
            class="form-control form-control-sm rounded"
          />
          <input
            type="file"
            id="template_input"
            name="template_input"
            accept=".liquid,.txt"
            :lang="locale"
            style="width: 100%; display: none"
            @change="templateFileSelected"
          />
        </div>
      </div>   
    </div>

    <div class="row">
      
      <div 
        class="col text-end" 
        id="myspinnercontainer">
        <strong 
          role="status" 
          v-show="working" 
          :lang="locale">{{ $t('working') }}...</strong>
        <span 
          id="myspinner" 
          class="spinner-border spinner-border-sm mx-2" 
          v-show="working"></span>
      </div>
      <div class="col-3 btn-group text-end">
        <button
          class="btn btn-sm btn-outline-secondary form-control"
          :lang="locale"
          :alt="$t('convertData')"
          :title="$t('convertData')"
          @click.stop.prevent="doDataConversion()"          
        >
          <span>🗲&nbsp;{{ $t('convert') }}</span>
        </button>
      
        <button
          class="btn btn-sm btn-outline-secondary form-control"
          :lang="locale"
          :alt="$t('saveResult', 2)"
          :title="$t('saveResult', 2)"
          @click.stop.prevent="saveResultsToFile()"
        >
          <span>&#128427;&nbsp;{{ $t('save') }}</span>
        </button>             
      </div>   
    </div>

    <div class="row">
      <div class="col">
        <label 
          for="conversionResults" 
          class="text-capitalize col-form-label-sm" 
          :lang="locale">{{ $t('result', 2) }}</label>
        <pre 
          id="conversionResults" 
          name="conversionResults" 
          class="p-1"
          :lang="locale"><code>{{ results }}</code></pre>
      </div>  
      
    </div>
   
  </div> 
</template>

<style scoped>
#conversionResults {
  font-size: small;
  border: 1px solid lightgray;
  overflow: scroll;
  min-width: 1000px;
  height: 700px;
}

</style>
