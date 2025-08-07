import {
Body,
Container,
Head,
Heading,
Html,
Img,
Link,
Preview,
Section,
Text,
Row,
Column,
Hr,
} from '@react-email/components'

interface Flight {
id: string
airline: string
flightNumber: string
departure: {
  airport: string
  time: string
  date: string
}
arrival: {
  airport: string
  time: string
  date: string
}
duration: string
price: number
stops: number
aircraft: string
}

interface BookingConfirmationEmailProps {
bookingData: {
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
  bookingDate: string
}
}

export function BookingConfirmationEmail({ bookingData }: BookingConfirmationEmailProps) {
// Ensure bookingData is not null/undefined before destructuring
const { bookingReference, flights, passengers, totalAmount } = bookingData || {
  bookingReference: 'N/A',
  flights: {},
  passengers: [],
  totalAmount: 0,
  bookingDate: ''
};

// Safely get the first passenger, providing default empty object if passengers array is empty or null
const firstPassenger = passengers && passengers.length > 0 ? passengers[0] : {
  firstName: 'Valued',
  lastName: 'Customer',
  email: 'N/A',
  phone: 'N/A',
  dateOfBirth: 'N/A',
  gender: 'N/A'
};

return (
  <Html>
    <Head />
    <Preview>Your flight booking {bookingReference ?? 'N/A'} has been confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Row>
            <Column>
              <Heading style={h1}>✈️ SkyBooker</Heading>
            </Column>
          </Row>
        </Section>

        {/* Confirmation Message */}
        <Section style={confirmationSection}>
          <Heading style={h2}>🎉 Booking Confirmed!</Heading>
          <Text style={text}>
            Dear {firstPassenger.firstName ?? 'N/A'} {firstPassenger.lastName ?? 'N/A'},
          </Text>
          <Text style={text}>
            Your flight booking has been successfully confirmed. Here are your booking details:
          </Text>
        </Section>

        {/* Booking Reference */}
        <Section style={bookingRefSection}>
          <Text style={bookingRefLabel}>Booking Reference</Text>
          <Text style={bookingRefNumber}>{bookingReference ?? 'N/A'}</Text>
        </Section>

        {/* Flight Details */}
        {flights?.outbound && (
          <Section style={flightSection}>
            <Heading style={h3}>✈️ Outbound Flight</Heading>
            <Row style={flightRow}>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Flight</Text>
                <Text style={flightValue}>{flights.outbound.airline ?? 'N/A'} {flights.outbound.flightNumber ?? 'N/A'}</Text>
              </Column>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Aircraft</Text>
                <Text style={flightValue}>{flights.outbound.aircraft ?? 'N/A'}</Text>
              </Column>
            </Row>
            <Row style={flightRow}>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Departure</Text>
                <Text style={flightValue}>{flights.outbound.departure?.airport ?? 'N/A'}</Text>
                <Text style={flightTime}>{flights.outbound.departure?.date ?? 'N/A'} at {flights.outbound.departure?.time ?? 'N/A'}</Text>
              </Column>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Arrival</Text>
                <Text style={flightValue}>{flights.outbound.arrival?.airport ?? 'N/A'}</Text>
                <Text style={flightTime}>{flights.outbound.arrival?.date ?? 'N/A'} at {flights.outbound.arrival?.time ?? 'N/A'}</Text>
              </Column>
            </Row>
            <Row style={flightRow}>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Duration</Text>
                <Text style={flightValue}>{flights.outbound.duration ?? 'N/A'}</Text>
              </Column>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Stops</Text>
                <Text style={flightValue}>
                  {flights.outbound.stops === 0 ? 'Direct' : `${flights.outbound.stops ?? 0} Stop(s)`}
                </Text>
              </Column>
            </Row>
          </Section>
        )}

        {flights?.return && (
          <Section style={flightSection}>
            <Heading style={h3}>🔄 Return Flight</Heading>
            <Row style={flightRow}>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Flight</Text>
                <Text style={flightValue}>{flights.return.airline ?? 'N/A'} {flights.return.flightNumber ?? 'N/A'}</Text>
              </Column>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Aircraft</Text>
                <Text style={flightValue}>{flights.return.aircraft ?? 'N/A'}</Text>
              </Column>
            </Row>
            <Row style={flightRow}>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Departure</Text>
                <Text style={flightValue}>{flights.return.departure?.airport ?? 'N/A'}</Text>
                <Text style={flightTime}>{flights.return.departure?.date ?? 'N/A'} at {flights.return.departure?.time ?? 'N/A'}</Text>
              </Column>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Arrival</Text>
                <Text style={flightValue}>{flights.return.arrival?.airport ?? 'N/A'}</Text>
                <Text style={flightTime}>{flights.return.arrival?.date ?? 'N/A'} at {flights.return.arrival?.time ?? 'N/A'}</Text>
              </Column>
            </Row>
            <Row style={flightRow}>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Duration</Text>
                <Text style={flightValue}>{flights.return.duration ?? 'N/A'}</Text>
              </Column>
              <Column style={flightColumn}>
                <Text style={flightLabel}>Stops</Text>
                <Text style={flightValue}>
                  {flights.return.stops === 0 ? 'Direct' : `${flights.return.stops ?? 0} Stop(s)`}
                </Text>
              </Column>
            </Row>
          </Section>
        )}

        <Hr style={hr} />

        {/* Passenger Information */}
        <Section style={passengerSection}>
          <Heading style={h3}>👥 Passenger Information</Heading>
          {passengers.map((passenger, index) => (
            <div key={index} style={passengerCard}>
              <Text style={passengerName}>
                {index + 1}. {passenger.firstName ?? 'N/A'} {passenger.lastName ?? 'N/A'}
              </Text>
              <Text style={passengerDetails}>Email: {passenger.email ?? 'N/A'}</Text>
              <Text style={passengerDetails}>Phone: {passenger.phone ?? 'N/A'}</Text>
              <Text style={passengerDetails}>Date of Birth: {passenger.dateOfBirth ?? 'N/A'}</Text>
            </div>
          ))}
        </Section>

        <Hr style={hr} />

        {/* Total Amount */}
        <Section style={totalSection}>
          <Row>
            <Column>
              <Text style={totalLabel}>Total Amount Paid</Text>
            </Column>
            <Column>
              <Text style={totalAmountStyle}>${(totalAmount !== undefined && !isNaN(totalAmount)) ? totalAmount.toFixed(2) : '0.00'}</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={hr} />

        {/* Important Information */}
        <Section style={infoSection}>
          <Heading style={h3}>📋 Important Information</Heading>
          <Text style={infoText}>
            • Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights
          </Text>
          <Text style={infoText}>
            • Bring a valid government-issued photo ID for domestic flights or passport for international flights
          </Text>
          <Text style={infoText}>
            • Check-in online 24 hours before your flight to save time at the airport
          </Text>
          <Text style={infoText}>
            • Keep your booking reference handy: <strong>{bookingReference ?? 'N/A'}</strong>
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Need help? Contact our support team at{' '}
            <Link href="mailto:support@skybooker.com" style={link}>
              support@skybooker.com
            </Link>
          </Text>
          <Text style={footerText}>
            Thank you for choosing SkyBooker!
          </Text>
          <Hr style={hr} />
          <Text style={disclaimerText}>
            This is an automated message. Please do not reply to this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)
}

// Styles
const main = {
backgroundColor: '#f6f9fc',
fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
backgroundColor: '#ffffff',
margin: '0 auto',
padding: '20px 0 48px',
marginBottom: '64px',
}

const header = {
padding: '20px 30px',
backgroundColor: '#2563eb',
}

const h1 = {
color: '#ffffff',
fontSize: '24px',
fontWeight: 'bold',
margin: '0',
padding: '0',
}

const h2 = {
color: '#1f2937',
fontSize: '20px',
fontWeight: 'bold',
margin: '30px 0 15px',
}

const h3 = {
color: '#374151',
fontSize: '18px',
fontWeight: 'bold',
margin: '20px 0 10px',
}

const text = {
color: '#374151',
fontSize: '16px',
lineHeight: '24px',
margin: '16px 0',
}

const confirmationSection = {
padding: '0 30px',
}

const bookingRefSection = {
padding: '20px 30px',
backgroundColor: '#f3f4f6',
textAlign: 'center' as const,
margin: '20px 0',
}

const bookingRefLabel = {
color: '#6b7280',
fontSize: '14px',
margin: '0 0 5px 0',
}

const bookingRefNumber = {
color: '#1f2937',
fontSize: '24px',
fontWeight: 'bold',
margin: '0',
}

const flightSection = {
padding: '0 30px',
margin: '20px 0',
border: '1px solid #e5e7eb',
borderRadius: '8px',
}

const flightRow = {
margin: '10px 0',
}

const flightColumn = {
width: '50%',
verticalAlign: 'top' as const,
}

const flightLabel = {
color: '#6b7280',
fontSize: '12px',
fontWeight: 'bold',
margin: '0 0 2px 0',
textTransform: 'uppercase' as const,
}

const flightValue = {
color: '#1f2937',
fontSize: '16px',
fontWeight: 'bold',
margin: '0 0 2px 0',
}

const flightTime = {
color: '#6b7280',
fontSize: '14px',
margin: '0',
}

const passengerSection = {
padding: '0 30px',
}

const passengerCard = {
backgroundColor: '#f9fafb',
padding: '15px',
borderRadius: '6px',
margin: '10px 0',
}

const passengerName = {
color: '#1f2937',
fontSize: '16px',
fontWeight: 'bold',
margin: '0 0 5px 0',
}

const passengerDetails = {
color: '#6b7280',
fontSize: '14px',
margin: '2px 0',
}

const totalSection = {
padding: '0 30px',
backgroundColor: '#f3f4f6',
}

const totalLabel = {
color: '#374151',
fontSize: '16px',
fontWeight: 'bold',
}

const totalAmountStyle = {
color: '#059669',
fontSize: '24px',
fontWeight: 'bold',
textAlign: 'right' as const,
}

const infoSection = {
padding: '0 30px',
}

const infoText = {
color: '#374151',
fontSize: '14px',
lineHeight: '20px',
margin: '8px 0',
}

const footer = {
padding: '0 30px',
textAlign: 'center' as const,
}

const footerText = {
color: '#6b7280',
fontSize: '14px',
lineHeight: '20px',
margin: '10px 0',
}

const disclaimerText = {
color: '#9ca3af',
fontSize: '12px',
margin: '10px 0',
}

const link = {
color: '#2563eb',
textDecoration: 'underline',
}

const hr = {
borderColor: '#e5e7eb',
margin: '20px 0',
}
