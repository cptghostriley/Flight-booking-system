"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Plane, 
  Calendar, 
  Star, 
  Award, 
  TrendingUp,
  Download,
  Mail,
  Settings
} from 'lucide-react'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  memberSince: string
  totalFlights: number
  totalMiles: number
  status: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  preferences: {
    seatPreference: 'window' | 'aisle' | 'any'
    mealPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'halal'
    classPreference: 'economy' | 'premium-economy' | 'business' | 'first'
  }
}

interface BookingHistory {
  id: string
  bookingReference: string
  status: 'completed' | 'upcoming' | 'cancelled'
  bookingDate: string
  totalAmount: number
  flights: {
    outbound?: {
      airline: string
      flightNumber: string
      departure: { airport: string; time: string; date: string }
      arrival: { airport: string; time: string; date: string }
    }
    return?: {
      airline: string
      flightNumber: string
      departure: { airport: string; time: string; date: string }
      arrival: { airport: string; time: string; date: string }
    }
  }
}

export function UserDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      setUserProfile({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        memberSince: '2022-01-15',
        totalFlights: 12,
        totalMiles: 24580,
        status: 'Gold',
        preferences: {
          seatPreference: 'window',
          mealPreference: 'non-vegetarian',
          classPreference: 'economy'
        }
      })

      // Mock booking history
      setBookingHistory([
        {
          id: '1',
          bookingReference: 'SKY001',
          status: 'upcoming',
          bookingDate: '2024-01-15',
          totalAmount: 450,
          flights: {
            outbound: {
              airline: 'SkyAir',
              flightNumber: 'SA101',
              departure: { airport: 'JFK', time: '14:30', date: '2024-02-15' },
              arrival: { airport: 'LAX', time: '17:45', date: '2024-02-15' }
            },
            return: {
              airline: 'SkyAir',
              flightNumber: 'SA102',
              departure: { airport: 'LAX', time: '09:15', date: '2024-02-20' },
              arrival: { airport: 'JFK', time: '17:30', date: '2024-02-20' }
            }
          }
        },
        {
          id: '2',
          bookingReference: 'SKY002',
          status: 'completed',
          bookingDate: '2023-12-01',
          totalAmount: 320,
          flights: {
            outbound: {
              airline: 'AirPro',
              flightNumber: 'AP205',
              departure: { airport: 'ORD', time: '11:20', date: '2023-12-15' },
              arrival: { airport: 'MIA', time: '15:10', date: '2023-12-15' }
            }
          }
        }
      ])
      
      setLoading(false)
    }

    loadUserData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bronze': return 'bg-amber-600'
      case 'Silver': return 'bg-gray-400'
      case 'Gold': return 'bg-yellow-500'
      case 'Platinum': return 'bg-purple-600'
      default: return 'bg-blue-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Bronze': return <Award className="h-4 w-4" />
      case 'Silver': return <Star className="h-4 w-4" />
      case 'Gold': return <Award className="h-4 w-4" />
      case 'Platinum': return <Star className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!userProfile) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl">
                      {userProfile.firstName[0]}{userProfile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Welcome back, {userProfile.firstName}!
                    </h1>
                    <p className="text-gray-600">
                      Member since {new Date(userProfile.memberSince).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={`${getStatusColor(userProfile.status)} text-white px-3 py-1`}>
                    {getStatusIcon(userProfile.status)}
                    <span className="ml-1">{userProfile.status} Member</span>
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Flights</p>
                  <p className="text-2xl font-bold text-gray-900">{userProfile.totalFlights}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Miles</p>
                  <p className="text-2xl font-bold text-gray-900">{userProfile.totalMiles.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Status</p>
                  <p className="text-lg font-bold text-gray-900">
                    {userProfile.status === 'Gold' ? 'Platinum' : 'Gold'}
                  </p>
                  <p className="text-xs text-gray-500">5,420 miles to go</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Booking History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bookingHistory.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Plane className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{booking.bookingReference}</p>
                                <p className="text-sm text-gray-600">
                                  {booking.flights.outbound?.departure.airport} → {booking.flights.outbound?.arrival.airport}
                                </p>
                              </div>
                            </div>
                            <Badge variant={booking.status === 'upcoming' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Booking History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {bookingHistory.map((booking) => (
                          <motion.div
                            key={booking.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 bg-gray-50 rounded-lg border cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{booking.bookingReference}</h3>
                                <p className="text-sm text-gray-600">
                                  Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant={booking.status === 'upcoming' ? 'default' : 'secondary'}>
                                  {booking.status}
                                </Badge>
                                <p className="text-lg font-bold mt-1">${booking.totalAmount}</p>
                              </div>
                            </div>

                            {/* Flight Details */}
                            <div className="space-y-4">
                              {booking.flights.outbound && (
                                <div className="flex items-center justify-between p-4 bg-white rounded border">
                                  <div className="flex items-center space-x-4">
                                    <Badge variant="outline">Outbound</Badge>
                                    <div>
                                      <p className="font-medium">
                                        {booking.flights.outbound.airline} {booking.flights.outbound.flightNumber}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {booking.flights.outbound.departure.airport} → {booking.flights.outbound.arrival.airport}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm">
                                      {booking.flights.outbound.departure.date}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {booking.flights.outbound.departure.time} - {booking.flights.outbound.arrival.time}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {booking.flights.return && (
                                <div className="flex items-center justify-between p-4 bg-white rounded border">
                                  <div className="flex items-center space-x-4">
                                    <Badge variant="outline">Return</Badge>
                                    <div>
                                      <p className="font-medium">
                                        {booking.flights.return.airline} {booking.flights.return.flightNumber}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {booking.flights.return.departure.airport} → {booking.flights.return.arrival.airport}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm">
                                      {booking.flights.return.departure.date}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {booking.flights.return.departure.time} - {booking.flights.return.arrival.time}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2 mt-4">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 mr-2" />
                                Email Ticket
                              </Button>
                              {booking.status === 'upcoming' && (
                                <Button variant="outline" size="sm">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Manage Booking
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Travel Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Seat Preference</label>
                          <p className="mt-1 text-gray-900 capitalize">{userProfile.preferences.seatPreference}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Meal Preference</label>
                          <p className="mt-1 text-gray-900 capitalize">{userProfile.preferences.mealPreference}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Class Preference</label>
                          <p className="mt-1 text-gray-900 capitalize">{userProfile.preferences.classPreference.replace('-', ' ')}</p>
                        </div>
                      </div>
                      <Button>Update Preferences</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700">First Name</label>
                          <p className="mt-1 text-gray-900">{userProfile.firstName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Last Name</label>
                          <p className="mt-1 text-gray-900">{userProfile.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <p className="mt-1 text-gray-900">{userProfile.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <p className="mt-1 text-gray-900">{userProfile.phone}</p>
                        </div>
                      </div>
                      <Button>Edit Profile</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}
