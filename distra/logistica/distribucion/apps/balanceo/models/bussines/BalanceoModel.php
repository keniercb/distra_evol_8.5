<?php

class BalanceoModel extends DocumentoLogisticaModel
{

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);

    }

    public function isDocEditable($iddocumento)
    {
        return $this->estaDocenEstado($iddocumento, 1);
    }

    public function estaDocenEstado($iddocumento, $estado = 1)
    {
        $doc = parent::findDocumento($iddocumento);
        if ($doc->estado == $estado) {
            return true;
        }
        return false;
    }

    public function cargarEncabezado($iddocumento)
    {
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $docPrim = $this->configuracionHelper->ObtenerDocumentoPrimPorId($doc->iddoc);
        $datDocObservaciones = new DatDocObservaciones();
        $docobs = $datDocObservaciones->buscarObservacion($iddocumento);
        return array(
            'numero' => is_null($doc->nrodoc) ? $doc->numeroref : $doc->nrodoc,
            'fecha' => $doc->fechacontable,
            'estado' => $doc->estado,
            'idoperacion' => $doc->idoperacion,
            'observaciones' => $docobs[0]['observaciones'],
            'tipo' => $docPrim->sigla
        );
    }

    /**
     * MÃ©todo para adicionar los padres del documento de distirbucion
     *
     * @params Integer $iddocumento Identificador del documento de distribucion
     * @params array $padres Arreglo con los id de los documentos padres
     *
     * @return void
     */
    private function adicionarDocumentoPadre($iddocumento, $padres)
    {
        $collDocumentoPadre = new Doctrine_Collection('DatDocumentoPadre');
        $documentoPadre = new DatDocumentoPadre();
        foreach ($padres as $key => $idpadre) {
            if (!$documentoPadre->verificarRelacionPadreHijo($iddocumento, $idpadre)) {
                $documentopadre = new DatDocumentoPadre();
                $documentopadre->idpadre = $idpadre;
                $documentopadre->iddocumento = $iddocumento;
                $collDocumentoPadre->add($documentopadre);
            }
        }
        $collDocumentoPadre->save();
    }

    /**
     * MÃ©todo para adicionar un documento de distribucion
     *
     * @params array $datosDoc Arreglo con los parametros para adicionar un documento
     *
     * @return Integer
     */
    public function adicionarDocumento($datosDoc)
    {
        $documento = parent::adicionarDocumento($datosDoc);
        $docbalanceo = new DatDocBalanceo();
        if ($datosDoc['iddocumento']) {
            $docbalanceo->assignIdentifier($datosDoc['iddocumento']);
        }
        $docbalanceo->synchronizeWithArray($datosDoc);
        $documento->DatDocBalanceo = $docbalanceo;
        $documento->observaciones = '';
        $documento->save();
        if ($datosDoc['documentos']) {
            $this->adicionarDocumentoPadre($documento->iddocumento, $datosDoc['documentos']);
        }
        $this->adicionarProductosBalanceo($documento->iddocumento, $datosDoc['documentos']);

        $this->guardarObservaciones(array('iddocumento' => $documento->iddocumento, 'observaciones' => $datosDoc['observaciones']));

        return array('iddocumento' => $documento->iddocumento, 'nro' => $documento->nrodoc,
            'fecha' => $documento->fechacontable, 'numeroref' => $documento->numeroref, 'success'=>true
        );
    }

    public function guardarObservaciones($parametros)
    {
        $datDocObservaciones = new DatDocObservaciones();
        $existeobs = $datDocObservaciones->buscarObservacion($parametros['iddocumento']);
        if (!empty($existeobs)) {
            $obsExistente = new DatDocObservaciones();
            $obsExistente->assignIdentifier($existeobs[0]['iddocobservaciones']);
            $obsExistente->observaciones = $parametros['observaciones'];
            $obsExistente->save();
        } else {
            $regHistorico = new DatDocObservaciones();
            $regHistorico->iddocumento = $parametros['iddocumento'];
            $regHistorico->fecha = date('d/m/Y');
            $regHistorico->observaciones = $parametros['observaciones'];
            $regHistorico->save();
        }
        return true;
    }

    public function agregarPedidos($params)
    {
        $this->adicionarDocumentoPadre($params['iddocumento'], $params['idpedidos']);
        $this->adicionarProductosBalanceo($params['iddocumento'], $params['idpedidos']);
    }

    public function eliminarPedidos($params)
    {
        $strPedidos = implode(',', $params['idpedidos']);

        $sql0 = "
        SELECT pbd.idproducto
        FROM mod_logdistribucion.dat_prodbalanceopedido pbp
        INNER JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd ON pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
        WHERE
          pbp.iddocpedido in ($strPedidos)
      ";
        $conn0 = Zend_Registry::get('conexion');
        $idproductos = $conn0->fetchAll($sql0);

        $sql = "
        DELETE FROM mod_logdistribucion.dat_prodbalanceopedido dpbp
        WHERE
          dpbp.iddocpedido IN ($strPedidos)
          AND dpbp.idproductobalanceo IN (
              SELECT pb.idproductosbalanceo
                FROM mod_logdistribucion.dat_productosbalanceo pb
                WHERE pb.iddocbalanceo = {$params['iddocumento']}
            )
      ";
        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();

        $sql1 = "
        DELETE FROM mod_logistica.dat_documentopadre dp
        WHERE
        dp.iddocumento = {$params['iddocumento']}
        AND dp.idpadre IN ($strPedidos)
      ";
        $conn1 = Zend_Registry::get('conexion');
        $query1 = $conn1->prepare($sql1);
        $query1->execute();

        // Para limpiar la tabla dat_productosbalanceo que tenga productos sin pedidos
        $sql2 = "
        DELETE FROM mod_logdistribucion.dat_productosbalanceo pb
        WHERE pb.idproductosbalanceo IN (
          SELECT pb1.idproductosbalanceo FROM mod_logdistribucion.dat_productosbalanceo pb1
            LEFT JOIN mod_logdistribucion.dat_prodbalanceopedido dpbp on dpbp.idproductobalanceo = pb1.idproductosbalanceo
            WHERE
              dpbp.idproductobalanceo IS NULL
              AND pb1.iddocbalanceo = {$params['iddocumento']}
        )
      ";
        $conn2 = Zend_Registry::get('conexion');
        $query2 = $conn2->prepare($sql2);
        $query2->execute();

        // Limppiar las cantidades comprometidas realizadas en el pedido a eliminar
        $cantComprometidaModel = new CantidadesComprometidasModel();
        $ids = array_map(function ($el) {
            return $el['idproducto'];
        }, $idproductos);
        $cantComprometidaModel->eliminarCantidadComprometida($params['iddocumento'], $ids);

    }

    public function adicionarProductosBalanceo($iddocumento, $idpedidos)
    {
        $strPedidos = implode(',', $idpedidos);
        $sql = "
      INSERT INTO mod_logdistribucion.dat_productosbalanceo
      (idindicador, iddocbalanceo, idclasificacionabc )
      SELECT DISTINCT i.idindicador, {$iddocumento}, abc.idclasificacionabctotal
      FROM mod_logdistribucion.dat_productopedido dpp
      INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dpp.idproducto


      LEFT JOIN mod_logabc.dat_clasificacionabcproductos abc on abc.idindicador = i.idindicador
      LEFT JOIN mod_logdistribucion.dat_prodpedidosatisfechobalanceo dppsb on dppsb.idproductopedido = dpp.idproductopedido

      WHERE
        dpp.idpedido in ($strPedidos)
        AND dpp.servicio = 0
        AND dpp.contratado = 0
        AND (dppsb.cantidadnecesaria is null OR dppsb.cantidadnecesaria > dppsb.cantidadprocesada)
      GROUP BY i.idindicador, dpp.idpedido, abc.idclasificacionabctotal, dpp.cantidad

      ON CONFLICT ON CONSTRAINT dat_productosbalanceo_idx
      DO NOTHING;
      ";

        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();

        $sql1 = "
        INSERT INTO mod_logdistribucion.dat_prodbalanceopedido ( idproductobalanceo, iddocpedido, cantidadpedidos, cantcomprar )
        SELECT pb.idproductosbalanceo, pp.idpedido,
        (pp.cantidad -  (CASE WHEN dppsb.cantidadprocesada is null THEN 0 ELSE dppsb.cantidadprocesada END) ), 0
        FROM mod_logdistribucion.dat_productosbalanceo pb
        INNER JOIN mod_logdistribucion.dat_productopedido pp on pp.idproducto = pb.idindicador
        LEFT JOIN mod_logdistribucion.dat_prodpedidosatisfechobalanceo dppsb on dppsb.idproductopedido = pp.idproductopedido

        WHERE
          pp.idpedido in ($strPedidos)
          AND pb.iddocbalanceo = {$iddocumento}
          AND (
            dppsb.cantidadnecesaria <> dppsb.cantidadprocesada
            OR
            dppsb.idproductopedido IS NULL
          )
        ON CONFLICT ON CONSTRAINT dat_prodbalanceopedido_idx
        DO NOTHING;

      ";
        $conn1 = Zend_Registry::get('conexion');
        $query1 = $conn1->prepare($sql1);
        $query1->execute();

        $sql2 = "
        INSERT INTO
          mod_logdistribucion.dat_pedidosatisfechobalanceo
        (
          iddocpedido,
          satisfecho
        )
        SELECT p.iddocumento, 0
        FROM mod_logdistribucion.dat_pedido p
        WHERE p.iddocumento IN ($strPedidos)
        ON CONFLICT ON CONSTRAINT dat_pedidosatisfechobalanceo_pkey
        DO NOTHING
        ;
      ";
        $conn2 = Zend_Registry::get('conexion');
        $query2 = $conn2->prepare($sql2);
        $query2->execute();

        $sql3 = "
        INSERT INTO mod_logdistribucion.dat_prodpedidosatisfechobalanceo
        (idproductopedido, cantidadprocesada, cantidadnecesaria)

        SELECT pp.idproductopedido, 0, pp.cantidad
        FROM mod_logdistribucion.dat_productopedido pp
        WHERE pp.idpedido IN ($strPedidos)

        ON CONFLICT ON CONSTRAINT dat_prodpedidosatisfechobalanceo_pkey
        DO NOTHING;
      ";

        $conn3 = Zend_Registry::get('conexion');
        $query3 = $conn3->prepare($sql3);
        $query3->execute();
    }

    /**
     * MÃ©todo para devolver los documentos de distribucion
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverDocumentos($datosDoc)
    {
        $datosDoc['idestructuracomun'] = $this->idestructuracomun;

        $qDoc = $this->getDocumentos($datosDoc);
        $docbalanceo = new DatDocBalanceo();
        $qDoc = $docbalanceo->getJoinDatDocBalanceo($qDoc, 'd', 'ddb');
        $docbalanceo->addFiltersQueryDocBalanceo($qDoc, $datosDoc, 'd', 'ddb');
        $datosDoc = $this->logisticaDoctrine->addQueryLimits($qDoc, $datosDoc)->fetchArray();
        return array('cantidad' => $qDoc->count(), 'datos' => $datosDoc);
    }

    /**
     * @return Doctrine_Query
     */
    public function getDocumentos($parametros = array())
    {
        $query = $this->getQueryDocumento('d');
        DatDocumentoCliente::addDqlClientesDocumentos($query, 'd', 'c', $parametros);
        $this->producto->getMovimientoModel()->getJoinContarMovimientos($query, 'd', 'm');
        //$this->addFiltersQueryDocumento($query, $parametros, 'd');
        if ($parametros['idcliente'] || $parametros['tipocliente']) {
            DatDocumentoCliente::addFilterCliente($query, 'd', 'dcc', $parametros);
        }
        return $query;
    }

    public function getIdPedidosPadre($iddocumento)
    {
        $extraer = function ($valor) {
            return $valor['idpadre'];
        };

        $data =
            Doctrine_Query::create()
                ->select("ddp.idpadre as idpadre")
                ->from("DatDocumentoPadre ddp")
                ->where("ddp.iddocumento = {$iddocumento}")
                ->fetchArray(array(), Doctrine_Core::HYDRATE_SCALAR);

        return array_map($extraer, $data);
    }

    /*
    public function getDatosPedidos($params)
    {
    $pedido = new PedidoService();
    $datos = $pedido->cargarDocPedido($params);
    return $datos;
    }
     */
    public function getProductosPedidosFromDoc($params)
    {

        $sql = "
        SELECT
          pb.idproductosbalanceo,
          i.idindicador,
          (
          	SELECT COALESCE(round(SUM(pbp.cantidadpedidos),2), 0)
            FROM mod_logdistribucion.dat_prodbalanceopedido pbp
            WHERE pbp.idproductobalanceo = pb.idproductosbalanceo
          ) as  totalpedidos,
          (
          	SELECT COALESCE(round(SUM(pbd.cantidad),2), 0.00)
            FROM mod_logdistribucion.dat_prodbalanceodistribuir pbd
            INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp ON pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
            WHERE pbp.idproductobalanceo = pb.idproductosbalanceo
          ) as totaldistribuidos,
          (
          	SELECT COALESCE(round(SUM(pbp.cantcomprar),2), 0.00)
            FROM mod_logdistribucion.dat_prodbalanceopedido pbp
            WHERE pbp.idproductobalanceo = pb.idproductosbalanceo
          ) as  totalcomprar,
          i.numeropieza as codigo,
          i.denominacion,
          um.abreviaturaunidadmedida as unidadmedida,
          pb.idproductosbalanceopadre,
          (ipadre.numeropieza || ' - ' || ipadre.denominacion) as productoasustituir,
          (
            SELECT pb1.idindicador
            FROM mod_logdistribucion.dat_productosbalanceo pb1
            WHERE pb1.parent_path OPERATOR(public.@>) pb.parent_path
            ORDER BY pb1.parent_path ASC
            LIMIT 1
          ) as idpatriarca,

          (
            SELECT COALESCE(SUM(pbd.cantidad), 0)
            FROM mod_logdistribucion.dat_productosbalanceo pb1
            INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbp.idproductobalanceo = pb1.idproductosbalanceo
            INNER JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd on pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
            WHERE pb1.parent_path OPERATOR(public.<@) pb.parent_path
          ) as totalconsustitutos_distribuidos,
          (
            SELECT COALESCE(SUM(pbp.cantcomprar), 0)
            FROM mod_logdistribucion.dat_productosbalanceo pb1
            INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbp.idproductobalanceo = pb1.idproductosbalanceo
            WHERE pb1.parent_path OPERATOR(public.<@) pb.parent_path
          ) as totalconsustitutos_acomprar,
          (
            SELECT cabc.denominacion
            FROM mod_logabc.dat_clasificacionabcproductos abc
            INNER JOIN mod_logabc.nom_clasificacionabc cabc ON cabc.idclasificacionabc = abc.idclasificacionabctotal
            WHERE abc.idindicador = i.idindicador
            LIMIT 1
          ) as abc, pb.idindicadorasustituir as idproductoasustituir

        FROM mod_logdistribucion.dat_productosbalanceo pb

        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = pb.idindicador
        INNER JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida

        LEFT JOIN mod_logdistribucion.dat_productosbalanceo padre on padre.idindicadorasustituir = pb.idindicadorasustituir
        LEFT JOIN mod_datosmaestros.nom_indicador ipadre on ipadre.idindicador = padre.idindicadorasustituir
      ";

        $where = " WHERE pb.iddocbalanceo = {$params['iddocumento']} ";
        if ($params['criterio']) {
            $where .= "
          AND (
            i.numeropieza ILIKE '%{$params['criterio']}%'
            OR
            i.denominacion ILIKE '%{$params['criterio']}%'
          )
        ";
        }

        $sql .= $where;
        $sql .= "
        GROUP BY i.idindicador, um.idunidadmedida, pb.idproductosbalanceopadre, ipadre.idindicador, pb.parent_path, pb.idproductosbalanceo
        ORDER BY pb.parent_path ASC";

        $sql_count = "
        SELECT count(sub.*)
        FROM ($sql) as sub
      ";
        $sql .= " OFFSET {$params['start']} LIMIT {$params['limit']} ";
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        $cantidad = $conn->fetchAll($sql_count);
        return array(
            'datos' => $datos,
            'cantidad' => $cantidad[0]['count'],
        );
    }

    public function getPedidos($params)
    {
        $sql_select = "
        SELECT
          d.nrodoc,
          COALESCE(e.denominacion, eop.denominacion) as estructura,
          cp.nombre as cliente,
          dc.idcliente,
          d.fechacontable,
          COUNT(pp.idproductopedido) as productos,
          d.iddocumento,
          f.idfila,
          round(SUM(i.precio),2) as importe,
          d.observaciones
      ";
        $sql_count = " SELECT count(d.iddocumento) ";
        $sql_from = " FROM mod_logdistribucion.dat_pedido p
        INNER JOIN mod_logistica.dat_documento d on d.iddocumento = p.iddocumento
        INNER JOIN mod_estructuracomp.nom_filaestruc f on f.idfila = d.idestructuracomun

        INNER JOIN mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento
        INNER JOIN mod_datosmaestros.nom_clientesproveedor cp on cp.idclientesproveedores = dc.idcliente

        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = f.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = f.idfila and eop.idproyecto = 0

        INNER JOIN mod_logdistribucion.dat_productopedido pp on pp.idpedido = d.iddocumento
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = pp.idproducto
      ";
        $sql_where = " WHERE d.estado = 3 ";

        if ($params['idnaturaleza']) {
            $sql_where .= " AND i.idnaturaleza = {$params['idnaturaleza']} ";
        }
        if ($params['idcliente']) {
            $sql_where .= " AND dc.idcliente = {$params['idcliente']} ";
        }
        if ($params['entidad']) {
          $sql_where .= " AND d.idestructuracomun = {$params['entidad']} ";
        }
        if ($params['idestructura']) {
            $sql_where .= " AND f.idfila = {$params['idestructura']} ";
        }
        if ($params['nrodoc']) {
            $sql_where .= " AND d.nrodoc = {$params['nrodoc']} ";
        }
        if ($params['idseleccionados']) {
            $sqlIds = implode(',', $params['idseleccionados']);
            $sql_where .= " AND d.iddocumento NOT IN ($sqlIds) ";
        }
        if ($params['iddocbalanceo']) {
            $sql_from .= " INNER JOIN mod_logistica.dat_documentopadre dp on dp.idpadre = d.iddocumento ";
            $sql_where .= " AND dp.iddocumento = {$params['iddocbalanceo']} ";
        }

        if ($params['observaciones']) {
            $sql_where .= " AND d.observaciones ILIKE '%{$params['observaciones']}%' ";
        }
        $sql_group = " GROUP BY d.iddocumento, e.denominacion, eop.denominacion, cp.nombre, f.idfila, dc.idcliente ORDER BY COALESCE(e.denominacion, eop.denominacion)";
        $sql_limit = " LIMIT {$params['limit']} OFFSET {$params['start']} ";

        $conn = Zend_Registry::get('conexion');

        $data_sql = $sql_select . $sql_from . $sql_where . $sql_group . $sql_limit;
        $count_sql = "
        SELECT COUNT(sub.*)
        FROM ( " .
            $sql_select . $sql_from . $sql_where . $sql_group .
            ") as sub
      ";

        $datos = $conn->fetchAll($data_sql);
        $cantidad = $conn->fetchAll($count_sql);
        return array(
            'datos' => $datos,
            'cantidad' => $cantidad[0]['count'],
        );
    }

    public function getPedidosPorIndicador($params)
    {
        $idproductosbalanceo = $params['idproductosbalanceo'];

        $sql = "
        SELECT
          pbp.iddocpedido as idpedido,
            dcli.idcliente,
            cp.nombre as cliente,
            d.nrodoc as nropedido,
            round(pbp.cantidadpedidos,2) as pedidos,
            round(pbp.cantcomprar,2) as cantcomprar,
            COALESCE(round(SUM(pbd.cantidad),2),0.00) as totaldistribuido,
            pbp.idproductobalanceopedido,
            COALESCE(e.denominacion, eop.denominacion) as estructura,

            (SELECT COALESCE(SUM(pbp1.cantcomprar), 0)
              FROM mod_logdistribucion.dat_productosbalanceo pb1
              INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp1 on pbp1.idproductobalanceo = pb1.idproductosbalanceo
              WHERE pb1.parent_path OPERATOR(public.<@)
              (
                SELECT pb2.parent_path
                FROM mod_logdistribucion.dat_productosbalanceo pb2
                WHERE pb2.idproductosbalanceo = {$idproductosbalanceo}
              ) AND pbp.idproductobalanceopedido = pbp1.idproductobalanceopedido
            ) as totalconsustitutos_acomprar,
            (
              SELECT COALESCE(SUM(pbd1.cantidad), 0)
              FROM mod_logdistribucion.dat_productosbalanceo pb1
              INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp1 on pbp1.idproductobalanceo = pb1.idproductosbalanceo
              INNER JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd1 on pbd1.idproductobalanceopedido = pbp1.idproductobalanceopedido
              WHERE pb1.parent_path OPERATOR(public.<@)
              (
                SELECT pb2.parent_path
                FROM mod_logdistribucion.dat_productosbalanceo pb2
                WHERE pb2.idproductosbalanceo = {$idproductosbalanceo}
              ) AND pbp.idproductobalanceopedido = pbp1.idproductobalanceopedido
            ) as totalconsustitutos_distribuidos

        FROM mod_logdistribucion.dat_prodbalanceopedido pbp
        INNER JOIN mod_logdistribucion.dat_pedido pedido on pedido.iddocumento = pbp.iddocpedido
        INNER JOIN mod_logistica.dat_documento d on d.iddocumento = pedido.iddocumento

        INNER JOIN mod_logistica.dat_documentocliente dcli on dcli.iddocumento = pedido.iddocumento
        INNER JOIN mod_datosmaestros.nom_clientesproveedor cp on cp.idclientesproveedores = dcli.idcliente
        LEFT JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd ON pbd.idproductobalanceopedido = pbp.idproductobalanceopedido

        INNER JOIN mod_estructuracomp.nom_filaestruc f on f.idfila = d.idestructuracomun
        LEFT JOIN mod_estructuracomp.dat_estructura e on e.idestructura = f.idfila and e.idproyecto = 0
        LEFT JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = f.idfila and eop.idproyecto = 0

        WHERE pbp.idproductobalanceo = $idproductosbalanceo
        GROUP BY pbp.iddocpedido, dcli.idcliente, cp.nombre, d.nrodoc, pbp.cantidadpedidos,pbp.cantcomprar, pbp.idproductobalanceopedido, e.denominacion, eop.denominacion
        ORDER BY d.nrodoc
        OFFSET {$params['start']} LIMIT {$params['limit']}
        ";

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getExistenciaProductos($params)
    {
        if (!$params['idproductobalanceopedido']) {
            $params['idproductobalanceopedido'] = 0;
        }

        $sql = "
        select
        dp.idproducto,
        round(sum(dp.cantidad),2) as existencia,
        round((dp.cantidad - coalesce((SELECT sum(dcc.cantidad) FROM mod_logistica.dat_cantidadcomprometida dcc where dcc.idproducto = dp.idproducto and dcc.estado = 1),0)),2) as disponible,

        COALESCE((
          SELECT round(SUM(pbd.cantidad),2)
          FROM mod_logdistribucion.dat_prodbalanceodistribuir pbd
          INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
          INNER JOIN mod_logdistribucion.dat_productosbalanceo pb on pb.idproductosbalanceo = pbp.idproductobalanceo
          WHERE pbd.idproducto = dp.idproducto AND pb.iddocbalanceo = {$params['iddocumento']}
          AND
            CASE WHEN {$params['idproductobalanceopedido']} <> 0 THEN
              pbd.idproductobalanceopedido = {$params['idproductobalanceopedido']}
              ELSE true
            END
        ),0.00) as cantidad,


          (
            SELECT
              (CASE WHEN doc.nrodoc is null THEN 'Ref: ' || doc.numeroref ELSE 'Nro: ' || doc.nrodoc END)
            FROM mod_logdistribucion.dat_prodbalanceodistribuir pbd
            INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
            INNER JOIN mod_logdistribucion.dat_productosbalanceo pb on pb.idproductosbalanceo = pbp.idproductobalanceo
            LEFT JOIN mod_logistica.dat_documento doc on doc.iddocumento = pbd.iddocdistribucion
            WHERE pbd.idproducto = dp.idproducto AND pb.iddocbalanceo = {$params['iddocumento']}
            AND pbd.idproductobalanceopedido = {$params['idproductobalanceopedido']}

        ) as nrodocdistribucion,

        dp.idestructura,
        coalesce (e.codigo || ' - ' || e.denominacion,e.denominacion) as entidad,
        coalesce (eop.codigo || ' - ' || eop.denominacion,eop.denominacion) as almacen,
        (
          SELECT cabc.denominacion
          FROM mod_logabc.dat_clasificacionabcproductos abc
          INNER JOIN mod_logabc.nom_clasificacionabc cabc ON cabc.idclasificacionabc = abc.idclasificacionabctotal
          WHERE abc.idindicador = ni.idindicador
          LIMIT 1
        ) as abc,
        (
        	SELECT m.cantidad
            FROM mod_logistica.dat_movimiento m
            INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            WHERE m.idproducto = dp.idproducto
            ORDER BY d.cronologia DESC
            LIMIT 1
        ) as cantultimomovimiento,
        (
        	SELECT d.fechacontable
            FROM mod_logistica.dat_movimiento m
            INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            WHERE m.idproducto = dp.idproducto
            ORDER BY d.cronologia DESC
            LIMIT 1
        ) as fechaultimomovimiento

        from mod_logistica.dat_producto dp
        inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
        inner join mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = dp.idumedida
        inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
        inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = dp.idestructuracomun
        inner join mod_estructuracomp.v_dametodasestructuras eop on eop.idestructura = dp.idestructura
        left join mod_logdistribucion.conf_depositobalanceo cfgb on cfgb.iddeposito = dp.idestructura

        ";

        $where = "
        where
          ni.idindicador = {$params['idindicador']}
          and dp.cronologia > 0
          and cfgb.iddeposito is null
      ";
        if ($params['criterio']) {
            $where .= "
          AND (
            e.codigo ILIKE '%{$params['criterio']}%' OR
            eop.codigo ILIKE '%{$params['criterio']}%' OR
            e.denominacion ILIKE '%{$params['criterio']}%' OR
            eop.denominacion ILIKE '%{$params['criterio']}%'
          )
        ";
        }
        $sql .= $where;
        $sql .= "
        group by
          dp.idestructuracomun,
          dp.idestructura,
          e.codigo,
          e.denominacion,
          eop.denominacion,
          eop.codigo,
          dp.cantidad,
          dp.idproducto,
          ni.idindicador
        having sum(dp.cantidad) > 0
        order by
          e.denominacion,
          eop.denominacion,
          ni.numeropieza
        OFFSET {$params['start']} LIMIT {$params['limit']}
      ";
        //print_r($sql);die;
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function cargarSustitutos($params)
    {
        $sql = "
      SELECT i.idindicador, i.numeropieza as codigo, i.denominacion, um.abreviaturaunidadmedida as unidadmedida, cabc.denominacion as abc
      FROM mod_datosmaestros.nom_indicador i
      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
      INNER JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
      INNER JOIN mod_datosmaestros.dat_indicadorsustituto s on s.idsustituto = i.idindicador

      LEFT JOIN mod_logabc.dat_clasificacionabcproductos abc ON abc.idindicador = i.idindicador
      LEFT JOIN mod_logabc.nom_clasificacionabc cabc ON cabc.idclasificacionabc = abc.idclasificacionabctotal
      WHERE s.idindicador = {$params['idindicador']}
      ";
        $where = "";
        if ($params['criterio']) {
            $where .= "
          AND (i.denominacion ILIKE '%{$params['criterio']}%' OR i.numeropieza ILIKE '%{$params['criterio']}%')
        ";
        }
        $limit = "GROUP BY i.idindicador, um.abreviaturaunidadmedida, cabc.denominacion offset {$params['start']} limit {$params['limit']}";

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql . $where . $limit);
        return $datos;
    }

    public function sustituirProducto($idindicador)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT sust.*, indic.denominacion as denomindicador, denomsustituto
                    FROM  mod_datosmaestros.dat_indicadorsustituto sust
                    LEFT JOIN (SELECT s.idindicador,
                                      max(s.fecha) max_fecha, i.denominacion as denomsustituto
                               FROM  mod_datosmaestros.dat_indicadorsustituto s
                               INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador= s.idsustituto
                               GROUP BY s.idindicador, i.denominacion) maximo on maximo.idindicador = sust.idindicador and
                                                            maximo.max_fecha = sust.fecha
                    INNER JOIN mod_datosmaestros.nom_indicador indic ON indic.idindicador= sust.idindicador
                    where sust.idindicador = $idindicador limit 1;";
        return $conn->fetchAll($query);
    }

    public function existeSustituto($params)
    {
        $iddocumento = $params['iddocumento'];
        $idindicadorSustituto = $params['idindicadorSustituto'];
        $sql = "SELECT 
              *
            FROM 
              mod_logdistribucion.dat_productosbalanceo 
              where idindicador = {$idindicadorSustituto} and  iddocbalanceo = {$iddocumento};
            ";
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function adicionarSustituto($params)
    {
        $iddocumento = $params['iddocumento'];
        $idindicadorSustituto = $params['idindicadorSustituto'];
        $idproductosbalanceo = $params['idproductosbalanceo'];
        $idindicadorASustituir = $params['idindicadorASustituir'];

        $sql = "
      UPDATE 
          mod_logdistribucion.dat_productosbalanceo
        SET
          idindicador = {$idindicadorSustituto},
          iddocbalanceo = {$iddocumento},
          idclasificacionabc = (SELECT dcp.idclasificacionabctotal
                  FROM mod_logabc.dat_clasificacionabcproductos dcp
                  WHERE dcp.idindicador = {$idindicadorSustituto}
                  LIMIT 1),
          idindicadorasustituir = {$idindicadorASustituir}
        WHERE 
          idproductosbalanceo = {$idproductosbalanceo} and iddocbalanceo = {$iddocumento}
        ;
      ";
        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();

//  $sql1 = "
//        UPDATE
//          mod_logdistribucion.dat_prodbalanceopedido
//        SET
//          cantidadpedidos = 0,
//          cantcomprar = 0
//        WHERE idproductobalanceo = {$idproductosbalanceo}
//        ;
//      ";
//  $query1 = $conn->prepare($sql1);
//  $query1->execute();

    }

// public function adicionarSustituto($params)
// {
//  $iddocumento = $params['iddocumento'];
//  $idindicadorSustituto = $params['idindicadorSustituto'];
//  $idproductosbalanceo = $params['idproductosbalanceo'];
//
//  $sql = "
//      INSERT INTO
//          mod_logdistribucion.dat_productosbalanceo
//        (
//          idindicador,
//          iddocbalanceo,
//          idproductosbalanceopadre,
//          idclasificacionabc
//        )
//        SELECT {$idindicadorSustituto}, {$iddocumento}, pb.idproductosbalanceo,
//        (
//          SELECT dcp.idclasificacionabctotal
//          FROM mod_logabc.dat_clasificacionabcproductos dcp
//          WHERE dcp.idindicador = {$idindicadorSustituto}
//          LIMIT 1
//        ) as idclasificacionabc
//        FROM mod_logdistribucion.dat_productosbalanceo pb
//        WHERE pb.idproductosbalanceo = {$idproductosbalanceo} AND pb.iddocbalanceo = {$iddocumento}
//
//        ON CONFLICT ON CONSTRAINT dat_productosbalanceo_idx
//        DO NOTHING;
//      ";
//  $conn = Zend_Registry::get('conexion');
//  $query = $conn->prepare($sql);
//  $query->execute();
//
//  $sql1 = "
//        INSERT INTO
//          mod_logdistribucion.dat_prodbalanceopedido
//        (
//          idproductobalanceo,
//          iddocpedido,
//          cantidadpedidos,
//          cantcomprar
//        )
//        SELECT (
//          select pb1.idproductosbalanceo
//            from mod_logdistribucion.dat_productosbalanceo pb1
//            where pb1.idproductosbalanceopadre = {$idproductosbalanceo}
//          ),
//          pbp.iddocpedido, 0,0
//        FROM mod_logdistribucion.dat_prodbalanceopedido pbp
//        INNER JOIN mod_logdistribucion.dat_productosbalanceo dpb on dpb.idproductosbalanceo = pbp.idproductobalanceo
//        WHERE dpb.idproductosbalanceo = {$idproductosbalanceo}
//      ";
//  $query1 = $conn->prepare($sql1);
//  $query1->execute();
//
// }

    public function guardarCantComprar($params)
    {
        $sql = "
        UPDATE
          mod_logdistribucion.dat_prodbalanceopedido
        SET
          cantcomprar = {$params['cantidad']}
        WHERE
          idproductobalanceopedido = {$params['idproductobalanceopedido']}
        ;
      ";
        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();
    }

    public function guardarCantDistribuir($params)
    {
        if ($params['cantidadVieja'] != $params['cantidad']) {
            $sql0 = "
          SELECT (dp.cantidad - COALESCE(
              (
                SELECT sum(dcc.cantidad)
                FROM mod_logistica.dat_cantidadcomprometida dcc
                where dcc.idproducto = dp.idproducto
                and dcc.estado = 1
              )
          ,0)) as disponible
          FROM mod_logistica.dat_producto dp
          WHERE dp.idproducto = {$params['idproducto']}
        ";
            $conn0 = Zend_Registry::get('conexion');
            $dispobible = $conn0->fetchAll($sql0);

            $sql01 = "
            SELECT cc.cantidad
            FROM mod_logistica.dat_cantidadcomprometida cc
            WHERE cc.iddocumento = {$params['iddocumentobalanceo']} and cc.idproducto = {$params['idproducto']}
            LIMIT 1;
        ";
            $conn01 = Zend_Registry::get('conexion');
            $comprometido = $conn01->fetchAll($sql01);
            //print_r($comprometido);die;

            if (count($dispobible) == 0 || ($dispobible[0]['disponible'] < $params['cantidad'] && $params['cantidad'] > $comprometido[0]['cantidad'])) {
                return array(
                    'success' => false,
                    'codMsg' => 'CANT_ERROR'
                );
            }

            $sql = "
          INSERT INTO
            mod_logdistribucion.dat_prodbalanceodistribuir
          (
            idproducto,
            cantidad,
            idproductobalanceopedido
          )
          SELECT {$params['idproducto']}, {$params['cantidad']}, {$params['idproductobalanceopedido']}

          ON CONFLICT ON CONSTRAINT dat_prodbalanceodistribuir_idx1
          DO
            UPDATE SET cantidad = {$params['cantidad']}
        ";
            $conn = Zend_Registry::get('conexion');
            $query = $conn->prepare($sql);
            $query->execute();

            $cantidad = 0;
            if ($params['cantidadVieja'] > $params['cantidad']) {
                $cantidad = (double)$comprometido[0]['cantidad'] - ((double)$params['cantidadVieja'] - (double)$params['cantidad']);
            } else if ($params['cantidadVieja'] < $params['cantidad']) {
                $cantidad = $params['cantidad'] + $comprometido[0]['cantidad'];
            }

            if ($cantidad < 0) {
                $cantidad = 0;
            }

            // Modificando la cantidad comprometida
            $cantComprometidaModel = new CantidadesComprometidasModel();
            $valores = array(
                'cantidad' => $cantidad,
                'idproducto' => $params['idproducto'],
                'iddocumento' => $params['iddocumentobalanceo'],
            );
            $cantComprometidaModel->insertarCantidadComprometida($valores);

        }
        return array(
            'success' => true,
            'codMsg' => 1
        );
    }

    public function eliminarProducto($params)
    {

        if (!$params['idproductosbalanceo'] || !$params['iddocumento']) {
            return false;
        }

        $sql_prod = "
        SELECT pb.idindicador
        FROM mod_logdistribucion.dat_productosbalanceo pb
        WHERE pb.parent_path OPERATOR(public.<@)(
          SELECT pb1.parent_path
          FROM mod_logdistribucion.dat_productosbalanceo pb1
          WHERE pb1.idproductosbalanceo = {$params['idproductosbalanceo']}
        )
      ";
        $conn_prod = Zend_Registry::get('conexion');
        $idproductos = $conn_prod->fetchAll($sql_prod);

        // Limppiar las cantidades comprometidas realizadas en el pedido a eliminar
        $cantComprometidaModel = new CantidadesComprometidasModel();
        $ids = array_map(function ($el) {
            return $el['idindicador'];
        }, $idproductos);
        $cantComprometidaModel->eliminarCantidadComprometida($params['iddocumento'], $ids);

        $sql = "
        DELETE FROM
          mod_logdistribucion.dat_productosbalanceo pb
        WHERE
          pb.idproductosbalanceo = {$params['idproductosbalanceo']}
      ";

        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();
        return true;
    }

    public function getPedidosExcluir()
    {
        $sql = "
        SELECT DISTINCT ddp.idpadre
        FROM mod_logdistribucion.dat_docbalanceo ddb
        INNER JOIN mod_logistica.dat_documento d on d.iddocumento = ddb.iddocbalanceo
        INNER JOIN mod_logistica.dat_documentopadre ddp on ddp.iddocumento = d.iddocumento
        WHERE d.estado IN (1,2)

          UNION

        SELECT ps.iddocpedido
        FROM mod_logdistribucion.dat_pedidosatisfechobalanceo ps
        WHERE ps.satisfecho = 1 or ps.paralizado = 1

      ";
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);

        return array_map(function ($el) {
            return $el['idpadre'];
        }, $datos);
    }

    /*
     * Devuelve true o false
     * Verifica que las cantidades a comprar y a distribuir no sobrepasen las cantidades del pedido
     */

    public function validarCantidadesConfimar($iddocumento)
    {
        // Validar que el total de pedidos sea mayor  o igual a la cantidad a comprar + cantidad distribuida

        $sql = "
        SELECT i.idindicador,
        SUM(pbp.cantidadpedidos) as totalpedidos,
        (
          select COALESCE(sum(pbd1.cantidad),0)
          from mod_logdistribucion.dat_productosbalanceo pb1
          INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp1 on pbp1.idproductobalanceo = pb1.idproductosbalanceo
          LEFT JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd1 on pbd1.idproductobalanceopedido = pbp1.idproductobalanceopedido
          where pb1.parent_path OPERATOR(public.<@) pb.parent_path and pbp1.iddocpedido = pbp.iddocpedido
        ) as totaldistribuidos,
        (
          select COALESCE(sum(pbp1.cantcomprar),0)
          from mod_logdistribucion.dat_productosbalanceo pb1
          INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp1 on pbp1.idproductobalanceo = pb1.idproductosbalanceo
          where pb1.parent_path OPERATOR(public.<@) pb.parent_path and pbp1.iddocpedido = pbp.iddocpedido
        ) as totalcomprados

        FROM mod_logdistribucion.dat_productosbalanceo pb
        INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbp.idproductobalanceo = pb.idproductosbalanceo
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = pb.idindicador
        INNER JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida

        WHERE pb.iddocbalanceo = $iddocumento and pb.idproductosbalanceopadre is null

        GROUP BY i.idindicador, um.idunidadmedida, pb.idproductosbalanceopadre, pb.parent_path, pb.idproductosbalanceo, pbp.iddocpedido
        ORDER BY pb.parent_path ASC
      ";
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);

        foreach ($datos as $key => $row) {
            $diferencia = $row['totalpedidos'] - ($row['totaldistribuidos'] + $row['totalcomprados']);
            if ($diferencia < 0) {
                return false;
            }
        }
        return true;
    }

    public function actualizarSatisfechos($iddocumento)
    {

        $sql = "
      UPDATE mod_logdistribucion.dat_prodpedidosatisfechobalanceo ps
        SET cantidadprocesada = ps.cantidadprocesada +
      	(
        	SELECT
              COALESCE((
                  SELECT SUM(pbd2.cantidad)
                  FROM mod_logdistribucion.dat_productosbalanceo pb2
                  INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp2 ON pb2.idproductosbalanceo = pbp2.idproductobalanceo
                  LEFT JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd2 ON pbd2.idproductobalanceopedido = pbp2.idproductobalanceopedido
                  WHERE pb2.parent_path OPERATOR(public.<@) pb1.parent_path AND pbp2.idproductobalanceopedido = pbp1.idproductobalanceopedido
              ),0)
              +
              COALESCE((
                  SELECT SUM(pbp2.cantcomprar)
                  FROM mod_logdistribucion.dat_productosbalanceo pb2
                  INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp2 ON pb2.idproductosbalanceo = pbp2.idproductobalanceo
                  WHERE pb2.parent_path OPERATOR(public.<@) pb1.parent_path and pbp2.idproductobalanceopedido = pbp1.idproductobalanceopedido
              ),0)
            FROM mod_logdistribucion.dat_productosbalanceo pb1
            INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp1 ON pb1.idproductosbalanceo = pbp1.idproductobalanceo

            INNER JOIN mod_logdistribucion.dat_productopedido pp1 ON pp1.idpedido = pbp1.iddocpedido and pb1.idindicador = pp1.idproducto
            INNER JOIN mod_logdistribucion.dat_prodpedidosatisfechobalanceo ps1 ON ps1.idproductopedido = pp1.idproductopedido
            WHERE pb1.iddocbalanceo = {$iddocumento} AND ps.idproductopedido = ps1.idproductopedido
        )
        WHERE ps.idproductopedido in (
          SELECT pp.idproductopedido
          FROM mod_logdistribucion.dat_productosbalanceo pb
          INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp ON pbp.idproductobalanceo = pb.idproductosbalanceo
          INNER JOIN mod_logdistribucion.dat_productopedido pp ON pp.idpedido = pbp.iddocpedido AND pp.idproducto = pb.idindicador
          WHERE pb.iddocbalanceo = {$iddocumento}
      )
      ";

        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();

        $sql1 = "
        update mod_logdistribucion.dat_pedidosatisfechobalanceo psb
          set satisfecho = (
            SELECT
              CASE WHEN SUM(pps1.cantidadnecesaria) - SUM(pps1.cantidadprocesada) = 0 THEN 1 else 0 end
            FROM mod_logdistribucion.dat_prodpedidosatisfechobalanceo pps1
            INNER JOIN mod_logdistribucion.dat_productopedido pp1 on pp1.idproductopedido = pps1.idproductopedido
            INNER JOIN mod_logdistribucion.dat_pedidosatisfechobalanceo ps1 on ps1.iddocpedido = pp1.idpedido
            WHERE psb.iddocpedido = ps1.iddocpedido
            GROUP BY ps1.iddocpedido
          )
        WHERE psb.iddocpedido IN (
          SELECT pp.idpedido
            FROM mod_logdistribucion.dat_prodpedidosatisfechobalanceo pps
            INNER JOIN mod_logdistribucion.dat_productopedido pp on pp.idproductopedido = pps.idproductopedido
            INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pp.idpedido = pp.idpedido
            INNER JOIN mod_logdistribucion.dat_productosbalanceo pb on pb.idproductosbalanceo = pbp.idproductobalanceo
            WHERE pps.cantidadnecesaria = pps.cantidadprocesada and pb.iddocbalanceo = {$iddocumento}
          )
      ";

        $conn1 = Zend_Registry::get('conexion');
        $query1 = $conn1->prepare($sql1);
        $query1->execute();

    }

    public function aprobarDocumentoBalanceo($iddocumento)
    {

        // Modificando estado de las cantidades comprometidas
        $cantComprometidaModel = new CantidadesComprometidasModel();
        $cantComprometidaModel->cambiarEstado(2, $iddocumento);

        // Generar distribuciones
        $datosBalanceo = $this->getDatosBalanceoDistribuir($iddocumento);
        $distribuciones = $this->generarDistribucionBalanceo($iddocumento, $datosBalanceo);
        $creados['distribuciones'] = $distribuciones;

        // Asociar distribuciones creadas a los "mod_logdistribucion.dat_prodbalanceodistribuir"
        $this->asociarDistribuciones($distribuciones, $iddocumento);

        // Aprobando documento
        $aprobado = $this->aprobarDocumento($iddocumento);
        $sql = "UPDATE mod_logdistribucion.dat_docbalanceo SET fechaaprobacion = NOW() WHERE iddocbalanceo = {$iddocumento}";
        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();

        // Generar solicitudes de compra
        $datosBalanceo = $this->getDatosBalanceoComprar($iddocumento);
        $solicitudes = $this->generarSolicitudCompra($iddocumento, $datosBalanceo);
        $creados['solicitudes'] = $solicitudes;

        // Actualizando satisfechos
        $this->actualizarSatisfechos($iddocumento);

        return $creados;
    }

    public function generarSolicitudCompra($iddocumento, $datosBalanceo)
    {
        $datosDoc = array();
        $datosDoc['iddocbalanceo'] = $iddocumento;
        $datosDoc['clientes'] = array();
        foreach ($datosBalanceo as $dat) {
            if ($dat['cantcomprar'] > 0) {

                if (!$datosDoc['clientes'][$dat['idcliente']]) {
                    $datosDoc['clientes'][$dat['idcliente']] = array(
                        'idcliente' => $dat['idcliente'],
                        'productos' => array(),
                    );
                }
                array_push(
                    $datosDoc['clientes'][$dat['idcliente']]['productos'],
                    array(
                        'idindicador' => $dat['idindicador'],
                        'cantidad' => $dat['cantcomprar'],
                        'idcliente' => $dat['idcliente'],
                        'idnaturaleza' => $dat['idnaturaleza'],
                        'idpedido' => $dat['idpedido'],
                    )
                );
            }
        }

        // Llamada del servicio de CRM
        if (count($datosDoc['clientes']) > 0) {
            $crmResp = ServiciosCrmHelper::__init()->guardarDemanda($datosDoc);
            return $crmResp;
        }
        return false;
    }

    public function generarDistribucionBalanceo($iddocumento, $datosBalanceo)
    {
        $datosDoc = array();
        $datosDoc['iddocbalanceo'] = $iddocumento;

        $datosDoc['entidades'] = array();
        foreach ($datosBalanceo as $dat) {
            if ($dat['idproducto']) {
                $datosDoc['entidades'][$dat['identidad']]['clientes'][$dat['idcliente']]['depositos'][$dat['iddeposito']]['productos'][$dat['idproducto']]['cantidad'] = $dat['cantidad'];
                $datosDoc['entidades'][$dat['identidad']]['clientes'][$dat['idcliente']]['depositos'][$dat['iddeposito']]['productos'][$dat['idproducto']]['rotar'] = 1;
                $datosDoc['entidades'][$dat['identidad']]['clientes'][$dat['idcliente']]['depositos'][$dat['iddeposito']]['productos'][$dat['idproducto']]['idpedido'] = $dat['idpedido'];
            }
        }

        if (count($datosDoc['entidades']) > 0) {
            $distribucionServ = new DistribucionService();
            return $distribucionServ->adicionarDocDistribucionBalanceo($datosDoc);
        }
        return false;
    }

    public function getDatosBalanceoDistribuir($iddocumento)
    {
        $sql = "
        SELECT
          pb.iddocbalanceo,
          pb.idindicador,
          i.idnaturaleza,
          pbd.idproducto,
          pbd.cantidad,
          pbp.cantcomprar,
          pbp.iddocpedido as idpedido,
          dd.idestructuracomun as idcliente,
          dd.idestructuracomun as idestructura,
          3 as tipocliente,
          dp.idestructuracomun as identidad,
          dp.idestructura as iddeposito

        FROM mod_logdistribucion.dat_productosbalanceo pb
        INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbp.idproductobalanceo = pb.idproductosbalanceo
        INNER JOIN mod_logdistribucion.dat_pedido pedido on pedido.iddocumento = pbp.iddocpedido
        INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = pedido.iddocumento                
        INNER JOIN mod_logistica.dat_documentocliente dcli on dcli.iddocumento = pedido.iddocumento
        LEFT JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd on pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
        LEFT JOIN mod_logistica.dat_producto dp on dp.idproducto = pbd.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = pb.idindicador

        WHERE pb.iddocbalanceo = {$iddocumento}
      ";

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);

        return $datos;
    }

    public function getDatosBalanceoComprar($iddocumento)
    {
        $sql = "
        SELECT
          pb.iddocbalanceo,
          pb.idindicador,
          i.idnaturaleza,
          pbp.cantcomprar,
          dcli.idcliente,
          pbp.iddocpedido as idpedido
        FROM mod_logdistribucion.dat_productosbalanceo pb
        INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbp.idproductobalanceo = pb.idproductosbalanceo
        INNER JOIN mod_logdistribucion.dat_pedido pedido on pedido.iddocumento = pbp.iddocpedido
        INNER JOIN mod_logistica.dat_documentocliente dcli on dcli.iddocumento = pedido.iddocumento
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = pb.idindicador

        WHERE pb.iddocbalanceo = {$iddocumento}
      ";

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);

        return $datos;
    }

    public function CantidadPedidosConCantidadesDistribuidas($iddocumento, $idpedidos)
    {
        $sql = "
        SELECT COUNT(pbd.idprodbalanceodist) as cantidad
        FROM mod_logdistribucion.dat_prodbalanceodistribuir pbd
        INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp ON pbp.idproductobalanceopedido = pbd.idproductobalanceopedido
        INNER JOIN mod_logdistribucion.dat_productosbalanceo pb ON pb.idproductosbalanceo = pbp.idproductobalanceo

        WHERE
          pbd.cantidad > 0
            AND pb.iddocbalanceo = $iddocumento
      ";

        if (count($idpedidos) > 0) {
            $strIdpedidos = implode(',', $idpedidos);
            $sql .= " AND pbp.iddocpedido IN ($strIdpedidos) ";
        }
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);

        return $datos[0]['cantidad'];

    }

    public function ComprarProductosDePedidos($iddocumento, $idpedidos)
    {
        if (count($idpedidos) == 0) {
            return false;
        }
        $strIdpedidos = implode(',', $idpedidos);
        $sql = "
        UPDATE mod_logdistribucion.dat_prodbalanceopedido pbp
        SET cantcomprar = pbp.cantidadpedidos
        WHERE pbp.iddocpedido IN ($strIdpedidos) and pbp.idproductobalanceo IN (
          SELECT pb.idproductosbalanceo
            FROM mod_logdistribucion.dat_productosbalanceo pb
            WHERE pb.iddocbalanceo = $iddocumento
        );
      ";

        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();

        return true;
    }

    public function asociarDistribuciones($distribuciones, $iddocumentoBalanceo)
    {
        $conn = Zend_Registry::get('conexion');
        foreach ($distribuciones as $elems) {
            foreach ($elems as $dist) {
                $sql = "
            update mod_logdistribucion.dat_prodbalanceodistribuir pbd
            set iddocdistribucion = {$dist['iddocumento']}
            where
            idprodbalanceodist in (
                SELECT pbd.idprodbalanceodist
                FROM mod_logdistribucion.dat_productosbalanceo pb
                INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pb.idproductosbalanceo = pbp.idproductobalanceo
                INNER JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd on pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
                INNER JOIN mod_logdistribucion.dat_pedido p on p.iddocumento = pbp.iddocpedido
                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = p.iddocumento
                INNER JOIN mod_logistica.dat_documentocliente dc on dc.iddocumento = p.iddocumento
                WHERE
                  pb.iddocbalanceo = {$iddocumentoBalanceo}
                  and d.idestructuracomun = {$dist['idcliente']}
                  and pbd.idproducto = {$dist['idproducto']}
            )
          ";
                $query = $conn->prepare($sql);
                $query->execute();
            }
        }
    }

    public function cancelarDocumento($iddocumento)
    {
        $docPedido = $this->verificarPedidosBalanceoProducto($iddocumento);
        if ((count($docPedido) > 0) && (count($docPedido) != $this->getCantidadProductosBalanceo($iddocumento))) {
            foreach ($docPedido as $doc) {
                $idproductos[] = $doc['idindicador'];
            }
            $arrayprod = implode(',', $idproductos);
            $this->eliminarProductosBalanceo($iddocumento, $arrayprod);
        }
        $this->trazaDocumento->guardarTraza('Documento paralizado', $iddocumento, EstadoDocumentoModel::ESTADO_PARALIZADO);
        $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_PARALIZADO);
        $this->setParalizadoPedido($iddocumento);
        return true;
    }

    public function verificarPedidosBalanceoProducto($iddocumento)
    {
        $sql = "Select dpb.idindicador
      From mod_logdistribucion.dat_docbalanceo d
      inner join mod_logdistribucion.dat_productosbalanceo dpb on dpb.iddocbalanceo = d.iddocbalanceo
      inner join mod_logdistribucion.dat_prodbalanceopedido dpbp on dpbp.idproductobalanceo = dpb.idproductosbalanceo
      left join mod_logdistribucion.dat_prodbalanceodistribuir pbd on pbd.idproductobalanceopedido = dpbp.idproductobalanceopedido
      where d.iddocbalanceo = {$iddocumento} and dpbp.cantcomprar = 0 and (pbd.cantidad = 0 or pbd.cantidad is null)";

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getCantidadProductosBalanceo($iddocumento)
    {
        $sql = "select count(d.iddocbalanceo) as cantidad
      From mod_logdistribucion.dat_docbalanceo d
      inner join mod_logdistribucion.dat_productosbalanceo dpb on dpb.iddocbalanceo = d.iddocbalanceo
      where d.iddocbalanceo = {$iddocumento}";

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        return $datos[0]['cantidad'];
    }

    public function eliminarProductosBalanceo($iddocumento, $arrayprod)
    {
        $sql = "delete FROM mod_logdistribucion.dat_productosbalanceo dpb
      WHERE dpb.iddocbalanceo = {$iddocumento}
      and dpb.idindicador IN ($arrayprod)";

        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();
        return true;
    }

    public function setParalizadoPedido($iddocumento)
    {
        $sql = "update mod_logdistribucion.dat_pedidosatisfechobalanceo psb
      set paralizado = 1
      WHERE psb.iddocpedido IN (
        SELECT pp.idpedido
          FROM mod_logdistribucion.dat_prodpedidosatisfechobalanceo pps
          INNER JOIN mod_logdistribucion.dat_productopedido pp on pp.idproductopedido = pps.idproductopedido
          INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pp.idpedido = pp.idpedido
          INNER JOIN mod_logdistribucion.dat_productosbalanceo pb on pb.idproductosbalanceo = pbp.idproductobalanceo
          WHERE pps.cantidadnecesaria = pps.cantidadprocesada and pb.iddocbalanceo = {$iddocumento}
        ) ";

        $conn1 = Zend_Registry::get('conexion');
        $query1 = $conn1->prepare($sql);
        $query1->execute();
    }

    public function exportarDemanda($iddocumento)
    {
        // Crear objeto excel
        $objPHPExcel = new PHPExcel();

        // Cambiando las propiedades del documento
        $objPHPExcel->getProperties()->setCreator("DISTRA");
        $objPHPExcel->getProperties()->setLastModifiedBy("DISTRA");
        $objPHPExcel->getProperties()->setTitle("REPORTE: PRODUCTOS DEMANDADOS");
        $objPHPExcel->getProperties()->setSubject("REPORTE: PRODUCTOS DEMANDADOS");
        $objPHPExcel->getProperties()->setDescription("Reporte de productos demandados.");
        $objPHPExcel->getProperties()->setKeywords("Producto, demanda");
        $objPHPExcel->getProperties()->setCategory("REPORTE");

        // Configurando encabezado
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('PRODUCTOS');

        //Crear cuerpo del documento
        $objPHPExcel = self::crearEncabezadoExportar($objPHPExcel, $iddocumento);

        // Save Excel 95 file
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

        error_reporting(E_ALL);
        ini_set('display_errors', true);
        ini_set('display_startup_errors', true);

        define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

        // Generate the server headers
        $name = "MODELO_EXPORT_DISTRA_BDC_" . date('dmy_his');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename=" ' . $name . '.xls"');
        header("Content-Transfer-Encoding: binary");
        header('Expires: 0');
        header('Cache-Control: max-age=0');
        header('Cache-Control: max-age=1');
        header('Cache-Control: cache, must-revalidate');
        header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

        if (strpos($_SERVER['HTTP_USER_AGENT'], "MSIE") !== false) {
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public', true);
        } else {
            header('Pragma: no-cache');
        }

        $objWriter->save('php://output');

    }

    private function crearEncabezadoExportar($objPHPExcel, $iddocumento)
    {
        $sql = "SELECT
          doc.nrodoc,
          doc.numeroref,
          doc.fechacontable,
          docbal.fechaaprobacion,
          doc.estado,
          doc.observaciones,
          v.direccion,
          v.denominacion,
          v.telefono,
          v.fax,
          doc.anno,
          s.fechacontable as fechapedido,
          s.observaciones as notapedido
          FROM mod_logistica.dat_documento doc
          INNER JOIN mod_logdistribucion.dat_docbalanceo docbal ON doc.iddocumento = docbal.iddocbalanceo
          INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = doc.idestructuracomun
          left join (select d.fechacontable,d.observaciones,pb.iddocbalanceo as iddocumento
          from mod_logdistribucion.dat_pedido p
          inner join mod_logdistribucion.dat_prodbalanceopedido bp on bp.iddocpedido = p.iddocumento
          inner join mod_logdistribucion.dat_productosbalanceo pb on pb.idproductosbalanceo = bp.idproductobalanceo
          inner join mod_logistica.dat_documento d on d.iddocumento = p.iddocumento limit 1) s on s.iddocumento = doc.iddocumento
          WHERE
          doc.iddocumento = {$iddocumento}";

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql)[0];

        $objPHPExcel->getActiveSheet()->setCellValue('C' . 2, "Empresa: ");
        $objPHPExcel->getActiveSheet()->setCellValue('D' . 2, $datos['denominacion']);

        $objPHPExcel->getActiveSheet()->setCellValue('C' . 4, "Direccion: ");
        $objPHPExcel->getActiveSheet()->setCellValue('D' . 4, $datos['direccion']);
        $objPHPExcel->getActiveSheet()->setCellValue('C' . 5, "Telefono: ");
        $objPHPExcel->getActiveSheet()->setCellValue('D' . 5, $datos['telefono']);
        $objPHPExcel->getActiveSheet()->setCellValue('C' . 6, "Fax: ");
        $objPHPExcel->getActiveSheet()->setCellValue('D' . 6, $datos['fax']);

        $objPHPExcel->getActiveSheet()->setCellValue('F' . 8, "ORDEN DE COMPRA");
        $objPHPExcel->getActiveSheet()->setCellValue('K' . 9, "Informacion ordinaria");

        $objPHPExcel->getActiveSheet()->setCellValue('A' . 10, "Orden de compra: ");
        $objPHPExcel->getActiveSheet()->setCellValue('D' . 10, "AÃ±o: ");
        $objPHPExcel->getActiveSheet()->setCellValue('E' . 10, $datos['anno']);
        $objPHPExcel->getActiveSheet()->setCellValue('F' . 10, "Almacen: ");
        $objPHPExcel->getActiveSheet()->setCellValue('H' . 10, "Comprador: ");

        $objPHPExcel->getActiveSheet()->setCellValue('A' . 12, "Suministrador: ");
        $objPHPExcel->getActiveSheet()->setCellValue('I' . 12, "Fecha pedido: ");
        $objPHPExcel->getActiveSheet()->setCellValue('J' . 12, $datos['fechapedido']);
        $objPHPExcel->getActiveSheet()->setCellValue('K' . 12, "Confirmacion: ");

        $objPHPExcel = self::crearListadoProdExportar($objPHPExcel, $iddocumento, $datos["notapedido"]);

        return $objPHPExcel;

        /**S */
    }

    private function crearListadoProdExportar($objPHPExcel, $iddocumento, $notapedido)
    {
        $sql = "SELECT
          COALESCE(indic.numeropieza, indic.codigo) AS codigo,
          indic.denominacion as denominacion,
          sum(prodbalped.cantcomprar) AS cantidad,
          indic.precio,
          (prodbalped.cantcomprar*indic.precio) AS importe,
          med.abreviaturaunidadmedida AS um
          FROM mod_logdistribucion.dat_productosbalanceo prodbal
          INNER JOIN mod_datosmaestros.nom_indicador indic ON indic.idindicador= prodbal.idindicador
          INNER JOIN mod_logdistribucion.dat_prodbalanceopedido prodbalped ON  prodbal.idproductosbalanceo = prodbalped.idproductobalanceo
          INNER JOIN mod_datosmaestros.nom_unidadmedida med ON med.idunidadmedida =indic.idumedida
          WHERE prodbal.iddocbalanceo = {$iddocumento} AND prodbalped.cantcomprar > 0
          GROUP BY
          prodbalped.cantcomprar,
          indic.denominacion,
          indic.numeropieza,
          indic.codigo,
          indic.precio,
          med.abreviaturaunidadmedida";

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);

        $objPHPExcel->getActiveSheet()->setCellValue('A' . 14, "Codigo");
        $objPHPExcel->getActiveSheet()->setCellValue('C' . 14, "Descripcion");
        $objPHPExcel->getActiveSheet()->setCellValue('F' . 14, "U.M");
        $objPHPExcel->getActiveSheet()->setCellValue('G' . 14, "Cantidad");
        $objPHPExcel->getActiveSheet()->setCellValue('H' . 14, "Precio");
        $objPHPExcel->getActiveSheet()->setCellValue('I' . 14, "Importe");
        $objPHPExcel->getActiveSheet()->setCellValue('J' . 14, "Precio M.N");
        $objPHPExcel->getActiveSheet()->setCellValue('K' . 14, "Importe M.N");
        $row = 16;
        $importeTotal = 0;
        $importeTotalMN = 0;
        foreach ($datos as $prod) {
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $row, $prod["codigo"]);
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $row, $prod["denominacion"]);
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $row, $prod["um"]);
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $row, $prod["cantidad"]);
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $row, $prod["precio"]);
            $objPHPExcel->getActiveSheet()->setCellValue('I' . $row, $prod["importe"]);
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $row, $prod["precio"]);
            $objPHPExcel->getActiveSheet()->setCellValue('K' . $row, $prod["importe"]);
            $row++;
            $importeTotal += $prod["importe"];
            $importeTotalMN += $prod["importe"];
        }
        $row++;
        $objPHPExcel->getActiveSheet()->setCellValue('C' . $row, "Terminos de entrega");
        $objPHPExcel->getActiveSheet()->setCellValue('H' . $row, "Importe total: ");
        $objPHPExcel->getActiveSheet()->setCellValue('I' . $row, $importeTotal);
        $objPHPExcel->getActiveSheet()->setCellValue('K' . $row, $importeTotalMN);
        $row++;
        $datDocObservaciones = new DatDocObservaciones();
        $docobs = $datDocObservaciones->buscarObservacion($iddocumento);
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $row, "Observaciones: ");
        $objPHPExcel->getActiveSheet()->setCellValue('C' . $row, $docobs[0]['observaciones']);
        $row++;
        $objPHPExcel->getActiveSheet()->setCellValue('C' . $row, "Nota: ");
        $objPHPExcel->getActiveSheet()->setCellValue('D' . $row, $notapedido);
        $row++;
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $row, date("d/m/Y"));
        return $objPHPExcel;
    }

    public function getTipoPedido()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT 
                      nc.idnomconcepto,nc.denominacion as denomtipopedido
                    FROM 
                      mod_logdistribucion.nom_concepto as nc
                      INNER JOIN mod_datosmaestros.dat_documentoprim as ddp ON nc.iddoc = ddp.iddoc
                      INNER JOIN mod_datosmaestros.nom_docprim as ndp on ddp.iddocumentos = ndp.iddocumentos;";
        $pedidos = $conn->fetchAll($query);
        return $pedidos;
    }

    public function cargarClientes($parametros)
    {
        $servicioConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $idcliente = $servicioConfiguracion->getClienteProveedorByUser($this->global->Perfil->idusuario);
        $filtro = array();
        $filtro['nombre'] = $parametros['query'];
        $clientes = $servicioConfiguracion->getClientesProveedorByParams(
            $idcliente, $this->global->Estructura->idestructura, true, true, false, $filtro, $parametros['start'],
            $parametros['limit']
        );
        return $clientes;
    }

}
