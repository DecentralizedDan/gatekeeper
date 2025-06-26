# Gatekeeper - Binary Counting Educational Web App

An interactive educational web application that teaches users about logical gates and binary counting through hands-on learning experiences.

## 🎯 Project Overview

Gatekeeper is designed to make learning binary number representation engaging and accessible for users of all ages. The app provides a progressive learning experience, starting from basic concepts (0 and 1) and advancing to complex topics like signed vs unsigned integers.

## ✨ Features

### Interactive Learning

- **Progressive Difficulty**: Start with simple 1-bit numbers and advance to 8-bit signed integers
- **Click to Toggle**: Interactive binary digits that users can click to change between 0 and 1
- **Real-time Feedback**: Immediate visual feedback with color-coded results
- **Retry Mechanism**: Users can continue trying until they get the correct answer

### Educational Progression

The app follows this learning sequence:

1. **Basic Concepts**: 0, 1 (1-bit numbers)
2. **Simple Binary**: 2, 4 (2-3 bit numbers)
3. **Medium Complexity**: 10, 100 (4-7 bit numbers)
4. **Advanced Concepts**: 128, 256 (8-bit numbers)
5. **Signed Numbers**: -1, -10, -128 (introducing negative values)

### User Experience

- **Clean, Modern Interface**: Simple, colorful design suitable for all ages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Visual Feedback**: Clear indication of correct/incorrect answers with animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DecentralizedDan/gatekeeper.git
   cd gatekeeper
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080` to view the application.

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and recompile automatically
- `npm run dev` - Start a local development server
- `npm run clean` - Remove compiled JavaScript files

## 🎮 How to Use

1. **Start Learning**: The app begins with the number 0
2. **Toggle Binary Digits**: Click on any 0 or 1 to change its value
3. **Evaluate Your Answer**: Click the "Evaluate" button to check if your binary representation is correct
4. **Get Feedback**:
   - ✅ Green result = Correct answer
   - ❌ Red result = Incorrect answer (try again!)
5. **Progress**: Once correct, click "Next Number" to advance to the next challenge
6. **Complete the Journey**: Work through all 11 steps to master binary counting!

### Keyboard Shortcuts

- `Enter` - Evaluate current answer
- `Arrow Right` - Next number (when correct)
- `Arrow Left` - Previous number
- `R` - Reset current step

## 🏗️ Architecture

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), TypeScript
- **Build Tool**: TypeScript Compiler
- **Hosting**: Static website (GitHub Pages ready)

### File Structure

```
gatekeeper/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Primary stylesheet
│   └── components.css     # Component-specific styles
├── scripts/
│   ├── main.ts            # Main TypeScript file
│   ├── binary.ts          # Binary conversion utilities
│   ├── game.ts            # Game logic and state management
│   ├── ui.ts              # User interface interactions
│   └── *.js               # Compiled JavaScript files
├── docs/                  # Project documentation
│   ├── index.md           # Documentation index
│   ├── project-overview.md # Project overview
│   ├── features.md        # Feature specifications
│   ├── design-principles.md # Design guidelines
│   ├── standards.md       # Coding standards
│   ├── a11y.md           # Accessibility guidelines
│   ├── deploy.md         # Deployment guide
│   └── roadmap.md        # Future enhancements
├── assets/
│   └── images/            # Visual assets
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

### Core Modules

#### `binary.ts`

- Binary to decimal conversion utilities
- Two's complement handling for signed numbers
- Learning sequence management
- Validation and formatting functions

#### `game.ts`

- Application state management
- Game progression logic
- Event system for state changes
- Configuration management

#### `ui.ts`

- DOM manipulation and event handling
- User interface updates
- Accessibility features
- Visual feedback and animations

#### `main.ts`

- Application initialization
- Environment validation
- User preferences management
- Error handling

## 📚 Documentation

Comprehensive project documentation is available in the [`docs/`](docs/) directory:

- **[Documentation Index](docs/index.md)** - Overview of all documentation
- **[Project Overview](docs/project-overview.md)** - High-level project description
- **[Feature Specifications](docs/features.md)** - Detailed feature requirements
- **[Design Principles](docs/design-principles.md)** - Visual and UX guidelines
- **[Coding Standards](docs/standards.md)** - Technical guidelines and best practices
- **[Accessibility Guidelines](docs/a11y.md)** - Accessibility requirements
- **[Deployment Guide](docs/deploy.md)** - Deployment process and hosting
- **[Future Enhancements](docs/roadmap.md)** - Planned features and roadmap

## 🎨 Design Principles

### Visual Style

- **Simple and Colorful**: Engaging design suitable for both adults and children
- **Clean Interface**: Modern, intuitive user interactions
- **Consistent Color Scheme**: Cohesive visual experience throughout
- **Smooth Animations**: Subtle transitions for better user experience

### Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Meets WCAG AA standards for text contrast
- **Focus Indicators**: Clear visual focus states for all interactive elements

### Responsive Design

- **Mobile-First**: Designed for mobile devices first, enhanced for larger screens
- **Flexible Layout**: Adapts to various screen sizes and orientations
- **Touch-Friendly**: Optimized for touch interactions on mobile devices

## 🚀 Deployment

### GitHub Pages

This project is configured for easy deployment on GitHub Pages:

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Enable GitHub Pages**: Go to repository Settings > Pages
3. **Select Source**: Choose "Deploy from a branch"
4. **Select Branch**: Choose `main` or `master` branch
5. **Deploy**: Your app will be available at `https://username.github.io/repository-name`

### Manual Deployment

For other hosting platforms:

1. **Build the project**: `npm run build`
2. **Upload files**: Upload all files except `node_modules/` and TypeScript source files
3. **Configure server**: Ensure your server serves `index.html` for all routes

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- **TypeScript**: Use strict mode and proper typing
- **CSS**: Follow the established design system and use CSS custom properties
- **JavaScript**: Use modern ES6+ features and follow best practices
- **Accessibility**: Ensure all new features are accessible
- **Testing**: Test on multiple browsers and devices

### Areas for Contribution

- **New Learning Challenges**: Add more complex binary counting exercises
- **Visual Enhancements**: Improve animations and visual feedback
- **Accessibility**: Enhance screen reader support and keyboard navigation
- **Performance**: Optimize loading times and responsiveness
- **Documentation**: Improve code comments and user documentation

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for better educational tools in computer science
- Built with modern web technologies for optimal learning experience
- Designed with accessibility and inclusivity in mind

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Issues**: Look for existing issues in the GitHub repository
2. **Create an Issue**: If your problem isn't already reported, create a new issue
3. **Provide Details**: Include browser version, device type, and steps to reproduce

---

**Happy Learning! 🎓**

_Gatekeeper - Making binary counting fun and accessible for everyone._
