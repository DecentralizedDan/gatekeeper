# Gatekeeper - Binary Counting Educational Web App

## Project Overview

An interactive web application that teaches users binary number representation through progressive difficulty levels, from basic concepts to signed integers.

## Core Features

### Number Sequence

- **Progression**: 0, 1, 2, 3, 4, 6, 7, 8, 10, 12, 13, 15, 16, 20, 22, 24, 27, 30, 32, -1, -2, -4, -10, -16, -31, -32
- **Total Questions**: 26 questions
- **Difficulty**: Progressive from simple 1-bit numbers to complex signed numbers

### User Interface Layout

#### Top Section

- **Target Number Display**: Large, prominent display of the current decimal number to represent
- **Progress Indicator**: "Question X of Y" format
- **Signed Bit Explanation**: Appears only for negative numbers (-1 to -64)
  - Text: "In signed binary, the leftmost bit is the sign bit. 0 means positive, 1 means negative."

#### Middle Section

- **Binary Input Area**: Horizontal row of clickable binary digits
- **Digit Styling**:
  - Square background with black fill
  - Thin neon blue border
  - White text for 0 and 1
  - Button-like appearance

#### Bottom Section

- **Check Button**: Evaluates user's binary input
- **Result Display**: Shows feedback (correct/incorrect)

### User Interactions

#### Binary Digit Toggle

- **Click Behavior**: Toggle between 0 and 1
- **Visual Feedback**: Subtle shake animation (100ms duration)
- **Audio Feedback**: Brief 250ms lightsaber sound
- **Accessibility**: Keyboard navigation support (Enter/Space to toggle)

#### Evaluation System

- **Check Button**: Evaluates current binary input against target number
- **Button States**:
  - **Default**: Shows "Check" text
  - **Incorrect Answer**: Button text changes to "Try Again"
  - **Correct Answer**: Auto-advance to next question, button text returns to "Check"
- **Correct Answer**:
  - Green success indication
  - Auto-advance to next question
- **Incorrect Answer**:
  - Red error indication
  - Show what the user's binary actually represents in decimal
  - Example: "Incorrect. 1010 = 10, not 8"

### Technical Specifications

#### Binary Representation Rules

- **Positive Numbers (0-4194304)**: Standard unsigned binary
- **Negative Numbers (-1 to -64)**: Two's complement with sign bit
- **Digit Count**: Minimum digits needed for each specific number
- **Default State**: All digits start as 0

#### Navigation Constraints

- **Forward Only**: Users cannot go back to previous questions
- **No Skipping**: Users cannot jump ahead to future questions
- **Sequential Progression**: Must complete each question in order

### Completion Experience

#### Game Completion Modal

- **Trigger**: When all 31 questions are answered correctly
- **Content**: Inspirational real-world quote about binary counting
- **Action**: "Restart Game" button to begin again from question 1
- **Quote Examples**:
  - "Every complex problem has a simple solution - just like every number can be represented with just 0s and 1s."
  - "In the digital age, understanding binary is understanding the language of computers."

### Visual Design

#### Color Scheme

- **Primary**: Clean, simple color palette
- **Binary Digits**: Black background, neon blue border, white text
- **Success**: Green for correct answers
- **Error**: Red for incorrect answers
- **Background**: Light, neutral background

#### Typography

- **Target Number**: Large, bold display font
- **Binary Digits**: Monospace font for clear digit distinction
- **Progress Text**: Smaller, secondary font
- **Explanatory Text**: Readable body font

### Accessibility Features

- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Indicators**: Clear visual focus states
- **Color Contrast**: WCAG AA compliant contrast ratios

### Audio Design

- **Toggle Sound**: Brief 250ms lightsaber sound
- **Volume Control**: Respects system audio settings
- **Accessibility**: Sound can be disabled for users with audio sensitivity

### Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Desktop Enhancement**: Enhanced experience on larger screens
- **Touch Friendly**: Adequate touch targets for mobile interaction

## Implementation Phases

### Phase 1: Core Structure

- HTML layout and basic styling
- Binary digit creation and display
- Basic click functionality

### Phase 2: Game Logic

- Number sequence management
- Binary conversion utilities
- Evaluation system

### Phase 3: User Experience

- Animations and sound effects
- Progress tracking
- Error handling and feedback

### Phase 4: Polish

- Accessibility improvements
- Responsive design
- Completion modal

### Phase 5: Testing

- Cross-browser compatibility
- Mobile testing
- Accessibility validation
