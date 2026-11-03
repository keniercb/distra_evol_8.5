<?php

/**
 * @class     GestcierreModel
 * Clase que se encarga de las acciones
 * para realizar la carga de los documentos pendientes de los subsistemas y
 * la realización del cierre
 * @namespace Logistica\Utiles\Cierre\Models\
 * @author    Divisiçon de Gestion de Entidades
 * @copyright XETID
 * @version   1.0
 */
class GestcierreModel extends BaseModel
{

    private $documentoModel, $idusuario, $idestructuracomun;

    public function gestcierreModel()
    {
        parent::ZendExt_Model();
        $this->idusuario = $this->global->Perfil->idusuario;
        $this->idestructuracomun = $this->global->Estructura->idestructura;
        $arreglo = array('noexception' => true);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
      
    }

    /**
     * @method cargarDocuPendInv
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Inventario
     * @params $parametros Parametros provenientes de la vista
     *
     * @return Arreglo con los documentos pendientes
     */
    public function cargarDocuPendInv($parametros = array(), $apertura = false)
    {
        if (is_numeric($parametros['criterio'])) {
            $parametros['nrodoc'] = $parametros['criterio'];
        }
        $arrayAlias = array('recepcionLog', 'ajusteLog', 'valeLog', 'valedev', 'transferenciaLog');
        if($apertura){
            array_push($arrayAlias, 'aperturaLog');
        }
        $parametros['iddoc'] = array();
        foreach ($arrayAlias as $alias) {
            $docPrim = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra($alias, $this->idestructuracomun,
                LogisticaGlobal::SUBSISTEMA_INV);
            array_push($parametros['iddoc'], $docPrim->iddoc);
            if ($alias == 'ajusteLog' && $docPrim->iddoc) {
                $iddocAjuste = $docPrim->iddoc;
            }
        }
        LogisticaObjectHelper::__init()->unsetNullValues($parametros['iddoc']);
        $parametros['idejercicio'] = $this->configuracionHelper->getEjercicioActualSubsistema(
            $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        // Cambio de estados. Dainier.
        $parametros['estado'] = array(EstadoDocumentoModel::ESTADO_APROBADO,
             EstadoDocumentoModel::ESTADO_CONTABILIZADO, EstadoDocumentoModel::ESTADO_CANCELADO
        );
        $dql = $this->documentoModel->devolverDocumentos($parametros);
        $dql->andWhere('d.idcomprobante is null')->orderBy('d.idestructuracomun,d.iddoc');
        return array('cantidad' => $dql->count(),
            'datos' => $this->documentoModel->cargarClientesDocumentos($this->doctrineHelper->addQueryLimits($dql,
                    $parametros)->fetchArray()));
    }

    /**
     * @method cargarDocuPendFac
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Facturación
     * @params $parametros Parametros provenientes de la vista
     *
     * @return Arreglo con los documentos pendientes
     */
    public function cargarDocuPendFac($parametros = array())
    {
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatDocfactura',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idfactura'));
        $this->doctrineHelper->tryInyectRelactions(
            new DatDocumento(), $array
        );
        $objIddocNota = $this->documentosHelper->devuelveIddocByIdEstructura(
            'conduceLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $productoModel = new GestionarProductosModel();
        $servicioModel = new GestionarServiciosModel();
        $documentos = $this->configuracionHelper->getDocumentosPorSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        $parametros['iddoc'] = array();
        $parametros['idejercicio'] = $this->configuracionHelper->getEjercicioActualSubsistema(
            $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $parametros['estado'] = array(
            EstadoDocumentoModel::ESTADO_CONTABILIZADO,EstadoDocumentoModel::ESTADO_CANCELADO
        );
        foreach ($documentos as $row) {
            array_push($parametros['iddoc'], $row->iddoc);
        }

        $dql = $this->documentoModel->devolverDocumentos($parametros);
        $dql->innerJoin("d.DatDocfactura df");
        $dql->addSelect("df.idsubsistema as idsubsistema,");
        if ($objIddocNota->iddoc) {
            $dql->andWhere('d.iddoc <> ?', array($objIddocNota->iddoc));
        }
        $dql->andWhere('d.idcomprobante is null')->orderBy('d.idestructuracomun,d.iddoc');
        $datos = LogisticaDoctrineHelper::__init()->addQueryLimits($dql, $parametros)->fetchArray();
        foreach($datos as &$d){
            $d['cantproductos'] = $productoModel->getCantidadProductos(
                $d['iddocumento'], $d['idsubsistema'], 0
            );
            $d['cantservicios'] = $servicioModel->getCantServicios($d['iddocumento']);
        }
        return array('cantidad' => $dql->count(),
            'datos' => $datos);
    }

    /**
     * @method cargarDocuPendTrans
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Facturación
     * @params $parametros Parametros provenientes de la vista
     *
     * @return Arreglo con los documentos pendientes
     */
    public function cargarDocuPendAft($parametros = array())
    {
        $obj = new DocumentoActivoService();
        $parametros['idestructuracomun'] = $this->idestructuracomun;
        $parametros['idestado'] = array(EstadoDocumentoModel::ESTADO_PENDIENTE,
            EstadoDocumentoModel::ESTADO_ELABORACION);
        $datos = $obj->getDocActivosPendientes($parametros);
        return array(
            'cantidad' => $datos['cantidad'],
            'datos' => $datos['datos']
        );
    }

    public function cargarDocuPendTall($parametros = array())
    {
        $objPeriodo = $this->configuracionHelper->getPeriodoActualSubsistema($this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_TALLERES);
        $periodo = $this->configuracionHelper->obtenerPeriodo($objPeriodo);
        $fechaPeriodoFin = $periodo->fin;
        $fechaPeriodoInicio = $periodo->inicio;
      

        $objIddocNota = $this->documentosHelper->devuelveIddocByIdEstructura(
            'conduceLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        $documentos = $this->configuracionHelper->getDocumentosPorSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES);
        
       // $parametros['iddoc'] = array();
        $parametros['idejercicio'] = $this->configuracionHelper->getEjercicioActualSubsistema(
            $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        $parametros['estado'] = array(
            EstadoDocumentoModel::ESTADO_CERRADO
        );
        $parametros['fechainicio'] = $fechaPeriodoInicio = $periodo->inicio;
        $parametros['fechafin'] =  $fechaPeriodoFin = $periodo->fin;
      
//         $sql ="SELECT 
//         m.idestructuracomun AS idestructuracomun,
//         m.anno AS anno,
//        m.estado AS estado,
//         m.fechacontable AS fechacontable,
//         m.nrodoc AS nrodoc,
//         m.numeroref AS numeroref,
//         count(act.idordenactividad)as cantservicios,
//         COUNT(dmat.idmaterial) as cantproductos,
//         np.denominacion,
//         m.iddoc,
//         m.idusuario AS idusuario,
//          (select sum(rp.saldomb) as saldo from mod_contabilidad.res_centroelem_saldo rp
//                              inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
//                              where rp.idcuenta = nc.idcuenta and rp.fechaemision between' {$parametros['fechainicio']}'  and '{$parametros['fechafin']}'
//                              and eec.idestructuracomun = {$this->global->Estructura->idestructura}) as saldocontableot,
     
//      (select sum(COALESCE(dm.importecontable, 0) - (coalesce((
//                          select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
//                          inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
//                          inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
//                          where ddev.estado = 4 and devp.idpadre = dm.iddocumento and dev.idproducto = dm.idproducto
//                      ),0)
//                  ))) as saldoot
//  FROM mod_logistica.dat_documento m
//       INNER JOIN mod_logtaller.dat_ordentrabajo m2 ON m.iddocumento = m2.idordentrabajo
      
//        inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = m.iddocumento
//        INNER JOIN mod_datosmaestros.dat_documentoprim ddprim ON ddprim.iddoc = m.iddoc
//      INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = ddprim.iddocumentos
//       inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = ddp.iddocumento
//       inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd1.iddocumento
             
//      INNER JOIN mod_contabilidad.dat_comprobante dc ON dc.idcomprobante = m.idcomprobante   
//      INNER JOIN mod_contabilidad.dat_asiento dasi ON dasi.idcomprobante = dc.idcomprobante  
//      INNER JOIN mod_contabilidad.dat_pase dpa ON dpa.idasiento = dasi.idasiento
//      INNER JOIN mod_contabilidad.nom_cuenta nc ON nc.idcuenta = dpa.idcuenta    
//      LEFT JOIN  mod_logtaller.dat_ordenactividad act ON act.idordentrabajo = m2.idordentrabajo
//      LEFT JOIN mod_logtaller.dat_material dmat ON dmat.idordentrabajo = m2.idordentrabajo
     
//  WHERE
//       ( m.estado IN (9)
//        AND m2.fechacierre >= '{$parametros['fechainicio']}'  AND
//       m2.fechacierre <= '{$parametros['fechafin']}')
 
//         Group by 
//         nc.idcuenta,
//         m.idestructuracomun,
//         m.iddoc,
//         m.anno,
//         m.fechacontable,
//         m.nrodoc,
//         m.numeroref,
//         m.idusuario,
//         m.iddocumento,
//         m2.idordentrabajo,
//         np.denominacion
        
//         ORDER BY m.idestructuracomun,
//                 m.iddoc
//  ";
 
    
      // $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
       
       //return array('cantidad' => count($datos),'datos' => $datos);

    }


    /**
     * @method cierreDiario
     * Acción para realizar el cierre diario de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre diario
     *
     * @return null
     */
    public function cierreDiario($subsistema)
    {
        $objPeriodo = $this->configuracionHelper->getPeriodoActualSubsistema($this->idestructuracomun, $subsistema);
        $periodo = $this->configuracionHelper->obtenerPeriodo($objPeriodo);
        $fechaPeriodo = $periodo->fin;

        $fecha = $this->configuracionHelper->getFechaContableSubsistema(
            $this->idestructuracomun, $subsistema
        );
        //print_r(array($fechaPeriodo,$fecha));die;
        if ($fechaPeriodo == $fecha){
            throw new ZendExt_Exception('LOG_LB_CIERE_003');
        } else {
            $fecha = $this->configuracionHelper->getActFechContabSubsist($this->idestructuracomun, $subsistema);
            if ($fecha == -1) {
                throw new ZendExt_Exception('LOG_LB_CIERE_009');
            }
            $result[0] = array(
                'mensaje' => $fecha,
                'codMsg' => 1
            );
            $this->datos = $result;
        }
    }

    /**
     * @method cierrePeriodo
     * Acción para realizar el cierre período de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre período
     *
     * @return null
     */
    public function cierrePeriodo($subsistema)
    {
        $cierre = $this->validarCierreDiario();
        if(!empty($cierre)){
            return $cierre;
        }

        $result[0] = array('mensaje' => $this->configuracionHelper->cerrarPeriodo($this->idestructuracomun,
            $subsistema), 'codMsg' => 1
        );
        
        $this->datos = $result;
    }

    /**
     * @method cierreEjercici!
     * Acción para realizar el cierre ejercicio de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre ejercicio
     *
     * @return null
     */
    public function cierreEjercico($subsistema)
    {
        $result[0] = array('mensaje' => $this->configuracionHelper->cerrarEjercicio($this->idestructuracomun,
            $subsistema),
            'codMsg' => 1
        );
        $this->datos = $result;
    }

    /**
     * Metodo para mostras la fecha y el ejercicio del subsistema
     *
     * @return array
     */
    public function cargaDatosFecha($idSubsistema)
    {
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            $idSubsistema);
        $objPeriodo = $this->configuracionHelper->getPeriodoActualSubsistema($this->global->Estructura->idestructura,
            $idSubsistema);
        $objPeriodo = $this->configuracionHelper->obtenerPeriodo($objPeriodo);

        return array('periodo' => $objPeriodo, 'fechaContable' => $fecha->fecha);
    }

    /**
     * Metodo para realizar el cierre de la apertura de todos los depositos
     *
     * @return array
     */
    public function cierreApertura()
    {

    }

    public function validarCierreDiario()
    {
        $idperiodo = ZendExt_GlobalConcept::getInstance()->Periodo->periodoactual;        
        $periodoactual = $this->configuracionHelper->obtenerPeriodo($idperiodo);
        $inicio = "'".$periodoactual->inicio."'";
        $fin = "'".$periodoactual->fin."'";
        $sql = "SELECT DISTINCT h.iddeposito, h.fechacierre,v.codigo,v.denominacion,round(h.saldocont - h.saldofinal,2) as diferencia
                FROM  mod_logistica.his_cuadrediario h
                inner join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = h.iddeposito
                inner join mod_estructuracomp.v_dametodasestructuras v on v.idestructura = h.iddeposito
                WHERE cf.idestructura = {$this->global->Estructura->idestructura} 
                and h.fechacierre BETWEEN $inicio and $fin
				and h.fechacierre = (select max(h1.fechacierre) from mod_logistica.his_cuadrediario h1 where h1.iddeposito = h.iddeposito
									and h1.fechacierre BETWEEN $inicio and $fin)
				and round(h.saldocont - h.saldofinal,2) <> 0					
				group by h.iddeposito, h.fechacierre, v.codigo,v.denominacion, h.saldocont, h.saldofinal";
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);        
    }

}
