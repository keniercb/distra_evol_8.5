<?php

abstract class BaseDatEstructuraDesviacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_estructura_desviacion');
        $this->hasColumn(
            'iddesviacion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

