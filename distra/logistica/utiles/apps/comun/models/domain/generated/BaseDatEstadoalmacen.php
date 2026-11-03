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
class BaseDatEstadoalmacen extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_estadoalmacen');
        $this->hasColumn(
            'iddeposito', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn('fechaapertura', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacierre', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
