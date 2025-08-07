"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AirportSearch } from '@/components/airport-search'
import { FlightResults } from '@/components/flight-results'
import { BookingForm } from '@/components/booking-form'
import { PaymentGateway } from '@/components/payment-gateway'
import { PlaneTicket } from '@/components/plane-ticket'
import { LoginForm } from '@/components/login-form'
import { UserDashboard } from '@/components/user-dashboard'
import { SeatMap } from '@/components/seat-map'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plane, 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  Shield, 
  Clock, 
  Heart,
  ChevronRight,
  Globe,
  Smartphone,
  User
} from 'lucide-react'

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

interface SearchParams {
  from: string
  to: string
  departDate: string
  returnDate?: string
  passengers: number
  tripType: 'one-way' | 'round-trip'
}

type AppState = 'search' | 'results' | 'booking' | 'payment' | 'confirmation' | 'login' | 'dashboard' | 'seat-selection'

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

interface SelectedSeat {
  flight: 'outbound' | 'return'
  seatNumber: string
  seatType: string
  price: number
}

export default function ModernHome() {
  const [currentState, setCurrentState] = useState<AppState>('search')
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [selectedFlights, setSelectedFlights] = useState<{ outbound?: Flight; return?: Flight }>({})
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([])
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // PWA Install functionality
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallPrompt(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
    setCurrentState('results')
  }

  const handleFlightSelect = (flight: Flight, type: 'outbound' | 'return') => {
    setSelectedFlights(prev => ({ ...prev, [type]: flight }))
    
    // If round trip and both flights selected, or one-way with outbound selected
    if ((searchParams?.tripType === 'round-trip' && type === 'return') || 
        (searchParams?.tripType === 'one-way' && type === 'outbound')) {
      if (isLoggedIn) {
        setCurrentState('seat-selection')
      } else {
        setCurrentState('login')
      }
    }
  }

  const handleSeatSelect = (seatNumber: string, seatType: string, price: number) => {
    const flightType = selectedFlights.return ? 'return' : 'outbound'
    setSelectedSeats(prev => {
      const filtered = prev.filter(seat => seat.flight !== flightType)
      return [...filtered, { flight: flightType, seatNumber, seatType, price }]
    })
  }

  const proceedToBooking = () => {
    setCurrentState('booking')
  }

  const proceedToPayment = (passengers: any[]) => {
    setCurrentState('payment')
  }

  const handlePaymentSuccess = (data: BookingData) => {
    setBookingData(data)
    setCurrentState('confirmation')
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setCurrentState('seat-selection')
  }

  const showDashboard = () => {
    setCurrentState('dashboard')
  }

  const resetToSearch = () => {
    setCurrentState('search')
    setSearchParams(null)
    setSelectedFlights({})
    setBookingData(null)
    setSelectedSeats([])
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    exit: { opacity: 0, y: -20 }
  }

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  if (currentState === 'dashboard') {
    return <UserDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* PWA Install Banner */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-4"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Install SkyBooker for a better experience!</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={handleInstallApp}>
                  Install
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowInstallPrompt(false)}>
                  ✕
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={resetToSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="p-2 bg-blue-600 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkyBooker
              </h1>
              <p className="text-xs text-gray-500">Your Journey Awaits</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button variant="outline" onClick={showDashboard} className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </motion.div>
            )}
            <motion.div
              animate={floatingVariants.animate}
              className="text-xs bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-3 py-1 rounded-full"
            >
              ✈️ PWA Ready
            </motion.div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {currentState === 'search' && (
            <motion.div
              key="search"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-12"
            >
              {/* Hero Section */}
              <motion.div variants={heroVariants} className="text-center space-y-6">
                <motion.h2 
                  className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Fly Anywhere
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-xl text-gray-600 max-w-2xl mx-auto"
                >
                  Discover the world with our premium flight booking experience. 
                  Modern, fast, and designed for the way you travel.
                </motion.p>
                
                {/* Feature Pills */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap justify-center gap-3"
                >
                  {[
                    { icon: Shield, text: "Secure Booking" },
                    { icon: Clock, text: "24/7 Support" },
                    { icon: Star, text: "Best Prices" },
                    { icon: Heart, text: "Loved by Millions" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm"
                    >
                      <feature.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Search Form */}
              <motion.div variants={itemVariants}>
                <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <AirportSearch onSearch={handleSearch} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Section */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              >
                {[
                  { number: "10M+", label: "Happy Travelers", icon: Users },
                  { number: "500+", label: "Airlines", icon: Plane },
                  { number: "2000+", label: "Destinations", icon: Globe },
                  { number: "99.9%", label: "Uptime", icon: Shield }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6 border"
                  >
                    <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {currentState === 'results' && searchParams && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FlightResults 
                searchParams={searchParams} 
                onFlightSelect={handleFlightSelect}
                selectedFlights={selectedFlights}
              />
            </motion.div>
          )}

          {currentState === 'seat-selection' && selectedFlights.outbound && (
            <motion.div
              key="seat-selection"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Seats</h2>
                <p className="text-gray-600">Choose your preferred seats for a comfortable journey</p>
              </div>
              
              <SeatMap 
                flight={selectedFlights.outbound}
                onSeatSelect={handleSeatSelect}
                selectedSeat={selectedSeats.find(s => s.flight === 'outbound')?.seatNumber}
              />
              
              <div className="flex justify-center">
                <Button onClick={proceedToBooking} size="lg" className="px-8">
                  Continue to Booking
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentState === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm onLogin={handleLogin} />
            </motion.div>
          )}

          {currentState === 'booking' && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BookingForm 
                selectedFlights={selectedFlights} 
                onContinue={proceedToPayment}
                selectedSeats={selectedSeats}
              />
            </motion.div>
          )}

          {currentState === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentGateway 
                selectedFlights={selectedFlights} 
                onPaymentSuccess={handlePaymentSuccess}
                selectedSeats={selectedSeats}
              />
            </motion.div>
          )}

          {currentState === 'confirmation' && bookingData && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <PlaneTicket 
                bookingData={bookingData} 
                onNewBooking={resetToSearch}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center text-gray-500 text-sm"
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Badge variant="outline" className="bg-white/50">
              <Globe className="h-3 w-3 mr-1" />
              Global Coverage
            </Badge>
            <Badge variant="outline" className="bg-white/50">
              <Shield className="h-3 w-3 mr-1" />
              Secure & Safe
            </Badge>
            <Badge variant="outline" className="bg-white/50">
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile Optimized
            </Badge>
          </div>
          <p>&copy; 2024 SkyBooker. Crafted with ❤️ for modern travelers.</p>
        </motion.footer>
      </div>
    </div>
  )
}
