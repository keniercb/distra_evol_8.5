<?php

abstract class BaseDatTipoinvolucradoInvolucrado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_tipoinvolucrado_involucrado');
        $this->hasColumn(
            'llaveinvolucrado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idinvolucrado', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idtipoinvolucrado', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

