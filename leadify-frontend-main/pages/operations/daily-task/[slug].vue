<template lang="pug">
    .flex.items-center.justify-between.mb-5.mt-5
      .title.font-bold.text-2xl.mb-1.capitalize Daily Task Details
    .flex.align-center.gap-6.mt-3(class="flex-col xl:flex-row")
            .flex-1.bg-white.p-10.rounded-3xl
              .grid.gap-4(class="md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4")
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p name
                  p.text-neutral-800.mb-2 {{dailyTask?.name}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="fluent:manufacturer-24-regular" size="20" class="mr-2")
                    p client Name
                  p.text-neutral-800.mb-2 {{dailyTask?.client?.clientName}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="fluent:manufacturer-24-regular" size="20" class="mr-2")
                    p Sales Representative Name
                  p.text-neutral-800.mb-2 {{dailyTask?.salesRepresentative?.name}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="fluent:manufacturer-24-regular" size="20" class="mr-2")
                    p Assign To
                  p.text-neutral-800.mb-2 {{dailyTask?.user?.name}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p Cost
                  p.text-neutral-800.mb-2 {{dailyTask?.cost}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p Total Paid
                  p.text-neutral-800.mb-2 {{dailyTask?.totalPaid}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p Down Payment
                  p.text-neutral-800.mb-2 {{dailyTask?.downPayment}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p priority
                  p.text-neutral-800.mb-2 {{dailyTask?.priority}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p Status
                  p.text-neutral-800.mb-2 {{dailyTask?.status}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p Date
                  p.text-neutral-800.mb-2 {{getYear(dailyTask?.createdAt)}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p Start Date
                  p.text-neutral-800.mb-2 {{getYear(dailyTask?.startDate)}}
                div
                  .text-neutral-400.font-medium.mb-2.flex.items-center
                    Icon(name="solar:hashtag-outline" size="20" class="mr-2")
                    p End Date
                  p.text-neutral-800.mb-2 {{getYear(dailyTask?.endDate)}}
            .flex-1.bg-white.p-10.rounded-3xl(v-if="dailyTask?.notes")
             .flex.items-center.gap-2.mb-4
               .flex.items-center.justify-center.w-10.h-10.rounded-full.bg-secondary-turquoise-50: Icon.text-secondary-turquoise-700(name="IconNote" size="24")
             h4.text-lg.font-semibold.text-neutral-900 Notes
             p.text-neutral-800.leading-relaxed {{dailyTask?.notes}}
    </template>
    <script lang="ts" setup>
    const route = useRoute();
    
    const dailyTask = await getDailyTask(route.params.slug);
    </script>
    <style scoped lang="scss">
    .activity {
      position: relative;
      ::before {
        content: "";
        height: 100%;
        width: 1px;
        position: absolute;
        left: 24px;
        top: 2%;
        border: 1px dashed #e7e6e9;
        z-index: -1;
      }
      > div:last-of-type {
        background: #f8f7fa !important;
      }
    }
    </style>
    