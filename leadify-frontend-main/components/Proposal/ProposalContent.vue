<template lang="pug">
div
  el-dropdown(class="outline-0 w-full" trigger="click")
    .addItem
      Icon(name="IconAddNewItem" size="32")
    template(#dropdown='')
      el-dropdown-menu
        el-dropdown-item.text-xs(@click="selectContent('title')") Title
        el-dropdown-item.text-xs(@click="selectContent('subtitle')") Subtitle
        el-dropdown-item.text-xs(@click="selectContent('description')") Description
        el-dropdown-item.text-xs(@click="selectContent('table')") Table

  //- contenteditable.text-3xl.text-primary(tag="div" :contenteditable="isEditable" v-model="fTitle" :no-nl="true" :no-html="true" )
  //- contenteditable.text-sm.text-muted(tag="div" :contenteditable="isEditable" v-model="sTitle" :no-html="true" )

  //- Input for text-based content (title, subtitle, description)
  el-input(
    v-if="isTextContent"
    v-model="currentInput"
    :type="selectedContent === 'description' ? 'textarea' : 'text'"
    :placeholder="inputPlaceholder"
    @keyup.enter="[addOrUpdateContent() , selectedContent = '']"
  )

  //- Table input
  div(v-if="selectedContent === 'table'")
    el-table(:data="tableData")
      el-table-column(prop="name", label="Item Name")
      el-table-column(prop="quantity", label="Quantity")
      el-table-column(prop="price", label="Price")
    el-button(@click="addRow") Add Row

  //- Button to generate PDF
  //- el-button(@click="generatePDF") Generate PDF

  //- Render the proposal content
  div(v-for="(content, index) in proposal" :key="index")
    h3(v-if="content.type === 'title'" @click="prepareEdit(index, 'title')") {{ content.content }}
    h4(v-if="content.type === 'subtitle'" @click="prepareEdit(index, 'subtitle')") {{ content.content }}
    p(v-if="content.type === 'description'" @click="prepareEdit(index, 'description')") {{ content.content }}
    table(v-if="content.type === 'table'")
      thead
        tr
          th Item Name
          th Quantity
          th Price
      tbody
        tr(v-for="(row, rowIndex) in content.data" :key="rowIndex")
          td {{ row.name }}
          td {{ row.quantity }}
          td {{ row.price }}
</template>

<script setup>
import { ref, computed } from 'vue';
import { jsPDF } from 'jspdf';
import { useRouter } from 'vue-router';
import { useProposalStore } from '~/stores/proposal';
import contenteditable from 'vue-contenteditable'; // Not needed it registered globally
const isEditable = ref(true);
const fTitle = ref('Title');
const sTitle = ref('Subtitle');

const store = useProposalStore();
const router = useRouter();

// State variables
const selectedContent = ref(null); // 'title', 'subtitle', 'description', 'table'
const inputs = {
  title: ref(''),
  subtitle: ref(''),
  description: ref(''),
};
const tableData = ref([{ name: '', quantity: 0, price: 0 }]);
const proposal = ref([]);
const editingIndex = ref(null);

// Computed properties for text-based content
const isTextContent = computed(() => ['title', 'subtitle', 'description'].includes(selectedContent.value));
const currentInput = computed({
  get() {
    return selectedContent.value && inputs[selectedContent.value] ? inputs[selectedContent.value].value : '';
  },
  set(val) {
    if (selectedContent.value && inputs[selectedContent.value]) {
      inputs[selectedContent.value].value = val;
    }
  },
});
const inputPlaceholder = computed(() => {
  if (selectedContent.value === 'title') return 'Enter Title';
  if (selectedContent.value === 'subtitle') return 'Enter Subtitle';
  if (selectedContent.value === 'description') return 'Enter Description';
  return '';
});

// Methods
const selectContent = (contentType) => {
  selectedContent.value = contentType;
  editingIndex.value = null;
};

const addRow = () => {
  tableData.value.push({ name: '', quantity: 0, price: 0 });
};

const addOrUpdateContent = () => {
  if (selectedContent.value === 'table') {
    // Add table content (deep clone tableData)
    proposal.value.push({ type: 'table', data: JSON.parse(JSON.stringify(tableData.value)) });
    tableData.value = [{ name: '', quantity: 0, price: 0 }];
  } else if (isTextContent.value && currentInput.value.trim()) {
    if (editingIndex.value !== null) {
      // Update existing content
      proposal.value[editingIndex.value].content = currentInput.value;
      editingIndex.value = null;
    } else {
      // Add new text content
      proposal.value.push({ type: selectedContent.value, content: currentInput.value });
    }
    inputs[selectedContent.value].value = '';
  }
};

const prepareEdit = (index, type) => {
  selectedContent.value = type;
  editingIndex.value = index;
  if (type !== 'table') {
    inputs[type].value = proposal.value[index].content;
  }
};

const generatePDF = () => {
  const doc = new jsPDF();
  let yOffset = 10;
  const margin = 10;
  const pageHeight = 297;

  proposal.value.forEach((content) => {
    if (content.type === 'title') {
      doc.setFontSize(16);
      doc.text(content.content, margin, yOffset);
      yOffset += 10;
    } else if (content.type === 'subtitle') {
      doc.setFontSize(14);
      doc.text(content.content, margin, yOffset);
      yOffset += 10;
    } else if (content.type === 'description') {
      doc.setFontSize(12);
      doc.text(content.content, margin, yOffset);
      yOffset += 20;
    } else if (content.type === 'table') {
      doc.setFontSize(12);
      // Table header
      doc.text('Item Name', margin, yOffset);
      doc.text('Quantity', margin + 50, yOffset);
      doc.text('Price', margin + 100, yOffset);
      yOffset += 10;
      // Table rows
      content.data.forEach((row) => {
        doc.text(row.name, margin, yOffset);
        doc.text(row.quantity.toString(), margin + 50, yOffset);
        doc.text(row.price.toString(), margin + 100, yOffset);
        yOffset += 10;
      });
      yOffset += 10;
    }
    if (yOffset > pageHeight - margin) {
      doc.addPage();
      yOffset = 10;
    }
  });
  doc.save('proposal.pdf');
};
</script>

<style scoped>
.addItem {
  display: flex;
  width: 100%;
  height: 1px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border: 1px solid #936dff;
  background: #fff;
}
h3,
h4,
p {
  margin-bottom: 10px;
  cursor: pointer;
}

h3 {
  font-size: 24px;
  color: #333;
}

h4 {
  font-size: 20px;
  color: #666;
}

p {
  font-size: 16px;
  color: #999;
}

el-input {
  margin-bottom: 15px;
}

.el-button {
  margin-top: 10px;
}

.el-table {
  width: 100%;
  margin-top: 15px;
}

.el-table-column {
  text-align: left;
}
</style>
