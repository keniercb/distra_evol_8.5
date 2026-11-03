<?php
abstract class BaseDatEvaldefprocesoplanillas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_evaldefprocesoplanillas');
        $this->hasColumn('idprocesoplanilla', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_defprocesoplanilla'));
        $this->hasColumn('iddefprocesoevaluativo', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idplanilla', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmodelo', 'numeric', 19, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}