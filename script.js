// Данные шаблонов After Effects - только логотипы
const templates = [
    {
        id: 1,
        title: "Анимация логотипа чай PUER",
        description: "Плагины: AnimateComposer",
        category: "logo",
        image: "v3toai.png",
        size: "606 KB",
        format: "AE 2020+",
        downloadUrl: "https://drive.google.com/file/d/1u1MEK87QMiTvMZQcDa-jrsMB3y3xaz6P/view?usp=sharing"
    }
];

// Глобальные переменные
let currentFilter = 'all';
let filteredTemplates = [...templates];

// DOM элементы
const templatesGrid = document.getElementById('templatesGrid');
const modal = document.getElementById('templateModal');
const modalClose = document.getElementById('modalClose');
const filterButtons = document.querySelectorAll('.filter-btn');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeTemplates();
    initializeEventListeners();
    initializeAnimations();
});

// Инициализация шаблонов
function initializeTemplates() {
    if (templatesGrid) {
        renderTemplates(filteredTemplates);
    }
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    // Закрытие модального окна
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Закрытие модального окна по клику на оверлей
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }

    // Закрытие модального окна по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Фильтрация шаблонов
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                filterTemplates(category);
                updateActiveFilter(this);
            });
        });
    }

    // Мобильное меню
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Инициализация анимаций
function initializeAnimations() {
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдение за карточками
    document.querySelectorAll('.template-card, .category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// Рендеринг шаблонов
function renderTemplates(templatesToRender) {
    if (!templatesGrid) return;

    templatesGrid.innerHTML = '';

    templatesToRender.forEach((template, index) => {
        const templateCard = createTemplateCard(template, index);
        templatesGrid.appendChild(templateCard);
    });
}

// Создание карточки шаблона
function createTemplateCard(template, index) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="template-image">
            <img src="${template.image}" alt="${template.title}" class="template-thumbnail">
        </div>
        <div class="template-content">
            <h3 class="template-title">${template.title}</h3>
            <p class="template-description">${template.description}</p>
            <div class="template-meta">
                <span class="template-category">${getCategoryName(template.category)}</span>
                <span>${template.size}</span>
            </div>
        </div>
    `;

    // Обработчик клика для открытия модального окна
    card.addEventListener('click', () => {
        openModal(template);
    });

    return card;
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'logo': 'Логотипы'
    };
    return categories[category] || category;
}

// Фильтрация шаблонов
function filterTemplates(category) {
    currentFilter = category;
    
    if (category === 'all') {
        filteredTemplates = [...templates];
    } else {
        filteredTemplates = templates.filter(template => template.category === category);
    }
    
    renderTemplates(filteredTemplates);
    
    // Анимация появления отфильтрованных элементов
    setTimeout(() => {
        const cards = document.querySelectorAll('.template-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
}

// Обновление активного фильтра
function updateActiveFilter(clickedButton) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

// Открытие модального окна
function openModal(template) {
    if (!modal) return;

    // Заполнение данных модального окна
    document.getElementById('modalTitle').textContent = template.title;
    document.getElementById('modalDescription').textContent = template.description;
    document.getElementById('modalCategory').textContent = getCategoryName(template.category);
    document.getElementById('modalSize').textContent = template.size;
    document.getElementById('modalFormat').textContent = template.format;
    document.getElementById('modalImage').innerHTML = `<img src="${template.image}" alt="${template.title}" class="modal-thumbnail">`;
    
    // Настройка ссылки для скачивания
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        // Устанавливаем ссылку на Google Drive
        downloadBtn.href = template.downloadUrl;
        downloadBtn.target = '_blank'; // Открывать в новой вкладке
        downloadBtn.rel = 'noopener noreferrer'; // Безопасность
        
        // Добавляем обработчик клика для дополнительной функциональности
        downloadBtn.onclick = function(e) {
            // Показываем уведомление о переходе
            showNotification('Переход на Google Drive...', 'info');
            
            // Логируем переход для отладки
            console.log('Переход по ссылке:', template.downloadUrl);
        };
    }

    // Показ модального окна
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Анимация появления
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
}

// Закрытие модального окна
function closeModal() {
    if (!modal) return;

    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Анимация закрытия
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideOut 0.3s ease-out';
    
    setTimeout(() => {
        modalContent.style.animation = '';
    }, 300);
}

// Переключение мобильного меню
function toggleMobileMenu() {
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }
}

// Функция для создания демо-архива (для демонстрации)
function createDemoArchive(templateName) {
    // В реальном проекте здесь была бы логика создания архива
    console.log(`Создание архива для шаблона: ${templateName}`);
    
    // Имитация загрузки
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<span>Загрузка...</span>';
        downloadBtn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.style.pointerEvents = '';
            
            // Показ уведомления об успешной загрузке
            showNotification('Шаблон успешно загружен!', 'success');
        }, 2000);
    }
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    // Добавление в DOM
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Обработчик закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Автоматическое закрытие
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Обработчик для кнопки "Предварительный просмотр"
document.addEventListener('click', function(e) {
    if (e.target.id === 'previewBtn') {
        showNotification('Функция предварительного просмотра в разработке', 'info');
    }
});

// Обработчик для кнопки "Узнать больше"
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Узнать больше') {
        e.preventDefault();
        showNotification('Дополнительная информация будет добавлена позже', 'info');
    }
});

// Плавная прокрутка только для якорных ссылок (начинающихся с #)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link')) {
        const targetId = e.target.getAttribute('href');
        // Разрешаем переход по обычным ссылкам, блокируем только якорные
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        // Для обычных ссылок (index.html, templates.html) ничего не делаем - браузер сам перейдет
    }
});

// Анимация появления элементов при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.template-card, .category-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Обработчик скролла
window.addEventListener('scroll', animateOnScroll);

// Инициализация анимации при загрузке
window.addEventListener('load', animateOnScroll);

// Дополнительные CSS анимации
const additionalStyles = `
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
    }
    
    .template-card.animate {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;

// Добавление дополнительных стилей
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Экспорт функций для возможного использования в других модулях
window.TemplateManager = {
    openModal,
    closeModal,
    filterTemplates,
    showNotification
};
