import axios from "axios";
import { IDataInfo } from "../interfaces/IConverters";

const BASE_URL = import.meta.env.VITE_BACK_END;

export const ConverterService = async (
  formData: FormData,
  dataInformation: IDataInfo
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${dataInformation.urlReq}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const getTypeFile = response.data?.type?.split("/")[1];

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ConverterPleaseChangeTheName.${getTypeFile}`);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
  }
};
