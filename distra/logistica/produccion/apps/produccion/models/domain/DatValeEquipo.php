<?php

class DatValeEquipo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_valeequipos');
        $this->hasColumn('idvaleequipos', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logproduccion.sec_valeequipo'));
        $this->hasColumn('idvaleproduccion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('unidadesproducidas', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('horastrabajo', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }
}