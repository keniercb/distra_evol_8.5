<?php
abstract class BaseDatTransfinterna extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_transfinterna');
        $this->hasColumn('idtransfinterna', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('devolucion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddeposorigen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddeposdestino', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconcepretenido', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmotivodevolucion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipotransfinterna', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoperacionorigen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoperaciondestino', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
