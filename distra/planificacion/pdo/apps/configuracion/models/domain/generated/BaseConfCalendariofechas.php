<?php

/* 
* Esta clase ha sido generada por Doctrine Generator 
*/

abstract class BaseConfCalendariofechas extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('conf_calendariofechas');
        $this->hasColumn(
            'idcalendariofechas', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'sec_calendariofechas')
        );
        $this->hasColumn(
            'horas', 'character varying', 10,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'anno', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcalendario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechas', 'text', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'heredada', 'text', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'horainicio', 'time', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'horafin', 'time', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

