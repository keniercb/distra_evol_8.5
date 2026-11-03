<?php 
abstract class BaseDatDesagregacionetapaplan extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_planifinversiones.dat_desagregacionetapaplan'); 
       $this->hasColumn('iddesagregacionetapaplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_desagregacionetapaplan')); 
       $this->hasColumn('idetapainversion', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('iddesagregacionplan', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }

