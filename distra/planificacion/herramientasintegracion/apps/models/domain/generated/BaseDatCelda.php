<?php

abstract class BaseDatCelda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_celda');
        $this->hasColumn('idcelda', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_celda'));
        $this->hasColumn('idcolumna', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idfila', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('numero', 'double precision', null, array ('notnull' => true,'primary' => false));
    }


}

