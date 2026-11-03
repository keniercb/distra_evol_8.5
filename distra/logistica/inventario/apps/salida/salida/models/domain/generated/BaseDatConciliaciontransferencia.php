<?php

abstract class BaseDatConciliaciontransferencia extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_conciliaciontransferencia');

        $this->hasColumn(
            'idconciliaciontransferencia', 'numeric', null,
            array(
            'notnull' => true, 'primary' =>
            true, 'sequence' => 'mod_loginventario.sec_datconciliaciontransferencia'
            )
        );
        $this->hasColumn('idconciliacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtransferencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('motivo', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('recibido', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

