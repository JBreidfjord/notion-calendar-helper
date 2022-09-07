import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { useState } from "react";

interface DatabaseSelectProps {
  databases: DatabaseObjectResponse[];
  setDatabaseId: (databaseId: string) => void;
}

const DatabaseSelect = ({ databases, setDatabaseId }: DatabaseSelectProps) => {
  const [selectedDatabaseId, setSelectedDatabaseId] = useState(databases[0].id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDatabaseId) return;
    setDatabaseId(selectedDatabaseId);
  };

  return (
    <>
      <p>Next, select the database to use</p>
      <form onSubmit={handleSubmit}>
        <select value={selectedDatabaseId} onChange={(e) => setSelectedDatabaseId(e.target.value)}>
          {databases.map((database) => (
            <option key={database.id} value={database.id}>
              {database.title[0].plain_text}
            </option>
          ))}
        </select>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default DatabaseSelect;
