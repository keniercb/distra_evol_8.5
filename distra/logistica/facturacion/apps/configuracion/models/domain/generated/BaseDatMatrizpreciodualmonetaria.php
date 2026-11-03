<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatMatrizpreciodualmonetaria extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_matrizpreciodualmonetaria');
        $sequence = 'mod_logfacturacion.sec_datmatrizpreciodualidadmonetaria';
        $this->hasColumn(
            'idmatrizpreciodualidadmonetaria',
            'numeric', null,
            array(
                'notnull'  => true, 'primary' => true,
                'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idmoneda',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'precioventa',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmatrizprecio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'precio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'porciento',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
