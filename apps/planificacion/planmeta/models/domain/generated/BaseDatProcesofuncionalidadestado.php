<?php

abstract class BaseDatProcesofuncionalidadestado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_procesofuncionalidadestado');
        $this->hasColumn(
            'idprocesofuncionalidadestado', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'secuence' => 'mod_planificacion.sec_procesofuncionalidadentidadestado_seq')
        );
        $this->hasColumn(
            'idprocesofuncionalidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'activo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
