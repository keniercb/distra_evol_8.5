<?php

abstract class BaseNomFallasMedios extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.nom_fallasmedios');
        $this->hasColumn(
            'idfalla', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_nomfallasmedios')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('soluciones', 'character varying', 255, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

