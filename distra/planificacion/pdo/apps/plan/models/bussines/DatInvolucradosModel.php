<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatInvolucradosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatInvolucrados $datInvolucrados)
    {
        $datInvolucrados->save();
    }

    public function Actualizar(DatInvolucrados $datInvolucrados)
    {
        $datInvolucrados->save();
    }

    public function Eliminar($datInvolucrados)
    {
        $datInvolucrados->delete();
    }
}

