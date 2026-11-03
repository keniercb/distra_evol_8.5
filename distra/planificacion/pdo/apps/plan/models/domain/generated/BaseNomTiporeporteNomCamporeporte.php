<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseNomTiporeporteNomCamporeporte extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.nom_tiporeporte_nom_camporeporte');
        $this->hasColumn(
            'idtiporeporte', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idcamporeporte', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase


