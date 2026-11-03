<?php

abstract class BaseDatEstudiomatrizrelacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_estudiomatrizrelacion');
        $this->hasColumn('idestudiomatrizrelacion', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_estudiomatrizrelacion'));
        $this->hasColumn('idconfiguracionmatrizrelacion', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idproyecto', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('nativo', 'boolean', null, array ('notnull' => false,'primary' => false));
    }


}

