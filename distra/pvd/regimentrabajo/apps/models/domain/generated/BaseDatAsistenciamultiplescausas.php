<?php 
abstract class BaseDatAsistenciamultiplescausas extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_asistenciamultiplescausas');
       $this->hasColumn('idasistenciamultiplescausas', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_dat_asistenciamultiplescausas'));
       $this->hasColumn('horaentrada', 'time' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcausa', 'numeric', 19 , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('horas', 'character varying', 5 , array('notnull' => false, 'primary' => false));
       $this->hasColumn('idpersona', 'numeric', 19, array('notnull' => true, 'primary' => false));      
       $this->hasColumn('horasalida', 'time',  array('notnull' => false, 'primary' => false));
       $this->hasColumn('fecharegistro', 'date' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('observaciones', 'character varying' , array('notnull' => false, 'primary' => false));
       $this->hasColumn('idasistencia', 'numeric', 19, array('notnull' => true, 'primary' => false));
       $this->hasColumn('fechaentrada', 'date' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('fechasalida', 'date' , array('notnull' => true, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

