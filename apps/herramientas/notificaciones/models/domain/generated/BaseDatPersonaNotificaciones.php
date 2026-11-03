<?php

abstract class BaseDatPersonaNotificaciones extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_personanotificacion');
        $this->hasColumn(
            'idpersona', 'numeric', null,
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