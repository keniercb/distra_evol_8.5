<?php 
abstract class BaseDatDoccambiomaterial extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('dat_doccambiomaterial'); 
       $this->hasColumn('iddoccambiomaterial', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifproyecto.sec_doccambiomaterial')); 
       $this->hasColumn('constructor', 'character varying', 100 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('aprobadojefeproyecto', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idhito', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('especialidad', 'character varying', 100 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('aprobadoinversionista', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('descripcioncambio', 'character varying', 500 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('elaborado', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechadesviacion', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

