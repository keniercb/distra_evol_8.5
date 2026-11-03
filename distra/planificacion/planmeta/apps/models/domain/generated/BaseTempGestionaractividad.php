<?php

abstract class BaseTempGestionaractividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('temp_gestionaractividad');
        $this->hasColumn(
            'idaplicacioncartatec', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idgestionaractividad', 'numeric', null,
            array('notnull'  => true, 'primary' => false,
                  'secuence' => 'mod_spouam.sec_gestionaractividad')
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'horainicio', 'time', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'horafin', 'time', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatCartatecnologicaactividad',
            array('local'   => 'idcartatecnologicaactividad',
                  'foreign' => 'idcartatecnologicaactividad')
        );
        $this->hasOne(
            'DatAplicacioncartatec', array('local'   => 'idaplicacioncartatec',
                                           'foreign' => 'idaplicacioncartatec')
        );
    }

}


