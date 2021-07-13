import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PublicService } from '../public.service';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';


export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'info-qr-donante',
  templateUrl: './info-qr-donante.component.html',
  styleUrls: ['./info-qr-donante.component.css']
})
export class InfoQrDonanteComponent implements OnInit {
  


  constructor(
    private publicService: PublicService,
    private sharedService: SharedService,
    public router: Router,
    private route: ActivatedRoute

  ) {}

  public dialog: MatDialog;
  panelAtencion     = false;
  panelSeguimiento  = false;
  panelEmabarazo    = false;
  panelOpenState    = false;

  dataDonante: any;
  persona_id:number = 0;

  isLoading:boolean = false;

  ngOnInit() {

    this.route.params.subscribe(params => {
      
      this.persona_id = params['id'];
      if(this.persona_id){

        this.cargarDatosPaciente(this.persona_id);

      }

  });

    

  }


  cargarDatosPaciente(id:any){

    let params = {};
    let query = this.sharedService.getDataFromCurrentApp('searchQuery');

    if(query){
      params['query'] = query;
    }

    this.isLoading = true;

    this.publicService.verInfoDonante(id,params).subscribe(
      response =>{
        console.log("en el response del DIALOG",response.data);
        
        this.dataDonante = response.data;

        console.log(this.dataDonante);

        this.isLoading = false;
      });
  }


}
