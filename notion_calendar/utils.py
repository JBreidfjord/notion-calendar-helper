import requests
import typer
from rich import print
from rich.prompt import IntPrompt

from utils_data import error_code_message_map


def get_id_from_url(url: str) -> str:
    return url.split("/").pop().split("?")[0]


def check_status(res: requests.Response) -> None:
    if res.status_code != 200:
        error_code = res.json()["code"]
        print("[bold red]Error: [/bold red]" + error_code_message_map[error_code])
        typer.Exit()


def choice_list_prompt(message: str, choices: list[str]) -> str:
    prompt_text = f"{message} [bold blue]({len(choices)} options)[/bold blue]\n"
    prompt_text += "\n".join([f"  [blue][{i}][/blue] {choice}" for i, choice in enumerate(choices)])
    prompt_text += "\n[bold blue]Choice[/bold blue]"

    str_choice_indices = [str(i) for i in range(len(choices))]
    int_choice = IntPrompt.ask(prompt_text, choices=str_choice_indices, show_choices=False)
    return choices[int_choice]
