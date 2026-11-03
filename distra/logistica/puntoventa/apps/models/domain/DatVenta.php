<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatVenta extends BaseDatVenta
{

    public function Setup()
    {
        parent::Setup();
        $this->hasOne('NomTipocaja', array('local' => 'idcaja', 'foreign' => 'idtipocaja'));
        $this->hasOne('DatDevolucion', array('local' => 'idventas', 'foreign' => 'idventas'));
        $this->hasOne('DatAreaventa', array('local' => 'idareaventa', 'foreign' => 'idareaventa'));
        $this->hasMany('DatVentaproducto', array('local' => 'idventas', 'foreign' => 'idventas'));
        $this->hasMany('DatVentatarjeta', array('local' => 'idventas', 'foreign' => 'idventas'));
        $this->hasMany('DatVentacliente', array('local' => 'idpersona', 'foreign' => 'idventacliente'));
        //$this->hasMany('DatVentacliente', array('local' => 'identrega', 'foreign' => 'idventacliente'));
        $this->hasMany('DatVentaorden', array('local' => 'idventas', 'foreign' => 'idventas'));
    }
}
