<?php

class DatCargadocumentoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatCargadocumento($datCargadocumento)
    {
        $datCargadocumento->save();
    }

    public function modificardatCargadocumento($datCargadocumento)
    {
        $datCargadocumento->save();
    }

    public function eliminardatCargadocumento($datCargadocumento)
    {
        $datCargadocumento->delete();
    }
}


