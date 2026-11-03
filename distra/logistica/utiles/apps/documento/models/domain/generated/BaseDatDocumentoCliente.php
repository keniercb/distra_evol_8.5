<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseDatDocumentoCliente
 *
 * @author Kenier
 */
abstract class BaseDatDocumentoCliente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_documentocliente');
        $this->hasColumn(
            'iddocumentocliente', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datdocumentocliente')
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcliente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipocliente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('prioridad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcondicionpago', 'numeric', null, array('notnull' => false, 'primary' => false));
        
    }

    public function setUp()
    {
        parent::setUp();
    }

}
