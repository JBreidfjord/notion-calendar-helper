import { DateProperty, PageResponse } from "../../interfaces";
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
