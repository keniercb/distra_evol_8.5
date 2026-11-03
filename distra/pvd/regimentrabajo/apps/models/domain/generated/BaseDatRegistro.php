<?php 
abstract class BaseDatRegistro extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_registro');
       $this->hasColumn('idregistro', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_dat_registro'));
       $this->hasColumn('fechahoraentrada', 'timestamp without time zone' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idpersona', 'numeric', 19, array('notnull' => true, 'primary' => false));      
       $this->hasColumn('fechahorasalida', 'timestamp without time zone',  array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcargo', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

