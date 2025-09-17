import { Stack } from "@mui/material";
import Config from "./Config/Config";
import IzListingTable from "./Table/ListingTable";
import { useState } from "react";

const Report = ({ data, config, criteria, onCriteriaChange }) => {

  const [selected, setSelected] = useState({
    dimensions: criteria.dimensions || [],
    metrics: criteria.metrics || [],
    filters: criteria.filters || {},
  });

  const handleTableFilter = (filterUpdates) => {
    const updatedCriteria = {
      ...criteria,
    };

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

  const allowedColumns = [...selected.dimensions, ...selected.metrics];
  const tableColumns = config.columnConfig.filter((col) =>
    allowedColumns.includes(col.id)
  );

  const tableActions = config.actionConfig?.component || null;

  return (
    <Stack spacing={2}>
      <Stack alignItems="flex-end">
        <Config
          config={config}
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
          selected={selected}
          setSelected={setSelected}
        />
      </Stack>

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

