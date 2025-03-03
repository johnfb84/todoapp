
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  imports: [ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'hola';
  tasks = signal([
    "tarea 1",
    "tarea 2"
  ])
  name = signal('john')
  age = 30
  disabled = false
  img = "https://"

  person = {
    name: "johnf",
    age: 20,
    avatar: "https://"
  }

  colorControl = new FormControl();
  widthControl= new FormControl(50,{
    nonNullable: true
  })
  nameControl= new FormControl("john",{
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  })

  constructor(){
    this.colorControl.valueChanges.subscribe(value => {
      console.log(value)
    })
  }

  clickHandler(){
    alert("hi")
  }

  changeHandler(evento: Event){
    console.log(evento)
    const input = evento.target as HTMLInputElement
    const newValue =input.value
    this.name.set(newValue)
  }

  keydownHandler(event: KeyboardEvent){
    const input = event.target as HTMLInputElement
    console.log(input.value)
  }
}
