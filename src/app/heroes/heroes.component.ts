import { Component, OnInit } from '@angular/core';
import { MarvelService } from '../marvel.service';
import { MarvelCharacter } from '../marvel-api.interface';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  characters: MarvelCharacter[] = [];
  currentPage = 0;
  itemsPerPage = 20;

  constructor(private marvelService: MarvelService) {}

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(): void {
    const offset = this.currentPage * this.itemsPerPage;
    this.marvelService.getCharacters(offset, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.characters = response;
          console.log('Heroes loaded:', this.characters); // Para depuración
        },
        error: (error) => {
          console.error('Error loading heroes:', error);
        }
      });
  }

  trackById(index: number, hero: MarvelCharacter): number {
    return hero.id;
  }

  getTotalPages(): number {
    return Math.ceil(100 / this.itemsPerPage); // Ajusta según el total real de héroes
  }

  isLastPage(): boolean {
    return this.currentPage >= this.getTotalPages() - 1;
  }

  nextPage(): void {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.loadHeroes();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadHeroes();
    }
  }
}
