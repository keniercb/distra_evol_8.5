<?php 
abstract class BaseDatDiaferiadohabilitado extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_diaferiadohabilitado'); 
       $this->hasColumn('iddiaferiadohabilitado', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_diaferiadohabilitado')); 
       $this->hasColumn('fecha', 'date' , array('notnull' => true, 'primary' => false)); 
	   $this->hasColumn('idpersona', 'numeric', 19 , array('notnull' => true, 'primary' => false));
	   $this->hasColumn('horas', 'time' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

