export const genres = [
  { id: 'rpg', label: 'RPG', demand: 72, baseAppeal: 70 },
  { id: 'strategy', label: 'Стратегия', demand: 58, baseAppeal: 64 },
  { id: 'shooter', label: 'Шутер', demand: 67, baseAppeal: 69 },
  { id: 'horror', label: 'Хоррор', demand: 63, baseAppeal: 73 },
  { id: 'simulator', label: 'Симулятор', demand: 50, baseAppeal: 58, unlockCost: 4500 },
  { id: 'platformer', label: 'Платформер', demand: 45, baseAppeal: 62, unlockCost: 5000 },
  { id: 'puzzle', label: 'Головоломка', demand: 56, baseAppeal: 55, unlockCost: 5500 },
  { id: 'racing', label: 'Гонки', demand: 42, baseAppeal: 65, unlockCost: 6500 }
];

export const settings = [
  { id: 'fantasy', label: 'Фэнтези', freshness: 8 },
  { id: 'sci-fi', label: 'Научная фантастика', freshness: 12 },
  { id: 'medieval', label: 'Средневековье', freshness: 4 },
  { id: 'cyberpunk', label: 'Киберпанк', freshness: 16, unlockCost: 5000 },
  { id: 'modern', label: 'Современность', freshness: 2 },
  { id: 'horror', label: 'Хоррор', freshness: 10, unlockCost: 4500 },
  { id: 'post-apocalypse', label: 'Постапокалипсис', freshness: 9, unlockCost: 6000 },
  { id: 'space', label: 'Космос', freshness: 14, unlockCost: 7000 }
];

export const platforms = [
  { id: 'pc', label: 'ПК', audience: 1, cost: 0, availableFrom: 2000 },
  { id: 'console', label: 'Консоли', audience: 1.3, cost: 3000, unlockCost: 6000, availableFrom: 2000 },
  { id: 'mobile', label: 'Мобильные', audience: 1.15, cost: 5500, unlockCost: 7000, availableFrom: 2007 },
  { id: 'cloud', label: 'Облако', audience: 1.22, cost: 7000, unlockCost: 15000, availableFrom: 2015 }
];

export const equipment = [
  { id: 'router', label: 'Хороший роутер', icon: '⌁', cost: 1800, description: 'Снижает ежемесячные расходы офиса.', effect: '−$120 / месяц' },
  { id: 'server', label: 'Сервер для сборок', icon: '▤', cost: 6500, description: 'Ускоряет программирование и тестирование.', effect: '+3 техника / месяц' },
  { id: 'audio-booth', label: 'Звуковая кабина', icon: '◒', cost: 4800, description: 'Даёт звукорежиссёру место для чистой записи.', effect: '+5 звук / месяц' },
  { id: 'render-farm', label: 'Ферма рендера', icon: '▧', cost: 9000, description: 'Поднимает потолок графики в больших проектах.', effect: '+4 графика / месяц' },
  { id: 'debug-kit', label: 'Набор отладки', icon: '</>', cost: 7200, description: 'Снижает вероятность новых проблем в сборке.', effect: '−35% риск багов' }
];

export const mechanics = [
  { id: 'combat', label: 'Боевая система', innovation: 4, difficulty: 9 },
  { id: 'building', label: 'Строительство', innovation: 8, difficulty: 8 },
  { id: 'exploration', label: 'Исследование', innovation: 6, difficulty: 6 },
  { id: 'trading', label: 'Торговля', innovation: 9, difficulty: 7 },
  { id: 'crafting', label: 'Крафт', innovation: 5, difficulty: 8 },
  { id: 'puzzle', label: 'Головоломки', innovation: 11, difficulty: 6 },
  { id: 'management', label: 'Управление', innovation: 13, difficulty: 7 },
  { id: 'progression', label: 'Развитие персонажа', innovation: 3, difficulty: 5 },
  { id: 'story-choices', label: 'Выборы в истории', innovation: 12, difficulty: 7 },
  { id: 'collection', label: 'Коллекционирование', innovation: 7, difficulty: 5 }
];

export const cameras = ['Вид сверху', 'Вид сбоку', 'Изометрия', 'От первого лица', 'От третьего лица'];
export const audiences = ['Казуальная', 'Массовая', 'Хардкорная', 'Детская', 'Взрослая', 'Соревновательная'];
export const scopes = [
  { id: 'tiny', label: 'Крошечный', months: 4, cost: 7000, multiplier: 0.72 },
  { id: 'small', label: 'Маленький', months: 6, cost: 13000, multiplier: 0.9 },
  { id: 'medium', label: 'Средний', months: 9, cost: 26000, multiplier: 1 },
  { id: 'large', label: 'Большой', months: 13, cost: 52000, multiplier: 1.14 },
  { id: 'huge', label: 'Огромный', months: 18, cost: 95000, multiplier: 1.24 }
];

export const roles = [
  { id: 'programmer', label: 'Программист', icon: '</>', salary: 1700, skills: { programming: 66, design: 25, art: 12, audio: 10, writing: 16, management: 22 } },
  { id: 'designer', label: 'Геймдизайнер', icon: '✦', salary: 1500, skills: { programming: 18, design: 72, art: 29, audio: 12, writing: 46, management: 32 } },
  { id: 'artist', label: 'Художник', icon: '▧', salary: 1600, skills: { programming: 12, design: 35, art: 74, audio: 18, writing: 12, management: 21 } },
  { id: 'audio', label: 'Звукорежиссёр', icon: '◒', salary: 1400, skills: { programming: 10, design: 18, art: 25, audio: 76, writing: 18, management: 16 } },
  { id: 'writer', label: 'Сценарист', icon: 'Aa', salary: 1300, skills: { programming: 8, design: 27, art: 14, audio: 9, writing: 78, management: 18 } }
];

export const traits = [
  { id: 'perfectionist', label: 'Перфекционист', effect: '+качество / −скорость' },
  { id: 'workaholic', label: 'Трудоголик', effect: '+скорость / риск выгорания' },
  { id: 'creative', label: 'Креативщик', effect: '+инновации / нестабильность' },
  { id: 'calm', label: 'Спокойный', effect: '+стабильность / меньше ошибок' },
  { id: 'ambitious', label: 'Амбициозный', effect: '+рост / высокие ожидания' }
];

export const employeePool = [
  { name: 'Mira Volkov', role: 'programmer', trait: 'calm', level: 1 },
  { name: 'Ilya Chen', role: 'designer', trait: 'creative', level: 1 },
  { name: 'Nora Bell', role: 'artist', trait: 'perfectionist', level: 1 },
  { name: 'Sam Okada', role: 'audio', trait: 'ambitious', level: 1 },
  { name: 'Theo Martins', role: 'writer', trait: 'calm', level: 1 }
];

export const research = [
  { id: 'optimization', label: 'Оптимизация', description: 'Снижает влияние технического долга на 25%.', cost: 9000, requires: [] },
  { id: 'advanced-ai', label: 'Продвинутый ИИ', description: 'Добавляет инновационности играм с боевой системой и исследованием.', cost: 12000, requires: ['optimization'] },
  { id: 'better-rendering', label: 'Современный рендеринг', description: 'Повышает потолок графики и рыночную привлекательность.', cost: 13000, requires: ['optimization'] },
  { id: 'procedural', label: 'Процедурная генерация', description: 'Делает большие проекты эффективнее.', cost: 18000, requires: ['advanced-ai'] },
  { id: 'cloud-save', label: 'Облачные сохранения', description: 'Снижает риск проблем с сохранениями и повышает доверие издателей.', cost: 11000, requires: ['optimization'] },
  { id: 'advanced-physics', label: 'Продвинутая физика', description: 'Повышает технический потенциал шутеров и гонок.', cost: 16000, requires: ['better-rendering'] },
  { id: 'online', label: 'Сетевой мультиплеер', description: 'Открывает издательские контракты с мультиплеером.', cost: 24000, requires: ['advanced-physics'] },
  { id: 'live-service', label: 'Живой сервис', description: 'Улучшает долгосрочные продажи, но увеличивает расходы.', cost: 28000, requires: ['online'] },
  { id: 'vr', label: 'VR-инструменты', description: 'Повышает инновационность экспериментальных проектов.', cost: 22000, requires: ['better-rendering'] },
  { id: 'analytics', label: 'Аналитика игроков', description: 'Улучшает прогнозы рынка и конверсию отзывов.', cost: 15000, requires: ['cloud-save'] }
];

export const competitors = [
  { name: 'PixelForge', style: 'отточенные инди-игры', genre: 'platformer', strength: 76, icon: '▣', color: '#e0567f' },
  { name: 'MoonByte', style: 'атмосферные миры', genre: 'horror', strength: 82, icon: '✦', color: '#7f6bff' },
  { name: 'Red Rabbit', style: 'смелые эксперименты', genre: 'puzzle', strength: 69, icon: '◆', color: '#e0565c' },
  { name: 'NorthStar', style: 'большие системы', genre: 'strategy', strength: 88, icon: '✶', color: '#3fa9f5' },
  { name: 'Soft Circuit', style: 'добрые симуляторы', genre: 'simulator', strength: 73, icon: '◉', color: '#3fce7e' }
];

// Fictional publishers with recognizable industry archetypes, not real companies.
export const publishers = [
  { id: 'bright-arc', name: 'Bright Arc', style: 'массовый охват', upfront: 18000, royalty: 22, appeal: 14, requirement: 12, requirementText: 'Репутация 12+' },
  { id: 'mosaic-house', name: 'Mosaic House', style: 'авторские игры', upfront: 9000, royalty: 16, appeal: 7, requirement: 20, requirementText: 'Репутация 20+' },
  { id: 'northline', name: 'Northline Interactive', style: 'большие проекты', upfront: 42000, royalty: 30, appeal: 23, requirement: 42, requirementText: 'Репутация 42+ и средний масштаб' },
  { id: 'silver-pine', name: 'Silver Pine Media', style: 'технологии и будущее', upfront: 65000, royalty: 35, appeal: 30, requirement: 60, requirementText: 'Репутация 60+ и исследование «Сетевой мультиплеер»' }
];

export const marketNews = [
  { id: 'portable', title: 'Портативные устройства набирают ход', text: 'Игроки чаще выбирают короткие сессии. Небольшие проекты получают дополнительное внимание.', genre: 'puzzle', delta: 5 },
  { id: 'streamers', title: 'Стримеры ищут необычные форматы', text: 'Смелые механики обсуждают чаще, чем очередной безопасный клон.', genre: 'horror', delta: 4 },
  { id: 'strategy', title: 'Год больших стратегий', text: 'Сложные системы снова в моде, но аудитория стала требовательнее к интерфейсам.', genre: 'strategy', delta: 6 },
  { id: 'arcade', title: 'Возвращается любовь к аркадам', text: 'Простые правила и точное управление снова попадают в рекомендации.', genre: 'platformer', delta: 6 },
  { id: 'cinema', title: 'Игры становятся кинематографичнее', text: 'Сильная постановка помогает новым приключениям выделиться на витринах.', genre: 'rpg', delta: 4 },
  { id: 'sim', title: 'Игроки строят собственные миры', text: 'Симуляторы и инструменты творчества привлекают долгую аудиторию.', genre: 'simulator', delta: 7 },
  { id: 'racing', title: 'Новый сезон автоспорта', text: 'Соревнования подогревают интерес к гонкам и физике.', genre: 'racing', delta: 6 },
  { id: 'shooter', title: 'Рынок шутеров перегрет', text: 'Большие релизы забрали внимание. Новому шутеру понадобится чёткий крючок.', genre: 'shooter', delta: -7 },
  { id: 'horror-cooldown', title: 'Хорроры немного остыли', text: 'Аудитория ждёт свежего подхода, а не знакомого набора скримеров.', genre: 'horror', delta: -5 },
  { id: 'indie', title: 'Витрины открыли окно для инди', text: 'Площадки выделяют место небольшим командам с ясной идеей.', genre: 'puzzle', delta: 4 },
  { id: 'retro', title: 'Ретро-волна дошла до магазинов', text: 'Старые форматы снова влияют на дизайн новых игр.', genre: 'platformer', delta: 3 },
  { id: 'price', title: 'Игроки стали осторожнее с ценой', text: 'Доверие и качество конвертируются в продажи лучше громких обещаний.', genre: 'simulator', delta: 2 }
];

export const issuePool = [
  { id: 'ai', title: 'ИИ врагов потерялся', detail: 'Тестировщики нашли врагов, которые во время боя ходят в стены.', area: 'programming', cost: 2400, debt: 5, quality: -7 },
  { id: 'save', title: 'Сохранения под вопросом', detail: 'Редкая последовательность действий может повредить сохранение.', area: 'programming', cost: 3000, debt: 6, quality: -9 },
  { id: 'fps', title: 'Просадки кадров', detail: 'Насыщенные сцены красивы, но старое железо с ними не справляется.', area: 'programming', cost: 2800, debt: 4, quality: -6 },
  { id: 'ui', title: 'Меню-лабиринт', detail: 'Игрокам приходится делать слишком много кликов ради важных действий.', area: 'design', cost: 1700, debt: 2, quality: -5 },
  { id: 'content', title: 'Слишком короткий финал', detail: 'Финальная версия меньше, чем обещал концепт.', area: 'writing', cost: 2200, debt: 3, quality: -6 },
  { id: 'audio', title: 'Тишина в важных местах', detail: 'Несколько ключевых сцен почти не получили звукового оформления.', area: 'audio', cost: 1600, debt: 2, quality: -4 }
];

export const hookWords = {
  combat: ['враг учится после каждого поражения', 'одно оружие меняется вместе с твоими решениями'],
  building: ['каждое здание помнит своего создателя', 'город растёт вокруг твоих ошибок'],
  exploration: ['карта меняется, когда ты отворачиваешься', 'мир рассказывает истории через то, чего в нём нет'],
  trading: ['цены реагируют на каждое нарушенное обещание', 'твоя репутация — самая ценная валюта'],
  crafting: ['бесполезного не бывает, но у всего есть цена', 'инструменты наследуют историю своих создателей'],
  puzzle: ['правила раскрываются через ошибки', 'каждое решение меняет следующую загадку'],
  management: ['люди, которыми ты руководишь, меняют систему', 'каждый быстрый путь создаёт новый отдел'],
  progression: ['сила приходит с видимыми последствиями', 'старые решения превращаются в новые способности'],
  'story-choices': ['рассказчик помнит то, о чём ты промолчал', 'отношения переписывают последнюю главу'],
  collection: ['каждый предмет принадлежит живой истории', 'самое редкое не обязательно самое сильное']
};

export const navItems = [
  ['dashboard', 'Главная', '⌂'], ['projects', 'Игры', '▣'], ['team', 'Команда', '◎'], ['office', 'Офис', '□'],
  ['research', 'Исследования', '◈'], ['market', 'Рынок', '⌁'], ['finance', 'Финансы', '$'], ['luck', 'Удача', '✦'],
  ['achievements', 'Достижения', '★'], ['history', 'История', '↗'], ['settings', 'Настройки', '⚙']
];

// Достижения: проверяются после релизов и в конце месяца. Настроение форм и механика в UI.
export const achievements = [
  { id: 'first-game', name: 'Первая проба пера', desc: 'Создать первую игру', reward: 5000, icon: '✏️', color: '#8a8f98', test: (s) => s.stats.released >= 1 },
  { id: 'ten-games', name: 'Серийный продюсер', desc: 'Создать 10 игр', reward: 20000, icon: '🎬', color: '#4b69ff', test: (s) => s.stats.released >= 10 },
  { id: 'fifty-games', name: 'Ветеран индустрии', desc: 'Создать 50 игр', reward: 50000, icon: '🏛️', color: '#8847ff', test: (s) => s.stats.released >= 50 },
  { id: 'genre-master', name: 'Жанровый коллекционер', desc: 'Создать по одной игре в каждом жанре', reward: 30000, icon: '🎲', color: '#d32ce6', test: (s) => { const covered = new Set(s.projects.filter((g) => g.phase === 'released').map((g) => g.genre)); return genres.every((g) => covered.has(g.id)); } },
  { id: 'masterpiece', name: 'Шедевр', desc: 'Оценка критиков выше 9.5', reward: 100000, icon: '💎', color: '#ffd700', test: (s) => s.projects.some((g) => g.phase === 'released' && (g.rating || 0) > 9.5) },
  { id: 'commercial', name: 'Коммерческий успех', desc: 'Прибыль с одной игры больше 1 000 000 $', reward: 200000, icon: '💰', color: '#ffb020', test: (s) => s.projects.some((g) => g.phase === 'released' && (g.revenue || 0) > 1000000) },
  { id: 'perfectionist', name: 'Перфекционист', desc: 'Техника, графика и инновации проекта на максимуме (все три = 100)', reward: 80000, icon: '🎯', color: '#3fa9f5', test: (s) => s.projects.some((g) => g.phase === 'released' && g.scores && g.scores.technical === 100 && g.scores.graphics === 100 && g.scores.innovation === 100) },
  { id: 'self-pub', name: 'Сам себе издатель', desc: 'Выпустить игру без издателя с прибылью больше 0', reward: 15000, icon: '🕊️', color: '#3fce7e', test: (s) => s.projects.some((g) => g.phase === 'released' && !g.publisher && (g.revenue || 0) > 0) },
  { id: 'flop', name: 'Провал года', desc: 'Оценка ниже 2.0 при затратах больше 10 ходов', reward: 3000, icon: '🥉', color: '#7f6bff', test: (s) => s.projects.some((g) => g.phase === 'released' && (g.rating || 10) < 2.0 && (g.monthsSpent || 0) > 10) }
];

export const cases = [
  { id: 'nub', name: 'Новичок', price: 5000, accent: '#8a8f98', icon: '▣', odds: 'Высокий шанс обычного лута, редко — что-то крупнее.', loot: [
    { label: 'Ржавый ключ', min: 300, max: 900, color: '#8a8f98', weight: 55 },
    { label: 'Рекламный стикер', min: 900, max: 2400, color: '#4b69ff', weight: 24 },
    { label: 'Бета-диск', min: 2400, max: 5500, color: '#8847ff', weight: 12 },
    { label: 'Принт-консоль', min: 5500, max: 16000, color: '#d32ce6', weight: 7 },
    { label: 'Золотой болт 404', min: 16000, max: 55000, color: '#ffd700', weight: 2 }
  ] },
  { id: 'vet', name: 'Ветеран', price: 15000, accent: '#4b69ff', icon: '◆', odds: 'Обычный лут ниже цены кейса, но есть дорогие выпады.', loot: [
    { label: 'Б/у монитор', min: 1500, max: 4000, color: '#8a8f98', weight: 48 },
    { label: 'Сетевой коммутатор', min: 4000, max: 9000, color: '#4b69ff', weight: 26 },
    { label: 'Серверная стойка', min: 9000, max: 18000, color: '#8847ff', weight: 14 },
    { label: 'Лицензия движка', min: 18000, max: 50000, color: '#d32ce6', weight: 8 },
    { label: 'Прототип 404', min: 50000, max: 180000, color: '#ffd700', weight: 4 }
  ] },
  { id: 'studio', name: 'Студия', price: 100000, accent: '#8847ff', icon: '⬡', odds: 'Крепкий лут вокруг цены, изредка — большой куш.', loot: [
    { label: 'Старый багги', min: 10000, max: 25000, color: '#8a8f98', weight: 45 },
    { label: 'Полная команда', min: 25000, max: 60000, color: '#4b69ff', weight: 26 },
    { label: 'Полировка релиза', min: 60000, max: 130000, color: '#8847ff', weight: 16 },
    { label: 'Ранний доступ', min: 130000, max: 350000, color: '#d32ce6', weight: 9 },
    { label: 'Инди-хит', min: 350000, max: 900000, color: '#ffd700', weight: 4 }
  ] },
  { id: 'legend', name: 'Легенда', price: 250000, accent: '#ffd700', icon: '★', odds: 'Качели: почти около цены по среднему, с редкими гигантскими выпадами.', loot: [
    { label: 'Гаражная студия', min: 30000, max: 70000, color: '#8a8f98', weight: 40 },
    { label: 'Сетевая империя', min: 70000, max: 160000, color: '#4b69ff', weight: 27 },
    { label: 'Культовая франшиза', min: 160000, max: 350000, color: '#8847ff', weight: 17 },
    { label: 'Студия года', min: 350000, max: 900000, color: '#d32ce6', weight: 11 },
    { label: 'Абсолютная легенда', min: 900000, max: 2500000, color: '#ffd700', weight: 5 }
  ] }
];
