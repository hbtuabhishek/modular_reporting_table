import { Stack } from "@mui/material";
import Config from "./Config/Config";
import IzListingTable from "./Table/ListingTable";
import { useState } from "react";
import IzDownloadCsv from "./IzDownloadCsv";

const Report = ({ data, config, criteria, onCriteriaChange, exportData, onExport }) => {
  const CustomHeader = config?.headerConfig?.component;

  const [selected, setSelected] = useState({
    dimensions: criteria.dimensions || [],
    metrics: criteria.metrics || [],
    filters: criteria.filters || {},
  });

  const handleTableFilter = (filterUpdates) => {
    const updatedCriteria = { ...criteria };

    if (filterUpdates.pageSize || filterUpdates.pageIndex) {
      updatedCriteria.pagination = {
        ...criteria.pagination,
        ...filterUpdates,
      };
    }

    if (filterUpdates.sortBy || filterUpdates.sortAs) {
      updatedCriteria.sort = {
        ...criteria.sort,
        ...filterUpdates,
      };
    }

    onCriteriaChange(updatedCriteria);
  };

  const allowedColumns = CustomHeader
    ? config.columnConfig.map((col) => col.id)
    : [...selected.dimensions, ...selected.metrics];

  const tableColumns = config.columnConfig.filter((col) =>
    allowedColumns.includes(col.id)
  );

  const tableActions = config.actionConfig?.component || null;

  return (
    <Stack spacing={2}>
      {CustomHeader ? (
        <Stack direction={{ xs:"column", sm:"row"}} alignContent='center' justifyContent='space-between' mb={2} spacing={2}>
        <CustomHeader
          config={config}
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
        />
        {config?.csvConfig &&
        <IzDownloadCsv data={exportData} headers={config.csvConfig.headers} 
          filename={config.csvConfig.filename}
          fetchData={onExport}
          config={config}
        />}
        </Stack>
      ) : (
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Config
          config={config}
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
          selected={selected}
          setSelected={setSelected}
        />
        <IzDownloadCsv data={exportData} headers={config.csvConfig.headers} 
          filename={config.csvConfig.filename}
          fetchData={onExport}
        />
      </Stack>
      )}

      <IzListingTable
        data={data || []}
        columns={tableColumns}
        actions={tableActions}
        pagination={criteria.pagination}
        filters={criteria.sort || {}}
        onFilter={handleTableFilter}
      />
    </Stack>
  );
};

export default Report;