import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ac-list-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent {}
