// ===== ANIMATIONS LIBRARY =====
// Using GSAP (GreenSock Animation Platform)

// ===== PAGE LOAD ANIMATIONS =====
function animatePageEntry() {
    // Animate navigation
    gsap.from('.glass-nav', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Animate main content
    gsap.from('.glass-card', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Animate buttons
    gsap.from('button', {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.6,
        ease: 'back.out(1.7)'
    });
}

// ===== CARD HOVER ANIMATIONS =====
function animateCardHover(card) {
    gsap.to(card, {
        scale: 1.02,
        y: -5,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        duration: 0.3,
        ease: 'power2.out'
    });
}

function animateCardLeave(card) {
    gsap.to(card, {
        scale: 1,
        y: 0,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        duration: 0.3,
        ease: 'power2.in'
    });
}

// ===== BUTTON ANIMATIONS =====
function animateButtonPress(button) {
    gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    });
}

function animateButtonSuccess(button) {
    gsap.to(button, {
        backgroundColor: 'rgb(34, 197, 94)',
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1
    });

    setTimeout(() => {
        gsap.to(button, {
            backgroundColor: '',
            duration: 0.3
        });
    }, 600);
}

function animateButtonError(button) {
    gsap.to(button, {
        x: [-5, 5, -5, 5, 0],
        duration: 0.4,
        backgroundColor: 'rgb(239, 68, 68)'
    });

    setTimeout(() => {
        gsap.to(button, {
            backgroundColor: '',
            duration: 0.3
        });
    }, 400);
}

// ===== FORM ANIMATIONS =====
function animateFormInput(input) {
    gsap.to(input, {
        scale: 1.02,
        borderColor: 'rgb(99, 102, 241)',
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
        duration: 0.3
    });
}

function animateFormInputLeave(input) {
    gsap.to(input, {
        scale: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: 'none',
        duration: 0.3
    });
}

function animateFormSuccess(form) {
    gsap.to(form.querySelectorAll('input, select'), {
        borderColor: 'rgb(34, 197, 94)',
        duration: 0.3,
        stagger: 0.05
    });

    setTimeout(() => {
        gsap.to(form.querySelectorAll('input, select'), {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            duration: 0.3
        });
    }, 1500);
}

function animateFormError(form) {
    gsap.to(form, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
    });
}

// ===== TABLE ANIMATIONS =====
function animateRowAdd(row) {
    gsap.from(row, {
        x: -50,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
    });
}

function animateRowRemove(row, callback) {
    gsap.to(row, {
        x: 50,
        opacity: 0,
        height: 0,
        padding: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: callback
    });
}

function animateRowUpdate(row) {
    gsap.to(row, {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        duration: 0.3,
        yoyo: true,
        repeat: 1
    });
}

function animateTableStagger(tbody) {
    const rows = tbody.querySelectorAll('tr');
    gsap.from(rows, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out'
    });
}

// ===== MODAL ANIMATIONS =====
function animateModalOpen(modal) {
    const modalContent = modal.querySelector('.glass-card');
    
    // Backdrop
    gsap.fromTo(modal,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );
    
    // Content
    gsap.fromTo(modalContent,
        { 
            scale: 0.8,
            y: 50,
            opacity: 0
        },
        {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.7)'
        }
    );
}

function animateModalClose(modal, callback) {
    const modalContent = modal.querySelector('.glass-card');
    
    gsap.to(modalContent, {
        scale: 0.8,
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
    });
    
    gsap.to(modal, {
        opacity: 0,
        duration: 0.3,
        onComplete: callback
    });
}

// ===== STATISTICS ANIMATIONS =====
function animateStatNumber(element, start, end, duration = 2000) {
    gsap.to({ value: start }, {
        value: end,
        duration: duration / 1000,
        ease: 'power2.out',
        onUpdate: function() {
            const value = Math.round(this.targets()[0].value);
            if (element.textContent.includes('₹')) {
                element.textContent = '₹' + value.toLocaleString();
            } else {
                element.textContent = value.toLocaleString();
            }
        }
    });
}

function animateStatCard(card) {
    gsap.from(card, {
        scale: 0.8,
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });
}

// ===== NOTIFICATION ANIMATIONS =====
function animateNotificationShow(notification) {
    gsap.fromTo(notification,
        { 
            x: 100,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        }
    );
}

function animateNotificationHide(notification, callback) {
    gsap.to(notification, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: callback
    });
}

// ===== COIN ANIMATIONS =====
function animateCoinDrop(coin, delay = 0) {
    gsap.fromTo(coin,
        {
            y: -200,
            opacity: 0,
            rotation: 0,
            scale: 1.2
        },
        {
            y: 0,
            opacity: 0.9,
            rotation: Math.random() * 360 - 180,
            scale: 1,
            duration: 0.6 + Math.random() * 0.4,
            delay: delay,
            ease: 'bounce.out'
        }
    );
}

function animateCoinStack(coins) {
    coins.forEach((coin, index) => {
        gsap.fromTo(coin,
            {
                y: -50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 0.9,
                duration: 0.4,
                delay: index * 0.05,
                ease: 'power2.out'
            }
        );
    });
}

function animateCoinRemove(coin, callback) {
    gsap.to(coin, {
        y: 100,
        opacity: 0,
        rotation: Math.random() * 720,
        duration: 0.3,
        onComplete: callback
    });
}

// ===== PROGRESS BAR ANIMATIONS =====
function animateProgressBar(progressBar, targetValue) {
    gsap.to(progressBar, {
        width: targetValue + '%',
        duration: 1,
        ease: 'power2.out'
    });
}

// ===== LOADING ANIMATIONS =====
function animateLoading(element) {
    const loader = document.createElement('div');
    loader.className = 'absolute inset-0 flex items-center justify-center bg-black/50';
    loader.innerHTML = `
        <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    `;
    element.style.position = 'relative';
    element.appendChild(loader);
    
    return loader;
}

function removeLoading(loader) {
    gsap.to(loader, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => loader.remove()
    });
}

// ===== SCROLL ANIMATIONS =====
function observeScrollElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.fromTo(entry.target,
                    {
                        y: 50,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out'
                    }
                );
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== SPECIAL EFFECTS =====
function animateGlowEffect(element, color = '#facc15') {
    gsap.to(element, {
        boxShadow: `0 0 40px ${color}80`,
        duration: 0.5,
        yoyo: true,
        repeat: 1
    });
}

function animateShakeEffect(element, intensity = 10) {
    gsap.to(element, {
        x: [
            -intensity, intensity, -intensity, intensity,
            -intensity/2, intensity/2, -intensity/2, intensity/2,
            0
        ],
        duration: 0.6,
        ease: 'power2.out'
    });
}

function animatePulseEffect(element, scale = 1.1) {
    const timeline = gsap.timeline();
    
    timeline.to(element, {
        scale: scale,
        duration: 0.3,
        ease: 'power2.out'
    })
    .to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.in'
    });
    
    return timeline;
}

// ===== CHART ANIMATIONS =====
function animateChartIn(chart) {
    if (chart) {
        gsap.to(chart, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        });
    }
}

// ===== NUMBER COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (target - start) * easeOutQuart);
        
        if (element.textContent.includes('₹')) {
            element.textContent = '₹' + current.toLocaleString();
        } else if (element.textContent.includes('%')) {
            element.textContent = current + '%';
        } else {
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== INITIALIZATION =====
function initAnimations() {
    // Apply hover effects to glass cards
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', () => animateCardHover(card));
        card.addEventListener('mouseleave', () => animateCardLeave(card));
    });
    
    // Apply button animations
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', () => animateButtonPress(button));
    });
    
    // Apply form input animations
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', () => animateFormInput(input));
        input.addEventListener('blur', () => animateFormInputLeave(input));
    });
    
    // Initialize scroll observer
    observeScrollElements();
}

// Run initialization on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

// ===== EXPOSE TO GLOBAL =====
window.animatePageEntry = animatePageEntry;
window.animateCardHover = animateCardHover;
window.animateCardLeave = animateCardLeave;
window.animateButtonPress = animateButtonPress;
window.animateButtonSuccess = animateButtonSuccess;
window.animateButtonError = animateButtonError;
window.animateFormSuccess = animateFormSuccess;
window.animateFormError = animateFormError;
window.animateRowAdd = animateRowAdd;
window.animateRowRemove = animateRowRemove;
window.animateRowUpdate = animateRowUpdate;
window.animateTableStagger = animateTableStagger;
window.animateModalOpen = animateModalOpen;
window.animateModalClose = animateModalClose;
window.animateStatNumber = animateStatNumber;
window.animateStatCard = animateStatCard;
window.animateNotificationShow = animateNotificationShow;
window.animateNotificationHide = animateNotificationHide;
window.animateCoinDrop = animateCoinDrop;
window.animateCoinStack = animateCoinStack;
window.animateCoinRemove = animateCoinRemove;
window.animateProgressBar = animateProgressBar;
window.animateLoading = animateLoading;
window.removeLoading = removeLoading;
window.animateGlowEffect = animateGlowEffect;
window.animateShakeEffect = animateShakeEffect;
window.animatePulseEffect = animatePulseEffect;
window.animateCounter = animateCounter;