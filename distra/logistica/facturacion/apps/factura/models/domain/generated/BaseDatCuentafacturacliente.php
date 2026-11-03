<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatCuentafacturacliente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_cuentafacturacliente');
        $this->hasColumn(
            'idcuentafacturacliente', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_cuentafacturacliente')
        );
        $this->hasColumn(
            'idfactura', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcuentacliente', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'numerocuenta', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
