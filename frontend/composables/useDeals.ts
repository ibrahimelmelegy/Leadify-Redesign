import { ElNotification } from 'element-plus';
// Handle error during deal creation
function handleError(message: string) {
  ElNotification({
    type: 'error',
    title: 'Error',
    message,
  });
}
function handleSuccess(message: string) {
  ElNotification({
    type: 'success',
    title: 'Success',
    message,
  });
  navigateTo('/sales/deals'); // Navigate to the deals list
}

export enum DealStageEnums {
  PROGRESS = 'PROGRESS',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export const dealStageOptions = [
  { label: 'In Progress', value: DealStageEnums.PROGRESS },
  { label: 'Closed', value: DealStageEnums.CLOSED },
  { label: 'Cancelled', value: DealStageEnums.CANCELLED },
];

export enum ContractTypeEnums {
  Contract = 'Contract',
  PurchaseOrder = 'PurchaseOrder',
}

export const contractTypeOptions = [
  { label: 'Contract', value: ContractTypeEnums.Contract },
  { label: 'Purchase Order', value: ContractTypeEnums.PurchaseOrder },
];

export interface Deal {
  users?: number;
  name?: string;
  companyName?: string;
  price?: number;
  contractType?: string;
  stage?: 'PROGRESS' | 'COMPLETED' | 'CANCELLED';
  cancelledReason?: string;
  signatureDate?: string;
  [key: string]: any;
}

// Delivery interface
export interface Delivery {
  id: string; // Add unique ID
  deliveryDetails: string;
  deliveryDate: Date | null;
}

export interface Invoice {
  id: string; // Add unique ID
  invoiceNumber: string;
  amount: number | null;
  dueDate: Date | null;
  collectedDate: Date | null;
  collected: Boolean | null;
}

export interface DealValues {
  lead?: Leads;
  deal?: Deal;
  invoiceDetail?: Invoice[];
  deliveryDetails?: Delivery[];
  [key: string]: Deal | any;
}

interface UseDealResult {
  deals: Deal[];
  pagination: Pagination;
}

/**
 * Fetches a list of deals from the API
 * @returns {Promise<UseDealResult>} A promise that resolves to an object containing the deals and pagination
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getDeals(all?:false): Promise<UseDealResult> {
  try {
    // Make the API call
    const { body, success, message } =  all ? await useApiFetch('deal?limit=1000') : await useApiFetch('deal');

    if (success) {
      // Return the docs (c) from the response
      const deals = body?.docs?.map((deal: any) => ({
        ...deal,
        createdAt: formatDate(deal.createdAt),
        // updatedAt: formatDate(deal.updatedAt),
        updatedAt: '-',
        assign: deal.user?.name,
      }));
      const pagination = body?.pagination;
      return { deals, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch Deals');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching deals:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching deals. Please try again.');

    // Return an empty array as fallback
    return { deals: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches a single deal from the API
 * @param id - The ID of the deal to fetch
 * @returns {Promise<Deal>} A promise that resolves to a Deal object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getDeal(id: string | string[]): Promise<Deal> {
  try {
    let { body: deal, success } = await useApiFetch(`deal/${id}`);
    return deal;
  } catch (error) {
    console.error('Error fetching deal:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching deal. Please try again.');
    return {} as Deal;
  }
}

export async function getDealActivity(id: string | string[]): Promise<Lead> {
  try {
    let { body: lead, success } = await useApiFetch(`activity/deal/${id}`);
    return lead;
  } catch (error) {
    console.error('Error fetching lead:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching deal. Please try again.');
    return {} as Lead;
  }
}

/**
 * Creates a new deal
 * @param values - The values to create the deal with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function createDeal(values: DealValues) {
  try {
    // Call API to create the deal
    const response = await useApiFetch('deal/create', 'POST', values);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Deal created successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Updates an existing deal
 * @param values - The values to update the deal with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function updateDeal(values: DealValues) {
  try {
    // Call API to create the deal
    const response = await useApiFetch(`deal/update`, 'POST', values);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Deal updated successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Converts a lead to a deal
 * @param values - The values to create the deal with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function convertToDeal(values: DealValues) {
  try {
    // Call API to create the deal
    const response = await useApiFetch(`deal/convert-lead`, 'POST', values);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Deal Added successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}
