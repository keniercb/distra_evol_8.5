<?php 
abstract class BaseDatOtrasInstalaciones extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_logpatrimonio.dat_otrasinstalaciones');
       $this->hasColumn('idotrasinstalaciones', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logpatrimonio.sec_datotrasinstalaciones'));
       $this->hasColumn('idotrasinstalacionesviv', 'numeric', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }

