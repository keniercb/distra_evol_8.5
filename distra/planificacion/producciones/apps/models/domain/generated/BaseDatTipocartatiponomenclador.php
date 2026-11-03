<?php

abstract class BaseDatTipocartatiponomenclador extends Doctrine_Record {
  public function setTableDefinition() {
    $this->setTableName('mod_spouam.dat_tipocartatiponomenclador');
    $this->hasColumn('idtipocarta', 'numeric', 19, array(        
        'notnull' => true
      )
    );
    $this->hasColumn('idtiponomenclador', 'numeric', 19, array(       
        'notnull' => true
      )
    );
    $this->hasColumn('idtipocartatiponomenclador', 'numeric', 0, array(       
        'primary' => true
      )
    );
  }
  
  public function setUp() {
    parent::setUp();
  
  }
  
}

?>
