<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:12
 */
abstract class BaseDatCilindroEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_cilindroentidad');
        $this->hasColumn(
            'idcilindroentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_logfacturacion.sec_datcilindroentidad')
        );
        $this->hasColumn(
            'idnomcilindro', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
