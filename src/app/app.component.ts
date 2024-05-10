import { Component, OnInit, inject } from '@angular/core';
import { StorageService } from './services/storage/storage.service';
import { TASKS_STORAGE_KEY } from './constants';
import { ITask } from './interfaces/task.interface';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  title = 'ANGULAR_CRESWAVE_CODE_TEST';
  #storageService: StorageService = inject(StorageService);
  #mockData: Array<ITask> = [
    {
      id: '1',
      title: 'Walk the dog',
      description: 'Before it chews on my shoes again',
      isComplete: false,
    },
    {
      id: '2',
      title: 'Learn about JSON',
      description: 'Seems useful for data storage',
      isComplete: true,
    },
    {
      id: '3',
      title: 'Grocery shopping',
      description: 'Milk, bread, and that new cereal',
      isComplete: false,
    },
  ];

  ngOnInit() {
    localStorage.removeItem(TASKS_STORAGE_KEY);
    this._createLocalStorage();
  }

  private _createLocalStorage() {
    this.#mockData.forEach((data) =>
      this.#storageService.storageAPI('create', TASKS_STORAGE_KEY, data)
    );
  }
}
