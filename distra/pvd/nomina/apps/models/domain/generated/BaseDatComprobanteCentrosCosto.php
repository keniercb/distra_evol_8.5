<?php

abstract class BaseDatComprobanteCentrosCosto extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_comprobantenominacentroscosto');

        $this->hasColumn('idcomprobantenominacentrocosto', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_comprobantenominacentrocosto'
        ));

		$this->hasColumn('idcuenta', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('cuenta', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 500,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('denomcuenta', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 500,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('debitocredito', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('centrocosto', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('importe', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('idelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
    }
}
