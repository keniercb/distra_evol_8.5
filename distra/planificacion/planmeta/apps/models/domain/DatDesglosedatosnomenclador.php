<?php

class DatDesglosedatosnomenclador extends BaseDatDesglosedatosnomenclador
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador',
            array('local'   => 'iddatosnomenclador',
                  'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
            'DatDesglosetiponomenclador',
            array('local'   => 'iddesglosetiponomenclador',
                  'foreign' => 'iddesglosetiponomenclador')
        );
        $this->hasOne(
            'DatDesgloseentidadnivel',
            array('local'   => 'iddesgloseentidadnivel',
                  'foreign' => 'iddesgloseentidadnivel')
        );
    }

}
