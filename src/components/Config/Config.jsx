import { useState } from "react";
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Stack,
  TextField,
  Box,
  Card,
  Badge,
  Typography,
  Grow,
  IconButton,
  Divider,
  Tooltip,
  Fade,
} from "@mui/material";
import DateRangePicker from "../DateRangePicker/DateRangePicker";
import { 
  Analytics, 
  BarChart, 
  Clear, 
  Delete, 
  FilterList, 
  Search, 
  ViewColumn,
} from "@mui/icons-material";

const getCategoryIcon = (category) => {
  switch (category) {
    case "dimensions":
      return <ViewColumn />;
    case "metrics":
      return <BarChart />;
    case "filters":
      return <FilterList />;
    default:
      return <Analytics />;
  }
};

const Config = ({ config, criteria, onCriteriaChange, onFilterChange, filterItem }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [search, setSearch] = useState("");

  const chipConfigs = [
    {
      key: "dimensions",
      label: "Dimensions",
      count: filterItem.dimensions?.length || 0,
      color: "secondary",
    },
    {
      key: "metrics",
      label: "Metrics",
      count: filterItem.metrics?.length || 0,
      color: "secondary",
    },
    {
      key: "filters",
      label: "Filters",
      count: Object.keys(filterItem.filters || {}).length,
      color: "secondary",
    },
  ];

  const handleToggle = (category, item) => {
    if (category === "filters") {
      onFilterChange((prev) => {
        const exists = Object.prototype.hasOwnProperty.call(
          prev.filters,
          item.id
        );
        const newFilters = { ...prev.filters };

        if (exists) {
          delete newFilters[item.id];
        } else {
          newFilters[item.id] = "";
        }

        return { ...prev, filters: newFilters };
      });
    } else {
      onFilterChange((prev) => {
        const values = prev[category] || [];
        return {
          ...prev,
          [category]: values.includes(item.value)
            ? values.filter((v) => v !== item.value)
            : [...values, item.value],
        };
      });
    }
  };

  const handleDeleteChip = (category, item) => {
    if (category === "filters") {
      onFilterChange((prev) => {
        const newFilters = { ...prev.filters };
        delete newFilters[item.id];
        return { ...prev, filters: newFilters };
      });
    } else {
      onFilterChange((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== item.value),
      }));
    }
  };

  const handleApply = () => {
    onCriteriaChange({
      ...criteria,
      ...filterItem,
    });
    setOpenCategory(null);
    setSearch("");
  };

  const handleDialogClose = () => {
    setOpenCategory(null);
    setSearch("");
  };

  const renderSelectedChips = (category, items) => {
    if (category === "filters") return null;

    return filterItem[category]?.map((value) => {
      const item = items.find((i) => i.value === value);
      if (!item) return null;
      return (
        <Chip
          key={item.value}
          label={item.label}
          onDelete={() => handleDeleteChip(category, item)}
          size="small"
          color="primary"
          variant="filled"
          sx={{
            "& .MuiChip-label": {
              fontSize: "0.8125rem",
              fontWeight: 500,
            },
          }}
        />
      );
    });
  };

const renderFilterInputs = (items) => {
  const selectedItems = Object.keys(filterItem.filters)
    .map((filterId) => {
      const item = items.find((f) => f.id === filterId);
      if (!item) return null;

      if (item.type === "textInput") {
        return (
          <Fade in key={item.id}>
            <Card
              sx={{
                p: 2,
                mb: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  {item.label}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    placeholder="Enter value..."
                    value={filterItem.filters[item.id] || ""}
                    onChange={(e) =>
                      onFilterChange((prev) => ({
                        ...prev,
                        filters: {
                          ...prev.filters,
                          [item.id]: e.target.value,
                        },
                      }))
                    }
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment:
                        item.id === "search" && (
                          <Search fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                    }}
                  />
                  <Tooltip title="Remove filter" placement="top">
                    <IconButton
                      onClick={() => handleDeleteChip("filters", item)}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Card>
          </Fade>
        );
      }

      if (item.type === "daterange") {
        return (
          <Fade in key={item.id}>
            <Card
              sx={{
                p: 2,
                mb: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  {item.label}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <DateRangePicker
                    onChange={(validRange, label) =>
                      onFilterChange((prev) => ({
                        ...prev,
                        filters: {
                          ...prev.filters,
                          [item.id]: {
                            startDate: validRange.startDate,
                            endDate: validRange.endDate,
                            label: label,
                          },
                        },
                      }))
                    }
                    defaultRangeLabel={filterItem.filters[item.id]?.label || "All Time"}
                    isDisabled={false}
                    filterItem={filterItem}
                  />
                  <Tooltip title="Remove filter" placement="top">
                    <IconButton
                      onClick={() => handleDeleteChip("filters", item)}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Card>
          </Fade>
        );
      }

      return null;
    })
    .filter(Boolean);

  if (selectedItems.length === 0) return null;

  return (
    <>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Selected Filters
      </Typography>
      {selectedItems}
      <Divider sx={{ mx: -3, mb: 2 }} />
    </>
  );
};


  const renderList = (category, items) => {
    console.log("items",items)
    const filteredItems = items
      .filter((item) =>
        category === "filters"
          ? !Object.prototype.hasOwnProperty.call(filterItem.filters, item.id)
          : true
      )
      .filter((item) =>
        search ? item.label.toLowerCase().includes(search.toLowerCase()) : true
      );
      console.log("filteredItems",filteredItems)
    if (filteredItems.length === 0) {
      return (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Search sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No {category} found
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ pt: 1 }}>
        {filteredItems.map((item) => {
          const checked =
            category === "filters"
              ? filterItem.filters[item.id] !== undefined
              : filterItem[category]?.includes(item.value);

          return (
            <ListItem
              key={item.value || item.id}
              onClick={() => handleToggle(category, item)}
              sx={{
                cursor: "pointer",
                gap: 1,
                borderRadius: 1,
                mb: 0.5,
                transition: "all 0.2s",
                padding: 0,
                mt: 1
              }}
            >
              <Checkbox
                checked={checked}
                size="small"
                sx={{
                  "&.Mui-checked": {
                    color: "primary"
                  },
                }}
              />
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: checked ? 500 : 400,
                }}
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  const hasSelections = openCategory && openCategory !== "filters" && (
    Array.isArray(filterItem[openCategory])
      ? filterItem[openCategory].length > 0
      : Object.keys(filterItem[openCategory] || {}).length > 0
  );

  const shouldShowCard = !(openCategory === "filters" && Object.keys(filterItem.filters || {}).length > 0);

  return (
    <>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        {chipConfigs.map(({ key, label, count, color }) => (
          <Badge
            key={key}
            badgeContent={count}
            color={color}
            sx={{
              "& .MuiBadge-badge": {
                right: 6,
                top: 6,
                border: "1px solid lightgrey",
                fontSize: "0.6875rem",
                fontWeight: 600,
                minWidth: "22px",
                height: "22px",
                padding: "0 5px",
                backgroundColor: "#fff",
                color:"#5b6b79"
              },
            }}
          >
            <Chip
              icon={getCategoryIcon(key)}
              label={label}
              variant="outlined"
              onClick={() => setOpenCategory(key)}
              // color={color}
              sx={{
                p: "18px",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "all 0.2s",
                color: "#5b6b79",
                border: "1px solid lightgrey",
                "& .MuiChip-icon": {
                  color: "#5b6b79",
                },
              }}
            />
          </Badge>
        ))}
      </Stack>

      <Dialog
        open={Boolean(openCategory)}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Grow}
        PaperProps={{
          sx: {
            minHeight: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 1
              }}
            >
              {getCategoryIcon(openCategory)}
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Select {openCategory}
            </Typography>
          </Stack>

          {shouldShowCard && (
            <Fade in>
              <Card
                sx={{
                  mt: 2,
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  position: "relative"
                }}
              >
                {hasSelections && <Tooltip title="Clear all" placement="top">
                  <IconButton
                    size="small"
                    onClick={() =>
                      onFilterChange((prev) => ({
                        ...prev,
                        [openCategory]: openCategory === "filters" ? {} : [],
                      }))
                    }
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      boxShadow: 1
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </Tooltip>}

                {hasSelections && <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "block" }}>
                  Selected ({openCategory === "filters" ? Object.keys(filterItem[openCategory] || {}).length : filterItem[openCategory]?.length || 0})
                </Typography> }
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {hasSelections ? (
                    renderSelectedChips(openCategory, config.criteriaView[openCategory])
                  ) : (
                  <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", 
                    width: "100%",
                    minHeight: "3rem",
                  }}>
                    <Typography variant="body2" color="text.secondary">{`No ${openCategory} selected`}</Typography>
                  </Box>)}
                </Stack>
              </Card>
            </Fade>
          )}
        {/* <Divider /> */}


        </DialogTitle>
        <DialogContent sx={{ px: 3 }} dividers>
          {openCategory === "filters" && (
            <Box>
              {renderFilterInputs(config.criteriaView[openCategory])}
            </Box>
          )}

          {openCategory && (
            <TextField
              fullWidth
              placeholder={`Search ${openCategory}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <Search fontSize="small" />,
              }}
            />
          )}

          {openCategory && renderList(openCategory, config.criteriaView[openCategory])}
        </DialogContent>


        {/* <Divider /> */}

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleDialogClose} variant="outlined" sx={{ minWidth: 90 }}>
            Cancel
          </Button>
          <Button onClick={handleApply} variant="contained" sx={{ minWidth: 90 }}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Config;