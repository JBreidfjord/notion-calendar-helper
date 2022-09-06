import requests
import typer
from rich import print

from utils_data import error_code_message_map


def get_id_from_url(url: str):
    return url.split("/").pop().split("?")[0]


def check_status(res: requests.Response):
    if res.status_code != 200:
        error_code = res.json()["code"]
        print("[bold red]Error: [/bold red]" + error_code_message_map[error_code])
        typer.Exit()
