<?php

class DatDesviacionIncidencia extends BaseDatDesviacionIncidencia
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'DatIncidencia',
            array('local' => 'iddesviacion', 'foreign' => 'idincidencia')
        );
        $this->hasOne(
            'DatDesviacion',
            array('local' => 'idincidencia', 'foreign' => 'iddesviacion')
        );
    }

    public function getByid($iddesviacion)
    {
        return Doctrine::getTable('DatDesviacionIncidencia')->find(
            $iddesviacion
        )->toArray();
    }


}

