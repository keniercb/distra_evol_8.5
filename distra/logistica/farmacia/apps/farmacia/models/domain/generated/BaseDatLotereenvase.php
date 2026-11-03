<?php

abstract class BaseDatLotereenvase extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_lotereenvase');

        $this->hasColumn(
            'idlotereenvase', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idprodorigen',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantorigen',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'dosisunitreal',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantdestino',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantrealreenvasada',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'diferencia',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idlote',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}