const { createCanvas } = require('canvas');
const fs = require('fs');

// Samsung S22+ configuration
const CONFIG = {
    width: 1080,
    height: 2340,
    backgroundColor: '#000000',
    passedDotColor: '#ffffff',
    todayDotColor: '#e53935',
    remainingDotColor: '#3a3a3a',
    totalDays: 365
};

function getVietnamTime() {
    // Vietnam timezone: UTC+7
    const options = { timeZone: 'Asia/Ho_Chi_Minh' };
    const now = new Date();

    // Get Vietnam date/time components
    const vnDate = new Date(now.toLocaleString('en-US', options));
    return vnDate;
}

function getYearProgress() {
    const today = getVietnamTime();
    const year = today.getFullYear();
    const yearStart = new Date(year, 0, 1);
    const daysPassed = Math.floor((today - yearStart) / (1000 * 60 * 60 * 24)) + 1;
    return { daysPassed, year };
}

function generateWallpaper() {
    const { daysPassed, year } = getYearProgress();
    const { width, height, backgroundColor, passedDotColor, todayDotColor, remainingDotColor, totalDays } = CONFIG;

    console.log(`Generating wallpaper: Day ${daysPassed}/${totalDays} of ${year}`);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Layout: 35% clock, 50% dots, 15% margin
    const clockAreaHeight = height * 0.35;
    const dotsAreaHeight = height * 0.50;
    const dotsAreaWidth = width * 0.88;

    // Dot grid: 15 columns x 25 rows
    const cols = 15;
    const rows = Math.ceil(totalDays / cols);

    const maxDotWidth = dotsAreaWidth / cols;
    const maxDotHeight = dotsAreaHeight / rows;
    const dotSize = Math.min(maxDotWidth, maxDotHeight);
    const dotRadius = dotSize * 0.38;

    const gridWidth = cols * dotSize;
    const gridHeight = rows * dotSize;
    const startX = (width - gridWidth) / 2 + dotSize / 2;
    const startY = clockAreaHeight + ((dotsAreaHeight - gridHeight) / 2) + dotSize / 2;

    // Draw dots
    for (let day = 0; day < totalDays; day++) {
        const col = day % cols;
        const row = Math.floor(day / cols);
        const cx = startX + col * dotSize;
        const cy = startY + row * dotSize;

        ctx.beginPath();
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);

        if (day === daysPassed - 1) {
            ctx.fillStyle = todayDotColor;
        } else if (day < daysPassed) {
            ctx.fillStyle = passedDotColor;
        } else {
            ctx.fillStyle = remainingDotColor;
        }
        ctx.fill();
    }

    // Draw clock (Vietnam time)
    const now = getVietnamTime();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;

    const clockY = clockAreaHeight * 0.42;
    const dateY = clockAreaHeight * 0.68;

    // Time
    ctx.fillStyle = '#ffffff';
    ctx.font = '100 220px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(timeStr, width / 2, clockY);

    // Date
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '300 52px sans-serif';
    ctx.fillText(dateStr, width / 2, dateY);

    // Save
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('wallpaper.png', buffer);
    console.log('Wallpaper saved: wallpaper.png');
}

generateWallpaper();
