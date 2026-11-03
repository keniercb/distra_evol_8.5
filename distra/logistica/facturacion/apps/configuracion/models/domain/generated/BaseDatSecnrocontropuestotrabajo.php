<?php

abstract class BaseDatSecnrocontropuestotrabajo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_logfacturacion.dat_secnrocontrolpuestotrabajo'
        );
        $this->hasColumn(
            'idsecuenciapuestotrabajo', 'numeric', null,
            array(
                'notnull'  => true, 'primary' => true,
                'sequence' => 'sec_datsecuenciapuestotrabajo'
            )
        );
        $this->hasColumn(
            'nroinicio', 'character varying', 11,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpuestotrabajo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'actual', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrofin', 'character varying', 11,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
