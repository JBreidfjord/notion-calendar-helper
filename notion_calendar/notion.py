import requests

import utils


class Client:
    def __init__(self, token: str):
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28",
            }
        )
        self.base_url = "https://api.notion.com/v1/"

    def _get(self, endpoint: str):
        res = self.session.get(self.base_url + endpoint)
        utils.check_status(res)
        return res.json()

    def _post(self, endpoint: str, data: dict = {}):
        res = self.session.post(self.base_url + endpoint, json=data)
        utils.check_status(res)
        return res.json()

    def _patch(self, endpoint: str, data: dict = {}):
        res = self.session.patch(self.base_url + endpoint, json=data)
        utils.check_status(res)
        return res.json()

    def search(self, type: str = "database"):
        return self._post(
            "search",
            {
                "filter": {
                    "property": "object",
                    "value": type,
                },
            },
        )

    def retrieve_database(self, database_id: str):
        return self._get(f"databases/{database_id}")

    def create_page(self, data: dict):
        return self._post("pages", data)
