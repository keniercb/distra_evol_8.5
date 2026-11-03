<?php 
abstract class BaseConfCalendario extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_calendario'); 
       $this->hasColumn('idcalendario', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_calendario')); 
       $this->hasColumn('fecha', 'date' , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('idtipodedia', 'numeric', 19 , array('notnull' => true, 'primary' => false));
	   $this->hasColumn('horas', 'time', array('notnull' => true, 'primary' => false));
       $this->hasColumn('idgrupodescanso', 'numeric', 19, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idturnotrabajo', 'numeric', 19, array('notnull' => false, 'primary' => false));

    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

