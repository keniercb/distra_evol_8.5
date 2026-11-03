<?php

abstract class BaseNomCriterio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.nom_criterio');
        $this->hasColumn('idcriterio', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_criterio'));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fechaini', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array ('notnull' => true,'primary' => false));
    }


}

