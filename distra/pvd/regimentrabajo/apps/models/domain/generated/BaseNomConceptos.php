<?php

abstract class BaseNomConceptos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.nom_concepto');
        $this->hasColumn('idconcepto', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_nom_concepto'));
        $this->hasColumn('orden', 'numeric',19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying',255, array('notnull' => true, 'primary' => false));
    }


}

