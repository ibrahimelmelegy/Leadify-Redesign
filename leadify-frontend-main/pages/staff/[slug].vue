<template lang="pug">
  .flex.items-center.justify-between.mb-5.mt-5
    .title.font-bold.text-2xl.mb-1.capitalize View Staff
    el-dropdown(trigger="click")
        span.el-dropdown-link
            button.rounded-btn(class="!px-4"): Icon(name="IconToggle" size="24")
        template(#dropdown)
            el-dropdown-menu
              el-dropdown-item(v-if="hasPermission('EDIT_STAFF') && staff?.id !== 1" )
                NuxtLink.flex.items-center(:to="`/staff/edit/${staff?.id}`")
                  Icon.text-md.mr-2(size="20" name="IconEdit" )
                  p.text-sm Edit
              //- el-dropdown-item
              //-   .flex.items-center
              //-     Icon.text-md.mr-2(size="20" name="IconDelete" )
              //-     p.text-sm Delete

  .flex-1.bg-white.p-10.rounded-3xl
    .flex.align-center.gap-3(class="flex-col md:flex-row")
      Avatar(:src="staff.profilePicture" v-if="staff.profilePicture" size="large" )
      .text(v-else-if="staff.name" :style="{ backgroundColor: randomBgColor() }")
        p.text-sm.font-semibold.whitespace-nowrap {{ getWordInitials(staff.name) }}
      div
        h4.text-2xl.font-semibold.mb-2.text-neutral-900.flex.items-center.gap-x-3 {{staff.name}} #[span.border.rounded-xl.text-xs.px-2(:class="`label-outline-${getStatusColor(staff.status)}`") {{formatSnakeCase(staff.status)}}]
        p.text-neutral-600 {{staff.role?.name}}
    .mt-8
      p.text-neutral-900.font-semibold.mb-6.text-lg Information
      .grid.gap-4(class="lg:grid-cols-4 grid-cols-1")
        div(v-if="staff.email")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="IconEmail" size="20" class="mr-2")
            p Email
          p.text-neutral-800.mb-2 {{staff.email}}
        div(v-if="staff.phone")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="IconPhone" size="20" class="mr-2")
            p Phone Number
          p.text-neutral-800.mb-2 {{staff.phone}}
        div(v-if="staff.role?.name")
          .text-neutral-400.font-medium.mb-2.flex.items-center
            Icon(name="IconAssign" size="20" class="mr-2")
            p Role
          p.text-neutral-800.mb-2 {{staff.role?.name}}
        //- div(v-if="true")
        //-   .text-neutral-400.font-medium.mb-2.flex.items-center
        //-     Icon(name="IconAssign" size="20" class="mr-2")
        //-     p Password
        //-   p.text-neutral-800.mb-2 000000000

</template>

<script lang="ts" setup>
  const activeName = ref("summary");
  const route = useRoute();
  const { hasPermission } = await usePermissions();
  // Call API to Get the staff
  const staff = await getStaff(route.params.slug);
</script>
<style scoped lang="scss"></style>
