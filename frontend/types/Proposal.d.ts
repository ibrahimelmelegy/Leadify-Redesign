export type RelatedTypesValues = 'Opportunity' | 'Deal' | 'Project';
export type ProposalTypesValues = 'FINANCIAL' | 'TECHNICAL' | 'MIXED';
export interface RelatedTypeOptions {
  label: string;
  value: RelatedTypesValues;
}
export interface ProposalTypeOptions {
  label: string;
  value: ProposalTypesValues;
}
export interface RelatedToOptions {
  label: string;
  value: string;
}

export interface ProposalInfoPayload {
  relatedEntityId: string;
  relatedEntityType: string;
  title: string;
  version: string;
  date: string;
  type: string;
  reference: string;
  proposalFor: string;
  companyLogo: string;
  users: string[];
  fileAttachments?: string[];
  comments?: string;
  content?: string;
}
