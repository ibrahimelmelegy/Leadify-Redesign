export enum ProposalTypeEnum {
  FINANCIAL = 'FINANCIAL',
  TECHNICAL = 'TECHNICAL',
  MIXED = 'MIXED'
}

export enum ProposalStatusEnum {
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}

export enum ProposalModelEnum {
  Project = 'Project',
  Opportunity = 'Opportunity',
  Deal = 'Deal'
}

export enum ProposalSortByEnum {
  title = 'title',
  version = 'version',
  proposalDate = 'proposalDate',
  type = 'type',
  status = 'status',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt'
}
