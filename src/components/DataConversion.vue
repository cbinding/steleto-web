<script setup>
import { ref, computed } from 'vue'
import { Liquid } from 'liquidjs'
import Papa from 'papaparse'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import LocaleSelect from '@/components/LocaleSelect.vue'
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
const rawInput = ref("")
const hasHeader = ref(true)
const delimiter = ref("\t")
const results = ref('')
const working = ref(false)
const wrapped = ref(false)

//const delimiter = ref('')

const canSave = computed(() => working.value == false && results.value.length > 0)

const selectInputFile = () => {
  // click the underlying file control
  const control = document.getElementById('inputFile')
  control.click()
}

const selectTemplateFile = () => {
  // click the underlying file control
  const control = document.getElementById('templateFile')
  control.click()
}

const inputFileSelected = (e) => {
  const inputFile = e.target.files[0]

  // change text on wrapper control to display chosen file name
  // (wrapper used to display translated labels for inflexible file input control)
  let control = document.getElementById('selectedInputFile')
  control.value = inputFile?.name  
  loadTextFromFile(inputFile).then((data) => rawInput.value = data)
  //loadDelimitedDataFromFile(csvFile, '\t', hasHeader.value).then((data) => (delimitedData.value = data))
}

const templateFileSelected = (e) => {
  const templateFile = e.target.files[0]

  // change text on wrapper control to display chosen file name
  // (wrapper used to display translated labels for inflexible file input control)
  let control = document.getElementById('selectedTemplateFile')
  control.value = templateFile?.name
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

/*const loadDelimitedDataFromFile = (file, delimiter = '\t', hasHeader = true) => {
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
}*/


const doDataConversion = () => {
  results.value = ''
  //console.log(rawInput.value.substring(0,100))
  // no point continuing if data or template not provided
  if (template.value.trim().length == 0 || rawInput.value.trim().length == 0) return

  // show the spinner
  working.value = true

  // use setTimeout so spinner displays (otherwise no re-render occurs)  
  setTimeout(() => {

    // parse delimited data to an array
    const parsed = Papa.parse(rawInput.value.trim(), {
      encoding: 'UTF-8',
      delimiter: delimiter.value,
      header: hasHeader.value,
      skipEmptyLines: 'greedy'
    })
    // TODO: display parsed.errors?
    //console.log(parsed.data[1])

    // convert parsed data using Liquid template
    const engine = new Liquid()
    engine
      .parseAndRender(template.value, { data: parsed.data })
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

const clearAll = () => {
  let control = null

  control = document.getElementById('selectedInputFile')
  if (control?.value) control.value = null

  control = document.getElementById('selectedTemplateFile')
  if (control?.value) control.value = null

  control = document.getElementById('inputFile')
  if (control?.value) control.value = null

  control = document.getElementById('templateFile')
  if (control?.value) control.value = null

  //delimitedData.value = []
  rawInput.value = ""
  template.value = ""
  results.value = ""
  working.value = false
  hasHeader.value = true
  delimiter.value = "\t"
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
        <LocaleSelect options="cy,cs,de,en,es,fr,it" />
      </div>
    </div>

    <!--CSV file input wrapped to allow for translated text "select file" and "no file selected"-->
    <div class="row mb-3">
      <div class="col">
        <label for="inputFile" class="col-form-label-sm text-capitalize fw-bold" :lang="locale">{{
          $t('delimitedDataFile')
          }}</label>
        <div class="input-group">
          <button class="btn btn-sm btn-outline-secondary rounded shadow-sm" :lang="locale" :disabled="working"
            @click.stop.prevent="selectInputFile">
            &#128441;&nbsp;{{ $t('selectFile') }}
          </button>
          <input id="selectedInputFile" :placeholder="$t('noFileSelected')" readonly
            class="form-control form-control-sm rounded shadow-sm" :lang="locale" :disabled="working" />
          <!--todo: allow choosing delimiter - currently only tab-->
          <!--<CycleButton options="comma, tab" :disabled="working" v-model="delimiter"/>-->

          <input class="form-control-file" type="file" id="inputFile" name="inputFile" accept="text/csv,.txt"
            :lang="locale" :disabled="working" style="width: 100%; display: none" @change="inputFileSelected" />
        </div>
      </div>

      <!--template file input wrapped to allow for translated text "select file" and "no file selected"-->
      <div class="col">
        <label for="templateFile" class="col-form-label-sm text-capitalize fw-bold" :lang="locale">LIQUID {{
          $t('templateFile') }}</label>
        <div class="input-group">
          <button class="btn btn-sm btn-outline-secondary rounded shadow-sm" :lang="locale" :disabled="working"
            @click.stop.prevent="selectTemplateFile">
            &#128441;&nbsp;{{ $t('selectFile') }}
          </button>
          <input id="selectedTemplateFile" :placeholder="$t('noFileSelected')" readonly :lang="locale"
            :disabled="working" class="form-control form-control-sm rounded shadow-sm" />
          <input type="file" id="templateFile" name="templateFile" accept=".liquid,.txt" :lang="locale"
            :disabled="working" style="width: 100%; display: none" @change="templateFileSelected" />
        </div>
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

    <div class="row mb-3">     

      <div class="col">
        <div class="form-check form-switch">
          <input class="form-check-input shadow-sm" type="checkbox" role="switch" id="hasHeaderSwitch"
            v-model="hasHeader" />
          <label class="form-check-label col-form-label-sm" for="hasHeaderSwitch">has header?</label>
        </div>
      </div>
    </div>

      <div class="row mb-3">
        <div class="col-1">
          <span class="text-capitalize col-form-label-sm fw-bold" :lang="locale">{{
            $t('result', 2)
            }}</span>
        </div>

        <div class="col">
          <div class="form-check form-switch">
            <input class="form-check-input shadow-sm" type="checkbox" role="switch" id="wraptextSwitch"
              v-model="wrapped" />
            <label class="form-check-label col-form-label-sm" for="wraptextSwitch">{{ $t('wraptext') }}?</label>
          </div>
        </div>

        <div class="col text-end">
          <strong role="status" v-show="working" :lang="locale">{{ $t('working') }}...</strong>
          <span id="myspinner" class="spinner-border spinner-border-sm mx-2" v-show="working"></span>
        </div>

        <div class="col-5 btn-group text-end">
          <button class="btn btn-sm btn-outline-secondary form-control shadow-sm" :lang="locale" :disabled="working"
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
