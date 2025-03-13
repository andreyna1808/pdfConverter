/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Elements from "./styles";
import Layout from "../../Layout";
import { AvailableServices } from "../../../utils/availableServices";
import { getFormatRequest } from "../../../utils/formatFiles";
import { useState } from "react";
import { CloseIcon, PrimaryButton } from "../../../styles/defaultStyles";
import { showErrorToast } from "../../Toast";
import {
  ICurrentInfo,
  IDataInfo,
  ITypeRequest,
} from "../../../interfaces/IConverters";
import { formatDocToSend, hasErrorMsg } from "./../validations";
import { converterService } from "../../../services/converters";
import { Fonts, FontSize, Spacing } from "./mocks";
import { IFormatToABNT } from "./types";
import AutoComplete from "../../Autocomplete";

const FormatToABNT = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [formattedType, setFormattedType] = useState<IFormatToABNT>({
    font: "Times New Roman",
    fontSize: 28,
    lineSpacing: 360,
  });

  const currentInfo: ICurrentInfo =
    AvailableServices?.find(
      (service) => `/${service.urlReq}` === window.location.pathname
    ) || {};

  const typeRequest: ITypeRequest = currentInfo?.urlReq
    ? getFormatRequest(currentInfo?.urlReq)
    : { type: "", body: null };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile((prev: any) => {
      return { ...prev, file: [file] };
    });

    event.target.value = null;
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFile((prev: any) => {
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

    if (errorMsg) {
      return showErrorToast(errorMsg);
    }

    const formData = formatDocToSend(dataInformation);
    const sendDoc = await converterService(formData, dataInformation);

    console.log({ dataInformation, errorMsg, sendDoc });

    if (typeof sendDoc == "string") {
      return showErrorToast(sendDoc);
    }

    return sendDoc;
  };

  console.log({ selectedFile, typeRequest, currentInfo });

  return (
    <Layout>
      <Elements.Container>
        <Elements.Tittle>{currentInfo?.name}</Elements.Tittle>
        <Elements.BodyService>{currentInfo?.description}</Elements.BodyService>
      </Elements.Container>
      <Elements.Container>
        {selectedFile?.["file"]?.[0]?.name && (
          <Elements.DivFiles>
            <Elements.FileName>
              {selectedFile?.["file"]?.[0]?.name}
            </Elements.FileName>
            <CloseIcon size={22} onClick={() => handleRemoveFile(0)} />
          </Elements.DivFiles>
        )}
        <Elements.ContainerServices>
          <Elements.FileInfo>
            <Elements.FileInputWrapper>
              {selectedFile?.["file"]?.[0]?.name
                ? "Outro arquivo"
                : "Selecione um arquivo"}
              <Elements.HiddenInput
                type="file"
                accept={typeRequest.type}
                onChange={(e) => handleFileChange(e)}
              />
            </Elements.FileInputWrapper>
          </Elements.FileInfo>
          <Elements.DivInputs>
            <Elements.DivRequired>
              <label>Fonte</label>
              <AutoComplete
                options={Fonts}
                onChange={(data: any) =>
                  setFormattedType({ ...formattedType, font: data })
                }
                value={Fonts.find(
                  (option) => option.value === formattedType.font
                )}
                placeholder="Fonte"
                width="100%"
                required
              />
            </Elements.DivRequired>
            <Elements.DivRequired>
              <label>Tamanho da Fonte</label>
              <AutoComplete
                options={FontSize}
                onChange={(data: any) =>
                  setFormattedType({ ...formattedType, fontSize: data })
                }
                value={FontSize.find(
                  (option) => option.value === formattedType.fontSize
                )}
                placeholder="Tamanho da Fonte"
                width="100%"
                required
              />
            </Elements.DivRequired>
            <Elements.DivRequired>
              <label>Espaçamento</label>
              <AutoComplete
                options={Spacing}
                onChange={(data: any) =>
                  setFormattedType({ ...formattedType, lineSpacing: data })
                }
                value={Spacing.find(
                  (option) => option.value === formattedType.lineSpacing
                )}
                placeholder="Espaçamento"
                width="100%"
                required
              />
            </Elements.DivRequired>
          </Elements.DivInputs>
        </Elements.ContainerServices>
        <Elements.DivSaveButton>
          <PrimaryButton
            onClick={() =>
              handleConverter({
                ...currentInfo,
                ...selectedFile,
                ...typeRequest,
                ...formattedType,
              })
            }
            disabled={!selectedFile?.["file"]?.[0]?.name}
          >
            Enviar
          </PrimaryButton>
        </Elements.DivSaveButton>
      </Elements.Container>
    </Layout>
  );
};

export default FormatToABNT;
