<?php 
abstract class BaseDatAsistencia extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_asistencia'); 
       $this->hasColumn('idasistencia', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_dat_asistencia')); 
       $this->hasColumn('fechahoraentrada', 'timestamp without time zone' , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('fdesde', 'date' , array('notnull' => false, 'primary' => false));
       $this->hasColumn('fhasta', 'date' , array('notnull' => false, 'primary' => false));
       $this->hasColumn('idcausa', 'numeric', 19 , array('notnull' => false, 'primary' => false));
	   $this->hasColumn('hrsdescontadas', 'character varying', 5 , array('notnull' => false, 'primary' => false));
       $this->hasColumn('idpersona', 'numeric', 19, array('notnull' => true, 'primary' => false));      
       $this->hasColumn('fechahorasalida', 'timestamp without time zone',  array('notnull' => false, 'primary' => false));
       $this->hasColumn('fecharegistro', 'date' , array('notnull' => true, 'primary' => false));
       $this->hasColumn('observacion', 'character varying' , array('notnull' => false, 'primary' => false));
       $this->hasColumn('idpadre', 'numeric', 19, array('notnull' => false, 'primary' => false));
       $this->hasColumn('horasextras', 'character varying', 8, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhabilitado', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hferiadas', 'character varying', 8, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersonacontrola', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersonamodifica', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('certificado', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersonacertifica', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcargo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hrstrabajadas', 'time', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idgrupodescanso', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idturnotrabajo', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('aprobado', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersonaaprueba', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('certificadocontinuado', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('origen', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechahoraentrada_multicausa', 'timestamp without time zone' , array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechahorasalida_multicausa', 'timestamp without time zone' , array('notnull' => false, 'primary' => false));
    }
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

