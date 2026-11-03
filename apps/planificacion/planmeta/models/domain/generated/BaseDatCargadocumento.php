<?php

abstract class BaseDatCargadocumento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_cargadocumento');
        $this->hasColumn(
            'fecha', 'date', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'hora', 'time without time zone', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcargadocumento', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'secuence' => 'mod_planifimportacion.sec_cargadocumento_seq')
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipomaterial', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


