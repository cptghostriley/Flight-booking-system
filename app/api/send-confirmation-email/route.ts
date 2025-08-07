import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { BookingConfirmationEmail } from '@/components/emails/booking-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, bookingData } = await request.json()
    
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not found, simulating email send...')
      
      // Fallback to console logging if no API key
      const emailContent = generateEmailContent(bookingData)
      console.log('📧 Email would be sent to:', email)
      console.log('📧 Email content:', emailContent)
      
      return NextResponse.json({
        success: true,
        message: 'Email simulated (no API key configured)',
        emailSent: false,
        simulatedContent: emailContent
      })
    }

    let emailHtml: string = '';
    const fallbackHtml = `
      <p>Dear ${bookingData.passengers[0].firstName} ${bookingData.passengers[0].lastName},</p>
      <p>Your flight booking has been confirmed! Your booking reference is <strong>${bookingData.bookingReference}</strong>.</p>
      <p>Please check the plain text version of this email for full details, or log in to your SkyBooker account.</p>
      <p>Thank you for choosing SkyBooker!</p>
    `;

    try {
      // Attempt to render the React component to an HTML string
      const renderedHtml = render(BookingConfirmationEmail({ bookingData }));
      // Ensure the rendered output is a non-empty string
      if (typeof renderedHtml === 'string' && renderedHtml.trim().length > 0) {
        emailHtml = renderedHtml;
      } else {
        console.warn('React email render returned empty or invalid HTML. Using fallback.');
        emailHtml = fallbackHtml;
      }
    } catch (renderError) {
      console.error('Error rendering email HTML:', renderError);
      // Fallback to a simple HTML string if rendering fails
      emailHtml = fallbackHtml;
    }

    // Send actual email using Resend
    const { data, error } = await resend.emails.send({
      from: 'SkyBooker <onboarding@resend.dev>', // Updated from field
      to: [email],
      subject: `Flight Booking Confirmed - ${bookingData.bookingReference}`,
      html: emailHtml, // Pass the HTML string here
      text: generateEmailContent(bookingData)
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      )
    }

    console.log('✅ Email sent successfully:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
      emailSent: true,
      emailId: data?.id
    })
    
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}

function generateEmailContent(bookingData: any): string {
  const { bookingReference, flights, passengers, totalAmount } = bookingData
  
  return `
Dear ${passengers[0].firstName} ${passengers[0].lastName},

🎉 Your flight booking has been confirmed!

BOOKING DETAILS
===============
Booking Reference: ${bookingReference}
Total Amount: $${totalAmount}
Booking Date: ${new Date(bookingData.bookingDate).toLocaleDateString()}

FLIGHT INFORMATION
==================
${flights.outbound ? `
✈️ OUTBOUND FLIGHT
Flight: ${flights.outbound.airline} ${flights.outbound.flightNumber}
From: ${flights.outbound.departure.airport} at ${flights.outbound.departure.time}
To: ${flights.outbound.arrival.airport} at ${flights.outbound.arrival.time}
Date: ${flights.outbound.departure.date}
Duration: ${flights.outbound.duration}
Aircraft: ${flights.outbound.aircraft}
${flights.outbound.stops === 0 ? 'Direct Flight' : `${flights.outbound.stops} Stop(s)`}
` : ''}

${flights.return ? `
✈️ RETURN FLIGHT
Flight: ${flights.return.airline} ${flights.return.flightNumber}
From: ${flights.return.departure.airport} at ${flights.return.departure.time}
To: ${flights.return.arrival.airport} at ${flights.return.arrival.time}
Date: ${flights.return.departure.date}
Duration: ${flights.return.duration}
Aircraft: ${flights.return.aircraft}
${flights.return.stops === 0 ? 'Direct Flight' : `${flights.return.stops} Stop(s)`}
` : ''}

PASSENGER INFORMATION
====================
${passengers.map((passenger: any, index: number) => `
${index + 1}. ${passenger.firstName} ${passenger.lastName}
   Email: ${passenger.email}
   Phone: ${passenger.phone}
   Date of Birth: ${passenger.dateOfBirth}
`).join('')}

IMPORTANT REMINDERS
==================
• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights
• Bring a valid government-issued photo ID for domestic flights or passport for international flights
• Check-in online 24 hours before your flight to save time at the airport
• Keep this booking reference handy: ${bookingReference}

Need help? Contact our support team at support@skybooker.com

Thank you for choosing SkyBooker!

Best regards,
The SkyBooker Team

---
This is an automated message. Please do not reply to this email.
  `.trim()
}
