import { LOGOS } from "../../logos";


export class ReporteRegistroDonante{

    getDocumentDefinition(reportData:any) {
        //console.log(reportData);
        let contadorLineasHorizontalesV = 0;
        let fecha_hoy =  Date.now();

        let datos = {
          pageOrientation: 'portrait',
          pageSize: 'LEGAL',
          /*pageSize: {
            width: 612,
            height: 396
          },*/
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            margin: [30, 20, 30, 0],
            columns: [
                {
                    image: LOGOS[0].LOGO_FEDERAL,
                    width: 80
                },
                {
                    margin: [10, 0, 0, 0],
                    text: 'SECRETARÍA DE SALUD\n'+reportData.config.title,
                    bold: true,
                    fontSize: 12,
                    alignment: 'center'
                },
                {
                  image: LOGOS[1].LOGO_ESTATAL,
                  width: 60
              }
            ]
          },
          footer: function(currentPage, pageCount) { 
            //return 'Página ' + currentPage.toString() + ' de ' + pageCount; 
            return {
              margin: [30, 20, 30, 0],
              columns: [
                  {
                      text:'http://sirh.saludchiapas.gob.mx/',
                      alignment:'left',
                      fontSize: 8,
                  },
                  {
                      margin: [10, 0, 0, 0],
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 8,
                      alignment: 'center'
                  },
                  {
                    text:fecha_hoy.toString(),
                    alignment:'right',
                    fontSize: 8,
                }
              ]
            }
          },

          content: [],

            styles: {
              cabecera: {
                fontSize: 5,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 5,
                bold:true,
                fillColor:"#DEDEDE",
                alignment:"center"
              },
              datos:
              {
                fontSize: 10
              },
              tabla_datos:
              {
                fontSize: 5
              }
            }
        };

        datos.content.push({
          
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
           widths: [ 240,60,120,60,60],
            margin: [0,0,0,0],
            body: [
              [
                {qr: 'http://chep.saludchiapas.gob.mx', fit: '100'},
                {text: "Nombre, Firma y cédula del metodo Triage:", style: "tabla_datos"},
                {text: "\n\n\n__________________________________________________________________", colSpan: 3, style:'tabla_datos_titulo'},{},{}
              ],
              [
                {text: "", style: "tabla_datos"},
                {text:  'datos_triage.datos_valoracion.usuario.name'+"\nNo. Cedula: "+'datos_triage.datos_valoracion.usuario.cedula', colSpan: 3, style: "tabla_datos_titulo"},{},{}
              ]
            ]
          }
        });
      

        return datos;
      }
}