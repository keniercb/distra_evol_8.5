<?php

class DatTiporotacionEntidad extends BaseDatTiporotacionareaentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTiporotacion',
            array('local'   => 'idtiporotacion',
                  'foreign' => 'idtiporotacion')
        );
    }

}

//fin clase


