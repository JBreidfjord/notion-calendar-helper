import { useEffect, useState } from "react";

import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { PageResponse } from "../../interfaces";
import { ToolProps } from "../interfaces";
import UnscheduledHelper from "./components/UnscheduledHelper";
import WeekCalendar from "./components/WeekCalendar";
import styled from "styled-components";

interface WeeklyPlannerProps extends ToolProps {}

interface Week {
  start: Date;
  end: Date;
}

const getCurrentWeek = (): Week => {
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1); // Set to Monday
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6); // Set to Sunday
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const WeeklyPlanner = ({ databaseId, client }: WeeklyPlannerProps) => {
  const [database, setDatabase] = useState<GetDatabaseResponse | null>(null);
  const [week, setWeek] = useState(getCurrentWeek());
  const [pages, setPages] = useState<PageResponse[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [shouldLoadPages, setShouldLoadPages] = useState(true);
  const [unscheduledPages, setUnscheduledPages] = useState<PageResponse[]>([]);
  const [loadingUnscheduledPages, setLoadingUnscheduledPages] = useState(false);
  const [shouldLoadUnscheduledPages, setShouldLoadUnscheduledPages] = useState(true);

  const handleRefresh = () => {
    setShouldLoadPages(true);
    setShouldLoadUnscheduledPages(true);
  };

  useEffect(() => {
    const fetchDatabase = async () => {
      const response = await client.databases.retrieve({ database_id: databaseId });
      setDatabase(response);
    };

    fetchDatabase().catch(console.error);
  }, [databaseId, client]);

  useEffect(() => {
    const fetchPages = async () => {
      setLoadingPages(true);
      const response = await client.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: "Scheduled",
              date: {
                on_or_after: week.start.toISOString(),
              },
            },
            {
              property: "Scheduled",
              date: {
                on_or_before: week.end.toISOString(),
              },
            },
          ],
        },
        sorts: [
          {
            property: "Scheduled",
            direction: "ascending",
          },
        ],
      });

      setPages(response.results as PageResponse[]);
      setLoadingPages(false);
      setShouldLoadPages(false);
    };

    if (loadingPages || !shouldLoadPages) return;
    fetchPages().catch(console.error);
  }, [databaseId, client, week, loadingPages, shouldLoadPages]);

  useEffect(() => {
    const fetchUnscheduledPages = async () => {
      setLoadingUnscheduledPages(true);
      const response = await client.databases.query({
        database_id: databaseId,
        filter: {
          property: "Scheduled",
          date: {
            is_empty: true,
          },
        },
      });

      setUnscheduledPages(response.results as PageResponse[]);
      setLoadingUnscheduledPages(false);
      setShouldLoadUnscheduledPages(false);
    };

    if (loadingUnscheduledPages || !shouldLoadUnscheduledPages) return;
    fetchUnscheduledPages().catch(console.error);
  }, [databaseId, client, loadingUnscheduledPages, shouldLoadUnscheduledPages]);

  if (!database) return <div>Loading...</div>;

  return (
    <Container>
      <WeekCalendar pages={pages} loading={loadingPages} />
      <UnscheduledHelper
        pages={pages}
        unscheduledPages={unscheduledPages}
        loading={loadingPages || loadingUnscheduledPages}
        handleRefresh={handleRefresh}
      />
    </Container>
  );
};

export default WeeklyPlanner;

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
`;
