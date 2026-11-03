<?php

class DatProductoReceta extends BaseDatProductoReceta
{

    public function setUp()
    {
        parent::setUp();
        if (class_exists('NomIndicador')) {
            $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        }
        $this->hasOne('NomReceta', array('local' => 'idreceta', 'foreign' => 'idreceta'));
    }

    public function getProducto(Doctrine_Query $query, $aliasInd = 'i', $parametros, $aliasinterno = 'dpr')
    {
        $query->addSelect(
            "{$aliasinterno}.cantidad as cantidad, "
            . "{$aliasinterno}.idproductoreceta as idproductoreceta, "
            . "{$aliasinterno}.imprescindible as imprescindible, "
            . "{$aliasinterno}.aceptalternativo as aceptalternativo"
        )
            ->innerJoin("{$aliasInd}.DatProductoReceta {$aliasinterno}")
            ->addWhere("{$aliasinterno}.idreceta = ?", array($parametros['idreceta']));
        return $query;
    }

    public function existeProductoReceta($iddeposito, $idprod)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatProductoLogistica dp')
            ->where("dp.idestructuraop = ? and dp.idprod = ?", array($iddeposito, $idprod))->execute();
        return $result->toArray();
    }

}
