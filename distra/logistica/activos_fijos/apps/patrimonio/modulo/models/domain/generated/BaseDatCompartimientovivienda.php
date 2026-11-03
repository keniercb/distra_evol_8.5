<?php 
abstract class BaseDatCompartimientovivienda extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_logpatrimonio.dat_compartimientovivienda'); 
       $this->hasColumn('idcompartimientovivienda', 'numeric', null, array('notnull' => true, 'primary' => true, 
           'sequence' => 'mod_logpatrimonio.sec_datcompartimientovivienda'));
       $this->hasColumn('idcompartimiento', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

