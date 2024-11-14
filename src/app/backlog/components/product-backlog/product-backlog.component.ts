import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import { UserStory } from "../../model/user-story.entity";
import { UserStoriesService } from "../../services/user-stories.service";
import { MatIcon } from "@angular/material/icon";

import { Sprint } from "../../model/sprint.entity";
import { SprintService } from "../../services/sprints.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-product-backlog',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, CommonModule, MatIcon, FormsModule],
  templateUrl: './product-backlog.component.html',
  styleUrl: './product-backlog.component.css'
})
export class ProductBacklogComponent {
  userStories: Array<UserStory> = [];

  productBacklog: Array<UserStory> = [];
  sprintBacklog: Array<UserStory> = [];
  usersprints: Array<UserStory> = [];

  sprints: Array<Sprint> = [];
  newSprint: Sprint = new Sprint(0, '', '', 'Active', new Date(), new Date());

  constructor(private userStoriesService: UserStoriesService,
              private sprintsService: SprintService) {}

  // Cargar todas las historias de usuario
  private getAllUserStories(): void {
    this.userStoriesService.getAll()
      .subscribe((response: any) => {
        this.productBacklog = response.filter((story: UserStory) => story.sprintBacklogId == null);
        //this.sprintBacklog = response.filter((story: UserStory) => story.sprintBacklogId != null);
        this.usersprints = response;
      });
  }

  //cargar los sprints
  private getAllSprints(): void {
    this.sprintsService.getAll()
      .subscribe((response: any) => {
        this.sprints = response;
      });
  }

  // Metodo para crear un nuevo Sprint
  createSprint(): void {
    this.sprintsService.create(this.newSprint).subscribe((sprint: Sprint) => {
      console.log('Sprint creado:', sprint);
      this.sprintBacklog.forEach(userStory => {
        userStory.sprintBacklogId = sprint.id;
        this.userStoriesService.update(userStory.id, userStory).subscribe(
          (updatedUserStory: UserStory) => {
            console.log('User story actualizada:', updatedUserStory);
          },
          (error) => {
            console.error('Error al actualizar la user story:', error);
          }
        );
      });
      this.resetSprintForm(); // Restablecer el formulario después de crear el sprint
      this.getAllSprints();
    }, (error) => {
      console.error('Error al crear el sprint:', error);
    });
  }

  // Metodo para restablecer el formulario
  private resetSprintForm(): void {
    this.newSprint = new Sprint(0, '', '', 'Active', new Date(), new Date());
  }


  // Mover historia de sprintBacklog a productBacklog
  onDeleteUserStory(element: UserStory) {
    // Eliminar del sprintBacklog
    this.sprintBacklog = this.sprintBacklog.filter((userStory: UserStory) => userStory.id !== element.id);
    // Agregar al productBacklog
    this.productBacklog.push(element);
  }

  // Mover historia de productBacklog a sprintBacklog
  onAddUserStory(element: UserStory) {
    // Eliminar del productBacklog
    this.productBacklog = this.productBacklog.filter((userStory: UserStory) => userStory.id !== element.id);
    // Agregar al sprintBacklog
    this.sprintBacklog.push(element);
  }

  closeSprint(sprint: Sprint) {
    sprint.status = 'Closed';
    this.sprintsService.update(sprint.id, sprint).subscribe(
      (updatedSprint: Sprint) => {
        console.log('Sprint actualizado:', updatedSprint);
        this.sprintBacklog = this.sprintBacklog.filter(userStory => userStory.sprintBacklogId !== sprint.id);
      },
      (error) => {
        console.error('Error al actualizar el sprint:', error);
      }
    );
  }

  isSprintActive(): boolean {
    if (this.sprints.find(sprint => sprint.status === 'Active')) {
      return true;
    }
    return false;
  }


  ngOnInit(): void {
    this.getAllUserStories();
    this.getAllSprints();
  }
}
