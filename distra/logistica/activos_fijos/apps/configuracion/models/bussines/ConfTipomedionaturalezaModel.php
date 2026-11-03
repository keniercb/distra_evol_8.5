<?php

class ConfTipomedionaturalezaModel extends ZendExt_Model
{

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     *
     */
    public function insertar($datos)
    {
        foreach ($datos as $value) {
            $obj = new ConfTipomedionaturaleza();
            $obj->idnaturaleza = $value->idnaturaleza;
            $obj->denominacion = $value->denominacion;
            $obj->tipo = $value->tipo;

            $obj->save();
        }
    }

    /**
     *
     */
    public function eliminar($id)
    {
        $naturaleza = Doctrine::getTable('ConfTipomedionaturaleza')->find($id);
        $naturaleza->delete();
    }

}
