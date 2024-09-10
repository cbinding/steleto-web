<script setup>
import { ref } from 'vue'
import { Liquid } from 'liquidjs'
import Papa from 'papaparse'
import moment from 'moment'

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
const results = ref("")

const selectDelimitedFile = () => {
  // click the underlying file control
  const control = document.getElementById("csv_input")
  control.click()
}

const selectTemplateFile = () => {
  // click the underlying file control
  const control = document.getElementById("template_input")
  control.click()
}

const delimitedFileSelected = (e) => {
  const csvFile = e.target.files[0]

  // change text on wrapper control to display chosen file name
  // (wrapper used to display translated labels for file input control)
  let control = document.getElementById("selectedCsvFileName")
  control.value = csvFile.name
            
  loadDelimitedDataFromFile(csvFile)
    .then(data => delimitedData.value = data)
}


const templateFileSelected = (e) => { 
  const templateFile = e.target.files[0]

  // change text on wrapper control to display chosen file name
  // (wrapper used to display translated labels for file input control)
  let control = document.getElementById("selectedTemplateFileName")
  control.value = templateFile.name

  loadTextFromFile(templateFile)
    .then(data => template.value = data)
}

	
const loadTextFromFile = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = res => {
			resolve(res.target.result);
		};
		reader.onerror = err => reject(err);
		reader.readAsText(file);
	});
}

//const loadJsonDataFromFile = file => { 
 //const contents = {}
 //return { data: contents }
//}

const loadDelimitedDataFromFile = (file, delimiter="\t", hasHeader=true) => {
	// const defaults = {}
	// const options = { ...defaults, ...config } 		
	return new Promise((resolve, reject) => {
		Papa.parse(file, {			
			encoding: "UTF-8",
			delimiter: delimiter,
			header: hasHeader,
			skipEmptyLines: "greedy",			
			complete: function(results) {
				resolve(results.data)
			},
			error: function(err) {
				reject(err)
			}
		})
	})	
}

const doDataConversion = () => { 
  const engine = new Liquid()

  engine
    .parseAndRender(template.value, { data: delimitedData.value })
    .then(text => results.value = text)	
}


const saveResultsToFile = (fileName=null) => { 
  //const fileName = `results-12345.txt`
  if(!fileName)
    fileName = `steleto-${ moment().format("YYYYMMDDHHmmss") }.txt`
  saveTextToFile(results.value, fileName)
}


const saveTextToFile = (textData, fileName) => {
  let blob = new Blob([textData], { type: 'text/plain;charset=utf-8;' })
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, fileName)
  } else {
    let link = document.createElement('a')
    if (link.download !== undefined) { // feature detection
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
* allow input data file(s) import 
* allow liquid template(s) import 
* allow for chaining of workflow?
*/
 
</script>

<template>  
  <form>    
    <h3 class="capitalized">{{ $t("dataConversion") }}</h3>
    
    <!--CSV file input wrapped to allow for translated text "select file" and "no file selected"-->
    <div class="mb-3">
      <label for="csv_input">{{ $t("selectDelimitedDataFile") }}</label> 
      <div class="input-group">            
        <span class="input-group-text btn btn-outline-secondary rounded" @click="selectDelimitedFile">{{ $t("select") }}</span>
        <input id="selectedCsvFileName" :placeholder="$t('noFileSelected')" readonly class="form-control rounded"/>
        <input type="file" id="csv_input" name="csv_input" style="width: 100%; display: none;" @change="delimitedFileSelected"/>
      </div>
    </div>      
    
    <!--template file input wrapped to allow for translated text "select file" and "no file selected"-->
    <div class="mb-3">
      <label for="template_input">{{ $t("selectTemplateFile") }}</label> 
      <div class="input-group">            
        <span class="input-group-text btn btn-outline-secondary rounded" @click="selectTemplateFile">{{ $t("select") }}</span>
        <input id="selectedTemplateFileName" :placeholder="$t('noFileSelected')" readonly class="form-control rounded"/>
        <input type="file" id="template_input" name="template_input" style="width: 100%; display: none;" @change="templateFileSelected"/>
      </div>
    </div>

    <div class="mb-3">
      <button class="btn btn-sm btn-outline-secondary" @click.prevent="doDataConversion">{{ $t("convertData")}}</button>	
    </div>

    <div class="mb-3">
      <label for="conversion_results" class="capitalized">{{ $t("result", 2)}}</label>
      <pre id="conversion_results" name="conversion_results">{{ results }}</pre>
      <button class="btn btn-sm btn-outline-primary" @click.prevent="saveResultsToFile">{{ $t("save")}}</button>	  
    </div>
      
  </form>  
</template>

<style scoped>
  .capitalized {text-transform:capitalize; }
  #conversion_results {
    font-size: small;
    border: 1px solid lightgray;
    overflow: scroll;
    width: 800px;
    height: 500px;
  }
</style>
