<?php

abstract class BaseDatCartatecnologicaentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_cartatecnologicaentidad');
        $this->hasColumn(
            'idcartatecnologicaentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_spouam.sec_cartatecnologicaentidad')
        );
        $this->hasColumn(
            'idcartatecnologica', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
      
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
