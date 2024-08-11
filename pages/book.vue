<script setup lang="ts">
const links = [{
  label: '.github',
}, {
  label: '.editorconfig',
}, {
  label: '.package.json',
}]
</script>

<template>
  <div>
   <div class="flex" id="head">
     <div class="w-48	">
       <div class="px-3 pt-2.5">
         <u-button>Portada</u-button>
       </div>
     </div>
     <div class=" flex flex-1">
       <div class="w-full text-sm">
         <p ><span class="font-semibold">Title: </span><span>Titulo abierto</span></p>
         <p ><span class="font-semibold">Author: </span><span>Alias</span></p>
       </div>
     </div>
     <div class="w-48	">
       <div class="px-3 pt-2.5">
         <u-button>Login</u-button>
       </div>
     </div>

   </div>
    <div class="flex" id="body">
      <div class="w-48	">
        <u-vertical-navigation :links="links"></u-vertical-navigation>
      </div>
      <div class=" flex flex-1 bg-white">
        <div class="w-full text-sm" style="height: calc(100vh - 52px)">
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>

</style>
