import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Typography,
  Stack,
  Pagination,
  TableSortLabel,
  Select,
  MenuItem,
  Box,
  TableFooter,
  CircularProgress
} from "@mui/material";

const IzListingTable = ({
  data,
  columns,
  actions,
  pagination,
  filters,
  onFilter,
  footer,
  config,
  loading,
  showLoadMoreBtn,
  onLoadMore,
  loadingMoreData
}) => {
  const rows = data.map((row, rowIndex) => (
    <TableRow key={rowIndex} sx={{'&:hover .hiddenCell': {opacity: 1}}}>
      {columns.map((column) => (
        <TableCell
          key={column.id}
          align="left"
          className={column.className}
          sx={{
            opacity: column.className === 'hiddenCell' ? 0 : 1,
            p: '0.5rem',
            width: column.width || 'auto',
            maxWidth: column.width || 'none',
            whiteSpace: column.wrap === false ? 'nowrap' : 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
           {!!column.cell ? column.cell(row, rowIndex) : row[column.accessor] || '-'}
        </TableCell>
      ))}
      {!!actions && <TableCell  sx={{
      p: '0.5rem',
      whiteSpace: 'nowrap',
      width: '1%',
      maxWidth: '1%',
    }}>{actions(rowIndex, row)}</TableCell>}
    </TableRow>
  ));

  return (
    <>
      <TableContainer elevation={0} component={Paper} sx={{ overflowY: config?.height ? "auto" : "hidden", overflowX: "auto", position: "relative", height: config?.height, border: "1px solid #e0e0e0" }}>
        <Table sx={{ padding :" 2rem"}}>
        <TableHead sx={config?.stickyHeader && { position: 'sticky', top: 0 }}>
            <TableRow sx={{ backgroundColor: "#F8F9FA"}}>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ px: '0.5rem' }}>
                <Box display="flex" alignItems="center">
                  {column.sortable ? (
                    <TableSortLabel
                      active={false} 
                      direction={filters.sortAs === 'DESC' ? 'desc' : 'asc'}
                      onClick={() => onFilter({
                        sortBy: column.accessor,
                        sortAs: filters.sortAs === 'ASC' ? 'DESC' : 'ASC'
                      })}
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
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{ textTransform: 'capitalize', 
                          display: "inline", fontWeight: 600, fontSize: "0.75rem", lineHeight : 1.75 
                      }}
                    >
                      {column.label}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              ))}
              {!!actions && (
                <TableCell
                  sx={{
                    p: '0.5rem',
                    whiteSpace: 'nowrap',
                    width: '1%',
                    maxWidth: '1%',
                  }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ textTransform: 'capitalize',
                        display: "inline", fontWeight: 600, fontSize: "0.75rem", lineHeight : 1.75 
                    }}
                  >
                    Action
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody sx={{ padding : "2rem"}}>{rows}</TableBody>
          <TableFooter sx={config?.stickyFooter && { position: 'sticky', bottom: 0 }}>{footer}</TableFooter>
        </Table>
        <Stack
          sx={{
          position: 'absolute',
            top: 20,
          left: 0,
          width: '100%',
          height: '100%',
          // backgroundColor: 'rgba(255, 255, 255, 0.5)',
          display: loading ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: loading && 0.5,
          zIndex: loading ? 10 : -1,
          }}
        >
          <CircularProgress/>
        </Stack>
        {rows.length === 0 && !showLoadMoreBtn && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ p: '1rem' }}
          >
            <Typography variant="subtitle1">
              No Data To Show
            </Typography>
          </Stack>
        )}

        {rows.length === 0 && showLoadMoreBtn && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ p: '1rem' }}
          >
            <Typography variant="body">
              {/* {(filters.search || filters.dates.startDate || filters.status.length > 0 || filters.type.length > 0)
                ? <FormattedMessage id="No-campaign-found-in-last-60-days" />
                : <FormattedMessage id="No-data-sent-in-last-60-days" />
              } */}
            </Typography>
          </Stack>
        )}

      </TableContainer>

      {showLoadMoreBtn && (
        (pagination?.totalPageCount === pagination?.index || pagination?.totalPageCount === 0) && (
          <Stack direction="row" justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              sx={{ color: "black", border: "1px solid lightgrey" }}
              onClick={onLoadMore}
              disabled={loadingMoreData}
            >
              <Spinner loading={loadingMoreData} />
              {/* <FormattedMessage id="Load-More" /> */}
            </Button>
          </Stack>
        )
      )}


      {pagination && <Stack
        direction={{xs:"column" , sm:"row"}}
        justifyContent={"space-between"}
        alignItems={"center"}
        spacing={2}
        sx={{ p: '1rem', width: '100%' }}
      >
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <Typography>Rows per page</Typography>
          <Select
          variant="standard"
            defaultValue={10}
            value = {pagination.pageSize}
            onChange={(e) =>
              onFilter({ pageSize: e.target.value, pageIndex: 1 })
            }
            sx={{ padding : 0, minWidth: 50 }}
          >
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="20">20</MenuItem>
            <MenuItem value="30">30</MenuItem>
            <MenuItem value="40">40</MenuItem>
          </Select>
        </Stack>
        <Stack>
        <Pagination
          count={pagination.totalPageCount}
          page={pagination.index}
          onChange={(event, pageIndex) =>
            onFilter({ pageIndex })
          }
          variant="outlined"
          shape="rounded"
          disabled={loading}
          sx={{
            ".MuiPaginationItem-root": {
              fontWeight: 400,
              fontSize : 14,
              "&.Mui-selected": {
                fontWeight: 600,
                color : "#1194ff", 
                border : '1px solid #1194ff',
                "&:hover": {
                backgroundColor: (theme) => theme.palette.grey[100],
              }
              },
            },
          }}
        />
        </Stack>
      </Stack>
      }
    </>
  );
};

export default IzListingTable;