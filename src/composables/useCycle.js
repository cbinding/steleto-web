
/*
=============================================================================
Module    : useCycle.js
Project   : 
Creator   : Ceri Binding, University of South Wales / Prifysgol de Cymru
Contact   : ceri.binding@southwales.ac.uk
Summary   : circular list for 2..n state toggle (usage see CycleButton.vue)
Imports   : ref, computed
Example   : 
  const { state, prev, next } = useCycle(['CE', 'BCE', 'BP'])
  next(); console.log(state); // 'BCE'
  prev(); console.log(state); // 'CE'
  prev(); console.log(state); // 'BP'  
License   : TODO
=============================================================================
History
09/09/2024 CFB Initially created script
=============================================================================
*/
import { ref, computed } from "vue"

export const useCycle = (list = [], defaultIndex = 0) => {
  // init currentIndex if it exists, else 0
  const currentIndex = ref(defaultIndex < 0 ? 0 : (list.length + defaultIndex) % list.length)
  // the currently indexed item in the list
  const currentValue = computed(() => list[currentIndex.value])

  // increment index if list not empty. If index already at end, go to start
  const next = () => 
    currentIndex.value = list.length > 0 ? (list.length + currentIndex.value + 1) % list.length : 0
    
  // decrement index if list not empty.If index already at start, go to end
  const prev = () =>
    (currentIndex.value =
      list.length > 0 ? (list.length + currentIndex.value - 1) % list.length : 0)

  // TODO: implement reset() ?
  return { prev, next, currentValue }
}