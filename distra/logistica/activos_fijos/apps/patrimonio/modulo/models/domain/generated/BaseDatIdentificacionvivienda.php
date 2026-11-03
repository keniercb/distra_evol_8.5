<?php 
abstract class BaseDatIdentificacionvivienda extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_logpatrimonio.dat_identificacionvivienda'); 
       $this->hasColumn('observaciones', 'character varying', 255 , array('notnull' => false, 'primary' => false));
       $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => true));
      
       $this->hasColumn('preciolegal', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idregimen', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idautoriza', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nroresolucion', 'character varying', 19, array('notnull' => false, 'primary' => false));
       $this->hasColumn('responsable', 'character varying', 255, array('notnull' => false, 'primary' => false));
       $this->hasColumn('superficieutil', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nroinventario', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nroexpediente', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('anno', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('consecutivo', 'numeric', null, array('notnull' => false, 'primary' => false));        
       $this->hasColumn('ilegal', 'character varying', 255, array('notnull' => false, 'primary' => false));
       $this->hasColumn('idformapago', 'numeric', null, array('notnull' => false, 'primary' => false));       
       $this->hasColumn('mando', 'numeric', null, array('notnull' => false, 'primary' => false));       
       $this->hasColumn('precioarrendamiento', 'numeric', null, array('notnull' => false, 'primary' => false));       
             
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

