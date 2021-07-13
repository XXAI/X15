<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use Carbon\carbon;
use \Validator;
use App\Models\Donador;
use App\Exports\DonadoresExport;
use Maatwebsite\Excel\Facades\Excel;

class DonadoresController extends Controller
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
                            ->leftJoin('entidades_federativas','entidades_federativas.id','=','donadores.estado_id');

        if(isset($parametros['tipo_genero']) && $parametros['tipo_genero']){
            $lista_donadores = $lista_donadores->where('genero',$parametros['tipo_genero']);
        }

        if(isset($parametros['buscar']) && $parametros['buscar']){
            $query_busqueda = $parametros['buscar'];
            $lista_donadores = $lista_donadores->where(function($query)use($query_busqueda){
                $query->where('donadores.nombre','like','%'.$query_busqueda.'%')
                        ->orWhere('a_paterno','like','%'.$query_busqueda.'%')
                        ->orWhere('a_materno','like','%'.$query_busqueda.'%')
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

        return response()->json(['paginado'=>$lista_donadores], HttpResponse::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){

        $reglas = [
            'nombre' => 'required|max:255',
            'a_paterno' => 'nullable',
            'a_materno' => 'nullable',
            'fecha_nacimiento' => 'required|date' ,
            'curp' => 'required|size:18',
            'genero' => 'required',
            'codigo_postal' => 'required',
            'ciudad' => 'required',
            'estado_id' => 'required',
            'email' => 'required|email',
            'telefono_contacto' => 'nullable',
        ];

        $mensajes = [
            'nombre.required' => 'El nombre es requerido.',
            'fecha_nacimiento.required'  => 'La fecha de nacimiento es requerida.',
            'curp.required' => 'La CURP es requerida.',
            'curp.size' => 'La CURP debe tener :size caracteres de largo',
            'genero.required' => 'El genero es requerido.',
            'codigo_postal.required' => 'El codigo postal es requerido.',
            'ciudad.required' => 'La ciudad es requerida.',
            'estado_id.required' => 'El estado es requerido.',
            'email.required' => 'El correo electronico es requerido.',
            'email.email' => 'El correo electronico no tiene el formato correcto.',
        ];

        $inputs = $request->all();

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

    public function obtenerDatosDonante($id){
        try{
            
            //$params = $request->all();

            $donante = Donador::with('estado')->where('id',$id)->first();

            if(!$donante){
                throw new Exception("No encontro al Donante buscado", 1);
            }
            
            return response()->json(['data'=>$donante],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
}
