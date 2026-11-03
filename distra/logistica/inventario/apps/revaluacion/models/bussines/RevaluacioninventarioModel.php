<?php

/**
 * @class      RevaluacioninventarioModel
 * @package    Inventario
 * @subpackage Revaluacion
 * @author     Jorge Luis Cuellar Mondeja
 * @copyright  XETID
 * @version    2.0.1
 */
class RevaluacioninventarioModel extends BaseModel
{
    private $urlFireConfuracion;
    private $docModel;
    private $movModel;

    public function __construct()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $this->urlFireConfuracion = $dirApps . 'logistica/inventario/revaluacion/models/domain/revaluacion.json';
        $this->docModel = new DocumentoLogisticaModel(
            array('alias' => 'revaluacionLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV, 'isPrincipal' => true)
        );
        $this->movModel = new LogisticaMovimientoModel();
        parent::__construct();
    }

    /**
     *  Devuelve el listado de productos ha evaluar
     */
    public function getProductosEvaluacion($start = 0, $limit = 50, $idestructura = '', $criterio)
    {
        $data = $this->getProductosEvaluados($start, $limit, $idestructura, $criterio);
        if ($data['total'])
            return $data;

        return $this->getProductosSinEvaluacion($start, $limit, $idestructura, $criterio);
    }

    /**
     *  Devuelve el listado de productos sin evaluar
     */
    private function getProductosSinEvaluacion($start, $limit, $idestructura, $criterio)
    {
        $respuesta = array();

        $selectData = "
             SELECT 
                    ni.codigo || ' - ' || ni.denominacion AS denominacion,
                    ni.numeropieza,
                    nc.denominacion AS categoria,
                    num.abreviaturaunidadmedida AS um,
                    dp.cantidad AS existencia,
                    (coalesce(dp.precio,0) + coalesce(dp.precioalternativo,0)) AS precio,
                    (coalesce(dp.importe,0) + coalesce(dp.importealternativo,0)) AS importe,
                    dp.idproducto
        ";

        $selectTotal = " SELECT COUNT(dp.idproducto) ";

        $sqlPaginado = " ORDER BY ni.codigo ASC OFFSET($start) LIMIT($limit)";

        $sqlFrom = "
              
            FROM mod_logistica.dat_producto dp
                INNER JOIN mod_datosmaestros.nom_indicador ni ON dp.idindicador = ni.idindicador
                LEFT  JOIN mod_logistica.nom_categoria nc ON dp.idcategoria = nc.idcategoria
                LEFT  JOIN mod_datosmaestros.nom_unidadmedida num ON dp.idumedida = num.idunidadmedida
                INNER JOIN mod_estructuracomp.dat_estructuraop eop ON dp.idestructura = eop.idestructuraop
            ";

        $sqlWhere = ' WHERE eop.idconcepto = 8 AND dp.cronologia > 0';

        if ($criterio) {
            $sqlWhere = " AND ( 
                ni.codigo iLike '%$criterio%' OR 
                ni.denominacion iLike '%$criterio%' OR 
                ni.numeropieza iLike '%$criterio%' OR 
                nc.denominacion iLike '%$criterio%' OR 
                num.abreviaturaunidadmedida iLike '%$criterio%' )
            ";
        }

        if ($idestructura && strlen($idestructura)) {
            $sqlWhere .= (strlen($sqlWhere)) ? " AND dp.idestructura = $idestructura" : " WHERE dp.idestructura = $idestructura";
        }
        $sqlWhere.= " and dp.idproducto in (select idproducto FROM mod_logistica.dat_producto p
            INNER JOIN mod_estructuracomp.v_dametodasestructuras eop ON p.idestructura = eop.idestructura
            WHERE eop.idconcepto = 8 AND p.cronologia > 0 AND p.idestructuracomun = {$this->global->Estructura->idestructura})";

        $respuesta['datos'] = LogisticaDoctrineHelper::__init()->getConnection()->execute($selectData . $sqlFrom . $sqlWhere . $sqlPaginado)->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = LogisticaDoctrineHelper::__init()->getConnection()->execute($selectTotal . $sqlFrom . $sqlWhere)->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = $respuesta['total'][0]->count;
        $respuesta['evaluado'] = false;
        $respuesta['revisado'] = false;
        $respuesta['aprobado'] = false;

        return $respuesta;
    }

    /**
     *  Devuelve el listado de productos ya evaluados
     */
    private function getProductosEvaluados($start, $limit, $idestructura, $criterio)
    {
        $respuesta = array();

        $selectData = "SELECT 
                ni.codigo || ' - ' || ni.denominacion AS denominacion,
                ni.numeropieza,
                nc.denominacion AS categoria,
                num.abreviaturaunidadmedida AS um,
                pe.existencia,
                pe.precio,
                pe.importe,
                pe.idproducto,
                pe.preciorevaluado,
                abs(dp.importe - pe.importerevaluado) as diffimporte,
                pe.importerevaluado,
                pe.diferencia,
                (
                    SELECT u.nombreusuario FROM  mod_seguridad.seg_usuario u WHERE u.idusuario = pe.idrevisado
                ) AS revisadopor,
                (
                    SELECT u.nombreusuario FROM  mod_seguridad.seg_usuario u WHERE u.idusuario = pe.idaprobado
                ) AS aprobadopor,
                ni.idnaturaleza";

        $selectTotal = " SELECT COUNT(pe.idproducto) ";

        $sqlPaginado = ($limit) ? " OFFSET($start) LIMIT($limit)" : "";

        $sqlFrom = "
              
           FROM mod_logistica.dat_productorevaluacion pe
                INNER JOIN mod_logistica.dat_producto dp ON pe.idproducto = dp.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador ni ON dp.idindicador = ni.idindicador
                LEFT  JOIN mod_logistica.nom_categoria nc ON dp.idcategoria = nc.idcategoria
                LEFT  JOIN mod_datosmaestros.nom_unidadmedida num ON dp.idumedida = num.idunidadmedida
                    ";

        $sqlWhere = '';

        if ($criterio) {
            $sqlWhere = " WHERE 
                ni.codigo iLike '%$criterio%' OR 
                ni.denominacion iLike '%$criterio%' OR 
                ni.numeropieza iLike '%$criterio%' OR 
                nc.denominacion iLike '%$criterio%' OR 
                num.abreviaturaunidadmedida iLike '%$criterio% ' 
            ";
        }

        if ($idestructura && strlen($idestructura)) {
            $sqlWhere .= (strlen($sqlWhere)) ? " AND dp.idestructura = $idestructura" : " WHERE dp.idestructura = $idestructura";
        }
        $sqlWhere.= " and dp.idproducto in (select idproducto FROM mod_logistica.dat_producto p
            INNER JOIN mod_estructuracomp.v_dametodasestructuras eop ON p.idestructura = eop.idestructura
            WHERE eop.idconcepto = 8 AND p.cronologia > 0 AND p.idestructuracomun = {$this->global->Estructura->idestructura})";
        $sqlOrderBy = " ORDER BY ni.denominacion ASC ";

        $respuesta['datos'] = LogisticaDoctrineHelper::__init()->getConnection()->execute($selectData . $sqlFrom . $sqlWhere . $sqlOrderBy . $sqlPaginado)->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = LogisticaDoctrineHelper::__init()->getConnection()->execute($selectTotal . $sqlFrom . $sqlWhere)->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = $respuesta['total'][0]->count;

        $respuesta['impTotal'] = 0;
        $respuesta['impRevTotal'] = 0;

        foreach ($respuesta['datos'] as $value) {
            $respuesta['impTotal'] += $value->importe;
            $respuesta['impRevTotal'] += $value->importerevaluado;
        }

        $respuesta['difTotal'] = $respuesta['impRevTotal'] - $respuesta['impTotal'];

        $respuesta['evaluado'] = true;
        $respuesta['revisado'] = (strlen($respuesta['datos'][0]->revisadopor)) ? true : false;
        $respuesta['aprobado'] = (strlen($respuesta['datos'][0]->aprobadopor)) ? true : false;

        return $respuesta;
    }

    /**
     *  Inserta el listado de productos ha evaluar en una tabla temporal
     */
    public function insertProductosEvaluacion()
    {
        $confRevaluacion = $this->getConfiguracionEvaluacion();

        /**
         *  Primero se limpia la tabla de la revaluacion anterior
         */
        $this->deleteProductosEvaluacion();

        /**
         *  Segundo se inserta la nueva revaluacion
         */
        $sqlInsert = "
            INSERT INTO mod_logistica.dat_productorevaluacion(
                idproducto, 
                existencia, 
                precio, 
                importe, 
                preciorevaluado,
                idestructura,
                tasa
            )
            SELECT 
                p.idproducto, 
                p.cantidad,
                (coalesce(p.precio,0) + coalesce(p.precioalternativo,0)),
                round(coalesce(p.importe,0) + coalesce(p.importealternativo,0),2),
                (round(coalesce(p.importe,0) + coalesce(p.importealternativo,0),2) * (
                  CASE WHEN (SELECT i.idnaturaleza FROM mod_datosmaestros.nom_indicador i WHERE i.idindicador = p.idindicador) = '-3' 
                      THEN {$confRevaluacion->tasa}  ELSE  {$confRevaluacion->coeficiente} END ))/(
                        CASE WHEN p.cantidad > 0 then p.cantidad else 1 end ),
                p.idestructura,
                (
                CASE WHEN (SELECT i.idnaturaleza FROM mod_datosmaestros.nom_indicador i WHERE i.idindicador = p.idindicador) = '-3' THEN -- Combustibles 
                    {$confRevaluacion->tasa}
                  ELSE
                    {$confRevaluacion->coeficiente}
                  END
                )
            FROM mod_logistica.dat_producto p
            INNER JOIN mod_estructuracomp.v_dametodasestructuras eop ON p.idestructura = eop.idestructura
            WHERE eop.idconcepto = 8 AND p.cronologia > 0 AND p.idestructuracomun = {$this->global->Estructura->idestructura}
        ";
        /**
         *  El resto de los campos calculables, como importe revaluado y diferencias, se calculara e insertara
         *  mediante un trigger
         */

        LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlInsert);
    }

    /**
     *  Limpia el listado de productos ha evaluar guardados de forma temporal
     */
    private function deleteProductosEvaluacion()
    {
        $sqlLimpiarTabla = "DELETE FROM mod_logistica.dat_productorevaluacion 
            where idproducto in (select idproducto FROM mod_logistica.dat_producto p
            INNER JOIN mod_estructuracomp.v_dametodasestructuras eop ON p.idestructura = eop.idestructura
            WHERE eop.idconcepto = 8 AND p.cronologia > 0 AND p.idestructuracomun = {$this->global->Estructura->idestructura})";
        LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlLimpiarTabla);
    }

    /**
     *  Devuelve el listado de documentos segun un arreglo de estados
     */
    public function getDocumentos($start, $limit, $idestructura, $arrEstados, $onlyTotal = false)
    {
        $respuesta = array();

        $arrEstados = '{' . implode(',', $arrEstados) . '}';

        $selectData = "
             SELECT 
                DISTINCT dd.iddocumento, 
                dd.numeroref, 
                coalesce(df.nrofactura,dd.nrodoc) as nrodoc, 
                ndp.denominacion as sigla,
                (
                     SELECT count(m.idmovimiento) FROM mod_logistica.dat_movimiento m 
                     WHERE m.iddocumento = dd.iddocumento
                ) AS cantidad,
                (
                    SELECT u.nombreusuario FROM  mod_seguridad.seg_usuario u WHERE u.idusuario = dd.idusuario
                ) AS creadopor,
                pm.idestructura,
                (BTRIM(concat(COALESCE(eom.codigo,COALESCE(eoo.codigo,COALESCE(eof.codigo))),'-',COALESCE(eom.denominacion,COALESCE(eoo.denominacion,eof.denominacion))),'-')) as deposito
        ";

        $selectTotal = " SELECT COUNT( distinct dd.iddocumento) ";

        $sqlPaginado = " OFFSET($start) LIMIT($limit)";

        $sqlFrom = "
            FROM mod_logistica.dat_documento dd
                INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON dd.iddoc = ddp.iddoc
                INNER JOIN mod_datosmaestros.dat_estructurasubsist deb ON deb.idestructurasubsist = ddp.idestructurasubsist
                INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
                
                -- Inventario general
                LEFT JOIN mod_logistica.dat_movimiento m ON m.iddocumento = dd.iddocumento
                LEFT JOIN mod_logistica.dat_producto pm ON pm.idproducto = m.idproducto
                LEFT JOIN mod_estructuracomp.dat_estructuraop eom ON eom.idestructuraop = pm.idestructura
                
                -- Distribucion
                LEFT JOIN mod_logdistribucion.dat_prodorden o ON o.idorden = dd.iddocumento
                LEFT JOIN mod_logistica.dat_producto po ON po.idproducto = o.idproducto
                LEFT JOIN mod_estructuracomp.dat_estructuraop eoo ON eoo.idestructuraop = po.idestructura
                
                -- Facturacion
                LEFT JOIN mod_logfacturacion.dat_docfactura df ON df.idfactura = dd.iddocumento
                LEFT JOIN mod_estructuracomp.dat_estructuraop eof ON eof.idestructuraop = df.iddeposito
            ";

        $sqlWhere = " WHERE 
            dd.estado = ANY(CAST('$arrEstados' AS NUMERIC[])) AND deb.idsubsistema IN(10,13) 
            AND NOT (df.iddeposito IS NULL AND pm.idestructura IS NULL AND po.idestructura IS NULL)
        ";

        $sqlOrderBy = " ORDER BY pm.idestructura ASC";

        if ($idestructura) {
            $sqlWhere .= " AND ( pm.idestructura= $idestructura )";
        }

        $sqlWhere.= " and pm.idproducto in (select idproducto FROM mod_logistica.dat_producto p
            INNER JOIN mod_estructuracomp.v_dametodasestructuras eop ON p.idestructura = eop.idestructura
            WHERE eop.idconcepto = 8 AND p.cronologia > 0 AND p.idestructuracomun = {$this->global->Estructura->idestructura})";

        if (!$onlyTotal) {
            $respuesta['datos'] = LogisticaDoctrineHelper::__init()->getConnection()->execute($selectData . $sqlFrom . $sqlWhere . $sqlOrderBy . $sqlPaginado)->fetchAll(PDO::FETCH_OBJ);
        }
        $respuesta['total'] = LogisticaDoctrineHelper::__init()->getConnection()->execute($selectTotal . $sqlFrom . $sqlWhere)->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = $respuesta['total'][0]->count;

        return $respuesta;
    }

    public function getConfiguracionEvaluacion()
    {
        return json_decode(file_get_contents($this->urlFireConfuracion, true));
    }

    public function setConfiguracionEvaluacion($tasa, $coeficiente)
    {
        $datos['tasa'] = $tasa;
        $datos['coeficiente'] = $coeficiente;

        unlink($this->urlFireConfuracion);
        file_put_contents($this->urlFireConfuracion, json_encode($datos, JSON_UNESCAPED_UNICODE));
    }

    public function revisarRevaluacion($idUsuario, $idEstructura)
    {
        $sql = "UPDATE mod_logistica.dat_productorevaluacion SET idrevisado=$idUsuario
                  WHERE idestructura = $idEstructura";

        LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
    }

    public function aprobarRevaluacion($idUsuario, $idEstructuraCheck)
    {
        /*$sqlEstructuras = "select distinct pr.idestructura from  mod_logistica.dat_productorevaluacion pr
            join mod_logistica.dat_producto p on pr.idproducto = p.idproducto where p.idestructuracomun = {$this->global->Estructura->idestructura}
            and pr.idrevisado is not null";
        $estructurasAprodbadas = $this->doctrineHelper->getConnection()->fetchAll($sqlEstructuras);
        foreach ($estructurasAprodbadas as $estruct){

        }*/
        $idEstructura = $idEstructuraCheck;
        $iddocumento = $this->preAprobarRevaluacion($idUsuario, $idEstructura);
        $sql = "UPDATE mod_logistica.dat_productorevaluacion SET idaprobado={$idUsuario}, iddocumento={$iddocumento} 
                    WHERE idestructura = {$idEstructura}";
        LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
        $this->integrator->contabilidad->unificacionSubsistema(
            LogisticaGlobal::SUBSISTEMA_INV, $this->global->Estructura->idestructura, true
        );
        $this->integrator->contabilidad->unificacionSubsistema(
            LogisticaGlobal::SUBSISTEMA_FAC, $this->global->Estructura->idestructura, true
        );
    }

    private function preAprobarRevaluacion($idUsuario, $idEstructura)
    {
        $arrProdEvaluados = $this->getProductosEvaluados(false, false, $idEstructura, false);

        $documentoIn = $this->docModel->adicionarDocumento(array('idestructuracomun' => $idEstructura));
        $documentoIn->estado = EstadoDocumentoModel::ESTADO_CONTABILIZADO;
        $documentoIn->idusuario = $idUsuario;
        $documentoIn->aprobadopor = $idUsuario;
        $documentoIn->idcomprobante = -1;
        $documentoIn->save();
        $documentoOut = $this->docModel->copiarDocumento($documentoIn->iddocumento,true);
        $this->addMovimentosOut($arrProdEvaluados, $documentoOut);
        $this->addMovimentosIn($arrProdEvaluados, $documentoIn->iddocumento);

        $this->docModel->actualizarAprobadoPoryFecha($documentoOut, false);
        $this->docModel->actualizarAprobadoPoryFecha($documentoIn->iddocumento, false);

        $cronologiaOut = $this->docModel->establecerCronologia($documentoOut);
        $cronologia = $this->docModel->establecerCronologia($documentoIn->iddocumento);

        $this->updateProductos($arrProdEvaluados, $cronologia);

        $this->movModel->aprobarCronologiaProductos($documentoOut, $cronologiaOut);
        $this->movModel->aprobarCronologiaProductos($documentoIn->iddocumento, $cronologia);
        return $documentoIn->iddocumento;
    }

    private function addMovimentosIn($arrProdEvaluados, $idDocumento)
    {
        $collMovimiento = new Doctrine_Collection('DatMovimientos');
        foreach ($arrProdEvaluados['datos'] as $producto) {
            $importeContable = $producto->diffimporte/*abs($producto->importe - $producto->importerevaluado)*/;
            $movimiento = new DatMovimientos();
            $movimiento->iddocumento = $idDocumento;
            $movimiento->idproducto = $producto->idproducto;
            $movimiento->preciocontable = $importeContable / ($producto->existencia != 0 ? $producto->existencia : 1);
            $movimiento->importecontable = $importeContable;
            $movimiento->precioalternativo = 0;
            $movimiento->importealternativo = 0;
            $movimiento->existenciaactual = $producto->existencia;
            $movimiento->cantidad = 0;
            $movimiento->preciopromedio = $producto->preciorevaluado;
            $movimiento->importetotal = $producto->importerevaluado;
            $movimiento->signo = '+';
            $collMovimiento->add($movimiento);
        }
        $collMovimiento->save();
    }

    private function addMovimentosOut($arrProdEvaluados, $idDocumento)
    {
        $collMovimiento = new Doctrine_Collection('DatMovimientos');
        foreach ($arrProdEvaluados['datos'] as $producto) {
            $importeContable = $producto->diffimporte/*abs($producto->importe - $producto->importerevaluado)*/;
            $movimiento = new DatMovimientos();
            $movimiento->iddocumento = $idDocumento;
            $movimiento->idproducto = $producto->idproducto;
            $movimiento->preciocontable = 0;
            $movimiento->importecontable = 0;
            $movimiento->precioalternativo = $importeContable / ($producto->existencia != 0 ? $producto->existencia : 1);
            $movimiento->importealternativo = $importeContable;
            $movimiento->existenciaactual = $producto->existencia;
            $movimiento->cantidad = 0;
            $movimiento->preciopromalt = 0;
            $movimiento->importetotalalt = 0;
            $movimiento->signo = '-';
            $collMovimiento->add($movimiento);
        }
        $collMovimiento->save();
    }

    private function updateProductos($arrProdEvaluados, $cronologia)
    {
        $collProductos = new Doctrine_Collection('DatProductoLogistica');

        foreach ($arrProdEvaluados['datos'] as $value) {

            $producto = Doctrine::getTable('DatProductoLogistica')->find($value->idproducto);

            $producto->cronologia = $cronologia;
            $producto->precio = $value->preciorevaluado;
            $producto->cantidad = $value->existencia;
            $producto->disponible = $value->existencia;
            $producto->importe = $value->importerevaluado;
            $producto->precioalternativo = 0;
            $producto->importealternativo = 0;

            $collProductos->add($producto);
        }

        $collProductos->save();
    }
}
