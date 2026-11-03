<?php

abstract class BaseDatCapacidadprod extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_capacidadprod');
        $this->hasColumn(
            'idcapacidadprod', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idumedida', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatCartatecnologica',
            array('local' => 'idcapacidadprod', 'foreign' => 'idcapacidadprod')
        );
    }

}


