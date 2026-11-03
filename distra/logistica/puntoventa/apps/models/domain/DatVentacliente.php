<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatVentacliente extends BaseDatVentacliente
{

    public function setUp()
    {
        parent::Setup();
        $this->hasOne('DatVenta', array('local' => 'idventacliente', 'foreign' => 'idpersona'));
        //$this->hasOne('DatVenta', array('local' => 'idventacliente', 'foreign' => 'identrega'));
    }

    public static function obtenerDatVentaClienteDadoCI($numeroidentidad)
    {
         return Doctrine_Query::create()
        ->select('*')
        ->from('DatVentacliente')
        ->where('numeroidentidad = ?', array($numeroidentidad))
        ->fetchArray();
    }
}
