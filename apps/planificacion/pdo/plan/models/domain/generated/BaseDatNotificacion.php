<?php

abstract class BaseDatNotificacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_notificacion');
        $this->hasColumn(
            'idnotificacion', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_datnotificacion')
        );
        $this->hasColumn(
            'idhistorial', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase
