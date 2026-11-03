<?php

class DatDistribucion extends BaseDatDistribucion
{
    public function setUp()
    {
        $this->hasOne(
            'DatDocumento', array(
                'foreign' => 'iddocumento', 'local' => 'iddistribucion'
            )
        );
        $this->hasMany(
            'DatDocumentoCliente', array(
                'foreign' => 'iddocumento', 'local' => 'iddocumento'
            )
        );
        $this->hasMany(
            'DatProdorden', array(
                'foreign' => 'idorden', 'local' => 'iddistribucion'
            )
        );
        $this->hasMany(
            'DatDistribucionpedido', array(
                'foreign' => 'iddistribucion', 'local' => 'iddistribucion'
            )
        );
        parent::setUp();
    }

    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select('MAX(iddistribucion)')
            ->from('DatDistribucion')->execute();
        $arr = $result->toArray();
        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatDistribucion')->execute();
        return $result->toArray();
    }

    public function getJoinDatDistribucion(Doctrine_Query $query, $datosDoc, $aliasExterno, $aliasLocal = 'dd')
    {
        if ($datosDoc['tipodistribucion']) {
            $query->addWhere('dd.tipodistribucion = ?', $datosDoc['tipodistribucion']);
        }
        if ($datosDoc['idnomconcepto']) {
            $query->addWhere('dd.idnomconcepto = ?', $datosDoc['idnomconcepto']);
        }
        if ($datosDoc['idestructuraop']) {
            $query->addWhere('dd.idestructuraop = ?', $datosDoc['idestructuraop']);
        }
        if (isset($datosDoc['salidaporfactura'])) {
            $query->addWhere('dd.salidaporfactura = ?', $datosDoc['salidaporfactura']);
        }
        if ($datosDoc['facturacion']) {
            $query->addWhere("dd.tipodestino = ?", 1);
            $query->addWhere("dd.tipodistribucion <> ?", 7);
            /*$query->addWhere(
                '((SELECT COUNT(dclif.idcliente) FROM DatDocumentoCliente dclif
                WHERE dclif.iddocumento = dd.iddistribucion) > (SELECT COUNT(dcl1f.idcliente)
                FROM DatDocumentoCliente dcl1f WHERE dcl1f.iddocumento = dd.iddistribucion
                WHERE dcl1f.iddocumento IN (
                        SELECT ddoc.iddocumento FROM DatEntrega dde
                        INNER JOIN dde.DatDocumento ddoc
                        INNER JOIN ddoc.DatDocumentoPadre ddp1
                        WHERE ddp1.idpadre = dd.iddistribucion
                    )
                 )) = true'
            );*/
            $where = ($datosDoc['depositoreserva'])
                ? "dpl.idestructura in (".implode(',', $datosDoc['depositoreserva']).")) > 0"
                : "dpl.idestructuracomun = {$datosDoc['idestructuracomun']}) > 0";
            $where1 = "";
            if ($datosDoc['idcliente']) {
                $where1 = " dpord.idcliente IN (".implode(',',$datosDoc['idcliente']).") AND ";
            }
            $query->addWhere(
                "(SELECT count(dpord.idproducto) FROM DatProdorden dpord
                    INNER JOIN dpord.DatProductoLogistica dpl ON (dpl.idproducto = dpord.idproducto)
                    INNER JOIN dpord.DatProdordencmpto dpcto
                  WHERE dpord.idorden = dd.iddistribucion and dpcto.pendiente > 0 and dpord.idcliente = ddc.idcliente 
                  and ".$where1.$where
            );
        }
        if ($datosDoc['salida']) {
            /*$query->addWhere(
                '((SELECT COUNT(dclif.idcliente) FROM DatDocumentoCliente dclif
                WHERE dclif.iddocumento = dd.iddistribucion) > (SELECT COUNT(dcl1f.idcliente)
                FROM DatDocumentoCliente dcl1f WHERE dcl1f.iddocumento = dd.iddistribucion
                WHERE dcl1f.iddocumento IN (
                        SELECT ddoc.iddocumento FROM DatDocfactura ddf
                        INNER JOIN ddf.DatDocumento ddoc ON (ddoc.iddocumento = ddf.idfactura)
                        INNER JOIN ddoc.DatDocumentoPadre ddp1 ON (ddp1.iddocumento = ddoc.iddocumento)
                        WHERE ddp1.idpadre = dd.iddistribucion
                    )
                 )) = true'
            );*/
            /*$query->addWhere(
                "(SELECT count(dpord.idproducto) FROM DatProdorden dpord
                    INNER JOIN dpord.DatProductoLogistica dpl ON (dpl.idproducto = dpord.idproducto)
                    INNER JOIN dpord.DatProdordencmpto dpcto
                  WHERE dpord.idorden = dd.iddistribucion and dpcto.pendiente > 0
                and dpl.idestructuracomun = {$datosDoc['idestructuracomun']}) > 0"
            );*/

            $query->addWhere(
                "(SELECT count(dpord.idproducto) FROM DatProdorden dpord
                    INNER JOIN dpord.DatProductoLogistica dpl ON (dpl.idproducto = dpord.idproducto)
                    INNER JOIN dpord.DatProdordencmpto dpcto
                    WHERE dpord.idorden = dd.iddistribucion and dpcto.pendiente > 0
                    and dpl.idestructura = {$datosDoc['iddeposito']}) > 0"
            );
        }
        if (!$datosDoc['ejecucion']) {
            $sql = "(SELECT count(e.iddocumento) FROM DatEntrega e INNER JOIN e.DatDocumento d2 "
                . "ON d2.iddocumento = e.iddocumento WHERE e.iddocumento = dp.iddocumento AND d2.estado IN (1, 2))";
            $sub = "";
            if(class_exists('DatDocfactura')){
                $sub = " AND (SELECT count(f.idfactura) FROM DatDocfactura f INNER JOIN f.DatDocumento d3 " .
                    "ON d3.iddocumento = f.idfactura WHERE f.idfactura = dp.iddocumento AND d3.estado IN (1, 2))".
                    " = 0 ";
            }
            $query->addSelect("(CASE WHEN {$sql} = 0 ".$sub." THEN 1 ELSE 0 END) as anular");
        }

        return $query->addSelect(
            "{$aliasLocal}.tipodestino as tipodestino,
             {$aliasLocal}.tipodistribucion as tipodistribucion,
             {$aliasLocal}.idestructuraop as idestructuraop,
             {$aliasLocal}.idnomconcepto as idnomconcepto,
             {$aliasLocal}.iddistribucion as iddistribucion,
             {$aliasLocal}.salidaporfactura as salidaporfactura,
             (CASE WHEN {$aliasLocal}.salidaporfactura = 1 THEN 'Factura' ELSE 'Inventario' END) as salidapor,
             ddc.idestructura as id"
        )->innerJoin("{$aliasExterno}.DatDistribucion {$aliasLocal}")
            ->innerJoin("{$aliasExterno}.DatDocumentoCliente ddc")
            ->leftJoin("{$aliasExterno}.DatDocumentoPadre dp ON (dp.idpadre = {$aliasLocal}.iddistribucion)");
    }

    public function getClientesDocumento($iddocumento, $idestructura = false, $depositosReserva = false)
    {
        $where = ($depositosReserva) ?
            "dprod.idestructura in (" . implode(',', $depositosReserva) . ")"
            : "dprod.idestructuracomun <> {$idestructura}";
        $whereaux = ($depositosReserva) ? "dprod1.idestructura in (" . implode(',', $depositosReserva) . ")"
            : "dprod1.idestructuracomun = {$idestructura}";
        $query = new Doctrine_Query();
        $query->select('ddc.iddocumentocliente, ddc.tipocliente, ddc.idcliente, ddc.prioridad, ddc.idestructura as id')
            ->from('DatDocumentoCliente ddc')
        ->orderby('ddc.prioridad');

        if (is_array($iddocumento['iddocumento'])) {
            $query->whereIn('ddc.iddocumento', $iddocumento['iddocumento']);
        } else {
            $query->where('ddc.iddocumento=?', $iddocumento['iddocumento']);
        }
        if ($iddocumento['idclientes']) {
            $query->whereIn('ddc.idcliente', $iddocumento['idclientes']);
        }
        if ($iddocumento['salfac']) {
            $iddocumentos = (is_array($iddocumento['iddocumento']))
                ? implode(',', $iddocumento['iddocumento'])
                : $iddocumento['iddocumento'];
            $joinfacSal = ($iddocumento['salfac'] == 'fac')
                ? 'inner join mod_logistica.dat_entrega de1 on d1.iddocumento = de1.iddocumento'
                : 'inner join mod_logfacturacion.dat_docfactura ddf on d1.iddocumento = ddf.idfactura';
            $conn = Zend_Registry::get('conexion');
            $sql = "select DISTINCT ddc1.idcliente from mod_logistica.dat_documentocliente ddc1
                  where ddc1.iddocumento in (
                  select d1.iddocumento from mod_logistica.dat_documento d1
                  $joinfacSal
			      inner join mod_logistica.dat_documentopadre ddp1 on d1.iddocumento = ddp1.iddocumento
                  where ddp1.idpadre in ($iddocumentos)
                )";
            $idsSalFac = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
            $sqlCliente = "select distinct dpo.idcliente from mod_logdistribucion.dat_prodorden dpo
                    inner join mod_logdistribucion.dat_prodordencmpto cmp on cmp.idprodorden = dpo.idprodorden
                    where dpo.idorden in($iddocumentos)
                    group by (dpo.idcliente)
                    having (SUM(cmp.pendiente) <= 0)";
            $idsSinCantidad = $conn->execute($sqlCliente)->fetchAll(PDO::FETCH_COLUMN);
            $sqlOtraEstructura = "select distinct dpo.idcliente from mod_logdistribucion.dat_prodorden dpo
                    inner join mod_logistica.dat_producto dprod on dprod.idproducto = dpo.idproducto
                    where dpo.idorden in($iddocumentos) and ".$where." and dpo.idcliente not in(
                      select distinct dpo1.idcliente from mod_logdistribucion.dat_prodorden dpo1
                    inner join mod_logistica.dat_producto dprod1 on dprod1.idproducto = dpo1.idproducto
                    where dpo1.idorden in($iddocumentos) and ".$whereaux."
                    )
                    group by (dpo.idcliente)";
            $idsOtraEstructura = $conn->execute($sqlOtraEstructura)
                ->fetchAll(PDO::FETCH_COLUMN);
            $ids = array_merge($idsSalFac, $idsSinCantidad, $idsOtraEstructura);
            $query->andWhereNotIn('ddc.idcliente', $ids)->fetchArray();
        }

        return $query->fetchArray();
    }


    //public function getDatosDistribucion($datosDoc, $aliasExterno = 'd', $aliasLocal = 'dd', $aliasDCliente = 'dc')
    /**
     * @param array $datosDoc
     * @param Doctrine_Query $query
     * @return Doctrine_Query
     */
    public function getDatosDistribucion($datosDoc, $query)
    {
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatDocfactura',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idfactura'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(
            new DatDocumento(), $relations
        );
        $query->addSelect(
            '(CASE WHEN df.idfactura IS NULL THEN d.nrodoc ELSE df.nrofactura END) as nrodoc, d.numeroref as numeroref, d.estado as estado, d.fechacontable, dc.idcliente as idcliente, '
            . 'dc.tipocliente AS tipocliente, dc.iddocumentocliente as iddocumentocliente, '
            . 'ndp.denominacion as tipodocumento'
        )
            ->from("DatDocumento d")
            ->leftJoin("d.DatDocfactura df")
            ->innerJoin("d.DatDocumentoCliente dc")
            ->innerJoin("d.DatDocumentoprim ddp")
            ->innerJoin("ddp.NomDocprim ndp")
            ->whereIn("d.estado", array(1, 2, 4));
        if ($datosDoc['criterio'] && is_numeric($datosDoc['criterio'])) {
            $query->addWhere("d.nrodoc = ? OR d.numeroref = ?", array($datosDoc['criterio'], $datosDoc['criterio']));
        }
        $datDistribucionPedido = new DatDistribucionpedido();
        if ($idpedidos = $datDistribucionPedido->getDistribucionporIdPedido($datosDoc['iddocumento'])) {
            $query->andWhereIn("d.iddocumento", $idpedidos);
        } else {
            $query->innerJoin("d.DatDocumentoPadre dp")
                ->addWhere("dp.idpadre = ?", array($datosDoc['iddocumento']));
        }
        return $query;
    }

    public function getDistribucionByPedido($idpedidos)
    {
        $query = new Doctrine_Query();
        $query->addSelect(
            'dd.iddistribucion, ddc.iddistribucion, ddc.idpedido'
        )
            ->from('DatDistribucion dd')
            ->innerJoin('dd.DatDistribucionpedido ddc')
            ->whereIN("ddc.idpedido", $idpedidos);
        return $query->fetchArray();
    }
}