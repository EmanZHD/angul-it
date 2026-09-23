# CAPTCHA-izahid

A modern, interactive CAPTCHA application built with Angular.
The project challenges users through a sequence of verification tasks designed to determine whether they are human.

## Overview

CAPTCHA-izahid is a frontend CAPTCHA challenge developed with Angular.

The application guides the user through different verification challenges while maintaining the current progress and measuring the time taken to complete the CAPTCHA.

The project focuses on:

* Angular fundamentals
* Component-based architecture
* Services and state management
* Routing
* Form handling and user input validation
* Local storage persistence
* Dynamic UI updates
* Angular Material
* Responsive design
* Unit testing

## Features

### CAPTCHA Challenges

The application includes multiple challenge types:

* 🖼️ **Image verification** — select the correct images according to the requested category.
* ➕ **Math verification** — solve a dynamically generated mathematical problem.
* 🔤 **Text verification** — enter the generated verification text.

### Performance Tracking

The application includes a built-in timer that starts when the CAPTCHA begins and measures the completion time.

After successfully completing the CAPTCHA, the user receives a performance result based on their completion time.

### State Persistence

The CAPTCHA state is stored in the browser's `localStorage`.

This allows the application to preserve information such as:

* Current challenge
* Selected images
* Challenge answers
* Completion state
* Timer state

### Navigation

Users can:

* Return to the home page
* Move between CAPTCHA challenges
* Retry the CAPTCHA
* View their final result

### User Interface

The interface is built with:

* Angular Material
* SCSS
* Responsive layouts
* Material icons
* Custom animations and visual elements

## Technologies

| Technology       | Usage                                  |
| ---------------- | -------------------------------------- |
| Angular          | Frontend framework                     |
| TypeScript       | Application logic                      |
| Angular Material | UI components                          |
| SCSS             | Styling                                |
| HTML             | Application structure                  |
| Vitest           | Unit testing                           |
| LocalStorage     | Client-side state persistence          |
| Make             | Project setup and development commands |

## 📁 Project Structure

```text
src/
├── app/
│   ├── captcha/
│   │   ├── captcha.ts
│   │   ├── captcha.html
│   │   ├── captcha.scss
│   │   └── captcha.spec.ts
│   │
│   ├── core/
│   │   └── service/
│   │       ├── captcha-state.service.ts
│   │       └── captcha-state.service.spec.ts
│   │
│   ├── home/
│   │   ├── home.ts
│   │   ├── home.html
│   │   ├── home.scss
│   │   └── home.spec.ts
│   │
│   ├── popup/
│   │   ├── popup.ts
│   │   ├── popup.html
│   │   ├── popup.scss
│   │   └── popup.spec.ts
│   │
│   ├── result/
│   │   ├── result.ts
│   │   ├── result.html
│   │   ├── result.scss
│   │   └── result.spec.ts
│   │
│   └── models/
│       └── captcha-state.interface.ts
│
├── assets/
└── ...
```

## Application Flow

```text
Home
  │
  ▼
Start CAPTCHA
  │
  ▼
Image Challenge
  │
  ▼
Math Challenge
  │
  ▼
Text Challenge
  │
  ▼
Result
  │
  ├──► Home
  │
  └──► Try Again
```

## State Management

The `CaptchaStateService` is responsible for managing the CAPTCHA state.

It handles:

* Current challenge
* Challenge data
* User responses
* Image selections
* CAPTCHA completion
* Timer
* State persistence
* Challenge validation
* Error popup handling

The state is persisted using browser `localStorage`.

## Performance Result

After completing the CAPTCHA, the application calculates the total completion time and displays a performance category.

| Completion Time | Result         |
| --------------- | -------------- |
| ≤ 10 seconds    | Lightning Fast |
| 11–25 seconds   | Normal         |
| > 25 seconds    | Very Slow      |

The result page also displays a corresponding star rating and message.

## Getting Started

The project includes a `Makefile` to simplify the setup and development workflow.

### 1. Setup

Clone the repository and enter the project directory:

```bash
git clone https://github.com/EmanZHD/angul-it.git
cd angul-it
```

Run:

```bash
make setup
```

This command installs the project dependencies and prepares the application.

### 2. Run the Application

Start the development server with:

```bash
make run
```

The application will be available at:

```text
http://localhost:4200
```

### 3. Run the Tests

Execute the unit test suite with:

```bash
make tests
```

The project uses **Vitest** for unit testing.

## Testing

The project includes unit tests for the main components and services.

Tests cover important behaviors such as:

* Component creation
* UI rendering
* User interactions
* CAPTCHA validation
* State management
* Navigation
* Timer-related behavior
* Error messages
* Result calculation
* Local storage behavior

Run all tests with:

```bash
make tests
```

## Build

To create a production build:

```bash
ng build
```

The compiled application will be generated in the `dist/` directory.

## Responsive Design

The application is designed to work across different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile

The layout adapts to smaller screens while keeping the CAPTCHA interaction accessible and usable.

## Security Note

This project is a **frontend CAPTCHA demonstration** intended for learning and educational purposes.

Because the CAPTCHA logic runs in the browser, it should not be considered a production-grade security mechanism. A real-world CAPTCHA system should perform validation on a trusted backend and use additional anti-automation protections.

## Learning Objectives

This project was developed to practice and demonstrate:

* Angular standalone components
* Angular routing
* Dependency injection
* Services
* State management
* Forms and validation
* Angular Material
* Local storage
* Timers
* Dynamic templates
* Component communication
* Unit testing with Vitest
* Responsive SCSS
* Makefile-based development workflow

## Author

**Imane Zahid**

Junior Full Stack Developer

GitHub: [@EmanZHD](https://github.com/EmanZHD)

---

© 2026 CAPTCHA-izahid — All rights reserved.
