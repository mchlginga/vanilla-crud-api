# CRUD JSON API using Pure HTTP

Building a REST-style API without using Express - pure http, fs/promises, path. We will simulate behavior of a real server:routing, body parsing, dynamic URLs, proper status codes.

Each note will be stored in a notes.json file with structure like:

{ "id": 23123, "title": "Grocery", "body": "Buy milk and eggs" }

---

## Code Flow

1. Create HTTP server.
2. Parse request URL and method (GET, POST, PUT, DELETE)
3. Setup dynamic routing with url.pathname and url.searchParams
4. For POST/PUT, manually parse request body (JSON)
5. Read notes.json, manipulate data, and respond
6. Set proper headers: Content-Type, statusCode