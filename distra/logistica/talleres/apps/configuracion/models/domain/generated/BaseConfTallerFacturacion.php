<?php

abstract class BaseConfTallerFacturacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.conf_tallerfacturacion');
        $this->hasColumn(
            'idestructuracomun', 'numeric', 19,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idoperacion', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'facturarcerrar', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'facturarparcial', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idoperacionmayorista', 'numeric', 19, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

