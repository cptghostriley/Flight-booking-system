"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAirports = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/airports')
        if (response.ok) {
          const data = await response.json()
          setAirports(data)
        }
      } catch (error) {
        console.error('Failed to fetch airports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAirports()
  }, [])

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
        <Command>
          <CommandInput placeholder="Search airports..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading airports..." : "No airports found."}
            </CommandEmpty>
            <CommandGroup>
              {airports.map((airport) => (
                <CommandItem
                  key={airport.code}
                  value={`${airport.code} ${airport.name} ${airport.city} ${airport.country}`}
                  onSelect={() => {
                    onSelect(airport)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedAirport?.code === airport.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <div className="font-medium">
                      {airport.code} - {airport.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {airport.city}, {airport.country}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
