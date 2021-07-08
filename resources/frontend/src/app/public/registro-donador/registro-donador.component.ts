import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-registro-donador',
  templateUrl: './registro-donador.component.html',
  styleUrls: ['./registro-donador.component.css']
})
export class RegistroDonadorComponent implements OnInit {

  isLoading:boolean;
  isValidatingCURP:boolean;
  CURP:string;

  isLinear:boolean = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.CURP = '';
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  validarCurp(){
    if(this.CURP.length == 18){
      this.isValidatingCURP = !this.isValidatingCURP;
    }else{
      console.log('CURP invalida');
    }
  }

}
