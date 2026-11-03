<?php

/**
 * @class      DatProdreenvasado
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    1.0
 */
class DatProdreenvasado extends BaseDatProdreenvasado
{

    public function setUp()
    {
        $this->hasOne('Datreenvase', array('local' => 'idreenvase', 'foreign' => 'idreenvase'));
        $this->hasOne('DatProdreenvase', array('local' => 'idprodorigen', 'foreign' => 'idprodreenvase'));
        $this->hasOne('DaProducto', array('local' => 'idprodreenvasado', 'foreign' => 'idproducto'));
        parent:: setUp();
    }


    public function devolverProductos($iddocumento, $verificarcantidad)
    {
        $query = new Doctrine_Query();
        if ($verificarcantidad) {
            $query->addWhere('dpr.cantdestino = 0');
        }
        return $query->select("count(dpr.cantdestino) as cantidad")
            ->from("DatProdreenvasado dpr")
            ->whereIn("dpr.idreenvase", $iddocumento)
            ->fetchArray();
    }

    public function existeProdreenvasado($iddocumento)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(dpr.idprodreenvasado) as cantidad "
            . "FROM DatProdreenvasado dpr WHERE dpr.idreenvase = {$iddocumento} "
        )->toArray();
        return $existe[0]['cantidad'] == 0 ? false : true;
    }
}