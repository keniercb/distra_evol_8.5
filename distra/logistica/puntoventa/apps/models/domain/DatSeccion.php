<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatSeccion extends BaseDatSeccion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatCaja', array('local' => 'idcaja', 'foreign' => 'idcaja'));
        $this->hasOne('DatRegistroefectivo', array('local' => 'idseccion', 'foreign' => 'idsesion'));
    }
}
