<?php

abstract class BaseConfPagosporresultadofecha extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_nomina.conf_pagosporresultadofechas');
        $this->hasColumn('idpagoporresultadofechas', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_nomina.sec_pagoporresultadofechas'));
        $this->hasColumn('idpagoporresultado', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array ('notnull' => true,'primary' => false));
    }


}

