# 🏨 DreamHotel

DreamHotel is a full-stack hotel booking platform built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It provides an intuitive platform for travelers to search, compare, and book hotels while allowing hotel owners to manage their property listings. An admin panel ensures that hotel listings are verified before becoming publicly available, maintaining the quality and authenticity of the platform.

---

## ✨ Features

### 👤 Customer

- User Registration & Login
- Secure Authentication
- Search Hotels
- Filter Hotels by Location, Price, Amenities, etc.
- Compare Hotels
- View Hotel Details
- Room Availability Check
- Book Rooms
- Cancel Bookings
- Booking History (Trip List)
- Wishlist Management
- Hotel Reviews & Ratings
- Responsive User Dashboard

### 🏨 Hotel Owner

- Owner Registration & Login
- Publish Hotel Listings
- Update Property Details
- Delete Properties
- Manage Room Availability
- View Reservation List
- Track Property Bookings
- Manage Hotel Information

### 👨‍💼 Administrator

- Admin Authentication
- Verify Hotel Listings
- Approve or Reject Hotels
- Manage Customers
- Manage Hotel Owners
- Remove Fraudulent Users
- Platform Monitoring

---

## 🛠️ Technology Stack

| Category               | Technologies               |
| ---------------------- | -------------------------- |
| Frontend               | React.js                   |
| UI                     | Bootstrap, HTML5, CSS3     |
| Routing                | React Router               |
| Backend                | Node.js, Express.js        |
| Security               | JWT Authentication, BCrypt |
| Database               | MongoDB Atlas, Mongoose    |
| Environment Management | Dotenv                     |
| Version Control        | Git & GitHub               |

---

## ⚙️ Prerequisites

- Node.js 20+
- MongoDB Atlas Account (or Local MongoDB)
- npm
- Git

---

## 📥 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Kdenius/DreamHotel.git
```

Navigate to the project:

---

### 2️⃣ Backend Setup

Navigate to the backend project:

```bash
cd ServerApi
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

or

```bash
node index.js
```

Backend URL:

```text
http://localhost:8000
```

---

### 3️⃣ Frontend Setup

Navigate to the frontend project:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm start
```

or (if using Vite)

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

depending on the frontend configuration.

---

## 🔧 Configuration

Create a `.env` file inside the backend directory.

### Server

```properties
PORT=8000
```

### Database

```properties
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
```

### JWT Authentication

```properties
JWT_SECRET=YOUR_SECRET_KEY
```

---

## 📖 Documentation

- 📕 [Project Report](./docs/DreamHotel_Report.pdf)

---

## 📄 License

This project is developed for educational purposes. Feel free to modify and extend it according to your requirements.

© 2026 DreamHotel — Kishan Dervaliya | Jay Chavda
