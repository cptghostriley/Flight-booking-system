-- Insert major airlines
INSERT INTO airlines (code, name) VALUES
('AA', 'American Airlines'),
('DL', 'Delta Air Lines'),
('UA', 'United Airlines'),
('WN', 'Southwest Airlines'),
('B6', 'JetBlue Airways'),
('AS', 'Alaska Airlines'),
('BA', 'British Airways'),
('LH', 'Lufthansa'),
('AF', 'Air France'),
('KL', 'KLM Royal Dutch Airlines'),
('EK', 'Emirates'),
('QR', 'Qatar Airways'),
('SQ', 'Singapore Airlines'),
('CX', 'Cathay Pacific'),
('JL', 'Japan Airlines'),
('NH', 'All Nippon Airways'),
('TG', 'Thai Airways'),
('MH', 'Malaysia Airlines'),
('QF', 'Qantas'),
('AC', 'Air Canada')

ON CONFLICT (code) DO NOTHING;
