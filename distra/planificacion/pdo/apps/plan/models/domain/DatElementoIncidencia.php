<?php

class DatElementoIncidencia extends BaseDatElementoIncidencia
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'DatIncidencia',
            array('local' => 'idincidencia', 'foreign' => 'idincidencia')
        );
    }

    public function getByid($idincidencia)
    {
        return Doctrine::getTable('DatElementoIncidencia')->find($idincidencia)
            ->toArray();
    }


}

