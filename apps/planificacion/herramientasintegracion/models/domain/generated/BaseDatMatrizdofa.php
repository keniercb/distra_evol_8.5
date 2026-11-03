<?php

abstract class BaseDatMatrizdofa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_matrizdofa');
        $this->hasColumn('idmatrizdofa', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_matrizdofa'));
        $this->hasColumn('idestudiomatrizdofa', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idambitodofa', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('analista', 'boolean', null, array ('notnull' => false,'primary' => false));
    }


}

