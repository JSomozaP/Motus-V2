import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/games'; // ✅ CORRIGER AVEC /games
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // ✅ UTILISER la méthode getToken d'AuthService
  private getToken(): string | null {
    return this.authService.getToken();
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getWordFromTrouveMot(difficulty: string): Observable<any> {
    let url: string;
    
    switch (difficulty) {
      case 'facile':
        url = 'https://trouve-mot.fr/api/sizemax/4';
        break;
      case 'moyen':
        const moyenLengths = [5, 6, 7];
        const randomLength = moyenLengths[Math.floor(Math.random() * moyenLengths.length)];
        url = `https://trouve-mot.fr/api/size/${randomLength}`;
        break;
      case 'difficile':
        const difficileLengths = [6, 7, 8];
        const randomDifficileLength = difficileLengths[Math.floor(Math.random() * difficileLengths.length)];
        url = `https://trouve-mot.fr/api/size/${randomDifficileLength}`;
        break;
      case 'cauchemar':
        url = 'https://trouve-mot.fr/api/sizemin/8';
        break;
      default:
        url = 'https://trouve-mot.fr/api/size/5';
    }
    
    console.log(`🔗 Appel API trouve-mot: ${url}`);
    return this.http.get(url);
  }

  getNewWord(difficulty: string): Observable<any> {
    console.log(`🎯 Demande nouveau mot (difficulté: ${difficulty})`);
    
    return this.getWordFromTrouveMot(difficulty).pipe(
      map((response: any) => {
        console.log('📡 Réponse API reçue');
        
        if (response && response.length > 0) {
          const randomWord = response[Math.floor(Math.random() * response.length)];
          const wordData = {
            gameId: Math.floor(Math.random() * 1000000),
            word: randomWord.name.toUpperCase(),
            firstLetter: randomWord.name.charAt(0).toUpperCase(),
            length: randomWord.name.length
          };
          
          console.log('✅ Nouveau mot généré (sécurisé)');
          return wordData;
        } else {
          console.log('⚠️ Aucun mot trouvé, utilisation fallback');
          return {
            gameId: Math.floor(Math.random() * 1000000),
            word: 'MOTUS',
            firstLetter: 'M',
            length: 5
          };
        }
      }),
      catchError((error) => {
        console.error('❌ Erreur API trouve-mot:', error);
        return of({
          gameId: Math.floor(Math.random() * 1000000),
          word: 'MOTUS',
          firstLetter: 'M',
          length: 5
        });
      })
    );
  }

  submitGuess(gameId: number, guess: string): Observable<any> {
    return this.http.post('/api/game/guess', 
      { gameId, guess }, 
      { headers: this.getHeaders() }
    );
  }

  // ✅ CORRIGER completeGame avec bonne URL
  completeGame(gameId: number, score: number, time: number, attempts: number, playerAlias?: string): Observable<any> {
    const headers = this.getHeaders();
    
    console.log('💾 Appel completeGame vers:', `${this.apiUrl}/${gameId}/complete`);
    
    // ✅ AJOUTER playerAlias dans le body
    return this.http.post(`${this.apiUrl}/${gameId}/complete`, {
      score,
      time,
      attempts,
      playerAlias  // ← NOUVEAU
    }, { headers }).pipe(
      tap(response => {
        console.log('✅ Réponse completeGame:', response);
      }),
      catchError(error => {
        console.error('❌ Erreur completeGame:', error);
        throw error;
      })
    );
  }

  // ✅ CORRIGER getLeaderboard
  getLeaderboard(): Observable<any[]> {
    const headers = this.getHeaders();
    const leaderboardUrl = 'http://localhost:3000/api/leaderboard';
    
    console.log('🔄 Appel leaderboard URL:', leaderboardUrl);
    
    return this.http.get<any[]>(leaderboardUrl, { headers }).pipe(
      tap(response => {
        console.log('✅ Réponse leaderboard:', response);
      }),
      catchError(error => {
        console.error('❌ Erreur leaderboard:', error);
        return of([]);
      })
    );
  }
}
