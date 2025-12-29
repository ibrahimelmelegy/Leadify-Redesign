import { ElNotification } from 'element-plus';
// Handle error during Opportunity creation
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
  navigateTo('/sales/opportunity'); // Navigate to the opportunties list
}

export interface Leads {
  name?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  users?: number;
}

export interface Opportunities {
  name?: string;
  stage?: string;
  estimatedValue?: number;
  expectedCloseDate?: string;
  priority?: string;
  interestedIn?: string;
  nextSteps?: string;
  reasonOfLose?: string;
  users?: number;
  [key: string]: any;
}

export interface FormattedValues {
  leads?: Leads;
  opportunities?: Opportunities;
  [key: string]: any;
}

interface UseOpportunitiesResult {
  opportunties: Opportunities[];
  pagination: Pagination;
}

export enum StageEnum {
  Discovery = 'DISCOVERY',
  Proposal = 'PROPOSAL',
  Negotiation = 'NEGOTIATION',
  Lost = 'LOST',
  Won = 'WON',
}

export const stageOptions = [
  { label: 'Discovery', value: StageEnum.Discovery },
  { label: 'Proposal', value: StageEnum.Proposal },
  { label: 'Negotiation', value: StageEnum.Negotiation },
  { label: 'Lost', value: StageEnum.Lost },
  { label: 'Won', value: StageEnum.Won },
];

export enum priorityEnum {
  VeryLow = 'VERY_LOW',
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  VeryHigh = 'VERY_HIGH',
}

export const priorityOptions = [
  { label: 'Very Low', value: priorityEnum.VeryLow },
  { label: 'Low', value: priorityEnum.Low },
  { label: 'Medium', value: priorityEnum.Medium },
  { label: 'High', value: priorityEnum.High },
  { label: 'Very High', value: priorityEnum.VeryHigh },
];

export enum stepsEnum {
  ScheduleMeeting = 'Schedule Meeting',
  SendProposal = 'Send Proposal',
  FollowUpCall = 'Follow-Up Call',
  NegotiateTerms = 'Negotiate Terms',
  CloseTheDeal = 'Close the Deal',
}

export const stepsOptions = [
  { label: 'Schedule Meeting', value: stepsEnum.ScheduleMeeting },
  { label: 'Send Proposal', value: stepsEnum.SendProposal },
  { label: 'Follow-Up Call', value: stepsEnum.FollowUpCall },
  { label: 'Negotiate Terms', value: stepsEnum.NegotiateTerms },
  { label: 'Close the Deal', value: stepsEnum.CloseTheDeal },
];

export enum reasonEnum {
  NotInterested = 'Not Interested',
  NoBudget = 'No Budget',
  CompetitorChosen = 'Competitor Chosen',
  Other = 'Other',
}

export const reasonOptions = [
  { label: 'Not Interested', value: reasonEnum.NotInterested },
  { label: 'No Budget', value: reasonEnum.NoBudget },
  { label: 'Competitor Chosen', value: reasonEnum.CompetitorChosen },
  { label: 'Other', value: reasonEnum.Other },
];
/**
 * Fetches a list of opportunties from the API
 * @returns {Promise<Opportunities[]>} A promise that resolves to an array of Opportunities objects
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getOpportunities(all?:false): Promise<UseOpportunitiesResult> {
  try {
    // Make the API call
    const { body, success, message } = all ? await useApiFetch('opportunity?limit=1000') : await useApiFetch('opportunity');

    if (success) {
      // Return the docs (opportunties) from the response
      const opportunties = body?.docs?.map((opportunity: any) => ({
        ...opportunity,
        createdAt: formatDate(opportunity.createdAt),
        // updatedAt: formatDate(opportunity.updatedAt),
        updatedAt: '-',
        assign: opportunity.user?.name,
      }));
      const pagination = body?.pagination;
      return { opportunties, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch opportunties');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching opportunties:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching opportunties. Please try again.');

    // Return an empty array as fallback
    return { opportunties: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches a single opportunity from the API
 */
export async function getOpportunity(id: string | string[]): Promise<Opportunities> {
  try {
    let { body: opportunity, success } = await useApiFetch(`opportunity/${id}`);
    return opportunity;
  } catch (error) {
    console.error('Error fetching opportunity:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching opportunity. Please try again.');
    return {} as Opportunities;
  }
}

export async function getOpportunityActivity(id: string | string[]): Promise<Lead> {
  try {
    let { body: lead, success } = await useApiFetch(`activity/opportunity/${id}`);
    return lead;
  } catch (error) {
    console.error('Error fetching lead:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching opportunity. Please try again.');
    return {} as Lead;
  }
}

/**
 * Create a new opportunity
 * @param values - The values to create the opportunity with
 * @returns {Promise<void>}
 */

export async function createOpportunity(values: FormattedValues) {
  try {
    // Call API to create the opportunity
    const response = await useApiFetch('opportunity', 'POST', values);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Opportunity created successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Update an existing opportunity
 * @param values - The values to update the opportunity with
 */
export async function updateOpportunity(values: FormattedValues, id: string | string[]) {
  try {
    // Call API to create the opportunity
    const response = await useApiFetch(`opportunity/${id}`, 'PUT', values);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Opportunity updated successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Convert a lead to an opportunity
 * @param values - The values to create the opportunity with
 */
export async function convertLeadToOpportunity(values: Opportunities) {
  try {
    // Call API to create the opportunity
    const response = await useApiFetch(`opportunity/convert-lead`, 'POST', values);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Opportunity Added successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}
