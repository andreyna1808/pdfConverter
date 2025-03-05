import { IDataInfo } from "../../interfaces/IConverters";

export const hasErrorMsg = ({
  body,
  pageInput,
  requestJson,
  file,
}: IDataInfo) => {
  let errorMsg = "";

  if (body?.includes("pages") && !pageInput) {
    errorMsg = "Página a ser removida é obrigatória";
  } else if (!file?.length) {
    errorMsg = "Arquivo é obrigatório";
  } else if (body?.includes("requestJson") && !requestJson) {
    errorMsg = "Os critérios de classificação são obrigatórios.";
  }

  return errorMsg;
};

export const formatDocToSend = ({
  file,
  requestJson,
  pageInput,
}: IDataInfo) => {
  const formData = new FormData();

  file?.forEach((f) => {
    formData.append("file", f);
  });

  if (requestJson) {
    formData.append("requestJson", JSON.stringify(requestJson));
  }

  if (pageInput) {
    const formattedArray = [
      ...new Set(
        pageInput
          .replace(/,/g, " ")
          .split(" ")
          .filter((str) => str)
      ),
    ];

    formattedArray?.forEach((page) => {
      formData.append("pages", page);
    });
  }

  return formData;
};
