import { DateProperty, PageResponse, SelectProperty, TitleProperty } from "../../interfaces";
import { getISODay, parseISO } from "date-fns";

export const partitionWeek = (pages: PageResponse[]) => {
  const days = {
    monday: [] as PageResponse[],
    tuesday: [] as PageResponse[],
    wednesday: [] as PageResponse[],
    thursday: [] as PageResponse[],
    friday: [] as PageResponse[],
    saturday: [] as PageResponse[],
    sunday: [] as PageResponse[],
  };

  pages.forEach((page) => {
    const date = (page.properties.Scheduled as DateProperty).date?.start;
    if (!date) return;
    const day = getISODay(parseISO(date));
    switch (day) {
      case 1:
        days.monday.push(page);
        break;
      case 2:
        days.tuesday.push(page);
        break;
      case 3:
        days.wednesday.push(page);
        break;
      case 4:
        days.thursday.push(page);
        break;
      case 5:
        days.friday.push(page);
        break;
      case 6:
        days.saturday.push(page);
        break;
      case 7:
        days.sunday.push(page);
        break;
    }
  });

  return days;
};

export const getPageColor = (page: PageResponse): string | undefined => {
  return (page.properties["Course"] as SelectProperty).select?.color;
};

export const getPageName = (page: PageResponse): string => {
  return (page.properties["Name"] as TitleProperty).title[0].text.content;
};

export const getScheduledDateAsMinutes = (page: PageResponse): [number, number] => {
  const scheduled = page.properties.Scheduled as DateProperty;
  if (!scheduled.date?.start || !scheduled.date?.end) return [0, 0];
  const start = new Date(scheduled.date.start);
  const end = new Date(scheduled.date.end);
  return [
    start.getHours() * 60 + start.getMinutes() - 480 + 1,
    end.getHours() * 60 + end.getMinutes() - 480 + 1,
  ];
};
