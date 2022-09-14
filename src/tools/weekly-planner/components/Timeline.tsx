import styled from "styled-components";

const Timeline = () => {
  const times = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  return (
    <>
      <CornerGap />
      <TimeContainer>
        {times.map((time, index) => (
          <Time key={index} start={index * 60 + 1} end={(index + 1) * 60 + 1}>
            {time}
          </Time>
        ))}
      </TimeContainer>
    </>
  );
};

export default Timeline;

const TimeContainer = styled.div`
  grid-row: content-start / content-end;
  grid-column: timeline-start / timeline-end;
  display: grid;
  grid-template-rows: repeat(720, 1fr); // 12 hours
  align-items: start;
  justify-items: end;
`;

interface TimeProps {
  start: number;
  end: number;
}

const Time = styled.div<TimeProps>`
  grid-row: ${(props) => props.start} / ${(props) => props.end};
  font-size: 0.85rem;

  &:after {
    content: "";
    position: absolute;
    width: calc((84vw - 64px) * 0.75);
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
    height: 3vh;
    z-index: -1;
    transform: translateX(-1rem);
  }
`;

const CornerGap = styled.div`
  grid-row: header-start / header-end;
  grid-column: timeline-start / timeline-end;
`;
