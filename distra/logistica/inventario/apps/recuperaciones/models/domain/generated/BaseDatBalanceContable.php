<?php

abstract class BaseDatBalanceContable extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_balancecontable');
        $this->hasColumn(
            'idbalancecontable', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datbalancecontable')
        );
        $this->hasColumn('idcuenta', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valorcontable', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valorinventario', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diferencia', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', 19, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cuenta', 'varchar', 255, array('notnull' => false, 'primary' => false));
       
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

