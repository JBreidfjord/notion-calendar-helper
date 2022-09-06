import os

import typer
from dotenv import load_dotenv
from rich import print

import utils
from notion import Client


def main(
    token: str = typer.Option(..., envvar="API_TOKEN"),
    database_url: str = typer.Option(..., envvar="DATABASE_URL"),
):
    client = Client(token)
    database_id = utils.get_id_from_url(database_url)

    r = client.retrieve_database(database_id)
    ...


if __name__ == "__main__":
    load_dotenv()
    typer.run(main)
