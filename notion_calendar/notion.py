import requests


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
        return self.session.get(self.base_url + endpoint)

    def _post(self, endpoint: str, data: dict = {}):
        return self.session.post(self.base_url + endpoint, json=data)

    def _patch(self, endpoint: str, data: dict = {}):
        return self.session.patch(self.base_url + endpoint, json=data)

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
