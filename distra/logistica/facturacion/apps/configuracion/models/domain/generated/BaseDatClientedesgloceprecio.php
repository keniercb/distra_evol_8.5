<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatClientedesgloceprecio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_clientedesgloseprecio');
        $this->hasColumn(
            'idclientedesgloseprecio',
            'numeric', null,
            array(
                'notnull' => true, 'primary' => true
            )
        );
        $this->hasColumn(
            'idcliente',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoprecioentidad',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoprecio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
