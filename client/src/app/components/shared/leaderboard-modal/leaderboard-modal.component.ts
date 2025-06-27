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
    this.gameService.getLeaderboard().subscribe({
      next: (scores) => {
        console.log('🏆 Modal - Raw data from API:');
        console.table(scores);
        
        
        this.leaderboard = scores.map((score: any, index: number) => ({
          rank: index + 1,
          playerAlias: score.email || score.login || 'Joueur',    
          totalScore: score.best_score || score.score || 0,       
          wordsFound: score.games_played || 1,                    
          date: score.date_achieved || new Date().toLocaleDateString('fr-FR')
        }));
        
        console.log('🏆 Modal - Mapped data:');
        console.table(this.leaderboard);
      },
      error: (error) => {
        console.error('❌ Erreur modal leaderboard:', error);
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
