import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import jsPDF from 'jspdf'

// Gmail configuration for email sending
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  })
}

interface Flight {
  airline: string
  flightNumber: string
  departure: { airport: string; time: string; date: string }
  arrival: { airport: string; time: string; date: string }
  duration: string
  stops: number
  aircraft: string
}

interface BookingData {
  bookingReference: string
  flights: {
    outbound?: Flight
    return?: Flight
  }
  passengers: Array<{
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
  }>
  totalAmount: number
  status: string
  bookingDate: string
}

interface TextOptions {
  fontSize?: number
  fontWeight?: string
  align?: string
}

// Generate PDF ticket
const generateTicketPDF = (bookingData: BookingData) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  
  // Helper function to add text with proper positioning
  const addText = (text: string, x: number, y: number, options: TextOptions = {}) => {
    pdf.setFontSize(options.fontSize || 12)
    pdf.setFont('helvetica', options.fontWeight || 'normal')
    if (options.align === 'center') {
      const textWidth = pdf.getStringUnitWidth(text) * (options.fontSize || 12) / pdf.internal.scaleFactor
      x = (pageWidth - textWidth) / 2
    }
    pdf.text(text, x, y)
  }

  let yPosition = 20

  // Header
  pdf.setFillColor(37, 99, 235) // Blue background
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setTextColor(255, 255, 255) // White text
  addText('SkyBooker', 20, 15, { fontSize: 20, fontWeight: 'bold' })
  addText('Electronic Ticket', 20, 25, { fontSize: 12 })
  addText(`Booking Reference: ${bookingData.bookingReference}`, 20, 35, { fontSize: 14, fontWeight: 'bold' })

  pdf.setTextColor(0, 0, 0) // Reset to black
  yPosition = 50

  // Passenger Information
  addText('PASSENGER INFORMATION', 20, yPosition, { fontSize: 14, fontWeight: 'bold' })
  yPosition += 10
  
  bookingData.passengers.forEach((passenger, index: number) => {
    addText(`Passenger ${index + 1}: ${passenger.firstName} ${passenger.lastName}`, 20, yPosition)
    yPosition += 7
    addText(`Email: ${passenger.email}`, 20, yPosition)
    yPosition += 7
    addText(`Phone: ${passenger.phone}`, 20, yPosition)
    yPosition += 10
  })

  // Flight Information
  const flights = bookingData.flights
  
  if (flights.outbound) {
    yPosition += 5
    addText('OUTBOUND FLIGHT', 20, yPosition, { fontSize: 14, fontWeight: 'bold' })
    yPosition += 10
    
    const flight = flights.outbound
    addText(`${flight.airline} - Flight ${flight.flightNumber}`, 20, yPosition, { fontSize: 12, fontWeight: 'bold' })
    yPosition += 8
    
    // Departure and Arrival in columns
    addText('DEPARTURE', 20, yPosition, { fontSize: 10, fontWeight: 'bold' })
    addText('ARRIVAL', 120, yPosition, { fontSize: 10, fontWeight: 'bold' })
    yPosition += 7
    
    addText(`${flight.departure.time}`, 20, yPosition, { fontSize: 16, fontWeight: 'bold' })
    addText(`${flight.arrival.time}`, 120, yPosition, { fontSize: 16, fontWeight: 'bold' })
    yPosition += 8
    
    addText(`${flight.departure.airport}`, 20, yPosition)
    addText(`${flight.arrival.airport}`, 120, yPosition)
    yPosition += 7
    
    addText(`${flight.departure.date}`, 20, yPosition)
    addText(`${flight.arrival.date}`, 120, yPosition)
    yPosition += 10
    
    addText(`Duration: ${flight.duration}`, 20, yPosition)
    addText(`Aircraft: ${flight.aircraft}`, 120, yPosition)
    yPosition += 7
    
    addText(`Stops: ${flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop(s)`}`, 20, yPosition)
    yPosition += 15
  }

  if (flights.return) {
    addText('RETURN FLIGHT', 20, yPosition, { fontSize: 14, fontWeight: 'bold' })
    yPosition += 10
    
    const flight = flights.return
    addText(`${flight.airline} - Flight ${flight.flightNumber}`, 20, yPosition, { fontSize: 12, fontWeight: 'bold' })
    yPosition += 8
    
    // Departure and Arrival in columns
    addText('DEPARTURE', 20, yPosition, { fontSize: 10, fontWeight: 'bold' })
    addText('ARRIVAL', 120, yPosition, { fontSize: 10, fontWeight: 'bold' })
    yPosition += 7
    
    addText(`${flight.departure.time}`, 20, yPosition, { fontSize: 16, fontWeight: 'bold' })
    addText(`${flight.arrival.time}`, 120, yPosition, { fontSize: 16, fontWeight: 'bold' })
    yPosition += 8
    
    addText(`${flight.departure.airport}`, 20, yPosition)
    addText(`${flight.arrival.airport}`, 120, yPosition)
    yPosition += 7
    
    addText(`${flight.departure.date}`, 20, yPosition)
    addText(`${flight.arrival.date}`, 120, yPosition)
    yPosition += 10
    
    addText(`Duration: ${flight.duration}`, 20, yPosition)
    addText(`Aircraft: ${flight.aircraft}`, 120, yPosition)
    yPosition += 7
    
    addText(`Stops: ${flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop(s)`}`, 20, yPosition)
    yPosition += 15
  }

  // Booking Details
  addText('BOOKING DETAILS', 20, yPosition, { fontSize: 14, fontWeight: 'bold' })
  yPosition += 10
  
  addText(`Total Amount: $${bookingData.totalAmount}`, 20, yPosition)
  yPosition += 7
  addText(`Booking Date: ${bookingData.bookingDate}`, 20, yPosition)
  yPosition += 7
  addText(`Status: ${bookingData.status}`, 20, yPosition)
  yPosition += 15

  // Important Information
  addText('IMPORTANT INFORMATION', 20, yPosition, { fontSize: 14, fontWeight: 'bold' })
  yPosition += 10
  
  const importantInfo = [
    '• Please arrive at the airport at least 2 hours before domestic flights',
    '• Bring a valid government-issued photo ID for domestic flights',
    '• Check-in online 24 hours before your flight to save time',
    '• Keep this e-ticket with you during your journey'
  ]
  
  importantInfo.forEach(info => {
    addText(info, 20, yPosition, { fontSize: 10 })
    yPosition += 7
  })

  // Barcode representation
  yPosition += 10
  addText('||||| |||| | |||| ||||| | |||| |||||', pageWidth/2, yPosition, { 
    align: 'center', 
    fontSize: 12, 
    fontWeight: 'bold' 
  })
  yPosition += 5
  addText(bookingData.bookingReference, pageWidth/2, yPosition, { 
    align: 'center', 
    fontSize: 10 
  })

  return pdf
}

export async function POST(request: NextRequest) {
  try {
    const { bookingData, action } = await request.json()

    if (!bookingData) {
      return NextResponse.json({ success: false, error: 'Booking data is required' }, { status: 400 })
    }

    // Generate PDF
    const pdf = generateTicketPDF(bookingData)
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    if (action === 'download') {
      // Return PDF for download
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="ticket-${bookingData.bookingReference}.pdf"`
        }
      })
    }

    if (action === 'email') {
      // Send PDF via email
      const passengerEmail = bookingData.passengers[0].email
      const subject = `Your Flight Ticket - ${bookingData.bookingReference}`
      
      const emailContent = `Dear ${bookingData.passengers[0].firstName} ${bookingData.passengers[0].lastName},

Please find your flight ticket attached to this email.

Booking Reference: ${bookingData.bookingReference}
${bookingData.flights.outbound ? `Outbound Flight: ${bookingData.flights.outbound.airline} ${bookingData.flights.outbound.flightNumber}` : ''}
${bookingData.flights.return ? `Return Flight: ${bookingData.flights.return.airline} ${bookingData.flights.return.flightNumber}` : ''}

Important reminders:
• Arrive at the airport at least 2 hours before domestic flights
• Bring a valid government-issued photo ID
• Check-in online 24 hours before your flight

Have a safe journey!

Best regards,
SkyBooker Team`

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Your Flight Ticket</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Booking Reference: ${bookingData.bookingReference}</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${bookingData.passengers[0].firstName} ${bookingData.passengers[0].lastName},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">Please find your flight ticket attached to this email.</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="color: #1f2937; margin-top: 0;">Flight Details:</h3>
              ${bookingData.flights.outbound ? `<p style="margin: 5px 0;"><strong>Outbound:</strong> ${bookingData.flights.outbound.airline} ${bookingData.flights.outbound.flightNumber}</p>` : ''}
              ${bookingData.flights.return ? `<p style="margin: 5px 0;"><strong>Return:</strong> ${bookingData.flights.return.airline} ${bookingData.flights.return.flightNumber}</p>` : ''}
            </div>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">Important Reminders:</h3>
              <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                <li>Arrive at the airport at least 2 hours before domestic flights</li>
                <li>Bring a valid government-issued photo ID</li>
                <li>Check-in online 24 hours before your flight</li>
              </ul>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">Have a safe journey!</p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">Best regards,<br><strong>SkyBooker Team</strong></p>
            </div>
          </div>
        </div>
      `

      try {
        // Send using Gmail
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
          throw new Error('Gmail configuration missing')
        }
        
        const transporter = createGmailTransporter()
        
        const mailOptions = {
          from: `"SkyBooker" <${process.env.GMAIL_USER}>`,
          replyTo: process.env.GMAIL_USER,
          to: passengerEmail,
          subject: subject,
          html: emailHtml,
          text: emailContent,
          attachments: [
            {
              filename: `ticket-${bookingData.bookingReference}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf'
            }
          ]
        }
        
        const gmailResult = await transporter.sendMail(mailOptions)
        
        return NextResponse.json({
          success: true,
          message: 'Ticket PDF sent successfully',
          emailId: gmailResult.messageId,
          provider: 'gmail'
        })
      } catch (emailError) {
        console.error('Gmail email sending failed:', emailError)
        return NextResponse.json({
          success: false,
          error: 'Failed to send email'
        }, { status: 500 })
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('PDF generation/email error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate or send ticket PDF'
    }, { status: 500 })
  }
}
