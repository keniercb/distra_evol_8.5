<?php

abstract class BaseConfPuntosacceso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.conf_puntosacceso');
        $this->hasColumn('idpuntoacceso', 'numeric', null, array ('notnull' => false,'primary' => true));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
    }


}

