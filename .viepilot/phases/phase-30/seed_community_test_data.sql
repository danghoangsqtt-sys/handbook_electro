-- ============================================================
-- SEED: Tạo 10 tài khoản test + 10 bài đăng cộng đồng
-- Chạy file này trong Supabase SQL Editor (chạy toàn bộ 1 lần)
-- ============================================================

-- Bước 1: Tạo 10 users giả trong auth.users
-- (Chỉ có thể làm trong SQL Editor với quyền postgres)
DO $$
DECLARE
  user_ids UUID[] := ARRAY[
    'a1b2c3d4-0001-0000-0000-000000000001'::uuid,
    'a1b2c3d4-0002-0000-0000-000000000002'::uuid,
    'a1b2c3d4-0003-0000-0000-000000000003'::uuid,
    'a1b2c3d4-0004-0000-0000-000000000004'::uuid,
    'a1b2c3d4-0005-0000-0000-000000000005'::uuid,
    'a1b2c3d4-0006-0000-0000-000000000006'::uuid,
    'a1b2c3d4-0007-0000-0000-000000000007'::uuid,
    'a1b2c3d4-0008-0000-0000-000000000008'::uuid,
    'a1b2c3d4-0009-0000-0000-000000000009'::uuid,
    'a1b2c3d4-0010-0000-0000-000000000010'::uuid
  ];
  emails TEXT[] := ARRAY[
    'nguyen.minh.tuan@test.vn',
    'le.thi.hoa@test.vn',
    'tran.van.nam@test.vn',
    'pham.quoc.bao@test.vn',
    'hoang.duc.anh@test.vn',
    'vu.thi.lan@test.vn',
    'do.manh.cuong@test.vn',
    'nguyen.thi.mai@test.vn',
    'bui.van.long@test.vn',
    'dang.ngoc.ha@test.vn'
  ];
  names TEXT[] := ARRAY[
    'Nguyễn Minh Tuấn',
    'Lê Thị Hoa',
    'Trần Văn Nam',
    'Phạm Quốc Bảo',
    'Hoàng Đức Anh',
    'Vũ Thị Lan',
    'Đỗ Mạnh Cường',
    'Nguyễn Thị Mai',
    'Bùi Văn Long',
    'Đặng Ngọc Hà'
  ];
  i INT;
BEGIN
  FOR i IN 1..10 LOOP
    -- Insert vào auth.users (bypass trigger để tự quản lý)
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      user_ids[i],
      '00000000-0000-0000-0000-000000000000',
      emails[i],
      crypt('Test@12345', gen_salt('bf')),
      now(),
      now() - (i || ' days')::interval,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', names[i]),
      false,
      'authenticated'
    ) ON CONFLICT (id) DO NOTHING;

    -- Insert profile (đã phê duyệt)
    INSERT INTO public.profiles (id, display_name, email, avatar_url, is_approved, streak_days, total_flashcards_viewed)
    VALUES (
      user_ids[i],
      names[i],
      emails[i],
      'https://ui-avatars.com/api/?name=' || replace(names[i], ' ', '+') || '&background=3b82f6&color=fff&size=128',
      true,  -- ĐÃ PHÊ DUYỆT
      floor(random() * 30)::int,
      floor(random() * 200)::int
    ) ON CONFLICT (id) DO UPDATE
      SET is_approved = true, display_name = EXCLUDED.display_name;
  END LOOP;
END $$;


-- Bước 2: Tạo 10 bài đăng cộng đồng (nếu profiles đã tồn tại)
INSERT INTO public.public_projects (user_id, title, description, bom_data, diagram_code, likes_count, created_at)
VALUES
-- Post 1: Nguyễn Minh Tuấn - Trạm thời tiết IoT
(
  'a1b2c3d4-0001-0000-0000-000000000001',
  'Trạm Thời Tiết IoT với ESP32',
  'Dự án xây dựng trạm đo thời tiết thông minh sử dụng ESP32 và cảm biến BME280. Dữ liệu được gửi lên MQTT broker và hiển thị trên dashboard Grafana. Độ chính xác nhiệt độ ±0.5°C, độ ẩm ±2%.',
  '[{"id":"esp32","name":"ESP32 WROOM-32","category":"MCU","quantity":1,"image_url":null},{"id":"bme280","name":"BME280","category":"Sensor","quantity":1,"image_url":null},{"id":"oled096","name":"OLED 0.96 inch","category":"Display","quantity":1,"image_url":null},{"id":"18650","name":"Pin 18650 Li-Ion","category":"Power","quantity":2,"image_url":null}]',
  'graph LR\n  A[ESP32] --> B[BME280]\n  A --> C[OLED]\n  A --> D[Wi-Fi MQTT]',
  24,
  now() - '2 days'::interval
),
-- Post 2: Lê Thị Hoa - Robot dò đường
(
  'a1b2c3d4-0002-0000-0000-000000000002',
  'Robot Dò Đường Line Follower với Arduino',
  'Robot tự động dò theo đường kẻ đen trên nền trắng. Sử dụng cảm biến hồng ngoại TCRT5000 x5 và thuật toán PID. Tốc độ tối đa 0.8 m/s, sai số theo đường < 5mm.',
  '[{"id":"uno","name":"Arduino Uno R3","category":"MCU","quantity":1,"image_url":null},{"id":"l298n","name":"L298N Motor Driver","category":"Driver","quantity":1,"image_url":null},{"id":"tcrt5000","name":"TCRT5000 IR Sensor","category":"Sensor","quantity":5,"image_url":null},{"id":"dcmotor","name":"DC Motor 12V","category":"Actuator","quantity":2,"image_url":null},{"id":"servo","name":"Servo SG90","category":"Actuator","quantity":1,"image_url":null}]',
  'graph TD\n  A[Arduino Uno] --> B[L298N Driver]\n  A --> C[TCRT5000 x5]\n  B --> D[Motor Trái]\n  B --> E[Motor Phải]',
  18,
  now() - '3 days'::interval
),
-- Post 3: Trần Văn Nam - Khóa RFID
(
  'a1b2c3d4-0003-0000-0000-000000000003',
  'Hệ Thống Khóa Cửa RFID + Keypad',
  'Khóa thông minh sử dụng thẻ RFID MFRC522 kết hợp bàn phím số 4x4. Lưu tối đa 50 thẻ RFID, có tính năng chống giả mạo và ghi log vào EEPROM. Cung cấp nguồn qua adapter 12V.',
  '[{"id":"uno","name":"Arduino Uno R3","category":"MCU","quantity":1,"image_url":null},{"id":"mfrc522","name":"MFRC522 RFID","category":"Module","quantity":1,"image_url":null},{"id":"keypad44","name":"Keypad 4x4","category":"Input","quantity":1,"image_url":null},{"id":"solenoid","name":"Solenoid Lock 12V","category":"Actuator","quantity":1,"image_url":null},{"id":"relay","name":"Relay Module 5V","category":"Module","quantity":1,"image_url":null},{"id":"lcd1602","name":"I2C LCD 1602","category":"Display","quantity":1,"image_url":null}]',
  'graph LR\n  A[Arduino] --> B[MFRC522]\n  A --> C[Keypad 4x4]\n  A --> D[LCD 1602]\n  A --> E[Relay] --> F[Solenoid Lock]',
  31,
  now() - '5 days'::interval
),
-- Post 4: Phạm Quốc Bảo - Đèn thông minh
(
  'a1b2c3d4-0004-0000-0000-000000000004',
  'Hệ Thống Đèn Thông Minh Điều Khiển Bằng Giọng Nói',
  'Điều khiển đèn LED thông qua Google Assistant hoặc Alexa sử dụng ESP8266 kết nối với nền tảng IoT. Hỗ trợ điều chỉnh độ sáng, màu sắc (LED RGB). Tích hợp lịch bật/tắt tự động.',
  '[{"id":"d1mini","name":"ESP8266 D1 Mini","category":"MCU","quantity":1,"image_url":null},{"id":"ledrgb","name":"LED RGB WS2812B","category":"LED","quantity":30,"image_url":null},{"id":"relay2ch","name":"Relay 2 Kênh","category":"Module","quantity":1,"image_url":null},{"id":"psu5v","name":"Nguồn 5V 3A","category":"Power","quantity":1,"image_url":null}]',
  null,
  42,
  now() - '7 days'::interval
),
-- Post 5: Hoàng Đức Anh - Xe tự lái mini
(
  'a1b2c3d4-0005-0000-0000-000000000005',
  'Xe Tự Lái Mini Tránh Vật Cản',
  'Xe robot mini tự động di chuyển và tránh vật cản sử dụng cảm biến siêu âm HC-SR04. Thuật toán tránh vật cản dựa trên logic mờ (fuzzy logic). Nguồn pin LiPo 7.4V.',
  '[{"id":"uno","name":"Arduino Uno R3","category":"MCU","quantity":1,"image_url":null},{"id":"hcsr04","name":"HC-SR04 Ultrasonic","category":"Sensor","quantity":3,"image_url":null},{"id":"l298n","name":"L298N Motor Driver","category":"Driver","quantity":1,"image_url":null},{"id":"dcmotor","name":"DC Motor TT","category":"Actuator","quantity":4,"image_url":null},{"id":"lipo74","name":"LiPo 7.4V 2000mAh","category":"Power","quantity":1,"image_url":null}]',
  'graph LR\n  HC-SR04_Trước --> Arduino\n  HC-SR04_Trái --> Arduino\n  HC-SR04_Phải --> Arduino\n  Arduino --> L298N --> Bánh_Xe',
  15,
  now() - '10 days'::interval
),
-- Post 6: Vũ Thị Lan - Màn hình điểm danh
(
  'a1b2c3d4-0006-0000-0000-000000000006',
  'Hệ Thống Điểm Danh Bằng Nhận Dạng Khuôn Mặt',
  'Kết hợp Raspberry Pi 4 với camera để nhận dạng khuôn mặt và điểm danh tự động. Sử dụng thư viện OpenCV + face_recognition. Lưu dữ liệu điểm danh vào Google Sheets thông qua API.',
  '[{"id":"rpi4","name":"Raspberry Pi 4 4GB","category":"SBC","quantity":1,"image_url":null},{"id":"picam","name":"Raspberry Pi Camera V2","category":"Sensor","quantity":1,"image_url":null},{"id":"lcd7","name":"LCD 7 inch Touchscreen","category":"Display","quantity":1,"image_url":null}]',
  null,
  38,
  now() - '12 days'::interval
),
-- Post 7: Đỗ Mạnh Cường - Đồng hồ ma trận LED
(
  'a1b2c3d4-0007-0000-0000-000000000007',
  'Đồng Hồ Điện Tử Ma Trận LED 8x8',
  'Đồng hồ điện tử sử dụng 4 module ma trận LED 8x8 MAX7219 hiển thị giờ, phút, nhiệt độ phòng. Đồng bộ thời gian qua NTP khi có Wi-Fi. Điều chỉnh độ sáng tự động theo ánh sáng môi trường.',
  '[{"id":"esp8266","name":"ESP8266 NodeMCU","category":"MCU","quantity":1,"image_url":null},{"id":"max7219","name":"LED Matrix 8x8 MAX7219","category":"Display","quantity":4,"image_url":null},{"id":"ds3231","name":"RTC DS3231","category":"Module","quantity":1,"image_url":null},{"id":"ldr","name":"LDR Photoresistor","category":"Sensor","quantity":1,"image_url":null}]',
  'graph LR\n  ESP8266 --> MAX7219_1\n  ESP8266 --> MAX7219_2\n  ESP8266 --> MAX7219_3\n  ESP8266 --> MAX7219_4\n  ESP8266 --> DS3231',
  27,
  now() - '15 days'::interval
),
-- Post 8: Nguyễn Thị Mai - Cân điện tử
(
  'a1b2c3d4-0008-0000-0000-000000000008',
  'Cân Điện Tử Thông Minh Kết Nối Bluetooth',
  'Cân điện tử tự chế với Load Cell 50kg và module HX711, hiển thị trên màn hình OLED. Truyền dữ liệu cân qua Bluetooth BLE đến smartphone. Độ chính xác 0.1g. Chế độ tare và hiệu chỉnh offset.',
  '[{"id":"nano","name":"Arduino Nano","category":"MCU","quantity":1,"image_url":null},{"id":"loadcell50","name":"Load Cell 50kg","category":"Sensor","quantity":4,"image_url":null},{"id":"hx711","name":"HX711 ADC Module","category":"Module","quantity":1,"image_url":null},{"id":"hc05","name":"HC-05 Bluetooth","category":"Module","quantity":1,"image_url":null},{"id":"oled096","name":"OLED 0.96 inch","category":"Display","quantity":1,"image_url":null}]',
  null,
  9,
  now() - '18 days'::interval
),
-- Post 9: Bùi Văn Long - Tưới cây tự động
(
  'a1b2c3d4-0009-0000-0000-000000000009',
  'Hệ Thống Tưới Cây Tự Động Thông Minh',
  'Tưới cây tự động theo lịch và theo độ ẩm đất. ESP32 đọc cảm biến độ ẩm đất FC-28, điều khiển máy bơm 12V qua relay. Có thể lập lịch tưới qua app Blynk hoặc đặt ngưỡng độ ẩm. Năng lượng từ pin mặt trời.',
  '[{"id":"esp32","name":"ESP32 WROOM-32","category":"MCU","quantity":1,"image_url":null},{"id":"fc28","name":"Cảm Biến Độ Ẩm Đất FC-28","category":"Sensor","quantity":4,"image_url":null},{"id":"relay4ch","name":"Module Relay 4 Kênh","category":"Module","quantity":1,"image_url":null},{"id":"pump12v","name":"Máy Bơm Mini 12V","category":"Actuator","quantity":1,"image_url":null},{"id":"solar","name":"Pin Mặt Trời 6V 2W","category":"Power","quantity":2,"image_url":null},{"id":"tp4056","name":"Module Sạc TP4056","category":"Power","quantity":1,"image_url":null}]',
  'graph TD\n  Solar --> TP4056 --> Battery\n  Battery --> ESP32\n  FC28_x4 --> ESP32\n  ESP32 --> Relay_4ch --> Pump',
  33,
  now() - '20 days'::interval
),
-- Post 10: Đặng Ngọc Hà - Bộ khuếch đại âm thanh
(
  'a1b2c3d4-0010-0000-0000-000000000010',
  'Bộ Khuếch Đại Âm Thanh Class-D với PAM8610',
  'Mạch khuếch đại âm thanh stereo Class-D sử dụng chip PAM8610, công suất 2x15W. Nguồn cấp 12V, hiệu suất 90%+. Thiết kế mạch in 2 lớp nhỏ gọn 60x40mm. Tích hợp điều chỉnh âm lượng và bộ lọc bass/treble.',
  '[{"id":"pam8610","name":"PAM8610 Amplifier IC","category":"IC","quantity":1,"image_url":null},{"id":"cap100uf","name":"Tụ 100uF 25V","category":"Passive","quantity":4,"image_url":null},{"id":"cap10uf","name":"Tụ 10uF 25V","category":"Passive","quantity":6,"image_url":null},{"id":"pot10k","name":"Biến Trở 10kΩ","category":"Passive","quantity":2,"image_url":null},{"id":"inductor","name":"Cuộn Cảm 10uH","category":"Passive","quantity":4,"image_url":null},{"id":"speaker","name":"Loa 4Ω 15W","category":"Output","quantity":2,"image_url":null}]',
  null,
  21,
  now() - '25 days'::interval
);

-- Xác nhận kết quả
SELECT 
  p.display_name,
  p.email,
  p.is_approved,
  COUNT(pp.id) as so_bai_dang
FROM public.profiles p
LEFT JOIN public.public_projects pp ON pp.user_id = p.id
WHERE p.id::text LIKE 'a1b2c3d4%'
GROUP BY p.id, p.display_name, p.email, p.is_approved
ORDER BY p.display_name;
