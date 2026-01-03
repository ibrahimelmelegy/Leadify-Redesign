import { ElNotification } from 'element-plus'

// Handle error during task operations
function handleError(message: string) {
  ElNotification({
    type: 'error',
    title: 'Error',
    message,
  })
}

function handleSuccess(message: string) {
  ElNotification({
    type: 'success',
    title: 'Success',
    message,
  })
  navigateTo('/operations/daily-task')
}

export enum TaskStatus {
  WAITING_FOR_CONTRACT = 'WAITING_FOR_CONTRACT',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED= 'COMPLETED'

}

export const taskStatusOptions = [
  { label: 'Waiting for Contract', value: TaskStatus.WAITING_FOR_CONTRACT },
  { label: 'Contract Signed', value: TaskStatus.CONTRACT_SIGNED },
  { label: 'Active', value: TaskStatus.ACTIVE },
  { label: 'Completed', value: TaskStatus.COMPLETED },
  { label: 'On Hold', value: TaskStatus.ON_HOLD },
]

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export const taskPriorityOptions = [
  { label: 'High', value: TaskPriority.HIGH },
  { label: 'Medium', value: TaskPriority.MEDIUM },
  { label: 'Low', value: TaskPriority.LOW },
]

export interface DailyTask {
  id?: string
  name: string
  priority: TaskPriority
  salesRepresentativeId: number
  userId: number
  clientId: string
  startDate: string
  endDate: string
  status: TaskStatus
  cost: number
  downPayment: number
  totalPaid: number
  notes: string
}

interface UseDailyTaskResult {
  tasks: DailyTask[]
  pagination: {
    totalItems: number
    page: number
    limit: number
    totalPages: number
  }
}

/**
 * Fetches a list of daily tasks from the API
 * @returns {Promise<UseDailyTaskResult>} A promise that resolves to an object containing the tasks and pagination
 */
export async function getDailyTasks(all?: boolean): Promise<UseDailyTaskResult> {
  try {
    const { body, success, message } = all ? 
      await useApiFetch('daily-task?limit=1000') : 
      await useApiFetch('daily-task')

    if (success) {
      const tasks = body?.docs?.map((task: any) => ({
        ...task,
        createdAt: formatDate(task.createdAt),
        updatedAt: '-',
        clientName: task.client?.clientName,
        salesRepresentativeName: task.salesRepresentative?.name,
        assignedToName: task.user?.name,

      }))
      const pagination = body?.pagination
      return { tasks, pagination }
    } else {
      throw new Error(message || 'Failed to fetch Daily Tasks')
    }
  } catch (error) {
    console.error('Error fetching daily tasks:', error instanceof Error ? error.message : error)
    handleError('An error occurred while fetching daily tasks. Please try again.')
    return { 
      tasks: [], 
      pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } 
    }
  }
}

/**
 * Fetches a single daily task from the API
 * @param id - The ID of the task to fetch
 * @returns {Promise<DailyTask>} A promise that resolves to a DailyTask object
 */
export async function getDailyTask(id: string | string[]): Promise<DailyTask> {
  try {
    const { body: task, success } = await useApiFetch(`daily-task/${id}`)
    return task
  } catch (error) {
    console.error('Error fetching daily task:', error instanceof Error ? error.message : error)
    handleError('An error occurred while fetching daily task. Please try again.')
    return {} as DailyTask
  }
}

/**
 * Creates a new daily task
 * @param values - The values to create the task with
 */
export async function createDailyTask(values: DailyTask) {
  try {
    const dataSend = {
      ...values,
      clientId: values?.clientId == "" ? undefined : values?.clientId
    }
    const response = await useApiFetch('daily-task', 'POST', dataSend)

    if (response?.success) {
      handleSuccess('Daily task created successfully')
    } else {
      handleError(response?.message || 'Something went wrong')
    }
  } catch (error) {
    handleError(error instanceof Error ? error.message : 'Unknown error')
  }
}

/**
 * Updates an existing daily task
 * @param values - The values to update the task with
 */
export async function updateDailyTask(values: DailyTask , id:string)  {
  try {
     const dataSend = {
      ...values,
      clientId: values?.clientId == "" ? undefined : values?.clientId
    }
    const response = await useApiFetch(`daily-task/${id}`, 'PUT', dataSend)

    if (response?.success) {
      handleSuccess('Daily task updated successfully')
    } else {
      handleError(response?.message || 'Something went wrong')
    }
  } catch (error) {
    handleError(error instanceof Error ? error.message : 'Unknown error')
  }
}

/**
 * Deletes a daily task
 * @param id - The ID of the task to delete
 */
export async function deleteDailyTask(id: string) {
  try {
    const response = await useApiFetch(`daily-task/${id}`, 'DELETE')

    if (response?.success) {
      handleSuccess('Daily task deleted successfully')
    } else {
      handleError(response?.message || 'Something went wrong')
    }
  } catch (error) {
    handleError(error instanceof Error ? error.message : 'Unknown error')
  }
}

export const dailyTaskStatisticsLoading = ref(false);

export async function getDailyTaskStatistics(): Promise<any> {
  dailyTaskStatisticsLoading.value = true;
  const { body, success, message } = await useApiFetch("daily-task/statistics");
  dailyTaskStatisticsLoading.value = false;
  if (!success) {
    throw new Error(message || "Failed to fetch daily task statistics");
  }

  const toNameValueArray = (obj: Record<string, number>): { name: string; value: number }[] =>
    Object.entries(obj).map(([name, value]) => ({ name: capitalizeName(name), value }));
  const {
    activeTasks = 0,
    completedTasks = 0,
    grantedTasks = 0,
    totalRevenue = 0,
    taskStatusPercentage = {},
    monthlyRevenue = [],
    taskDistributionByClient = [],
    salesPerformance = [],
  } = body || {};

  return {
    ...body,
    taskStatusPercentage: toNameValueArray(taskStatusPercentage),
    taskDistributionByClient: taskDistributionByClient.map(({ clientName, taskCount }: any) => ({
      name: clientName,
      value: taskCount,
    })),
    salesPerformance: salesPerformance.map(({ name, tasksCount, totalPaid }: any) => ({
      name: name,
      value: tasksCount,
      value2: totalPaid,
    })),
    monthlyRevenue: monthlyRevenue.map(({ month, totalPaid }: any) => ({
      name: month,
      value: totalPaid,
    })),
  };
}


