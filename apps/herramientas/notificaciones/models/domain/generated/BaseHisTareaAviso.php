<?php

abstract class BaseHisTareaAviso extends BaseRecord
{

    public function setTableDefinition()
    {
        $this->setTableName('his_tareaaviso');
        $this->hasColumn(
            'idtarea', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_tareaaviso')
        );
        $this->hasColumn(
            'uuid', 'character varying', 40,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idaviso', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'contenidoreal', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'destinatariosreal', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'contactosreal', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ideventodespachado', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechacreacion', 'timestamp', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'viaaviso', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'asuntoreal', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}