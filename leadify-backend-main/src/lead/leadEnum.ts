export enum LeadSourceEnums {
  REFERRAL = 'REFERRAL',
  WEBSITE = 'WEBSITE',
  EVENT = 'EVENT',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  OTHER = 'OTHER'
}

export enum LeadStatusEnums {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  DISQUALIFIED = 'DISQUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}

export interface GetLeadsOptions {
  page?: number;
  limit?: number;
  searchKey?: string;
}

export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SortByEnum {
  name = 'name',
  companyName = 'companyName',
  email = 'email',
  phone = 'phone',
  leadSource = 'leadSource',
  status = 'status',
  createdAt = 'createdAt',
  lastContactDate = 'lastContactDate'
}
