<?php
class DatCargadocumentoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_cargadocumento($dat_cargadocumento)
    {
        $dat_cargadocumento->save();
    }

    public function modificardat_cargadocumento($dat_cargadocumento)
    {
        $dat_cargadocumento->save();
    }

    public function eliminardat_cargadocumento($dat_cargadocumento)
    {
        $dat_cargadocumento->delete();
    }
}

?> 
