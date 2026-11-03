<?php

/**
 * @author    Eduardo Aranda
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseResElementoNuevo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('res_elementonuevo');
        $this->hasColumn(
            'idelemento', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'denelemento', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoelemento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
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


