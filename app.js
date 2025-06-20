// Enhanced Moroccan Memory Game with Complete Sound System
class MoroccanSoundManager {
    constructor() {
        this.audioContext = null;
        this.soundEnabled = true;
        this.currentLanguage = 'ar';
        this.backgroundMusic = null;
        this.initAudio();
        
        // Voice messages in different languages
        this.voiceMessages = {
            'ar': {
                'gameStart': 'بسم الله نبدأ اللعبة',
                'cardFlip': 'انقر',
                'match': 'ممتاز! وجدت زوجاً متطابقاً',
                'noMatch': 'حاول مرة أخرى',
                'victory': 'مبروك! لقد فزت في اللعبة',
                'gameOver': 'انتهى الوقت',
                'player1Turn': 'دور اللاعب الأول',
                'player2Turn': 'دور اللاعب الثاني',
                'wellDone': 'أحسنت',
                'timeWarning': 'احذر! الوقت ينفد',
                'newRecord': 'رقم قياسي جديد!',
                'excellent': 'ممتاز',
                'goodJob': 'عمل جيد'
            },
            'fr': {
                'gameStart': 'Commençons le jeu',
                'cardFlip': 'Clic',
                'match': 'Excellent! Vous avez trouvé une paire',
                'noMatch': 'Essayez encore',
                'victory': 'Félicitations! Vous avez gagné',
                'gameOver': 'Temps écoulé',
                'player1Turn': 'Tour du joueur un',
                'player2Turn': 'Tour du joueur deux',
                'wellDone': 'Bien joué',
                'timeWarning': 'Attention! Le temps s\'épuise',
                'newRecord': 'Nouveau record!',
                'excellent': 'Excellent',
                'goodJob': 'Bon travail'
            },
            'en': {
                'gameStart': 'Let\'s start the game',
                'cardFlip': 'Click',
                'match': 'Excellent! You found a matching pair',
                'noMatch': 'Try again',
                'victory': 'Congratulations! You won the game',
                'gameOver': 'Time\'s up',
                'player1Turn': 'Player one\'s turn',
                'player2Turn': 'Player two\'s turn',
                'wellDone': 'Well done',
                'timeWarning': 'Warning! Time is running out',
                'newRecord': 'New record!',
                'excellent': 'Excellent',
                'goodJob': 'Good job'
            }
        };
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Create beep sounds programmatically
    createBeep(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Card flip sound - quick click
    playCardFlip() {
        this.createBeep(800, 0.1, 'square', 0.2);
        setTimeout(() => this.createBeep(400, 0.05, 'square', 0.1), 60);
    }

    // Match found sound - happy chord
    playMatch() {
        this.createBeep(523.25, 0.3, 'sine', 0.3); // C5
        setTimeout(() => this.createBeep(659.25, 0.3, 'sine', 0.3), 100); // E5
        setTimeout(() => this.createBeep(783.99, 0.3, 'sine', 0.3), 200); // G5
    }

    // Victory sound - fanfare
    playVictory() {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        notes.forEach((freq, i) => {
            setTimeout(() => this.createBeep(freq, 0.2, 'sine', 0.4), i * 120);
        });
    }

    // Time warning sound - urgent beeps
    playTimeWarning() {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => this.createBeep(1000, 0.1, 'square', 0.5), i * 150);
        }
    }

    // Game over sound
    playGameOver() {
        // Descending sad notes
        const notes = [523.25, 415.30, 329.63, 261.63]; // C5, G#4, E4, C4
        notes.forEach((freq, i) => {
            setTimeout(() => this.createBeep(freq, 0.4, 'sine', 0.3), i * 200);
        });
    }

    // Text-to-speech functionality
    speak(messageKey) {
        if (!this.soundEnabled) return;
        
        const text = this.voiceMessages[this.currentLanguage][messageKey];
        if (!text) return;

        // Stop any current speech
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Find appropriate voice
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang.includes(this.currentLanguage)) || voices[0];
            if (voice) utterance.voice = voice;

            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;

            window.speechSynthesis.speak(utterance);
        }
    }

    // Combined game event sounds
    playGameEvent(eventType, options = {}) {
        if (!this.soundEnabled) return;
        
        switch(eventType) {
            case 'gameStart':
                setTimeout(() => this.speak('gameStart'), 500);
                break;
                
            case 'cardFlip':
                this.playCardFlip();
                break;
                
            case 'match':
                this.playMatch();
                setTimeout(() => {
                    const phrases = ['match', 'excellent', 'wellDone'];
                    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
                    this.speak(randomPhrase);
                }, 500);
                break;
                
            case 'noMatch':
                setTimeout(() => this.speak('noMatch'), 800);
                break;
                
            case 'victory':
                this.playVictory();
                setTimeout(() => {
                    if (options.isNewRecord) {
                        this.speak('newRecord');
                    } else {
                        this.speak('victory');
                    }
                }, 1000);
                break;
                
            case 'gameOver':
                this.playGameOver();
                setTimeout(() => this.speak('gameOver'), 500);
                break;
                
            case 'playerTurn':
                const playerKey = options.player === 1 ? 'player1Turn' : 'player2Turn';
                this.speak(playerKey);
                break;
                
            case 'timeWarning':
                this.playTimeWarning();
                setTimeout(() => this.speak('timeWarning'), 300);
                break;
        }
    }

    // Set language
    setLanguage(language) {
        this.currentLanguage = language;
    }

    // Toggle sound on/off
    toggle() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    // Resume audio context (needed for some browsers)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Enhanced Main Game Class with Sound Integration
class MoroccanMemoryGame {
    constructor() {
        // Game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = [];
        this.moves = 0;
        this.difficulty = 'medium';
        this.cardTheme = 'default';
        this.isLocked = false;
        this.isTwoPlayerMode = false;
        this.currentPlayer = 1;
        this.playerScores = { 1: 0, 2: 0 };
        this.soundEnabled = true;
        this.language = 'ar';
        this.timeLeft = 60; // Default time
        this.timerInterval = null;
        this.score = 0;
        
        // Initialize sound system
        this.soundManager = new MoroccanSoundManager();
        
        // DOM elements
        this.difficultyScreen = document.getElementById('difficultyScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.winScreen = document.getElementById('winScreen');
        this.gameBoard = document.getElementById('gameBoard');
        this.moveCount = document.getElementById('moveCount');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.pairsFound = document.getElementById('pairsFound');
        this.totalPairs = document.getElementById('totalPairs');
        this.finalMoves = document.getElementById('finalMoves');
        this.finalScore = document.getElementById('finalScore');
        this.finalTime = document.getElementById('finalTime');
        this.timerBar = document.getElementById('timerBar');
        this.timerText = document.getElementById('timerText');
        this.highscoresContainer = document.getElementById('highscores');
        this.instructionsModal = document.getElementById('instructionsModal');
        this.soundToggle = document.getElementById('soundToggle');
        this.languageSelect = document.getElementById('languageSelect');
        this.twoPlayerMode = document.getElementById('twoPlayerMode');
        this.medalContainer = document.getElementById('medalContainer');
        
        // Languages data
        this.translations = {
            'ar': {
                'difficulty': 'اختر مستوى الصعوبة:',
                'easy': 'سهل',
                'medium': 'متوسط',
                'hard': 'صعب',
                'start': 'ابدأ اللعبة',
                'moves': 'الحركات:',
                'player': 'اللاعب:',
                'pairs': 'الأزواج:',
                'reset': 'إعادة ضبط',
                'congratulations': 'مبروك! لقد فزت!',
                'finalScore': 'النتيجة النهائية',
                'finalMoves': 'عدد الحركات:',
                'timeLeft': 'الوقت المتبقي:',
                'seconds': 'ثانية',
                'playAgain': 'العب مرة أخرى',
                'share': 'مشاركة النتيجة',
                'bestScores': 'أفضل النتائج:',
                'instructions': 'تعليمات',
                'cardTheme': 'اختر نمط البطاقات:',
                'themeDefault': 'تقليدي',
                'themeZellige': 'زليج',
                'themePottery': 'فخار',
                'themeCarpet': 'سجاد',
                'twoPlayerMode': 'وضع ثنائي',
                'sound': 'الصوت',
                'player1Wins': 'اللاعب 1 يفوز!',
                'player2Wins': 'اللاعب 2 يفوز!',
                'tie': 'تعادل!',
                'score': 'النتيجة:',
                'goldMedal': 'ميدالية ذهبية',
                'silverMedal': 'ميدالية فضية',
                'bronzeMedal': 'ميدالية برونزية',
                'gameOver': 'انتهى الوقت! حاول مرة أخرى.'
            },
            'fr': {
                'difficulty': 'Choisissez le niveau de difficulté:',
                'easy': 'Facile',
                'medium': 'Moyen',
                'hard': 'Difficile',
                'start': 'Commencer le jeu',
                'moves': 'Coups:',
                'player': 'Joueur:',
                'pairs': 'Paires:',
                'reset': 'Réinitialiser',
                'congratulations': 'Félicitations! Vous avez gagné!',
                'finalScore': 'Score final',
                'finalMoves': 'Nombre de coups:',
                'timeLeft': 'Temps restant:',
                'seconds': 'secondes',
                'playAgain': 'Jouer à nouveau',
                'share': 'Partager le score',
                'bestScores': 'Meilleurs scores:',
                'instructions': 'Instructions',
                'cardTheme': 'Choisissez le thème des cartes:',
                'themeDefault': 'Traditionnel',
                'themeZellige': 'Zellige',
                'themePottery': 'Poterie',
                'themeCarpet': 'Tapis',
                'twoPlayerMode': 'Mode deux joueurs',
                'sound': 'Son',
                'player1Wins': 'Joueur 1 gagne!',
                'player2Wins': 'Joueur 2 gagne!',
                'tie': 'Match nul!',
                'score': 'Score:',
                'goldMedal': 'Médaille d\'or',
                'silverMedal': 'Médaille d\'argent',
                'bronzeMedal': 'Médaille de bronze',
                'gameOver': 'Temps écoulé! Essayez à nouveau.'
            },
            'en': {
                'difficulty': 'Choose difficulty level:',
                'easy': 'Easy',
                'medium': 'Medium',
                'hard': 'Hard',
                'start': 'Start Game',
                'moves': 'Moves:',
                'player': 'Player:',
                'pairs': 'Pairs:',
                'reset': 'Reset',
                'congratulations': 'Congratulations! You won!',
                'finalScore': 'Final Score',
                'finalMoves': 'Number of moves:',
                'timeLeft': 'Time remaining:',
                'seconds': 'seconds',
                'playAgain': 'Play Again',
                'share': 'Share Score',
                'bestScores': 'Best Scores:',
                'instructions': 'Instructions',
                'cardTheme': 'Choose card theme:',
                'themeDefault': 'Traditional',
                'themeZellige': 'Zellige',
                'themePottery': 'Pottery',
                'themeCarpet': 'Carpet',
                'twoPlayerMode': 'Two Player Mode',
                'sound': 'Sound',
                'player1Wins': 'Player 1 wins!',
                'player2Wins': 'Player 2 wins!',
                'tie': 'It\'s a tie!',
                'score': 'Score:',
                'goldMedal': 'Gold Medal',
                'silverMedal': 'Silver Medal',
                'bronzeMedal': 'Bronze Medal',
                'gameOver': 'Time\'s up! Try again.'
            }
        };
        
        // Moroccan themed items (icons and names)
        this.moroccanItems = [
            { id: 1, name: 'شاي', emoji: '🍵' }, // Moroccan tea
            { id: 2, name: 'طاجين', emoji: '🍲' }, // Tagine
            { id: 3, name: 'باب تقليدي', emoji: '🚪' }, // Traditional door
            { id: 4, name: 'سجادة', emoji: '🧶' }, // Carpet
            { id: 5, name: 'فانوس', emoji: '🏮' }, // Lantern
            { id: 6, name: 'زيتون', emoji: '🫒' }, // Olives
            { id: 7, name: 'نعناع', emoji: '🌿' }, // Mint
            { id: 8, name: 'جمل', emoji: '🐪' }, // Camel
            { id: 9, name: 'كسكس', emoji: '🥘' }, // Couscous
            { id: 10, name: 'تمر', emoji: '🌴' }, // Date palm
            { id: 11, name: 'برتقال', emoji: '🍊' }, // Orange
            { id: 12, name: 'عود', emoji: '🎵' }, // Oud (music)
            { id: 13, name: 'فاس', emoji: '🏯' }, // Fez (city)
            { id: 14, name: 'قفطان', emoji: '👘' }, // Kaftan
            { id: 15, name: 'بابوش', emoji: '👞' }, // Babouche slippers
            { id: 16, name: 'دار', emoji: '🏠' }, // Riad
        ];
        
        // Initialize the game
        this.init();
    }
    
    // Initialize game event listeners
    init() {
        // Resume audio context on first user interaction
        document.addEventListener('click', () => {
            this.soundManager.resumeAudioContext();
        }, { once: true });
        
        // Sound toggle
        this.soundToggle.addEventListener('click', () => {
            this.soundEnabled = this.soundManager.toggle();
            this.soundToggle.querySelector('.sound-icon').textContent = this.soundEnabled ? '🔊' : '🔇';
            this.updateTexts();
        });
        
        // Language selector
        this.languageSelect.addEventListener('change', () => {
            this.language = this.languageSelect.value;
            this.soundManager.setLanguage(this.language);
            this.updateTexts();
        });
        
        // Two player mode toggle
        this.twoPlayerMode.addEventListener('change', () => {
            this.isTwoPlayerMode = this.twoPlayerMode.checked;
            this.updateTexts();
        });
        
        // Difficulty buttons
        const difficultyBtns = document.querySelectorAll('[data-difficulty]');
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button styling
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Set difficulty
                this.difficulty = btn.dataset.difficulty;
            });
        });
        
        // Card theme options
        const themeOptions = document.querySelectorAll('.card-theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Update active option styling
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Set card theme
                this.cardTheme = option.dataset.theme;
            });
        });
        
        // Help button
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showInstructions();
        });
        
        // Close instructions button
        document.getElementById('closeInstructionsBtn').addEventListener('click', () => {
            this.instructionsModal.style.display = 'none';
        });
        
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.showDifficultyScreen();
        });
        
        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Share button
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareScore();
        });
        
        // When clicking outside the modal, close it
        this.instructionsModal.addEventListener('click', (e) => {
            if (e.target === this.instructionsModal) {
                this.instructionsModal.style.display = 'none';
            }
        });
        
        // Update texts to initial language
        this.updateTexts();
    }
    
    // Update texts based on selected language
    updateTexts() {
        const t = this.translations[this.language];
        
        // Update static texts
        document.querySelector('.difficulty-selector p').textContent = t.difficulty;
        document.querySelector('.btn-easy').textContent = t.easy;
        document.querySelector('.btn-medium').textContent = t.medium;
        document.querySelector('.btn-hard').textContent = t.hard;
        document.querySelector('.btn-start').textContent = t.start;
        document.querySelector('.mode-text').textContent = t.twoPlayerMode;
        document.querySelector('.card-theme-selector p').textContent = t.cardTheme;
        document.querySelectorAll('.card-theme-option')[0].textContent = t.themeDefault;
        document.querySelectorAll('.card-theme-option')[1].textContent = t.themeZellige;
        document.querySelectorAll('.card-theme-option')[2].textContent = t.themePottery;
        document.querySelectorAll('.card-theme-option')[3].textContent = t.themeCarpet;
        document.querySelector('.btn-help').textContent = t.instructions;
        document.querySelector('.btn-reset').textContent = t.reset;
        document.querySelector('.sound-text').textContent = t.sound;
        
        // Update game stats labels
        const moveLabel = document.querySelector('.game-stats div:nth-child(1)');
        if (moveLabel) moveLabel.textContent = `${t.moves} ${this.moves}`;
        
        const playerLabel = document.querySelector('.game-stats div:nth-child(2)');
        if (playerLabel) playerLabel.textContent = `${t.player} ${this.currentPlayer}`;
        
        const pairsLabel = document.querySelector('.game-stats div:nth-child(3)');
        if (pairsLabel) {
            const found = this.pairsFound ? this.pairsFound.textContent : '0';
            const total = this.totalPairs ? this.totalPairs.textContent : '0';
            pairsLabel.textContent = `${t.pairs} ${found}/${total}`;
        }
        
        // Update win screen texts
        document.querySelector('.win-title').textContent = t.congratulations;
        document.querySelector('.score-title').textContent = t.finalScore;
        document.querySelector('#highscoreSection h3').textContent = t.bestScores;
        document.querySelector('.btn-share').textContent = t.share;
        document.querySelector('#playAgainBtn').textContent = t.playAgain;
        
        // Update win stats format
        const movesText = document.querySelector('.win-stats').firstChild;
        if (movesText) movesText.textContent = `${t.finalMoves} `;
        
        const timeText = document.querySelector('.win-stats').childNodes[2];
        if (timeText) timeText.textContent = ` ${t.timeLeft} `;
        
        // Update seconds text
        const secondsText = document.querySelector('.win-stats').lastChild;
        if (secondsText) secondsText.textContent = ` ${t.seconds}`;
    }
    
    // Show instructions modal
    showInstructions() {
        this.instructionsModal.style.display = 'flex';
    }
    
    // Start a new game
    startGame() {
        // Reset game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = [];
        this.moves = 0;
        this.isLocked = false;
        this.currentPlayer = 1;
        this.playerScores = { 1: 0, 2: 0 };
        
        // Set timer based on difficulty
        switch(this.difficulty) {
            case 'easy':
                this.timeLeft = 90; // 90 seconds for easy
                break;
            case 'hard':
                this.timeLeft = 45; // 45 seconds for hard
                break;
            case 'medium':
            default:
                this.timeLeft = 60; // 60 seconds for medium
        }
        
        // Create and shuffle cards
        this.createCards();
        
        // Update UI
        this.updateStats();
        this.updateTimerDisplay();
        
        // Show game screen
        this.difficultyScreen.style.display = 'none';
        this.winScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';
        
        // Add theme class to game board
        this.gameBoard.className = 'game-board';
        this.gameBoard.classList.add(`grid-${this.difficulty}`);
        this.gameBoard.classList.add(`theme-${this.cardTheme}`);
        
        // Render cards
        this.renderCards();
        
        // Start timer
        this.startTimer();
        
        // Play game start sound
        this.soundManager.playGameEvent('gameStart');
    }
    
    // Start the game timer
    startTimer() {
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const startTime = this.timeLeft;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            
            // Update timer display
            this.updateTimerDisplay();
            
            // Check for low time warning (10 seconds or less)
            if (this.timeLeft <= 10) {
                this.timerBar.style.backgroundColor = '#ef4444'; // Red for warning
                
                // Play warning sound if not already played
                if (this.timeLeft === 10) {
                    this.soundManager.playGameEvent('timeWarning');
                }
            }
            
            // Check if time is up
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.endGame(false); // End game as loss
            }
        }, 1000);
    }
    
    // Update timer display
    updateTimerDisplay() {
        const totalTime = this.difficulty === 'easy' ? 90 : (this.difficulty === 'hard' ? 45 : 60);
        const percentage = (this.timeLeft / totalTime) * 100;
        
        this.timerBar.style.width = `${percentage}%`;
        this.timerText.textContent = this.timeLeft;
        
        // Set color based on remaining time
        if (this.timeLeft <= 10) {
            this.timerBar.style.backgroundColor = '#ef4444'; // Red
        } else if (this.timeLeft <= 30) {
            this.timerBar.style.backgroundColor = '#f59e0b'; // Amber
        } else {
            this.timerBar.style.backgroundColor = '#16a34a'; // Green
        }
    }
    
    // Create card deck based on difficulty
    createCards() {
        let pairsCount;
        
        // Set number of pairs based on difficulty
        switch(this.difficulty) {
            case 'easy':
                pairsCount = 6;
                break;
            case 'hard':
                pairsCount = 12;
                break;
            case 'medium':
            default:
                pairsCount = 8;
        }
        
        // Update total pairs in UI
        this.totalPairs.textContent = pairsCount;
        
        // Get subset of items based on difficulty
        const selectedItems = this.moroccanItems.slice(0, pairsCount);
        
        // Create pairs
        this.cards = [];
        selectedItems.forEach(item => {
            // Create two cards with same id (pairs)
            this.cards.push({ ...item, isFlipped: false, isMatched: false });
            this.cards.push({ ...item, isFlipped: false, isMatched: false });
        });
        
        // Shuffle cards
        this.shuffleCards();
    }
    
    // Shuffle the cards
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    // Render cards on the game board
    renderCards() {
        // Clear game board
        this.gameBoard.innerHTML = '';
        
        // Create card elements
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            if (card.isFlipped) cardElement.classList.add('flipped');
            if (card.isMatched) cardElement.classList.add('matched');
            
            cardElement.innerHTML = `
                <div class="card-face card-back"></div>
                <div class="card-face card-front">${card.emoji}</div>
            `;
            
            // Add click event
            cardElement.addEventListener('click', () => this.flipCard(index));
            
            // Add to game board
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    // Card flip handler
    flipCard(index) {
        const card = this.cards[index];
        
        // Prevent flipping in these cases
        if (this.isLocked || card.isFlipped || card.isMatched) {
            return;
        }
        
        // Flip the card
        card.isFlipped = true;
        this.flippedCards.push({ index, id: card.id });
        
        // Play flip sound
        this.soundManager.playGameEvent('cardFlip');
        
        // Update the UI
        this.renderCards();
        
        // Check if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.isLocked = true;
            this.moves++;
            this.updateStats();
            
            // Check for match
            setTimeout(() => {
                this.checkForMatch();
            }, 800);
        }
    }
    
    // Check if the two flipped cards match
    checkForMatch() {
        const [first, second] = this.flippedCards;
        
        if (first.id === second.id) {
            // Match found
            this.cards[first.index].isMatched = true;
            this.cards[second.index].isMatched = true;
            this.matchedPairs.push(first.id);
            
            // Update player scores in two player mode
            if (this.isTwoPlayerMode) {
                this.playerScores[this.currentPlayer]++;
            }
            
            // Add animation class to matched cards
            const cardElements = document.querySelectorAll('.card');
            cardElements[first.index].classList.add('matched-animation');
            cardElements[second.index].classList.add('matched-animation');
            
            // Play match sound and voice
            this.soundManager.playGameEvent('match');
            
            // Update stats
            this.pairsFound.textContent = this.matchedPairs.length;
            
            // Check for win
            if (this.matchedPairs.length === parseInt(this.totalPairs.textContent)) {
                // Stop the timer
                clearInterval(this.timerInterval);
                
                setTimeout(() => {
                    // Check if it's a new record
                    const isNewRecord = this.checkIfNewRecord();
                    this.endGame(true, { isNewRecord }); // Win game
                }, 500);
            } else {
                // Current player gets another turn in two player mode if matched
                if (!this.isTwoPlayerMode) {
                    // Reset for next turn
                    this.flippedCards = [];
                    this.isLocked = false;
                } else {
                    // Player continues after a match
                    this.flippedCards = [];
                    this.isLocked = false;
                }
            }
        } else {
            // No match, flip cards back
            this.cards[first.index].isFlipped = false;
            this.cards[second.index].isFlipped = false;
            
            // Play no match voice feedback
            this.soundManager.playGameEvent('noMatch');
            
            // Switch player in two player mode
            if (this.isTwoPlayerMode) {
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                
                // Announce next player's turn
                setTimeout(() => {
                    this.soundManager.playGameEvent('playerTurn', { player: this.currentPlayer });
                }, 1200);
                
                this.updateStats();
            }
            
            // Reset flipped cards array
            this.flippedCards = [];
            this.isLocked = false;
        }
        
        // Update UI
        this.renderCards();
    }
    
    // Check if current score is a new record
    checkIfNewRecord() {
        const highScores = JSON.parse(localStorage.getItem('moroccanMemoryHighScores') || '[]');
        
        // Calculate current score first
        let difficultyMultiplier;
        switch(this.difficulty) {
            case 'easy': difficultyMultiplier = 1; break;
            case 'medium': difficultyMultiplier = 2; break;
            case 'hard': difficultyMultiplier = 3; break;
        }
        
        const pairsPoints = parseInt(this.totalPairs.textContent) * 100;
        const timePoints = this.timeLeft * 10;
        const movesPenalty = this.moves * 5;
        this.score = Math.max(0, (pairsPoints + timePoints - movesPenalty) * difficultyMultiplier);
        
        if (highScores.length === 0 || this.score > highScores[0].score) {
            return true;
        }
        return false;
    }
    
    // Update game stats
    updateStats() {
        this.moveCount.textContent = this.moves;
        this.pairsFound.textContent = this.matchedPairs.length;
        
        if (this.isTwoPlayerMode) {
            this.currentPlayerDisplay.textContent = this.currentPlayer;
        }
    }
    
    // End game function (handles both win and loss)
    endGame(isWin, options = {}) {
        // Stop the timer
        clearInterval(this.timerInterval);
        
        if (isWin) {
            // Calculate score based on moves, remaining time, and difficulty
            let difficultyMultiplier;
            switch(this.difficulty) {
                case 'easy':
                    difficultyMultiplier = 1;
                    break;
                case 'medium':
                    difficultyMultiplier = 2;
                    break;
                case 'hard':
                    difficultyMultiplier = 3;
                    break;
            }
            
            // Formula: (pairs * 100) + (remaining time * 10) - (moves * 5) * difficultyMultiplier
            const pairsPoints = parseInt(this.totalPairs.textContent) * 100;
            const timePoints = this.timeLeft * 10;
            const movesPenalty = this.moves * 5;
            
            this.score = Math.max(0, (pairsPoints + timePoints - movesPenalty) * difficultyMultiplier);
            
            // In two player mode, determine the winner
            if (this.isTwoPlayerMode) {
                if (this.playerScores[1] > this.playerScores[2]) {
                    document.querySelector('.win-title').textContent = this.translations[this.language].player1Wins;
                } else if (this.playerScores[2] > this.playerScores[1]) {
                    document.querySelector('.win-title').textContent = this.translations[this.language].player2Wins;
                } else {
                    document.querySelector('.win-title').textContent = this.translations[this.language].tie;
                }
            }
            
            // Play victory sound and voice
            this.soundManager.playGameEvent('victory', { isNewRecord: options.isNewRecord });
            
            // Update win screen stats
            this.finalMoves.textContent = this.moves;
            this.finalTime.textContent = this.timeLeft;
            this.finalScore.textContent = this.score;
            
            // Display appropriate medal based on score
            this.displayMedal();
            
            // Add to high scores
            this.addToHighScores();
            
            // Create celebration animation
            this.createCelebrationEffect();
            
            // Show win screen
            this.gameScreen.style.display = 'none';
            this.winScreen.style.display = 'block';
        } else {
            // Game over (time ran out)
            this.soundManager.playGameEvent('gameOver');
            alert(this.translations[this.language].gameOver);
            this.showDifficultyScreen();
        }
    }
    
    // Display medal based on score
    displayMedal() {
        this.medalContainer.innerHTML = '';
        
        let medal, medalText;
        const totalPairs = parseInt(this.totalPairs.textContent);
        const maxPossibleScore = (totalPairs * 100 + (this.difficulty === 'easy' ? 90 : (this.difficulty === 'hard' ? 45 : 60)) * 10) * 
                                (this.difficulty === 'easy' ? 1 : (this.difficulty === 'hard' ? 3 : 2));
        
        // Determine medal based on percentage of max possible score
        const scorePercentage = (this.score / maxPossibleScore) * 100;
        
        if (scorePercentage >= 80) {
            medal = 'medal-gold';
            medalText = this.translations[this.language].goldMedal;
        } else if (scorePercentage >= 60) {
            medal = 'medal-silver';
            medalText = this.translations[this.language].silverMedal;
        } else {
            medal = 'medal-bronze';
            medalText = this.translations[this.language].bronzeMedal;
        }
        
        const medalElement = document.createElement('div');
        medalElement.className = `medal ${medal}`;
        medalElement.textContent = medalText;
        
        this.medalContainer.appendChild(medalElement);
    }
    
    // Add score to high scores
    addToHighScores() {
        // Get existing high scores from local storage
        let highScores = JSON.parse(localStorage.getItem('moroccanMemoryHighScores') || '[]');
        
        // Add current score
        highScores.push({
            difficulty: this.difficulty,
            score: this.score,
            moves: this.moves,
            timeLeft: this.timeLeft,
            date: new Date().toISOString()
        });
        
        // Sort by score (highest first)
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10
        highScores = highScores.slice(0, 10);
        
        // Save back to local storage
        localStorage.setItem('moroccanMemoryHighScores', JSON.stringify(highScores));
        
        // Display high scores
        this.displayHighScores(highScores);
    }
    
    // Display high scores on win screen
    displayHighScores(highScores) {
        this.highscoresContainer.innerHTML = '';
        
        highScores.forEach((entry, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'highscore-item';
            
            // Format the difficulty text using translations
            const difficultyText = this.translations[this.language][entry.difficulty] || entry.difficulty;
            
            scoreItem.innerHTML = `
                <div>${index + 1}. ${difficultyText}</div>
                <div>${entry.score}</div>
            `;
            
            this.highscoresContainer.appendChild(scoreItem);
        });
    }
    
    // Create confetti celebration effect
    createCelebrationEffect() {
        const celebrationContainer = document.getElementById('celebrationAnimation');
        celebrationContainer.innerHTML = '';
        
        // Generate 50 confetti pieces
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                
                // Random color
                const colors = ['#16a34a', '#b45309', '#0ea5e9', '#ec4899', '#8b5cf6'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.setProperty('--color', randomColor);
                
                // Random position
                confetti.style.left = `${Math.random() * 100}%`;
                
                // Random delay
                const delay = Math.random() * 0.5;
                confetti.style.animationDelay = `${delay}s`;
                
                celebrationContainer.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50); // Stagger effect
        }
    }
    
    // Share score (would be implemented to share on social media)
    shareScore() {
        // Get formatted difficulty
        const difficultyText = this.translations[this.language][this.difficulty];
        
        // Create share text
        const shareText = `${this.translations[this.language].score} ${this.score} - ${difficultyText} - ${this.translations[this.language].moves} ${this.moves}`;
        
        // In a real implementation, this would use the Web Share API or similar
        if (navigator.share) {
            navigator.share({
                title: 'My Moroccan Memory Game Score',
                text: shareText,
                url: window.location.href
            }).catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Score copied to clipboard!');
            }).catch(() => {
                alert(shareText);
            });
        }
    }
    
    // Show difficulty screen
    showDifficultyScreen() {
        // Stop any running timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.gameScreen.style.display = 'none';
        this.winScreen.style.display = 'none';
        this.difficultyScreen.style.display = 'block';
    }
    
    // Legacy play sound method for compatibility
    playSound(type) {
        // Map old sound types to new game events
        const eventMap = {
            'flip': 'cardFlip',
            'match': 'match',
            'victory': 'victory',
            'timeWarning': 'timeWarning',
            'gameOver': 'gameOver'
        };
        
        if (eventMap[type]) {
            this.soundManager.playGameEvent(eventMap[type]);
        }
    }
}

// Initialize the enhanced game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MoroccanMemoryGame();
});