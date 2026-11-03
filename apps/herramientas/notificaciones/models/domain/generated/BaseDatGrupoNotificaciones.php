<?php

abstract class BaseDatGrupoNotificaciones extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_gruponotificacion');
        $this->hasColumn(
            'iddestinatario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idgrupo', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_grupo')
        );
        $this->hasColumn(
            'nombre', 'character varying', 30,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'creadopor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}