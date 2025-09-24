import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { DateRangePicker } from "date-range-picker-mui";
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

const dateRangePickerStyling = (rangeLabel) => ({
  "& .MuiPaper-root": { boxShadow: "none" },
  "& .MuiBox-root.css-5rqmb4": { backgroundColor: "#D6E9FF" },
  "& .MuiBox-root.css-4y9k3l": { backgroundColor: "#D6E9FF" },
  "& .MuiBox-root.css-9bksui": { backgroundColor: "#D6E9FF" },
  "& .Mui-disabled .MuiTypography-root": {
    color: "#B0B5BB"
  },
  "& .DatePicker-root > div > div > div > div:nth-of-type(1)": { 
    display: { xs: "none", sm: "flex" } 
  },
  "& .DatePicker-root > div > div > div > ul": { 
    display: { xs: rangeLabel === "Custom" ? "none" : "block", sm: "block" } 
  },
  "& .DatePicker-root > div > div > div > div:nth-of-type(2)": { 
    display: { xs: rangeLabel !== "Custom" && "none", sm: "flex" } 
  },
  "& .DatePicker-root > div > div > div > div:nth-of-type(2) > div:nth-of-type(2)": { 
    display: { xs: "none", sm: "flex" } 
  },
  "& .DatePicker-root > div > div > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(3) > div > div > div > div:nth-of-type(3)": {
    maxHeight : { xs  : "20rem" , sm : "35rem" }
  },
});

const DateRangePickerInput = ({ onClose, onChange, minDate }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rangeLabel, setRangeLabel] = useState("");

  
  const definedRanges = [
    {
      id: "This Week",
      label: "This Week",
      startDate: startOfDay(subDays(new Date(), new Date().getDay())),
      endDate: endOfDay(new Date()),
    },
    {
      id: "Last 7 Days",
      label: "Last 7 Days",
      startDate: startOfDay(subDays(new Date(), 6)),
      endDate: endOfDay(new Date()),
    },
    {
      id: "Last 30 Days",
      label: "Last 30 Days",
      startDate: startOfDay(subDays(new Date(), 29)),
      endDate: endOfDay(new Date()),
    },
    {
      id: "This Month",
      label: "This Month",
      startDate: startOfDay(startOfMonth(new Date())),
      endDate: endOfDay(new Date()),
    },
    {
      id: "Last Month",
      label: "Last Month",
      startDate: startOfDay(startOfMonth(subMonths(new Date(), 1))),
      endDate: endOfDay(endOfMonth(subMonths(new Date(), 1))),
    },
    {
      id: "All Time",
      label: "All Time",
      startDate: new Date('January 1, 1970, 00:00:00 UTC'),
      endDate: new Date(),
    },
    {
      id: "Custom",
      label: "Custom",
    },
  ];

  const handleRangeChange = (range) => {
    if (range?.id === "All Time") {
      onChange({ startDate: null, endDate: null }, range.id);
      onClose(false);
      return;
    }

    setStartDate(startOfDay(range.startDate));
    setEndDate(endOfDay(range.endDate));

    const isPredefinedRange = definedRanges.some(
      (definedRange) =>
        definedRange.label === range.label &&
        definedRange.startDate?.toISOString() === range.startDate?.toISOString() &&
        definedRange.endDate?.toISOString() === range.endDate?.toISOString()
    );

    const label = isPredefinedRange
      ? range.id
      : "Custom";

    setRangeLabel(label);

    if (isPredefinedRange) {
      onChange({ startDate: range.startDate, endDate: range.endDate }, label);
      onClose(false);
    }
  };

  const handleApplyButtonClick = () => {
    onChange({ startDate, endDate }, rangeLabel);
    onClose(false);
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={dateRangePickerStyling(rangeLabel)}
    >
      <DateRangePicker
        open
        toggle={onClose}
        onChange={handleRangeChange}
        maxDate={new Date()}
        minDate={minDate}
        definedRanges={definedRanges}
        wrapperClassName={"DatePicker-root"}
      />
      <Button
        variant="contained"
        sx={{ marginBottom: "15px", marginRight: "15px", alignSelf: "flex-end", 
          display: { xs: rangeLabel !== "Custom" ? "none" : "flex",sm: "flex"}
        }}
        disabled={startDate == "Invalid Date" || endDate == "Invalid Date" || !startDate || !endDate }
        onClick={handleApplyButtonClick}
      >
        Apply
      </Button>
    </Stack>
  );
};

export default DateRangePickerInput;