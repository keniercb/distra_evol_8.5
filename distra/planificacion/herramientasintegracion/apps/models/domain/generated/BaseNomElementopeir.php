<?php

abstract class BaseNomElementopeir extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.nom_elementopeir');
        $this->hasColumn('idelementopeir', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_elementopeir'));
//        $this->hasColumn('idpadre', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcionpresion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcionestado', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcionimpacto', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcionrespuesta', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fechaini', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array ('notnull' => true,'primary' => false));
//        $this->hasColumn('lft', 'numeric', null, array ('notnull' => true,'primary' => false));
//        $this->hasColumn('rgt', 'numeric', null, array ('notnull' => true,'primary' => false));
    }


}

