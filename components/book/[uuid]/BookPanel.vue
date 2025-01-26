<script setup lang="ts">
import type { SortableOptions } from "sortablejs";

import {Sortable} from "sortablejs-vue3";

const props = defineProps({
  content:{
    type:Array as () => any[],
    required:true,
    default: []
  },
  selectedItem:{
    type:Object as () => any | null,
    required:false,
    default:null
  }
})

const mode = ref('')
const emit = defineEmits([
    'selectPage',
'deletePage',
    'selectedCover'
])

const options = computed<SortableOptions>(() => {
  return {
    draggable: ".draggable",
    animation: 150,
    ghostClass: "ghost",
    dragClass: "drag",
    group: "testgroup",
    scroll: true,
    forceFallback: true,
    bubbleScroll: true,
  };
});
const moveItemInArray = async (array: any[], from: number, to: number) => {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item)

};

const onEnd = (event: any) => {
  if (props.content){
    moveItemInArray(props.content, event.oldIndex, event.newIndex)
  }
}


</script>

<template>
  <div class="book-navigation flex flex-col flex-1" style="max-height: 100vh">
    <Sortable
        :list="content"
        item-key="id"
        tag="div"
        @end="onEnd"
        :options="options"
    >
      <template #header>
        <header>
          <u-button :variant="mode == 'cover' ? 'solid':'ghost'"
                    class="flex-1 m-auto w-full"
                    :ui="{
                     rounded:'rounded-none'
                   }" @click="emit('selectedCover')"> Cover </u-button>
        </header>
      </template>
      <template #item="{element}">
        <div class="draggable flex" :key="element.id">
          <UButton
              :variant="'ghost'"
              :color="'red'"
              @click="emit('deletePage', element.id)"
              :ui="{
                                       rounded:'rounded-none'
                                     }">
            X
          </UButton>
          <UButton
              :key="element.id" @click="emit('selectPage', element)"
              :id="'btn-page-'+element.id"
              :variant="element.id == selectedItem?.id ? 'solid':'ghost'"
              class="flex-1 list-button w-full"
              :ui="{
                                       rounded:'rounded-none'
                                     }"

          >
            {{element.title}}
          </UButton>
        </div>
      </template>
    </Sortable>

  </div>

</template>

<style scoped>
.list-button{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
