import { Client } from "@notionhq/client";

export interface ToolProps {
  databaseId: string;
  client: Client;
}
