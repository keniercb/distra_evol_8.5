<?php
abstract class BaseDatPlanconteom extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_planconteom');
        $this->hasColumn(
            'idplanconteom', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'sec_datplanconteom'
            )
        );
        $this->hasColumn('idplan', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idperiodo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('porciento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuarioaprobado', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}