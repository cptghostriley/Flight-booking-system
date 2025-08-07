"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plane, User, CreditCard, Check } from 'lucide-react'

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

interface BookingFormProps {
  selectedFlights: {
    outbound?: Flight
    return?: Flight
  }
  passengers: number
  onBookingComplete: () => void
  onBack: () => void
}

export function BookingForm({ selectedFlights, passengers, onBookingComplete, onBack }: BookingFormProps) {
  const [passengerDetails, setPassengerDetails] = useState(
    Array.from({ length: passengers }, (_, i) => ({
      id: i + 1,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: ''
    }))
  )
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [isBooking, setIsBooking] = useState(false)

  const totalPrice = (selectedFlights.outbound?.price || 0) + (selectedFlights.return?.price || 0)
  const totalWithTax = totalPrice * passengers * 1.15 // Adding 15% tax

  const handlePassengerChange = (index: number, field: string, value: string) => {
    setPassengerDetails(prev => 
      prev.map((passenger, i) => 
        i === index ? { ...passenger, [field]: value } : passenger
      )
    )
  }

  const handleBooking = async () => {
    setIsBooking(true)
    
    try {
      const bookingData = {
        flights: selectedFlights,
        passengers: passengerDetails,
        payment: paymentDetails,
        totalPrice: totalWithTax
      }

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Booking confirmed! Your booking reference is: ${result.bookingReference}`)
        onBookingComplete()
      } else {
        throw new Error('Booking failed')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  const FlightSummary = ({ flight, label }: { flight: Flight; label: string }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{label}</h4>
        <Badge variant="secondary">{flight.flightNumber}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="font-medium">{flight.departure.time}</div>
          <div className="text-muted-foreground">{flight.departure.airport}</div>
          <div className="text-xs text-muted-foreground">{flight.departure.date}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">{flight.duration}</div>
          <div className="text-xs">{flight.airline}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{flight.arrival.time}</div>
          <div className="text-muted-foreground">{flight.arrival.airport}</div>
          <div className="text-xs text-muted-foreground">{flight.arrival.date}</div>
        </div>
      </div>
      <div className="mt-2 text-right">
        <span className="font-semibold text-blue-600">${flight.price} per person</span>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Complete Your Booking</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Search
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plane className="h-5 w-5" />
                <span>Flight Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFlights.outbound && (
                <FlightSummary flight={selectedFlights.outbound} label="Outbound Flight" />
              )}
              {selectedFlights.return && (
                <FlightSummary flight={selectedFlights.return} label="Return Flight" />
              )}
            </CardContent>
          </Card>

          {/* Passenger Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Passenger Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {passengerDetails.map((passenger, index) => (
                <div key={passenger.id} className="space-y-4">
                  <h4 className="font-semibold">Passenger {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={passenger.phone}
                        onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={passenger.gender}
                        onValueChange={(value) => handlePassengerChange(index, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {index < passengerDetails.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input
                  value={paymentDetails.cardholderName}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    value={paymentDetails.expiryDate}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {selectedFlights.outbound && (
                  <div className="flex justify-between">
                    <span>Outbound ({passengers} passenger{passengers > 1 ? 's' : ''})</span>
                    <span>${selectedFlights.outbound.price * passengers}</span>
                  </div>
                )}
                {selectedFlights.return && (
                  <div className="flex justify-between">
                    <span>Return ({passengers} passenger{passengers > 1 ? 's' : ''})</span>
                    <span>${selectedFlights.return.price * passengers}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice * passengers}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes & Fees</span>
                  <span>${Math.round((totalPrice * passengers * 0.15))}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${Math.round(totalWithTax)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleBooking}
                disabled={isBooking}
              >
                {isBooking ? 'Processing...' : 'Complete Booking'}
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                <p>By completing this booking, you agree to our terms and conditions.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
