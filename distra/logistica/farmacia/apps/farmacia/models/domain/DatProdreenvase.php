<?php

/**
 * @class      DatProdreenvase
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    1.0
 */
class DatProdreenvase extends BaseDatProdreenvase
{

    public function setUp()
    {
        $this->hasOne('Datreenvase', array('local' => 'idreenvase', 'foreign' => 'idreenvase'));
        parent:: setUp();
    }


    public function devolverProductos($iddocumento, $verificarcantidad)
    {
        $query = new Doctrine_Query();
        if ($verificarcantidad) {
            $query->addWhere('dpr.cantorigen = 0');
        }
        return $query->select("count(dpr.cantorigen) as cantidad")
            ->from("DatProdreenvase dpr")
            ->whereIn("dpr.idreenvase", $iddocumento)
            ->fetchArray();
    }
}