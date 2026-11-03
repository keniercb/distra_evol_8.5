<?php 
abstract class BaseDatInversionestfact extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_planifinversiones.dat_inversionestfact');
       $this->hasColumn('idinversionestfact', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_inversionestfact'));
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idinversion', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechacreacion', 'date', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('vigente', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idcontenido', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
    } 
 

 }//fin clase 


