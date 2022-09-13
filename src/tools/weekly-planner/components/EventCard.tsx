import { getPageColor, getPageName, getScheduledDateAsMinutes } from "../utils";

import { PageResponse } from "../../../interfaces";
import styled from "styled-components";
import { theme } from "../../../theme";

interface EventCardProps {
  page: PageResponse;
}

const EventCard = ({ page }: EventCardProps) => {
  const [start, end] = getScheduledDateAsMinutes(page);

  // TODO: Include more data on cards
  return (
    <Container key={page.id} color={getPageColor(page)} start={start} end={end}>
      {getPageName(page)}
    </Container>
  );
};

export default EventCard;

interface ContainerProps {
  color?: string;
  start: number;
  end: number;
}

const Container = styled.div<ContainerProps>`
  background-color: ${(props) => (theme as any)[props.color || "default"]};
  grid-row: ${(props) => props.start} / ${(props) => props.end};
  border-radius: 5px;
  overflow: hidden;
`;
