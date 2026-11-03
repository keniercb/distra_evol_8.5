<?php

class BaseDatConfiguraciontipoaccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_configuraciontipoaccion');
        $this->hasColumn(
            'idconfiguracion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtipoaccion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idservicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


