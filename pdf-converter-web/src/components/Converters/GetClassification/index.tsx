import * as Elements from "./styles";
import Layout from "../../Layout";
import { useState } from "react";
import ExtractData from "./components/extractData";
import { colsClassifications } from "./components/colsClassifications";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { PrimaryButton } from "../../../styles/defaultStyles";
import { RowData } from "./types";

const GetClassification = () => {
  const [classifications, setClassifications] = useState<RowData[] | null>(
    null
  );

  const onResult = (data: RowData[] | null) => {
    setClassifications(data);
  };

  console.log(classifications);

  return (
    <Layout>
      {!classifications ? (
        <ExtractData onResult={onResult} />
      ) : (
        <Elements.DivTable>
          <DataGrid
            rows={
              classifications?.map((item: RowData) => ({
                ...item,
                id: item.registrationNumber,
              })) || []
            }
            columns={colsClassifications(classifications)}
            localeText={
              ptBR.components?.MuiDataGrid?.defaultProps?.localeText ?? {}
            }
            pageSizeOptions={[100]}
            pagination
          />
          <Elements.DivSaveButton>
            <PrimaryButton onClick={() => onResult(null)}>Voltar</PrimaryButton>
          </Elements.DivSaveButton>
        </Elements.DivTable>
      )}
    </Layout>
  );
};

export default GetClassification;
