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
  navigateTo("/roles"); // Navigate to the roles list
}

/**
 * Fetches a single role from the API
 * @param id - The ID of the role to fetch
 * @returns {Promise<role>} A promise that resolves to a role object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getRole(id: string | string[]): Promise<any> {
  try {
    let { body: role, success } = await useApiFetch(`role/${id}`);
    return role;
  } catch (error) {
    console.error("Error fetching role:", error instanceof Error ? error.message : error);
    handleError("An error occurred while fetching role. Please try again.");
    return {} as any;
  }
}

/**
 * Create a new role
 * @param values - The values to create the role with
 * @returns {Promise<void>}
 */

export async function createRole(values: any): Promise<void> {
  try {
    // Call API to create the role
    const response = await useApiFetch("role", "POST", values);

    // Handle the API response
    if (response?.success) {
      handleSuccess("Role created successfully");
    } else {
      handleError(response?.message || "Something went wrong");
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : "Unknown error");
  }
}

/**
 * Update an existing role
 * @param values - The values to update the role with
 */
export async function updateRole(values: any) {
  try {
    // Call API to create the role
    const formattedValues = cleanObject({ ...values });
    delete formattedValues.id;
    const response = await useApiFetch(`role/${values.id}`, "PUT", formattedValues);

    // Handle the API response
    if (response?.success) {
      handleSuccess("Role updated successfully");
      // Refresh permissions
      await usePermissions(true);
    } else {
      handleError(response?.message || "Something went wrong");
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : "Unknown error");
  }
}
