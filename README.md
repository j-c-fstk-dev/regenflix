# 🎬 RegenFlix MVP: Regenerative Content Hub

[![Project Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)](https://github.com/j-c-fstk-dev/regenflix/actions)
[![Frontend Technologies](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Vite-blueviolet)](https://react.dev/)
[![Backend Technologies](https://img.shields.io/badge/Backend-Firebase%20%28Auth%2C%20Firestore%2C%20Storage%2C%20Functions%29-orange)](https://firebase.google.com/)
[![Versioning Tools](https://img.shields.io/badge/Versionamento-Git%20%7C%20GitHub-lightgrey)](https://github.com/j-c-fstk-dev/regenflix)
[![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-green)](https://github.com/j-c-fstk-dev/regenflix/blob/main/LICENSE)

---

## 🌟 Project Overview

RegenFlix is an ambitious Minimum Viable Product (MVP) project that aims to create a paid content hub focused on global regeneration. With a design that conveys well-being, tranquility, and modernity, the platform was conceived to offer an intuitive and aesthetically pleasing user experience (UX), a robust administrative panel, process automation, and initial cost optimization.

This document details the current progress of the project and the roadmap for the next steps, following best market practices to ensure scalability and sustainability.

---

## 🎨 Design Philosophy and Visual Identity

RegenFlix's design is inspired by nature, open spaces, and natural light, promoting a sense of calm, clarity, and inspiration. The color palette adopts soft, earthy tones, complemented by neutrals and vibrant accents. The typography prioritizes readability and impact.

*   **Primary Colors (Natural and Calming):** `#4A7C59` (Forest Green), `#7FB069` (Moss Green), `#D6E3DD` (Water Green).
* **Neutral Colors (Base and Text):** `#F5F5DC` (Cream Beige), `#FFFFFF` (White), `#2C3E50` (Dark Navy Blue), `#ECF0F1` (Light Gray), `#7F8C8D` (Medium Gray).
* **Accent Colors (Vibrant and Punctual):** `#FFD700` (Soft Gold), `#FF6B6B` (Soft Coral), `#5BC0EB` (Light Sky Blue).
* **Light & Dark Mode:** Implemented with global toggle.
* **Typography:** Clean and modern sans serif fonts (e.g., Montserrat, Lato, Open Sans, Roboto).
* **Elements:** Rounded corners, subtle shadows, and minimalist icons.

---

## 🚀 Technological Infrastructure

The infrastructure reuses an efficient stack, prioritizing low/zero initial cost solutions with easy scalability.

* **Front-end:** React (SPA - Single Page Application) with TypeScript and Vite.
* **Front-end Hosting:** Planned for Netlify (continuous deployment, CDN, free SSL).
*   **Backend:** Google Firebase Ecosystem (Authentication, Cloud Firestore, Firebase Storage, Cloud Functions, Firebase Hosting for functions).
*   **External APIs:** Stripe (payments), Resend (transactional emails), YouTube Data API (video integration).

---

## ✅ Current Progress (What Has Been Done)

To date, the foundations of RegenFlix are solid and functional.

### **Phase 1: Setup and Authentication**
*   **Firebase Configuration:** Project created, “Email/Password” and “Google” providers enabled, development environment domain authorized.
*   **User Structure:** `users` collection in Firestore defined (`UserProfile` in `src/types.ts`).
*   **Frontend Authentication:** Login/Registration components (`AuthForm.tsx`) implemented with React, TypeScript, and Firebase Auth.
*   **Secure Routing:** Routes configured (`react-router-dom`) for secure access to post-login pages (`App.tsx`).
* **Firestore Security Rules (users):** Rules implemented to allow the creation of user documents, reading of one's own profile, and updating (including fields such as `preferredLanguage`, `lastLoginAt`).
* **Status:** **COMPLETE and FUNCTIONAL.** Registrations, logins (Email/Password, Google), and user profile creation/updates are operational.

### **Phase 2: Basic Content Management and Internationalization (i18n)**
* **Content Structure:** `Video`, `Pdf`, `LocalizedString` interfaces defined in `src/types.ts` for multilingual data.
* **Content Service:** `ContentList.tsx` function searches and displays combined videos and PDFs from Firestore, with internationalization.
* **Firestore Security Rules (content):** Rules configured to allow authenticated users to read `videos` and `pdfs`.
* **Language Selector (`LanguageSelector.tsx`):** Component implemented to change language, with persistence in `sessionStorage` and in the user profile in Firestore.
* **Status:** **COMPLETE and FUNCTIONAL.** Content (videos and PDFs) appears on the Home Page with correct text and language preference persists.

### **Initial Visual Structure of the Front-end**
* **Placeholder Pages:** Static components created for `MyLibraryPage`, `CoursesPage`, `RegenPediaPage`, `RegenMarketPage`, `CourseDetailsPage`, `ContentPlayerPage`.
*   **Navigation:** Routes and navigation links added in `App.tsx` and `HomePage.tsx` to access the new sections.
*   **Status:** **COMPLETE and FUNCTIONAL.** The visual skeleton of the website is assembled to facilitate development.

### **Phase 3 (Start): Course Builder - Creation/Reading Logic**
* **Course Data Structure:** `Course`, `Module`, `Lesson`, `CourseContentBlock` interfaces and related types defined in `src/types.ts` for modeling complex courses.
*   **Course Service (`courseService.ts`):**
*   `createCourse` function: Logic for adding new courses to Firestore.
*   `getCourses` function: Logic for retrieving a list of courses from Firestore.
* **Firestore Security Rules (courses):** Rules configured to allow `create`, `update`, `delete` in the `courses` collection **only for users with `isAdmin: true`**, and `read` for any authenticated user.
* **Course Display:** `CoursesPage.tsx` lists the courses retrieved from Firestore.
* **Status:** **WORKING.** Courses can be created by admins and are displayed on the Courses page.

### **Development and Quality Improvements**
* **API Key Security:** Firebase `apiKey` moved to environment variables (`.env.local`) for secret protection.
* **Git Configuration:** `.gitignore` file updated to ignore environment and cache files.
*   **Versioning:** Main branch renamed from `master` to `main` in local and remote repository.
*   **Status:** **COMPLETED.**

---

## 🗺️ Roadmap (Next Steps for MVP)

The project will follow the remaining phases of the detailed plan, building on the solid foundation we already have.

### **Phase 3 (Continued): Course Builder and Consumption**
* **Course Details Display:**
* `CourseDetailsPage.tsx`: Search and display all details for a specific course (including modules and lessons).
* Navigation to the Content Player from the `CourseDetailsPage`.
*   **Content Player:**
    *   `ContentPlayerPage.tsx`: Implement logic to display different types of `CourseContentBlock` (embedded videos, PDFs, rich text, images).
    *   Control user progress in lessons.
*   **Administrative Panel for Courses (Logic and UI):**
    * Complete user interface for creating/editing courses (modules, lessons, content blocks).
* Media upload functionality (covers, PDFs) to Firebase Storage.
* Rich text editor for `TextBlock`.
* Selectors for `VideoBlock` and `PdfBlock` that list existing content.

### **Phase 4: Payment Processing (Stripe)**
* **Stripe Configuration:** Creation of products and prices in the Stripe Dashboard.
* **Firebase Cloud Functions:** Development of serverless functions to interact with the Stripe API (create checkout sessions, manage subscriptions, webhooks).
*   **Frontend Integration:** Implement checkout flow for subscription plans and one-time purchases.

### **Phase 5: Store Integration (RegenMarket)**
*   **Data Structure:** Definition of the `products` collection in Firestore.
* **Admin Management:** Forms to add/edit products in the store.
* **Purchase Flow:** Implement shopping cart (`CartPage.tsx`) and checkout (`CheckoutPage.tsx`) for one-time purchases.
*   **Access Control:** After purchase, grant access to the purchased content in the user's profile.

### **Phase 6: User Management and Advanced Access Control**
* **Firestore Security Rules:** Refine rules to control access to paid content (videos, PDFs, courses) based on the user's `subscriptionStatus` or `purchasedContent`.
* **Administrative Panel (Users):** Interface to manage users (subscription status, admin roles).

### **Phase 7: Deployment and Testing**
*   **Continuous Deployment:** Final deployment configuration for Netlify (Front-end) and Firebase (Cloud Functions).
*   **Comprehensive Testing:** Unit, integration, and end-to-end testing to ensure the stability, performance, security, and accessibility of the MVP.

---

## 🤝 How to Contribute

Comming soon

---

## 📄 License

This project is licensed under the MIT license. See the `LICENSE` file for more details.

---
