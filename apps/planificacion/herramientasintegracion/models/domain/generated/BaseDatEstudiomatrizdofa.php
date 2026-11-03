<?php

abstract class BaseDatEstudiomatrizdofa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_estudiomatrizdofa');
        $this->hasColumn('idestudiomatrizdofa', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estudiomatrizdofa'));
        $this->hasColumn('idproyecto', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('nativo', 'boolean', null, array ('notnull' => false,'primary' => false));
    }


}

