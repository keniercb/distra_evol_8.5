<?php

abstract class BaseHisMedicion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.his_medidorcliente');
        $this->hasColumn(
            'idhismedicion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_hismedicion')
        );
        $this->hasColumn('fechamedicion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('consumo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmedicioncliente', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
