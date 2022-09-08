import { addDays, differenceInCalendarDays, format } from "date-fns";
import { useEffect, useLayoutEffect, useState } from "react";

import { Client } from "@notionhq/client";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import TagSelector from "./components/TagSelector";
import WeekdaySelector from "./components/WeekdaySelector";

interface RecurringEventHelperProps {
  databaseId: string;
  client: Client;
}

const RecurringEventHelper = ({ databaseId, client }: RecurringEventHelperProps) => {
  const [database, setDatabase] = useState<GetDatabaseResponse | null>(null);

  const [nameCompleted, setNameCompleted] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [weekdaysCompleted, setWeekdaysCompleted] = useState(false);
  const [dateCompleted, setDateCompleted] = useState(false);
  const [tagsCompleted, setTagsCompleted] = useState(false);
  const [locationCompleted, setLocationCompleted] = useState(false);

  const [name, setName] = useState("");
  const [isIncremental, setIsIncremental] = useState(false);
  const [course, setCourse] = useState("");
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasTime, setHasTime] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isDue, setIsDue] = useState(false);
  const [dueWeekdays, setDueWeekdays] = useState<string[]>([]);
  const [dueTime, setDueTime] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchDatabase = async () => {
      const response = await client.databases.retrieve({ database_id: databaseId });
      setDatabase(response);
    };

    fetchDatabase().catch(console.error);
  }, [databaseId, client]);

  useLayoutEffect(() => {
    if (weekdaysCompleted) return;
    if (weekdays.length) setTimeout(() => setWeekdaysCompleted(true), 500);
  }, [weekdays.length, weekdaysCompleted]);

  useLayoutEffect(() => {
    if (tagsCompleted) return;
    if (tags.length) setTimeout(() => setTagsCompleted(true), 500);
  }, [tags.length, tagsCompleted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!locationCompleted) return;

    console.log("handleSubmit");
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInCalendarDays(end, start);

    console.log("days", days);
    console.log(weekdays);

    const scheduledDatetimes = [];
    const dueDatetimes = [];
    for (let i = 1; i <= days; i++) {
      const date = addDays(start, i);
      const weekday = format(date, "EEEE");
      console.log(weekdays.includes(weekday));
      if (weekdays.includes(weekday)) {
        if (hasTime) {
          scheduledDatetimes.push({
            start: format(date, "yyyy-MM-dd") + "T" + startTime,
            end: format(date, "yyyy-MM-dd") + "T" + endTime,
          });
        } else {
          scheduledDatetimes.push({
            start: format(date, "yyyy-MM-dd"),
          });
        }
      }

      if (isDue && dueWeekdays.includes(weekday)) {
        dueDatetimes.push({
          start: format(date, "yyyy-MM-dd") + "T" + dueTime,
        });
      }
    }

    // TODO: Better handling different lengths of scheduledDatetimes and dueDatetimes
    if (isDue && scheduledDatetimes.length !== dueDatetimes.length) {
      console.error("Different lengths of scheduled and due datetimes");
      return;
    }

    const generatedPageProperties = [];
    for (let i = 0; i < scheduledDatetimes.length; i++) {
      const scheduled = scheduledDatetimes[i];
      const due = isDue ? dueDatetimes[i] : null;

      generatedPageProperties.push({
        Course: {
          select: {
            name: course,
          },
        },
        Name: {
          title: [
            {
              text: {
                content: `${name} ${isIncremental ? i + 1 : ""}`.trim(),
              },
            },
          ],
        },
        Scheduled: {
          date: scheduled,
        },
        Due: {
          date: due,
        },
        Tags: {
          multi_select: tags.map((tag) => ({ name: tag })),
        },
        Location: {
          select: {
            name: location,
          },
        },
      });
    }

    // TODO: Display generated pages for confirmation before uploading

    const promises = Promise.all(
      generatedPageProperties.map((properties) => {
        return client.pages.create({
          parent: { database_id: databaseId },
          properties,
        });
      })
    );

    await promises;
  };

  if (!database) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} id="recurring-event-form">
      <div className={nameCompleted ? "completed-section" : ""}>
        <div id="name-fields">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            onBlur={(e) => {
              if (e.target.value) setNameCompleted(true);
            }}
            className={nameCompleted ? "left" : ""}
          />
          {nameCompleted && (
            <label className="fade-in">
              Should the name be incremented?
              <input
                type="checkbox"
                checked={isIncremental}
                onChange={(e) => setIsIncremental(e.target.checked)}
              />
            </label>
          )}
        </div>
      </div>
      {nameCompleted && (
        <div className={courseCompleted ? "completed-section" : ""}>
          <select
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              if (e.target.value) setCourseCompleted(true);
            }}
          >
            <option value="">Select course</option>
            {(database.properties["Course"] as any).select.options.map((courseOption: any) => (
              <option key={courseOption.id} value={courseOption.name}>
                {courseOption.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {courseCompleted && (
        <div className={weekdaysCompleted ? "completed-section" : ""}>
          <WeekdaySelector weekdays={weekdays} setWeekdays={setWeekdays} />
        </div>
      )}
      {weekdaysCompleted && (
        <div className={dateCompleted ? "completed-section" : ""}>
          <div id="date-fields">
            <label className={`small ${startDate ? "left" : ""}`}>
              Start date
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            {startDate && (
              <label className="small fade-in">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value) setDateCompleted(true);
                  }}
                />
                End date
              </label>
            )}
          </div>
        </div>
      )}
      {dateCompleted && (
        <>
          <label className={hasTime ? "completed-section" : ""}>
            Does {name} have a scheduled time?
            <input
              type="checkbox"
              checked={hasTime}
              onChange={(e) => setHasTime(e.target.checked)}
            />
          </label>
          {hasTime && (
            <div className="fade-in">
              <label className="small">
                Start time
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
              <label className="small">
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                End time
              </label>
            </div>
          )}
        </>
      )}
      {dateCompleted && (
        <>
          <label className={isDue ? "completed-section" : ""}>
            Does {name} have a due date?
            <input type="checkbox" checked={isDue} onChange={(e) => setIsDue(e.target.checked)} />
          </label>
          {isDue && (
            <>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="fade-in"
              />
              <WeekdaySelector weekdays={dueWeekdays} setWeekdays={setDueWeekdays} />
            </>
          )}
        </>
      )}
      {dateCompleted && (
        <div className={tagsCompleted ? "completed-section" : ""}>
          <TagSelector
            tags={tags}
            setTags={setTags}
            tagOptions={(database.properties["Tags"] as any)["multi_select"].options.map(
              (option: any) => option.name
            )}
          />
        </div>
      )}
      {tagsCompleted && (
        <div className={locationCompleted ? "completed-section" : ""}>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setLocationCompleted(true);
            }}
          >
            <option value="">Select location</option>
            {(database.properties["Location"] as any).select.options.map((locationOption: any) => (
              <option key={locationOption.id} value={locationOption.name}>
                {locationOption.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {locationCompleted && (
        <button type="submit" className="fade-in">
          Submit
        </button>
      )}
    </form>
  );
};

export default RecurringEventHelper;
