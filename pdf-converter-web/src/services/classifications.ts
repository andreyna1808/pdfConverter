/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { IDataInfo } from "../interfaces/IConverters";

const BASE_URL = import.meta.env.VITE_BACK_END;

export const getClassificatioService = async (
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
        responseType: "json",
      }
    );

    return response.data;
  } catch (error: any) {
    return error?.response?.data?.message || "Erro desconhecido";
  }
};
