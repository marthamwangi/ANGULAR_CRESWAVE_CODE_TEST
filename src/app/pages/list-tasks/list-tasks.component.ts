import { Component, inject } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ITask } from 'src/app/interfaces/task.interface';
import { TaskService } from 'src/app/services/task/task.service';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from './components/add-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ac-list-tasks',
  standalone: true,
  imports: [MatTableModule, AsyncPipe, NgIf, MatCardModule, SnackbarComponent],
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent {
  #taskService: TaskService = inject(TaskService);
  #tasks: Array<ITask> = [];
  #unsubscribe$: Subject<boolean> = new Subject<boolean>();
  #router: Router = inject(Router);
  durationInSeconds = 5;

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  renderedTasks$: BehaviorSubject<Array<ITask>> = new BehaviorSubject<
    Array<ITask>
  >([]);
  taskIdsToDelete: Array<string> = [];
  taskToDelete: ITask | null = null;
  displayedColumns: Array<string> = ['#', 'title', 'description', 'actions'];
  clickedTasks = new Set<ITask>();

  ngOnDestroy(): void {
    this.#unsubscribe$.next(true);
    this.#unsubscribe$.complete();
  }

  ngOnInit() {
    this._listenTasksChanges();
  }

  private _listenTasksChanges() {
    this.#taskService
      .$fetchAll()
      .pipe(takeUntil(this.#unsubscribe$))
      .subscribe({
        next: (tasks: any) => {
          this.renderedTasks$.next(tasks);
          this.#tasks = tasks;
        },
      });
  }
  onRowClick(task: ITask) {
    this.#router.navigateByUrl(`tasks/${task.id}`);
  }
  onTaskEditClick(task: ITask) {
    this.#router.navigateByUrl(`tasks/${task.id}`);
  }

  onCompleteClick($clickEvent: MouseEvent, task: ITask) {
    $clickEvent.stopImmediatePropagation();
    $clickEvent.preventDefault();
    task.isComplete = !task.isComplete;
    this.#taskService.$update(task).subscribe({
      next: (res) => {
        this.openSnackBar(res.message);
      },
    });
  }

  onTaskDelete($clickEvent: MouseEvent, task: ITask) {
    $clickEvent.stopImmediatePropagation();
    $clickEvent.preventDefault();
    this.#taskService.$delete(task.id).subscribe({
      next: (res) => {
        this.openSnackBar(res.message);
      },
    });
  }
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AddTaskDialogComponent, {
      width: '603px',
      data: { taskLength: this.#tasks.length },
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: this.durationInSeconds * 1000,
      data: { message },
    });
  }
}
