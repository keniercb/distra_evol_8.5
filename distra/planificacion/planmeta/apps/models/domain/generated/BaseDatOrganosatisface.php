<?php

abstract class BaseDatOrganosatisface extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_organosatisface');
        $this->hasColumn(
            'idorganosatisface', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'secuence' => 'mod_planificacion.sec_organosatisface_seq')
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicadormaterialdatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
