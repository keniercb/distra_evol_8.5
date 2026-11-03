<?php

abstract class BaseDatTipocajaentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_tipocajaoentidad');
        $this->hasColumn(
            'idtipocajaoentidad', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => 'mod_logpuntoventa.sec_dattipocajaoentidad'
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idtipocaja', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
