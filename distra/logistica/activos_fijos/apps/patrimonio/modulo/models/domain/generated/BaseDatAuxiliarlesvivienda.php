<?php 
abstract class BaseDatAuxiliarlesvivienda extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_logpatrimonio.dat_auxiliarlesvivienda');
       $this->hasColumn('nroidentidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('idocupacionviv', 'numeric', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('idvinculacionlaboral', 'numeric', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('fechanacicmiento', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('analisis', 'character varying', 19 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nombreyapellido', 'character varying', 60 , array('notnull' => false, 'primary' => false));        
       $this->hasColumn('codigocuentacontrato', 'character varying', 20 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nombrecuentacontable', 'character varying', 20 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nrocontrato', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechacontrato', 'date', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

