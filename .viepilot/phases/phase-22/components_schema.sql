-- Supabase Schema for Component Library (Phase 22)

-- 1. Create components table
CREATE TABLE IF NOT EXISTS public.components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    interface TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    datasheet_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for searching/filtering
CREATE INDEX IF NOT EXISTS idx_components_category ON public.components(category);
CREATE INDEX IF NOT EXISTS idx_components_name ON public.components(name);

-- 3. Setup Row Level Security (RLS)
-- ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
-- For now, allow anonymous read access
-- CREATE POLICY "Allow public read access" ON public.components FOR SELECT USING (true);

-- 4. Sample Seed Data (For testing the UI)
INSERT INTO public.components (name, category, interface, specs, image_url, datasheet_url, description)
VALUES 
('ESP32 WROOM-32', 'MCU', 'Wi-Fi, Bluetooth, I2C, SPI', '{"vcc": "3.3V", "pkg": "SMD", "clock": "240MHz"}', 'https://via.placeholder.com/300x200?text=ESP32', '#', 'Vi điều khiển ESP32 hỗ trợ Wi-Fi và Bluetooth.'),
('DHT22', 'Sensor', 'Digital (1-Wire)', '{"vcc": "3.3V-5V", "temp_range": "-40~80°C", "humidity_range": "0-100%"}', 'https://via.placeholder.com/300x200?text=DHT22', '#', 'Cảm biến nhiệt độ và độ ẩm kỹ thuật số.'),
('I2C LCD 1602', 'Display', 'I2C', '{"vcc": "5V", "cols": 16, "rows": 2}', 'https://via.placeholder.com/300x200?text=LCD+1602', '#', 'Màn hình LCD 16x2 sử dụng giao tiếp I2C.'),
('L298N Motor Driver', 'Module', 'Digital/PWM', '{"vcc": "5V-35V", "max_current": "2A"}', 'https://via.placeholder.com/300x200?text=L298N', '#', 'Module điều khiển động cơ DC kép và bước.'),
('BME280', 'Sensor', 'I2C, SPI', '{"vcc": "3.3V", "temp": "yes", "humidity": "yes", "pressure": "yes"}', 'https://via.placeholder.com/300x200?text=BME280', '#', 'Cảm biến môi trường 3 trong 1 (Nhiệt độ, Độ ẩm, Áp suất).')
ON CONFLICT DO NOTHING;
