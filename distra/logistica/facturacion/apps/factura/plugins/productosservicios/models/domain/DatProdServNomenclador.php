<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatProdServNomenclador extends BaseDatProdServNomenclador
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
    }

    public function getProdServicio($idelemento)
    {
        $obj = Doctrine::getTable('DatProdServNomenclador')
            ->findByDql(
                'idelementofactura = ?', array($idelemento)
            );
        return $obj;
    }
}
