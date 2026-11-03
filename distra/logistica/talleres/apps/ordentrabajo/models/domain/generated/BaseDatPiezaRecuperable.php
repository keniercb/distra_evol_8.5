<?php

abstract class BaseDatPiezaRecuperable extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_piezarecuperable');
        $this->hasColumn(
            'idpiezarecuperable', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datpiezarecuperable')
        );
        $this->hasColumn('idindicador', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddestino', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('datos', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('motivo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('vidautil', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpiezaagregado', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

