<?php

class DatPlanificacionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatPlanificacion $DatPlanificacion)
    {

        $DatPlanificacion->save();
        $this->conn->commit();

    }

    //no borrar
    public function InsertarParaModelo(DatPlanificacion $DatPlanificacion)
    {
        $DatPlanificacion->save();


    }

    public function Actualizar(DatPlanificacion $DatPlanificacion)
    {
        $DatPlanificacion->save();
    }

    public function Eliminar($DatPlanificacion)
    {
        $DatPlanificacion->delete();
    }

    public function aprobarDesaprobar($idplanificacion, $aprobado)
    {

        $planif = Doctrine::getTable('DatPlanificacion')->find(
            $idplanificacion
        );
        if ($aprobado > 0 && $aprobado <= 4) {

            $planif->idaprobaciondemanda = $aprobado;
            $planif->save();
        }

    }

    public function listarPlanif()
    {
        $datos = DatPlanificacion::AquienDemando1(
            $identidadmodelo, $idcentrobalance, $start, $limit
        );
        return $datos;
    }

    public function listarPlanif1($identiL, $start, $limit)
    {
        $datos = DatPlanificacion::AquienDemando2($identiL, $start, $limit);
        return $datos;
    }

    public function listarPlanif2($idOD)
    {
        $datos = DatPlanificacion::AquienDemando3($idOD, $start, $limit);
        return $datos;
    }

    public function asociarPlanificacionNaeOG($idplanificaion, $idnaes,
        $idobjetogasto, $ejercicio
    )
    {
        $idplanificacionnaegeneral = self::buscarObjetoGasto($idobjetogasto);

        if (empty($idplanificacionnaegeneral)) {
            $naegeneral = new DatPlanificacionnaegeneral();
            $idplanificacionnaegeneral
                = DatPlanificacionnaegeneralModel::insertardatPlanificacionnaegeneral(
                    $naegeneral
                );
            $plannaeobjetogasto = new DatPlanificacionnaeobjetogasto();
            $plannaeobjetogasto->idplanificacionnaegeneral
                = $idplanificacionnaegeneral;
            $plannaeobjetogasto->idobjetogasto = $idobjetogasto;
            DatPlanificacionnaeobjetogastoModel::insertardatPlanificacionnaeobjetogasto(
                $plannaeobjetogasto
            );
        }

        foreach ($idnaes as $idnae) {
            $asociacion = self::obtenerAsociacionOG(
                $idplanificaion, $idnae, $idobjetogasto, $ejercicio
            );
            if (empty($asociacion)) {
                self::elminarAsociacion($idnae, $idplanificaion, $ejercicio);
                $plannae = new DatPlanificacionnae();
                $plannae->idplanificacion = $idplanificaion;
                $plannae->idnae = $idnae;
                $plannae->idejercicio = $ejercicio;
                $plannae->idplanificacionnaegeneral
                    = $idplanificacionnaegeneral;
                DatPlanificacionnaeModel::insertardatPlanificacionnae(
                    $plannae
                );
            }
        }
        return $idplanificacionnaegeneral;
    }

    public function asociarPlanificacionNaeRF($idplanificaion, $idnaes,
        $idingreso, $ejercicio
    )
    {
        $idplanificacionnaegeneral = self::buscarIngreso($idingreso);
        if (empty($idplanificacionnaegeneral)) {
            $naegeneral = new DatPlanificacionnaegeneral();
            $idplanificacionnaegeneral
                = DatPlanificacionnaegeneralModel::insertardatPlanificacionnaegeneral(
                    $naegeneral
                );
            $plannaeingreso = new DatPlanificacionnaeingreso();
            $plannaeingreso->idplanificacionnaegeneral
                = $idplanificacionnaegeneral;
            $plannaeingreso->idingreso = $idingreso;
            DatPlanificacionnaeingresoModel::insertardatPlanificacionnaeingreso(
                $plannaeingreso
            );
        }

        foreach ($idnaes as $idnae) {
            $asociacion = self::obtenerAsociacionRF(
                $idplanificaion, $idnae, $idingreso, $ejercicio
            );
            if (empty($asociacion)) {
                self::elminarAsociacion($idnae, $idplanificaion, $ejercicio);
                $plannae = new DatPlanificacionnae();
                $plannae->idplanificacion = $idplanificaion;
                $plannae->idnae = $idnae;
                $plannae->idejercicio = $ejercicio;
                $plannae->idplanificacionnaegeneral
                    = $idplanificacionnaegeneral;
                DatPlanificacionnaeModel::insertardatPlanificacionnae(
                    $plannae
                );
            }
        }
        return $idplanificacionnaegeneral;
    }

    public function elminarAsociacion($idnae, $idplanificacion, $idejercicio)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatPlanificacionnae planifnae')
            ->where(
                'planifnae.idplanificacion = ? and planifnae.idnae = ? and planifnae.idejercicio = ?',
                array($idplanificacion, $idnae, $idejercicio)
            )
            ->execute();
    }

    public function elminarAsociaciones($idplanificaciones)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatPlanificacionnae planifnae')
            ->whereIn('planifnae.idplanificacion', $idplanificaciones)
            ->execute();
    }

    public function obtenerAsociacionRF($idplanificacion, $idnae, $idingreso,
        $idejercicio
    )
    {
        $query = Doctrine_Query::create();
        $query->from('DatPlanificacionnae planifnae')
            ->innerJoin('planifnae.DatPlanificacionnaegeneral naegeneral')
            ->innerJoin('naegeneral.DatPlanificacionnaeingreso ingreso')
            ->where(
                'planifnae.idnae = ? and planifnae.idplanificacion = ? and ingreso.idingreso = ?
                and planifnae.idejercicio = ?',
                array($idplanificacion, $idnae, $idingreso, $idejercicio)
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }

    public function obtenerAsociacionOG($idplanificacion, $idnae,
        $idobjetogasto, $idejercicio
    )
    {
        $query = Doctrine_Query::create();
        $query->from('DatPlanificacionnae planifnae')
            ->innerJoin('planifnae.DatPlanificacionnaegeneral naegeneral')
            ->innerJoin('naegeneral.DatPlanificacionnaeobjetogasto objetogasto')
            ->where(
                'planifnae.idnae = ? and planifnae.idplanificacion = ? and objetogasto.idobjetogasto = ?
                and planifnae.idejercicio = ? ',
                array($idplanificacion, $idnae, $idobjetogasto, $idejercicio)
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }

    public function buscarIngreso($idingreso)
    {
        $ingreso = Doctrine::getTable('DatPlanificacionnaeingreso')->findByDql(
            "idingreso = $idingreso", null, Doctrine::HYDRATE_ARRAY
        );
        return $ingreso[0]['idplanificacionnaegeneral'];
    }

    public function buscarObjetoGasto($idobjetogasto)
    {
        $objetogasto = Doctrine::getTable('DatPlanificacionnaeobjetogasto')
            ->findByDql(
                "idobjetogasto = $idobjetogasto", null, Doctrine::HYDRATE_ARRAY
            );
        return $objetogasto[0]['idplanificacionnaegeneral'];
    }

    public function eliminarAsociacionPlanificacionNae()
    {

    }

    public function validardadoIdIndicador($idindicador)
    {
        return DatPlanificacion::validardadoIdIndicador($idindicador);
    }

    public function listarActividades($params)
    {
        return DatPlanificacion::listarActividades($params);
    }

    public function listarPlanes($params)
    {
        return DatPlanificacion::listarPlanes($params);
    }

    public function idEspecialidadNivelUno($idespecialidad)
    {
        $datosespecialidad
            = $this->integrator->datosmaestros->obtenerEspecialidadPorId(
                $idespecialidad
            );
        if ($datosespecialidad[0]->nivel == 1) {
            return $datosespecialidad[0]->idespecialidad;
        } else {

            return self::idEspecialidadNivelUno($datosespecialidad[0]->idpadre);
        }
    }

    public function listarIndXCBEntidad($params)
    {
        $datos = DatPlanificacion::indXCBEntidad($params);
        $arrayIdent = array();
        foreach ($datos->data as $key => $value) {
            $arrayIdent[] = $value['identidad'];
        }
        $datosArray;
        if ($arrayIdent[0] != null) {
            $datosEntidad
                = $this->integrator->metadatos->ObtenerDatosEstructurasPorArrayId(
                    $arrayIdent
                );
            foreach ($datosEntidad as $key => $datosEnt) {
                $idespecialidad = self::idEspecialidadNivelUno(
                    $datosEnt['idespecialidad']
                );
                $datosArray[$key]
                    = array('denominacion' => $datosEnt['denominacion'],
                            'idden'        => $idespecialidad);
            }
        }
        return $datosArray;
    }

    private function addHavigConParams(&$addHaving, $columCond, $param)
    {
        if ($addHaving != "") {
            $addHaving .= " OR " . $columCond . $param;
        } else {
            $addHaving .= "HAVING " . $columCond . $param;
        }


    }

    public function listarIndXCBDemanda($params)
    {
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom(
            $params['idcb']
        );
        $params['identidaddatosnomenclador']
            = $entidaddatosnom[0]['identidaddatosnomenclador'];
        $prueba = $params['identidaddatosnomenclador'];
        $start = $params['start'];
        $limit = $params['limit'];
        $conn = Doctrine_Manager::connection();
        $addHaving = "";
        $val = "";
        $esp = "";
        $arrayParams = array();
        $cantidad = " OFFSET ?   LIMIT ?";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $s) {
                if ($s->field == 'importe') {
                    if ($s->data->comparison == 'gt') {
                        $val = $val . ' AND importe > ? ';
                        $arrayParams[] = $s->data->value;
                    } elseif ($s->data->comparison == 'lt') {
                        $val = $val . ' AND importe < ? ';
                        $arrayParams[] = $s->data->value;
                    } elseif ($s->data->comparison == 'eq') {
                        $val = $val . ' AND importe = ? ';
                        $arrayParams[] = $s->data->value;
                    }
                }
                if ($s->field == 'denominacionind') {
                    $val = $val . " AND upper(n.denominacion) LIKE ? ";
                    $arrayParams[] = "%" . strtoupper($s->data->value) . "%";
                }

                if ($s->field == 'numeropieza') {
                    $val = $val . " AND upper(n.numeropieza) LIKE ? ";
                    $arrayParams[] = "%" . strtoupper($s->data->value) . "%";
                }
                if ($s->field == 'codigo') {
                    $val = $val . " AND n.codigo LIKE ? ";
                    $arrayParams[] = strtoupper($s->data->value . "%");
                }
                if ($s->field == 'denominacionmodelo') {
                    $val = $val . " AND dm.idmodelo = ? ";
                    $arrayParams[] = $s->data->value;
                }
                if ($s->field == 'entidad') {
                    $cantidad = "";
                }
                if ($s->field == 'denomentidadpadre') {
                    $esp = $esp . " AND e1.idestructura = \"" . $s->data->value
                        . "\"";
                    $val = $val . " AND (Select e1.denominacion
                                        from mod_estructuracomp.nom_filaestruc f1 
                                        inner join mod_estructuracomp.dat_estructura e1
                                        ON f1.idfila = e1.idestructura
                                        where f1.idpadre = (Select ed.identidad 
                                        from mod_planificacion.dat_entidaddatosnomenclador ed
                                        inner join mod_planificacion.nom_datosnomenclador nd
                                        ON ed.iddatosnomenclador = nd.iddatosnomenclador
                                        where nd.uridatosnomenclador = 'rectorbalance') 
                                        AND ( e1.lft <= e.lft AND e1.rgt >= e.rgt) 
                                        AND (e1.idestructura <> e1.idpadre)) ='"
                        . $s->data->value . "'        ";


                }
                if ($s->field == 'necesidad') {
                    $cantidad = "";

                    if ($s->data->comparison == 'gt') {
                        self::addHavigConParams(
                            $addHaving, "SUM(dp.cantidad) >", $s->data->value
                        );
                    } elseif ($s->data->comparison == 'lt') {
                        self::addHavigConParams(
                            $addHaving, "SUM(dp.cantidad) <", $s->data->value
                        );

                    } elseif ($s->data->comparison == 'eq') {
                        self::addHavigConParams(
                            $addHaving, "SUM(dp.cantidad) =", $s->data->value
                        );

                    }
                }
            }
        } else {
            $val = " AND 0=0";
        }

        $sqlQuery
            = " Select n.denominacion as denominacionind ,n.codigo,dm.denominacion as denominacionmodelo,
						dem.identidad,f.lft, f.rgt, e.denominacion as denominacionenti,
						(Select e1.denominacion 
						from mod_estructuracomp.nom_filaestruc f1 
						inner join mod_estructuracomp.dat_estructura e1 ON f1.idfila = e1.idestructura 
						where f1.idpadre = (Select ed.identidad 
						from mod_planificacion.dat_entidaddatosnomenclador ed
						inner join mod_planificacion.nom_datosnomenclador nd
						ON ed.iddatosnomenclador = nd.iddatosnomenclador
						where nd.uridatosnomenclador = 'rectorbalance') 
						AND ( f1.lft <= f.lft AND f1.rgt >= f.rgt)
						AND e1.idestructura <> f1.idpadre ) as denomentidadpadre,
						SUM(dp.cantidad) as necesidad,
						np.precio, (SUM(dp.cantidad)*np.precio) as importe, n.numeropieza,COUNT(*) OVER() as total
						from mod_planificacion.dat_planificacion dp
						inner join mod_datosmaestros.nom_indicador n ON dp.idindicador = n.idindicador
						inner join mod_datosmaestros.nom_indicadorplanif np ON dp.idindicador = np.idindicador
						inner join mod_planificacion.dat_entidadmodelo dem ON dp.identidadmodelo = dem.identidadmodelo
						inner join mod_estructuracomp.nom_filaestruc f ON dem.identidad = f.idfila
						left join mod_estructuracomp.dat_estructura e ON f.idfila = e.idestructura
						left join mod_estructuracomp.dat_estructuraop ep ON f.idfila = ep.idestructuraop
						inner join mod_planificacion.dat_modelo dm ON dm.idmodelo = dem.idmodelo
						inner join mod_datosmaestros.dat_indicadorcentrobalance dicb ON dicb.idindicador = n.idindicador
						inner join mod_planificacion.dat_entidaddatosnomenclador dedn ON dicb.identidaddatosnomenclador =dedn.identidaddatosnomenclador
						where dp.idcentrobalance = $prueba $val and dp.idejercicio = " . $params['idejercicio'] . "
                  GROUP BY n.denominacion, n.codigo, dm.denominacion, dem.identidad,np.precio,n.numeropieza,f.lft,f.rgt, e.denominacion
                  $addHaving offset $start limit $limit ";

        $arrayParamsTotal = $arrayParams;
        $data = $conn->execute($sqlQuery, $arrayParams);
        $data->data = $data->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function listarIndXCB($params)
    {

        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom(
            $params['idcb']
        );

        $params['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];

        $datos = DatPlanificacion::indXCB($params);

        return $datos;
    }

    public function cargarTodasViaAdquision()
    {
        $datos = NomViaadquisicion::Obtener_via_adquisicion();
        return $datos;
    }

    public function cargarTodosOrganoSatisface()
    {
        $datos = NomOrganosatisface::obtenerOS();
        return $datos;
    }

}
