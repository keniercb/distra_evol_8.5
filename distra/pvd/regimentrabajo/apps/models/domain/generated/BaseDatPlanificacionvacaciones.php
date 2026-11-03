<?php 
abstract class BaseDatPlanificacionvacaciones extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_planvacaciones'); 
       $this->hasColumn('idplanvacaciones', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_planvacaciones'));    
	   $this->hasColumn('mes', 'numeric', 2 , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('priquincena', 'numeric', 19 , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('segquincena', 'numeric', 19 , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('idpersona', 'numeric', 19 , array('notnull' => true, 'primary' => false));
       $this->hasColumn('anno', 'numeric', 4 , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

