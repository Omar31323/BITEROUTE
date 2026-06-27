# 🍕 BiteRoute

A full-stack food delivery web application where customers can browse restaurants, add items to their cart, and place orders — while admins manage restaurants, menus, and order statuses.

---

## 🚀 Features

### Customer
- Browse and search restaurants by name or cuisine
- Filter by cuisine category
- View restaurant menus grouped by category
- Add/remove items from cart with live quantity controls
- Place orders with optional notes
- Track current and past orders with status updates

### Admin
- Add, edit, and delete restaurants
- Upload restaurant images
- Add and edit menu items per restaurant (with image upload, category, popular badge)
- View and manage all incoming orders per restaurant
- Update order statuses in real time

### General
- Session-based authentication (login / signup)
- Protected routes for customers and admins
- Toast notification system for all feedback (no browser alerts)
- Cart count persists on page refresh
- Fully responsive layout

---

## 🛠 Tech Stack

**Frontend**
- React 18 (Vite)
- React Router v6
- Custom CSS design system (no UI library)
- Zod for client-side form validation

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Session-based auth with express-session
- Multer for image uploads

---

## 📁 Project Structure

```
src/
├── Components/
│   ├── Navbar.jsx
│   ├── HomePage.jsx
│   ├── Restaurant.jsx
│   ├── Menu.jsx
│   ├── MenuItem.jsx
│   ├── RestaurantHero.jsx
│   ├── Cart.jsx
│   ├── CartItem.jsx
│   ├── RestaurantCard.jsx
│   ├── Orders.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── AddRestaurant.jsx
│   ├── EditRestaurant.jsx
│   ├── EditMenu.jsx
│   ├── Item.jsx
│   ├── AddItems.jsx
│   ├── ItemForm.jsx
│   ├── RestaurantOrders.jsx
│   ├── Order.jsx
│   ├── Footer.jsx
│   ├── NotFound.jsx
│   ├── ConfirmModal.jsx
│   ├── ProtectedRoute.jsx
│   └── AdminRoute.jsx
├── Context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ToastContext.jsx
├── apiFetch.js
└── biteroute.css
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
git clone https://github.com/omar3123/biteroute.git
cd biteroute

2. Install frontend dependencies

cd client
npm install

3. Install backend dependencies

cd server
npm install


4. Create a `.env.local` in the client folder

VITE_API_URL=http://localhost:3000


5. Create a `.env` in the server folder
```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
PORT=3000
```

6. Run the backend

cd server
npm run dev


7. Run the frontend

cd client
npm run dev


App will be running at `http://localhost:5173`

---


## 🗺 Roadmap

- [ ] Real-time order status updates
- [ ] Restaurant owner accounts
- [ ] Order history filtering
- [ ] Deployment (Vercel + Railway)

---

## 📄 License

MIT
