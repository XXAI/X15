import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { PublicService } from '../public.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute } from '@angular/router';

import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-registro-donador',
  templateUrl: './registro-donador.component.html',
  styleUrls: ['./registro-donador.component.css']
})
export class RegistroDonadorComponent implements OnInit {

  isLoading:boolean;
  isValidatingCURP:boolean;
  CURP:string;

  persona_id:number = 0;

  catalogos: any = {};
  filteredCatalogs:any = {};

  isLoadingPDF: boolean = false;
  showMyStepper:boolean = false;
  showReportForm:boolean = false;
  stepperConfig:any = {};
  reportTitle:string;
  reportIncludeSigns:boolean = false;

  selectedItemIndex: number = -1;
  fechaActual:any = '';

  isLinear:boolean = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  donadoresForm:FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private publicService: PublicService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.CURP = 'GODJ880827HDFSZV05';
    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });

    this.fechaActual = new Date();

    this.donadoresForm = this.fb.group ({

      id:[''],
      nombre:['JAVIER ALEJANDRO',Validators.required],
      a_paterno:['GOSAIN'],
      a_materno:['DÍAZ'],
      edad:['33',Validators.required],
      fecha_nacimiento:['1988-08-27',Validators.required],
      curp:['GODJ880827HDFSZV05', Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      genero:['M',Validators.required],
      codigo_postal:['29050',Validators.required],
      ciudad:['TUX',Validators.required],
      estado:[''],
      estado_id:['7',Validators.required],
      email: ['ASD@HOTMAIL.COM', [Validators.required, Validators.email]],
      telefono_contacto:['6125475'],

    });

    this.route.params.subscribe(params => {
      
      this.persona_id = params['id'];
      if(this.persona_id){

        console.log("hay un ID");

      }

  });

    this.IniciarCatalogos(null);


  }

  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;

    let carga_catalogos = [
      {nombre:'estados',orden:'nombre'},
    ];

    this.publicService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['estados'] = this.donadoresForm.get('estado_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados','nombre')));
      
        if(obj)
        {
          //this.donadoresForm.get('estado_id').setValue(obj.estado);
        }
        this.isLoading = false; 
      } 
    );

  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    if(this.catalogos[catalog]){
      let filterValue = '';
      if(value){
        if(typeof(value) == 'object'){
          filterValue = value[valueField].toLowerCase();
        }else{
          filterValue = value.toLowerCase();
        }
      }
      return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  validarCurp(){
    if(this.CURP.length == 18){
      this.isValidatingCURP = !this.isValidatingCURP;
    }else{
      console.log('CURP invalida');
    }
  }

  CalcularEdad() {

    if (this.donadoresForm.get('fecha_nacimiento').value) {
      
        var timeDiff = Math.abs(Date.now() - this.donadoresForm.get('fecha_nacimiento').value);
        var edad =  Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);

        console.log("edda", edad);

        this.donadoresForm.get('edad').patchValue(edad);        

    } else {
        this.donadoresForm.get('edad').patchValue('');
    }

  }

  soloNumeros(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  guardarDonante(){

    let formData =  JSON.parse(JSON.stringify(this.donadoresForm.value));

    if(formData.estado_id){
      formData.estado_id = formData.estado_id.id;
    }

    // let datoGuardado = {
    //   data: formData
    // }

    this.isLoading = true;

    if(this.persona_id > 0 ){

      this.publicService.updateDonante(this.persona_id, formData).subscribe(
        response =>{
          //this.dialogRef.close(true);
          this.isLoading = false;

          var Message = "";            

          Message = "Se Editaron los datos del Donante: "+" "+response.data.nombre+" "+response.data.a_paterno+" "+response.data.a_materno+" "+" con Éxito!";

          this.sharedService.showSnackBar(Message, 'Cerrar', 5000);
          this.router.navigate(['/registro']);

        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });

    }else{

      this.publicService.createDonante(formData).subscribe(
        response =>{
          console.log(response);
          this.isLoading = false;

          var Message = "Donante Registrado con Éxito!";

          this.sharedService.showSnackBar(Message, 'Cerrar', 3000);
          this.registroDonante(response.datos, response.datos.id);
          this.router.navigate(['/registro']);
      },
        errorResponse => {
          console.log(errorResponse);
          this.reponseErrorsPaciente(errorResponse);
          this.isLoading = false;
      });
    }

  }

  reponseErrorsPaciente(errorResponse:any){

    if(errorResponse.error.errores){

      for(let i in errorResponse.error.errores){

        if(i == 'curp'){
          let errores = errorResponse.error.errores[i];
          for(let j in errores){

              let message = errores[j];

              this.sharedService.showSnackBar(message, 'Cerrar', 7000);
          }
          break;
        }
      }
    }
  }

  registroDonante(obj, index){

    console.log("acaaa",obj);

    this.selectedItemIndex = index;

      //this.showMyStepper = true;
      this.isLoadingPDF = true;
      this.showMyStepper = true;
      this.showReportForm = false;

      let params:any = {};
      let countFilter = 0;
      let fecha_reporte = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'numeric', day: '2-digit'}).format(new Date());

      let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
      
      params.reporte = 'registro-donador';
      if(appStoredData['searchQuery']){
        params.query = appStoredData['searchQuery'];
      }
      this.stepperConfig = {
        steps:[
          {
            status: 1, //1:standBy, 2:active, 3:done, 0:error
            label: { standBy: 'Cargar Datos', active: 'Cargando Datos', done: 'Datos Cargados' },
            icon: 'settings_remote',
            errorMessage: '',
          },
          {
            status: 1, //1:standBy, 2:active, 3:done, 0:error
            label: { standBy: 'Generar PDF', active: 'Generando PDF', done: 'PDF Generado' },
            icon: 'settings_applications',
            errorMessage: '',
          },
          {
            status: 1, //1:standBy, 2:active, 3:done, 0:error
            label: { standBy: 'Descargar Archivo', active: 'Descargando Archivo', done: 'Archivo Descargado' },
            icon: 'save_alt',
            errorMessage: '',
          },
        ],
        currentIndex: 0
      }


      this.stepperConfig.steps[0].status = 2;

      this.stepperConfig.steps[0].status = 3;
      this.stepperConfig.steps[1].status = 2;
      this.stepperConfig.currentIndex = 1;

      const reportWorker = new ReportWorker();
      reportWorker.onmessage().subscribe(
        data => {
          this.stepperConfig.steps[1].status = 3;
          this.stepperConfig.steps[2].status = 2;
          this.stepperConfig.currentIndex = 2;

          FileSaver.saveAs(data.data,'Registro-Donador '+'('+fecha_reporte+')');
          reportWorker.terminate();

          this.stepperConfig.steps[2].status = 3;
          this.isLoadingPDF = false;
          this.showMyStepper = false;
      });

      reportWorker.onerror().subscribe(
        (data) => {
          this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
          this.isLoadingPDF = false;
          reportWorker.terminate();
        }
      );
      
      let config = {
        title: "Registro de Donación",
        showSigns: this.reportIncludeSigns, 
      };
      reportWorker.postMessage({data:{items: obj, config:config, fecha_actual: this.fechaActual},reporte:'/registro-donante'});
      this.isLoading = false;
  }


}
