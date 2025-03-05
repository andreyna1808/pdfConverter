import { IDataInfo } from "../../interfaces/IConverters";

export const Validation = (dataInfo: IDataInfo) => {
  let errorMsg = "";

  if (dataInfo?.body?.includes("pages") && !dataInfo?.pageInput) {
    errorMsg = "Página a ser removida é obrigatória";
  } else if (!dataInfo?.file?.length) {
    errorMsg = "Arquivo é obrigatório";
  } else if (
    dataInfo?.body?.includes("requestJson") &&
    !dataInfo?.requestJson
  ) {
    errorMsg = "Os critérios de classificação são obrigatórios.";
  }

  return errorMsg;
};
