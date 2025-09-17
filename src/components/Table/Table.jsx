import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  Typography,
  Select,
  MenuItem,
  Stack,
  TableSortLabel,
} from "@mui/material";
// import { FormattedMessage, useIntl } from 'react-intl';

const DataTable = ({
  data,
  columns,
  actions,
  rowClickHandler,
  itemsPerPage = 5,
  rowsPerPageOptions = [5,10, 20, 30, 40]
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialItemsPerPage, setInitialItemsPerPage] = useState(itemsPerPage);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(data.length / initialItemsPerPage)
  );
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(()=>{
    setCurrentPage(1);
  },[sortConfig])

  useEffect(() => {
    const sortedData = [...data];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

  const totalPageCount = Math.ceil(sortedData.length / initialItemsPerPage);

  if (currentPage > totalPageCount) {
    setCurrentPage(1);
  }

    const paginatedData = sortedData.slice(
      (currentPage - 1) * initialItemsPerPage,
      currentPage * initialItemsPerPage
    );

    setFilteredData(paginatedData);
    setTotalPages(totalPageCount);
  }, [data, currentPage, initialItemsPerPage, sortConfig]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    setInitialItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (column.sortable) {
      const newDirection =
        (sortConfig.key === column.accessor || sortConfig.key === column.id) && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      setSortConfig({ key: column.accessor || column.id, direction: newDirection });
    }
  };

  const rows = filteredData.map((row, rowIndex) => (
    <TableRow
      key={rowIndex}
      sx={{ cursor: rowClickHandler ? "pointer" : "default" }}
      onClick={() => rowClickHandler && rowClickHandler(row)}
    >
      {columns.map((column) => (
        <TableCell key={column.id} align="left">
          {!!column.cell ? column.cell(row, rowIndex) : row[column.accessor]}
        </TableCell>
      ))}
      {!!actions && <TableCell>{actions(rowIndex, row)}</TableCell>}
    </TableRow>
  ));

  return (
    <>
      <TableContainer component={Paper} variant='outlined'>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8F9FA"}}>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ width: column.width }}>
                  <TableSortLabel
                    active={sortConfig.key === column.accessor}
                    direction={sortConfig.direction}
                    onClick={() => handleSort(column)}
                    disabled={!column.sortable} // Disable if not sortable
                  >
                    <Typography
                      variant="subtitle1"
                        sx={{ textTransform: 'capitalize',
                            display: "inline", fontWeight: 600, fontSize: "0.75rem", lineHeight : 1.75 
                         }}
                    >
                      {column.label}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              ))}
              {!!actions && <TableCell>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize',
                display: "inline", fontWeight: 600, fontSize: "0.75rem", lineHeight : 1.75 
                }}>Action</Typography></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
      {data.length > 0 && 
      <Stack
        direction={{xs:'column',sm:"row"}}
        justifyContent={"space-between"}
        // m={2}
        alignItems={"center"}
        spacing={2}
        sx={{ p: '1rem', width : "100%" }}
      >
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <Typography>Rows per page</Typography>
          <Select
            variant="standard"
            value={initialItemsPerPage}
            onChange={handleItemsPerPageChange}
            sx={{ padding : 0, minWidth: 50 }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Pagination
          variant="outlined"
          shape="rounded"
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            ".MuiPaginationItem-root": {
              fontWeight: 400,
              fontSize : 14,
              "&.Mui-selected": {
                fontWeight: 600,
                color: "#1194ff",
                border: "1px solid #1194ff",
                "&:hover": {
                backgroundColor: (theme) => theme.palette.grey[100],
              },
              },
            },
          }}
        />
      </Stack>
      }
    </>
  );
};

export default DataTable;
