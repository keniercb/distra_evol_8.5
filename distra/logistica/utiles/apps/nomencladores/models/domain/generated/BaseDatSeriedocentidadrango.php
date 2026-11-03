<?php 
abstract class BaseDatSeriedocentidadrango  extends Doctrine_Record
 { 
   public function setTableDefinition()
   {
       $this->setTableName('mod_logfacturacion.dat_seriedocentidadrango');
       $this->hasColumn('idseriedocentidadrango', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_seriedocentidadrango'));
       $this->hasColumn('idrango', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idseriedocentidad', 'numeric', null, array('notnull' => true, 'primary' => false));
   }

   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
