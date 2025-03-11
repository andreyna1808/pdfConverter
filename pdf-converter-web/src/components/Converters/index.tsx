/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Elements from "./styles";
import Layout from "../Layout";
import { AvailableServices } from "../../utils/availableServices";
import { getFormatRequest } from "../../utils/formatFiles";
import { useState } from "react";
import { CloseIcon, PrimaryButton } from "../../styles/defaultStyles";
import { showErrorToast } from "../Toast";
import {
  ICurrentInfo,
  IDataInfo,
  ITypeRequest,
} from "../../interfaces/IConverters";
import { formatDocToSend, hasErrorMsg } from "./validations";
import { converterService } from "../../services/converters";

const Converters = () => {
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [pageInput, setPageInput] = useState("");

  const currentInfo: ICurrentInfo =
    AvailableServices?.find(
      (service) => `/${service.urlReq}` === window.location.pathname
    ) || {};

  const typeRequest: ITypeRequest = currentInfo?.urlReq
    ? getFormatRequest(currentInfo?.urlReq)
    : { type: "", body: null };

  const handleFileChange = (event: any, type: string) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFiles((prev: any) => {
      const files = prev?.file || [];
      if (type === "files" && files.length < 5) {
        return { ...prev, file: [...files, file] };
      } else if (type === "file") {
        return { ...prev, file: [file] };
      }
      return prev;
    });

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

    if (errorMsg) {
      return showErrorToast(errorMsg);
    }

    const formData = formatDocToSend(dataInformation);
    const sendDoc = await converterService(formData, dataInformation);

    if (typeof sendDoc == "string") {
      return showErrorToast(sendDoc);
    }

    return sendDoc;
  };

  return (
    <Layout>
      <Elements.Container>
        <Elements.Tittle>{currentInfo?.name}</Elements.Tittle>
        <Elements.BodyService>{currentInfo?.description}</Elements.BodyService>
      </Elements.Container>
      <Elements.Container>
        {typeRequest?.body?.map((type: string) => (
          <Elements.ContainerServices key={type}>
            {type === "pages" && (
              <>
                <Elements.InputWrapper>
                  <Elements.Label htmlFor="page-input">
                    Insira o número da página a ser removido separado por
                    vírgula ou espaço:
                  </Elements.Label>
                  <Elements.StyledInput
                    id="page-input"
                    type="text"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    placeholder="Ex: 1, 2, 3 ou 1 2 3"
                  />
                </Elements.InputWrapper>
              </>
            )}
            {type === "file" && (
              <>
                {selectedFiles?.["file"]?.[0]?.name && (
                  <Elements.DivFiles>
                    <Elements.FileName>
                      {selectedFiles?.["file"]?.[0]?.name}
                    </Elements.FileName>
                    <CloseIcon size={22} onClick={() => handleRemoveFile(0)} />
                  </Elements.DivFiles>
                )}

                <Elements.FileInfo>
                  <Elements.FileInputWrapper>
                    {selectedFiles?.["file"]?.[0]?.name
                      ? "Outro arquivo"
                      : "Selecione um arquivo"}
                    <Elements.HiddenInput
                      type="file"
                      accept={typeRequest.type}
                      onChange={(e) => handleFileChange(e, "file")}
                    />
                  </Elements.FileInputWrapper>
                </Elements.FileInfo>
              </>
            )}
            {type === "files" && (
              <>
                {selectedFiles?.["file"]?.map(
                  ({ name }: { name: string }, index: number) => (
                    <Elements.DivFiles key={`${name}-${index}`}>
                      <Elements.FileName>{name}</Elements.FileName>
                      <CloseIcon
                        size={22}
                        onClick={() => handleRemoveFile(index)}
                      />
                    </Elements.DivFiles>
                  )
                )}

                <Elements.FileInfo>
                  {(!selectedFiles?.["file"]?.length ||
                    selectedFiles?.["file"]?.length < 5) && (
                    <Elements.FileInputWrapper>
                      {!selectedFiles?.["file"]?.length
                        ? "Selecione um arquivo"
                        : "Adicionar outro arquivo"}
                      <Elements.HiddenInput
                        type="file"
                        accept={typeRequest.type}
                        onChange={(e) => handleFileChange(e, "files")}
                      />
                    </Elements.FileInputWrapper>
                  )}
                </Elements.FileInfo>
              </>
            )}
          </Elements.ContainerServices>
        ))}
        <Elements.DivSaveButton>
          <PrimaryButton
            onClick={() =>
              handleConverter({
                ...currentInfo,
                ...selectedFiles,
                ...typeRequest,
                pageInput,
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

export default Converters;
