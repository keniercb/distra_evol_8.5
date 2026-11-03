<?php

abstract class BaseDatProyectorol extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaproyecto.dat_proyectorol');
        $this->hasColumn(
            'idproyectorol', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaproyecto.sec_proyectorol')
        );
        $this->hasColumn('idproyectoconcepto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idrol', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('activo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('obligatorio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('add', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('mod', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('del', 'numeric', null, array('notnull' => false, 'primary' => false));
    }
}