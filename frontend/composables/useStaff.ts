import { ElNotification } from "element-plus";

// Handle error during staff creation
function handleError(message: string) {
  ElNotification({
    type: "error",
    title: "Error",
    message,
  });
}

function handleSuccess(message: string) {
  ElNotification({
    type: "success",
    title: "Success",
    message,
  });
  navigateTo("/staff"); // Navigate to the staffs list
}

export interface Staff {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  updatedAt: string;
  profilePicture?: string;
  [key: string]: any;
}

export enum StaffStatusEnums {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const staffStatuses = [
  { label: "Active", value: StaffStatusEnums.ACTIVE },
  { label: "Inactive", value: StaffStatusEnums.INACTIVE },
];

interface UseStaffResult {
  staffs: Staff[];
  pagination: Pagination;
}
/**
 * Fetches a list of staffs from the API
 * @returns {Promise<Staff[]>} A promise that resolves to an array of Staff objects
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getStaffs(): Promise<UseStaffResult> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch("users");

    if (success) {
      // Return the docs (staffs) from the response
      const staffs = body?.docs?.map((staff: any) => ({
        ...staff,
        createdAt: formatDate(staff.createdAt),
        staffDetails:{image:staff?.profilePicture , title:staff?.name },
        roleDetails: staff?.role?.name,
        // updatedAt: formatDate(staff.updatedAt),
        updatedAt: "-",
        assign: staff.user?.name,
      }));
      const pagination = body?.pagination;
      return { staffs, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || "Failed to fetch staffs");
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error("Error fetching staffs:", error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError("An error occurred while fetching staffs. Please try again.");

    // Return an empty array as fallback
    return {
      staffs: [],
      pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
}

/**
 * Fetches a single staff from the API
 * @param id - The ID of the staff to fetch
 * @returns {Promise<Staff>} A promise that resolves to a Staff object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getStaff(id: string | string[]): Promise<Staff> {
  try {
    let { body: staff, success } = await useApiFetch(`users/${id}`);
    return staff;
  } catch (error) {
    console.error("Error fetching staff:", error instanceof Error ? error.message : error);
    handleError("An error occurred while fetching staff. Please try again.");
    return {} as Staff;
  }
}

/**
 * Create a new staff
 * @param values - The values to create the staff with
 * @returns {Promise<void>}
 */

export async function createStaff(values: Staff): Promise<void> {
  try {
    // Normalize the phone number before sending
    const normalizedPhone = normalizePhoneNumber(values.phone);

    // Call API to create the staff
    const response = await useApiFetch(
      "users",
      "POST",
      cleanObject({
        ...values,
        phone: normalizedPhone,
      })
    );

    // Handle the API response
    if (response?.success) {
      handleSuccess("Staff created successfully");
    } else {
      handleError(response?.message || "Something went wrong");
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : "Unknown error");
  }
}

/**
 * Update an existing staff
 * @param values - The values to update the staff with
 */
export async function updateStaff(values: Staff) {
  try {
    // Normalize the phone number before sending
    const normalizedPhone = normalizePhoneNumber(values.phone);
    const formattedValues = cleanObject({
      ...values,
      phone: normalizedPhone,
      id: null,
    });
    // Call API to create the staff
    const response = await useApiFetch(`users/${values.id}`, "PUT", formattedValues);

    // Handle the API response
    if (response?.success) {
      handleSuccess("Staff updated successfully");
    } else {
      handleError(response?.message || "Something went wrong");
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : "Unknown error");
  }
}

export async function deleteStaff(id: string) {
  try {
    // Call API to delete the staff
    const response = await useApiFetch(`users/${id}`, "DELETE", {
      id: id?.toString(),
    });

    // Handle the API response
    if (response?.success) {
      handleSuccess("Staff deleted successfully");
    } else {
      handleError(response?.message || "Something went wrong");
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : "Unknown error");
  }
}
