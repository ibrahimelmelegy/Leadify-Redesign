<template lang="pug">
el-form.mt-6(
  autocomplete="off",
  @submit.prevent="onSubmit",
  ref="myForm",
  label-position="top",
  :validationSchema="formSchema"
)
  .card.m-auto.bg-white.p-10.mb-32.rounded-3xl(class="w-[90%]", ref="contentToExtract")
    .flex.justify-between.items-center.gap-2
      .title.font-bold.text-xl.capitalize.mb-8 Finance Table
    .flex.items-center.justify-center.flex-col.w-full 
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      |
      .flex-1.p-4.rounded-3xl.mt-4(
        style="box-shadow: 0px 4px 48px 0px #0000000a; margin-bottom: -10px; z-index: 2; background-color: white"
      )
        button.mx-2(
          class="!rounded-2xl",
          @click="[(addColumnPopup = true), (selectedColumnData = {}), (formType = 'column')]"
        )
          img(src="/assets/icon/add-column.svg")
        button.mx-2(class="!rounded-2xl", @click="deleteColumn(0)")
          img(src="/assets/icon/remove-column.svg")
        button.mx-2(class="!rounded-2xl")
          img(
            src="/assets/icon/add-row.svg",
            @click="[(addRowPopup = true), (selectedRowData = {}), (formType = 'row')]"
          ) 
        button.mx-2(class="!rounded-2xl", @click="deleteRow(0)")
          img(src="/assets/icon/remove-row.svg")
        button.mx-2(class="!rounded-2xl", @click="ClearData", :disabled="idEdit")
          img(src="/assets/icon/trash.svg")
      .flex.justify-center.items-center.h-64(
        v-if="isLoading || isLoadingTable"
      )
        .animate-spin.rounded-full.h-12.w-12.border-4.border-primary-purple-400.border-t-transparent
      .flex.justify-center.items-center.w-full(v-else)
        ProposalAppFinanceTable(
          v-slot="{ data }",
          without-filters,
          without-search,
          without-pagination,
          :columns="table.columns",
          :data="table.data",
          class="!py-0",
          @deleteColumn="deleteColumn",
          @editColumn="editColumn"
        )
          .flex.items-center.py-2(@click.stop)
            el-button(
              class="!rounded-2xl",
              type="danger",
              link,
              @click="deleteRow(data.id)"
            ): Icon(
              name="IconDelete",
              size="20"
            )
            el-button(
              class="!rounded-2xl",
              type="primary",
              link,
              @click="editRow(data)"
            ): Icon(
              name="IconEdit",
              size="20"
            )

    .flex.items-center.flex-row.gap-3
      .flex-1.bg-neutral-50.p-4.rounded-3xl.mt-4
        el-checkbox(label="Have Discount ?", v-model="haveDiscount")
        InputText(
          placeholder="Enter Discount SAR",
          name="discount",
          :value="proposal?.financeTable?.discount",
          v-if="haveDiscount && !isLoading"
        )
      .flex-1.bg-neutral-50.p-4.rounded-3xl.mt-4
        el-checkbox(label="Have Margin ?", v-model="haveMargin")
        InputText(
          placeholder="Enter Margin",
          name="margin",
          :value="proposal?.financeTable?.marginPercentage",
          v-if="haveMargin && !isLoading"
        )
    #summary.flex.justify-end.mt-12.mb-12
      .mx-4
        p.text-lg.font-semibold.text-neutral-900.mb-3 Margin
        .flex.justify-between.items-center.gap-12.mb-4.border-b.pb-4
          p.text-base.text-neutral-400 Margin ({{ Number(values.margin) || 0 }}%) :
          p.text-base.text-neutral-900 {{ projectMargin?.toLocaleString("en-US") }} SAR
      div
        p.text-lg.font-semibold.text-neutral-900.mb-3 Summary
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 GrandTotal :
          p.text-base.text-neutral-900 {{ Number((totalPrice || 0)?.toFixed(2))?.toLocaleString("en-US") }} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 Vat (15%) :
          p.text-base.text-neutral-900 {{ Number(Number(totalPrice - (values.discount || 0)) * 0.15 || 0) ?.toFixed(2) ?.toLocaleString("en-US") }} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 Discount :
          p.text-base.text-neutral-900 {{ Number(values.discount) || 0 }} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-900 Total Price :
          p.text-base.text-neutral-900 {{ Number(((totalPrice || 0) + Number(Number(totalPrice - values.discount) * 0.15 || 0) - (Number(values.discount) || 0))?.toFixed(2))?.toLocaleString("en-US") }} SAR

  .endBar
    .flex.justify-between.w-full
      el-button(
        size="large",
        plain,
        type="primary",
        class="!rounded-2xl",
        @click="router.back()"
      ) Cancel
      .flex.items-center.gap-x-2
        el-button(
          type="primary",
          size="large",
          link,
          :loading="loading",
          :disabled="idEdit",
          class="!px-5 !rounded-2xl",
          @click="ClearData"
        ) Clear
        el-button(
          size="large",
          type="primary",
          native-type="submit",
          :loading="loading",
          :disabled="loading || errors?.discount",
          class="!px-5 !rounded-2xl",
          @click="onSubmit"
        ) Next

//- Add column popup
el-dialog(
  v-model="addColumnPopup",
  width="500",
  :show-close="false",
  align-center=""
)
  template(#header="{ close, titleId, titleClass }")
    .my-header.flex.items-center.justify-between
      h4(:id="titleId", :class="titleClass") {{ selectedColumnData && Object.keys(selectedColumnData).length ? "Edit column" : "Add column" }}
      .cursor-pointer(@click="close", title="Close"): Icon(
        name="IconFilterClose",
        size="32"
      )

  el-form.border-t.pt-4(
    autocomplete="off",
    @submit.prevent="onSubmitColumn",
    label-position="top",
    :validationSchema="formSchema"
  )
    InputText(
      label="Column name",
      name="columnName",
      :value="selectedColumnData ? selectedColumnData.label : ''"
    )
    InputSelect(label="Column Order", name="index", :options="table?.columns")
    el-form-item.mt-8(class="!mb-0")
      .flex.w-full
        el-button(class="!rounded-2xl", @click="addColumnPopup = false", size="large") Cancel
        el-button(
          size="large",
          type="primary",
          native-type="submit",
          :loading="loading",
          class="!px-5 !rounded-2xl"
        ) {{ selectedColumnData && Object.keys(selectedColumnData).length ? "Update" : "Create" }}

//- Add/Edit row popup
el-dialog(
  v-model="addRowPopup",
  width="800",
  :show-close="false",
  align-center=""
)
  template(#header="{ close, titleId, titleClass }")
    .my-header.flex.items-center.justify-between
      h4(:id="titleId", :class="titleClass") {{ selectedRowData && Object.keys(selectedRowData).length ? "Edit row" : "Add row" }}
      .cursor-pointer(@click="close", title="Close"): Icon(
        name="IconFilterClose",
        size="32"
      )

  el-form.border-t.pt-4(
    autocomplete="off",
    @submit.prevent="onSubmitRow",
    label-position="top",
    :validationSchema="formSchema"
  )
    .grid.grid-cols-1(class="md:grid-cols-2 gap-[16px]")
      InputSelect.flex-1(
        v-if="proposal?.relatedEntityType == 'Project'",
        label="description",
        placeholder="Material",
        name="materialId",
        :options="materialOptions",
        :value="materialId",
        :key="materialId",
        @change="toggleMaterialSelection"
      )
      div(
        v-for="col in proposal?.relatedEntityType == 'Project' ? table.columns.filter((el) => el.prop !== 'description' && el.prop !== 'rowNumber') : table.columns.filter((el) => el.prop !== 'rowNumber')",
        :key="col.prop"
      )
        InputText(
          :label="col.label",
          :name="col.prop",
          :value="selectedRowData ? selectedRowData[col.prop] : ''",
          :disabled="col.prop === 'totalPrice' || (col.prop === 'unitPrice' && proposal?.relatedEntityType == 'Project')"
        )

    el-form-item.mt-8(class="!mb-0")
      .flex.justify-end
        el-button(class="w-1/2 !rounded-2xl", @click="onCancelRow", size="large") Cancel
        el-button(
          size="large",
          type="primary",
          native-type="submit",
          :loading="loading",
          class="!px-5 !rounded-2xl"
        ) {{ selectedRowData && Object.keys(selectedRowData).length ? "Update" : "Create" }}
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, defineModel } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { Plus } from "@element-plus/icons-vue";
import { ref, reactive, computed } from "vue";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const isLoadingTable = ref(false);
const deleteApply = ref(false);

const props = defineProps({
  loading: Boolean,
  label: String,
  data: {
    type: Object,
    required: false,
  },
  editMode: {
    type: Boolean,
    required: false,
  },
});
const activeStep: any = defineModel();
const emit = defineEmits(["submit"]);
const addColumnPopup = ref<boolean>(false);
const addRowPopup = ref<boolean>(false);
const formType = ref<"column" | "row">("column");
const selectedRowData = ref<any>(null);
// Summary refs
const haveDiscount = ref(false);
const discount = ref(false);
const haveMargin = ref(false);
const contentToExtract = ref<any>(null);

const additionalMateriaOptions = ref<
  { label: string; value: string; materialItem: any[] }[]
>([]);
const additionalMaterialId = ref<AdditionalMaterial>();
const materialId = ref<any>();
const materialOptions = ref<
  { label: string; value: string; unitPrice: number; quantity: number }[]
>([]);
const materialSelect = ref<any>();
const idEdit = ref<any>();

// TODO: use this function with on submit function and store the finance table to use it in content
function sendHtmlToCms() {
  // Select elements with the id 'table'
  const tables = contentToExtract.value.querySelectorAll(["#table", "#summary"]);

  let htmlString = "";

  tables.forEach((table) => {
    // console.log('>>>>>>>>>>>>>>>.....table', table);
    // Clone the table element to manipulate it without affecting the original DOM
    const clonedTable = table.cloneNode(true);

    // Remove all elements with id 'action' , 'header-action' in the cloned table
    const actionElements = clonedTable.querySelectorAll("#header-action", "#action");
    actionElements.forEach((el) => el.remove());

    // Also remove any buttons that might contain delete/edit actions
    // This targets the specific buttons in your template
    const actionButtons = clonedTable.querySelectorAll(
      '.el-button[type="danger"], .el-button[type="primary"]'
    );
    actionButtons.forEach((btn) => btn.remove());

    // Add the outerHTML of the cloned table (without action elements)
    htmlString += clonedTable.outerHTML;
  });
  console.log(">>>>>>>>> htmlString", htmlString);
  return htmlString;
}

function toggleMaterialSelection(val?: any) {
  materialId.value = val.value;
  materialSelect.value = val;
}

const table = reactive({
  columns: [
    {
      prop: "rowNumber",
      label: "#",
      value: 0,
      component: "Text",
      type: "font-default",
      width: 50,
    },
    {
      prop: "description",
      label: "Description",
      value: 1,
      component: "Text",
      type: "font-default",
      width: 240,
    },
    {
      prop: "quantity",
      label: "Quantity",
      component: "Text",
      value: 2,
      type: "font-default",
      width: 120,
    },
    {
      prop: "unitPrice",
      label: "Unit price",
      component: "Text",
      value: 3,
      type: "font-default",
      width: 120,
    },
    {
      prop: "totalPrice",
      label: "Total Price",
      component: "Text",
      value: 4,
      type: "font-default",
      width: 120,
    },
  ],
  data: [] as any[],
});
const proposal = ref();
proposal.value = await getProposal(route.params.slug);
const formSchema = computed(() => {
  const shape: Record<string, any> = {};
  shape.columnName = yup.string().when([], {
    is: () => formType.value === "column",
    then: () => {
      // yup.string().min(2).max(50).required().label('Column name');
      const baseValidation = yup.string().max(500).label("Column name");
      return !addColumnPopup.value ? baseValidation : baseValidation.min(2).required();
    },
  });

  table.columns.forEach((col: any) => {
    shape[`${col.prop}`] = yup.string().when([], {
      is: () => formType.value === "row",
      then: () => {
        const baseValidation = yup.string().max(500).label(`${col.label}`);
        return baseValidation;
      },
    });
  });

  // // Margin and discount validation
  shape.discount = yup.string().when([], {
    is: () => haveDiscount.value,
    then: () =>
      yup
        .string()
        // .test("is-valid-number", "Please enter a valid number.", (value: any) => {
        //   return /^\d+$/.test(value || "");
        // })
        .test(
          "is-valid-discount",
          "Value must be less than or equal to grand total.",
          (value: any) => {
            return value<= (totalPrice.value || 0);
          }
        )
        .max(999999999.99)
        .label("Discount"),
  });
  // shape.margin = yup.string().when([], {
  //   is: () => haveMargin.value,
  //   then: () =>
  //     yup
  //       .string()
  //       .test(
  //         "is-valid-number",
  //         "Please enter a valid number.",
  //         (value: any) => {
  //           return /^\d+$/.test(value || "");
  //         }
  //       )
  //       .max(9999)
  //       .label("Margin"),
  // });
  return yup.object().shape(shape);
});

const { handleSubmit, resetForm, setValues, setFieldValue, values, errors } = useForm({
  validationSchema: formSchema,
});

const getTable = async (loadingTable?: boolean) => {
  try {
    if (loadingTable) {
      isLoadingTable.value = true;
    } else {
      isLoading.value = true;
    }
    const tableData = await getProposalFinanceTableByPropsalId(route.params.slug);
    if (tableData?.docs?.length > 0) {
      idEdit.value = tableData?.docs?.[0]?.id;
      const tableItem = await getProposalFinanceTableItemByTablelId(
        tableData?.docs?.[0]?.id
      );
      const customColumnKeys = new Set();
      tableItem?.docs?.forEach(
        (item: { customColumns?: { key?: string; index?: number }[] }) => {
          item?.customColumns?.forEach((col: { key?: string; index?: number }) => {
            if (col?.key && !table.columns.some((c) => c.prop === col.key)) {
              customColumnKeys.add({ key: col.key, index: col.index });
            }
          });
        }
      );

      if (customColumnKeys?.size > 0) {
        customColumnKeys?.forEach((el: any) =>
          table.columns.push({
            prop: el.key,
            label: el.key,
            component: "Text",
            type: "font-default",
            width: 120,
            value: el.index,
          })
        );
        table.columns = table.columns?.sort((a, b) => a.value - b.value);
      }
      const discount = (await isLoadingTable.value)
        ? Number(values.discount || 0)
        : Number(tableData?.docs?.[0]?.discount || 0);
      const margin = (await isLoadingTable.value)
        ? Number(values.margin || 0)
        : Number(tableData?.docs?.[0]?.marginPercentage || 0);
      table.data = tableItem?.docs.map((el: any, index: number) => {
        const obj = el?.customColumns.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        return {
          id: el?.id,
          rowNumber: index + 1,
          description: el?.description,
          quantity: el?.qty,
          totalPrice: isLoadingTable.value
            ? el?.qty *
              (el?.unitPrice -
                el?.marginAmount +
                ((el?.unitPrice - el?.marginAmount) * margin) / 100)
            : el?.qty * el?.unitPrice,
          unitPrice: isLoadingTable.value
            ? el?.unitPrice -
              el?.marginAmount +
              ((el?.unitPrice - el?.marginAmount) * margin) / 100
            : el?.unitPrice,
          marginAmount: isLoadingTable.value
            ? ((el?.unitPrice - el?.marginAmount) * margin) / 100
            : el?.marginAmount,
          discount: discount,
          margin: margin,
          materialId: el?.materialId,
          ...obj,
        };
      });
      if (!isLoadingTable.value) {
        haveDiscount.value = discount > 0 ? true : false;
        haveMargin.value = margin > 0 ? true : false;
      }
      discount.value = discount
      setFieldValue("discount", discount == 0 ? undefined : discount);
      setFieldValue("margin", margin == 0 ? undefined : margin);
      console.log(table);
    } else {
      idEdit.value = null;
    }
    console.log(errors);
  } catch (err) {
  } finally {
    if (loadingTable) {
      isLoadingTable.value = false;
    } else {
      isLoading.value = false;
    }
  }
};

onMounted(() => {
  getTable();
});

const ClearData = async () => {
  isLoading.value = true;
  contentToExtract.value = await null;
  haveDiscount.value = await false;
  haveMargin.value = await false;
  table.data = await [];
  table.columns = [
    {
      prop: "rowNumber",
      label: "#",
      component: "Text",
      type: "font-default",
      width: 60,
    },
    {
      prop: "description",
      label: "Description",
      component: "Text",
      type: "font-default",
      width: 240,
    },
    {
      prop: "quantity",
      label: "Quantity",
      component: "Text",
      type: "font-default",
      width: 120,
    },
    {
      prop: "unitPrice",
      label: "Unit price",
      component: "Text",
      type: "font-default",
      width: 120,
    },
    {
      prop: "totalPrice",
      label: "Total Price",
      component: "Text",
      type: "font-default",
      width: 120,
    },
  ];
  isLoading.value = false;
};

function insertItemAndReorder(array: any[], newItem: any, afterIndex: number) {
  // Insert the new item after the specified index
  array.splice(afterIndex + 1, 0, newItem);

  // Update indexes
  return array.map((item, index) => ({ ...item, index }));
}

// Handle column creation
const onSubmitColumn = handleSubmit(async (values: { columnName?: string }) => {
  if (selectedColumnData.value) {
    const index = table.columns.findIndex(
      (row: any) => row.label === selectedColumnData.value.label
    );

    if (index !== -1) {
      table.columns = [
        ...table.columns.slice(0, index),
        ...table.columns.slice(index + 1),
      ];
    }
  }

  if (values.columnName) {
    const existingColumn = table.columns.some((col) => col.label === values.columnName);
    if (existingColumn) {
      alert("Column with this name already exists.");
      return;
    }
    let newItem = {
      prop: values.columnName.toLowerCase().replace(" ", "_"),
      label: values.columnName,
      component: "Text",
      type: "font-default",
      width: 120,
      value: values.index,
      isClearable: true,
    };

    // Insert new item after index 1 (after "Item B")
    table.columns = insertItemAndReorder(table.columns, newItem, values.index);

    addColumnPopup.value = false;
  }
  resetForm();
  additionalMaterialId.value = undefined;
  materialId.value = undefined;

  materialOptions.value = [];
});

// Handle row add/edit
const onSubmitRow = handleSubmit(async (values: any) => {
  if (idEdit.value) {
    try {
      isLoading.value = true;
      const dataSend = await {
        financeTableId: idEdit.value,
        materialId: selectedRowData?.value?.materialId
          ? selectedRowData?.value?.materialId
          : materialId.value,
        qty: Number(values?.quantity),
        customColumns: Array.from(
          new Map(table.columns.map((item) => [item.prop, item])).values()
        )
          ?.filter(
            (item: any) =>
              item.prop !== "rowNumber" &&
              item.prop !== "description" &&
              item.prop !== "quantity" &&
              item.prop !== "unitPrice" &&
              item.prop !== "totalPrice"
          )
          ?.map((col: any) => {
            return values?.[col.prop] == null
              ? undefined
              : values?.[col.prop] !== ""
              ? {
                  key: col.prop,
                  value: values?.[col.prop],
                  index: col?.value || 0,
                }
              : undefined;
          }),
      };
      dataSend.customColumns = dataSend.customColumns?.filter(
        (item: any) => item !== undefined
      );
      if (!dataSend?.materialId) {
        const response = await createMaterial({
          description: values.description,
          quantity: Number(values.quantity),
          unitPrice: Number(values.unitPrice),
        });
        dataSend.materialId = response.id;
      }

      selectedRowData?.value?.id
        ? await updateProposalFinanceTableitem(
            dataSend,
            selectedRowData?.value?.id,
            "one"
          )
        : await createProposalFinanceTableitem(dataSend, "one");
    } finally {
      await getTable();
      isLoading.value = false;
    }
  } else {
    // If selectedRowData exists, we're editing
    if (selectedRowData.value && selectedRowData.value.id) {
      const index = table.data.findIndex(
        (row: any) => row.rowNumber === selectedRowData.value.rowNumber
      );
      if (index !== -1) {
        isLoadingTable.value = true;

        table.data[index] = await { ...table.data[index], ...values };
        console.log(table.data);
      }
      selectedRowData.value = null;
    } else {
      isLoadingTable.value = true;
      const newRow = {} as any;
      const unitPrice =
        (await Number(values?.unitPrice)) +
        (Number(values.unitPrice) * Number(values?.margin || 0)) / 100;
      table.columns.forEach(async (col) => {
        if (col.prop == "unitPrice") {
          newRow[col.prop] = await unitPrice;
        } else if (col.prop == "totalPrice") {
          newRow[col.prop] = (await unitPrice) * Number(values.quantity);
        } else {
          newRow[col.prop] = values[col.prop] || "";
        }
        newRow.marginAmount = (values?.unitPrice * Number(values?.margin || 0)) / 100;
        newRow.discount = Number(values?.discount || 0);
        newRow.margin = Number(values?.margin || 0);
      });
      newRow.id = Math.floor(Math.random() * 1000 + 1);
      newRow.materialId = materialId.value;
      newRow.additionalMaterialId = additionalMaterialId.value;
      newRow.rowNumber = table.data.length + 1;
      await table.data.push(newRow);
    }
  }
  addRowPopup.value = false;
  isLoadingTable.value = false;
  resetForm();
  additionalMaterialId.value = undefined;
  materialId.value = undefined;
  materialOptions.value = [];
});

// Handle cal total price
watch(
  () => [values.quantity, values.unitPrice],
  () => {
    if (values.quantity && values.unitPrice) {
      setFieldValue("totalPrice", Number(values.quantity) * Number(values.unitPrice));
    } else {
      setFieldValue("totalPrice", "");
    }
  },
  { deep: true }
);

// Handle cal total price
watch(
  () => [values.margin],
  () => {
    if (idEdit.value) getTable(true);
    else {
      addRowPopup;
      let newData: any[] = [];
      table.data?.forEach(async (row, index) => {
        const unitPrice =
          (await Number(row.unitPrice)) -
          Number(row.marginAmount) +
          ((Number(row?.unitPrice) - Number(row.marginAmount)) *
            Number(values?.margin || 0)) /
            100;
        const marginAmount =
          ((await (Number(row.unitPrice) - Number(row.marginAmount))) *
            Number(values?.margin || 0)) /
          100;
        await table.columns.forEach(async (col) => {
          if (col.prop == "unitPrice") {
            row.unitPrice = unitPrice;
          } else if (col.prop == "totalPrice") {
            row[col.prop] = unitPrice * Number(row.quantity);
          } else {
            row[col.prop] = row[col.prop] || "";
          }
          row.marginAmount = marginAmount;
          row.discount = Number(values?.discount || 0);
          row.margin = Number(values?.margin || 0);
        });
        row.id = Math.floor(Math.random() * 1000 + 1);
        row.materialId = materialId.value;
        row.additionalMaterialId = additionalMaterialId.value;
        row.rowNumber = table.data.length + 1;
        table.data[index] = row;
        newData.push(row);
      });
      table.data = [...newData];
      isLoadingTable.value = false;
    }
  },
  { deep: true }
);

watch(
  () => addRowPopup.value,
  async () => {
    if (
      addRowPopup.value &&
      proposal?.value?.relatedEntityType == "Project" &&
      proposal?.value?.relatedEntityId
    ) {
      const response = await getProject(proposal?.value?.relatedEntityId);
      materialOptions.value = response.materials?.map((e: any) => ({
        label: e.description,
        value: e.id,
        unitPrice: e?.unitPrice,
        quantity: e?.quantity,
      }));
    }
  }
);
// Handle cal total price
watch(
  () => [materialId],
  () => {
    if (materialId.value) {
      setFieldValue("unitPrice", Number(materialSelect.value.unitPrice));
      setFieldValue("description", materialSelect.value.label);
      setFieldValue("quantity", materialSelect.value.quantity);
    } else {
      setFieldValue("description", "");
      setFieldValue("unitPrice", "");
      setFieldValue("quantity", "");
    }
  },
  { deep: true }
);

// Cancel row add/edit
const onCancelRow = () => {
  addRowPopup.value = false;

  selectedRowData.value = null;
  resetForm();
  additionalMaterialId.value = undefined;
  materialId.value = undefined;
  materialOptions.value = [];
};

// Delete Row And Column
const deleteRow = async (id?: number) => {
  deleteApply.value = true;
  if (idEdit.value) {
    try {
      isLoading.value = true;
      if (id !== 0) {
        await deleteProposalFinanceTableItem(id);
      } else {
        await deleteProposalFinanceTableItem(table?.data?.[table.data.length - 1]?.id);
      }
    } finally {
      await getTable();
      isLoading.value = false;
    }
  } else {
    if (id !== 0) {
      const index = table.data.findIndex((row: any) => row.id === id);
      if (index !== -1) {
        table.data.splice(index, 1);
      }
    } else {
      if (table.data.length > 0) {
        table.data.pop();
      }
    }
  }
  deleteApply.value = false;
};

const deleteColumn = async (prop?: any) => {
  deleteApply.value = true;
  if (idEdit.value) {
    if (prop !== 0) {
      const index = table.columns.findIndex((col: any) => col.prop === prop);
      if (index !== -1) {
        table.columns.splice(index, 1);
      }
    } else {
      if (table.columns.length > 0) {
        table.columns.pop();
      }
    }
    try {
      isLoading.value = true;
      if (prop == 0) {
        await deleteCustomColumn(
          idEdit.value,
          table.columns?.[table.columns.length - 1].prop
        );
      } else {
        await deleteCustomColumn(idEdit.value, prop);
      }
    } finally {
      await getTable();
      isLoading.value = false;
    }
  } else {
    if (prop !== 0) {
      const index = table.columns.findIndex((col: any) => col.prop === prop);
      if (index !== -1) {
        table.columns.splice(index, 1);
      }
    } else {
      if (table.columns.length > 0) {
        table.columns.pop();
      }
    }
  }
  deleteApply.value = false;
};

// Edit Row And Column
const editRow = (row: any) => {
  const unitPrice = Number(row?.unitPrice) - row.marginAmount;
  selectedRowData.value = {
    ...row,
    unitPrice: unitPrice,
    totalPrice: unitPrice * Number(row.quantity),
  };
  addRowPopup.value = true;
  setValues(selectedRowData.value);
};
const selectedColumnData = ref();
const editColumn = (col: any) => {
  selectedColumnData.value = col;
  addColumnPopup.value = true;
  setValues({ columnName: col.label });
};

const onSubmit = handleSubmit(async (values: any) => {
  if (
    addColumnPopup.value == false &&
    addRowPopup.value == false &&
    deleteApply.value == false
  ) {
    const items = await Promise.all(
      table?.data?.map(async (el: any) => {
        let materialId = el?.materialId;

        if (!materialId) {
          const response = await createMaterial({
            description: el.description,
            quantity: Number(el.quantity),
            unitPrice: Number(el.unitPrice - el.marginAmount),
          });
          materialId = response.id;
        }

        const customColumns = table?.columns
          ?.filter(
            (item: any) =>
              item.prop !== "description" &&
              item.prop !== "quantity" &&
              item.prop !== "unitPrice" &&
              item.prop !== "totalPrice"
          )
          ?.map((col: any) => {
            return el?.[col.label]
              ? { key: col.label, value: el?.[col.label], index: col.value }
              : undefined;
          })
          ?.filter(Boolean); // removes undefined values

        return {
          materialId,
          qty: Number(el?.quantity),
          customColumns,
        };
      }) || []
    );

    const dataSend = {
      proposalId: route.params.slug,
      discount: values?.discount ? Number(values.discount) : 0,
      marginPercentage: values?.margin ? Number(values.margin) : 0,
      items,
    };

    if (idEdit.value) {
      await updateProposalFinanceTable(
        {
          discount: dataSend.discount,
          marginPercentage: dataSend.marginPercentage,
        },
        idEdit.value,
        dataSend.proposalId
      );
    } else {
      await createProposalFinanceTable({ ...dataSend });
    }
  }
});
// Handle margin
const projectMargin = computed(() => {
  return table.data.reduce((sum, item) => {
    return sum + item.quantity * item.marginAmount;
  }, 0);
});
// Handle total price
const totalPrice = computed(() => {
  return table.data.reduce((sum, item) => {
    return sum + (item.totalPrice || 0);
  }, 0);
});
</script>
