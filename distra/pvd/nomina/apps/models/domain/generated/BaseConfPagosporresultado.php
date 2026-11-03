<?php

abstract class BaseConfPagosporresultado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_nomina.conf_pagosporresultado');
        $this->hasColumn('idpagoporresultado', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_nomina.sec_pagosporresultado'));
        $this->hasColumn('idtipopago', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('referencia', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array ('notnull' => true,'primary' => false));

    }


}

