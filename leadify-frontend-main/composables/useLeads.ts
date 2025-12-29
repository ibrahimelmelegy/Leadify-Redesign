import { ElNotification } from 'element-plus';
// Helper function to normalize phone numbers
function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\s+/g, '').replace(/^\+/, '').replace(/^2/, ''); // Assuming removing country code prefix '2', modify if needed
}
// Handle error during lead creation
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
  navigateTo('/sales/leads'); // Navigate to the leads list
}

export interface Lead {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  leadSource: string;
  user: number;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assign?: string;
  [key: string]: any;
}

export enum LeadSourceEnums {
  REFERRAL = 'REFERRAL',
  WEBSITE = 'WEBSITE',
  EVENT = 'EVENT',
  EMAIL = 'EMAIL',
  OTHER = 'OTHER',
}

export enum LeadStatusEnums {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  DISQUALIFIED = 'DISQUALIFIED',
}

export const leadSources = [
  { label: 'Referral', value: LeadSourceEnums.REFERRAL },
  { label: 'Website', value: LeadSourceEnums.WEBSITE },
  { label: 'Event', value: LeadSourceEnums.EVENT },
  { label: 'Email', value: LeadSourceEnums.EMAIL },
  { label: 'Other', value: LeadSourceEnums.OTHER },
];

export const leadStates = [
  { label: 'New', value: LeadStatusEnums.NEW },
  { label: 'Contacted', value: LeadStatusEnums.CONTACTED },
  { label: 'Qualified', value: LeadStatusEnums.QUALIFIED },
  { label: 'Disqualified', value: LeadStatusEnums.DISQUALIFIED },
];
interface UseLeadsResult {
  leads: Lead[];
  pagination: Pagination;
}
/**
 * Fetches a list of leads from the API
 * @returns {Promise<Lead[]>} A promise that resolves to an array of Lead objects
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getLeads(): Promise<UseLeadsResult> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch('lead');

    if (success) {
      // Return the docs (leads) from the response
      const leads = body?.docs?.map((lead: any) => ({
        ...lead,
        createdAt: formatDate(lead.createdAt),
        // updatedAt: formatDate(lead.updatedAt),
        leadDetails:{title :lead?.name ,text: lead?.companyName},
        updatedAt: '-',
        assign: lead.users?.map((el:any)=> el.name).join(', ') ,
      }));
      const pagination = body?.pagination;
      return { leads, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch leads');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching leads:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching leads. Please try again.');

    // Return an empty array as fallback
    return { leads: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches a single lead from the API
 * @param id - The ID of the lead to fetch
 * @returns {Promise<Lead>} A promise that resolves to a Lead object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getLead(id: string | string[]): Promise<Lead> {
  try {
    let { body: lead, success } = await useApiFetch(`lead/${id}`);
    return lead;
  } catch (error) {
    console.error('Error fetching lead:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching lead. Please try again.');
    return {} as Lead;
  }
}

export async function getActivity(id: string | string[]): Promise<Lead> {
  try {
    let { body: lead, success } = await useApiFetch(`activity/lead/${id}`);
    return lead;
  } catch (error) {
    console.error('Error fetching lead:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching lead. Please try again.');
    return {} as Lead;
  }
}

export interface LeadValues {
  id?: string | string[];
  leadName: string;
  companyName: string;
  email: string;
  phone: string;
  leadSource: string;
  assignUser: string;
  lastContactDate: string;
  notes: string;
  leadState: string;
  otherSource?: string;
}

/**
 * Create a new lead
 * @param values - The values to create the lead with
 * @returns {Promise<void>}
 */

export async function createLead(values: LeadValues) {
  try {
    // Normalize the phone number before sending
    const normalizedPhone = normalizePhoneNumber(values.phone);

    // Prepare the lead data
    const leadData = {
      name: values.leadName,
      companyName: values.companyName,
      email: values.email,
      phone: normalizedPhone,
      leadSource: values.leadSource,
      users: values.assignUser,
      notes: values.notes,
      status: values.leadState,
      otherSource: values.otherSource,
    };

    // Call API to create the lead
    const response = await useApiFetch('lead', 'POST', cleanObject(leadData));

    // Handle the API response
    if (response?.success) {
      handleSuccess('Lead created successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Update an existing lead
 * @param values - The values to update the lead with
 */
export async function updateLead(values: LeadValues) {
  try {
    // Normalize the phone number before sending
    const normalizedPhone = normalizePhoneNumber(values.phone);

    // Prepare the lead data
    const leadData = {
      name: values.leadName,
      companyName: values.companyName,
      email: values.email,
      phone: normalizedPhone,
      leadSource: values.leadSource,
      lastContactDate: getYear(values.lastContactDate),
      users: values.assignUser,
      notes: values.notes,
      status: values.leadState,
      otherSource: values.otherSource,
    };

    // Call API to create the lead
    const response = await useApiFetch(`lead/${values.id}`, 'PUT', leadData);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Lead updated successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}
