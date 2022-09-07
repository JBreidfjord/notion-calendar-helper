interface WeekdaySelectorProps {
  weekdays: string[];
  setWeekdays: React.Dispatch<React.SetStateAction<string[]>>;
}

const WeekdaySelector = ({ weekdays, setWeekdays }: WeekdaySelectorProps) => {
  const weekdayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleWeekday = (weekday: string) => {
    if (weekdays.includes(weekday)) {
      setWeekdays((prev) => prev.filter((w) => w !== weekday));
      return;
    }
    setWeekdays((prev) => [...prev, weekday]);
  };

  return (
    <div id="weekday-selector">
      {weekdayNames.map((weekdayName, index) => {
        const isSelected = weekdays.includes(weekdayName);
        return (
          <div
            key={index}
            className={`card ${isSelected ? "selected" : ""}`}
            onClick={() => toggleWeekday(weekdayName)}
          >
            {weekdayName.slice(0, 3)}
          </div>
        );
      })}
    </div>
  );
};

export default WeekdaySelector;
