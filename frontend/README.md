# Fantasy Football Auction Draft - Frontend

A React frontend for the Fantasy Football Auction Draft app, built with Vite for fast development and modern tooling.

## 🚀 Features

- **Player Management**: View and edit fantasy football players in a sortable, filterable table
- **Inline Editing**: Edit player tiers and values directly in the table
- **Advanced Filtering**: Filter by position (including Flex/Superflex), team, and search by name
- **Responsive Design**: Works great on desktop and mobile devices
- **Real-time Updates**: Changes are saved to the backend API
- **Pagination**: Configurable page sizes (25, 50, 100, 200 players per page)

## 📋 Requirements

- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- Backend API running on http://localhost:4000

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏈 Usage

### Starting the App

1. Make sure the backend API is running on http://localhost:4000
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
3. Open your browser to http://localhost:5173

### Features Overview

#### Player Table
- Displays fantasy-relevant players (QB, RB, WR, TE, K, DST) with auction value ≥ $1
- Sortable columns: Overall Rank, Position Rank, Name, Position, Team, Tier, Auction Value, Yahoo Value
- Click column headers to sort (click again to reverse sort order)

#### Filtering
- **Search**: Type player names to filter results
- **Position Filters**: 
  - Individual positions (QB, RB, WR, TE, K, DST)
  - Flex: Shows RB/WR/TE players
  - Superflex: Shows QB/RB/WR/TE players
- **Team Filter**: Dropdown to filter by NFL team

#### Editing Players
- Click on Tier, Auction Value, or Yahoo Value cells to edit
- Changes are tracked and highlighted
- Use "Save Changes" button to commit all edits to the backend
- Use "Clear" button to discard pending changes

#### Pagination
- Choose page size: 25, 50, 100, or 200 players per page
- Navigate through pages with pagination controls
- Page size preference is maintained during your session

## 🎨 Design

The frontend features a clean, minimal design with:
- Modern card-based layout
- Color-coded position badges
- Hover effects and smooth transitions
- Responsive design for mobile devices
- Accessible form controls and navigation

## 🔧 Configuration

### API Endpoint
The frontend is configured to connect to the backend at `http://localhost:4000/api`. To change this, update the `baseURL` in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://your-backend-url/api',
  // ...
});
```

### Styling
All styles are contained in component-specific CSS files in `src/components/`. The design uses:
- CSS custom properties for consistent theming
- Flexbox and Grid for responsive layouts
- CSS animations for smooth interactions

## 📱 Responsive Design

The app is fully responsive and works well on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (< 768px)

Mobile-specific features:
- Touch-friendly buttons and controls
- Collapsible filter sections
- Optimized table scrolling
- Larger touch targets

## 🚨 Troubleshooting

### Backend Connection Issues
- Verify the backend is running on http://localhost:4000
- Check browser console for CORS errors
- Ensure backend has CORS enabled for frontend origin

### Performance Issues
- Use pagination with smaller page sizes for better performance
- Clear browser cache if experiencing stale data
- Check network tab for slow API requests

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 🤝 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── PlayerTable.jsx  # Main table component
│   ├── SearchBar.jsx    # Search functionality
│   ├── PositionFilters.jsx # Position filter buttons
│   ├── EditableCell.jsx # Inline editing component
│   └── *.css           # Component styles
├── hooks/              # Custom React hooks
│   └── usePlayers.js   # Player data management
├── services/           # API services
│   └── api.js         # Backend API communication
└── App.jsx            # Main app component
```

### Adding New Features
1. Create new components in `src/components/`
2. Add corresponding CSS files for styling
3. Update the `usePlayers` hook if adding new data operations
4. Add new API endpoints to `src/services/api.js` if needed

### Code Style
- Use functional components with hooks
- Keep components small and focused
- Use CSS modules or component-specific CSS files
- Follow React best practices for state management

## 📄 License

This project is licensed under the ISC License.

---

**Ready to draft!** 🏈 Your fantasy football auction just got a whole lot easier!