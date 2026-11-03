<?php
abstract class BaseDatDistribucionpedido extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_distribucionpedido');
        $this->hasColumn(
            'iddistribucionpedido', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datdistribucionpedido')
        );
        $this->hasColumn('iddistribucion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpedido', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}