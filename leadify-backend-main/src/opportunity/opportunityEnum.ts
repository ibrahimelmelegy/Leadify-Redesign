export enum OpportunityStageEnums {
  DISCOVERY = 'DISCOVERY',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
  CONVERTED = 'CONVERTED'
}

export enum OpportunityPriorityEnums {
  VERY_HIGH = 'VERY_HIGH',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  VERY_LOW = 'VERY_LOW'
}

export enum OpportunitySortByEnum {
  name = 'name',
  stage = 'stage',
  estimatedValue = 'estimatedValue',
  expectedCloseDate = 'expectedCloseDate',
  priority = 'priority',
  createdAt = 'createdAt'
}
