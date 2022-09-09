import { DateProperty, PageResponse } from "../../interfaces";
import { format, formatISO, parseISO } from "date-fns";

import { Client } from "@notionhq/client";
import useSearch from "../../hooks/useSearch";
import { useState } from "react";

interface TimezoneUpdaterProps {
  databaseId: string;
  client: Client;
}

const TimezoneUpdater = ({ databaseId, client }: TimezoneUpdaterProps) => {
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const { results: pages, loading } = useSearch(client, {
    filter: {
      property: "object",
      value: "page",
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(
      (pages as PageResponse[]).filter(
        (page) =>
          (page.properties["Scheduled"] as DateProperty).date?.start === "2022-11-16T02:30:00-06:00"
      )
    );

    const pageUpdates = [];
    for (const page of pages as PageResponse[]) {
      if (page.archived) continue;
      if (page.parent.database_id !== databaseId) continue;

      const pageId = page.id;
      const pageProperties = page.properties;
      const scheduled = pageProperties.Scheduled as DateProperty;
      const due = pageProperties.Due as DateProperty;

      // Continue if neither dates exist
      if (!scheduled.date && !due.date) continue;

      // Only update if the date has a time
      if (scheduled.date && hasTime(scheduled.date.start)) {
        scheduled.date.start = formatDatetime(scheduled.date.start);
        if (scheduled.date.end) {
          scheduled.date.end = formatDatetime(scheduled.date.end);
        }
        scheduled.date.time_zone = null;
      }

      if (due.date && hasTime(due.date.start)) {
        due.date.start = formatDatetime(due.date.start);
        due.date.time_zone = null;
      }

      const pageUpdate = {
        page_id: pageId,
        properties: {
          Scheduled: scheduled,
          Due: due,
        },
      };

      pageUpdates.push(pageUpdate);
    }

    // const updatePromises = Promise.all(pageUpdates.map(client.pages.update));
    // await updatePromises;
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
        <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>Auto-detect</option>
        <option value="America/Edmonton">America/Edmonton</option>
      </select>
      <button type="submit" disabled={loading}>
        Update
      </button>
    </form>
  );
};

const formatDatetime = (datetime: string) => {
  const date = parseISO(datetime);
  const formattedDate = formatISO(date);
  return formattedDate.replace("-07:00", "-06:00");
};

const hasTime = (datetime: string) => {
  return datetime.split("T").length > 1;
};

export default TimezoneUpdater;
