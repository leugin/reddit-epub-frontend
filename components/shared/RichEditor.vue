<script setup lang="ts">
import Quill from 'quill';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import {onMounted} from "vue";
let quill:Quill|null;


const isPristine = ref<boolean>(true)
const setHtml = (html:any)=> {
  quill?.clipboard.dangerouslyPasteHTML(html)
}

const setPristine= (value: boolean) => {
  isPristine.value  = value
}

const getHtml =  ()=> {
  return quill?.getSemanticHTML()
}


defineExpose({
  setHtml,
  getHtml,
  setPristine,
  isPristine
})



onMounted(async ()=> {
  quill = new Quill('#editor', {
    placeholder: 'Compose an epic...',
    theme: 'snow',
  });
  quill.on('text-change', (delta, oldDelta, source) => {
    if (source === 'user'){
      isPristine.value = false
     }

  })
});
const alert = (aler = 'asfaef')=> {
  console.log(aler)
}
onUnmounted(()=> {
})



</script>

<template>
  <div>
    <div ref="editor" id="editor" ></div>
  </div>

</template>

<style scoped>

</style>
