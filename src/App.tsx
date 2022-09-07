import "./App.css";

import { useEffect, useMemo, useState } from "react";

import { Client } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import DatabaseSelect from "./components/DatabaseSelect";
import TokenForm from "./components/TokenForm";
import ToolSelect from "./components/ToolSelect";

const App = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [databases, setDatabases] = useState<DatabaseObjectResponse[]>([]);
  const [databaseId, setDatabaseId] = useState("");
  const [selectedTool, setSelectedTool] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!client || databases.length) return;

    const fetchDatabases = async () => {
      const response = await client.search({
        filter: {
          property: "object",
          value: "database",
        },
      });
      setDatabases(response.results as DatabaseObjectResponse[]);
    };

    fetchDatabases().catch(console.error);
  }, [client, databases.length]);

  const content = useMemo(() => {
    if (selectedTool) return selectedTool;

    if (!!databaseId && client)
      return (
        <ToolSelect databaseId={databaseId} client={client} setSelectedTool={setSelectedTool} />
      );

    if (databases.length)
      return <DatabaseSelect databases={databases} setDatabaseId={setDatabaseId} />;

    return <TokenForm setClient={setClient} />;
  }, [databaseId, databases, selectedTool, client]);

  return (
    <div>
      <h2 className={selectedTool ? "top" : ""}>Notion Calendar Helper</h2>
      {content}
    </div>
  );
};

export default App;
