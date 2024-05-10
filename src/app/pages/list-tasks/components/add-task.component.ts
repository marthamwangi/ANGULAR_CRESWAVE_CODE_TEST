import { Component, Inject, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ListTasksComponent } from '../list-tasks.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'ac-add-task-dialog',
  templateUrl: 'add-task-dialog.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class AddTaskDialogComponent {
  #taskService: TaskService = inject(TaskService);
  durationInSeconds = 5;

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    isComplete: new FormControl(false),
  });

  #nextTodoId = this.data.taskLength + 1;

  constructor(
    public dialogRef: MatDialogRef<ListTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskLength: number },
    private _snackBar: MatSnackBar
  ) {}

  onAddTask() {
    this.#taskService
      .$add({
        ...this.taskForm.value,
        id: this.#nextTodoId.toString(),
      })
      .subscribe({
        next: (res) => {
          this.openSnackBar(res.message);
          /**
           * increment the current Id, in case the user wants to add another task
           */
          this.#nextTodoId += 1;
          this.taskForm.reset();
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
