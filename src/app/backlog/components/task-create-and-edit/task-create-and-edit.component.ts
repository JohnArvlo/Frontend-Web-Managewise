import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { NgFor } from "@angular/common";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Task } from "../../model/task.entity";

import {UserStoriesService} from "../../services/user-stories.service";
import {UserStory} from "../../model/user-story.entity";

@Component({
  selector: 'app-task-create-and-edit',
  standalone: true,
  imports: [MatCardModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './task-create-and-edit.component.html',
  styleUrls: ['./task-create-and-edit.component.css']
})
export class TaskCreateAndEditComponent {
  newTask: Task;
  newUserStory: UserStory;

  constructor(
    private userStoryService: UserStoriesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TaskCreateAndEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, userStory: UserStory }
  ) {
    this.newTask = data.task ? { ...data.task } : new Task(0, '', '', 'TO_DO', 0);
    this.newUserStory = data.userStory;
  }

  onSubmit(): void {
    if (this.newTask.taskId) {
      this.userStoryService.updateTask(this.newUserStory.id, this.newTask.taskId, this.newTask).subscribe(() => {
        this.dialogRef.close(true);
      }, error => {
        console.error("Error al actualizar la tarea", error);
      });
    } else {
      this.userStoryService.addTask(this.newUserStory.id, this.newTask).subscribe(() => {
        this.dialogRef.close(true);
      }, error => {
        console.error("Error al agregar la tarea", error);
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close(false);
  }
}
