<script setup>
import { ref } from "vue"
import { useNotificationStore } from "@/stores/NotificationStore"
const store = useNotificationStore()

const msg = ref("")
const add = () => {
    let message = msg.value.trim() 
    if(message !== "")
        store.add(message)
    msg.value = ""
}

</script>

<template>
    <input 
        type="text" 
        class="form-control" 
        placeholder="message"
        id="messageInput"
        v-model="msg"><button @click="add">Add</button>
    <ul class="notifications">
        <li v-for="item in store.items" :key="item.timestamp">
            <em>{{ item.timestamp }}</em>&nbsp;&nbsp;            
            <span>{{ item.message }}</span>
        </li>
    </ul>
</template>

<style scoped>
    ul.notifications {
        list-style-type: none;
    }
</style>