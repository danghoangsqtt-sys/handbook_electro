import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const components = [
  {
    name: 'ESP32-WROOM-32', 
    category: 'MCU', 
    interface: 'Wi-Fi, Bluetooth, SPI, I2C, UART', 
    description: 'Wi-Fi & Bluetooth MCU module (Lấy từ eleselect.com)', 
    specs: { vcc: "2.2-3.6V", imax: "500mA", flash: "4MB" }, 
    image_url: 'https://raw.githubusercontent.com/espressif/arduino-esp32/master/docs/assets/esp32_wroom_32.jpg', 
    shopee_link: '', 
    is_active: true
  },
  {
    name: 'ATmega328P', 
    category: 'MCU', 
    interface: 'SPI, I2C, UART', 
    description: '8-bit AVR Microcontroller (Lấy từ eleselect.com)', 
    specs: { vcc: "1.8-5.5V", imax: "20mA", flash: "32KB" }, 
    image_url: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=200', 
    shopee_link: '', 
    is_active: true
  },
  {
    name: 'DHT11', 
    category: 'Sensor', 
    interface: 'Digital (1-Wire)', 
    description: 'Cảm biến nhiệt độ và độ ẩm cơ bản', 
    specs: { vcc: "3.3-5V", temp_range: "0-50°C", hum_range: "20-90%" }, 
    image_url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=200', 
    shopee_link: '', 
    is_active: true
  },
  {
    name: 'BME280', 
    category: 'Sensor', 
    interface: 'I2C, SPI', 
    description: 'Cảm biến nhiệt độ, độ ẩm và áp suất độ chính xác cao', 
    specs: { vcc: "1.71-3.6V", temp_range: "-40-85°C" }, 
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200', 
    shopee_link: '', 
    is_active: true
  },
  {
    name: 'OLED 0.96"', 
    category: 'Display', 
    interface: 'I2C, SPI', 
    description: 'Màn hình OLED 0.96 inch SSD1306', 
    specs: { vcc: "3.3-5V", resolution: "128x64", color: "White/Blue" }, 
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200', 
    shopee_link: '', 
    is_active: true
  }
];

async function seed() {
  console.log('Seeding components to Supabase...');
  const { error } = await supabase.from('components').insert(components);
  
  if (error) {
    console.error('Error inserting data:', error.message);
  } else {
    console.log('Successfully inserted components!');
  }
}

seed();
