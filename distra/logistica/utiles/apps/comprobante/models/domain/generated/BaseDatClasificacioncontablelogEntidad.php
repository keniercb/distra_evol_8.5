<?php

abstract class BaseDatClasificacioncontablelogEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_clasificacioncontableentidad');
        $this->hasColumn(
            'idclasificacioncontableentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datclasificacioncontableentidad')
        );
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idclasificacioncontable', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
