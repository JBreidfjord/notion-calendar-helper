import { useEffect, useState } from "react";

import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { PageResponse } from "../../interfaces";
import { ToolProps } from "../interfaces";
import WeekCalendar from "./components/WeekCalendar";

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
  const [unscheduledPages, setUnscheduledPages] = useState<PageResponse[]>([]);
  const [loadingUnscheduledPages, setLoadingUnscheduledPages] = useState(false);

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
      });

      setPages(response.results as PageResponse[]);
      setLoadingPages(false);
    };

    if (loadingPages) return;
    fetchPages().catch(console.error);
  }, [databaseId, client, week]);

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
    };

    if (loadingUnscheduledPages) return;
    fetchUnscheduledPages().catch(console.error);
  }, [databaseId, client]);

  // const pages = useMemo(() => {
  //   if (!database || loading) return [];

  //   return (results as PageResponse[]).filter(
  //     (page) => page.parent.database_id === databaseId && !page.archived
  //   );
  // }, [database, results, loading, databaseId]);

  // const weekPages = useMemo(() => {
  //   if (!pages.length) return [];

  //   return pages.filter((page) => {
  //     const start = (page.properties["Scheduled"] as DateProperty).date?.start;
  //     if (!start) return false;
  //     return isWithinInterval(new Date(start), week);
  //   });
  // }, [pages, week]);

  // if (!database || loading) return <div>Loading...</div>;

  // console.log(pages);
  // console.log(weekPages);

  if (!database || loadingPages || loadingUnscheduledPages) return <div>Loading...</div>;

  return (
    <div>
      <WeekCalendar pages={pages} />
    </div>
  );
};

export default WeeklyPlanner;
