<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\SoftDeletes;

class Donador extends Model
{
    //use SoftDeletes;
    protected $table = 'donadores';
    protected $fillable = [
        
        'id',
        'nombre',
        'a_paterno',
        'a_materno',
        'fecha_nacimiento',
        'curp',
        'genero',
        'codigo_postal',
        'ciudad',
        'estado_id',
        'email',
        'telefono_contacto'

    ];

    public function estado(){
        return $this->belongsTo('App\Models\EntidadFederativa','estado_id');
    }

}
