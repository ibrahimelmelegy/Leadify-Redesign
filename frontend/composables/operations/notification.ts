
import { ElNotification } from 'element-plus';

// Handle error during service creation
function handleError(message: string) {
    ElNotification({
        type: 'error',
        title: 'Error',
        message,
    });
}

function handleSuccess(message: string, path: string) {
    ElNotification({
        type: 'success',
        title: 'Success',
        message,
    });
    navigateTo(`/${path}`);
}

export async function readAll(): Promise<void> {
    try {
        // Call API to create the associated vehicles
        const response = await useApiFetch(`notification/`, 'PUT');

        // Handle the API response
        if (!response?.success) {
            const errorMessage = response?.message || 'Something went wrong';
            handleError(errorMessage);
            throw new Error(errorMessage); // Throw an error to be caught in the calling function
        }
    } catch (error) {
        // Catch any unexpected errors and handle them
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        handleError(errorMessage);
        throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
    }
}

export async function read(id: string , path:string): Promise<void> {
    try {
        // Call API to create the associated vehicles
        const response = await useApiFetch(`notification/click/${id}`, 'PUT');
        // Handle the API response
        if (response?.success) {
            handleSuccess(' click successfully'  , path);
        } else {
            // Handle the API response

            const errorMessage = response?.message || 'Something went wrong';
            handleError(errorMessage);
            throw new Error(errorMessage); // Throw an error to be caught in the calling function
        }
    } catch (error) {
        // Catch any unexpected errors and handle them
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        handleError(errorMessage);
        throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
    }
}
