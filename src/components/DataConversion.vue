<script setup>
import { ref, computed } from 'vue'
import { Liquid } from 'liquidjs'
import Papa from 'papaparse'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import LocaleSelect from '@/components/LocaleSelect.vue'
//import DelimiterSelect from '@/components/DelimiterSelect.vue'
import InputFileSelect from '@/components/InputFileSelect.vue'
//import CycleButton from '@/components/CycleButton.vue'
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
const inputData = ref({})
const hasHeader = ref(true)
const delimiter = ref(",")
const results = ref("")
const working = ref(false)
const wrapped = ref(false)

const inputFileSelectorRef = ref(null)
const templateFileSelectorRef = ref(null)

//const delimiter = ref('')

const canSave = computed(() => working.value == false && results.value.length > 0)
const canRun = computed(() => working.value == false && template.value != "")


const loadTextFromFile = (file) => {
  if (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (res) => {
        resolve(res.target.result)
      }
      reader.onerror = (err) => reject(err)
      reader.readAsText(file)
    })
  }
}

//TODO - for remote files
//const loadTextFromURL = (url) => fetch(url).then(response => response.text())

const parseDataFromText = (text, isJSON) => {
  let parsed = null
  if (isJSON) 
    parsed = {
      data: JSON.parse(text.trim()),
      errors: [],
      meta: {}
    } 
  else {
    parsed = Papa.parse(text.trim(), {
      encoding: 'UTF-8',
      delimiter: '', // auto-detect instead of specifying delimiter.value,
      header: hasHeader.value,
      skipEmptyLines: 'greedy'
    }) 
  }
  return parsed
}


const doDataConversion = () => {
  results.value = ""
  
  // no point continuing if either data or template not provided
  if (template.value.trim().length == 0 || inputData.value.length == 0) return

  // show the spinner
  working.value = true

  // use setTimeout so spinner displays (otherwise no re-render occurs)  
  setTimeout(() => {
    
    // convert parsed data using Liquid template
    const engine = new Liquid()
    engine
      .parseAndRender(template.value, inputData.value)
      .then((text) => {
        //console.log(text.substring(0, 100))
        results.value = text
        working.value = false
      })
      .catch((err) => {
        // display any template error
        results.value = err 
        working.value = false
      })
  }, 0)
}


const saveResultsToFile = (fileName = null) => {
  //const fileName = `results-12345.txt`
  //console.log(fileName)
  if (!canSave.value) return

  // if no fileName is passed use a default (timestamped) name
  fileName = fileName || `steleto-${moment().format('YYYYMMDDHHmmss')}.txt`
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


const inputFileSelected = (f) => {
  //console.log(f) 
  const isJSON = f.name.trim().toLowerCase().endsWith(".json")
  loadTextFromFile(f)
    .then(text => parseDataFromText(text, isJSON))
    .then(data => inputData.value = data) 
}


const templateFileSelected = (e) => {
  loadTextFromFile(e).then(text => template.value = text)
}


const clearAll = () => {
  let control = null

  // TODO: this will no longer work...
  control = document.getElementById('inputFileSelector')
  if (control?.value) control.value = null
  // this should?
  inputFileSelectorRef.value.clear()

  // TODO: this will no longer work...
  control = document.getElementById('templateFileSelector')
  if (control?.value) control.value = null
  // this should?
  templateFileSelectorRef.value.clear()

  //delimitedData.value = []
  inputData.value = null
  template.value = ""
  results.value = ""
  working.value = false
  hasHeader.value = true
  delimiter.value = ","
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
        <!--<h3 class="text-capitalize" :lang="locale">STELETO&nbsp;{{ $t('dataConversion') }}</h3>-->
        <h3 class="text-capitalize" :lang="locale">{{ $t('dataConversion') }}</h3>
      </div>
      <div class="col-4">
        <LocaleSelect options="cy,cs,de,en,es,fr,it,sv" />
      </div>
    </div>

    <div class="row mb-3">
      <div class="col">
        <!--file input wrapped to allow for translated text "select file" and "no file selected"-->
        <InputFileSelect id="inputFileSelector" ref="inputFileSelectorRef" name="inputFileSelector"
          :label="$t('dataFile')" :placeholder="$t('noFileSelected')" :button-text="$t('selectFile')"
          @selected="inputFileSelected" accept="text/csv,text/tab-separated-values,application/json,.txt,.tab,.tsv" :disabled="working" />        
      </div>

      <div class="col">
        <!--file input wrapped to allow for translated text "select file" and "no file selected"-->      
        <InputFileSelect id="templateFileSelector" name="templateFileSelector" ref="templateFileSelectorRef"
          :label="$t('templateFile')" :placeholder="$t('noFileSelected')" :button-text="$t('selectFile')"
          @selected="templateFileSelected" accept=".liquid" :disabled="working" />
      </div>
    </div>

    <!--<div class="row">
      <div class="col">
        <label 
          for="csvPreview" 
          class="text-capitalize col-form-label-sm" 
          :lang="locale">preview</label>
        <pre class="overflow-y-scroll">{{ delimitedData }}</pre>
      </div>
      <div class="col"><label 
          for="templatePreview" 
          class="text-capitalize col-form-label-sm" 
          :lang="locale">preview</label>
        <pre class="overflow-y-scroll">{{ template }}</pre></div>
    </div>-->

    <div class="row mb-3" v-show="false">

      <div class="col-2">
        <div class="form-check form-switch">
          <input class="form-check-input shadow-sm" type="checkbox" checked role="switch" id="hasHeaderSwitch"
            v-model="hasHeader" :disabled="working" />
          <label class="form-check-label col-form-label-sm" for="hasHeaderSwitch">{{ $t('hasHeader') }}?</label>
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-1">
        <span class="text-capitalize col-form-label-sm fw-bold" :lang="locale">{{ $t('result', 2) }}</span>
      </div>

      <div class="col">
        <div class="form-check form-switch">
          <input class="form-check-input shadow-sm" type="checkbox" role="switch" id="wraptextSwitch" v-model="wrapped"
            :disabled="working" />
          <label class="form-check-label col-form-label-sm" for="wraptextSwitch">{{ $t('wrapText') }}?</label>
        </div>
      </div>

      <div class="col text-end">
        <strong role="status" v-show="working" :lang="locale">{{ $t('working') }}...</strong>
        <span id="myspinner" class="spinner-border spinner-border-sm mx-2" v-show="working"></span>
      </div>

      <div class="col-5 btn-group text-end">
        <button class="btn btn-sm btn-outline-secondary form-control shadow-sm" :lang="locale" :disabled="!canRun"
          :alt="$t('convertData')" :title="$t('convertData')" @click.stop.prevent="doDataConversion()">
          <span>🗲&nbsp;{{ $t('convert') }}</span>
        </button>

        <button class="btn btn-sm btn-outline-secondary form-control shadow-sm" :lang="locale" :disabled="!canSave"
          :alt="$t('saveResult', 2)" :title="$t('saveResult', 2)" @click.stop.prevent="saveResultsToFile()">
          <span>&#128427;&nbsp;{{ $t('save') }}</span>
        </button>

        <button class="btn btn-sm btn-outline-secondary form-control shadow-sm" :lang="locale" :disabled="working"
          :alt="$t('clear', 2)" :title="$t('clear', 2)" @click.stop.prevent="clearAll()">
          <span>&#9747;&nbsp;{{ $t('clear') }}</span>
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <pre id="results" name="results" class="p-1 shadow-sm" :class="{ wrapped: wrapped }"
          :lang="locale">{{ results }}</pre>
      </div>
    </div>
  </div>

</template>

<style scoped>
#results {
  font-size: small;
  border: 1px solid lightgray;
  overflow: scroll;
  min-width: 1100px;
  height: 700px;
}
.wrapped {
  white-space: pre-wrap;
}
</style>
