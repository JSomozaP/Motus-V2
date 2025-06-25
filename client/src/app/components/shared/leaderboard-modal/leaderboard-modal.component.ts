import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-leaderboard-modal',
  templateUrl: './leaderboard-modal.component.html',
  styleUrls: ['./leaderboard-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LeaderboardModalComponent implements OnInit {
  @Input() isVisible = false;
  @Output() closed = new EventEmitter<void>();

  leaderboard: any[] = [];
  isLoading = false;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    if (this.isVisible) {
      this.loadLeaderboard();
    }
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.loadLeaderboard();
    }
  }

  loadLeaderboard() {
    this.isLoading = true;
    this.gameService.getLeaderboard().subscribe({
      next: (scores) => {
        console.log('📊 Scores reçus pour modal:', scores);
        
        // ✅ CORRIGER le mapping pour afficher les noms :
        this.leaderboard = scores.map((score: any, index: number) => ({
          rank: index + 1,
          playerName: score.login || score.playerAlias || 'Joueur',  // ← AJOUTER login
          totalScore: score.best_score || score.score || 0,
          gamesPlayed: score.games_played || score.wordsFound || 1,
          winRate: Math.round(((score.games_won || score.gamesPlayed || 1) / (score.games_played || 1)) * 100),
          averageScore: Math.round((score.best_score || 0) / (score.games_played || 1))
        }));
        
        console.log('📊 Leaderboard mappé:', this.leaderboard);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur leaderboard modal:', error);
        this.leaderboard = [];
        this.isLoading = false;
      }
    });
  }

  refresh() {
    this.loadLeaderboard();
  }

  close() {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
