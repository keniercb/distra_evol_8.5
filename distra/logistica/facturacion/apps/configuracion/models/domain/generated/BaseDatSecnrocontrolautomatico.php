<?php

abstract class BaseDatSecnrocontrolautomatico extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_secnrocontrolautomatico');
        $this->hasColumn(
            'idsecuencianumerocontrol', 'numeric', null,
            array(
                'notnull'  => true, 'primary' => true,
                'sequence' => 'mod_logfacturacion.sec_datsecnrocontrolautomatico'
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nrofacturainicio', 'character varying', 10,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrofacturafinal', 'character varying', 10,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrocontrolinicial', 'character varying', 11,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrocontrolfinal', 'character varying', 11,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'actualnrocontrol', 'character varying', 11,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'actualnrofactura', 'character varying', 10,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
