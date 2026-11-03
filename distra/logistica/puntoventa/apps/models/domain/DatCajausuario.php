<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatCajausuario extends BaseDatCajausuario
{

    public function Setup()
    {
        parent::Setup();
        $this->hasOne('DatCaja', array('local' => 'idcaja', 'foreign' => 'idcaja'));
    }
}
