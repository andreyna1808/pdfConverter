import { GridColDef } from "@mui/x-data-grid";
import * as Elements from "../styles";
import { RowData } from "../types";

export const colsClassifications = (rows: RowData[]): GridColDef[] => {
  const fixedColsBeforeScores: GridColDef[] = [
    {
      field: "position",
      headerName: "Posição",
      width: 100,
      renderCell: (params) => {
        const row = params?.row as RowData;
        return row?.position >= 1 ? row?.position : "-";
      },
    },
    { field: "name", headerName: "Nome", flex: 1 },
    {
      field: "registrationNumber",
      headerName: "Número de Registro",
      width: 150,
    },
  ];

  const dynamicScoreKeys = new Set<string>();

  rows.forEach((row) => {
    if (row.scores) {
      Object.keys(row.scores).forEach((key) => dynamicScoreKeys.add(key));
    }
  });

  const dynamicScoreCols: GridColDef[] = Array.from(dynamicScoreKeys).map(
    (scoreKey) => ({
      field: scoreKey,
      headerName: scoreKey,
      align: "left",
      width: 100,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const row = params?.row as RowData;
        const scoreValue = row?.scores?.[scoreKey] ?? "-";
        return scoreValue;
      },
    })
  );

  const fixedColsAfterScores: GridColDef[] = [
    { field: "totalScore", headerName: "Pontuação Final", width: 150 },
    {
      field: "isEliminated",
      headerName: "Eliminado",
      width: 150,
      renderCell: (params) => {
        const row = params?.row as RowData;
        return (
          <Elements.StatusContainer isEliminated={row?.isEliminated}>
            {row?.isEliminated ? "Sim" : "Não"}
          </Elements.StatusContainer>
        );
      },
    },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  return [
    ...fixedColsBeforeScores,
    ...dynamicScoreCols,
    ...fixedColsAfterScores,
  ];
};
