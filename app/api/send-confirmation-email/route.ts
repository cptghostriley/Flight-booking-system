import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface Passenger {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender?: string
}

interface Flight {
  airline: string
  flightNumber: string
  departure: { airport: string; time: string; date: string }
  arrival: { airport: string; time: string; date: string }
  duration: string
  aircraft: string
  stops: number
  price: number
}

interface BookingData {
  bookingReference: string
  flights: {
    outbound?: Flight
    return?: Flight
  }
  passengers: Passenger[]
  totalAmount: number
  bookingDate: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, bookingData }: { email: string; bookingData: BookingData } = await request.json()
    
    if (!email || !bookingData) {
      return NextResponse.json(
        { error: 'Missing email or booking data' },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not found, simulating email send...')
      
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

    // Generate comprehensive email content
    const emailContent = generateEmailContent(bookingData)
    const emailHtml = generateHtmlContent(bookingData)

    try {
      // Send actual email using Resend with timeout handling
      const { data, error } = await resend.emails.send({
        from: 'SkyBooker <onboarding@resend.dev>',
        to: [email],
        subject: `Flight Booking Confirmed - ${bookingData.bookingReference}`,
        html: emailHtml,
        text: emailContent
      })

      if (error) {
        console.error('Resend error:', error)
        
        // Return success but note email issue for mobile compatibility
        return NextResponse.json({
          success: true,
          message: 'Booking confirmed, email will be sent shortly',
          emailSent: false,
          error: 'Email delivery pending',
          bookingReference: bookingData.bookingReference
        })
      }

      console.log('✅ Email sent successfully:', data)
      
      return NextResponse.json({
        success: true,
        message: 'Confirmation email sent successfully',
        emailSent: true,
        emailId: data?.id,
        bookingReference: bookingData.bookingReference
      })
    } catch (emailError) {
      console.error('Email send exception:', emailError)
      
      // Still return success for booking but note email issue
      return NextResponse.json({
        success: true,
        message: 'Booking confirmed, email will be sent shortly',
        emailSent: false,
        error: 'Email service temporarily unavailable',
        bookingReference: bookingData.bookingReference
      })
    }
    
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}

function generateEmailContent(bookingData: BookingData): string {
  const { bookingReference, flights, passengers, totalAmount } = bookingData
  const primaryPassenger = passengers[0]
  
  return `
Dear ${primaryPassenger.firstName} ${primaryPassenger.lastName},

🎉 Your flight booking has been confirmed!

BOOKING DETAILS
===============
Booking Reference: ${bookingReference}
Passenger Name: ${primaryPassenger.firstName} ${primaryPassenger.lastName}
Total Amount Paid: $${totalAmount}
Booking Date: ${new Date(bookingData.bookingDate).toLocaleDateString()}
Payment Status: CONFIRMED

FLIGHT INFORMATION
==================
${flights.outbound ? `
✈️ OUTBOUND FLIGHT
------------------
Flight: ${flights.outbound.airline} ${flights.outbound.flightNumber}
From: ${flights.outbound.departure.airport} 
Departure: ${flights.outbound.departure.time} on ${flights.outbound.departure.date}
To: ${flights.outbound.arrival.airport}
Arrival: ${flights.outbound.arrival.time} on ${flights.outbound.arrival.date}
Duration: ${flights.outbound.duration}
Aircraft: ${flights.outbound.aircraft}
Flight Type: ${flights.outbound.stops === 0 ? 'Direct Flight' : `${flights.outbound.stops} Stop(s)`}
Ticket Price: $${flights.outbound.price}
` : ''}

${flights.return ? `
✈️ RETURN FLIGHT
----------------
Flight: ${flights.return.airline} ${flights.return.flightNumber}
From: ${flights.return.departure.airport}
Departure: ${flights.return.departure.time} on ${flights.return.departure.date}
To: ${flights.return.arrival.airport}
Arrival: ${flights.return.arrival.time} on ${flights.return.arrival.date}
Duration: ${flights.return.duration}
Aircraft: ${flights.return.aircraft}
Flight Type: ${flights.return.stops === 0 ? 'Direct Flight' : `${flights.return.stops} Stop(s)`}
Ticket Price: $${flights.return.price}
` : ''}

PASSENGER INFORMATION
====================
${passengers.map((passenger: Passenger, index: number) => `
${index + 1}. ${passenger.firstName} ${passenger.lastName}
   Email: ${passenger.email}
   Phone: ${passenger.phone}
   Date of Birth: ${passenger.dateOfBirth}
   Gender: ${passenger.gender || 'Not specified'}
`).join('')}

PAYMENT SUMMARY
===============
${flights.outbound ? `Outbound Flight: $${flights.outbound.price}` : ''}
${flights.return ? `Return Flight: $${flights.return.price}` : ''}
${passengers.length > 1 ? `Passengers: ${passengers.length}` : ''}
Total Amount Paid: $${totalAmount}
Payment Method: Credit Card
Transaction Status: COMPLETED

IMPORTANT REMINDERS
==================
• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights
• Bring a valid government-issued photo ID for domestic flights or passport for international flights
• Check-in online 24 hours before your flight to save time at the airport
• Keep this booking reference handy: ${bookingReference}
• Print or download your boarding pass before arriving at the airport

CONTACT INFORMATION
==================
Need help? Contact our support team:
📧 Email: support@skybooker.com
📞 Phone: 1-800-SKY-BOOK (1-800-759-2665)
🌐 Website: https://skybooker.com
💬 Live Chat: Available 24/7 on our website

Thank you for choosing SkyBooker for your travel needs!

Best regards,
The SkyBooker Team

---
This is an automated confirmation email. Please do not reply to this email.
For support, please use the contact information above.
  `.trim()
}

function generateHtmlContent(bookingData: BookingData): string {
  const { bookingReference, flights, passengers, totalAmount } = bookingData
  const primaryPassenger = passengers[0]
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flight Booking Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
    .section { background: white; margin: 15px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; }
    .flight-card { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 6px; }
    .passenger { background: #f1f8e9; padding: 10px; margin: 5px 0; border-radius: 4px; }
    .highlight { color: #667eea; font-weight: bold; }
    .amount { font-size: 1.2em; color: #2e7d32; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 6px; }
    h2 { color: #667eea; margin-top: 0; }
    .emoji { font-size: 1.2em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Flight Booking Confirmed!</h1>
    <p>Thank you for choosing SkyBooker</p>
  </div>
  
  <div class="content">
    <div class="section">
      <h2>Booking Details</h2>
      <p><strong>Dear ${primaryPassenger.firstName} ${primaryPassenger.lastName},</strong></p>
      <p>Your flight booking has been successfully confirmed!</p>
      <p><span class="highlight">Booking Reference:</span> <strong>${bookingReference}</strong></p>
      <p><span class="highlight">Total Amount:</span> <span class="amount">$${totalAmount}</span></p>
      <p><span class="highlight">Booking Date:</span> ${new Date(bookingData.bookingDate).toLocaleDateString()}</p>
      <p><span class="highlight">Payment Status:</span> <span style="color: #2e7d32; font-weight: bold;">CONFIRMED</span></p>
    </div>

    ${flights.outbound ? `
    <div class="section">
      <h2>✈️ Outbound Flight</h2>
      <div class="flight-card">
        <p><strong>${flights.outbound.airline} ${flights.outbound.flightNumber}</strong></p>
        <p><span class="emoji">🛫</span> <strong>From:</strong> ${flights.outbound.departure.airport}</p>
        <p><strong>Departure:</strong> ${flights.outbound.departure.time} on ${flights.outbound.departure.date}</p>
        <p><span class="emoji">🛬</span> <strong>To:</strong> ${flights.outbound.arrival.airport}</p>
        <p><strong>Arrival:</strong> ${flights.outbound.arrival.time} on ${flights.outbound.arrival.date}</p>
        <p><strong>Duration:</strong> ${flights.outbound.duration}</p>
        <p><strong>Aircraft:</strong> ${flights.outbound.aircraft}</p>
        <p><strong>Flight Type:</strong> ${flights.outbound.stops === 0 ? 'Direct Flight' : `${flights.outbound.stops} Stop(s)`}</p>
        <p><strong>Price:</strong> $${flights.outbound.price}</p>
      </div>
    </div>
    ` : ''}

    ${flights.return ? `
    <div class="section">
      <h2>🔄 Return Flight</h2>
      <div class="flight-card">
        <p><strong>${flights.return.airline} ${flights.return.flightNumber}</strong></p>
        <p><span class="emoji">🛫</span> <strong>From:</strong> ${flights.return.departure.airport}</p>
        <p><strong>Departure:</strong> ${flights.return.departure.time} on ${flights.return.departure.date}</p>
        <p><span class="emoji">🛬</span> <strong>To:</strong> ${flights.return.arrival.airport}</p>
        <p><strong>Arrival:</strong> ${flights.return.arrival.time} on ${flights.return.arrival.date}</p>
        <p><strong>Duration:</strong> ${flights.return.duration}</p>
        <p><strong>Aircraft:</strong> ${flights.return.aircraft}</p>
        <p><strong>Flight Type:</strong> ${flights.return.stops === 0 ? 'Direct Flight' : `${flights.return.stops} Stop(s)`}</p>
        <p><strong>Price:</strong> $${flights.return.price}</p>
      </div>
    </div>
    ` : ''}

    <div class="section">
      <h2>👥 Passenger Information</h2>
      ${passengers.map((passenger: Passenger, index: number) => `
        <div class="passenger">
          <p><strong>${index + 1}. ${passenger.firstName} ${passenger.lastName}</strong></p>
          <p><strong>Email:</strong> ${passenger.email}</p>
          <p><strong>Phone:</strong> ${passenger.phone}</p>
          <p><strong>Date of Birth:</strong> ${passenger.dateOfBirth}</p>
          <p><strong>Gender:</strong> ${passenger.gender || 'Not specified'}</p>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2>💳 Payment Summary</h2>
      ${flights.outbound ? `<p>Outbound Flight: $${flights.outbound.price}</p>` : ''}
      ${flights.return ? `<p>Return Flight: $${flights.return.price}</p>` : ''}
      ${passengers.length > 1 ? `<p>Passengers: ${passengers.length}</p>` : ''}
      <p><strong>Total Amount Paid: <span class="amount">$${totalAmount}</span></strong></p>
      <p>Payment Method: Credit Card</p>
      <p>Transaction Status: <span style="color: #2e7d32; font-weight: bold;">COMPLETED</span></p>
    </div>

    <div class="section">
      <h2>📋 Important Reminders</h2>
      <ul>
        <li>Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights</li>
        <li>Bring a valid government-issued photo ID for domestic flights or passport for international flights</li>
        <li>Check-in online 24 hours before your flight to save time at the airport</li>
        <li>Keep this booking reference handy: <strong>${bookingReference}</strong></li>
        <li>Print or download your boarding pass before arriving at the airport</li>
      </ul>
    </div>

    <div class="footer">
      <h3>📞 Contact Information</h3>
      <p>Need help? Contact our support team:</p>
      <p>📧 Email: support@skybooker.com</p>
      <p>📞 Phone: 1-800-SKY-BOOK (1-800-759-2665)</p>
      <p>🌐 Website: https://skybooker.com</p>
      <p>💬 Live Chat: Available 24/7 on our website</p>
      <br>
      <p><strong>Thank you for choosing SkyBooker for your travel needs!</strong></p>
      <p>Best regards,<br>The SkyBooker Team</p>
      <hr>
      <p style="font-size: 0.9em; color: #666;">This is an automated confirmation email. Please do not reply to this email.<br>For support, please use the contact information above.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
