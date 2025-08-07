"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Plane, Search, Users, Check, LogOut } from 'lucide-react'
import { AirportSearch } from "@/components/airport-search"
import { LoginForm } from "@/components/login-form"
import { FlightResults } from "@/components/flight-results"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingForm } from "@/components/booking-form"
import { PaymentGateway } from "@/components/payment-gateway"
import { PlaneTicket } from "@/components/plane-ticket"
import { Dialog, DialogContent } from "@/components/ui/dialog" // Import Dialog components

interface Airport {
  code: string
  name: string
  city: string
  country: string
}

interface Flight {
  id: string;
  airline: string; // Added airline to Flight interface
  flightNumber: string; // Added flightNumber to Flight interface
  departure: { // Added departure object
    airport: string;
    time: string;
    date: string;
  };
  arrival: { // Added arrival object
    airport: string;
    time: string;
    date: string;
  };
  duration: string; // Added duration
  price: number;
  stops: number; // Added stops
  aircraft: string; // Added aircraft
}

interface FlightSearchParams {
  from: Airport | null
  to: Airport | null
  departDate: Date | undefined
  returnDate: Date | undefined
  passengers: number
  tripType: 'one-way' | 'round-trip'
}

export default function FlightBookingHome() {
  const [user, setUser] = useState<any | null>(null) // Store user object
  const [currentView, setCurrentView] = useState<'search' | 'booking' | 'payment' | 'ticket' | 'confirmation'>('search')
  const [selectedFlights, setSelectedFlights] = useState<{
    outbound?: Flight
    return?: Flight
  }>({})
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    from: null,
    to: null,
    departDate: undefined,
    returnDate: undefined,
    passengers: 1,
    tripType: 'round-trip'
  })
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)
  const [showLoginModal, setShowLoginModal] = useState(false) // State for login modal

  useEffect(() => {
    // Check for logged-in user on component mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }, [])

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setShowLoginModal(false) // Close modal on success
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setCurrentView('search') // Go back to search page
    setSelectedFlights({})
    setBookingData(null)
    setSearchResults(null)
  }

  const handleFlightSelect = (flight: Flight, type: 'outbound' | 'return') => {
    console.log('Flight selected:', flight, 'Type:', type)

    if (!user) {
      setShowLoginModal(true) // Show login modal if not logged in
      return // Prevent further action until logged in
    }
    
    setSelectedFlights(prev => ({
      ...prev,
      [type]: flight
    }))

    // Check if we have all required flights
    const updatedFlights = {
      ...selectedFlights,
      [type]: flight
    }

    const shouldProceed = searchParams.tripType === 'one-way' || 
      (updatedFlights.outbound && updatedFlights.return)

    if (shouldProceed) {
      // Calculate total amount
      const outboundPrice = updatedFlights.outbound?.price || 0
      const returnPrice = updatedFlights.return?.price || 0
      const subtotal = (outboundPrice + returnPrice) * searchParams.passengers
      const totalAmount = Math.round(subtotal * 1.15) // Add 15% for taxes and fees
      
      // Create passenger details template with the logged-in user's email and name
      const userEmail = user?.email || 'demo@example.com'
      const userName = user?.name || 'Demo User'
      
      // Parse user name properly
      const nameParts = userName.trim().split(' ')
      const userFirstName = nameParts[0] || 'John'
      const userLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
      
      console.log('User data for booking:', { userName, userFirstName, userLastName, userEmail })
      
      const passengers = Array.from({ length: searchParams.passengers }, (_, i) => ({
        id: i + 1,
        firstName: i === 0 ? userFirstName : `Passenger${i + 1}`, // Pre-fill first passenger
        lastName: i === 0 ? userLastName : `LastName${i + 1}`,
        email: i === 0 ? userEmail : `passenger${i + 1}@example.com`,
        phone: i === 0 ? '+1234567890' : `+123456789${i}`,
        dateOfBirth: '1990-01-01',
        gender: 'male'
      }))
      
      setBookingData({
        passengers,
        totalAmount,
        flights: updatedFlights,
        userId: user.id // Pass user ID for database booking
      })
      
      console.log('Proceeding to payment with:', { passengers, totalAmount, flights: updatedFlights })
      setCurrentView('payment')
    } else {
      console.log('Waiting for more flight selections...')
    }
  }

  const handleBookingComplete = () => {
    setCurrentView('confirmation')
  }

  const handleBackToSearch = () => {
    setCurrentView('search')
    setSelectedFlights({})
    setBookingData(null)
    setSearchResults(null)
  }

  const handleSearch = async () => {
    console.log('Search button clicked!')
    console.log('Current search params:', searchParams)
    
    if (!searchParams.from || !searchParams.to || !searchParams.departDate) {
      console.log('Missing required fields:', {
        from: searchParams.from,
        to: searchParams.to,
        departDate: searchParams.departDate
      })
      alert('Please fill in all required fields')
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: searchParams.from.code,
          to: searchParams.to.code,
          departDate: searchParams.departDate,
          returnDate: searchParams.returnDate,
          passengers: searchParams.passengers,
          tripType: searchParams.tripType
        }),
      })

      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
      } else {
        throw new Error('Failed to search flights')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Failed to search flights. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  // Render different views based on currentView state
  const renderContent = () => {
    switch (currentView) {
      case 'search':
        return (
          <>
            {/* Search Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Flights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Trip Type */}
                <div className="flex space-x-4">
                  <Button
                    variant={searchParams.tripType === 'round-trip' ? 'default' : 'outline'}
                    onClick={() => {
                      console.log('Round trip button clicked')
                      setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))
                    }}
                  >
                    Round Trip
                  </Button>
                  <Button
                    variant={searchParams.tripType === 'one-way' ? 'default' : 'outline'}
                    onClick={() => {
                      console.log('One way button clicked')
                      setSearchParams(prev => ({ ...prev, tripType: 'one-way' }))
                    }}
                  >
                    One Way
                  </Button>
                </div>

                {/* Airport Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <AirportSearch
                      placeholder="Departure airport"
                      onSelect={(airport) => {
                        console.log('From airport selected:', airport)
                        setSearchParams(prev => ({ ...prev, from: airport }))
                      }}
                      selectedAirport={searchParams.from}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <AirportSearch
                      placeholder="Destination airport"
                      onSelect={(airport) => {
                        console.log('To airport selected:', airport)
                        setSearchParams(prev => ({ ...prev, to: airport }))
                      }}
                      selectedAirport={searchParams.to}
                    />
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Departure Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {searchParams.departDate ? format(searchParams.departDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={searchParams.departDate}
                          onSelect={(date) => setSearchParams(prev => ({ ...prev, departDate: date }))}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {searchParams.tripType === 'round-trip' && (
                    <div className="space-y-2">
                      <Label>Return Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {searchParams.returnDate ? format(searchParams.returnDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={searchParams.returnDate}
                            onSelect={(date) => setSearchParams(prev => ({ ...prev, returnDate: date }))}
                            disabled={(date) => date < (searchParams.departDate || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>

                {/* Passengers */}
                <div className="space-y-2">
                  <Label>Passengers</Label>
                  <Select
                    value={searchParams.passengers.toString()}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, passengers: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <Button 
                  onClick={() => {
                    console.log('Search button clicked - direct handler')
                    handleSearch()
                  }} 
                  className="w-full md:w-auto"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search Flights'}
                </Button>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults && (
              <FlightResults 
                results={searchResults} 
                onFlightSelect={handleFlightSelect}
              />
            )}
          </>
        )
      case 'booking':
        return (
          <BookingForm
            selectedFlights={selectedFlights}
            passengers={searchParams.passengers}
            onBookingComplete={handleBookingComplete}
            onBack={handleBackToSearch}
          />
        )
      case 'payment':
        return (
          <PaymentGateway
            selectedFlights={selectedFlights}
            passengerDetails={bookingData?.passengers || []}
            totalAmount={bookingData?.totalAmount || 0}
            onPaymentSuccess={(data) => {
              setBookingData(data)
              setCurrentView('ticket')
            }}
            onBack={() => setCurrentView('search')} // Go back to search if payment fails or user cancels
          />
        )
      case 'ticket':
        return (
          <PlaneTicket
            bookingData={bookingData}
            onNewBooking={() => {
              setCurrentView('search')
              setSelectedFlights({})
              setBookingData(null)
              setSearchResults(null)
            }}
          />
        )
      case 'confirmation':
        return (
          <Card className="w-full max-w-md text-center mx-auto">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Your flight has been successfully booked. You will receive a confirmation email shortly.
              </p>
              <Button onClick={handleBackToSearch} className="w-full">
                Book Another Flight
              </Button>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SkyBooker</h1>
            </div>
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm sm:text-base text-gray-700 hidden sm:block">Hello, {user.name}!</span>
                <span className="text-sm text-gray-700 sm:hidden">Hi, {user.name.split(' ')[0]}!</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowLoginModal(true)}>
                <span className="hidden sm:inline">Login / Sign Up</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Login/Signup Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="p-0">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
