<?php 
abstract class BaseDatEquiposmediosvivienda extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_logpatrimonio.dat_equiposmediosvivienda'); 
       $this->hasColumn('idequipomedio', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logpatrimonio.sec_datequiposmediosvivienda'));
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idregnumactivo', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('nroinventario', 'numeric', null, array('notnull' => false, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

