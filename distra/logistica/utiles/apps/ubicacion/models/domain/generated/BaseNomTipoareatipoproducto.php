<?php

abstract class BaseNomTipoareatipoproducto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.nom_tipoareatipoproducto');
        $this->hasColumn(
            'idtipoareanaturaleza', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_nomtipoareatipoproducto')
        );
        $this->hasColumn('idtipoareaentidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnaturaleza', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

