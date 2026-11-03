<?php

abstract class BaseDatIndicadorviaadquisicionorganosatisface extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface');
        $this->hasColumn(
            'idindicadorviaadquisicionorganosatisface', 'numeric', null,
            array(
                'notnull'  => true, 'primary' => true,
                'sequence' => 'mod_datosmaestros.sec_indicadorviaadquisicionorganosatisface'
            )
        );
        $this->hasColumn('idviaadquisicion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idorganosatisface', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

