<?php

/**
 * @author    Jesus Ariel Guerra Lopez
 * @version   3.0.0
 * @copyright XETID
 */
abstract class BaseNomTipoinvolucrado extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('nom_tipoinvolucrado');
        $this->hasColumn(
            'idtipoinvolucrado', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'inicial', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'incidencia', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

