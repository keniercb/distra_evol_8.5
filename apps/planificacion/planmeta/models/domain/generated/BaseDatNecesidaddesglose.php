<?php

abstract class BaseDatNecesidaddesglose extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_necesidaddesglose');
        $this->hasColumn(
            'iddesgloseentidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnecesidaddesglose', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_necesidaddesglose')
        );
        $this->hasColumn(
            'necesidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'version', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 1)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


