import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-purchase-confirmation',
  templateUrl: './purchase-confirmation.component.html',
})
export class PurchaseConfirmationComponent implements OnInit {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  kupovinaId: string = '';
  stavke: any[] = [];
  nacinPlacanja = '';
  datum = new Date();
  ukupno = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;

    if (
      !state.kupovinaId ||
      !state.stavke ||
      state.stavke.length === 0 ||
      !state.nacinPlacanja
    ) {
      this.router.navigate(['/']);
      return;
    }

    this.kupovinaId = state.kupovinaId || '';
    this.stavke = state.stavke || [];
    this.nacinPlacanja = state.nacinPlacanja || '';
    this.datum = state.datum || new Date();
    this.ukupno = state.ukupno || 0;
  }

  private ucitajSlikuBase64(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject('Nije moguće učitati sliku.');
        }
      };
      img.onerror = () => reject('Greška pri učitavanju slike.');
    });
  }

  async preuzmiPDF(): Promise<void> {
    try {
      const logoImg =
        this.pdfContent.nativeElement.querySelector('img[alt="Logo"]');
      const qrImg =
        this.pdfContent.nativeElement.querySelector('img[alt="QR Kod"]');

      if (logoImg) {
        const base64 = await this.ucitajSlikuBase64('assets/logoCrni.png');
        logoImg.src = base64;
      }

      if (qrImg) {
        const base64 = await this.ucitajSlikuBase64('assets/qrKod.png');
        qrImg.src = base64;
      }

      setTimeout(() => {
        const opt = {
          margin: 0.5,
          filename: 'potvrda-kupovine.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };

        html2pdf().from(this.pdfContent.nativeElement).set(opt).save();
      }, 300); // malo čekanje da se slike ažuriraju
    } catch (err) {
      console.error('Greška prilikom generisanja PDF-a:', err);
      alert('Došlo je do greške prilikom preuzimanja potvrde.');
    }
  }
}
