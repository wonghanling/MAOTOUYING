// PWA图标生成脚本
// 这个脚本将创建base64编码的PNG图标文件

const fs = require('fs');
const path = require('path');

// 生成单色SVG图标作为基础
function generateOwlSVG(size) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景圆形 -->
  <circle cx="50" cy="50" r="45" fill="#f97316"/>

  <!-- 猫头鹰身体 -->
  <ellipse cx="50" cy="55" rx="25" ry="30" fill="#1f2937"/>

  <!-- 猫头鹰头部 -->
  <circle cx="50" cy="35" r="20" fill="#1f2937"/>

  <!-- 眼睛背景 -->
  <circle cx="43" cy="32" r="6" fill="#ffffff"/>
  <circle cx="57" cy="32" r="6" fill="#ffffff"/>

  <!-- 眼珠 -->
  <circle cx="43" cy="32" r="3" fill="#f97316"/>
  <circle cx="57" cy="32" r="3" fill="#f97316"/>

  <!-- 喙 -->
  <polygon points="50,38 47,43 53,43" fill="#f97316"/>

  <!-- 耳朵 -->
  <polygon points="35,25 40,15 45,25" fill="#1f2937"/>
  <polygon points="55,25 60,15 65,25" fill="#1f2937"/>

  <!-- 翅膀装饰 -->
  <path d="M 27 50 A 8 8 0 0 1 43 50" stroke="#f97316" stroke-width="2" fill="none"/>
  <path d="M 57 50 A 8 8 0 0 1 73 50" stroke="#f97316" stroke-width="2" fill="none"/>
</svg>`;
}

// 要生成的图标尺寸
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('正在生成PWA图标...');

// 生成SVG文件作为临时文件
sizes.forEach(size => {
    const svgContent = generateOwlSVG(size);
    const svgPath = path.join(__dirname, `temp-icon-${size}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    console.log(`生成了 ${size}x${size} SVG图标`);
});

console.log('SVG图标生成完成！');
console.log('请使用在线SVG转PNG工具或图像编辑软件将这些SVG文件转换为PNG格式。');
console.log('推荐工具：https://svgtopng.com/');