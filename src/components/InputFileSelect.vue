<script setup>
import { defineEmits, ref, useId } from "vue"

const props = defineProps({
    label: { type: String, required: false, default: "select file" },
    placeholder: { type: String, required: false, default: "no file selected" },
    buttonText: { type: String, required: false, default: "no file selected" },
    disabled: { type: Boolean, required: false, default: false },
    accept: { type: String, required: false, default: "text/csv,.txt" }
})

const selectedFileName = ref("")
// unique id for input control so we can use .getElementById
const inputFileControlId = useId()
const inputFileVisibleId = useId()
const emit = defineEmits(["selected"])

const selectLocalFile = () => {
    // click the underlying file control to make
    // it display the modal file selection panel
    const control = document.getElementById(inputFileControlId)
    control.click()
}


// todo - use to clear the control programmatically
const clear = () => { 
    selectedFileName.value = ""   

    let el = document.getElementById(inputFileControlId)
    el.value = ""
    
    el = document.getElementById(inputFileVisibleId)
    el.value = ""
}


const localFileSelected = (e) => {
    const inputFile = e.target.files[0]
    
    // changes text on wrapper control to display chosen file name
    // wrapper used to display translated labels for inflexible file input control)
    // let control = document.getElementById(inputId)
    // control.value = inputFile?.name
    selectedFileName.value = inputFile?.name
    emit("selected", inputFile)
}

defineExpose({
    clear
})

</script>

<template>
    <div>
        <div class="col-form-label-sm text-capitalize fw-bold">{{ label }}</div>
        <div class="input-group">
            <!--button to trigger file selection-->
            <button class="btn btn-sm btn-outline-secondary rounded shadow-sm" :disabled="disabled"
                @click.stop.prevent="selectLocalFile">
                <span>&#128441;&nbsp;{{ props.buttonText }}</span>
            </button>
            <!--visible input field-->
            <input :placeholder="props.placeholder" readonly :id="inputFileVisibleId" @click.stop.prevent="selectLocalFile"
                class="form-control form-control-sm rounded shadow-sm" :disabled="disabled" :value="selectedFileName" />
            <!--<button 
            class="btn btn-sm btn-outline-secondary rounded shadow-sm" :lang="locale" :disabled="disabled"
            :alt="$t('clear', 2)" :title="$t('clear', 2)" @click.stop.prevent="clear()"><span>&#9747;</span>
        </button>-->
            <!--(hidden) file input field-->
            <input class="form-control-file" type="file" :id="inputFileControlId" :accept="props.accept"
                style="width: 100%; display: none" @change="localFileSelected" />
        </div>
    </div>

</template>

<style scoped></style>