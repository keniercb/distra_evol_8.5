<?php

abstract class BaseDatDetallesdocumento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_detallesdocumento');
        $this->hasColumn('iddetallesdocumento', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_evaluaciones.sec_detallesdocumento'));
        $this->hasColumn('detalles', 'text', null, array ('notnull' => true,'primary' => false));
    }

}
