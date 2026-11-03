<?php
class DatModelodatosnomencladorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_modelodatosnomenclador($dat_modelodatosnomenclador)
    {
        $dat_modelodatosnomenclador->save();
    }

    public function modificardat_modelodatosnomenclador($dat_modelodatosnomenclador)
    {
        $dat_modelodatosnomenclador->save();
    }

    public function eliminardat_modelodatosnomenclador($dat_modelodatosnomenclador)
    {
        $dat_modelodatosnomenclador->delete();
    }
}

?> 
