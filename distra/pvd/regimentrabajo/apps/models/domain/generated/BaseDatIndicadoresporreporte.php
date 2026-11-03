<?php 
abstract class BaseDatIndicadoresporreporte extends Doctrine_Record
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_regimentrabajo.dat_indicadoresporreporte');
       $this->hasColumn('idreporte', 'numeric', null, array('notnull' => true, 'primary' => false,'sequence' => 'mod_regimentrabajo.sec_indicadoresporreporte_seq' ));
       $this->hasColumn('idcausa', 'numeric', null, array('notnull' => false, 'primary'  => false));
       $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('orden', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idindicadorporreporte', 'numeric', null, array('notnull' => true, 'primary' => true));

    }

 }
?>
