# AISTHESIS API Documentation

**Base URL:** `http://localhost:8000`

---

## Authentication

All protected endpoints require Bearer token:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### POST /auth/google/login

Authenticate with Google OAuth.

**Request:**

```json
{
  "id_token": "string"
}
```

**Response:** `200 OK`

```json
{
  "data": {
    "access_token": "string",
    "refresh_token": "string",
    "token_type": "bearer"
  }
}
```

---

### GET /auth/profile

Get current user profile. Requires authentication.

**Response:** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "email": "string",
    "name": "string | null",
    "avatar_url": "string | null",
    "is_active": "boolean",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

---

### POST /analysis

Upload product image for AI analysis. Requires authentication.

**Request:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| file | image | Yes |
| context | string | No |

**Response:** `202 Accepted`

```json
{
  "data": {
    "id": "uuid",
    "status": "PENDING"
  }
}
```

---

### GET /analysis/{id}

Get analysis status and result. Requires authentication.

**Response (Pending/Processing):** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "status": "PENDING | PROCESSING"
  }
}
```

**Response (Completed):** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "status": "COMPLETED",
    "image_url": "string",
    "image_filename": "string",
    "created_at": "datetime",
    "updated_at": "datetime",
    "vision_result": {
      "labels": ["string"],
      "colors": ["string"],
      "objects": ["string"],
      "mood": "string"
    },
    "story": {
      "product_name": "string",
      "tagline": "string",
      "short_desc": "string",
      "long_desc": "string",
      "caption_casual": "string",
      "caption_professional": "string",
      "caption_storytelling": "string"
    },
    "taste": {
      "taste_profile": ["string"],
      "aroma_profile": ["string"],
      "sensory_persona": "string",
      "pairing": ["string"]
    },
    "brand_theme": {
      "primary_color": "string",
      "secondary_color": "string",
      "accent_color": "string",
      "tone": "string",
      "style_suggestions": ["string"]
    },
    "pricing": {
      "recommended_price": "number",
      "min_price": "number",
      "max_price": "number",
      "reasoning": "string",
      "promo_strategy": ["string"],
      "best_posting_time": "string"
    },
    "seo": {
      "keywords": ["string"],
      "hashtags": ["string"]
    },
    "marketplace": {
      "shopee_desc": "string",
      "tokopedia_desc": "string",
      "instagram_desc": "string"
    },
    "persona": {
      "name": "string",
      "bio": "string",
      "demographics": "object",
      "motivations": ["string"],
      "pain_points": ["string"]
    },
    "packaging": {
      "suggestions": ["string"],
      "material_recommendations": ["string"]
    },
    "action_plan": {
      "day_1": "string",
      "day_2": "string",
      "day_3": "string",
      "day_4": "string",
      "day_5": "string",
      "day_6": "string",
      "day_7": "string"
    }
  }
}
```

**Response (Failed):** `200 OK`

```json
{
  "data": {
    "id": "uuid",
    "status": "FAILED",
    "error": "string"
  }
}
```

---

## Status Values

| Status | Description |
|--------|-------------|
| PENDING | Queued |
| PROCESSING | In progress |
| COMPLETED | Done |
| FAILED | Error |

---

## Errors

All error responses follow FastAPI's default format:

```json
{
  "detail": "string"
}
```

### Error Codes

| Code | Type | Example |
|------|------|---------|
| 400 | Bad Request | `{ "detail": "File must be an image." }` |
| 401 | Unauthorized | `{ "detail": "Could not validate credentials" }` |
| 404 | Not Found | `{ "detail": "Analysis not found" }` |
| 422 | Validation Error | See below |
| 500 | Server Error | `{ "detail": "Internal server error" }` |

### Validation Error (422)

```json
{
  "detail": [
    {
      "type": "string",
      "loc": ["body", "field_name"],
      "msg": "string",
      "input": "any"
    }
  ]
}
```

Example:

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "id_token"],
      "msg": "Field required",
      "input": {}
    }
  ]
}
```

