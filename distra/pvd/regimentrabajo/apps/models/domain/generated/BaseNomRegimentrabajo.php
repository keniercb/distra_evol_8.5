<?php

abstract class BaseNomRegimentrabajo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.nom_regimentrabajo');
        $this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('horastrabajo', 'numeric', 2, array ('notnull' => true,'primary' => false));
        $this->hasColumn('tipofondotiempo', 'numeric', 1, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fondotiempo', 'numeric', 5, array ('notnull' => true,'primary' => false));
        $this->hasColumn('diaslaborables', 'numeric', 2, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idregimentrabajo', 'numeric', 19, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_regimentrabajo'));
//		$this->hasColumn('idestructura', 'numeric', 19, array ('notnull' => false,'primary' => false));
	}


}

