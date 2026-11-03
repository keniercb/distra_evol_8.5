<?php

class DatValeActividad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_manoobraactividad');
        $this->hasColumn('idmanoobraactividad', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logproduccion.sec_manoobraactividad'));
        $this->hasColumn('idcartatecindustrialactividad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmanoobra', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('horas', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }
}