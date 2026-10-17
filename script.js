const canvas = document.getElementById('birthdayCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let floatingItems = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 1. فئة الأنوار المضيئة (الألعاب النارية)
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.05;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        this.size = Math.random() * 3 + 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// 2. فئة القلوب والورود المتطايرة
class FloatingItem {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100; // تبدأ من أسفل الشاشة وتصعد
        this.size = Math.random() * 15 + 15;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.sin(Math.random() * 2) * 0.5;
        this.type = Math.random() > 0.5 ? 'heart' : 'rose'; // اختيار عشوائي بين قلب أو وردة
        this.alpha = Math.random() * 0.5 + 0.5;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
    }
    update() {
        this.y -= this.speedY; // الصعود لأعلى
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        // إذا خرجت من أعلى الشاشة تعود للأسفل
        if (this.y < -50) {
            this.y = canvas.height + 50;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 'heart') {
            // رسم قلب مضيء
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 4);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, -this.size / 4, -this.size, this.size / 4);
            ctx.bezierCurveTo(-this.size, this.size * 0.6, -this.size / 4, this.size * 0.8, 0, this.size);
            ctx.bezierCurveTo(this.size / 4, this.size * 0.8, this.size, this.size * 0.6, this.size, this.size / 4);
            ctx.bezierCurveTo(this.size, -this.size / 4, this.size / 2, -this.size / 2, 0, -this.size / 4);
            ctx.fillStyle = '#ff2a85';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff2a85';
            ctx.fill();
        } else {
            // رسم وردة مبسطة حمراء وفخمة
            ctx.fillStyle = '#ff003c';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff003c';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(0, -this.size/3, this.size/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.rotate((Math.PI * 2) / 5);
            }
            // قلب الوردة باللون الأصفر الذهبي
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffcc00';
            ctx.fill();
        }
        ctx.restore();
    }
}

// توليد العناصر الطائرة في البداية
for (let i = 0; i < 35; i++) {
    floatingItems.push(new FloatingItem());
}

const colors = ['#ff0055', '#00ffcc', '#00ff33', '#ffff00', '#ff00ff', '#0099ff', '#ff9900'];

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.1);
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(5, 0, 10, 0.2)'; // ترك أثر خلفي ناعم للأنوار
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.03) {
        createFirework();
    }

    // رسم وتحديث القلوب والورود في الخلفية
    floatingItems.forEach(item => {
        item.update();
        item.draw();
    });

    // رسم وتحديث أنوار الألعاب النارية
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();
