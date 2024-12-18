# Sports Event API - Postman Collection

## Base URL
`http://localhost:3000`

## Authentication
Most routes require a JWT token. After signing in, include the token in the Authorization header:
`Authorization: Bearer <your_token>`

## Routes

### 1. Signup
- **Method**: POST
- **Endpoint**: `/signup`
- **Body (JSON)**:
```json
{
  "email": "user@example.com",
  "username": "newuser",
  "password": "securepassword123",
  "location": "Mumbai"
}
```
- **Expected Response**:
  - 201: User created successfully
  - 409: Username already exists
  - 500: Server error

### 2. Signin
- **Method**: POST
- **Endpoint**: `/signin`
- **Body (JSON)**:
```json
{
  "username": "existinguser",
  "password": "password123"
}
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM0MzQ3MDA4fQ.vqF5l1WK86Dhhp8mPwNVlVXPB4aTSc32X-TBwv7tAv0
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM0NDE4NDk0fQ.SIeg4IqHA6s5hdB9sSttEQesKPYsHyskX7ckNtPMuk8
```
- **Expected Response**:
  - Success: JWT token
  - 403: Incorrect credentials

### 3. Create Event (Method 1)
- **Method**: POST
- **Endpoint**: `/create`
- **Headers**: 
  - Authorization: Bearer <token>
- **Body (JSON)**:
```json
{
  "title": "Weekend Football Match",
  "location": "Mumbai",
  "time": "2024-02-15T14:30:00Z",
  "capacity": 20,
  "description": "Friendly football match for local players"
}
```
- **Expected Response**:
  - 201: Event created with event details
  - 500: Error creating event

### 4. Add Event (Method 2)
- **Method**: POST
- **Endpoint**: `/addevent`
- **Headers**: 
  - Authorization: Bearer <token>
- **Body (JSON)**:
```json
{
  "title": "City Marathon",
  "description": "Annual city running event",
  "location": "Mumbai",
  "time": "2024-03-10T06:00:00Z",
  "capacity": 500
}
```
- **Expected Response**:
  - 201: Event created with event details
  - 400: Missing required fields
  - 500: Error creating event

### 5. List Events (User's Location)
- **Method**: GET
- **Endpoint**: `/list`
- **Headers**: 
  - Authorization: Bearer <token>
- **Expected Response**:
  - 200: List of events in user's location
  - 404: User not found
  - 500: Error fetching events

### 6. Events by Location
- **Method**: GET
- **Endpoint**: `/events-by-location`
- **Headers**: 
  - Authorization: Bearer <token>
- **Query Params**:
  - `location` (optional): Specific location to search
- **Expected Response**:
  - 200: List of events matching location
  - 400: No location specified
  - 500: Error searching events

### 7. Nearby Events
- **Method**: GET
- **Endpoint**: `/nearby`
- **Body (JSON)**:
```json
{
  "latitude": 19.0760,
  "longitude": 72.8333,
  "radius": 10000  // in meters
}
```
- **Expected Response**:
  - 200: List of nearby events
  - 400: Missing latitude/longitude/radius

### 8. User Profile
- **Method**: GET
- **Endpoint**: `/profile`
- **Headers**: 
  - Authorization: Bearer <token>
- **Expected Response**:
  - 200: User profile details
  - 404: User not found
  - 500: Error fetching profile

## Testing Tips
1. Always start by signing up or signing in to get a JWT token
2. Use the token in the Authorization header for protected routes
3. Ensure all required fields are filled
4. Check error responses for debugging

## Common Error Handling
- 400: Bad Request (missing/invalid parameters)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (authentication failed)
- 404: Not Found
- 500: Server Error

## Postman Collection Setup
1. Create a new collection
2. Add environment variables for:
   - `base_url`: `http://localhost:3000`
   - `token`: (copy from signin response)
3. Set up pre-request scripts to manage authentication