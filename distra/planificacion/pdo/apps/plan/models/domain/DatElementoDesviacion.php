<?php

class DatElementoDesviacion extends BaseDatElementoDesviacion
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'DatDesviacion',
            array('local' => 'iddesviacion', 'foreign' => 'iddesviacion')
        );
    }

    public function getByid($iddesviacion)
    {
        return Doctrine::getTable('DatElementoDesviacion')->find($iddesviacion)
            ->toArray();
    }


}

