<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseDatSubordinacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_subordinacion');
        $this->hasColumn(
            'idpadre', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idhijo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'nivelrelacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase


