import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db' // Import the database client
import { render } from '@react-email/render'
import { BookingConfirmationEmail } from '@/components/emails/booking-confirmation'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    const { flights, passengers, payment, totalAmount, userId } = bookingData // Expect userId from client

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required for booking' },
        { status: 400 }
      )
    }
    
    // Generate a booking reference
    const bookingReference = `SB${Date.now().toString().slice(-6)}`
    
    // In a real application, you would:
    // 1. Validate payment details (e.g., with a real payment gateway)
    // 2. Process payment (this is still mocked for now)
    // 3. Reserve seats (mocked)

    // Insert booking into the database
    const [newBooking] = await sql`
      INSERT INTO bookings (
        user_id,
        flight_id, -- Assuming outbound flight ID for simplicity, adjust if multiple flights per booking
        passenger_name,
        passenger_email,
        total_price,
        booking_status
      ) VALUES (
        ${userId},
        ${flights.outbound?.id || null}, -- Link to outbound flight ID
        ${passengers[0]?.firstName + ' ' + passengers[0]?.lastName || 'N/A'},
        ${passengers[0]?.email || 'N/A'},
        ${totalAmount},
        'confirmed'
      )
      RETURNING id, booking_status, created_at
    `
    
    // Prepare booking data for email
    const emailBookingData = {
      bookingReference,
      flights,
      passengers,
      totalAmount,
      status: 'confirmed',
      bookingDate: newBooking.created_at.toISOString() // Use actual booking creation time
    }

    // Send confirmation email
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not found, simulating email send...')
      const emailContent = generateEmailContent(emailBookingData)
      console.log('📧 Email would be sent to:', passengers[0]?.email)
      console.log('📧 Email content:', emailContent)
    } else {
      let emailHtml: string = '';
      const fallbackHtml = `
        <p>Dear ${passengers[0]?.firstName ?? 'Valued'} ${passengers[0]?.lastName ?? 'Customer'},</p>
        <p>Your flight booking has been confirmed! Your booking reference is <strong>${bookingReference}</strong>.</p>
        <p>Please check the plain text version of this email for full details, or log in to your SkyBooker account.</p>
        <p>Thank you for choosing SkyBooker!</p>
      `;

      try {
        const renderedResult = render(BookingConfirmationEmail({ bookingData: emailBookingData }));
        const renderedHtml = typeof renderedResult === 'string' ? renderedResult : String(renderedResult || '');
        if (renderedHtml && renderedHtml.trim().length > 0) {
          emailHtml = renderedHtml;
        } else {
          console.warn('React email render returned empty or invalid HTML. Using fallback.');
          emailHtml = fallbackHtml;
        }
      } catch (renderError) {
        console.error('Error rendering email HTML:', renderError);
        emailHtml = fallbackHtml;
      }

      const { data, error } = await resend.emails.send({
        from: 'SkyBooker <onboarding@resend.dev>', // Use onboarding@resend.dev for testing if your domain is not verified
        to: [passengers[0]?.email || ''], // Ensure email is not empty
        subject: `Flight Booking Confirmed - ${bookingReference}`,
        html: emailHtml,
        text: generateEmailContent(emailBookingData)
      })

      if (error) {
        console.error('Resend error:', error)
        // Do not return error here, booking is still confirmed. Log it.
      } else {
        console.log('✅ Email sent successfully:', data)
      }
    }
    
    return NextResponse.json({
      success: true,
      bookingReference,
      booking: {
        ...newBooking,
        flights: bookingData.flights,
        passengers: bookingData.passengers,
        totalAmount: bookingData.totalAmount
      }
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// Helper function for plain text email content (already exists, but included for context)
function generateEmailContent(bookingData: any): string {
  const { bookingReference, flights, passengers, totalAmount } = bookingData

  return `
Dear ${passengers[0]?.firstName ?? 'Valued'} ${passengers[0]?.lastName ?? 'Customer'},

🎉 Your flight booking has been confirmed!

BOOKING DETAILS
===============
Booking Reference: ${bookingReference ?? 'N/A'}
Total Amount: $${totalAmount ?? '0.00'}
Booking Date: ${new Date(bookingData.bookingDate).toLocaleDateString()}

FLIGHT INFORMATION
==================
${flights?.outbound ? `
✈️ OUTBOUND FLIGHT
Flight: ${flights.outbound.airline ?? 'N/A'} ${flights.outbound.flightNumber ?? 'N/A'}
From: ${flights.outbound.departure?.airport ?? 'N/A'} at ${flights.outbound.departure?.time ?? 'N/A'}
To: ${flights.outbound.arrival?.airport ?? 'N/A'} at ${flights.outbound.arrival?.time ?? 'N/A'}
Date: ${flights.outbound.departure?.date ?? 'N/A'}
Duration: ${flights.outbound.duration ?? 'N/A'}
Aircraft: ${flights.outbound.aircraft ?? 'N/A'}
${flights.outbound.stops === 0 ? 'Direct Flight' : `${flights.outbound.stops ?? 0} Stop(s)`}
` : ''}

${flights?.return ? `
✈️ RETURN FLIGHT
Flight: ${flights.return.airline ?? 'N/A'} ${flights.return.flightNumber ?? 'N/A'}
From: ${flights.return.departure?.airport ?? 'N/A'} at ${flights.return.departure?.time ?? 'N/A'}
To: ${flights.return.arrival?.airport ?? 'N/A'} at ${flights.return.arrival?.time ?? 'N/A'}
Date: ${flights.return.departure?.date ?? 'N/A'}
Duration: ${flights.return.duration ?? 'N/A'}
Aircraft: ${flights.return.aircraft ?? 'N/A'}
${flights.return.stops === 0 ? 'Direct Flight' : `${flights.return.stops ?? 0} Stop(s)`}
` : ''}

PASSENGER INFORMATION
====================
${passengers.map((passenger: any, index: number) => `
${index + 1}. ${passenger.firstName ?? 'N/A'} ${passenger.lastName ?? 'N/A'}
   Email: ${passenger.email ?? 'N/A'}
   Phone: ${passenger.phone ?? 'N/A'}
   Date of Birth: ${passenger.dateOfBirth ?? 'N/A'}
`).join('')}

IMPORTANT REMINDERS
==================
• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights
• Bring a valid government-issued photo ID for domestic flights or passport for international flights
• Check-in online 24 hours before your flight to save time at the airport
• Keep this booking reference handy: ${bookingReference ?? 'N/A'}

Need help? Contact our support team at support@skybooker.com

Thank you for choosing SkyBooker!

Best regards,
The SkyBooker Team

---
This is an automated message. Please do not reply to this email.
  `.trim()
}
