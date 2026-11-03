<?php

class NomTipoavisoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_tipoaviso($nomTipoaviso)
    {
        $nomTipoaviso->save();
    }

    public function modificarnom_tipoaviso($nomTipoaviso)
    {
        $nomTipoaviso->save();
    }

    public function eliminarnom_tipoaviso($nomTipoaviso)
    {
        $nomTipoaviso->delete();
    }

    public static function getIdByName($name)
    {
        $tipoAviso = new NomTipoaviso();

        return $tipoAviso->getIdByName($name);
    }
}