<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseDatEstadoalmacen
 *
 * @author kenier
 */
class BaseNomtipoparametrosinventario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logabc.nom_tipoparametrosinventario');
        $this->hasColumn(
            'idtipoparametrosinventario', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn('denominacion', 'varchar', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('activo', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
