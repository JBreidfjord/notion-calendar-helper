import { DateProperty, PageResponse, SelectProperty, TitleProperty } from "../../../interfaces";
import { getPageColor, getPageName, getScheduledDateAsMinutes } from "../utils";

import styled from "styled-components";
import { theme } from "../../../theme";
import { useMemo } from "react";

interface DayColumnProps {
  day: string;
  pages: PageResponse[];
}

const DayColumn = ({ day, pages }: DayColumnProps) => {
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const scheduled = page.properties.Scheduled as DateProperty;
      if (!scheduled.date?.start || !scheduled.date?.end) return false;
      return scheduled.date.start.split("T").length > 1; // Check if date has time
    });
  }, [pages]);

  return (
    <>
      <DayHeader>{day}</DayHeader>
      <DayContainer>
        {filteredPages.map((page) => {
          const [start, end] = getScheduledDateAsMinutes(page);
          return (
            <EventContainer key={page.id} color={getPageColor(page)} start={start} end={end}>
              {getPageName(page)}
            </EventContainer>
          );
        })}
      </DayContainer>
    </>
  );
};

export default DayColumn;

const DayContainer = styled.div`
  grid-row: content-start / content-end;
  display: grid;
  grid-template-rows: repeat(720, 1fr); // 12 hours
`;

const DayHeader = styled.h2`
  grid-row: header-start / header-end;
  margin: 0;
  margin-bottom: 8px;
  padding: 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

interface EventContainerProps {
  color?: string;
  start: number;
  end: number;
}

const EventContainer = styled.div<EventContainerProps>`
  background-color: ${(props) => (theme as any)[props.color || "default"]};
  grid-row: ${(props) => props.start} / ${(props) => props.end};
  border-radius: 8px;
`;
