// 1. 初始化自定义准星
const dot = document.createElement('div');
const outline = document.createElement('div');
dot.className = 'cursor-dot';
outline.className = 'cursor-outline';
document.body.appendChild(dot);
document.body.appendChild(outline);

// 2. 鼠标移动监听：同步准星 + 视差背景
document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    
    // 准星位置（带一点平滑延迟）
    dot.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
    outline.style.transform = `translate(${x - 15}px, ${y - 15}px)`;

    // 背景视差平衡（让网格随鼠标反向微动）
    const moveX = (window.innerWidth / 2 - x) / 40;
    const moveY = (window.innerHeight / 2 - y) / 40;
    const grid = document.getElementById('grid');
    if(grid) {
        grid.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${moveY * 0.05}deg) rotateY(${-moveX * 0.05}deg)`;
    }
});

// 3. 卡片 3D 悬浮效果
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        outline.classList.add('cursor-active');
        // 模拟一个极短的电子音反馈 (Console log 演示逻辑)
        console.log("UI_HOVER_FEEDBACK: 400Hz_0.02s");
    });
    
    card.addEventListener('mouseleave', () => {
        outline.classList.remove('cursor-active');
    });

    // 进阶：跟随鼠标轻微倾斜
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (centerY - cardY) / 10;
        const rotateY = (cardX - centerX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseout', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
    });
});

// 4. 滚动进度监听 (指示线动画)
const sections = document.querySelectorAll('section');
const lines = document.querySelectorAll('.line'); // 对应你之前的指示线

const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            const index = Array.from(sections).indexOf(entry.target);
            document.querySelectorAll('.line').forEach((line, i) => {
                line.classList.toggle('active', i === index);
            });
            // 每次切页时，背景网格色调微调
            document.getElementById('grid').style.borderColor = 
                index % 2 === 0 ? 'rgba(88, 166, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));