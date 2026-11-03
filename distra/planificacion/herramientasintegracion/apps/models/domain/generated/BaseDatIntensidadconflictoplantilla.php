<?php

abstract class BaseDatIntensidadconflictoplantilla extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_intensidadconflictoplantilla');
        $this->hasColumn('idintensidadconflictoplantilla', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_intensidadconflictoplantilla'));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('configuracion', 'text', null, array('notnull' => true, 'primary' => false));
    }


}

