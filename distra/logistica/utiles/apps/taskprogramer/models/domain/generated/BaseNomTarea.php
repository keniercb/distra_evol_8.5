<?php

abstract class BaseNomTarea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_lognotificacion.nom_tarea');
        $this->hasColumn(
            'idnomtarea', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_lognotificacion.sec_nomtarea')
        );
        $this->hasColumn('denominacion', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('clase', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('json', 'json', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
