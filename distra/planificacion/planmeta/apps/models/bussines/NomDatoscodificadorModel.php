<?php

class NomDatoscodificadorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_datoscodificador($nomDatoscodificador)
    {
        $nomDatoscodificador->save();
    }

    public function modificarnom_datoscodificador($nomDatoscodificador)
    {
        $nomDatoscodificador->save();
    }

    public function eliminarnom_datoscodificador($nomDatoscodificador)
    {
        $nomDatoscodificador->delete();
    }
}


