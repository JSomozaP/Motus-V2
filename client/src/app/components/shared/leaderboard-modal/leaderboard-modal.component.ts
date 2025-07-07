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
        console.log('🏆 Modal - Raw data from API:');
        console.table(scores);
        
        this.leaderboard = scores.map((score: any, index: number) => ({
          rank: index + 1,
          playerAlias: score.player_alias || score.email || score.login || 'Joueur',    
          totalScore: score.best_score || score.score || 0,       
          difficulty: score.difficulty || 'facile',
          date: score.date_achieved || new Date().toLocaleDateString('fr-FR')
        }));
        
        console.log('🏆 Modal - Mapped data:');
        console.table(this.leaderboard);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur modal leaderboard:', error);
        this.isLoading = false;
      }
    });
  }

  refresh() {
    this.loadLeaderboard();
  }

  getDifficultyLabel(difficulty: string): string {
    switch(difficulty) {
      case 'facile': return 'Facile';
      case 'moyen': return 'Moyen';
      case 'difficile': return 'Difficile';
      default: return 'Facile';
    }
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
