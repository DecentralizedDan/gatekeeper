# Gatekeeper - Binary Counting Educational Web App

An interactive web application that teaches users binary number representation through progressive difficulty levels, from basic concepts to signed integers.

## 🎯 Project Overview

Gatekeeper is an educational tool designed to make learning binary counting engaging and intuitive. Users progress through a carefully crafted sequence of numbers, learning to represent them in binary format through interactive clicking and immediate feedback.

## ✨ Features

### Progressive Learning Path

- **26 carefully sequenced questions** from simple to complex
- **Positive numbers**: 0, 1, 2, 3, 4, 6, 7, 8, 10, 12, 13, 15, 16, 20, 22, 24, 27, 30, 32
- **Negative numbers**: -1, -2, -4, -10, -16, -31, -32 (introducing signed binary)

### Interactive Binary Input

- **Click to toggle**: Binary digits switch between 0 and 1 with each click
- **Visual feedback**: Subtle shake animation (100ms) when toggling
- **Audio feedback**: Brief 250ms lightsaber sound on toggle
- **Keyboard accessible**: Use Enter or Space to toggle digits

### Smart Evaluation System

- **Real-time feedback**: Immediate evaluation of binary input
- **Detailed error messages**: Shows what your binary actually represents
- **Progressive difficulty**: Builds from 1-bit to complex signed numbers

### Educational Features

- **Signed bit explanation**: Clear explanation when negative numbers are introduced
- **Minimum digit display**: Only shows the digits needed for each number
- **Two's complement**: Proper handling of negative numbers

## 🎮 How to Play

1. **Look at the target number** displayed at the top
2. **Click binary digits** to toggle between 0 and 1
3. **Press "Check"** to evaluate your answer
4. **If incorrect**: See what your binary represents and try again
5. **If correct**: Automatically advance to the next question
6. **Complete all 26 questions** to finish the game

## 🎨 Visual Design

- **Clean, modern interface** with intuitive interactions
- **Binary digits**: Black squares with neon blue borders
- **Color-coded feedback**: Green for correct, red for incorrect
- **Responsive design**: Works on desktop, tablet, and mobile
- **Accessible design**: High contrast and keyboard navigation

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **No dependencies**: Pure vanilla web technologies
- **Static hosting**: Ready for GitHub Pages or any static host
- **Cross-browser**: Compatible with all modern browsers

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/gatekeeper.git
   cd gatekeeper
   ```

2. Open `index.html` in your web browser
3. Start learning binary counting!

### Development

- Edit HTML, CSS, and JavaScript files directly
- No build process required
- Refresh browser to see changes

## 📁 Project Structure

```
gatekeeper/
├── index.html          # Main HTML file
├── styles/
│   ├── main.css        # Primary stylesheet
│   └── components.css  # Component-specific styles
├── scripts/
│   ├── main.js         # Main JavaScript file
│   ├── binary.js       # Binary conversion utilities
│   ├── game.js         # Game logic and state management
│   └── ui.js           # User interface interactions
├── assets/
│   └── audio/          # Sound effects
├── DESIGN.md           # Detailed design specifications
└── README.md           # This file
```

## 🎯 Learning Objectives

By completing Gatekeeper, users will understand:

- **Binary number representation** from 0 to 32
- **Bit manipulation** through interactive clicking
- **Signed vs unsigned integers** and their differences
- **Two's complement** representation for negative numbers
- **Progressive complexity** in number systems

## 🤝 Contributing

This is an educational project designed to help people learn binary counting. Contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Areas for Improvement

- Additional number sequences
- More visual feedback options
- Accessibility enhancements
- Mobile optimizations
- Additional educational content

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the need for better binary counting education
- Built with modern web standards for maximum accessibility
- Designed for learners of all ages and backgrounds

## 📞 Support

If you have questions or encounter issues:

- Open an issue on GitHub
- Check the design document for detailed specifications
- Review the code comments for implementation details

---

**Happy Binary Counting! 🎉**
