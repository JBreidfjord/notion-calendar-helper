import { Client } from "@notionhq/client";
import { useState } from "react";

interface TokenFormProps {
  setClient: (client: Client) => void;
}

const TokenForm = ({ setClient }: TokenFormProps) => {
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setClient(new Client({ auth: token }));
  };

  return (
    <>
      <p>To get started, input your Notion integration token</p>
      <form id="integration-token-form" onSubmit={handleSubmit}>
        <input type="text" value={token || ""} onChange={(e) => setToken(e.target.value)} />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default TokenForm;
