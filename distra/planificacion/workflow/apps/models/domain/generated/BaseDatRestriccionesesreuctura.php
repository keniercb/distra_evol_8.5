<?php

abstract class  BaseDatRestriccionesesreuctura extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_flujotrabajo.dat_restriccionesestructura');
        $this->hasColumn(
            'idestado', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtipodoc', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'estadoinicial', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'estadofinal', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


