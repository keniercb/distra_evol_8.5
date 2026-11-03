<?php

abstract class BaseDatMedio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_medioorden');
        $this->hasColumn(
            'idmedio', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datmedio')
        );
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dinamicos', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', 19, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }
}

//fin clase 

