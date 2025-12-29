<template lang="pug">
.flex.items-center.justify-between.mb-8
  .title.font-bold.text-2xl.mb-1.capitalize.mb-5.mt-5 Create Deal
  .flex.items-center.gap-x-2
    el-button(size='large' plain type="primary" class="w-full !rounded-2xl" @click="router.back()") Cancel
    el-button(size='large' type="primary" native-type="submit" :loading="loading" :disabled="loading" class="w-full !px-5 !rounded-2xl" @click="saveAllForms") Save
el-tabs.demo-tabs(v-model="activeName", :lazy="false" @tab-click="handleClick")
  el-tab-pane(label="Deal Information", name="deal")
    DealInformation( :loading="loading" ref="informationRef" @onSubmit="getDealInformation" :editMode="route.query?.leadId || route.query?.opportunityId")
  el-tab-pane(label="Invoices Information", name="invoices")
    DealInvoices( :loading="loading" ref="invoicesRef" @onSubmit="getInvoices" @isValid="(value)=>isInvoices = value")
  el-tab-pane(label="Delivery Information", name="delivery")
    DealDelivery( :loading="loading" ref="deliveryRef" @onSubmit="getDeliveries" @isValid="(value)=>isDeliveries = value")
</template>
<script lang="ts" setup>
  const activeName = ref("deal");
  const informationRef = ref();
  const invoicesRef = ref();
  const deliveryRef = ref();
  useHead({
    title: "App HP Tech | Add Deal",
  });
  definePageMeta({
    middleware: "permissions",
    permission: "CREATE_DEALS",
  });
  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);

  const isInvoices = ref(false);
  const isDeliveries = ref(false);

  let combinedValues = ref<DealValues>({});

  function getDealInformation(values: any) {
    combinedValues.value = { ...combinedValues.value, ...values };
  }

  function getInvoices(values: any) {
    combinedValues.value.invoiceDetails = [...values];
  }

  function getDeliveries(values: any) {
    combinedValues.value.deliveryDetails = [...values];
  }

  async function saveAllForms() {
    // reset the values
    combinedValues.value = {};
    try {
      loading.value = true;
      // FIXME : Work arround to wait for the ref to initialize
      if (activeName.value === "deal") {
        activeName.value = "invoices";
        await nextTick();
        activeName.value = "deal";
        await nextTick();
      }
      await informationRef.value.onSubmitInformation();
      await invoicesRef.value.onSubmitInvoices();
      await deliveryRef.value.onSubmitDeliveries();
      if ((combinedValues.value?.deal?.name || combinedValues.value?.name) && isInvoices.value && isDeliveries.value) {
        if (combinedValues.value?.leadId || combinedValues.value?.opportunityId) {
          await convertToDeal(combinedValues.value);
          // return;
        } else {
          await createDeal(combinedValues.value);
        }
      }
      loading.value = false;
      isDeliveries.value = false;
      isInvoices.value = false;
    } catch (error) {
      console.error("Error saving forms:", error);
      loading.value = false;
    } finally {
      loading.value = false;
    }
  }
</script>
