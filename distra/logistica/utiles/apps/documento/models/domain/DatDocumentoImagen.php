<?php

class DatDocumentoImagen extends BaseDatDocumentoImagen
{

    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('NomImagen', array('local' => 'idimagen', 'foreign' => 'idimagen'));
        parent::setUp();
    }


}
