<?php
abstract class BaseDatEvalprocesocomisionevaluacion extends Doctrine_Record
 {
   public function setTableDefinition()
    {
       $this->setTableName('mod_evaluaciones.dat_evalprocesocomisionevaluacion');
       $this->hasColumn('idprocesocomisionevaluacion', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('idpreprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idcomisionevaluacion', 'numeric', null, array('notnull' => true, 'primary' => false));
       $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

   public function Setup()
    {
       parent::setUp();
    }
 }//fin clase
?>

