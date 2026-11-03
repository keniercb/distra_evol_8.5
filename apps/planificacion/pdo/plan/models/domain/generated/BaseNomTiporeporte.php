<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseNomTiporeporte extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.nom_tiporeporte');
        $this->hasColumn(
            'idtiporeporte', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'dentiporeporte', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'desctiporeporte', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'icon', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'modovisual', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
      $this->hasColumn(
        'orden', 'numeric', null,
        array('notnull' => false, 'primary' => false)
      );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase


