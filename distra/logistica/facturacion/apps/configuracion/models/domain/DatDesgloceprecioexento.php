<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatDesgloceprecioexento extends BaseDatDesgloceprecioexento
{
    public function setUp()
    {
        parent::Setup();
        $this->hasOne(
            'DatCuentadesgloceprecio',
            array(
                'local'   => 'idcuentadesgloseprecio',
                'foreign' => 'idcuentadesgloseprecio'
            )
        );
        /*$this->hasOne(
            'DatMatrizprecio',
            array(
                'local'   => 'idmatrizprecio',
                'foreign' => 'idmatrizprecio'
            )
        );*/
    }

}
