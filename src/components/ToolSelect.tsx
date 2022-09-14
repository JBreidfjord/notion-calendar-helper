import RecurringEventHelper from "../tools/recurring-event-helper/RecurringEventHelper";
import { ToolProps } from "../tools/interfaces";
import WeeklyPlanner from "../tools/weekly-planner/WeeklyPlanner";

interface ToolSelectProps extends ToolProps {
  setSelectedTool: (tool: JSX.Element | null) => void;
}

interface ToolOption {
  name: string;
  value: JSX.Element;
}

const ToolSelect = ({ setSelectedTool, ...props }: ToolSelectProps) => {
  const toolOptions: ToolOption[] = [
    { name: "Recurring Event Helper", value: <RecurringEventHelper {...props} /> },
    { name: "Weekly Planner", value: <WeeklyPlanner {...props} /> },
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
