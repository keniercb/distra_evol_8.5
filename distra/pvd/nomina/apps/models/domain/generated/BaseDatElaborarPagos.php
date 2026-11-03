<?php

abstract class BaseDatElaborarPagos extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_elaborarpagos');

        $this->hasColumn('idelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_elaborarpagos'
        ));

		$this->hasColumn('idtipopago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('idperiodopago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('fechapago', 'date', 19, array(
            'type' => 'date',
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('fechainicioperiodo', 'date', 19, array(
            'type' => 'date',
            'notnull' => false,
            'primary' => false
        ));
        
		$this->hasColumn('fechafinperiodo', 'date', 19, array(
            'type' => 'date',
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('mesanyopago', 'character varying', 100, array(
            'type' => 'character varying',
            'length' => 100,
            'notnull' => false,
            'primary' => false,
        ));        
        
		$this->hasColumn('estado', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
            'default' => '1'
        ));
        
        $this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('idcomprobanteoperaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('numerocomprobanteoperaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('idcomprobantecancelacion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('numerocomprobantecancelacion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('idcomprobantecuentasporcobrar', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('numerocomprobantecuentaxcobrar', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('descripcion', 'character varying', 500, array(
            'type' => 'character varying',
            'length' => 500,
            'notnull' => false,
            'primary' => false
        ));

    }
}
