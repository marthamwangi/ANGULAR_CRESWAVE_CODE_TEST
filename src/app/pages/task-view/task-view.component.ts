import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { ITask } from 'src/app/interfaces/task.interface';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from 'src/app/services/task/task.service';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ac-task-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatCheckboxModule,
    ReactiveFormsModule,
    SnackbarComponent,
    RouterLink,
  ],
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit, OnDestroy {
  #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  #unsubscribe$: Subject<boolean> = new Subject<boolean>();
  #taskService: TaskService = inject(TaskService);

  durationInSeconds = 5;
  constructor(private _snackBar: MatSnackBar) {}

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    isComplete: new FormControl(''),
    id: new FormControl(''),
  });

  task!: ITask;

  ngOnInit(): void {
    this._loadTaskContent();
    this._listenForFormInputChanges();
  }

  ngOnDestroy(): void {
    this.#unsubscribe$.next(true);
    this.#unsubscribe$.complete();
  }

  private _loadTaskContent() {
    this.#activatedRoute.params
      .pipe(takeUntil(this.#unsubscribe$))
      .subscribe((params: any) => {
        this._readTaskData(params.id);
      });
  }

  private _readTaskData(id: string) {
    this.#taskService
      .$fetchOne(id)
      .pipe(takeUntil(this.#unsubscribe$))
      .subscribe({
        next: (task: ITask) => {
          this.task = task;
          if (task) {
            this._patchTaskForm();
          }
        },
      });
  }
  private _patchTaskForm() {
    for (const field in this.taskForm.value) {
      this.taskForm.get(field)?.patchValue(this.task[field]);
    }
  }

  private _listenForFormInputChanges() {
    this.taskForm.valueChanges
      .pipe(takeUntil(this.#unsubscribe$))
      .subscribe(() => {
        this._updateTaskForm(this.taskForm.value);
      });
  }
  private _updateTaskForm(task: any) {
    this.#taskService.$update(task).subscribe({
      next: (res) => {
        this.openSnackBar(res.message);
      },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: this.durationInSeconds * 1000,
      data: { message },
    });
  }
}
