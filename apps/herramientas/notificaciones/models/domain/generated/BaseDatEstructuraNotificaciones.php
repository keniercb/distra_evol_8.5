<?php

abstract class BaseDatEstructuraNotificaciones extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_estructuranotificacion');
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddestinatario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}