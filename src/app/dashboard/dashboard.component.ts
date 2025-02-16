import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, AfterViewInit } from '@angular/core';
import { MarvelService } from '../marvel.service';
import { MarvelCharacter } from '../marvel-api.interface';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

register();

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  heroes: MarvelCharacter[] = [];
  filteredHeroes: MarvelCharacter[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  swiperConfig = {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
      enabled: true,
      hideOnClick: false,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 25
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    },
    autoplay: false
  };
  suggestions: MarvelCharacter[] = [];
  showSuggestions = false;
  private scrollTimer: any;

  constructor(
    private marvelService: MarvelService,
    private router: Router
  ) {
    this.setupSearch();
    this.setupScrollHandler();
  }

  private setupSearch(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.performSearch(term);
    });
  }

  private setupScrollHandler(): void {
    document.addEventListener('scroll', () => {
      document.body.classList.remove('hide-scrollbar');
      
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      
      this.scrollTimer = setTimeout(() => {
        document.body.classList.add('hide-scrollbar');
      }, 1000);
    }, { passive: true });
  }

  ngOnInit(): void {
    this.getRandomHeroes();
  }

  ngAfterViewInit() {
    const swiperEl = document.querySelector('swiper-container');
    if (swiperEl) {
      Object.assign(swiperEl, this.swiperConfig);
      swiperEl.initialize();
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  }

  onSearchInput(term: string): void {
    this.searchSubject.next(term);
  }

  private performSearch(term: string): void {
    if (term.trim()) {
      this.marvelService.getCharacters(0, 20, term)
        .subscribe(heroes => {
          this.suggestions = heroes;
          this.showSuggestions = true;
        }, error => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
      this.getRandomHeroes();
    }
  }

  selectSuggestion(hero: MarvelCharacter): void {
    this.searchTerm = hero.name;
    this.heroes = [hero];
    this.showSuggestions = false;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  getRandomHeroes(): void {
    this.marvelService.getCharacters(0, 12)
      .subscribe({
        next: (heroes) => {
          this.heroes = heroes;
          this.filteredHeroes = heroes;
          console.log('Heroes loaded:', this.heroes);
        },
        error: (error) => {
          console.error('Error loading heroes:', error);
        }
      });
  }

  goToDetail(id: number): void {
    event?.preventDefault();
    event?.stopPropagation();
    console.log('Navegando al héroe:', id);
    
    setTimeout(() => {
      this.router.navigate(['detail', id])
        .then(() => console.log('Navegación exitosa'))
        .catch(err => console.error('Error en navegación:', err));
    });
  }

  selectHero(hero: MarvelCharacter): void {
    this.searchTerm = hero.name;
    this.showSuggestions = false;
    this.filteredHeroes = [hero];
    this.goToDetail(hero.id);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/default-hero.jpg';
    }
  }
}
