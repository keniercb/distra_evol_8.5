<?php

abstract class BaseConfDistribucion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('conf_distribucion');

        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'tipodistribucion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'completarmaximo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'politicacovertura', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'diascriticos', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'formadistribucion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
