# Smart Inventory Management System

A modern, full-stack inventory management application built with React, Node.js, Express, and MongoDB.

## Features

- **Dynamic Dashboard**: Real-time inventory statistics with beautiful cards
- **Modern UI**: Clean, responsive design matching modern web applications
- **Search & Filter**: Advanced search and filtering capabilities
- **Status Management**: Automatic status detection (Good, Low Stock, Out of Stock, Expired)
- **Real-time Data**: Live data fetching from MongoDB database
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- Vite
- Axios for API calls
- Modern CSS with Grid and Flexbox

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Smart_inventory
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/smart_inventory
PORT=5000
```

**Note**: Replace the MongoDB URI with your actual database connection string.

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create a database named `smart_inventory`

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

### 5. Seed Sample Data (Optional)

To populate your database with sample inventory items:

```bash
cd backend
node seedData.js
```

This will add 10 sample inventory items to test the application.

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
# In a new terminal, from the root directory
npm run dev
```

The frontend application will start on `http://localhost:5173`

## API Endpoints

### Inventory Management
- `GET /items` - Get all inventory items
- `GET /items/:id` - Get a specific item
- `POST /items` - Add a new item
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Database Schema

### Inventory Item
```javascript
{
  item_name: String (required),
  item_image: String (required),
  item_quantity: Number (required),
  item_location: String (required),
  item_expirydate: Date (required),
  item_status: String (enum: ["good-stock", "low-stock", "out-of-stock"])
}
```

## Features Overview

### Dashboard Cards
- **Total Items**: Shows the total number of items in inventory
- **Low Stock Items**: Items with low stock status
- **Expired Items**: Items past their expiration date
- **Out of Stock Items**: Items with zero quantity

### Inventory Table
- **Search**: Search items by name
- **Filter**: Filter by status (All, Good, Low Stock, Out of Stock)
- **Actions**: Edit and delete items with dropdown menus
- **Status Indicators**: Color-coded status badges
- **Responsive**: Works on all screen sizes

### Real-time Features
- Automatic status calculation based on expiry dates
- Dynamic statistics calculation
- Live search and filtering
- Error handling and loading states

## Project Structure

```
Smart_inventory/
├── backend/
│   ├── controllers/
│   │   ├── inventoryController.js
│   │   └── loginController.js
│   ├── model/
│   │   └── Inventory.js
│   ├── routes/
│   │   ├── inventoryRoute.js
│   │   └── loginRoute.js
│   ├── server.js
│   ├── seedData.js
│   └── package.json
├── src/
│   ├── Components/
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── Pages/
│   │   ├── Dashboard.jsx
│   │   ├── Inventory.jsx
│   │   ├── Login.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network connectivity

2. **CORS Errors**
   - Backend has CORS enabled by default
   - Check if frontend is running on the correct port

3. **Port Already in Use**
   - Change the port in `backend/server.js`
   - Update the API URL in frontend components

4. **Module Not Found Errors**
   - Run `npm install` in both root and backend directories
   - Check if all dependencies are properly installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
