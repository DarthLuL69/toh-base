import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { MarvelService } from '../marvel.service';
import { MarvelCharacter } from '../marvel-api.interface';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  hero?: MarvelCharacter;

  constructor(
    private route: ActivatedRoute,
    private marvelService: MarvelService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadHero();
  }

  loadHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.marvelService.getCharacter(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }
}