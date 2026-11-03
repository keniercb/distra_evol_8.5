<?php 
abstract class BaseDatAsistenciasesion extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_asistenciasesion');
       $this->hasColumn('idasistenciasesion', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_asistenciasesion'));
       $this->hasColumn('idasistencia', 'numeric', 19 , array('notnull' => false, 'primary' => false));
       $this->hasColumn('idsesion', 'numeric', 1, array('notnull' => true, 'primary' => false));
       $this->hasColumn('fechahoraentrada', 'timestamp without time zone' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('fechahorasalida', 'timestamp without time zone',  array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcausa', 'numeric', 19 , array('notnull' => false, 'primary' => false));
        $this->hasColumn('hrsdescontadas', 'character varying', 8 , array('notnull' => false, 'primary' => false));
        $this->hasColumn('horasextras', 'character varying', 8 , array('notnull' => false, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

