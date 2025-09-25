import { Stack } from "@mui/material";
import Config from "./Config/Config";
import IzListingTable from "./Table/ListingTable";
import { useState } from "react";
import DownloadCsv from "./DownloadCsv";

const Report = ({ data, config = {}, criteria, onCriteriaChange, onExport }) => {
  const { csvConfig, columnConfig, actionConfig, headerConfig, isLoading } = config || {};
  const CustomHeader = headerConfig?.component;

  const [filterItem, setFilterItem] = useState({
    dimensions: criteria?.dimensions || [],
    metrics: criteria?.metrics || [],
    filters: criteria?.filters || {},
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
    : [...criteria.dimensions, ...criteria.metrics];

  const tableColumns = columnConfig.filter((col) =>
    allowedColumns.includes(col.id)
  );

  const tableActions = actionConfig?.component || null;
  const CsvExport = csvConfig && (
    <DownloadCsv
      data={csvConfig?.csvData}
      headers={csvConfig?.headers}
      filename={csvConfig?.filename}
      fetchData={onExport}
      config={columnConfig}
    />
  );

  return (
    <Stack spacing={2}>
      {CustomHeader ? (
        <Stack direction={{ xs:"column", sm:"row"}} alignContent='center' mb={2}>
      <CustomHeader
        config={config}
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
      />
        {CsvExport}
        </Stack>
      ) : (
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Config
          config={config}
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
          filterItem={filterItem}
          onFilterChange={setFilterItem}
        />
        {CsvExport}
      </Stack>
      )}

      <IzListingTable
        data={data || []}
        columns={tableColumns}
        actions={tableActions}
        pagination={criteria?.pagination}
        filters={criteria?.sort || {}}
        onFilter={handleTableFilter}
        loading={isLoading}
      />
    </Stack>
  );
};

export default Report;