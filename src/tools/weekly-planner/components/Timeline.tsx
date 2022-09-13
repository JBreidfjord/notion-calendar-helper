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
`;

interface TimeProps {
  start: number;
  end: number;
}

const Time = styled.div<TimeProps>`
  grid-row: ${(props) => props.start} / ${(props) => props.end};
`;

const CornerGap = styled.div`
  grid-row: header-start / header-end;
  grid-column: timeline-start / timeline-end;
`;
