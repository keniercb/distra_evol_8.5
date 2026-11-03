<?php

class DatDistribucionpedido extends BaseDatDistribucionpedido
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('foreign' => 'iddocumento', 'local' => 'idpedido'));
        $this->hasOne('DatDocumentoCliente', array('foreign' => 'iddocumento', 'local' => 'iddistribucion'));
        $this->hasOne('DatDistribucion', array('foreign' => 'iddistribucion', 'local' => 'iddistribucion'));
        $this->hasMany('DatDistribucionpedido', array('foreign' => 'iddocumento', 'local' => 'iddocumento'));
        if (class_exists('DatPedido')) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatDistribucionpedido',
                'properties' => array('local' => 'iddocumento', 'foreign' => 'idpedido')
            );
            LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatPedido(), $relations);
        }
        parent::setUp();
    }

    public function getPedidosByIdDocumento($datosDoc)
    {
        $query = new Doctrine_Query();
        $query->select(
            'count(dpp.idproducto) as cantproducto,
              d.iddocumento as iddocumento,
              d.fechacontable as fechacontable,
              d.nrodoc as nropedido,
              ddc.iddocumentocliente as iddocumentocliente,
              ddc.idcliente as idcliente,
              ddc.tipocliente as tipocliente,
              dp.iddocumento as idpedido,
              ddp.iddistribucionpedido'
        )->from('DatDistribucionpedido ddp')
            ->innerJoin('ddp.DatDocumento d')
            ->innerJoin('d.DatPedido dp')
            ->innerJoin('ddp.DatDocumentoCliente ddc')
            ->leftJoin('dp.DatProductopedido dpp')
            ->where(
                'ddp.iddistribucion = ? and dpp.idproducto = ?', array(
                    $datosDoc['iddocumento'], $datosDoc['idproducto']
                )
            )
            ->groupBy(
                'd.iddocumento,
                 d.fechacontable,
                 ddc.iddocumentocliente,
                 dp.iddocumento,
                 ddp.iddistribucionpedido'
            );
        if ($datosDoc['criterio']) {

        }
        return $query->fetchArray();
    }

    public function getDistribucionporIdPedido($ipedido)
    {
        $query = new Doctrine_Query();
        $result = $query->select("ddp.iddistribucion")
            ->from("DatDistribucionpedido ddp")
            ->where("ddp.idpedido = ?", $ipedido)
            ->fetchArray();
        $arreglo = array();
        foreach ($result as $obj) {
            $arreglo[] = $obj['iddistribucion'];
        }
        return $arreglo;
    }

    public function getProductosPedidoByIdDocumento($datosdoc)
    {
        $query = new Doctrine_Query();
        return $query->select(
            "sum(dpp.cantidad) as pedida,
             sum(dpo.cantidad),
             ddp.iddistribucionpedido,
             ddp.idpedido as idpedido,
             d.nrodoc as nrodoc,
             ddc.iddocumentocliente as iddocumentocliente,
             ddc.idcliente as idcliente,
             ddc.tipocliente as tipocliente"
        )->from('DatDistribucionpedido ddp')
            ->innerJoin('ddp.DatDocumentoCliente ddc')
            ->innerJoin('ddp.DatDocumento d')
            ->innerJoin('d.DatPedido dp')
            ->leftJoin('dp.DatProductopedido dpp')
            ->leftJoin('d.DatProdorden dpo')

            ->where('ddp.iddistribucion = ?', array($datosdoc['iddocumento']))
            ->groupBy(
                'd.iddocumento,
                 d.fechacontable,
                 ddp.iddistribucionpedido,
                 ddc.iddocumentocliente,
                 ddc.tipocliente,
                 dp.iddocumento'
            );
    }

    public function existeDistribucionPedido($iddocumento, $idpedido)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(ddp.iddistribucionpedido) as cantidad "
            . "FROM DatDistribucionpedido ddp WHERE ddp.iddistribucion = {$iddocumento} "
            . "AND ddp.idpedido = {$idpedido}"
        )->toArray();
        return $existe[0]['cantidad'] == 0 ? false : true;
    }

    /*public function existeDistribucionPedido($idpedido)
    {
        $existe = LogisticaDoctrineHelper::__init()->query("SELECT count(ddp.iddistribucionpedido) as cantidad "
            . "FROM DatDistribucionpedido ddp WHERE ddp.idpedido = {$idpedido} "
        )->toArray();
        return $existe[0]['cantidad']== 0 ? false : true;
    }*/

    public function devolverCantidades($idpedido)
    {
        $query = new Doctrine_Query();
        return $query->select(
            'ddp.iddistribucionpedido as iddistribucionpedido, d.nrodoc as nrodoc, dp.iddocumento as iddocumento,
             dpp.idpedido as idpedido, dpp.cantidad as cantidad, dpp.idproducto as idindicadorpedido'
        )->from('DatDistribucionpedido ddp')
            ->innerJoin('ddp.DatDocumento d')
            ->innerJoin('d.DatPedido dp')
            ->leftJoin('dp.DatProductopedido dpp')
            ->where('dpp.idpedido = ?', array($idpedido))
            ->fetchArray();
    }

    public function getPedidoByIdDocumento($datosDoc)
    {
        $query = new Doctrine_Query();

        if ($datosDoc['criterio'] && is_numeric($datosDoc['criterio'])) {
            $query->addWhere('d.nrodoc = ?', $datosDoc['criterio']);
        }
        if (!is_numeric($datosDoc['iddocumento'])) {
            $datosDoc['iddocumento'] = $datosDoc['iddocumento'][0];
        }
        $query->select(
            "ddp.iddistribucionpedido,
             d.nrodoc as nropedido,
             dcc.idcliente as idcliente,
             dp.iddocumento as iddocumento,
             dpp.idpedido as idpedido,
             dpp.idproducto as idindicador,
             round(dpp.cantidad,0) as pedida,
             round(dpp.distribuido,0) as distribuida,"
        )->from('DatDistribucionpedido ddp')
            ->innerJoin('ddp.DatDocumento d')
            ->innerJoin('d.DatDocumentoCliente dcc')
            ->innerJoin('d.DatPedido dp')
            ->leftJoin('dp.DatProductopedido dpp');
        $query->addWhere("ddp.iddistribucion = ?", array($datosDoc['iddocumento']));
        if ($datosDoc['idproducto']) {
            $query->addWhere("dpp.idproducto = ?", array($datosDoc['idproducto']));
        }
        if ($datosDoc['idpedido']) {
            $query->addWhere("dpp.idpedido = ?", array($datosDoc['idpedido']));
        }
        return $query->fetchArray();
    }
    public function devolverIdindicadorPedido($idpedido)
    {
        $query = new Doctrine_Query();
        $query->addSelect('dpp.idproductopedido as idproductopedido, dpp.idproducto as idindicadorpedido')
            ->from('DatProductopedido dpp')
            ->where('dpp.idpedido = ?', array($idpedido));
        return $query->fetchArray();
    }
    public function devolverPedidosDistribucion($iddocumento)
    {
        $query = new Doctrine_Query();
        $query->addSelect('ddp.iddistribucionpedido as iddistribucionpedido, ddp.idpedido as idpedido')
            ->from('DatDistribucionpedido ddp')
            ->where('ddp.iddistribucion = ?', array($iddocumento));
        return $query->fetchArray();
    }
}