<?php

abstract class BaseConfPagosporresultadoperiodopago extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_nomina.conf_pagosporresultadoperiodopago');
        $this->hasColumn('idpagoporresultadoperiodopago', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_nomina.sec_pagosporresultadoperiodopago'));
        $this->hasColumn('idpagoporresultado', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idelaborarpagos', 'numeric', null, array ('notnull' => false,'primary' => false));
    }


}

