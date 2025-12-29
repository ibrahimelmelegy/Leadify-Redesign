import { ElNotification } from 'element-plus';

// Handle error during manpower creation
function handleError(message: string) {
  ElNotification({
    type: 'error',
    title: 'Error',
    message,
  });
}
function handleSuccess(message: string, id?: string, redirect: boolean = true) {
  ElNotification({
    type: 'success',
    title: 'Success',
    message,
  });
  if (!redirect) {
    return;
  }
  if (id) {
    navigateTo(`/operations/manpower/${id}`); // Navigate to the manpower details
  } else {
    navigateTo('/operations/manpower'); // Navigate to the manpowers list
  }
}

export interface ManpowerValues {
  fullName: string;
  nationality: string;
  email: string;
  phone: string;
  role: string;
  availability: string;
  eof: string | number;
  generalOrganization: string | number;
  healthInsurance: string | number;
  incomingFlight: string | number;
  iqama: string | number;
  salary: string | number;
  saudization: string | number;
  tAllowance: string | number;
  vAllowance: string | number;
  visaFees: string | number;
  [key: string]: any;
}

export enum ManpowerRoleEnums {
  PRE_SALES = 'PRE_SALES',
  NETWORK_ENGINEER = 'NETWORK_ENGINEER',
  SITE_ENGINEER = 'SITE_ENGINEER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  HELPER = 'HELPER',
}

export enum ManpowerAvailabilityStatusEnums {
  AVAILABLE = 'AVAILABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export const manpowerRoles = [
  { label: 'Pre Sales', value: ManpowerRoleEnums.PRE_SALES },
  { label: 'Network Engineer', value: ManpowerRoleEnums.NETWORK_ENGINEER },
  { label: 'Site Engineer', value: ManpowerRoleEnums.SITE_ENGINEER },
  { label: 'Project Manager', value: ManpowerRoleEnums.PROJECT_MANAGER },
  { label: 'Technician', value: ManpowerRoleEnums.TECHNICIAN },
  { label: 'Helper', value: ManpowerRoleEnums.HELPER },
];

export const manpowerAvailabilityStatus = [
  { label: 'Available', value: ManpowerAvailabilityStatusEnums.AVAILABLE },
  { label: 'Not Available', value: ManpowerAvailabilityStatusEnums.NOT_AVAILABLE },
];

export enum ManpowerNationalityEnums {
  AFGHAN = 'AFGHAN',
  ALBANIAN = 'ALBANIAN',
  ALGERIAN = 'ALGERIAN',
  AMERICAN = 'AMERICAN',
  ANDORRAN = 'ANDORRAN',
  ANGOLAN = 'ANGOLAN',
  ANTIGUAN = 'ANTIGUAN',
  ARGENTINIAN = 'ARGENTINIAN',
  ARMENIAN = 'ARMENIAN',
  AUSTRALIAN = 'AUSTRALIAN',
  AUSTRIAN = 'AUSTRIAN',
  AZERBAIJANI = 'AZERBAIJANI',
  BAHAMIAN = 'BAHAMIAN',
  BAHRAINI = 'BAHRAINI',
  BANGLADESHI = 'BANGLADESHI',
  BARBADIAN = 'BARBADIAN',
  BELARUSIAN = 'BELARUSIAN',
  BELGIAN = 'BELGIAN',
  BELIZEAN = 'BELIZEAN',
  BENINESE = 'BENINESE',
  BHUTANESE = 'BHUTANESE',
  BOLIVIAN = 'BOLIVIAN',
  BOSNIAN = 'BOSNIAN',
  BOTSWANAN = 'BOTSWANAN',
  BRAZILIAN = 'BRAZILIAN',
  BRITISH = 'BRITISH',
  BRUNEIAN = 'BRUNEIAN',
  BULGARIAN = 'BULGARIAN',
  BURKINABE = 'BURKINABE',
  BURMESE = 'BURMESE',
  BURUNDIAN = 'BURUNDIAN',
  CAMBODIAN = 'CAMBODIAN',
  CAMEROONIAN = 'CAMEROONIAN',
  CANADIAN = 'CANADIAN',
  CAPE_VERDEAN = 'CAPE_VERDEAN',
  CENTRAL_AFRICAN = 'CENTRAL_AFRICAN',
  CHADIAN = 'CHADIAN',
  CHILEAN = 'CHILEAN',
  CHINESE = 'CHINESE',
  COLOMBIAN = 'COLOMBIAN',
  COMORAN = 'COMORAN',
  CONGOLESE = 'CONGOLESE',
  COSTA_RICAN = 'COSTA_RICAN',
  CROATIAN = 'CROATIAN',
  CUBAN = 'CUBAN',
  CYPRIOT = 'CYPRIOT',
  CZECH = 'CZECH',
  DANISH = 'DANISH',
  DJIBOUTIAN = 'DJIBOUTIAN',
  DOMINICAN = 'DOMINICAN',
  DUTCH = 'DUTCH',
  ECUADORIAN = 'ECUADORIAN',
  EGYPTIAN = 'EGYPTIAN',
  EMIRATI = 'EMIRATI',
  EQUATORIAL_GUINEAN = 'EQUATORIAL_GUINEAN',
  ERITREAN = 'ERITREAN',
  ESTONIAN = 'ESTONIAN',
  ETHIOPIAN = 'ETHIOPIAN',
  FIJIAN = 'FIJIAN',
  FINNISH = 'FINNISH',
  FRENCH = 'FRENCH',
  GABONESE = 'GABONESE',
  GAMBIAN = 'GAMBIAN',
  GEORGIAN = 'GEORGIAN',
  GERMAN = 'GERMAN',
  GHANAIAN = 'GHANAIAN',
  GREEK = 'GREEK',
  GRENADIAN = 'GRENADIAN',
  GUATEMALAN = 'GUATEMALAN',
  GUINEAN = 'GUINEAN',
  GUYANESE = 'GUYANESE',
  HAITIAN = 'HAITIAN',
  HONDURAN = 'HONDURAN',
  HUNGARIAN = 'HUNGARIAN',
  ICELANDIC = 'ICELANDIC',
  INDIAN = 'INDIAN',
  INDONESIAN = 'INDONESIAN',
  IRANIAN = 'IRANIAN',
  IRAQI = 'IRAQI',
  IRISH = 'IRISH',
  ISRAELI = 'ISRAELI',
  ITALIAN = 'ITALIAN',
  IVOIRIAN = 'IVOIRIAN',
  JAMAICAN = 'JAMAICAN',
  JAPANESE = 'JAPANESE',
  JORDANIAN = 'JORDANIAN',
  KAZAKHSTANI = 'KAZAKHSTANI',
  KENYAN = 'KENYAN',
  KIRIBATI = 'KIRIBATI',
  KOREAN = 'KOREAN',
  KUWAITI = 'KUWAITI',
  KYRGYZ = 'KYRGYZ',
  LAOTIAN = 'LAOTIAN',
  LATVIAN = 'LATVIAN',
  LEBANESE = 'LEBANESE',
  LIBERIAN = 'LIBERIAN',
  LIBYAN = 'LIBYAN',
  LIECHTENSTEINER = 'LIECHTENSTEINER',
  LITHUANIAN = 'LITHUANIAN',
  LUXEMBOURGER = 'LUXEMBOURGER',
  MACEDONIAN = 'MACEDONIAN',
  MALAGASY = 'MALAGASY',
  MALAWIAN = 'MALAWIAN',
  MALAYSIAN = 'MALAYSIAN',
  MALDIVIAN = 'MALDIVIAN',
  MALIEN = 'MALIEN',
  MALTESE = 'MALTESE',
  MARSHALLESE = 'MARSHALLESE',
  MAURITANIAN = 'MAURITANIAN',
  MAURITIAN = 'MAURITIAN',
  MEXICAN = 'MEXICAN',
  MICRONESIAN = 'MICRONESIAN',
  MOLDOVAN = 'MOLDOVAN',
  MONACAN = 'MONACAN',
  MONGOLIAN = 'MONGOLIAN',
  MONTENEGRIN = 'MONTENEGRIN',
  MOROCCAN = 'MOROCCAN',
  MOZAMBICAN = 'MOZAMBICAN',
  NAMIBIAN = 'NAMIBIAN',
  NAURUAN = 'NAURUAN',
  NEPALESE = 'NEPALESE',
  NEW_ZEALANDER = 'NEW_ZEALANDER',
  NICARAGUAN = 'NICARAGUAN',
  NIGERIAN = 'NIGERIAN',
  NORWEGIAN = 'NORWEGIAN',
  OMANI = 'OMANI',
  PAKISTANI = 'PAKISTANI',
  PALAUAN = 'PALAUAN',
  PANAMANIAN = 'PANAMANIAN',
  PAPUA_NEW_GUINEAN = 'PAPUA_NEW_GUINEAN',
  PARAGUAYAN = 'PARAGUAYAN',
  PERUVIAN = 'PERUVIAN',
  PHILIPPINE = 'PHILIPPINE',
  POLISH = 'POLISH',
  PORTUGUESE = 'PORTUGUESE',
  QATARI = 'QATARI',
  ROMANIAN = 'ROMANIAN',
  RUSSIAN = 'RUSSIAN',
  RWANDAN = 'RWANDAN',
  SAINT_LUCIAN = 'SAINT_LUCIAN',
  SAMOAN = 'SAMOAN',
  SAUDI = 'SAUDI',
  SENEGALESE = 'SENEGALESE',
  SERBIAN = 'SERBIAN',
  SEYCHELLOIS = 'SEYCHELLOIS',
  SINGAPOREAN = 'SINGAPOREAN',
  SLOVAK = 'SLOVAK',
  SLOVENIAN = 'SLOVENIAN',
  SOLOMON_ISLANDER = 'SOLOMON_ISLANDER',
  SOMALI = 'SOMALI',
  SOUTH_AFRICAN = 'SOUTH_AFRICAN',
  SPANISH = 'SPANISH',
  SRI_LANKAN = 'SRI_LANKAN',
  SUDANESE = 'SUDANESE',
  SURINAMESE = 'SURINAMESE',
  SWAZI = 'SWAZI',
  SWEDISH = 'SWEDISH',
  SWISS = 'SWISS',
  SYRIAN = 'SYRIAN',
  TAIWANESE = 'TAIWANESE',
  TAJIK = 'TAJIK',
  TANZANIAN = 'TANZANIAN',
  THAI = 'THAI',
  TOGOLESE = 'TOGOLESE',
  TONGAN = 'TONGAN',
  TRINIDADIAN = 'TRINIDADIAN',
  TUNISIAN = 'TUNISIAN',
  TURKISH = 'TURKISH',
  TURKMEN = 'TURKMEN',
  TUVALUAN = 'TUVALUAN',
  UGANDAN = 'UGANDAN',
  UKRAINIAN = 'UKRAINIAN',
  URUGUAYAN = 'URUGUAYAN',
  UZBEK = 'UZBEK',
  VANUATUAN = 'VANUATUAN',
  VENEZUELAN = 'VENEZUELAN',
  VIETNAMESE = 'VIETNAMESE',
  WELSH = 'WELSH',
  YEMENI = 'YEMENI',
  ZAMBIAN = 'ZAMBIAN',
  ZIMBABWEAN = 'ZIMBABWEAN',
}

export const ManpowerNationalityOptions = Object.keys(ManpowerNationalityEnums).map((key) => ({
  label: key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' '), // Converts key to a human-readable label
  value: ManpowerNationalityEnums[key as keyof typeof ManpowerNationalityEnums], // Keeps enum value
}));

interface UseManpowersResult {
  manpowers: ManpowerValues[];
  pagination: Pagination;
}

/**
 * Fetches a list of manpowers from the API
 * @returns {Promise<UseManpowersResult>} A promise that resolves to an object containing the manpowers and pagination
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getManpowers(): Promise<UseManpowersResult> {
  try {
    // Make the API call
    const { body, success, message } = await useApiFetch('manpower');

    if (success) {
      // Return the docs (manpowers) from the response
      const manpowers = body?.docs?.map((manpower: any) => ({
        ...manpower,
        manpowerContacts:{title : manpower?.email, text:manpower?.phone},
        role: manpower?.role?.join(', '),
        createdAt: formatDate(manpower.createdAt),
        // updatedAt: formatDate(manpower.updatedAt),
        updatedAt: '-',
        assign: manpower.user?.name,
      }));
      const pagination = body?.pagination;
      return { manpowers, pagination };
    } else {
      // If the API call is unsuccessful, throw an error with the message
      throw new Error(message || 'Failed to fetch manpowers');
    }
  } catch (error) {
    // Catch and log any errors, either from the API call or from unexpected issues
    console.error('Error fetching manpowers:', error instanceof Error ? error.message : error);

    // Optionally, you could show a notification here if needed
    handleError('An error occurred while fetching manpowers. Please try again.');

    // Return an empty array as fallback
    return { manpowers: [], pagination: { totalItems: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

/**
 * Fetches a single manpower from the API
 * @param id - The ID of the manpower to fetch
 * @returns {Promise<ManpowerValues>} A promise that resolves to a ManpowerValues object
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function getManpower(id: string | string[]): Promise<ManpowerValues> {
  try {
    let { body: manpower, success } = await useApiFetch(`manpower/${id}`);
    return manpower;
  } catch (error) {
    console.error('Error fetching manpower:', error instanceof Error ? error.message : error);
    handleError('An error occurred while fetching manpower. Please try again.');
    return {} as ManpowerValues;
  }
}

/**
 * Creates a new manpower
 * @param values - The values to create the manpower with
 * @returns {Promise<Boolean>} A promise that resolves when the manpower is created
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function createManpower(values: ManpowerValues, redirect: boolean = true): Promise<Boolean> {
  // Normalize the phone number before sending
  try {
    const normalizedPhone = normalizePhoneNumber(values.phone);
    const mappedManpower = mapToNumbers(values);
    const manpowerData = { ...mappedManpower, phone: normalizedPhone };
    // Call API to create the manpower
    const response = await useApiFetch('manpower', 'POST', manpowerData);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Manpower created successfully', '', redirect);
      return true;
    } else {
      handleError(response?.message || 'Something went wrong');
      return false;
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

/**
 * Updates an existing manpower
 * @param values - The values to update the manpower with
 * @returns {Promise<Boolean>} A promise that resolves when the manpower is updated
 * @throws {Error} If the API call is unsuccessful, an error is thrown with a message
 */
export async function updateManpower(values: ManpowerValues, redirect: boolean = true): Promise<Boolean> {
  try {
    const normalizedPhone = normalizePhoneNumber(values.phone);
    let mappedManpower = mapToNumbers(values);
    delete mappedManpower.id;
    const manpowerData = { ...mappedManpower, phone: normalizedPhone };
    // Call API to create the manpower
    const response = await useApiFetch(`manpower/${values.id}`, 'PUT', manpowerData);

    // Handle the API response
    if (response?.success) {
      handleSuccess('Manpower updated successfully', values.id, redirect);
      return true;
    } else {
      handleError(response?.message || 'Something went wrong');
      return false;
    }
  } catch (error) {
    // Catch any unexpected errors and handle them
    handleError(error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

/**
 * Maps numeric fields of ManpowerValues to numbers if they are strings
 *
 * @param {ManpowerValues} data - The data to map
 * @returns {ManpowerValues} The mapped data
 */
function mapToNumbers(data: ManpowerValues): ManpowerValues {
  const numericFields = [
    'endOfServiceBenefit',
    'generalOrganizationForSocialInsurance',
    'healthInsurance',
    'incomingFlightTicket',
    'iqamaCost',
    'salary',
    'saudization',
    'transportationAllowance',
    'variableAllowance',
    'visaFees',
  ];

  // Convert specified fields to numbers if they are strings
  const mappedData = { ...data };
  numericFields.forEach((field) => {
    if (typeof mappedData[field as keyof ManpowerValues] === 'string') {
      const numericValue = parseFloat(mappedData[field as keyof ManpowerValues] as unknown as string);
      mappedData[field as keyof ManpowerValues] = isNaN(numericValue)
        ? mappedData[field as keyof ManpowerValues] // Keep original value if parsing fails
        : Number(numericValue.toFixed(2)); // Convert to number and fix to 2 decimal places
    }
  });

  return mappedData;
}
