<?php

abstract class BaseNomTipoareaoperaciones extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.nom_tipoareaoperaciones');
        $this->hasColumn(
            'idtipoareaoperaciones', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_nomtipoareaoperaciones')
        );
        $this->hasColumn('idoperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomtipoareaentidad', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

