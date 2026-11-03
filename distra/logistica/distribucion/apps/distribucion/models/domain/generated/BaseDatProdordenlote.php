<?php
abstract class BaseDatProdordenlote extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.dat_prodordenlote');
        $this->hasColumn(
            'idprodordenlote', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idproducto', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idlote', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
