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

🧪 How to Test
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
📄 Notes
The root URL (/) will return "Cannot GET /" — this is expected because the app only defines a POST /identify route.

Ensure you're testing using a tool that allows sending POST requests.
✅ Setup Locally (Optional)
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




