import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';


const DOWNLOAD_DIR = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}


(async () => {
  console.log('Khởi động trình duyệt...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log('Truy cập eleselect.com...');
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  await page.goto('https://www.eleselect.com/', { waitUntil: 'networkidle2' });

  console.log('Chờ 10 giây...');
  await new Promise(r => setTimeout(r, 10000));
  
  await page.screenshot({ path: path.join(process.cwd(), 'public', 'debug.png') });
  const html = await page.content();
  fs.writeFileSync(path.join(process.cwd(), 'public', 'debug.html'), html);
  console.log('Đã lưu debug.png và debug.html');
  
  await browser.close();
  console.log('Hoàn tất!');
})();
