<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseDatHiscuadrediario
 *
 * @author kenier
 */
class BaseDatHiscuadrediario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.his_cuadrediario');
        $this->hasColumn(
            'idcierrediario', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn('iddeposito', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacierre', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('saldoinicial', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('saldofinal', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('saldocont', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('contador', 'numeric', 2, array('notnull' => true, 'primary' => false));
        $this->hasColumn('apertura', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechacierreanterior', 'date', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
