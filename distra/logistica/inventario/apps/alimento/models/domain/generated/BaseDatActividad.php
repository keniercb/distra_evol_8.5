<?php

abstract class BaseDatActividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logalimento.dat_actividad');
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array(
                'notnull'  => true,
                'primary'  => true,
                'sequence' => 'mod_logalimento.sec_datactividad'
            )
        );
        $this->hasColumn('aprobadocalidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacioncalidad', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactividadalimento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantraciones', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('caloriastotal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('proteinastotal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmenu', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
