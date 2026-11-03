<?php

abstract class BaseConfPeriodocontrol extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.conf_periodocontrol');
        $this->hasColumn('idperiodocontrol', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_periodocontrol'));
        $this->hasColumn('descripcion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
    }


}

