<?php 
abstract class BaseDatPersonadocidentidad extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_persona.dat_personadocidentidad'); 
       $this->hasColumn('idpersonaidentidad', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_personaidentidad')); 
       $this->hasColumn('actual', 'numeric', null, array('notnull' => true, 'primary' => false)); 
	   $this->hasColumn('activo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('idtipodocidentidad', 'numeric', null, array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('numeroidentidad', 'character varying', 20 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
	   $this->hasColumn('serie', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false)); 	   
    } 
 
   public function Setup()
    { 
       parent::setUp();
	   $this->hasMany('DatPersona', array('local'=>'idpersona','foreign'=>'idpersona')); 	
	   $this->hasMany('NomTipodocidentidad', array('local'=>'idtipodocidentidad','foreign'=>'idtipodocidentidad'));	   
    } 
 }//fin clase 
?>

