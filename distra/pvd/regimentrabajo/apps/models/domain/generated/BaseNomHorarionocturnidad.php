<?php

abstract class BaseNomHorarionocturnidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.nom_horarionocturnidad');
        $this->hasColumn('idhorarionocturnidad', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_horarionocturnidad'));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('horainicio', 'time', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('horafin', 'time', null, array ('notnull' => false,'primary' => false));
    }


}

