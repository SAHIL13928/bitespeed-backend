# BiteSpeed Identity Reconciliation Backend

This is a backend service that handles identity reconciliation for users based on email and phone number.

## 📦 Tech Stack

- **Node.js**
- **TypeScript**
- **Express**
- **PostgreSQL**
- **Prisma ORM**



## 🚀 Deployment

The app is deployed on **Render**.

> **Live URL:** [https://bitespeed-backend-j6eo.onrender.com](https://bitespeed-backend-j6eo.onrender.com)

⚠️ This project has only one **POST API endpoint**:

## 🔗 API Endpoint

### `POST /identify`

#### Request Body:
```json
{
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
```
Response:
Returns a JSON object with primary and secondary contact info based on existing records or creates a new one.
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["john@example.com"],

    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```
🛠️ Scripts
npm run dev – Run the app in development with hot-reloading using ts-node-dev.

🧪**How to Test**
You can test the API using Postman, ThunderClient, or CURL:
```json
curl --request POST \
  --url https://bitespeed-backend-j6eo.onrender.com/identify \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "john@example.com",
    "phoneNumber": "1234567890"
}'
```
🧪 **Test the API using PowerShell**

Use the following PowerShell commands to test the /identify endpoint:
```json
$response1 = Invoke-RestMethod -Uri "http://localhost:3000/identify" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "email": "a@example.com", "phoneNumber": "1111111111" }'

$response1 | ConvertTo-Json -Depth 5
```
```json
$response2 = Invoke-RestMethod -Uri "http://localhost:3000/identify" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "email": "b@example.com", "phoneNumber": "1111111111" }'

$response2 | ConvertTo-Json -Depth 5
```
```json
$response3 = Invoke-RestMethod -Uri "http://localhost:3000/identify" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "email": "a@example.com" }'

$response3 | ConvertTo-Json -Depth 5
```
```json
$response4 = Invoke-RestMethod -Uri "http://localhost:3000/identify" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "phoneNumber": "2222222222" }'

$response4 | ConvertTo-Json -Depth 5
```


📄 Notes
The root URL (/) will return "Cannot GET /" — this is expected because the app only defines a POST /identify route.

Ensure you're testing using a tool that allows sending POST requests.
✅ **Setup Locally (Optional)**
Clone the repo

Install dependencies
```json
npm install
```
Set up your .env with:
```json
DATABASE_URL="your_postgres_url"
PORT=3000
```
Run locally:
```json
npm run dev
```
<img width="1030" height="628" alt="image" src="https://github.com/user-attachments/assets/b602b9cc-8d62-40a7-b526-e02e63d459a4" />
<img width="1033" height="579" alt="image" src="https://github.com/user-attachments/assets/9fb457b9-4244-4eca-a14f-d1e808dd4f6e" />
<img width="1007" height="581" alt="image" src="https://github.com/user-attachments/assets/5e600ee0-02b3-41ac-bfb2-7f7a8dfcf84c" />
<img width="1022" height="577" alt="image" src="https://github.com/user-attachments/assets/768673bc-0f33-41fd-a686-d0acbb2ea4b2" />
<img width="1023" height="582" alt="image" src="https://github.com/user-attachments/assets/b880ba37-d159-4bf7-a407-a71d95ab2e40" />
<img width="982" height="599" alt="image" src="https://github.com/user-attachments/assets/578a1768-17f0-4597-85db-bae2ca273a38" />

