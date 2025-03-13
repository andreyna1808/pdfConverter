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
  ITypeRequest,
} from "../../../interfaces/IConverters";
import { hasErrorMsg } from "../validations";
import AutoComplete from "../../Autocomplete";
import { getClassificatioService } from "../../../services/converters";
import { showErrorToast } from "../../Toast";
import { IOption } from "../../Autocomplete/types";
import { LoadingSpinner } from "../../LoadingSpinner/styles";
import MultiSelect from "../../MultiSelect";

const GetClassification = () => {
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [requestJson, setRequestJson] = useState<any | null>(null);
  const [options, setOptions] = useState<IOption[]>([]);
  const [professions, setProfessions] = useState<IOption[]>([]);
  const [extractData, setExtractData] = useState<IExtractData[]>([]);

  const currentInfo: ICurrentInfo =
    AvailableServices?.find(
      (service) => `/${service.urlReq}` === window.location.pathname
    ) || {};

  const typeRequest: ITypeRequest = currentInfo?.urlReq
    ? getFormatRequest(currentInfo?.urlReq)
    : { type: "", body: null };

  const handleFileChange = async (event: any) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFiles((prev: any) => {
      return { ...prev, file: [file] };
    });

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const extractData: IExtractData[] = await getClassificatioService(
        formData
      );

      if (!extractData?.length) {
        setSelectedFiles(null);
        setLoading(false);
        return showErrorToast(
          "Não foi possível fazer a leitura desse PDF, tente com outro"
        );
      }

      setExtractData(extractData);
      const professions =
        extractData?.map((item: any) => ({
          label: item.profession,
          value: item.profession,
        })) || [];
      setProfessions(professions);
    }

    event.target.value = null;
    setLoading(false);
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
    setRequestJson(null);
    setProfessions([]);
    setExtractData([]);
    setOptions([]);
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

  console.log("options: ", options);
  console.log("profession: ", professions);

  const updateProfession = (data: any) => {
    setRequestJson({ ...requestJson, Profession: data.value });
    const filterOptions: any =
      extractData?.find((item: any) => item.profession === data.value) || [];
    setOptions(
      filterOptions?.values.map((item: any) => ({ label: item, value: item }))
    );
  };

  const numberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const newValue = e.target.value;
    const numericValue = parseInt(newValue, 10);

    if (numericValue >= 0 && !isNaN(numericValue)) {
      setRequestJson({ ...requestJson, [type]: numericValue });
    } else {
      setRequestJson({ ...requestJson, [type]: null });
    }
  };

  const onCriteriaChange = (selectedOptions: any) => {
    if (!selectedOptions) {
      setRequestJson({ ...requestJson, TiebreakerCriterion: {} });
      return;
    }

    const orderedSelection = selectedOptions.reduce(
      (acc: any, option: any, index: number) => {
        acc[index + 1] = option.value;
        return acc;
      },
      {}
    );

    setRequestJson({ ...requestJson, TiebreakerCriterion: orderedSelection });
  };

  console.log("requestJson: ", requestJson);

  if (loading) {
    return (
      <Layout>
        <Elements.Container>
          <LoadingSpinner />
        </Elements.Container>
      </Layout>
    );
  }

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

          <Elements.DivInputs>
            <Elements.DivProfession>
              {professions?.length > 0 && (
                <AutoComplete
                  options={professions}
                  onChange={(data: any) => updateProfession(data)}
                  placeholder="Profissão"
                  width="100%"
                  required
                />
              )}
            </Elements.DivProfession>
            {requestJson && requestJson?.Profession && (
              <Elements.DivInputs>
                <MultiSelect
                  options={options}
                  onChange={(data: any) =>
                    setRequestJson({ ...requestJson, Values: data })
                  }
                  value={requestJson?.Values}
                  placeholder="Conteúdos"
                  width="510px"
                  required
                />
                <AutoComplete
                  options={options}
                  onChange={(data: any) =>
                    setRequestJson({
                      ...requestJson,
                      BasisAssessment: data.value,
                    })
                  }
                  placeholder="Nome do Resultado"
                  width="510px"
                />
                <Elements.InputNumber
                  type="number"
                  placeholder="Nota máxima da prova"
                  min={0}
                  onChange={(e) => numberChange(e, "FullScore")}
                  value={requestJson?.FullScore || ""}
                />
                <Elements.InputNumber
                  type="number"
                  placeholder="Porcentagem de eliminação"
                  min={0}
                  onChange={(e) => numberChange(e, "ElimitedByPercent")}
                  value={requestJson?.ElimitedByPercent || ""}
                />
                <MultiSelect
                  options={options}
                  onChange={onCriteriaChange}
                  placeholder="Critério de desempate"
                  width="510px"
                  value={Object.values(
                    requestJson?.TiebreakerCriterion || {}
                  ).map((value) => ({
                    label: value,
                    value: value,
                  }))}
                />
                <Elements.CheckboxContainer>
                  <Elements.InputCheckbox
                    type="checkbox"
                    onChange={(e) =>
                      setRequestJson({
                        ...requestJson,
                        ZeroEliminated: e.target.checked,
                      })
                    }
                  />
                  Eliminado por zerar?
                </Elements.CheckboxContainer>
              </Elements.DivInputs>
            )}
          </Elements.DivInputs>
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
