-- Seed dữ liệu mẫu linh kiện (Trích xuất và giả lập từ EleSelect do giới hạn bảo mật chống bot)
-- Đảm bảo bạn ĐÃ CHẠY file complete_components_schema.sql trước khi chạy file này

INSERT INTO public.components (name, category, interface, description, specs, image_url, shopee_link, is_active) VALUES
(
  'ESP32-WROOM-32', 
  'MCU', 
  'Wi-Fi, Bluetooth, SPI, I2C, UART', 
  'Wi-Fi & Bluetooth MCU module (Lấy từ eleselect.com)', 
  '{"vcc": "2.2-3.6V", "imax": "500mA", "flash": "4MB"}'::jsonb, 
  'https://raw.githubusercontent.com/espressif/arduino-esp32/master/docs/assets/esp32_wroom_32.jpg', 
  '', 
  true
),
(
  'ATmega328P', 
  'MCU', 
  'SPI, I2C, UART', 
  '8-bit AVR Microcontroller (Lấy từ eleselect.com)', 
  '{"vcc": "1.8-5.5V", "imax": "20mA", "flash": "32KB"}'::jsonb, 
  'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=200', 
  '', 
  true
),
(
  'DHT11', 
  'Sensor', 
  'Digital (1-Wire)', 
  'Cảm biến nhiệt độ và độ ẩm cơ bản', 
  '{"vcc": "3.3-5V", "temp_range": "0-50°C", "hum_range": "20-90%"}'::jsonb, 
  'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=200', 
  '', 
  true
),
(
  'BME280', 
  'Sensor', 
  'I2C, SPI', 
  'Cảm biến nhiệt độ, độ ẩm và áp suất độ chính xác cao', 
  '{"vcc": "1.71-3.6V", "temp_range": "-40-85°C"}'::jsonb, 
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200', 
  '', 
  true
),
(
  'OLED 0.96"', 
  'Display', 
  'I2C, SPI', 
  'Màn hình OLED 0.96 inch SSD1306', 
  '{"vcc": "3.3-5V", "resolution": "128x64", "color": "White/Blue"}'::jsonb, 
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200', 
  '', 
  true
);
