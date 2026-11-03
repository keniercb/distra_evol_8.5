<?php

abstract class BaseNomIndicador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.nom_indicador');
        $this->hasColumn('idindicador', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_indicador'));
        $this->hasColumn('idestudiomatrizfmpeir', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idelementopeir', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idfuente', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array ('notnull' => true,'primary' => false));
    }


}

