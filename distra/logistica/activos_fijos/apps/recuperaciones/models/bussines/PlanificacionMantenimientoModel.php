<?php

/**
 * Daniel Arias Espinosa
 * 07/12/15
 */
class PlanificacionMantenimientoModel extends ZendExt_Model
{

    private $_serviciosPlanificacion, $_serviciosEstructuraComposicion, $_doctrineHelper, $_mComunAFT, $_ordenTrabajoServices, $_aperturadoTalleres, $_mRegNumActivo, $_mTipoMedio;

    public function __construct()
    {

        parent::__construct();

        $this->_mRegNumActivo = new RegNumericoActivoModel();
        $this->_mTipoMedio = new ConfiguraciontipomedioModel();
        $this->_mTipoMedio->loadPluginsFromFile('listapluginsconf')->buildRelations();
        $this->_mRegNumActivo->loadPluginsFromFile('listaplugins')->buildRelations();
        //        $relations[] = array(
        //            'cardinalidad' => 'many', 'relation' => 'DatProducto',
        //            'properties'   => array('local' => 'iddocumento', 'foreign' => 'idplansolicitud'
        //            )
        //        );
        //        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);

        $this->_aperturadoTalleres =
            LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES);
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->_serviciosEstructuraComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->_doctrineHelper = LogisticaDoctrineHelper::__init();
        $relationsInd[] = array(
            'cardinalidad' => 'many', 'relation' => 'CfgPlanificacionMantenimiento',
            'properties'   => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $relationsInd[] = array(
            'cardinalidad' => 'many', 'relation' => 'CfgMedioSistemaMedio',
            'properties'   => array('local' => 'idpadre', 'foreign' => 'idindicador')
        );
        $this->_doctrineHelper->tryInyectRelactions(new NomIndicador, $relationsInd);
        $this->_mComunAFT = ComunAFTModel::getInstance();
        if ($this->_aperturadoTalleres) {
            $this->_ordenTrabajoServices = new OrdenTrabajoTalleresService();
        }
    }

    public function cargarActvidadesPlanificadas($parametros = array())
    {
        $parametros['idplanificacionmantenimiento'] = Zend_Json::decode($parametros['idplanificacionmantenimiento']);
        $query = Doctrine_Query::create();
        $query->select(
            'ap.idactividadplanificacion, ap.idconfactividadsistemamedio, sis.denominacion as sistema,' .
            ' asm.idactividad as idactividad, ap.idplanificacionmantenimiento '
        )->from('CfgActividadPlanificacion ap')->innerJoin('ap.CfgActividadSistemaMedio asm')->innerJoin(
            'asm.NomSistemaMedio sis'
        );

        if ($parametros['idplanificacionmantenimiento']) {
            if (!is_array($parametros['idplanificacionmantenimiento'])) {
                $parametros['idplanificacionmantenimiento'] = array($parametros['idplanificacionmantenimiento']);
            }
        } else {
            $parametros['idplanificacionmantenimiento'] = array(1);
        }
        $query->whereIn('ap.idplanificacionmantenimiento ', $parametros['idplanificacionmantenimiento']);
        $actividades = $query->fetchArray();
        foreach ($actividades as $index => $act) {
            $result =
                $this->_serviciosPlanificacion->obtenerActividadyNorma(4, $act['idactividad'], null, null, null, 0);
            $actividades[$index]['denominacion'] = $result['datos'][0]['denominacion'];
        }
        return array('cantidad' => $query->count(), 'datos' => $actividades);
    }

    public function cargarActividadesDelMedioSistema($parametros = array())
    {
        $parametros['idplanificacionmantenimiento'] = Zend_Json::decode($parametros['idplanificacionmantenimiento']);
        $parametros['idplanificacionmantenimiento'] =
            ($parametros['idplanificacionmantenimiento']) ? $parametros['idplanificacionmantenimiento'] : array(1);
        $query = Doctrine_Query::create();
        $datos = $query->select('asm.idconfactividadsistemamedio, asm.idactividad, sis.denominacion as sistema,')->from(
            'CfgActividadSistemaMedio asm'
        )->innerJoin('asm.NomSistemaMedio sis')->innerJoin('asm.CfgActividadPlanificacion ap')->whereIn(
            'ap.idplanificacionmantenimiento', $parametros['idplanificacionmantenimiento']
        )->orderBy('sis.denominacion')->groupBy(
            'asm.idconfactividadsistemamedio, asm.idactividad, sis.denominacion'
        );

        foreach ($parametros['idplanificacionmantenimiento'] as $pos => $idPlan) {
            $class = 'pm_' . $pos;
            $classA = 'app_' . $pos;
            $datos->addSelect(
                "(SELECT count($class.idplanificacionmantenimiento)
                FROM CfgPlanificacionMantenimiento {$class}
                INNER JOIN $class.CfgActividadPlanificacion {$classA}
                where {$class}.idplanificacionmantenimiento = {$idPlan}
                AND {$classA}.idconfactividadsistemamedio = asm.idconfactividadsistemamedio) as {$idPlan}"
            );
            //Comentariado para usar el otro de abajo.
            if(!$parametros['cumplimientomanual']) {
                if ($this->_aperturadoTalleres) {
                    if ($parametros['idregnumerico']) {
                        $aliasA = 'act_' . $pos;
                        $aliasOT = 'ord_' . $pos;
                        $aliasMed = 'med_' . $pos;
                        $aliasD = 'd_' . $pos;
                        $estado = EstadoDocumentoModel::ESTADO_CERRADO;
                        $campo = $idPlan . 'mantenimiento';
                        $datos->addSelect(
                            "(SELECT count($aliasA.idactividad)
                         FROM DatActividadOrden {$aliasA}
                         INNER JOIN $aliasA.DatOrdenTrabajo {$aliasOT}
                         INNER JOIN $aliasOT.DatMedio {$aliasMed}
                         INNER JOIN $aliasOT.DatDocumento $aliasD
                         WHERE $aliasD.estado = {$estado}
                         AND $aliasMed.idproducto ={$parametros['idregnumerico']}
                         AND {$aliasA}.idactividad = asm.idactividad
                         AND $aliasOT.idplanificacionmantenimiento = {$idPlan} ) as {$campo}"
                        );
                    }
                }
            } else {
                ///para cuando se aprueba directo por aft (en desarrollo)
                if ($parametros['idregnumerico']) {
                    $aliasRM = 'rm_' . $pos;
                    $campo = $idPlan . 'mantenimiento';
                    $datos->addSelect(
                        "(SELECT count($aliasRM.idregistropendiente)
                         FROM DatRegMantenimiento {$aliasRM}
                         WHERE $aliasRM.estado = 2
                         AND $aliasRM.idregnumerico ={$parametros['idregnumerico']}
                         AND $aliasRM.idplanificacionmantenimiento = {$idPlan} ) as {$campo}"
                    );
                }

            }
        }
        $actividades = $datos->fetchArray();
        foreach ($actividades as $index => $act) {
            $result =
                $this->_serviciosPlanificacion->obtenerActividadyNorma(4, $act['idactividad'], null, null, null, 0);
            $actividades[$index]['denominacion'] = $result['datos'][0]['denominacion'];
        }
        return array('datos' => $actividades, 'cantidad' => $datos->count());
    }

    public function cargarRegNumMantenimiento($parametros, $aft)
    {
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        unset($parametros['start']);
        $limit = ($parametros['$limit']) ? $parametros['$limit'] : 30;
        unset($parametros['$limit']);
        if ($this->_aperturadoTalleres) {
            $excluirIdReg = $this->_ordenTrabajoServices->getIdRegNumEnOrdenAbierta($parametros);
            if ($excluirIdReg) {
                $parametros['idsRegNumNoMostrar'] = $excluirIdReg['excluirregnum'];
            }
        }
        $idEntidad = $this->global->Estructura->idestructura;
        $dql = Doctrine_Query::create();
        new DatRegMantenimiento();
        $dql->select(
            'rm.idregistropendiente, rm.idplanificacionmantenimiento, rm.idregnumerico, rm.estado,
            cpm.recursoconsumido as recursoconsumido, cpm.periodo as periodo'
        )->from('DatRegMantenimiento rm')->innerJoin('rm.DatRegnumerico rn')->innerJoin('rn.DatProductoLogistica p')
            ->where('p.idestructuracomun = ?', array($idEntidad))->innerJoin('rm.CfgPlanificacionMantenimiento cpm')
            ->andWhere('rm.estado <> 2')->limit($limit)->offset($start);
        if ($parametros['idsRegNumNoMostrar']) {
            $dql->andWhereNotIn('rm.idregnumerico ', $parametros['idsRegNumNoMostrar']);
        }
        $planificaciones = $dql->fetchArray();
        $arraRegNum = array();
        foreach ($planificaciones as $plan) {
            $parametros['idregnumerico'] = $plan['idregnumerico'];
            $query = new Doctrine_Query();
            if ($aft) {
                $query = $this->_mRegNumActivo->getCargarSerieDisponible($parametros, true);
            } else {
                $query = $this->_mRegNumActivo->getMediosDisponibles($parametros, true);
            }
            $this->sConfActivos = new ConfiguracionActivosService();
            $confEntidad = $this->sConfActivos->getConfiguracionPG($idEntidad);
            $this->entidadDeprecia = $confEntidad[0]['depreciacion'];
            $query = self::getEntidadDpre($confEntidad, $query);
            $regNum = $query->fetchArray();
            $reg = $regNum[0];
            $reg['planfmantenim'] = $plan['periodo'] . ' / ' . $plan['recursoconsumido'];
            $reg['idplanificacionmantenimiento'] = $plan['idplanificacionmantenimiento'];
            $reg['estadoplanificacion'] = $plan['estado'];
            $arraRegNum[] = $reg;
        }
        return array('datos' => $arraRegNum, 'cantidad' => $dql->count());
    }
    // public function cargarRegNumMantenimiento($parametros, $aft)
    //    {
    //        $start = ($parametros['start']) ? $parametros['start'] : 0;
    //        unset($parametros['start']);
    //        $limit = $parametros['$limit'];
    //        unset($parametros['$limit']);
    //        $dql = Doctrine_Query::create();
    //        $dql->select('pm.idplanificacionmantenimiento, pm.periodo, pm.recursoconsumido, pm.idindicador')
    //            ->from('CfgPlanificacionMantenimiento pm')
    //            ->innerJoin('pm.NomIndicador ind')
    //            ->groupBy('pm.idplanificacionmantenimiento, pm.idindicador, pm.periodo, pm.recursoconsumido');
    //        $planificaciones = $dql->fetchArray();
    //
    //        // Devolver los Rn Disponibles con el recurso consumido y con el tiempo de explotacion
    //
    //        $idEntidad = $this->global->Estructura->idestructura;
    //
    //        $arrIdesAreas = $this->_mComunAFT->getIdEstructurasHijas($idEntidad, false, true);
    //        $arraRegNum = array();
    //        foreach ($planificaciones as $plan) {
    //            $parametros['idindicador'] = $plan['idindicador'];
    //            if (count($arrIdesAreas) > 0) {
    //                //$estructurastring = " (" . implode(',', $arrIdesAreas) . ")";
    //                $query = new Doctrine_Query();
    //                if($aft){
    //                     $query = $this->_mRegNumActivo->getCargarSerieDisponible($parametros, true);
    //                }else{
    //                    $query = $this->_mRegNumActivo->getMediosDisponibles($parametros, true);
    //                }
    //                $query->andWhereIn("drna.idarearesp ", $arrIdesAreas);
    //                if ($this->_aperturadoTalleres) {
    //                    $parametros = $this->_ordenTrabajoServices->getIdRegNumEnOrdenAbierta($parametros);
    //                    if ($parametros['excluirregnum']) {
    //                        $query->andWhereNotIn("rn.idregnumerico ", $parametros['excluirregnum']);
    //                    }
    //                }
    //                $this->sConfActivos = new ConfiguracionActivosService();
    //                $confEntidad = $this->sConfActivos->getConfiguracionPG($idEntidad);
    //                $this->entidadDeprecia = $confEntidad[0]['depreciacion'];
    //                $query = self::getEntidadDpre($confEntidad, $query);
    //                $regNum = $query->fetchArray();
    //				//print_r($regNum);die;
    //                foreach ($regNum as $reg) {
    //                    $reg['tiempoexplotacion'] = explode(" ", $reg['tiempoexplotacion'])[0];
    //                    $para = array('idplanificacionmantenimiento' => $plan['idplanificacionmantenimiento'],
    //                        'idregnumerico' => $reg['idregnumerico']);
    //                    if (($reg['cantidadrecursoconsumido'] > $plan['recursoconsumido']/* ||
    //                        $reg['tiempoexplotacion'] > $plan['periodo']*/)) {
    //                        if ($this->_aperturadoTalleres) {
    //                            if ($this->_ordenTrabajoServices->existePlanfMantenimiento($para) == 0) {
    //                                $reg['planfmantenim'] = $plan['periodo'] . ' / ' . $plan['recursoconsumido'];
    //                                $reg['idplanificacionmantenimiento'] = $plan['idplanificacionmantenimiento'];
    //                                $arraRegNum[] = $reg;
    //                            }
    //                        } else {
    //                            $reg['planfmantenim'] = $plan['periodo'] . ' / ' . $plan['recursoconsumido'];
    //                            $reg['idplanificacionmantenimiento'] = $plan['idplanificacionmantenimiento'];
    //                            $arraRegNum[] = $reg;
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        $part = (count($arraRegNum) > $limit ) ? array_slice($arraRegNum, $start, $limit) : $arraRegNum;
    //        return array('datos' => $part, 'cantidad' => count($arraRegNum));
    //    }

    public function getEntidadDpre($confEntidad, $query)
    {
        if ($this->entidadDeprecia) {
            if ($confEntidad[0]['explotacionadquisicion']) {
                $query->addSelect("(now()::date - drna.fechaexpini) AS tiempoexplotacion");
            } else {
                $query->addSelect("(now()::date - drna.fechaadq) as tiempoexplotacion");
            }
        } else {
            $query->addSelect("(now()::date - drna.fechaadq) as tiempoexplotacion");
        }
        return $query;
    }

    /**
     * @descripcion Realizar el cumplimiento del mantenimiento cuando no esta vinculado a Talleres.
     *
     * @param $params
     */
    public function realizarMantenimiento($params)
    {
        $existe = Doctrine_Query::create()->select('rm.idregistropendiente')->from('DatRegMantenimiento rm')->where(
            'rm.idplanificacionmantenimiento = ? and  rm.idregnumerico = ?',
            array($params['idplanificacionmantenimiento'], $params['idregnumerico'])
        )->limit(1)->fetchArray();
        $mantenim = new DatRegMantenimiento();
        if (count($existe) > 0) {
            $mantenim->assignIdentifier($existe[0]['idregistropendiente']);
            $mantenim->synchronizeWithArray($params);
            $mantenim->save();
            return array('success' => true, 'msg' => '');
        } else {
            return array('success' => false, 'msg' => 'No pendiente');
        }
    }

    /**
     * @descripcion deshacer el cumplimiento del mantenimiento cuando no esta vinculado a Talleres.
     *
     * @param $params
     */
    public function deshacerMantenimiento($params)
    {
        $existe = Doctrine_Query::create()->select('rm.idregistropendiente')->from('DatRegMantenimiento rm')->where(
            'rm.idplanificacionmantenimiento = ? and  rm.idregnumerico = ?',
            array($params['idplanificacionmantenimiento'], $params['idregnumerico'])
        )->limit(1)->fetchArray();
        $mantenim = new DatRegMantenimiento();
        if (count($existe) > 0) {
            $mantenim->assignIdentifier($existe[0]['idregistropendiente']);
            $planif = Doctrine_Query::create()->select('pm.periodo, pm.recursoconsumido')->from(
                'CfgPlanificacionMantenimiento pm'
            )->where('rm.idplanificacionmantenimiento = ? ', array($params['idplanificacionmantenimiento']))->limit(1)
             ->fetchArray();
            $regNum = Doctrine_Query::create()->select('rna.cantidadrecursoconsumido, rna.tiempoexplotacion')
                ->from('DatRegnumericoActivo rna' )->where('rna.idregnumerico = ?', array($params['idregnumerico']))
                ->limit(1)->fetchArray();
            if ($planif[0]['recursoconsumido'] <= $regNum[0]['cantidadrecursoconsumido']) {
                $mantenim->estado = 1;
            } else {
                if ($planif[0]['recursoconsumido'] - 100 <= $regNum[0]['cantidadrecursoconsumido']) {
                    $mantenim->estado = 0;
                }
            }
            $mantenim->fecha = null;
            $mantenim->nrofactura = null;
            $mantenim->costo = null;
            $mantenim->save();
            return array('success' => true, 'msg' => '');
        } else {
            return array('success' => false, 'msg' => 'No pendiente');
        }
    }
}
