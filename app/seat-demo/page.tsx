"use client"

import { SeatMap } from '@/components/seat-map'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const mockFlight = {
  airline: 'SkyAir',
  flightNumber: 'SA101',
  aircraft: 'Boeing 737-800'
}

export default function SeatSelectionDemo() {
  const [selectedSeat, setSelectedSeat] = useState<string>('')

  const handleSeatSelect = (seatNumber: string, seatType: string, price: number) => {
    setSelectedSeat(seatNumber)
    console.log(`Selected seat ${seatNumber} (${seatType}) for +$${price}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Seat Selection Demo
          </h1>
          <div></div>
        </div>

        {/* Seat Map Component */}
        <SeatMap 
          flight={mockFlight}
          onSeatSelect={handleSeatSelect}
          selectedSeat={selectedSeat}
        />

        {/* Demo Info */}
        <div className="mt-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎫 Seat Selection Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>✈️ Interactive Aircraft Layout</div>
              <div>💺 Business, Premium & Economy Classes</div>
              <div>💰 Dynamic Pricing (+$0 to +$200)</div>
              <div>🎯 Hover for Seat Details</div>
              <div>🚪 Exit Row Premium Seats</div>
              <div>❌ Occupied vs Available</div>
              <div>✅ Real-time Selection</div>
              <div>🎨 Smooth Animations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
