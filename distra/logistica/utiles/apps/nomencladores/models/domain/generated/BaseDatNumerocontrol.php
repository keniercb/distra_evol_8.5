<?php

abstract class BaseDatNumerocontrol extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_numerocontrol');
        $this->hasColumn(
            'idnumerocontrol', 'numeric', null,
            array(
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_logfacturacion.sec_numerocontrol'
            )
        );
        $this->hasColumn(
            'idrango', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idseriedocentidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrocontrol', 'character varying', 10, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nrodocumento', 'character varying', 10, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'anulado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'asignado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechaanulado', 'date', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 
