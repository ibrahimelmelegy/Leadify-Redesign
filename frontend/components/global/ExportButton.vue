<template lang="pug">
el-dropdown(@command="handleExport")
  el-button(:type="type" :size="size")
    el-icon
      Download
    span(v-if="showLabel") Export
  template(#dropdown)
    el-dropdown-menu
      el-dropdown-item(command="csv")
        el-icon
          Document
        span Export to CSV
      el-dropdown-item(command="excel")
        el-icon
          Grid
        span Export to Excel
      el-dropdown-item(v-if="allowPdf" command="pdf")
        el-icon
          Printer
        span Export to PDF
</template>

<script setup lang="ts">
import { Download, Document, Grid, Printer } from '@element-plus/icons-vue';
import { useExport } from '~/composables/useExport';
import { ElMessage } from 'element-plus';

const props = withDefaults(defineProps<{
  data: any[];
  filename: string;
  columns?: { key: string; label: string }[];
  pdfElementId?: string;
  allowPdf?: boolean;
  type?: string;
  size?: string;
  showLabel?: boolean;
}>(), {
  allowPdf: false,
  type: 'default',
  size: 'default',
  showLabel: true
});

const emit = defineEmits(['exported']);

const { exportToCSV, exportToExcel, exportToPDF } = useExport();

async function handleExport(command: string) {
  try {
    if (!props.data || !props.data.length) {
      ElMessage.warning('No data to export');
      return;
    }

    switch (command) {
      case 'csv':
        await exportToCSV(props.data, props.filename, props.columns);
        break;
      case 'excel':
        await exportToExcel(props.data, props.filename, props.columns);
        break;
      case 'pdf':
        if (props.pdfElementId) {
          await exportToPDF(props.pdfElementId, props.filename);
        }
        break;
    }

    ElMessage.success(`Exported successfully`);
    emit('exported', command);
  } catch (error: any) {
    ElMessage.error(error.message || 'Export failed');
  }
}
</script>
