import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { ToastComponent } from '../../shared/toast/toast.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { LeaderboardModalComponent } from '../../shared/leaderboard-modal/leaderboard-modal.component';

@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    KeyboardComponent, 
    ToastComponent,
    ModalComponent,
    LeaderboardModalComponent
  ]
})
export class GameGridComponent implements OnInit {
  grid: Array<Array<{letter: string, state: string}>> = [];
  currentRow = 0;
  currentCol = 0;
  wordLength = 5;
  gameId: number | null = null;
  hint = '';
  targetWord = '';
  remainingAttempts = 6;
  isLoading = false;
  gameOver = false;
  wordFound = false;
  errorMessage = '';
  isAuthenticated = false;
  showLoginModal = false;
  loginAlias = '';
  loginEmail = '';
  loginPassword = '';
  loginError = '';
  loginLoading = false;
  keyStates: { [key: string]: string } = {};
  sessionStats = {
    totalScore: 0,
    wordsFound: 0,
    averageScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    perfectWords: 0
  };
  wordsHistory: Array<{
    attempts: number;
    wordScore: number;
    bonusPoints: number;
    isPerfect: boolean;
  }> = [];
  topScores: any[] = [];
  perfectWordStreak = 0;
  wordStartTime = Date.now();
  activeScoreTab = 'session';
  currentDifficulty: 'facile' | 'moyen' | 'difficile' | 'cauchemar' = 'facile';
  showDifficultySelector = false;
  currentGameId: number = 0;
  selectedDifficulty: string = 'facile';  
  currentWord: string = '';              
  guesses: string[] = [];
  currentGuess: string = '';
  gameFinished: boolean = false;
  gameWon: boolean = false;
  attempts: number = 0;
  maxAttempts: number = 6;
  secretWord: string = '';
  showLeaderboardModal = false;

  constructor(
    private gameService: GameService,
    private authService: AuthService, // 🔧 INJECTER LE SERVICE
    public modalService: ModalService,
    private toastService: ToastService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthentication();
      const savedDifficulty = localStorage.getItem('gameDifficulty') as 'facile' | 'moyen' | 'difficile' | 'cauchemar';
      if (savedDifficulty) {
        this.currentDifficulty = savedDifficulty;
        this.setupDifficultySources();
      }
      this.loadSavedStats();
      this.loadTopScores();
    }
    
    // SYNCHRONISER LE PSEUDO AU DÉMARRAGE
    const user = this.authService.getUser();
    if (user?.pseudo) {
      localStorage.setItem('playerAlias', user.pseudo);
      
    }
  }

  checkAuthentication() {
    this.isAuthenticated = true;
    if (this.isAuthenticated) {
      this.loadNewWord();
    }
  }

  showLogin() {
    this.showLoginModal = true;
    this.loginError = '';
  }

  onLogin() {
    if (!this.loginAlias || !this.loginEmail) {
      this.loginError = 'Veuillez remplir tous les champs';
      return;
    }
    this.loginLoading = true;
    this.loginError = '';
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('playerAlias', this.loginAlias);
        localStorage.setItem('gameAlias', this.loginAlias);
        localStorage.setItem('token', 'dev-token-' + Date.now());
      }
      this.isAuthenticated = true;
      this.showLoginModal = false;
      this.loginLoading = false;
      this.toastService.success(`Bienvenue ${this.loginAlias} ! 🎮`, 3000);
      this.loadNewWord();
    }, 1000);
  }

  useTestAccount() {
    this.loginAlias = 'Testeur';
    this.loginEmail = 'test@motus.com';
    this.loginPassword = 'password';
    this.onLogin();
  }

  private setupDifficultySources() {
    if (this.currentDifficulty === 'cauchemar') {
      // this.gameService.enableHardMode();
    } else {
      // this.gameService.disableHardMode();
    }
  }

  getDifficultyLabel(): string {
    const labels = {
      'facile': '🟢 FACILE',
      'moyen': '📚 MOYEN',
      'difficile': '🔥 DIFFICILE',
      'cauchemar': '💀 CAUCHEMAR'
    };
    return labels[this.currentDifficulty];
  }

  changeDifficulty(difficulty: 'facile' | 'moyen' | 'difficile' | 'cauchemar') {
    this.currentDifficulty = difficulty;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('gameDifficulty', difficulty);
    }
    const messages = {
      'facile': '🟢 Mode FACILE - Mots 3-4 lettres',
      'moyen': '📚 Mode MOYEN - Mots 5-7 lettres',
      'difficile': '🔥 Mode DIFFICILE - Mots 6-9 lettres',
      'cauchemar': '💀 Mode CAUCHEMAR - Mots 6-12 lettres !'
    };
    this.toastService.info(messages[difficulty], 3000);
    this.setupDifficultySources();
    this.showDifficultySelector = false;
    if (!this.gameOver) {
      this.restartGame();
    }
  }

  previewDifficulty(difficulty: 'facile' | 'moyen' | 'difficile' | 'cauchemar') {
    const previews = {
      'facile': {
        label: '🟢 FACILE',
        description: 'Mots courts (3-4 lettres)\nExemples: CHAT, BLEU, AUTO'
      },
      'moyen': {
        label: '📚 MOYEN', 
        description: 'Mots standards (5-7 lettres)\nExemples: MAISON, JARDIN, VOYAGE'
      },
      'difficile': {
        label: '🔥 DIFFICILE',
        description: 'Mots complexes (6-9 lettres)\nExemples: COURAGE, MYSTERE, AVENTURE'
      },
      'cauchemar': {
        label: '💀 CAUCHEMAR',
        description: 'Mots ultra-longs (6-12 lettres)\nExemples: EXTRAORDINAIRE, BYZANTINE'
      }
    };
    const preview = previews[difficulty];
    this.toastService.info(`${preview.label}\n${preview.description}`, 4000);
  }

  private loadNewWord() {
    this.isLoading = true;
    this.errorMessage = '';
    this.wordStartTime = Date.now();
    this.gameService.getNewWord(this.currentDifficulty).subscribe({
      next: (response: any) => {
        console.log('✅ Nouveau mot chargé !');
        this.currentGameId = response.gameId;
        this.targetWord = response.word;
        this.hint = response.firstLetter;
        this.wordLength = response.length;
        this.secretWord = response.word;
        this.resetGrid();
        this.isLoading = false;
        console.log('🎮 Jeu prêt - Mot de', this.wordLength, 'lettres');
        this.toastService.success(`✅ Nouveau mot ${this.currentDifficulty} généré !`, 3000);
      },
      error: (error: any) => {
        console.error('❌ Erreur chargement mot:', error);
        this.loadFallbackWord();
      }
    });
  }

  private loadFallbackWord() {
    console.warn('🔄 Fallback vers mots locaux');
    const fallbackWords = {
      'facile': ['CHAT', 'CHIEN', 'AUTO', 'BLEU', 'VERT', 'GRIS'],
      'moyen': ['MAISON', 'JARDIN', 'VOYAGE', 'MUSIQUE', 'BUREAU', 'PROJET'],
      'difficile': ['COURAGE', 'MYSTERE', 'AVENTURE', 'SYMPHONIE', 'FREQUENCE'],
      'cauchemar': ['EXTRAORDINAIRE', 'MAGNIFICENT', 'BYZANTINE', 'FREQUENCY', 'COMPLEXITY']
    };
    const words = fallbackWords[this.currentDifficulty] || fallbackWords['moyen'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    this.gameId = Date.now();
    this.remainingAttempts = 6;
    this.hint = randomWord.charAt(0);
    this.wordLength = randomWord.length;
    this.targetWord = randomWord;
    this.resetGrid();
    this.isLoading = false;
    this.toastService.info(`🔄 Mot ${this.currentDifficulty} (fallback local) chargé !`, 3000);
  }

  private resetGrid() {
    this.grid = [];
    this.currentRow = 0;
    this.currentCol = 0;
    this.gameOver = false;
    this.wordFound = false;
    this.keyStates = {};
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < this.wordLength; j++) {
        row.push({
          letter: '',
          state: ''
        });
      }
      this.grid.push(row);
    }
    if (this.hint) {
      for (let i = 0; i < 6; i++) {
        this.grid[i][0].letter = this.hint;
        this.grid[i][0].state = 'hint';
      }
      this.currentCol = 1;
    }
    console.log('✅ Grille réinitialisée avec indice:', this.hint);
  }

  handleKeyPress(key: string) {
    if (this.gameOver || this.isLoading) return;
    if (key === 'ENTER') {
      this.checkWord();
    } else if (key === 'BACKSPACE') {
      this.deleteLetter();
    } else if (key.length === 1 && /[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/i.test(key)) {
      this.addLetter(key.toUpperCase());
    }
  }

  private addLetter(letter: string) {
    if (this.currentCol < this.wordLength) {
      this.grid[this.currentRow][this.currentCol].letter = letter;
      this.currentCol++;
    }
  }

  private deleteLetter() {
    if (this.currentCol > (this.hint ? 1 : 0)) {
      this.currentCol--;
      this.grid[this.currentRow][this.currentCol].letter = '';
    }
  }

  private checkWord() {
    const currentRowLetters = this.grid[this.currentRow];
    const guess = currentRowLetters.map(cell => cell.letter).join('');
    if (guess.length < this.wordLength) {
      this.toastService.warning('Mot incomplet !', 2000);
      return;
    }
    const attemptNumber = this.currentRow + 1;
    console.log(`🔍 Vérification du mot: "${guess}" (tentative ${attemptNumber})`);
    this.checkWordLocally(guess, attemptNumber);
  }

  private checkWordLocally(guess: string, attemptNumber: number) {
    const target = this.targetWord;
    const result: Array<{status: 'correct' | 'present' | 'absent'}> = [];
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    const targetLetterCount: {[key: string]: number} = {};
    for (const letter of targetLetters) {
      targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
    }
    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = { status: 'correct' };
        targetLetterCount[guessLetters[i]]--;
      } else {
        result[i] = { status: 'absent' };
      }
    }
    for (let i = 0; i < guessLetters.length; i++) {
      if (result[i].status === 'absent') {
        if (targetLetterCount[guessLetters[i]] > 0) {
          result[i] = { status: 'present' };
          targetLetterCount[guessLetters[i]]--;
        }
      }
    }
    for (let i = 0; i < guess.length; i++) {
      const cell = this.grid[this.currentRow][i];
      cell.letter = guessLetters[i];
      switch (result[i].status) {
        case 'correct':
          cell.state = 'correct';
          break;
        case 'present':
          cell.state = 'present';
          break;
        case 'absent':
        default:
          cell.state = 'incorrect';
          break;
      }
    }
    const keyStates = result.map(r => {
      switch (r.status) {
        case 'correct': return 'correct';
        case 'present': return 'present';
        case 'absent': 
        default: return 'incorrect';
      }
    });
    this.updateKeyStates(guess, keyStates);
    const won = guess === target;
    const gameOver = won || this.currentRow >= 5;
    const mockResponse = {
      won,
      gameOver,
      targetWord: gameOver ? target : undefined,
      result,
      remainingAttempts: this.remainingAttempts - 1
    };
    this.handleWordCheckResponse(mockResponse, guess, attemptNumber);
  }

  private updateKeyStates(guess: string, states: string[]) {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const state = states[i];
      if (!this.keyStates[letter] || 
          (state === 'correct') ||
          (state === 'present' && this.keyStates[letter] !== 'correct')) {
        this.keyStates[letter] = state;
      }
    }
  }

  private handleWordCheckResponse(response: any, guess: string, attemptNumber: number) {
    if (response.won) {
      this.wordFound = true;
      this.gameOver = true;
      this.targetWord = response.targetWord || guess;
      const wordResult = this.calculateWordScore(attemptNumber);
      this.updateSessionStats(wordResult);
      setTimeout(() => {
        const messages = [
          `🎉 Excellent ! Mot trouvé en ${attemptNumber} essai(s) !`,
          `🌟 Bravo ! ${attemptNumber === 1 ? 'Du premier coup !' : `En ${attemptNumber} tentatives !`}`,
          `🎯 Parfait ! Score: ${wordResult.wordScore} points !`
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.toastService.success(randomMessage, 4000);
        if (attemptNumber === 1) {
          setTimeout(() => {
            this.toastService.success('💎 PARFAIT ! Bonus de 100 points !', 3000);
          }, 1500);
        }
      }, 1000);
    } else if (response.gameOver || this.currentRow >= 5) {
      this.wordFound = false;
      this.gameOver = true;
      this.targetWord = response.targetWord || this.targetWord;
      this.sessionStats.currentStreak = 0;
      this.perfectWordStreak = 0;
      setTimeout(() => {
        const failureMessages = [
          `😞 Dommage ! Le mot était : ${this.targetWord}`,
          `🤔 Pas cette fois ! La réponse était : ${this.targetWord}`,
          `💪 Presque ! Le mot recherché était : ${this.targetWord}`
        ];
        const randomMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
        this.toastService.error(randomMessage, 5000);
      }, 1000);
    } else {
      this.currentRow++;
      this.currentCol = 0;
      this.remainingAttempts = response.remainingAttempts || (this.remainingAttempts - 1);
      if (this.hint && this.currentRow < 6) {
        this.grid[this.currentRow][0].letter = this.hint;
        this.grid[this.currentRow][0].state = 'hint';
        this.currentCol = 1;
      }
      const remainingAttempts = 6 - this.currentRow;
      if (remainingAttempts === 2) {
        this.toastService.warning('⚠️ Plus que 2 tentatives !', 2000);
      } else if (remainingAttempts === 1) {
        this.toastService.warning('🚨 Dernière chance !', 2000);
      }
    }
  }

  private calculateWordScore(attempts: number): {
    wordScore: number;
    bonusPoints: number;
    totalScore: number;
    isPerfect: boolean;
  } {
    const baseScore = Math.max(100 - (attempts - 1) * 15, 10);
    let bonusPoints = 0;
    let isPerfect = false;
    if (attempts === 1) {
      bonusPoints += 100;
      isPerfect = true;
    } else if (attempts === 2) {
      bonusPoints += 50;
    } else if (attempts === 3) {
      bonusPoints += 25;
    }
    if (this.sessionStats.currentStreak >= 3) {
      bonusPoints += this.sessionStats.currentStreak * 10;
    }
    const difficultyMultipliers = {
      'facile': 1,
      'moyen': 1.2,
      'difficile': 1.5,
      'cauchemar': 2
    };
    const multiplier = difficultyMultipliers[this.currentDifficulty];
    const finalWordScore = Math.round((baseScore + bonusPoints) * multiplier);
    return {
      wordScore: finalWordScore,
      bonusPoints,
      totalScore: this.sessionStats.totalScore + finalWordScore,
      isPerfect
    };
  }

  private updateSessionStats(wordResult: {
    wordScore: number;
    bonusPoints: number;
    isPerfect: boolean;
  }) {
    this.sessionStats.totalScore += wordResult.wordScore;
    this.sessionStats.wordsFound++;
    this.sessionStats.currentStreak++;
    if (this.sessionStats.currentStreak > this.sessionStats.bestStreak) {
      this.sessionStats.bestStreak = this.sessionStats.currentStreak;
    }
    if (wordResult.isPerfect) {
      this.sessionStats.perfectWords++;
      this.perfectWordStreak++;
    }
    this.sessionStats.averageScore = Math.round(
      this.sessionStats.totalScore / this.sessionStats.wordsFound
    );
    this.wordsHistory.push({
      attempts: 6 - this.remainingAttempts + 1,
      wordScore: wordResult.wordScore,
      bonusPoints: wordResult.bonusPoints,
      isPerfect: wordResult.isPerfect
    });
    this.saveScoreViaBackend(wordResult.wordScore);
    this.saveStats();
  }

  private saveScoreViaBackend(score: number) {
    const playerAlias = this.getCurrentPlayerAlias();
    const userId = this.generateUserIdFromAlias(playerAlias);
    const temps = Math.round((Date.now() - this.wordStartTime) / 1000);
    this.gameService.completeGame(this.currentGameId, score, temps, 6, playerAlias).subscribe({
      next: (response) => {
        console.log('✅ Score sauvé pour', playerAlias, ':', response);
        setTimeout(() => {
          this.loadTopScores();
        }, 500);
      },
      error: (error) => {
        console.error('❌ Erreur sauvegarde pour', playerAlias, ':', error);
      }
    });
  }

  private generateUserIdFromAlias(alias: string): number {
    if (alias.toLowerCase().includes('pouik')) {
      return 4;
    } else if (alias.toLowerCase().includes('test')) {
      return 5;
    } else {
      return 4;
    }
  }

  restartGame() {
    this.isLoading = true;
    this.loadNewWord();
  }

  endGameSession() {
    if (this.sessionStats.wordsFound === 0) {
      this.toastService.info('Aucun mot trouvé !', 2000);
      return;
    }
    this.toastService.success(`🏁 Session terminée ! Score: ${this.sessionStats.totalScore}`, 4000);
    setTimeout(() => {
      this.loadTopScores();
    }, 1000);
    this.resetSession();
    this.restartGame();
  }

  logout() {
    this.modalService.confirm(
      'Déconnexion', 
      'Êtes-vous sûr de vouloir vous déconnecter ?', 
      'Se déconnecter'
    ).then((confirmed: boolean) => {
      if (confirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  startNewGame() {
    this.currentWord = '';
    this.wordLength = 5;
    this.guesses = [];
    this.currentGuess = '';
    this.gameFinished = false;
    this.gameWon = false;
    this.attempts = 0;
    this.maxAttempts = 6;
    this.loadNewWord();
  }

  confirmNewGame() {
    this.modalService.confirm(
      'Nouvelle partie',
      'Êtes-vous sûr de vouloir commencer une nouvelle partie ?'
    ).then((confirmed: boolean) => {
      if (confirmed) {
        this.startNewGame();
      }
    });
  }

  getCurrentPlayerAlias() {
    // UTILISER LE VRAI PSEUDO DE L'UTILISATEUR CONNECTÉ
    const user = this.authService.getUser();
    const realPseudo = user?.pseudo;
    
    if (realPseudo) {
      
      return realPseudo;
    }
    
    // Fallback sur localStorage si pas connecté
    return localStorage.getItem('playerAlias') || localStorage.getItem('gameAlias') || 'Joueur';
  }

  changeAlias() {
    const currentAlias = this.getCurrentPlayerAlias();
    this.modalService.changePseudo(currentAlias).then((newPseudo: string | null) => {
      if (newPseudo && isPlatformBrowser(this.platformId)) {
        localStorage.setItem('playerAlias', newPseudo);
        this.toastService.success(`✅ Pseudo changé: ${newPseudo}`, 2000);
      }
    });
  }

  loadTopScores() {
    this.gameService.getLeaderboard().subscribe({
      next: (scores) => {
        this.topScores = scores.slice(0, 3).map((score: any) => ({
          playerAlias: score.email || score.login || 'Joueur',
          totalScore: score.best_score || score.score || 0,
          wordsFound: score.games_played || 1,
          bestStreak: score.best_streak || 1,
          date: score.date_achieved || new Date().toLocaleDateString('fr-FR')
        }));
      },
      error: (error) => {
        this.topScores = [];
      }
    });
  }

  private resetSession() {
    this.sessionStats = {
      totalScore: 0,
      wordsFound: 0,
      averageScore: 0,
      currentStreak: 0,
      bestStreak: 0,
      perfectWords: 0
    };
    this.wordsHistory = [];
    this.perfectWordStreak = 0;
    this.saveStats();
  }

  private loadSavedStats() {
    if (isPlatformBrowser(this.platformId)) {
      const savedStats = localStorage.getItem('sessionStats');
      const savedHistory = localStorage.getItem('wordsHistory');
      if (savedStats) {
        try {
          this.sessionStats = JSON.parse(savedStats);
        } catch (e) {}
      }
      if (savedHistory) {
        try {
          this.wordsHistory = JSON.parse(savedHistory);
        } catch (e) {}
      }
    }
  }

  private saveStats() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sessionStats', JSON.stringify(this.sessionStats));
      localStorage.setItem('wordsHistory', JSON.stringify(this.wordsHistory));
    }
  }

  openLeaderboardModal() {
    this.showLeaderboardModal = true;
  }

  closeLeaderboardModal() {
    this.showLeaderboardModal = false;
  }
}