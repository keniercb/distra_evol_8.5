<?php 
abstract class BaseDatRangonumerocontrol  extends Doctrine_Record
 { 
   public function setTableDefinition()
   {
       $this->setTableName('mod_logfacturacion.dat_rangonumerocontrol');
       $this->hasColumn('idrango', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_rangonumerocontrol'));
       $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('activo', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('nrocontrolinicial', 'character varying', 15, array('notnull' => true, 'primary' => false));
       $this->hasColumn('nrocontrolfinal', 'character varying', 15, array('notnull' => true, 'primary' => false));
   }

   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
