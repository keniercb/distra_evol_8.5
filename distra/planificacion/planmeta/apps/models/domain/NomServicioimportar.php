<?php

class NomServicioimportar extends BaseNomServicioimportar
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatConfiguraciontipoaccion',
            array('local' => 'idservicio', 'foreign' => 'idservicio')
        );
    }

}
