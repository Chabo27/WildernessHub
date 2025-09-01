import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss'],
})
export class BenefitsComponent implements AfterViewInit {
  razlozi = [
    {
      ikona: 'fas fa-store',
      naslov: 'Domaći brendovi',
      opis: 'Podržavamo autentične crnogorske proizvođače.'
    },
    {
      ikona: 'fas fa-shipping-fast',
      naslov: 'Brza dostava',
      opis: 'Paketi stižu brzo i sigurno do vaših vrata.'
    },
    {
      ikona: 'fas fa-lock',
      naslov: 'Sigurna kupovina',
      opis: 'Zaštićeni podaci i pouzdane transakcije.'
    },
    {
      ikona: 'fas fa-star',
      naslov: 'Zadovoljni kupci',
      opis: 'Povjerenje hiljada zadovoljnih korisnika.'
    }
  ];

  @ViewChildren('benefitCard') benefitCards!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    this.benefitCards.forEach(card => {
      observer.observe(card.nativeElement);
    });
  }
}
