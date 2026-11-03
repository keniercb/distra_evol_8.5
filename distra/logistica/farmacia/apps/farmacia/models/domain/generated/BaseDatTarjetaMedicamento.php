<?php

abstract class BaseDatTarjetaMedicamento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_tarjetamedicamento');

        $this->hasColumn(
            'idtarjetamedicamento', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idpaciente', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'retrovirales',  'numeric', 1,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrocasoindice',  'varchar', null,
            array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'consultoriomedico',  'varchar', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'area',  'varchar', null,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}