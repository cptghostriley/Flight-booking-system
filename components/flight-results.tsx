"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Clock } from 'lucide-react'

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

interface FlightResultsProps {
  results: {
    outbound: Flight[]
    return?: Flight[]
  }
  onFlightSelect: (flight: Flight, type: 'outbound' | 'return') => void
}

const FlightCard = ({ flight, onSelect }: { flight: Flight; onSelect: () => void }) => (
  <Card className="mb-4">
    <CardContent className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-4">
            <div className="text-lg font-semibold">{flight.airline}</div>
            <Badge variant="secondary">{flight.flightNumber}</Badge>
            <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
              {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="text-center lg:text-left">
              <div className="text-2xl font-bold">{flight.departure.time}</div>
              <div className="text-sm text-muted-foreground">{flight.departure.airport}</div>
              <div className="text-xs text-muted-foreground">{flight.departure.date}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="h-px bg-gray-300 flex-1"></div>
                <Plane className="h-4 w-4 text-gray-400" />
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{flight.duration}</span>
              </div>
              <div className="text-xs text-muted-foreground">{flight.aircraft}</div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="text-2xl font-bold">{flight.arrival.time}</div>
              <div className="text-sm text-muted-foreground">{flight.arrival.airport}</div>
              <div className="text-xs text-muted-foreground">{flight.arrival.date}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:flex-row items-center lg:items-end justify-between lg:justify-end space-y-2 lg:space-y-0 lg:space-x-4">
          <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
          <Button 
            className="w-full lg:w-auto" 
            onClick={onSelect}
          >
            Select Flight
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)

export function FlightResults({ results, onFlightSelect }: FlightResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-5 w-5" />
            <span>Outbound Flights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.outbound.map((flight) => (
            <FlightCard 
              key={flight.id} 
              flight={flight} 
              onSelect={() => {
                console.log('Outbound flight selected:', flight)
                onFlightSelect(flight, 'outbound')
              }}
            />
          ))}
        </CardContent>
      </Card>

      {results.return && results.return.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="h-5 w-5 rotate-180" />
              <span>Return Flights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.return.map((flight) => (
              <FlightCard 
                key={flight.id} 
                flight={flight} 
                onSelect={() => {
                  console.log('Return flight selected:', flight)
                  onFlightSelect(flight, 'return')
                }}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
