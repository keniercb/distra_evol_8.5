<?php

abstract class BaseDatEstructuraasistencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_regimentrabajo.dat_estructuraasistencia');
        $this->hasColumn('idpadre', 'numeric', null, array ('notnull' => true,'primary' => false));        
        $this->hasColumn('idcargo', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => false,'primary' => false));      
	$this->hasColumn('idestructuraasistencia', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_regimentrabajo.sec_dat_estructuraasistencia'));

    }


}

