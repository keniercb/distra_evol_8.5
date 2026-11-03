<?php

abstract class BaseDatLineaProductoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_lineaproductoentidad');
        $this->hasColumn(
            'idlineaproductoentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idlineaproducto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 
