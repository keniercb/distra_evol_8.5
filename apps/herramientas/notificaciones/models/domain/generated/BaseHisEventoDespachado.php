<?php

abstract class BaseHisEventoDespachado extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('his_eventodespachado');
        $this->hasColumn(
            'ideventodespachado', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_eventodespachado')
        );
        $this->hasColumn(
            'idevento', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'originadopor', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'timestamp', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'exito', 'numeric', 1, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'detalle', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}