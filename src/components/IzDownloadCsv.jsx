import { useState, useEffect } from 'react';
import { Tooltip, Stack, Button } from '@mui/material';
import { FileDownload } from '@mui/icons-material';

const IzDownloadCsv = ({ data, filename, headers, isDisabled, fetchData, isDownloading, config }) => {
  const [shouldExport, setShouldExport] = useState(false);

  useEffect(() => {
    if (shouldExport && data.length >= 0) {
      exportCSV();
      setShouldExport(false);
    }
  }, [data,shouldExport]);

  const handleExportClick = async () => {
    await fetchData();
    setShouldExport(true);
  };

  const exportCSV = () => {
    // if (!data || data.length === 0) return;
    const escapeCsvValue = (value) => {
      if (value == null) return '';
      const stringValue = String(value);
      if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

const csvContent = "data:text/csv;charset=utf-8," +
      headers.map(capitalizeFirstLetter).join(",") + "\n" +
      data.map(row => headers.map(header => escapeCsvValue(row[header])).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename || "export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Tooltip title="Download" placement="top">
      <Stack>
        <Button
          onClick={handleExportClick}
          disabled={isDisabled || isDownloading}
          loading={isDownloading}
          sx={{
            color: "#5b6b79",
            border: "1px solid lightgrey",
            p: "0.3125rem",
            position: "relative",
            textTransform: 'none'
          }}
          color="secondary"
        ><FileDownload />Export</Button>
      </Stack>
    </Tooltip>
  );
};

export default IzDownloadCsv;