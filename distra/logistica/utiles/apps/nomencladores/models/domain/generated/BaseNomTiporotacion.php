<?php

abstract class BaseNomTiporotacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.nom_tiporotacion');
        $this->hasColumn(
            'idtiporotacion', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logfarmacia.sec_nomtiporotacion')
        );
        $this->hasColumn(
            'automatica', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 300,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', 1,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase
