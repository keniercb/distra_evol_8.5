<?php

/**
 * Class BaseNomConceptopropiedad
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
abstract class BaseNomConceptopropiedad extends Doctrine_Record
{
    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.nom_conceptopropiedad');
        $this->hasColumn('idconceptopropiedad', 'numeric', NULL, array('notnull' => TRUE, 'primary' => TRUE));
        $this->hasColumn('idconcepto', 'numeric', NULL, array('notnull' => TRUE, 'primary' => FALSE));
        $this->hasColumn('idpropiedad', 'numeric', NULL, array('notnull' => TRUE, 'primary' => FALSE));
    }

    /**
     *
     */
    public function Setup()
    {
        parent::setUp();
    }
}