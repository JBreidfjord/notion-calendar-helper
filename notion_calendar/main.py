import os

from dotenv import load_dotenv
from rich import print

import utils
from notion import Client

load_dotenv()

client = Client(os.getenv("API_TOKEN"))

database_url = (
    "https://www.notion.so/e60acb2d5e3a42789e28f321adbb4afd?v=8cf64f0d976744f19ee19b8294dea230"
)
database_id = utils.get_id_from_url(database_url)

r = client.retrieve_database(database_id)
print(r)
