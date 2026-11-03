<?php

class DatModelodatosnomencladorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatModelodatosnomenclador($datModelodatosnomenclador
    )
    {
        $datModelodatosnomenclador->save();
    }

    public function modificardatModelodatosnomenclador($datModelodatosnomenclador
    )
    {
        $datModelodatosnomenclador->save();
    }

    public function eliminardatModelodatosnomenclador($datModelodatosnomenclador
    )
    {
        $datModelodatosnomenclador->delete();
    }
}


