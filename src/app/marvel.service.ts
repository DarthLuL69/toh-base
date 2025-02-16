import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MarvelResponse, MarvelCharacter } from './marvel-api.interface';

@Injectable({
  providedIn: 'root'
})
export class MarvelService {
  private readonly apiUrl = 'http://gateway.marvel.com/v1/public/characters';
  private readonly apiKey = 'b4309fc5185d0cf909dba29f19c78c35';
  private readonly hash = '6c774151b6ee45b61a5ece9d3ffcbfc6';
  private readonly ts = 'aviones';

  constructor(private readonly http: HttpClient) {}

  getCharacters(offset: number = 0, limit: number = 20, nameStartsWith?: string): Observable<MarvelCharacter[]> {
    let url = `${this.apiUrl}?ts=${this.ts}&apikey=${this.apiKey}&hash=${this.hash}&limit=${limit}&offset=${offset}`;
    if (nameStartsWith) {
      url += `&nameStartsWith=${nameStartsWith}`;
    }
    return this.http.get<MarvelResponse>(url).pipe(
      map((response: MarvelResponse) => response.data.results)
    );
  }

  getCharacterById(id: number): Observable<MarvelCharacter> {
    const url = `${this.apiUrl}/${id}?ts=${this.ts}&apikey=${this.apiKey}&hash=${this.hash}`;
    return this.http.get<MarvelResponse>(url).pipe(
      map((response: MarvelResponse) => response.data.results[0])
    );
  }

  getCharacter(id: number): Observable<MarvelCharacter> {
    const url = `${this.apiUrl}/${id}?ts=${this.ts}&apikey=${this.apiKey}&hash=${this.hash}`;
    return this.http.get<MarvelResponse>(url).pipe(
      map(response => {
        const hero = response.data.results[0];
        if (!hero) {
          throw new Error('Hero not found');
        }
        return hero;
      }),
      catchError(this.handleError<MarvelCharacter>('getCharacter'))
    );
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of({} as T);
    };
  }
}
