export interface PageResponse {
  archived: boolean;
  id: string;
  object: "page";
  parent: {
    type: "database_id";
    database_id: string;
  };
  properties: {
    [key: string]: Property;
  };
}

type Color =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

interface BaseProperty {
  id: string;
  type: "title" | "rich_text" | "number" | "select" | "multi_select" | "date" | "status";
}

export interface SelectProperty extends BaseProperty {
  type: "select";
  select: {
    color: Color;
    id: string;
    name: string;
  };
}

export interface DateProperty extends BaseProperty {
  type: "date";
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  } | null;
}

export interface TitleProperty extends BaseProperty {
  type: "title";
  title: {
    text: {
      content: string;
    };
  }[];
}

export interface RichTextProperty extends BaseProperty {
  type: "rich_text";
  rich_text: {}[];
}

export interface StatusProperty extends BaseProperty {
  type: "status";
  status: {
    color: Color;
    id: string;
    name: "Not started" | "In progress" | "Done";
  } | null;
}

export interface MultiSelectProperty extends BaseProperty {
  type: "multi_select";
  multi_select: {
    color: Color;
    id: string;
    name: string;
  }[];
}

type Property =
  | SelectProperty
  | DateProperty
  | TitleProperty
  | RichTextProperty
  | StatusProperty
  | MultiSelectProperty;
