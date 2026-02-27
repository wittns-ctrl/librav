# 📚 Book API

A REST API for managing books built with Node.js, Express, and JWT authentication.

---

## 🛠 Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)

---

## ⚙️ Installation

**1. Clone the repository**
```bash
git clone <https://github.com/wittns-ctrl/librav>
```

**2. Navigate into the project**
```bash
cd book-api
```

**3. Install dependencies**
```bash
npm install  mongoose express bcryptjs jsonwebtoken dotenv
```

**4. Set up environment variables**

Create a `.env` file in the root of your project and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**5. Start the server**
```bash
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint                  | Description       | Auth 
                                                          Required |
|--------|---------------------------|-------------------|---------|
| POST   | `/api/books`              | Create a new book | ✅ Yes |
| POST   | `/register/register`      | user registration | ✅ Yes |
| POST   | `/login/login`            | user login        | ✅ Yes |
| POST   | `/progress/progress`      | reading progress  | ✅ Yes |
| GET    | `/books/api/find`         | finds books in db | ✅ Yes |
---

## 📁 Project Structure

```
├── controllers/
│   └── bookController.js   # Handles book logic
├── models/
│   └── book.js             # Book & User models
├── routes/
│   └── bookRoutes.js       # API routes
├── .env                    # Environment variables
├── package.json
└── README.md
```

---

## 🔐 Authentication

This API uses **JWT (JSON Web Token)** for authentication. Include the token in your request header:

```
Authorization: Bearer <your_token>
```

---

## ⚠️ Error Handling

| Status Code | Meaning |
|-------------|---------|
| 201 | Resource created successfully |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Server error |

---

## 🚀 How to Use the API

**Create a Book**
```bash
curl -X POST http://localhost:4098/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "My Book", "author": "John Doe"}'
```
postman:http://localhost:4098/api/books
---

## 👤 Author

Made with Mugisha Witness Bienvenue.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
