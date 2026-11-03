<?php


abstract class BaseHisAjusteVacacionesPersona extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.his_ajustevacacionespersona');

        $this->hasColumn('idajustevacacionespersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_ajustevacacionespersona'
        ));

      $this->hasColumn('idhisvacacionespersona', 'numeric', 19, array(
        'type' => 'numeric',
        'length' => 19,
        'notnull' => true,
        'primary' => false
      ));

      $this->hasColumn('ajusteimporte', 'numeric', 19, 2, array(
        'type' => 'numeric',
        'length' => 19,
        'notnull' => false,
        'primary' => false
      ));
      $this->hasColumn('ajustetiempo', 'numeric', 19, 2, array(
        'type' => 'numeric',
        'length' => 19,
        'notnull' => false,
        'primary' => false
      ));
      $this->hasColumn('tipoajuste', 'numeric', 1, 0, array(
        'type' => 'numeric',
        'length' => 1,
        'notnull' => false,
        'primary' => false
      ));
    }

    public function setUp(){

        parent::setUp();
		
    }
}
