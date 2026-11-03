<?php
abstract class BaseDatEvalpersonascomision extends Doctrine_Record
 {
   public function setTableDefinition()
    {
       $this->setTableName('mod_evaluaciones.dat_evalpersonascomision');
       $this->hasColumn('idlpersonascomision', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcomisionevaluacion', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

   public function Setup()
    {
       parent::setUp();
       $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }
 }
?>