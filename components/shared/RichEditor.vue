<script setup lang="ts">
import Quill from 'quill';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import {onMounted} from "vue";
let quill:Quill|null;


const model = defineModel()
 const setHtml = (html:any)=> {
  quill?.clipboard.dangerouslyPasteHTML(html)
}

defineExpose({
  setHtml
})



onMounted(async ()=> {
  quill = new Quill('#editor', {
    placeholder: 'Compose an epic...',
    theme: 'snow'
  });
  quill.on('text-change', (delta, oldDelta, source) => {
    if (source === 'user'){
      model.value = quill?.getSemanticHTML()
     }

  })
});
onUnmounted(()=> {
})



</script>

<template>
  <div ref="editor" id="editor"></div>
</template>

<style scoped>

</style>
