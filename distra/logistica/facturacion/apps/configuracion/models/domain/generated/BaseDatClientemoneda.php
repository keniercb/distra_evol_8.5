<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatClientemoneda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_clientemoneda');
        $this->hasColumn(
            'idclientemoneda',
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
            'idestructura',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoprecio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'idmoneda',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
