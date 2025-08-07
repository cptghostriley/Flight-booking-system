"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plane, Calendar, Clock, MapPin, User, Download, Mail } from 'lucide-react'

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

interface PlaneTicketProps {
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
    status: string
    bookingDate: string
  }
  onNewBooking: () => void
}

export function PlaneTicket({ bookingData, onNewBooking }: PlaneTicketProps) {
  const { bookingReference, flights, passengers, totalAmount, bookingDate } = bookingData

  const TicketCard = ({ flight, passenger, type }: { 
    flight: Flight; 
    passenger: any; 
    type: 'outbound' | 'return' 
  }) => (
    <Card className="mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="h-6 w-6" />
            <div>
              <h3 className="font-bold text-lg">{flight.airline}</h3>
              <p className="text-blue-100">Flight {flight.flightNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="bg-white text-blue-800">
              {type === 'outbound' ? 'OUTBOUND' : 'RETURN'}
            </Badge>
            <p className="text-sm text-blue-100 mt-1">
              {flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Departure */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{flight.departure.time}</div>
            <div className="text-lg font-semibold text-gray-700">{flight.departure.airport}</div>
            <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {flight.departure.date}
            </div>
          </div>

          {/* Flight Info */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="h-px bg-gray-300 flex-1"></div>
              <Plane className="h-5 w-5 text-gray-400 mx-4" />
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <Clock className="h-4 w-4 mr-1" />
              {flight.duration}
            </div>
            <div className="text-xs text-gray-500 mt-1">{flight.aircraft}</div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{flight.arrival.time}</div>
            <div className="text-lg font-semibold text-gray-700">{flight.arrival.airport}</div>
            <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {flight.arrival.date}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Passenger Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Passenger Details
            </h4>
            <div className="space-y-1">
              <p className="font-medium">{passenger.firstName} {passenger.lastName}</p>
              <p className="text-sm text-gray-600">{passenger.email}</p>
              <p className="text-sm text-gray-600">{passenger.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Booking Details</h4>
            <div className="space-y-1">
              <p className="text-sm"><span className="font-medium">Booking Ref:</span> {bookingReference}</p>
              <p className="text-sm"><span className="font-medium">Seat:</span> {Math.floor(Math.random() * 30) + 1}A</p>
              <p className="text-sm"><span className="font-medium">Gate:</span> {String.fromCharCode(65 + Math.floor(Math.random() * 10))}{Math.floor(Math.random() * 20) + 1}</p>
            </div>
          </div>
        </div>

        {/* Barcode */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-black text-white px-4 py-2 font-mono text-xs">
            ||||| |||| | |||| ||||| | |||| |||||
          </div>
          <p className="text-xs text-gray-500 mt-1">{bookingReference}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Plane className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Your flight has been successfully booked. Here are your e-tickets.
          </p>
        </div>
      </div>

      {/* Booking Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="font-semibold text-green-800">Booking Reference</h3>
              <p className="text-2xl font-bold text-green-900">{bookingReference}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Total Passengers</h3>
              <p className="text-2xl font-bold text-green-900">{passengers.length}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Total Amount</h3>
              <p className="text-2xl font-bold text-green-900">${totalAmount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      <div className="space-y-6">
        {passengers.map((passenger, index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold mb-4">
              Ticket for {passenger.firstName} {passenger.lastName}
            </h2>
            
            {flights.outbound && (
              <TicketCard 
                flight={flights.outbound} 
                passenger={passenger} 
                type="outbound" 
              />
            )}
            
            {flights.return && (
              <TicketCard 
                flight={flights.return} 
                passenger={passenger} 
                type="return" 
              />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>Email Tickets</span>
        </Button>
        <Button onClick={onNewBooking}>
          Book Another Flight
        </Button>
      </div>

      {/* Important Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Important Information</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights</li>
            <li>• Bring a valid government-issued photo ID for domestic flights or passport for international flights</li>
            <li>• Check-in online 24 hours before your flight to save time at the airport</li>
            <li>• Your confirmation email has been sent to {passengers[0].email}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
