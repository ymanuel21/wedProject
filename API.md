# API.md — Google Apps Script Integration

## Endpoint

```
POST https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

## Request Format

```json
{
  "type": "rsvp",
  "name": "Yusack Manuel",
  "phone": "08123456789",
  "attendance": "hadir",
  "guestCount": 2,
  "message": "Selamat menempuh hidup baru!"
}
```

### RSVP Fields

| Field | Type | Required | Values |
|---|---|---|---|
| type | string | Yes | `"rsvp"` or `"guestbook"` |
| name | string | Yes | Guest full name |
| phone | string | Yes | Phone number |
| attendance | string | Yes | `"hadir"`, `"tidak_hadir"`, `"ragu"` |
| guestCount | number | Yes | 1-10 |
| message | string | No | Personal message (max 500 chars) |

### Guest Book Fields

| Field | Type | Required | Values |
|---|---|---|---|
| type | string | Yes | `"guestbook"` |
| name | string | Yes | Guest name |
| message | string | Yes | Message (max 500 chars) |

## Response Format

### Success
```json
{
  "success": true,
  "message": "RSVP berhasil dikirim. Terima kasih!"
}
```

### Error
```json
{
  "success": false,
  "message": "Nama wajib diisi."
}
```

## Response Status Codes

| Status | Meaning |
|---|---|
| 200 | Success |
| 400 | Validation error |
| 500 | Server error |

## CORS Headers

The Apps Script endpoint sets:
```
Access-Control-Allow-Origin: https://your-wedding.vercel.app
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Rate Limiting

Google Apps Script has a quota of 20,000 requests/day for free accounts — more than sufficient for a wedding RSVP system.

## Testing

```bash
curl -X POST \
  https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec \
  -H "Content-Type: application/json" \
  -d '{"type":"rsvp","name":"Test User","phone":"08123456789","attendance":"hadir","guestCount":1}'
```
