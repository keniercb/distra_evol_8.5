<?php

/**
 *
 */
class BaseDatDocTransfEntreEntidadesEntrada extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_doctransfentidadesentrada');
        $this->hasColumn('iddoctranfentidadesentrada', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcuentaorigen', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
