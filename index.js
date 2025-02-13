document.addEventListener('DOMContentLoaded', () => {
    // Custom Heart Cursor
    const cursor = document.createElement('div');
    cursor.className = 'heart-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Initialize Time
    const now = new Date();
    let targetTime = new Date();
    
    if (now.getHours() >= 24 || now.getHours() < 1) {
        showContract();
    } else {
        targetTime.setHours(24, 0, 0, 0);
        gameInstance = new CatchSanjay(document.getElementById('game-container'));
        updateTimer(targetTime);
    }
});

let gameInstance = null;

// Timer Logic
function updateTimer(targetTime) {
    const now = new Date();
    const diff = targetTime - now;

    if (diff <= 0) {
        showContract();
        return;
    }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('timer').innerHTML = `
        <span class="timer-digit">${hours.toString().padStart(2, '0')}</span>:
        <span class="timer-digit">${minutes.toString().padStart(2, '0')}</span>:
        <span class="timer-digit">${seconds.toString().padStart(2, '0')}</span>
    `;

    setTimeout(() => updateTimer(targetTime), 1000 - (now % 1000));
}

// Contract Content
function generateContract() {
    return `
        <p>Whereas I, Sanjay, being of sound mind and questionable cooking skills, do hereby solemnly swear:</p>
        
        <ul>
            <li>To remain your personal comedian until at least 2077 (when you turn 77)</li>
            <li>To attempt making rvc (red velvet cake) annually, with a 10% success rate guarantee</li>
            <li>To order cpfr (chilli paneer fried rice) whenever you say "I'm not cooking tonight"</li>
            <li>To pretend I like cinnabon milkshakes as much as you do (they're 70% sugar, 30% magic)</li>
            <li>To maintain my "World's Okayest Boyfriend" title through dad jokes and bad puns</li>
            <li>To save up for a pink Aston Martin (disclaimer: may be Hot Wheels size)</li>
        </ul>

        <p>This contract shall be binding until:<br>
        1. The heat death of the universe<br>
        2. We run out of red velvet cake<br>
        3. You get sick of my face (statistically improbable)</p>

        <p>Do you accept these terms and conditions for eternal(ish) companionship?</p>
    `;
}

// Catch Sanjay Game
class CatchSanjay {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.gameInterval = null;
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div id="score">Score: 0</div>
            <img src="IMG_0993.PNG" id="sanjay" style="position: absolute; width: 80px;">
        `;
        
        const sanjayImg = document.getElementById('sanjay');
        sanjayImg.addEventListener('click', () => {
            this.score++;
            document.getElementById('score').textContent = `Score: ${this.score}`;
        });

        this.gameInterval = setInterval(() => {
            const x = Math.random() * (window.innerWidth - 80);
            const y = Math.random() * (window.innerHeight - 80);
            sanjayImg.style.transform = `translate(${x}px, ${y}px)`;
        }, 1000);
    }

    destroy() {
        clearInterval(this.gameInterval);
        this.container.innerHTML = '';
    }
}

// Contract Transition
function showContract() {
    document.getElementById('timer').style.opacity = '0';
    const contract = document.getElementById('contract');
    contract.classList.add('visible');
    document.getElementById('contract-content').innerHTML = generateContract();
    
    // Force animation restart
    void contract.offsetWidth;
    contract.style.animation = 'none';
    requestAnimationFrame(() => {
        contract.style.animation = 'flyIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    });

    if(gameInstance) gameInstance.destroy();
}

// Signature Pad
const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

function startDrawing(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff4081';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function endDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

// Button Interactions
document.getElementById('yes-btn').addEventListener('click', () => {
    if (!ctx.getImageData(0, 0, canvas.width, canvas.height).data.some(ch => ch !== 0)) {
        alert('Please sign first! ❤️');
        return;
    }
    launchConfetti();
    document.getElementById('yes-btn').disabled = true;
    document.getElementById('no-btn').style.display = 'none';
});

document.getElementById('clear-signature').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Emoji Animation
function launchConfetti() {
    const emojis = ['💁🏻‍♀️', '🌸', '🎀', '👸', '💖'];
    const interactions = ['grab', 'spin', 'bounce'];
    
    for(let i = 0; i < 150; i++) {
        const emoji = document.createElement('div');
        emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            font-size: ${Math.random() * 30 + 20}px;
            cursor: none;
            transition: all 0.5s;
            pointer-events: auto;
        `;

        emoji.addEventListener('mouseenter', () => {
            const interaction = interactions[Math.floor(Math.random() * interactions.length)];
            if(interaction === 'grab') {
                emoji.style.transform = 'scale(1.5) rotate(10deg)';
            } else if(interaction === 'spin') {
                emoji.style.transform = 'rotate(720deg) scale(1.2)';
            } else {
                emoji.style.animation = 'bounce 0.5s infinite';
            }
        });

        emoji.addEventListener('mouseleave', () => {
            emoji.style.transform = '';
            emoji.style.animation = '';
        });

        document.body.appendChild(emoji);
    }
} 
