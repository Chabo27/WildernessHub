import { Component } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
  komentari = [
    {
      ime: 'Ana V.',
      grad: 'Podgorica',
      tekst: 'Brza isporuka i vrhunski domaći proizvodi. Preporučujem!',
      ocjena: 5
    },
    {
      ime: 'Marko P.',
      grad: 'Nikšić',
      tekst: 'Konačno platforma gdje mogu podržati naše proizvođače.',
      ocjena: 4
    },
    {
      ime: 'Jelena M.',
      grad: '',
      tekst: 'Jednostavna kupovina, odličan kvalitet i lijep dizajn sajta.',
      ocjena: 5
    }
  ];
}
