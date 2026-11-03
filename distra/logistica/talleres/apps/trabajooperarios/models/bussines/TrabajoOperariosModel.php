<?php

class TrabajoOperariosModel extends BaseModel
{
    private $_serviciosRecursosHumanos, $_serviciosPlanificacion, $_serviciosConfiguracionGeneral,
        $_serviciosEstructuraComp, $_ppaService, $_aperturaAFT, $_aperturaFAC, $_utilesServices,
        $_solicitudServices, $_docAFTServices, $_maestro, $idestructuracomun, $idPeriodoActual,
        $idEjercicioActual, $_serviciosSeguridad;

    public function __construct($datosDoc = array(), $aperturaAFT = false)
    {
        $datosDoc['subsistema'] = LogisticaGlobal::SUBSISTEMA_TALLERES;
        parent::__construct($datosDoc);
        $this->_aperturaFAC = ($datosDoc['aperturadoFAC']) ? $datosDoc['aperturadoFAC'] : false;
        $this->idestructuracomun = $this->global->Estructura->idestructura;
//        $this->_solicitudServices = new SolicitudService();

        $objPeriodo = $this->configuracionHelper->getPeriodoActualSubsistema($this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_TALLERES);
        $objPeriodo = $this->configuracionHelper->obtenerPeriodo($objPeriodo);
        $this->idPeriodoActual = $objPeriodo->idperiodo;
        $this->idEjercicioActual = $this->configuracionHelper->getEjercicioActualSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES);

        $this->_aperturaAFT = $aperturaAFT;
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_serviciosEstructuraComp = ServiciosEstructuraComposicionHelper::__init();
        $this->_serviciosSeguridad = ServiciosSeguridadHelper::__init();
    }

    public function cargaDatosFecha($idSubsistema)
    {
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            $idSubsistema);
        $objPeriodo = $this->configuracionHelper->getPeriodoActualSubsistema($this->global->Estructura->idestructura,
            $idSubsistema);
        $objPeriodo = $this->configuracionHelper->obtenerPeriodo($objPeriodo);

        return array('periodo' => $objPeriodo, 'fechaContable' => $fecha->fecha);
    }

    public function cargarPersonasTrabajo($parametros = array())
    {
        $params['start'] = ($parametros['start']) ? $parametros['start'] : 0;
        $params['limit'] = ($parametros['limit']) ? $parametros['limit'] : 30;
        // $modoConsulta = $parametros['modoConsulta'] ? $parametros['modoConsulta'] : 1;//1-mes actual, 2-mes pasado
        if ($parametros['idPeriodo'] && $this->idPeriodoActual != $parametros['idPeriodo']) {
            $parametros['soloTPConValor'] = true;
        }
        $result = $this->personasTrabajoMesActual($this->idestructuracomun, $parametros, $params['limit'], $params['start']);

        return array('cantidad' => count($result) ? $result[0]['cantidad'] : 0, 'datos' => $result);
    }

//     private function personasTrabajoMesPasados($parametros, $limit, $start)
//     {
//         $conn = Zend_Registry::get('conexion');
//         $aux = "";
//         $strPer = '-1';
//         $idpersonas = [];
//         if ($parametros['idPeriodo']) {
//             $aux .= "and top.idperiodo = {$parametros['idPeriodo']} ";
//         }
//         if ($parametros['fechaInicio']) {
//             $aux .= "and tod.fecha >= '%{$parametros['fechaInicio']}%' ";
//         }
//         if ($parametros['fechaFin']) {
//             $aux .= "and tod.fecha <= '%{$parametros['fechaFin']}%' ";
//         }

//         if ($parametros['idArea']) {
//             $personass = $conn->fetchAll("
//             SELECT pa.idpersona
//             FROM mod_logtaller.conf_personaarea pa
//             where pa.idestructuracomun = {$this->idestructuracomun}
//             and pa.idarea = {$parametros['idArea']}
//             ");
//             if (count($personass) > 0) {
//                 $idpersonas = array_column($personass, 'idpersona');
//             } else {
//                 return [];
//             }
//         }

//         $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
//             $idpersonas, $parametros['criterio'], null, null, array(), array(),
//             $this->idestructuracomun
//         );
//         if ($personas->quantity > 0) {
//             $personas = array_column($personas->data, 'idpersona');
//             $strPer = implode(',', $personas);
//         } else {
//             return [];
//         }
// //        return array("datos" => ($personas->data) ? $personas->data : array(), "cantidad" => $personas->quantity);

//         $result = $conn->fetchAll("
//         select a.idresponsable, a.idtrabajooperarios, a.observacion, a.aprobado, a.importeacobrar, a.importebase
//             , count(*) over() as cantidad
//         from (
//             SELECT top.idresponsable, top.idtrabajooperarios, top.observacion, top.aprobado
//             , case when top.importecobrar is not null then top.importecobrar else sum(tod.importecobrar) end as importeacobrar
//             , coalesce(sum(tod.importecobrar), 0) as importebase
//             FROM mod_logtaller.dat_trabajooperarios top
//             inner join mod_logtaller.dat_trabajooperariosdetallado tod on(top.idtrabajooperarios = tod.idtrabajooperarios)
//             where top.idestructuracomun = {$this->idestructuracomun}
//             and top.idresponsable in ($strPer) and tod.estado = 1
//             $aux
//             group by top.idresponsable, top.idtrabajooperarios, top.observacion, top.aprobado
//         ) a
//         order by a.idresponsable
//         LIMIT $limit
//         OFFSET $start
//         ");

//         return $result;
//     }

    private function personasTrabajoMesActual($idestructuracomun, $parametros, $limit = 'null', $start = 0)
    {
        $conn = Zend_Registry::get('conexion');
        
        $soloTPConValor = 'null';
        $criterio = $parametros['criterio'] ? '\'' . $parametros['criterio'] . '\'' : 'null';
        $fechaInicio = $parametros['fechaInicio'] ? '\'' . $parametros['fechaInicio'] . '\'' : 'null';
        $fechaFin = $parametros['fechaFin'] ? '\'' . $parametros['fechaFin'] . '\'' : 'null';
        $idArea = $parametros['idArea'] ? $parametros['idArea'] : 'null';

        if ($parametros['soloTPConValor']) {
            $soloTPConValor = '\'true\'';
        }

        return $conn->fetchAll("
        select *
        from mod_logtaller.f_operarios_orden_trabajo(
            {$this->idestructuracomun},
            {$parametros['idPeriodo']},
            $soloTPConValor,
            $criterio,
            $fechaInicio,
            $fechaFin,
            $idArea,
            $limit,
            $start
            )
        ");
    }

    public function cargarPersonasTrabajoActividades($parametros = array())
    {
        $parametros['start'] = ($parametros['start']) ? $parametros['start'] : 0;
        $parametros['limit'] = ($parametros['limit']) ? $parametros['limit'] : 30;
        $modoConsulta = $parametros['modoConsulta'] ? $parametros['modoConsulta'] : 1;//1-mes actual, 2-mes pasado

//        if ($modoConsulta == 1) {
//            $result = $this->personasTrabajoActividadesMesActual($parametros);
//        } elseif ($modoConsulta == 2) {
//            $result = $this->personasTrabajoActividadesMesPasados($parametros);
//        }
//        print_r(ZendExt_IoC::getInstance()->logistica->getTrabajoOperariosIndicadores());die;
        $result = $this->personasTrabajoActividadesMesPasados($parametros);

        return array('cantidad' => count($result) ? $result[0]['cantidad'] : 0, 'datos' => $result);
    }

    private function personasTrabajoActividadesMesPasados($parametros)
    {
        $conn = Zend_Registry::get('conexion');
        $criterio = $parametros['criterio'] ? '\'' . $parametros['criterio'] . '\'' : 'null';
        $idPeriodo = $parametros['idPeriodo'] ? $parametros['idPeriodo'] : 'null';
        $idservicio = $parametros['idservicio'] ? $parametros['idservicio'] : 'null';
        $idactividad = $parametros['idactividad'] ? $parametros['idactividad'] : 'null';
        $idpersona = $parametros['idpersona'] ? $parametros['idpersona'] : 'null';
        $fechaInicio = $parametros['fechaInicio'] ? '\'' . $parametros['fechaInicio'] . '\'' : 'null';
        $fechaFin = $parametros['fechaFin'] ? '\'' . $parametros['fechaFin'] . '\'' : 'null';
        $limit = $parametros['limit'] ? $parametros['limit'] : 'null';
        $start = $parametros['start'] ? $parametros['start'] : 0;
        $idArea = $parametros['idArea'] ? $parametros['idArea'] : 'null';
        $criterioper = $parametros['criterioper'] ? '\'' . $parametros['criterioper'] . '\'' : 'null';

        return $conn->fetchAll("
        select *
        from mod_logtaller.f_operarios_orden_trabajo_detallado(
            {$this->idestructuracomun},
            $idArea,
            $idPeriodo,
            $fechaInicio,
            $fechaFin,
            $idpersona,
            $idservicio,
            $idactividad,
            $criterioper,
            $criterio,
            $limit,
            $start
            )
        ");
    }

    public function cargarActividadesPadrePersona($parametros = array())
    {
        $aux = "";
        $innerjoins = '';
        if ($parametros['fechaInicio']) {
            $aux .= "and tod.fecha >= '%{$parametros['fechaInicio']}%' ";
        }
        if ($parametros['fechaFin']) {
            $aux .= "and tod.fecha <= '%{$parametros['fechaFin']}%' ";
        }

        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll("
        SELECT cap.idactividad, cap.denominacion
        FROM mod_logtaller.conf_actividad cap
        inner join mod_logtaller.conf_actividad ca on(ca.idpadre = cap.idactividad)
        inner join mod_logtaller.dat_trabajooperariosdetallado tod on(tod.idactividad = cap.idactividad)
        inner join mod_logtaller.dat_trabajooperarios top on(top.idtrabajooperarios = tod.idtrabajooperarios)
        $innerjoins
        where top.idestructuracomun = {$this->idestructuracomun} 
        and top.idresponsable = {$parametros['idpersona']} and tod.estado = 1
        $aux
        group by cap.idactividad, cap.denominacion
        ");

        return array('cantidad' => count($result) ? $result[0]['cantidad'] : 0, 'datos' => $result);
    }

    public function cargarActividadesPersona($parametros = array())
    {
        $aux = "";
        $innerjoins = '';
        if ($parametros['fechaInicio']) {
            $aux .= "and tod.fecha >= '%{$parametros['fechaInicio']}%' ";
        }
        if ($parametros['fechaFin']) {
            $aux .= "and tod.fecha <= '%{$parametros['fechaFin']}%' ";
        }

        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll("
        SELECT ca.idactividad, ca.denominacion
        FROM mod_logtaller.conf_actividad ca
        inner join mod_logtaller.dat_trabajooperariosdetallado tod on(tod.idactividad = ca.idactividad)
        inner join mod_logtaller.dat_trabajooperarios top on(top.idtrabajooperarios = tod.idtrabajooperarios)
        $innerjoins
        where top.idestructuracomun = {$this->idestructuracomun} 
        and top.idresponsable = {$parametros['idpersona']} and tod.estado = 1
        $aux
        group by ca.idactividad, ca.denominacion
        ");

        return array('cantidad' => count($result) ? $result[0]['cantidad'] : 0, 'datos' => $result);
    }

    /**
     * @method devuelve las personas de la entidad
     * @param $idEntidad
     *
     * @return mixed
     */
    public function cargarPersonas($idEntidad, $params = array())
    {
        $params['idspersonas'] = ($params['idspersonas']) ? $params['idspersonas'] : array();
        $params['criterio'] = ($params['criterio']) ? $params['criterio'] : null;
//        $params['start'] = ($params['start']) ? $params['start'] : 0;
//        $params['limit'] = ($params['limit']) ? $params['limit'] : 10000;
        if (!$idEntidad) {
            $idEntidad = $this->global->Estructura->idestructura;
        }
        $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
            $params['idspersonas'], $params['criterio'], null, 0, array(), array(),
            $idEntidad
        );
        return array("datos" => ($personas->data) ? $personas->data : array(), "cantidad" => $personas->quantity);
    }

    public function cargarDatosEjerMes()
    {
        $idEntidad = $this->idestructuracomun;

        $arrayEjercicios = $this->configuracionHelper->obtenerEjercicios(
            $idEntidad
        );

        $arrayPeriodos = $this->cargarMeses($this->idEjercicioActual);

        return array(
            "ejercicios" => $arrayEjercicios,
            "periodos" => $arrayPeriodos,
            "ejercicioactual" => $this->idEjercicioActual,
            "periodoactual" => $this->idPeriodoActual
        );
    }

    public function cargarMeses($idEjercicio)
    {
        return $this->configuracionHelper->obtenerPeriodos($idEjercicio);
    }

    public static function guardarDatos($idEntidad, $params = array())
    {
        $operarios = json_decode($params['operarios'], true);
        $operariosdetalle = json_decode($params['operariosdetalle']);
        $idperiodo = $params['idPeriodo'];
//        $flag = false;
//        $arrIdTrabajoOperarios = [];

        foreach ($operariosdetalle as $operariodetalle) {
            $obj = new stdClass();
            $obj->idtrabajooperariosdetallado = $operariodetalle->idtrabajooperariosdetallado;
            $obj->coeficiente = $operariodetalle->coeficiente;
            $obj->dimension = $operariodetalle->dimension;
            $obj->importecobrar = $operariodetalle->importeacobrar;
//            $arrIdTrabajoOperarios[] = $operariodetalle->idtrabajooperarios;

            DatTrabajoOperariosDetallado::saveTrabajoOperariosDetallado($obj);
        }

//        $arrIdTrabajoOperarios = array_values(array_unique($arrIdTrabajoOperarios));
//
//        $abc = DatTrabajoOperariosDetallado::getImporteTotalByIds($arrIdTrabajoOperarios);
//        $operarios = array_merge($operarios, $abc);

        foreach ($operarios as $operario) {
            $obj = new stdClass();
            if ($operario['idtrabajooperarios']) {
                $obj->idtrabajooperarios = $operario['idtrabajooperarios'];
            }
            $obj->idestructuracomun = $idEntidad;
            $obj->idresponsable = $operario['idresponsable'];
            $obj->idperiodo = $idperiodo;
            $obj->importecobrar = $operario['importeacobrar'];
            $obj->observacion = $operario['observacion'];
            $obj->aprobado = $operario['aprobado'];

            DatTrabajoOperarios::saveTrabajoOperarios($obj);
        }

        return true;
    }

    public function cargarAreasDelTaller($params = array())
    {

//        $params['start'] = ($params['start']) ? $params['start'] : 0;
//        $params['limit'] = ($params['limit']) ? $params['limit'] : 15;
        $params['start'] = null;
        $params['limit'] = null;
        $subd = $this->_serviciosEstructuraComp->obtenerSubordinaciones(
            "ATall", $params['limit'], $params['start']
        );
        $params['idnomsubordinacion'] = $subd[0]['idnomsubordinacion'];
        $depositos = $this->_serviciosEstructuraComp->buscarHijoPorSubordinacion(
            $this->global->Estructura->idestructura, array($params['idnomsubordinacion']), null
        );
        return $depositos;
    }

    public function agregarNuevoTrabajoOperarios($idOrdenTrabajo, $iddocumentofactura = '', $idactividadorden = '')
    {
        $estructuracomun = $this->global->Estructura->idestructura;
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($estructuracomun,
            LogisticaGlobal::SUBSISTEMA_FAC)->fecha;
        $idPeriodo = $this->configuracionHelper->getPeriodoActualSubsistema($estructuracomun,
            LogisticaGlobal::SUBSISTEMA_FAC);

        $conn = Zend_Registry::get('conexion');

        $casewhentipo = "
            case when ca.porcentual is not null then 1
            when ca.medida is not null then 2
            else 3 end as tipo
        ";
        $sqlIdOrdenAct = '';
        if ($idactividadorden) {
            $sqlIdOrdenAct = "and oa.idordenactividad = $idactividadorden";
        }

        $result = $conn->fetchAll("
        SELECT ca.minimo, ca.maximo, oap.coeficiente, oap.dimension, round(oa.pendiente * oa.precio, 2) as importebase
                , oap.importecobrar, doc.nrodoc, oa.idordentrabajo, oa.idactividad
                , oa.denominacion as actividad, ca.medida as um, coalesce(a.importematerial,0) as gastosbase
                , oap.idresponsable, $casewhentipo,
                count(oa.idactividad) over(PARTITION BY oa.idactividad) as cantporactividad,
                oa.pendiente
        FROM mod_logtaller.dat_ordenactividad oa
        inner join mod_logtaller.conf_actividad ca on(oa.idactividad = ca.idactividad)
        inner join mod_logtaller.dat_ordenactividadpersonas oap on(oa.idordenactividad = oap.idordenactividad)
        inner join mod_logistica.dat_documento doc on(doc.iddocumento = oa.idordentrabajo)
        left join (
            select idactividad, round(sum(coalesce((cantidadreal - enproceso - facturado) * precio,0)),2) as importematerial
            from mod_logtaller.dat_material
            where idordentrabajo = $idOrdenTrabajo
            group by idactividad
        ) a on(oa.idactividad = a.idactividad)
        where oa.idordentrabajo = $idOrdenTrabajo
          $sqlIdOrdenAct
          and round(oa.pendiente * oa.precio, 2) > 0
        ");

        $datTrabajoOperarios = Doctrine_Core::getTable('DatTrabajoOperarios');

        foreach ($result as $operariodetalle) {

            $objTrabajoOperarios = $datTrabajoOperarios->findByDql(
                'idestructuracomun = ? AND idperiodo = ? and idresponsable = ?',
                array($estructuracomun, $idPeriodo, $operariodetalle['idresponsable'])
            );

            if (count($objTrabajoOperarios->toArray())) {
                $operariodetalle['idtrabajooperarios'] = $objTrabajoOperarios[0]->idtrabajooperarios;
            } else {
                $obj = new stdClass();
                $obj->idestructuracomun = $estructuracomun;
                $obj->idresponsable = $operariodetalle['idresponsable'];
                $obj->idperiodo = $idPeriodo;
                $operariodetalle['idtrabajooperarios'] = DatTrabajoOperarios::saveTrabajoOperarios($obj);
            }

            $obj = new stdClass();
            $obj->idtrabajooperarios = $operariodetalle['idtrabajooperarios'];
            $obj->minimo = $operariodetalle['minimo'];
            $obj->maximo = $operariodetalle['maximo'];
            $obj->coeficiente = $operariodetalle['coeficiente'];
            $obj->dimension = $operariodetalle['dimension'];
            $obj->importebase = $operariodetalle['importebase'];
            $obj->gastosbase = $operariodetalle['gastosbase'];
            $obj->importecobrar = Self::calcularImporteSegunTipo($operariodetalle, $iddocumentofactura);
            $obj->nrodoc = $operariodetalle['nrodoc'];
            $obj->idordentrabajo = $operariodetalle['idordentrabajo'];
            $obj->idactividad = $operariodetalle['idactividad'];
            $obj->actividad = $operariodetalle['actividad'];
            $obj->um = $operariodetalle['um'];
            $obj->tipo = $operariodetalle['tipo'];
            $obj->fecha = $fecha;
            $obj->iddocfactura = $iddocumentofactura;

            DatTrabajoOperariosDetallado::saveTrabajoOperariosDetallado($obj);
        }

        return true;
    }

    public function actualizarEstadoTrabajoOperarios($idOrdenTrabajo, $iddocumentofactura = '', $idactividad = '')
    {
        $estructuracomun = $this->global->Estructura->idestructura;
        if ($idOrdenTrabajo) {
            $subsitema = LogisticaGlobal::SUBSISTEMA_TALLERES;
        } else {
            $subsitema = LogisticaGlobal::SUBSISTEMA_FAC;
        }
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($estructuracomun,
            $subsitema)->fecha;
        $idPeriodo = $this->configuracionHelper->getPeriodoActualSubsistema($estructuracomun,
            LogisticaGlobal::SUBSISTEMA_FAC);
        $conn = Zend_Registry::get('conexion');
        $sqlIdOrdenTra = '';
        $sqlIdDocFac = '';
        $sqlIdOrdenAct = '';
        if ($idOrdenTrabajo) {
            $sqlIdOrdenTra = "and idordentrabajo = $idOrdenTrabajo";
        }
        if ($iddocumentofactura) {
            $sqlIdDocFac = "and iddocfactura = $iddocumentofactura";
        }
        if ($idactividad) {
            $sqlIdOrdenAct = "and idactividad = $idactividad";
        }
        if ($idOrdenTrabajo || ($iddocumentofactura && $idactividad)) {
            $results = $conn->fetchAll("
            UPDATE mod_logtaller.dat_trabajooperariosdetallado
            SET estado = 1, fecha = '$fecha'
            WHERE estado != 1 
            $sqlIdOrdenTra
            $sqlIdDocFac
            $sqlIdOrdenAct
            RETURNING *
            ;
            ");

            if ($iddocumentofactura && $idactividad) {
                foreach ($results as $result) {
                    $objtp = DatTrabajoOperarios::getById($result['idtrabajooperarios']);
                    $trabOper = DatTrabajoOperarios::getByIdperiodoAndIdresponsable($estructuracomun, $idPeriodo, $objtp['idresponsable']);
                    if (count($trabOper)) {
                        $idtraboper = $trabOper[0]['idtrabajooperarios'];
                    } else {
                        $obj = new stdClass();
                        $obj->idperiodo = $idPeriodo;
                        $obj->idestructuracomun = $estructuracomun;
                        $obj->idresponsable = $objtp['idresponsable'];
                        $idtraboper = DatTrabajoOperarios::saveTrabajoOperarios($obj);
                    }

                    if ($idtraboper != $result['idtrabajooperarios']) {
                        $conn->fetchAll("
                            UPDATE mod_logtaller.dat_trabajooperariosdetallado
                            SET idtrabajooperarios = $idtraboper
                            WHERE idtrabajooperariosdetallado = {$result['idtrabajooperariosdetallado']}
                            $sqlIdDocFac
                            $sqlIdOrdenAct
                            ;
                        ");
                    }
                }
            }


        }
    }

    public function cargarBonPen($params)
    {
//        $global = ZendExt_GlobalConcept::getInstance();
//        $idusuario = $global->Perfil->idusuario;
//        $this->_serviciosSeguridad->getNombreUsuario($idusuario);
        $result = DatBonPen::cargarBonPen($params);

        foreach ($result as &$res) {
            if ($res['iduser']) {
                $res['user'] = $this->_serviciosSeguridad->getNombreUsuario($res['iduser']);
            }
            if ($res['idusercancel']) {
                $res['usercancel'] = $this->_serviciosSeguridad->getNombreUsuario($res['idusercancel']);
            }
        }

        return ['datos' => $result, 'cantidad' => count($result) > 0 ? $result[0]['cantidad'] : 0];
    }

    public function addBonPen($params)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idusuario = $global->Perfil->idusuario;
        $params = json_decode($params['data'], true);
        $idtrabajooperarios = $params['idtrabajooperarios'];
        if (!$params['importebase']) {
            $params['importebase'] = 0;
        }

        if (DatBonPen::hayBonActiva($params['idtrabajooperarios'])) {
            return ['success' => false, 'cod' => -1];
        }

        $importeacobrar = $this->calcularImporteFinalBonPen(
            $params['idbonpen'],
            $params['idtipobonpen'],
            $params['importebase'],
            $params['bonpen']
        );

        $objt = new stdClass();
        if ($idtrabajooperarios) {
            $objt->idtrabajooperarios = $idtrabajooperarios;
        } else {
            $objt->idestructuracomun = $this->global->Estructura->idestructura;
            $objt->idresponsable = $params['idresponsable'];
            $objt->idperiodo = $params['idperiodo'];
        }
        $objt->importecobrar = $importeacobrar;
        $objt->observacion = $params['observacion'];
        $idtrabajooperarios = DatTrabajoOperarios::saveTrabajoOperarios($objt);

        $obj = new stdClass();
        $obj->idtrabajooperarios = $idtrabajooperarios;
        $obj->idtipobonpen = $params['idtipobonpen'];
        $obj->idbonpen = $params['idbonpen'];
        $obj->bonpen = $params['bonpen'];
        $obj->importebase = $params['importebase'];
        $obj->observacion = $params['observacion'];
        $obj->iduser = $idusuario;
        $abc = DatBonPen::saveBonPen($obj);

        return ['idadd' => $abc, 'idtrabajooperarios' => $idtrabajooperarios, 'success' => true];
    }

    public function cancelarBonPen($params)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idusuario = $global->Perfil->idusuario;
        $params = json_decode($params['data'], true);

        $datoBonPen = DatBonPen::getById($params['idbonificacionpenalizacion']);

        if ($params['idtrabajooperarios'] && $datoBonPen['idestado'] == 1) {
            $objt = new stdClass();
            $objt->idtrabajooperarios = $params['idtrabajooperarios'];
            $objt->importecobrar = null;
            $objt->observacion = '';
            $idtrabajooperarios = DatTrabajoOperarios::saveTrabajoOperarios($objt);

            $obj = new stdClass();
            $obj->idbonificacionpenalizacion = $params['idbonificacionpenalizacion'];
            $obj->observacioncancel = $params['observacion'];
            $obj->idestado = 0;
            $obj->idusercancel = $idusuario;
            $abc = DatBonPen::saveBonPen($obj);
            return ['idcan' => $abc, 'success' => true];
        }
        return ['success' => false, 'cod' => -1];
    }

    public function hayBonActiva($params)
    {
        return ['haybonactiva' => DatBonPen::hayBonActiva($params['idtrabajooperarios'])];
    }

    public function calcularImporteFinalBonPen(
        $idbonpen,
        $tipobonpen,
        $importebase,
        $bonpen
    )
    {
        $importe = 0;
        if ($idbonpen == 0) {
            $bonpen = $bonpen*1;
        } elseif ($idbonpen == 1) {
            $bonpen = $bonpen*-1;
        }

        if ($tipobonpen == 0) {
            $importe = $importebase + ($importebase * ($bonpen/100));
        } elseif ($tipobonpen == 1) {
            $importe = $importebase + $bonpen;
        } elseif ($tipobonpen == 2) {
            $importe = $bonpen;
        }
        return round($importe, 2);
    }

    public function aprobarSalario($params, $aprobarDesaprobar = 1)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idusuario = $global->Perfil->idusuario;
        $nombreUser = $this->_serviciosSeguridad->getNombreUsuario($idusuario);
        $idstrabajooperarios = json_decode($params['idstrabajooperarios']);

        foreach ($idstrabajooperarios as $idtrabajooperario) {
            $objt = new stdClass();
            $objt->idtrabajooperarios = $idtrabajooperario;
            if ($aprobarDesaprobar === 1) {
                $objt->aprobado = $nombreUser;
            } else {
                $objt->aprobado = '';
            }
            $idtrabajooperario = DatTrabajoOperarios::saveTrabajoOperarios($objt);

            $obj = new stdClass();
            $obj->idtrabajooperarios = $idtrabajooperario;
            $obj->idusuario = $idusuario;
            $obj->operacion = $aprobarDesaprobar;//1-aprobar, 2-desaprobar
            DatTrabajoOperariosAprobado::saveTrabajoOperariosAprobado($obj);
        }
        return ['success' => true];
    }

    public function desAprobarSalario($params)
    {
        return $this->aprobarSalario($params, 2);
    }

    public function getTrabajoOperariosIndicadores()
    {
        
        $connection = Doctrine_Manager::connection();
        $nombreVar = 'vg_operariosvarios';
        $query ="select ng.valor from mod_logistica.nom_variableglobal ng 
                    where ng.nombre = '{$nombreVar}' and ng.activo  = 1";
        $data = $connection->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if(count($data) > 0 && $data[0]['valor'] == 1) {
            return [
                [
                    'idindicador' => 'montobase',
                    'denominacion' => 'Monto base'
                ],
                [
                    'idindicador' => 'montoacobrar',
                    'denominacion' => 'Monto a cobrar'
                ],
                [
                    'idindicador' => 'bonpenporcentual',
                    'denominacion' => 'Bonificacion/Penalizacion porcentual'
                ],
                [
                    'idindicador' => 'bonpenagregar',
                    'denominacion' => 'Bonificacion/Penalizacion agregada'
                ],
                [
                    'idindicador' => 'bonpenfijo',
                    'denominacion' => 'Bonificacion/Penalizacion fija'
                ]
            ];
        } else {
            return [
                [
                    'idindicador' => 'montoacobrar',
                    'denominacion' => 'Monto a cobrar'
                ]
            ];
        }
    }

    public function getTrabajoOperariosDenomByIdIndicador($idIndicador)
    {
        $indicadores = self::getTrabajoOperariosIndicadores();
        foreach ($indicadores as $ind) {
            if ($ind['idindicador'] === $idIndicador) {
                return $ind['denominacion'];
            }
        }
        return null;
    }

    public function getTrabajoOperariosSalarios($idestructura, $fechainicio, $fechafin)
    {
        $connection = Doctrine_Manager::connection();
        $nombreVar = 'vg_operariosvarios';
        $query ="select ng.valor from mod_logistica.nom_variableglobal ng 
                    where ng.nombre = '{$nombreVar}' and ng.activo  = 1";
        $data = $connection->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        if(count($data) > 0 && $data[0]['valor'] == 1) {
            $parametros = [
                'soloTPConValor' => true,
                'idPeriodo' => 'null',
                'fechaInicio' => $fechainicio,
                'fechaFin' => $fechafin
            ];
            
            $result = $this->personasTrabajoMesActual($idestructura, $parametros);
        } else {
            $query ="
                SELECT idpersona as idresponsable, sum(coalesce(importecup, 0)) as importeacobrar
                from mod_logtaller.f_trabajoxtecnico(
                    '{$fechainicio}', 
                    '{$fechafin}', 
                    null, 
                    null, 
                    null, 
                    $idestructura, 
                    null, 
                    '{4}'
                )
                where idpersona is not null
                group by idpersona, tecnico
                order by tecnico
            ";
            $result = $connection->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        }
        

        $indicadores = self::getTrabajoOperariosIndicadores();
        $devolver = [];
        foreach ($result as $res) {
            $valor = [
                'idpersona' => $res['idresponsable']
            ];
            $posNeg = 1;
            if ($res['idbonpen'] == 1) {
                $posNeg = -1;
            }
            foreach ($indicadores as $ind) {
                if ($ind['idindicador'] === 'montobase') {
                    $valor[$ind['idindicador']] = $res['importebase'];
                } else if ($ind['idindicador'] === 'montoacobrar') {
                    $valor[$ind['idindicador']] = $res['importeacobrar'];
                } else if ($ind['idindicador'] === 'bonpenporcentual' && $res['idtipobonpen'] == 0) {
                    $valor[$ind['idindicador']] = $res['bonpen'] * $posNeg;
                } else if ($ind['idindicador'] === 'bonpenagregar' && $res['idtipobonpen'] == 1) {
                    $valor[$ind['idindicador']] = $res['bonpen'] * $posNeg;
                } else if ($ind['idindicador'] === 'bonpenfijo' && $res['idtipobonpen'] == 2) {
                    $valor[$ind['idindicador']] = $res['bonpen'];
                } else {
                    $valor[$ind['idindicador']] = 0;
                }
            }
            $devolver[] = $valor;
        }
        return $devolver;
    }

    public static function calcularImporteSegunTipo($operariodetalle, $iddocumentofactura)
    {
        if ($operariodetalle['tipo'] == 1) {
            return self::calcularImporteActividadPorcentual(
                $operariodetalle['importebase'],
                $operariodetalle['gastosbase'],
                $operariodetalle['coeficiente'],
                $iddocumentofactura ? true : false
            );
        } elseif ($operariodetalle['tipo'] == 2) {
            return self::calcularImporteActividadUM(
                $operariodetalle['gastosbase'],
                $operariodetalle['coeficiente'],
                $operariodetalle['dimension'],
                $iddocumentofactura ? true : false
            );
        } else {
            return self::calcularImporteActividadFija(
                $operariodetalle['gastosbase'],
                $operariodetalle['pendiente'],
                $operariodetalle['cantporactividad'],
                $operariodetalle['maximo'],
                $iddocumentofactura ? true : false
            );
        }
    }

    public static function calcularImporteActividadPorcentual($importeBase, $gastoMateriales, $coeficiente, $ordenExterna)
    {
        $importe = 0;
        if ($coeficiente) {
            if ($gastoMateriales && $ordenExterna) {
                $importe = ($importeBase - $gastoMateriales)*($coeficiente/100);
            } else {
                $importe = $importeBase*($coeficiente/100);
            }
        }
        return round($importe, 2);
    }

    public static function calcularImporteActividadUM($gastoMateriales, $coeficiente, $dimension, $ordenExterna)
    {
        $importe = 0;
        if ($coeficiente && $dimension) {
            if ($gastoMateriales && $ordenExterna) {
                $importe = ($dimension*$coeficiente) - $gastoMateriales;
            } else {
                $importe = $dimension*$coeficiente;
            }
        }
        return round($importe, 2);
    }

    public static function calcularImporteActividadFija($gastoMateriales, $porcientoCompletado, $cantPerActividad, $maximo, $ordenExterna)
    {
        $importe = 0;
        if ($porcientoCompletado) {
            if ($gastoMateriales && $ordenExterna) {
                $importe = ($maximo - $gastoMateriales) * $porcientoCompletado/$cantPerActividad;
            } else {
                $importe = $maximo * $porcientoCompletado/$cantPerActividad;
            }
        }
        return round($importe, 2);
    }

}
