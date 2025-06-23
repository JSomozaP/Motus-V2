import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getWordFromTrouveMot(difficulty: string): Observable<any> {
    let url: string;
    
    switch (difficulty) {
      case 'facile':
        // Mots de 3 à 4 lettres : utiliser sizemax/4
        url = 'https://trouve-mot.fr/api/sizemax/4';
        break;
      case 'moyen':
        // Mots de 5 à 7 lettres : utiliser size/5, size/6 ou size/7 aléatoirement
        const moyenLengths = [5, 6, 7];
        const randomLength = moyenLengths[Math.floor(Math.random() * moyenLengths.length)];
        url = `https://trouve-mot.fr/api/size/${randomLength}`;
        break;
      case 'difficile':
        // Mots de 6 à 8 lettres : utiliser size/6, size/7 ou size/8
        const difficileLengths = [6, 7, 8];
        const randomDifficileLength = difficileLengths[Math.floor(Math.random() * difficileLengths.length)];
        url = `https://trouve-mot.fr/api/size/${randomDifficileLength}`;
        break;
      case 'cauchemar':
        // Mots de minimum 8 lettres : utiliser sizemin/8
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
        console.log('📡 Réponse API reçue'); // Sans les données sensibles
        
        if (response && response.length > 0) {
          const randomWord = response[Math.floor(Math.random() * response.length)];
          const wordData = {
            gameId: Math.floor(Math.random() * 1000000),
            word: randomWord.name.toUpperCase(),
            firstLetter: randomWord.name.charAt(0).toUpperCase(),
            length: randomWord.name.length
          };
          
          console.log('✅ Nouveau mot généré (sécurisé)'); // Sans les données sensibles
          return wordData;
        } else {
          // AJOUTER ce else pour corriger l'erreur :
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

  completeGame(gameId: number, score: number, time: number, attempts: number): Observable<any> {
    const gameData = {
      gameId,
      score,
      time,
      attempts,
      userId: 1 // Ou récupérer l'ID utilisateur réel
    };
    
    // CORRIGER : Utiliser le bon port (3000 au lieu de 4200)
    return this.http.post('http://localhost:3000/api/game/complete', gameData, {
      headers: this.getHeaders()
    });
  }

  getLeaderboard(): Observable<any> {
    // Récupérer le bon token
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    const options: any = {};
    if (token) {
      options.headers = { 'Authorization': `Bearer ${token}` };
    }
    
    return this.http.get('http://localhost:3000/api/leaderboard', options);
  }
}
