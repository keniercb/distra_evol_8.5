<?php

class DatInscripcion extends BaseDatInscripcion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDocumento', array('local' => 'idinscripcion', 'foreign' => 'iddocumento'));
        $this->hasOne('DatOrdenTrabajo', array('local' => 'idordentrabajo', 'foreign' => 'idordentrabajo'));
        $this->hasMany('NomIndicador', array('local' => 'idmedio', 'foreign' => 'idindicador'));
    }


}


