import { Client } from "@notionhq/client";
import RecurringEventHelper from "../tools/recurring-event-helper/RecurringEventHelper";

interface ToolSelectProps {
  databaseId: string;
  client: Client;
  setSelectedTool: (tool: JSX.Element | null) => void;
}

interface ToolOption {
  name: string;
  value: JSX.Element;
}

const ToolSelect = ({ setSelectedTool, ...props }: ToolSelectProps) => {
  const toolOptions: ToolOption[] = [
    { name: "Recurring Event Helper", value: <RecurringEventHelper {...props} /> },
  ];

  return (
    <>
      {toolOptions.map((toolOption) => (
        <div
          key={toolOption.name}
          onClick={() => setSelectedTool(toolOption.value)}
          className="card"
        >
          {toolOption.name}
        </div>
      ))}
    </>
  );
};

export default ToolSelect;
