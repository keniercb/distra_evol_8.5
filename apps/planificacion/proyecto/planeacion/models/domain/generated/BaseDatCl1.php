<?php 
abstract class BaseDatCl1 extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('dat_cl1'); 
       $this->hasColumn('idcl1', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifproyecto.sec_cl1')); 
       $this->hasColumn('fechaeaprobadocontratocl1', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechaelaboradocl1', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechaeaprobadoptecnicocl1', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('aprobadoptecnicocl1', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('aprobadocontratocl1', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('elaboradocl1', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

