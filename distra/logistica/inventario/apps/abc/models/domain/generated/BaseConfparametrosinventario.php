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
class BaseConfparametrosinventario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logabc.conf_parametrosinventario');
        $this->hasColumn(
            'idconfparametrosinventario', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logabc.sec_conf_parametrosinventario')
        );
        $this->hasColumn(
            'idparametrosinventario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idformulaovalorsistema', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('formula', 'varchar', 512, array('notnull' => false, 'primary' => false));
        $this->hasColumn('formulacalcular', 'varchar', 512, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('formacalculo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valorusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'varchar', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn('porcentual', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('lugaresdecimales', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('consolida', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
