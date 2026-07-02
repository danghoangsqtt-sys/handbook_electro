import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleComponents = [
  {
    name: 'ESP32 WROOM-32',
    category: 'MCU',
    interface: 'Wi-Fi, Bluetooth, I2C, SPI',
    specs: { vcc: '3.3V', pkg: 'SMD', clock: '240MHz' },
    image_url: 'https://placehold.co/300x200?text=ESP32',
    datasheet_url: '#',
    description: 'Vi điều khiển ESP32 hỗ trợ Wi-Fi và Bluetooth.'
  },
  {
    name: 'DHT22',
    category: 'Sensor',
    interface: 'Digital (1-Wire)',
    specs: { vcc: '3.3V-5V', temp_range: '-40~80°C', humidity_range: '0-100%' },
    image_url: 'https://placehold.co/300x200?text=DHT22',
    datasheet_url: '#',
    description: 'Cảm biến nhiệt độ và độ ẩm kỹ thuật số.'
  },
  {
    name: 'I2C LCD 1602',
    category: 'Display',
    interface: 'I2C',
    specs: { vcc: '5V', cols: 16, rows: 2 },
    image_url: 'https://placehold.co/300x200?text=LCD+1602',
    datasheet_url: '#',
    description: 'Màn hình LCD 16x2 sử dụng giao tiếp I2C.'
  },
  {
    name: 'L298N Motor Driver',
    category: 'Module',
    interface: 'Digital/PWM',
    specs: { vcc: '5V-35V', max_current: '2A' },
    image_url: 'https://placehold.co/300x200?text=L298N',
    datasheet_url: '#',
    description: 'Module điều khiển động cơ DC kép và bước.'
  },
  {
    name: 'BME280',
    category: 'Sensor',
    interface: 'I2C, SPI',
    specs: { vcc: '3.3V', temp: 'yes', humidity: 'yes', pressure: 'yes' },
    image_url: 'https://placehold.co/300x200?text=BME280',
    datasheet_url: '#',
    description: 'Cảm biến môi trường 3 trong 1 (Nhiệt độ, Độ ẩm, Áp suất).'
  }
];

async function seed() {
  console.log("Bắt đầu nạp dữ liệu mẫu vào bảng components...");
  
  // Xoá dữ liệu cũ (tuỳ chọn)
  // await supabase.from('components').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase
    .from('components')
    .insert(sampleComponents)
    .select();

  if (error) {
    console.error("Lỗi khi nạp dữ liệu:", error);
  } else {
    console.log(`Đã nạp thành công ${data.length} linh kiện mẫu!`);
  }
}

seed();
