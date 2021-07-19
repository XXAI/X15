<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use Carbon\carbon;
use \Validator, Exception;
use App\Models\Donador;
use App\Exports\DonadoresExport;
use Maatwebsite\Excel\Facades\Excel;

use Illuminate\Support\Str;

class DonantesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $parametros = $request->all();

        $lista_donadores = Donador::select('donadores.*','entidades_federativas.nombre as estado')
                            ->leftJoin('entidades_federativas','entidades_federativas.id','=','donadores.entidad_federativa_id');

        if(isset($parametros['tipo_sexo']) && $parametros['tipo_sexo']){
            $lista_donadores = $lista_donadores->where('sexo',$parametros['tipo_sexo']);
        }

        if(isset($parametros['buscar']) && $parametros['buscar']){
            $query_busqueda = $parametros['buscar'];
            $lista_donadores = $lista_donadores->where(function($query)use($query_busqueda){
                $query->where('donadores.nombre','like','%'.$query_busqueda.'%')
                        ->orWhere('apellido_paterno','like','%'.$query_busqueda.'%')
                        ->orWhere('apellido_materno','like','%'.$query_busqueda.'%')
                        ->orWhere('ciudad','like','%'.$query_busqueda.'%')
                        ->orWhere('codigo_postal','like','%'.$query_busqueda.'%')
                        ->orWhere('curp','like','%'.$query_busqueda.'%');
            });
        }

        if(isset($parametros['page'])){
            $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 23;

            $lista_donadores = $lista_donadores->paginate($resultadosPorPagina);
            
        } else {
            $lista_donadores = $lista_donadores->get();
        }

        return response()->json(['data'=>$lista_donadores], HttpResponse::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){

        $reglas = [
            'codigo'=>'required|unique:donadores',
            'nombre' => 'required|max:255',
            'apellido_paterno' => 'nullable',
            'apellido_materno' => 'nullable',
            'fecha_nacimiento' => 'required|date' ,
            'curp' => 'required|size:18',
            'sexo' => 'required',
            'codigo_postal' => 'required',
            'ciudad' => 'required',
            'entidad_federativa_id' => 'required',
            'email' => 'required|email',
            'telefono_contacto' => 'nullable',
        ];

        $mensajes = [
            'codigo.unique' => 'El Código debe ser único',
            'nombre.required' => 'El nombre es requerido.',
            'fecha_nacimiento.required'  => 'La fecha de nacimiento es requerida.',
            'curp.required' => 'La CURP es requerida.',
            'curp.size' => 'La CURP debe tener :size caracteres de largo',
            'sexo.required' => 'El sexo es requerido.',
            'codigo_postal.required' => 'El codigo postal es requerido.',
            'ciudad.required' => 'La ciudad es requerida.',
            'entidad_federativa_id.required' => 'El estado es requerido.',
            'email.required' => 'El correo electronico es requerido.',
            'email.email' => 'El correo electronico no tiene el formato correcto.',
        ];

        $inputs = $request->all();

        $inputs['codigo'] = Str::random(6);

        $resultado = Validator::make($inputs,$reglas,$mensajes);

        if($resultado->passes()){

            $registro = Donador::create($inputs);
            
            return response()->json(['mensaje' => 'Guardado', 'validacion'=>$resultado->passes(), 'datos'=>$registro], HttpResponse::HTTP_OK);
        }else{
            return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_OK);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    public function exportExcel(Request $request){
        $parametros = $request->all();
        return (new DonadoresExport($parametros))->download('donadores.xlsx');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function obtenerDatosDonante(Request $request, $codigo){
        try{
            

            $donante = Donador::with('entidad_federativa', 'seguro')->where('codigo',$codigo)->first();

            if(!$donante){
                throw new Exception("No se encontro al Donante con este Código QR", 1);
            }
            
            return response()->json(['data'=>$donante],HttpResponse::HTTP_OK);
                

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
}
