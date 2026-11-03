<?php

/**
 * @class      DatReenvase
 * @package    Farmacia
 * @subpackage Farmacia
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    1.0
 */
class DatReenvase extends BaseDatReenvase
{

    public function setUp()
    {
        $this->hasOne('DatDocumento', array( 'foreign' => 'iddocumento', 'local' => 'idreenvase'));
        $this->hasOne('DatEstructuraop', array('foreign' => 'idestructuraop', 'local' => 'idarea'));
        $this->hasMany('DatMovimientos', array('foreign' => 'iddocumento', 'local' => 'idreenvase'));
        parent:: setUp();
    }


    public function getDatosReenvase(Doctrine_Query $query, $params)
    {
        if ($params['numero']) {
            $query->addWhere('d.nrodoc = ?', $params['numero']);
        }
        if ($params['idestado']) {
            $query->addWhere('d.estado = ?', $params['idestado']);
        }
        if ($params['idarea']) {
            $query->addWhere('dr.idarea = ?', $params['idarea']);
        }

        $query->addSelect(
            "dr.idreenvase AS idreenvase, dr.fecha AS fecha, dr.idarea as idarea, dr.cantdif as cantdif, "
            . "coalesce(round(dr.importecosto, 2), 0) as importecostodif, coalesce(round(dr.importeventa, 2), 0) as importeventadif, "
            . "(case when (dr.cantdif) > 0 then 1 when (dr.cantdif) < 0 then 2 else 0 end) as diferencia, "
            . "dpr.idprodreenvase as idprodreenvase, dpr.cantorigen as cantidad, "
            . "dprdo.idprodreenvasado as idprodreenvasado, dprdo.cantdestino as cantidaddest, "
            . "dpl.idproducto as idproductoorigen, round(dpl.cantidad,6) as existenciaorigen, "
            . "dpl.precio as preciocosto, dpl.precioventa as precioventa, "
            . "round((dpl.cantidad * dpl.precio),2) as importecosto, "
            . "round((dpl.cantidad * dpl.precioventa),2) as importeventa, "
            . "dc.codigo as codigoorigen, dc.capacidad as dosisunitaria, "
            . "ni.denominacion as productoorigen, "
            . "dpldo.idproducto as idproductodestino, dpldo.cantidad as existenciadestino, "
            . "dpldo.precio as preciocostodestino, dpldo.precioventa as precioventadestino, "
            . "round((dpldo.cantidad * dpldo.precio),2) as importecostodestino, "
            . "round((dpldo.cantidad * dpldo.precioventa),2) as importeventadestino, "
            . "dcdo.codigo as codigodestino, dcdo.capacidad as dosisunitariadestino, "
            . "nido.denominacion as productodestino, "
            . "dm.idmovimiento as idmovimiento, "
            . "de.denominacion AS area"
        );
    }

    public function getJoinDatReenvase(Doctrine_Query $query, $aliasExterno)
    {
        $query->innerJoin("{$aliasExterno}.DatReenvase dr")
            ->leftJoin("dr.DatProdreenvase dpr")
            ->leftJoin("dr.DatProdreenvasado dprdo")
            ->leftJoin("dpr.DatProductoLogistica dpl")
            ->leftJoin("dprdo.DatProductoLogistica dpldo")
            ->leftJoin("dpl.NomIndicador ni")
            ->leftJoin("dpldo.NomIndicador nido")
            ->leftJoin("ni.DatCodificador dc")
            ->leftJoin("nido.DatCodificador dcdo")
            ->leftJoin("dr.DatMovimientos dm")
            ->leftJoin("dr.DatEstructuraop de on de.idestructuraop = dr.idarea");

    }

}