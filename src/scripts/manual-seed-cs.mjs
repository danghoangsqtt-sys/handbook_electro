import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesDir = path.join(__dirname, '../../public/data/categories');
const csFilePath = path.join(categoriesDir, 'khoa_hoc_may_tinh.json');

// Hàm tạo UUID giả lập
function generateId() {
  return 'cs_' + Math.random().toString(36).substring(2, 9);
}

const termsToInsert = [
  // 1-20: Cấu trúc dữ liệu & Thuật toán
  { term: "Array", fullName: "Array Data Structure", definition: "Mảng, cấu trúc dữ liệu lưu trữ một tập hợp các phần tử có cùng kiểu dữ liệu tại các vị trí bộ nhớ liền kề nhau.", applications: ["Lưu trữ danh sách cố định", "Bộ nhớ đệm pixel màn hình", "Lập ma trận toán học"] },
  { term: "Linked List", fullName: "Singly Linked List", definition: "Danh sách liên kết, tập hợp các nút mà mỗi nút chứa dữ liệu và con trỏ trỏ tới vị trí của nút tiếp theo trong bộ nhớ.", applications: ["Quản lý bộ nhớ động", "Thực thi cấu trúc Stack/Queue", "Lịch sử duyệt web cơ bản"] },
  { term: "Doubly Linked List", fullName: "Doubly Linked List", definition: "Danh sách liên kết kép, mỗi nút chứa hai con trỏ trỏ về cả nút phía trước và phía sau nó.", applications: ["Nút Forward/Back của trình duyệt", "Trình phát nhạc (Next/Prev)", "Undo/Redo nâng cao"] },
  { term: "Circular Linked", fullName: "Circular Linked List", definition: "Danh sách liên kết vòng, trong đó nút cuối cùng trỏ ngược lại nút đầu tiên tạo thành một vòng khép kín.", applications: ["Điều phối CPU (Round Robin)", "Trò chơi cờ nhiều người xoay vòng", "Danh sách bài hát lặp lại"] },
  { term: "Priority Queue", fullName: "Priority Queue", definition: "Hàng đợi ưu tiên, mỗi phần tử có một mức độ ưu tiên, phần tử ưu tiên cao nhất sẽ được lấy ra trước bất kể thứ tự vào.", applications: ["Lập lịch ngắt CPU", "Thuật toán tìm đường Dijkstra", "Xử lý sự kiện trong OS"] },
  { term: "Deque", fullName: "Double-ended Queue", definition: "Hàng đợi hai đầu, cho phép chèn và xóa các phần tử ở cả hai đầu (trước và sau) với độ phức tạp O(1).", applications: ["Thuật toán đồ thị đặc biệt", "Quản lý luồng tác vụ song song", "Bộ nhớ đệm giới hạn kích thước"] },
  { term: "Max Heap", fullName: "Max Heap Tree", definition: "Cây nhị phân hoàn chỉnh mà giá trị của nút cha luôn lớn hơn hoặc bằng giá trị của các nút con.", applications: ["Hàng đợi ưu tiên max", "Thuật toán HeapSort", "Tìm K phần tử lớn nhất"] },
  { term: "Min Heap", fullName: "Min Heap Tree", definition: "Cây nhị phân hoàn chỉnh mà giá trị của nút cha luôn nhỏ hơn hoặc bằng giá trị của các nút con.", applications: ["Thuật toán mã hóa Huffman", "Thuật toán đường đi ngắn nhất", "Hàng đợi sự kiện thời gian"] },
  { term: "Trie", fullName: "Prefix Tree (Trie)", definition: "Cây tiền tố, cấu trúc dữ liệu dạng cây chuyên dùng để lưu trữ và tra cứu các xâu ký tự (chuỗi) cực kỳ nhanh chóng.", applications: ["Gợi ý từ khóa Autocomplete", "Kiểm tra lỗi chính tả", "Định tuyến IP trong Router"] },
  { term: "B-Tree", fullName: "B-Tree Data Structure", definition: "Cây tìm kiếm tự cân bằng mở rộng, trong đó một nút có thể có nhiều hơn hai nút con, được thiết kế chuyên biệt cho hệ thống lưu trữ đĩa.", applications: ["Cơ sở dữ liệu MySQL", "Hệ thống tệp NTFS", "Quản lý Index của ổ cứng"] },
  { term: "Red-Black Tree", fullName: "Red-Black Tree", definition: "Cây tìm kiếm nhị phân tự cân bằng thông qua việc tô màu các nút (đỏ/đen) để đảm bảo chiều cao cây luôn ở mức O(log n).", applications: ["Map/Set trong C++ STL", "Lịch trình Completely Fair của Linux", "Index dữ liệu trong nhớ"] },
  { term: "AVL Tree", fullName: "Adelson-Velsky Landis Tree", definition: "Cây nhị phân tự cân bằng khắt khe nhất, luôn giữ độ chênh lệch chiều cao giữa hai cây con của mọi nút tối đa là 1.", applications: ["Cơ sở dữ liệu In-memory", "Hệ thống từ điển tĩnh", "Danh bạ điện thoại phần mềm"] },
  { term: "DFS", fullName: "Depth-First Search", definition: "Tìm kiếm theo chiều sâu, thuật toán duyệt đồ thị hoặc cây bằng cách đi sâu xuống một nhánh xa nhất có thể trước khi lùi lại.", applications: ["Giải bài toán Mê cung", "Sắp xếp Topo", "Tìm thành phần liên thông"] },
  { term: "BFS", fullName: "Breadth-First Search", definition: "Tìm kiếm theo chiều rộng, duyệt qua tất cả các nút cùng một độ sâu trước khi chuyển xuống độ sâu tiếp theo của đồ thị.", applications: ["Tìm đường đi ngắn nhất đồ thị không trọng số", "Crawl dữ liệu Web", "Game dò mìn (Minesweeper)"] },
  { term: "Dijkstra", fullName: "Dijkstra's Algorithm", definition: "Thuật toán kinh điển tìm đường đi ngắn nhất từ một đỉnh đến các đỉnh còn lại trong đồ thị có trọng số không âm.", applications: ["Bản đồ Google Maps", "Định tuyến mạng OSPF", "Mạng viễn thông"] },
  { term: "A* Algorithm", fullName: "A* Search Algorithm", definition: "Thuật toán tìm đường đi ngắn nhất được tối ưu bằng hàm Heuristic để hướng tới mục tiêu nhanh hơn thay vì tỏa tròn như Dijkstra.", applications: ["Đường đi AI trong Game", "Quy hoạch quỹ đạo Robot", "Điều hướng xe tự hành"] },
  { term: "Dynamic Prog", fullName: "Dynamic Programming (Quy hoạch động)", definition: "Kỹ thuật chia một bài toán phức tạp thành các bài toán con chồng chéo và lưu trữ kết quả để tránh tính toán lại.", applications: ["Bài toán Cái ba lô (Knapsack)", "Chuỗi DNA sinh học", "So sánh văn bản Diff"] },
  { term: "Greedy", fullName: "Greedy Algorithm (Thuật toán tham lam)", definition: "Phương pháp giải quyết bài toán bằng cách luôn đưa ra lựa chọn tối ưu cục bộ tốt nhất tại mỗi bước với hy vọng đạt được tối ưu toàn cục.", applications: ["Nén dữ liệu Huffman", "Cây khung nhỏ nhất (Kruskal/Prim)", "Bài toán chia tiền lẻ"] },
  { term: "Backtracking", fullName: "Backtracking Algorithm (Quay lui)", definition: "Thuật toán thử từng khả năng, nếu phát hiện sai hướng sẽ quay lui lại ngã rẽ trước đó để thử con đường khác.", applications: ["Giải Sudoku", "Bài toán 8 quân hậu", "Phân tích cú pháp Compiler"] },
  { term: "Divide Conquer", fullName: "Divide and Conquer (Chia để trị)", definition: "Chia bài toán lớn thành các bài toán con hoàn toàn độc lập, giải quyết chúng và gộp kết quả lại.", applications: ["Sắp xếp QuickSort / MergeSort", "Thuật toán biến đổi Fourier (FFT)", "Nhân ma trận siêu tốc"] },

  // 21-40: Mạng máy tính & Giao thức
  { term: "OSI Model", fullName: "Open Systems Interconnection Model", definition: "Mô hình quy chiếu 7 lớp mô tả các tiêu chuẩn giao tiếp mạng máy tính từ lớp vật lý (Physical) đến lớp ứng dụng (Application).", applications: ["Học tập mạng máy tính", "Thiết kế giao thức mạng", "Chẩn đoán sự cố mạng theo tầng"] },
  { term: "TCP/IP", fullName: "TCP/IP Model", definition: "Mô hình mạng 4 lớp thực tế đang vận hành mạng Internet toàn cầu, bao gồm Network Access, Internet, Transport và Application.", applications: ["Mạng Internet toàn cầu", "Mạng nội bộ LAN", "Cấu hình IP máy tính"] },
  { term: "TCP", fullName: "Transmission Control Protocol", definition: "Giao thức điều khiển truyền vận hướng kết nối, đảm bảo dữ liệu đến đúng thứ tự và không bị mất (tin cậy 100%).", applications: ["Duyệt Web HTTP", "Gửi email SMTP", "Tải file trực tuyến"] },
  { term: "UDP", fullName: "User Datagram Protocol", definition: "Giao thức truyền dữ liệu không kết nối, tốc độ cực cao do không kiểm tra lỗi và không đảm bảo gói tin đến đích.", applications: ["Gọi video trực tuyến", "Game online thời gian thực", "Livestream sự kiện"] },
  { term: "DNS", fullName: "Domain Name System", definition: "Hệ thống phân giải tên miền, đóng vai trò như danh bạ Internet biến tên miền dễ nhớ thành địa chỉ IP.", applications: ["Gõ google.com để truy cập", "Cấu hình mạng gia đình", "Tránh tấn công DNS Spoofing"] },
  { term: "DHCP", fullName: "Dynamic Host Configuration Protocol", definition: "Giao thức tự động cấp phát địa chỉ IP và các thông số mạng tĩnh khác cho các thiết bị khi chúng kết nối vào mạng.", applications: ["Modem WiFi nhà cấp IP cho điện thoại", "Mạng khách sạn", "Phòng máy trường học"] },
  { term: "HTTP", fullName: "Hypertext Transfer Protocol", definition: "Giao thức cốt lõi của World Wide Web dùng để truyền tải các văn bản siêu liên kết (HTML) giữa Client và Server.", applications: ["Lướt web thông thường", "Gọi API RESTful", "Tải tài nguyên hình ảnh web"] },
  { term: "HTTPS", fullName: "HTTP Secure", definition: "Phiên bản bảo mật của HTTP, dữ liệu được mã hóa toàn bộ bằng TLS/SSL bảo vệ khỏi việc bị đánh cắp trên đường truyền.", applications: ["Web ngân hàng", "Trang đăng nhập", "Thương mại điện tử"] },
  { term: "FTP", fullName: "File Transfer Protocol", definition: "Giao thức mạng tiêu chuẩn dùng để tải tệp tin và thư mục lên xuống giữa máy chủ và máy khách.", applications: ["Quản lý Hosting Web", "Chia sẻ file Server nội bộ", "Sao lưu dữ liệu đám mây"] },
  { term: "SMTP", fullName: "Simple Mail Transfer Protocol", definition: "Giao thức mạng tiêu chuẩn dùng riêng cho việc gửi thư điện tử (email) từ máy khách lên máy chủ hoặc giữa các máy chủ.", applications: ["Gửi email Gmail", "Hệ thống thư điện tử công ty", "Gửi thông báo tự động (Alert)"] },
  { term: "IMAP", fullName: "Internet Message Access Protocol", definition: "Giao thức cho phép ứng dụng khách truy cập và quản lý email trực tiếp trên máy chủ mà không cần tải hết về máy cục bộ.", applications: ["Đồng bộ email trên nhiều điện thoại", "Ứng dụng Outlook", "Quản lý hộp thư nhóm"] },
  { term: "POP3", fullName: "Post Office Protocol v3", definition: "Giao thức tải toàn bộ thư điện tử từ máy chủ về máy khách cục bộ, thường xóa luôn bản gốc trên máy chủ.", applications: ["Sử dụng email offline", "Lưu trữ thư nội bộ cá nhân", "Tiết kiệm dung lượng server"] },
  { term: "SSH", fullName: "Secure Shell", definition: "Giao thức mạng mã hóa cấp phép đăng nhập từ xa dòng lệnh để quản trị an toàn các máy chủ Linux/Unix.", applications: ["Quản trị VPS đám mây", "Lệnh Git qua SSH", "Bảo trì máy chủ từ xa"] },
  { term: "BGP", fullName: "Border Gateway Protocol", definition: "Giao thức định tuyến lõi của Internet, giúp các hệ thống tự trị (ISP) trao đổi thông tin định tuyến để tìm đường đi toàn cầu.", applications: ["Định tuyến mạng trục quốc gia", "Chống sự cố đứt cáp quang biển", "Quản lý hạ tầng mạng lớn"] },
  { term: "ARP", fullName: "Address Resolution Protocol", definition: "Giao thức chuyển đổi địa chỉ IP (lớp mạng) thành địa chỉ MAC (lớp liên kết dữ liệu) cục bộ trong cùng một mạng LAN.", applications: ["Giao tiếp mạng LAN", "Phát hiện giả mạo ARP Spoofing", "Tìm máy in trong mạng"] },
  { term: "MAC Address", fullName: "Media Access Control Address", definition: "Địa chỉ vật lý duy nhất toàn cầu gồm 48-bit được nhà sản xuất ghi cứng (burn) vào phần cứng card mạng của thiết bị.", applications: ["Bảo mật lọc địa chỉ MAC WiFi", "Định danh thiết bị cứng", "Hỗ trợ DHCP cấp IP cố định"] },
  { term: "IP Address", fullName: "Internet Protocol Address", definition: "Chuỗi số logic định danh vị trí của một thiết bị trên mạng máy tính (IPv4 hoặc IPv6).", applications: ["Định tuyến Internet", "Hosting Website", "Chặn IP độc hại"] },
  { term: "Subnet Mask", fullName: "Subnet Mask (Mặt nạ mạng)", definition: "Chuỗi 32-bit dùng chung với IP để phân tách phần nào là địa chỉ Mạng (Network) và phần nào là địa chỉ Máy (Host).", applications: ["Thiết lập dải IP công ty", "Cách ly các phòng ban", "Quy hoạch không gian mạng"] },
  { term: "VLAN", fullName: "Virtual LAN", definition: "Mạng LAN ảo phân chia một Switch vật lý thành nhiều mạng cục bộ độc lập logic, tăng bảo mật và giảm broadcast storm.", applications: ["Mạng công ty nhiều phòng ban", "Cô lập mạng thiết bị IoT", "Mạng khách sạn"] },
  { term: "Load Balancing", fullName: "Load Balancing (Cân bằng tải)", definition: "Hệ thống phân phối lưu lượng truy cập mạng đều đặn lên nhiều máy chủ backend để tránh quá tải một máy chủ duy nhất.", applications: ["Máy chủ web Facebook/Google", "Hệ thống thương mại điện tử lớn", "Kiến trúc đám mây Cloud"] },

  // 41-60: Kiến trúc Máy tính & Hệ điều hành
  { term: "Von Neumann", fullName: "Von Neumann Architecture", definition: "Kiến trúc máy tính cơ sở dùng chung một bộ nhớ vật lý cho cả Lệnh (Instruction) và Dữ liệu (Data), dẫn đến nút thắt cổ chai.", applications: ["Kiến trúc PC tiêu chuẩn", "Vi xử lý máy tính xách tay", "Chip Intel x86"] },
  { term: "Harvard", fullName: "Harvard Architecture", definition: "Kiến trúc tách biệt hoàn toàn bộ nhớ Lệnh và bộ nhớ Dữ liệu với các bus riêng, cho phép đọc lệnh và dữ liệu cùng lúc.", applications: ["Vi điều khiển AVR", "Bộ xử lý tín hiệu DSP", "Nhân chip ARM Cortex"] },
  { term: "ALU", fullName: "Arithmetic Logic Unit", definition: "Khối Logic Số học, thành phần cốt lõi bên trong CPU thực hiện tất cả các phép toán số học (+,-,*,/) và phép toán logic (AND, OR).", applications: ["Xử lý phép tính máy tính", "Giải mã mã hóa phần cứng", "So sánh điều kiện rẽ nhánh"] },
  { term: "Register", fullName: "CPU Register (Thanh ghi)", definition: "Vùng nhớ vật lý nhỏ bé nằm ngay bên trong lõi CPU, có tốc độ truy xuất nhanh nhất hệ thống dùng chứa dữ liệu tạm thời.", applications: ["Thanh ghi PC chỉ lệnh tiếp theo", "Thanh ghi trạng thái Status", "Tính toán ALU trực tiếp"] },
  { term: "ISA", fullName: "Instruction Set Architecture", definition: "Kiến trúc tập lệnh, bản thiết kế kỹ thuật quy định các lệnh ngôn ngữ máy cơ bản nhất mà phần cứng CPU đó có thể hiểu.", applications: ["Tập lệnh x86/x64 của Intel", "Tập lệnh ARM", "Tập lệnh RISC-V"] },
  { term: "Pipelining", fullName: "Instruction Pipelining", definition: "Kỹ thuật đường ống trong CPU cho phép thực hiện song song các giai đoạn (Fetch, Decode, Execute) của nhiều lệnh khác nhau.", applications: ["Tăng tốc vi xử lý hiện đại", "Tối ưu hóa vòng đời xung nhịp CPU", "Thiết kế lõi ARM"] },
  { term: "Superscalar", fullName: "Superscalar Architecture", definition: "Kiến trúc siêu vô hướng, sở hữu nhiều đơn vị thực thi ALU trong một lõi CPU, cho phép hoàn thành nhiều lệnh trong một chu kỳ đồng hồ.", applications: ["Chip Intel Core đời mới", "Chip Apple Silicon", "CPU Máy chủ Xeon"] },
  { term: "DMA", fullName: "Direct Memory Access", definition: "Cơ chế phần cứng cho phép các thiết bị ngoại vi truy cập trực tiếp vào RAM để đọc/ghi dữ liệu mà không cần làm phiền CPU.", applications: ["Card mạng tải dữ liệu Gigabit", "Ổ cứng NVMe SSD", "Giao tiếp Card đồ họa (GPU)"] },
  { term: "Context Switch", fullName: "Context Switching (Chuyển ngữ cảnh)", definition: "Quá trình hệ điều hành lưu trạng thái của tiến trình hiện tại và khôi phục trạng thái của tiến trình tiếp theo để CPU thực thi luân phiên.", applications: ["Hệ điều hành đa nhiệm đa luồng", "Đồng hồ định thời CPU", "Hoạt động ngắt (Interrupt)"] },
  { term: "Paging", fullName: "Memory Paging (Phân trang)", definition: "Cơ chế quản lý bộ nhớ của OS chia không gian ảo thành các trang (Page) và ánh xạ ngẫu nhiên vào các khung (Frame) trong RAM.", applications: ["Cấp phát RAM phân mảnh", "Tránh lãng phí bộ nhớ", "Tính năng bảo vệ vùng nhớ tiến trình"] },
  { term: "Segmentation", fullName: "Memory Segmentation", definition: "Cơ chế chia bộ nhớ theo các khối có kích thước không đều, phù hợp với góc nhìn logic của lập trình viên (vùng Code, Data, Stack).", applications: ["Cấu trúc file nhị phân PE/ELF", "Bảo vệ các đoạn code không bị ghi đè", "Hệ điều hành x86 cũ"] },
  { term: "Thrashing", fullName: "Thrashing", definition: "Hiện tượng thảm họa khi hệ thống thiếu RAM trầm trọng, CPU tốn toàn bộ thời gian chỉ để đổi trang (swap) dữ liệu ổ cứng mà không tính toán được gì.", applications: ["Máy tính bị treo cứng do thiếu RAM", "Phát hiện tắc nghẽn server", "Tối ưu hóa kích thước Pagefile"] },
  { term: "Polling", fullName: "Polling Mechanism", definition: "Kỹ thuật phần mềm liên tục vòng lặp kiểm tra trạng thái của thiết bị ngoại vi xem nó đã sẵn sàng hay chưa, gây lãng phí CPU.", applications: ["Đọc nút bấm Arduino cơ bản", "Hệ thống không hỗ trợ Interrupt", "Giao tiếp thiết bị ngoại vi quá chậm"] },
  { term: "Multiprocessing", fullName: "Multiprocessing", definition: "Kiến trúc phần cứng và hệ điều hành cho phép thực thi ứng dụng đồng thời trên hai hay nhiều nhân vật lý CPU riêng biệt.", applications: ["Render Video 3D", "Máy chủ Cơ sở dữ liệu đa nhân", "Học sâu Neural Network"] },
  { term: "Multithreading", fullName: "Multithreading", definition: "Khả năng của một tiến trình duy nhất tự chia nhỏ mình thành nhiều luồng chạy song song để khai thác tối đa CPU.", applications: ["Web Browser mở nhiều tab", "Chương trình Game Engine 3D", "Máy chủ Node.js nâng cao"] },
  { term: "Concurrency", fullName: "Concurrency (Đồng thời)", definition: "Khái niệm thiết kế phần mềm xử lý nhiều tác vụ bằng cách chuyển đổi nhanh chóng giữa chúng, tạo ảo giác chúng chạy cùng lúc.", applications: ["Golang Goroutines", "Lập trình bất đồng bộ Async/Await", "Giao diện UI không bị đơ"] },
  { term: "Hypervisor", fullName: "Virtual Machine Monitor", definition: "Phần mềm hệ thống hoặc phần cứng dùng để tạo ra, chạy và cô lập hoàn toàn các Máy ảo (VM) trên cùng một máy chủ vật lý.", applications: ["VMware ESXi", "Microsoft Hyper-V", "Đám mây AWS EC2"] },
  { term: "Container", fullName: "Docker Container", definition: "Công nghệ ảo hóa cấp hệ điều hành siêu nhẹ, đóng gói ứng dụng và tất cả thư viện liên quan thành một khối duy nhất, khởi động mất vài mili-giây.", applications: ["Phát triển Web Docker", "Triển khai Kubernetes (K8s)", "Đồng bộ môi trường Dev/Prod"] },
  { term: "File System", fullName: "File System", definition: "Hệ thống tập tin của hệ điều hành chịu trách nhiệm phân tích không gian ổ cứng vật lý thành các File và Folder có cấu trúc cây.", applications: ["NTFS trên Windows", "EXT4 trên Linux", "APFS trên máy Mac"] },
  { term: "System Call", fullName: "System Call (Syscall)", definition: "Giao diện phần mềm để một chương trình ứng dụng người dùng (User Mode) yêu cầu hệ điều hành nhân (Kernel Mode) thực hiện các tác vụ đặc quyền.", applications: ["Đọc/ghi file ra ổ cứng", "Tạo luồng tiến trình mới", "Mở cổng mạng Socket"] },

  // 61-80: Cơ sở dữ liệu & Hệ thống Phân tán
  { term: "RDBMS", fullName: "Relational Database Management System", definition: "Hệ quản trị cơ sở dữ liệu quan hệ, dữ liệu lưu trong các bảng (hàng, cột) liên kết với nhau thông qua khóa ngoại chặt chẽ.", applications: ["MySQL", "PostgreSQL", "Oracle Database"] },
  { term: "NoSQL", fullName: "Not Only SQL Database", definition: "Các loại cơ sở dữ liệu phi quan hệ, lưu trữ dữ liệu dưới dạng linh hoạt (Tài liệu, Key-Value, Đồ thị) giúp mở rộng ngang dễ dàng.", applications: ["MongoDB", "Redis", "Cassandra"] },
  { term: "SQL", fullName: "Structured Query Language", definition: "Ngôn ngữ truy vấn có cấu trúc, chuẩn công nghiệp để giao tiếp, chèn, xóa và truy xuất dữ liệu từ các RDBMS.", applications: ["Phân tích dữ liệu Data Analyst", "Viết câu truy vấn JOIN", "Báo cáo thông minh BI"] },
  { term: "ACID", fullName: "Atomicity, Consistency, Isolation, Durability", definition: "4 tính chất cốt lõi (Nguyên tử, Nhất quán, Cô lập, Bền vững) đảm bảo mọi giao dịch cơ sở dữ liệu luôn đáng tin cậy tuyệt đối.", applications: ["Chuyển khoản ngân hàng", "Giao dịch thanh toán giỏ hàng", "Đảm bảo không mất tiền khi cúp điện"] },
  { term: "CAP Theorem", fullName: "CAP Theorem", definition: "Định lý CAP chứng minh hệ thống phân tán chỉ có thể chọn tối đa 2 trong 3 tính chất: Consistency (Nhất quán), Availability (Sẵn sàng) và Partition Tolerance (Chịu chia cắt).", applications: ["Thiết kế cấu trúc NoSQL", "Cân nhắc đánh đổi hệ thống Blockchain", "Thiết kế Data Center đa vùng"] },
  { term: "Sharding", fullName: "Database Sharding", definition: "Kỹ thuật phân mảnh cơ sở dữ liệu theo chiều ngang, chia một bảng dữ liệu siêu khổng lồ ra thành nhiều máy chủ DB nhỏ hơn.", applications: ["Mở rộng cơ sở dữ liệu Facebook", "Lưu trữ tin nhắn Twitter", "MongoDB Sharded Cluster"] },
  { term: "Replication", fullName: "Database Replication", definition: "Bản sao lưu dữ liệu tự động giữa một máy chủ Master sang nhiều máy chủ Slave để đảm bảo dự phòng và chia sẻ tải đọc.", applications: ["Đảm bảo tính sẵn sàng cao (HA)", "Đọc dữ liệu nhanh hơn (Read Replica)", "Khôi phục thảm họa (Disaster Recovery)"] },
  { term: "Normalization", fullName: "Database Normalization (Chuẩn hóa)", definition: "Quy trình thiết kế bảng DB nhằm giảm thiểu tối đa việc lặp lại dữ liệu thừa và tránh các dị thường khi thêm/xóa/sửa.", applications: ["Thiết kế cấu trúc DB 3NF", "Thiết kế phần mềm kế toán", "Quản lý kho bãi ERP"] },
  { term: "Foreign Key", fullName: "Foreign Key (Khóa ngoại)", definition: "Một trường trong bảng CSDL quan hệ tham chiếu trực tiếp tới Khóa chính (Primary Key) của một bảng khác tạo thành mối quan hệ chặt chẽ.", applications: ["Liên kết User với Order", "Kiểm tra ràng buộc toàn vẹn", "Xóa tầng Cascade Delete"] },
  { term: "Primary Key", fullName: "Primary Key (Khóa chính)", definition: "Định danh độc nhất vô nhị (không được trùng, không được Null) dành cho mỗi bản ghi trong một bảng cơ sở dữ liệu.", applications: ["Cột ID tự tăng", "Mã số sinh viên/Căn cước công dân", "Lập chỉ mục tìm kiếm cực nhanh"] },
  { term: "MapReduce", fullName: "MapReduce Framework", definition: "Mô hình lập trình phân tán kinh điển của Google dùng để xử lý dữ liệu lớn bằng cách ánh xạ (Map) và thu gọn (Reduce) song song.", applications: ["Apache Hadoop", "Đếm tần suất xuất hiện từ khóa Web", "Phân tích nhật ký log Big Data"] },
  { term: "Hadoop", fullName: "Apache Hadoop", definition: "Hệ sinh thái mã nguồn mở nổi tiếng nhất dùng lưu trữ và phân tích khối lượng Dữ liệu lớn (Big Data) trên các cụm máy tính phần cứng rẻ tiền.", applications: ["Lưu trữ HDFS", "Hệ thống gợi ý mua hàng", "Phân tích mạng xã hội"] },
  { term: "Microservices", fullName: "Microservices Architecture", definition: "Kiến trúc chia nhỏ ứng dụng đồ sộ thành hàng trăm dịch vụ nhỏ, độc lập, có DB riêng và gọi nhau qua mạng API.", applications: ["Cấu trúc hệ thống Netflix", "Ứng dụng gọi xe Grab/Uber", "Hệ thống Shopee"] },
  { term: "RESTful API", fullName: "RESTful Web Services", definition: "Phong cách thiết kế API chuẩn mực trên web sử dụng danh từ thay vì động từ và kết hợp cùng phương thức HTTP chuẩn GET/POST/PUT/DELETE.", applications: ["Kết nối Frontend React với Backend", "Cung cấp Public API cho lập trình viên", "Kiến trúc Web App hiện đại"] },
  { term: "RPC", fullName: "Remote Procedure Call", definition: "Gọi hàm từ xa. Kỹ thuật cho phép một chương trình gọi thủ tục chạy trên một máy tính khác thông qua mạng cứ như thể gọi hàm ở máy cục bộ.", applications: ["Giao thức gRPC của Google", "Hệ thống Microservices tốc độ cao", "Thực thi hàm phân tán"] },
  { term: "Message Queue", fullName: "Message Queue", definition: "Hàng đợi thông điệp là các phần mềm trung gian nhận, lưu giữ tạm thời và phân phối các gói tin từ dịch vụ này sang dịch vụ khác giúp giảm tải bất đồng bộ.", applications: ["Kafka, RabbitMQ, SQS", "Xử lý ảnh Upload ngầm", "Hệ thống gửi Email hàng loạt"] },
  { term: "Distributed Sys", fullName: "Distributed System", definition: "Hệ thống phân tán bao gồm rất nhiều máy tính độc lập liên kết qua mạng, hoạt động và phối hợp trông như một máy tính lớn duy nhất.", applications: ["Mạng lưới Blockchain", "Đám mây máy tính AWS", "Mạng chia sẻ Torrent P2P"] },
  { term: "Consensus", fullName: "Consensus Algorithm (Đồng thuận)", definition: "Thuật toán giúp mạng lưới các máy tính không tin cậy nhau đạt được một thỏa thuận chung về trạng thái của hệ thống.", applications: ["Proof of Work (Bitcoin)", "Giao thức Raft cho máy chủ phân tán", "Đồng thuận Proof of Stake"] },
  { term: "Blockchain", fullName: "Blockchain Technology", definition: "Sổ cái điện tử phân tán, bất biến, mã hóa chặt chẽ nối với nhau bằng mã băm, không một máy chủ trung tâm nào thao túng được.", applications: ["Tiền mã hóa Crypto", "Truy xuất nguồn gốc chuỗi cung ứng nông sản", "Hợp đồng thông minh Smart Contract"] },
  { term: "Paxos", fullName: "Paxos Algorithm", definition: "Giao thức đồng thuận phân tán phức tạp nổi tiếng được nghiên cứu đầu tiên để giải quyết vấn đề đồng ý trạng thái trong mạng lỗi.", applications: ["Apache ZooKeeper", "Hệ thống Google Chubby Lock", "Cơ sở dữ liệu phân tán Spanner"] },

  // 81-100: AI & Kỹ thuật Phần mềm
  { term: "AI", fullName: "Artificial Intelligence", definition: "Trí tuệ nhân tạo, ngành Khoa học Máy tính nhằm tạo ra máy móc có khả năng bắt chước tư duy, nhận thức và giải quyết vấn đề của não người.", applications: ["Trợ lý ảo thông minh Siri/Alexa", "Cờ vua máy tính đánh bại nhà vô địch", "Bot chăm sóc khách hàng"] },
  { term: "Machine Learning", fullName: "Machine Learning (ML)", definition: "Nhánh của AI tập trung vào việc tự động học hỏi, cải thiện hiệu suất thông qua phân tích lượng lớn dữ liệu mà không cần lập trình luật cố định.", applications: ["Gợi ý phim Netflix", "Lọc Email rác Spam", "Nhận diện rủi ro tín dụng ngân hàng"] },
  { term: "Deep Learning", fullName: "Deep Learning", definition: "Nhánh sâu nhất của ML sử dụng Mạng Nơ-ron nhân tạo đa lớp (Deep Neural Networks) có khả năng tự động trích xuất đặc trưng cực khó.", applications: ["Nhận diện khuôn mặt FaceID", "Phân tích ung thư qua ảnh chụp X-Quang", "Dịch thuật giọng nói thời gian thực"] },
  { term: "Neural Network", fullName: "Artificial Neural Network (ANN)", definition: "Mạng Nơ-ron nhân tạo lấy cảm hứng từ mạng lưới tế bào thần kinh sinh học con người, cấu tạo từ các Nút và Trọng số toán học.", applications: ["Thuật toán nhận dạng chữ số viết tay MNIST", "Điều khiển xe tự lái hệ thống thị giác", "Chuyển văn bản thành giọng nói (TTS)"] },
  { term: "Supervised", fullName: "Supervised Learning", definition: "Học có giám sát, phương pháp AI mà con người phải cung cấp sẵn dữ liệu đầu vào đã được gán nhãn kết quả đúng (Label) để máy học theo.", applications: ["Dự đoán giá nhà dựa trên diện tích", "Phân loại giống chó mèo từ ảnh", "Nhận diện bệnh tiểu đường"] },
  { term: "Unsupervised", fullName: "Unsupervised Learning", definition: "Học không giám sát, máy móc tự động tìm ra các quy luật, sự phân cụm ẩn giấu bên trong một đống dữ liệu hoàn toàn không có nhãn.", applications: ["Phân khúc khách hàng mua sắm (Clustering)", "Phát hiện giao dịch thẻ tín dụng dị thường", "Giảm chiều dữ liệu PCA"] },
  { term: "Reinforcement", fullName: "Reinforcement Learning", definition: "Học tăng cường, mô hình đào tạo theo kiểu 'Thử và Sai', AI được thưởng hoặc phạt dựa trên hành động nó thực hiện trong một môi trường ảo.", applications: ["AI chơi Game AlphaGo", "Robot tự học cách bước đi", "Lập lịch điều hướng giao thông tự động"] },
  { term: "NLP", fullName: "Natural Language Processing", definition: "Xử lý ngôn ngữ tự nhiên, kỹ thuật giao thoa giữa Ngôn ngữ học và Khoa học máy tính giúp máy móc hiểu, đọc và tạo ra văn bản/giọng nói con người.", applications: ["Google Dịch", "Phân tích cảm xúc bình luận Facebook", "Chatbot trả lời tự động"] },
  { term: "Computer Vision", fullName: "Computer Vision", definition: "Thị giác máy tính, lĩnh vực chuyên biệt giúp AI có thể 'nhìn' và phân tích trích xuất dữ liệu logic từ hình ảnh số hoặc video.", applications: ["Đọc biển số xe phạt nguội", "Chẩn đoán y tế tự động", "Bảo mật chấm công khuôn mặt"] },
  { term: "Generative AI", fullName: "Generative Artificial Intelligence", definition: "AI tạo sinh, hệ thống có khả năng tự sáng tạo ra văn bản, hình ảnh, mã code, hoặc video hoàn toàn mới từ lời nhắc văn bản (Prompt).", applications: ["Vẽ tranh bằng Midjourney/DALL-E", "Viết mã lập trình Copilot", "Tạo giọng nói giả lập Deepfake"] },
  { term: "LLM", fullName: "Large Language Model", definition: "Mô hình ngôn ngữ lớn, một dạng AI mạng nơ-ron Transformer được huấn luyện trên hàng nghìn tỷ từ ngữ để hiểu biết sâu sắc văn cảnh loài người.", applications: ["ChatGPT của OpenAI", "Gemini của Google", "Claude của Anthropic"] },
  { term: "CI/CD", fullName: "Continuous Integration / Continuous Deployment", definition: "Phương pháp kỹ thuật phần mềm tự động hóa toàn bộ khâu kiểm thử (Tích hợp liên tục) và tự động triển khai mã lên máy chủ (Phân phối liên tục).", applications: ["Quy trình DevOps Github Actions", "Jenkins CI", "Tự động Test App Mobile và Đẩy lên Store"] },
  { term: "Agile", fullName: "Agile Methodology", definition: "Phương pháp luận phát triển phần mềm linh hoạt, chia dự án thành các giai đoạn lặp đi lặp lại ngắn (Sprint) để liên tục giao sản phẩm và thích ứng thay đổi.", applications: ["Quản lý dự án Tech Startup", "Họp Stand-up buổi sáng", "Thích nghi nhanh với yêu cầu khách hàng"] },
  { term: "Scrum", fullName: "Scrum Framework", definition: "Khung quản lý quy trình phát triển phổ biến nhất của Agile, định nghĩa rõ ràng các vai trò (Product Owner, Scrum Master, Team) và các sự kiện Sprint.", applications: ["Quản lý thẻ Jira/Trello", "Họp Retrospective cuối tuần", "Đánh giá Sprint Review"] },
  { term: "DevOps", fullName: "Development and Operations", definition: "Văn hóa và tập hợp công nghệ xóa nhòa ranh giới giữa bộ phận Lập trình (Dev) và Vận hành (Ops), giúp ra mắt tính năng nhanh, an toàn hơn.", applications: ["Kỹ sư hệ thống Cloud", "Quản lý hạ tầng bằng Code (IaC)", "Giám sát Log hệ thống liên tục"] },
  { term: "TDD", fullName: "Test-Driven Development", definition: "Lập trình hướng kiểm thử, yêu cầu lập trình viên phải viết Code kiểm tra (Unit Test) bị lỗi trước, rồi mới viết Code chính để vượt qua bài kiểm tra đó.", applications: ["Bảo đảm chất lượng phần mềm 100%", "Mã nguồn sạch, dễ tái cấu trúc", "Dự án tài chính ngân hàng lõi"] },
  { term: "VCS", fullName: "Version Control System", definition: "Hệ thống quản lý phiên bản mã nguồn, ghi lại mọi thay đổi của từng dòng code theo thời gian để có thể khôi phục nhánh bất cứ lúc nào.", applications: ["Hợp tác lập trình hàng ngàn người", "Git, SVN, Mercurial", "Sao lưu an toàn mã dự án"] },
  { term: "Git", fullName: "Git Distributed Version Control", definition: "Công cụ quản lý phiên bản phân tán miễn phí phổ biến nhất thế giới do Linus Torvalds tạo ra, nền tảng của GitHub và GitLab.", applications: ["Lệnh git commit/push/pull", "Giải quyết Conflict khi gộp mã (Merge)", "Tạo nhánh Branch cho tính năng mới"] },
  { term: "Design Patterns", fullName: "Software Design Patterns", definition: "Các mẫu thiết kế chuẩn mực kinh điển được đúc kết lại để giải quyết các vấn đề cấu trúc phổ biến khi lập trình phần mềm OOP lớn.", applications: ["Mẫu Singleton (Duy nhất)", "Mẫu Factory Method (Nhà máy)", "Mẫu Observer (Người quan sát - ReactJS)"] },
  { term: "SOLID", fullName: "SOLID Principles", definition: "Năm nguyên lý vàng cốt lõi của Lập trình Hướng đối tượng (Single responsibility, Open-closed, Liskov, Interface segregation, Dependency inversion) giúp mã dễ bảo trì.", applications: ["Viết mã sạch (Clean Code)", "Kiến trúc hệ thống lớn", "Nguyên tắc thiết kế Backend Java/C#"] }
];

async function main() {
  console.log("Bat dau sinh truc tiep 100 tu khoa Khoa hoc May tinh...");
  
  // Doc du lieu cu
  let existingData = [];
  if (fs.existsSync(csFilePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(csFilePath, 'utf8'));
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
      newTerm.category = "Khoa học máy tính";
      if (!newTerm.youtubeUrl) {
          newTerm.youtubeUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(newTerm.term + " computer science tutorial");
      }
      existingData.push(newTerm);
      existingTerms.add(normalized);
      addedCount++;
    } else {
      console.log("Bo qua tu khoa da ton tai:", newTerm.term);
    }
  }

  fs.writeFileSync(csFilePath, JSON.stringify(existingData, null, 2), 'utf8');
  console.log("Hoan tat ghi vao khoa_hoc_may_tinh.json!");
  console.log("So tu khoa duoc them vao: " + addedCount);
}

main();
