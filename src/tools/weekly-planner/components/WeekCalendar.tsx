import DayColumn from "./DayColumn";
import { PageResponse } from "../../../interfaces";
import Timeline from "./Timeline";
import { partitionWeek } from "../utils";
import styled from "styled-components";
import { useMemo } from "react";

interface WeekCalendarProps {
  pages: PageResponse[];
}

const WeekCalendar = ({ pages }: WeekCalendarProps) => {
  const days = useMemo(() => partitionWeek(pages), [pages]);

  return (
    <WeekContainer>
      <Timeline />
      <DayColumn day="Monday" pages={days.monday} />
      <DayColumn day="Tuesday" pages={days.tuesday} />
      <DayColumn day="Wednesday" pages={days.wednesday} />
      <DayColumn day="Thursday" pages={days.thursday} />
      <DayColumn day="Friday" pages={days.friday} />
      <DayColumn day="Saturday" pages={days.saturday} />
      <DayColumn day="Sunday" pages={days.sunday} />
    </WeekContainer>
  );
};

export default WeekCalendar;

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: [timeline-start] 0.25fr [timeline-end] repeat(7, 1fr);
  grid-template-rows: [header-start] 1fr [header-end content-start] 100fr [content-end];
  background-color: #3b3b3b62;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  height: 80vh;
`;
