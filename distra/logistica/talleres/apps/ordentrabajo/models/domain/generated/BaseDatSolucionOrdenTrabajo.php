<?php

abstract class BaseDatSolucionOrdenTrabajo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_solucionordentrabajo');
        $this->hasColumn(
            'idsolucionordentrabajo', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datsolucionordentrabajo')
        );
        $this->hasColumn('solucion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtecnico', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

