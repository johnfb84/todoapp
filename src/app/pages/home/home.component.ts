
import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'

import {Task} from './../../models/task.model';
import { compileHmrUpdateCallback } from '@angular/compiler';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 tasks = signal<Task[]>([
  {
    id: Date.now(),
    title: 'Crear proyecto',
    completed: false
  },
  {
    id: Date.now(),
    title: 'Crear componentes',
    completed: false
  }
  ])

  filter = signal<'all' | 'pending' | 'completed'>('all')

  tasksByFilter = computed(() => {
    const filter = this.filter()
    const tasks = this.tasks()
    if(filter === 'pending'){
      return tasks.filter(task => !task.completed)
    }
    if(filter === 'completed'){
      return tasks.filter(task => task.completed)
    }
    return tasks
  })

  newTaskControl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required
    ]
  })

  injector = inject(Injector)

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const storage = localStorage.getItem('tasks')
    if(storage){
      const tasks = JSON.parse(storage)
      this.tasks.set(tasks)
    }
    this.trackTasks()
  }

  trackTasks() {
    effect(() => {
      const tasks = this.tasks()
      console.log(tasks)
      localStorage.setItem('tasks', JSON.stringify(tasks))
    },{injector: this.injector})
  }

  changeHandler(){
    if(this.newTaskControl.valid){
      const value = this.newTaskControl.value.trim()
      if (value !== ''){
        this.addTask(value)
      this.newTaskControl.setValue('')
      }
    }
  }

  addTask(title: string){
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    }
    this.tasks.update((tasks) =>[...tasks, newTask])
  }

  deleteRasks(index: number){
     this.tasks.update((tasks => tasks.filter((task, position) => position != index)))
  }

  updateTask(index: number){
    this.tasks.update((tasks) =>{
      return tasks.map((task, position) => {
        if(position === index){
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task
      })
    })
  }

  updateTaskEditingMode(index: number){
    this.tasks.update((tasks) =>{
      return tasks.map((task, position) => {
        if(position === index){
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        }
      })
    })
  }

  updateTaskText(index: number, event: Event){
    const input = event.target as HTMLInputElement
    this.tasks.update((tasks) =>{
      return tasks.map((task, position) => {
        if(position === index){
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task
      })
    })
  }

  changeFilter(filter: 'all' | 'pending' | 'completed'){
    this.filter.set(filter)
  }

}
