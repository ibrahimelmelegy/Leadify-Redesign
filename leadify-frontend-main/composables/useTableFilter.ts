export const globalFilterOptions = ref<Record<string, string | string[] | number[]>>({});

export default async function useTableFilter(
  position: string = "lead",
  queryParams: Record<string, string | string[] | number[]> = {}
) {
  const route = useRoute();
  const router = useRouter();

  // Function to filter out null/undefined or empty values
  const filterValidParams = (params: Record<string, any>) => {
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (
        value !== null && // Exclude null values
        value !== undefined && // Exclude undefined
        (Array.isArray(value) ? value.length > 0 : value !== "") // Exclude empty arrays or strings
      ) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  };

  // Function to build query string from parameters
  const buildQueryString = (params: Record<string, string | string[] | number[]>) => {
    const query: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        query.push(`${key}=${value.map(encodeURIComponent).join(",")}`); // Handle arrays
      } else {
        query.push(`${key}=${encodeURIComponent(value)}`); // Handle strings and numbers
      }
    }
    return query.length > 0 ? `?${query.join("&")}` : ""; // Append `?` only if there are valid params
  };

  // Merge and normalize query parameters
  const normalizeQueryParams = (params: Record<string, any>) => {
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (typeof value === "string" && value.includes(",")) {
        acc[key] = value.split(","); // Convert comma-separated strings into arrays
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | string[]>);
  };

  // Filter, normalize, and merge query parameters
  const validParams = filterValidParams({
    ...route.query,
    ...queryParams,
  });

  const queryParamsFromUrl = normalizeQueryParams(validParams);

  // Update global filter options
  globalFilterOptions.value = queryParamsFromUrl;

  // Build query string for the API
  const queryString = buildQueryString(queryParamsFromUrl);

  try {
    // Fetch data based on the query parameters
    const { body, success, message } = await useApiFetch(`${position}${queryString}`);

    // Update the URL to reflect the current query parameters
    router.replace({
      query: Object.entries(queryParamsFromUrl).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value.join(",") : value; // Flatten arrays into strings
        return acc;
      }, {} as Record<string, string>),
    });

    // Handle API response
    if (success) {
      // Format the data for the table, including dates and user assignment
      const formattedData = body?.docs?.map((data: any) => ({
        ...data,
        createdAt: formatDate(data.createdAt),
        date:getYear(data?.createdAt),
        updatedAt: formatDate(data.updatedAt),
        assign: data.users?.length ? data.users?.map((user: any) => user.name).join(", ") : "Unassigned",
        ...(data?.proposalDate && { proposalDate: formatDate(data?.proposalDate) }),
        ...(data?.type && { type: formatSnakeCase(data?.type) }),
        // ...(data?.status && { status: formatSnakeCase(data?.status) }),
        // assign: data.user?.name ?? 'Unassigned',
        lastContactDate: formatDate(data.lastContactDate),
        leadDetails: {
          title: data.name,
          text: data.companyName,
        },
        staffDetails: {
          title: data.name,
          // text: data.name,
          image: data.profilePicture,
          withImage: true,
        },
        roleDetails: data.role?.name || "-",
        dealDetails: {
          title: data.name,
          text: data.companyName,
          withImage: false,
        },
        expectedCloseDate: getYear(data.expectedCloseDate),
        signatureDate: getYear(data.signatureDate),
        priority: formatSnakeCase(data?.priority),
        manpowerContacts: {
          title: data.email,
          text: data.phone,
        },
        role: data?.role?.length && data?.role?.map((role: string) => formatSnakeCase(role))?.join(", "),
        leadSource: formatSnakeCase(data?.leadSource),
        rentPrice: data?.rentPrice || "-",
        buyPrice: data?.buyPrice || "-",
        phone: data?.phone || "-",
        email: data?.email || "-",
        contractType: data?.contractType === "PurchaseOrder" ? "Purchase Order" : data?.contractType,
        ClientDetails: {
          title: data.clientName,
          text: data.companyName,
          withImage: false,
        },
        clientContact: {
          title: data.email,
          text: data.phone,
        },
        clientType: formatSnakeCase(data.clientType) || "-",
        startDate: getYear(data?.startDate),
        endDate: getYear(data?.endDate),
        projectAssignedUsers: data?.assignedUsers?.length
          ? data.assignedUsers.map((user: any) => user.name).join(", ")
          : "-",
        projectClient: data?.client?.clientName || "-",
        description: data?.description || "-",
        relatedEntity: data?.relatedEntity?.name || "-",
      }));

      // Extract pagination details if available
      const pagination = body?.pagination || {};

      return { formattedData, pagination, status: "200", unreadNotificationsCount: body?.unreadNotificationsCount ?? 0 };
    } else {
      console.error(message || "Failed to fetch data.");
      return { formattedData: [], pagination: {}, status: "Failed to fetch data." };
    }
  } catch (error) {
    console.error("Error fetching table data:", error);
    return { formattedData: [], pagination: {} };
  }
}
export interface Pagination {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}
