<?php

abstract class BaseDatControlejecucionnivelactividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_controlejecucionnivelactividad');
        $this->hasColumn(
            'idcontrolejecucionnivelactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_controlejecucionporfecha')
        );
        $this->hasColumn(
            'nivelactividadreal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechareal', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
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
