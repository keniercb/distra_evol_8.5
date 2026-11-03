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
class BaseConfdefinicionpeso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logabc.conf_definicionpeso');
        $this->hasColumn(
            'iddefinicionpeso', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logabc.sec_definiciones')
        );
        $this->hasColumn('idclasificacionabc', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcriteriovaloracion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('peso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
