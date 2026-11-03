<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseResArcResPlan extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('res_arc_res_plan');
        $this->hasColumn(
            'idarc', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idplan', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idautorrelacion', 'numeric', null,
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

