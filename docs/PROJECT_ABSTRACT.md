# Project Abstract: Interest Calculator

## Overview
The **Interest Calculator** is a comprehensive financial management web application designed to help individuals and small businesses track and manage loans, investments, and interest accruals efficiently. Built with a modern full-stack architecture (React, Node.js, Express, and MongoDB), the platform offers a streamlined solution to the often complex task of manual interest calculation and payment tracking.

## Core Features
- **Dual Role Management**: Seamlessly switch between **Borrower** and **Investor** roles, each with a tailored dashboard and color-coded interface for visual clarity.
- **Interest Engine**: Support for both **Simple** and **Compound Interest** calculations, automatically updating total balances as time progresses.
- **Transaction History**: Real-time logging of payments and new transactions, with the ability to upload screenshots for proof of payment.
- **Financial Reporting**: Export detailed transaction histories and account summaries in **PDF** and **Excel** formats for bookkeeping.
- **Visual Analytics**: Interactive charts (using Recharts) to visualize financial trends and outstanding balances.
- **Secure Authentication**: Robust user management with JWT-based authentication to ensure data privacy and security.

## Problem Solved
Managing multiple borrowers or investors manually often leads to errors in interest calculation and missed payments. The Interest Calculator solves this by centralizing all financial relationships, automating the math, and providing a clean, responsive interface accessible from any device as a Progressive Web App (PWA).

## Technical Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion (Animations).
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose ODM).
- **Deployment**: Vercel (Frontend) & Render (Backend).
