<?php

class DatProdorden extends BaseDatProdorden
{
    public function setUp()
    {
        $this->hasMany('DatOrden', array('local' => 'idorden', 'foreign' => 'idorden'));
        $this->hasMany('DatDocumento', array('local' => 'idorden', 'foreign' => 'iddocumento'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatDistribucion', array('local' => 'idorden', 'foreign' => 'iddistribucion'));
        $this->hasOne('DatProdordencmpto', array('local' => 'idprodorden', 'foreign' => 'idprodorden'));
        $this->hasMany('DatProdordenarea', array('local' => 'idprodorden', 'foreign' => 'idprodorden'));
        $this->hasOne('DatCancelacion', array('local' => 'idprodorden', 'foreign' => 'idprodorden'));
        parent::setUp();
    }

    /**
     * @param Doctrine_Query $query
     * @param type           $aliasExterno
     * @param type           $aliasLocal
     *
     * @return type
     */
    public function getJoinDatProdorden(Doctrine_Query $query, $aliasExterno, $aliasLocal = 'dpo')
    {
        return $query->innerJoin("{$aliasExterno}.DatProdorden {$aliasLocal}");
    }

    /**
     * @param Doctrine_Query $query
     * @param type           $alias
     *
     * @return type
     */
    public function getSelectSinAlias(Doctrine_Query $query, $alias = 'dpo')
    {
        return $query->addSelect(
            "{$alias}.idprodorden as idprodorden, "
            . "{$alias}.idproducto as idproducto, {$alias}.idcliente as idcliente, {$alias}.cancelar as cancelar,"
            . "{$alias}.cantidad as cantidad, {$alias}.version as version, {$alias}.motivo as motivo,"
            . "{$alias}.idorden as idorden, {$alias}.idestructuraop as idestructuraop"
        );
    }

    public function getDatosProducto(
        $datosDoc, $aliasLocal = 'dpo', $aliasExterno = 'p', $aliasDistribucion = 'dd',
        $aliasProdOrdenCmpto = 'cpmto'
    )
    {
        $query = new Doctrine_Query();
        if ($datosDoc['cantidad']) {
            $query->addWhere("{$aliasLocal}.cantidad = ?", array($datosDoc['cantidad']));
        }

        if ($datosDoc['iddeposito']) {
            $query->addWhere("{$aliasExterno}.idestructura = ?", array($datosDoc['iddeposito']));
        }

        if ($datosDoc['idpedido'] && $datosDoc['idcliente'] || $datosDoc['idcliente']) {
            $query->addWhere("{$aliasLocal}.idcliente = ?", array($datosDoc['idcliente']));
        }
        if ($datosDoc['idproductoorigen']) {
            $query->addWhere("i.idindicador <> ?", array($datosDoc['idindicadororigen']));
            $query->andWhereIn("{$aliasLocal}.idprodorigen ", $datosDoc['idproductoorigen']);
            $query->addWhere("{$aliasLocal}.idcliente = ?", array($datosDoc['idclienteorigen']));
        } else {
            $query->addWhere("{$aliasLocal}.idprodorigen IS null");
        }


        $query->addSelect(
            "{$aliasLocal}.idprodorden,
            {$aliasLocal}.idprodorigen as idprodorigen,
            {$aliasLocal}.idproducto,
            {$aliasLocal}.idcliente,
            {$aliasLocal}.cancelar as cancelar,
            {$aliasLocal}.cantidad as cantidad,
            {$aliasExterno}.idproducto as idproducto,
            {$aliasExterno}.precio as preciocontable,
            {$aliasExterno}.precioalternativo as precioalternativo,
            round(({$aliasLocal}.cantidad * {$aliasExterno}.precio),2) as importe,
            coalesce(round(({$aliasLocal}.cantidad * {$aliasExterno}.precioalternativo),2),0) as importealternativo,
            coalesce({$aliasExterno}.cantidad,0) as existencia,
            {$aliasExterno}.idestructura as idestructura,
            {$aliasDistribucion}.iddistribucion,
            {$aliasDistribucion}.tipodestino as tipocliente,
            {$aliasProdOrdenCmpto}.idprodorden,
            {$aliasProdOrdenCmpto}.entregado as entregado,
            {$aliasProdOrdenCmpto}.enproceso as enproceso,
            {$aliasProdOrdenCmpto}.pendiente as noprocesado"
        );
        $datDistribucionPedido = new DatDistribucionpedido();
        if ($datDistribucionPedido->getDistribucionporIdPedido($datosDoc['iddocumento'])) {
            $query->andWhereIn(
                "{$aliasLocal}.idorden ", $datDistribucionPedido->getDistribucionporIdPedido($datosDoc['iddocumento'])
            );
        } else {
            $query->addWhere("{$aliasLocal}.idorden = ?", $datosDoc['iddocumento']);
        }
        return $query->addSelect(
            "({$aliasExterno}.cantidad - coalesce((SELECT sum(_cc.cantidad) "
            . "FROM DatCantidadesComprometidas _cc "
            . "WHERE _cc.idproducto = {$aliasExterno}.idproducto AND _cc.estado = 1), 0)) AS disponible"
        )
        ->from("DatProdorden {$aliasLocal}")
        ->innerJoin("{$aliasLocal}.DatProductoLogistica {$aliasExterno}")
        ->innerJoin("{$aliasLocal}.DatDistribucion {$aliasDistribucion}")
        ->leftJoin("{$aliasLocal}.DatProdordencmpto {$aliasProdOrdenCmpto}");
    }

    public function getCantidadProducto($idproducto, $documentos, $cliente)
    {
        $query = new Doctrine_Query();
        $result = $query->select("SUM(dp.cantidad) as cantidad")
            ->from("DatProdorden dp")
            ->addWhere("dp.idproducto = ? and dp.idcliente = ?", array($idproducto, $cliente))
            ->andWhereIn("dp.idorden", $documentos)
            ->fetchArray();
        return $result[0]['cantidad'];
    }

    public function addDqlProductosDocumentos(
        Doctrine_Query $dql, $datosDoc, $asDoc = 'd', $asProducto = 'p', $asProdorden = 'po', $asProductoCmpto = 'cmpto'
    )
    {
        //$as = ($datosDoc['facturacion']) ? 'productos' : 'cant_productos';
        //$salida = ($datosDoc['salida']) ? "AND dprod.idestructuracomun = {$datosDoc['idestructuracomun']}":"";
        $iddeposito = $datosDoc['iddeposito'] ? " AND dprod.idestructura = {$datosDoc['iddeposito']}":"";
        if (!$datosDoc['facturacion']) {
            /*$select = "(SELECT count(DISTINCT {$asProducto}.idproducto) FROM DatProdorden {$asProducto}
                INNER JOIN {$asProducto}.DatProductoLogistica dprod ON (dprod.idproducto = {$asProducto}.idproducto) 
                WHERE {$asProducto}.idorden = {$asDoc}.iddocumento{$iddeposito}
                {$salida}) AS cant_productos";*/
            $select = "(SELECT count(DISTINCT {$asProducto}.idproducto) FROM DatProdorden {$asProducto}
                WHERE {$asProducto}.idorden = {$asDoc}.iddocumento) AS cant_productos";
        } else {
            $where = ($datosDoc['depositoreserva']) ?
                "dprod.idestructura in (" . implode(',', $datosDoc['depositoreserva']) . ")"
                : "dprod.idestructuracomun = {$datosDoc['idestructuracomun']}";
            $select = "(SELECT count(DISTINCT {$asProducto}.idproducto) FROM DatProdorden {$asProducto}
                  INNER JOIN {$asProducto}.DatProductoLogistica dprod ON (dprod.idproducto = {$asProducto}.idproducto)
                  INNER JOIN {$asProducto}.DatProdordencmpto dpcf
                  WHERE {$asProducto}.idorden =
                  {$asDoc}.iddocumento and dpcf.pendiente > 0 and ".$where.") as productos";
        }
        $dql->addSelect($select);

        if ($datosDoc['iddeposito'] || $datosDoc['ejecucion'] == 1) {
            $dql->innerJoin('dd.DatProdorden dpo2')
                ->innerJoin('dpo2.DatProdordencmpto dpoc2');
            if ($datosDoc['iddeposito']) {
                $dql->innerJoin('dpo2.DatProductoLogistica dpll')->addWhere('dpll.idestructura = ?', $datosDoc['iddeposito']);
            }

            if ($datosDoc['ejecucion'] == 1) {
                $condition = "SUM(dpoc2.pendiente) > 0";
                $dql->having($condition)
                    ->groupBy(
                        'd.iddocumento, dd.tipodestino, dd.tipodistribucion, dd.idestructuraop, dd.idnomconcepto,
                    dd.iddistribucion, ddc.idestructura'
                    );
            }
        }
        if ($datosDoc['estadoejecucion']) {
            $dql->addWhere(
                "(SELECT (CASE WHEN (SUM(por.cantidad) = SUM(procomp.entregado) AND
             SUM(por.cantidad) <> 0) THEN 3 WHEN (SUM(procomp.enproceso) > 0 OR 
             SUM(procomp.entregado) > 0) THEN 2 ELSE 1 END)
             from DatProdorden por INNER JOIN por.DatProdordencmpto procomp ON (procomp.idprodorden = por.idprodorden)
             WHERE por.idorden = {$asDoc}.iddocumento
             AND procomp.idprodorden = por.idprodorden) = ?", $datosDoc['estadoejecucion']
            );
        }
        if ($datosDoc['idcriterio'] && $datosDoc['idproducto']) {
            $signo = ($datosDoc['idcriterio'] == 1) ? '>' : (($datosDoc['idcriterio'] == 2) ? '<' : '=');
            $condition = "d.iddocumento IN (SELECT dpo3.idorden from DatProdorden dpo3
            INNER JOIN dpo3.DatProdordencmpto dpoc3 ON (dpoc3.idprodorden = dpo3.idprodorden)
            WHERE dpo3.idproducto = {$datosDoc['idproducto']}
            GROUP BY dpo3.idprodorden
            HAVING SUM(coalesce(dpo3.cantidad, 0)) {$signo} SUM(coalesce(dpoc3.entregado, 0)))";
            $dql->addWhere($condition);
        }
    }

    public function getDepositosDistribucion($documento, $idcliente)//esto se utiliza en facturacion
    {
        $sql = "SELECT distinct dp.idestructura from mod_logistica.dat_producto dp
                INNER JOIN mod_logdistribucion.dat_prodorden dpo on dpo.idproducto = dp.idproducto
                where dpo.idorden = {$documento} and dpo.idcliente = {$idcliente} and (
                  select sum(dpc.pendiente) from mod_logdistribucion.dat_prodordencmpto dpc
                  inner join mod_logdistribucion.dat_prodorden dpo1 on dpo1.idprodorden = dpc.idprodorden
                  where dpo1.idcliente = {$idcliente}
                  and dpo1.idorden = $documento and dpo.idprodorden = dpo1.idprodorden
                )>0";
        $conn = Zend_Registry::get('conexion');
        return $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getEntregadoProceso($parametros)//se utiliza en facturacion
    {
        $query = new Doctrine_Query();
        if ($parametros['idcliente']) {
            $query->addWhere('dpo.idcliente = ?', array($parametros['idcliente']));
        }
        if ($parametros['idproducto']) {
            $query->addWhere('dpo.idproducto = ?', array($parametros['idproducto']));
        }
        return $query->select("sum(dpc.entregado + dpc.enproceso) as endocumento")
            ->from("DatDistribucion dd")
            ->innerJoin('dd.DatProdorden dpo')
            ->innerJoin('dpo.DatProdordencmpto dpc')
            ->whereIn("dd.iddistribucion", $parametros['iddocumento'])
            ->fetchArray()[0]['endocumento'];
    }

    public function devolverProductos($iddocumento, $verificarcantidad)
    {
        $query = new Doctrine_Query();
        if ($verificarcantidad) {
            $query->addWhere('dpo.cantidad = 0 or dpo.cantidad IS NULL');
        }
        return $query->select("count(*) as cantidad")
            ->from("DatProdorden dpo")
            ->whereIn("dpo.idorden", $iddocumento)
            ->fetchArray();
    }

    /*public function getDatosProductosDistribuidos(
        $datosDoc, $aliasLocal = 'dpo', $aliasExterno = 'p',
        $aliasProductoP = 'pp', $aliasDistribucion = 'dd'
    ) {
        $query = new Doctrine_Query();
        return $query->addSelect(
            "{$aliasLocal}.idprodorden,
             {$aliasLocal}.idproducto as idproducto,
             {$aliasLocal}.idcliente as idcliente,
             {$aliasLocal}.cantidad as distribuida,
             {$aliasExterno}.precio as preciocontable,
             {$aliasExterno}.disponible as disponible,
             {$aliasExterno}.importe as importe,
             {$aliasExterno}.cantidad as existencia,
             {$aliasDistribucion}.idestructuraop as idestructuraop,
             {$aliasDistribucion}.tipodestino as tipocliente,
             {$aliasProductoP}.cantidad as pedida"
        )->from("DatProdorden {$aliasLocal}")
            ->innerJoin("{$aliasLocal}.DatProductoLogistica {$aliasExterno}")
            ->innerJoin("{$aliasLocal}.DatDistribucion {$aliasDistribucion}")
            ->innerJoin("{$aliasExterno}.DatProductopedido {$aliasProductoP}")
            ->addWhere(
                "{$aliasLocal}.idorden = ? and {$aliasLocal}.cantidad <> 0 and {$aliasLocal}.idcliente = ?",
                array($datosDoc['iddocumento'], $datosDoc['idcliente'])
            );
    }*/

    public function getDatosProductosDistribuidos($datosDoc, $aliasLocal = 'dpo', $aliasExterno = 'p')
    {
        $query = new Doctrine_Query();
        return $query->addSelect(
            "{$aliasLocal}.idprodorden,
             {$aliasExterno}.idproducto"
        )->from("DatProdorden {$aliasLocal}")
            ->innerJoin("{$aliasLocal}.DatProductoLogistica {$aliasExterno}")
            ->addWhere(
                "{$aliasLocal}.idorden = ? and {$aliasLocal}.cantidad <> 0 and {$aliasLocal}.idcliente = ?",
                array($datosDoc['iddocumento'], $datosDoc['idcliente'])
            );
    }


    public function getDatosProductosDistribuir($datosDoc, $aliasLocal = 'dpo', $aliasExterno = 'p',
        $aliasProductoP = 'pp', $aliasDistribucion = 'd'
    )
    {
        $query = new Doctrine_Query();
        return $query->addSelect(
            "{$aliasLocal}.idprodorden,
             {$aliasLocal}.idcliente as idcliente,
             {$aliasLocal}.cantidad as distribuida,
             {$aliasExterno}.cantidad as existencia,
             {$aliasProductoP}.cantidad as pedida,
             {$aliasDistribucion}.tipodestino as tipocliente"
        )->from("DatProdorden {$aliasLocal}")
            ->innerJoin("{$aliasLocal}.DatProductoLogistica {$aliasExterno}")
            ->innerJoin("{$aliasLocal}.DatDistribucion {$aliasDistribucion}")
            ->innerJoin("{$aliasExterno}.DatProductopedido {$aliasProductoP}")
            ->addWhere("{$aliasLocal}.idorden = ?", array($datosDoc['iddocumento']));
    }

    public function getCantidadProdOrden($datosDoc)
    {
        $query = new Doctrine_Query();
        $query->select('dpo.cantidad as distribuida')
            ->from('DatProdorden dpo')
            ->where('dpo.idorden = ? and dpo.idcliente = ?', array($datosDoc['iddocumento'], $datosDoc['idcliente']));
        return $query->fetchArray();
    }


    public function getPedidosDistribucion($datosDoc)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            "DISTINCT dpo.idorden as idorden, dpo.idcliente as idcliente, dd.idestructuraop as idestructuraop,
            sum(dpo.cantidad) as pedida, d.iddocumento as iddocumento ,d.iddocumento, ddp.idpedido as idpedido"
        )
            ->from('DatProdorden dpo')
            ->innerJoin("dpo.DatDistribucion dd")
            ->innerJoin("dd.DatDocumento d")
            ->innerJoin("d.DatDistribucionpedido ddp")
            //->leftJoin("d.DatPedido dp")
            ->where('dpo.idorden = ?', array($datosDoc['iddocumento']))
            // ->groupBy('dpo.idprodorden, dd.tipodestino, dd.iddistribucion, d.iddocumento, dp.iddocumento')
            ->groupBy('dpo.idorden, dpo.idcliente, dd.tipodestino, dd.idestructuraop, d.iddocumento, ddp.idpedido')
            ->offset($datosDoc['start'])
            ->limit($datosDoc['limit'])
            ->fetchArray();

        return $result;
    }

    public function getProductosByIdprod($datosDoc)
    {
        $query = new Doctrine_Query();
        $query->select("DISTINCT dpo.idproducto")
        ->from('DatProdorden dpo')
        ->innerJoin("dpo.DatProductoLogistica dpl")
        ->where(
            'dpo.idorden = ? and dpl.idproducto in ? and dpl.idestructura = ?', array($datosDoc['iddocumento'],
            $datosDoc['idproducto'], $datosDoc['idestructuraop'])
        );
        return $query->fetchArray();
    }

    public function getProductosByIddoc($iddocumento)
    {
        $query = new Doctrine_Query();
        $query->select("DISTINCT dpo.idproducto as idproducto")
            ->from('DatProdorden dpo')
            ->where('dpo.idorden = ?', $iddocumento);
        return $query->fetchArray();
    }

    public function existeProdOrden($iddocumento, $idproducto)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(dpo.idprodorden) as cantidad "
            . "FROM DatProdorden dpo WHERE dpo.idorden = {$iddocumento} "
            . "AND dpo.idproducto = {$idproducto}"
        )->toArray();
        return $existe[0]['cantidad'] == 0 ? false : true;
    }

    public function getCantidadProductoDocumento($datosProd)
    {
        $query = new Doctrine_Query();
        $query->select("count(DISTINCT dpo.idproducto) as cantidad")
            ->from('DatProdorden dpo')
            ->innerJoin("dpo.DatProductoLogistica dpl")
            ->where(
                'dpo.idorden = ?', array($datosProd['iddocumento'])
            )->fetchArray();
        return $query->fetchArray();
    }

    public function getTotalDistribuir($datosDoc, $idproducto)
    {
        $query = new Doctrine_Query();
        $query->select("sum(round(dpo.cantidad,2)) as cantidad")
            ->from('DatProdorden dpo')
            ->where(
                'dpo.idorden = ? and dpo.idproducto = ?', array($datosDoc['iddocumento'], $idproducto)
            )->fetchArray();
        return $query->fetchArray();
    }

    public function getCantidadProductoPedido($datosPedido)
    {
        $query = new Doctrine_Query();
        $query->select("count(DISTINCT dpo.idproducto) as cantidad")
            ->from('DatProdorden dpo')
            ->where(
                'dpo.idorden = ?', array($datosPedido['iddistribucion'])
            );
        return $query->fetchArray();
    }
}