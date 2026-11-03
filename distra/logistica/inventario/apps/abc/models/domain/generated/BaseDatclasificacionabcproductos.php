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
class BaseDatclasificacionabcproductos extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logabc.dat_clasificacionabcproductos');
        $this->hasColumn(
            'idclasificacionabcproductos', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logabc.sec_clasificacionabcproductos')
        );
        $this->hasColumn('idclasificacionabc', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconfperiodosclasificacionabc', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idlineaproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('peso', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idclasificacionabcmodificada', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
