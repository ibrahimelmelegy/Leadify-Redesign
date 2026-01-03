export enum ProjectTypeEnum {
  Development = 'Development',
  Research = 'Research',
  Consulting = 'Consulting'
}

export enum ProjectCategoryEnum {
  Direct = 'Direct',
  Etimad = 'Etimad'
}

export enum ProjectStatusEnum {
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED'
}

export enum ContractTypeEnum {
  PURCHASED = 'PURCHASED',
  SUBCONTRACTOR = 'SUBCONTRACTOR',
  INVITATION = 'INVITATION'
}

export enum ProposalStatusEnum {
  UNDER_DEVELOPING = 'UNDER_DEVELOPING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED'
}

export enum ApplicationStatusEnum {
  UNDER_REVIEW = 'UNDER_REVIEW',
  WON = 'WON',
  LOST = 'LOST'
}

export enum ProjectSortByEnum {
  name = 'name',
  type = 'type',
  status = 'status',
  startDate = 'startDate',
  endDate = 'endDate',
  duration = 'duration',
  totalCost = 'totalCost',
  createdAt = 'createdAt',
  category = 'category'
}
