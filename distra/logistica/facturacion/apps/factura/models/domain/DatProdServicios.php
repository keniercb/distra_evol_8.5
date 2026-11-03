<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatProdServicios extends BaseDatProdServicios
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatDesglosemonedaprodserv', array('local' => 'idprodservicio', 'foreign' => 'idprodservicio')
        );
    }

    public function getProductos($idelementofactura)
    {
        $query = new Doctrine_Query();
        $query->from('DatProdServicios dps')
            ->innerJoin('dps.DatDesglosemonedaprodserv ddps')
            ->where('dps.idelementofactura = ?', array($idelementofactura));
        return $query->fetchArray();
    }
}
