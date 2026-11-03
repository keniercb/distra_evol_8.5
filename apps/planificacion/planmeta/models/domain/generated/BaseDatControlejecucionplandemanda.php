<?php

abstract class BaseDatControlejecucionplandemanda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_controlejecucionplandemanda');
        $this->hasColumn(
            'idcontrolejecucionplandemanda', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_controlejecucionplan')
        );
        $this->hasColumn(
            'cantidadreal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechareal', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idplanificacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );        
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
