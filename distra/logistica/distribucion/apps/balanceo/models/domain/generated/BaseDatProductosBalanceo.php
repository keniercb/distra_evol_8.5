<?php
abstract class BaseDatProductosBalanceo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_productosbalanceo');
        
        $this->hasColumn('idproductosbalanceo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datcancelacion'));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddocbalanceo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idclasificacionabc', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproductosbalanceopadre', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}