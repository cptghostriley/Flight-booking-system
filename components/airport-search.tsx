"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronsUpDown, MapPin } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Airport {
  code: string
  name: string
  city: string
  country: string
}

interface AirportSearchProps {
  placeholder?: string
  onSelect: (airport: Airport) => void
  selectedAirport: Airport | null
}

export function AirportSearch({ placeholder = "Search airports...", onSelect, selectedAirport }: AirportSearchProps) {
  const [open, setOpen] = useState(false)
  const [airports, setAirports] = useState<Airport[]>([])
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAirports = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/airports')
        if (response.ok) {
          const data = await response.json()
          setAirports(data)
          setFilteredAirports(data)
        }
      } catch (error) {
        console.error('Failed to fetch airports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAirports()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAirports(airports)
    } else {
      const filtered = airports.filter(airport => 
        airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredAirports(filtered)
    }
  }, [searchTerm, airports])

  const handleAirportSelect = (airport: Airport) => {
    console.log('Airport selected:', airport)
    onSelect(airport)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAirport ? (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">
                {selectedAirport.code} - {selectedAirport.city}, {selectedAirport.country}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <div className="p-2">
          <Input
            placeholder="Search airports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading airports...</div>
          ) : filteredAirports.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No airports found.</div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredAirports.map((airport) => (
                <div
                  key={airport.code}
                  onClick={() => handleAirportSelect(airport)}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent",
                    selectedAirport?.code === airport.code && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedAirport?.code === airport.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1">
                    <div className="font-medium">
                      {airport.code} - {airport.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {airport.city}, {airport.country}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
