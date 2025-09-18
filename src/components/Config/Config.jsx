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
  Paper,
  TextField,
  Box,
  Card,
  Badge,
  Typography,
} from "@mui/material";
import DateRangePicker from "../DateRangePicker/DateRangePicker";

const Config = ({ config, criteria, onCriteriaChange, setSelected, selected }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [search, setSearch] = useState("");

  const chipConfigs = [
    {
      key: "dimensions",
      label: "Dimensions",
      count: selected.dimensions?.length || 0,
      color: "primary",
    },
    {
      key: "metrics",
      label: "Metrics",
      count: selected.metrics?.length || 0,
      color: "secondary",
    },
    {
      key: "filters",
      label: "Filters",
      count: Object.keys(selected.filters || {}).length,
      color: "success",
    },
  ];

  const handleToggle = (category, item) => {
    if (category === "filters") {
      setSelected((prev) => {
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
      setSelected((prev) => {
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
      setSelected((prev) => {
        const newFilters = { ...prev.filters };
        delete newFilters[item.id];
        return { ...prev, filters: newFilters };
      });
    } else {
      setSelected((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== item.value),
      }));
    }
  };

  const handleApply = () => {
    onCriteriaChange({
      ...criteria,
      ...selected,
    });
    setOpenCategory(null);
    setSearch("");
  };

  const renderSelectedChips = (category, items) => {
    if (category === "filters") {
      return Object.keys(selected.filters).map((filterId) => {
        const item = items.find((f) => f.id === filterId);
        if (!item) return null;

        return (
          <Chip
            key={item.id}
            label={item.label}
            onDelete={() => handleDeleteChip("filters", item)}
            size="small"
            color="primary"
          />
        );
      });
    } else {
      return selected[category]?.map((value) => {
        const item = items.find((i) => i.value === value);
        if (!item) return null;
        return (
          <Chip
            key={item.value}
            label={item.label}
            onDelete={() => handleDeleteChip(category, item)}
            size="small"
            color="primary"
          />
        );
      });
    }
  };

  const renderFilterInputs = (items) => {
    return Object.keys(selected.filters)
      .map((filterId) => {
        const item = items.find((f) => f.id === filterId);
        if (!item) return null;

        if (search && !item.label.toLowerCase().includes(search.toLowerCase())) {
          return null;
        }

      if (item.type === "textInput") {
        return (
          <Stack spacing={1} mb={2}>
          <Typography variant="body2">Search: </Typography>
          <TextField
            key={item.id}
            label={item.label}
            value={selected.filters[item.id] || ""}
            onChange={(e) =>
              setSelected((prev) => ({
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
          />
          </Stack>
        );
      }

      if (item.type === "daterange") {
        return (
            <Stack spacing={1}>
            <Typography variant="body2">Date Range: </Typography>
            <DateRangePicker
              onChange={(validRange, label) =>
                setSelected((prev) => ({
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
              defaultRangeLabel={selected.filters[item.id]?.label || "All Time"}
              isDisabled={false}
            />
          </Stack>
        );
      }

      return null;
    })
    .filter(Boolean);
  };

  const renderList = (category, items) => (
    <List>
      {items
        .filter((item) =>
          category === "filters"
            ? !Object.prototype.hasOwnProperty.call(selected.filters, item.id)
            : true
        )
        .filter((item) =>
          search ? item.label.toLowerCase().includes(search.toLowerCase()) : true
        )
        .map((item) => {
          const checked =
            category === "filters"
              ? selected.filters[item.id] !== undefined
              : selected[category]?.includes(item.value);

          return (
            <ListItem
              key={item.value || item.id}
              onClick={() => handleToggle(category, item)}
            >
              <Checkbox checked={checked} />
              <ListItemText primary={item.label} />
            </ListItem>
          );
        })}
    </List>
  );

  return (
    <Stack direction="row" spacing={2}>
    {chipConfigs.map(({ key, label, count, color }) => (
      <Badge
        key={key}
        badgeContent={count}
        color={color}
        sx={{ "& .MuiBadge-badge": { right: 4, top: 4 } }}
      >
        <Chip
          label={label}
          onClick={() => setOpenCategory(key)}
          color={color}
          sx={{
            px: 1,
            py: 1,
            height: 35,
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
      >
        <DialogTitle>Select {openCategory}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
          <Card sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {openCategory &&
                renderSelectedChips(
                  openCategory,
                  config.criteriaView[openCategory]
                )}
            </Stack>
          </Card>

          {openCategory === "filters" && (
            <Box sx={{ mb: 3 }}>
              {renderFilterInputs(config.criteriaView[openCategory])}
            </Box>
          )}

          {openCategory &&
            renderList(openCategory, config.criteriaView[openCategory])}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategory(null)}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Config;