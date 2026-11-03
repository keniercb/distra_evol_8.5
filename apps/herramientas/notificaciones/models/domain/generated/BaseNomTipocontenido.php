<?php

abstract class BaseNomTipocontenido extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipocontenido');
        $this->hasColumn(
            'denominacion', 'character varying', 30,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipocont', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_tipocontenido')
        );
        $this->hasColumn(
            'viaenvio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'presentacion', 'character varying', 30,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}