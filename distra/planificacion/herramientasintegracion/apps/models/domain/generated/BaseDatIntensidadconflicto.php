<?php

abstract class BaseDatIntensidadconflicto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_intensidadconflicto');
        $this->hasColumn('idintensidadconflicto', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_intensidadconflicto'));
        $this->hasColumn('idestudiocurvaconflicto', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('terminologia', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('nivelintensidad', 'double precision', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('alerta', 'boolean', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => true, 'primary' => false));
    }


}

