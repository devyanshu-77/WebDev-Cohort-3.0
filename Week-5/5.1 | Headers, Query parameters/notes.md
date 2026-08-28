# HTTP & Network Requests - Concise Notes

## Headers
- Key-value pairs with metadata about requests/responses.
- HTTP is stateless: send `Authorization` headers/cookies with every request for user verification.

### Common Headers
| Header | Purpose |
|--------|---------|
| `Authorization` | Authenticates user (tokens, cookies). |
| `Content-Type` | Tells server the format of sent data (e.g., `application/json`). |
| `Referer` | Indicates the originating URL of the request. |

---

## Fetch API
- JavaScript API for sending network requests from browsers.
- Enables dynamic content loading (SPAs like LinkedIn, Instagram).

### How Browsers Send Requests
1. URL bar navigation.
2. JavaScript (via `fetch()` or `<script>` tags).

### Background Requests
- Any request after the initial page load.
- Enable SPAs and improve UX by updating content without refreshing.

---

## Axios
- Alternative HTTP client library.
- Simpler syntax than `fetch()`.
- Automatically parses JSON responses.
