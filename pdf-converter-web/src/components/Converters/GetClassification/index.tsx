/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Elements from "./styles";
import Layout from "../../Layout";
import { AvailableServices } from "../../../utils/availableServices";
import { getFormatRequest } from "../../../utils/formatFiles";
import { useState } from "react";
import { CloseIcon, PrimaryButton } from "../../../styles/defaultStyles";
import {
  ICurrentInfo,
  IDataInfo,
  IExtractData,
  IRequestJson,
  ITypeRequest,
} from "../../../interfaces/IConverters";
import { hasErrorMsg, formatDocToSend } from "../validations";
import AutoComplete from "../../Autocomplete";
import { getClassificatioService } from "../../../services/converters";
import { showErrorToast } from "../../Toast";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

const GetClassification = () => {
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [requestJson, setRequestJson] = useState<IRequestJson | null>(null);
  const [selectedOption, setSelectedOption] = useState<{
    value: any;
    label: string;
  } | null>(null);

  const currentInfo: ICurrentInfo =
    AvailableServices?.find(
      (service) => `/${service.urlReq}` === window.location.pathname
    ) || {};

  const typeRequest: ITypeRequest = currentInfo?.urlReq
    ? getFormatRequest(currentInfo?.urlReq)
    : { type: "", body: null };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFiles((prev: any) => {
      return { ...prev, file: [file] };
    });

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const extractData: IExtractData = await getClassificatioService(formData);

      if (!extractData?.profession) {
        return showErrorToast("Não foi possível fazer a leitura desse PDF, tente com outro");
      }

      console.log("extractData: ", extractData);
    }

    event.target.value = null;
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev: any) => {
      const updatedFiles =
        prev?.file?.filter((_: any, idx: number) => idx !== index) || [];

      if (!updatedFiles.length) {
        return { ...prev, file: [] };
      }
      return { ...prev, file: updatedFiles };
    });
  };

  const handleConverter = async (dataInformation: IDataInfo) => {
    const errorMsg = hasErrorMsg(dataInformation);

    console.log("dataInformation: ", { dataInformation, errorMsg });

    //   if (errorMsg) {
    //     return showErrorToast(errorMsg);
    //   }

    //   const formData = formatDocToSend(dataInformation);
    //   const sendDoc = await ConverterService(formData, dataInformation);

    //   if (typeof sendDoc == "string") {
    //     return showErrorToast(sendDoc);
    //   }

    //   return sendDoc;
  };

  return (
    <Layout>
      <Elements.Container>
        <Elements.Tittle>{currentInfo?.name}</Elements.Tittle>
        <Elements.BodyService>{currentInfo?.description}</Elements.BodyService>
      </Elements.Container>
      <Elements.Container>
        {selectedFiles?.["file"]?.[0]?.name && (
          <Elements.DivFiles>
            <Elements.FileName>
              {selectedFiles?.["file"]?.[0]?.name}
            </Elements.FileName>
            <CloseIcon size={22} onClick={() => handleRemoveFile(0)} />
          </Elements.DivFiles>
        )}

        <Elements.ContainerServices>
          <Elements.FileInfo>
            <Elements.FileInputWrapper>
              {selectedFiles?.["file"]?.[0]?.name
                ? "Outro arquivo"
                : "Selecione um arquivo"}
              <Elements.HiddenInput
                type="file"
                accept={typeRequest.type}
                onChange={(e) => handleFileChange(e)}
              />
            </Elements.FileInputWrapper>
          </Elements.FileInfo>

          <div>
            <AutoComplete options={options} onChange={setSelectedOption} />
          </div>
        </Elements.ContainerServices>

        <Elements.DivSaveButton>
          <PrimaryButton
            onClick={() =>
              handleConverter({
                ...currentInfo,
                ...selectedFiles,
                ...typeRequest,
              })
            }
          >
            Enviar
          </PrimaryButton>
        </Elements.DivSaveButton>
      </Elements.Container>
    </Layout>
  );
};

export default GetClassification;
