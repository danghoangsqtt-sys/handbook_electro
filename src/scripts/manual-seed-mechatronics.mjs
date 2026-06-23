import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesDir = path.join(__dirname, '../../public/data/categories');
const filePath = path.join(categoriesDir, 'co_dien_tu.json');

// Hàm tạo UUID giả lập
function generateId() {
  return 'mech_' + Math.random().toString(36).substring(2, 9);
}

const termsToInsert = [
  // 1-20: Robotics & Automation
  { term: "SCARA", fullName: "Selective Compliance Assembly Robot Arm", definition: "Robot SCARA, cánh tay robot có độ cứng cao theo trục Z nhưng linh hoạt ở mặt phẳng XY, chuyên dùng để lắp ráp nhanh.", applications: ["Lắp ráp bo mạch điện tử", "Gắp bỏ sản phẩm tốc độ cao", "Phân loại linh kiện tự động"] },
  { term: "Delta Robot", fullName: "Delta Parallel Robot", definition: "Robot song song kiểu nhện với 3 cánh tay nối chung vào một đế gắp, tốc độ di chuyển cực kỳ nhanh và gia tốc lớn.", applications: ["Đóng gói bánh kẹo nhà máy", "Phân loại dược phẩm", "Lắp ráp đồng hồ chính xác"] },
  { term: "Cartesian Robot", fullName: "Cartesian Coordinate Robot", definition: "Robot tịnh tiến tuyến tính hoạt động hoàn toàn trên hệ trục tọa độ vuông góc X, Y, Z.", applications: ["Máy in 3D FDM", "Máy cắt laser công nghiệp", "Cẩu trục gắp container"] },
  { term: "Cobot", fullName: "Collaborative Robot", definition: "Robot cộng tác, thiết kế thân thiện tích hợp cảm biến an toàn để làm việc chung trực tiếp với con người trong cùng không gian.", applications: ["Lắp ráp ô tô cùng công nhân", "Robot phụ mổ y tế", "Kiểm tra chất lượng đóng gói"] },
  { term: "Humanoid Robot", fullName: "Humanoid Robot", definition: "Robot hình người mô phỏng cấu trúc sinh học con người với hai tay, hai chân để đi lại và làm việc trong môi trường sống.", applications: ["Robot Tesla Optimus", "Nghiên cứu AI tương tác", "Chăm sóc người già"] },
  { term: "Exoskeleton", fullName: "Robotic Exoskeleton", definition: "Khung xương robot ngoài có thể mặc lên người giúp trợ lực cơ khí khuếch đại sức mạnh hoặc hỗ trợ phục hồi chức năng.", applications: ["Nâng vật nặng trong nhà máy", "Hỗ trợ người khuyết tật đi bộ", "Trang bị quân sự siêu chiến binh"] },
  { term: "Hexapod", fullName: "Hexapod Robot / Stewart Platform", definition: "Robot sáu chân hoặc bệ mô phỏng động học song song với 6 xi lanh điều khiển tạo ra 6 bậc tự do cực kì vững chắc.", applications: ["Buồng mô phỏng bay phi công", "Kính viễn vọng tự căn chỉnh", "Robot nhện dò mìn"] },
  { term: "Swarm Robotics", fullName: "Swarm Robotics", definition: "Robot bầy đàn, hệ thống bao gồm hàng trăm robot nhỏ phối hợp tập thể tạo ra trí tuệ quần thể giống đàn kiến hay bầy ong.", applications: ["Drone trình diễn ánh sáng", "Tìm kiếm cứu nạn diện rộng", "Thám hiểm hành tinh ngoài Trái Đất"] },
  { term: "Soft Robotics", fullName: "Soft Robotics", definition: "Chế tạo robot bằng vật liệu mềm đàn hồi (như silicone, cao su) thay vì kim loại cứng, mô phỏng cơ bắp sinh học.", applications: ["Gắp trái cây dễ dập nát", "Robot y tế nội soi tàng hình", "Robot bạch tuộc dưới biển sâu"] },
  { term: "ASRS", fullName: "Automated Storage and Retrieval System", definition: "Hệ thống nhà kho tự động kết hợp giá đỡ khổng lồ và robot trượt để cất và lấy hàng hóa cực kì tối ưu không cần xe nâng tay.", applications: ["Tổng kho Amazon", "Kho lạnh lưu trữ dược phẩm", "Kho phụ tùng ô tô khổng lồ"] },
  { term: "Conveyor System", fullName: "Automated Conveyor System", definition: "Hệ thống băng chuyền vận tải tự động liên tục điều hướng, di chuyển vật liệu giữa các trạm máy công nghiệp.", applications: ["Băng chuyền hành lý sân bay", "Dây chuyền khai thác than", "Kiểm hàng siêu thị"] },
  { term: "Pick and Place", fullName: "Pick and Place System", definition: "Hệ thống máy chuyên dụng thực hiện thao tác nhặt một linh kiện ở vị trí A và đặt chính xác xuống vị trí B liên tục.", applications: ["Máy cắm linh kiện SMD (SMT)", "Đóng hộp sô-cô-la", "Sắp xếp thẻ từ"] },
  { term: "Robotic Welding", fullName: "Robotic Welding", definition: "Công nghệ hàn tự động hóa bằng cánh tay robot cho độ chính xác vết hàn và tốc độ cực cao.", applications: ["Khung sườn xe Toyota", "Hàn đóng tàu", "Hàn vi mạch điện tử"] },
  { term: "Gripper", fullName: "Mechanical Gripper", definition: "Bàn tay kẹp cơ khí, công cụ phổ biến nhất gắn ở đầu robot để tạo lực kẹp kẹp chặt phôi liệu.", applications: ["Tay kẹp nhôm", "Kẹp gắp chi tiết nhựa nóng", "Bàn tay robot 3 ngón"] },
  { term: "Vacuum Gripper", fullName: "Vacuum Suction Gripper", definition: "Giác hút chân không, sử dụng lực hút áp suất âm để nhấc các mặt phẳng, tấm kính hay hộp giấy mà không làm hỏng bề mặt.", applications: ["Bốc xếp thùng Carton", "Lắp ráp kính chắn gió ô tô", "Gắp màn hình TV"] },
  { term: "Force Torque", fullName: "Force/Torque Sensor (F/T)", definition: "Cảm biến đo lực và mô men xoắn tại khớp cổ tay robot giúp robot cảm nhận được lực ấn mạnh hay nhẹ khi tiếp xúc vật thể.", applications: ["Đánh bóng bề mặt kim loại", "Lắp ráp bánh răng xe hơi", "Gắp trứng không vỡ"] },
  { term: "Vision Guided", fullName: "Vision Guided Robotics (VGR)", definition: "Robot dẫn đường bằng thị giác, gắn camera để mắt thấy và tự động điều chỉnh đường đi theo vị trí ngẫu nhiên của sản phẩm.", applications: ["Gắp sản phẩm lộn xộn trong thùng (Bin Picking)", "Lắp vít tự động", "Theo dõi vật thể trên băng chuyền"] },
  { term: "Laser Scanner", fullName: "Safety Laser Scanner", definition: "Thiết bị quét tia laser lập vùng an toàn 2D xung quanh khu vực máy nguy hiểm, tự dừng máy nếu có người bước vào.", applications: ["Bảo vệ trạm robot hàn", "Mắt thần chống va chạm cho AGV", "Kiểm soát an ninh kho"] },
  { term: "Light Curtain", fullName: "Safety Light Curtain", definition: "Rèm tia sáng hồng ngoại, màn chắn vô hình bằng ánh sáng tự động ngắt nguồn điện máy dập nếu bàn tay công nhân đưa vào.", applications: ["Bảo vệ máy dập kim loại", "Lối vào khu vực tự động hóa", "Cửa an toàn kho hàng"] },
  { term: "E-Stop", fullName: "Emergency Stop", definition: "Nút bấm dừng khẩn cấp màu đỏ, cắt đứt hoàn toàn nguồn điện động lực ngay lập tức trong trường hợp máy móc gặp sự cố nguy hiểm.", applications: ["Nút đỏ trên tủ điện điều khiển", "Dừng băng chuyền khi kẹt hàng", "Trang bị bắt buộc trên mọi máy CNC"] },

  // 21-40: Sensors & Actuators
  { term: "Optical Encoder", fullName: "Optical Rotary Encoder", definition: "Cảm biến mã hóa quang học đo góc quay và tốc độ động cơ bằng cách đếm số khe sáng bị che khuất trên một đĩa quay.", applications: ["Phản hồi tốc độ Servo Motor", "Đo chiều dài cáp kéo", "Bánh xe chuột máy tính"] },
  { term: "Magnetic Encoder", fullName: "Magnetic Rotary Encoder", definition: "Bộ mã hóa từ tính, đọc sự thay đổi từ trường của cực nam châm xoay để xác định góc quay, bền bỉ hơn trong môi trường bụi bẩn.", applications: ["Động cơ bước lai", "Khớp robot chống bụi nước", "Hệ thống lái trợ lực điện"] },
  { term: "Absolute Encoder", fullName: "Absolute Encoder", definition: "Mã hóa tuyệt đối cung cấp một giá trị mã bit duy nhất cho mỗi góc độ quay, không bao giờ bị quên vị trí kể cả khi mất điện đột ngột.", applications: ["Trục quay Anten Parabol", "Khớp tay robot y tế", "Trục điều khiển CNC cao cấp"] },
  { term: "Incremental", fullName: "Incremental Encoder", definition: "Mã hóa tương đối đếm các xung (A/B) để biết động cơ quay được bao nhiêu vòng, nhưng cần phải Home lại điểm 0 khi khởi động.", applications: ["Động cơ DC Servo", "Đo vòng quay bánh xe điện", "Máy in giấy"] },
  { term: "LVDT", fullName: "Linear Variable Differential Transformer", definition: "Máy biến áp vi sai biến thiên tuyến tính, cảm biến đo chuyển dịch thẳng siêu chính xác dùng lõi từ trường.", applications: ["Đo độ võng cầu đường", "Kiểm định kích thước piston", "Cảm biến vị trí van thủy lực"] },
  { term: "Hall Sensor", fullName: "Hall Effect Sensor", definition: "Cảm biến hiệu ứng Hall đo lường biến thiên từ trường để phát hiện từ tính, dòng điện hoặc vị trí của nam châm.", applications: ["Đo tốc độ xe đạp điện", "Cảm biến vị trí Rotor BLDC", "Đo dòng điện một chiều kẹp kìm"] },
  { term: "Capacitive Prox", fullName: "Capacitive Proximity Sensor", definition: "Cảm biến tiệm cận điện dung phát hiện vật thể ở gần (kể cả phi kim như nhựa, nước, gỗ) bằng sự thay đổi hằng số điện môi.", applications: ["Báo cạn mức nước trong bồn", "Phím cảm ứng điện thoại", "Phát hiện hộp sữa giấy trên băng tải"] },
  { term: "Inductive Prox", fullName: "Inductive Proximity Sensor", definition: "Cảm biến tiệm cận cảm ứng từ chuyên dùng để phát hiện kim loại sắt từ ở khoảng cách gần mà không cần chạm.", applications: ["Đếm số lượng vỏ lon bia kim loại", "Công tắc hành trình cửa sắt", "Công tắc Z-Probe máy in 3D"] },
  { term: "Photoelectric", fullName: "Photoelectric Sensor", definition: "Cảm biến quang điện dùng tia hồng ngoại hoặc tia laser phát và thu tín hiệu ánh sáng để phát hiện sự có mặt của vật thể từ xa.", applications: ["Cảm biến chống kẹt cửa thang máy", "Băng chuyền đếm sản phẩm", "Kiểm tra màng bọc nilong"] },
  { term: "Ultrasonic", fullName: "Ultrasonic Sensor", definition: "Cảm biến siêu âm phát sóng âm thanh tần số cao và đo thời gian vọng lại để tính khoảng cách tới vật cản.", applications: ["Radar lùi xe ô tô", "Đo mức nước bể chứa hóa chất", "Tránh vật cản drone"] },
  { term: "Thermocouple", fullName: "Thermocouple", definition: "Cặp nhiệt điện, gồm hai dây kim loại khác nhau hàn dính ở một đầu, sinh ra điện áp cực nhỏ khi nung nóng để đo nhiệt độ cực đại.", applications: ["Đo nhiệt độ lò nung thép", "Lò đốt rác công nghiệp", "Đầu in 3D"] },
  { term: "RTD", fullName: "Resistance Temperature Detector", definition: "Nhiệt điện trở kim loại nguyên chất (thường là Bạch kim Pt100) có điện trở thay đổi siêu tuyến tính theo nhiệt độ, độ chính xác cực cao.", applications: ["Thiết bị phân tích phòng thí nghiệm", "Chưng cất dầu mỏ", "Tủ lạnh y tế"] },
  { term: "Thermistor", fullName: "Thermistor (NTC/PTC)", definition: "Điện trở nhiệt bằng vật liệu bán dẫn (NTC/PTC) thay đổi điện trở cực mạnh theo nhiệt độ, giá thành cực rẻ nhưng đo phi tuyến tính.", applications: ["Đo nhiệt độ nước máy giặt", "Nhiệt kế điện tử kẹp nách", "Bảo vệ quá nhiệt bo mạch"] },
  { term: "Piezoelectric", fullName: "Piezoelectric Sensor", definition: "Cảm biến áp điện biến lực ấn cơ học hoặc rung động đột ngột thành điện áp nhờ hiệu ứng tinh thể thạch anh.", applications: ["Microphone điện rung", "Cảm biến phát hiện kích nổ động cơ xe", "Đầu đánh lửa bếp gas"] },
  { term: "Piezo Actuator", fullName: "Piezoelectric Actuator", definition: "Cơ cấu chấp hành áp điện biến điện áp thành biến dạng tịnh tiến siêu nhỏ (cấp độ nanomet) nhưng với lực cực mạnh.", applications: ["Kim phun nhiên liệu Diesel siêu tốc", "Chỉnh nét ống kính camera hiển vi", "Bơm định lượng hóa chất y tế"] },
  { term: "Linear Motor", fullName: "Linear Motor", definition: "Động cơ tuyến tính, thực chất là một động cơ quay được 'trải phẳng' ra để tạo chuyển động tịnh tiến trực tiếp mà không cần vít me bi.", applications: ["Tàu đệm từ Maglev", "Cửa trượt tàu điện ngầm", "Trục X máy mounter tốc độ cao"] },
  { term: "Voice Coil", fullName: "Voice Coil Motor (VCM)", definition: "Động cơ cuộn dây âm thanh chuyển động tịnh tiến nhanh, êm ái nhờ lực đẩy từ trường giống nguyên lý loa điện động.", applications: ["Lấy nét tự động Autofocus Camera iPhone", "Máy thở y tế", "Ổ đĩa cứng HDD"] },
  { term: "AC Servo", fullName: "AC Servo Motor", definition: "Động cơ xoay chiều sử dụng kết hợp với Encoder và mạch Driver hồi tiếp tạo ra chuyển động quay có vị trí và mô men cực kỳ chuẩn xác.", applications: ["Khớp cánh tay Robot công nghiệp", "Trục nạp giấy máy in công nghiệp", "Máy phay CNC 5 trục"] },
  { term: "DC Servo", fullName: "DC Servo Motor", definition: "Động cơ một chiều tích hợp vòng lặp điều khiển kín, kích thước gọn nhẹ dùng cho các hệ thống nhỏ cần chính xác.", applications: ["Khớp tay chân Robot mô hình", "Cánh tà máy bay điều khiển RC", "Máy quay phim tự động quay góc"] },
  { term: "Pneumatic Motor", fullName: "Pneumatic Air Motor", definition: "Động cơ khí nén dùng áp lực luồng khí nén đi qua cánh gạt để làm xoay trục cơ học, an toàn tuyệt đối do không có tia lửa điện.", applications: ["Súng vặn ốc lốp xe ô tô", "Môi trường hóa chất dễ nổ", "Dụng cụ nha khoa tốc độ cao"] },

  // 41-60: Control Systems & Signal Processing
  { term: "PID", fullName: "Proportional Integral Derivative Controller", definition: "Bộ điều khiển PID kinh điển tính toán và bù trừ sai số liên tục qua 3 khâu: Tỷ lệ (P), Tích phân (I), Vi phân (D) để giữ hệ thống ổn định.", applications: ["Giữ nhiệt độ máy ấp trứng", "Giữ thăng bằng xe điện hai bánh", "Giữ tốc độ xe ô tô Cruise Control"] },
  { term: "Proportional P", fullName: "Proportional Control", definition: "Khâu tỷ lệ P trong điều khiển, xuất tín hiệu điều chỉnh tỷ lệ thuận với mức độ sai số hiện tại của hệ thống.", applications: ["Bơm nước tăng áp", "Điều chỉnh lò xo cơ học", "Mô phỏng van tuyến tính"] },
  { term: "Integral I", fullName: "Integral Control", definition: "Khâu tích phân I tự động cộng dồn sai số tích lũy theo thời gian nhằm triệt tiêu hoàn toàn sai số xác lập (Steady State Error).", applications: ["Duy trì quỹ đạo tên lửa", "Cân bằng mức nước bồn chứa ổn định", "Khắc phục lực cản gió của Drone"] },
  { term: "Derivative D", fullName: "Derivative Control", definition: "Khâu vi phân D tính toán tốc độ biến thiên của sai số để dự đoán tương lai, giúp hãm phanh chống vọt lố (Overshoot) quá đà.", applications: ["Giảm sóc chủ động xe hơi", "Chống dao động tay robot khi dừng gấp", "Quạt làm mát siêu nhạy"] },
  { term: "LQR", fullName: "Linear Quadratic Regulator", definition: "Bộ điều chỉnh toàn phương tuyến tính, thuật toán điều khiển tối ưu tối thiểu hóa hàm chi phí của trạng thái và năng lượng đầu vào.", applications: ["Hệ thống cân bằng con lắc ngược", "Điều khiển chuyến bay không gian Apollo", "Điều hướng vệ tinh"] },
  { term: "Fuzzy Logic", fullName: "Fuzzy Logic Control", definition: "Điều khiển Logic mờ cho phép máy tính xử lý các trạng thái ngôn ngữ trung gian của con người (hơi nóng, khá lạnh) thay vì chỉ True/False.", applications: ["Máy giặt lồng ngang tự động chọn chế độ", "Hệ thống điều hòa Inverter thông minh", "Nhận dạng vân tay mờ"] },
  { term: "MPC", fullName: "Model Predictive Control", definition: "Điều khiển dự báo theo mô hình toán học dự đoán các trạng thái của hệ thống trong tương lai nhiều bước để tối ưu hóa quỹ đạo hiện tại.", applications: ["Lọc dầu hóa dầu", "Tối ưu hóa lưới điện tự động", "Xe tự lái xử lý khúc cua"] },
  { term: "Adaptive", fullName: "Adaptive Control", definition: "Hệ thống điều khiển thích nghi có khả năng tự động thay đổi thông số PID bên trong để phù hợp với môi trường động học đang bị biến đổi.", applications: ["Điều khiển máy bay khi rụng một cánh", "Cẩu trục khi bốc vật quá nặng tải", "Robot thay đổi công cụ gắp"] },
  { term: "H-infinity", fullName: "H-infinity Control", definition: "Lý thuyết điều khiển bền vững cao cấp giúp tổng hợp bộ điều khiển chịu đựng được mức độ sai số mô hình và nhiễu cực đoan lớn nhất.", applications: ["Trực thăng chiến đấu", "Khung gầm vệ tinh", "Hệ thống truyền tải năng lượng mạnh"] },
  { term: "Robust Control", fullName: "Robust Control", definition: "Điều khiển bền vững thiết kế các bộ điều khiển tĩnh đảm bảo hoạt động an toàn ngay cả khi thông số vật lý của máy bị sai lệch giới hạn.", applications: ["Ổn định điện áp lưới điện quốc gia", "Phản ứng hạt nhân", "Động cơ máy bơm công suất lớn"] },
  { term: "Deadband", fullName: "Deadband (Vùng chết)", definition: "Dải không phản hồi của một hệ thống cơ điện tử nơi tín hiệu đầu vào bị thay đổi nhỏ nhưng đầu ra không hề nhúc nhích.", applications: ["Chống hiện tượng nháy của van điện từ", "Giảm trễ bánh răng joystick tay cầm game", "Bộ ổn nhiệt điều hòa"] },
  { term: "Steady Error", fullName: "Steady State Error", definition: "Sai số xác lập (sai số vĩnh cửu), phần chênh lệch vẫn còn tồn tại giữa mục tiêu và thực tế sau khi hệ thống đã đi vào trạng thái tĩnh.", applications: ["Nhiệt độ phòng luôn lệch 1 độ C so với cài đặt trên điều khiển", "Động cơ quay chậm hơn mong muốn"] },
  { term: "Overshoot", fullName: "Overshoot (Độ vọt lố)", definition: "Mức độ giá trị thực tế của hệ thống bị vọt vượt qua điểm đích cài đặt ban đầu trong quá trình quá độ chuyển trạng thái.", applications: ["Xe điện phanh gấp bị trượt dài", "Lò nướng bánh quá nhiệt độ cháy mặt", "Kim đồng hồ tốc độ rung mạnh"] },
  { term: "Settling Time", fullName: "Settling Time", definition: "Thời gian thiết lập, khoảng thời gian chờ cần thiết để hệ thống dao động hội tụ ổn định nằm lọt trong biên độ sai số cho phép.", applications: ["Đợi cân điện tử ngừng nhảy số", "Khớp tay robot hết rung lắc", "Thời gian làm lạnh tủ đông"] },
  { term: "Rise Time", fullName: "Rise Time", definition: "Thời gian lên, thời gian để đầu ra hệ thống vọt từ 10% lên 90% giá trị đích mong muốn, thể hiện tính đáp ứng nhanh nhạy.", applications: ["Tốc độ bứt tốc 0-100km/h ô tô điện", "Thời gian xilanh đẩy ra hết cỡ", "Khởi động mô tơ quạt"] },
  { term: "Transfer Func", fullName: "Transfer Function", definition: "Hàm truyền đạt biến đổi Laplace tỷ lệ giữa tín hiệu ngõ ra và ngõ vào, mô tả toán học đặc tính động học của hệ thống tuyến tính.", applications: ["Mô phỏng máy bay trên phần mềm Matlab", "Thiết kế mạch lọc điện tử RLC", "Giảng dạy tự động hóa"] },
  { term: "Root Locus", fullName: "Root Locus", definition: "Quỹ đạo nghiệm số, một biểu đồ phân tích đánh giá tính ổn định hệ thống qua vị trí các điểm cực khi biến đổi một thông số (thường là độ lợi K).", applications: ["Chỉnh định Gain động cơ máy CNC", "Phân tích độ rung thiết bị cơ khí", "Thiết kế mạch khuếch đại"] },
  { term: "Bode Plot", fullName: "Bode Plot", definition: "Biểu đồ Bode, phương pháp trực quan đồ thị tần số để đo lường độ lợi và độ dịch pha của một hệ thống.", applications: ["Thiết kế mạch lọc âm thanh Amplifier", "Đo cộng hưởng cầu treo", "Lọc sóng nhiễu điện từ"] },
  { term: "Nyquist Plot", fullName: "Nyquist Plot", definition: "Đồ thị Nyquist trên mặt phẳng phức giúp kỹ sư phân tích biên độ dự trữ ổn định và pha của hệ thống mạch kín hoàn hảo.", applications: ["Lý thuyết tín hiệu Radar", "Kiểm tra sự ổn định khuếch đại tín hiệu 5G", "Điều khiển mạng điện tàu thủy"] },
  { term: "Z-Transform", fullName: "Z-Transform", definition: "Phép biến đổi Z rời rạc toán học dùng để chuyển từ miền thời gian mẫu rời rạc sang miền tần số, nền tảng của xử lý tín hiệu số DSP.", applications: ["Lập trình Filter âm thanh kỹ thuật số", "Thiết kế bộ điều khiển PID số vào vi điều khiển", "Nén ảnh JPEG"] },

  // 61-80: Mechanical & Drives
  { term: "Gear Ratio", fullName: "Gear Ratio", definition: "Tỷ số truyền động bánh răng đo lường mức độ giảm tốc độ quay để đổi lấy sự tăng cường mô men xoắn (lực kéo).", applications: ["Hộp số lùi ô tô (Gear 1, 2, 3...)", "Hộp giảm tốc mô tơ cửa cuốn", "Đĩa líp xe đạp leo dốc"] },
  { term: "Rack Pinion", fullName: "Rack and Pinion", definition: "Cơ cấu Bánh răng - Thanh răng, biến chuyển động quay tròn của bánh răng nhỏ thành chuyển động tịnh tiến dọc của một thanh răng phẳng.", applications: ["Hệ thống lái vô lăng xe ô tô", "Cơ cấu trượt cửa cổng điện", "Trục tịnh tiến máy cắt plasma CNC dài"] },
  { term: "Planetary Gear", fullName: "Planetary Gearbox", definition: "Hộp số hành tinh cực kỳ nhỏ gọn, bánh răng trung tâm (Mặt trời) truyền lực ra các bánh răng xung quanh (Hành tinh) bao bọc bởi vành răng ngoài.", applications: ["Mô tơ giảm tốc máy khoan pin cầm tay", "Đùm số bánh sau xe đạp điện cao cấp", "Cánh tay robot công nghiệp nhẹ"] },
  { term: "Worm Gear", fullName: "Worm Gear Drive", definition: "Trục vít và Bánh vít truyền động cắt nhau 90 độ, có tính năng tự hãm đặc biệt khiến bánh vít không thể quay ngược trục vít.", applications: ["Máy tời kéo cáp nâng hàng", "Dây đàn ghi ta chỉnh âm", "Trục điều khiển nghiêng tấm pin mặt trời"] },
  { term: "Bevel Gear", fullName: "Bevel Gear", definition: "Bánh răng côn dạng nón dùng để truyền động lực học chuyển đổi góc truyền lực (thường là 90 độ) giữa hai trục giao nhau.", applications: ["Cầu sau vi sai ô tô dẫn động", "Mô tơ cắt góc máy cưa đĩa", "Hộp số đuôi máy bay trực thăng"] },
  { term: "Helical Gear", fullName: "Helical Gear", definition: "Bánh răng nghiêng có các rãnh cắt xéo góc, diện tích tiếp xúc lớn hơn giúp chạy êm ái, giảm tiếng ồn và tải trọng cao hơn bánh răng thẳng.", applications: ["Hộp số tự động xe hơi chạy tốc độ cao", "Hộp số máy bơm công nghiệp", "Băng truyền tải quặng nặng"] },
  { term: "Geneva Mech", fullName: "Geneva Mechanism", definition: "Cơ cấu Geneva (cơ cấu chữ thập) biến đổi chuyển động quay liên tục thành một chuyển động quay dừng ngắt quãng chu kỳ chính xác.", applications: ["Bộ nạp phim cuộn máy chiếu rạp cổ", "Đồng hồ cơ khí Thụy Sĩ", "Máy dập viên thuốc nhiều trạm"] },
  { term: "Cam Follower", fullName: "Cam and Follower", definition: "Cơ cấu Cam lệch tâm tì vào một con đội, thiết kế hình dạng cam khác nhau sẽ tạo ra quỹ đạo tịnh tiến nhấp nhô cực kỳ phức tạp.", applications: ["Trục cam mở van xú páp động cơ đốt trong", "Máy may quần áo cơ học", "Bơm màng chất lỏng"] },
  { term: "Four Bar", fullName: "Four-bar Linkage", definition: "Cơ cấu tay quay con trượt bốn thanh liên kết, hệ thống chuyển động khớp nối cơ bản và phổ biến nhất trong cơ học kỹ thuật.", applications: ["Cơ cấu gạt nước kính chắn gió ô tô", "Khóa ngàm Visegrip", "Bơm giếng dầu mỏ gật gù"] },
  { term: "Crankshaft", fullName: "Crankshaft", definition: "Trục khuỷu lệch tâm khổng lồ, chuyên biến đổi toàn bộ động lực tịnh tiến đập lên xuống của piston thành momen quay tròn trục động cơ.", applications: ["Động cơ xe máy xăng", "Máy nén khí Piston", "Động cơ tàu thủy Diesel khổng lồ"] },
  { term: "Universal Joint", fullName: "Universal Joint (U-Joint)", definition: "Khớp nối chữ thập vạn năng, cho phép truyền lực xoắn qua một trục cơ khí có thể bẻ cong nhiều góc độ khác nhau mà không bị gãy.", applications: ["Trục các đăng xe tải truyền lực xuống cầu sau", "Trục lái vô lăng nghiêng", "Dụng cụ khẩu cờ lê ngoằn ngoèo"] },
  { term: "Flex Coupling", fullName: "Flexible Coupling", definition: "Khớp nối mềm có lớp đệm cao su hoặc lò xo, giúp nối hai trục động cơ lại với nhau đồng thời bù đắp dung sai bị lệch tâm nhẹ.", applications: ["Nối trục bơm nước ly tâm với động cơ", "Khớp trục Z máy in 3D", "Trục quay máy nén lạnh"] },
  { term: "Rigid Coupling", fullName: "Rigid Coupling", definition: "Khớp nối cứng kẹp chặt hai trục lại thành một khối thép liền mạch hoàn hảo, dùng khi cần độ đồng tâm tuyệt đối không sai lệch.", applications: ["Trục tuabin phát điện gió khổng lồ", "Trục quay tàu biển", "Hệ thống truyền động trực tiếp CNC tĩnh"] },
  { term: "Linear Guide", fullName: "Linear Guide Rail", definition: "Thanh ray trượt tuyến tính hình chữ H hoặc tròn, trên đó có con trượt bi ôm chặt để dẫn hướng chi tiết trượt thẳng tắp.", applications: ["Thanh ray trượt cửa máy CNC", "Bàn di chuyển linh kiện tự động", "Ngăn kéo tủ sắt siêu nhẹ"] },
  { term: "Linear Bearing", fullName: "Linear Bearing", definition: "Vòng bi tuyến tính trượt dọc trên trục tròn trơn với các dãy bi nhỏ tiếp xúc trượt, rẻ tiền và phổ biến cho tải nhẹ.", applications: ["Máy in 3D Prusa RepRap", "Thanh trượt ghế ô tô", "Mô hình robot sinh viên học tập"] },
  { term: "Rotary Bearing", fullName: "Ball / Roller Bearing", definition: "Ổ lăn vòng bi cơ bản gồm các viên bi cầu/đũa nằm giữa hai vòng khuyên, dùng đỡ trục quay nhằm giảm ma sát trượt thành ma sát lăn.", applications: ["Trục quay bánh xe đạp/xe máy", "Ổ đỡ quạt trần dân dụng", "Con lăn băng tải nhà máy"] },
  { term: "Thrust Bearing", fullName: "Thrust Bearing", definition: "Ổ bi chặn trục chuyên dụng để chịu tải lực đẩy ép dọc thẳng đứng dọc theo phương của trục xoay thay vì tải lực ngang.", applications: ["Khớp xoay ụ pháo xe tăng", "Ghế xoay văn phòng có đệm bi", "Cột ăng ten xoay cỡ lớn chịu gió"] },
  { term: "Journal Bearing", fullName: "Journal Bearing / Plain Bearing", definition: "Ổ trượt (bạc lót) không có viên bi, trục quay trực tiếp nổi trên một lớp màng chất lỏng dầu bôi trơn siêu mỏng dưới áp suất cao.", applications: ["Gối đỡ trục khuỷu động cơ ô tô (Miểng dên)", "Tuabin thủy điện khổng lồ", "Tuabin máy bay phản lực siêu tốc"] },
  { term: "Lead Screw", fullName: "Lead Screw", definition: "Trục vít me hệ ren thang ma sát trượt dùng chuyển quay thành tiến, kém mượt hơn Ball screw nhưng có tính tự hãm rẻ tiền.", applications: ["Bàn ê tô kẹp nguội cơ khí", "Trục nâng hạ máy cưa gỗ", "Máy ép thủy lực thủ công bằng tay"] },
  { term: "Timing Belt", fullName: "Timing Belt / Toothed Belt", definition: "Dây curoa đai răng có khớp lồi lõm ăn khớp với puli bánh răng, truyền động không bao giờ bị trượt và truyền tốc độ đồng bộ chính xác.", applications: ["Đai cam (Timing belt) chia thì động cơ xe hơi", "Trục X/Y máy in 3D / cắt Laser", "Băng tải đóng gói nhỏ nhẹ nhanh"] },

  // 81-100: Integration & Manufacturing
  { term: "CAD", fullName: "Computer-Aided Design", definition: "Phần mềm thiết kế trợ giúp bằng máy tính tạo bản vẽ 2D/3D mô phỏng trực quan hình học của bộ phận cơ khí trước khi chế tạo.", applications: ["AutoCAD vẽ mặt bằng nhà xưởng", "SolidWorks vẽ chi tiết máy CNC", "Thiết kế vỏ hộp nhựa sản phẩm"] },
  { term: "CAM", fullName: "Computer-Aided Manufacturing", definition: "Phần mềm tính toán tự động sinh ra đường chạy dao G-code từ bản vẽ CAD để ra lệnh cho máy móc cơ khí đục đẽo kim loại.", applications: ["Mastercam lập trình phay CNC 5 trục", "Phần mềm máy cắt Laser SheetMetal", "Phay khuôn đúc vỏ nhôm động cơ"] },
  { term: "CAE", fullName: "Computer-Aided Engineering", definition: "Phần mềm phân tích kỹ thuật ảo kiểm định chịu lực, tản nhiệt tĩnh/động học (FEA/CFD) trên môi trường mô phỏng vật lý chân thực.", applications: ["Ansys kiểm tra độ võng cầu thép", "Mô phỏng khí động học vỏ xe hơi", "Kiểm tra giới hạn gãy cánh quạt"] },
  { term: "Machine Vision", fullName: "Industrial Machine Vision", definition: "Hệ thống thị giác công nghiệp dùng camera tốc độ siêu cao phân tích hình ảnh pixel để tự động ra quyết định kiểm tra lỗi sản phẩm.", applications: ["Camera soi mã vạch băng chuyền Amazon", "Kiểm tra thiếu ốc vít trên mâm mạch", "Đếm viên thuốc rơi tốc độ cao"] },
  { term: "Digital Twin", fullName: "Digital Twin", definition: "Bản sao kỹ thuật số song sinh, phiên bản ảo của một hệ thống vật lý chạy song song thực tế nhận dữ liệu IoT để mô phỏng tương lai.", applications: ["Mô phỏng ảo nhà máy điện hạt nhân", "Dự đoán bảo trì động cơ máy bay", "Đồng bộ hóa robot kho hàng toàn cầu"] },
  { term: "Industry 4.0", fullName: "Fourth Industrial Revolution", definition: "Cuộc cách mạng công nghiệp thứ 4 ứng dụng IoT, AI, Cloud và Dữ liệu lớn biến nhà máy cơ khí truyền thống thành nhà máy thông minh tự trị.", applications: ["Nhà máy sản xuất thông minh của Siemens", "Giao tiếp máy - máy (M2M)", "Tự động phân tích sản lượng dây chuyền qua App"] },
  { term: "HMI", fullName: "Human Machine Interface", definition: "Màn hình giao diện điều khiển cảm ứng tại hiện trường giúp công nhân dễ dàng giám sát đồ thị và ra lệnh bật tắt cho hệ thống PLC.", applications: ["Màn hình điều khiển máy ép nhựa công nghiệp", "Bảng điều khiển thang máy thông minh", "Trạm bơm nước thành phố"] },
  { term: "FDM", fullName: "Fused Deposition Modeling", definition: "Công nghệ in 3D kinh điển hoạt động bằng cách nung chảy và đùn đắp dây nhựa thành từng lớp cắt mỏng chồng lên nhau.", applications: ["In vỏ hộp mô hình thử nghiệm", "Sản xuất đồ chơi linh kiện nhỏ nhựa PLA", "Làm đồ kẹp gá DIY lắp ráp"] },
  { term: "SLA", fullName: "Stereolithography 3D Printing", definition: "Công nghệ in 3D quang học dùng tia Laser tia tử ngoại (UV) quét lên bề mặt bồn nhựa lỏng resin để đóng rắn từng lớp với độ nét cực cao.", applications: ["In răng giả y khoa nha khoa", "In khuôn sáp đúc trang sức nhẫn vàng", "Chi tiết cơ khí mô hình cực bé gọn"] },
  { term: "SLS", fullName: "Selective Laser Sintering", definition: "Công nghệ in 3D sử dụng tia Laser cực mạnh bắn tan chảy và thiêu kết bột nylon/kim loại siêu mịn thành khối cứng mà không cần giá đỡ.", applications: ["In linh kiện chịu lực máy bay", "In ruột ống xả tản nhiệt phức tạp", "Chế tạo nhanh vỏ điện thoại chịu va đập"] },
  { term: "CNC Milling", fullName: "CNC Milling (Phay)", definition: "Gia công cắt gọt kim loại bằng dao phay xoay tròn đa rãnh di chuyển đục đẽo bóc tách trên khối phôi kim loại hình hộp đứng yên.", applications: ["Phay lốc máy động cơ nhôm", "Gia công rãnh trượt khuôn đúc", "Phay chi tiết linh kiện robot chữ nhật"] },
  { term: "CNC Turning", fullName: "CNC Turning (Tiện)", definition: "Gia công cắt gọt kim loại trên máy tiện xoay phôi kim loại trụ tròn liên tục trong khi mũi dao đứng yên cắt tiến tịnh tiến vào.", applications: ["Tiện trục vít me", "Làm bu lông, trục cam, xi lanh", "Tiện vỏ đạn, puly ròng rọc"] },
  { term: "CMM", fullName: "Coordinate Measuring Machine", definition: "Máy đo tọa độ quang học/chạm tiếp xúc 3D siêu chính xác dùng kiểm tra kích thước thành phẩm cơ khí xem có sai số thiết kế không.", applications: ["Đo độ lệch trục động cơ cấp micrometer", "Phòng QA/QC linh kiện máy bay không gian", "Quét ngược Reverse Engineering mẫu"] },
  { term: "Tolerance", fullName: "Engineering Tolerance", definition: "Dung sai kỹ thuật. Khoảng sai số chênh lệch kích thước tối đa cho phép trong sản xuất để hai chi tiết vẫn lắp ráp vừa khít vào nhau.", applications: ["Dung sai lắp ghép H7/g6 ổ bi", "Quy định sai số lỗ trục", "Giá thành gia công cơ khí tăng theo độ dung sai"] },
  { term: "Surface Rough", fullName: "Surface Roughness", definition: "Độ nhám bề mặt. Đánh giá mức độ nhấp nhô của vết cắt gọt trên mặt kim loại, ảnh hưởng đến thẩm mỹ và ma sát mài mòn.", applications: ["Mài bóng trục khuỷu xe máy", "Phay thô bề mặt đế sắt móng", "Đánh giá chất lượng bôi trơn dăm bào"] },
  { term: "GD&T", fullName: "Geometric Dimensioning and Tolerancing", definition: "Hệ thống ký hiệu bản vẽ quốc tế tiêu chuẩn dùng định nghĩa quy cách, kích thước, độ phẳng, song song, đồng tâm của chi tiết.", applications: ["Bản vẽ cơ khí toàn cầu", "Thiết kế đồ gá Jig kẹp", "Tránh hiểu lầm khi gia công máy"] },
  { term: "BOM", fullName: "Bill of Materials", definition: "Bản kê danh mục toàn bộ vật tư chi tiết, đinh ốc, bảng mạch điện tử kèm số lượng cần mua để lắp ráp thành một sản phẩm hoàn chỉnh.", applications: ["Dự toán chi phí lắp đặt máy", "Quản lý tồn kho linh kiện hệ thống ERP", "Giao mua hàng linh kiện thầu"] },
  { term: "OEE", fullName: "Overall Equipment Effectiveness", definition: "Hiệu suất thiết bị tổng thể, chỉ số % đánh giá máy móc chạy tốt thế nào dựa trên 3 trụ cột: Tính khả dụng, Hiệu suất và Chất lượng.", applications: ["Chỉ tiêu đo đếm dây chuyền quản đốc", "Phân tích thời gian chết hỏng hóc máy", "Tối ưu hóa sản lượng ca đêm"] },
  { term: "Poka-Yoke", fullName: "Poka-Yoke (Mistake Proofing)", definition: "Nguyên lý thiết kế chống lầm lỗi của Nhật Bản, chế tạo các ngàm/rãnh cơ khí ngăn cản hoàn toàn việc công nhân cắm/lắp ráp ngược vật tư.", applications: ["Rãnh cắm ổ cứng USB chống ngược", "Chui cắm điện ba chấu", "Khuôn gá JIG chỉ kẹp được một mặt duy nhất"] },
  { term: "Kaizen", fullName: "Kaizen (Continuous Improvement)", definition: "Triết lý cải tiến liên tục không ngừng nghỉ nhằm tối ưu hóa từng bước nhỏ nhặt nhất trong dây chuyền sản xuất để tăng năng suất lâu dài.", applications: ["Sắp xếp lại dụng cụ thao tác 5S Toyota", "Giảm 1 giây thao tác vặn vít mỗi máy", "Khuyến khích công nhân phát hiện lỗi vặt"] }
];

async function main() {
  console.log("Bat dau sinh truc tiep 100 tu khoa Co dien tu (Mechatronics)...");
  
  // Doc du lieu cu
  let existingData = [];
  if (fs.existsSync(filePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.log("Loi parse file cu, coi nhu mang rong", e);
    }
  }

  // Loc cac tu khoa da ton tai de tranh duplicate trên TOÀN BỘ HỆ THỐNG
  const existingTerms = new Set();
  const files = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(categoriesDir, file), 'utf8'));
      for (const item of data) {
        if (item.term) {
          existingTerms.add(item.term.toLowerCase().trim());
        }
      }
    } catch (e) {}
  }

  console.log("Tong so tu khoa he thong hien tai:", existingTerms.size);

  let addedCount = 0;
  for (const newTerm of termsToInsert) {
    const normalized = newTerm.term.toLowerCase().trim();
    if (!existingTerms.has(normalized)) {
      newTerm.id = generateId();
      newTerm.category = "Cơ điện tử";
      if (!newTerm.youtubeUrl) {
          newTerm.youtubeUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(newTerm.term + " mechatronics engineering");
      }
      existingData.push(newTerm);
      existingTerms.add(normalized);
      addedCount++;
    } else {
      console.log("Bo qua tu khoa da ton tai:", newTerm.term);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
  console.log("Hoan tat ghi vao co_dien_tu.json!");
  console.log("So tu khoa duoc them vao: " + addedCount);
}

main();
