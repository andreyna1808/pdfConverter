/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { IDataInfo } from "../interfaces/IConverters";

const BASE_URL = import.meta.env.VITE_BACK_END;

export const converterService = async (
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
    const typeFile = getTypeFile?.includes("document") ? "docx" : getTypeFile;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ConverterPleaseChangeTheName.${typeFile}`);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    try {
      await axios.post(`${BASE_URL}/${dataInformation.urlReq}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "json",
      });
    } catch (err: any) {
      return err?.response?.data?.message || "Erro desconhecido";
    }
  }
};

export const getClassificatioService = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/classification/extract-data`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "json",
      }
    );
    
    return response.data?.[0];
  } catch (error: any) {
    return error?.response?.data?.message || "Erro desconhecido";
  }
};
