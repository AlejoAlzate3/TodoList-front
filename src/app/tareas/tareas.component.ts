import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TareaService } from '../tarea.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent {
  tareas: any[] = [];
  formulario: FormGroup = this.fb.group({
    nombre: [],
    completado: [false]
    });
    tareaEnEdicion: any;

    constructor(
      private tareaService: TareaService,
      private fb: FormBuilder
    ) { }

    ngOnInit(): void {
      this.getAll();
    }

    getAll(){
      this.tareaService.getAll()
      .subscribe((tareas: any)=>{
        console.log(tareas);
        this.tareas = tareas._embedded.tareas;
      })
    }

    save(){
      const values = this.formulario.value;

      if(this.tareaEnEdicion){
        this.tareaService.update(this.tareaEnEdicion._links.self.href, values).subscribe(()=>{
          this.getAll();
          this.formulario.reset();
          this.tareaEnEdicion = null;
        })
      }else{
        this.tareaService.create(values).subscribe(()=>{
          this.getAll();
          this.formulario.reset();
        })
      }
    }

    update(tarea: any){
      this.tareaEnEdicion = tarea;
      this.formulario.setValue({
        nombre: tarea.nombre,
        completado: tarea.completado
      })
    }

    delete(tarea: any){
      const ok = confirm('¿Está seguro de eliminar la tarea?');
      if(ok){
        this.tareaService.delete(tarea._links.self.href).subscribe(()=>{
          this.getAll();
        })
      }
    }
}
