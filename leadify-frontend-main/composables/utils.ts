import { ElNotification } from "element-plus";

export const numberOfFilters = ref();

export function copyText(slug: string) {
  navigator.clipboard.writeText(slug);
  ElNotification({
    type: "success",
    message: h("h1", { style: "color:#1BC5C3" }, "Code copied Successfully"),
  });
}

export function checkRouteDispatch(to, from) {
  const toRoue = to.fullPath.split("/");
  const fromRoute = from.fullPath.split("/");

  return toRoue[toRoue.length - 2] == fromRoute[fromRoute.length - 1];
}
export function checkSecParent(to, from) {
  const toRoue = to.fullPath.split("/");
  const fromRoute = from.fullPath.includes("?") ? from.fullPath.split("?")[0].split("/") : from.fullPath.split("/");

  return toRoue[2] == fromRoute[2];
}
export function checkparent(to, from) {
  const toRoue = to.fullPath.split("/");
  const fromRoute = from.fullPath.split("/");

  return toRoue[1] == fromRoute[1];
}
export function isObjectValid(obj: any) {
  // Check if the input is an object and not null
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  // Iterate through object properties
  for (const key in obj) {
    if (!obj[key]) {
      return false; // Return false if any value is null or undefined
    }
  }

  return true; // All properties are valid
}

export function formatSnakeCase(str: string) {
  return str
    ?.toLowerCase()
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const filterLength = (obj: Record<string, any>): number => {
  if (!Object.entries(obj).length) return 0;
  return Object.entries(obj)?.reduce((total, [key, value]) => {
    if (Array.isArray(value) || typeof value === "string") {
      // Add the length of arrays or strings
      return total + value.length;
    }
    return total; // Skip other types
  }, 0);
};

export const cleanObject = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      // Remove falsy values, empty arrays, and empty objects
      if (value === null || value === undefined || value === "" || Number.isNaN(value)) return false; // Falsy values
      if (Array.isArray(value) && value.length === 0) return false; // Empty array
      if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return false; // Empty object
      return true; // Keep other values
    })
  );
};

export function isNullish(value: any) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") || // Empty string
    (Array.isArray(value) && value.length === 0) || // Empty array
    (typeof value === "object" && value !== null && Object.keys(value).length === 0) // Empty object
  );
}

export const handleUploadRequestApi = async (params: any, payloadName?: string, model?: string) => {
  const result = ref();
  const errorData = ref();

  let { file, filename, data } = params;
  try {
    data.model = model;
    payloadName && (filename = payloadName);

    const formData = new FormData();
    const fileToUpload = new File([file], file.name);

    formData.append(filename, fileToUpload);

    Object.entries(data).forEach(([key, value]: any) => {
      formData.append(key, value);
    });

    const response = await useApiFetch("upload", "POST", formData, false, true);
    if (response?.success) {
      result.value = response.body;
    }
  } catch (error) {
    errorData.value = error;
    console.error("Upload failed:", error);
  }
  return { result, errorData };
};
