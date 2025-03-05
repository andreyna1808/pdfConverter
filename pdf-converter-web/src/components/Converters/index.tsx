/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Elements from "./styles";
import Layout from "../Layout";
import { AvailableServices } from "../../utils/availableServices";
import { getFormatRequest } from "../../utils/formatFiles";
import { useState } from "react";
import {
  CloseIcon,
  FileInputWrapper,
  HiddenInput,
  PrimaryButton,
} from "../../styles/defaultStyles";
import { showErrorToast, showSuccessToast } from "../Toast";
import {
  ICurrentInfo,
  IDataInfo,
  ITypeRequest,
} from "../../interfaces/IConverters";
import { formatDocToSend, hasErrorMsg } from "./validations";
import { ConverterService } from "../../services/converters";

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
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev: any) => {
      const updatedFiles =
        prev?.file?.filter((_: any, idx: number) => idx !== index) || [];
      return { ...prev, file: updatedFiles };
    });
  };

  const handleConverter = async (dataInformation: IDataInfo) => {
    const errorMsg = hasErrorMsg(dataInformation);

    if (errorMsg) {
      return showErrorToast(errorMsg);
    }

    const formData = formatDocToSend(dataInformation);
    const sendDoc = await ConverterService(formData, dataInformation);

    // console.log("dataInformation: ", { dataInformation, formData, sendDoc });

    return sendDoc;
    // showSuccessToast('Dale');
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
                    <CloseIcon
                      size={22}
                      onClick={() => setSelectedFiles(null)} // TODO mesmo limpando o arquivo quando exclui ele não permite selecionar o mesmo
                    />
                  </Elements.DivFiles>
                )}

                <Elements.FileInfo>
                  <FileInputWrapper>
                    {selectedFiles?.["file"]?.[0]?.name
                      ? "Outro arquivo"
                      : "Selecione um arquivo"}
                    <HiddenInput
                      type="file"
                      accept={typeRequest.type}
                      onChange={(e) => handleFileChange(e, "file")}
                    />
                  </FileInputWrapper>
                </Elements.FileInfo>
              </>
            )}
            {type === "files" && (
              <>
                {selectedFiles?.["files"]?.map(
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
                  {(!selectedFiles?.["files"]?.length ||
                    selectedFiles?.["files"]?.length < 5) && (
                    <FileInputWrapper>
                      {!selectedFiles?.["files"]?.length
                        ? "Selecione um arquivo"
                        : "Adicionar outro arquivo"}
                      <HiddenInput
                        type="file"
                        accept={typeRequest.type}
                        onChange={(e) => handleFileChange(e, "files")}
                      />
                    </FileInputWrapper>
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
