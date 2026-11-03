<?php
abstract class BaseDatProdTransfInterna extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_prodtransfinterna');
        $this->hasColumn('idprodtransfinterna', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idtransfinterna', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));       
        $this->hasColumn('cantidad', 'numeric', 0, array('notnull' => false, 'primary' => false));      
        $this->hasColumn('precio', 'numeric', 0, array('notnull' => false, 'primary' => false));      
        $this->hasColumn('importe', 'numeric', 0, array('notnull' => false, 'primary' => false));   
    }

    public function Setup()
    {
        parent::setUp();
    }
}
