<?php 
abstract class BaseDatCl2 extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('dat_cl2'); 
       $this->hasColumn('idcl2', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifproyecto.sec_cl2')); 
       $this->hasColumn('numcontrato', 'character varying', 20 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('constructor', 'character varying', 100 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idproyecto', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('fechaeaprobado', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechaelaborado', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idhito', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('aprobado', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idcl1', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('revisado', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('consecutivo', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('especialidad', 'character varying', 100 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('fechaerevisado', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('elaborado', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

