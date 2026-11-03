<?php


abstract class BaseHisOperacionRetencionesPersona extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.his_operacionretencionpersona');

        $this->hasColumn('idhisoperacionretencionpersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_his_operacionretencionpersona'
        ));
		
		$this->hasColumn('idhisdatretencionpersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
		
		$this->hasColumn('idnomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
		
		$this->hasColumn('idcomprobanteacredita', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
		$this->hasColumn('idcomprobantependiente', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        
        $this->hasColumn('retenido', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('saldodeladeudo', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        $this->hasColumn('retencionpendiente', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        $this->hasColumn('saldodeladeudopendiente', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('fechaoperacion', 'date', null, array(
            'type' => 'date',
            'length' => null,
            'notnull' => true,
            'primary' => false,
        ));
        
        $this->hasColumn('fechacomprobantependiente', 'date', null, array(
            'type' => 'date',
            'length' => null,
            'notnull' => true,
            'primary' => false,
        ));

    }

    public function setUp(){

        parent::setUp();
		
    }
}
