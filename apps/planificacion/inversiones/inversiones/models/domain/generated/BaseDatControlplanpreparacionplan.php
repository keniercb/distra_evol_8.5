<?php 

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/05/16
 * Time: 9:23
 */

abstract class BaseDatControlplanpreparacionplan extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_planifinversiones.dat_controlplanpreparacionplan'); 
       $this->hasColumn('idcontrolplanpreparacionplan', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifinversiones.sec_controlplanpreparacionplan')); 
       $this->hasColumn('idcontrolplantiempocontrol', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idmonedaentidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }

