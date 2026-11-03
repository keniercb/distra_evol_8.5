<?php

abstract class BaseNomSectorRegMatric extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.nom_sector');
        $this->hasColumn('idsector', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'sec_nomsector'));
        $this->hasColumn('denominacion', 'character varying', 60, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

}

