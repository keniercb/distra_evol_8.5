<?php

abstract class BaseDatProcesofuncionalidadentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_procesofuncionalidadentidad');
        $this->hasColumn(
            'eliminar', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'guardar', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idprocesofuncionalidadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_procesofuncionalidadentidad')
        );
        $this->hasColumn(
            'insertar', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'idprocesofuncionalidadestado', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'modificar', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


