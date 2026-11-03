<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatCuentafactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_cuentafactura');
        $this->hasColumn(
            'idcuentafactura', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_cuentafactura')
        );
        $this->hasColumn(
            'idfactura', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcuentasuministrador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
