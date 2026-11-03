<?php

abstract class BaseDatProcesofuncionalidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_procesofuncionalidad');
        $this->hasColumn(
            'idprocesofuncionalidad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_procesofuncionalidad')
        );
        $this->hasColumn(
            'idproceso', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idfuncionalidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'referencia', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
