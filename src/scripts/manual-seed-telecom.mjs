import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesDir = path.join(__dirname, '../../public/data/categories');
const telecomFilePath = path.join(categoriesDir, 'vo_tuyen_vien_thong.json');

// Hàm tạo UUID giả lập
function generateId() {
  return 'tel_' + Math.random().toString(36).substring(2, 9);
}

const termsToInsert = [
  // 1-20: Mạng di động & Băng thông rộng
  { term: "6G", fullName: "6th Generation Mobile Network", definition: "Mạng di động thế hệ thứ 6, hứa hẹn tốc độ Tbps, độ trễ micro-giây và kết nối vạn vật không gian 3D, tích hợp AI bản địa.", applications: ["Hologram thời gian thực", "Mạng không gian vũ trụ", "Giao diện não - máy tính (BCI)"] },
  { term: "eMBB", fullName: "Enhanced Mobile Broadband", definition: "Gói dịch vụ 5G cung cấp băng thông di động siêu rộng, đáp ứng nhu cầu dữ liệu cao cực lớn.", applications: ["Phát video 8K/4K", "Tải xuống file dung lượng lớn", "Thực tế ảo VR/AR"] },
  { term: "URLLC", fullName: "Ultra-Reliable Low-Latency Communication", definition: "Dịch vụ 5G đảm bảo độ trễ siêu thấp dưới 1ms và độ tin cậy cực cao, phục vụ các ứng dụng thời gian thực khắt khe.", applications: ["Phẫu thuật robot từ xa", "Xe tự lái cấp độ 5", "Nhà máy thông minh"] },
  { term: "mMTC", fullName: "Massive Machine-Type Communications", definition: "Dịch vụ 5G dành riêng cho việc kết nối hàng triệu thiết bị IoT mật độ cao trong một khu vực hẹp với mức tiêu thụ điện cực thấp.", applications: ["Thành phố thông minh", "Cảm biến nông nghiệp", "Quản lý logistics"] },
  { term: "mmWave", fullName: "Millimeter Wave", definition: "Băng tần sóng milimet (24GHz - 100GHz) được sử dụng trong 5G để cung cấp băng thông khổng lồ ở khoảng cách ngắn.", applications: ["Cột phát sóng 5G đô thị", "Backhaul vô tuyến", "Kết nối radar xe hơi"] },
  { term: "Small Cell", fullName: "Small Cell Network", definition: "Trạm phát sóng di động công suất thấp, kích thước nhỏ gọn dùng để phủ sóng cục bộ tại các điểm mù hoặc nơi đông người.", applications: ["Phủ sóng sân vận động", "Mạng nội bộ trung tâm thương mại", "Hỗ trợ mmWave 5G"] },
  { term: "Femtocell", fullName: "Femtocell Base Station", definition: "Trạm thu phát sóng cực nhỏ, thường dùng trong hộ gia đình hoặc văn phòng nhỏ để tăng cường sóng di động băng thông rộng.", applications: ["Phủ sóng tầng hầm", "Kết nối di động nội bộ doanh nghiệp", "Thay thế WiFi cá nhân"] },
  { term: "Handover", fullName: "Network Handover/Handoff", definition: "Quá trình chuyển giao kết nối của thuê bao di động từ một trạm phát sóng này sang trạm khác mà không làm gián đoạn liên lạc.", applications: ["Nghe gọi khi đi ô tô tốc độ cao", "Di chuyển trên tàu điện ngầm", "Đảm bảo luồng video liên tục"] },
  { term: "Roaming", fullName: "Data Roaming", definition: "Dịch vụ chuyển vùng quốc tế, cho phép thiết bị di động truy cập mạng của nhà mạng khác khi rời khỏi vùng phủ sóng của nhà mạng nội bộ.", applications: ["Sử dụng SIM khi du lịch nước ngoài", "Kết nối IoT xuyên quốc gia", "Liên lạc ngoại tuyến nội địa"] },
  { term: "BTS", fullName: "Base Transceiver Station", definition: "Trạm thu phát gốc trong mạng di động, chứa thiết bị vô tuyến để liên lạc trực tiếp với các thiết bị di động của người dùng.", applications: ["Trạm viễn thông mạng 2G/3G", "Cột ăng ten khu dân cư", "Hệ thống trạm phủ sóng vùng sâu"] },
  { term: "eNodeB", fullName: "Evolved Node B", definition: "Trạm gốc trong mạng 4G LTE, thực hiện xử lý điều khiển tài nguyên vô tuyến phức tạp mà không cần bộ điều khiển trạm gốc riêng biệt.", applications: ["Trạm thu phát sóng 4G", "Kết nối VoLTE", "Điều khiển handover 4G"] },
  { term: "gNodeB", fullName: "Next Generation Node B", definition: "Trạm phát sóng gốc thế hệ mới dùng cho mạng 5G NR (New Radio), có khả năng quản lý băng thông lớn và kết nối mMTC/URLLC.", applications: ["Hạ tầng trạm 5G", "Trạm phát sóng mmWave", "Phủ sóng đô thị thông minh"] },
  { term: "Core Network", fullName: "Mobile Core Network", definition: "Mạng lõi di động, đóng vai trò định tuyến các cuộc gọi, dữ liệu, xác thực người dùng và tính cước phí trước khi kết nối với Internet.", applications: ["Quản lý thuê bao di động", "Điều hướng dữ liệu di động", "Hệ thống phân phối gói tin"] },
  { term: "EPC", fullName: "Evolved Packet Core", definition: "Mạng lõi cấu trúc hoàn toàn dựa trên nền tảng gói (IP-based) của hệ thống 4G LTE.", applications: ["Cung cấp đường truyền data 4G", "Chuyển mạch gói dữ liệu", "Hỗ trợ dịch vụ đa phương tiện"] },
  { term: "IMS", fullName: "IP Multimedia Subsystem", definition: "Hệ thống phân phối dịch vụ đa phương tiện qua IP, là nền tảng cốt lõi để cung cấp dịch vụ như VoLTE và video call trực tiếp.", applications: ["Cuộc gọi VoLTE 4G", "Nhắn tin RCS", "Video call VoWiFi"] },
  { term: "VoNR", fullName: "Voice over New Radio", definition: "Công nghệ gọi thoại chất lượng cao truyền tải hoàn toàn trên hạ tầng mạng 5G độc lập (5G SA) thay vì phải mượn đường 4G.", applications: ["Cuộc gọi 5G HD", "Tích hợp thoại vào URLLC", "Thực tế ảo đàm thoại"] },
  { term: "Network Slicing", fullName: "5G Network Slicing", definition: "Công nghệ cắt lát mạng 5G cho phép chia một hạ tầng mạng vật lý thành nhiều mạng ảo độc lập, mỗi mạng ảo phục vụ một mục đích riêng.", applications: ["Chia mạng riêng cho bệnh viện", "Mạng nội bộ nhà máy IoT", "Băng thông riêng cho xe tự hành"] },
  { term: "SDN", fullName: "Software-Defined Networking", definition: "Mạng điều khiển bằng phần mềm, tách biệt lớp điều khiển (control plane) khỏi lớp truyền tải (data plane) để dễ dàng lập trình mạng.", applications: ["Quản lý trung tâm dữ liệu", "Tối ưu hóa băng thông WAN", "Tự động hóa định tuyến"] },
  { term: "NFV", fullName: "Network Functions Virtualization", definition: "Ảo hóa chức năng mạng, thay thế các phần cứng viễn thông chuyên dụng bằng các máy ảo chạy trên máy chủ tiêu chuẩn.", applications: ["Ảo hóa router/firewall", "Triển khai hạ tầng 5G Cloud", "Giảm chi phí vận hành mạng"] },
  { term: "MEC", fullName: "Multi-access Edge Computing", definition: "Điện toán biên đa truy nhập, mang tài nguyên điện toán và lưu trữ đến gần người dùng ở rìa mạng để giảm độ trễ tối đa.", applications: ["Phân tích AI từ camera giao thông", "Hỗ trợ kính AR tương tác tức thì", "Điều khiển game đám mây độ trễ thấp"] },

  // 21-40: Anten và Truyền sóng
  { term: "MIMO", fullName: "Multiple-Input Multiple-Output", definition: "Công nghệ sử dụng nhiều ăng-ten ở cả thiết bị phát và thu để truyền nhận nhiều luồng dữ liệu cùng lúc, tăng dung lượng kênh.", applications: ["Router WiFi 6", "Trạm phát sóng 4G/5G", "Truyền hình vệ tinh kỹ thuật số"] },
  { term: "Massive MIMO", fullName: "Massive MIMO", definition: "Hệ thống MIMO quy mô lớn sử dụng hàng chục đến hàng trăm ăng-ten để tập trung năng lượng sóng, nâng cao hiệu suất mạng 5G.", applications: ["Trạm 5G băng thông rộng", "Hạ tầng viễn thông đô thị", "Cải thiện dung lượng mạng tại sân vận động"] },
  { term: "Beamforming", fullName: "Beamforming Technology", definition: "Kỹ thuật định dạng búp sóng, tập trung năng lượng tín hiệu vô tuyến truyền thẳng về phía thiết bị nhận thay vì phát tỏa tròn.", applications: ["Router WiFi thông minh", "Kết nối 5G mmWave", "Radar theo dõi mục tiêu"] },
  { term: "Phased Array", fullName: "Phased Array Antenna", definition: "Hệ thống dàn ăng-ten pha có khả năng lái hướng búp sóng hoàn toàn bằng điện tử (thay đổi pha) mà không cần xoay vật lý.", applications: ["Starlink user terminal", "Radar mạng pha quét điện tử", "Ăng-ten máy bay chiến đấu"] },
  { term: "Multipath Fading", fullName: "Multipath Fading Effect", definition: "Hiện tượng suy hao đa đường do tín hiệu vô tuyến phản xạ, khúc xạ từ các vật thể tạo ra nhiều bản sao đến máy thu ở các thời điểm khác nhau.", applications: ["Xử lý tín hiệu di động đô thị", "Thiết kế bộ cân bằng (Equalizer)", "Nghiên cứu suy hao kênh truyền"] },
  { term: "Path Loss", fullName: "Free Space Path Loss", definition: "Sự suy hao công suất tín hiệu tự nhiên do sóng điện từ bị phân tán khi truyền qua không gian tự do tỷ lệ nghịch với bình phương khoảng cách.", applications: ["Tính toán Link Budget", "Thiết kế vùng phủ sóng vệ tinh", "Quy hoạch trạm BTS"] },
  { term: "Diversity", fullName: "Antenna Diversity", definition: "Kỹ thuật sử dụng hai hoặc nhiều ăng-ten cách nhau một khoảng nhất định để cải thiện chất lượng và độ tin cậy của liên kết vô tuyến.", applications: ["Router WiFi hai râu", "Microphone không dây", "Trạm phát thanh cơ sở"] },
  { term: "Polarization", fullName: "Wave Polarization", definition: "Phân cực sóng điện từ, mô tả hướng dao động của vectơ điện trường so với hướng lan truyền sóng (VD: phân cực dọc, ngang, tròn).", applications: ["Sắp xếp ăng-ten chéo", "Truyền hình vệ tinh (LNB)", "Giảm nhiễu đa kênh"] },
  { term: "Gain", fullName: "Antenna Gain", definition: "Độ lợi ăng-ten (đo bằng dBi), biểu thị khả năng tập trung năng lượng bức xạ về một hướng so với ăng-ten đẳng hướng.", applications: ["Chọn ăng-ten cho router", "Thiết kế trạm vi ba", "Thu sóng vệ tinh"] },
  { term: "Directivity", fullName: "Antenna Directivity", definition: "Độ hướng tính, tỷ lệ giữa mật độ công suất bức xạ cực đại theo một hướng và mật độ công suất bức xạ trung bình.", applications: ["Ăng-ten Parabol", "Ăng-ten còi (Horn)", "Đánh giá chất lượng radar"] },
  { term: "Return Loss", fullName: "Return Loss", definition: "Suy hao dội ngược, đo lường năng lượng tín hiệu bị phản xạ ngược lại do sự không phối hợp trở kháng ở các đầu nối cáp.", applications: ["Kiểm tra cáp đồng trục", "Đo kiểm ăng-ten trạm phát", "Hiệu chuẩn máy phát RF"] },
  { term: "Smith Chart", fullName: "Đồ thị Smith", definition: "Công cụ đồ họa chuyên dụng trong kỹ thuật RF dùng để giải quyết các bài toán về đường dây truyền tải và phối hợp trở kháng.", applications: ["Thiết kế mạch khuếch đại LNA", "Phối hợp trở kháng ăng-ten", "Mô phỏng mạng vi ba"] },
  { term: "Impedance Matching", fullName: "Phối hợp trở kháng", definition: "Kỹ thuật điều chỉnh trở kháng của tải sao cho bằng với trở kháng nguồn hoặc đường dây nhằm truyền tải công suất lớn nhất.", applications: ["Hàn đầu nối cáp RF", "Mạch lọc băng thông", "Mạch thu phát vô tuyến"] },
  { term: "Parabolic Antenna", fullName: "Parabolic Dish Antenna", definition: "Ăng-ten chảo parabol sử dụng gương phản xạ hình parabol để tập trung sóng vô tuyến vào một tụ điểm, có độ hướng tính cực cao.", applications: ["Kính viễn vọng vô tuyến", "Chảo thu truyền hình vệ tinh (DTH)", "Trạm mặt đất điều khiển vệ tinh"] },
  { term: "Horn Antenna", fullName: "Ăng-ten Còi", definition: "Ăng-ten có hình dạng giống chiếc còi hở một đầu, được dùng rộng rãi để truyền dẫn dải sóng vi ba.", applications: ["Cấp nguồn cho chảo Parabol", "Hệ thống radar đo tốc độ", "Súng bắn tốc độ CSGT"] },
  { term: "Dipole Antenna", fullName: "Half-wave Dipole Antenna", definition: "Ăng-ten lưỡng cực cơ bản gồm hai phần tử kim loại dẫn điện, thường có chiều dài bằng một nửa bước sóng.", applications: ["Ăng-ten tivi râu truyền thống", "Máy phát thanh FM cục bộ", "Ăng-ten thiết bị định tuyến cơ bản"] },
  { term: "Monopole Antenna", fullName: "Monopole Antenna", definition: "Ăng-ten đơn cực gồm một thanh dẫn thẳng dựng vuông góc trên mặt phẳng đất dẫn điện (ground plane).", applications: ["Ăng-ten bộ đàm cầm tay", "Ăng-ten trên nóc xe hơi", "Trạm phát sóng vô tuyến AM"] },
  { term: "Fresnel Zone", fullName: "Vùng Fresnel", definition: "Vùng không gian hình elipsoid bao quanh tia nhìn thẳng giữa máy phát và máy thu, quyết định sự giao thoa của các sóng truyền.", applications: ["Tính toán chiều cao cột ăng-ten vi ba", "Quy hoạch liên kết Point-to-Point", "Thiết kế cáp treo qua đồi"] },
  { term: "LOS", fullName: "Line of Sight", definition: "Đường truyền nhìn thẳng, yêu cầu máy phát và máy thu vô tuyến không bị bất kỳ vật cản nào che khuất tầm nhìn vật lý.", applications: ["Kết nối vi ba điểm-điểm", "Truyền thông vệ tinh trực tiếp", "Kết nối quang không gian tự do"] },
  { term: "Link Budget", fullName: "Radio Link Budget", definition: "Quỹ đường truyền, phép tính tổng hợp mọi hệ số khuếch đại và suy hao trong toàn bộ hệ thống để dự đoán công suất tại máy thu.", applications: ["Quy hoạch mạng lưới di động", "Thiết kế trạm viễn thông quang", "Lập kế hoạch phóng vệ tinh"] },

  // 41-60: Điều chế, Ghép kênh & Đa truy nhập
  { term: "AM", fullName: "Amplitude Modulation", definition: "Điều chế biên độ, phương pháp truyền thông tin bằng cách làm thay đổi biên độ của sóng mang tỷ lệ với tín hiệu nguồn.", applications: ["Phát thanh AM", "Thông tin liên lạc hàng không", "Đài radio sóng ngắn"] },
  { term: "FM", fullName: "Frequency Modulation", definition: "Điều chế tần số, phương pháp thay đổi tần số của sóng mang theo biên độ của tín hiệu nguồn, chống nhiễu tốt hơn AM.", applications: ["Phát thanh FM", "Máy bộ đàm cảnh sát", "Truyền hình tương tự (phần tiếng)"] },
  { term: "PM", fullName: "Phase Modulation", definition: "Điều chế pha, thông tin được mã hóa bằng cách làm dịch chuyển góc pha của sóng mang.", applications: ["Mạng Wi-Fi kỹ thuật số", "Hệ thống định vị GPS", "Cơ sở của các loại PSK"] },
  { term: "ASK", fullName: "Amplitude-Shift Keying", definition: "Điều chế số di tần biên độ, bit số 0 và 1 được biểu diễn thông qua các mức biên độ khác nhau của sóng mang.", applications: ["Remote mở cửa cuốn", "Hệ thống đọc thẻ RFID cơ bản", "Cáp quang tốc độ thấp"] },
  { term: "FSK", fullName: "Frequency-Shift Keying", definition: "Điều chế số di tần tần số, truyền tải dữ liệu số bằng cách thay đổi các mức tần số rời rạc của sóng mang.", applications: ["Bộ phát sóng Bluetooth cơ bản", "Hệ thống gọi máy nhắn tin", "Modem Dial-up cũ"] },
  { term: "PSK", fullName: "Phase-Shift Keying", definition: "Điều chế số di tần pha, dữ liệu được truyền đi thông qua việc thay đổi góc pha của sóng điện từ liên tục.", applications: ["Wi-Fi", "Bluetooth EDR", "Truyền hình vệ tinh"] },
  { term: "BPSK", fullName: "Binary Phase-Shift Keying", definition: "Dạng điều chế PSK đơn giản nhất sử dụng hai pha lệch nhau 180 độ để mã hóa 1 bit trên mỗi symbol (0 hoặc 1).", applications: ["Hệ thống liên lạc không gian sâu", "Mạng viễn thông điều kiện nhiễu cao", "Tín hiệu đồng hồ GPS"] },
  { term: "QPSK", fullName: "Quadrature Phase-Shift Keying", definition: "Điều chế pha cầu phương, sử dụng bốn góc pha khác nhau để mã hóa 2 bit trên mỗi symbol, tăng gấp đôi tốc độ so với BPSK.", applications: ["Mạng 3G WCDMA", "Truyền hình kỹ thuật số DVB-S", "Mạng truyền dữ liệu vệ tinh"] },
  { term: "256-QAM", fullName: "256-state Quadrature Amplitude Modulation", definition: "Điều chế QAM sử dụng chòm sao 256 điểm, cho phép truyền tới 8 bit trên mỗi symbol, đòi hỏi tín hiệu SNR cực tốt.", applications: ["Modem truyền hình cáp DOCSIS 3.0", "Mạng di động 4G LTE-Advanced", "Mạng cáp quang viễn thông"] },
  { term: "OFDMA", fullName: "Orthogonal Frequency-Division Multiple Access", definition: "Phiên bản đa truy nhập của OFDM, cho phép phân bổ các nhóm sóng mang phụ riêng lẻ cho nhiều người dùng cùng một lúc.", applications: ["Wi-Fi 6 (802.11ax)", "Cấu trúc lõi 4G LTE/5G", "WiMAX"] },
  { term: "WCDMA", fullName: "Wideband Code Division Multiple Access", definition: "Tiêu chuẩn truy nhập vô tuyến cốt lõi của mạng di động 3G, cung cấp tốc độ cao bằng công nghệ trải phổ băng rộng.", applications: ["Điện thoại di động 3G", "Truy cập Internet di động cơ bản", "Mạng lõi UMTS"] },
  { term: "TDMA", fullName: "Time-Division Multiple Access", definition: "Đa truy nhập phân chia theo thời gian, chia một kênh tần số duy nhất thành nhiều khe thời gian xen kẽ cho nhiều thuê bao.", applications: ["Mạng di động 2G GSM", "Hệ thống thông tin vô tuyến trung kế", "Vệ tinh VSAT"] },
  { term: "FDMA", fullName: "Frequency-Division Multiple Access", definition: "Đa truy nhập phân chia theo tần số, chia nhỏ dải băng thông tổng thành nhiều dải tần con, mỗi người dùng chiếm một tần số riêng.", applications: ["Phát thanh Radio truyền thống", "Kênh analog truyền hình", "Mạng di động 1G"] },
  { term: "SDMA", fullName: "Space-Division Multiple Access", definition: "Đa truy nhập phân chia theo không gian, sử dụng ăng-ten thông minh định hướng phát búp sóng hội tụ vào từng thiết bị cụ thể.", applications: ["Trạm 5G Massive MIMO", "Vệ tinh viễn thông chùm tia hẹp", "Router WiFi cao cấp"] },
  { term: "Spread Spectrum", fullName: "Kỹ thuật trải phổ", definition: "Kỹ thuật truyền thông tán xạ năng lượng tín hiệu trên một băng thông rộng hơn nhiều so với tín hiệu gốc để chống nhiễu.", applications: ["Thông tin liên lạc quân sự bảo mật", "Hệ thống định vị GPS", "Cốt lõi công nghệ CDMA"] },
  { term: "DSSS", fullName: "Direct-Sequence Spread Spectrum", definition: "Trải phổ chuỗi trực tiếp, tín hiệu gốc được nhân với một chuỗi mã giả ngẫu nhiên tốc độ cao (chip sequence) để trải phổ.", applications: ["Chuẩn Wi-Fi 802.11b", "Hệ thống dẫn đường quân sự", "Mạng LAN không dây đời đầu"] },
  { term: "FHSS", fullName: "Frequency-Hopping Spread Spectrum", definition: "Trải phổ nhảy tần, tín hiệu liên tục nhảy đổi tần số mang theo một chuỗi ngẫu nhiên đã được đồng bộ để tránh bị nghe lén.", applications: ["Kết nối Bluetooth", "Bộ đàm quân đội mã hóa", "Hệ thống điều khiển drone chống nhiễu"] },
  { term: "TDD", fullName: "Time-Division Duplexing", definition: "Kỹ thuật song công phân chia theo thời gian, sử dụng cùng một tần số cho cả đường lên và đường xuống xen kẽ các mốc thời gian.", applications: ["Mạng TD-LTE 4G", "Mạng Wi-Fi cục bộ", "Liên kết 5G băng tần cao"] },
  { term: "FDD", fullName: "Frequency-Division Duplexing", definition: "Kỹ thuật song công phân chia theo tần số, dùng hai dải tần số hoàn toàn riêng biệt cùng lúc cho truyền tải Uplink và Downlink.", applications: ["Mạng điện thoại 3G/4G tiêu chuẩn", "Truyền hình cáp quang", "Hệ thống cáp quang biển"] },
  { term: "Carrier Aggregation", fullName: "Ghép mang (CA)", definition: "Công nghệ kết hợp nhiều khối băng tần rời rạc lại với nhau để tăng kích thước đường ống, giúp tốc độ dữ liệu tăng gấp nhiều lần.", applications: ["Mạng 4G LTE-Advanced (4.5G)", "Hạ tầng 5G Gigabit", "Tăng tốc độ tải file di động"] },

  // 61-80: Thông tin Quang và Cấu trúc mạng lõi
  { term: "Fiber Optic", fullName: "Optical Fiber (Cáp quang)", definition: "Sợi quang học dẫn tín hiệu ánh sáng phản xạ toàn phần bên trong lõi kính, cho phép truyền tải tốc độ ánh sáng siêu băng thông.", applications: ["Cáp viễn thông xuyên biển", "Đường truyền Internet gia đình", "Liên kết thiết bị y tế nội soi"] },
  { term: "SMF", fullName: "Single-mode Fiber", definition: "Sợi quang đơn mode có lõi rất nhỏ, chỉ cho một tia sáng truyền đi theo trục thẳng, thích hợp để truyền tải viễn thông khoảng cách cực xa.", applications: ["Cáp quang biển liên lục địa", "Mạng truyền dẫn đường trục quốc gia", "Kết nối trạm viễn thông BTS"] },
  { term: "MMF", fullName: "Multi-mode Fiber", definition: "Sợi quang đa mode có đường kính lõi lớn, cho phép nhiều tia sáng truyền qua dưới các góc độ khác nhau, dùng cho khoảng cách ngắn.", applications: ["Mạng nội bộ trong trung tâm dữ liệu", "Hệ thống LAN văn phòng", "Kết nối server trong tủ rack"] },
  { term: "TIR", fullName: "Total Internal Reflection", definition: "Hiện tượng phản xạ toàn phần, nguyên lý vật lý quan trọng nhất giữ tia sáng không bị rọi thoát ra ngoài mà đi dọc theo sợi cáp quang.", applications: ["Sản xuất cáp quang viễn thông", "Đèn sợi quang trang trí", "Thiết kế lăng kính quang học"] },
  { term: "Dispersion", fullName: "Optical Dispersion (Tán sắc)", definition: "Sự phân tán của các thành phần quang học trên sợi quang dẫn đến việc xung ánh sáng bị trải rộng ra khi truyền, làm giảm băng thông.", applications: ["Kiểm soát lỗi tín hiệu cáp quang", "Bù tán sắc (DCF) cáp biển", "Thiết kế sợi quang bù tán sắc"] },
  { term: "WDM", fullName: "Wavelength-Division Multiplexing", definition: "Ghép kênh phân chia theo bước sóng, kỹ thuật dùng nhiều màu sắc (bước sóng) ánh sáng khác nhau truyền qua cùng 1 sợi quang.", applications: ["Hệ thống mạng trục cáp quang", "Kết nối ISP lõi", "Tăng dung lượng cáp biển cũ"] },
  { term: "CWDM", fullName: "Coarse Wavelength Division Multiplexing", definition: "Ghép kênh quang bước sóng thưa, hỗ trợ từ 4-18 bước sóng khoảng cách xa nhau, chi phí thiết bị rẻ dùng cho mạng đô thị.", applications: ["Mạng cáp quang đô thị (MAN)", "Kết nối camera an ninh diện rộng", "Mạng cáp quang xí nghiệp"] },
  { term: "DWDM", fullName: "Dense Wavelength Division Multiplexing", definition: "Ghép kênh quang mật độ cao, đóng gói hàng trăm bước sóng san sát nhau lên cùng một sợi quang để đẩy băng thông lên mức Terabit.", applications: ["Đường truyền cáp quang xuyên biển", "Cột sống (backbone) quốc gia", "Data Center Interconnect"] },
  { term: "PON", fullName: "Passive Optical Network", definition: "Mạng quang thụ động, mạng phân phối cáp quang đến người dùng bằng bộ chia quang (Splitter) không cần cấp điện.", applications: ["Mạng cáp quang FTTH gia đình", "Khu công nghiệp", "Mạng phân phối mạng băng rộng"] },
  { term: "GPON", fullName: "Gigabit-capable PON", definition: "Tiêu chuẩn mạng quang thụ động cung cấp băng thông Gigabit (2.5 Gbps xuống / 1.25 Gbps lên) cực kỳ phổ biến hiện nay.", applications: ["Internet cáp quang Viettel/VNPT/FPT", "Camera giám sát mạng IP", "Dịch vụ truyền hình IPTV"] },
  { term: "OLT", fullName: "Optical Line Terminal", definition: "Thiết bị kết cuối đường dây quang đặt tại đài trạm trung tâm nhà cung cấp mạng, quản lý và cấp phát băng thông cho hàng trăm người dùng.", applications: ["Trung tâm dữ liệu ISP", "Tủ thiết bị viễn thông nhà mạng", "Quản lý ONT khách hàng"] },
  { term: "ONT", fullName: "Optical Network Terminal", definition: "Thiết bị kết cuối mạng quang (hay Modem quang), đặt trực tiếp tại nhà khách hàng để chuyển tín hiệu quang thành LAN/WiFi.", applications: ["Modem WiFi cáp quang gia đình", "Kết nối truyền hình cáp IP", "Modem mạng doanh nghiệp nhỏ"] },
  { term: "EDFA", fullName: "Erbium-Doped Fiber Amplifier", definition: "Bộ khuếch đại quang sợi pha Erbium, có khả năng khuếch đại trực tiếp tín hiệu ánh sáng mà không cần biến nó thành điện.", applications: ["Khuếch đại tín hiệu cáp quang biển", "Trạm lặp mạng viễn thông trục", "Hệ thống DWDM đường dài"] },
  { term: "SFP", fullName: "Small Form-factor Pluggable", definition: "Mô-đun quang cắm nóng nhỏ gọn, dùng để gắn vào switch/router viễn thông làm cổng kết nối quang linh hoạt 1Gbps.", applications: ["Cổng quang trên Switch mạng LAN", "Module mạng truyền hình cáp", "Cáp quang kết nối máy chủ"] },
  { term: "SFP+", fullName: "Enhanced SFP", definition: "Phiên bản nâng cấp của SFP, cung cấp tốc độ mạng viễn thông và data center lên đến 10Gbps trên mỗi module cổng quang.", applications: ["Mạng trung tâm dữ liệu tốc độ cao", "Kết nối lưu trữ SAN", "Router mạng lõi doanh nghiệp"] },
  { term: "OTN", fullName: "Optical Transport Network", definition: "Mạng truyền tải quang số hóa, quy chuẩn đóng gói toàn diện các loại dữ liệu truyền thông số trên các đường link quang bước sóng.", applications: ["Mạng viễn thông quốc gia", "Kênh thuê riêng (Leased Line) cho ngân hàng", "Nền tảng truyền tải 5G"] },
  { term: "SONET", fullName: "Synchronous Optical Networking", definition: "Mạng quang đồng bộ, tiêu chuẩn truyền dẫn kỹ thuật số cấp độ nhà mạng cũ, nền tảng của viễn thông quang trước khi OTN ra đời.", applications: ["Mạng điện thoại chuyển mạch công cộng (PSTN)", "Đường trục viễn thông di sản", "Mạng thông tin đường sắt"] },
  { term: "FTTC", fullName: "Fiber to the Curb", definition: "Cáp quang được kéo từ trạm viễn thông đến tủ cáp đặt gần khu dân cư, đoạn cuối vào nhà dùng cáp đồng VDSL.", applications: ["Nâng cấp mạng cáp đồng cũ", "Khu chung cư cũ", "Tiết kiệm chi phí thay cáp nhà dân"] },
  { term: "Attenuation", fullName: "Signal Attenuation (Suy hao)", definition: "Sự giảm cường độ của tín hiệu quang hoặc vô tuyến khi truyền qua khoảng cách xa do bị hấp thụ hoặc tán xạ.", applications: ["Tính toán giới hạn khoảng cách WiFi", "Hiệu chỉnh khuếch đại cáp quang", "Tính khoảng cách liên lạc vô tuyến"] },
  { term: "Dark Fiber", fullName: "Unlit Fiber (Cáp sợi đen)", definition: "Sợi cáp quang vật lý đã được lắp đặt nhưng chưa có tín hiệu ánh sáng chạy qua, được nhà mạng cho thuê dưới dạng hạ tầng tĩnh.", applications: ["Thuê cáp quang riêng tư cho ngân hàng", "Xây dựng hạ tầng tự quản lý", "Mạng liên kết đại học diện rộng"] },

  // 81-100: Vệ tinh, Vi sóng & Kỹ thuật đo lường
  { term: "Satellite Comm", fullName: "Satellite Communications", definition: "Mạng thông tin vệ tinh, dùng vệ tinh nhân tạo làm trạm trung chuyển tín hiệu viba bao phủ thông tin diện rộng trên Trái Đất.", applications: ["Truyền hình DTH", "Định vị dẫn đường toàn cầu", "Liên lạc hàng hải viễn dương"] },
  { term: "GEO", fullName: "Geostationary Earth Orbit", definition: "Quỹ đạo địa tĩnh cách Trái Đất 35,786 km, nơi vệ tinh có chu kỳ quay bằng chu kỳ tự quay của Trái Đất (đứng yên so với mặt đất).", applications: ["Vệ tinh viễn thông Vinasat", "Vệ tinh truyền hình", "Vệ tinh dự báo thời tiết"] },
  { term: "LEO", fullName: "Low Earth Orbit", definition: "Quỹ đạo Trái Đất tầm thấp (cao độ 500-2000 km), giúp độ trễ tín hiệu thấp cực kỳ phù hợp cho dịch vụ Internet vệ tinh băng rộng.", applications: ["Mạng Internet Starlink", "Vệ tinh chụp ảnh trinh sát mặt đất", "Trạm vũ trụ quốc tế ISS"] },
  { term: "VSAT", fullName: "Very Small Aperture Terminal", definition: "Trạm mặt đất ăng-ten có khẩu độ rất nhỏ (dưới 3 mét), cung cấp liên kết viễn thông 2 chiều qua vệ tinh.", applications: ["Mạng ngân hàng ATM vùng sâu xa", "Internet cho giàn khoan dầu ngoài khơi", "Chỉ huy quân sự cơ động"] },
  { term: "Transponder", fullName: "Satellite Transponder", definition: "Bộ phát đáp trên vệ tinh nhân tạo, thu tín hiệu đường lên, đổi tần số, khuếch đại và phát trở lại theo đường xuống.", applications: ["Truyền dẫn đa kênh truyền hình", "Phát lại băng tần vệ tinh liên lạc", "Hệ thống định vị toàn cầu"] },
  { term: "Uplink", fullName: "Uplink Transmission", definition: "Tuyến đường truyền tín hiệu từ trạm phát mặt đất (hoặc thiết bị di động người dùng) phát ngược lên vệ tinh (hoặc trạm gốc).", applications: ["Tải video Youtube lên mạng di động", "Trạm điều khiển phát lệnh lên vệ tinh", "Gửi dữ liệu từ điện thoại vệ tinh"] },
  { term: "Downlink", fullName: "Downlink Transmission", definition: "Tuyến đường truyền tín hiệu từ vệ tinh (hoặc trạm thu phát gốc) dội xuống trạm thu hoặc thiết bị di động của người dùng.", applications: ["Tải ứng dụng 5G", "Thu sóng truyền hình vệ tinh DTH", "Tải dữ liệu hình ảnh bản đồ"] },
  { term: "Footprint", fullName: "Satellite Footprint", definition: "Vùng phủ sóng, là khu vực diện tích bề mặt Trái Đất mà ăng-ten vệ tinh có thể chiếu sóng tới đảm bảo mức tín hiệu tốt.", applications: ["Quy hoạch kênh truyền hình vệ tinh", "Tính toán mua dải tần số quốc gia", "Chọn nhà cung cấp dịch vụ viễn thông"] },
  { term: "GPS", fullName: "Global Positioning System", definition: "Hệ thống định vị toàn cầu của Hoa Kỳ, sử dụng chùm vệ tinh MEO để cung cấp tọa độ địa lý và thời gian chính xác.", applications: ["Dẫn đường bản đồ Google Maps", "Theo dõi hạm đội xe tải", "Đồng bộ thời gian mạng viễn thông"] },
  { term: "GNSS", fullName: "Global Navigation Satellite System", definition: "Hệ thống vệ tinh dẫn đường toàn cầu, bao gồm các mạng lưới tích hợp như GPS (Mỹ), Galileo (Âu), GLONASS (Nga), Beidou (Trung Quốc).", applications: ["Chip định vị điện thoại cao cấp đa kênh", "Điều hướng thiết bị đo trắc địa", "Định vị máy bay dân dụng"] },
  { term: "Radar", fullName: "Radio Detection and Ranging", definition: "Hệ thống viễn thông đặc biệt dùng sóng vi ba phản xạ ngược lại để phát hiện và đo khoảng cách, phương hướng của mục tiêu.", applications: ["Kiểm soát không lưu hàng không", "Phát hiện bão thời tiết", "Hệ thống cảnh báo sớm tên lửa quân sự"] },
  { term: "Doppler Effect", fullName: "Hiệu ứng Doppler", definition: "Sự thay đổi tần số biểu kiến của sóng điện từ khi nguồn phát và máy thu đang chuyển động tương đối hướng về hoặc xa nhau.", applications: ["Radar đo tốc độ xe CSGT", "Phát hiện mục tiêu bay chuyển động nhanh", "Dự báo thời tiết mây bão"] },
  { term: "Spectrum Analyzer", fullName: "Máy phân tích phổ", definition: "Thiết bị đo lường cực kỳ quan trọng trong viễn thông, hiển thị biên độ tín hiệu dưới dạng biểu đồ theo trục miền tần số.", applications: ["Dò tìm sóng nhiễu can nhiễu", "Kiểm tra băng thông tín hiệu 5G phát ra", "Thiết kế đo kiểm bộ khuếch đại RF"] },
  { term: "Oscilloscope", fullName: "Máy hiện sóng", definition: "Thiết bị đo lường điện tử cơ bản hiển thị đồ thị của tín hiệu điện áp thay đổi theo trục thời gian (miền thời gian).", applications: ["Đo kiểm xung tín hiệu mã hóa", "Kiểm tra độ nhiễu nguồn viễn thông", "Khắc phục lỗi bo mạch thiết bị"] },
  { term: "VNA", fullName: "Vector Network Analyzer", definition: "Máy phân tích mạng vector, siêu công cụ phân tích RF dùng để đo cả biên độ và pha của các thông số tán xạ S-parameters.", applications: ["Cân chỉnh phối hợp trở kháng Ăng-ten", "Đo kiểm linh kiện cao tần vi ba", "Thiết kế bộ lọc tần số chuyên nghiệp"] },
  { term: "OTDR", fullName: "Optical Time-Domain Reflectometer", definition: "Máy đo cáp quang, phát một xung ánh sáng và phân tích tia phản xạ dội về để tìm vị trí sợi quang bị đứt gãy hoặc suy hao.", applications: ["Sửa chữa mạng Internet cáp quang", "Nghiệm thu đường trục cáp quang biển", "Đo độ suy hao mối nối hàn quang"] },
  { term: "Bandwidth", fullName: "System Bandwidth", definition: "Băng thông hệ thống, khoảng chênh lệch giữa tần số cao nhất và tần số thấp nhất của dải tần được phép truyền tải tín hiệu.", applications: ["Thuê bao cáp quang Internet", "Phân bổ dải tần 4G LTE/5G", "Xác định giới hạn dung lượng kênh"] },
  { term: "Throughput", fullName: "Data Throughput (Thông lượng)", definition: "Tốc độ truyền dữ liệu thành công và thực tế đo được qua mạng, thấp hơn băng thông lý thuyết do tiêu hao đóng gói và lỗi mạng.", applications: ["Đo Speedtest tốc độ mạng", "Đánh giá chất lượng thực tế mạng 5G", "Thiết kế tối ưu mạng nội bộ doanh nghiệp"] },
  { term: "Latency", fullName: "Network Latency (Độ trễ)", definition: "Khoảng thời gian cần thiết để một gói tin dữ liệu truyền đi từ nguồn tới đích (thường tính bằng phần nghìn giây - ms).", applications: ["Phẫu thuật qua mạng viễn thông", "Điều khiển game online thời gian thực", "Giao dịch chứng khoán cao tần (HFT)"] },
  { term: "Jitter", fullName: "Packet Jitter", definition: "Độ biến động bất thường của thời gian trễ giữa các gói tin khi truyền trên mạng viễn thông IP gây giật lag luồng liên tục.", applications: ["Đánh giá chất lượng cuộc gọi VoIP", "Khắc phục giật lag khi Livestream video", "Chẩn đoán đường truyền hội nghị truyền hình"] },
];

async function main() {
  console.log("Bat dau sinh truc tiep 100 tu khoa Vo tuyen & Vien thong...");
  
  // Doc du lieu cu
  let existingData = [];
  if (fs.existsSync(telecomFilePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(telecomFilePath, 'utf8'));
    } catch (e) {
      console.log("Loi parse file cu, coi nhu mang rong", e);
    }
  }

  // Loc cac tu khoa da ton tai de tranh duplicate
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
      newTerm.category = "Vô tuyến & Viễn thông";
      if (!newTerm.youtubeUrl) {
          newTerm.youtubeUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(newTerm.term + " telecommunications");
      }
      existingData.push(newTerm);
      existingTerms.add(normalized);
      addedCount++;
    } else {
      console.log("Bo qua tu khoa da ton tai:", newTerm.term);
    }
  }

  fs.writeFileSync(telecomFilePath, JSON.stringify(existingData, null, 2), 'utf8');
  console.log("Hoan tat ghi vao vo_tuyen_vien_thong.json!");
  console.log("So tu khoa duoc them vao: " + addedCount);
}

main();
