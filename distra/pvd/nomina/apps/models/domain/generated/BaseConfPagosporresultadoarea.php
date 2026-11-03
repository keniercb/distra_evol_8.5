<?php

abstract class BaseConfPagosporresultadoarea extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_nomina.conf_pagosporresultadoarea');
        $this->hasColumn('idpagoporresultadoarea', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_nomina.sec_pagosporresultadoarea'));
        $this->hasColumn('monto', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idpagoporresultado', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idarea', 'numeric', null, array ('notnull' => false,'primary' => false));
    }


}

