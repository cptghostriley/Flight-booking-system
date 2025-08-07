-- Insert major world airports
INSERT INTO airports (code, name, city, country) VALUES
-- North America
('JFK', 'John F. Kennedy International Airport', 'New York', 'United States'),
('LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States'),
('ORD', 'O''Hare International Airport', 'Chicago', 'United States'),
('ATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States'),
('DFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'United States'),
('DEN', 'Denver International Airport', 'Denver', 'United States'),
('SFO', 'San Francisco International Airport', 'San Francisco', 'United States'),
('SEA', 'Seattle-Tacoma International Airport', 'Seattle', 'United States'),
('LAS', 'McCarran International Airport', 'Las Vegas', 'United States'),
('MIA', 'Miami International Airport', 'Miami', 'United States'),
('YYZ', 'Toronto Pearson International Airport', 'Toronto', 'Canada'),
('YVR', 'Vancouver International Airport', 'Vancouver', 'Canada'),

-- Europe
('LHR', 'Heathrow Airport', 'London', 'United Kingdom'),
('CDG', 'Charles de Gaulle Airport', 'Paris', 'France'),
('FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany'),
('AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands'),
('MAD', 'Madrid-Barajas Airport', 'Madrid', 'Spain'),
('FCO', 'Leonardo da Vinci International Airport', 'Rome', 'Italy'),
('MUC', 'Munich Airport', 'Munich', 'Germany'),
('ZUR', 'Zurich Airport', 'Zurich', 'Switzerland'),
('VIE', 'Vienna International Airport', 'Vienna', 'Austria'),
('CPH', 'Copenhagen Airport', 'Copenhagen', 'Denmark'),

-- Asia
('NRT', 'Narita International Airport', 'Tokyo', 'Japan'),
('HND', 'Haneda Airport', 'Tokyo', 'Japan'),
('ICN', 'Incheon International Airport', 'Seoul', 'South Korea'),
('PEK', 'Beijing Capital International Airport', 'Beijing', 'China'),
('PVG', 'Shanghai Pudong International Airport', 'Shanghai', 'China'),
('HKG', 'Hong Kong International Airport', 'Hong Kong', 'Hong Kong'),
('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore'),
('BKK', 'Suvarnabhumi Airport', 'Bangkok', 'Thailand'),
('KUL', 'Kuala Lumpur International Airport', 'Kuala Lumpur', 'Malaysia'),
('DEL', 'Indira Gandhi International Airport', 'New Delhi', 'India'),
('BOM', 'Chhatrapati Shivaji International Airport', 'Mumbai', 'India'),

-- Middle East
('DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates'),
('DOH', 'Hamad International Airport', 'Doha', 'Qatar'),
('AUH', 'Abu Dhabi International Airport', 'Abu Dhabi', 'United Arab Emirates'),
('KWI', 'Kuwait International Airport', 'Kuwait City', 'Kuwait'),

-- Oceania
('SYD', 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia'),
('MEL', 'Melbourne Airport', 'Melbourne', 'Australia'),
('AKL', 'Auckland Airport', 'Auckland', 'New Zealand'),

-- South America
('GRU', 'São Paulo-Guarulhos International Airport', 'São Paulo', 'Brazil'),
('EZE', 'Ezeiza International Airport', 'Buenos Aires', 'Argentina'),
('BOG', 'El Dorado International Airport', 'Bogotá', 'Colombia'),
('LIM', 'Jorge Chávez International Airport', 'Lima', 'Peru'),

-- Africa
('CAI', 'Cairo International Airport', 'Cairo', 'Egypt'),
('JNB', 'O.R. Tambo International Airport', 'Johannesburg', 'South Africa'),
('CPT', 'Cape Town International Airport', 'Cape Town', 'South Africa'),
('LOS', 'Murtala Muhammed International Airport', 'Lagos', 'Nigeria')

ON CONFLICT (code) DO NOTHING;
