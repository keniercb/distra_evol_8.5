<?php

abstract class BaseDatCartatecnologicadepreciacionequipo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_cartatecnologicadepreciacionequipo');
        $this->hasColumn(
                'iddepreciacionequipo', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
                'idcartatecnologica', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


