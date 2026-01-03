import { ElNotification } from 'element-plus';

// Handle error during service creation
function handleError(message: string) {
  ElNotification({
    type: 'error',
    title: 'Error',
    message,
  });
}
function handleSuccess(message: string, id?: string) {
  ElNotification({
    type: 'success',
    title: 'Success',
    message,
  });
  if (id) {
    navigateTo(`/operations/projects/${id}`); // Navigate to the service details
  } else {
    navigateTo('/operations/projects'); // Navigate to the project list
  }
}

enum projectCategory {
  Direct = 'Direct',
  Etimad = 'Etimad',
}
export const projectCategories = [
  { label: 'Direct Project', value: projectCategory.Direct },
  { label: 'Etimad Project', value: projectCategory.Etimad },
];

enum projectStatus {
  active = 'ACTIVE',
  cancelled = 'CANCELLED',
  onHold = 'ON_HOLD',
  completed = 'COMPLETE',
}
export const projectStatuses = [
  { label: 'Active', value: projectStatus.active },
  { label: 'Cancelled', value: projectStatus.cancelled },
  { label: 'On Hold', value: projectStatus.onHold },
  { label: 'Completed', value: projectStatus.completed },
];

enum contractType {
  purchased = 'PURCHASED',
  subContractor = 'SUBCONTRACTOR',
  invitation = 'INVITATION',
}
export const contractTypes = [
  { label: 'Purchased', value: contractType.purchased },
  { label: 'Sub Contractor', value: contractType.subContractor },
  { label: 'Invitation', value: contractType.invitation },
];

enum proposalStatus {
  underDeveloping = 'UNDER_DEVELOPING',
  finished = 'FINISHED',
  cancelled = 'CANCELLED',
}
export const proposalStatuses = [
  { label: 'Under Developing', value: proposalStatus.underDeveloping },
  { label: 'Finished', value: proposalStatus.finished },
  { label: 'Cancelled', value: proposalStatus.cancelled },
];

enum applicationStatus {
  underReview = 'UNDER_REVIEW',
  won = 'WON',
  lost = 'LOST',
}
export const applicationStatuses = [
  { label: 'Under Review', value: applicationStatus.underReview },
  { label: 'Won', value: applicationStatus.won },
  { label: 'Lost', value: applicationStatus.lost },
];

export enum MissionEnum {
  Standard = 'Standard',
  Helper = 'Helper',
  SiteEngineer = 'SiteEngineer',
  Engineer = 'Engineer',
}

export const projectMissions = [
  { label: 'Standard', value: MissionEnum.Standard },
  { label: 'Helper', value: MissionEnum.Helper },
  { label: 'Site Engineer', value: MissionEnum.SiteEngineer },
  { label: 'Engineer', value: MissionEnum.Engineer },
];

interface BasicInfoValues {
  name?: string;
  type?: string;
  category?: string;
  client?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  duration?: number;
  assignUser?: string[];
  status?: string;
  description?: string;
  cancelledReason?: string;
  etimadInfo?: EtimadProjectInfoValues;
  [key: string]: any;
}

interface EtimadProjectInfoValues {
  abbreviation?: string;
  organizationName?: string;
  rfpName?: string;
  contractType?: string;
  tenderPrice?: string | number;
  businessLine?: string;
  estimatedBudget?: string | number;
  companyMargin?: string | number;
  submissionDate?: Date | string;
  proposalStatus?: string;
  applicationStatus?: string;
}

export interface ProjectManpower {
  projectId?: string;
  manpowerId?: string;
  estimatedWorkDays?: number;
  mission?: string[]; // Array of strings for the mission
  foodAllowanceCost?: number;
  otherCosts?: number;
  otherCostsReason?: string;
  [key: string]: any;
}

export interface CombinedProjectValues extends BasicInfoValues, EtimadProjectInfoValues {}
export interface ProjectInfo {
  projectId?: string;
  basicInfo: BasicInfoValues;
}

export const project = ref<CombinedProjectValues>({});
export const projectId = ref<string | null>();

export async function getProjects(all?:false): Promise<CombinedProjectValues> {
  try {
    // Make the API call
    const { body, success, message } = all ? await useApiFetch('project?limit=1000') : await useApiFetch('project');

    if (success) {
      // Return the docs (c) from the response
      const projects = body?.docs?.map((project: any) => ({
        ...project,
        createdAt: formatDate(project.createdAt),
      }));
      const pagination = body?.pagination;
      return { projects, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch projects');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching projects:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching projects. Please try again.');

    // Return an empty array as fallback
    return { projects: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches an existing project based on the query parameter `projectId`.
 * If `projectId` is not present in the query, it attempts to fetch a project draft.
 * If a draft project is retrieved successfully, it updates the project state,
 * navigates to the route with the draft's ID, and sets the `projectId`.
 * If `projectId` is present in the query, it simply sets the `projectId` value.
 */
export const fetchExistingProject = async () => {
  let existingProject;
  const route = useRoute();
  if (route.params.slug) {
    existingProject = await getProject(route.params.slug.toString());
    if (existingProject?.id) project.value = existingProject;
  } else {
    existingProject = await getProjectDraft();
    if (existingProject?.project?.id) project.value = { ...existingProject.project, step: existingProject.step };
  }
  if (project.value?.id) {
    projectId.value = project.value.id;
  }
};

/**
 * Fetches a draft project from the API
 * @returns {Promise<CombinedProjectValues>} A promise that resolves to a CombinedProjectValues object containing the draft project
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getProjectDraft(): Promise<CombinedProjectValues> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch('project/draft');

    if (success) {
      // Return the docs (project) from the response
      return body;
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch draft project');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching draft project:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    // handleError('An error occurred while fetching draft project. Please try again.');

    // Return an empty array as fallback
    return {};
  }
}

/**
 * Fetches a project by its ID from the API.
 * @param id - The ID of the project to fetch.
 * @returns {Promise<CombinedProjectValues>} A promise that resolves to a CombinedProjectValues object containing the project details.
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message.
 */
export async function getProject(id: string): Promise<CombinedProjectValues> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch(`project/${id}`);

    if (success) {
      // Return the docs (project) from the response
      return body;
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch draft project');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching draft project:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching draft project. Please try again.');

    // Return an empty array as fallback
    return {};
  }
}

export async function getProjectActivity(id: string | string[]): Promise<Lead> {
  try {
    let { body: lead, success } = await useApiFetch(`activity/project/${id}`);
    return lead;
  } catch (error) {
    console.error('Error fetching lead:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching project. Please try again.');
    return {} as Lead;
  }
}

/**
 * Creates a new project
 * @param values - The values to create the project with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 * @returns {Promise<void>} A promise that resolves when the project is created
 */
export async function createProject(values: ProjectInfo): Promise<void> {
  try {
    // Call API to create the project
    const response = await useApiFetch('project/create', 'POST', {
      ...values,
      ...(projectId.value && { projectId: projectId.value }),
    });

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    await fetchExistingProject();
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}

export async function updateProject(values: any): Promise<void> {
  try {
    // Call API to create the project
    console.log(values)
    const response = await useApiFetch(`project/create`, 'POST',values );

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    await fetchExistingProject();
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}

/**
 * Creates associated vehicles for a given project
 * @param values - The IDs of the vehicles to be associated with the project
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 * @returns {Promise<void>} A promise that resolves when the associated vehicles are created
 */
export async function createtAssociatedVehicles(values: { vehiclesIds: string[] }): Promise<void> {
  try {
    // Call API to create the associated vehicles
    const response = await useApiFetch(`project/associating-vehicles/${projectId.value}`, 'PUT', values);

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    await fetchExistingProject();
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}

export async function createtAssociatedManPower(values: {
  accommodationCost?: number;
  foodCostPerDay?: number;
  managementAdditionPercentage?: number;
}): Promise<void> {
  try {
    // Call API to create the associated manpower
    const response = await useApiFetch(`project/associating-manpower/${projectId.value}`, 'PUT', values);

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    await fetchExistingProject();
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}

export async function createtAssociatedMaterial(values: {
  materialMargin?: number;
  additionalMaterialItems?: Object;
  materialsIds?: number[];
}): Promise<void> {
  try {
    // Call API to create the associated manpower
    const response = await useApiFetch(`project/associating-materials/${projectId.value}`, 'PUT', values);

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    await fetchExistingProject();
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}

export async function createtMaterial(values: {
  serviceId?: string;
  unitPrice?: number;
  quantity?: number;
  description?: string;
  materialCategoryId?: number;
}): Promise<void> {
  try {
    // Call API to create the material
    const response = await useApiFetch(`material`, 'POST', values);

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    return response.body;
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}

/**
 * Creates associated assets for a given project
 * @param values - The IDs of the assets to be associated with the project
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 * @returns {Promise<void>} A promise that resolves when the associated assets are created
 */
export async function createtAssociatedAssets(values: { assetIds: string[] }): Promise<void> {
  try {
    // Call API to create the associated assets
    const response = await useApiFetch(`project/associating-asset/${projectId.value}`, 'PUT', values);

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    await fetchExistingProject();
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
    throw new Error(errorMessage); // Re-throw the error to propagate it to the calling function
  }
}

/**
 * Creates a new project manpower
 * @param values - The values to create the project manpower with
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 * @returns {Promise<void>} A promise that resolves when the project manpower is created
 */
export async function createProjectManPower(values: ProjectManpower): Promise<void> {
  try {
    // Call API to create the project manpower
    const response = await useApiFetch('project-manpower', 'POST', {
      ...values,
      ...(projectId.value && { projectId: projectId.value }),
    });

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

export async function updateProjectManPower(values: ProjectManpower, id: string): Promise<void> {
  try {
    // Call API to update the project manpower
    const response = await useApiFetch(`project-manpower/${id}`, 'PUT', {
      ...values,
      ...(projectId.value && { projectId: projectId.value }),
    });

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

/**
 * Fetches the project manpower details from the API.
 * @returns {Promise<ProjectManpower>} A promise that resolves to a ProjectManpower object.
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message.
 */
export async function getProjectManpowers(): Promise<ProjectManpower[]> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch('project-manpower');

    if (success) {
      // Return the docs (project manpower) from the response
      return body.docs;
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch draft project');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching draft project:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching draft project. Please try again.');

    // Return an empty array as fallback
    return [];
  }
}

export async function getProjectManpower(id: string): Promise<ProjectManpower> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch(`project-manpower/${id}`);

    if (success) {
      // Return the docs (project manpower) from the response
      return body;
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch draft project');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching draft project:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching draft project. Please try again.');

    // Return an empty array as fallback
    return {};
  }
}

/**
 * Deletes a project manpower by its ID.
 * @param id - The ID of the project manpower to delete.
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message.
 */
export async function deleteProjectManPower(id: string) {
  try {
    // Call API to delete the project manpower
    const response = await useApiFetch(`project-manpower/${id}`, 'DELETE');

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    return true;
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
    return false;
  }
}

/**
 * Completes the project creation process by sending a request to the API.
 * @param values - An object containing optional values for project completion, such as a discount.
 * @returns {Promise<void>} A promise that resolves when the project is completed successfully.
 * @throws {Error} If the API call is unsuccessful, an error is handled and logged.
 */
export async function completeProject(values: { discount?: number }): Promise<void> {
  try {
    const response = await useApiFetch(`project/complete-project-creation/${projectId.value}`, 'PUT', values);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Project created successfully');
      projectId.value = '';
      project.value = {};
    } else {
      handleError(response?.message || 'Something went wrong');
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Deletes a project by its ID.
 * @param id - The ID of the project to delete.
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message.
 */
export async function deleteProject() {
  const route = useRoute();
  try {
    // Check if projectId is defined
    if (!projectId.value || route.path.includes('edit')) {
      navigateTo('/operations/projects');
      return;
    }
    // Call API to delete the project
    const response = await useApiFetch(`project/${projectId.value}`, 'DELETE');

    // Handle the API response
    if (!response?.success) {
      const errorMessage = response?.message || 'Something went wrong';
      handleError(errorMessage);
      throw new Error(errorMessage); // Throw an error to be caught in the calling function
    }
    navigateTo('/operations/projects');
    projectId.value = '';
    project.value = {};
  } catch (error) {
    // Catch any unexpected errors and handle them
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handleError(errorMessage);
  }
}
