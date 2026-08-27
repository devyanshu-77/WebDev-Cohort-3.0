# HTTP (HyperText Transfer Protocol) - Concise Notes

## 1. What is HTTP?
A protocol for communication and data transfer between a **client** (browser) and a **server**.

## 2. Client-Server Model
- **Client**: Sends a **request**.
- **Server**: Processes the request and returns a **response**.

## 3. Statelessness
- Each request is independent.
- The server **does not remember** previous requests.
- State is managed using external tools like **cookies** or **tokens**.

## 4. Key Components

### Headers
- Key-value pairs containing **metadata** (e.g., source, destination, version, auth info).

### Domain Name & IP
- **Domain**: Human-readable name (e.g., `google.com`) of a server.
- **IP**: Actual numerical address of the server. DNS translates domain to IP.

### Ports
- Logical endpoints to direct traffic to specific processes.
- **Port 80**: HTTP
- **Port 443**: HTTPS

### Methods (Verbs)
| Method   | Action                     |
|----------|----------------------------|
| `GET`    | Retrieve data              |
| `POST`   | Create new resource        |
| `PUT`    | Replace entire resource    |
| `PATCH`  | Partially update resource  |
| `DELETE` | Remove resource            |

### Body
- Actual data being sent (e.g., JSON, HTML, plain text, binary).

### Status Codes
| Series | Meaning                        |
|--------|--------------------------------|
| 1xx    | Informational                  |
| 2xx    | Success (e.g., `200 OK`)       |
| 3xx    | Redirection                    |
| 4xx    | Client Error (e.g., `404 Not Found`) |
| 5xx    | Server Error (e.g., `500 Internal Error`) |

