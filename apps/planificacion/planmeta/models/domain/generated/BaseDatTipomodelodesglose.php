<?php

abstract class BaseDatTipomodelodesglose extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_tipomodelodesglose');
        $this->hasColumn(
            'iddesglose', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
		$this->hasColumn(
            'idtipomodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


