<?php

abstract class BaseNomComparacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.nom_comparacion');
        $this->hasColumn(
            'menor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'mayor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'igual', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcomparacion', 'numeric', null,
            array('notnull'  => false, 'primary' => true,
                  'sequence' => 'mod_objetivos.sec_condicion')
        );
    }


}

