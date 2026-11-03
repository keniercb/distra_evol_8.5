<?php

abstract class BaseDatPartesPiezasAgregados extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_partespiezasagregados');
        $this->hasColumn(
            'idpiezaagregado', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'datos', 'json', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 50, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idregnumerico', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idordentrabajo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpadre', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechaadquisicion', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechacierre', 'date', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
