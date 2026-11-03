<?php

/**
 * @class      DatLotereenvase
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    1.0
 */
class DatLotereenvase extends BaseDatLotereenvase
{

    public function setUp()
    {
        $this->hasOne('DatProdreenvase', array('local' => 'idprodreenvase', 'foreign' => 'idprodreenvase'));
        $this->hasMany('DatLote', array('local' => 'idlotereenvase', 'foreign' => 'idlote'));
        parent:: setUp();
    }


    public function existeLotereenvase($idlotereenvase)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(dlr.idlotereenvase) as cantidad "
            . "FROM DatLotereenvase dlr WHERE dlr.idlotereenvase = {$idlotereenvase} "
        )->toArray();
        return $existe[0]['cantidad'] == 0 ? false : true;
    }
}