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
        r = self.session.get(self.base_url + endpoint)
        r.raise_for_status()
        return r.json()

    def _post(self, endpoint: str, data: dict = {}):
        r = self.session.post(self.base_url + endpoint, json=data)
        r.raise_for_status()
        return r.json()

    def _patch(self, endpoint: str, data: dict = {}):
        r = self.session.patch(self.base_url + endpoint, json=data)
        r.raise_for_status()
        return r.json()

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
