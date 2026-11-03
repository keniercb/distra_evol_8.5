<?php

abstract class BaseDatDatosclasificadorindicador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_datosclasificadorindicador');
        $this->hasColumn(
            'iddatosclasificador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'NomIndicador',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
            'NomDatoscodificador', array('local' => 'iddatosclasificador',
                                         'foreign' => 'iddatoscodificador')
        );
    }

}


