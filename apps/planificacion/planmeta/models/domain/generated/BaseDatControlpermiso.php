<?php

abstract class BaseDatControlpermiso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_controlpermiso');
        $this->hasColumn(
            'idcontrolpermiso', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_controlpermiso')
        );$this->hasColumn(
            'idfuncionalidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        
         $this->hasColumn(
            'eliminar', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );       
        $this->hasColumn(
            'adicionar', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );       
        $this->hasColumn(
            'modificar', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
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
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'timestamp', null,
            array('notnull' => true,'default' => 'now()', 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
