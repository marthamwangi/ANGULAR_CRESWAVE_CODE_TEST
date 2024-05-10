import { Injectable, inject } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { IResponse, ITask } from 'src/app/interfaces/task.interface';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { TASKS_STORAGE_KEY } from 'src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  #storageService: StorageService = inject(StorageService);

  /**
   * Have a mock from an array
   * @returns
   */
  $fetchAll(): Observable<Array<ITask>> {
    return new Observable((subscriber) => {
      (
        this.#storageService.storageAPI('read', TASKS_STORAGE_KEY, {
          read: 'default',
        }) as BehaviorSubject<Array<ITask>>
      ).subscribe({
        next: (data) => subscriber.next(data),
      });
    });
  }

  $fetchOne(id: string): Observable<ITask> {
    const task = this.#storageService.storageAPI('read', TASKS_STORAGE_KEY, {
      read: 'one',
      id,
    });
    return of(task);
  }

  $add(payload: any): Observable<IResponse> {
    this.#storageService.storageAPI('create', TASKS_STORAGE_KEY, payload);
    const data: IResponse = {
      success: true,
      message: 'Task added successfully',
      data: payload,
    };
    return of(data);
  }

  $update(updatedTask: ITask): Observable<IResponse> {
    const task = this.#storageService.storageAPI('update', TASKS_STORAGE_KEY, {
      updatedTask,
    });
    const data: IResponse = {
      success: true,
      message: 'Task updated successfully',
      data: task,
    };
    return of(data);
  }

  $delete(idToDelete: string): Observable<IResponse> {
    this.#storageService.storageAPI('delete', TASKS_STORAGE_KEY, {
      idToDelete,
    });
    const data: IResponse = {
      success: true,
      message: 'Task deleted successfully',
      data: idToDelete,
    };
    return of(data);
  }
}
