<?php

abstract class BaseConfTiempoxnomenclador extends Doctrine_Record {
  public function setTableDefinition() {
    $this->setTableName('mod_planificacion.conf_tiempoxnomenclador');
    $this->hasColumn('idtiempoxnomenclador', 'numeric', 0, array(
        'notnull' => true,
        'primary' => true,
        'sequence' => 'mod_planificacion.sec_tiempoxnomenclador'
      )
    );
    $this->hasColumn('idejercicio', 'numeric', 19, array(      
        'length' => 19,
        'notnull' => true
      )
    );
    $this->hasColumn('iddatosnomenclador', 'numeric', 19, array(
     
        'length' => 19,
        'notnull' => true
      )
    );
    $this->hasColumn('fechainicio', 'date', array(      
      
        'default' => 'now()',
        'notnull' => true
      )
    );
	$this->hasColumn('fechafin', 'date', array(      
      
        'default' => 'now()',
        'notnull' => true
      )
    );
  }
  
  public function setUp() {
    parent::setUp();
    
  }
  
}

?>
