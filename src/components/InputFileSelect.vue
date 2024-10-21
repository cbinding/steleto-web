<script setup>
import { defineProps, defineEmits, ref, useId } from "vue"

const props = defineProps({
    placeholder: { type: String, required: false, default: "No file selected" },
    buttonText: { type: String, required: false, default: "No file selected" },
    disabled: { type: Boolean, required: false, default: false },
    accept: { type: String, required: false, default: "text/csv,.txt" }
})

const selectedFileName = ref("")
// unique id for input control so we can use .getElementById
const inputFileControlId = useId()
const emit = defineEmits(["selected"])

const selectFile = () => {
    // click the underlying file control
    const control = document.getElementById(inputFileControlId)
    control.click()
}

const selected = (e) => {
    const inputFile = e.target.files[0]
    
    // change text on wrapper control to display chosen file name
    // wrapper used to display translated labels for inflexible file input control)
    //let control = document.getElementById(inputId)
    //control.value = inputFile?.name
    selectedFileName.value = inputFile?.name
    emit("selected", inputFile)
}
</script>

<template>
    <div>
        <div class="input-group">
            <!--button to trigger file selection-->
            <button class="btn btn-sm btn-outline-secondary rounded shadow-sm" :disabled="disabled"
                @click.stop.prevent="selectFile">
                <span>&#128441;&nbsp;{{ props.buttonText }}</span>
            </button>
            <!--visible input field-->
            <input :placeholder="props.placeholder" readonly
                class="form-control form-control-sm rounded shadow-sm" :disabled="disabled" :value="selectedFileName"/>
            <!--(hidden) file input field-->
            <input class="form-control-file" type="file" :id="inputFileControlId" :accept="props.accept"
                :disabled="disabled" style="width: 100%; display: none" @change="selected" />
        </div>
    </div>

</template>

<style scoped></style>