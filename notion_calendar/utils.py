def get_id_from_url(url: str):
    return url.split("/").pop().split("?")[0]
