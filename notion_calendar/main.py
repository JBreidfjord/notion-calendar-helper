from datetime import date, time

import typer
from dotenv import load_dotenv
from rich import print
from rich.console import Console
from rich.progress import track
from rich.prompt import Confirm, Prompt
from rich.table import Table

import utils
import utils_data
from notion import Client

app = typer.Typer()
console = Console()
properties = utils_data.default_properties


@app.callback(invoke_without_command=True)
def main(
    ctx: typer.Context,
    token: str = typer.Option(..., envvar="API_TOKEN"),
    database_url: str = typer.Option(..., envvar="DATABASE_URL"),
):
    client = Client(token)
    database_id = utils.get_id_from_url(database_url)
    database = client.retrieve_database(database_id)
    properties.update(database["properties"])

    if ctx.invoked_subcommand is None:
        # TODO: Implement options menu
        create(database_id, client)


def create(database_id: str, client: Client):
    data = {}
    reset_data = (console, "Creation Wizard", data)
    utils.reset_console(*reset_data)

    data["Name"] = Prompt.ask("\nWhat is the name of this item?")
    utils.reset_console(*reset_data)

    is_incremental = Confirm.ask("\nShould the name be incremented?")
    utils.reset_console(*reset_data)

    course_choices = [option["name"] for option in properties["Course"]["select"]["options"]]
    data["Course"] = utils.choice_list_prompt(
        f"\nWhich course is {data['Name']} for?", course_choices
    )
    utils.reset_console(*reset_data)

    weekdays = utils.choice_list_prompt_multiselect(
        f"\nWhich weekday(s) will {data['Name']} occur?", utils_data.weekdays, reset_data
    )
    data["Weekdays"] = ", ".join(weekdays)
    utils.reset_console(*reset_data)

    start_date = date.fromisoformat(Prompt.ask(f"\nWhen does {data['Name']} start? (YYYY-MM-DD)"))
    data["Start Date"] = start_date.strftime("%B %d, %Y")
    utils.reset_console(*reset_data)
    end_date = date.fromisoformat(Prompt.ask(f"\nWhen does {data['Name']} end? (YYYY-MM-DD)"))
    data["End Date"] = end_date.strftime("%B %d, %Y")
    utils.reset_console(*reset_data)

    is_scheduled = Confirm.ask(f"\nDoes {data['Name']} have a scheduled time?")
    utils.reset_console(*reset_data)
    start_time = None
    end_time = None
    if is_scheduled:
        start_time = time.fromisoformat(
            Prompt.ask(f"\nWhat time does {data['Name']} start? (HH:MM)")
        )
        data["Start Time"] = start_time.strftime("%I:%M %p")
        utils.reset_console(*reset_data)
        end_time = time.fromisoformat(Prompt.ask(f"\nWhat time does {data['Name']} end? (HH:MM)"))
        data["End Time"] = end_time.strftime("%I:%M %p")
        utils.reset_console(*reset_data)

    is_due = Confirm.ask(f"\nDoes {data['Name']} have a due date?")
    utils.reset_console(*reset_data)
    if is_due:
        due_weekdays = utils.choice_list_prompt_multiselect(
            f"\nWhich weekday(s) is {data['Name']} due?", utils_data.weekdays, reset_data
        )
        data["Due Weekdays"] = ", ".join(due_weekdays)
        utils.reset_console(*reset_data)

        due_time = time.fromisoformat(Prompt.ask(f"\nWhat time is {data['Name']} due? (HH:MM)"))
        data["Due Time"] = due_time.strftime("%I:%M %p")
        utils.reset_console(*reset_data)

    tag_choices = [option["name"] for option in properties["Tags"]["multi_select"]["options"]]
    tags = utils.choice_list_prompt_multiselect(
        f"\nWhat should {data['Name']} be tagged with?", tag_choices, reset_data
    )
    data["Tags"] = ", ".join(tags)
    utils.reset_console(*reset_data)

    location_choices = [option["name"] for option in properties["Location"]["select"]["options"]]
    location_choices.append(None)
    data["Location"] = utils.choice_list_prompt(
        f"\nWhere will {data['Name']} occur?", location_choices
    )

    utils.reset_console(console, "Creation Wizard")
    scheduled_datetime_dicts = utils.calculate_datetimes(
        start_date, end_date, weekdays, start_time, end_time
    )
    if is_due:
        due_datetime_dicts = utils.calculate_datetimes(start_date, end_date, due_weekdays, due_time)
    else:
        # Ensures that due_datetime_dicts is defined and has same length as scheduled_datetime_dicts
        due_datetime_dicts = [None] * len(scheduled_datetime_dicts)

    page_properties_list = []
    for i, (scheduled, due) in enumerate(zip(scheduled_datetime_dicts, due_datetime_dicts), 1):
        page_properties_list.append(
            {
                "Course": {"select": {"name": data["Course"]}},
                "Name": {
                    "title": [
                        {"text": {"content": data["Name"] + (f" {i}" if is_incremental else "")}}
                    ]
                },
                "Scheduled": {"date": scheduled},
                "Due": {"date": due},
                "Tags": {"multi_select": [{"name": tag} for tag in tags]},
                "Location": {"select": {"name": data["Location"]}},
            }
        )

    print("\nThe following data will be added to the database:")
    table = Table()
    [table.add_column(prop, justify="center") for prop in utils_data.default_properties.keys()]
    for props in page_properties_list:
        scheduled = props["Scheduled"]["date"]["start"]
        if end_date := props["Scheduled"]["date"]["end"]:
            scheduled += " - " + end_date

        due = None
        if props["Due"]["date"]:
            due = props["Due"]["date"]["start"]
            if end_date := props["Due"]["date"]["end"]:
                due += " - " + end_date

        table.add_row(
            *(
                None,  # Status
                props["Course"]["select"]["name"],  # Course
                props["Name"]["title"][0]["text"]["content"],  # Name
                scheduled,  # Scheduled
                due,  # Due
                ", ".join(tag["name"] for tag in props["Tags"]["multi_select"]),  # Tags
                props["Location"]["select"]["name"],  # Location
                None,  # Notes
            )
        )
    console.print(table)
    typer.confirm("\nIs this correct?", abort=True)

    utils.reset_console(console, "Creation Wizard")
    for props in track(page_properties_list, description="Uploading data to Notion..."):
        client.create_page(
            {
                "parent": {
                    "type": "database_id",
                    "database_id": database_id,
                },
                "properties": props,
            }
        )
    print("Data successfully uploaded")


if __name__ == "__main__":
    load_dotenv()
    app()
