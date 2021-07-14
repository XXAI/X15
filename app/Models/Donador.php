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
        'apellido_paterno',
        'apellido_materno',
        'fecha_nacimiento',
        'curp',
        'sexo',
        'seguro_id',
        'seguro_otro',
        'entidad_federativa_id',
        'ciudad',
        'codigo_postal',
        'email',
        'telefono_contacto'

    ];

    public function entidad_federativa(){
        return $this->belongsTo('App\Models\EntidadFederativa','entidad_federativa_id');
    }

    public function seguro(){
        return $this->belongsTo('App\Models\Seguro','seguro_id');
    }

}
