import nipplejs from 'nipplejs';
import { mountReplay } from './replay_system.jsx';

document.addEventListener('DOMContentLoaded', () => {
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const PLAYER_WIDTH = 50;  
    const PLAYER_HEIGHT = 50; 
    const PLAYER_SPEED = 6; 
    const BOSS_WIDTH = 150;
    const BOSS_HEIGHT = 150;

    // Game Stats
    const PROJECTILE_BASE_WIDTH = 50; 
    const PROJECTILE_BASE_HEIGHT = 50;  
    const PROJECTILE_SPEED = 5;
    const HOMING_PROJECTILE_HORIZONTAL_SPEED = 4.2;
    const HOMING_PROJECTILE_HORIZONTAL_SPEED_SECRET_MODE = 2.0; // Nerfed speed for secret mode
    const BOSS_ATTACK_COOLDOWN_MIN = 700; 
    const BOSS_ATTACK_COOLDOWN_MAX = 1700; 
    const BOSS_PROJECTILE_DAMAGE = 25; 
    const BOSS_MAX_HEALTH = 1500; 
    const PLAYER_MAX_HEALTH = 100; 
    const PLAYER_PROJECTILE_DAMAGE = 25;

    const PLAYER_PROJECTILE_WIDTH = 8; 
    const PLAYER_PROJECTILE_HEIGHT = 20; 
    const PLAYER_PROJECTILE_SPEED = 8; 
    const PLAYER_ATTACK_COOLDOWN = 250; 

    const BOSS_HORIZONTAL_SPEED = 2; 
    const BOSS_INITIAL_Y = 50; 

    const BARRIER_Y_POSITION = BOSS_INITIAL_Y + BOSS_HEIGHT + 10; 

    // Stink Ray Constants
    const STINK_RAY_CHARGE_TIME = 1500; // ms
    const STINK_RAY_DAMAGE = 100; // More damage
    const PLAYER_SPEED_CHARGING_MULTIPLIER = 0.4; // Slower when charging
    const STINK_RAY_PROJECTILE_WIDTH = 25; 
    const STINK_RAY_PROJECTILE_HEIGHT = 55; 
    const STINK_RAY_PROJECTILE_SPEED = 7; 
    const QUICK_TAP_THRESHOLD = 220; // ms to differentiate tap from charge start
    const STUN_DURATION = 3000; // 3 seconds in ms for boss stun
    const STINK_RAY_INVINCIBILITY_DURATION = 10000; // 10 seconds in ms after stun

    // Heal Item Constants
    const HEAL_ITEM_WIDTH = 40;
    const HEAL_ITEM_HEIGHT = 40;
    const HEAL_SPAWN_INTERVAL = 10000; // 10 seconds in ms
    const HEAL_AMOUNT_MIN = 10; // Minimum HP healed for cheese
    const HEAL_AMOUNT_MAX = 15; // Maximum HP healed for cheese
    const APPLE_HEAL_CHANCE = 0.1; // 10% chance for an apple

    // Slop Projectile Constants (NEW)
    const SLOP_PROJECTILE_WIDTH = 70;
    const SLOP_PROJECTILE_HEIGHT = 35;

    // Summer Event Constants
    const WATER_BALLOON_WIDTH = 40;
    const WATER_BALLOON_HEIGHT = 40;

    const splashScreen = document.getElementById('splash-screen');
    const splashPromptText = document.getElementById('splash-prompt-text');
    const menuScreen = document.getElementById('menu-screen');
    const startGameButton = document.getElementById('start-game-button');
    const shopButton = document.getElementById('shop-button');
    const menuBossImg = document.getElementById('menu-boss-img'); 

    const gameArea = document.getElementById('game-container');
    const playerElem = document.getElementById('player');
    const bossElem = document.getElementById('boss');
    const gameOverScreen = document.getElementById('game-over-screen');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const gameOverBossImg = document.getElementById('game-over-boss-img');
    const restartButton = document.getElementById('restart-button');
    const scoreDisplay = document.getElementById('score-display');
    const bgm = document.getElementById('bgm');
    const effectsLayer = document.getElementById('effects-layer'); 

    const playerHealthBarElem = document.getElementById('player-health-bar');
    const bossHealthBarElem = document.getElementById('boss-health-bar');
    const playerHealthContainerElem = document.getElementById('player-health-container');
    const bossHealthContainerElem = document.getElementById('boss-health-container');
    const playerHealthLabel = document.getElementById('player-health-label');
    const bossHealthLabel = document.getElementById('boss-health-label');

    const playerChargeContainerElem = document.getElementById('player-charge-container');
    const playerChargeBarElem = document.getElementById('player-charge-bar');
    // const playerChargeLabelElem = document.getElementById('player-charge-label'); // Not directly manipulated by JS for now

    const pauseButton = document.getElementById('pause-button');
    const pauseScreen = document.getElementById('pause-screen');
    const resumeButton = document.getElementById('resume-button');
    const backToMenuButton = document.getElementById('back-to-menu-button'); 

    const mobileControlsElem = document.getElementById('mobile-controls');
    const joystickContainerElem = document.getElementById('joystick-container');
    const mobileShootButtonElem = document.getElementById('mobile-shoot-button');

    const cutsceneContainer = document.getElementById('cutscene-container');
    const cutsceneTextElem = document.getElementById('cutscene-text');
    const cutsceneImageElem = document.getElementById('cutscene-image');
    const skipCutsceneButton = document.getElementById('skip-cutscene-button');

    const secretModeButton = document.getElementById('secret-mode-button');
    const progressResetButton = document.getElementById('progress-reset-button');

    const shopScreen = document.getElementById('shop-screen');
    const shopItemsContainer = document.getElementById('shop-items-container');
    const shopBackToMenuButton = document.getElementById('shop-back-to-menu-button');
    const tokenCountDisplay = document.getElementById('token-count');
    const pizzaCountDisplay = document.getElementById('pizza-count');
    const shopMessageArea = document.getElementById('shop-message-area');

    const strategyBookMenuButton = document.getElementById('strategy-book-menu-button');
    const strategyBookModal = document.getElementById('strategy-book-modal');
    const strategyBookTextElem = document.getElementById('strategy-book-text');
    const strategyBookCloseButton = document.getElementById('strategy-book-close-button');

    const changelogButton = document.getElementById('changelog-button');
    const changelogModal = document.getElementById('changelog-modal');
    const changelogTextElem = document.getElementById('changelog-text');
    const changelogCloseButton = document.getElementById('changelog-close-button');

    const summerEventBanner = document.getElementById('summer-event-banner');
    const summerEventSun = document.getElementById('summer-event-sun');

    // Minigames Elements
    const minigamesButton = document.getElementById('minigames-button');
    const minigamesMenuScreen = document.getElementById('minigames-menu-screen');
    const minigamesBackButton = document.getElementById('minigames-back-button');
    const gardensGameButton = document.getElementById('gardens-game-button');
    
    // Gardens Game Elements
    const gardensGameScreen = document.getElementById('gardens-game-screen');
    const playerCarrotImg = document.getElementById('player-carrot');
    const nyanwolfCarrotImg = document.getElementById('nyanwolf-carrot');
    const playerGardenScore = document.getElementById('player-garden-score');
    const nyanwolfGardenScore = document.getElementById('nyanwolf-garden-score');
    const wateringMinigameUI = document.getElementById('watering-minigame-ui');
    const timingBarCursor = document.getElementById('timing-bar-cursor');
    const waterButton = document.getElementById('water-button');
    const gardensInfoText = document.getElementById('gardens-info-text');
    const gardensResultScreen = document.getElementById('gardens-result-screen');
    const gardensResultTitle = document.getElementById('gardens-result-title');
    const gardensResultMessage = document.getElementById('gardens-result-message');
    const gardensPlayAgainButton = document.getElementById('gardens-play-again-button');
    const gardensBackToMenuButton = document.getElementById('gardens-back-to-menu-button');

    let player = { x: 0, y: 0, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, health: PLAYER_MAX_HEALTH }; 
    let boss = { x: 0, y: 0, width: BOSS_WIDTH, height: BOSS_HEIGHT, health: BOSS_MAX_HEALTH, lastAttackTime: 0, currentAttackCooldown: 2000, dx: BOSS_HORIZONTAL_SPEED };
    let projectiles = [];
    let playerProjectiles = [];
    let keys = {};
    let isGameOver = false;
    let score = 0;
    let gameLoopId;
    let scoreIntervalId;
    let lastPlayerAttackTime = 0;
    let isPaused = false;
    let replayData = []; // Store frame data for replay

    // Gardens Game State
    let gardensGameActive = false;
    let playerCarrotSize = 0;
    let nyanwolfCarrotSize = 0;
    let gardensRound = 0;
    const GARDENS_MAX_ROUNDS = 3;
    let timingBarAnimationId;
    let timingBarDirection = 1;
    let timingBarPosition = 0;
    let playerTurn = true;
    const CARROT_GROWTH_STAGES = [
        '/carrot_stage_0.png',
        '/carrot_stage_1.png',
        '/carrot_stage_2.png',
        '/carrot_stage_3.png',
        '/carrot_stage_4.png',
        '/carrot_stage_5.png',
    ];

    // Stink Ray State
    let isChargingStinkRay = false;
    let stinkRayChargeStartTime = 0;
    let stinkRayChargeLevel = 0; // 0 to 1
    let stinkRayChargeSoundNode = null;
    let isMobileShooting = false; // For mobile touch state

    // Boss status effect states
    let isBossStunned = false;
    let bossStunEndTime = 0;
    let isBossStinkRayInvincible = false;
    let bossStinkRayInvincibilityEndTime = 0;

    // Heal Item State
    let healItem = null; // { element, x, y, width, height, type: 'cheese' | 'apple' }
    let lastHealSpawnTime = 0;

    let audioContext;
    let playerHitBuffer;
    let playerShootBuffer;
    let stinkRayChargeBuffer;
    let stinkRayFireBuffer;
    let healPickupBuffer; // For heal sound
    let waterSplashBuffer; // For summer event hit sound

    const STRATEGY_GUIDE_TEXT = "Nyanwolf Strategy Guide:\n\n" +
        "General Tips:\n" +
        "- Stay mobile! Don't get cornered.\n" +
        "- Prioritize dodging, especially in 'DON'T TOUCH MY PIZZA' mode.\n" +
        "- Use the Stink Ray (E key / Hold Shoot on Mobile) strategically. A full charge stuns Nyanwolf, giving you free hits or a breather. But you move slower while charging!\n" +
        "- Collect Golden Cheese for small heals and Red Apples for full heals!\n\n" +
        "Nyanwolf's Attacks (HARD & SECRET Mode):\n" +
        "- Straight Shot: A single projectile (pizza/GIF) directly downwards. Easy to dodge if you're moving.\n" +
        "- Homing Missile: Tracks your horizontal position slowly before accelerating down. Keep moving and make sharp turns as it commits.\n" +
        "  (Slightly slower in SECRET mode, but still very dangerous!)\n" +
        "- Spread Shot: Fires multiple projectiles in a cone. Look for the gaps and move through them.\n" +
        "- Quick Barrage: A rapid burst of three straight shots. Requires quick side-to-side dodges or finding a safe spot early.\n\n" +
        "Secret 'DON'T TOUCH MY PIZZA' Mode:\n" +
        "- ONE HIT AND YOU'RE OUT! Precision is key.\n" +
        "- Winning unlocks this guide (first time), +10 Tokens, and +1 Pizza slice currency!\n\n" +
        "Dev Tips:\n" +
        "- The AI did a surprisingly good job with the strategy. High five, AI! \n" +
        "- Juking is a solid tactic: try to position yourself on the side the boss is moving towards, then shoot as it passes. This maximizes your chances of hitting Nyanwolf while minimizing your risk.\n\n" + 
        "Good luck, cheese warrior!";

    const CHANGELOG_TEXT = "Nyanwolf Bossfight - Patch Notes:\n\n" +
        "<strong>v0.7 - The Update Log Update!</strong> (Current)\n" +
        "- Added this very Changelog! Now you can see what's new and what's... slop.\n" +
        "- Phineas and Ferb intro guy not included (yet).\n" +
        "<strong>v0.6 - The Don Nyanwolf Update</strong>\n" +
        "- New Boss Skin: Mafioso Nyanwolf. He's gonna make you an offer you can't refuse (to dodge).\n" +
        "- Minor bug fixes related to shop item equip states.\n" +
        "<strong>v0.5 - The Know-It-All Update</strong>\n" +
        "- Strategy Book implemented! Unlock by beating 'DON'T TOUCH MY PIZZA' mode.\n" +
        "- Added a 'Dev Tips' section to the Strategy Book. Read it, maybe?\n" +
        "- Strategy Book now accessible from the main menu once unlocked.\n" +
        "<strong>v0.4 - The Identity Crisis Update</strong>\n" +
        "- Player Skins added! Play as the classic Blue Cheese or... YOURSELF (if you have an avatar and 2 Pizza).\n" +
        "- Shop UI improvements for equipping items.\n" +
        "<strong>v0.3 - The Capitalist Update</strong>\n" +
        "- C00lkid's Shop is OPEN! Spend Tokens and Pizza on cool stuff.\n" +
        "- Boss Skins: Classic Nyanwolf, Slop Project Nyanwolf.\n" +
        "- Game Backgrounds: Default Space, White Background (for the purists).\n" +
        "- Currency system with Tokens and Pizza slices.\n" +
        "<strong>v0.2 - The 'Don't You Dare!' Update</strong>\n" +
        "- SECRET MODE: 'DON'T TOUCH MY PIZZA'. One hit, you're out. High stakes, high reward!\n" +
        "- Unlocks Strategy Book, Tokens, and Pizza on first win.\n" +
        "<strong>v0.1 - The Genesis Slop</strong>\n" +
        "- Nyanwolf Bossfight launched! Face the legendary Nyanwolf in HARD mode.\n" +
        "- Basic gameplay mechanics: movement, shooting, boss attacks, health bars.\n" +
        "- Stink Ray special attack implemented. Charge it up!\n" +
        "- Heal items (Golden Cheese, Red Apples) to keep you in the fight.\n" +
        "- Mobile controls with joystick and shoot button.\n" +
        "- Groovy BGM and sound effects (mostly).\n" +
        "\"There's 104 days of daily updates... or something like that.\"";

    let hardModeBeaten = localStorage.getItem('hardModeBeaten') === 'true';
    let currentGameMode = 'HARD'; // Possible values: 'HARD', 'SECRET_NO_HIT'

    // Player currency and shop items
    let playerTokens = 0;
    let playerPizzas = 0;
    let purchasedShopItemIds = [];
    let equippedBossSkinId = 'nyanwolf_default';
    let equippedGameBackgroundId = 'default_space'; // New state for equipped background
    let equippedPlayerSkinId = 'player_skin_blue_cheese_default'; // New state for player skin
    let strategyBookUnlocked = false; // New state for strategy book

    const shopItems = [
        {
            id: 'nyanwolf_default',
            name: 'Classic Nyanwolf',
            type: 'boss_skin',
            description: 'The original, awesome Nyanwolf!',
            image: '/nyanwolf-neutral-no-background.png',
            cost_token: 0,
            cost_pizza: 0,
        },
        {
            id: 'nyanwolf_slop',
            name: 'Slop Project Nyanwolf',
            type: 'boss_skin',
            description: 'A callback to the original project. Laugh at user!',
            image: '/slop-project.png',
            cost_token: 0,
            cost_pizza: 1,
        },
        // New Mafioso Nyanwolf Skin
        {
            id: 'nyanwolf_mafioso',
            name: 'Mafioso Nyanwolf',
            type: 'boss_skin',
            description: 'This Nyanwolf means business. Fuzzy, fluffy business.',
            image: '/Mafioso.webp',
            cost_token: 10,
            cost_pizza: 2,
        },
        // --- SUMMER EVENT ITEMS ---
        {
            id: 'nyanwolf_summer',
            name: 'Summer Nyanwolf',
            type: 'boss_skin',
            description: 'This Nyanwolf is ready to make a splash! Shoots water balloons.',
            image: '/summer_nyanwolf.png',
            cost_token: 25,
            cost_pizza: 0,
        },
        {
            id: 'player_skin_rubber_ducky',
            name: 'Rubber Ducky',
            type: 'player_skin',
            description: 'Quack your way to victory with this unsinkable player skin.',
            image: '/rubber_ducky_icon.png',
            cost_token: 15,
            cost_pizza: 0,
        },
        {
            id: 'game_bg_beach',
            name: 'Beach Background',
            type: 'game_background',
            description: 'Bring the battle to the beach! Sun, sand, and Nyanwolf.',
            image: '/beach_icon.png',
            cost_token: 10,
            cost_pizza: 0,
        },
        // --- END SUMMER EVENT ---
        // New shop item for white background
        {
            id: 'game_bg_white',
            name: 'White Background',
            type: 'game_background',
            description: "ya know, because the original video had a white background.",
            image: '/white_bg_icon.png', 
            cost_token: 5, // Cost in tokens
            cost_pizza: 0,
        },
        // Conceptual item for default background, now shown in shop
        {
            id: 'default_space',
            name: 'Default Space',
            type: 'game_background',
            description: "The classic starry void. Can't go wrong!",
            image: '/default_space_icon.png', 
            cost_token: 0,
            cost_pizza: 0,
        },
        // Default Player Skin
        {
            id: 'player_skin_blue_cheese_default',
            name: 'Classic Blue Cheese',
            type: 'player_skin',
            description: 'The original delicious player ship.',
            image: '/blue_cheese_icon.png', // Using new icon
            cost_token: 0,
            cost_pizza: 0,
        },
        // Yourself Player Skin
        {
            id: 'player_skin_yourself',
            name: 'Yourself (Avatar Skin)',
            type: 'player_skin',
            description: 'Play as... you! Replaces blue cheese with your avatar.',
            image: '/profile_icon.png', // Using new icon
            cost_token: 0,
            cost_pizza: 2,
        },
        // New Strategy Book item
        {
            id: 'strategy_book',
            name: 'Nyanwolf Strategy Book',
            type: 'collectible', // New type
            description: "Nyanwolf's attack patterns and tips! Beat 'DON'T TOUCH MY PIZZA' mode to unlock.",
            image: '/strategy_book_icon.png',
            // No cost, unlocked by gameplay
        }
    ];

    // Sound effect buffers for shop
    let shopEnterBuffer;
    let shopPurchaseBuffer;
    let shopErrorBuffer;
    let shopEquipBuffer;

    const defaultBgmSrc = "/ytmp3free.cc_mrfun-unregistered-hypercam-2-by-undertale-last-corridor-extra-youtubemp3free.org (1).mp3";
    const hardModeBgmSrc = "/Dont Touch My Chainsaw! [Kevin Chase Theme] - FORSAKEN OST.mp3";

    let currentBossMaxHealth;
    let currentBossProjectileDamage;
    let currentProjectileSpeed;
    let currentHomingProjectileHorizontalSpeed;
    let currentBossAttackCooldownMin;
    let currentBossAttackCooldownMax;
    let currentPlayerMaxHealth;
    let currentPlayerProjectileDamage;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let joystick = null;
    let joystickData = { angle: null, distance: null, force: 0, vector: { x: 0, y: 0 } };
    const JOYSTICK_FORCE_THRESHOLD = 0.1;

    const BOSS_DEFAULT_FILTER = 'drop-shadow(0 0 10px #00ff7f) drop-shadow(0 0 5px #ff00ff)';
    const BOSS_STUN_FILTER = 'grayscale(80%) sepia(30%) brightness(0.7) drop-shadow(0 0 10px yellow)';
    const BOSS_SUMMER_FILTER = 'drop-shadow(0 0 10px #00c6ff) drop-shadow(0 0 8px #ffdd57)'; // Blue/Yellow for summer boss

    const cutsceneScenes = [
        { text: "From the deepest corners of the vibrant net...", duration: 3500 },
        { text: "A legendary creature of pure awesome appears...", duration: 3500 },
        { 
            text: "BEHOLD! THE MIGHTY NYANWOLF!", 
            image: "/nyanwolf-neutral-no-background.png", // This will be dynamically updated
            duration: 4000 
        },
        { text: "Can you handle... THIS MUCH SWAG?!", duration: 3000 }
    ];
    let currentCutsceneSceneIndex = 0;
    let cutsceneTimeoutId = null;
    let splashPromptVisible = false;

    function handleSplashScreenInteraction() {
        // First interaction: show the prompt
        if (!splashPromptVisible) {
            splashPromptVisible = true;
            if (splashPromptText) {
                splashPromptText.style.opacity = '1';
            }
            // IMPORTANT: unlock audio context on first user interaction
            if (!audioContext) {
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    if (audioContext.state === 'suspended') {
                        audioContext.resume().catch(e => console.warn("AudioContext resume on splash click failed:", e));
                    }
                } catch (e) {
                    console.error("Could not create AudioContext:", e);
                }
            }
            return; // Wait for the second interaction
        }

        // Second interaction: hide splash and show menu
        if (splashScreen) splashScreen.style.display = 'none';
        if (menuScreen) menuScreen.style.display = 'flex';

        // Clean up listeners
        window.removeEventListener('click', handleSplashScreenInteraction);
        window.removeEventListener('keydown', handleSplashScreenInteraction);
    }

    // Only set up listeners if splash screen is visible initially
    if (splashScreen && getComputedStyle(splashScreen).display !== 'none') {
        window.addEventListener('click', handleSplashScreenInteraction);
        window.addEventListener('keydown', handleSplashScreenInteraction);
    }

    function updateMenuButtonsVisibility() {
        hardModeBeaten = localStorage.getItem('hardModeBeaten') === 'true'; // Re-check
        strategyBookUnlocked = localStorage.getItem('strategyBookUnlocked') === 'true'; // Re-check strategy book
        if (secretModeButton) {
            secretModeButton.style.display = hardModeBeaten ? 'block' : 'none';
        }
        if (strategyBookMenuButton) {
            strategyBookMenuButton.style.display = strategyBookUnlocked ? 'block' : 'none';
        }
    }
    updateMenuButtonsVisibility(); // Initial check

    // --- SUMMER EVENT MENU ---
    function setupSummerMenu() {
        if (summerEventBanner) summerEventBanner.style.display = 'block';
        if (summerEventSun) summerEventSun.style.display = 'block';
        if (menuScreen) menuScreen.style.background = 'linear-gradient(to bottom, #87CEEB, #F0E68C)'; // Sky blue to sandy
        if (document.body) document.body.style.backgroundColor = '#87CEEB'; // Match body to sky
    }
    
    function resetToDefaultMenu() {
        if (summerEventBanner) summerEventBanner.style.display = 'none';
        if (summerEventSun) summerEventSun.style.display = 'none';
        if (menuScreen) menuScreen.style.background = 'linear-gradient(to bottom, #1a1a2e, #16223f)';
        if (document.body) document.body.style.backgroundColor = '#1a1a2e';
    }
    
    resetToDefaultMenu(); // Default theme on load

    if (isTouchDevice) {
        if (joystickContainerElem) {
            joystick = nipplejs.create({
                zone: joystickContainerElem,
                mode: 'static', 
                position: { left: '50%', top: '50%' },
                color: 'rgba(255,255,255,0.3)', 
                size: 120, 
                threshold: 0.1, 
                fadeTime: 250,
                multitouch: false,
                maxNumberOfNipples: 1,
                dataOnly: false,
                restJoystick: true,
                restOpacity: 0.3, 
            });

            joystick.on('move', (evt, data) => {
                joystickData = data;
            });

            joystick.on('end', () => {
                joystickData = { angle: null, distance: null, force: 0, vector: { x: 0, y: 0 } };
            });
        }

        if (mobileShootButtonElem) {
            mobileShootButtonElem.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (isPaused || isGameOver) return;
                isMobileShooting = true;

                if (!isChargingStinkRay) {
                    isChargingStinkRay = true;
                    stinkRayChargeStartTime = Date.now();
                    stinkRayChargeLevel = 0;
                    if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'flex';
                    if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';

                    if (stinkRayChargeBuffer && audioContext) {
                        if (stinkRayChargeSoundNode) stinkRayChargeSoundNode.stop();
                        stinkRayChargeSoundNode = playSound(stinkRayChargeBuffer, true);
                    }
                }
            });

            mobileShootButtonElem.addEventListener('touchend', (e) => {
                e.preventDefault();
                isMobileShooting = false;

                if (isChargingStinkRay) {
                    isChargingStinkRay = false;
                    if (stinkRayChargeSoundNode) {
                        stinkRayChargeSoundNode.stop();
                        stinkRayChargeSoundNode = null;
                    }
                    if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'none';

                    const chargeDuration = Date.now() - stinkRayChargeStartTime;

                    if (chargeDuration >= STINK_RAY_CHARGE_TIME) {
                        createPlayerProjectile('stink_ray');
                        playSound(stinkRayFireBuffer);
                        lastPlayerAttackTime = Date.now();
                    } else if (chargeDuration < QUICK_TAP_THRESHOLD) {
                        if (Date.now() - lastPlayerAttackTime > PLAYER_ATTACK_COOLDOWN) {
                            createPlayerProjectile('normal');
                            lastPlayerAttackTime = Date.now();
                        }
                    }
                    stinkRayChargeLevel = 0;
                    if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';
                }
            });
        }
    }

    async function loadSound(url) {
        if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to load sound: ${url}, status: ${response.status}`);
                return null;
            }
            const arrayBuffer = await response.arrayBuffer();
            return audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error(`Error loading sound ${url}:`, error);
            return null;
        }
    }

    function playSound(buffer, loop = false) {
        if (!audioContext || !buffer) return null;
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;
        source.connect(audioContext.destination);
        source.start(0);
        if (loop) return source;
        return null;
    }

    function updateHealthBar(barElement, currentHealth, maxHealth, labelElement = null, labelPrefix = "") {
        const percentage = Math.max(0, (currentHealth / maxHealth) * 100);
        barElement.style.width = percentage + '%';
        if (labelElement && maxHealth > 0) { 
            labelElement.textContent = `${labelPrefix}${Math.max(0, Math.round(currentHealth))} / ${maxHealth}`;
        } else if (labelElement) {
            labelElement.textContent = `${labelPrefix}--- / ---`;
        }
    }
    
    function createHitSpark(x, y) {
        const equippedSkinId = getEquippedSkin().id;
        const effectsContainer = document.getElementById('effects-layer');
        if (!effectsContainer) return;

        if (equippedSkinId === 'nyanwolf_summer') {
            const splash = document.createElement('div');
            splash.className = 'water-splash';
            splash.style.left = (x - 25) + 'px'; // Center splash
            splash.style.top = (y - 25) + 'px';
            effectsContainer.appendChild(splash);
            playSound(waterSplashBuffer); // Play new splash sound
            setTimeout(() => {
                if (splash.parentNode) splash.remove();
            }, 300);
            return; // Don't create a normal spark
        }

        const spark = document.createElement('div');
        spark.className = 'hit-spark';
        spark.style.left = (x - 15) + 'px'; 
        spark.style.top = (y - 15) + 'px';
        effectsContainer.appendChild(spark);
        setTimeout(() => {
            if (spark.parentNode) spark.remove();
        }, 300); 
    }

    function startCutscene() {
        menuScreen.style.display = 'none';
        cutsceneContainer.style.display = 'flex';
        currentCutsceneSceneIndex = 0;
        if (cutsceneTimeoutId) clearTimeout(cutsceneTimeoutId);
        playNextCutsceneScene();
    }

    function playNextCutsceneScene() {
        if (currentCutsceneSceneIndex >= cutsceneScenes.length) {
            endCutscene();
            return;
        }

        const baseScene = cutsceneScenes[currentCutsceneSceneIndex];
        cutsceneTextElem.style.opacity = 0;
        
        let sceneText = baseScene.text;
        let sceneImageSrc = baseScene.image; // Use a variable for the image source
        let sceneDuration = baseScene.duration;

        if (baseScene.image) cutsceneImageElem.style.opacity = 0;


        // Modify cutscene content based on game mode
        if (currentGameMode === 'SECRET_NO_HIT') {
            if (currentCutsceneSceneIndex === 0) { sceneText = "You've discovered Nyanwolf's secret pizza hideout!"; sceneDuration = 3500; }
            if (currentCutsceneSceneIndex === 1) { sceneText = "He sees you eyeing his precious pepperoni prize..."; sceneDuration = 3500; }
            if (currentCutsceneSceneIndex === 2) { sceneText = "Nyanwolf roars: 'DON'T TOUCH MY PIZZA!';" + sceneImageSrc; sceneDuration = 4000; } // Keep original image placeholder for now
            if (currentCutsceneSceneIndex === 3) { 
                endCutscene();
                return;
            }
        }

        // If the base scene image is the default Nyanwolf, update it to the equipped skin
        if (baseScene.image === "/nyanwolf-neutral-no-background.png") {
            const equippedSkin = getEquippedSkin();
            if (equippedSkin && equippedSkin.image) {
                sceneImageSrc = equippedSkin.image;
            }
        }
        
        setTimeout(() => { 
            cutsceneTextElem.textContent = sceneText;
            cutsceneTextElem.style.opacity = 1;
            
            if (sceneImageSrc) {
                cutsceneImageElem.src = sceneImageSrc;
                cutsceneImageElem.style.display = 'block';
                cutsceneImageElem.style.opacity = 1;
            } else {
                cutsceneImageElem.style.display = 'none';
            }
        }, 100);

        cutsceneTimeoutId = setTimeout(() => {
            currentCutsceneSceneIndex++;
            playNextCutsceneScene();
        }, sceneDuration);
    }

    function endCutscene(skipped = false) {
        if (cutsceneTimeoutId) clearTimeout(cutsceneTimeoutId);
        cutsceneContainer.style.display = 'none';
        cutsceneImageElem.style.display = 'none'; 
        if (skipped) {
            // console.log("Cutscene skipped for " + currentGameMode); // Already logged elsewhere or not needed
        }
        
        // Reset charge state before starting game, just in case
        isChargingStinkRay = false;
        if (stinkRayChargeSoundNode) {
            stinkRayChargeSoundNode.stop();
            stinkRayChargeSoundNode = null;
        }
        if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'none';
        if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';

        initGame(currentGameMode);
    }

    async function initGame(gameMode) {
        isGameOver = false;
        isPaused = false;
        replayData = []; // Reset replay data
        pauseScreen.style.display = 'none';
        pauseButton.textContent = 'Pause';
        pauseButton.style.display = 'block';

        cutsceneContainer.style.display = 'none'; 

        if (isTouchDevice && mobileControlsElem) {
            mobileControlsElem.style.display = 'flex'; 
            joystickData = { angle: null, distance: null, force: 0, vector: { x: 0, y: 0 } }; 
        } else if (mobileControlsElem) {
            mobileControlsElem.style.display = 'none';
        }

        score = 0;
        
        player.x = (GAME_WIDTH - PLAYER_WIDTH) / 2;
        player.y = GAME_HEIGHT - PLAYER_HEIGHT - 30; 
        
        // Reset charge state
        isChargingStinkRay = false;
        stinkRayChargeStartTime = 0;
        stinkRayChargeLevel = 0;
        isMobileShooting = false;
        if (stinkRayChargeSoundNode) {
            stinkRayChargeSoundNode.stop();
            stinkRayChargeSoundNode = null;
        }
        if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'none';
        if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';

        // Reset heal item
        if (healItem && healItem.element) {
            healItem.element.remove();
        }
        healItem = null;

        if (gameMode === 'SECRET_NO_HIT') {
            currentPlayerMaxHealth = 1;
            player.health = 1;
            // Keep other hard mode parameters for boss, but nerf homing speed
            currentBossMaxHealth = BOSS_MAX_HEALTH;
            currentBossProjectileDamage = BOSS_PROJECTILE_DAMAGE;
            currentProjectileSpeed = PROJECTILE_SPEED;
            currentHomingProjectileHorizontalSpeed = HOMING_PROJECTILE_HORIZONTAL_SPEED_SECRET_MODE; // Apply nerfed speed
            currentBossAttackCooldownMin = BOSS_ATTACK_COOLDOWN_MIN;
            currentBossAttackCooldownMax = BOSS_ATTACK_COOLDOWN_MAX;
            currentPlayerProjectileDamage = PLAYER_PROJECTILE_DAMAGE; // Player damage remains same
            if (bgm.src !== defaultBgmSrc) {
                bgm.src = defaultBgmSrc;
                bgm.load(); // Ensure the new source is loaded
            }
        } else { // Default 'HARD' mode
            currentPlayerMaxHealth = PLAYER_MAX_HEALTH;
            player.health = currentPlayerMaxHealth;
            currentBossMaxHealth = BOSS_MAX_HEALTH;
            currentBossProjectileDamage = BOSS_PROJECTILE_DAMAGE;
            currentProjectileSpeed = PROJECTILE_SPEED;
            currentHomingProjectileHorizontalSpeed = HOMING_PROJECTILE_HORIZONTAL_SPEED;
            currentBossAttackCooldownMin = BOSS_ATTACK_COOLDOWN_MIN;
            currentBossAttackCooldownMax = BOSS_ATTACK_COOLDOWN_MAX;
            currentPlayerProjectileDamage = PLAYER_PROJECTILE_DAMAGE;
            if (bgm.src !== hardModeBgmSrc) {
                bgm.src = hardModeBgmSrc;
                bgm.load(); // Ensure the new source is loaded
            }
        }
        
        boss.x = (GAME_WIDTH - BOSS_WIDTH) / 2;
        boss.y = BOSS_INITIAL_Y; 
        boss.health = currentBossMaxHealth;
        boss.lastAttackTime = Date.now();
        boss.currentAttackCooldown = currentBossAttackCooldownMin + Math.random() * (currentBossAttackCooldownMax - currentBossAttackCooldownMin);
        boss.dx = BOSS_HORIZONTAL_SPEED * (Math.random() < 0.5 ? 1 : -1); 

        // Reset boss status effects
        isBossStunned = false;
        bossStunEndTime = 0;
        isBossStinkRayInvincible = false;
        bossStinkRayInvincibilityEndTime = 0;

        updateHealthBar(playerHealthBarElem, player.health, currentPlayerMaxHealth, playerHealthLabel, "");
        updateHealthBar(bossHealthBarElem, boss.health, currentBossMaxHealth, bossHealthLabel, "");

        projectiles.forEach(p => p.element.remove());
        projectiles = [];
        playerProjectiles.forEach(p => p.element.remove()); 
        playerProjectiles = [];
        keys = {};
        lastPlayerAttackTime = 0;

        effectsLayer.innerHTML = '';

        playerElem.style.left = player.x + 'px';
        playerElem.style.top = player.y + 'px';
        playerElem.style.display = 'block';

        // Set player skin based on equipped item
        const equippedPlayerSkinItem = shopItems.find(item => item.id === equippedPlayerSkinId);
        if (equippedPlayerSkinItem) {
            if (equippedPlayerSkinItem.id === 'player_skin_yourself') {
                try {
                    const user = await window.websim.getUser();
                    if (user && user.avatar_url) {
                        playerElem.style.backgroundImage = `url('${user.avatar_url}')`;
                    } else {
                        // Fallback to default if user or avatar_url is null
                        playerElem.style.backgroundImage = "url('/Bluecheeses_1_2048x.webp')";
                    }
                } catch (error) {
                    console.error("Error fetching user for avatar skin:", error);
                    playerElem.style.backgroundImage = "url('/Bluecheeses_1_2048x.webp')"; // Fallback on error
                }
            } else if (equippedPlayerSkinItem.id === 'player_skin_rubber_ducky') {
                playerElem.style.backgroundImage = "url('/rubber_ducky_player.png')";
            } else {
                // Default Blue Cheese skin
                playerElem.style.backgroundImage = "url('/Bluecheeses_1_2048x.webp')";
            }
        } else {
            // Fallback if equipped skin not found
            playerElem.style.backgroundImage = "url('/Bluecheeses_1_2048x.webp')";
        }


        // Set boss skin based on equipped item
        const equippedSkin = shopItems.find(item => item.id === equippedBossSkinId);
        if (equippedSkin && equippedSkin.image) {
            bossElem.style.backgroundImage = `url('${equippedSkin.image}')`;
        } else {
            // Fallback to default if something goes wrong (should not happen ideally)
            bossElem.style.backgroundImage = "url('/nyanwolf-neutral-no-background.png')";
        }
        
        bossElem.style.left = boss.x + 'px';
        bossElem.style.top = boss.y + 'px';
        bossElem.style.display = 'block';
        
        // Apply special filters or animations based on skin
        if (equippedSkin && equippedSkin.id === 'nyanwolf_summer') {
            bossElem.style.filter = BOSS_SUMMER_FILTER;
            bossElem.style.animation = 'nyanPulseSummer 2s infinite ease-in-out';
        } else {
            bossElem.style.filter = BOSS_DEFAULT_FILTER; 
            bossElem.style.animation = 'nyanPulse 1.5s infinite ease-in-out';
        }
        bossElem.style.animationPlayState = 'running'; // Ensure animation is running

        // Apply game background
        if (equippedGameBackgroundId === 'game_bg_white') {
            gameArea.style.backgroundColor = 'white';
            gameArea.style.backgroundImage = 'none';
        } else if (equippedGameBackgroundId === 'game_bg_beach') {
            gameArea.style.backgroundImage = "url('/beach_background.png')";
            gameArea.style.backgroundColor = '';
        } else { // Default space background
            gameArea.style.backgroundImage = "url('/game_background.png')";
            gameArea.style.backgroundColor = ''; // Clear background color if any was set
        }

        playerHealthContainerElem.style.display = 'flex'; 
        bossHealthContainerElem.style.display = 'flex'; 

        gameOverTitle.textContent = "NYAN-NIHILATED!";
        gameOverMessage.textContent = "Nyanwolf zips away, leaving a trail of defeat.";
        gameOverScreen.style.color = '#ff00ff'; 
        gameOverTitle.style.color = '#ff00ff';
        gameOverBossImg.style.display = 'block';
        gameOverBossImg.style.borderColor = '#ff00ff';
        gameOverScreen.style.display = 'none';
        
        scoreDisplay.textContent = `Score: ${score}`;
        scoreDisplay.style.display = 'block';

        menuScreen.style.display = 'none';
        gameArea.style.display = 'block';

        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        gameLoopId = requestAnimationFrame(gameLoop);

        if (scoreIntervalId) clearInterval(scoreIntervalId);
        scoreIntervalId = setInterval(() => {
            if (!isGameOver && !isPaused) { 
                score += 10; 
                scoreDisplay.textContent = `Score: ${score}`;
            }
        }, 1000);
        
        bgm.currentTime = 0;
        bgm.volume = 0.25; 
        bgm.play().catch(e => console.warn("BGM autoplay was prevented:", e));

        if (!playerHitBuffer) {
            loadSound('/player_hit.mp3').then(buffer => playerHitBuffer = buffer);
        }
        if (!playerShootBuffer) {
            loadSound('/player_shoot.mp3').then(buffer => playerShootBuffer = buffer);
        }
        if (!stinkRayChargeBuffer) {
            loadSound('/stink_ray_charge.mp3').then(buffer => stinkRayChargeBuffer = buffer);
        }
        if (!stinkRayFireBuffer) {
            loadSound('/stink_ray_fire.mp3').then(buffer => stinkRayFireBuffer = buffer);
        }
        if (!healPickupBuffer) {
            loadSound('/heal_pickup.mp3').then(buffer => healPickupBuffer = buffer);
        }
        if (!waterSplashBuffer) { // Load summer sound
             loadSound('/player_hit.mp3').then(buffer => waterSplashBuffer = buffer); // Re-using player_hit for splash
        }
        // Load shop sounds if not already loaded
        if (!shopEnterBuffer) loadSound('/shop_enter.mp3').then(buffer => shopEnterBuffer = buffer);
        if (!shopPurchaseBuffer) loadSound('/shop_purchase.mp3').then(buffer => shopPurchaseBuffer = buffer);
        if (!shopErrorBuffer) loadSound('/shop_error.mp3').then(buffer => shopErrorBuffer = buffer);
        if (!shopEquipBuffer) loadSound('/shop_equip.mp3').then(buffer => shopEquipBuffer = buffer);

    }

    function updatePlayer() {
        if (isGameOver || isPaused) return;
        let pdx = 0; 
        let pdy = 0; 

        const currentSpeed = isChargingStinkRay ? PLAYER_SPEED * PLAYER_SPEED_CHARGING_MULTIPLIER : PLAYER_SPEED;

        if (isTouchDevice && joystickData.force > JOYSTICK_FORCE_THRESHOLD) {
            pdx = joystickData.vector.x * currentSpeed;
            pdy = joystickData.vector.y * currentSpeed * -1; 
        } else {
            if (keys['ArrowLeft'] || keys['a']) pdx -= currentSpeed;
            if (keys['ArrowRight'] || keys['d']) pdx += currentSpeed;
            if (keys['ArrowUp'] || keys['w']) pdy -= currentSpeed;
            if (keys['ArrowDown'] || keys['s']) pdy += currentSpeed;
        }

        let oldX = player.x;
        let oldY = player.y;

        player.x += pdx;
        player.x = Math.max(0, Math.min(player.x, GAME_WIDTH - PLAYER_WIDTH));
        let playerRectAfterXMove = { x: player.x, y: oldY, width: player.width, height: player.height };
        if (checkCollision(playerRectAfterXMove, boss)) {
            player.x = oldX; 
        }

        player.y += pdy;
        player.y = Math.max(0, Math.min(player.y, GAME_HEIGHT - PLAYER_HEIGHT));

        if (player.y < BARRIER_Y_POSITION) {
            player.y = BARRIER_Y_POSITION;
        }

        let playerRectAfterYMove = { x: player.x, y: player.y, width: player.width, height: player.height };
        if (checkCollision(playerRectAfterYMove, boss)) {
            player.y = oldY; 
        }

        playerElem.style.left = player.x + 'px';
        playerElem.style.top = player.y + 'px';

        // Check for heal item collection
        if (healItem && checkCollision(player, healItem)) {
            if (healItem.type === 'apple') {
                player.health = currentPlayerMaxHealth;
            } else { // 'cheese'
                const healAmount = Math.floor(Math.random() * (HEAL_AMOUNT_MAX - HEAL_AMOUNT_MIN + 1)) + HEAL_AMOUNT_MIN;
                player.health = Math.min(currentPlayerMaxHealth, player.health + healAmount);
            }
            
            updateHealthBar(playerHealthBarElem, player.health, currentPlayerMaxHealth, playerHealthLabel, "");
            playSound(healPickupBuffer);
            if (healItem.element) healItem.element.remove();
            healItem = null;
            // No need to reset lastHealSpawnTime here, it will naturally spawn after interval if needed
        }
    }

    function updateBossMovement() {
        if (isGameOver || isPaused || isBossStunned) return;

        boss.x += boss.dx;

        if (boss.x <= 0) {
            boss.x = 0;
            boss.dx *= -1; 
        } else if (boss.x + boss.width >= GAME_WIDTH) {
            boss.x = GAME_WIDTH - boss.width;
            boss.dx *= -1; 
        }

        bossElem.style.left = boss.x + 'px';
    }

    function createProjectile(x, y, type = 'straight', angleOffset = 0) {
        const pElem = document.createElement('div');
        pElem.className = 'projectile'; // Base class for common styling/identification
        const gameWorld = document.getElementById('game-world-layer');

        let pWidth, pHeight, pImage;
        const equippedSkinId = getEquippedSkin().id;

        // Summer event projectile overrides others
        if (equippedSkinId === 'nyanwolf_summer') {
            pWidth = WATER_BALLOON_WIDTH;
            pHeight = WATER_BALLOON_HEIGHT;
            pImage = "url('/water_balloon.png')";
            pElem.classList.add('water-projectile'); // Add specific class
        } else if (equippedSkinId === 'nyanwolf_slop') {
            pWidth = SLOP_PROJECTILE_WIDTH;
            pHeight = SLOP_PROJECTILE_HEIGHT;
            pImage = "url('/cooltext483247959599869.gif')";
            pElem.style.backgroundSize = 'contain'; // Ensure the GIF fits well
            pElem.style.backgroundColor = 'transparent'; // Good practice for GIFs that might have transparency
            // .projectile class already has no-repeat and center position
        } else { // Default projectile
            pWidth = PROJECTILE_BASE_WIDTH;
            pHeight = PROJECTILE_BASE_HEIGHT;
            pImage = "url('/Pizza-LP-24-Pepperoni_Copy-1.png')";
        }
        
        pElem.style.width = `${pWidth}px`;
        pElem.style.height = `${pHeight}px`;
        pElem.style.backgroundImage = pImage;
        
        // Ensure background properties from CSS are not accidentally overridden if not intended
        // The .projectile class should handle 'background-repeat: no-repeat;' and 'background-position: center;'

        if (gameWorld) gameWorld.appendChild(pElem); 

        const projectile = {
            element: pElem,
            x: x - pWidth / 2, // Use the actual pWidth for centering
            y: y,
            width: pWidth,
            height: pHeight,
            type: type, // 'straight', 'homing', 'spread' for boss
            dx: Math.sin(angleOffset) * currentProjectileSpeed, 
            dy: Math.cos(angleOffset) * currentProjectileSpeed  
        };
        if (type === 'straight' || type === 'homing') {
            projectile.dx = 0; 
            projectile.dy = currentProjectileSpeed; 
        }

        projectiles.push(projectile);
    }

    function createPlayerProjectile(type = 'normal') {
        const pElem = document.createElement('div');
        let pWidth, pHeight, pSpeed, pDamage;
        const gameWorld = document.getElementById('game-world-layer');

        if (type === 'stink_ray') {
            pElem.className = 'stink-ray-projectile';
            pWidth = STINK_RAY_PROJECTILE_WIDTH;
            pHeight = STINK_RAY_PROJECTILE_HEIGHT;
            pSpeed = STINK_RAY_PROJECTILE_SPEED; // This will be used by updatePlayerProjectiles
            pDamage = STINK_RAY_DAMAGE;
            // Stink Ray sound is played on fire, not creation here
        } else { // normal
            pElem.className = 'player-projectile';
            pWidth = PLAYER_PROJECTILE_WIDTH;
            pHeight = PLAYER_PROJECTILE_HEIGHT;
            pSpeed = PLAYER_PROJECTILE_SPEED;
            pDamage = currentPlayerProjectileDamage;
            playSound(playerShootBuffer);
        }
        
        pElem.style.width = `${pWidth}px`;
        pElem.style.height = `${pHeight}px`;
        
        const initialX = player.x + player.width / 2 - pWidth / 2;
        const initialY = player.y - pHeight; 

        pElem.style.left = initialX + 'px'; 
        pElem.style.top = initialY + 'px';  

        if(gameWorld) gameWorld.appendChild(pElem); 

        const projectile = {
            element: pElem,
            x: initialX, 
            y: initialY, 
            width: pWidth,
            height: pHeight,
            type: type,
            speed: pSpeed,
            damage: pDamage
        };
        playerProjectiles.push(projectile);
    }

    function updateProjectiles() {
        if (isGameOver || isPaused) return; 
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];

            if (p.type === 'homing') {
                const playerCenterX = player.x + player.width / 2;
                const projectileCenterX = p.x + p.width / 2;
                if (playerCenterX < projectileCenterX) {
                    p.dx = -currentHomingProjectileHorizontalSpeed; 
                } else if (playerCenterX > projectileCenterX) {
                    p.dx = currentHomingProjectileHorizontalSpeed; 
                } else {
                    p.dx = 0;
                }
                p.x += p.dx;
                p.y += currentProjectileSpeed; 
            } else { 
                 p.x += p.dx; 
                 p.y += p.dy;
            }

            p.element.style.left = p.x + 'px';
            p.element.style.top = p.y + 'px';

            if (p.y > GAME_HEIGHT || p.x < -p.width || p.x > GAME_WIDTH) {
                p.element.remove();
                projectiles.splice(i, 1);
            } else {
                if (checkCollision(player, p)) {
                    createHitSpark(player.x + player.width / 2, p.y + p.height / 2); 
                    p.element.remove();
                    projectiles.splice(i, 1);
                    
                    player.health -= currentBossProjectileDamage; 
                    updateHealthBar(playerHealthBarElem, player.health, currentPlayerMaxHealth, playerHealthLabel, "");

                    playSound(playerHitBuffer);

                    if (player.health <= 0) {
                        gameOver(false); 
                    }
                    break; 
                }
            }
        }
    }

    function updatePlayerProjectiles() {
        if (isGameOver || isPaused) return; 
        for (let i = playerProjectiles.length - 1; i >= 0; i--) {
            const p = playerProjectiles[i];
            p.y -= p.speed; // Use projectile's own speed
            p.element.style.top = p.y + 'px';

            if (checkCollision(p, boss)) {
                let projectileEffectiveDamage = p.damage;
                let shouldApplyStun = false;

                if (p.type === 'stink_ray') {
                    if (!isBossStinkRayInvincible) {
                        shouldApplyStun = true;
                        // projectileEffectiveDamage is already STINK_RAY_DAMAGE for this type
                    } else {
                        projectileEffectiveDamage = 0; // Stink ray hits an invincible boss, no damage
                    }
                }
                
                // Remove projectile regardless of damage outcome, as it collided
                p.element.remove();
                playerProjectiles.splice(i, 1);

                if (projectileEffectiveDamage > 0) {
                    boss.health -= projectileEffectiveDamage;
                    updateHealthBar(bossHealthBarElem, boss.health, currentBossMaxHealth, bossHealthLabel, "");
                    createHitSpark(p.x + p.width / 2, p.y); 
                    
                    // Apply hit flash visual
                    if (!isBossStunned) { // Don't apply hit flash if already stunned, stun visual takes precedence
                        const currentEquippedSkin = getEquippedSkin();
                        if (currentEquippedSkin.id === 'nyanwolf_summer') {
                            bossElem.style.filter = BOSS_SUMMER_FILTER;
                        } else {
                            bossElem.style.filter = 'brightness(2.0) contrast(1.5) drop-shadow(0 0 15px #ff00ff) drop-shadow(0 0 8px #00ff7f)';
                        }
                    }

                    if (shouldApplyStun) {
                        isBossStunned = true;
                        bossStunEndTime = Date.now() + STUN_DURATION;
                        
                        isBossStinkRayInvincible = true;
                        // Invincibility period starts now and lasts for stun duration + specified invincibility duration
                        bossStinkRayInvincibilityEndTime = bossStunEndTime + STINK_RAY_INVINCIBILITY_DURATION;
                        
                        bossElem.style.animationPlayState = 'paused'; // Pause animation
                        
                        // Set stun visual (can be immediate or after hit flash, depends on preference)
                        // For now, apply stun visual, hit flash might briefly override if stun visual is set before timeout
                        bossElem.style.filter = BOSS_STUN_FILTER; 
                        
                        // If hit flash was applied, it will revert. Stun visual should persist.
                        // The timeout below is mainly for non-stun hits.
                        // If a stun is applied, updateBossStatusEffects will handle reverting the filter when stun ends.
                    } else if (!isBossStunned) { // Not a stun hit, and boss is not currently stunned
                        // Reset to normal filter after hit flash
                        setTimeout(() => {
                            if (!isGameOver && !isBossStunned) { // Ensure boss hasn't become stunned by another effect
                                const currentEquippedSkin = getEquippedSkin();
                                if (currentEquippedSkin.id === 'nyanwolf_summer') {
                                    bossElem.style.filter = BOSS_SUMMER_FILTER;
                                } else {
                                    bossElem.style.filter = ''; // Clear stun filter, let animation take over
                                }
                            }
                        }, 120); // Duration of hit flash
                    }
                }
                // if projectileEffectiveDamage is 0 (e.g. Stink Ray on invincible boss), nothing happens to boss health/visuals from this projectile.

                if (boss.health <= 0) {
                    gameOver(true); 
                }
                continue; 
            }

            if (p.y < -p.height) { 
                p.element.remove();
                playerProjectiles.splice(i, 1);
            }
        }
    }

    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    function bossAttack() {
        if (isGameOver || isPaused || isBossStunned) return; 
        const currentTime = Date.now();
        if (currentTime - boss.lastAttackTime > boss.currentAttackCooldown) {
            boss.lastAttackTime = currentTime;
            boss.currentAttackCooldown = currentBossAttackCooldownMin + Math.random() * (currentBossAttackCooldownMax - currentBossAttackCooldownMin);

            const attackType = Math.random();
            const bossCenterX = boss.x + boss.width / 2;
            const bossBottomY = boss.y + boss.height;

            // Only "Hard" mode attack patterns remain as default
            if (attackType < 0.25) { 
                createProjectile(bossCenterX, bossBottomY, 'straight');
            } else if (attackType < 0.55) { 
                createProjectile(bossCenterX, bossBottomY, 'homing');
            } else if (attackType < 0.85) { 
                createProjectile(bossCenterX, bossBottomY, 'spread', 0); 
                createProjectile(bossCenterX, bossBottomY, 'spread', -Math.PI / 8); 
                createProjectile(bossCenterX, bossBottomY, 'spread', Math.PI / 8);  
                createProjectile(bossCenterX, bossBottomY, 'spread', -Math.PI / 16); 
                createProjectile(bossCenterX, bossBottomY, 'spread', Math.PI / 16);  
            } else { 
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        if (!isGameOver && !isPaused) createProjectile(bossCenterX, bossBottomY, 'straight');
                    }, i * 180); 
                }
            }
        }
    }

    function gameOver(playerWon) {
        isGameOver = true;
        isPaused = false; 
        pauseScreen.style.display = 'none'; 
        pauseButton.style.display = 'none'; 

        // Reset charge state on game over
        isChargingStinkRay = false;
        if (stinkRayChargeSoundNode) {
            stinkRayChargeSoundNode.stop();
            stinkRayChargeSoundNode = null;
        }
        if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'none';
        if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';

        if (isTouchDevice && mobileControlsElem) {
            mobileControlsElem.style.display = 'none';
            joystickData = { angle: null, distance: null, force: 0, vector: { x: 0, y: 0 } }; 
        }

        cancelAnimationFrame(gameLoopId);
        clearInterval(scoreIntervalId);
        if (bgm && !bgm.paused) bgm.pause(); 
        
        playerElem.style.display = 'none';
        bossElem.style.display = 'none';
        projectiles.forEach(p => p.element.remove());
        playerProjectiles.forEach(p => p.element.remove());
        projectiles = [];
        playerProjectiles = [];

        scoreDisplay.style.display = 'none'; 
        playerHealthContainerElem.style.display = 'none';
        bossHealthContainerElem.style.display = 'none';
        pauseButton.style.display = 'none';
        pauseScreen.style.display = 'none';
        gameArea.style.display = 'none';
        shopScreen.style.display = 'none'; // Ensure shop is hidden
        strategyBookModal.style.display = 'none'; // Ensure strategy book modal is hidden

        // Enable replay button
        const watchReplayBtn = document.getElementById('watch-replay-button');
        if (watchReplayBtn) {
            watchReplayBtn.style.display = 'block';
            watchReplayBtn.onclick = () => {
                const modal = document.getElementById('replay-modal');
                modal.style.display = 'flex';
                
                // Determine static assets for replay
                let bossProjImg = '/Pizza-LP-24-Pepperoni_Copy-1.png';
                const equippedBossSkin = getEquippedSkin();
                if (equippedBossSkin.id === 'nyanwolf_summer') bossProjImg = '/water_balloon.png';
                else if (equippedBossSkin.id === 'nyanwolf_slop') bossProjImg = '/cooltext483247959599869.gif';

                let bgImg = '/game_background.png';
                if (equippedGameBackgroundId === 'game_bg_white') bgImg = 'white';
                else if (equippedGameBackgroundId === 'game_bg_beach') bgImg = '/beach_background.png';

                // Get player skin image
                let playerSkinImg = '/Bluecheeses_1_2048x.webp';
                // We need to resolve the current player image URL.
                // Since playerElem.style.backgroundImage is set, we can try to extract it,
                // or replicate logic. Replicating logic is safer.
                const equippedPlayerSkin = shopItems.find(item => item.id === equippedPlayerSkinId);
                if (equippedPlayerSkin) {
                   if (equippedPlayerSkin.id === 'player_skin_yourself') {
                       // We can't easily get the user avatar async here without awaiting, 
                       // but playerElem already has it.
                       const bgStyle = playerElem.style.backgroundImage;
                       if (bgStyle && bgStyle.startsWith('url(')) {
                           playerSkinImg = bgStyle.slice(5, -2); // Remove url(" and ")
                       }
                   } else if (equippedPlayerSkin.image) {
                       // Special case for rubber ducky which uses a different file for the ship than the icon
                       if (equippedPlayerSkin.id === 'player_skin_rubber_ducky') playerSkinImg = '/rubber_ducky_player.png';
                       else playerSkinImg = equippedPlayerSkin.image;
                   }
                }

                // Actually, Blue Cheese default logic:
                if (equippedPlayerSkinId === 'player_skin_blue_cheese_default') playerSkinImg = '/Bluecheeses_1_2048x.webp';

                const staticData = {
                    playerSkin: playerSkinImg,
                    bossSkin: equippedBossSkin.image || '/nyanwolf-neutral-no-background.png',
                    background: bgImg,
                    bossProjectileImage: bossProjImg
                };
                
                mountReplay('replay-player-root', replayData, staticData);
            };
        }

        // Close replay button
        const closeReplayBtn = document.getElementById('close-replay-button');
        if (closeReplayBtn) {
            closeReplayBtn.onclick = () => {
                document.getElementById('replay-modal').style.display = 'none';
            };
        }

        if (playerWon) {
            if (currentGameMode === 'HARD') {
                localStorage.setItem('hardModeBeaten', 'true');
                hardModeBeaten = true; 
                updateMenuButtonsVisibility(); 
            }

            if (currentGameMode === 'SECRET_NO_HIT') {
                gameOverTitle.textContent = "PIZZA ACQUIRED!";
                let secretWinMessage = "Nyanwolf wails as you make off with his delicious treasure! (+10 Tokens, +1 Pizza)";
                if (!strategyBookUnlocked) {
                    strategyBookUnlocked = true;
                    secretWinMessage = "Nyanwolf wails! Pizza acquired & Strategy Book UNLOCKED! (+10 Tokens, +1 Pizza)";
                }
                gameOverMessage.textContent = secretWinMessage;
                gameOverTitle.style.color = '#ffdd57'; 
                gameOverScreen.style.color = '#ffdd57';
                gameOverBossImg.style.display = 'none'; // No boss image on secret win
                playerTokens += 10;
                playerPizzas += 1;
                savePlayerData();
                updateCurrencyDisplay();
            } else { // Default win messages for HARD mode
                 gameOverTitle.textContent = "NYANWOLF GROUNDED!";
                 gameOverMessage.textContent = "The internet is safe... from excessive rainbows, for now! (+1 Token)";
                 gameOverTitle.style.color = '#28a745';
                 gameOverScreen.style.color = '#28a745';
                 gameOverBossImg.style.display = 'none'; // No boss image on normal win
                 playerTokens += 1;
                 savePlayerData();
                 updateCurrencyDisplay();
            }
        } else { // Player Lost
            playSound(playerHitBuffer);
            const equippedSkinForGameOver = getEquippedSkin();

            if (equippedSkinForGameOver && equippedSkinForGameOver.image) {
                gameOverBossImg.src = equippedSkinForGameOver.image;
            } else {
                gameOverBossImg.src = "/nyanwolf-neutral-no-background.png"; // Fallback
            }

            if (currentGameMode === 'SECRET_NO_HIT') {
                gameOverTitle.textContent = "PIZZA DEFENDED!";
                gameOverMessage.textContent = "Nyanwolf fiercely protects his pizza. Not today, thief!";
                gameOverTitle.style.color = '#ff4136'; 
                gameOverScreen.style.color = '#ff4136';
                gameOverBossImg.style.borderColor = '#ff4136';
            } else { // Default loss messages for HARD mode
                gameOverTitle.textContent = "NYAN-NIHILATED!";
                gameOverMessage.textContent = "Nyanwolf zips away, leaving a trail of defeat.";
                gameOverTitle.style.color = '#ff00ff';
                gameOverScreen.style.color = '#ff00ff';
                gameOverBossImg.style.borderColor = '#ff00ff';
            }
            gameOverBossImg.style.display = 'block'; 
        }
        gameOverScreen.style.display = 'flex';
        updateStaticBossImages(); // Update menu image in case player goes back
    }

    restartButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        resetGameToMenu(); 
    });
    
    // Simplified: only one way to start the game
    startGameButton.addEventListener('click', () => {
        currentGameMode = 'HARD';
        startCutscene();
    });

    if (secretModeButton) {
        secretModeButton.addEventListener('click', () => {
            currentGameMode = 'SECRET_NO_HIT';
            startCutscene();
        });
    }

    shopButton.addEventListener('click', () => {
        menuScreen.style.display = 'none';
        shopScreen.style.display = 'flex';
        playSound(shopEnterBuffer);
        loadPlayerData(); // Ensure currency and items are up-to-date
        renderShopItems();
        shopMessageArea.textContent = ''; // Clear previous messages
        shopMessageArea.className = 'shop-message'; // Reset class
    });

    shopBackToMenuButton.addEventListener('click', () => {
        shopScreen.style.display = 'none';
        menuScreen.style.display = 'flex';
        resetToDefaultMenu(); // Reactivate default theme when going back to menu
        updateMenuButtonsVisibility(); // In case any progress related to shop unlocks menu items
        updateStaticBossImages(); // Update menu boss image
    });

    skipCutsceneButton.addEventListener('click', () => endCutscene(true));

    pauseButton.addEventListener('click', togglePauseGame);
    resumeButton.addEventListener('click', togglePauseGame); 
    backToMenuButton.addEventListener('click', () => { 
        if (isPaused) togglePauseGame(); // Ensure game is unpaused before resetting
        resetGameToMenu();
    });

    strategyBookCloseButton.addEventListener('click', () => {
        strategyBookModal.style.display = 'none';
    });

    strategyBookMenuButton.addEventListener('click', () => {
        if (strategyBookUnlocked) {
            openStrategyGuideModal();
        } else {
            // This case should ideally not happen if the button is hidden, but as a fallback
            // Using alert here as shop message area might not be visible
            alert("Strategy Book is locked. Beat 'DON'T TOUCH MY PIZZA' mode to unlock it!");
        }
    });

    progressResetButton.addEventListener('click', () => {
        const warning1 = "WARNING! THIS WILL RESET YOUR PROGRESS!";
        const warning2 = "ARE YOU SURE YOU WANT TO RESET YOUR PROGRESS?";
        const warning3 = "THIS WILL WIPE YOUR PROGRESS FOREVER! ARE YOU SURE YOU WILL HAVE NO REGRETS?";

        if (window.confirm(warning1)) {
            if (window.confirm(warning2)) {
                if (window.confirm(warning3)) {
                    localStorage.removeItem('hardModeBeaten');
                    localStorage.removeItem('playerTokens');
                    localStorage.removeItem('playerPizzas');
                    localStorage.removeItem('purchasedShopItemIds');
                    localStorage.removeItem('equippedBossSkinId');
                    localStorage.removeItem('equippedGameBackgroundId'); // Reset equipped background
                    localStorage.removeItem('equippedPlayerSkinId'); // Reset equipped player skin
                    localStorage.removeItem('strategyBookUnlocked'); // Reset strategy book
                    hardModeBeaten = false;
                    playerTokens = 0;
                    playerPizzas = 0;
                    purchasedShopItemIds = [];
                    equippedBossSkinId = 'nyanwolf_default';
                    equippedGameBackgroundId = 'default_space'; // Reset to default
                    equippedPlayerSkinId = 'player_skin_blue_cheese_default'; // Reset to default
                    strategyBookUnlocked = false; // Reset state variable
                    updateMenuButtonsVisibility();
                    updateCurrencyDisplay(); // Update display after reset
                    updateStaticBossImages(); // Reset menu image to default
                    alert("Progress has been reset.");
                } else {
                    alert("Progress reset cancelled. No regrets indeed!");
                }
            } else {
                alert("Progress reset cancelled.");
            }
        } else {
            alert("Progress reset cancelled.");
        }
    });

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase(); 

        if (key === 'p') {
            e.preventDefault(); 
            togglePauseGame();
            return; 
        }
        
        if (isPaused || isGameOver) return; 

        keys[e.key.toLowerCase()] = true; 
        keys[e.key] = true; 
        
        if (e.key === ' ' || e.code === 'Space') { 
            e.preventDefault(); 
            // Fire normal projectile directly on spacebar press if cooldown allows
            // Player is not slowed down for this.
            if (!isPaused && !isGameOver && Date.now() - lastPlayerAttackTime > PLAYER_ATTACK_COOLDOWN) {
                createPlayerProjectile('normal');
                lastPlayerAttackTime = Date.now();
            }
        } else if (key === 'e') { // 'e' key for charging Stink Ray
            e.preventDefault();
            if (!isChargingStinkRay && !isPaused && !isGameOver) {
                isChargingStinkRay = true;
                stinkRayChargeStartTime = Date.now();
                stinkRayChargeLevel = 0;
                if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'flex';
                if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';

                if (stinkRayChargeBuffer && audioContext) {
                    if (stinkRayChargeSoundNode) stinkRayChargeSoundNode.stop();
                    stinkRayChargeSoundNode = playSound(stinkRayChargeBuffer, true);
                }
            }
        }

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "e", "E"].includes(e.key)) {
            e.preventDefault();
        }
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
        keys[e.key] = false;
        const key = e.key.toLowerCase();

        // Spacebar keyup no longer handles firing logic, it's on keydown for immediate fire.
        // isChargingStinkRay is not set by spacebar anymore.

        if (key === 'e' && !isPaused && !isGameOver) { // 'e' key release for Stink Ray
            if (isChargingStinkRay) {
                isChargingStinkRay = false;
                if (stinkRayChargeSoundNode) {
                    stinkRayChargeSoundNode.stop();
                    stinkRayChargeSoundNode = null;
                }
                if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'none';

                const chargeDuration = Date.now() - stinkRayChargeStartTime;

                if (chargeDuration >= STINK_RAY_CHARGE_TIME) { // Fully charged
                    createPlayerProjectile('stink_ray');
                    playSound(stinkRayFireBuffer);
                    lastPlayerAttackTime = Date.now(); // Stink Ray also respects/resets cooldown
                } 
                // Else: released 'e' early, Stink Ray doesn't fire. No fallback to normal shot.
                
                stinkRayChargeLevel = 0;
                if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';
            }
        }
    });

    function createHealItem() {
        if (healItem) return; // Should not happen if logic is correct, but as a safeguard
        const gameWorld = document.getElementById('game-world-layer');
        if (!gameWorld) return;

        const healElem = document.createElement('div');
        healElem.className = 'heal-item';
        healElem.style.width = `${HEAL_ITEM_WIDTH}px`;
        healElem.style.height = `${HEAL_ITEM_HEIGHT}px`;
        
        const isApple = Math.random() < APPLE_HEAL_CHANCE;
        let itemType;
        
        if (isApple) {
            itemType = 'apple';
            healElem.style.backgroundImage = "url('/Aple.webp')";
             // Optional: adjust filter for apple if golden glow is not fitting
            // healElem.style.filter = "drop-shadow(0 0 8px #33dd33) drop-shadow(0 0 15px #009900)"; // Example green glow
        } else {
            itemType = 'cheese';
            healElem.style.backgroundImage = "url('/golden_cheese_heal.png')";
            healElem.style.filter = "drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 15px #ffaa00)"; // Ensure cheese gets golden glow
        }

        // Spawn randomly on player's side of the game, below the barrier
        const spawnableWidth = GAME_WIDTH - HEAL_ITEM_WIDTH;
        const spawnableHeight = GAME_HEIGHT - BARRIER_Y_POSITION - HEAL_ITEM_HEIGHT;

        const randomX = Math.random() * spawnableWidth;
        const randomY = BARRIER_Y_POSITION + (Math.random() * spawnableHeight);

        healItem = {
            element: healElem,
            x: randomX,
            y: Math.max(BARRIER_Y_POSITION, Math.min(randomY, GAME_HEIGHT - HEAL_ITEM_HEIGHT)), // Ensure it's within bounds
            width: HEAL_ITEM_WIDTH,
            height: HEAL_ITEM_HEIGHT,
            type: itemType 
        };

        healItem.element.style.left = healItem.x + 'px';
        healItem.element.style.top = healItem.y + 'px';
        gameWorld.appendChild(healItem.element);
    }

    function updateHealItemLogic() {
        if (isGameOver || isPaused) return;

        if (!healItem && player.health < currentPlayerMaxHealth) {
            if (Date.now() - lastHealSpawnTime > HEAL_SPAWN_INTERVAL) {
                createHealItem();
                lastHealSpawnTime = Date.now(); // Reset timer after a heal item is created
            }
        }
    }

    // --- Shop Functions ---
    function loadPlayerData() {
        playerTokens = parseInt(localStorage.getItem('playerTokens')) || 0;
        playerPizzas = parseInt(localStorage.getItem('playerPizzas')) || 0;
        const storedPurchasedItems = localStorage.getItem('purchasedShopItemIds');
        purchasedShopItemIds = storedPurchasedItems ? JSON.parse(storedPurchasedItems) : [];
        equippedBossSkinId = localStorage.getItem('equippedBossSkinId') || 'nyanwolf_default';
        equippedGameBackgroundId = localStorage.getItem('equippedGameBackgroundId') || 'default_space'; // Load equipped background
        equippedPlayerSkinId = localStorage.getItem('equippedPlayerSkinId') || 'player_skin_blue_cheese_default'; // Load equipped player skin
        strategyBookUnlocked = localStorage.getItem('strategyBookUnlocked') === 'true'; // Load strategy book status

        // Ensure default skin is always "purchased" conceptually
        if (!purchasedShopItemIds.includes('nyanwolf_default')) {
            purchasedShopItemIds.push('nyanwolf_default');
        }
        // Ensure default background is always "purchased" (conceptually, for equip logic)
        if (!purchasedShopItemIds.includes('default_space')) {
            purchasedShopItemIds.push('default_space');
        }
        // Ensure default player skin is always "purchased"
        if (!purchasedShopItemIds.includes('player_skin_blue_cheese_default')) {
            purchasedShopItemIds.push('player_skin_blue_cheese_default');
        }
        updateCurrencyDisplay();
    }

    function savePlayerData() {
        localStorage.setItem('playerTokens', playerTokens.toString());
        localStorage.setItem('playerPizzas', playerPizzas.toString());
        localStorage.setItem('purchasedShopItemIds', JSON.stringify(purchasedShopItemIds));
        localStorage.setItem('equippedBossSkinId', equippedBossSkinId);
        localStorage.setItem('equippedGameBackgroundId', equippedGameBackgroundId); // Save equipped background
        localStorage.setItem('equippedPlayerSkinId', equippedPlayerSkinId); // Save equipped player skin
        localStorage.setItem('strategyBookUnlocked', strategyBookUnlocked.toString()); // Save strategy book status
    }

    function updateCurrencyDisplay() {
        if (tokenCountDisplay) tokenCountDisplay.textContent = `Tokens: ${playerTokens}`;
        if (pizzaCountDisplay) pizzaCountDisplay.textContent = `Pizzas: ${playerPizzas}`;
    }

    function renderShopItems() {
        if (!shopItemsContainer) return;
        shopItemsContainer.innerHTML = ''; // Clear existing items

        shopItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';

            if (item.event === 'summer') {
                itemDiv.classList.add('summer-event-item');
            }

            const itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.name;
            itemImage.className = 'shop-item-image';
            // Add a border to the white background icon so it's visible in the shop
            if (item.id === 'game_bg_white') {
                itemImage.style.border = '1px solid #cccccc';
                itemImage.style.backgroundColor = '#f0f0f0'; // Slightly off-white bg for the image itself if it's transparent
            }
            // Mafioso skin specific styling if needed (e.g. if image is too wide/tall naturally)
            // if (item.id === 'nyanwolf_mafioso') {
            //    itemImage.style.objectFit = 'contain'; // or 'cover' depending on desired look
            // }

            const itemName = document.createElement('h3');
            itemName.className = 'shop-item-name';
            itemName.textContent = item.name;

            const itemDescription = document.createElement('p');
            itemDescription.className = 'shop-item-description';
            itemDescription.textContent = item.description;
            
            const itemCost = document.createElement('div');
            itemCost.className = 'shop-item-cost';
            let costText = '';
            if (item.cost_token > 0) {
                costText += `${item.cost_token} <img src="/token.png" class="currency-icon" alt="Token"> `;
            }
            if (item.cost_pizza > 0) {
                costText += `${item.cost_pizza} <img src="/pizza_icon.png" class="currency-icon" alt="Pizza">`;
            }
            // Free if no cost AND not already owned AND not a special default item (like nyanwolf_default)
            if (costText === '' && !(purchasedShopItemIds.includes(item.id)) && item.cost_token === 0 && item.cost_pizza === 0 && 
                item.id !== 'nyanwolf_default' && item.id !== 'default_space' && item.id !== 'player_skin_blue_cheese_default') { // Added other defaults
                 costText = 'Free!';
            } else if (purchasedShopItemIds.includes(item.id) || (item.cost_token === 0 && item.cost_pizza === 0)) {
                // No cost display if owned OR if it's a free item that's inherently free (like default skin)
                costText = ''; 
            }
            itemCost.innerHTML = costText;


            const actionButton = document.createElement('button');
            actionButton.className = 'shop-item-button';

            actionButton.classList.remove('buy', 'equip', 'equipped', 'locked', 'view-guide'); // Clear previous classes

            let isEquipped = false;
            if (item.type === 'boss_skin' && equippedBossSkinId === item.id) {
                isEquipped = true;
            } else if (item.type === 'game_background' && equippedGameBackgroundId === item.id) {
                isEquipped = true;
            } else if (item.type === 'player_skin' && equippedPlayerSkinId === item.id) {
                isEquipped = true;
            }

            if (item.type === 'collectible' && item.id === 'strategy_book') {
                if (strategyBookUnlocked) {
                    actionButton.textContent = 'View Guide';
                    actionButton.classList.add('view-guide'); 
                    actionButton.disabled = false;
                    actionButton.onclick = () => viewStrategyBook();
                    itemCost.innerHTML = '<span style="color: #28a745; font-family: \'Press Start 2P\', cursive; font-size: 12px;">Unlocked!</span>';
                    itemImage.style.filter = 'none'; 
                } else {
                    actionButton.textContent = 'Locked';
                    actionButton.classList.add('locked'); 
                    actionButton.disabled = true;
                    itemCost.innerHTML = `<span style="color: #ff4136; font-family: 'Press Start 2P', cursive; font-size: 10px;">Beat 'DON'T TOUCH MY PIZZA' mode</span>`;
                    itemImage.style.filter = 'grayscale(80%) brightness(0.6)';
                }
            } else if (isEquipped) {
                actionButton.textContent = 'Equipped';
                actionButton.classList.add('equipped');
                actionButton.disabled = true;
            } else if (purchasedShopItemIds.includes(item.id)) { // Item is owned but not equipped
                actionButton.textContent = 'Equip';
                actionButton.classList.add('equip');
                actionButton.disabled = false;
                if (item.type === 'boss_skin') {
                    actionButton.onclick = () => equipBossSkin(item.id);
                } else if (item.type === 'game_background') {
                    actionButton.onclick = () => equipGameBackground(item.id);
                } else if (item.type === 'player_skin') {
                    actionButton.onclick = () => equipPlayerSkin(item.id);
                }
            } else { // Item is not owned
                actionButton.textContent = 'Buy';
                actionButton.classList.add('buy');
                actionButton.disabled = (playerTokens < item.cost_token || playerPizzas < item.cost_pizza);
                actionButton.onclick = () => buyShopItem(item.id);
            }
            
            itemDiv.appendChild(itemImage);
            itemDiv.appendChild(itemName);
            itemDiv.appendChild(itemDescription);
            if (costText !== '') itemDiv.appendChild(itemCost); // Only show cost if applicable
            itemDiv.appendChild(actionButton);
            shopItemsContainer.appendChild(itemDiv);
        });
    }

    function buyShopItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            displayShopMessage('Item not found!', true);
            playSound(shopErrorBuffer);
            return;
        }

        if (purchasedShopItemIds.includes(itemId)) {
            displayShopMessage('You already own this item!', true);
            playSound(shopErrorBuffer);
            return;
        }

        if (playerTokens < item.cost_token || playerPizzas < item.cost_pizza) {
            displayShopMessage('Not enough currency!', true);
            playSound(shopErrorBuffer);
            return;
        }

        playerTokens -= item.cost_token;
        playerPizzas -= item.cost_pizza;
        purchasedShopItemIds.push(itemId);

        savePlayerData();
        updateCurrencyDisplay();
        renderShopItems(); // Re-render to update button states
        displayShopMessage(`${item.name} purchased!`, false);
        playSound(shopPurchaseBuffer);
    }

    function equipBossSkin(skinId) {
        const item = shopItems.find(i => i.id === skinId);
        if (!item || !purchasedShopItemIds.includes(skinId)) {
            displayShopMessage('Cannot equip skin!', true);
            playSound(shopErrorBuffer);
            return;
        }

        equippedBossSkinId = skinId;
        savePlayerData();
        renderShopItems(); // Re-render to update button states
        displayShopMessage(`${item.name} equipped!`, false);
        playSound(shopEquipBuffer);
        updateStaticBossImages(); // Update menu images if applicable
    }

    function equipGameBackground(backgroundId) {
        const item = shopItems.find(i => i.id === backgroundId && i.type === 'game_background');
        if (!item || !purchasedShopItemIds.includes(backgroundId)) {
            displayShopMessage('Cannot equip background!', true);
            playSound(shopErrorBuffer);
            return;
        }

        equippedGameBackgroundId = backgroundId;
        savePlayerData();
        renderShopItems(); // Re-render to update button states
        displayShopMessage(`${item.name} equipped!`, false);
        playSound(shopEquipBuffer);
    }

    function equipPlayerSkin(skinId) {
        const item = shopItems.find(i => i.id === skinId && i.type === 'player_skin');
        if (!item || !purchasedShopItemIds.includes(skinId)) {
            displayShopMessage('Cannot equip player skin!', true);
            playSound(shopErrorBuffer);
            return;
        }

        equippedPlayerSkinId = skinId;
        savePlayerData();
        renderShopItems(); // Re-render to update button states
        displayShopMessage(`${item.name} equipped!`, false);
        playSound(shopEquipBuffer);
    }

    function viewStrategyBook() {
        openStrategyGuideModal(); // This will handle showing the modal and playing the sound
        // The shop-specific message is now shown after the modal is potentially opened.
        if (strategyBookUnlocked) {
            displayShopMessage("Strategy guide displayed!", false);
        }
        // If it wasn't unlocked, openStrategyGuideModal would have handled an error message/sound
        // or simply not opened if the check inside it fails (though the button itself should be locked).
    }

    function openStrategyGuideModal() {
        if (!strategyBookUnlocked) {
            // This path should ideally not be hit if the buttons are managed correctly,
            // but it's a safeguard.
            displayShopMessage("Strategy Book is locked!", true); // Use shop message if called from shop context
            playSound(shopErrorBuffer);
            return;
        }
        strategyBookTextElem.textContent = STRATEGY_GUIDE_TEXT;
        strategyBookModal.style.display = 'flex';
        playSound(shopEquipBuffer); // Sound for opening/viewing
    }

    function openChangelogModal() {
        changelogTextElem.innerHTML = CHANGELOG_TEXT.replace(/<strong>(.*?)<\/strong>/g, '<strong>$1</strong>'); // Keep <strong> for styling
        changelogModal.style.display = 'flex';
        playSound(shopEquipBuffer); // Re-use a generic "open UI" sound
    }

    function displayShopMessage(message, isError = false) {
        if (!shopMessageArea) return;
        shopMessageArea.textContent = message;
        shopMessageArea.className = 'shop-message' + (isError ? ' error' : '');
        setTimeout(() => {
            if (shopMessageArea.textContent === message) { // Clear only if it's the same message
                shopMessageArea.textContent = '';
                shopMessageArea.className = 'shop-message';
            }
        }, 3000);
    }

    changelogButton.addEventListener('click', () => {
        openChangelogModal();
    });

    changelogCloseButton.addEventListener('click', () => {
        changelogModal.style.display = 'none';
    });

    function loadPlayerDataInitial() {
        loadPlayerData();
    }
    loadPlayerDataInitial();

    function getEquippedSkin() {
        return shopItems.find(item => item.id === equippedBossSkinId) || shopItems.find(item => item.id === 'nyanwolf_default');
    }
    
    function updateStaticBossImages() {
        const equippedSkin = getEquippedSkin();
        if (!equippedSkin || !equippedSkin.image) return;
    
        if (menuBossImg) {
            menuBossImg.src = equippedSkin.image;
        }
        // gameOverBossImg is updated within the gameOver function itself
        // cutsceneImageElem is updated within playNextCutsceneScene
    }

    // --- Minigame Listeners and Functions ---
    minigamesButton.addEventListener('click', () => {
        menuScreen.style.display = 'none';
        minigamesMenuScreen.style.display = 'flex';
        playSound(shopEnterBuffer); // Re-use sound
    });

    minigamesBackButton.addEventListener('click', () => {
        minigamesMenuScreen.style.display = 'none';
        menuScreen.style.display = 'flex';
        resetToDefaultMenu();
    });

    gardensGameButton.addEventListener('click', () => {
        minigamesMenuScreen.style.display = 'none';
        gardensGameScreen.style.display = 'flex';
        startGardensGame();
    });

    gardensPlayAgainButton.addEventListener('click', () => {
        gardensResultScreen.style.display = 'none';
        startGardensGame();
    });

    gardensBackToMenuButton.addEventListener('click', () => {
        gardensResultScreen.style.display = 'none';
        gardensGameScreen.style.display = 'none';
        minigamesMenuScreen.style.display = 'flex';
    });
    
    waterButton.addEventListener('click', handleWatering);

    function startGardensGame() {
        gardensGameActive = true;
        playerCarrotSize = 0;
        nyanwolfCarrotSize = 0;
        gardensRound = 0;
        playerTurn = true;

        setupGardenAvatars();
        updateCarrotVisuals();
        updateGardenScores();

        gardensInfoText.textContent = "Get ready to plant!";
        wateringMinigameUI.style.visibility = 'hidden';
        gardensResultScreen.style.display = 'none';

        setTimeout(() => {
            nextGardensRound();
        }, 2000);
    }

    function nextGardensRound() {
        if (gardensRound >= GARDENS_MAX_ROUNDS) {
            endGardensGame();
            return;
        }

        if (playerTurn) {
            gardensRound++;
            gardensInfoText.textContent = `Round ${gardensRound}: Your turn to water!`;
            startWateringMinigame();
        } else {
            gardensInfoText.textContent = `Round ${gardensRound}: Nyanwolf is watering...`;
            wateringMinigameUI.style.visibility = 'hidden';
            setTimeout(nyanwolfWateringTurn, 2000);
        }
    }

    function startWateringMinigame() {
        wateringMinigameUI.style.visibility = 'visible';
        waterButton.disabled = false;
        timingBarPosition = 0;
        timingBarDirection = 1;
        if (timingBarAnimationId) cancelAnimationFrame(timingBarAnimationId);
        timingBarAnimationId = requestAnimationFrame(animateTimingBar);
    }
    
    function animateTimingBar() {
        timingBarPosition += timingBarDirection * 2; // Speed of the cursor
        if (timingBarPosition >= 100 || timingBarPosition <= 0) {
            timingBarDirection *= -1;
        }
        timingBarCursor.style.left = `${timingBarPosition}%`;
        timingBarAnimationId = requestAnimationFrame(animateTimingBar);
    }

    function handleWatering() {
        cancelAnimationFrame(timingBarAnimationId);
        waterButton.disabled = true;

        // Check position
        // Perfect: 45-55, Good: 35-65
        let growth = 0;
        let resultText = "";
        if (timingBarPosition >= 45 && timingBarPosition <= 55) {
            growth = Math.floor(Math.random() * 6) + 20; // 20-25
            resultText = "Perfect watering! +" + growth;
        } else if (timingBarPosition >= 35 && timingBarPosition <= 65) {
            growth = Math.floor(Math.random() * 6) + 10; // 10-15
            resultText = "Good watering. +" + growth;
        } else {
            growth = Math.floor(Math.random() * 5) + 1; // 1-5
            resultText = "You missed... +" + growth;
        }
        
        playerCarrotSize += growth;
        gardensInfoText.textContent = resultText;
        updateCarrotVisuals();
        updateGardenScores();

        playerTurn = false;
        setTimeout(nextGardensRound, 2000);
    }

    function nyanwolfWateringTurn() {
        const aiSkill = Math.random();
        let growth = 0;
        let resultText = "";

        if (aiSkill > 0.85) { // 15% chance of Perfect
            growth = Math.floor(Math.random() * 6) + 20;
            resultText = "Nyanwolf got a perfect watering! +" + growth;
        } else if (aiSkill > 0.4) { // 45% chance of Good
            growth = Math.floor(Math.random() * 6) + 10;
            resultText = "Nyanwolf's watering was good. +" + growth;
        } else { // 40% chance of Miss
            growth = Math.floor(Math.random() * 5) + 1;
            resultText = "Nyanwolf missed! +" + growth;
        }

        nyanwolfCarrotSize += growth;
        gardensInfoText.textContent = resultText;
        updateCarrotVisuals();
        updateGardenScores();

        playerTurn = true;
        setTimeout(nextGardensRound, 2000);
    }
    
    function updateCarrotVisuals() {
        const getStage = (size) => {
            if (size >= 65) return 5; // Golden
            if (size >= 45) return 4;
            if (size >= 25) return 3;
            if (size >= 10) return 2;
            if (size >= 1) return 1;
            return 0;
        };
        
        playerCarrotImg.src = CARROT_GROWTH_STAGES[getStage(playerCarrotSize)];
        nyanwolfCarrotImg.src = CARROT_GROWTH_STAGES[getStage(nyanwolfCarrotSize)];
    }

    function updateGardenScores() {
        playerGardenScore.textContent = `Size: ${playerCarrotSize}`;
        nyanwolfGardenScore.textContent = `Size: ${nyanwolfCarrotSize}`;
    }

    function endGardensGame() {
        gardensGameActive = false;
        gardensInfoText.textContent = "The harvest is complete!";
        
        let title, message;
        if (playerCarrotSize > nyanwolfCarrotSize) {
            title = "You Win!";
            message = `Your carrot (size ${playerCarrotSize}) was bigger than Nyanwolf's (size ${nyanwolfCarrotSize}). You're a master gardener!`;
            gardensResultTitle.style.color = '#28a745';
        } else if (nyanwolfCarrotSize > playerCarrotSize) {
            title = "Nyanwolf Wins!";
            message = `Nyanwolf's carrot (size ${nyanwolfCarrotSize}) was bigger than yours (size ${playerCarrotSize}). Better luck next time!`;
            gardensResultTitle.style.color = '#ff4136';
        } else {
            title = "It's a Tie!";
            message = `Both you and Nyanwolf grew carrots of the exact same size (${playerCarrotSize})! Incredible!`;
            gardensResultTitle.style.color = '#ffdd57';
        }

        gardensResultTitle.textContent = title;
        gardensResultMessage.textContent = message;
        gardensResultScreen.style.display = 'flex';
    }

    async function setupGardenAvatars() {
        // Player
        const playerAvatar = document.getElementById('player-garden-avatar');
        const equippedPlayerSkin = shopItems.find(item => item.id === equippedPlayerSkinId);
        if (equippedPlayerSkin && equippedPlayerSkin.id === 'player_skin_yourself') {
            try {
                const user = await window.websim.getUser();
                playerAvatar.src = (user && user.avatar_url) ? user.avatar_url : '/C00lkidd_but_Fresh (1).png';
            } catch {
                playerAvatar.src = '/C00lkidd_but_Fresh (1).png';
            }
        } else if (equippedPlayerSkin && equippedPlayerSkin.id === 'player_skin_rubber_ducky') {
            playerAvatar.src = '/rubber_ducky_player.png';
        } else {
            playerAvatar.src = '/C00lkidd_but_Fresh (1).png';
        }

        // Nyanwolf
        const nyanwolfAvatar = document.getElementById('nyanwolf-garden-avatar');
        const equippedBossSkin = getEquippedSkin();
        if (equippedBossSkin && equippedBossSkin.image) {
            nyanwolfAvatar.src = equippedBossSkin.image;
        } else {
            nyanwolfAvatar.src = '/nyanwolf-neutral-no-background.png';
        }
    }

    updateStaticBossImages(); // Update menu image on initial load
    function gameLoop() {
        if (isGameOver || isPaused) { 
            if(!isPaused) gameLoopId = requestAnimationFrame(gameLoop); 
            return;
        }

        // --- REPLAY RECORDING START ---
        // Optimization: push lightweight objects
        replayData.push({
            player: { x: player.x, y: player.y },
            boss: { x: boss.x, y: boss.y },
            projectiles: projectiles.map(p => ({
                x: p.x,
                y: p.y,
                width: p.width,
                height: p.height
                // Type is handled by static data for boss projectiles usually, 
                // but if we support mixed types later we might need it. 
                // For now, staticData.bossProjectileImage is used for all enemy projectiles in replay for simplicity.
            })),
            playerProjectiles: playerProjectiles.map(p => ({
                x: p.x,
                y: p.y,
                width: p.width,
                height: p.height,
                type: p.type // 'normal' or 'stink_ray'
            })),
            score: score
        });
        // --- REPLAY RECORDING END ---

        if (isChargingStinkRay) {
            updateStinkRayCharge();
        }

        updatePlayer();
        updateBossMovement(); 
        bossAttack();
        updateProjectiles();
        updatePlayerProjectiles(); 
        updateHealItemLogic();
        updateBossStatusEffects(); // Add this call

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function updateBossStatusEffects() {
        if (isBossStunned && Date.now() > bossStunEndTime) {
            isBossStunned = false;
            if (!isGameOver) {
                const currentEquippedSkin = getEquippedSkin();
                if (currentEquippedSkin.id === 'nyanwolf_summer') {
                    bossElem.style.filter = BOSS_SUMMER_FILTER;
                } else {
                    bossElem.style.filter = ''; // Clear stun filter, let animation take over
                }
                bossElem.style.animationPlayState = 'running'; // Resume animation
            }
        }
        if (isBossStinkRayInvincible && Date.now() > bossStinkRayInvincibilityEndTime) {
            isBossStinkRayInvincible = false;
            // Optional: Could add a visual cue here that invincibility wore off
            // For now, just reset the state. If boss is not stunned, filter should already be normal.
        }
    }

    function updateStinkRayCharge() {
        if (!isChargingStinkRay || isPaused || isGameOver) {
            if (playerChargeContainerElem && playerChargeContainerElem.style.display !== 'none') {
                 playerChargeContainerElem.style.display = 'none';
            }
            return;
        }
    
        if (playerChargeContainerElem && playerChargeContainerElem.style.display === 'none') {
            playerChargeContainerElem.style.display = 'flex';
        }

        const elapsedTime = Date.now() - stinkRayChargeStartTime;
        stinkRayChargeLevel = Math.min(1, elapsedTime / STINK_RAY_CHARGE_TIME);
        if (playerChargeBarElem) {
            playerChargeBarElem.style.width = (stinkRayChargeLevel * 100) + '%';
        }
    
        // Optional: Visual/audio cue when fully charged
        // if (stinkRayChargeLevel >= 1) { ... }
    }

    function resetGameToMenu() {
        isGameOver = true; 
        isPaused = false;
        
        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        if (scoreIntervalId) clearInterval(scoreIntervalId);
        if (bgm && !bgm.paused) bgm.pause();

        playerElem.style.display = 'none';
        bossElem.style.display = 'none';
        projectiles.forEach(p => p.element.remove());
        playerProjectiles.forEach(p => p.element.remove());
        projectiles = [];
        playerProjectiles = [];
        effectsLayer.innerHTML = '';
        
        scoreDisplay.style.display = 'none';
        playerHealthContainerElem.style.display = 'none';
        bossHealthContainerElem.style.display = 'none';
        pauseButton.style.display = 'none';
        pauseScreen.style.display = 'none';
        gameArea.style.display = 'none';
        gameOverScreen.style.display = 'none'; // Explicitly hide game over screen

        if (isTouchDevice && mobileControlsElem) {
            mobileControlsElem.style.display = 'none';
            joystickData = { angle: null, distance: null, force: 0, vector: { x: 0, y: 0 } };
        }

        // Reset heal item
        if (healItem && healItem.element) {
            healItem.element.remove();
        }
        healItem = null;

        // Reset charge state on menu reset
        isChargingStinkRay = false;
        if (stinkRayChargeSoundNode) {
            stinkRayChargeSoundNode.stop();
            stinkRayChargeSoundNode = null;
        }
        if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'none';
        if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';

        menuScreen.style.display = 'flex';
        resetToDefaultMenu(); // Reactivate default theme when going back
        updateMenuButtonsVisibility();
        updateStaticBossImages(); // Update menu image on initial load
    }

    function togglePauseGame() {
        if (isGameOver) return; 

        isPaused = !isPaused;

        if (isPaused) {
            if (isTouchDevice && mobileControlsElem) {
                mobileControlsElem.style.display = 'none';
            }
            cancelAnimationFrame(gameLoopId);
            if (scoreIntervalId) clearInterval(scoreIntervalId);
            
            if (bgm && !bgm.paused) { 
                bgm.pause();
            }
            
            if (stinkRayChargeSoundNode) {
                stinkRayChargeSoundNode.stop();
                stinkRayChargeSoundNode = null;
            }
            isChargingStinkRay = false; // Cancel charging on pause
            if (playerChargeContainerElem) playerChargeContainerElem.style.display = 'none';
            if (playerChargeBarElem) playerChargeBarElem.style.width = '0%';
            
            pauseScreen.style.display = 'flex';
            pauseButton.textContent = 'Resume';
        } else { 
            if (isTouchDevice && mobileControlsElem) {
                mobileControlsElem.style.display = 'flex';
            }
            if (bgm && bgm.paused && !bgm.ended) {
                 if (audioContext && audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        if (bgm.paused && !bgm.ended) bgm.play().catch(e => console.warn("BGM resume play failed (after context resume):", e));
                    }).catch(e => console.warn("AudioContext resume failed:", e));
                } else if (audioContext) { 
                    bgm.play().catch(e => console.warn("BGM resume play failed:", e));
                }
            }

            if (scoreIntervalId) clearInterval(scoreIntervalId); 
            scoreIntervalId = setInterval(() => {
                if (!isGameOver && !isPaused) { 
                    score += 10;
                    scoreDisplay.textContent = `Score: ${score}`;
                }
            }, 1000);

            pauseScreen.style.display = 'none';
            pauseButton.textContent = 'Pause';
            
            gameLoopId = requestAnimationFrame(gameLoop);
        }
    }
});