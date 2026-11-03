<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseResActividades extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('res_actividades');
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'tiporepeticion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'horainicio', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'horafin', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'lugar', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'esprincipal', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'id_importacion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 


