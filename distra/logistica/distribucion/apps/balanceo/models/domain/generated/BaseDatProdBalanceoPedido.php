<?php
abstract class BaseDatProdBalanceoPedido extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_prodbalanceopedido');
        $this->hasColumn('idproductobalanceopedido', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datcancelacion'));
        $this->hasColumn('idproductosbalanceo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddocpedido', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidadpedidos', 'numeric', null, array('notnull' => false, 'primary' => false, 'default' => 0));
        $this->hasColumn('cantdistribuidos', 'numeric', null, array('notnull' => false, 'primary' => false, 'default' => 0));
        $this->hasColumn('cantcomprar', 'numeric', null, array('notnull' => false, 'primary' => false, 'default' => 0));
    }

    public function Setup()
    {
        parent::setUp();
    }
}