# Pokemon TCG Simulator

A modern, interactive Pokemon Trading Card Game simulator built with React. Load your 60-card deck and play with drag-and-drop functionality, health tracking, and deck searching.

## Features

### 🎴 Card Management
- **Load 60 Cards**: Select exactly 60 card images from your computer
- **Automatic Shuffling**: Shuffle your deck with one click
- **Draw Cards**: Click the deck to draw cards to your hand

### 🎮 Interactive Playmat
- **Drag & Drop**: Move cards from your hand to the playmat
- **Free Positioning**: Place cards anywhere on the game board
- **Visual Feedback**: Hover effects and smooth animations

### ⚡ Game Controls
- **Shuffle Deck**: Randomize your deck order
- **Search Deck**: Find specific cards and add them to your hand
- **Reset Game**: Clear the playmat and reshuffle

### ❤️ Health System
- **Health Tracking**: Each card has customizable health points
- **Easy Editing**: Click on cards to modify their health values
- **Visual Display**: Health shown with heart icons

### 🔍 Advanced Features
- **Deck Search**: Search through your entire deck by card name
- **Real-time Filtering**: Instant search results as you type
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download this project**
   ```bash
   # If you have git installed
   git clone <repository-url>
   cd pokemon-tcg-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically open in your default browser

### How to Use

1. **Load Your Deck**
   - Click "Select 60 Card Images" button
   - Choose exactly 60 Pokemon card images from your computer
   - Supported formats: JPG, PNG, GIF, WebP

2. **Start Playing**
   - Click the deck to draw cards
   - Drag cards from your hand to the playmat
   - Use the control buttons for additional actions

3. **Manage Cards**
   - Hover over cards on the playmat to see health
   - Click the heart icon to edit health values
   - Use the search function to find specific cards

## Controls

| Button | Function |
|--------|----------|
| **Deck** | Click to draw a card |
| **Shuffle Deck** | Randomize deck order |
| **Search Deck** | Open search modal |
| **Reset Game** | Clear playmat and reshuffle |

## Tips for Best Experience

### Card Images
- Use high-quality images for best visual results
- Ensure images are in a 2:3 aspect ratio (like real Pokemon cards)
- Keep file sizes reasonable (under 2MB per image)

### Gameplay
- Drag cards from your hand to place them on the playmat
- Cards placed on the playmat can be moved around freely
- Use the search function to quickly find specific cards
- Health values can be edited at any time

### Performance
- The app works best with modern browsers
- Large image files may take longer to load initially
- All processing happens locally - no data is sent to servers

## Technical Details

### Built With
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Draggable** - Drag and drop functionality
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with gradients and animations

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

**"Please select exactly 60 card images"**
- Make sure you've selected exactly 60 image files
- Check that all files are valid image formats

**Cards not loading**
- Ensure image files are not corrupted
- Try with smaller image files
- Check browser console for errors

**Drag and drop not working**
- Make sure you're using a supported browser
- Try refreshing the page
- Check that JavaScript is enabled

### Performance Issues
- Use smaller image files for better performance
- Close other browser tabs to free up memory
- Restart the development server if needed

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the simulator!

## License

This project is open source and available under the MIT License.

---

**Enjoy your Pokemon TCG battles!** 🎮⚡ 