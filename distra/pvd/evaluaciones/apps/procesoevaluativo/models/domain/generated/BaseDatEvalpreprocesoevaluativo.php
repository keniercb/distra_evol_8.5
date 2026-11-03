<?php
abstract class BaseDatEvalpreprocesoevaluativo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_evalpreprocesoevaluativo');
        $this->hasColumn('idpreprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('fechafinproceso', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechainicioproceso', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddefprocesoevaluativo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idorden', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('opinante', 'numeric', null, array('notnull' => false, 'primary' => false));
        
    }

    public function Setup()
    {
        parent::setUp();
    }
}
