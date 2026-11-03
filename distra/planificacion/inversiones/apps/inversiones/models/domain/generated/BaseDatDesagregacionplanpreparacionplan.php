<?php 

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/05/16
 * Time: 9:23
 */

abstract class BaseDatDesagregacionplanpreparacionplan extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_planifinversiones.dat_desagregacionplanpreparacionplan'); 
       $this->hasColumn('iddesagregacionplanpreparacionplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_desagregacionplanpreparacionplan')); 
       $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('iddesagregacionplan', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }

