<?php

class DatProductopedido extends BaseDatProductopedido
{

    public function setUp()
    {
        $this->hasOne(
            'DatPedido', array('local' => 'idpedido', 'foreign' => 'iddocumento')
        );
        $this->hasOne(
            'NomIndicador', array('local' => 'idproducto', 'foreign' => 'idindicador')
        );
        parent::setUp();
    }

    public function getCantidadProductosPedido($datosProd)
    {
        $query = new Doctrine_Query();
        $query->select("count(DISTINCT dpp.idproducto) as cantidad")
            ->from('DatProductopedido dpp')
            ->where(
                'dpp.idpedido = ?', array($datosProd['idpedido'])
            )->fetchArray();
        return $query->fetchArray();
    }

}
