# 📩 Saraha App

A RESTful API built with **Node.js**, **Express**, **MongoDB**, and **JWT** for sending and receiving anonymous messages with secure authentication, OTP confirmation, and public/private message controls.

---

## 📁 Folder Structure

```
src/
├── common/
│   ├── constant/
│   │   └── file.constant.js
│   └── enums/
│       ├── index.js
│       ├── messages.enum.js
│       └── user.enum.js
├── cron/
│   └── cleanupTokens.js
├── DB/
│   ├── Models/
│   │   ├── black-listed-tokens.model.db.js
│   │   ├── messages.model.db.js
│   │   ├── user.model.db.js
│   │   └── index.js
│   └── db.connection.js
├── Middlewares/
│   ├── authentication.middleware.js
│   ├── authorization.middleware.js
│   ├── multer.middleware.js
│   ├── rate-limiter.middleware.js
│   ├── validation.middleware.js
│   └── index.js
├── Modules/
│   ├── Messages/
│   │   ├── Controllers/
│   │   │   ├── message.controller.js
│   │   │   └── index.js
│   │   └── Services/
│   │       └── message.service.js
│   └── Users/
│       ├── Controllers/
│       │   ├── auth.controller.js
│       │   ├── password.controller.js
│       │   ├── user.controller.js
│       │   └── index.js
│       └── Services/
│           ├── auth.service.js
│           ├── password.service.js
│           └── user.service.js
├── Utils/
│   ├── countries.utils.js
│   ├── encryption.utils.js
│   ├── send-email-utils.js
│   ├── token.utils.js
│   └── index.js
├── Validators/
│   └── Schemas/
│       ├── user.schema.js
│       └── index.js
├── uploads/
│   └── avatar/
│       └── (uploaded files)
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

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following:

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

👉 [Postman Docs](https://documenter.getpostman.com/view/38568669/2sB3HkpL5S)

---

## 🧠 Features

- 🔐 **User Authentication** with JWT access & refresh tokens  
- ✉️ **OTP confirmation** via email (confirm & resend)  
- 🔑 **Password encryption** with bcrypt  
- 📨 **Anonymous messages**: send & receive without revealing identity  
- 🌐 **Public & private messages** with visibility control  
- 🚪 **Blacklist tokens** on logout for extra security  
- 🔄 **Token refresh** to maintain sessions  
- 📝 **Update & delete user profile** endpoints  
- 🛡 **Middleware authentication & authorization** to protect routes  
- ⚡ **Rate limiting & validation** middlewares  
- 🧩 **Clean modular structure** with Controllers & Services  
- ⏰ **Auto cleanup of expired tokens** via cron job  

---

## 📌 API Endpoints

### 👤 Users

#### 🧾 Account
| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/users/signup` | Register a new user |
| **POST** | `/users/login` | Log in and receive access & refresh tokens |
| **PUT** | `/users/update` | Update user profile info (auth required) |
| **PUT** | `/users/update-email` | Update user email and send OTP for confirmation |
| **DELETE** | `/users/delete-account` | Delete user account (auth required) |
| **POST** | `/users/logout` | Logout and blacklist access token |
| **POST** | `/users/refresh-token` | Refresh JWT access token |
| **POST** | `/users/upload-profile-picture` | Upload user profile picture (auth required) |

#### 🔐 Password
| Method | Endpoint | Description |
|--------|-----------|-------------|
| **PUT** | `/users/forget-password` | Request OTP for password reset |
| **PUT** | `/users/password-otp` | Verify OTP for password reset |
| **PUT** | `/users/resend-password-otp` | Resend password OTP |
| **PUT** | `/users/reset-password` | Reset password using OTP |
| **PUT** | `/users/update-password` | Update password while logged in (auth required) |

#### ✉️ OTP Verifications
| Method | Endpoint | Description |
|--------|-----------|-------------|
| **PUT** | `/users/confirm-otp` | Confirm email using OTP |
| **PUT** | `/users/resend-otp` | Resend email confirmation OTP |

#### 📋 List Users
| Method | Endpoint | Description |
|--------|-----------|-------------|
| **GET** | `/users/list` | Get all users (auth required) |

---

### 💬 Messages
| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/messages/send/:receiverId` | Send an anonymous message to a user |
| **GET** | `/messages/my-messages` | List all messages received by the logged-in user |
| **PUT** | `/messages/change-status/:_id` | Change specific message status (private → public) |
| **GET** | `/messages/list-public/:userId` | List all public messages of a specific user |
| **DELETE** | `/messages/delete/:_messageId` | Delete a specific message from my inbox |

---

## 👨‍💻 Author

Developed by **Ziad Amr**  

🔗 [GitHub](https://github.com/ziiadamr)  
🔗 [LinkedIn](https://linkedin.com/in/ziiadamr)

