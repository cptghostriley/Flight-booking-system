"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Check, X, User, Crown } from 'lucide-react'

interface SeatMapProps {
  flight: {
    airline: string
    flightNumber: string
    aircraft: string
  }
  onSeatSelect: (seatNumber: string, seatType: string, price: number) => void
  selectedSeat?: string
}

type SeatType = 'available' | 'occupied' | 'selected' | 'premium' | 'business' | 'exit-row'
type SeatClass = 'economy' | 'premium-economy' | 'business' | 'first'

interface Seat {
  number: string
  type: SeatType
  class: SeatClass
  price: number
  features?: string[]
}

const seatConfig = {
  economy: { 
    rows: 25, 
    seatsPerRow: 6, 
    layout: '3-3',
    basePrice: 0,
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300'
  },
  'premium-economy': { 
    rows: 3, 
    seatsPerRow: 6, 
    layout: '3-3',
    basePrice: 50,
    color: 'bg-purple-100 hover:bg-purple-200 border-purple-300'
  },
  business: { 
    rows: 4, 
    seatsPerRow: 4, 
    layout: '2-2',
    basePrice: 200,
    color: 'bg-amber-100 hover:bg-amber-200 border-amber-300'
  }
}

export function SeatMap({ flight, onSeatSelect, selectedSeat }: SeatMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<SeatClass | 'all'>('economy')

  // Generate seat data
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    let rowNumber = 1

    // Business class
    for (let i = 0; i < seatConfig.business.rows; i++) {
      const letters = ['A', 'B', 'D', 'E'] // 2-2 layout
      letters.forEach(letter => {
        const isOccupied = Math.random() < 0.3
        seats.push({
          number: `${rowNumber}${letter}`,
          type: isOccupied ? 'occupied' : 'available',
          class: 'business',
          price: seatConfig.business.basePrice,
          features: ['Extra legroom', 'Priority boarding', 'Meal included']
        })
      })
      rowNumber++
    }

    // Premium Economy
    for (let i = 0; i < seatConfig['premium-economy'].rows; i++) {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'] // 3-3 layout
      letters.forEach(letter => {
        const isOccupied = Math.random() < 0.4
        seats.push({
          number: `${rowNumber}${letter}`,
          type: isOccupied ? 'occupied' : 'premium',
          class: 'premium-economy',
          price: seatConfig['premium-economy'].basePrice,
          features: ['Extra legroom', 'Priority boarding']
        })
      })
      rowNumber++
    }

    // Economy
    for (let i = 0; i < seatConfig.economy.rows; i++) {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'] // 3-3 layout
      letters.forEach(letter => {
        let type: SeatType = 'available'
        let price = seatConfig.economy.basePrice
        
        const isOccupied = Math.random() < 0.6
        const isExitRow = [12, 13, 26, 27].includes(rowNumber)
        
        if (isOccupied) {
          type = 'occupied'
        } else if (isExitRow) {
          type = 'exit-row'
          price = 25 // Exit row fee
        }

        seats.push({
          number: `${rowNumber}${letter}`,
          type,
          class: 'economy',
          price,
          features: isExitRow ? ['Extra legroom', 'Emergency exit responsibility'] : []
        })
      })
      rowNumber++
    }

    return seats
  }

  const [seats] = useState(generateSeats())

  const getSeatIcon = (seat: Seat) => {
    if (seat.number === selectedSeat) return <Check className="h-3 w-3 text-white" />
    if (seat.type === 'occupied') return <X className="h-3 w-3 text-gray-400" />
    if (seat.class === 'business') return <Crown className="h-3 w-3 text-amber-600" />
    if (seat.type === 'premium' || seat.type === 'exit-row') return <User className="h-3 w-3 text-purple-600" />
    return <User className="h-3 w-3 text-blue-600" />
  }

  const getSeatColor = (seat: Seat) => {
    if (seat.number === selectedSeat) return 'bg-green-500 border-green-600'
    if (seat.type === 'occupied') return 'bg-gray-200 border-gray-300 cursor-not-allowed'
    
    switch (seat.class) {
      case 'business': return seatConfig.business.color
      case 'premium-economy': return seatConfig['premium-economy'].color
      default: 
        if (seat.type === 'exit-row') return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300'
        return seatConfig.economy.color
    }
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.type === 'occupied') return
    onSeatSelect(seat.number, seat.class, seat.price)
  }

  const filteredSeats = selectedClass === 'all' 
    ? seats 
    : seats.filter(seat => seat.class === selectedClass)

  const groupSeatsByRow = (seats: Seat[]) => {
    const grouped: { [key: number]: Seat[] } = {}
    seats.forEach(seat => {
      const row = parseInt(seat.number.match(/\d+/)?.[0] || '0')
      if (!grouped[row]) grouped[row] = []
      grouped[row].push(seat)
    })
    return grouped
  }

  const seatsByRow = groupSeatsByRow(filteredSeats)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Plane className="h-6 w-6" />
              <div>
                <CardTitle className="text-xl">{flight.airline} {flight.flightNumber}</CardTitle>
                <p className="text-blue-100 text-sm">{flight.aircraft}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white text-blue-800">
              Seat Selection
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Class Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'business', 'premium-economy', 'economy'] as const).map((classType) => (
              <Button
                key={classType}
                variant={selectedClass === classType ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedClass(classType)}
                className="capitalize"
              >
                {classType.replace('-', ' ')}
              </Button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                <User className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                <X className="h-3 w-3 text-gray-400" />
              </div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 border border-green-600 rounded flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-amber-100 border border-amber-300 rounded flex items-center justify-center">
                <Crown className="h-3 w-3 text-amber-600" />
              </div>
              <span className="text-sm">Business (+$200)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-100 border border-purple-300 rounded flex items-center justify-center">
                <User className="h-3 w-3 text-purple-600" />
              </div>
              <span className="text-sm">Premium (+$50)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center">
                <User className="h-3 w-3 text-yellow-600" />
              </div>
              <span className="text-sm">Exit Row (+$25)</span>
            </div>
          </div>

          {/* Seat Map */}
          <div className="relative">
            <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-white">
              <div className="space-y-2">
                {Object.entries(seatsByRow)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([rowNum, rowSeats]) => (
                    <motion.div
                      key={rowNum}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: parseInt(rowNum) * 0.02 }}
                      className="flex items-center justify-center space-x-1"
                    >
                      {/* Row number */}
                      <div className="w-8 text-center text-sm font-medium text-gray-600">
                        {rowNum}
                      </div>

                      {/* Left side seats */}
                      <div className="flex space-x-1">
                        {rowSeats
                          .filter(seat => ['A', 'B', 'C'].includes(seat.number.slice(-1)))
                          .sort((a, b) => a.number.slice(-1).localeCompare(b.number.slice(-1)))
                          .map((seat) => (
                            <motion.button
                              key={seat.number}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`
                                w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-medium
                                transition-all duration-200 ${getSeatColor(seat)}
                                ${seat.type === 'occupied' ? '' : 'cursor-pointer'}
                              `}
                              onClick={() => handleSeatClick(seat)}
                              onMouseEnter={() => setHoveredSeat(seat.number)}
                              onMouseLeave={() => setHoveredSeat(null)}
                              disabled={seat.type === 'occupied'}
                            >
                              {getSeatIcon(seat)}
                            </motion.button>
                          ))}
                      </div>

                      {/* Aisle */}
                      <div className="w-6"></div>

                      {/* Right side seats */}
                      <div className="flex space-x-1">
                        {rowSeats
                          .filter(seat => ['D', 'E', 'F'].includes(seat.number.slice(-1)))
                          .sort((a, b) => a.number.slice(-1).localeCompare(b.number.slice(-1)))
                          .map((seat) => (
                            <motion.button
                              key={seat.number}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`
                                w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-medium
                                transition-all duration-200 ${getSeatColor(seat)}
                                ${seat.type === 'occupied' ? '' : 'cursor-pointer'}
                              `}
                              onClick={() => handleSeatClick(seat)}
                              onMouseEnter={() => setHoveredSeat(seat.number)}
                              onMouseLeave={() => setHoveredSeat(null)}
                              disabled={seat.type === 'occupied'}
                            >
                              {getSeatIcon(seat)}
                            </motion.button>
                          ))}
                      </div>

                      {/* Row number */}
                      <div className="w-8 text-center text-sm font-medium text-gray-600">
                        {rowNum}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Seat Info Popup */}
            <AnimatePresence>
              {hoveredSeat && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-10 min-w-48"
                >
                  {(() => {
                    const seat = seats.find(s => s.number === hoveredSeat)
                    if (!seat) return null
                    
                    return (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Seat {seat.number}</h4>
                          <Badge variant="outline" className="capitalize">
                            {seat.class.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {seat.price > 0 ? `+$${seat.price}` : 'Included'}
                        </p>
                        {seat.features && seat.features.length > 0 && (
                          <div className="space-y-1">
                            {seat.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-1 text-xs text-gray-600">
                                <Check className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected Seat Summary */}
          {selectedSeat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              {(() => {
                const seat = seats.find(s => s.number === selectedSeat)
                if (!seat) return null
                
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-800">
                        Selected: Seat {seat.number}
                      </p>
                      <p className="text-sm text-green-600 capitalize">
                        {seat.class.replace('-', ' ')} class
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-800">
                        {seat.price > 0 ? `+$${seat.price}` : 'Included'}
                      </p>
                      {seat.features && seat.features.length > 0 && (
                        <p className="text-xs text-green-600">
                          {seat.features.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
