<?php 
abstract class BaseDatConstruccionvivienda extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_logpatrimonio.dat_construccionvivienda'); 
       $this->hasColumn('idparedesde', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idtipologia', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('idtechode', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idsistemaconstructivo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idestatustecnico', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('tipoconstruccion', 'numeric', null, array('notnull' => false, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

