import typer
from dotenv import load_dotenv
from rich import print
from rich.prompt import Prompt

import utils
import utils_data
from notion import Client

app = typer.Typer()
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
        ...


@app.command()
def create():
    print("Starting creation wizard...")

    course_choices = [option["name"] for option in properties["Course"]["select"]["options"]]
    course = utils.choice_list_prompt("Which course is this for?", course_choices)

    name = Prompt.ask("What is the name of the task?")


if __name__ == "__main__":
    load_dotenv()
    app()
