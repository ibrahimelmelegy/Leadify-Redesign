import { ElNotification } from 'element-plus';

// Handle error during additional material creation
function handleError(message: string) {
  ElNotification({
    type: 'error',
    title: 'Error',
    message,
  });
}
function handleSuccess(message: string, id?: string, redirect: boolean = true) {
  ElNotification({
    type: 'success',
    title: 'Success',
    message,
  });
  if (!redirect) {
    return;
  }
  if (id) {
    navigateTo(`/operations/additional-material/${id}`); // Navigate to the material details
  } else {
    navigateTo('/operations/additional-material'); // Navigate to the materials list
  }
}

export interface CategoryItem {
  id?: string;
  name: string;
  price: number | null;
  [key: string]: any;
}

export interface AdditionalMaterial {
  name: string;
  items: CategoryItem[];
  [key: string]: any;
}

export interface Material {
  description: string;
  quantity:number;
  unitPrice:number
}

interface UseAdditionalMaterialsResult {
  materials: AdditionalMaterial[];
  pagination: Pagination;
}

export async function getMaterials(project?:number): Promise<UseAdditionalMaterialsResult> {
  try {
    // Make the API call
    const { body, success, message } = project ? await useApiFetch(`material?limit=1000&project=${project}`) :await useApiFetch('material?limit=1000')  ;

    if (success) {
      // Return the docs (additional Material) from the response
      const materials = body?.docs?.map((material: any) => ({
        ...material,
        createdAt: formatDate(material.createdAt),
        // updatedAt: formatDate(material.updatedAt),
        updatedAt: '-',
        assign: material.user?.name,
      }));
      const pagination = body?.pagination;
      return { materials, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch additional Material');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching additional Material:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching additional Material. Please try again.');

    // Return an empty array as fallback
    return { materials: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

export async function createMaterial(values: Material) {
  try {
    // Call API to create the additional material
    const response = await useApiFetch('material', 'POST', values);

    // Handle the API response
    if (response?.success) {
      handleSuccess('material created successfully', '', false);
      return response?.body;
    } else {
      handleError(response?.message || 'Something went wrong');
      return {};
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
    return {};
  }
}

/**
 * Fetches a list of additional Material from the API
 * @returns {Promise<UseAdditionalMaterialsResult>} A promise that resolves to an object containing the additional Material and pagination
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getAdditionalMaterials(): Promise<UseAdditionalMaterialsResult> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch('additional-material');

    if (success) {
      // Return the docs (additional Material) from the response
      const materials = body?.docs?.map((material: any) => ({
        ...material,
        createdAt: formatDate(material.createdAt),
        // updatedAt: formatDate(material.updatedAt),
        updatedAt: '-',
        assign: material.user?.name,
      }));
      const pagination = body?.pagination;
      return { materials, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch additional Material');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching additional Material:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching additional Material. Please try again.');

    // Return an empty array as fallback
    return { materials: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches a single additional material from the API
 * @param id - The ID of the additional material to fetch
 * @returns {Promise<AdditionalMaterial>} A promise that resolves to an AdditionalMaterial object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getAdditionalMaterial(id: string | string[]): Promise<AdditionalMaterial> {
  try {
    let { body: material, success } = await useApiFetch(`additional-material/${id}`);
    return material;
  } catch (error) {
    console.error('Error fetching material:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching material. Please try again.');
    return {} as AdditionalMaterial;
  }
}

/**
 * Creates a new additional material
 * @param values - The values to create the additional material with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function createAdditionalMaterial(values: AdditionalMaterial, redirect: boolean = true) {
  try {
    // Call API to create the additional material
    const response = await useApiFetch('additional-material/create', 'POST', cleanObject(values));

    // Handle the API response
    if (response?.success) {
      handleSuccess('Additional material created successfully', '', redirect);
      return response?.body;
    } else {
      handleError(response?.message || 'Something went wrong');
      return {};
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
    return {};
  }
}

/**
 * Updates an existing additional material
 * @param values - The values to update the additional material with
 * @returns {Promise<void>} A promise that resolves when the additional material is updated
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function updateAdditionalMaterial(values: AdditionalMaterial, redirect: boolean = true): Promise<void> {
  try {
    // Call API to create the additional material
    const response = await useApiFetch(`additional-material/update`, 'POST', cleanObject(values));

    // Handle the API response
    if (response?.success) {
      handleSuccess('Additional material updated successfully', values.id, redirect);
      return response?.body;
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}
