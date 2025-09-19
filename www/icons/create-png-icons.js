const fs = require('fs');
const path = require('path');

// 创建一个简单的PNG图标 (带有猫头鹰色彩的简化版本)
function createSimplePNG(size) {
    // 这是一个包含橙色和深色的最小PNG数据 (Base64编码)
    // 创建一个简单的圆形图标
    const canvas = require('canvas');
    const createCanvas = canvas.createCanvas;

    const canvasElement = createCanvas(size, size);
    const ctx = canvasElement.getContext('2d');

    // 背景圆形（橙色）
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // 猫头鹰简化版 - 两个眼睛和喙
    const eyeSize = size * 0.08;
    const eyeOffset = size * 0.15;

    // 眼睛（白色）
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size/2 - eyeOffset, size/2 - size*0.1, eyeSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size/2 + eyeOffset, size/2 - size*0.1, eyeSize, 0, 2 * Math.PI);
    ctx.fill();

    // 瞳孔（深色）
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(size/2 - eyeOffset, size/2 - size*0.1, eyeSize*0.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size/2 + eyeOffset, size/2 - size*0.1, eyeSize*0.5, 0, 2 * Math.PI);
    ctx.fill();

    // 喙（深色）
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.moveTo(size/2, size/2);
    ctx.lineTo(size/2 - size*0.05, size/2 + size*0.08);
    ctx.lineTo(size/2 + size*0.05, size/2 + size*0.08);
    ctx.closePath();
    ctx.fill();

    return canvasElement.toBuffer('image/png');
}

// 检查是否安装了canvas模块
try {
    require('canvas');

    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

    console.log('正在创建PNG图标...');

    sizes.forEach(size => {
        const pngData = createSimplePNG(size);
        const filename = `icon-${size}x${size}.png`;
        fs.writeFileSync(filename, pngData);
        console.log(`创建了 ${filename}`);
    });

    console.log('所有PNG图标创建完成！');

} catch (error) {
    console.log('Canvas模块未安装，使用备用方案...');

    // 备用方案：创建一个非常简单的PNG文件
    const simplePNGBase64 = `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=`;

    // 创建一个更复杂的图标 base64 (72x72 橙色圆形图标)
    const iconBase64_72 = `iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGGSURBVHic7ZzBTcQwEEVfuAKKoAhKoAhKoAhKoAQ6oAOKoAQ6oAiKoAOKoAiKsARCNhtbTrwmY48T+X2Slaxd2/+9k5nJeLJtrKaUUkoppZRSSinltKWUUkoppZTSr5JSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinltKWUUkoppZRS+lVSSinntKWUUkoppZRS+lVSSinntKWUUkoppZRS+lVSSinntKWUUkoppZRS+lVSSinntKWUUkoppZRS+lVSSinntKWUUkoppZRS+lVSSinntKWUUkoppZRS+lVSSinntKWUUkoppZRS+lVSSinntKWUUkoppZRS+lX6A36UUkoppZRSSinltKWUUkoppf+iH4UAAAAASUVORK5CYII=`;

    // 使用这个base64数据创建所有尺寸的图标文件（只是占位符）
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

    sizes.forEach(size => {
        const filename = `icon-${size}x${size}.png`;
        // 这里只是创建一个占位符文件
        const buffer = Buffer.from(iconBase64_72, 'base64');
        fs.writeFileSync(filename, buffer);
        console.log(`创建了占位符图标: ${filename}`);
    });

    console.log('已创建占位符图标。建议使用图像编辑软件创建实际的猫头鹰图标。');
}