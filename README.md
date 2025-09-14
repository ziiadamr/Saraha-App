# 📩 Saraha App

A RESTful API built with **Node.js**, **Express**, **MongoDB**, and **JWT** for sending and receiving anonymous messages with secure authentication and OTP confirmation.

---

## 📁 Folder Structure

```bash
src/
├── DB/
│   ├── Models/
│   │   ├── black-listed-tokens.model.db.js
│   │   ├── messages.model.db.js
│   │   └── user.model.db.js
│   └── db.connection.js
├── Middlewares/
│   └── authentication.middleware.js
├── Modules/
│   ├── Messages/
│   │   ├── message.controller.js
│   │   └── message.service.js
│   └── Users/
│       ├── user.controller.js
│       └── user.service.js
├── Utils/
│   ├── encryption.utils.js
│   ├── send-email-utils.js
│   └── token.utils.js
├── index.js
├── .env.example
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ziiadamr/saraha.git
cd saraha
```

### 2. Install dependencies
```bash
npm install
```

## Environment Variables

Before running the project, create a `.env` file in the root directory and add the following variables:

```env
# Database Configuration
DB_URL_LOCAL=

# Server Configuration
PORT=

# Security
SALT_ROUNDS=
IV_LENGTH=
ENC_KEY=

# Email Configuration
EMAIL_USER=
EMAIL_PASS=

# JWT Tokens
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
```

### 4. Start the Server

```bash
npm run start:dev
```

The server will run at: [http://localhost:3000](http://localhost:3000)

---

## 🔗 Postman Collection

👉 [https://documenter.getpostman.com/view/38568669/2sB3HkpL5S]

---

## 🧠 Features

- **User Authentication** with JWT access & refresh tokens  
- **OTP confirmation** via email (confirm & resend)  
- **Password encryption** with bcrypt  
- **Anonymous messages**: send & receive without revealing identity  
- **Blacklist tokens** on logout for extra security  
- **Token refresh** to maintain sessions  
- **Update & delete user profile** endpoints  
- **Middleware authentication** to protect routes  
- **Clean modular structure** with Controllers & Services  

---

## 📌 API Endpoints

### 👤 Users
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | /users/signup         | Register a new user |
| POST   | /users/signin         | Login and get tokens |
| PUT    | /users/update         | Update user info (auth required) |
| PUT    | /users/update-password| Update user password (auth required) |
| DELETE | /users/delete         | Delete user account (auth required) |
| POST   | /users/logout         | Logout and blacklist token (auth required) |
| POST   | /users/refresh        | Refresh JWT access token |
| GET    | /users/list           | Get all users |
| PUT    | /users/confirm        | Confirm account with OTP |
| PUT    | /users/resend         | Resend OTP via email |

---

## 👨‍💻 Author

Developed by **Ziad Amr**  
🔗 [GitHub](https://github.com/ziiadamr)  
🔗 [Linkedin](https://www.linkedin.com/in/ziadamr/)  
