<?php 
abstract class BaseNomTipocombustible extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_logactivofijotangible.nom_tipocombustible'); 
       $this->hasColumn('idtipocombustible', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logactivofijotangible.sec_nomtipocombustible'));        
       $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('ordenizq', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('ordender', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idarbol', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function setUp() { 
       parent::setUp(); 
   } 
 }//fin clase
