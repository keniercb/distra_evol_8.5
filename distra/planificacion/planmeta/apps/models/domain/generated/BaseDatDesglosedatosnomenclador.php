<?php

abstract class BaseDatDesglosedatosnomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desglosedatosnomenclador');
        $this->hasColumn(
            'iddesglosedatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_desglosedatosnomenclador')
        );
        $this->hasColumn(
            'iddesglosetiponomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddesgloseentidadnivel', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


