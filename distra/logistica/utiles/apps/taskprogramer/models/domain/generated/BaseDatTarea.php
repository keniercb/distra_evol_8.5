<?php

abstract class BaseDatTarea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaskprogramer.dat_tarea');
        $this->hasColumn(
            'idtarea', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaskprogramer.sec_dattarea')
        );
        $this->hasColumn('code', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('json', 'json', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dow', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('horas', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('min', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ultimaejecucion', 'date', null, array('notnull' => true, 'primary' => false));

        /*$this->hasColumn('idnomtarea', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('json', 'json', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dow', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dom', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('horas', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('min', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('mes', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('notificar', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('dinotificar', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('notificacion', 'varchar', null, array('notnull' => false, 'primary' => false));*/
    }

    public function Setup()
    {
        parent::setUp();
    }

}
