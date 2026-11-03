<?php

abstract class BaseDatProdreenvasado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_prodreenvasado');

        $this->hasColumn(
            'idprodreenvasado', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idproddestino',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantdestino',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idreenvase',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idprodorigen',  'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'dosisunitariadestino',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}