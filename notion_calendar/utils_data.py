error_code_message_map = {
    "invalid_json": "Request body could not be decoded as JSON",
    "invalid_request_url": "Invalid request URL",
    "invalid_request": "Request not supported",
    "validation_error": "Request body does not match schema",
    "missing_version": "Missing Notion-Version header",
    "unauthorized": "Invalid API token",
    "restricted_resource": "Unauthorized access to resource",
    "object_not_found": "Resource not found",
    "conflict_error": "Data conflict during transaction",
    "rate_limited": "Rate limit exceeded, try again later",
    "internal_server_error": "Internal server error",
    "service_unavailable": "Notion is currently unavailable, try again later",
    "database_connection_unavailable": "Database connection is currently unavailable, try again later",
}

default_properties = {
    "Status": {"type": "status", "status": {"options": []}},
    "Course": {"type": "select", "select": {"options": []}},
    "Name": {"type": "title"},
    "Scheduled": {"type": "date"},
    "Due": {"type": "date"},
    "Tags": {"type": "multi_select", "multi_select": {"options": []}},
    "Location": {"type": "select", "select": {"options": []}},
    "Notes": {"type": "rich_text"},
}

weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
