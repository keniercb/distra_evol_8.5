<?php

abstract class BaseDatDesviacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_desviacion');
        $this->hasColumn(
            'impacto', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddesviacion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

