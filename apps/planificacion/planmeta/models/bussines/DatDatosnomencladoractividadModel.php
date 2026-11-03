<?php

class DatDatosnomencladoractividadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatDatosnomencladoractividad($datDatosnomencladoractividad
    )
    {
        $datDatosnomencladoractividad->save();
    }

    public function modificardatDatosnomencladoractividad($datDatosnomencladoractividad
    )
    {
        $datDatosnomencladoractividad->save();
    }

    public function eliminardatDatosnomencladoractividad($datDatosnomencladoractividad
    )
    {
        $datDatosnomencladoractividad->delete();
    }
}


