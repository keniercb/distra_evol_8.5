<?php 
abstract class BaseDatCl2indicador extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('dat_cl2indicador'); 
       $this->hasColumn('idcl2indicador', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifproyecto.sec_cl2indicador')); 
       $this->hasColumn('idcl2', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('observacion', 'character varying', 500 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('datosmaestros', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('consecutivoind', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

