<template lang="pug">
    .containerr.overflow-x-auto(class="mt-4")
      el-table(:data='finalData || []' border v-loading="isLoading" ref="tableRef" style='width:100%; border-radius: 0 !important; ' :row-style="{cursor:'pointer'}" :header-cell-style="{width:'100px',background:'#f8f7fa', color:'#5f5a6a'}")
        el-table-column(class-name="wrap-text" :min-width="column?.width" :show-overflow-tooltip="true" v-for="column in columns" :prop="column.prop" :label="column.label"  :column-key="column.prop")
          template(#header)
            .flex.items-center.gap-2
              span {{ column?.label }}
              .flex.items-center.gap-2(v-if="column?.isClearable" id="header-action")
                .cursor-pointer(title="Delete column" @click="$emit('deleteColumn' , column?.prop)"): Icon(name="IconDelete" size="16")
                .cursor-pointer(title="Edit column" @click="$emit('editColumn' , column)"): Icon(name="IconEdit" size="16")
          template(#default="scope")
            .flex.gap-2.items-center
              div(v-if="column?.component==='Text'" )
                TableText(:value="scope.row[column?.prop]" :type="column?.type" )
    
        el-table-column(label="Action" id="action" min-width="150")
          template(#default="scope")
            slot(:data="scope.row"  )
        template(#empty style="text-align: center; padding: 20px;")
          el-empty(description="No matching records found" image="/images/empty.png")
    
    </template>
    
    <script setup lang="ts">
    const route = useRoute();
    const router = useRouter();
    const tableRef = ref(null);
    const props = defineProps({
      columns: {
        type: Array,
        required: true,
      },
      data: {
        type: Array,
        required: true,
      },
    });
    
    const finalData = ref<any>([]);
    finalData.value = props.data || [];
    </script>
    