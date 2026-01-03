<template lang="pug">
.border.rounded-xl.text-xs.p-2(:class="labelType" v-if="type === 'outline'")  {{ getTextFromValue(value) }}
.flex.items-center(:class="labelType" v-if="type === 'solid'")
  div(class="h-1.5 w-1.5 rounded-full mr-1" :class="labelBg")
  span {{ getTextFromValue(value) }}
.flex.items-center.py-2(v-if="type === 'select'")
 el-dropdown.flex.items-center.justify-center.border.rounded-xl(class="w-[100px] h-[40px]" trigger="click" :class="labelType" )
  span(:class="labelType"  ) {{ getTextFromValue(value) }}
  template(#dropdown='')
   el-dropdown-menu
      el-dropdown-item(v-for="(item , index ) in filters " :key="index" @click = "item?.actions({...valueObject , status: item?.value})" )
        span  {{item?.text}}
</template>

<script setup>
const props = defineProps({
  valueObject: {
    type: Object,
    required: false,
  },
  value: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  filters: {
    type: Array,
    default: [],
  },
});
const route = useRoute();

const valueMap = {
  ACTIVE: 'PROJECT_ACTIVE',
  CANCELLED: 'PROJECT_CANCELLED',
  COMPLETED: 'PROJECT_COMPLETED',
  ON_HOLD: 'PROJECT_ON_HOLD',
};
const labelType = computed(() => {
  // Check if the route includes "projects"
  const statusValue = route.path.includes('projects') ? valueMap[props.value] || props.value : props.value;
  return `label-${props.type == 'select' ? 'outline' : props.type}-${getStatusColor(statusValue)}`;
});
const labelBg = computed(() => {
  return `bg-${props.type}-${getStatusColor(props.value)}`;
});

function getTextFromValue(value) {
  const mappedValue = route.path.includes('projects') ? valueMap[value] || value : value;

  const matchedFilter = props.filters?.find((filter) => filter.value === mappedValue);

  return matchedFilter ? matchedFilter.text : mappedValue;
}
</script>
<style lang="scss">
.label {
  &-outline {
    &-one {
      background-color: #e6f9fb;
      color: #00adc3;
      border-color: transparent;
    }

    &-two {
      background-color: #e9e6f3;
      color: #270089;
      border-color: transparent;
    }

    &-three {
      background-color: #ffebeb;
      color: #ee2424;
      border-color: transparent;
    }

    &-four {
      background-color: #fff8e7;
      color: #ffb72d;
      border-color: transparent;
    }

    &-five {
      // background-color: #fff8e7;
      color: #ee7c24;
      border-color: transparent;
    }

    &-primary {
      background-color: #d1ffe5;
      color: #0db355;
      border-color: transparent;
    }

    &-six {
      // background-color: #fff8e7;
      color: #b5b3ba;
      border-color: transparent;
    }
  }

  &-solid {

    // &-primary {
    //   border: 1px solid $primary;
    //   color: $primary;
    // }
    // &-red {
    //   border: 1px solid $danger;
    //   color: $danger;
    // }
    &-three {
      color: #ee2424;
      border-color: transparent;
    }

    &-five {
      color: #ee7c24;
      border-color: transparent;
    }

    &-four {
      color: #ffb72d;
      border-color: transparent;
    }

    &-primary {
      color: #0db355;
      border-color: transparent;
    }

    &-six {
      // background-color: #fff8e7;
      color: #b5b3ba;
      border-color: transparent;
    }

    &-brown {
      border: 1px solid $brown;
      color: $brown;
      background-color: $brown-light;
    }
  }
}

.bg {
  &-solid {
    &-three {
      background-color: #ee2424 !important;
    }

    &-five {
      background-color: #ee7c24 !important;
    }

    &-four {
      background-color: #ffb72d !important;
    }

    &-primary {
      background-color: #0db355 !important;
    }

    &-six {
      background-color: #b5b3ba !important;
    }

    &-brown {
      border: 1px solid $brown;
      color: $brown;
      background-color: $brown-light;
    }
  }
}
</style>
