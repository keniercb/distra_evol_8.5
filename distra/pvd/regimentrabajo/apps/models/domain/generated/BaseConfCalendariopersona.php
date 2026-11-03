<?php 
abstract class BaseConfCalendariopersona extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_calendariopersona');
       $this->hasColumn('idcalendariopersona', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_conf_calendariopersona'));
       $this->hasColumn('fecha', 'date' , array('notnull' => true, 'primary' => false));
	   $this->hasColumn('idtipodedia', 'numeric', 19 , array('notnull' => true, 'primary' => false));
	   $this->hasColumn('idpersona', 'numeric', 19 , array('notnull' => true, 'primary' => false));
	   $this->hasColumn('horas', 'time', array('notnull' => true, 'primary' => false));
       $this->hasColumn('idturnotrabajo', 'numeric', 19, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcargo', 'numeric', 19, array('notnull' => false, 'primary' => false));

    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

