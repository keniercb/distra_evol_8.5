<?php

class DatClasificacioncontablelogEntidad extends BaseDatClasificacioncontablelogEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomClasificacioncontablelog',
            array('local' => 'idclasificacioncontable', 'foreign' => 'idclasificacioncontable')
        );
    }

}
