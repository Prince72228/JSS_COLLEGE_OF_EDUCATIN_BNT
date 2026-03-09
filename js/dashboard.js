// ===== GLOBAL VARIABLES =====
const TOTAL_MEMBERS = 97;
let balance = 0;
let oldBalance = 0;
let balanceOdometer;

// ===== MEMBER DATA INITIALIZATION =====
const defaultMemberNames = [
    "Sudharani Appanna Kamble", "Mahalingappa Bharamannavar", "Manjula Sannakki", 
    "Amar Ashok Honnamani", "Kadambari Choudappa Gadiwaddar", "Shreechandra Dodamani",
    "Bharati Chatni", "Uday Mahaling Mahantashetti", "Muragesh Bagewadi", "Yashoda Balavad",
    "Abdulvahab Kurshidalam Teradal", "Mahammadsameer Ramjan Makandar", "Basuraj Ravi Maradi",
    "Nandeppa Suresh Shirahatti", "Darshan Kakhandaki", "Savita Bhimashi Hanchanal",
    "Ameer Shekh", "Tangevva B Patil", "Jyoti Mathagar", "Gayatri Sanju Naduvinamani",
    "Swati Sahadev Pattanashetti", "Ashwini Rajashekharayya Hiremath", "Niyaz Imam Sab Horatti",
    "Kiran Hawaldar", "Ruksar Faniband", "Nisarga Dodamani", "Gurunath Kittur",
    "Vinayak Hasilkar", "Keerti Mallappa Urabhinnavar", "Kavita Kiran Sutar",
    "Prashant Ningappa Ullagaddi", "Sunita Mathapati", "Sushmita Mahadev Vadegali",
    "Swati Balappa Jiddimani", "Padmini Nagappa Madar", "Sneha Laxman Uppar",
    "Gangappa Raju Madappagol", "Rekha Anand Hanjagi", "Aishwarya Uttur", 
    "Bhagyashree Mallappa Ramadurg", "Anupallavi Ramesh Madiwalar", "Jyoti Dundappa Gasti",
    "Priyanka Adiveppa Lokuri", "Sangeeta Uppar", "Bharati Siddaram Athani",
    "Shashikala Annappa Gaggari", "Archana Shanta Hosamani", "Rajeshwari Satyappa Nayak",
    "Bhagirathi Mallappa Alagur", "Laxmi Kallappa Ganiger", "Renuka Rajaput",
    "Siddarth Masti", "Savitri Raju Gurav", "Divya Basappa Raval", "Mahazabeen Muradsab Hanagandi",
    "Akshata Shirol", "Rohini M Jadhav", "Adamali Dastagirsab Nadaf", "Rohit S Rajaput",
    "Vaishali Anand Shirhatti", "Revati Kanatti", "Shridevi Shatteppa Gangappagol",
    "Soumya Savadi", "Venktesh Benakatti", "Kaveri Madar", "Chaithra Sadappa Chinchakhandi",
    "Kavya Sadashiv Kadapatti", "Mahantesh Hiremath", "Sahana Nagaraj Metri",
    "Neelamma Angadi", "Keerti Billur", "Fatima Yadawad", "Keerti Mode",
    "Tejashwini Vishnu Dharennavar", "Gangavva Arjun Kattimani", "Kaveri Subhas Kalmaddi",
    "Tanjila Ilayi Pinjar", "Bhagyashree Channabasu Biradarpatil", "Asmita A Savant",
    "Sujata Mudhol", "Aishwarya Shanur Gadadi", "Bhaghyshri Ashok Gurav", "Priyanka Mutturaj Patrot",
    "Laxmi Vittal Athani", "Preeti Itagoni", "Sana Shamansab Mujavar", "Ashwini Ashok Badiger",
    "Gayatri Appasi Maranur", "Shreyanka Kadappa Badagi"
];

// ===== LOAD DATA =====
let members = JSON.parse(localStorage.getItem('members')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let collectionAmount = parseFloat(localStorage.getItem('collectionAmount')) || 0;

// Initialize members if empty
if (members.length === 0) {
    members = defaultMemberNames.map((name, index) => ({
        id: index + 1,
        name: name,
        status: "NO",
        amount: 0
    }));
    localStorage.setItem('members', JSON.stringify(members));
}

// ===== CALCULATION FUNCTIONS =====
function calculateBalance() {
    const totalCollected = members.filter(m => m.status === 'YES').length * collectionAmount;
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const balance = totalCollected - totalExpenses;
    return Number(balance) || 0;
}

function getPaidCount() {
    return members.filter(m => m.status === 'YES').length;
}

function getPendingCount() {
    return members.filter(m => m.status === 'NO').length;
}

// ===== ODOMETER SETUP =====
function setupOdometer() {
    const balanceElement = document.getElementById('balance');
    balanceOdometer = new Odometer({
        el: balanceElement,
        value: 0,
        format: '(,ddd)',
        duration: 500
    });
}

// ===== UPDATE ODOMETER =====
function updateBalance() {
    oldBalance = balance;
    balance = calculateBalance();
    
    if (balanceOdometer) {
        balanceOdometer.update(balance);
    }
}

// ===== COIN CONTAINER =====
function createCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin shine';
    coin.dataset.falling = 'false';
    return coin;
}

function updateCoinContainer() {
    const coinContainer = document.getElementById('coinContainer');
    const progressPercent = document.getElementById('progressPercent');
    const paidCountElement = document.getElementById('paidCount');
    const pendingCountElement = document.getElementById('pendingCount');
    
    const paidCount = getPaidCount();
    const pendingCount = getPendingCount();
    const percentage = (paidCount / TOTAL_MEMBERS) * 100;
    
    // Update text
    paidCountElement.textContent = paidCount;
    pendingCountElement.textContent = pendingCount;
    progressPercent.textContent = percentage.toFixed(2) + '%';
    
    const currentCoins = coinContainer.children.length;
    const targetCoins = Math.floor((paidCount / TOTAL_MEMBERS) * 45); // Max 45 coins in container
    
    // Add coins if needed
    if (currentCoins < targetCoins) {
        const coinsToAdd = targetCoins - currentCoins;
        for (let i = 0; i < coinsToAdd; i++) {
            const coin = createCoin();
            coinContainer.appendChild(coin);
            
            // Animate falling with GSAP
            gsap.fromTo(coin, 
                { 
                    y: -100, 
                    opacity: 0,
                    rotation: 0
                },
                {
                    y: 0,
                    opacity: 0.9,
                    rotation: Math.random() * 360,
                    duration: 0.5 + Math.random() * 0.5,
                    delay: i * 0.05,
                    ease: 'bounce.out'
                }
            );
        }
    }
    
    // Remove coins if needed
    if (currentCoins > targetCoins) {
        const coinsToRemove = currentCoins - targetCoins;
        for (let i = 0; i < coinsToRemove; i++) {
            if (coinContainer.lastChild) {
                const coin = coinContainer.lastChild;
                gsap.to(coin, {
                    y: 50,
                    opacity: 0,
                    rotation: Math.random() * 720,
                    duration: 0.3,
                    onComplete: () => {
                        coin.remove();
                    }
                });
            }
        }
    }
    
    // Animate percentage
    gsap.to(progressPercent, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1
    });
}

// ===== ANIMATED COINS FOR NEW PAYMENTS =====
function animateCoinDrop() {
    const paidCount = getPaidCount();
    
    // Get the last added coin if it's new
    const coinContainer = document.getElementById('coinContainer');
    const coins = Array.from(coinContainer.children);
    
    if (coins.length > 0) {
        const lastCoin = coins[coins.length - 1];
        if (lastCoin.dataset.falling === 'false') {
            lastCoin.dataset.falling = 'true';
            
            gsap.fromTo(lastCoin,
                {
                    y: -300,
                    opacity: 0,
                    rotation: 0,
                    scale: 1.5
                },
                {
                    y: 0,
                    opacity: 0.9,
                    rotation: Math.random() * 360 - 180,
                    scale: 1,
                    duration: 0.8,
                    ease: 'bounce.out'
                }
            );
        }
    }
}

// ===== PAGE LOAD ANIMATIONS =====
function animatePageLoad() {
    // Animate balance card
    gsap.from('.glass-card', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Animate navigation
    gsap.from('.glass-nav', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Animate stats
    gsap.from('.grid > div', {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: 'back.out(1.7)'
    });
}

// ===== INITIALIZE PAGE =====
function initPage() {
    // Setup odometer
    setupOdometer();
    
    // Calculate and display balance
    balance = calculateBalance();
    if (balanceOdometer) {
        balanceOdometer.update(balance);
    }
    
    // Update coin container
    updateCoinContainer();
    
    // Run page load animations
    animatePageLoad();
}

// ===== EVENT LISTENERS =====
window.addEventListener('load', initPage);

// Listen for storage changes (sync across tabs)
window.addEventListener('storage', (e) => {
    if (e.key === 'members' || e.key === 'expenses' || e.key === 'collectionAmount') {
        // Reload data
        members = JSON.parse(localStorage.getItem('members')) || [];
        expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        collectionAmount = parseFloat(localStorage.getItem('collectionAmount')) || 0;
        
        // Update UI
        updateBalance();
        updateCoinContainer();
    }
});

// Periodic data refresh (every 5 seconds)
setInterval(() => {
    const newMembers = JSON.parse(localStorage.getItem('members')) || [];
    const newExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const newCollectionAmount = parseFloat(localStorage.getItem('collectionAmount')) || 0;
    
    const membersChanged = JSON.stringify(members) !== JSON.stringify(newMembers);
    const expensesChanged = JSON.stringify(expenses) !== JSON.stringify(newExpenses);
    const amountChanged = collectionAmount !== newCollectionAmount;
    
    if (membersChanged || expensesChanged || amountChanged) {
        const oldPaidCount = members.filter(m => m.status === 'YES').length;
        members = newMembers;
        expenses = newExpenses;
        collectionAmount = newCollectionAmount;
        
        // Update balance with animation
        updateBalance();
        
        // Update coin container with drop animation if payments increased
        const newPaidCount = members.filter(m => m.status === 'YES').length;
        if (newPaidCount > oldPaidCount) {
            updateCoinContainer();
            animateCoinDrop();
        } else {
            updateCoinContainer();
        }
    }
}, 5000);

// ===== UTILITY FUNCTIONS =====
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function glowEffect(element, color = '#facc15') {
    gsap.to(element, {
        boxShadow: `0 0 30px ${color}80`,
        duration: 0.3,
        yoyo: true,
        repeat: 1
    });
}

// ===== EXPOSE TO GLOBAL =====
window.updateBalance = updateBalance;
window.updateCoinContainer = updateCoinContainer;
window.animateCoinDrop = animateCoinDrop;
window.glowEffect = glowEffect;