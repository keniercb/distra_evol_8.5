<?php
abstract class BaseDatTransfinternaLote extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_transfinternalote');
        $this->hasColumn(
		'idtransfinternalote', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => "mod_loginventario.sec_dattransfinternalote")
		);
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtransfinterna', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idlote', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantpasar', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idprodtransfinterna', 'numeric', null, array('notnull' => false, 'primary' => false));


    }

    public function Setup()
    {
        parent::setUp();
    }
}
