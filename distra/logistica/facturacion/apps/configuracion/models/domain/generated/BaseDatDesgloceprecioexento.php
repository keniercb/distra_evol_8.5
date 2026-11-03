<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDesgloceprecioexento extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_desgloseprecioexento');
        $sequence = 'mod_logfacturacion.sec_datdesgloceprecioexento';
        $this->hasColumn(
            'iddesgloseprecioexento',
            'numeric', null,
            array(
                'notnull'  => true, 'primary' => true,
                'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idcuentadesgloseprecio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmatrizprecio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
