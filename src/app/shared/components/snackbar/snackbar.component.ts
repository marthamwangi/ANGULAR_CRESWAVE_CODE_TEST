import { NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'ac-snackbar',
  standalone: true,
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  imports: [NgIf, MatSnackBarModule],
  providers: [MatSnackBarModule],
})
export class SnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
