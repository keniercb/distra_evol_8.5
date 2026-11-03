<?php

class GastosMantenimientoModel extends ZendExt_Model
{
    private $_serviciosPlanificacion, $_ordenTrabajoService;

    public function __construct()
    {
        parent::__construct();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
        $this->seguridadHelper = ServiciosSeguridadHelper::__init();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->idestructuracomun = $this->global->Estructura->idestructura;

    }

    public function cargarMantenimientos($params)
    {
        $params['idactividad'] = Zend_Json::decode($params['idactividad']);
        $params['idestructuracomun'] = Zend_Json::decode($params['idestructuracomun']);
        $params['estado'] = 9;
        $idestructura = ($params['idestructuracomun']) ? $params['idestructuracomun'] : $this->idestructuracomun;
        if ($params['idestructuracomun']) {
            $params['idestructura'] = explode(",", $params['idestructuracomun']);
            /*$arrIdDoc = array();
            foreach ($params['idestructura'] as $idEstructura){
                $respIds = LogisticaDocumentosHelper::__init()-> devuelveIddocByIdEstructura(
                    'ordenServicioLOG', $idEstructura, LogisticaGlobal::SUBSISTEMA_TALLERES
                );
                $arrIdDoc[] = $respIds->iddoc;
            }
            $params['filtraiddoc'] = false;
            $params['iddoc'] = $arrIdDoc;*/
        } else {
            $params['idestructura'] = array($this->global->Estructura->idestructura);
        }
        $params['filtraiddoc'] = true;
        $params['idindicador'] = ($params['idindicador']) ? explode(",", $params['idindicador']) : null;
        $dql = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, true);
        if ($params['idactividad']) {
            $serv = explode(",", $params['idactividad']);
            $cant = count($serv);
            $subs = "";
            foreach ($serv as $index => $id) {
                $dts = "dts" . $index;
                $ot = "ot" . $index;
                $dm = "dm" . $index;
                $doc = "doc" . $index;
                $col = "sd" . $id;
                $subs .= " (SELECT count( $dts.idservicio) FROM DatTrabajoServicio $dts
                INNER JOIN $dts.DatOrdenTrabajo $ot INNER JOIN $ot.DatDocumento $doc
                INNER JOIN $ot.DatMedio $dm WHERE $dts.idservicio = {$id}
                AND $dm.idindicador = med.idindicador AND $doc.estado = 9
                AND $doc.idestructuracomun in ($idestructura)) as $col ";
                if ($cant - 1 > $index) {
                    $subs .= ", ";
                }
            }
            if ($subs != "") {
                $dql->addSelect($subs);
            }
        }
        $dql->addSelect(" (SELECT ni1.denominacion FROM NomIndicador ni1 WHERE ni1.idindicador = ind.idpadre) as tipo");
        $result = $dql->orderBy("med.idindicador")->fetchArray();
        return array('cantidad' => $dql->count(), 'datos' => $result);
    }

    public function devolverMateriales($parametros){
        $idorden = $parametros['iddocumento'];
        $conn = Zend_Registry::get('conexion');
        $sql ="Select       m.idmaterial, m.cantidad, m.importecup, m.precio,
                           num.abreviaturaunidadmedida
                            , (SELECT coalesce(a.numeropieza,a.codigo)||' '||a.denominacion as denominacion
                            FROM  mod_datosmaestros.nom_indicador a
                            WHERE a.idindicador = ca.idindicador
                            LIMIT 1
                            ) as denominacionactividad,
                            ni.denominacion as denominacion,(case when ni.numeropieza is null or length(ni.numeropieza) = 0 then ni.codigo else ni.numeropieza end) as codigo
                from mod_logtaller.dat_material m
                left join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = m.idordentrabajo
                left join mod_logistica.dat_documento dd on dd.iddocumento = dot.idordentrabajo
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = m.idindicador
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
                inner join mod_logtaller.conf_actividad ca on ca.idactividad = m.idactividad
                inner join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = m.idunidadmedida
                where m.idordentrabajo in ({$idorden})";
    $result = $conn->fetchAll($sql);  
return array('cantidad' => count($result), 'datos' => $result) ;


    }
    public function cargarDesgloceMantenimiento($params)
    {
        $params['filterestado'] = $params['estado'];
        $params['estado']= null;
        $params['idservicio'] = Zend_Json::decode($params['idactividad']);
        $params['entidad'] = Zend_Json::decode($params['entidad']);
        if ($params['idservicio']) {
            $params['idservicio'] = explode(",", $params['idservicio']);
        } else {
            unset($params['idservicio']);
        }
        unset($params['idactividad']);
        if ($params['entidad']) {
            $params['idestructura'] = explode(",", $params['entidad']);
            $arrIdDoc = array();
            foreach ($params['idestructura'] as $idEstructura) {
                $respIds = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
                    'ordenServicioLOG', $idEstructura, LogisticaGlobal::SUBSISTEMA_TALLERES
                );
                $arrIdDoc[] = $respIds . iddoc;//array_merge($arrIdDoc, $respIds[0]);
            }
            $params['filtraiddoc'] = true;
            $parametros['iddoc'] = $arrIdDoc;
        } else {
            $params['idestructura'] = array($this->global->Estructura->idestructura);
            unset($params['entidad']);
        }
        $result = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, false);
        // foreach ($result['datos'] as $index => $row) {
        //     $nomact = $this->_serviciosPlanificacion->obtenerActividadyNorma(
        //         2, $row['idservicio'], null, ($params['start']) ? $params['start'] : 0,
        //         ($params['limit']) ? $params['limit'] : 30, 0
        //     );
        //     $result['datos'][$index]['denomservicio'] = $nomact['datos'][0]['denominacion'];
        // }
        return $result;
    }

    public function cargarMedios($params)
    {
        $params['estado'] = 9;
        $resultado = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, false);
        return $resultado;
    }

    public function crearExcel($params)
    {
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $params['columnas'] = json_decode($params['columnas']);
        $datos = $this->cargarMantenimientos($params);
        $columns = array();
        foreach ($params['columnas'] as $columna) {
            if ($columna->name && $columna->denominacion) {
                $columns[] = array('header' => '<b>' . $columna->denominacion . '</b>', 'dataIndex' => $columna->name);
            }
        }
        foreach ($datos['datos'] as &$d) {
            $serv = 0;
            foreach ($columns as $col) {
                if (strstr($col['dataIndex'], "sd")) {
                    $serv += $d[$col['dataIndex']];
                }
            }
            $d['totalservicios'] = $serv;
        }
        $excel->writeData($datos['datos'], $columns);
        $excel->writeRow();
        if ($params['alternativa']) {
            $arreglo = array(
                "", "", "", "", "", '<b>' . "Total" . '</b>', $params['totalContab'], $params['totalAltern'],
                $params['total']
            );
        } else {
            $arreglo = array("", "", "", '<b>' . "Total" . '</b>', $params['total']);
        }
        $excel->writeLine($arreglo);
        $excel->close();
        return '/logistica/talleres/recuperaciones/' . $fichero;
    }

}