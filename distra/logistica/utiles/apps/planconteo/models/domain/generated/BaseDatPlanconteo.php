<?php
abstract class BaseDatPlanconteo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_planconteo');
        $this->hasColumn(
            'idplan', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_datplanconteo'
            )
        );
        $this->hasColumn('idestructuraop', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'character varying', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}