<script setup>
import { useTemplateStore } from '@/stores/TemplateStore'
import { useI18n } from 'vue-i18n'
//import { storeToRefs } from "pinia";

const store = useTemplateStore()
const { t, locale } = useI18n()
//const { templates } = storeToRefs(store);

const newItem = () => {
  const item = store.newItem()
  store.addItem(item)
  store.selItem(item.id)
}

const selItem = (id) => {
  store.selItem(id)
}

const delItem = (id) => {
  const item = store.getItem(id)
  const msg = t('confirmDelete', { id: id })
  if (item) {
    if (confirm(`${msg}`) == true) {
      store.delItem(id)
    }
  }
}
</script>

<template>
  <br />
  <div class="template-list-outer">
    <h3 class="text-capitalize" :lang="locale">{{ $t('template', 2) }}</h3>
    <button
      class="btn btn-sm btn-outline-primary"
      :lang="locale"
      :alt="$t('new')"
      :title="$t('new')"
      @click.stop.prevent="newItem()"
    >
      &plus; {{ $t('new') }}
    </button>
    <br />
    <ul class="list-group overflow-y-scroll p-1 template-list">
      <li
        v-for="item in store.templates"
        :key="item.id"
        @click.stop.prevent="selItem(item.id)"
        :class="`list-group-item list-group-item-action border-0 p-1 ${ item.id == store.selectedID ? 'active' : '' }`"
        :lang="locale"
        :aria-current="item.id == store.selectedID"        
      >
        <span :lang="locale">{{ item.meta?.title }}</span>
        <button
          class="btn btn-sm btn-outline-secondary px-1 py-0 float-end"
          :alt="$t('delete')"
          :title="$t('delete')"
          :lang="locale"
          @click.stop.prevent="delItem(item.id)"
        >
          <span>&Cross;</span>
        </button>
      </li>
    </ul>
    <div :lang="locale">
      ({{ store.count }} {{ store.count == 1 ? $t('item') : $t('item', 2) }})
    </div>
  </div>
</template>

<style scoped>
.template-list-outer {
  border: 1px solid lightgray;
  width: 60%;
  padding: 5px;
  margin: 2px;
}
.template-list {
  border: 1px solid lightgray;
  height: 10em;
}
.template-list li {
  cursor: pointer;
}
.template-list1 li:hover {
  background-color: lightgray;
}
.template-list1 li.selected {
  background-color: lightsteelblue;
}
.delete-item {
  float: right;
}
</style>
