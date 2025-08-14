# Fantasy Football Auction Draft App

A complete fantasy football auction draft application with a Node.js + Express backend connected to PostgreSQL and a modern React frontend.

## 🏈 Project Overview

This application helps manage fantasy football auction drafts with features for viewing, filtering, and editing player data. It consists of:

- **Backend**: Node.js + Express API with PostgreSQL database
- **Frontend**: React (Vite) with modern UI components

## 📁 Project Structure

```
fantasy-football-app/
├── backend/
│   ├── controllers/
│   │   └── playersController.js    # Player business logic
│   ├── routes/
│   │   └── players.js             # API routes
│   ├── test/
│   │   └── test-connectivity.js   # Database tests
│   ├── .env                       # Environment variables
│   ├── db.js                      # Database connection
│   ├── server.js                  # Express server
│   └── package.json               # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom hooks
│   │   ├── services/              # API services
│   │   └── App.jsx                # Main app
│   ├── package.json               # Frontend dependencies
│   └── README.md                  # Frontend docs
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14.0.0 or higher)
- PostgreSQL database
- npm or yarn

### 1. Backend Setup

```bash
# Install backend dependencies
npm install

# Test database connection
npm test

# Start the backend server
npm start
```

The backend will run on http://localhost:4000

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on http://localhost:5173

## 🎯 Features

### Backend API
- **GET** `/api/players` - Get all fantasy-relevant players
- **GET** `/api/players/:id` - Get specific player
- **GET** `/api/players/position/:position` - Get players by position
- **PUT** `/api/players/:id` - Update player tier and values
- **GET** `/health` - Health check

### Frontend Features
- **Player Table**: Sortable, filterable table of all players
- **Advanced Filtering**: 
  - Search by name
  - Filter by position (QB, RB, WR, TE, K, DST)
  - Special filters: Flex (RB/WR/TE), Superflex (QB/RB/WR/TE)
  - Filter by team
- **Inline Editing**: Edit tier, auction value, and Yahoo value
- **Batch Operations**: Save multiple changes at once
- **Pagination**: Configurable page sizes (25, 50, 100, 200)
- **Responsive Design**: Works on desktop and mobile

## 🗄️ Database

The app connects to a PostgreSQL database with the following structure:

### Players Table
- `id` - Primary key
- `sleeper_id` - External player ID
- `full_name` - Player's full name
- `first_name` - First name
- `last_name` - Last name
- `position` - Player position (QB, RB, WR, TE, K, DST)
- `team` - NFL team abbreviation
- `status` - Player status (Active/Inactive)
- `auction_value` - Auction draft value
- `yahoo_value` - Yahoo fantasy value
- `bye_week` - Bye week number
- `tier` - Player tier ranking
- `active` - Whether player is active

### Database Configuration
Set these environment variables in `.env`:
```env
DB_USER=morrissutton
DB_PASSWORD=mutick
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fantasy_auction
```

## 🧪 Testing

### Backend Tests
```bash
# Test database connectivity
npm test

# Create sample data (optional)
node test/test-connectivity.js --create-sample
```

### API Testing
```bash
# Health check
curl http://localhost:4000/health

# Get players
curl http://localhost:4000/api/players

# Update a player
curl -X PUT http://localhost:4000/api/players/1 \
  -H "Content-Type: application/json" \
  -d '{"tier": 1, "auction_value": 50}'
```

## 🎨 UI/UX Features

- **Clean Design**: Modern, minimal interface
- **Color-Coded Positions**: Visual position identification
- **Hover Effects**: Interactive feedback
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error messages
- **Mobile Responsive**: Touch-friendly mobile interface

## 🔧 Development

### Backend Development
```bash
# Start with auto-reload (if you add nodemon)
npm run dev

# Run tests
npm test
```

### Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚨 Troubleshooting

### Backend Issues
1. **Database Connection**: Verify PostgreSQL is running and credentials are correct
2. **Port Conflicts**: Ensure port 4000 is available
3. **Missing Data**: Run the test script to check table structure

### Frontend Issues
1. **API Connection**: Ensure backend is running on port 4000
2. **CORS Issues**: Backend includes CORS headers for development
3. **Build Errors**: Clear node_modules and reinstall dependencies

### Common Solutions
```bash
# Reset backend
rm -rf node_modules package-lock.json
npm install

# Reset frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📈 Performance

- **Backend**: Connection pooling, efficient queries, proper indexing
- **Frontend**: Virtual scrolling, pagination, optimized re-renders
- **Database**: Indexed columns for fast sorting and filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🎉 Ready to Draft!

Your fantasy football auction draft app is ready to use! Start the backend, launch the frontend, and begin managing your draft with confidence.

**Happy drafting!** 🏈🚀