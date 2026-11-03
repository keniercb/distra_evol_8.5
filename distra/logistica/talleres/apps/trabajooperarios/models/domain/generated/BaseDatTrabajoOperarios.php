<?php

abstract class BaseDatTrabajoOperarios extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_trabajooperarios');
        $this->hasColumn(
            'idtrabajooperarios', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_trabajooperarios')
        );
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idresponsable', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idperiodo', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importecobrar', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'varchar', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aprobado', 'varchar', 255, array('notnull' => false, 'primary' => false));
    }


    public function Setup()
    {
        parent::setUp();
    }


}
