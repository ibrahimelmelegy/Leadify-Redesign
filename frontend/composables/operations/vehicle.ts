import { ElNotification } from 'element-plus';

// Handle error during vehicle creation
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
    navigateTo(`/operations/vehicle/${id}`); // Navigate to the vehicle details
  } else {
    navigateTo('/operations/vehicle'); // Navigate to the vehicles list
  }
}

export interface Vehicle {
  rentCost: number;
  gasCost: number;
  oilCost: number;
  manufacturer: string;
  plate: string;
  regularMaintenanceCost: number;
  [key: string]: any;
}

enum Manufacturer {
  sedan = 'Sedan',
  changanHunter = 'Changan Hunter',
  other = 'Other',
}

export const manufacturers = [
  { label: 'Sedan', value: Manufacturer.sedan },
  { label: 'Changan Hunter', value: Manufacturer.changanHunter },
  { label: 'Other', value: Manufacturer.other },
];

interface UseVehicleResult {
  vehicles: Vehicle[];
  pagination: Pagination;
}

/**
 * Fetches a list of vehicles from the API
 * @returns {Promise<UseVehicleResult>} A promise that resolves to an object containing the vehicles and pagination
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getVehicles(): Promise<UseVehicleResult> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch('vehicle');

    if (success) {
      // Return the docs (vehicles) from the response
      const vehicles = body?.docs?.map((vehicle: any) => ({
        ...vehicle,
        createdAt: formatDate(vehicle.createdAt),
        // updatedAt: formatDate(vehicle.updatedAt),
        updatedAt: '-',
        assign: vehicle?.user?.name,
      }));
      const pagination = body?.pagination;
      return { vehicles, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch vehicles');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching vehicles:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching vehicles. Please try again.');

    // Return an empty array as fallback
    return { vehicles: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches a single vehicle from the API
 * @param id - The ID of the vehicle to fetch
 * @returns {Promise<Vehicle>} A promise that resolves to a Vehicle object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getVehicle(id: string | string[]): Promise<Vehicle> {
  try {
    let { body: vehicle, success } = await useApiFetch(`vehicle/${id}`);
    return vehicle;
  } catch (error) {
    console.error('Error fetching vehicle:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching vehicle. Please try again.');
    return {} as Vehicle;
  }
}

/**
 * Creates a new vehicle
 * @param values - The values to create the vehicle with
 * @param [redirect=true] - Whether to redirect to the vehicle details after creation
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function createVehicle(values: Vehicle, redirect: boolean = true) {
  // Normalize the phone number before sending
  try {
    const mappedVehicle = mapToNumbers(values);
    // Call API to create the vehicle
    const response = await useApiFetch('vehicle/create', 'POST', mappedVehicle);

    // Handle the API response
    if (response?.success) {
      handleSuccess('vehicle created successfully', '', redirect);
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
 * Updates an existing vehicle
 * @param values - The values to update the vehicle with
 * @param [redirect=true] - Whether to redirect to the vehicle details after update
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function updateVehicle(values: Vehicle, redirect: boolean = true) {
  try {
    let mappedVehicle = mapToNumbers(values);
    // Call API to create the Vehicle
    const response = await useApiFetch(`vehicle/update`, 'POST', mappedVehicle);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Vehicle updated successfully', values.id, redirect);
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
 * Maps numeric fields of a Vehicle object to numbers if they are strings.
 * a number with two decimal places; otherwise, the original value is retained.
 *
 * @param {Vehicle} data - The vehicle data to map
 * @returns {Vehicle} The mapped vehicle data with numeric fields converted
 */

function mapToNumbers(data: Vehicle): Vehicle {
  const numericFields = ['rentCost', 'gasCost', 'oilCost', 'regularMaintenanceCost'];

  // Convert specified fields to numbers if they are strings
  const mappedData = { ...data };
  numericFields.forEach((field) => {
    if (typeof mappedData[field as keyof Vehicle] === 'string') {
      const numericValue = parseFloat(mappedData[field as keyof Vehicle] as unknown as string);
      mappedData[field as keyof Vehicle] = isNaN(numericValue)
        ? mappedData[field as keyof Vehicle] // Keep original value if parsing fails
        : Number(numericValue.toFixed(2)); // Convert to number and fix to 2 decimal places
    }
  });

  return mappedData;
}
