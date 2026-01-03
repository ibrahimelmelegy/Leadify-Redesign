export enum ClientTypeEnums {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE'
}

export enum ClientStatusEnums {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface GetClientsOptions {
  page?: number;
  limit?: number;
  searchKey?: string;
}

export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SortByEnum {
  clientName = 'clientName',
  clientType = 'clientType',
  email = 'email',
  phoneNumber = 'phoneNumber',
  clientStatus = 'clientStatus',
  createdAt = 'createdAt',
}

export enum ClientIndustryEnums {
  AGRICULTURE_FARMING = 'Agriculture & Farming',
  AUTOMOTIVE = 'Automotive',
  BANKING_FINANCIAL_SERVICES = 'Banking & Financial Services',
  BIOTECH_PHARMA = 'Biotechnology & Pharmaceuticals',
  CONSTRUCTION_REAL_ESTATE = 'Construction & Real Estate',
  CONSULTING_PROFESSIONAL_SERVICES = 'Consulting & Professional Services',
  CONSUMER_GOODS_RETAIL = 'Consumer Goods & Retail',
  EDUCATION_E_LEARNING = 'Education & E-Learning',
  ENERGY_UTILITIES = 'Energy & Utilities',
  ENTERTAINMENT_MEDIA = 'Entertainment & Media',
  FOOD_BEVERAGE = 'Food & Beverage',
  GOVERNMENT_PUBLIC_SECTOR = 'Government & Public Sector',
  HEALTHCARE_MEDICAL_SERVICES = 'Healthcare & Medical Services',
  HOSPITALITY_TOURISM = 'Hospitality & Tourism',
  IT_SOFTWARE = 'Information Technology (IT) & Software',
  INSURANCE = 'Insurance',
  LEGAL_SERVICES = 'Legal Services',
  MANUFACTURING = 'Manufacturing',
  MARKETING_ADVERTISING = 'Marketing & Advertising',
  NON_PROFIT_NGOS = 'Non-Profit & NGOs',
  TELECOMMUNICATIONS = 'Telecommunications',
  TRANSPORTATION_LOGISTICS = 'Transportation & Logistics',
}
