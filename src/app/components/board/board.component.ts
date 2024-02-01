import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { board, task } from 'src/app/interfaces/task';
import { STATUS } from 'src/app/interfaces/task';
import * as data from '../../../assets/board.json';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  todo: Array<task> = []; /*  = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep',
  ]; */

  inProgress: Array<task> = []; /* = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog',
  ]; */

  done: Array<any> = [];

  newTaskTitleTodo = new FormControl<string>('');
  newTaskTitleInProgress = new FormControl<string>('');
  statusTypes = STATUS;
  board: board | any = null;

  constructor() {}

  ngOnInit(): void {
    this.board = data;
    console.log(this.board);
    this.todo = this.board.taskList.filter((task) => {
      task.status === this.statusTypes.TODO;
    });
    this.inProgress = this.board.taskList.filter((task) => {
      task.status === this.statusTypes.IN_PROGRESS;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private getStatusComponentData(status: string): any {
    const map = {
      TODO: {
        list: this.todo,
        formControlValue: this.newTaskTitleTodo.value,
      },
      IN_PROGRESS: {
        list: this.inProgress,
        formControlValue: this.newTaskTitleInProgress.value,
      },
    };
    return map[status];
  }

  private generateUniqueID() {
    return Math.floor(Math.random() * Date.now()).toString(16);
  }

  addNewTask(type: STATUS) {
    const statusObject = this.getStatusComponentData(type);
    const newTask: task = {
      title: statusObject.formControlValue,
      id: this.generateUniqueID(),
      status: type,
      detail: '',
    };
    statusObject.list.push(newTask);
  }
}
