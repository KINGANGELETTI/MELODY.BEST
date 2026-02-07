// Search Providers Configuration
const searchProviders = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        emoji: '🔍'
    },
    bing: {
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
        emoji: '🅱️'
    },
    duckduckgo: {
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q=',
        emoji: '🦆'
    },
    yahoo: {
        name: 'Yahoo',
        url: 'https://search.yahoo.com/search?p=',
        emoji: '🟣'
    },
    brave: {
        name: 'Brave Search',
        url: 'https://search.brave.com/search?q=',
        emoji: '🦁'
    },
    ecosia: {
        name: 'Ecosia',
        url: 'https://www.ecosia.org/search?q=',
        emoji: '🌱'
    }
};

// Default Settings
const defaultSettings = {
    searchProvider: 'google',
    theme: 'dark',
    greeting: '',
    showClock: true,
    showDate: true,
    accentColor: '#6C63FF'
};

// State Management
let settings = { ...defaultSettings };

// DOM Elements
const elements = {
    searchForm: document.getElementById('searchForm'),
    searchInput: document.getElementById('searchInput'),
    providerName: document.getElementById('providerName'),
    greeting: document.getElementById('greeting'),
    clock: document.getElementById('clock'),
    date: document.getElementById('date'),
    settingsButton: document.getElementById('settingsButton'),
    settingsOverlay: document.getElementById('settingsOverlay'),
    closeSettings: document.getElementById('closeSettings'),
    providerButtons: document.querySelectorAll('.provider-button'),
    greetingInput: document.getElementById('greetingInput'),
    showClockToggle: document.getElementById('showClock'),
    showDateToggle: document.getElementById('showDate'),
    darkModeToggle: document.getElementById('darkMode'),
    colorSwatches: document.querySelectorAll('.color-swatch'),
    customColorInput: document.getElementById('customColor'),
    resetButton: document.getElementById('resetButton')
};

// Initialize Application
function init() {
    loadSettings();
    applySettings();
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
}

// Load Settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('melodySettings');
    if (saved) {
        settings = { ...defaultSettings, ...JSON.parse(saved) };
    }
}

// Save Settings to localStorage
function saveSettings() {
    localStorage.setItem('melodySettings', JSON.stringify(settings));
}

// Apply Settings to UI
function applySettings() {
    // Apply theme
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
        elements.darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        elements.darkModeToggle.checked = false;
    }

    // Apply accent color
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    const hoverColor = adjustColor(settings.accentColor, -20);
    document.documentElement.style.setProperty('--accent-hover', hoverColor);
    
    // Update color swatches
    updateColorSwatches();

    // Apply greeting
    if (settings.greeting) {
        elements.greeting.textContent = `Hello, ${settings.greeting}!`;
    } else {
        elements.greeting.textContent = 'Hello!';
    }
    elements.greetingInput.value = settings.greeting;

    // Apply clock visibility
    if (settings.showClock) {
        elements.clock.classList.remove('hidden');
    } else {
        elements.clock.classList.add('hidden');
    }
    elements.showClockToggle.checked = settings.showClock;

    // Apply date visibility
    if (settings.showDate) {
        elements.date.classList.remove('hidden');
    } else {
        elements.date.classList.add('hidden');
    }
    elements.showDateToggle.checked = settings.showDate;

    // Apply search provider
    updateSearchProvider();
}

// Update Search Provider Display
function updateSearchProvider() {
    const provider = searchProviders[settings.searchProvider];
    elements.providerName.textContent = provider.name;
    
    // Update active provider button in settings
    elements.providerButtons.forEach(btn => {
        if (btn.dataset.provider === settings.searchProvider) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Update Clock and Date
function updateClock() {
    const now = new Date();
    
    // Update clock
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    elements.clock.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.date.textContent = now.toLocaleDateString('en-US', options);
}

// Setup Event Listeners
function setupEventListeners() {
    // Search form submission
    elements.searchForm.addEventListener('submit', handleSearch);

    // Settings panel toggle
    elements.settingsButton.addEventListener('click', openSettings);
    elements.closeSettings.addEventListener('click', closeSettings);
    elements.settingsOverlay.addEventListener('click', (e) => {
        if (e.target === elements.settingsOverlay) {
            closeSettings();
        }
    });

    // Search provider buttons
    elements.providerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            settings.searchProvider = btn.dataset.provider;
            updateSearchProvider();
            saveSettings();
        });
    });

    // Greeting input
    elements.greetingInput.addEventListener('input', (e) => {
        settings.greeting = e.target.value;
        if (settings.greeting) {
            elements.greeting.textContent = `Hello, ${settings.greeting}!`;
        } else {
            elements.greeting.textContent = 'Hello!';
        }
        saveSettings();
    });

    // Clock toggle
    elements.showClockToggle.addEventListener('change', (e) => {
        settings.showClock = e.target.checked;
        if (settings.showClock) {
            elements.clock.classList.remove('hidden');
        } else {
            elements.clock.classList.add('hidden');
        }
        saveSettings();
    });

    // Date toggle
    elements.showDateToggle.addEventListener('change', (e) => {
        settings.showDate = e.target.checked;
        if (settings.showDate) {
            elements.date.classList.remove('hidden');
        } else {
            elements.date.classList.add('hidden');
        }
        saveSettings();
    });

    // Dark mode toggle
    elements.darkModeToggle.addEventListener('change', (e) => {
        settings.theme = e.target.checked ? 'dark' : 'light';
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        saveSettings();
    });

    // Color swatches
    elements.colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            settings.accentColor = color;
            applyAccentColor(color);
            saveSettings();
        });
    });

    // Custom color picker
    elements.customColorInput.addEventListener('input', (e) => {
        settings.accentColor = e.target.value;
        applyAccentColor(e.target.value);
        saveSettings();
    });

    // Reset button
    elements.resetButton.addEventListener('click', resetToDefaults);

    // Close settings with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.settingsOverlay.classList.contains('active')) {
            closeSettings();
        }
    });
}

// Handle Search Form Submission
function handleSearch(e) {
    e.preventDefault();
    const query = elements.searchInput.value.trim();
    
    if (query) {
        const provider = searchProviders[settings.searchProvider];
        const searchUrl = provider.url + encodeURIComponent(query);
        window.location.href = searchUrl;
    }
}

// Open Settings Panel
function openSettings() {
    elements.settingsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Settings Panel
function closeSettings() {
    elements.settingsOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Apply Accent Color
function applyAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    const hoverColor = adjustColor(color, -20);
    document.documentElement.style.setProperty('--accent-hover', hoverColor);
    updateColorSwatches();
    elements.customColorInput.value = color;
}

// Update Color Swatches Active State
function updateColorSwatches() {
    elements.colorSwatches.forEach(swatch => {
        if (swatch.dataset.color === settings.accentColor) {
            swatch.classList.add('active');
        } else {
            swatch.classList.remove('active');
        }
    });
}

// Adjust Color Brightness
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Reset to Default Settings
function resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
        settings = { ...defaultSettings };
        saveSettings();
        applySettings();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
