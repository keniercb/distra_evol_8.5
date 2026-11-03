<?php
class DatMovinventario extends BaseDatMovinventario
{
    public function setUp()
    {
        $this->hasOne('DatMovimientos', array('foreign' => 'idmovimiento', 'local' => 'idmovimiento'));
        $this->hasOne('DatDocumento' , array('foreign' => 'iddocumento', 'local' => 'iddocumento'));
    }

}


