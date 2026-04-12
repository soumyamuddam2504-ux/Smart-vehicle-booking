# Smart-vehicle-booking
SmartRide – RV Booking Platform
SmartRide is a full-stack web application that helps users plan and book RV trips by recommending the best-matched vehicles based on trip preferences, budget, and group size.

Live Application
Frontend: https://soumyamuddam2504-ux.github.io/Smart-vehicle-booking/
Backend API: https://smart-vehicle-booking.onrender.com

Tech Stack
Frontend - 	React 18, Vite, Tailwind CSS
Backend - Node.js, Express
Deployment
GitHub Pages (frontend), Render (backend)

Key Features
Authentication
Secure signup/login with bcrypt hashing
JWT-based session handling

Smart Vehicle Search
Budget slider ($500–$10,000)
Seat selection (1–8)
Trip type selection
Date picker with auto duration
Location autocomplete (cities + parks)
Advanced filters (make, model, year)
Smart ranking algorithm

Booking Flow
One-click booking
Pre-filled booking details
Confirmation screen with:
Trip summary
PDF download
Dashboard navigation

Email Notifications
Automatic confirmation emails
Fallback-safe (booking works even if email fails)

Dashboard
Booking history
Stats:
Total trips
Total spend
Days booked
Avg spend
Charts:
RV type distribution
Spend trends

SmartRide Assistant
Context-aware chat widget
Provides recommendations based on:
Budget
Trip type
Group size
Booking history


Fleet Data
Includes 8 pre-seeded vehicles across:
Camper Vans
Motorhomes
Off-Road RVs
Luxury RVs
Toy Haulers


Deployment
Frontend auto-deploys via GitHub Actions
Backend auto-deploys via Render
