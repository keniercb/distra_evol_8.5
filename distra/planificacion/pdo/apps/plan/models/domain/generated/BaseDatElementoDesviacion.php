<?php

abstract class BaseDatElementoDesviacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.mod_objetivos.dat_elemento_desviacion');
        $this->hasColumn(
            'iddesviacion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idelemento', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

