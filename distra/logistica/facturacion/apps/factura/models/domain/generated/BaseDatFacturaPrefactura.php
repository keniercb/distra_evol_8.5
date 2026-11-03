<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatFacturaPrefactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_facturaprefactura');
        /* $this->hasColumn(
          'idfacturaprefactura', 'numeric', null,
          array(
          'notnull'  => true, 'primary' => true,
          'sequence' => 'mod_logfacturacion.sec_datfacturaprefactura'
          )
          ); */
        $this->hasColumn(
            'idfactura', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'reservaprecio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'reservadisponible', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
