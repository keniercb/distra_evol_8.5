<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseResCriteriomedida extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('res_criteriomedida');
        $this->hasColumn(
            'idcriteriomedida', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idumedida', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idobjetivo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestadocump', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'dencriterio', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valormeta', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valoreal', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'participante', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descriterio', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'gradocumplimiento', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estadocumplimiento', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idusuariocrea', 'numeric', null,
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


