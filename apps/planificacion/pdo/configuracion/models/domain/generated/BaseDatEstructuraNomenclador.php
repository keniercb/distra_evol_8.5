<?php

abstract class BaseDatEstructuraNomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_estructura_nomenclador');
        $this->hasColumn(
            'idnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

