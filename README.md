<md>
  
 ## **SkyBooker: Flight Booking System ✈️**
 

A modern and comprehensive flight booking application built with Next.js, designed to provide a seamless experience for searching, booking, and managing flights. This project includes user authentication, flight search capabilities, a booking flow with a mock payment gateway, and email confirmations.

## Features

- **Flight Search**: Search for one-way or round-trip flights between various airports.
- **User Authentication**: Secure login and signup functionality with password hashing (bcrypt).
- **Booking Management**: Select flights, provide passenger details, and complete bookings.
- **Mock Payment Gateway**: Simulate payment processing for flight bookings.
- **Email Confirmations**: Send booking confirmation emails using Resend.
- **Database Integration**: Persistent storage for users, airports, airlines, flights, and bookings using Neon (PostgreSQL).
- **Responsive Design**: User interface adapts to various screen sizes.


## Technologies Used

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Neon (PostgreSQL)
- **Authentication**: bcrypt (for password hashing)
- **Email Service**: Resend
- **Icons**: Lucide React
- **Date Handling**: `date-fns`
- **Database Client**: `@neondatabase/serverless`


## Setup Instructions

Follow these steps to get the project up and running locally.

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
cd YOUR_REPOSITORY_NAME
```

### 2. Install Dependencies

Install the necessary Node.js packages:

```bash
npm install

# or yarn install

# or pnpm install

```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```env
DATABASE_URL="YOUR_NEON_DATABASE_CONNECTION_STRING"
RESEND_API_KEY="YOUR_RESEND_API_KEY"
```

- **`DATABASE_URL`**: Obtain this from your [Neon.tech](https://neon.tech/) project dashboard.
- **`RESEND_API_KEY`**: Obtain this from your [Resend](https://resend.com/) dashboard. Remember to verify your domain with Resend for production emails. For testing, you can use `re_123456789` or `onboarding@resend.dev` as the `from` address.


### 4. Set Up Your Neon Database

You need to create the necessary tables and seed initial data in your Neon database.

1. **Ensure `DATABASE_URL` is correctly set** in your `.env.local` file.
2. **Run the setup script**: This project includes a script to create tables and seed data.

```bash

# If you have tsx installed (recommended for running TS files directly)

npm install -D tsx # if not already installed
tsx scripts/run-neon-setup.js

# Alternatively, if your package.json has "type": "module" and you prefer plain node

node scripts/run-neon-setup.js
```

This script will execute `scripts/create-database.sql`, `scripts/seed-airports.sql`, and `scripts/seed-airlines.sql` against your Neon database.




### 5. Run the Development Server

Once the database is set up, start the Next.js development server:

```bash
npm run dev

# or yarn dev

# or pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Homepage**: The landing page allows you to search for flights.
2. **Login/Sign Up**: Click "Login / Sign Up" in the top right corner to create a new account or sign in. Unauthenticated users will be prompted to log in when selecting a flight.
3. **Flight Search**: Enter departure/destination airports, dates, and passenger count to find flights.
4. **Booking Flow**: Select outbound and (optionally) return flights, fill in passenger details, and proceed to the mock payment gateway.
5. **Confirmation**: After successful payment, you'll see a plane ticket UI and receive a confirmation email.


## Important Notes

- **Database for Production**: While Neon is used here, for very high-scale production applications, consider advanced database management strategies.
- **Email Domain Verification**: For Resend to send emails from your custom domain, you must verify it in your Resend dashboard. The current setup uses `onboarding@resend.dev` as a fallback `from` address for testing.
- **Current Debugging State**: We are currently debugging an "Internal server error" that occurs during login and signup. If you encounter this, please check your server logs for more detailed error messages, especially those from `console.error` in the API routes (`app/api/auth/login/route.ts` and `app/api/auth/signup/route.ts`). This usually indicates an issue with the database connection or initial query execution.


## Contributing

Feel free to fork the repository, open issues, or submit pull requests.

## License

[MIT License](LICENSE) (You might want to create a LICENSE file if you don't have one)

</md>
