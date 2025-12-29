import { ElNotification } from 'element-plus';

// Handle error during asset creation
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
    navigateTo(`/operations/assets/${id}`); // Navigate to the asset details
  } else {
    navigateTo('/operations/assets'); // Navigate to the assets list
  }
}

export interface Asset {
  name: string;
  buyPrice: string | number;
  rentPrice: string | number;
  [key: string]: any;
}

interface UseAssetsResult {
  assets: Asset[];
  pagination: Pagination;
}

/**
 * Fetches a list of assets from the API
 * @returns {Promise<UseAssetsResult>} A promise that resolves to an object containing the assets and pagination
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getAssets(): Promise<UseAssetsResult> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch('asset');

    if (success) {
      // Return the docs (assets) from the response
      const assets = body?.docs?.map((asset: any) => ({
        ...asset,
        createdAt: formatDate(asset.createdAt),
        // updatedAt: formatDate(asset.updatedAt),
        updatedAt: '-',
        assign: asset.user?.name,
      }));
      const pagination = body?.pagination;
      return { assets, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch assets');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching assets:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching assets. Please try again.');

    // Return an empty array as fallback
    return { assets: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches a single asset from the API
 * @param id - The ID of the asset to fetch
 * @returns {Promise<Asset>} A promise that resolves to a Asset object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getAsset(id: string | string[]): Promise<Asset> {
  try {
    let { body: asset, success } = await useApiFetch(`asset/${id}`);
    return asset;
  } catch (error) {
    console.error('Error fetching asset:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching asset. Please try again.');
    return {} as Asset;
  }
}

/**
 * Creates a new asset
 * @param values - The values to create the asset with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */

export async function createAsset(values: Asset, redirect: boolean = true) {
  // Normalize the phone number before sending
  try {
    const mappedAsset = mapToNumbers(values);
    // Call API to create the asset
    const response = await useApiFetch('asset', 'POST', cleanObject(mappedAsset));

    // Handle the API response
    if (response?.success) {
      handleSuccess('Asset created successfully', '', redirect);
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
 * Updates an existing asset
 * @param values - The values to update the asset with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function updateAsset(values: Asset, redirect: boolean = true) {
  try {
    let mappedAsset = mapToNumbers(values);
    delete mappedAsset.id;
    // Call API to create the asset
    const response = await useApiFetch(`asset/${values.id}`, 'PUT', cleanObject(mappedAsset));

    // Handle the API response
    if (response?.success) {
      handleSuccess('Asset updated successfully', values.id, redirect);
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
 * Maps numeric fields of a Asset object to numbers if they are strings.
 * a number with two decimal places; otherwise, the original value is retained.
 *
 * @param {Asset} data - The asset data to map
 * @returns {Asset} The mapped asset data with numeric fields converted
 */
function mapToNumbers(data: Asset): Asset {
  const numericFields = ['rentPrice', 'buyPrice'];

  // Convert specified fields to numbers if they are strings
  const mappedData = { ...data };
  numericFields.forEach((field) => {
    if (typeof mappedData[field as keyof Asset] === 'string') {
      const numericValue = parseFloat(mappedData[field as keyof Asset] as unknown as string);
      mappedData[field as keyof Asset] = isNaN(numericValue)
        ? mappedData[field as keyof Asset] // Keep original value if parsing fails
        : Number(numericValue.toFixed(2)); // Convert to number and fix to 2 decimal places
    }
  });

  return mappedData;
}
