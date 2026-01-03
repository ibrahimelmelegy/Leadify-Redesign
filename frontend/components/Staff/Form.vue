<template lang="pug">
el-form(autocomplete="off" @submit.prevent="onSubmit" ref="myForm" label-position="top")
  slot
  .card.m-auto.bg-white.p-10.rounded-3xl(class="2xl:w-1/2 w-[90%]")
    .upload-img-staff.flex.items-center.gap-3.mb-6
      InputUploadImage(name="profilePicture" type="image" sizeLook="small" :value="data?.profilePicture" :isEdit="route.path.includes('edit')" model="USER")
      .label
        .flex.items-center.gap-2.font-medium.mb-1
          p(class="text-neutral-800") Upload Image
          span(class="text-neutral-500 text-xs") (Optional)
        span(class="text-neutral-400 text-xs") JPG, JPEG, PNG, GIF (5 MB Maximum)
    .grid.grid-cols-2.gap-3
      InputText(label="Full Name" name="name" :value="data?.name" )
      InputText(label="Email"  name="email" :value="data?.email" @value="val=> isEmail = !!val" )
      InputPhone.mt-6(label=" Phone Number"  name="phone" @value="val=> isPhone = !!val" :value="data?.phone" @validphone="val=> validPhone = val" mode="international" )
      InputSelect.mt-6(label="Role" placeholder="Select Role" name="roleId" :options="mappedRoles" :value="data?.roleId" )
      InputSelect(label="Statues" name="status" :options="staffStatuses" :value="data?.status" v-if="editMode")
      InputText(:class="{'col-span-2': !editMode}" label="Password" name="password" type="password" :value="data?.password" )
</template>

<script lang="ts" setup>
  import { useForm } from "vee-validate";
  import * as yup from "yup";
  import isEmailValidator from "validator/lib/isEmail";
  import { defineEmits, defineProps } from "vue";
  const router = useRouter();
  const route = useRoute();

  const props = defineProps({
    loading: Boolean,
    editMode: Boolean,
    label: String,
    data: {
      type: Object,
      required: false,
    },
  });

  const emit = defineEmits(["submit"]);
  const validPhone = ref(true);
  const isEmail = ref(false);
  const isPhone = ref(false);
  const isOtherSource = ref(false);

  const formSchema = yup.object({
    name: yup.string().trim().required().min(2).max(100).label("Full Name"),
    email: yup
      .string()
      .email()
      .max(100)
      .required("At least one of email or phone number is required")
      .test(
        "is-valid",
        (message: any) => "Invalid email",
        (value: any) => (value ? isEmailValidator(value) : new yup.ValidationError("Invalid value"))
      )
      .label("Email"),
    phone: yup
      .number()
      .nullable() // Allows the value to be null
      .transform((value: any, originalValue: any) => (originalValue === "" ? null : Number.isNaN(value) ? null : value))
      .label("Phone Number")
      .test("Phone number", "Invalid Phone", function (value: any) {
        if (value === null || value === undefined) {
          return true;
        }
        return validPhone.value ? true : false;
      }),
    roleId: yup.string().trim().required().max(100).label("Role"),
    status: yup.string().when([], {
      is: () => props.editMode,
      then: () => yup.string().trim().required().max(100).label("Status"),
      otherwise: () => yup.string().nullable().trim().max(100).label("Status"),
    }),
    password: yup
      .string()
      .required()
      .label("password")
      .matches(/^\S*$/, "Password cannot contain spaces") // No spaces allowed
      .matches(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter") // At least one lowercase
      .matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter") // At least one uppercase
      .matches(/^(?=.*[~`!@#$%^&*()_\-+=[\]{}|;':",.<>?/])/, "Password must contain at least one special character") // At least one special character
      .matches(/^(?=.*\d)/, "Password must contain at least one number") // At least one number
      .matches(/^[~`!@#$%^&*()_\-+=[\]\\{}|;':",.<>?/a-zA-Z0-9]+$/, "Password should only contain valid English characters") // Valid characters
      .min(8, "Password must be at least 8 characters long.") // Minimum length
      .max(50, "Password must not exceed 50 characters"), // Maximum length
  });

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit((values: any, actions: any) => {
    const formatedValues = cleanObject({
      ...values,
      status: props.editMode ? values.status : "",
    });
    emit("submit", formatedValues);
  });

  const mappedRoles = ref<{ label: string; value: any }[]>([]);
  
  onMounted(async () => {
    try {
      const response = await useApiFetch("role");
      mappedRoles.value = response.body?.docs?.map((e: any) => ({
        label: e.name,
        value: e.id,
      })) || [];
    } catch (e) {
      console.error('Failed to load roles:', e);
    }
  });
</script>
