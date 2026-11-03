<?php

abstract class BaseDatProdtranfintubicacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logubicacion.dat_prodtranfintubicacion');
        $this->hasColumn(
            'idprodtranfintubicacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logubicacion.sec_datprodtranfintubicacion')
        );
        $this->hasColumn('idestructuraubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idprodtransfinterna', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

