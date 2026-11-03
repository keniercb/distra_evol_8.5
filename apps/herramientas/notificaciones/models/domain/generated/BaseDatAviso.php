<?php

abstract class BaseDatAviso extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_aviso');
        $this->hasColumn(
            'activo', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 1)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 30,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoaviso', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idaviso', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_aviso')
        );
        $this->hasColumn(
            'creadopor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechacreacion', 'timestamp', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cmpvalidador', 'character varying', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'svcvalidador', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}