<?php

abstract class BaseDatPaciente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_paciente');

        $this->hasColumn(
            'idpaciente', 'numeric', null,  array(
            'notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_datpaciente"
            )
        );
        $this->hasColumn(
            'nombreapellidos',  'varchar', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cipaciente',  'varchar', 11,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'nrocasoindice',  'varchar', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'dirpaciente',  'varchar', 250,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'consultoriomedico',  'varchar', 100,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}