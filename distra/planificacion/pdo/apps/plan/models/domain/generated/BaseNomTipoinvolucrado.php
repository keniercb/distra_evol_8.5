<?php

abstract class BaseNomTipoinvolucrado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.nom_tipoinvolucrado');
        $this->hasColumn(
            'incidencia', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'inicial', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoinvolucrado', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

