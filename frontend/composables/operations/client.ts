import { ElNotification } from "element-plus";
// Helper function to normalize phone numbers
function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/^\+/, "").replace(/^2/, ""); // Assuming removing country code prefix '2', modify if needed
}
// Handle error during client creation
function handleError(message: string) {
  ElNotification({
    type: "error",
    title: "Error",
    message,
  });
}
function handleSuccess(message: string ,route?:boolean) {
  ElNotification({
    type: "success",
    title: "Success",
    message,
  });
  !route ? navigateTo("/sales/clients") : window.location.reload();; // Navigate to the clients list
}

export enum ClientTypeEnums {
  INDIVIDUAL = "INDIVIDUAL",
  CORPORATE = "CORPORATE",
}

export const clientTypes = [
  { label: "Individual", value: ClientTypeEnums.INDIVIDUAL },
  { label: "Corporate", value: ClientTypeEnums.CORPORATE },
];

export enum ClientStatusEnums {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const clientStatuses = [
  { label: "Active", value: ClientStatusEnums.ACTIVE },
  { label: "Inactive", value: ClientStatusEnums.INACTIVE },
];

export enum ClientIndustryEnums {
  AGRICULTURE_FARMING = "Agriculture & Farming",
  AUTOMOTIVE = "Automotive",
  BANKING_FINANCIAL_SERVICES = "Banking & Financial Services",
  BIOTECH_PHARMA = "Biotechnology & Pharmaceuticals",
  CONSTRUCTION_REAL_ESTATE = "Construction & Real Estate",
  CONSULTING_PROFESSIONAL_SERVICES = "Consulting & Professional Services",
  CONSUMER_GOODS_RETAIL = "Consumer Goods & Retail",
  EDUCATION_E_LEARNING = "Education & E-Learning",
  ENERGY_UTILITIES = "Energy & Utilities",
  ENTERTAINMENT_MEDIA = "Entertainment & Media",
  FOOD_BEVERAGE = "Food & Beverage",
  GOVERNMENT_PUBLIC_SECTOR = "Government & Public Sector",
  HEALTHCARE_MEDICAL_SERVICES = "Healthcare & Medical Services",
  HOSPITALITY_TOURISM = "Hospitality & Tourism",
  IT_SOFTWARE = "Information Technology (IT) & Software",
  INSURANCE = "Insurance",
  LEGAL_SERVICES = "Legal Services",
  MANUFACTURING = "Manufacturing",
  MARKETING_ADVERTISING = "Marketing & Advertising",
  NON_PROFIT_NGOS = "Non-Profit & NGOs",
  TELECOMMUNICATIONS = "Telecommunications",
  TRANSPORTATION_LOGISTICS = "Transportation & Logistics",
}

export const clientIndustries = [
  { label: "Agriculture & Farming", value: ClientIndustryEnums.AGRICULTURE_FARMING },
  { label: "Automotive", value: ClientIndustryEnums.AUTOMOTIVE },
  { label: "Banking & Financial Services", value: ClientIndustryEnums.BANKING_FINANCIAL_SERVICES },
  { label: "Biotechnology & Pharmaceuticals", value: ClientIndustryEnums.BIOTECH_PHARMA },
  { label: "Construction & Real Estate", value: ClientIndustryEnums.CONSTRUCTION_REAL_ESTATE },
  { label: "Consulting & Professional Services", value: ClientIndustryEnums.CONSULTING_PROFESSIONAL_SERVICES },
  { label: "Consumer Goods & Retail", value: ClientIndustryEnums.CONSUMER_GOODS_RETAIL },
  { label: "Education & E-Learning", value: ClientIndustryEnums.EDUCATION_E_LEARNING },
  { label: "Energy & Utilities", value: ClientIndustryEnums.ENERGY_UTILITIES },
  { label: "Entertainment & Media", value: ClientIndustryEnums.ENTERTAINMENT_MEDIA },
  { label: "Food & Beverage", value: ClientIndustryEnums.FOOD_BEVERAGE },
  { label: "Government & Public Sector", value: ClientIndustryEnums.GOVERNMENT_PUBLIC_SECTOR },
  { label: "Healthcare & Medical Services", value: ClientIndustryEnums.HEALTHCARE_MEDICAL_SERVICES },
  { label: "Hospitality & Tourism", value: ClientIndustryEnums.HOSPITALITY_TOURISM },
  { label: "Information Technology (IT) & Software", value: ClientIndustryEnums.IT_SOFTWARE },
  { label: "Insurance", value: ClientIndustryEnums.INSURANCE },
  { label: "Legal Services", value: ClientIndustryEnums.LEGAL_SERVICES },
  { label: "Manufacturing", value: ClientIndustryEnums.MANUFACTURING },
  { label: "Marketing & Advertising", value: ClientIndustryEnums.MARKETING_ADVERTISING },
  { label: "Non-Profit & NGOs", value: ClientIndustryEnums.NON_PROFIT_NGOS },
  { label: "Telecommunications", value: ClientIndustryEnums.TELECOMMUNICATIONS },
  { label: "Transportation & Logistics", value: ClientIndustryEnums.TRANSPORTATION_LOGISTICS },
];

interface Client {
  leadId: string;
  clientName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  clientType: "Individual" | "Company";
  streetAddress: string;
  city: string;
  state: "Active" | "Inactive";
  zipCode: string;
  industry: string;
  users: number[];
  clientStatus: "Active" | "Inactive";
  fileUpload: string[];
  [key: string]: any;
}

interface UseClientsResult {
  clients: Client[];
  pagination: Pagination;
}
/**
 * Fetches a list of clients from the API
 * @returns {Promise<Client[]>} A promise that resolves to an array of Client objects
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getClients(): Promise<UseClientsResult> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch('client');

    if (success) {
      // Return the docs (leads) from the response
      const clients = body?.docs?.map((client: any) => ({
        ...client,
        ClientDetails :{title : client?.clientName , text:client?.companyName},
        createdAt: formatDate(client.createdAt),
        // updatedAt: formatDate(lead.updatedAt),
        updatedAt: '-',
        assign: client.users?.map((el:any)=> el.name).join(', ') ,
      }));
      const pagination = body?.pagination;
      return { clients, pagination };
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
    return { clients: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches a single client from the API
 * @param id - The ID of the client to fetch
 * @returns {Promise<Client>} A promise that resolves to a Client object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getClient(id: string | string[]): Promise<Client> {
  try {
    let { body: lead, success } = await useApiFetch(`client/${id}`);
    return lead;
  } catch (error) {
    console.error("Error fetching lead:", error instanceof Error ? error.message : error);
    handleError("An error occurred while fetching lead. Please try again.");
    return {} as Client;
  }
}

export async function getClientActivity(id: string | string[]): Promise<Lead> {
  try {
    let { body: lead, success } = await useApiFetch(`activity/client/${id}`);
    return lead;
  } catch (error) {
    console.error("Error fetching lead:", error instanceof Error ? error.message : error);
    handleError("An error occurred while fetching client. Please try again.");
    return {} as Lead;
  }
}

/**
 * Creates a new client by sending the provided values to the API.
 * @param values - An object containing the client details to be created.
 * @returns {Promise<void>} A promise that resolves when the client is successfully created.
 * @throws {Error} If the API call is unsuccessful, an error is handled and logged.
 */
export async function createClient(values: any , route?:boolean): Promise<void> {
  try {
    // Normalize the phone number before sending
    const normalizedPhone = normalizePhoneNumber(values.phone);

    // Prepare the client data
    const clientData = {
      ...values,
      phoneNumber: normalizedPhone,
    };
    delete clientData.phone;

    // Call API to create the client
    const response = await useApiFetch("client", "POST", clientData);

    // Handle the API response
    if (response?.success) {
      handleSuccess("Client created successfully" ,route);
    } else {
      handleError(response?.message || "Something went wrong");
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : "Unknown error");
  }
}

/**
 * Updates an existing client by sending the provided values to the API.
 * @param values - An object containing the client details to be updated.
 * @returns {Promise<void>} A promise that resolves when the client is successfully updated.
 * @throws {Error} If the API call is unsuccessful, an error is handled and logged.
 */
export async function updateClient(values: any): Promise<void> {
  try {
    // Normalize the phone number before sending
    const normalizedPhone = normalizePhoneNumber(values.phone);

    // Prepare the client data
    const clientData = {
      ...values,
      phoneNumber: normalizedPhone,
    };
    delete clientData.phone;
    delete clientData.id;

    // Call API to create the client
    const response = await useApiFetch(`client/${values.id}`, "PUT", clientData);

    // Handle the API response
    if (response?.success) {
      handleSuccess("Client updated successfully");
    } else {
      handleError(response?.message || "Something went wrong");
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : "Unknown error");
  }
}
