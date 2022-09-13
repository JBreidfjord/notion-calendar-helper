import { DateProperty, PageResponse } from "../../../interfaces";

import EventCard from "./EventCard";
import styled from "styled-components";
import { useMemo } from "react";

interface DayColumnProps {
  day: string;
  pages: PageResponse[];
}

const DayColumn = ({ day, pages }: DayColumnProps) => {
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const scheduled = page.properties.Scheduled as DateProperty;
      if (!scheduled.date?.start) return false;
      return scheduled.date.start.split("T").length > 1; // Check if date has time
    });
  }, [pages]);

  return (
    <>
      <DayHeader>{day}</DayHeader>
      <DayContainer>
        {filteredPages.map((page) => (
          <EventCard key={page.id} page={page} />
        ))}
      </DayContainer>
    </>
  );
};

export default DayColumn;

const DayContainer = styled.div`
  grid-row: content-start / content-end;
  display: grid;
  grid-template-rows: repeat(720, 1fr); // 12 hours
  overflow: hidden;
`;

const DayHeader = styled.h3`
  grid-row: header-start / header-end;
  margin: 0;
  margin-bottom: 8px;
  padding: 0;
`;
