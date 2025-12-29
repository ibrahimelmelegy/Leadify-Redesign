import type { RelatedTypesValues, RelatedTypeOptions, RelatedToOptions, ProposalTypeOptions, ProposalInfoPayload } from '~/types/Proposal';
import { getOpportunities } from './useOpportunity';

// Handle error during lead creation
function handleError(message: string) {
  ElNotification({
    type: 'error',
    title: 'Error',
    message,
  });
}
function handleSuccess(message: string, proposalId?: string) {
  ElNotification({
    type: 'success',
    title: 'Success',
    message,
  });
  if (proposalId) {
    navigateTo(`/sales/proposals/editor/content/${proposalId}`); // Navigate to the leads list
  }
}
// Form options
export const proposalRelatedTypes: RelatedTypeOptions[] = [
  { label: 'Opportunity', value: 'Opportunity' },
  { label: 'Deal', value: 'Deal' },
  { label: 'Project', value: 'Project' },
];
export const proposalStatus = [
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Waiting Approval', value: 'WAITING_APPROVAL' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export const ProposalType: ProposalTypeOptions[] = [
  { label: 'Financial', value: 'FINANCIAL' },
  { label: 'Technical', value: 'TECHNICAL' },
  { label: 'Tech & Financial', value: 'MIXED' },
];

export const fileAttachmentsFormats = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/jpg',
  'image/jpeg',
  'image/png'
];
export const proposalRelatedToOptions = ref<RelatedToOptions[]>([]);

export async function fetchRelatedToOptions(type: RelatedTypesValues) {
  const functionMap: { [key in RelatedTypesValues]: Function } = {
    Opportunity: getOpportunities,
    Deal: getDeals,
    Project: getProjects,
  };

  const existingType = type === 'Project' ? 'projects' : type === 'Deal' ? 'deals' : 'opportunties';

  const fetchFunction = functionMap[type];

  const response = await fetchFunction();
  proposalRelatedToOptions.value = response[existingType]?.map((item: any) => ({
    label: item?.name,
    value: item?.id,
  }));

  return proposalRelatedToOptions.value;
}

/**
 * Fetches a single deal from the API
 * @param id - The ID of the deal to fetch
 * @returns {Promise<Deal>} A promise that resolves to a Deal object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getProposal(id: string | string[]): Promise<Deal> {
  try {
    let { body: deal, success } = await useApiFetch(`proposal/${id}`);
    return deal;
  } catch (error) {
    console.error('Error fetching proposal:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching proposal. Please try again.');
    return {} as any;
  }
}

export async function getProposalFinanceTableByPropsalId(proposalId: string | string[]): Promise<Deal> {
  try {
    let { body: table, success } = await useApiFetch(`proposal-finance-table/?page=1&limit=10&proposalId=${proposalId}`);
    return table;
  } catch (error) {
    console.error('Error fetching proposal:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching proposal. Please try again.');
    return {} as any;
  }
}

export async function getProposalFinanceTableItemByTablelId(TablelId: string | string[]): Promise<Deal> {
  try {
    let { body: tableItem, success } = await useApiFetch(`proposal-finance-table-item/?page=1&limit=1000&financeTableId=${TablelId}`);
    return tableItem;
  } catch (error) {
    console.error('Error fetching tableItem:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching table Item. Please try again.');
    return {} as any;
  }
}

export async function createProposalFinanceTable(values: any): Promise<void> {
  try {
    // Prepare the client data
    const ProposalFinanceTableData = {
      ...values,
    };
    // Call API to create the client
    const response = await useApiFetch(`proposal-finance-table`, 'POST', ProposalFinanceTableData);

    // Handle the API response
    if (response?.success) {
      handleSuccess('proposal finance table create successfully', ProposalFinanceTableData?.proposalId);
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function updateProposalFinanceTable(values: any, id: number, proposalId: any): Promise<void> {
  try {
    // Prepare the client data
    const ProposalFinanceTableData = {
      ...values,
    };
    // Call API to create the client
    const response = await useApiFetch(`proposal-finance-table/${id}`, 'PUT', ProposalFinanceTableData);

    // Handle the API response
    if (response?.success) {
      handleSuccess('proposal finance table update successfully', proposalId);
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function updateProposalFinanceTableitem(values: any, id: number, type?: string = 'all'): Promise<void> {
  try {
    // Prepare the client data
    const ProposalFinanceTableData = {
      customColumns :values?.customColumns , 
      qty :values?.qty,
    };
    // Call API to create the client
    const response = await useApiFetch(`proposal-finance-table-item/${id}`, 'PUT', ProposalFinanceTableData);

    // Handle the API response
    if (response?.success) {
      console.log(type);
      if (type === 'one') {
        console.log(type);
        handleSuccess('proposal finance table item update successfully');
      } else {
        handleSuccess('proposal finance table item update successfully', ProposalFinanceTableData?.proposalId);
      }

    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function createProposalFinanceTableitem(values: any, type?: string = 'all'): Promise<void> {
  try {
    // Prepare the client data
    const ProposalFinanceTableData = {
      ...values,
    };
    // Call API to create the client
    const response = await useApiFetch(`proposal-finance-table-item`, 'POST', ProposalFinanceTableData);

    // Handle the API response
    if (response?.success) {
      if (type === 'one') {
        handleSuccess('proposal finance table item create successfully');
      } else {
        handleSuccess('proposal finance table item create successfully', ProposalFinanceTableData?.proposalId);
      }
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function deleteProposalFinanceTableItem(id: number): Promise<void> {
  try {
    // Call API to create the client
    const response = await useApiFetch(`proposal-finance-table-item/${id}`, 'DELETE');

    // Handle the API response
    if (response?.success) {
      ElNotification({
        type: 'success',
        title: 'Success',
        message: 'proposal finance table DELETE successfully',
      });

    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}


export async function deleteCustomColumn(idFinanceTable: number, columnKey: string): Promise<void> {
  try {
    // Call API to create the client
    const response = await useApiFetch(`proposal-finance-table/${idFinanceTable}/${columnKey}`, 'DELETE');

    // Handle the API response
    if (response?.success) {
      handleSuccess('column DELETE successfully');
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}
/**
 * Creates a new proposal
 * @param values - The values to create the proposal with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 * @returns {Promise<void>} A promise that resolves when the proposal is created
 */
export async function createProposal(values: ProposalInfoPayload): Promise<void> {
  try {
    let formattedValues = {
      ...values,
      fileAttachments: values?.file?.map((el: any) => el?.response),
      relatedEntityId: values?.relatedEntityId == "" ? undefined : values?.relatedEntityId,
      relatedEntityType: values?.relatedEntityType == "" ? undefined : values?.relatedEntityType
    };
    delete formattedValues.file;
    // Call API to create the proposal
    const response = await useApiFetch('proposal', 'POST', formattedValues);

    // Handle the API response
    if (response?.success) {
      ElNotification({
        type: 'success',
        title: 'Success',
        message: 'proposal  create successfully',
      });
      navigateTo(`/sales/proposals/add-table/${response.body?.id}`);
    } else {
      const errorMessage = response?.message || 'Something went wrong';
      ElNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    // await fetchExistingProject();
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ElNotification({
      type: 'error',
      title: 'Error',
      message: errorMessage,
    });
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}


export async function updateProposal(values: any): Promise<void> {
  try {
    console.log(values)
    // Call API to create the proposal
    const proposalData = {
      relatedEntityId: values?.relatedEntityId == "" ? undefined : values?.relatedEntityId,
      relatedEntityType: values?.relatedEntityType == "" ? undefined : values?.relatedEntityType,
      title: values?.title ?? undefined,
      version: values?.version ?? undefined,
      content: values?.content ?? undefined,
      // users: values.users?.map((el:any) => el?.id ?? el),
      notes: values?.notes ?? undefined,
      type: values?.type ?? undefined,
      companyLogo: values?.companyLogo ?? undefined,
      proposalFor: values?.proposalFor ?? undefined,
      reference: values?.reference ?? undefined,
      fileAttachments: values?.file?.map((el: any) => el?.response) ?? undefined,
    };
    if (values.status) {
      const responseChange = values.status == "reject" ? await useApiFetch(`proposal/reject/${values.id}`, 'PUT', {
        rejectionReason: values.reason,
      }) : values.status == "waiting-approval" ? await useApiFetch(`proposal/waiting-approval/${values.id}`, 'PUT') :
        await useApiFetch(`proposal/approve/${values.id}`, 'PUT');
      // Handle the API response
      if (responseChange?.success) {
        ElNotification({
          type: 'success',
          title: 'Success',
          message: `proposal update status (${values.status}) successfully`,
        })
        navigateTo(`/sales/proposals`);

      }
      else {
        const errorMessage = responseChange?.message || 'Something went wrong';
        ElNotification({
          type: 'error',
          title: 'Error',
          message: errorMessage,
        });
        throw new Error(errorMessage); // Throw an error to be caught in the calling function
      }
    }
    else {
      const response = await useApiFetch(`proposal/${values.id}`, 'PUT', {
        ...proposalData,
      });
      // Handle the API response
      if (response?.success) {
        ElNotification({
          type: 'success',
          title: 'Success',
          message: 'proposal update successfully',
        })
        navigateTo(`/sales/proposals`);

      }
      else {
        const errorMessage = response?.message || 'Something went wrong';
        ElNotification({
          type: 'error',
          title: 'Error',
          message: errorMessage,
        });
        throw new Error(errorMessage); // Throw an error to be caught in the calling function
      }
    }

    // await fetchExistingProject();
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ElNotification({
      type: 'error',
      title: 'Error',
      message: errorMessage,
    });
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}
