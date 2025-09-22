import { useState, useMemo, useCallback } from "react";
import Report from "./Report";

const ReportContainer = ({ data = [], config, criteria: initialCriteria, exportData }) => {
  const [criteria, setCriteria] = useState(initialCriteria || {});

  const sortConfig = useMemo(() => criteria?.sort, [criteria?.sort]);
  
  const paginationConfig = useMemo(() => ({
    pageIndex: criteria?.pagination?.pageIndex || 1,
    pageSize: criteria?.pagination?.pageSize || 5
  }), [criteria?.pagination?.pageIndex, criteria?.pagination?.pageSize]);

  const filteredData = useMemo(() => {
    if (!sortConfig?.sortBy) return data;

    const { sortBy, sortAs = "ASC" } = sortConfig;
    const result = [...data];
    
    return result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortAs === "ASC" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal || "").toLowerCase();
      const bStr = String(bVal || "").toLowerCase();

      const comparison = aStr.localeCompare(bStr);
      return sortAs === "ASC" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!criteria?.pagination) return filteredData;
    
    const { pageIndex, pageSize } = paginationConfig;
    const start = (pageIndex - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, paginationConfig, criteria?.pagination]);

  const paginationMeta = useMemo(() => {
    if (!criteria?.pagination) return null;
    
    const { pageIndex, pageSize } = paginationConfig;
    return {
      pageIndex,
      pageSize,
      totalPageCount: Math.ceil(filteredData.length / pageSize),
      totalItems: filteredData.length,
    };
  }, [filteredData.length, paginationConfig, criteria?.pagination]);

  const handleExport = useCallback(async () => exportData, [exportData]);

  const handleCriteriaChange = useCallback((newCriteria) => {
    setCriteria((prevCriteria) => {
      const current = prevCriteria || {};
      
      const filtersChanged = 
        JSON.stringify(newCriteria?.filters) !== JSON.stringify(current?.filters);

      let updatedPagination = newCriteria?.pagination;

      if (filtersChanged && updatedPagination) {
        updatedPagination = {
          ...updatedPagination,
          pageIndex: 1,
        };
      }

      return {
        ...current,
        ...newCriteria,
        ...(updatedPagination && { pagination: updatedPagination }),
      };
    });
  }, []);

  const reportData = criteria?.pagination ? paginatedData : data;

  const reportCriteria = useMemo(() => ({
    ...criteria,
    ...(paginationMeta && { pagination: paginationMeta }),
  }), [criteria, paginationMeta]);

  return (
    <Report
      data={reportData}
      config={config}
      criteria={reportCriteria}
      onCriteriaChange={handleCriteriaChange}
      exportData={exportData}
      onExport={handleExport}
    />
  );
};

export default ReportContainer;