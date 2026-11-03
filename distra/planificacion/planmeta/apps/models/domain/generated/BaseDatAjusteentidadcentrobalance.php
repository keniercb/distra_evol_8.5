<?php

abstract class BaseDatAjusteentidadcentrobalance extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ajusteentidadcentrobalance');
        $this->hasColumn(
            'idajusteentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'cantidadreservaministro', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadeconomia', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
