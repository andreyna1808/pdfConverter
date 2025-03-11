export interface ITypeRequest {
  body: string[] | null | undefined;
  type: string;
}

export interface ICurrentInfo {
  name?: string | null | undefined;
  description?: string | null | undefined;
  urlReq?: string | null | undefined;
}

export interface IRequestJson {
  Profession: string;
  Values: string[];
  BasisAssessment: string;
  FullScore: number;
  EliminatedByZero?: boolean;
  ElimitedByPercent?: number;
  TiebreakerCriterion?: Record<string, string>;
}

export interface IDataInfo extends ITypeRequest, ICurrentInfo {
  pageInput: string;
  requestJson: IRequestJson | null | undefined;
  file: File[] | null | undefined;
}

export interface IExtractData {
  profession: string;
  values: string[];
}
