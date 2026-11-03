<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatCaja extends BaseDatCaja
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatAreaventa', array('local' => 'idareaventa', 'foreign' => 'idareaventa'));
        $this->hasOne('NomTipocaja', array('local' => 'idtipocaja', 'foreign' => 'idtipocaja'));
        $this->hasMany('DatCajausuario', array('local' => 'idcaja', 'foreign' => 'idcaja'));
    }
}
