<?php 
abstract class BaseDatCl2desviacion extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('dat_cl2desviacion'); 
       $this->hasColumn('idcl2desviacion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planifproyecto.sec_cl2desviacion')); 
       $this->hasColumn('idcl2', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('responsable', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('aprobadojefeproy', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('cambioproyecto', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('observacion', 'character varying', 500 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('aprobadoinversionista', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('datosmaestros', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('consecutivoinddesv', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('elaborado', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechacambiomaterial', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('aprobadodirector', 'character varying', 100 , array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

