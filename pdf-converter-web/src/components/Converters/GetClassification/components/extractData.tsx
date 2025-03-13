/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Elements from "./../styles";
import { AvailableServices } from "../../../../utils/availableServices";
import { getFormatRequest } from "../../../../utils/formatFiles";
import { useState } from "react";
import { CloseIcon, PrimaryButton } from "../../../../styles/defaultStyles";
import {
  ICurrentInfo,
  IDataInfo,
  IExtractData,
  ITypeRequest,
} from "../../../../interfaces/IConverters";
import { formatDocToSend } from "../../validations";
import AutoComplete from "../../../Autocomplete";
import { getExtractData } from "../../../../services/converters";
import { showErrorToast } from "../../../Toast";
import { IOption } from "../../../Autocomplete/types";
import { LoadingSpinner } from "../../../LoadingSpinner/styles";
import MultiSelect from "../../../MultiSelect";
import { getClassificatioService } from "../../../../services/classifications";

const ExtractData: React.FC<any> = ({ onResult }) => {
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

      const extractData: IExtractData[] = await getExtractData(formData);

      if (!extractData?.length) {
        setSelectedFiles(null);
        setRequestJson(null);
        setProfessions([]);
        setExtractData([]);
        setOptions([]);
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
    setLoading(true);
    const updateValue = dataInformation.requestJson?.Values?.map(
      (item: any) => item.value
    );
    const updateInfo = {
      ...dataInformation,
      requestJson: { ...dataInformation?.requestJson, Values: updateValue },
    };
    const formData = formatDocToSend(updateInfo);
    const result = await getClassificatioService(formData, updateInfo);

    if (!result?.length) {
      setLoading(false);
      return showErrorToast("Nenhum resultado encontrado");
    }

    onResult(result);
    setLoading(true);
  };

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

  if (loading) {
    return (
      <>
        <Elements.Container>
          <LoadingSpinner />
        </Elements.Container>
      </>
    );
  }

  console.log(extractData);

  return (
    <>
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
                  value={{
                    value: requestJson?.Profession,
                    label: requestJson?.Profession,
                  }}
                />
              )}
              {!requestJson?.Profession && professions?.length > 0 && (
                <Elements.RequiredText>
                  * Este campo é obrigatório
                </Elements.RequiredText>
              )}
            </Elements.DivProfession>
            {requestJson && requestJson?.Profession && (
              <Elements.DivInputs>
                <Elements.DivRequired>
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
                  {!requestJson?.Values && (
                    <Elements.RequiredText>
                      * Este campo é obrigatório
                    </Elements.RequiredText>
                  )}
                </Elements.DivRequired>

                <Elements.DivRequired>
                  <AutoComplete
                    options={options}
                    onChange={(data: any) =>
                      setRequestJson({
                        ...requestJson,
                        BasisAssessment: data.value,
                      })
                    }
                    value={{
                      value: requestJson?.BasisAssessment,
                      label: requestJson?.BasisAssessment,
                    }}
                    placeholder="Nome do Resultado"
                    width="510px"
                    required
                  />
                  {!requestJson?.BasisAssessment && (
                    <Elements.RequiredText>
                      * Este campo é obrigatório
                    </Elements.RequiredText>
                  )}
                </Elements.DivRequired>

                <Elements.DivRequired>
                  <Elements.InputNumber
                    type="number"
                    placeholder="Nota máxima da prova"
                    min={0}
                    onChange={(e) => numberChange(e, "FullScore")}
                    value={requestJson?.FullScore || ""}
                  />
                  {!requestJson?.FullScore && (
                    <Elements.RequiredText>
                      * Este campo é obrigatório
                    </Elements.RequiredText>
                  )}
                </Elements.DivRequired>

                <Elements.InputNumber
                  type="number"
                  placeholder="Mínimo % para passar"
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
                requestJson,
              })
            }
            disabled={
              !requestJson?.Profession ||
              !requestJson.Values?.length ||
              !requestJson.BasisAssessment
            }
          >
            Enviar
          </PrimaryButton>
        </Elements.DivSaveButton>
      </Elements.Container>
    </>
  );
};

export default ExtractData;
