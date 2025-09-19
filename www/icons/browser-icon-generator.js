// 使用Web API创建SVG图标并转换为PNG
// 这个脚本可以在浏览器控制台中运行

function createOwlIconSVG(size) {
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景圆形 橙色 -->
  <circle cx="50" cy="50" r="48" fill="#f97316" stroke="#ea580c" stroke-width="1"/>

  <!-- 猫头鹰身体主体 深蓝灰色 -->
  <ellipse cx="50" cy="60" rx="22" ry="28" fill="#1f2937"/>

  <!-- 猫头鹰头部 -->
  <circle cx="50" cy="38" r="18" fill="#1f2937"/>

  <!-- 眼睛外圈 白色 -->
  <circle cx="43" cy="35" r="5.5" fill="#ffffff"/>
  <circle cx="57" cy="35" r="5.5" fill="#ffffff"/>

  <!-- 眼珠 橙色 -->
  <circle cx="43" cy="35" r="2.5" fill="#f97316"/>
  <circle cx="57" cy="35" r="2.5" fill="#f97316"/>

  <!-- 瞳孔 深色 -->
  <circle cx="43" cy="35" r="1" fill="#1f2937"/>
  <circle cx="57" cy="35" r="1" fill="#1f2937"/>

  <!-- 喙 橙色 -->
  <polygon points="50,40 47,44 53,44" fill="#f97316"/>

  <!-- 耳朵/角 -->
  <polygon points="36,28 40,18 44,28" fill="#1f2937"/>
  <polygon points="56,28 60,18 64,28" fill="#1f2937"/>

  <!-- 翅膀纹理线条 -->
  <path d="M 32 55 Q 38 50 32 65" stroke="#f97316" stroke-width="1.5" fill="none"/>
  <path d="M 68 55 Q 62 50 68 65" stroke="#f97316" stroke-width="1.5" fill="none"/>

  <!-- 胸前装饰 -->
  <ellipse cx="50" cy="65" rx="8" ry="6" fill="#374151"/>
</svg>`;
    return svg;
}

// 创建所有尺寸的SVG图标
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
    const svgContent = createOwlIconSVG(size);

    // 创建blob并下载
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `owl-icon-${size}x${size}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    console.log(`已生成 ${size}x${size} SVG图标`);
});

console.log('所有SVG图标已生成完成！');