import React, {
  ChangeEventHandler,
  LegacyRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { format } from "date-fns";

import { DateRange, DayPicker } from "react-day-picker";
import { usePopper } from "react-popper";
import "react-day-picker/dist/style.css";
import { he } from "date-fns/locale";
import {
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  Portal,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

const DatePickerDialog: React.FC<{
  onChange: Function;
  isRange: boolean;
  isMultiple?: boolean;
  defaultDate?: Date | Date[];
  isBirthday?: boolean;
  dateEndRange?: Date;
  disableDates?: Date[];
}> = ({
  onChange,
  isRange,
  isMultiple,
  defaultDate,
  isBirthday,
  dateEndRange,
  disableDates,
}) => {
  const today = new Date();

  if (defaultDate instanceof Date && defaultDate.getDay() === 6) {
    defaultDate.setDate(defaultDate.getDate() + 1);
  }
  const [selected, setSelected] = useState<Date | undefined>(
    defaultDate as Date
  );

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    undefined
  );
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(
    defaultDate as Date[]
  );
  const disableDatesArray = disableDates || [];

  const defaultInputValue =
    defaultDate && !Array.isArray(defaultDate)
      ? format(defaultDate, "dd/MM/yyyy")
      : "";
  const [inputValue, setInputValue] = useState<string>(defaultInputValue);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const popperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLInputElement>(null);
  const pickerBoxRef = useRef<any>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  useMemo(() => {
    if (Array.isArray(defaultDate)) {
      setInputValue(`נבחרו ${defaultDate?.length} תאריכים`);
      setSelectedDates(defaultDate);
    }
  }, [defaultDate]);
  useEffect(() => {
    if (defaultDate) {
      onChange(defaultDate.valueOf());
    }
    const handleClickOutside = (event: any) => {
      if (
        pickerBoxRef.current &&
        !pickerBoxRef.current.contains(event.target)
      ) {
        setIsPopperOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  const popper = usePopper(popperRef.current, popperElement, {
    placement: "bottom",
    strategy: "fixed",
  });

  const handleDaySelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      setInputValue(format(date as Date, "dd/MM/yyyy"));
      onChange(date.valueOf());
      setIsPopperOpen(false);
    } else {
      setInputValue("");
      onChange(undefined);
    }
  };
  const handleDatesSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates);
    if (dates) {
      setInputValue(`נבחרו ${dates.length} תאריכים`);
      onChange(dates);
    } else {
      setInputValue("");
      onChange(undefined);
    }
  };
  const handleRangeSelect = (dateRange: DateRange | undefined) => {
    setSelectedRange(dateRange);
    if (dateRange && dateRange.from && dateRange.to) {
      setInputValue(
        `${format(dateRange.to, "dd/MM/yyyy")} - ${format(
          dateRange.from,
          "dd/MM/yyyy"
        )}`
      );
      onChange({
        from: dateRange.from.valueOf(),
        to: dateRange.to.valueOf(),
      });
      setIsPopperOpen(false);
    } else {
      setInputValue("");
      onChange(undefined);
    }
  };

  return (
    <>
      <InputGroup ref={popperRef}>
        <Input
          type="text"
          placeholder={isRange ? "בחר טווח תאריכים" : "בחר תאריך"}
          textAlign="center"
          value={inputValue}
          size="sm"
          rounded="md"
          // fontSize={"sm"}
          readOnly
          lang="he-IL"
          _hover={{
            shadow: "1px 1px 3px rgba(0,0,0,0.3) ",
          }}
          borderRadius={"0.375em"}
          ref={buttonRef}
          onClick={() => setIsPopperOpen(true)}
        />
        <InputLeftElement children={<CalendarIcon />} boxSize={8} />
      </InputGroup>
      {isPopperOpen && (
        <Box
          style={popper.styles.popper}
          {...popper.attributes.popper}
          ref={setPopperElement}
          zIndex={"sticky"}
          bg="#E0E0E0"
          border="1px solid black"
          borderRadius={"1em"}
          p={2}
          role="dialog"
          aria-label="DayPicker calendar"
        >
          <Box ref={pickerBoxRef} display={"flex"} justifyContent={"center"}>
            {isRange ? (
              <DayPicker
                initialFocus={isPopperOpen}
                dir="rtl"
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={2030}
                mode={"range"}
                style={{ width: "100%" }}
                locale={he}
                disabled={[{ before: today }, { dayOfWeek: [6] }]}
                selected={selectedRange}
                onSelect={handleRangeSelect}
              />
            ) : isMultiple ? (
              <DayPicker
                initialFocus={isPopperOpen}
                dir="rtl"
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={2030}
                mode={"multiple"}
                style={{ width: "100%" }}
                locale={he}
                disabled={
                  !isBirthday
                    ? [
                        { before: today, after: dateEndRange },
                        { dayOfWeek: dateEndRange ? [5, 6] : [6] },
                        ...disableDatesArray,
                      ]
                    : []
                }
                selected={selectedDates}
                onSelect={handleDatesSelect}
              />
            ) : (
              <DayPicker
                initialFocus={isPopperOpen}
                dir="rtl"
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={2030}
                style={{ width: "100%" }}
                mode={"single"}
                locale={he}
                disabled={
                  !isBirthday
                    ? [
                        { dayOfWeek: dateEndRange ? [6] : [6] },
                        { before: today, after: dateEndRange },
                        // { after: dateEndRange },
                        ...disableDatesArray,
                        // dateEndRange ? { after: dateEndRange } : {},
                      ]
                    : []
                }
                defaultMonth={selected}
                selected={selected}
                onSelect={handleDaySelect}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default DatePickerDialog;
