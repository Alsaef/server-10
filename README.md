# API Endpoints Documentation

Base URL: `https://server-10-nu.vercel.app/api/`



### API Usage Example

#### 1. Get Limited Roommates

```http
GET https://server-10-nu.vercel.app/api/roommates?limit=6
```

### API Usage Example

#### 1. Get Id And email

```http
GET GET https://server-10-nu.vercel.app/api/roommates/64b123456789abcdef123456?email=user@example.com

```

### API Usage Example

#### 1. Add New Roommate Post

```POST https://server-10-nu.vercel.app/api/roommates

```

```
Content-Type: application/json
{
  "title": "Room near university",
  "location": "Dhaka",
  "rentAmount": 5000,
  "roomType": "Single",
  "lifestyle": ["Non-smoker", "Student"],
  "description": "A cozy room for a student.",
  "contact": "017XXXXXXXX",
  "availability": true,
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```



