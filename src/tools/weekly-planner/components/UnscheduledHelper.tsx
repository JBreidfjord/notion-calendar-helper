import { DateProperty, PageResponse } from "../../../interfaces";
import { getPageColor, getPageName } from "../utils";

import styled from "styled-components";
import { theme } from "../../../theme";
import { useMemo } from "react";

interface UnscheduledHelperProps {
  pages: PageResponse[];
  unscheduledPages: PageResponse[];
  loading: boolean;
  handleRefresh: () => void;
}

const UnscheduledHelper = ({
  pages,
  unscheduledPages,
  loading,
  handleRefresh,
}: UnscheduledHelperProps) => {
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const scheduled = page.properties.Scheduled as DateProperty;
      if (!scheduled.date?.start) return true;
      return scheduled.date.start.split("T").length === 1; // Check if date has time
    });
  }, [pages]);

  const mergedPages = useMemo(() => {
    return [...filteredPages, ...unscheduledPages];
  }, [filteredPages, unscheduledPages]);

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <h3>Unscheduled</h3>
      {mergedPages.map((page) => (
        <Card key={page.id} color={getPageColor(page)}>
          {getPageName(page)}
        </Card>
      ))}
      <Button onClick={handleRefresh}>Refresh</Button>
    </Container>
  );
};

export default UnscheduledHelper;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  gap: 8px;
`;

const Card = styled.div`
  background-color: ${(props) => (theme as any)[props.color || "default"]};
`;

const Button = styled.button`
  margin: auto 0 0;
`;
