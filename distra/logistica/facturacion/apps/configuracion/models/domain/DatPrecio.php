<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatPrecio extends BaseDatPrecio
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatCuentadesgloceprecio', array(
                'local'   => 'idcuentadesgloseprecio',
                'foreign' => 'idcuentadesgloseprecio'
            )
        );
        $this->hasOne(
            'DatMatrizpreciodualmonetaria', array(
                'local'   => 'idmatrizpreciodualidadmonetaria',
                'foreign' => 'idmatrizpreciodualidadmonetaria'
            )
        );
    }

    public function existsCuentaDesglosePrecio($value)
    {
        $result = Doctrine_Query::create()
            ->select('dp.idprecio , dp.idcuentadesgloseprecio as idcuentadesgloseprecio')
            ->from('DatPrecio dp')
            ->where('dp.idcuentadesgloseprecio=?', array($value))
            ->fetchArray();
        return $result;
    }

}
