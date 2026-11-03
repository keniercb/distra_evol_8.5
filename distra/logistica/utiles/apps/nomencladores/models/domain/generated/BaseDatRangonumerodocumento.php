<?php 
abstract class BaseDatRangonumerodocumento  extends Doctrine_Record
 { 
   public function setTableDefinition()
   {
       $this->setTableName('mod_logfacturacion.dat_rangonumerodocumento');
       $this->hasColumn('idrango', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('nrodocumentoinicial', 'character varying', 15, array('notnull' => true, 'primary' => false));
       $this->hasColumn('nrodocumentofinal', 'character varying', 15, array('notnull' => true, 'primary' => false));
   }

   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
