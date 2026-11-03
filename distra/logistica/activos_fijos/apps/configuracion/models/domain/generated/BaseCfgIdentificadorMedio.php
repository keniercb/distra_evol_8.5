<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 3/24/2016
 * Time: 4:28 PM
 */
abstract class BaseCfgIdentificadorMedio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_identificadormedio');
        $this->hasColumn('ididentificadormedio', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identificador', 'character varying', 150, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 250, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombretabla', 'character varying', 255, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }
} 