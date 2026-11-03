<?php

abstract class BaseDatProdreenvase extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_prodreenvase');

        $this->hasColumn(
            'idprodreenvase', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'cantorigen',  'numeric', 25,
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
            'dosisunitaria',  'numeric', 25,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}