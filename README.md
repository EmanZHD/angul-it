# CAPTCHA-izahid

A modern, interactive CAPTCHA application built with Angular.

The application guides users through a sequence of verification challenges while tracking their progress and completion time.

## Contents

* [Overview](#overview)
* [Features](#features)

  * [CAPTCHA Challenges](#captcha-challenges)
  * [Timer & Performance](#timer--performance)
  * [State Persistence](#state-persistence)
  * [Navigation](#navigation)
  * [User Interface](#user-interface)
* [Technologies](#technologies)
* [Project Structure](#-project-structure)
* [Application Flow](#application-flow)
* [State Management](#state-management)
* [Performance Result](#performance-result)
* [Getting Started](#getting-started)
* [Testing](#testing)
* [Build](#build)
* [Responsive Design](#responsive-design)
* [Author](#author)

## Overview

CAPTCHA-izahid is a frontend CAPTCHA project developed with Angular to practice:

* Angular standalone components
* Component-based architecture
* Services and state management
* Routing and navigation
* Form handling and validation
* Local storage persistence
* Dynamic UI updates
* Angular Material
* Responsive design
* Unit testing with Vitest

## Features

### CAPTCHA Challenges

The application includes three verification stages:

* 🖼️ **Image CAPTCHA** — select the correct images according to the requested category.
* ➕ **Math CAPTCHA** — solve a dynamically generated mathematical operation.
* 🔤 **Text CAPTCHA** — enter the generated 8-character mixed-case verification text.

### Timer & Performance

A timer starts when the CAPTCHA begins and tracks the total completion time.

After completing all challenges, the result page displays the user's completion time and performance category.

### State Persistence

The CAPTCHA state is persisted in the browser using `localStorage`.

The application can preserve:

* Current challenge
* Challenge data
* Selected images
* User responses
* Completion state
* Timer state

### Navigation

Users can:

* Start a CAPTCHA
* Complete each challenge in sequence
* Return to the home page
* Retry the CAPTCHA
* View the final result

### User Interface

The interface uses:

* Angular Material
* SCSS
* Material Icons
* Responsive layouts
* Custom animations and visual elements

## Technologies

| Technology       | Usage                          |
| ---------------- | ------------------------------ |
| Angular          | Frontend framework             |
| TypeScript       | Application logic              |
| Angular Material | UI components                  |
| SCSS             | Styling                        |
| HTML             | Application structure          |
| Vitest           | Unit testing                   |
| LocalStorage     | Client-side state persistence  |
| Make             | Setup and development commands |

## 📁 Project Structure

```text
angul-it/
├── src/
│   ├── app/
│   │   ├── captcha/              # CAPTCHA challenge
│   │   ├── core/
│   │   │   ├── service/          # Application services
│   │   │   └── guards/           # Route protection
│   │   ├── models/               # Application interfaces
│   │   ├── popup/                # CAPTCHA dialogs
│   │   ├── home/                 # Home page
│   │   ├── result/               # Result page
│   │   └── app.routes.ts         # Application routing
│   ├── main.ts
│   └── styles.scss
│
├── public/
│   ├── images/
│   │   └── captcha/              # CAPTCHA images
│   ├── captchaLogo.png
│   └── sadBot.gif
│
├── Makefile
├── angular.json
├── package.json
└── README.md
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

The `CaptchaStateService` manages the application's CAPTCHA state.

It works together with dedicated services for:

* CAPTCHA generation
* State management
* Local storage
* Cryptographic operations
* Timer management
* Route protection

The state is persisted using browser `localStorage`.

## Performance Result

The result page calculates the total CAPTCHA completion time and displays a performance category.

| Completion Time | Result         |
| --------------- | -------------- |
| ≤ 15 seconds    | Lightning Fast |
| 16–30 seconds   | Fast           |
| > 30 seconds    | Slow           |

The result page also displays a corresponding rating and message.

## Getting Started

The project includes a `Makefile` to simplify the development workflow.

### 1. Clone the repository

```bash
git clone https://github.com/EmanZHD/angul-it.git
cd angul-it
```

### 2. Setup

```bash
make setup
```

This installs the required dependencies.

### 3. Run

```bash
make run
```

The application will be available at:

```text
http://localhost:4200
```

### 4. Run Tests

```bash
make tests
```

The project uses **Vitest** for unit testing.

## Testing

Unit tests cover the main components and services, including:

* Component creation
* UI rendering
* User interactions
* CAPTCHA validation
* State management
* Navigation
* Timer behavior
* Error handling
* Result calculation
* Local storage behavior

Run the complete test suite with:

```bash
make tests
```

## Build

Create a production build with:

```bash
ng build
```

The compiled application is generated in the `dist/` directory.

## Responsive Design

The application is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

The interface adapts to different screen sizes while keeping the CAPTCHA interaction accessible and usable.

## Developer

**IZAHID**

GitHub: [@EmanZHD](https://github.com/EmanZHD)

---

© 2026 CAPTCHA-izahid
