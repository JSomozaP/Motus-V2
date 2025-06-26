import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/games';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Méthode getToken d'AuthService
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
    
    return this.http.get(url);
  }

  private isValidWord(word: string): boolean {
    // Caractères autorisés : A-Z uniquement (sans accents ni ligatures)
    const allowedChars = /^[A-Z]+$/;
    
    // Caractères interdits courants
    const forbiddenChars = /[ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸŒ]/i;
    
    return allowedChars.test(word) && !forbiddenChars.test(word);
  }

  private getFallbackWord(): any {
    const fallbackWords = ['MOTUS', 'ROYAL', 'PIANO', 'FLEUR', 'BOIRE'];
    const randomFallback = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    
    return {
      gameId: Math.floor(Math.random() * 1000000),
      word: randomFallback,
      firstLetter: randomFallback.charAt(0),
      length: randomFallback.length
    };
  }

  getNewWord(difficulty: string): Observable<any> {
    console.log(`🎯 Demande nouveau mot (difficulté: ${difficulty})`);
    
    return this.getWordFromTrouveMot(difficulty).pipe(
      map((response: any) => {
        
        if (response && response.length > 0) {
          // FILTRE les mots valides seulement
          const validWords = response.filter((word: any) => 
            this.isValidWord(word.name.toUpperCase())
          );
          
          if (validWords.length === 0) {
            return this.getFallbackWord();
          }
          
          const randomWord = validWords[Math.floor(Math.random() * validWords.length)];
          const wordData = {
            gameId: Math.floor(Math.random() * 1000000),
            word: randomWord.name.toUpperCase(),
            firstLetter: randomWord.name.charAt(0).toUpperCase(),
            length: randomWord.name.length
          };
          
          console.log('✅ Mot valide généré (sans caractères spéciaux)');
          return wordData;
        } else {
          return this.getFallbackWord();
        }
      }),
      catchError((error) => {
        console.error('❌ Erreur API trouve-mot:', error);
        return of(this.getFallbackWord());
      })
    );
  }

  submitGuess(gameId: number, guess: string): Observable<any> {
    return this.http.post('/api/game/guess', 
      { gameId, guess }, 
      { headers: this.getHeaders() }
    );
  }

  
  completeGame(gameId: number, score: number, time: number, attempts: number, playerAlias?: string): Observable<any> {
    const headers = this.getHeaders();
    
    
  
    return this.http.post(`${this.apiUrl}/${gameId}/complete`, {
      score,
      time,
      attempts,
      playerAlias  
    }, { headers }).pipe(
      tap(response => {
      }),
      catchError(error => {
        console.error('❌ Erreur completeGame:', error);
        throw error;
      })
    );
  }

  
  getLeaderboard(): Observable<any[]> {
    const headers = this.getHeaders();
    const leaderboardUrl = 'http://localhost:3000/api/leaderboard';
    
    
    return this.http.get<any[]>(leaderboardUrl, { headers }).pipe(
      tap(response => {
      }),
      catchError(error => {
        console.error('❌ Erreur leaderboard:', error);
        return of([]);
      })
    );
  }
}
