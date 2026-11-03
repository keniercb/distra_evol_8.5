<?php 
abstract class BaseDatIndicador extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_indicador');
       $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => true,'sequence' => 'mod_regimentrabajo.sec_indicador'));
       $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => true, 'primary' => false)); 
       $this->hasColumn('descripcion', 'character varying', 255 , array('notnull' => false, 'primary' => false));
       $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('unidadmedida', 'character varying', null , array('notnull' => true, 'primary' => false));
        $this->hasColumn('idexpresionmatematica', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('gestionable', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

 }
?>

