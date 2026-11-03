<?php 
abstract class BaseDatDocumentoInmuebles extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('dat_documetosinmuebles' ); 
       $this->hasColumn('idexpediente', 'numeric', null, array('notnull' => true, 'primary' => true)); 
       $this->hasColumn('idnumeroserieactivo', 'numeric', null, array('notnull' => true, 'primary' => true)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>
