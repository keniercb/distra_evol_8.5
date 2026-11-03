<?php 
abstract class BaseDatControletapaplan extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_planifinversiones.dat_controletapaplan'); 
       $this->hasColumn('idcontroletapaplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_controletapaplan')); 
       $this->hasColumn('idcontrolplantiempocontrol', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idetapainversion', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }

