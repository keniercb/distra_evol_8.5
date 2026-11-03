<?php 
abstract class BaseDatIndicadorobjcrit extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_objetivos.dat_indicadorobjcrit'); 
       $this->hasColumn('idindicadorobjcrit', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_objetivos.sec_indicadorobjcrit')); 
       $this->hasColumn('idobjetivo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idautor', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false));
       $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

