<?php

abstract class BaseDatPermisoevaluacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_permisoevaluacion');
        $this->hasColumn('idevaluador', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idevaluado', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('permiso', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idpermisoevaluacion', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_evaluaciones.sec_permisoevaluacion'));
    }


}