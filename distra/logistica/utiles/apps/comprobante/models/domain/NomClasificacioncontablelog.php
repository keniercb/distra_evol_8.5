<?php

class NomClasificacioncontablelog extends BaseNomClasificacioncontablelog
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatClasificacioncontablelogEntidad',
            array('local' => 'idclasificacioncontable', 'foreign' => 'idclasificacioncontable')
        );
    }

}
