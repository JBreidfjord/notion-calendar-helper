from datetime import date, datetime, time, timedelta

import requests
import typer
from rich import print
from rich.console import Console
from rich.prompt import IntPrompt
from rich.table import Table

from utils_data import error_code_message_map


def get_id_from_url(url: str) -> str:
    return url.split("/").pop().split("?")[0]


def check_status(res: requests.Response) -> None:
    if res.status_code != 200:
        error_code = res.json()["code"]
        print("[bold red]Error: [/bold red]" + error_code_message_map[error_code])
        typer.Exit()


def get_prompt_text(message: str, choices: list[str]) -> str:
    prompt_text = f"{message} [bold blue]({len(choices)} options)[/bold blue]\n"
    prompt_text += "\n".join([f"  [blue][{i}][/blue] {choice}" for i, choice in enumerate(choices)])
    prompt_text += "\nChoice"
    return prompt_text


def choice_list_prompt(message: str, choices: list[str]) -> str:
    prompt_text = get_prompt_text(message, choices)
    str_choice_indices = [str(i) for i in range(len(choices))]
    selection = IntPrompt.ask(prompt_text, choices=str_choice_indices, show_choices=False)
    return choices[selection]


def choice_list_prompt_multiselect(
    message: str, choices: list[str], reset_data: tuple = None
) -> list[str]:
    choices.append("Done")
    original_message = message

    selections = []
    while (selection := choice_list_prompt(message, choices)) != "Done":
        selections.append(selection)
        choices.remove(selection)
        message = f"\n[bold blue]Selected:[/bold blue] {', '.join(selections)}{original_message}"
        if reset_data:
            reset_console(*reset_data)

    return selections


def reset_console(console: Console, header: str = None, data: dict = None) -> None:
    console.clear()
    console.rule(header, style="bold blue")

    if data:
        table = Table()
        [table.add_column(key, justify="center") for key in data.keys()]
        table.add_row(*data.values())
        console.print(table)


def calculate_datetimes(
    start_date: date,
    end_date: date,
    weekdays: list[str],
    start_time: time = None,
    end_time: time = None,
) -> list[dict[str, str]]:
    # [{start: str, end: str}, ...]
    # datetimes are in ISO 8601 format
    datetimes = []
    for day in range((end_date - start_date).days + 1):
        date = start_date + timedelta(days=day)
        if date.strftime("%A") in weekdays:
            if start_time and end_time:
                datetime_ = {
                    "start": datetime.combine(date, start_time).isoformat(),
                    "end": datetime.combine(date, end_time).isoformat(),
                }
            elif start_time:
                datetime_ = {"start": datetime.combine(date, start_time).isoformat()}
            else:
                datetime_ = {"start": date.isoformat()}
            datetimes.append(datetime_)

    return datetimes
