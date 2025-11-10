// public/js/script.js (NEW - with dynamic animations)

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ハンバーガーメニュー ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // --- 2. フォーム送信ハンドラ ---
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    contactForm.reset();
                } else { throw new Error(result.message); }
            } catch (error) {
                console.error('Submission error:', error);
                alert('An error occurred: ' + error.message);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // --- 3. ヘッダーのスクロール制御 ---
    const header = document.querySelector('.header');
    if (header) {
        if (document.body.classList.contains('home')) {
            const handleScroll = () => {
                header.classList.toggle('scrolled', window.scrollY > 50);
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        } else {
            header.classList.add('scrolled');
        }
    }

    // --- 4. [NEW] ヒーローセクション登場アニメーション ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroH1 = heroSection.querySelector('h1');
        // テキストを単語（文節）ごとに分割してspanで囲む
        const text = heroH1.textContent.trim();
        const newText = text.split(/(\s|、)/).map(word => {
            if (word.trim() === '') return ' '; // スペースを保持
            return `<span class="word-span-wrapper"><span class="word-span">${word}</span></span>`;
        }).join('');
        heroH1.innerHTML = newText;
        
        // ページ読み込み完了後にアニメーションを開始
        window.addEventListener('load', () => {
            setTimeout(() => {
                heroSection.classList.add('is-active');
            }, 300); // わずかに遅らせる
        });
    }

    // --- 5. [UPDATE] 高度なスクロールアニメーション (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.fade-in, .parallax-image-container');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // パララックス効果の監視を開始
                    if (entry.target.classList.contains('parallax-image-container')) {
                        window.addEventListener('scroll', handleParallax, { passive: true });
                    }
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- 6. [NEW] スクロール連動パララックス ---
    function handleParallax() {
        const parallaxImages = document.querySelectorAll('.parallax-image-container.is-visible .parallax-image');
        parallaxImages.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            const speed = -0.1; // 動きの速さ（マイナスで逆方向に動く）
            const movement = rect.top * speed;
            img.style.transform = `translateY(${movement}px)`;
        });
    }

    // --- 7. [NEW] 3Dカードホバーエフェクト ---
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // X軸の傾き（最大10度）
            const rotateY = ((x - centerX) / centerX) * 10;  // Y軸の傾き（最大10度）
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

});