<?php

abstract class BaseDatSubordinacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.dat_subordinacion');
        $this->hasColumn('idsubordinacion', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_subordinacion'));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idestructuraasistencia', 'numeric', null, array ('notnull' => false,'primary' => false));
    }


}

