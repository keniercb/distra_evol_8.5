<?php

abstract class BaseDatCondicionpagoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_condicionpagoentidad');
        $this->hasColumn(
                'idcondicionpagoentidad', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datcondicionpagoentidad')
        );
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcondicionpago', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
