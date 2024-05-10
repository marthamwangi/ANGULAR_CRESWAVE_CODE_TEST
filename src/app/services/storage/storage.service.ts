import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITask } from 'src/app/interfaces/task.interface';
import { StorageAction } from 'src/app/interfaces/types.interface';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #tasks$: BehaviorSubject<Array<ITask>>;

  constructor() {
    this.#tasks$ = new BehaviorSubject<Array<ITask>>([]);
  }

  public setTasks(key: string) {
    this.#tasks$.next(this._getAllFromStorage(key));
  }

  public storageAPI(action: StorageAction, key: string, payload: any): any {
    switch (action) {
      case 'create':
        return payload && this._create(key, payload);
      case 'read':
        switch (payload.read) {
          case 'one':
            return this._read(key, payload.id);
          default:
            return this._fetchAll();
        }
      case 'update':
        return this._update(key, payload.updatedTask);
      case 'delete':
        return this._delete(key, payload.idToDelete);
    }
  }

  private _create(key: string, payload: any) {
    this._updateStorage(key, [...this._getAllFromStorage(key), payload]);
    this.setTasks(key);
  }
  private _read(key: string, taskId: string): any {
    return this._getTaskById(key, taskId);
  }
  private _fetchAll<Input, Output>(): Observable<Array<ITask>> {
    return this.#tasks$;
  }
  private _update(key: string, updatedTask: ITask) {
    const updatedList: Array<ITask> = this._getAllFromStorage(key).map(
      (task: any) => {
        if (task.id === updatedTask.id) {
          for (const taskDetail in task) {
            task[taskDetail] = updatedTask[taskDetail];
          }
        }
        return task;
      }
    );
    this._updateStorage(key, updatedList);
    this.setTasks(key);
  }
  private _getTaskById(key: string, id: string): ITask | undefined {
    return this._getAllFromStorage(key).find((task) => task.id === id);
  }
  private _delete(key: string, idtoDelete: string) {
    const tasksToKeep = this._getAllFromStorage(key).filter(
      (task) => task.id !== idtoDelete
    );
    this._updateStorage(key, tasksToKeep);
    this.setTasks(key);
  }
  private _getAllFromStorage(key: string): Array<ITask> {
    const myTaskList = localStorage.getItem(key);
    if (myTaskList) {
      return JSON.parse(myTaskList);
    }
    return [];
  }

  private _updateStorage(key: string, items: Array<any>) {
    localStorage.setItem(key, JSON.stringify(items));
  }
}
