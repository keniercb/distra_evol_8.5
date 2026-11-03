<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseResCriterioResInvolucrados extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('res_criteriomedida_res_involucrados');
        $this->hasColumn(
            'idcriteriomedida', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idinvolucrado', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'llaveinvolucrado', 'numeric', null,
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


