<?php

/**
 * @class      DatCuadrobasicoproducto
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    2.0
 */
class DatCuadrobasicoproducto extends BaseDatCuadrobasicoproducto
{

    public function setUp()
    {
        $this->hasMany('DatCuadrobasico', array('local' => 'idcuadrobasico', 'foreign' => 'idcuadrobasico'));
        $this->hasMany('NomIndicador', array('local' => 'idproducto', 'foreign' => 'idindicador'));
        parent:: setUp();
    }

    public function existeCuadroBasicoProducto($idcuadrobasico, $idproducto)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(dcbp.idcuadrobasicoproducto) as cantidad "
            . "FROM DatCuadrobasicoproducto dcbp WHERE dcbp.idcuadrobasico = {$idcuadrobasico} "
            . "AND dcbp.idproducto = {$idproducto}"
        )->toArray();
        return $existe[0]['cantidad'] == 0 ? false : true;
    }

    public function getProductosCuadrobasico($datosDoc, $idcuadrobasico)
    {
        $query = new Doctrine_Query();
        $query->select(
            'dcbp.idcuadrobasicoproducto,
            dcbp.idcuadrobasico,
            dcbp.idproducto,
            ni.denominacion as denominacion,
            ni.codigo as codigo'
        )
            ->from('DatCuadrobasicoproducto dcbp')
            ->innerJoin('dcbp.NomIndicador ni')
            ->where(
                "dcbp.idcuadrobasico = ? and lower(ni.denominacion) ILIKE '%" . $datosDoc['criterio'] . "%'",
                array($idcuadrobasico)
            );
        $logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $datos = $logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray();
        return array('cantidad' => $query->count(), 'datos' => $datos);
    }
}