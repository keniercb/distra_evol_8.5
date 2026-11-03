<?php

abstract class BaseDatBalanceCuadreProceso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_balancecuadreproceso');
        $this->hasColumn(
            'idbalancecuadreproceso', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datbalancecuadreproceso')
        );
        $this->hasColumn('idcuenta', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('saldocontable', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('saldoot', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diferencia', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cierre', 'numeric', 19, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', 19, array('notnull' => false, 'primary' => false));
       
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

