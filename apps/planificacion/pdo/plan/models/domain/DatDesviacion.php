<?php

class DatDesviacion extends BaseDatDesviacion
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'DatElementos',
            array('local' => 'iddesviacion', 'foreign' => 'idelemento')
        );
        $this->hasOne(
            'DatUsuarioDesviacion',
            array('local' => 'iddesviacion', 'foreign' => 'iddesviacion')
        );
    }

    public function getByid($impacto)
    {
        return Doctrine::getTable('DatDesviacion')->find($impacto)->toArray();
    }


}

