<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseConfVendedor extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.conf_vendedor');
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idpersona', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}
