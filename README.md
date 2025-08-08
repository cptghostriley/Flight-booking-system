# SkyBooker ✈️

> **Your Gateway to the Skies** - A modern, comprehensive flight booking platform built with Next.js 14

![SkyBooker Logo](./public/skyb.png)

## 🌟 Overview

SkyBooker is a full-featured flight booking application that provides a seamless, airline-quality experience for searching, booking, and managing flights. With a beautiful splash screen, professional UI/UX, and robust backend functionality, SkyBooker delivers everything you need for modern flight reservations.

## ✨ Key Features

### 🎯 Core Functionality
- **Smart Flight Search** - Search one-way or round-trip flights with real-time results
- **Seat Selection** - Choose your preferred seats with visual seat maps
- **User Authentication** - Secure login/signup with bcrypt password encryption
- **Booking Management** - Complete booking flow with passenger details
- **Payment Processing** - Integrated mock payment gateway simulation
- **Email Confirmations** - Professional booking confirmations with PDF tickets

### 🎨 User Experience
- **Animated Splash Screen** - Professional app-like startup experience
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Modern UI** - Built with shadcn/ui and Tailwind CSS
- **Progressive Web App** - PWA capabilities with service worker support
- **Custom Branding** - Complete logo integration across all touchpoints

### 🔧 Technical Excellence
- **Gmail Email Service** - Reliable email delivery with Gmail SMTP
- **PDF Generation** - Automatic ticket PDFs with booking confirmations
- **Database Integration** - Persistent storage with Neon PostgreSQL
- **Production Ready** - Optimized for deployment on Render and other platforms
- **Error Handling** - Comprehensive error logging and user feedback

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14.2.31 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Animations** | Framer Motion 12.23.12 |
| **Database** | Neon PostgreSQL |
| **Email** | Gmail SMTP |
| **PDF Generation** | jsPDF |
| **Authentication** | bcrypt |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Package Manager** | pnpm |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Neon database account
- Gmail account with App Password

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/cptghostriley/Sky-Booker.git
cd Sky-Booker
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment setup**
Create `.env.local` file:
```env
# Database
DATABASE_URL="your_neon_database_connection_string"

# Email Service
GMAIL_USER="your_gmail_address"
GMAIL_APP_PASSWORD="your_gmail_app_password"

# Optional: Custom settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Database setup**
```bash
# Run database setup script
pnpm tsx scripts/run-neon-setup.js
```

5. **Start development server**
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see SkyBooker in action!

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password in Google Account settings:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Add credentials to `.env.local`

The system uses Gmail SMTP for reliable email delivery with professional booking confirmations.

## 🎨 Features Deep Dive

### Splash Screen
- **Professional startup experience** with animated logo
- **Customizable branding** - easily replace with your logo
- **Smooth animations** using Framer Motion
- **Progressive loading** with elegant transitions

### Flight Booking Flow
1. **Search** - Intuitive airport search with autocomplete
2. **Results** - Clean flight listings with pricing
3. **Selection** - Visual seat maps and preferences
4. **Details** - Passenger information collection
5. **Payment** - Mock payment gateway simulation
6. **Confirmation** - Digital ticket with PDF attachment

### Seat Selection System
- **Visual seat maps** for better user experience
- **Real-time availability** updates
- **Preference tracking** throughout booking flow
- **Accurate ticket generation** with selected seats

## 🏗️ Project Structure

```
SkyBooker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── airports/      # Airport search
│   │   ├── auth/         # Authentication
│   │   ├── bookings/     # Booking management
│   │   ├── flights/      # Flight search
│   │   └── send-confirmation-email/  # Email service
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── emails/          # Email templates
│   ├── splash-screen.tsx # Animated splash screen
│   ├── airport-search.tsx
│   ├── flight-results.tsx
│   ├── booking-form.tsx
│   ├── payment-gateway.tsx
│   └── plane-ticket.tsx
├── lib/                 # Utilities
│   ├── db.ts           # Database connection
│   └── utils.ts        # Helper functions
├── scripts/            # Database setup scripts
├── public/             # Static assets
│   ├── skyb.png       # Custom logo
│   ├── manifest.json  # PWA manifest
│   └── sw.js          # Service worker
└── styles/            # Additional styles
```

## 📱 PWA Features

SkyBooker includes Progressive Web App capabilities:
- **App-like experience** on mobile devices
- **Offline support** with service worker
- **Custom app icons** and splash screens
- **Add to home screen** functionality

## 🚢 Deployment

### Render Deployment
The application is optimized for Render deployment:

1. **Connect your GitHub repository** to Render
2. **Set environment variables** in Render dashboard
3. **Deploy** - automatic builds from main branch

### Environment Variables for Production
```env
DATABASE_URL=your_production_neon_url
GMAIL_USER=your_gmail
GMAIL_APP_PASSWORD=your_app_password
NEXT_PUBLIC_APP_URL=https://your-app.render.com
```

## 🐛 Troubleshooting

### Common Issues

**Font Loading Errors**
- The app uses system fonts to avoid network dependencies
- No action required - these are cosmetic warnings only

**Email Delivery Issues**
- Verify Gmail app password is correct
- Ensure 2-factor authentication is enabled on Gmail
- Check that "Less secure app access" is disabled (use App Password instead)
- Review server logs for detailed error messages

**Database Connection**
- Ensure Neon database URL is correct
- Check database setup scripts have run successfully
- Verify network connectivity to Neon

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Database hosting by [Neon](https://neon.tech/)
- Email service by [Gmail SMTP](https://support.google.com/mail/answer/7126229)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">
  <p><strong>SkyBooker - Your Gateway to the Skies</strong></p>
  <p>Made with ❤️ for travelers worldwide</p>
</div>
