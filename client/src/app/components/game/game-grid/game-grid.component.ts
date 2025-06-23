import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { ToastService } from '../../../services/toast.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ModalService } from '../../../services/modal.service';
import { KeyboardComponent } from '../keyboard/keyboard.component';

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
    RouterLink  
  ]
})
export class GameGridComponent implements OnInit {
  // ✅ Propriétés de base du jeu
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
  
  // ✅ Authentification
  isAuthenticated = false;
  showLoginModal = false;
  loginAlias = '';
  loginEmail = '';
  loginPassword = '';
  loginError = '';
  loginLoading = false;

  // ✅ États du clavier
  keyStates: { [key: string]: string } = {};

  // ✅ Statistiques de session
  sessionStats = {
    totalScore: 0,
    wordsFound: 0,
    averageScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    perfectWords: 0
  };

  // ✅ Historique et scores
  wordsHistory: Array<{
    attempts: number;
    wordScore: number;
    bonusPoints: number;
    isPerfect: boolean;
  }> = [];

  topScores: any[] = [];

  // ✅ Variables de timing
  perfectWordStreak = 0;
  wordStartTime = Date.now();

  // ✅ Scores et difficulté
  activeScoreTab = 'session';
  currentDifficulty: 'facile' | 'moyen' | 'difficile' | 'cauchemar' = 'facile';
  showDifficultySelector = false;

  currentGameId: number = 0;
  selectedDifficulty: string = 'facile';  
  currentWord: string = '';              

  // ✅ NOUVELLES PROPRIÉTÉS POUR LA NOUVELLE LOGIQUE DE JEU
  guesses: string[] = [];
  currentGuess: string = '';
  gameFinished: boolean = false;
  gameWon: boolean = false;
  attempts: number = 0;
  maxAttempts: number = 6;
  secretWord: string = '';

  constructor(
  private gameService: GameService,
  private authService: AuthService,
  private toastService: ToastService,
  public modalService: ModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthentication();
      
      // Charger la difficulté sauvegardée
      const savedDifficulty = localStorage.getItem('gameDifficulty') as 'facile' | 'moyen' | 'difficile' | 'cauchemar';
      if (savedDifficulty) {
        this.currentDifficulty = savedDifficulty;
        this.setupDifficultySources();
      }

      // Charger les stats sauvegardées
      this.loadSavedStats();
      this.loadTopScores();
    }
  }

  // ✅ MÉTHODES D'AUTHENTIFICATION
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

  // ✅ MÉTHODES DE DIFFICULTÉ
  private setupDifficultySources() {
    if (this.currentDifficulty === 'cauchemar') {
      // this.gameService.enableHardMode();
    } else {
      // this.gameService.disableHardMode();
    }
  }

  getDifficultyLabel(): string {
    const labels = {
      'facile': '🟢 Facile',
      'moyen': '📚 Moyen',
      'difficile': '🔥 Difficile',
      'cauchemar': '💀 Cauchemar'
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

  // ✅ CHARGEMENT DE MOTS - NOUVELLE LOGIQUE UNIFIÉE
  // ✅ CORRIGER la méthode loadNewWord
  private loadNewWord() {
    this.isLoading = true;
    this.errorMessage = '';
    this.wordStartTime = Date.now();
    
    console.log(`🎯 Chargement mot via API trouve-mot unifiée (difficulté: ${this.currentDifficulty})`);
    
    let minLength: number;
    let maxLength: number;
    
    // ✅ Définir les longueurs selon la difficulté
    switch (this.currentDifficulty) {
      case 'facile':
        minLength = 3;
        maxLength = 4;
        console.log('🟢 Mode FACILE: 3-4 lettres');
        break;
      case 'moyen':
        minLength = 5;
        maxLength = 7;
        console.log('📚 Mode MOYEN: 5-7 lettres');
        break;
      case 'difficile':
        minLength = 6;
        maxLength = 9;
        console.log('🔥 Mode DIFFICILE: 6-9 lettres');
        break;
      case 'cauchemar':
        minLength = 6;
        maxLength = 12;
        console.log('💀 Mode CAUCHEMAR: 6-12 lettres');
        break;
      default:
        minLength = 5;
        maxLength = 7;
    }
    
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

  // ✅ FALLBACK AVEC MOTS LOCAUX
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
    console.log(`🔄 Mot fallback ${this.currentDifficulty}:`, randomWord);
  }

  // ✅ MÉTHODES DE GRILLE
  private resetGrid() {
    this.grid = [];
    this.currentRow = 0;
    this.currentCol = 0;
    this.gameOver = false;
    this.wordFound = false;
    this.keyStates = {};
    
    // Créer une grille vide
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
    
    // Placer l'indice sur la première case de chaque ligne
    if (this.hint) {
      for (let i = 0; i < 6; i++) {
        this.grid[i][0].letter = this.hint;
        this.grid[i][0].state = 'hint';
      }
      this.currentCol = 1;
    }
    
    console.log('✅ Grille réinitialisée avec indice:', this.hint);
  }

  // ✅ GESTION DU CLAVIER
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
    if (this.currentCol < this.wordLength && this.currentRow < 6) {
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
    
    // Utiliser la vérification locale
    this.checkWordLocally(guess, attemptNumber);
  }

  // ✅ VÉRIFICATION LOCALE DU MOT
  private checkWordLocally(guess: string, attemptNumber: number) {
    const target = this.targetWord;
    console.log('🔍 Vérification locale:', { guess, longueur: target.length, attemptNumber });
    
    const result: Array<{status: 'correct' | 'present' | 'absent'}> = [];
    
    // Algorithme Motus standard
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    const targetLetterCount: {[key: string]: number} = {};
    
    // Compter les lettres du mot cible
    for (const letter of targetLetters) {
      targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
    }
    
    // Première passe : lettres correctes
    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = { status: 'correct' };
        targetLetterCount[guessLetters[i]]--;
      } else {
        result[i] = { status: 'absent' };
      }
    }
    
    // Deuxième passe : lettres présentes
    for (let i = 0; i < guessLetters.length; i++) {
      if (result[i].status === 'absent') {
        if (targetLetterCount[guessLetters[i]] > 0) {
          result[i] = { status: 'present' };
          targetLetterCount[guessLetters[i]]--;
        }
      }
    }
    
    // Mise à jour de la grille
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
    
    // Mise à jour du clavier
    const keyStates = result.map(r => {
      switch (r.status) {
        case 'correct': return 'correct';
        case 'present': return 'present';
        case 'absent': 
        default: return 'incorrect';
      }
    });
    
    this.updateKeyStates(guess, keyStates);

    // Vérifier si le mot est trouvé
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

  // ✅ MISE À JOUR DES ÉTATS DU CLAVIER
  private updateKeyStates(guess: string, states: string[]) {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const state = states[i];
      
      // Ne pas dégrader l'état (correct > present > incorrect)
      if (!this.keyStates[letter] || 
          (state === 'correct') ||
          (state === 'present' && this.keyStates[letter] !== 'correct')) {
        this.keyStates[letter] = state;
      }
    }
  }

  // ✅ TRAITEMENT DES RÉPONSES
  private handleWordCheckResponse(response: any, guess: string, attemptNumber: number) {
    console.log('🎯 Traitement réponse:', { response, guess, attemptNumber });
    
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

  // ✅ CALCUL DU SCORE
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

  // ✅ MISE À JOUR DES STATISTIQUES
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

  // ✅ SAUVEGARDE VIA BACKEND
  private saveScoreViaBackend(score: number) {
    const userId = 1;
    const temps = Math.round((Date.now() - this.wordStartTime) / 1000);
    const motId = this.gameId || Date.now();
    
    this.gameService.completeGame(this.currentGameId, score, temps, 6).subscribe({
      next: (response) => {
        console.log('💾 Score sauvegardé via backend:', response);
      },
      error: (error) => {
        console.warn('⚠️ Erreur sauvegarde score backend:', error);
      }
    });
  }

  // ✅ MÉTHODES DE CONTRÔLE DU JEU
  restartGame() {
    console.log('🔄 Redémarrage jeu');
    this.isLoading = true;
    this.loadNewWord();
  }

  endGameSession() {
    if (this.sessionStats.wordsFound === 0) {
      this.toastService.info('Aucun mot trouvé !', 2000);
      return;
    }

    this.saveScoreToTopScores();
    this.toastService.success(`🏁 Session terminée ! Score: ${this.sessionStats.totalScore}`, 4000);
    this.resetSession();
    this.restartGame();
  }

  logout() {
    this.modalService.confirm(
      'Confirmer la déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?'
    ).then((confirmed: boolean) => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }

  startNewGame() {
    console.log('🔄 Démarrage nouvelle partie');
    
    // Réinitialiser les variables de jeu
    this.currentWord = '';
    this.wordLength = 5;
    this.guesses = [];
    this.currentGuess = '';
    this.gameFinished = false;
    this.gameWon = false;
    this.attempts = 0;
    this.maxAttempts = 6;
    
    // Charger un nouveau mot
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

  // ✅ MÉTHODES UTILITAIRES
  getCurrentPlayerAlias(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('playerAlias') || localStorage.getItem('gameAlias') || 'Joueur';
    }
    return 'Joueur';
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

  // ✅ CHARGEMENT DU LEADERBOARD
  loadTopScores() {
    console.log('🔄 Chargement TOP 3...');
    
    this.gameService.getLeaderboard().subscribe({
      next: (scores) => {
        console.log('✅ Scores reçus:', scores);
        
        this.topScores = scores.slice(0, 3).map((score: any) => ({
          playerAlias: score.login,
          totalScore: score.score,
          wordsFound: score.words_found,
          bestStreak: 1,
          date: score.date_achieved
        }));
        
        console.log('🏆 TOP 3 adapté:', this.topScores);
      },
      error: (error) => {
        console.error('❌ Erreur chargement TOP 3:', error);
        this.topScores = [];
      }
    });
  }

  // ✅ GESTION DES SCORES LOCAUX
  private saveScoreToTopScores() {
    const newScore = {
      playerAlias: this.getCurrentPlayerAlias(),
      totalScore: this.sessionStats.totalScore,
      wordsFound: this.sessionStats.wordsFound,
      bestStreak: this.sessionStats.bestStreak,
      date: new Date().toLocaleDateString('fr-FR')
    };

    this.topScores.push(newScore);
    this.topScores.sort((a, b) => b.totalScore - a.totalScore);
    this.topScores = this.topScores.slice(0, 10);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('topScores', JSON.stringify(this.topScores));
    }
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
        } catch (e) {
          console.warn('Erreur chargement stats:', e);
        }
      }
      
      if (savedHistory) {
        try {
          this.wordsHistory = JSON.parse(savedHistory);
        } catch (e) {
          console.warn('Erreur chargement historique:', e);
        }
      }
    }
  }

  private saveStats() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sessionStats', JSON.stringify(this.sessionStats));
      localStorage.setItem('wordsHistory', JSON.stringify(this.wordsHistory));
    }
  }
}
