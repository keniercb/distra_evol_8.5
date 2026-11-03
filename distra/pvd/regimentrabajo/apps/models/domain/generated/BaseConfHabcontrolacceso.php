<?php 
abstract class BaseConfHabcontrolacceso extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.conf_habcontrolacceso');
       $this->hasColumn('id', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('habilitado', 'numeric' , array('notnull' => true, 'primary' => false));
        $this->hasColumn('fuente', 'numeric' , array('notnull' => false, 'primary' => false));
        $this->hasColumn('dirautenticacion', 'character varying' , array('notnull' => false, 'primary' => false));
        $this->hasColumn('dirdatos', 'character varying' , array('notnull' => false, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

