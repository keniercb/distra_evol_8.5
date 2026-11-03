<?php

abstract class BaseDatTexto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifintegracion.dat_texto');
        $this->hasColumn('idtexto', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_planifintegracion.sec_texto'));
        $this->hasColumn('idcelda', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('texto', 'character varying', null, array ('notnull' => false,'primary' => false));
    }


}

