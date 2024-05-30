<script setup>
import { ref } from 'vue'
import { Liquid } from 'liquidjs'
import Papa from 'papaparse'
import moment from 'moment'

// Tester..
const template1 = `
{%- for row in data -%}
{% if row.concept_id %}
{%- capture CONCEPTURI -%}http://tempuri/schemes/1/concepts/{{ row.concept_id | strip | url_encode }}{%- endcapture -%}
<{{ CONCEPTURI }}> .
{% endif %}
{%- endfor -%}
`

const template = ref(template1)
const delimdata = ref([])
const results = ref("")


const delimFileSelected = (e) => {
  const file = e.target.files[0]
  //console.log(file)
  loadDelimDataFromFile(file)
    .then(data => {
      delimdata.value = data
      //console.log(data)
      renderDataWithTemplate(delimdata.value, template.value)
    })
}


const templateFileSelected = (e) => { 
  const file = e.target.files[0]
  loadTemplateFromFile(file)
    .then(data => {
      template.value = data
      //console.log(data)
      renderDataWithTemplate(delimdata.value, template.value)
    });
}

	
const loadTemplateFromFile = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = res => {
			resolve(res.target.result);
		};
		reader.onerror = err => reject(err);
		reader.readAsText(file);
	});
}

  
const loadDelimDataFromFile = (file, delimiter="\t", hasheader=true) => {
	//const defaults = {}
	//const options = {...defaults, ...config} 		
	return new Promise((resolve, reject) => {
		Papa.parse(file, {			
			encoding: "UTF-8",
			delimiter: delimiter,
			header: hasheader,
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


const renderDataWithTemplate = (data, template) => {
	const engine = new Liquid()

	engine
    .parseAndRender(template, { data: data })
    .then(text => results.value = text)			
}	


const saveResults = () => { 
  //const fileName = `results-12345.txt`
  const fileName = `steleto-${ moment().format("YYYYMMDDHHmmss") }.txt`
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
  <div>
    <h3>Data Conversion</h3>
    <label for="csv_input">Choose a delimited data file:</label>
    <input type="file" id="csv_input" name="csv_input" accept="text/tab-separated-values" @change="delimFileSelected"/>
    <br>
    <label for="template_input">Choose a template file:</label>
    <input type="file" id="template_input" name="template_input" accept="text" @change="templateFileSelected"/>
    <br>
    <label for="results" class="capitalized">{{ $t("result", 2)}}:</label>
    <pre id="results">{{ results }}</pre>

    <button @click="saveResults"><span>{{ $t("save")}}</span></button>	    
</div>
</template>

<style scoped>
  .capitalized {text-transform:capitalize; }
  #results {
    font-size: small;
    border: 1px solid lightgray;
    overflow: scroll;
    width: 800px;
    height: 300px;
  }
</style>
