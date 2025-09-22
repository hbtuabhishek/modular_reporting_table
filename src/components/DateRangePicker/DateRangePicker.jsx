import { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import DateRangePickerInput from "./DateRangePickerInput";
import { TextField, useMediaQuery, useTheme } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { format } from 'date-fns';

const formatDate = (date) => format(new Date(date), 'MMM d, yyyy');

export default function DateRangePicker({onChange, defaultRangeLabel,minDate,isDisabled}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [range,setRange] = useState(defaultRangeLabel);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(()=>{
    setRange(defaultRangeLabel)
  },[defaultRangeLabel])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangeChange = (validRange, label) => {
    setStartDate(validRange.startDate);
    setEndDate(validRange.endDate);
    setRange(label);
    onChange(validRange, label)
  };
  
  const open = Boolean(anchorEl);

  const dateRangeText =
  range === "Custom" && startDate && endDate
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    :  range || "All Time";

  return (
    <>
      <TextField
        fullWidth
        disabled={isDisabled}
        size="small"
        InputProps={{ endAdornment: ( <CalendarMonth sx={{cursor:"pointer"}}/> ), readOnly: true }}
        onClick={handleClick}
        value={dateRangeText}
        sx={{
          '.MuiInputBase-input': {
            cursor: 'pointer',
          }
        }}
     />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transitionDuration={0}
      >
          <DateRangePickerInput onChange={handleDateRangeChange} onClose={handleClose} minDate={minDate} />
      </Popover>
    </>
  );
}
