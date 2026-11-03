<?php

abstract class BaseDatElementosDocumento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_elementos_documento');
        $this->hasColumn(
            'iddocumento', 'varchar', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idelemento', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

