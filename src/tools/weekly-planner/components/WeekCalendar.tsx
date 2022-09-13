import { PageResponse } from "../../../interfaces";
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
      <DayContainer>
        <DayHeader>Monday</DayHeader>
        {days.monday.map((page) => (
          <p>{page.id}</p>
        ))}
      </DayContainer>
      <DayContainer>
        <DayHeader>Tuesday</DayHeader>
        {days.tuesday.map((page) => (
          <p>{page.id}</p>
        ))}
      </DayContainer>
      <DayContainer>
        <DayHeader>Wednesday</DayHeader>
        {days.wednesday.map((page) => (
          <p>{page.id}</p>
        ))}
      </DayContainer>
      <DayContainer>
        <DayHeader>Thursday</DayHeader>
        {days.thursday.map((page) => (
          <p>{page.id}</p>
        ))}
      </DayContainer>
      <DayContainer>
        <DayHeader>Friday</DayHeader>
        {days.friday.map((page) => (
          <p>{page.id}</p>
        ))}
      </DayContainer>
      <DayContainer>
        <DayHeader>Saturday</DayHeader>
        {days.saturday.map((page) => (
          <p>{page.id}</p>
        ))}
      </DayContainer>
      <DayContainer>
        <DayHeader>Sunday</DayHeader>
        {days.sunday.map((page) => (
          <p>{page.id}</p>
        ))}
      </DayContainer>
    </WeekContainer>
  );
};

export default WeekCalendar;

const WeekContainer = styled.div`
  display: flex;
`;

const DayContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const DayHeader = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
  font-weight: 500;
`;
