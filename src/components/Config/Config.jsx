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
  Tooltip
} from "@mui/material";
import DateRangePicker from "../DateRangePicker/DateRangePicker";
import { Analytics, BarChart, Clear, Delete, FilterList, Search, ViewColumn } from "@mui/icons-material";

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
      color: "primary",
    },
    {
      key: "metrics",
      label: "Metrics",
      count: filterItem.metrics?.length || 0,
      color: "primary",
    },
    {
      key: "filters",
      label: "Filters",
      count: Object.keys(filterItem.filters || {}).length,
      color: "primary",
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
          sx={{
            "& .MuiChip-label": {
              fontSize: "0.80rem",
            },
          }}
        />
      );
    });
  };

  const renderFilterInputs = (items) => {
    return Object.keys(filterItem.filters)
      .map((filterId) => {
        const item = items.find((f) => f.id === filterId);
        if (!item) return null;

        if (search && !item.label.toLowerCase().includes(search.toLowerCase())) {
          return null;
        }

      if (item.type === "textInput") {
        return (
          <Stack spacing={1} mt={1}>
            <Typography variant="body1">{item.label || ""}: </Typography>
            <Stack spacing={1} direction="row" mb={2}>
              <TextField
                placeholder="Enter Value"
                key={item.id}
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
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: item.id == "search" && <Search fontSize="small" sx={{ mr: 1 }} />,
                }}
              />
              <Tooltip title="Delete" placement="top">
                <IconButton variant="outlined" sx={{ textTransform: "none" }} 
                  onClick={() => handleDeleteChip("filters", item)}><Delete/>
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        );
      }

      if (item.type === "daterange") {
        return (
          <Stack spacing={1} mt={1}>
          <Typography variant="body1">{item.label || ""}: </Typography>
            <Stack spacing={1} direction="row">
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
            <Tooltip title="Delete" placement="top">
              <IconButton variant="outlined" sx={{ textTransform: "none" }} onClick={() => handleDeleteChip("filters", item)}><Delete/></IconButton>
            </Tooltip>
          </Stack>
          </Stack>
        );
      }

      return null;
    })
    .filter(Boolean);
  };

  const renderList = (category, items) => {
    const filteredItems = items
      .filter((item) =>
        category === "filters"
          ? !Object.prototype.hasOwnProperty.call(filterItem.filters, item.id)
          : true
      )
      .filter((item) =>
        search ? item.label.toLowerCase().includes(search.toLowerCase()) : true
      );

    if (filteredItems.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ p: 2, textAlign: "center" }}
        >
          No {category} available
        </Typography>
      );
    }

    return (
      <List>
        {filteredItems.map((item) => {
          const checked =
            category === "filters"
              ? filterItem.filters[item.id] !== undefined
              : filterItem[category]?.includes(item.value);

          return (
            <ListItem
              key={item.value || item.id}
              onClick={() => handleToggle(category, item)}
              sx={{ cursor:"pointer", gap: 1 }}
            >
              <Checkbox checked={checked} size="small"/>
              <ListItemText primary={item.label} primaryTypographyProps={{
                fontSize: "0.875rem"
              }}/>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Stack direction="row" spacing={2}>

    {chipConfigs.map(({ key, label, count, color }) => (
      <Badge
        key={key}
        badgeContent={count}
        color={color}
          sx={{
            "& .MuiBadge-badge": {
                right: 4,
                top: 4,
                border: "1px solid",
                fontSize: "0.65rem",
                minWidth: "20px",
                height: "20px",
                padding: "0 4px",
                lineHeight: "16px",
            },
          }}
      >
        <Chip
          icon={getCategoryIcon(key)}
          label={label}
          variant="outlined"
          onClick={() => setOpenCategory(key)}
          color={color}
          sx={{
            px: 1,
            py: 1,
            height: 38,
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        />
      </Badge>
    ))}
      <Dialog
        open={Boolean(openCategory)}
        onClose={() => setOpenCategory(null)}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Grow}
          PaperProps={{
            sx: {
              minHeight: 400,
            },
          }}
      >
        <DialogTitle>Select {openCategory}
          <TextField
            fullWidth
            placeholder={`Search ${openCategory}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
            }}
            sx={{ mt: 2, bgcolor:"grey.50" }}
          />
            {openCategory && openCategory !== "filters" && (
              (Array.isArray(filterItem[openCategory])
                ? filterItem[openCategory].length > 0
                : Object.keys(filterItem[openCategory] || {}).length > 0) && (
                <Card
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
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
                      top: 3,
                      right: 3,
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>

                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {renderSelectedChips(
                      openCategory,
                      config.criteriaView[openCategory]
                    )}
                  </Stack>
                </Card>
              )
            )}
            </DialogTitle>
          <DialogContent>
          {openCategory === "filters" && (
            <Box>
              {renderFilterInputs(config.criteriaView[openCategory])}
            </Box>
          )}
          {openCategory && renderList(openCategory, config.criteriaView[openCategory])}
        </DialogContent>
        <Divider/>
        <DialogActions>
          <Button onClick={() => setOpenCategory(null)}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Config;