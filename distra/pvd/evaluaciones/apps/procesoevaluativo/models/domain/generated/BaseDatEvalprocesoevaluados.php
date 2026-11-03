<?php

abstract class BaseDatEvalprocesoevaluados extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_evalprocesoevaluados');
        $this->hasColumn('idprocesoevaluados', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_evaluaciones.sec_dat_evalprocesoevaluados'));
        $this->hasColumn('idpreprocesoevaluativo', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idprocesoplanilla', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idcentrodatos', 'numeric', null, array ('notnull' => true,'primary' => false));
    }


}

