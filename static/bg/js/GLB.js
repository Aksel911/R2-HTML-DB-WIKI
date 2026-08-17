// Constants and Configuration
const baseUrl = `${window.CONFIG.baseUrl}${window.CONFIG.monsterModelNo}/${window.CONFIG.monsterModelNo}_`;

// State management
const state = {
    isPlaying: true,
    isLocked: true,
    currentModelIndex: 0,
    availableModels: [],
    modelCache: new Map(),
    animationVariants: [
        'AttackArms', 'AttackLeg', 'ChargeAttack', 'Cidle',
        'Die', 'EarthQuake', 'FireDestroyer', 'Regen', 'Walk'
    ]
};

// DOM Elements
const elements = {
    modelViewer: document.getElementById('modelViewer'),
    container: document.getElementById('modelContainer'),
    controls: document.querySelector('.controls'),
    menuToggle: document.getElementById('menuToggle'),
    lockToggle: document.getElementById('lockToggle'),
    playBtn: document.getElementById('playBtn'),
    resetBtn: document.getElementById('resetBtn'),
    prevModel: document.getElementById('prevModel'),
    nextModel: document.getElementById('nextModel'),
    modelInfo: document.getElementById('modelInfo'),
    animInfo: document.getElementById('animInfo')
};

// Class mapping
const classMapping = {
    0: {}, 
    1: { '00': 'Рыцарь М', '01': 'Рыцарь Ж' },
    2: { '02': 'Рейнджер М', '03': 'Рейнджер Ж' },
    4: { '04': 'Маг М', '05': 'Маг Ж' },
    5: { '00': 'Рыцарь М', '01': 'Рыцарь Ж', '04': 'Маг М', '05': 'Маг Ж' },
    7: {
        '00': 'Рыцарь М', '01': 'Рыцарь Ж',
        '02': 'Рейнджер М', '03': 'Рейнджер Ж',
        '04': 'Маг М', '05': 'Маг Ж'
    },
    8: { '06': 'Ассасин М', '07': 'Ассасин Ж' },
    15: {
        '00': 'Рыцарь М', '01': 'Рыцарь Ж',
        '02': 'Рейнджер М', '03': 'Рейнджер Ж',
        '04': 'Маг М', '05': 'Маг Ж',
        '06': 'Ассасин М', '07': 'Ассасин Ж'
    },
    16: { '08': 'Призыватель М', '09': 'Призыватель Ж' },
    18: {
        '02': 'Рейнджер М', '03': 'Рейнджер Ж',
        '08': 'Призыватель М', '09': 'Призыватель Ж'
    },
    255: {
        '00': 'Рыцарь М', '01': 'Рыцарь Ж',
        '02': 'Рейнджер М', '03': 'Рейнджер Ж',
        '04': 'Маг М', '05': 'Маг Ж',
        '06': 'Ассасин М', '07': 'Ассасин Ж',
        '08': 'Призыватель М', '09': 'Призыватель Ж'
    }
};

// Utility functions

// Поиск моделей — это десятки HEAD-запросов к raw.githubusercontent.com, из которых
// почти все отдают 404. Ограничиваем параллельность (иначе забивается пул соединений
// браузера) и запоминаем результат на вкладке, чтобы возврат на страницу был мгновенным.
const PROBE_CONCURRENCY = 6;
let activeProbes = 0;
const probeQueue = [];

function readProbeCache(url) {
    try {
        const cached = sessionStorage.getItem(`glb:${url}`);
        return cached === null ? null : cached === '1';
    } catch {
        return null;
    }
}

function writeProbeCache(url, exists) {
    try {
        sessionStorage.setItem(`glb:${url}`, exists ? '1' : '0');
    } catch {
        /* приватный режим или переполнение — обходимся без кэша */
    }
}

async function probe(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.status === 200;
    } catch {
        return false;
    }
}

function drainProbeQueue() {
    while (activeProbes < PROBE_CONCURRENCY && probeQueue.length > 0) {
        const { url, resolve } = probeQueue.shift();
        activeProbes++;
        probe(url).then(exists => {
            writeProbeCache(url, exists);
            if (exists) state.modelCache.set(url, true);
            resolve(exists);
        }).finally(() => {
            activeProbes--;
            drainProbeQueue();
        });
    }
}

async function checkFileExists(url) {
    if (state.modelCache.has(url)) return true;

    const cached = readProbeCache(url);
    if (cached !== null) {
        if (cached) state.modelCache.set(url, true);
        return cached;
    }

    return new Promise(resolve => {
        probeQueue.push({ url, resolve });
        drainProbeQueue();
    });
}

function getCaseVariants(prefix, number) {
    const variants = [];
    [prefix.toLowerCase(), prefix.toUpperCase()].forEach(folderPrefix => {
        [prefix.toLowerCase(), prefix.toUpperCase()].forEach(filePrefix => {
            variants.push({
                folder: `${folderPrefix}${number}`,
                file: `${filePrefix}${number}`
            });
        });
    });
    return variants;
}

// Model loading and checking functions
async function loadModel(index) {
    if (index >= 0 && index < state.availableModels.length) {
        const model = state.availableModels[index];
        elements.modelViewer.src = model.url;
        state.currentModelIndex = index;
        updateModelInfo();
    }
}

async function checkArmorModels(prefix, baseNumber, useClass) {
    const models = [];
    const classesToCheck = classMapping[useClass] || {};
    const prefixCases = [prefix.toLowerCase(), prefix.toUpperCase()];
    const lastThreeDigits = baseNumber.slice(-3);
    
    const checkPromises = Object.entries(classesToCheck).flatMap(([classIndex, className]) => 
        prefixCases.map(async prefixCase => {
            const modelNumber = `0${classIndex[1]}0${lastThreeDigits}`;
            const folder = `${prefixCase}${modelNumber}`;
            const file = `${prefixCase}${modelNumber}`;
            const url = `https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/models/${folder}/${file}.glb`;
            
            const exists = await checkFileExists(url);
            if (exists) {
                models.push({ index: classIndex, variant: className, url });
            }
        })
    );

    await Promise.all(checkPromises);
    return models;
}

async function checkMonsterModel(folder, file) {
    const models = [];
    const baseUrl = `https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/models/${folder}/${file}`;
    
    // Сначала проверяем базовую модель
    const basePromise = (async () => {
        const baseModelUrl = `${baseUrl}.glb`;
        if (await checkFileExists(baseModelUrl)) {
            models.push({ index: '00', variant: null, url: baseModelUrl, priority: 2 });
        }
    })();

    // Параллельно проверяем пронумерованные варианты
    const numberPromises = Array.from({ length: 36 }, async (_, i) => {
        const index = i.toString().padStart(2, '0');
        const url = `${baseUrl}_${index}.glb`;
        if (await checkFileExists(url)) {
            // Даем высокий приоритет модели _01
            const priority = index === '01' ? 0 : 1;
            models.push({ index, variant: null, url, priority });
        }
    });

    // Проверяем варианты анимаций последними
    const animPromises = state.animationVariants.map(async variant => {
        const url = `${baseUrl}_${variant}.glb`;
        if (await checkFileExists(url)) {
            models.push({ variant, url, priority: 3 });
        }
    });

    // Запускаем все проверки параллельно
    await Promise.all([
        basePromise,
        Promise.all(numberPromises),
        Promise.all(animPromises)
    ]);

    // Сортируем модели по приоритету
    return models.sort((a, b) => {
        // Сначала сортируем по приоритету
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        // Если приоритеты равны, сортируем по индексу
        if (a.index && b.index) {
            return parseInt(a.index) - parseInt(b.index);
        }
        // Анимации в конце
        if (a.variant && !b.variant) return 1;
        if (!a.variant && b.variant) return -1;
        return 0;
    });
}

async function checkItemModel(folder, file) {
    const url = `https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/models/${folder}/${file}.glb`;
    const exists = await checkFileExists(url);
    return exists ? [{ index: '00', variant: null, url }] : [];
}

async function checkTransformModel(monsterNumber) {
    const models = [];
    if (!monsterNumber) return models;

    // Format the drop effect ID with proper padding
    const formattedId = `t${monsterNumber.toString().padStart(5, '0')}`;
    const url = `https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/models/${formattedId}/${formattedId}.glb`;
    
    if (await checkFileExists(url)) {
        models.push({ index: '00', variant: 'DragonModel', url });
    }

    return models;
}


async function checkDropEffectModel(dropEffect) {
    const models = [];
    if (!dropEffect) return models;

    // Format the drop effect ID with proper padding
    const formattedId = `id${dropEffect.toString().padStart(6, '0')}`;
    const url = `https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/models/${formattedId}/${formattedId}.glb`;
    
    if (await checkFileExists(url)) {
        models.push({ index: '00', variant: 'DropEffect', url });
    }

    return models;
}

// UI update functions
function updateModelInfo() {
    const currentModel = state.availableModels[state.currentModelIndex];
    const modelName = currentModel.variant
        ? `${currentModel.index}_${currentModel.variant}`
        : currentModel.index;

    elements.modelInfo.textContent = `File: ${modelName} (${state.currentModelIndex + 1}/${state.availableModels.length})`;
    elements.prevModel.disabled = state.currentModelIndex <= 0;
    elements.nextModel.disabled = state.currentModelIndex >= state.availableModels.length - 1;
}

// Event handlers
function togglePlay() {
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) {
        elements.modelViewer.play();
        elements.playBtn.textContent = '⏹️';
    } else {
        elements.modelViewer.pause();
        elements.playBtn.textContent = '▶️';
    }
}

function resetAnimation() {
    elements.modelViewer.currentTime = 0;
    elements.modelViewer.play();
    state.isPlaying = true;
    elements.playBtn.textContent = '⏹️';
}

function toggleMenu() {
    elements.controls.classList.toggle('hidden');
    elements.menuToggle.textContent = elements.controls.classList.contains('hidden') 
        ? '☰ Show Menu' 
        : '👁️ Hide Menu';
}

function toggleLock() {
    state.isLocked = !state.isLocked;
    elements.lockToggle.textContent = state.isLocked ? '🔓 Unlock' : '🔒 Lock';
    elements.lockToggle.classList.toggle('locked', state.isLocked);
    elements.modelViewer.style.pointerEvents = state.isLocked ? 'none' : 'auto';
}

// Initialize
async function findAvailableModels() {
    elements.modelInfo.textContent = 'Scanning for models...';
    
    const monsterNumber = baseUrl.match(/models\/([^\/]+)\//)?.[1];
    const prefix = window.CONFIG.prefix;
    const useClass = window.CONFIG.useClass;
    const dropEffect = window.CONFIG.dropEffect;
        
    // Separate arrays for different types of models
    let armorModels = [];
    let itemModels = [];
    let dropEffectModels = [];
    let transformModels = [];
    let monsterModels = [];

    console.log('Checking model:', {
        monsterNumber,
        prefix,
        useClass,
        dropEffect
    });

    if (prefix.toLowerCase() === 'm') {
        const variants = getCaseVariants(prefix, monsterNumber);
        monsterModels = await checkMonsterModel(variants[0].folder, variants[0].file);
        return monsterModels;
    }
    else if (window.location.pathname.includes('/monster/')) {
        const variants = getCaseVariants(prefix, monsterNumber);
        for (const variant of variants) {
            const monsters = await checkMonsterModel(variant.folder, variant.file);
            if (monsters.length > 0) {
                monsterModels = monsters;
                break;
            }
        }
        return monsterModels;
    } else {
        // Check each type of model separately
        if (prefix.toLowerCase() === 'p') {
            armorModels = await checkArmorModels(prefix, monsterNumber, useClass);
            console.log('Found armor models:', armorModels.length);
        } else {
            const variants = getCaseVariants(prefix, monsterNumber);
            const items = await Promise.all(
                variants.map(v => checkItemModel(v.folder, v.file))
            );
            itemModels = items.flat();
            console.log('Found item models:', itemModels.length);
        }

        if (dropEffect) {
            dropEffectModels = await checkDropEffectModel(dropEffect) || [];
            console.log('Found drop effect models:', dropEffectModels.length);
        }

        if (prefix.toLowerCase() === 't') {
            console.log('Checking for racing dragon model:', monsterNumber);
            transformModels = await checkTransformModel(monsterNumber) || [];
            console.log('Found transform models:', transformModels.length);
        }

        // Combine all models in the desired order
        const combinedModels = [
            ...armorModels,
            ...itemModels,
            ...transformModels,
            ...dropEffectModels
        ];

        console.log('Combined models order:', combinedModels.map(m => m.variant || m.index));
        return combinedModels;
    }
}

// Библиотека просмотрщика подключается только когда модель реально понадобилась
let viewerLibPromise = null;
function loadViewerLib() {
    if (viewerLibPromise) return viewerLibPromise;
    viewerLibPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = window.CONFIG.viewerLib;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
    return viewerLibPromise;
}

async function initialize() {
    try {
        elements.modelInfo.textContent = 'Scanning for models...';

        // Поиск моделей и загрузка библиотеки идут параллельно
        const libLoading = loadViewerLib().catch(e =>
            console.error('Не удалось загрузить model-viewer:', e));

        state.availableModels = await findAvailableModels();

        if (state.availableModels.length > 0) {
            elements.container.classList.remove('hidden');
            await libLoading;
            await loadModel(0);
        } else {
            elements.container.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error during initialization:', error);
        elements.modelInfo.textContent = 'Error loading models';
    }
}

// Старт откладываем до полной отрисовки страницы: раньше десятки HEAD-запросов
// к GitHub уходили сразу и конкурировали с загрузкой самой страницы.
function scheduleInitialize() {
    let started = false;
    const start = () => {
        if (started) return;
        started = true;
        initialize();
    };

    // Ждём момента простоя после отрисовки. По видимости контейнера ориентироваться
    // нельзя: пока библиотека не загружена, <model-viewer> имеет размер 0×0.
    if ('requestIdleCallback' in window) {
        requestIdleCallback(start, { timeout: 1500 });
    } else {
        setTimeout(start, 300);
    }
}

// Event listeners
elements.modelViewer.addEventListener('load', () => {
    const animations = elements.modelViewer.availableAnimations;
    elements.animInfo.innerHTML = animations.length > 0
        ? `Animation name: ${animations.map(anim => 
            `<span class="animation-name">${anim}</span>`).join(', ')}`
        : 'No animations available';
});

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            if (!elements.prevModel.disabled) loadModel(state.currentModelIndex - 1);
            break;
        case 'ArrowRight':
            if (!elements.nextModel.disabled) loadModel(state.currentModelIndex + 1);
            break;
        case ' ':
            event.preventDefault();
            togglePlay();
            break;
        case 'Escape':
            toggleMenu();
            break;
    }
});

// Attach event handlers
elements.playBtn.addEventListener('click', togglePlay);
elements.resetBtn.addEventListener('click', resetAnimation);
elements.prevModel.addEventListener('click', () => loadModel(state.currentModelIndex - 1));
elements.nextModel.addEventListener('click', () => loadModel(state.currentModelIndex + 1));
elements.menuToggle.addEventListener('click', toggleMenu);
elements.lockToggle.addEventListener('click', toggleLock);

// Start the application
if (document.readyState === 'complete') {
    scheduleInitialize();
} else {
    window.addEventListener('load', scheduleInitialize);
}