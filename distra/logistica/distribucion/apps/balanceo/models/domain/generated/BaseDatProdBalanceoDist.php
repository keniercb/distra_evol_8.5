<?php
abstract class BaseDatProdBalanceoDist extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_prodbalanceodistribuir');
        
        $this->hasColumn('idprodbalanceodist', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datprodbalanceodist'));
        $this->hasColumn('idproductosbalanceo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
    }

    public function Setup()
    {
        parent::setUp();
    }
}