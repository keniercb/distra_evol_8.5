<?php

class DatActividadentidadModel extends ZendExt_Model {

    protected $nivel;

    public function __construct() {
        $this->nivel = NomActividad::getNivel();
        parent::ZendExt_Model();
    }

    public function Insertar(DatActividadentidad $datActividadentidad) {
        $datActividadentidad->save();
    }

    public function Actualizar(DatActividadentidad $datActividadentidad) {
        $datActividadentidad->save();
    }

    public function Eliminar($datActividadentidad) {
        $datActividadentidad->delete();
    }

    public function modificarNivelesActividad($params) {

        $iddatosnomenclador = DatActespcomportamiento::obtenerIdDatosNom();
        $arrayIddatosnomenclador = array($iddatosnomenclador['demandada'],
            $iddatosnomenclador['compartida'],
            $iddatosnomenclador['propia']);
        unset($iddatosnomenclador);


        foreach ($params['actividades'] as $nivactividad) {

            $ajuste = null;

            $modeloActEnt = new DatActividadentidad();
            $asocActentalmacenado = DatActividadentidad::buscarXEjercicio(
                            $nivactividad->identidad, $nivactividad->idactividad, $params['idejercicio'], true, true, true
                    )->getFirst();

            $idactividadentidadPadre = $asocActentalmacenado->idactividadentidad;

            if ($nivactividad->campo_modif == 'nivelactividadmanual') {

                $nivManual = 0;
                $nivelactividadmanual = round(
                        doubleval($nivactividad->nivelactividadmanual), 4
                );

                if ($nivelactividadmanual <= 0) {
                    $flujo = 'elim';
                    if ($asocActentalmacenado->DatActividadentidadmanual->idactividadentidad) {
                        $asocActentalmacenado->DatActividadentidadmanual->delete();
                    }

                    if ($asocActentalmacenado->DatActividadentidadautomatico->idactividadentidad == null && $asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad == null
                    ) {
                        if (is_object($asocActentalmacenado)) {
                            $asocActentalmacenado->delete();
                        }
                    }
                    /* Actualizar actividades asociadas por automatico */
                } else {


                    /* Adicionar o actualizar */
                    if ($asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == null || $asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == ''
                    ) {
                        /* Adicionar */
                        $flujo = 'add';
                        $idactividadentidadPadre = $asocActentalmacenado->idactividadentidad;
                        if ($asocActentalmacenado->idactividadentidad == null
                        ) {
                            $nuevaAsocactent = $this->crearAsociacionActEnt(
                                    $nivactividad->idactividad, $arrayIddatosnomenclador, $params['espcomp'], $nivactividad->identidad, $params['idejercicio']
                            );

                            $idactividadentidadPadre = $nuevaAsocactent->idactividadentidad;
                        }

                        $nuevaAsocactentmanual = new DatActividadentidadmanual();
                        $nuevaAsocactentmanual->idactividadentidad = $idactividadentidadPadre;
                        $nuevaAsocactentmanual->nivelactividadmanual = $nivelactividadmanual;
                        $nivManual = $nivelactividadmanual;
                        $nuevaAsocactentmanual->save();
                        /* Actualizar actividades asociadas por automatico */
                    } else {
                        /* Actualizar */
                        $flujo = 'act';
                        $asocActentalmacenado->DatActividadentidadmanual->nivelactividadmanual = $nivelactividadmanual;
                        $nivManual = $nivelactividadmanual;
                        $asocActentalmacenado->DatActividadentidadmanual->save();
                        /* Actualizar actividades asociadas por automatico */
                    }
                }
            } else {

                if ($nivactividad->campo_modif == 'nivelactividadproduccion') {
                    $nivelactividadproduccion = round(doubleval($nivactividad->nivelactividadproduccion), 4);
                    if ($nivelactividadproduccion <= 0) {
                        $flujo = 'elimp';
                        if ($asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad != null
                        ) {
                            $asocActentalmacenado->DatActividadentidadproduccion->delete();
                        }
                        if ($asocActentalmacenado->DatActividadentidadautomatico->idactividadentidad == null && $asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == null
                        ) {
                            if (is_a(
                                            $asocActentalmacenado, DatActividadentidad
                                    )) {
                                $asocActentalmacenado->delete();
                            }
                        }
                        /* Actualizar actividades asociadas por automatico */
                    } else {
                        /* Adicionar o actualizar */
                        if ($asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad == null
                        ) {
                            /* Adicionar */
                            $flujo = 'addp';
                            $idactividadentidadPadre = $asocActentalmacenado->idactividadentidad;
                            if ($asocActentalmacenado->idactividadentidad == null
                            ) {
                                $nuevaAsocactentprimera = $this->crearAsociacionActEnt(
                                        $nivactividad->idactividad, $arrayIddatosnomenclador, $params['espcomp'], $nivactividad->identidad, $params['idejercicio']
                                );
                                $idactividadentidadPadre = $nuevaAsocactentprimera->idactividadentidad;
                            }
                            if ($nivelactividadproduccion != null) {
                                $nuevaAsocactentprod = new DatActividadentidadproduccion();
                                $nuevaAsocactentprod->idactividadentidad = $idactividadentidadPadre;
                                $nuevaAsocactentprod->nivelactividadproduccion = $nivelactividadproduccion;
                                $nivProd = $nivelactividadproduccion;
                                $nuevaAsocactentprod->save();
                            }
                            /* Actualizar actividades asociadas por automatico */
                        } else {
                            /* Actualizar */
                            $flujo = 'actp';
                            if ($asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad != null
                            ) {
                                $asocActentalmacenado->DatActividadentidadproduccion->nivelactividadproduccion = $nivelactividadproduccion;
                                $nivProd = $nivelactividadproduccion;
                                $asocActentalmacenado->DatActividadentidadproduccion->save();
                            }
                            /* Actualizar actividades asociadas por automatico */
                        }
                    }
                } else {
                    if ($nivactividad->campo_modif == 'ajuste') {

                        $ajuste = round(doubleval($nivactividad->ajuste), 4);
                        if (is_a(
                                        $asocActentalmacenado, DatActividadentidad
                                )) {
                            $asocActentalmacenado->ajuste = $ajuste;
                            $asocActentalmacenado->save();
                        }
                    }
                }
            }
            if (is_a($asocActentalmacenado, DatActividadentidad)) {
                $asocActentalmacenado->free();
            }

            $this->actualizarAsociacionesAutomaticas(
                    $nivactividad->idactividad, $nivactividad->identidad, $params['espcomp'], $arrayIddatosnomenclador, $params['idejercicio']
            );
        }
        return true;
    }

    public function modificarNivelesActividadImportar($params) {

        $idespecialidadDemandante = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;

        $iddatosnomenclador = DatActespcomportamiento::obtenerIdDatosNom();

        $arrayIddatosnomenclador = array($iddatosnomenclador['demandada'],
            $iddatosnomenclador['compartida'],
            $iddatosnomenclador['propia']);
        unset($iddatosnomenclador);
        foreach ($params['actividades'] as $nivactividad) {

            $modeloActEnt = new DatActividadentidad();
            $asocActentalmacenado = DatActividadentidad::buscarXEjercicio(
                            $nivactividad['identidad'], $nivactividad['idactividad'], $params['idejercicio'], true, true, true
                    )->getFirst();

            $idactividadentidadPadre = $asocActentalmacenado->idactividadentidad;
            if ($nivactividad['campoModif'] == 'nivelactividadmanual') {
                $nivManual = 0;
                $nivelactividadmanual = round(
                        doubleval($nivactividad['nivelactividadmanual']), 4
                );

                if ($nivelactividadmanual <= 0) {

                    $flujo = 'elim';
                    if ($asocActentalmacenado->DatActividadentidadmanual->idactividadentidad) {
                        $asocActentalmacenado->DatActividadentidadmanual->delete();
                    }

                    if ($asocActentalmacenado->DatActividadentidadautomatico->idactividadentidad == null && $asocActentalmacenado->DatActividadentidadproduccion->idactividadentidad == null
                    ) {
                        if (is_object($asocActentalmacenado)) {
                            $asocActentalmacenado->delete();
                        }
                    }
                    /* Actualizar actividades asociadas por automatico */
                } else {
                    /* Adicionar o actualizar */
                    if ($asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == null
                    ) {//9
                        /* Adicionar */
                        $flujo = 'add';

                        $idactividadentidadPadre = $asocActentalmacenado->idactividadentidad;
                        if ($asocActentalmacenado->idactividadentidad == null
                        ) {

                            $nuevaAsocactent = $this->crearAsociacionActEnt(
                                    $nivactividad['idactividad'], $arrayIddatosnomenclador, $idespecialidadDemandante, $nivactividad['identidad'], $params['idejercicio']
                            );

                            $idactividadentidadPadre = $nuevaAsocactent->idactividadentidad;
                        }
                        $nuevaAsocactentmanual = new DatActividadentidadmanual();
                        $nuevaAsocactentmanual->idactividadentidad = $idactividadentidadPadre;
                        $nuevaAsocactentmanual->nivelactividadmanual = $nivelactividadmanual;
                        $nivManual = $nivelactividadmanual;
                        $nuevaAsocactentmanual->save();
                        /* Actualizar actividades asociadas por automatico */
                    } else {
                        /* Actualizar */

                        $flujo = 'act';
                        $asocActentalmacenado->DatActividadentidadmanual->nivelactividadmanual = $nivelactividadmanual;
                        $nivManual = $nivelactividadmanual;
                        $asocActentalmacenado->DatActividadentidadmanual->save();
                        /* Actualizar actividades asociadas por automatico */
                    }
                }
            }
            if (is_a($asocActentalmacenado, DatActividadentidad)) {
                $asocActentalmacenado->free();
            }
            $this->actualizarAsociacionesAutomaticas(
                    $nivactividad['idactividad'], $nivactividad['identidad'], $idespecialidadDemandante, $arrayIddatosnomenclador, $params['idejercicio']
            );
        }
        return true;
    }

    //Utilizado como servicio
    public function actualizarAsociacionesAutomaticas(
    $idactividadGeneradora, $identidad, $idespecialidadDemandante, $arrayIddatosnomenclador, $idejercicio
    ) {

        $reglaModel = new DatReglaModel();

        $arrayreglas = $reglaModel->buscarActividadesRelacionadasPorReglasAUnaActiv(
                $idactividadGeneradora, $idejercicio, $idespecialidadDemandante, true
        );
        if (count($arrayreglas)) {
            foreach ($arrayreglas as $regla) {
                $actividadEntidad = DatActividadentidad::buscarXEjercicio(
                                $identidad, $regla['idactividaddestino'], $idejercicio, true, true, true
                        )->getFirst();
                if (!$actividadEntidad) {
                    $actividadEntidad = new DatActividadentidad();

                    $actividadEntidad->idactespcomportamiento = DatActespcomportamiento::buscarActEspDemandante(
                                    $regla['idactividaddestino'], $arrayIddatosnomenclador, $idespecialidadDemandante
                            )->getFirst()->idactespcomportamiento;

                    $actividadEntidad->identidad = $identidad;
                    $actividadEntidad->idactividad = $regla['idactividaddestino'];
                    $actividadEntidad->idejercicio = $idejercicio;
                }
                if (!$actividadEntidad->DatActividadentidadautomatico->idregla) {

                    $actividadEntidad->DatActividadentidadautomatico = new DatActividadentidadautomatico();
                    $actividadEntidad->DatActividadentidadautomatico->idregla = $regla['idregla'];
                }
                /* $var = DatActividadentidadautomatico::getNivelAutomatico(
                  $regla['idactividaddestino'], $idejercicio, $identidad
                  ); */
                $var = DatActividadentidadautomatico::getNivelAutomatico(
                                $regla['idactividaddestino'], $idejercicio, $identidad
                );
                $actividadEntidad->DatActividadentidadautomatico->nivelactividadautomatico = $var[0];
                $actividadEntidad->save();

                $this->actualizarAsociacionesAutomaticas(
                        $regla['idactividaddestino'], $identidad, $idespecialidadDemandante, $arrayIddatosnomenclador, $idejercicio
                );
            }
        }
    }

    /* private function actualizarAsociacionesAutomaticas_old($idactividadGeneradora,
      $pNuevonivelactividad, $identidad, $idespecialidadDemandante,
      $arrayIddatosnomenclador, &$res, $idejercicio
      )
      {
      $reglaModel = new DatReglaModel();
      $modelActEntAuto = new DatActividadentidadautomaticoModel();

      $arrayreglas
      = $reglaModel->buscarActividadesRelacionadasPorReglasAUnaActiv(
      $idactividadGeneradora, $idejercicio, true
      );

      if (isset($arrayreglas[0])) {
      foreach ($arrayreglas as $regla) {
      $nivelautomaticoexistente = 0;
      $asocActentmanualauto
      = DatActividadentidad::buscarXEjercicio(
      $identidad, $regla->idactividadquegenera,
      $idejercicio, true, true, true
      )->getFirst();

      if ($asocActentmanualauto->DatActividadentidadautomatico->
      nivelactividadautomatico) {
      $nivelautomaticoexistente
      =$asocActentmanualauto->DatActividadentidadautomatico->nivelactividadautomatico;
      }

      $idactividadentidadAsocPadre
      = $asocActentmanualauto->idactividadentidad;

      $nuevoNivelautomatico = DatActividadentidadModel::
      calcularNivelActividadAutomatico(
      $pNuevonivelactividad, $regla->valorcontrol,
      $regla->nivelactividadbase,
      ($regla->idnorma) ? $regla->DatNorma->calcularNecesidad()
      : 1
      );


      if ($nuevoNivelautomatico > 0) {
      if ($asocActentmanualauto->idactividadentidad == null) {
      $nuevaAsocactent = new DatActividadentidad();
      $nuevaAsocactent->idactespcomportamiento
      = DatActespcomportamiento::
      buscarActEspDemandante(
      $regla->idactividadquegenera,
      $arrayIddatosnomenclador,
      $idespecialidadDemandante
      )->getFirst()->idactespcomportamiento;
      $nuevaAsocactent->identidad = $identidad;
      $nuevaAsocactent->idactividad
      = $regla->idactividadquegenera;
      $nuevaAsocactent->idejercicio = $idejercicio;
      $nuevaAsocactent->save();
      $idactividadentidadAsocPadre
      = $nuevaAsocactent->idactividadentidad;
      }
      if ($asocActentmanualauto->DatActividadentidadautomatico->idactividadentidad
      == null
      ) {
      $nuevaAsocactentautomatica
      = new DatActividadentidadautomatico();
      $nuevaAsocactentautomatica->idregla
      = $regla->idregla;
      $nuevaAsocactentautomatica->nivelactividadautomatico
      = $nuevoNivelautomatico;
      $nuevaAsocactentautomatica->idactividadentidad
      = $idactividadentidadAsocPadre;
      $modelActEntAuto->Insertar(
      $nuevaAsocactentautomatica
      );
      } else {
      $asocActentmanualauto->DatActividadentidadautomatico->nivelactividadautomatico
      = $nuevoNivelautomatico
      + $nivelautomaticoexistente;
      $asocActentmanualauto->DatActividadentidadautomatico->save(
      );
      }
      } else {
      if ($asocActentmanualauto->DatActividadentidadautomatico->idactividadentidad
      != null
      ) {
      if ($asocActentmanualauto->DatActividadentidadmanual->idactividadentidad
      == null
      && $asocActentmanualauto->DatActividadentidadproduccion->idactividadentidad
      == null
      ) {

      $queryElimActEnt = Doctrine_Query::create();
      $queryElimActEnt->delete('DatActividadentidad')
      ->from('DatActividadentidad')->where(
      'idactividadentidad = ?',
      $asocActentmanualauto->idactividadentidad
      )->execute();
      } else {
      $queryElimActEntAuto = Doctrine_Query::create();
      $queryElimActEntAuto->delete(
      'DatActividadentidadautomatico'
      )->from('DatActividadentidadautomatico')->where(
      'idactividadentidad = ? ',
      $asocActentmanualauto->DatActividadentidadautomatico->idactividadentidad
      )->execute();
      }
      }
      }
      $asocActentmodifporautomatico
      = DatActividadentidad::buscarXEjercicio(
      $identidad, $regla->idactividadquegenera,
      $idejercicio, true, false, true
      )->getFirst();

      $nivelactividadManual
      =($asocActentmodifporautomatico->DatActividadentidadmanual->nivelactividadmanual
      != null)
      ?$asocActentmodifporautomatico->DatActividadentidadmanual->nivelactividadmanual
      : 0;
      $nivelactividadProduccion
      =($asocActentmodifporautomatico->DatActividadentidadproduccion->
      nivelactividadproduccion
      != null)
      ? $asocActentmodifporautomatico->DatActividadentidadproduccion->
      nivelactividadproduccion
      : 0;
      $nuevoNivelactividad = $nivelactividadManual
      + $nuevoNivelautomatico + $nivelactividadProduccion;

      $this->actualizarAsociacionesAutomaticas(
      $regla->idactividadquegenera, $nuevoNivelactividad,
      $identidad, $idespecialidadDemandante,
      $arrayIddatosnomenclador, $res, $idejercicio
      );
      }
      }
      return true;
      } */

    //Utilizado como servicio
    public function crearAsociacionActEnt(
    $idactividad, $arrayIddatosnomenclador, $idespecialidadDemandante, $identidad, $idejercicio
    ) {
        $de = Doctrine_Manager::getInstance();
        $conn = $de->getCurrentConnection();
        $nuevaAsocactent = new DatActividadentidad();
        $nuevaAsocactent->idactespcomportamiento = DatActespcomportamiento::
                buscarActEspDemandante(
                        $idactividad, $arrayIddatosnomenclador, $idespecialidadDemandante
                )->getFirst()->idactespcomportamiento;
        $nuevaAsocactent->identidad = $identidad;
        $nuevaAsocactent->idactividad = $idactividad;
        $nuevaAsocactent->idejercicio = $idejercicio;
        $nuevaAsocactent->save();
        $conn->commit();
        $conn->beginTransaction();
        return $nuevaAsocactent;
    }

    /* FUNCION AUXILIAR PARA CALCULAR NIVELES DE ACTIVIDAD AUTOMATICOS */

    public function calcularNivelActividadAutomatico($nivelactividad, $valorcontrol, $nivelactividadbase, $necesidad
    ) {

        $necesidad = floatval($necesidad);
        $nivelactividad = round($nivelactividad, 4);
        $nuevoNivelactividadautomatico = round(
                ((($necesidad * $nivelactividad) / $valorcontrol) *
                $nivelactividadbase), 4
        );

        return $nuevoNivelactividadautomatico;
    }

    /* FIN FUNCION AUXILIAR PARA CALCULAR NIVELES DE ACTIVIDAD AUTOMATICOS */

    /* Esta funcion se ejecuta cuando se adiciona una regla */

    public function obtenerActividadesAsociadasEntidad($identidad) {
        $modeloActEnt = new DatActividadentidad();
        $actividades = DatActividadentidad::buscarActividadesAsociadasAEntidad(
                        $identidad
        );
        return $actividades;
    }

    public function listarNivelesActividadConsolidados($params) {
        ini_set("max_execution_time", 3600); //1hora
        $condiciones = array();
        $condicionesHaving = array();
        $solonivel = 'false';
        $arrayParametros = array();
        $arrayParametrostotal = array();

        /* Obtener el ejercicio actual */

        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        $strEntidadesProductoras = implode(
                ",", $params['entidades_productoras']
        );
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "a.codigo LIKE ? ";
                    $arrayParametros[] = $datos['data']['value'] . "%";
                    $arrayParametrostotal[] = $datos['data']['value'] . "%";
                } elseif ($datos['field'] == 'denominacion') {
                    $condiciones[] = "upper(a.denominacion) LIKE ? ";
                    $arrayParametros[] = "%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%";
                    $arrayParametrostotal[] = "%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%";
                } elseif ($datos['field'] == 'denespecialidad') {
                    $condiciones[] = "a.idespecialidad = ? ";
                    $arrayParametros[] = $datos['data']['value'];
                    $arrayParametrostotal[] = $datos['data']['value'];
                } elseif ($datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(a.descripcion) LIKE ?";
                    $arrayParametros[] = "%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%";
                    $arrayParametrostotal[] = "%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%";
                } elseif ($datos['field'] == 'nivelactividad') {
                    $campo = " ( SUM( COALESCE(aea.nivelactividadautomatico,0)) +
                        SUM( COALESCE(aea.nivelactividadautomatico,0)) +
                        SUM( COALESCE(aea.nivelactividadautomatico,0)) )";
                    $cond = "=";
                    if ($datos['data']['comparison'] == 'lt') {
                        $cond = "<";
                    } elseif ($datos['data']['comparison'] == 'gt') {
                        $cond = ">";
                    }
                    $condicionesHaving[] = $campo . $cond
                            . $datos['data']['value'];
                } elseif ($datos['field'] == 'nivelactividadautomatico') {
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = "SUM( COALESCE(aea.nivelactividadautomatico,0)) > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = "SUM( COALESCE(aea.nivelactividadautomatico,0)) < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = "SUM( COALESCE(aea.nivelactividadautomatico,0)) = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'nivelactividadmanual') {
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = "SUM( COALESCE(aem.nivelactividadmanual,0)) > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = "SUM( COALESCE(aem.nivelactividadmanual,0)) < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = "SUM( COALESCE(aem.nivelactividadmanual,0)) = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'nivelactividadproduccion') {
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = "SUM( COALESCE(aep.nivelactividadproduccion,0)) > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = "SUM( COALESCE(aep.nivelactividadproduccion,0)) < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = "SUM( COALESCE(aep.nivelactividadproduccion,0)) = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'restoxdistrib') {
                    $sqlRD = " COALESCE ( anp.nivelproduccion,0) -
                               COALESCE ( ( SELECT SUM(
                                        COALESCE (subaem1.nivelactividadmanual,0) +
                                        COALESCE (subaea1.nivelactividadautomatico,0) +
                                        COALESCE (subaep1.nivelactividadproduccion,0)   )
                                        FROM mod_planificacion.dat_actividadentidad subae1
                                        LEFT JOIN mod_planificacion.dat_actividadentidadmanual subaem1
                                        ON(subaem1.idactividadentidad = subae1.idactividadentidad)
                                        LEFT JOIN mod_planificacion.dat_actividadentidadautomatico subaea1
                                        ON(subaea1.idactividadentidad = subae1.idactividadentidad)
                                        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion subaep1
                                        ON( subaep1.idactividadentidad = subae1.idactividadentidad)
                                        WHERE subae1.idejercicio = "
                            . $params['idejercicio'] .
                            "
                                        AND subae1.idactividadentidad is not null
                                        AND subae1.identidad IN ("
                            . $strEntidadesProductoras .
                            ")
                            AND subae1.idactividad = a.idactividad ),0) ";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlRD . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlRD . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlRD . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'ajuste') {
                    $sqlAjuste = "round(SUM( COALESCE(ae.ajuste,0) ),4) ";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlAjuste . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlAjuste . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlAjuste . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'nivelactividadajuste') {
                    $sqlNAA = " SUM( COALESCE(aea.nivelactividadautomatico,0)) +
                            SUM( COALESCE(aem.nivelactividadmanual,0)) +
                            SUM( COALESCE(aep.nivelactividadproduccion,0 )) +
                            round(SUM( COALESCE(ae.ajuste,0) ),4) ";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlNAA . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlNAA . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlNAA . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'importe') {
                    $sqlImp = "(SELECT SUM(round( Coalesce ( ((n.necesidad) *ind.precio)
                            * ( COALESCE (aem.nivelactividadmanual,0)
                            + COALESCE (aea.nivelactividadautomatico,0)
                            +COALESCE (aep.nivelactividadproduccion,0)),0)
                            
                            + (Coalesce (( (n.necesidad) *ind.precio)
                            * ( COALESCE (aem.nivelactividadmanual,0)
                            + COALESCE (aea.nivelactividadautomatico,0)
                            +COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.flete/100
                            
                            +(Coalesce (( (n.necesidad) *ind.precio)
                            * ( COALESCE (aem.nivelactividadmanual,0)
                            + COALESCE (aea.nivelactividadautomatico,0)
                            + COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.contingencia/100 ,0))
                            FROM mod_planificacion.dat_norma n
                            INNER JOIN mod_planificacion.nom_indicador ind
                            ON(n.idindicador = ind.idindicador AND
                            ind.estado = 1 AND
                            ind.idaprobacion >= 3 AND
                            ind.nivel = 1
                            )
                            WHERE n.idactividad = a.idactividad AND n.idejercicio = {$params['idejercicio']}
                            GROUP BY
                                    ind.flete,
                                    ind.contingencia
                            )";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlImp . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlImp . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlImp . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'importeajustado') {
                    $sqlImp = "( SELECT round( SUM((n.necesidad)*
                                            ind.precio)* COALESCE( ae.ajuste,0)
                                        +(SUM((n.necesidad)*ind.precio)*
                                        COALESCE( ae.ajuste,0))*ind.flete/100+
                                        (SUM((n.necesidad)*ind.precio)*
                                        COALESCE( ae.ajuste,0))*ind.contingencia/100,0)
                                                FROM mod_planificacion.dat_norma n
                                                INNER JOIN mod_planificacion.nom_indicador ind
                                                ON(n.idindicador = ind.idindicador AND
                                                    ind.estado = 1 AND
                                                    ind.idaprobacion >= 3 AND
                                                    ind.nivel = 1
                                                )
                                                WHERE n.idactividad = a.idactividad AND n.idejercicio
                                                = {$params['idejercicio']}
                                                GROUP BY
                                                ind.flete,
                                                ind.contingencia
                                                )";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlImp . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlImp . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlImp . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'importefinal') {
                    $sqlImp = "((SELECT SUM(round( Coalesce ( ((n.necesidad) *ind.precio)
                                        * ( COALESCE (aem.nivelactividadmanual,0)
                                        + COALESCE (aea.nivelactividadautomatico,0)
                                        +COALESCE (aep.nivelactividadproduccion,0)),0)
                                        
                                        + (Coalesce (( (n.necesidad) *ind.precio)
                                        * ( COALESCE (aem.nivelactividadmanual,0)
                                        + COALESCE (aea.nivelactividadautomatico,0)
                                        +COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.flete/100
                                        
                                        +(Coalesce (( (n.necesidad) *ind.precio)
                                        * ( COALESCE (aem.nivelactividadmanual,0)
                                        + COALESCE (aea.nivelactividadautomatico,0)
                                        + COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.contingencia/100 ,0))
                                        FROM mod_planificacion.dat_norma n
                                        INNER JOIN mod_planificacion.nom_indicador ind
                                        ON(n.idindicador = ind.idindicador AND
                                        ind.estado = 1 AND
                                        ind.idaprobacion >= 3 AND
                                        ind.nivel = 1
                                        )
                                        WHERE n.idactividad = a.idactividad AND n.idejercicio = {$params['idejercicio']}
                                        GROUP BY
                                                ind.flete,
                                                ind.contingencia
                                        ) +
                                        ( SELECT round( SUM((n.necesidad)*
                                        ind.precio)* COALESCE( ae.ajuste,0)
                                        +(SUM((n.necesidad)*ind.precio)*
                                        COALESCE( ae.ajuste,0))*ind.flete/100+
                                        (SUM((n.necesidad)*ind.precio)*
                                        COALESCE( ae.ajuste,0))*ind.contingencia/100,0)
                                        FROM mod_planificacion.dat_norma n
                                        INNER JOIN mod_planificacion.nom_indicador ind
                                        ON(n.idindicador = ind.idindicador AND
                                        ind.estado = 1 AND
                                        ind.idaprobacion >= 3 AND
                                        ind.nivel = 1
                                        )
                                        WHERE n.idactividad = a.idactividad AND n.idejercicio
                                                ={$params['idejercicio']}
                                                GROUP BY
                                                ind.flete,
                                                ind.contingencia
                                                )
                                        
                                                                     )";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlImp . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlImp . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlImp . " = "
                                . $datos['data']['value'];
                    }
                    $sqlImp = "";
                } elseif ($datos['field'] == 'idaprobacion') {
                    $sqlAprob = "AVG( COALESCE( ae.idaprobacion, 1) )";
                    if ($datos['data']['value'] == 'No') {
                        $condicionesHaving[] = $sqlAprob . " = 1";
                    } else {
                        if ($datos['data']['value'] == 'Si') {
                            $condicionesHaving[] = $sqlAprob . " = 3";
                        } else {
                            if ($datos['data']['value'] == 'Rector') {
                                $condicionesHaving[] = $sqlAprob . " = 4";
                            }
                        }
                    }
                } elseif ($datos['field'] == 'denmodelo') {
                    if ($datos['data']['value'] == '-') {
                        $condiciones[] = "am.idmodelo IS NULL ";
                    } else {
                        $condiciones[] = "am.idmodelo = ? ";
                        $arrayParametros[] = $datos['data']['value'];
                        $arrayParametrostotal[] = $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'comportamiento') {
                    if ($datos['data']['value'] == 'Propia') { //propia
                        $condiciones[] = " aec.iddatosnomenclador = "
                                . $iddatosnomanclador['propia'] .
                                " ";
                    } else {
                        if ($datos['data']['value'] == 'Demandada'
                        ) { //demandante
                            $condiciones[] = " aec.iddatosnomenclador = ? ";
                            $arrayParametros[] = $iddatosnomanclador['demandada'];
                            $arrayParametrostotal[] = $iddatosnomanclador['demandada'];
                        } else {
                            if ($datos['data']['value'] == 'Compartida'
                            ) { //compartida
                                $condiciones[] = " aec.iddatosnomenclador = ? ";
                                $arrayParametros[] = $iddatosnomanclador['compartida'];
                                $arrayParametrostotal[] = $iddatosnomanclador['compartida'];
                            }
                        }
                    }
                }
            }
        }

        $strEspecialidadesDemandantes = "";
        $coma = "";
        $arrayIdespecialidades = $params['id_especialidades'];
        foreach ($arrayIdespecialidades as $idespecialidad) {
            $strEspecialidadesDemandantes = $strEspecialidadesDemandantes
                    . $coma . "'" . $idespecialidad . "'";
            $coma = ",";
        }
        $ADDWHERE = "";
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . " AND " . $condicion . " ";
        }
        $HAVING = "";
        $AND = "";
        foreach ($condicionesHaving as $condicionHaving) {
            $HAVING = $HAVING . $AND . " " . $condicionHaving . " ";
            $AND = "AND";
        }
        if ($HAVING != "") {
            $HAVING = "HAVING " . $HAVING;
        }
        /* temporal poner ? */
        $strEntidades = "";
        $arrayEntidades = $params['entidades'];
        foreach ($arrayEntidades as $ent) {
            if ($strEntidades == "") {
                $strEntidades = $ent;
            } else {
                $strEntidades = $strEntidades . "," . $ent;
            }
        }
//$innerjoin="";
        if ($params['calcularimporte'] == 'true') {
            /* $innerjoin ='LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
              ON(aem.idactividadentidad = ae.idactividadentidad)'; */


            $calcularimporte = "((SELECT SUM(round( Coalesce ( ((n.necesidad) *ind.precio)
    * ( COALESCE (aem.nivelactividadmanual,0)
    + COALESCE (aea.nivelactividadautomatico,0)
    +COALESCE (aep.nivelactividadproduccion,0)),0)

+ (Coalesce (( (n.necesidad) *ind.precio)
    * ( COALESCE (aem.nivelactividadmanual,0)
    + COALESCE (aea.nivelactividadautomatico,0)
    +COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.flete/100

+(Coalesce (( (n.necesidad) *ind.precio)
* ( COALESCE (aem.nivelactividadmanual,0)
+ COALESCE (aea.nivelactividadautomatico,0)
+ COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.contingencia/100 ,0))
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.nom_indicador ind
ON(n.idindicador = ind.idindicador AND
ind.estado = 1 AND
ind.idaprobacion >= 3 AND
ind.nivel = 1
)
WHERE n.idactividad = a.idactividad AND n.idejercicio ={$params['idejercicio']}
GROUP BY
                    ind.flete,
                    ind.contingencia
		))";

            $calcularimporteAjustado = "( SELECT (round( SUM((n.necesidad)*ind.precio)*
    COALESCE( ae.ajuste,0)
         +(SUM((n.necesidad)*ind.precio)*
         COALESCE( ae.ajuste,0))*ind.flete/100+
        (SUM((n.necesidad)*ind.precio)*
        COALESCE( ae.ajuste,0))*ind.contingencia/100,0))
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.nom_indicador ind
ON(n.idindicador = ind.idindicador AND
    ind.estado = 1 AND
    ind.idaprobacion >= 3 AND
    ind.nivel = 1
)


WHERE n.idactividad = a.idactividad AND n.idejercicio
= {$params['idejercicio']}
GROUP BY
ind.flete,
ind.contingencia

)";
            $calcularimporteFinal = "((SELECT SUM(round( Coalesce ( ((n.necesidad) *ind.precio)
* ( COALESCE (aem.nivelactividadmanual,0)
+ COALESCE (aea.nivelactividadautomatico,0)
+COALESCE (aep.nivelactividadproduccion,0)),0)

+ (Coalesce (( (n.necesidad) *ind.precio)
* ( COALESCE (aem.nivelactividadmanual,0)
+ COALESCE (aea.nivelactividadautomatico,0)
+COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.flete/100

+(Coalesce (( (n.necesidad) *ind.precio)
* ( COALESCE (aem.nivelactividadmanual,0)
+ COALESCE (aea.nivelactividadautomatico,0)
+ COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.contingencia/100 ,0))
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.nom_indicador ind
ON(n.idindicador = ind.idindicador AND
ind.estado = 1 AND
ind.idaprobacion >= 3 AND
ind.nivel = 1
)
WHERE n.idactividad = a.idactividad AND n.idejercicio = 1))+
( SELECT round( SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0)
+(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.flete/100+
(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.contingencia/100,0)
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.nom_indicador ind
ON(n.idindicador = ind.idindicador AND
    ind.estado = 1 AND
    ind.idaprobacion >= 3 AND
    ind.nivel = 1
)

WHERE n.idactividad = a.idactividad AND n.idejercicio
= {$params['idejercicio']}
GROUP BY
ind.flete,
ind.contingencia

)";
        } else {

            $calcularimporte = "0";
            $calcularimporteAjustado = "0";
            $calcularimporteFinal = "0";
        }
//$calcularimporteAjustado = "0";
//$calcularimporteFinal = "0";
        /* LISTAR CONSOLIDADO DE ACTVIDADES CON NIVELES */

        $start = $params['start'];
        $limit = $params['limit'];

        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT a.idactividad,a.codigo,a.denominacion,
                        a.descripcion,a.idespecialidad,
                        SUM( COALESCE(aea.nivelactividadautomatico,0)) as nivelactividadautomatico ,
                        SUM( COALESCE(aem.nivelactividadmanual,0)) as nivelactividadmanual ,
                        SUM( COALESCE(aep.nivelactividadproduccion,0 )) as nivelactividadproduccion,
                        '0' as nivelactividad,
                        round(SUM( COALESCE(ae.ajuste,0) ),4) as ajuste,
                        AVG(
                        CASE WHEN
                        COALESCE(ae.idaprobacion,1) = 1
                        THEN
                        /*ae.idaprobacion + 2*/
                        -100
                        ELSE
                        ae.idaprobacion
                        END
                        ) as idaprobacion,
                        mod.idmodelo,
                        mod.denominacion as denmodelo,
                        $calcularimporte as importe,
                        $calcularimporteAjustado as importeajustado,
                        $calcularimporteFinal as importefinal,
                        aec.iddatosnomenclador,
                        aec.idespecialidad as idespcomportamiento,
                        ( COALESCE ( anp.nivelproduccion,0) - COALESCE ( (SELECT SUM(
                        COALESCE (subaem.nivelactividadmanual,0)+ COALESCE
                        (subaea.nivelactividadautomatico,0) +
                        COALESCE (subaep.nivelactividadproduccion,0)
                        )
                        FROM mod_planificacion.dat_actividadentidad subae
                        LEFT JOIN mod_planificacion.dat_actividadentidadmanual subaem
                        ON(subaem.idactividadentidad = subae.idactividadentidad)
                        LEFT JOIN mod_planificacion.dat_actividadentidadautomatico subaea
                        ON(subaea.idactividadentidad = subae.idactividadentidad)
                        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion subaep
                        ON( subaep.idactividadentidad = subae.idactividadentidad)
                        WHERE subae.idejercicio = {$params['idejercicio']}
                        AND subae.idactividadentidad is not null
                        AND subae.identidad IN ("
                . $strEntidadesProductoras .
                ")
                        AND subae.idactividad = a.idactividad
                        ),0) )  as restoxdistrib,
                        ( SELECT aec2.idespecialidad
                        FROM mod_planificacion.dat_actespcomportamiento aec2
                        WHERE a.idactividad = aec2.idactividad
                        AND a.idespecialidad  IN($strEspecialidadesDemandantes)
                        AND aec2.iddatosnomenclador = {$iddatosnomanclador['demandada']}
                            AND aec2.idespecialidad <> a.idespecialidad
                        OFFSET 0 LIMIT 1 ) as existe_demanda,
                        '-' as nivelactividadct
                        FROM mod_planificacion.nom_actividad a
                        INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                        ON(a.idactividad = aec.idactividad AND aec.idespecialidad
                        IN($strEspecialidadesDemandantes))
                        " . (($solonivel == 'true') ? "INNER" :
                        "LEFT") . " JOIN dat_actividadentidad ae
                        ON(ae.idactespcomportamiento = aec.idactespcomportamiento
                        AND ae.identidad IN( $strEntidades )
                        AND ae.idejercicio =  {$params['idejercicio']} )
                        
                        LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                        ON(aem.idactividadentidad = ae.idactividadentidad)
                        
                        LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                        ON(aea.idactividadentidad = ae.idactividadentidad)
                        
                        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                        ON( aep.idactividadentidad = ae.idactividadentidad)
                        
                        LEFT JOIN mod_planificacion.dat_actividadmodelo am
                        ON(am.idactividad = a.idactividad)
                        
                        LEFT JOIN mod_planificacion.dat_modelo mod
                        ON(mod.idmodelo = am.idmodelo)
                        LEFT JOIN mod_planificacion.dat_actividadnivelproduccion anp
                        ON(anp.idactividad = a.idactividad )
                        WHERE
                        a.normada = 1
                        AND ( a.idaprobacion >= 3 )
                        AND a.estado = 1
                        AND a.nivel = {$params['nivel']}
                        $ADDWHERE
                            GROUP BY
                            a.idactividad,
                            a.codigo,
                            a.denominacion,
                            a.descripcion,
                            a.idespecialidad,
                            mod.denominacion,
                            aec.idespecialidad,
                            aec.iddatosnomenclador,
                            anp.nivelproduccion,
                            mod.idmodelo,
                            ae.ajuste,
                            aem.nivelactividadmanual,
                            aea.nivelactividadautomatico,
                            aep.nivelactividadproduccion
                        ORDER BY mod.idmodelo,a.codigo,a.denominacion
                        
                        OFFSET $start
                        LIMIT $limit";

        $query
                .= "OFFSET ?
                 LIMIT ?";
        $arrayParametros[] = $params['start'];

        $arrayParametros[] = $params['limit'];
        $res = $conn->execute($query);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);


        /*         * *** Calculo del pÃ¡ginado **** */

        if ($params['calcularimporte'] == 'true') {
            //  CALCULAR EL IMPORTE
            $conn = Doctrine_Manager::connection();
            $queryDos = "SELECT sum(mialias.importe) as importe
                                FROM (SELECT
DISTINCT a.idactividad,
$calcularimporte as importe

FROM nom_actividad a

INNER JOIN dat_actespcomportamiento aec
ON(a.idactividad = aec.idactividad AND aec.idespecialidad
IN($strEspecialidadesDemandantes))
" . (($solonivel == true) ? "INNER" :
                            "LEFT") . " JOIN dat_actividadentidad ae
ON(ae.idactespcomportamiento = aec.idactespcomportamiento
AND ae.identidad IN( $strEntidades )
AND ae.idejercicio = {$params['idejercicio']} )

LEFT JOIN dat_actividadentidadmanual aem
ON(aem.idactividadentidad = ae.idactividadentidad)

LEFT JOIN dat_actividadentidadautomatico aea
ON(aea.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
ON( aep.idactividadentidad = ae.idactividadentidad)

LEFT JOIN dat_actividadmodelo am
ON(am.idactividad = a.idactividad)

LEFT JOIN dat_modelo mod
ON(mod.idmodelo = am.idmodelo)

WHERE
a.idactividad IN (
SELECT subnorma.idactividad
FROM mod_planificacion.dat_norma subnorma
WHERE subnorma.idactividad = a.idactividad  AND
subnorma.idejercicio = {$params['idejercicio']} )
AND
a.idaprobacion >= 3
AND a.idaprobacion <= 4
AND a.estado = 1
AND a.nivel = $this->nivel
$ADDWHERE
GROUP BY a.idactividad,
aem.nivelactividadmanual, aea.nivelactividadautomatico,
aep.nivelactividadproduccion
)  mialias
";

            $res = $conn->execute(
                    $queryDos, $arrayParametrostotal
            ); // $array_parametros
            $resultImp = $res->fetchAll(PDO::FETCH_ASSOC);


            $data->importetotal += $resultImp[0]['importe'];
        }
        $data->importetotal = number_format($data->importetotal, '3', '.', ',');

        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $arrayTmpespecialidades = array();

        foreach ($data->data as $indice => $actividad) {
            $data->data[$indice]['importe'] = number_format(
                    $actividad['importe'], '3', '.', ','
            );
            $data->data[$indice]['importeajustado'] = number_format(
                    $actividad['importeajustado'], '3', '.', ','
            );
            $data->data[$indice]['importefinal'] = number_format(
                    $actividad['importefinal'], '3', '.', ','
            );
            $data->data[$indice]['esorigenautomatico'] = 0;
            if ($arrayTmpespecialidades['den_' . $actividad['idespecialidad']] == null
            ) {
                $especialidades = $this->nomenclador->selectParam(
                        'nom_especialidad', array('denespecialidad'), 0, 0, "idespecialidad = " . $actividad['idespecialidad']
                );
                $arrayTmpespecialidades['den_' . $actividad['idespecialidad']] = $especialidades[0]['denespecialidad'];
            }
            $data->data[$indice]['denespecialidad'] = $arrayTmpespecialidades['den_'
                    . $actividad['idespecialidad']];
            $data->data[$indice]['importe_total_paginado'] = $data->importetotal;
            $data->data[$indice]['sololectura'] = true;
            if ($actividad['nivelactividadmanual'] == null) {
                $data->data[$indice]['nivelactividadmanual'] = 0;
            }
            if ($actividad['nivelactividadautomatico'] == '0') {
                $data->data[$indice]['nivelactividadautomatico'] = 0;
            } else {
                $data->data[$indice]['esorigenautomatico'] = 1;
            }
            if ($actividad['idaprobacion'] == null) {
                $data->data[$indice]['idaprobacion'] = '1';
            }
            $data->data[$indice]['nivelactividad'] = $data->data[$indice]['nivelactividadmanual'] +
                    $data->data[$indice]['nivelactividadautomatico'] + $data->data[$indice]['nivelactividadproduccion'];
            $data->data[$indice]['comportamiento'] = ($actividad['iddatosnomenclador'] == $iddatosnomanclador['compartidaautomatico'] || $actividad['iddatosnomenclador'] == $iddatosnomanclador['compartida']) ? 1 : 0;
            if ($actividad['iddatosnomenclador'] == $iddatosnomanclador['propia']
            ) {
                $data->data[$indice]['comportamiento'] = -1;
            }
            if ($actividad['existe_demanda'] == null) {
                $data->data[$indice]['restoxdistrib'] = '-';
            }
            if ($actividad['ajuste'] == '0.000') {
                $data->data[$indice]['ajuste'] = '0';
            }
        }
        return $data;
    }

    public function aprobarDesaprobarNivelAct($params) {

        if ($params['actividades'][0] != null) {
            $queryUpdate = Doctrine_Query::create();
            $queryUpdate->update("DatActividadentidad")->set(
                    "idaprobacion", $params['idaprobacion']
            )->whereIn('idactividad', $params['actividades'])->addWhere(
                    'identidad = ? AND idejercicio=?', array($params['identidad'], $params['idejercicio'])
            );
            if ($params['esrector'] == false) {
                $queryUpdate->addWhere(
                        'idaprobacion <> 4 OR idaprobacion <> 5'
                );
            }
            $queryUpdate->execute();
        }

        return true;
    }

    private function addHavigConParamsFoo(&$addHaving, $columCond, $param) {
        $addHaving .= " AND " . $columCond . $param;
//$params_query[] = $param;
    }

    public function aprobar_desaprobarTodosNivelesActividad($identidad, $idejercicio, $idaprobacion, $entidadesHijas = null, $esrector = null, $aux, $idespecialidades
    ) {
        $params['idejercicio'] = $idejercicio;
        $params['exportar'] = true;
        $params['id_especialidades'] = $idespecialidades;
        if ($entidadesHijas != null && $entidadesHijas[0] != null) {
            foreach ($entidadesHijas as $valueEnt) {
                $params['entidades'][0] = $valueEnt;
                $datos = self::listarActsNivActPorEntidad($params);
                foreach ($datos->data as $val) {
                    if ($val['nivelactividad'] > 0) {
                        $Where = "";
                        if ($esrector != true) {
                            $Where .= " AND idaprobacion <> 4";
                        }
                        if ($aux == "false") {
                            if ($idaprobacion == 5) {
                                $Where .= " AND idaprobacion = 4";
                                $Where .= " AND ajuste > 0";
                            }
                        }
                        $conn = Doctrine_Manager::connection();
                        $query = "UPDATE mod_planificacion.dat_actividadentidad
                         SET idaprobacion = $idaprobacion
                          WHERE  identidad IN ($valueEnt) AND idactividad={$val['idactividad']} AND idejercicio = $idejercicio $Where";
                        $conn->execute($query);
                    }
                }
            }
        } else {
            $params['entidades'][0] = $identidad;
            $data = self::listarActsNivActPorEntidad($params);
            foreach ($data->data as $val) {
                if ($val['nivelactividad'] > 0) {
                    $Where = "";
                    if ($esrector != true) {
                        $Where .= " AND idaprobacion <> 4";
                    }
                    if ($aux == "false") {
                        if ($idaprobacion == 5) {
                            $Where .= " AND idaprobacion = 4";
                            $Where .= " AND ajuste > 0";
                        }
                    }
                    $conn = Doctrine_Manager::connection();
                    $query = "UPDATE mod_planificacion.dat_actividadentidad
                            SET idaprobacion = $idaprobacion
                             WHERE  identidad = $identidad AND idactividad={$val['idactividad']} AND idejercicio = $idejercicio $Where";
                    $conn->execute($query);
                }
            }
        }

        return true;
    }

    public function listarActsNivActPorEntidad($params) {
        $arrayParametros = array();
        $arrayParametrosTotal = array();
        $condiciones = array();
        $addHaving = " ";
        $whereconsX = " where true ";
        $addHavingSUM = "HAVING true  ";
        $arraysalida = array_filter($params['id_especialidades']);
        if (empty($arraysalida)) {
            return -1;
        }

        $strEntidades = implode(',', $params['entidades']);

        $strEspecialidades = implode(',', $arraysalida);
        $arrayParametros[0] = $params['idejercicio'];
        $arrayParametros[1] = $params['idespecialidad'];
        $arrayParametros[2] = $params['idespecialidad'];
        $arrayParametros[3] = $params['idejercicio'];
        $arrayParametros[4] = $params['identidad'];
        $arrayParametros[5] = $params['idespecialidad'];
        $arrayParametrosTotal[0] = $params['idespecialidad'];
        $arrayParametrosTotal[1] = $params['idejercicio'];
        $arrayParametrosTotal[2] = $params['idejercicio'];
        $arrayParametrosTotal[3] = $params['identidad'];
        /* aki se verifica si viene calcular importe */
        if ($params['calcularimporte'] == 'true') {
            $arrayParametros[0] = $params['idejercicio'];
            $arrayParametros[1] = $params['idespecialidad'];
            $arrayParametros[2] = $params['idespecialidad'];
            $arrayParametros[3] = $params['idejercicio'];
            $arrayParametros[4] = $params['idejercicio'];
            $arrayParametros[5] = $params['identidad'];
            $arrayParametros[6] = $params['idespecialidad'];
            $arrayParametrosImp[0] = $params['idespecialidad'];
            $arrayParametrosImp[1] = $params['idejercicio'];
            $arrayParametrosImp[2] = $params['idejercicio'];
            $arrayParametrosImp[3] = $params['identidad'];
        }
        if ($params['calcularimporte'] == 'true') {
            $arrayParametros[0] = $params['idejercicio'];
            $arrayParametros[1] = $params['idespecialidad'];
            $arrayParametros[2] = $params['idespecialidad'];
            $arrayParametros[3] = $params['idejercicio'];
            $arrayParametros[4] = $params['idejercicio'];
            $arrayParametros[5] = $params['identidad'];
            $arrayParametros[6] = $params['idespecialidad'];
            $arrayParametrosImp[0] = $params['idespecialidad'];
            $arrayParametrosImp[1] = $params['idejercicio'];
            $arrayParametrosImp[2] = $params['idejercicio'];
            $arrayParametrosImp[3] = $params['identidad'];
        }
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "a.codigo LIKE '" . $datos['data']['value'] . "%'";
                    $arrayParametros[] = $datos['data']['value'] . "%";
                    $arrayParametrosTotal[] = $datos['data']['value'] . "%";
                    $arrayParametrosImp[] = $datos['data']['value'] . "%";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(a.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                    } else {
                        if ($datos['field'] == 'descripcion') {
                            $condiciones[] = "upper(a.descripcion) LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                        } else {
                            if ($datos['field'] == 'denespecialidad') {
                                $condiciones[] = "a.idespecialidad = " . $datos['data']['value'] . " ";
                                $arrayParametros[] = $datos['data']['value'];
                                $arrayParametrosTotal[] = $datos['data']['value'];
                                $arrayParametrosImp[] = $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'comportamiento') {
                                    $comportamiento = array();
                                    $comportamiento = split(",", $datos['data']['value']);
                                    $iddatosnom = array();
                                    $iddatosnomcad = '';
                                    foreach ($comportamiento as $dat) {
                                        if ($dat == 'Propia') {
                                            $iddatosnom[] = $iddatosnomanclador['propia'];
                                        }
                                        if ($dat == 'Demandada') {
                                            $condicionescomport[] = "aec.iddatosnomenclador = " . $iddatosnomanclador['demandada'] . " ";
                                            $iddatosnom[] = $iddatosnomanclador['demandada'];
                                        }
                                        if ($dat == 'Compartida') {
                                            $condicionescomport[] = "aec.iddatosnomenclador = " . $iddatosnomanclador['compartida'] . " ";
                                            $iddatosnom[] = $iddatosnomanclador['compartida'];
                                        }
                                    }
                                    if ($iddatosnom[0]) {
                                        $iddatosnomcad = implode(',', $iddatosnom);
                                        $condiciones[] = "aec.iddatosnomenclador IN ($iddatosnomcad)";
                                    }
                                } else {
                                    if ($datos['field'] == 'nivelactividadautomatico' || $datos['field'] == 'nivelactividadmanual' ||
                                            $datos['field'] == 'nivelactividadproduccion' || $datos['field'] == 'nivelactividad' ||
                                            $datos['field'] == 'restoxdistrib' || $datos['field'] == 'ajuste' || $datos['field'] == 'nivelactividadajuste' ||
                                            $datos['field'] == 'importe' || $datos['field'] == 'importeajustado' || $datos['field'] == 'importefinal'
                                    ) {
                                        if ($datos['data']['comparison'] == 'lt') {
                                            $sqlSigno = "<";
                                        } else {
                                            if ($datos['data']['comparison'] == 'gt') {
                                                $sqlSigno = ">";
                                            } else {
                                                $sqlSigno = "=";
                                            }
                                        }

                                        if ($datos['field'] == 'nivelactividadautomatico') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividadautomatico), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividadmanual') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividadmanual), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividadproduccion') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividadproduccion), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividad') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.nivelactividad), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'restoxdistrib') {
                                            $whereconsX .= "and x.restoxdistrib " . $sqlSigno . $datos['data']['value'];
                                        }
                                        if ($datos['field'] == 'ajuste') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND(COALESCE(SUM(x.ajuste), 0),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'nivelactividadajuste') {
                                            self::addHavigConParamsFoo($addHavingSUM, " ROUND((COALESCE(SUM(x.nivelactividad), 0)+COALESCE(SUM(x.ajuste),0)),4)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'importe') {
                                            self::addHavigConParamsFoo($addHavingSUM, " SUM(x.importesumado)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'importeajustado') {
                                            self::addHavigConParamsFoo($addHavingSUM, " SUM(x.importeajuste)" . $sqlSigno, $datos['data']['value']);
                                        }
                                        if ($datos['field'] == 'importefinal') {
                                            self::addHavigConParamsFoo($addHavingSUM, " SUM(x.importefinal)" . $sqlSigno, $datos['data']['value']);
                                        }
                                    } else {
                                        if ($datos['field'] == 'idaprobacion') {
                                            if ($datos['data']['value'] == 'No') {
                                                $whereconsX .= " and x.idaprobacion = 1";
                                            } else {
                                                if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí') {
                                                    $whereconsX .= " and x.idaprobacion >= 3";
                                                } else {
                                                    if ($datos['data']['value'] == 'Rector') {
                                                        $whereconsX .= " and x.idaprobacion = 4";
                                                    } else {
                                                        if ($datos['data']['value'] == 'Ajuste') {
                                                            $whereconsX .= " and x.idaprobacion = 5";
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            if ($datos['field'] == 'denmodelo') {
                                                if ($datos['data']['value'] == '-')
                                                    $condiciones[] = "mod.idmodelo IS NULL";
                                                else
                                                    $condiciones[] = "mod.idmodelo = {$datos ['data']['value']}";
                                            } else {
                                                if ($datos['field'] == 'desglosada') {
                                                    if ($datos['data']['value'] == 'No') {
                                                        $addHavingSUM .= " and COALESCE(MIN(x.desglosada),0) = 0";
                                                    }
                                                    if ($datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'Si') {
                                                        $addHavingSUM .= " and COALESCE(MIN(x.desglosada),0) =1";
                                                    }
                                                    if ($datos['data']['value'] == 'Parcial' || $datos['data']['value'] == 'Parcial') {
                                                        $addHavingSUM .= " and COALESCE(MIN(x.desglosada),0) =2";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }

        $HAVING = " HAVING true ";
        foreach ($arrayHaving as $condicion) {
            if ($HAVING == "") {
                $HAVING = 'AND ' . $condicion;
            } else {
                $HAVING = $HAVING . " AND " . $condicion;
            }
        }
        /*         * ****** FIN FILTROS ******* */
        $innerJoinNormaIndicador = "";
        $groupBy = "";


        if ($params['calcularimporte'] == 'true') {
            $calImporte = "(
                select (Coalesce(SUM((n.necesidad) * indp.precio) *
                
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0) +
                
                (Coalesce(SUM((n.necesidad) * indp.precio * indp.flete) *                
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0)) / 100 +               
                
                
                (Coalesce(SUM((n.necesidad) * indp.precio * indp.contingencia)*
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0)) / 100) as importeajuste
                
                
                from mod_planificacion.dat_norma n
                     INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                       n.idindicador = ind.idindicador AND ind.estado = 1)
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (
                       n.idindicador = indp.idindicador AND indp.nivelplanif = 1
                       AND (indp.idaprobacion = 3 OR indp.idaprobacion = 4))
                where n.idactividad = a.idactividad AND
                      n.idejercicio = {$params ['idejercicio'] })";


            $calImporteAjustado = "(
                select (SUM((n.necesidad) * indp.precio) *
                  ROUND(COALESCE(ae.ajuste, 0),4) +
                  
                  (SUM((n.necesidad) *indp.precio * indp.flete) * 
                  ROUND(COALESCE(ae.ajuste, 0),4)) / 100 +
                  
                  (SUM((n.necesidad) * indp.precio *indp.contingencia) * 
                  ROUND(COALESCE(ae.ajuste, 0),4)) / 100) as  importeajustado
                  
                from mod_planificacion.dat_norma n
                     INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                       n.idindicador = ind.idindicador AND ind.estado = 1)
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (
                       n.idindicador = indp.idindicador AND indp.nivelplanif = 1
                       AND (indp.idaprobacion = 3 OR indp.idaprobacion = 4))
                where n.idactividad = a.idactividad AND
                      n.idejercicio = {$params ['idejercicio'] })";


            $calImporteFinal = "(
                select (Coalesce(SUM((n.necesidad) * indp.precio)*
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0) +
                
                (Coalesce(SUM((n.necesidad) * indp.precio * indp.flete) *
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0)) / 100 +
                
                (Coalesce(SUM((n.necesidad) * indp.precio * indp.contingencia)*
                (ROUND(COALESCE(aem.nivelactividadmanual, 0),4) + 
                ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + 
                ROUND(COALESCE(aep.nivelactividadproduccion, 0),4)), 0)) / 100 +
                
                (round(SUM((n.necesidad) * indp.precio) * 
                ROUND(COALESCE(ae.ajuste, 0),4) +
                (SUM((n.necesidad) * indp.precio * indp.flete) * 
                ROUND(COALESCE(ae.ajuste, 0),4)) / 100 +
                (SUM((n.necesidad) * indp.precio * indp.contingencia) * 
                ROUND(COALESCE(ae.ajuste, 0),4)) / 100, 3))) as importefinal
                  
                  
                from mod_planificacion.dat_norma n
                     INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                       n.idindicador = ind.idindicador AND ind.estado = 1)
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (
                       n.idindicador = indp.idindicador AND indp.nivelplanif = 1
                       AND (indp.idaprobacion = 3 OR indp.idaprobacion = 4))
                where n.idactividad = a.idactividad AND
                      n.idejercicio = {$params ['idejercicio'] })";

            //$umedida = "ind.idumedida,";
        } else {
            $calImporte = 0;
            $calImporteAjustado = 0;
            $calImporteFinal = 0;
        }

        if (!$params['start']) {
            $params['start'] = 0;
        }
        if (!$params['limit']) {
            $params['limit'] = 1;
        }
        /* consolidar */
        if ($params['exportar']) {
            $offsetLimit = "";
            $WhereExportarNivel = "AND ROUND((ROUND(
  COALESCE(aea.nivelactividadautomatico, 0), 4) + ROUND(COALESCE(
  aem.nivelactividadmanual, 0), 4) + ROUND(COALESCE(
  aep.nivelactividadproduccion, 0), 4)), 4) > 0";
        } else {
            $WhereExportarNivel = "";
            $offsetLimit = " OFFSET  {$params['start']}
                        LIMIT  {$params['limit']}";
        }

        $principoconsultaImportesTotales = "SELECT SUM (foo.importesumado),
                                            SUM (foo.importeajuste),
                                            SUM (foo.importefinal)
                                            FROM(";
        $finConsultaTotales = ") as foo";

        $conn = Doctrine_Manager::connection();
        $condicionPlan = '';
        $condicionPlanDos = '';
        if (isset($params['idmodelo'])) {
            if (!$params['exportar'])
                $condicionPlan = " AND am.idmodelo = {$params['idmodelo']} AND ae.idaprobacion >= 3 ";
            else
                $condicionPlan = " AND am.idmodelo = {$params['idmodelo']}";
            $condicionPlanDos = " AND COALESCE(MIN(x.desglosada),0)=1 ";
        }

        $importes = "";
        $sumaimporte = "";

        if (isset($params['columnasamostrar'])) {
            if (in_array('importe', $params['columnasamostrar'])) {
                $importes .= " $calImporte as importesumado,";
                $sumaimporte .= "SUM(x.importesumado) as importesumado,";
            } else {
                $importes .= " 0 as importesumado,";
                $sumaimporte .= "SUM(x.importesumado) as importesumado,";
            }

            if (in_array('importeajustado', $params['columnasamostrar'])) {
                $importes .= " $calImporteAjustado as importeajuste,";
                $sumaimporte .= "SUM(x.importeajuste) as importeajuste,";
            } else {
                $importes .= "0 as importeajuste,";
                $sumaimporte .= "SUM(x.importeajuste) as importeajuste,";
            }

            if (in_array('importefinal', $params['columnasamostrar'])) {
                $importes .= "  $calImporteFinal as importefinal,";
                $sumaimporte .= "SUM(x.importefinal) as importefinal,";
            } else {
                $importes .= "  0 as importefinal,";
                $sumaimporte .= "SUM(x.importefinal) as importefinal,";
            }
        } else {
            $importes .= " $calImporte as importesumado,";
            $sumaimporte .= "SUM(x.importesumado) as importesumado,";
            $importes .= " $calImporteAjustado as importeajuste,";
            $sumaimporte .= "SUM(x.importeajuste) as importeajuste,";
            $importes .= "  $calImporteFinal as importefinal,";
            $sumaimporte .= "SUM(x.importefinal) as importefinal,";
        }


        if (in_array('denmodelo', $params['columnasamostrar'])) {

            $addcolumnamodelox = ' x.idmodelo,x.denominacion as denmodelo,';
            $addcolumnamodelo = 'mod.idmodelo, mod.denominacion as denmodelo,';

            $innerJoiModelo = 'LEFT JOIN mod_planificacion.dat_modelo mod
                ON(mod.idmodelo = am.idmodelo)';
            $groupmodelo = 'mod.idmodelo,mod.denominacion,';
            $groupmodelox = 'x.idmodelo,x.denominacion,';
        }
        $sql = "SELECT count(*) OVER() as total,x.idactividad as idactividad,
    x.codigo,
    x.denominacion,
    x.denmodelo as denmodelo,
    x.idmodelo,
                ROUND(COALESCE(SUM(x.nivelactividadautomatico), 0),4) AS nivelactividadautomatico,
                ROUND(COALESCE(SUM(x.nivelactividadmanual), 0),4) AS nivelactividadmanual,
                ROUND(COALESCE(SUM(x.nivelactividadproduccion), 0),4) AS nivelactividadproduccion,
    x.descripcion,
    x.idespecialidad,
                ROUND(COALESCE(SUM(x.nivelactividad), 0),4) as nivelactividad,
    $sumaimporte
                ROUND(COALESCE(SUM(x.ajuste),0),4) as ajuste,
    x.idaprobacion,
    $addcolumnamodelox
    x.iddatosnomenclador,
    x.restoxdistrib,
    x.existe_demanda,
    COALESCE(MIN(x.desglosada),0) as desglosada,
    COALESCE(SUM(x.cantdesglosada),0) AS cantdesglosada
                FROM
                (
WITH cantdesg as (
                SELECT SUM(des.nivelactivdesglosado) as desglose, des.idactividadentidad
                FROM mod_planificacion.dat_desgloseentidadnivel des               
               GROUP BY des.idactividadentidad
              )                
SELECT
a.idactividad as idactividad,
a.codigo,
a.denominacion,
mod.denominacion as denmodelo,
mod.idmodelo,

ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) AS nivelactividadautomatico,
ROUND(COALESCE(aem.nivelactividadmanual, 0),4) AS nivelactividadmanual,
ROUND(COALESCE(aep.nivelactividadproduccion,0),4) AS nivelactividadproduccion,

a.descripcion,
a.idespecialidad,

ROUND((ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) +
       ROUND(COALESCE(aem.nivelactividadmanual, 0),4) +
       ROUND(COALESCE(aep.nivelactividadproduccion,0),4)),4)  as nivelactividad,
       
c.desglose as cantdesglosada,
 case
                when 
                c.desglose = 0 then 0
                WHEN
                c.desglose =(ROUND(COALESCE(aea.nivelactividadautomatico, 0),4) + ROUND(COALESCE(
                aem.nivelactividadmanual, 0),4) + ROUND(COALESCE(
                aep.nivelactividadproduccion, 0),4) + ROUND(COALESCE(ae.ajuste, 0),4)) 
                then 1  
                WHEN                              
                c.desglose > 0 then 2
              end as desglosada,
$importes
    
ROUND(COALESCE(ae.ajuste, 0), 4) as ajuste,
                
                COALESCE((SELECT DISTINCT MIN (idaprobacion)
                FROM mod_planificacion.dat_actividadentidad
                WHERE (identidad IN ({$strEntidades}) OR identidad IS NULL) AND idactividad = a.idactividad
                AND idejercicio = {$params['idejercicio']}),1) as idaprobacion,
                $addcolumnamodelo
                aec.iddatosnomenclador,
                
                ( ROUND(COALESCE ( anp.nivelproduccion,0),4) - COALESCE ( (SELECT SUM(
ROUND(COALESCE (subaem.nivelactividadmanual,0),4)+
ROUND(COALESCE (subaea.nivelactividadautomatico,0),4) +     COALESCE (subaep.nivelactividadproduccion,0) )
            FROM mod_planificacion.dat_actividadentidad subae
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual subaem
            ON(subaem.idactividadentidad = subae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico subaea
            ON(subaea.idactividadentidad = subae.idactividadentidad)
            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion subaep
            ON( subaep.idactividadentidad = subae.idactividadentidad)
            WHERE subae.idejercicio = {$params['idejercicio']}
            AND subae.idactividadentidad is not null AND subae.identidad IN (-1)
            AND subae.idactividad = a.idactividad),0) )  as restoxdistrib,
            
                COALESCE((SELECT aec2.idespecialidad
                    FROM mod_planificacion.dat_actespcomportamiento aec2
                    WHERE a.idactividad = aec2.idactividad
                    AND a.idespecialidad  IN({$strEspecialidades})
                    AND aec2.iddatosnomenclador = 156  AND aec2.idespecialidad <> a.idespecialidad
                    OFFSET 0 LIMIT 1),0 ) as existe_demanda
            FROM mod_planificacion.nom_actividad a

            INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                ON (a.idactividad = aec.idactividad AND aec.idespecialidad IN({$strEspecialidades}))
            INNER JOIN mod_planificacion.dat_norma n 
            ON (n.idactividad = a.idactividad and n.idejercicio={$params['idejercicio']})
            " . $innerJoinNormaIndicador . "
            LEFT JOIN mod_planificacion.dat_actividadentidad ae
                ON (ae.idactespcomportamiento = aec.idactespcomportamiento
      AND (ae.idejercicio =  {$params['idejercicio']} or ae.idejercicio is null)
             AND (ae.identidad IN ({$strEntidades}) or ae.identidad is null) )
            
            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON(aem.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON(aea.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( aep.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadmodelo am
                    ON(am.idactividad = a.idactividad)
            LEFT JOIN mod_planificacion.dat_modelo mod ON (mod.idmodelo =
             am.idmodelo)

            $innerJoiModelo

            LEFT JOIN mod_planificacion.dat_actividadnivelproduccion anp
                ON(anp.idactividad = a.idactividad)
            LEFT JOIN cantdesg c ON ae.idactividadentidad = c.idactividadentidad

            WHERE a.nivel={$this->nivel} AND a.idaprobacion =4 AND a.estado=1 $WhereExportarNivel

            " . $WHERE . " " . $condicionPlan . "

            GROUP BY
                a.idactividad,
                a.codigo,
                a.denominacion,
                mod.denominacion,
                mod.idmodelo,
                a.descripcion,
                a.idespecialidad,
                ae.idactividadentidad,
                aea.nivelactividadautomatico,
                aem.nivelactividadmanual,
                aep.nivelactividadproduccion,
                $groupmodelo
                aec.iddatosnomenclador,
                aec.idespecialidad,
                anp.nivelproduccion,
                ae.identidad,
                ae.ajuste,
                c.desglose
                " . $groupBy . "
                " . $HAVING . $addHaving . "
                ORDER BY a.codigo) as x
                $whereconsX               
                GROUP BY
                x.idactividad,
                x.codigo,
                x.denmodelo,
                x.descripcion,
                x.idespecialidad,
                x.idaprobacion,
                x.idmodelo,
                $groupmodelox
	        x.denominacion,
                x.iddatosnomenclador,
                x.idespecialidad,
                x.restoxdistrib,
                x.existe_demanda
                $addHavingSUM $condicionPlanDos
		ORDER BY x.codigo";
        $data->data = $conn->execute($sql . $offsetLimit)->fetchAll(PDO::FETCH_ASSOC);

        $data->total = $data->data[0]['total'];

        /* CALCULAR IMPORTE TOTAL DE LAS ACTIVIDADES */
        $TOTAL = $conn->execute($principoconsultaImportesTotales . $sql . $finConsultaTotales)->fetchAll();
        $data->importe = number_format($TOTAL[0][0], '3', '.', ',');
        $data->importeajuste = number_format($TOTAL[0][1], '3', '.', ',');
        $data->importefinal = number_format($TOTAL[0][2], '3', '.', ',');
        /* FIN CALCULAR IMPORTE TOTAL DE LAS ACTIVIDADES */

        $this->nomenclador = new ZendExt_Nomencladores_ADT();

        $arrayTmpmodelos = array();
        foreach ($data->data as $indice => $valor) {
            $data->data[$indice]['importe_total_paginado'] = 333; //$importe_total;
            $data->data[$indice]['importe'] = number_format($valor['importesumado'], '3', '.', ',');
            $data->data[$indice]['importeajustado'] = number_format($valor['importeajuste'], '3', '.', ',');
            $data->data[$indice]['importefinal'] = number_format($valor['importefinal'], '3', '.', ',');
            $data->data[$indice]['identidad'] = ($valor['identidad'] != null) ? $valor['identidad'] : $params['identidad'];
            $data->data[$indice]['sololectura'] = false;
            $data->data[$indice]['esorigenautomatico'] = ($valor['nivelactividadautomatico'] > 0) ? '1' : '0';
            if ($arrayTmpmodelos['den_' . $valor['idmodelo']] == null && $valor['idmodelo'] != null) { //optimizado
                $arrayTmpmodelos['den_' . $valor['idmodelo']] = Doctrine::getTable('DatModelo')->find($valor['idmodelo'])->denominacion;
            }

            $data->data[$indice]['denmodelo'] = $arrayTmpmodelos['den_' . $valor['idmodelo']];

            $arrayTmpespecialidades = $this->integrator->datosmaestros->obtenerEspecialidadPorId($valor['idespecialidad']);

            $data->data[$indice]['denespecialidad'] = $arrayTmpespecialidades[0]->denespecialidad;
            if ($data->data[$indice]['idaprobacion'] >= 3) {
                $data->data[$indice]['sololectura'] = true;
            }
            $data->data[$indice]['comportamiento'] = -1;
            if ($valor['iddatosnomenclador'] == $iddatosnomanclador['demandada']) {
                $data->data[$indice]['comportamiento'] = '0';
            } else {
                if ($valor['iddatosnomenclador'] == $iddatosnomanclador['compartida']) {
                    $data->data[$indice]['comportamiento'] = '1';
                }
            }
            $data->data[$indice]['nivelactividadct'] = '-';
            if ($valor['existe_demanda'] == null) {
                $data->data[$indice]['restoxdistrib'] = '-';
            }
            if ($valor['ajuste'] == '0.000') {
                $data->data[$indice]['ajuste'] = '0.0000';
            }
        }

        return $data;
    }

    public function eliminarTodasAsociadasConActividad($idactividad) {

        $modeloActEnt = new DatActividadentidad();
        $asociaciones = DatActividadentidad::buscarEntidadAsociadasConActividad(
                        $idactividad
        );

        $arrayIdentidadades = array();
        foreach ($asociaciones as $asocActent) {
            $arrayIdentidadades[] = $asocActent->identidad;
            $this->actualizarAsociacionesAutomaticas(
                    $idactividad, 0, $asocActent->identidad
            );
        }

        if ($arrayIdentidadades[0] != null) {
            $queryElim = Doctrine_Query::create();
            $queryElim->delete('DatActividadentidad')->from(
                    'DatActividadentidad'
            )->whereIn('identidad', $arrayIdentidadades)->addWhere(
                    'idactividad = ?', $idactividad
            )->execute();
        }
        return true;
    }

    public function servNomAct_ActualizarNivActPorCambioEstadoOAprobacion($params
    ) {
        //Quitar este metodo

        $iddns = DatActespcomportamiento::obtenerIdDatosNom(true);
        $actividades = array();


        self::actualizarNivActAutomaticos(
                array('activs' => $params, 'iddns' => $iddns)
        );

        $actividades[] = $actividadPadre->idactividad;

        /* Eliminar */
        if ($actividades[0] != null) {
            $query = Doctrine_Query::create();
            $query->delete('DatActividadentidad')->from(
                    'DatActividadentidad ae'
            )->whereIn('ae.idactividad', $actividades)->execute();
        }
        return true;
    }

    public function copiarPegarNiveles($params) {
        /* Eliminar todos los niveles de la entidad destino de la copia */
        $query = Doctrine_Query::create();
        $query->delete('DatActividadentidad')->from('DatActividadentidad ae')
                ->addWhere('ae.idejercicio = ?', $params['idejercicio'])->addWhere(
                'ae.identidad = ?', $params['identidaddestino']
        )->addWhere('ae.idejercicio =?', $params['idejercicio'])->addWhere(
                "ae.idactespcomportamiento in (select idactespcomportamiento "
                . "from dat_actespcomportamiento where idespecialidad = ? )", $params['idesp_ident_origen']
        )->execute();
        /* Copiar niveles de la entidad origen a la entidad destino */
        $modeloActEnt = new DatActividadentidad();
        $arrayNiveles = DatActividadentidad::obtenerTodosNivelesEntidad(
                        $params['identidadorigen'], $params['idesp_ident_destino'], $params['idejercicio']
        );

        $modeloActEnt = new DatActividadentidad();
        $arrayNivelesrectordestino = DatActividadentidad::
                buscarActividadesAsociadasAEntidad(
                        $params['identidaddestino'], $params['idejercicio']
        );
        $arrayIndicesactvs = array();
        foreach ($arrayNivelesrectordestino as $valorIdact) {
            $arrayIndicesactvs['_' . $valorIdact[0]] = true;
        }
        //  $i = 0;
        $arrayNivelesrectordestino = null;
        foreach ($arrayNiveles as $valor) {
            if ($arrayIndicesactvs['_' . $valor['idactividad']] == true) {
                continue;
            }
            $objActEnt = new DatActividadentidad();
            $objActEnt->identidad = $params['identidaddestino'];
            $objActEnt->idejercicio = $valor['idejercicio'];
            $objActEnt->idactividad = $valor['idactividad'];
            $objActEnt->idaprobacion = 1;
            $objActEnt->idactespcomportamiento = $valor['idactespcomportamiento'];
            $objActEnt->save();
            if ($valor['DatActividadentidadmanual']['idactividadentidad'] != null
            ) {
                $objActEntManual = new DatActividadentidadmanual();
                $objActEntManual->idactividadentidad = $objActEnt->idactividadentidad;
                $objActEntManual->nivelactividadmanual = $valor['DatActividadentidadmanual']['nivelactividadmanual'];
                $objActEntManual->save();
            }
            if ($valor['DatActividadentidadautomatico']['idactividadentidad'] != null
            ) {
                $objActEntAuto = new DatActividadentidadautomatico();
                $objActEntAuto->idactividadentidad = $objActEnt->idactividadentidad;
                $objActEntAuto->idregla = $valor['DatActividadentidadautomatico']['idregla'];
                $objActEntAuto->nivelactividadautomatico = $valor['DatActividadentidadautomatico']['nivelactividadautomatico'];
                $objActEntAuto->save();
            }
        }
        return 24;
    }

    public function getIddatosnomenclador($comp) {
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        if ($comp == 0 || $comp == -1 || $comp == '0' || $comp == '-1') {
            return $iddatosnomanclador['demandada'];
        }
        if ($comp == 12 || $comp == '12') {
            return array($iddatosnomanclador['compartida'],
                $iddatosnomanclador['compartidaautomatico']);
        }
        return $iddatosnomanclador['compartida'];
    }

    public function servDesglose_ListarActsNivActPorEntidad($params) {

        $iddatosnomenclador = DatActespcomportamiento::obtenerIdDatosNom();
        $query = new Doctrine_Query();
        //$querytotal = new Doctrine_Query();
        // $condiciones = array();
        if ($params['filtros']) {
            foreach ($params['filtros'] as $filtro) {
                if ($filtro->field == 'codigo') {
                    $query->addWhere(
                            "a.codigo LIKE '" . ($filtro->data->value . "%'")
                    );
                } else {
                    if ($filtro->field == 'denominacion') {
                        $query->addWhere(
                                "upper(a.denominacion) LIKE '" . ("%" . strtoupper(
                                        $filtro->data->value
                                ) . "%'")
                        );
                    } else {
                        if ($filtro->field == 'descripcion') {
                            $query->addWhere(
                                    "upper(a.descripcion)   LIKE '" . ("%"
                                    . strtoupper($filtro->data->value) . "%'")
                            );
                        } else {
                            if ($filtro->field == 'denmodelo') {
                                if ($filtro->data->value == '-') {
                                    $query->addWhere("am.idmodelo IS NULL ");
                                } else {
                                    $query->addWhere(
                                            "am.idmodelo = " . $filtro->data->value
                                    );
                                }
                            } elseif ($filtro->field == 'idaprobacionactent') {
                                $condprob = " = 1";
                                if ($filtro->data->value[0] == 'Si') {
                                    $condprob = " = 3 ";
                                } else {
                                    if ($filtro->data->value[0] == 'Rector') {
                                        $condprob = " >= 4 ";
                                    }
                                }
                                $query->addWhere("ae.idaprobacion $condprob ");
                            } elseif ($filtro->field == 'comportamiento') {
                                $iddn = $iddatosnomenclador['propia'];
                                if ($filtro->data->value[0] == "Compartida") {
                                    $iddn = $iddatosnomenclador['compartida'];
                                } else {
                                    if ($filtro->data->value[0] == "Demandada"
                                    ) {
                                        $iddn = $iddatosnomenclador['demandada'];
                                    }
                                }
                                $query->addWhere(
                                        "aec.iddatosnomenclador = {$iddn} "
                                );
                            } elseif ($filtro->field == 'denespecialidad') {
                                $query->addWhere(
                                        "a.idespecialidad = " . $filtro->data->value
                                );
                            } elseif ($filtro->field == 'nivelactividad') {
                                $cond = "=";
                                if ($filtro->data->comparison == "gt") {
                                    $cond = ">";
                                } elseif ($filtro->data->comparison == "lt") {
                                    $cond = "<";
                                }
                                $query->addWhere(
                                        "( COALESCE(aem.nivelactividadmanual,0)+
                                      COALESCE(aea.nivelactividadautomatico,0)+
                        COALESCE(aep.nivelactividadproduccion,0) ) {$cond} "
                                        . $filtro->data->value
                                );
                            }
                        }
                    }
                }
            }
        }
        $query->addWhere('a.estado = 1');
        $query->addWhere('a.nivel = ' . $params['nivel']);
        $query->addWhere('a.idaprobacion >= 3');
        $query->addWhere('ae.identidad = ' . $params['identidad']);
        $query
                ->from('NomActividad a')
                ->leftJoin('a.DatActividadmodelo am')
                ->innerJoin(
                        'a.DatActespcomportamiento aec WITH aec.idespecialidad = '
                        . $params['idespecialidad']
                )
                ->innerJoin('aec.DatActividadentidad ae ')
                ->leftJoin('ae.DatActividadentidadmanual aem')
                ->leftJoin('ae.DatActividadentidadautomatico aea')
                ->leftJoin('ae.DatActividadentidadproduccion aep');
        $query->select('COUNT(a.idactividad) as total');
        $sqlCount = $query->getSqlQuery();
        $query->select(
                "a.idactividad,
                                                a.codigo,
                                                a.denominacion,
                                                a.descripcion,
                                                a.idespecialidad,
                                            am.idmodelo,
                                            aec.idactespcomportamiento,
                                            aec.iddatosnomenclador,
                                            ae.*,
                                            aea.*,
                                            aem.*,
                                            aep.*
                                            "
        );
        $query->orderby("a.codigo,a.denominacion");
        $conn = Doctrine_Manager::connection();
        $data->data = $conn->execute(
                $query->getSqlQuery()
                . " OFFSET {$params['start']} LIMIT {$params['limit']}"
        );
        $data->data = $data->data->fetchAll(PDO::FETCH_ASSOC);
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $arrayTmpespecialidades = array();
        $arrayTmpmodelos = array();
        foreach ($data->data as $indice => $valorNivact) {
            unset($data->data[$indice]);
            $data->data [$indice] ['identidad'] = $valorNivact['d3__identidad'];
            $data->data [$indice] ['idactividadentidad'] = $valorNivact['[d6__idactividadentidad'];
            $data->data [$indice] ['idaprobacionactent'] = $valorNivact['d3__idaprobacion'];
            $data->data [$indice] ['codigo'] = $valorNivact['n__codigo'];
            $data->data [$indice] ['codigo'] = $valorNivact['n__codigo'];
            $data->data [$indice] ['denominacion'] = $valorNivact['n__denominacion'];
            $data->data [$indice] ['descripcion'] = $valorNivact['n__descripcion'];
            $data->data [$indice] ['idespecialidad'] = $valorNivact['n__idespecialidad'];
            $data->data [$indice] ['nivelactividad'] = 0;
            $data->data [$indice] ['nivelactividad']
                    += $valorNivact['d4__nivelactividadmanual'];
            $data->data [$indice] ['nivelactividad']
                    += $valorNivact['d5__nivelactividadautomatico'];
            $data->data [$indice] ['nivelactividad']
                    += $valorNivact['d6__nivelactividadproduccion'];
            $data->data [$indice] ['denmodelo'] = '-';
            $data->data [$indice] ['comportamiento'] = 'propia';

            if ($arrayTmpespecialidades['den_'
                    . $valorNivact ['n__idespecialidad']] == null
            ) {

                $integrator = ZendExt_IoC::getInstance();
                $arr = Array();
                $arr[] = $valorNivact['n__idespecialidad'];
                $especialidades = $integrator->metadatos->DameEspecialidadesPorArregloId(
                        $arr
                );
                $arrayTmpespecialidades['den_'
                        . $valorNivact ['n__idespecialidad']] = $especialidades [0]['denominacion'];
            }
            $data->data [$indice] ['denespecialidad'] = $arrayTmpespecialidades['den_'
                    . $valorNivact ['n__idespecialidad']];

            if ($valorNivact ['d__idmodelo'] != null) {
                if ($arrayTmpmodelos['den_' . $valorNivact ['d__idmodelo']] == null
                ) {
                    $denomodelo = Doctrine::getTable('DatModelo')->find(
                                    $valorNivact ['d__idmodelo']
                            )->denominacion;
                    $arrayTmpmodelos['den_' . $valorNivact ['d__idmodelo']] = $denomodelo;
                }
                $data->data [$indice] ['denmodelo'] = $arrayTmpmodelos['den_'
                        . $valorNivact ['d__idmodelo']];
            }
            if ($valorNivact['d2__iddatosnomenclador'] == $iddatosnomenclador['demandada']
            ) {
                $data->data [$indice] ['comportamiento'] = 'demandada'; //
            } else {
                if ($valorNivact['d2__iddatosnomenclador'] == $iddatosnomenclador['compartida']
                ) {
                    $data->data [$indice] ['comportamiento'] = 'compartida'; //
                }
            }
        }
        $data->total = $conn->execute($sqlCount);
        $data->total = $data->total->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total[0]['n__0'];
        return $data;
    }

    public function servDesglose_listarNivelesActividadConsolidados($params) {
        if ($params['id_especialidades'][0] == null) {
            $data->data = array();
            $data->total = 0;
            return $data;
        }
        $condiciones = array();
        $condicionesHaving = array();
        $arrayParametros = array();
        $arrayParametrostotal = array();
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();

        $arrayParametros[0] = $params['idejercicio'];


        foreach ($params['filtros'] as $filtro) {
            if ($filtro->field == 'codigo') {
                $condiciones [] = "a.codigo LIKE ? ";
                $arrayParametros [] = "" . $filtro->data->value . "%";
                $arrayParametrostotal [] = $filtro->data->value . "%";
            } elseif ($filtro->field == 'denominacion') {
                $condiciones [] = "upper(a.denominacion)   LIKE ? ";
                $arrayParametros [] = "%" . strtoupper($filtro->data->value)
                        . "%";
                $arrayParametrostotal [] = "%" . strtoupper(
                                $filtro->data->value
                        ) . "%";
            } elseif ($filtro->field == 'descripcion') {
                $condiciones [] = "upper(a.descripcion)   LIKE ? ";
                $arrayParametros [] = "%" . strtoupper($filtro->data->value)
                        . "%";
                $arrayParametrostotal [] = "%" . strtoupper(
                                $filtro->data->value
                        ) . "%";
            } elseif ($filtro->field == 'idaprobacionactent') {
                $condaprob = "= 1";
                if ($filtro->data->value[0] == 'Si') {
                    $condaprob = "= 3";
                } else {
                    if ($filtro->data->value[0] == 'Rector') {
                        $condaprob = ">=4";
                    }
                }
                $condicionesHaving [] = " SUM( ae.idaprobacion ) / COUNT(ae.idaprobacion) $condaprob ";
            } elseif ($filtro->field == 'denmodelo') {
                if ($filtro->data->value == '-') {
                    $condiciones [] = "am.idmodelo IS NULL ";
                } else {
                    $condiciones [] = "am.idmodelo = ? ";
                    $arrayParametros [] = $filtro->data->value;
                    $arrayParametrostotal [] = $filtro->data->value;
                }
            } else {
                if ($filtro->field == 'comportamiento') {
                    $condcomp = $iddatosnomanclador['propia']; //propia
                    if ($filtro->data->value[0] == 'Demandada') { //demandante
                        $condcomp = $iddatosnomanclador['demandada'];
                    } else {
                        if ($filtro->data->value[0] == 'Compartida'
                        ) { //compartida
                            $condcomp = $iddatosnomanclador['compartida'];
                        }
                    }
                    $condiciones [] = "aec.iddatosnomenclador  = {$condcomp} ";
                } else {
                    if ($filtro->field == 'denespecialidad') {
                        $condiciones [] = "a.idespecialidad = ? ";
                        $arrayParametros [] = $filtro->data->value;
                        $arrayParametrostotal [] = $filtro->data->value;
                    } elseif ($filtro->field == "nivelactividad") {
                        $cond = " = ";
                        if ($filtro->data->comparison == "gt") {
                            $cond = ">";
                        } elseif ($filtro->data->comparison == "lt") {
                            $cond = "<";
                        }
                        $condiciones [] = " COALESCE(COALESCE(aea.nivelactividadautomatico,0) +
    COALESCE(aem.nivelactividadmanual,0) +
COALESCE(aep.nivelactividadproduccion,0) + COALESCE(ae.ajuste,0),0) {$cond} ? ";
                        $arrayParametros [] = $filtro->data->value;
                        $arrayParametrostotal [] = $filtro->data->value;
                    }
                }
            }
        }
        $ejercicio = 1;
        if ($params['idejercicio']) {
            $ejercicio = $params['idejercicio'];
        }

        $strEspecialidadesDemandantes = "";
        $coma = "";
        $arrayIdespecialidades = $params['id_especialidades'];
        foreach ($arrayIdespecialidades as $idespecialidad) {
            if ($idespecialidad != "" && $idespecialidad != null) {
                $strEspecialidadesDemandantes = $strEspecialidadesDemandantes
                        . $coma . "'" . $idespecialidad . "'";
                $coma = ",";
            }
        }
        $ADDWHERE = "";
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . " AND " . $condicion . " ";
        }

        $HAVING = "";
        $AND = "";
        foreach ($condicionesHaving as $condicionHaving) {
            $HAVING = $HAVING . $AND . " " . $condicionHaving . " ";
            $AND = "AND";
        }
        if ($HAVING != "") {
            $HAVING = "HAVING " . $HAVING;
        }
        //* temporal poner ? *
        $strEntidades = "";
        $arrayEntidades = $params['entidades'];

        foreach ($arrayEntidades as $ent) {
            if ($strEntidades == "") {
                $strEntidades = $ent;
            } else {
                $strEntidades = $strEntidades . "," . $ent;
            }
        }
        //* LISTAR CONSOLIDADO DE ACTVIDADES CON NIVELES *
        $conn = Doctrine_Manager::connection();
        $query = " SELECT DISTINCT a.idactividad ,
                                            a.codigo,
                                            a.denominacion,
                                            a.descripcion,
a.idespecialidad,
aea.nivelactividadautomatico  as nivelactividadautomatico ,
 aem.nivelactividadmanual as nivelactividadmanual ,
aep.nivelactividadproduccion  as nivelactividadproduccion,
COALESCE(ae.ajuste,0) as ajuste,
COALESCE(COALESCE(aea.nivelactividadautomatico,0) +
COALESCE(aem.nivelactividadmanual,0) +
COALESCE(aep.nivelactividadproduccion,0) +
COALESCE(ae.ajuste,0),0) as nivelactividad,
AVG(
CASE WHEN
COALESCE(ae.idaprobacion,1) = 1
THEN
-100
ELSE
ae.idaprobacion
END
) as idaprobacion,
mod.denominacion as denmodelo,
aec.iddatosnomenclador,
aec.idespecialidad as idespcomportamiento
FROM mod_planificacion.nom_actividad a
INNER JOIN mod_planificacion.dat_actespcomportamiento aec
    ON(a.idactividad = aec.idactividad AND aec.idespecialidad
    IN($strEspecialidadesDemandantes))
INNER JOIN mod_planificacion.dat_norma n on
a.idactividad = n.idactividad AND n.idejercicio = {$ejercicio}
INNER JOIN dat_actividadentidad ae
ON(ae.idactespcomportamiento = aec.idactespcomportamiento
AND ae.identidad IN( $strEntidades )
AND ae.idejercicio =  ? )

LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
ON(aem.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
ON(aea.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
ON( aep.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadmodelo am
ON(am.idactividad = a.idactividad)

LEFT JOIN mod_planificacion.dat_modelo mod
ON(mod.idmodelo = am.idmodelo)
LEFT JOIN mod_planificacion.dat_actividadnivelproduccion anp
ON(anp.idactividad = a.idactividad AND aec.iddatosnomenclador = (
 SELECT iddatosnomenclador FROM nom_datosnomenclador
 WHERE uridatosnomenclador = 'propia'
 ))
WHERE
a.idactividad IN (
SELECT subnorma.idactividad
FROM mod_planificacion.dat_norma subnorma
INNER JOIN nom_indicador subind
ON( a.idactividad = subnorma.idactividad AND subind.idindicador =
subnorma.idindicador AND subind.estado = 1 AND (subind.idaprobacion = 3
OR subind.idaprobacion = 4) )
WHERE subnorma.idactividad = a.idactividad  AND  subnorma.idejercicio = "
                . ($ejercicio) . ")
AND ( a.idaprobacion = 3 OR a.idaprobacion = 4)
AND a.estado = 1
AND a.nivel = {$params['nivel']}
$ADDWHERE
    GROUP BY
    a.idactividad,
    a.codigo,
    a.denominacion,
    a.descripcion,
    a.idespecialidad,
    mod.denominacion,
    aec.idespecialidad,
    aec.iddatosnomenclador ,
    aea.nivelactividadautomatico,
    aem.nivelactividadmanual,
    aep.nivelactividadproduccion,
    ae.ajuste
$HAVING
ORDER BY a.codigo,a.denominacion
OFFSET ?
LIMIT ? ";
        $arrayParametros[] = $params['start'];
        $arrayParametros[] = $params['limit'];

        $res = $conn->execute($query, $arrayParametros);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
//        *         * *** Calculo del pÃ¡ginado **** *
        $conn = Doctrine_Manager::connection();
        $query = " SELECT count (DISTINCT a.idactividad)
FROM mod_planificacion.nom_actividad a
INNER JOIN mod_planificacion.dat_actespcomportamiento aec
    ON(a.idactividad = aec.idactividad AND aec.idespecialidad
    IN($strEspecialidadesDemandantes))
INNER JOIN mod_planificacion.dat_norma n on a.idactividad =
n.idactividad AND n.idejercicio = {$ejercicio}
INNER JOIN dat_actividadentidad ae
ON(ae.idactespcomportamiento = aec.idactespcomportamiento
AND ae.identidad IN( $strEntidades )
AND ae.idejercicio =  {$ejercicio} )

LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
ON(aem.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
ON(aea.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
ON( aep.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadmodelo am
ON(am.idactividad = a.idactividad)

LEFT JOIN mod_planificacion.dat_modelo mod
ON(mod.idmodelo = am.idmodelo)
LEFT JOIN mod_planificacion.dat_actividadnivelproduccion anp
ON(anp.idactividad = a.idactividad AND aec.iddatosnomenclador = (
 SELECT iddatosnomenclador FROM nom_datosnomenclador
 WHERE uridatosnomenclador = 'propia'
 ))
WHERE
a.idactividad IN (
SELECT subnorma.idactividad
FROM mod_planificacion.dat_norma subnorma
INNER JOIN nom_indicador subind
ON( a.idactividad = subnorma.idactividad AND subind.idindicador =
subnorma.idindicador AND subind.estado = 1 AND (subind.idaprobacion = 3
OR subind.idaprobacion = 4) )
WHERE subnorma.idactividad = a.idactividad  AND  subnorma.idejercicio = "
                . ($ejercicio) . ")
AND ( a.idaprobacion = 3 OR a.idaprobacion = 4)
AND a.estado = 1
AND a.nivel = {$params['nivel']}
$ADDWHERE
$HAVING
";


        $res = $conn->execute($query, $arrayParametrostotal);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $result [0] ['count'];

        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $arrayTmpespecialidades = array();
        foreach ($data->data as $indice => $actividad) {
            $data->data [$indice] ['comportamiento'] = 'propia';
            if ($arrayTmpespecialidades['den_'
                    . $actividad ['idespecialidad']] == null
            ) {
                $especialidades = $this->nomenclador->selectParam(
                        'nom_especialidad', array('denespecialidad'), 0, 0, "idespecialidad = " . $actividad ['idespecialidad']
                );
                $arrayTmpespecialidades['den_'
                        . $actividad ['idespecialidad']] = $especialidades [0] ['denespecialidad'];
            }
            $data->data [$indice] ['denespecialidad'] = $arrayTmpespecialidades['den_'
                    . $actividad ['idespecialidad']];
            $data->data [$indice] ['sololectura'] = true;
            if ($actividad ['nivelactividadmanual'] == null) {
                $data->data [$indice] ['nivelactividadmanual'] = 0;
            }
            if ($actividad ['nivelactividadautomatico'] == null) {
                $data->data [$indice] ['nivelactividadautomatico'] = 0;
            } else {
                $data->data [$indice] ['esorigenautomatico'] = 1;
            }
            if ($actividad ['idaprobacion'] == null) {
                $data->data [$indice] ['idaprobacion'] = '1';
            }


            if ($actividad['iddatosnomenclador'] == $iddatosnomanclador['demandada']
            ) {
                $data->data [$indice] ['comportamiento'] = 'demandada';
            } else {
                if ($actividad['iddatosnomenclador'] == $iddatosnomanclador['compartida']
                ) {
                    $data->data [$indice] ['comportamiento'] = 'compartida';
                }
            }
        }
        return $data;
    }

    public function listarActividadesporEntidad($params) {
        if (is_array($params['identidad'])) {
            $params['identidad'] = implode(',', $params['identidad']);
        }
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $params['codigo'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'denominacion') {
                    $params['denominacion'] = strtoupper(
                            $datos['data']['value']
                    );
                }
                if ($datos['field'] == 'nivelactividad') {
                    if ($datos['data']['comparison'] == "gt") {
                        $params['nivelactividad'] = array('nivelactividad' => $datos['data']['value'],
                            'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $params['nivelactividad'] = array('nivelactividad' => $datos['data']['value'],
                            'condicion' => "<");
                    } else {
                        $params['nivelactividad'] = array('nivelactividad' => $datos['data']['value'],
                            'condicion' => "=");
                    }
                }
                if ($datos['field'] == 'nivelactividadreal') {
                    if ($datos['data']['comparison'] == "gt") {
                        $params['nivelactividadreal'] = array('nivelactividadreal' => $datos['data']['value'],
                            'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $params['nivelactividadreal'] = array('nivelactividadreal' => $datos['data']['value'],
                            'condicion' => "<");
                    } else {
                        $params['nivelactividadreal'] = array('nivelactividadreal' => $datos['data']['value'],
                            'condicion' => "=");
                    }
                }
                if ($datos['field'] == 'porciento') {
                    if ($datos['data']['comparison'] == "gt") {
                        $params['porciento'] = array('porciento' => $datos['data']['value'],
                            'condicion' =>
                            ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $params['porciento'] = array('porciento' => $datos['data']['value'],
                            'condicion' =>
                            "<");
                    } else {
                        $params['porciento'] = array('porciento' => $datos['data']['value'],
                            'condicion' =>
                            "=");
                    }
                }
            }
        }

        $modeloActEnt = new DatActividadentidad();
        return DatActividadentidad::listarActividades($params);
    }

    public function listarnNivelesporActividad($params, $integrator) {
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $key => $datos) {
                if ($datos['field'] == 'usuario') {
                    $params['usuario'] = $datos['data']['value'];
                }
                if ($datos['field'] == 'fechareal') {
                    if ($datos['data']['comparison'] == "gt") {
                        $params['fechareal'] = array('fechareal' => $datos['data']['value'],
                            'condicion' =>
                            ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $params['fechareal'] = array('fechareal' => $datos['data']['value'],
                            'condicion' =>
                            "<");
                    } else {
                        $params['fechareal'] = array('fechareal' => $datos['data']['value'],
                            'condicion' =>
                            "=");
                    }
                }
                if ($datos['field'] == 'nivelactividadreal') {
                    if ($datos['data']['comparison'] == "gt") {
                        $params['nivelactividadreal'] = array('nivelactividadreal' => $datos['data']['value'],
                            'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $params['nivelactividadreal'] = array('nivelactividadreal' => $datos['data']['value'],
                            'condicion' => "<");
                    } else {
                        $params['nivelactividadreal'] = array('nivelactividadreal' => $datos['data']['value'],
                            'condicion' => "=");
                    }
                }
            }
        }
        $modeloActEnt = new DatActividadentidad();
        $idusuarios = DatActividadentidad::ObtenerIdUsuarios();

        foreach ($idusuarios as $key => $value) {
            $ids[] = $value['idusuario'];
        }
        $nomusuarios = $integrator->seguridad->obtenerNombresUsuarios($ids);

        $modeloActEnt = new DatActividadentidad();
        $data = DatActividadentidad::listarnNivelesporActividad($params);
        foreach ($data->data as $key => $value) {
            foreach ($nomusuarios as $v) {
                if ($value['idusuario'] == $v['idusuario']) {
                    $data->data[$key]['usuario'] = $v['nombreusuario'];
                }
            }
        }

        return $data;
    }

    public function adicionarNivelActividadporFechareal($params) {
        $flag = true;
        $idactividadentidad = null;
        $codMsg = '0';
        foreach ($params['filas'] as $value) {
            if (empty($value->idnivelactividadporfechareal)) {
                if ($flag) {
                    $modeloActEnt = new DatActividadentidad();
                    $idactividadentidad = DatActividadentidad::BuscarIdactividadEntidades(
                                    $params['identidad'], $params['idactividad']
                    );
                    $flag = false;
                }
                $nivelactividadporfechareal = new DatNivelactividadporfechareal();
                $nivelactividadporfechareal->idactividadentidad = $idactividadentidad[0]['idactividadentidad'];
                $nivelactividadporfechareal->nivelactividadreal = $value->nivelactividadreal;
                $nivelactividadporfechareal->fechareal = $value->fecha;
                $nivelactividadporfechareal->idusuario = $params['idusuario'];
                $nivelactividadporfechareal->fin = 0;
                $nivelactividadporfechareal->save();
                $codMsg = '1';
            } else {
                $nivelactividadporfechareal = Doctrine::getTable(
                                'DatNivelactividadporfechareal'
                        )->find($value->idnivelactividadporfechareal);
                $nivelactividadporfechareal->nivelactividadreal = $value->nivelactividadreal;
                $nivelactividadporfechareal->save();
                $codMsg = '1';
            }
        }
        return $codMsg;
    }

    public function eliminarNivelActividadporFechareal($params) {
        $modeloActEnt = new DatActividadentidad();
        return DatActividadentidad::eliminarNivelActividadporFechareal($params);
    }

    /* private function actualizarAprobActEntidad($arrayIdsactividades,
      $idaprobacion
      )
      {
      $queryActualizarActEnt = Doctrine_Query::create();
      $queryActualizarActEnt->update("DatActividadentidad")->set(
      "idaprobacion", $idaprobacion
      )->whereIn('idactividad', $arrayIdsactividades)->execute();
      } */

    public function exportarAExcel($params) {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dirApps .
                "/planificacion/planmeta/views/idioma/{$idioma}/"
                . "bpgestnivelesactividad/bpgestnivelesactividad.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $importeajust = 'Importe Ajustado';
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq[$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);


        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=niveles.xls");
        header("Content-Transfer-Encoding: binary ");

        echo '<caption> ' . $arrayEtiq['lbNivelActividad'] . ' Entidad: ' . utf8_decode($params['text']) . '</caption>';
        echo "<table border=1 cellspacing=0 width=60%>
        <tr>
            <th align=left>C&oacute;digo</th>
             <th align=left>Denominaci&oacute;n</th>
             <th align=left >Nivel autom&aacute;tico</th>
             <th align=left >Nivel manual</th>
             <th align=left >Nivel demandado</th>
             <th align=left >Nivel</th>
             <th align=left >Ajuste</th>
              <th align=left >Nivel ajustado</th>
             <th align=left>Aprobaci&oacute;n</th>
             <th align=left>Plan</th>
			 <th align=left>Rector</th>
			 <th align=left>Importe Inicial</th>
			 <th align=left>{$importeajust}</th>
			 <th align=left>Importe Final</th>
         </tr>";
        $arrayIdsaprobacion = array();
        $arrayIdsaprobacion['id_1'] = 'No';
        $arrayIdsaprobacion['id_3'] = 'Si';
        $arrayIdsaprobacion['id_4'] = 'Rector';
        $arrayIdsaprobacion['id_5'] = 'Rector';

        $params['iddatosnomanclador'] = DatActespcomportamiento::obtenerIdDatosNom();

        if ($params['glob'] == 'false') {
            $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);
            if ($params['identidad'][0] != null || $params['identidad'][0] != '' || $params['identidad'][0]) {
                $params['identidad'] = $params['identidad'][0];
                $params['entidades'] = array('0' => $params['identidad']);
                $datosEntidad = $this->integrator->metadatos->DameEstructura(
                        $params['identidad']
                );

                $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;

                if ($params['esrector'] == 'true') {
                    $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                }
            }
        } else {
            $modeloActEnt = new DatActividadentidad();
            $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $params['identidad']
            );
            $var = implode(',', $params['entidades']);
            $params['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);

            if ($params['entidades'][0] != null) {

                $params['id_especialidades'] = array();
                $tempEspecialidades = array();
                $tempEspecialidades["id_" . $params['idespecialidad']] = $params['idespecialidad'];
                $cont = 0;
                $integrator = ZendExt_IoC::getInstance();
                foreach ($params['entidades'] as $valorIdentidad) {
                    $entidades[] = $integrator->metadatos->DameEstructura(
                            $valorIdentidad
                    );
                    $idEspecialidad = $entidades[$cont++][0]->idespecialidad;
                    $tempEspecialidades["id_" . $idEspecialidad] = $idEspecialidad;
                }
                foreach ($tempEspecialidades as $valorIdesp) {
                    $params['id_especialidades'][] = $valorIdesp;
                }
            }
        }

        $params['exportar'] = true;
        $arrayNivsact = $this->listarActsNivActPorEntidad($params);

        foreach ($arrayNivsact->data as $value) {
            if ($value['idaprobacion'] < 1) {
                $value['idaprobacion'] = 1;
            }
            echo "<tr> <td align=right><font color=white>'</font>"
            . $value['codigo'] .
            "<font color=white>'</font></td>
             <td align=left>" . utf8_decode($value['denominacion']) . "</td>
             <td align=right>" . (($value['nivelactividadautomatico'] != null) ?
                    number_format(
                            $value['nivelactividadautomatico'], '3', '.', ','
                    ) : '0') . "</td>

             <td align=right >" . (($value['nivelactividadmanual'] != null) ?
                    number_format(
                            $value['nivelactividadmanual'], '3', '.', ','
                    ) :
                    '0') . "</td>
             <td align=right >" . (($value['nivelactividadproduccion'] != null) ?
                    number_format(
                            $value['nivelactividadproduccion'], '3', '.', ','
                    ) : '0') . "</td>
             <td align=right >" . number_format(
                    $value['nivelactividad'], '3', '.', ','
            ) . "</td>
             <td align=right >" . number_format($value['ajuste'], '3', '.', ',')
            . "</td>
                <td align=right >" . number_format(
                    $value['nivelactividad'] + $value['ajuste'], '3', '.', ','
            ) . "</td>
             <td align=right >" . $arrayIdsaprobacion['id_' . round(
                    $value['idaprobacion']
            )] .
            "</td>
             <td align=left>" . (($value['denmodelo'] == null) ? "-" : utf8_decode($value['denmodelo'])) .
            "</td>
			 <td align=right >" . $arrayIdsaprobacion['id_' . round(
                    $value['idaprobacion']
            )] .
            "</td>
             <td align=right>" . $value['importe'] . "</td>
             <td align=right>" . $value['importeajustado'] . "</td>
             <td align=right>" . $value['importefinal'] . "</td>
             </tr>";
        }

        echo "<tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
             <th>Importe Total:</th>
             <td>" . $arrayNivsact->importe . "</td>
                 <td>" . $arrayNivsact->importeajuste . "</td>
             <td>" . $arrayNivsact->importefinal . "</td>
            </tr>
</table>";
    }

    public function listarNivsActvPorEntidadParaExportar($params, $escont = false
    ) {
        $arrayParametros = array();
        $arrayParametrostotal = array();
        $condiciones = array();
        $addHaving = "Having true ";
        $condicionesHaving = array();

        $arrayParametrostotal[0] = $params['idespecialidad'];
        $arrayParametrostotal[1] = $params['idejercicio'];
        $arrayParametrostotal[2] = $params['identidad'];

        if ($params['calcularimporte'] == 'true') {
            $arrayParametros[0] = $params['idejercicio'];
            $arrayParametros[1] = $params['idespecialidad'];
            $arrayParametros[2] = $params['idespecialidad'];
            $arrayParametros[3] = $params['idejercicio'];
            $arrayParametros[4] = $params['idejercicio'];
            $arrayParametros[5] = $params['identidad'];
            $arrayParametros[6] = $params['idespecialidad'];
        } else {
            $arrayParametros[0] = $params['idejercicio'];
            $arrayParametros[1] = $params['idespecialidad'];
            $arrayParametros[2] = $params['idespecialidad'];
            $arrayParametros[3] = $params['idejercicio'];
            $arrayParametros[4] = $params['identidad'];
            $arrayParametros[5] = $params['idespecialidad'];
        }

        $arrayParametrostotal[0] = $params['idespecialidad'];
        $arrayParametrostotal[1] = $params['idejercicio'];
        $arrayParametrostotal[2] = $params['identidad'];

        $arrayParametrosimp[0] = $params['idespecialidad'];
        $arrayParametrosimp[1] = $params['idejercicio'];
        $arrayParametrosimp[2] = $params['idejercicio'];
        $arrayParametrosimp[3] = $params['identidad'];
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "a.codigo LIKE ?";
                    $arrayParametros[] = $datos['data']['value'] . "%";
                    $arrayParametrostotal[] = $datos['data']['value'] . "%";
                    $arrayParametrosimp[] = $datos['data']['value'] . "%";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(a.denominacion) LIKE  " . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') .
                                "%'");
                    } else {
                        if ($datos['field'] == 'descripcion') {
                            $condiciones[] = "upper(a.descripcion) LIKE '%"
                                    . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') .
                                    "%'";
                        } elseif ($datos['field'] == 'importe') {
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlImporte .= "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlImporte .= ">";
                                } else { //eq
                                    $sqlImporte .= "=";
                                }
                            }
                            self::addHavigConParamsFoo(
                                    $addHaving, " round( Coalesce (SUM(
                                    (n.necesidad) *ind.precio) *
                                    ( COALESCE (aem.nivelactividadmanual,0)+
                                    COALESCE (aea.nivelactividadautomatico,0) +
                    COALESCE (aep.nivelactividadproduccion,0)),0)
+
          (Coalesce (SUM( (n.necesidad) *ind.precio) *
          ( COALESCE (aem.nivelactividadmanual,0)+
          COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0)*ind.flete)/100 +
          (Coalesce (SUM( (n.necesidad) *ind.precio) *
          ( COALESCE (aem.nivelactividadmanual,0)+
          COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0)*ind.contingencia)/100 ,0) "
                                    .
                                    $sqlImporte, $datos['data']['value']
                            );
                            $condicionesHaving = "round( Coalesce (SUM( (n.necesidad) *ind.precio)
    * ( COALESCE (aem.nivelactividadmanual,0)+
    COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0)
                                                 +
(Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+
COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.flete/100 +
(Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+
COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.contingencia/100 ,0)";
                            $sqlImporte = '';
                        } elseif ($datos['field'] == 'importeajustado') {
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlImporte .= "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlImporte .= ">";
                                } else { //eq
                                    $sqlImporte .= "=";
                                }
                            }
                            self::addHavigConParamsFoo(
                                    $addHaving, "round( SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0)

+(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.flete/100+
(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.contingencia/100,0)"
                                    .
                                    $sqlImporte, $datos['data']['value']
                            );
                            $condicionesHaving = "round( SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0)

+(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.flete/100+
(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.contingencia/100,0)";
                            $sqlImporte = '';
                        } elseif ($datos['field'] == 'importefinal') {
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlImporte .= "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlImporte .= ">";
                                } else { //eq
                                    $sqlImporte .= "=";
                                }
                            }
                            self::addHavigConParamsFoo(
                                    $addHaving, "( round( Coalesce (SUM( (n.necesidad)
    *ind.precio) * ( COALESCE (aem.nivelactividadmanual,0)+
    COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0)
+
(Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+
COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.flete/100 +
(Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+ COALESCE
(aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.contingencia/100 ,0)
+
(round( SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0)

+(SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0)*
ind.flete)/100+
(SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0))*
ind.contingencia/100,0)))"
                                    .
                                    $sqlImporte, $datos['data']['value']
                            );
                            $condicionesHaving = "( round( Coalesce (SUM( (n.necesidad) *ind.precio) * ( COALESCE
    (aem.nivelactividadmanual,0)+ COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0)
                                                 +
(Coalesce (SUM( (n.necesidad) *ind.precio) * ( COALESCE
(aem.nivelactividadmanual,0)+ COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.flete/100 +
(Coalesce (SUM( (n.necesidad) *ind.precio) * ( COALESCE
(aem.nivelactividadmanual,0)+ COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.contingencia/100 ,0)

+
(round( SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0)

+(SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0)_*
ind.flete/100+
(SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0))*
ind.contingencia/100,0))
          ))";
                            $sqlImporte = '';
                        } else {
                            if ($datos['field'] == 'denespecialidad') {
                                $condiciones[] = "a.idespecialidad = ? ";
                                $arrayParametros[] = $datos['data']['value'];
                                $arrayParametrostotal[] = $datos['data']['value'];
                                $arrayParametrosimp[] = $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'comportamiento') {

                                    if ($datos['data']['value'] == 'Propia') {
                                        $condiciones[] = "aec.iddatosnomenclador = ? ";
                                        $arrayParametros[] = $iddatosnomanclador['propia'];
                                        $arrayParametrostotal[] = $iddatosnomanclador['propia'];
                                        $arrayParametrosimp[] = $iddatosnomanclador['propia'];
                                    } else {
                                        if ($datos['data']['value'] == 'Demandada'
                                        ) {
                                            $condiciones[] = "aec.iddatosnomenclador = ? ";
                                            $arrayParametros[] = $iddatosnomanclador['demandada'];
                                            $arrayParametrostotal[] = $iddatosnomanclador['demandada'];
                                            $arrayParametrosimp[] = $iddatosnomanclador['demandada'];
                                        } else {
                                            if ($datos['data']['value'] == 'Compartida'
                                            ) {
                                                $condiciones[] = "aec.iddatosnomenclador = ? ";
                                                $arrayParametros[] = $iddatosnomanclador['compartida'];
                                                $arrayParametrostotal[] = $iddatosnomanclador['compartida'];
                                                $arrayParametrosimp[] = $iddatosnomanclador['compartida'];
                                            }
                                        }
                                    }
                                } else {
                                    if ($datos['field'] == 'ajuste') {
                                        $sqlAjuste = " ae.ajuste ";
                                        if ($datos['data']['comparison'] == 'lt'
                                        ) {
                                            $sqlAjuste .= "<";
                                        } else {
                                            if ($datos['data']['comparison'] == 'gt'
                                            ) {
                                                $sqlAjuste .= ">";
                                            } else { //eq
                                                $sqlAjuste .= "=";
                                            }
                                        }
                                        $condiciones[] = $sqlAjuste
                                                . $datos['data']['value'];
                                    } else {
                                        if ($datos['field'] == 'nivelactividadautomatico' || $datos['field'] ==
                                                'nivelactividadmanual' || $datos['field'] == 'nivelactividadproduccion'
                                        ) {
                                            $alias = 'aea';
                                            if ($datos['field'] == 'nivelactividadmanual'
                                            ) {
                                                $alias = 'aem';
                                            }
                                            if ($datos['field'] == 'nivelactividadproduccion'
                                            ) {
                                                $alias = 'aep';
                                            }
                                            $campo = " COALESCE( {$alias}.{$datos ['field']}, 0 )";
                                            $cond = "=";
                                            if ($datos['data']['comparison'] == 'lt'
                                            ) {
                                                $cond = "<";
                                            } elseif ($datos['data']['comparison'] == 'gt'
                                            ) {
                                                $cond = ">";
                                            }
                                            $condiciones[] = $campo . $cond
                                                    . $datos['data']['value'];
                                        } else {
                                            if ($datos['field'] == 'nivelactividad'
                                            ) {
                                                $sqlNNA = " ( COALESCE(aem.nivelactividadmanual,0)+
COALESCE(aea.nivelactividadautomatico,0)+
COALESCE(aep.nivelactividadproduccion,0) )";
                                                if ($datos['data']['comparison'] == 'lt'
                                                ) {
                                                    $sqlNAA = $sqlNNA . "<";
                                                } elseif ($datos['data']['comparison'] == 'gt'
                                                ) {
                                                    $sqlNAA .= $sqlNNA . ">";
                                                } else {
                                                    $sqlNAA .= $sqlNNA . "=";
                                                }
                                                $condiciones[] = $sqlNAA
                                                        . $datos['data']['value'];
                                            } else {
                                                if ($datos['field'] == 'nivelactividadajuste'
                                                ) {
                                                    $sqlNNA = " ( COALESCE(aem.nivelactividadmanual,0)+
COALESCE(aea.nivelactividadautomatico,0) +
COALESCE(aep.nivelactividadproduccion,0) +
COALESCE(ae.ajuste,0) ) ";
                                                    if ($datos['data']['comparison'] == 'lt'
                                                    ) {
                                                        $sqlNNA = $sqlNNA . "<";
                                                    } else {
                                                        if ($datos['data']['comparison'] == 'gt'
                                                        ) {
                                                            $sqlNNA = $sqlNNA
                                                                    . ">";
                                                        } else {
                                                            $sqlNNA = $sqlNNA
                                                                    . "=";
                                                        }
                                                    }
                                                    $condiciones[] = $sqlNNA
                                                            . $datos['data']['value'];
                                                } else {
                                                    if ($datos['field'] == 'restoxdistrib'
                                                    ) {
                                                        
                                                    } else {
                                                        if ($datos['field'] == 'idaprobacion'
                                                        ) {
                                                            if ($datos['data']['value'] == 'No'
                                                            ) {
                                                                $condiciones[] = "( ae.idaprobacion = 1 OR ae.idactividadentidad is null )";
                                                            } else {
                                                                if ($datos['data']['value'] == 'Si'
                                                                ) {
                                                                    $condiciones[] = "ae.idaprobacion >= 3";
                                                                } else {
                                                                    if ($datos['data']['value'] == 'Rector'
                                                                    ) {
                                                                        $condiciones[] = "ae.idaprobacion = 4 ";
                                                                    } else {
                                                                        if ($datos['data']['value'] == 'Ajuste'
                                                                        ) {
                                                                            $condiciones[] = "ae.idaprobacion = 5 ";
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            if ($datos['field'] == 'denmodelo'
                                                            ) {
                                                                if ($datos['data']['value'] == '-'
                                                                ) {
                                                                    $condiciones[] = "am.idmodelo IS NULL";
                                                                } else {
                                                                    $condiciones[] = "am.idmodelo = {$datos ['data']['value']}";
                                                                }
                                                            } else {
                                                                if ($datos['field'] == 'idespecialidad_filtros'
                                                                ) {
                                                                    $condiciones[] = "a.idespecialidad = ?";
                                                                    $arrayParametros[] = $datos['data']['value'];
                                                                    $arrayParametrostotal[] = $datos['data']['value'];
                                                                } else {
                                                                    if ($datos['field'] == 'nivelactividad'
                                                                    ) {
                                                                        if ($datos['data']['value'] == 'Si'
                                                                        ) {
                                                                            $condiciones[] = "ae.idactividadentidad is not null";
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        /*         * ****** FIN FILTROS ******* */
        $innerJoinNormaIndicador = "";
        $groupBy = "";

        if ($params['calcularimporte'] == 'true') {

            $innerJoinNormaIndicador = " INNER JOIN mod_planificacion.dat_norma n
                    ON(n.idactividad = a.idactividad AND n.idejercicio = ?)
                    INNER JOIN mod_planificacion.nom_indicador ind
                    ON( n.idindicador = ind.idindicador
                    AND ind.estado = 1 AND  ind.nivel = 1
                    AND (ind.idaprobacion = 3 OR  ind.idaprobacion = 4) )
        ";
            $groupBy = "ind.precio,ind.flete,ind.contingencia,n.cantplanif,
            n.cantbase,n.cantplanif,
            n.cantbase,";
            $calImporte = ' round( Coalesce (SUM( (n.necesidad)
                    *ind.precio) * ( COALESCE (aem.nivelactividadmanual,0)+
                    COALESCE (aea.nivelactividadautomatico,0) +
                    COALESCE (aep.nivelactividadproduccion,0)),0)
+
 (Coalesce (SUM( (n.necesidad) *ind.precio) *
 ( COALESCE (aem.nivelactividadmanual,0)+
 COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.flete/100 +
    (Coalesce (SUM( (n.necesidad) *ind.precio) *
 ( COALESCE(aem.nivelactividadmanual,0)+
 COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.contingencia/100 ,0)
';
            $calimporteAjustado = 'round( SUM((n.necesidad)*ind.precio)
    *COALESCE( ae.ajuste,0)
+(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.flete/100+
(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.contingencia/100,0)

';
            $calImporteFinal = ' round( Coalesce (SUM( (n.necesidad) *ind.precio) *
    ( COALESCE (aem.nivelactividadmanual,0)+
    COALESCE (aea.nivelactividadautomatico,0) +
    COALESCE (aep.nivelactividadproduccion,0)),0)
    +
(Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+
COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.flete/100 +
(Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+
COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0))*ind.contingencia/100 ,0)

+
(round( SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0)

+(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.flete/100+
(SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0))*
ind.contingencia/100,0))

			 ';
            $umedida = "ind.idumedida,";
        } else {
            $calImporte = 0;
            $calimporteAjustado = 0;
            $calImporteFinal = 0;
        }
        /* consolidar */
        $strEntidadesProductoras = implode(
                ",", $params['entidades_productoras']
        );
        $conn = Doctrine_Manager::connection();
        if ($escont === false) {
            $sql = "SELECT DISTINCT a.idactividad,
                    a.codigo,
                    a.denominacion,
                    a.idespecialidad,
                    a.descripcion,
                    ae.idactividadentidad,
ae.idaprobacion,
COALESCE (ae.idaprobacion,1) as idaprobacion,
ae.identidad,
ae.idejercicio,
am.idmodelo,
aec.iddatosnomenclador,
COALESCE (aem.nivelactividadmanual,0) as nivelactividadmanual,
COALESCE (aea.nivelactividadautomatico,0) as nivelactividadautomatico,
COALESCE (aep.nivelactividadproduccion,0) as nivelactividadproduccion,
round ( COALESCE( ae.ajuste,0),4 )as ajuste,

( COALESCE (aem.nivelactividadmanual,0)+ COALESCE
(aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)) as nivelactividad,
$calImporte as importe,
$calimporteAjustado as importeajustado,
$calImporteFinal as importefinal,
( COALESCE ( anp.nivelproduccion,0) - COALESCE (
                   (SELECT SUM(
COALESCE (subaem.nivelactividadmanual,0)+ COALESCE
(subaea.nivelactividadautomatico,0) +
COALESCE (subaep.nivelactividadproduccion,0)
)
FROM mod_planificacion.dat_actividadentidad subae
LEFT JOIN mod_planificacion.dat_actividadentidadmanual subaem
ON(subaem.idactividadentidad = subae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadentidadautomatico subaea
ON(subaea.idactividadentidad = subae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadentidadproduccion subaep
ON( subaep.idactividadentidad = subae.idactividadentidad)

WHERE subae.idejercicio = ?

AND subae.idactividadentidad is not null
AND subae.identidad IN (" . $strEntidadesProductoras .
                    ")
AND subae.idactividad = a.idactividad
),0))  as restoxdistrib,
( SELECT aec2.idespecialidad
  FROM mod_planificacion.dat_actespcomportamiento aec2
  WHERE a.idactividad = aec2.idactividad
  AND a.idespecialidad = ?
  AND aec2.iddatosnomenclador IN (
        SELECT dn.iddatosnomenclador
        FROM mod_planificacion.nom_datosnomenclador dn
        WHERE dn.uridatosnomenclador IN('demandada') )
        AND aec2.idespecialidad <> a.idespecialidad
  OFFSET 0 LIMIT 1 ) as existe_demanda

FROM mod_planificacion.nom_actividad a
INNER JOIN mod_planificacion.dat_actespcomportamiento aec
ON(a.idactividad = aec.idactividad

AND aec.idespecialidad = ?
AND aec.iddatosnomenclador IN (
SELECT dn.iddatosnomenclador
FROM mod_planificacion.nom_datosnomenclador dn
WHERE dn.uridatosnomenclador IN('propia','demandada','compartida')
))
$innerJoinNormaIndicador
LEFT JOIN mod_planificacion.dat_actividadentidad ae
ON(a.idactividad = ae.idactividad  AND ae.idejercicio = ? AND ae.identidad = ? )

LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
ON(aem.idactividadentidad = ae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
ON(aea.idactividadentidad = ae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
ON( aep.idactividadentidad = ae.idactividadentidad)


LEFT JOIN mod_planificacion.dat_actividadmodelo am
ON(a.idactividad = am.idactividad)
LEFT JOIN mod_planificacion.dat_actividadnivelproduccion anp
ON(anp.idactividad = a.idactividad AND a.idespecialidad =  ? )
WHERE a.nivel = {$params['nivel']}
AND ( a.idaprobacion = 3 OR a.idaprobacion = 4 OR a.idaprobacion = 5 )
AND a.estado = 1
AND a.normada = 1
                    $WHERE
                    GROUP BY
                    ae.idejercicio,
                    a.idespecialidad,
                    a.idactividad,
                    a.codigo,
                    a.denominacion,
                    a.descripcion,
                    ae.idactividadentidad,
                    ae.idaprobacion,
                    ae.identidad,
                    am.idmodelo,
					$groupBy
                    aec.iddatosnomenclador,
                    aem.nivelactividadmanual,
                    aea.nivelactividadautomatico,
                    aep.nivelactividadproduccion,
                    ae.ajuste," . $umedida . "


                   /* aepct.nivelactividadproduccion,  */

                    anp.nivelproduccion
					$addHaving
                    ORDER BY am.idmodelo, a.codigo,a.denominacion
                    OFFSET ?
                    LIMIT ?
                    ";
            $arrayParametros[] = $params['start'];
            $arrayParametros[] = $params['limit'];
            $data->data = $conn->execute($sql, $arrayParametros)->fetchAll(
                    PDO::
                    FETCH_ASSOC
            );

            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $arrayTmpespecialidades = array();
            $arrayTmpmodelos = array();
            foreach ($data->data as $indice => $valor) {

                $data->data[$indice]['importe'] = number_format(
                        $valor['importe'], '3', '.', ','
                ); //
                $data->data[$indice]['importeajustado'] = number_format(
                        $valor['importeajustado'], '3', '.', ','
                ); //
                $data->data[$indice]['importefinal'] = number_format(
                        $valor['importefinal'], '3', '.', ','
                ); //
                $data->data[$indice]['identidad'] = ($valor['identidad'] != null) ? $valor['identidad'] :
                        $params['identidad'];
                if ($arrayTmpmodelos['den_' . $valor['idmodelo']] == null && $valor['idmodelo'] != null
                ) { //optimizado
                    $arrayTmpmodelos['den_' . $valor['idmodelo']] = Doctrine::getTable('DatModelo')->find(
                                    $valor['idmodelo']
                            )->denominacion;
                }
                $data->data[$indice]['denmodelo'] = $arrayTmpmodelos['den_'
                        . $valor['idmodelo']];
                if ($arrayTmpespecialidades['den_' . $valor['idespecialidad']] == null
                ) {
                    $especialidades = $this->nomenclador->selectParam(
                            'nom_especialidad', array('denespecialidad'), 0, 0, "idespecialidad = " . $valor['idespecialidad']
                    );
                    $arrayTmpespecialidades['den_' . $valor['idespecialidad']] = $especialidades[0]['denespecialidad'];
                }
                $data->data[$indice]['denespecialidad'] = $arrayTmpespecialidades['den_'
                        . $valor['idespecialidad']];
                $data->data[$indice]['comportamiento'] = -1;
                if ($valor['existe_demanda'] == null) {
                    $data->data[$indice]['restoxdistrib'] = '-';
                }
                if ($valor['ajuste'] == '0.000') {
                    $data->data[$indice]['ajuste'] = '0';
                }
            }
            $importeTotal = number_format('0', '3', '.', ',');
            if ($params['calcularimporte'] == 'true') {

                $query = "SELECT SUM(importe) as importetotal
FROM (
SELECT DISTINCT a.idactividad,
round( Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+
COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0)
+(Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+
COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0)*ind.flete)/100 +
(Coalesce (SUM( (n.necesidad) *ind.precio) *
( COALESCE (aem.nivelactividadmanual,0)+
COALESCE (aea.nivelactividadautomatico,0) +
COALESCE (aep.nivelactividadproduccion,0)),0)
*ind.contingencia)/100 ,0) as importe

FROM mod_planificacion.nom_actividad a
INNER JOIN mod_planificacion.dat_actespcomportamiento aec
ON(a.idactividad = aec.idactividad
AND aec.idespecialidad = ?
AND aec.iddatosnomenclador IN (
SELECT dn.iddatosnomenclador
FROM mod_planificacion.nom_datosnomenclador dn
WHERE dn.uridatosnomenclador IN('propia','demandada','compartida')
))
INNER JOIN mod_planificacion.dat_norma n
ON(n.idactividad = a.idactividad AND n.idejercicio = ?)
INNER JOIN mod_planificacion.nom_indicador ind
ON( n.idindicador = ind.idindicador AND ind.estado = 1
AND  ind.nivel = 1 AND (ind.idaprobacion = 3 OR  ind.idaprobacion = 4) )

LEFT JOIN mod_planificacion.dat_actividadentidad ae
ON(a.idactividad = ae.idactividad   AND ae.idejercicio =? AND ae.identidad =? )

LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
ON(aem.idactividadentidad = ae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
ON(aea.idactividadentidad = ae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
ON( aep.idactividadentidad = ae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadmodelo am
ON(a.idactividad = am.idactividad)
WHERE a.nivel = {$this->nivel}
AND a.idaprobacion >= 3
AND a.idaprobacion <= 4
AND a.estado = 1
                    $WHERE
                    GROUP BY
                    a.idactividad,
                    ae.identidad,
ind.precio,ind.flete,ind.contingencia,n.cantplanif,
            n.cantbase,n.cantplanif,
            n.cantbase,
aem.nivelactividadmanual,
aea.nivelactividadautomatico,
aep.nivelactividadproduccion
) mialias
                 ";
                $TOTAL = $conn->execute($query, $arrayParametrosimp)
                        ->fetchAll();
                $importeTotal = number_format(
                        $TOTAL[0]['importetotal'], '3', '.', ','
                );
                $data->importetotal = $importeTotal;
            }
        } else {
            /* CALCULAR TOTAL DE ACTIVIDADES */
            $sql = "SELECT COUNT( DISTINCT a.idactividad ) as total
        FROM mod_planificacion.nom_actividad a
        INNER JOIN mod_planificacion.dat_actespcomportamiento aec
        ON(a.idactividad =  aec.idactividad
        AND aec.idespecialidad = ?
        AND aec.iddatosnomenclador IN (
        SELECT dn.iddatosnomenclador
        FROM mod_planificacion.nom_datosnomenclador dn
        WHERE dn.uridatosnomenclador IN('propia','demandada','compartida')
        ))
    /* UNION CON NORMAS e INDICADORES */
    LEFT JOIN mod_planificacion.dat_actividadentidad ae
    ON(a.idactividad = ae.idactividad
    AND ae.idejercicio = ? AND ae.identidad = ? )
    LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
    ON(aem.idactividadentidad = ae.idactividadentidad)
    LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
    ON(aea.idactividadentidad = ae.idactividadentidad)
    LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
    ON( aep.idactividadentidad = ae.idactividadentidad)
    LEFT JOIN mod_planificacion.dat_actividadmodelo am
    ON(a.idactividad = am.idactividad)
    WHERE a.nivel = {$params['nivel']}
    AND ( a.idaprobacion = 3 OR a.idaprobacion = 4 OR a.idaprobacion = 5 )
    AND a.estado = 1
    AND a.normada = 1
                    $WHERE ";

            $totalPaginado = $conn->execute($sql, $arrayParametrostotal)
                    ->fetchAll(
                    PDO::
                    FETCH_ASSOC
            );
            $data->total = $totalPaginado[0]['total'];
            /* FIN CALCULAR TOTAL DE ACTIVIDADES */
        }
        return $data;
    }

    public function listarNivsActvConsolidadosParaExportar($params, $start, $limit, $escont = false
    ) {

        $condiciones = array();
        $condicionesHaving = array();
        $solonivel = false;
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        // $addHaving = "Having true ";
        $arrayParametros = array();
        $arrayParametrostotal = array();
        /* Obtener el ejercicio actual */
        $arrayParametros[0] = $params['idejercicio'];
        $arrayParametros[1] = $params['idejercicio'];
        $arrayParametrostotal[0] = $params['idejercicio'];
        $strEntidadesProductoras = implode(
                ",", $params['entidades_productoras']
        );
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "a.codigo LIKE ? ";
                    $arrayParametros[] = $datos['data']['value'] . "%";
                    $arrayParametrostotal[] = $datos['data']['value'] . "%";
                } elseif ($datos['field'] == 'denominacion') {
                    $condiciones[] = "upper(a.denominacion) LIKE ? ";
                    $arrayParametros[] = "%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%";
                    $arrayParametrostotal[] = "%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%";
                } elseif ($datos['field'] == 'denespecialidad') {
                    $condiciones[] = "a.idespecialidad = ? ";
                    $arrayParametros[] = $datos['data']['value'];
                    $arrayParametrostotal[] = $datos['data']['value'];
                } elseif ($datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(a.descripcion) LIKE ?";
                    $arrayParametros[] = "%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%";
                    $arrayParametrostotal[] = "%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%";
                } elseif ($datos['field'] == 'nivelactividad') {
                    $campo = " ( SUM( COALESCE(aea.nivelactividadautomatico,0)) +
                        SUM( COALESCE(aea.nivelactividadautomatico,0)) +
                        SUM( COALESCE(aea.nivelactividadautomatico,0)) )";
                    $cond = "=";
                    if ($datos['data']['comparison'] == 'lt') {
                        $cond = "<";
                    } elseif ($datos['data']['comparison'] == 'gt') {
                        $cond = ">";
                    }
                    $condicionesHaving[] = $campo . $cond
                            . $datos['data']['value'];
                } elseif ($datos['field'] == 'nivelactividadautomatico') {
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = "SUM( COALESCE(aea.nivelactividadautomatico,0)) > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = "SUM( COALESCE(aea.nivelactividadautomatico,0)) < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = "SUM( COALESCE(aea.nivelactividadautomatico,0)) = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'nivelactividadmanual') {
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = "SUM( COALESCE(aem.nivelactividadmanual,0)) > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = "SUM( COALESCE(aem.nivelactividadmanual,0)) < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = "SUM( COALESCE(aem.nivelactividadmanual,0)) = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'nivelactividadproduccion') {
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = "SUM( COALESCE(aep.nivelactividadproduccion,0)) > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = "SUM( COALESCE(aep.nivelactividadproduccion,0)) < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = "SUM( COALESCE(aep.nivelactividadproduccion,0)) = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'restoxdistrib') {
                    $sqlRD = " COALESCE ( anp.nivelproduccion,0) -
                  COALESCE ( ( SELECT SUM(
                   COALESCE (subaem1.nivelactividadmanual,0)+ COALESCE
                   (subaea1.nivelactividadautomatico,0) +
            COALESCE (subaep1.nivelactividadproduccion,0)   )
            FROM mod_planificacion.dat_actividadentidad subae1
             LEFT JOIN mod_planificacion.dat_actividadentidadmanual subaem1
             ON(subaem1.idactividadentidad = subae1.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadautomatico subaea1
  ON(subaea1.idactividadentidad = subae1.idactividadentidad)
             LEFT JOIN mod_planificacion.dat_actividadentidadproduccion subaep1
             ON( subaep1.idactividadentidad = subae1.idactividadentidad)
        WHERE subae1.idejercicio = "
                            . $params['idejercicio'] .
                            "
                           AND subae1.idactividadentidad is not null
                                        AND subae1.identidad IN ("
                            . $strEntidadesProductoras .
                            ")
                        AND subae1.idactividad = a.idactividad ),0) ";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlRD . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlRD . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlRD . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'ajuste') {
                    $sqlAjuste = "round(SUM( COALESCE(ae.ajuste,0) ),4) ";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlAjuste . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlAjuste . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlAjuste . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'nivelactividadajuste') {
                    $sqlNAA = " SUM( COALESCE(aea.nivelactividadautomatico,0)) +
                    SUM( COALESCE(aem.nivelactividadmanual,0)) +
                   SUM( COALESCE(aep.nivelactividadproduccion,0 )) +
                                   round(SUM( COALESCE(ae.ajuste,0) ),4) ";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlNAA . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlNAA . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlNAA . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'importe') {
                    $sqlImp = "(SELECT SUM(round( Coalesce (
                            ((n.necesidad) *ind.precio)
				* ( COALESCE (aem.nivelactividadmanual,0)
				+ COALESCE (aea.nivelactividadautomatico,0)
				+COALESCE (aep.nivelactividadproduccion,0)),0)

		+ (Coalesce (( (n.necesidad) *ind.precio)
				* ( COALESCE (aem.nivelactividadmanual,0)
				+ COALESCE (aea.nivelactividadautomatico,0)
				+COALESCE (aep.nivelactividadproduccion,0)),0))
                                * ind.flete/100

		+(Coalesce (( (n.necesidad) *ind.precio)
			* ( COALESCE (aem.nivelactividadmanual,0)
			+ COALESCE (aea.nivelactividadautomatico,0)
			+ COALESCE (aep.nivelactividadproduccion,0)),0)) *
                        ind.contingencia/100 ,0))
		FROM mod_planificacion.dat_norma n
		INNER JOIN mod_planificacion.nom_indicador ind
		ON(n.idindicador = ind.idindicador AND
		    ind.estado = 1 AND
		    ind.idaprobacion >= 3 AND
		    ind.nivel = 1
		)
		WHERE n.idactividad = a.idactividad AND n.idejercicio =
                {$params['idejercicio']}
		GROUP BY
                                                ind.flete,
                                                ind.contingencia
		)";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlImp . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlImp . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlImp . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'importeajustado') {
                    $sqlImp = "( SELECT round( SUM((n.necesidad)*
                           ind.precio)* COALESCE( ae.ajuste,0)
			 +(SUM((n.necesidad)*ind.precio)*
                         COALESCE( ae.ajuste,0))*ind.flete/100+
			(SUM((n.necesidad)*ind.precio)*COALESCE
                        ( ae.ajuste,0))*ind.contingencia/100,0)
                         FROM mod_planificacion.dat_norma n
                        INNER JOIN mod_planificacion.nom_indicador ind
                           ON(n.idindicador = ind.idindicador AND
                                                    ind.estado = 1 AND
                                                    ind.idaprobacion >= 3 AND
                                                    ind.nivel = 1
                                                )

WHERE n.idactividad = a.idactividad AND n.idejercicio = {$params['idejercicio']}
                                                GROUP BY
                                                ind.flete,
                                                ind.contingencia
                                                )";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlImp . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlImp . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlImp . " = "
                                . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'importefinal') {
                    $sqlImp = "((SELECT SUM(round( Coalesce (
                            ((n.necesidad) *ind.precio)
				* ( COALESCE (aem.nivelactividadmanual,0)
				+ COALESCE (aea.nivelactividadautomatico,0)
				+COALESCE (aep.nivelactividadproduccion,0)),0)

		+ (Coalesce (( (n.necesidad) *ind.precio)
				* ( COALESCE (aem.nivelactividadmanual,0)
				+ COALESCE (aea.nivelactividadautomatico,0)
				+COALESCE (aep.nivelactividadproduccion,0)),0))
                                * ind.flete/100

		+(Coalesce (( (n.necesidad) *ind.precio)
			* ( COALESCE (aem.nivelactividadmanual,0)
			+ COALESCE (aea.nivelactividadautomatico,0)
			+ COALESCE (aep.nivelactividadproduccion,0)),0)) *
                        ind.contingencia/100 ,0))
		FROM mod_planificacion.dat_norma n
		INNER JOIN mod_planificacion.nom_indicador ind
		ON(n.idindicador = ind.idindicador AND
		    ind.estado = 1 AND
		    ind.idaprobacion >= 3 AND
		    ind.nivel = 1
		)
WHERE n.idactividad = a.idactividad AND n.idejercicio = {$params['idejercicio']}
		GROUP BY
                                                ind.flete,
                                                ind.contingencia
	) +
( SELECT round( SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0)+(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.flete/100+(SUM((n.necesidad)*ind.precio)
*COALESCE( ae.ajuste,0))*ind.contingencia/100,0)
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.nom_indicador ind
 ON(n.idindicador = ind.idindicador AND
ind.estado = 1 AND
ind.idaprobacion >= 3 AND
ind.nivel = 1
  )
 WHERE n.idactividad = a.idactividad AND n.idejercicio ={$params['idejercicio']}
GROUP BY ind.flete, ind.contingencia)

							 )";
                    if ($datos['data']['comparison'] == "gt") {
                        $condicionesHaving[] = $sqlImp . " > "
                                . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $condicionesHaving[] = $sqlImp . " < "
                                . $datos['data']['value'];
                    } else {
                        $condicionesHaving[] = $sqlImp . " = "
                                . $datos['data']['value'];
                    }
                    $sqlImp = "";
                } elseif ($datos['field'] == 'idaprobacion') {
                    $sqlAprob = "AVG( COALESCE( ae.idaprobacion, 1) )";
                    if ($datos['data']['value'] == 'No') {
                        $condicionesHaving[] = $sqlAprob . " = 1";
                    } else {
                        if ($datos['data']['value'] == 'Si') {
                            $condicionesHaving[] = $sqlAprob . " = 3";
                        } else {
                            if ($datos['data']['value'] == 'Rector') {
                                $condicionesHaving[] = $sqlAprob . " = 4";
                            }
                        }
                    }
                } elseif ($datos['field'] == 'denmodelo') {
                    if ($datos['data']['value'] == '-') {
                        $condiciones[] = "am.idmodelo IS NULL ";
                    } else {
                        $condiciones[] = "am.idmodelo = ? ";
                        $arrayParametros[] = $datos['data']['value'];
                        $arrayParametrostotal[] = $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'comportamiento') {
                    if ($datos['data']['value'] == 'Propia') { //propia
                        $condiciones[] = " aec.iddatosnomenclador = "
                                . $iddatosnomanclador['propia'] .
                                " ";
                    } else {
                        if ($datos['data']['value'] == 'Demandada'
                        ) { //demandante
                            $condiciones[] = " aec.iddatosnomenclador = ? ";
                            $arrayParametros[] = $iddatosnomanclador['demandada'];
                            $arrayParametrostotal[] = $iddatosnomanclador['demandada'];
                        } else {
                            if ($datos['data']['value'] == 'Compartida'
                            ) { //compartida
                                $condiciones[] = " aec.iddatosnomenclador = ? ";
                                $arrayParametros[] = $iddatosnomanclador['compartida'];
                                $arrayParametrostotal[] = $iddatosnomanclador['compartida'];
                            }
                        }
                    }
                }
            }
        }

        $strEspecialidadesDemandantes = "";
        $coma = "";
        $arrayIdespecialidades = $params['id_especialidades'];
        foreach ($arrayIdespecialidades as $idespecialidad) {
            $strEspecialidadesDemandantes = $strEspecialidadesDemandantes
                    . $coma . "'" . $idespecialidad .
                    "'";
            $coma = ",";
        }
        $ADDWHERE = "";
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . " AND " . $condicion . " ";
        }
        $HAVING = "";
        $AND = "";
        foreach ($condicionesHaving as $condicionHaving) {
            $HAVING = $HAVING . $AND . " " . $condicionHaving . " ";
            $AND = "AND";
        }
        if ($HAVING != "") {
            $HAVING = "HAVING " . $HAVING;
        }
        /* temporal poner ? */
        $strEntidades = "";
        $arrayEntidades = $params['entidades'];
        foreach ($arrayEntidades as $ent) {
            if ($strEntidades == "") {
                $strEntidades = $ent;
            } else {
                $strEntidades = $strEntidades . "," . $ent;
            }
        }
        if ($params['calcularimporte'] == 'true') {


            $calcularimporte = "((SELECT SUM(round( Coalesce ( ((n.necesidad) *ind.precio)
                * ( COALESCE (aem.nivelactividadmanual,0)
                + COALESCE (aea.nivelactividadautomatico,0)
                +COALESCE (aep.nivelactividadproduccion,0)),0)

+ (Coalesce (( (n.necesidad) *ind.precio)
                * ( COALESCE (aem.nivelactividadmanual,0)
                + COALESCE (aea.nivelactividadautomatico,0)
                +COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.flete/100

+(Coalesce (( (n.necesidad) *ind.precio)
* ( COALESCE (aem.nivelactividadmanual,0)
+ COALESCE (aea.nivelactividadautomatico,0)
+ COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.contingencia/100 ,0))
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.nom_indicador ind
ON(n.idindicador = ind.idindicador AND
    ind.estado = 1 AND
    ind.idaprobacion >= 3 AND
        ind.nivel = 1
    )
 WHERE n.idactividad = a.idactividad AND n.idejercicio ={$params['idejercicio']}
     GROUP BY
                                    ind.flete,
                                    ind.contingencia
    ))";

            $calcularimporteAjustado = "( SELECT (round( SUM((n.necesidad)*ind.precio)*
    COALESCE( ae.ajuste,0)
+(SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0))
*ind.flete/100+
(SUM((n.necesidad)*ind.precio)*COALESCE( ae.ajuste,0))
*ind.contingencia/100,0))
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.nom_indicador ind
ON(n.idindicador = ind.idindicador AND
    ind.estado = 1 AND
    ind.idaprobacion >= 3 AND
    ind.nivel = 1
         )
WHERE n.idactividad = a.idactividad AND n.idejercicio = {$params['idejercicio']}
         GROUP BY
         ind.flete,
         ind.contingencia

                                    )";
            $calcularimporteFinal = "((SELECT SUM(round( Coalesce ( ((n.necesidad) *ind.precio)
                    * ( COALESCE (aem.nivelactividadmanual,0)
                    + COALESCE (aea.nivelactividadautomatico,0)
                    +COALESCE (aep.nivelactividadproduccion,0)),0)

    + (Coalesce (( (n.necesidad) *ind.precio)
                    * ( COALESCE (aem.nivelactividadmanual,0)
                    + COALESCE (aea.nivelactividadautomatico,0)
                    +COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.flete/100

    +(Coalesce (( (n.necesidad) *ind.precio)
            * ( COALESCE (aem.nivelactividadmanual,0)
            + COALESCE (aea.nivelactividadautomatico,0)
            + COALESCE (aep.nivelactividadproduccion,0)),0)) * ind.contingencia/100 ,0))
    FROM mod_planificacion.dat_norma n
    INNER JOIN mod_planificacion.nom_indicador ind
    ON(n.idindicador = ind.idindicador AND
        ind.estado = 1 AND
        ind.idaprobacion >= 3 AND
        ind.nivel = 1
)
WHERE n.idactividad = a.idactividad AND n.idejercicio = 1))+
( SELECT round( SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0)
+(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.flete/100+
(SUM((n.necesidad)*ind.precio)*
COALESCE( ae.ajuste,0))*ind.contingencia/100,0)
FROM mod_planificacion.dat_norma n
INNER JOIN mod_planificacion.nom_indicador ind
ON(n.idindicador = ind.idindicador AND
    ind.estado = 1 AND
    ind.idaprobacion >= 3 AND
    ind.nivel = 1
)

WHERE n.idactividad = a.idactividad AND n.idejercicio = {$params['idejercicio']}
GROUP BY
ind.flete,
ind.contingencia

            )";
        } else {
            $calcularimporte = "0";
            $calcularimporteAjustado = "0";
            $calcularimporteFinal = "0";
        }

        if ($escont == false) {
            /* LISTAR CONSOLIDADO DE ACTVIDADES CON NIVELES */


            $conn = Doctrine_Manager::connection();
            $query = "SELECT DISTINCT a.idactividad,a.codigo,a.denominacion,
  a.descripcion,a.idespecialidad,
  SUM( COALESCE(aea.nivelactividadautomatico,0)) as nivelactividadautomatico ,
  SUM( COALESCE(aem.nivelactividadmanual,0)) as nivelactividadmanual ,
  SUM( COALESCE(aep.nivelactividadproduccion,0 )) as nivelactividadproduccion,
  '0' as nivelactividad,
  round(SUM( COALESCE(ae.ajuste,0) ),4) as ajuste,
                          AVG(
                    CASE WHEN
                    COALESCE(ae.idaprobacion,1) = 1
                    THEN

                    -100
                    ELSE
                            ae.idaprobacion
                    END
) as idaprobacion,
            mod.idmodelo,
            mod.denominacion as denmodelo,
            $calcularimporte as importe,
            $calcularimporteAjustado as importeajustado,
            $calcularimporteFinal as importefinal,
            aec.iddatosnomenclador,
            aec.idespecialidad as idespcomportamiento,
    ( COALESCE ( anp.nivelproduccion,0) - COALESCE ( (SELECT SUM(
        COALESCE (subaem.nivelactividadmanual,0)+ COALESCE
        (subaea.nivelactividadautomatico,0) +
        COALESCE (subaep.nivelactividadproduccion,0)
        )
        FROM mod_planificacion.dat_actividadentidad subae
        LEFT JOIN mod_planificacion.dat_actividadentidadmanual subaem
        ON(subaem.idactividadentidad = subae.idactividadentidad)
        LEFT JOIN mod_planificacion.dat_actividadentidadautomatico subaea
        ON(subaea.idactividadentidad = subae.idactividadentidad)
        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion subaep
        ON( subaep.idactividadentidad = subae.idactividadentidad)
        WHERE subae.idejercicio = {$params['idejercicio']}
        AND subae.idactividadentidad is not null
        AND subae.identidad IN ("
                    . $strEntidadesProductoras .
                    ")
AND subae.idactividad = a.idactividad
),0) )  as restoxdistrib,
( SELECT aec2.idespecialidad
    FROM mod_planificacion.dat_actespcomportamiento aec2
    WHERE a.idactividad = aec2.idactividad
    AND a.idespecialidad  IN($strEspecialidadesDemandantes)
    AND aec2.iddatosnomenclador = {$iddatosnomanclador['demandada']}
            AND aec2.idespecialidad <> a.idespecialidad
    OFFSET 0 LIMIT 1 ) as existe_demanda,
'-' as nivelactividadct
FROM mod_planificacion.nom_actividad a
INNER JOIN mod_planificacion.dat_actespcomportamiento aec
ON(a.idactividad = aec.idactividad AND aec.idespecialidad
IN($strEspecialidadesDemandantes))
" . (($solonivel == 'true') ? "INNER" :
                            "LEFT") . " JOIN dat_actividadentidad ae
ON(ae.idactespcomportamiento = aec.idactespcomportamiento
AND ae.identidad IN( $strEntidades )
AND ae.idejercicio =  {$params['idejercicio']} )

LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
ON(aem.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
ON(aea.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
ON( aep.idactividadentidad = ae.idactividadentidad)

LEFT JOIN mod_planificacion.dat_actividadmodelo am
ON(am.idactividad = a.idactividad)

LEFT JOIN mod_planificacion.dat_modelo mod
ON(mod.idmodelo = am.idmodelo)
LEFT JOIN mod_planificacion.dat_actividadnivelproduccion anp
ON(anp.idactividad = a.idactividad )
WHERE
a.normada = 1
AND ( a.idaprobacion >= 3 )
AND a.estado = 1
AND a.nivel = {$params['nivel']}
$ADDWHERE
    GROUP BY
    a.idactividad,
    a.codigo,
    a.denominacion,
    a.descripcion,
    a.idespecialidad,
    mod.denominacion,
    aec.idespecialidad,
    aec.iddatosnomenclador,
    anp.nivelproduccion,
    mod.idmodelo,
    ae.ajuste,
    aem.nivelactividadmanual,
    aea.nivelactividadautomatico,
    aep.nivelactividadproduccion
                            ORDER BY mod.idmodelo,a.codigo,a.denominacion
                            OFFSET $start
                            LIMIT $limit";

            $arrayParametros[] = $params['start'];
            $arrayParametros[] = $params['limit'];
            $res = $conn->execute($query);
            $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $arrayTmpespecialidades = array();
            foreach ($data->data as $indice => $actividad) {
                $data->data[$indice]['importe'] = number_format(
                        $actividad['importe'], '3', '.', ','
                );
                $data->data[$indice]['importeajustado'] = number_format(
                        $actividad['importeajustado'], '3', '.', ','
                );
                $data->data[$indice]['importefinal'] = number_format(
                        $actividad['importefinal'], '3', '.', ','
                );
                $data->data[$indice]['esorigenautomatico'] = 0;
                if ($arrayTmpespecialidades['den_'
                        . $actividad['idespecialidad']] == null
                ) {
                    $especialidades = $this->nomenclador->selectParam(
                            'nom_especialidad', array('denespecialidad'), 0, 0, "idespecialidad = " . $actividad['idespecialidad']
                    );
                    $arrayTmpespecialidades['den_'
                            . $actividad['idespecialidad']] = $especialidades[0]['denespecialidad'];
                }
                $data->data[$indice]['denespecialidad'] = $arrayTmpespecialidades['den_'
                        . $actividad['idespecialidad']];

                $data->data[$indice]['sololectura'] = true;
                if ($actividad['nivelactividadmanual'] == null) {
                    $data->data[$indice]['nivelactividadmanual'] = 0;
                }
                if ($actividad['nivelactividadautomatico'] == '0') {
                    $data->data[$indice]['nivelactividadautomatico'] = 0;
                } else {
                    $data->data[$indice]['esorigenautomatico'] = 1;
                }
                if ($actividad['idaprobacion'] == null) {
                    $data->data[$indice]['idaprobacion'] = '1';
                }
                $data->data[$indice]['nivelactividad'] = $data->data[$indice]['nivelactividadmanual'] +
                        $data->data[$indice]['nivelactividadautomatico'] + $data->data[$indice]['nivelactividadproduccion'];
                $data->data[$indice]['comportamiento'] = ($actividad['iddatosnomenclador'] == $iddatosnomanclador['compartidaautomatico'] || $actividad['iddatosnomenclador'] == $iddatosnomanclador['compartida']) ? 1 : 0;
                if ($actividad['iddatosnomenclador'] == $iddatosnomanclador['propia']
                ) {
                    $data->data[$indice]['comportamiento'] = -1;
                }
                if ($actividad['existe_demanda'] == null) {
                    $data->data[$indice]['restoxdistrib'] = '-';
                }
                if ($actividad['ajuste'] == '0.000') {
                    $data->data[$indice]['ajuste'] = '0';
                }
            }

            if ($params['calcularimporte'] == 'true') {
                //  CALCULAR EL IMPORTE
                $conn = Doctrine_Manager::connection();
                $queryDos = "SELECT sum(mialias.importe) as importe
                                FROM (SELECT
    DISTINCT a.idactividad,
    $calcularimporte as importe

    FROM nom_actividad a

    INNER JOIN dat_actespcomportamiento aec
    ON(a.idactividad = aec.idactividad AND aec.idespecialidad
    IN($strEspecialidadesDemandantes))
    " . (($solonivel == true) ? "INNER" :
                                "LEFT") . " JOIN dat_actividadentidad ae
        ON(ae.idactespcomportamiento = aec.idactespcomportamiento
        AND ae.identidad IN( $strEntidades )
        AND ae.idejercicio = {$params['idejercicio']} )

        LEFT JOIN dat_actividadentidadmanual aem
        ON(aem.idactividadentidad = ae.idactividadentidad)

        LEFT JOIN dat_actividadentidadautomatico aea
        ON(aea.idactividadentidad = ae.idactividadentidad)

        LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
        ON( aep.idactividadentidad = ae.idactividadentidad)

        LEFT JOIN dat_actividadmodelo am
        ON(am.idactividad = a.idactividad)

        LEFT JOIN dat_modelo mod
        ON(mod.idmodelo = am.idmodelo)

        WHERE
        a.idactividad IN (
        SELECT subnorma.idactividad
        FROM mod_planificacion.dat_norma subnorma
        WHERE subnorma.idactividad = a.idactividad
        AND subnorma.idejercicio = {$params['idejercicio']} )
        AND
        a.idaprobacion >= 3
        AND a.idaprobacion <= 4
        AND a.estado = 1
        AND a.nivel = {$this->nivel}
        $ADDWHERE
        GROUP BY a.idactividad,
        aem.nivelactividadmanual, aea.nivelactividadautomatico,
        aep.nivelactividadproduccion
            )  mialias";

                $res = $conn->execute(
                        $queryDos, $arrayParametrostotal
                );
                $resultImp = $res->fetchAll(PDO::FETCH_ASSOC);

                $data->importetotal = $resultImp[0]['importe'];
            }
        } else {
            /* Contar total */
            $conn = Doctrine_Manager::connection();
            $queryUno = " SELECT
    COUNT( DISTINCT a.idactividad ) AS total
    FROM mod_planificacion.nom_actividad a

    INNER JOIN mod_planificacion.dat_actespcomportamiento aec
    ON(a.idactividad = aec.idactividad AND aec.idespecialidad IN
    ($strEspecialidadesDemandantes))
    " . (($solonivel == 'true') ?
                            "INNER" : "LEFT") . " JOIN mod_planificacion.dat_actividadentidad ae
    ON(ae.idactespcomportamiento = aec.idactespcomportamiento

    AND ae.idejercicio = 1 )

    LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
    ON(aem.idactividadentidad = ae.idactividadentidad)
    LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
    ON(aea.idactividadentidad = ae.idactividadentidad)
    LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
    ON( aep.idactividadentidad = ae.idactividadentidad)

    LEFT JOIN mod_planificacion.dat_actividadmodelo am
    ON(am.idactividad = a.idactividad)

    LEFT JOIN mod_planificacion.dat_modelo mod
    ON(mod.idmodelo = am.idmodelo)

    WHERE
    a.normada = 1
    AND ( a.idaprobacion >= 3 )
    AND a.estado = 1
    AND a.nivel = {$this->nivel}
												$ADDWHERE
                                                ";
            $res = $conn->execute($queryUno);

            $resultadoGuion = $res->fetchAll(PDO::FETCH_ASSOC);
            $data->total = $resultadoGuion[0]['total'];
        }
        return $data;
    }

    private function actualizarNivActAutomaticos($params) {
        $idespDemandante = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;


        $modeloActEnt = new DatActividadentidad();
        $arrayEnts = DatActividadentidad::buscarEntidadesAsociadasAActividad(
                        $params['activs']
        );

        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();

        foreach ($arrayEnts as $asocActent) {

            $this->actualizarAsociacionesAutomaticas(
                    $asocActent->idactividad, $asocActent->identidad, $idespDemandante, $params['iddns'], $arrayIdejercicio[0]['idejercicio']
            );
        }

        return true;
    }

    public function gestPermisos($params) {
        $query = Doctrine_Query::create();
        $query->select(
                'dpfe.insertar as insertar, dpfe.modificar as modificar,'
                . ' dpfe.eliminar as eliminar, dpfe.guardar as guardar,'
                . 'dpf.idprocesofuncionalidad,dpfe.idprocesofuncionalidadentidad'
                . ',dpfest.idprocesofuncionalidadestado'
        )->from('DatProcesofuncionalidad dpf')->innerjoin(
                'dpf.DatProcesofuncionalidadestado dpfest'
        )->innerjoin('dpfest.DatProcesofuncionalidadentidad dpfe')->where(
                "dpfest.idejercicio = ?  AND dpfe.identidad = ? AND dpfest.activo = 1
                    AND dpf.referencia LIKE '%" . ($params['idfuncionalidad'])
                . "' ", array($params['idejercicio'], $params['identidad'])
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();

        return $result;
    }

    public function cargarImporteInicial($parametros) {
        if ($parametros['idejercicio']) {
            $idejercicio = $parametros['idejercicio'];
        } else {
            $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $idejercicio[0]['idejercicio'];
        }
        $res = implode(",", $parametros['arrayidactividad']);
        if ($parametros['arrayidactividad']) {
            $paramsQuery = array("{" . $res . "}", $idejercicio,
                $parametros['identidad']);
        } else {
            $paramsQuery = array(null, $idejercicio, $parametros['identidad']);
        }
        $query = "select * from mod_planificacion.f_calcimporteinicial(?,?,?);";
        $conn = Doctrine_Manager::connection();

        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            return $result[0]['f_calcimporteinicial'];
        } else {
            return '23';
        }
    }

    public function calcularAjuste($parametros) {
        if ($parametros['idejercicio']) {
            $idejercicio = $parametros['idejercicio'];
        } else {
            $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $idejercicio[0]['idejercicio'];
        }
        $res = implode(",", $parametros['arrayidactividad']);
        if ($parametros['arrayidactividad']) {
            $paramsQuery = array("{" . $res . "}", $idejercicio,
                $parametros['identidad'],
                $parametros['porcientoajuste']);
        } else {
            $paramsQuery = array(null, $idejercicio, $parametros['identidad'],
                $parametros['porcientoajuste']);
        }

        $query = "select * from mod_planificacion.f_calcajuste(?,?,?,?);";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            return $result[0]['f_calcajuste'];
        } else {
            return '23';
        }
    }

    public function eliminarAjustes($parametros) {
        $res = implode(",", $parametros['arrayidactividad']);
        $conn = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planificacion.dat_actividadentidad SET ajuste = 0 "
                . "WHERE (idactividad IN ("
                .
                $res . ")) AND idejercicio = " . $parametros['idejercicio'] .
                " AND identidad = " . $parametros['identidad'];
        $result = $conn->execute($sql);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            return '1';
        } else {
            return '23';
        }
    }

    //insertarAjusteNivel
    public function insertarAjusteNivel($parametros) {
        $idejercicio = $parametros['idejercicio'];
        $res = implode(",", $parametros['arrayidactividad']);
        if ($parametros['arrayidactividad']) {
            $paramsQuery = array("{" . $res . "}", $idejercicio,
                $parametros['identidad']);
        } else {
            $paramsQuery = array(null, $idejercicio, $parametros['identidad']);
        }
        $query = "select * from mod_planificacion.f_insertarajustenivel(?,?,?);";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            return $result[0]['f_insertarajustenivel'];
        } else {
            return '23';
        }
    }

    public function listarEntidadesSegunDatoNom($params) {
        $sql = "SELECT esp.idespecialidad,esp.denespecialidad,
                actespc.idespecialidad as compartida
        FROM mod_datosmaestros.nom_especialidad esp
        LEFT JOIN mod_planificacion.dat_actespcomportamiento actespc
        ON(esp.idespecialidad=actespc.idespecialidad
        and actespc.idactividad=" . $params['idactividad'] . "
        and actespc.iddatosnomenclador=" . $params['iddatosnomenclador'] . " )
        --where esp.idpadre=esp.idespecialidad
        ";
        $conn = Doctrine_Manager::connection();
        $temp = $conn->execute($sql);
        $result->data = $temp->fetchAll();
        return $result;
    }

    public function listarEspecialidadesPadre() {
        $sql = "SELECT esp.idespecialidad as id,
                esp.denespecialidad as denominacion
        FROM mod_datosmaestros.nom_especialidad esp
        where esp.idpadre=esp.idespecialidad";
        $conn = Doctrine_Manager::connection();
        $temp = $conn->execute($sql);
        $result->data = $temp->fetchAll();
        return $result;
    }

    public function listarSubEspecialidades() {
        $sql = "SELECT esp.idespecialidad as id,
                esp.denespecialidad as denominacion
        FROM mod_datosmaestros.nom_especialidad esp
        where esp.idpadre<>esp.idespecialidad";
        $conn = Doctrine_Manager::connection();
        $temp = $conn->execute($sql);
        $result->data = $temp->fetchAll();
        return $result;
    }

    public function guardarResumenCosto($params) {

        $idejercicio = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $params['idejercicio'] = $idejercicio['idejercicio'];
        $existeactivCosto = self::existeActivCosto($params['idactividad']);

        if ($existeactivCosto[0] != null) {
            if ($params['otroscostos'] == 0 && $params['costosindirectos'] == 0
            ) {
                $conn = Doctrine_Manager::connection();
                $sql = "DELETE FROM mod_planificacion.dat_rescostoactividad
                WHERE mod_planificacion.dat_rescostoactividad.idactividad = "
                        . $params['idactividad'] . " ";
                $resUno = $conn->execute($sql);
                $result = 3;
            } else {
                $conn = Doctrine_Manager::connection();
                $sql = "UPDATE mod_planificacion.dat_rescostoactividad
            SET costosindirectos = " . $params['costosindirectos'] . ",
            otroscostos = " . $params['otroscostos'] . "
            WHERE mod_planificacion.dat_rescostoactividad.idactividad = "
                        . $params['idactividad'] . " ";
                $resUno = $conn->execute($sql);
                $result = 2;
            }
        } else {
            $objCost = new DatRescostoactividad();
            $objCost->idactividad = $params['idactividad'];
            $objCost->costosindirectos = $params['costosindirectos'];
            $objCost->otroscostos = $params['otroscostos'];
            $objCost->idejercicio = $params['idejercicio'];
            $objCost->save();
            $result = 1;
        }
        return $result;
    }

    public function existeActivCosto($idactividad) {
        $sql = "SELECT rca.idrescostoactividad
        FROM mod_planificacion.dat_rescostoactividad rca
        where rca.idactividad=" . $idactividad . " ";
        $conn = Doctrine_Manager::connection();
        $temp = $conn->execute($sql);
        $result = $temp->fetchAll();
        return $result;
    }

    public function listarTodasAct($params, $identidad, $idejercicio) {
        $modeloActEnt = new DatActividadentidad();
        $actividades = DatActividadentidad::listarTodasActividades(
                        $params, $identidad, $idejercicio
        );
        return $actividades;
    }

    public function updateNAM($idactM, $cociente) {
        $arr = array();
        foreach ($idactM as $dat) {
            $arr[] = $dat['idactividadentidad'];
        }
        $array = implode(',', $arr);

        $conn = Doctrine_Manager::connection();
        $query = "UPDATE mod_planificacion.dat_actividadentidadmanual
                         SET nivelactividadmanual = '" . $cociente . "'
                          WHERE  idactividadentidad = " . $array . " ";

        $conn->execute($query);
    }

    public function exportarCalculoAExcel($params) {
        $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
        $denent = $idestructura[0]->denominacion;
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents($dir_apps . "/planificacion/planmeta/views/idioma/{$idioma}/bpgestnivelesactividad/bpgestnivelesactividad.json"
        );
        unset($idioma);
        unset($dir_apps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $importeajust = 'Importe Ajustado';
        $etiquetas = split(",", $etiquetas);
        $array_etiq = array();
        foreach ($etiquetas as $key => $valor) {
            $array_etiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $array_etiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $array_etiq[$indice] = $array_etiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=niveles.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<caption> ' . $denent . '  </caption>';
        echo "
        <table border=1 cellspacing=0 width=60%>
        <tr>
             <th align=left>C&oacute;digo actividad</th>
             <th align=left>Denominaci&oacute;n actividad</th>
             <th align=left>Nivel actividad</th>
             <th align=left>C&oacute;digo</th>
             <th align=left>Denominaci&oacute;n</th>
             <th align=left >Unidad de medida</th>
             <th align=left >Esfera</th>
             <th align=left >Precio MN</th>
             <th align=left >Cantidad</th>
             <th align=left >Importe</th>
         </tr>";
        $array_idsaprobacion = array();
        $array_idsaprobacion['id_1'] = $array_etiq['lbNo'];
        $array_idsaprobacion['id_3'] = $array_etiq['lbSi'];
        $array_idsaprobacion['id_4'] = $array_etiq['lbRector'];
        $array_idsaprobacion['id_5'] = $array_etiq['lbRector'];
        $params['iddatosnomanclador'] = DatActespcomportamiento::obtenerIdDatosNom();

        if ($params['global'] == 'false') {
            $params['entidades'] [] = $params['identidad'];
        } else {
            $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
            $params['entidades'] [] = $params['identidad'];
        }
        $importePorAct = 0;
        $importeTotal = 0;
        $totaldata = DatBasescalculoModel::exportarCalculoAExcel($params);
        foreach ($totaldata->data as $k => $value) {
            if ($totaldata->data[$k - 1]['codactividad'] != $value['codactividad']) {
                if ($k != 0) {
                    echo "  <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th>Importe total por actividad:</th>
                            <th>" . $importePorAct . "</th>";
                }
                $importePorAct = 0;
                echo "<tr> <td align=right><font color=white>'</font>" . $value['codactividad'] . "<font color=white>'</font></td>
                        <td align=right><font color=white>'</font>" . $value['denomactividad'] . "<font color=white>'</font></td>
                        <td align=right><font color=white>'</font>" . $value['nivelactividad'] . "<font color=white>'</font></td>";
            } else {
                echo "<tr> <td align=right><font color=white>'</font>-<font color=white>'</font></td>
                        <td align=right><font color=white>'</font>-<font color=white>'</font></td>
                        <td align=right><font color=white>'</font>-<font color=white>'</font></td>";
            }
            echo "<td align=right><font color=white>'</font>" . $value['codigo'] . "<font color=white>'</font></td>
                     <td align=left>" . utf8_decode($value['denominacion']) . "</td>
                     <td align=center >" . $value['abrevum'] . "</td>
                     <td align=left >" . $value['denominacionmod'] . "</td>
                     <td align=right >" . $value['precio'] . "</td>
                     <td align=right >" . $value['necesidadredondeada'] . "</td>
                     <td align=right >" . $value['importe'] . "</td>
                     </tr>";
            $importePorAct += $value['importe'];
            $importeTotal += $value['importe'];
        }
        echo "  <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th>Importe total por actividad:</th>
                            <th>" . $importePorAct . "</th>";
        echo "<tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
             <th>Importe Total:</th>
             <th>" . $importeTotal . "</th>
            </tr>
</table>";
    }

    public function exportarAExcelConDesgloses($params) {
        $tipomod = new NomTipomodelo();
        $columnasDinam = $tipomod->getColumnasDinamicasSegunModelo($params['idmodelo']);
        $cantcolumnasDinam = count($columnasDinam);
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dirApps .
                "/planificacion/planmeta/views/idioma/{$idioma}/"
                . "bpgestnivelesactividad/bpgestnivelesactividad.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $importeajust = 'Importe Ajustado';
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq[$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=niveles_con_desgloses.xls");
        header("Content-Transfer-Encoding: binary ");

        $encabezado .= '<caption> ' . $arrayEtiq['lbNivelActividad'] . 'Entidad: ' . $params['text'] . ' </caption>';
        $encabezado .= "
        <table border=1 cellspacing=0 width=80%>
        <tr>
            <th align=left>C&oacute;digo</th>
             <th align=left>Denominaci&oacute;n</th>
             <th align=left >Nivel autom&aacute;tico</th>
             <th align=left >Nivel manual</th>
             <th align=left >Nivel demandado</th>
             <th align=left >Nivel</th>
             <th align=left >Ajuste</th>
              <th align=left >Nivel ajustado</th>
             <th align=left>Aprobaci&oacute;n</th>
             <th align=left>Plan</th>
			 <th align=left>Rector</th>
			 <th align=left>Importe Inicial</th>
			 <th align=left>{$importeajust}</th>
			 <th align=left>Importe Final</th>
			 <th align=left>Nivel Actividad</th>";
        foreach ($columnasDinam as $value) {
            $encabezado .= "<th align=left>" . $value['etiqueta'] . "</th>";
        }
        $encabezado .= "</tr>";
        $arrayIdsaprobacion = array();
        $arrayIdsaprobacion['id_1'] = 'No';
        $arrayIdsaprobacion['id_3'] = 'Si';
        $arrayIdsaprobacion['id_4'] = 'Rector';
        $arrayIdsaprobacion['id_5'] = 'Rector';

        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);
        if ($params['identidad'][0] != null || $params['identidad'][0] != '' || $params['identidad'][0]) {
            $params['identidad'] = $params['identidad'][0];
            $params['entidades'] = array('0' => $params['identidad']);
            $datosEntidad = $this->integrator->metadatos->DameEstructura(
                    $params['identidad']
            );

            $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;

            if ($params['esrector'] == 'true') {
                $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
            }
        }

        $params['exportar'] = true;
        $arrayNivsact = $this->listarActsNivActPorEntidad($params);
        foreach ($arrayNivsact->data as $value) {
            if ($value['idaprobacion'] < 1) {
                $value['idaprobacion'] = 1;
            }
            $params['idactividad'] = $value['idactividad'];
            $params['identidad'] = $value['identidad'];
            $result = DatActividadentidad::getDatosDesgloseActividad($params);
            foreach ($result as $key => $valor) {
                $datostabla .= "<tr> <td align=right><font color=white>'</font>"
                        . $value['codigo'] .
                        "<font color=white>'</font></td>
             <td align=left>" . utf8_decode(/*$value['denominacion']*/"áéíóú") . "</td>".
             "<td align=right>" . (($value['nivelactividadautomatico'] != null) ?
                                number_format(
                                        $value['nivelactividadautomatico'], '3', '.', ','
                                ) : '0') . "</td>

             <td align=right >" . (($value['nivelactividadmanual'] != null) ?
                                number_format(
                                        $value['nivelactividadmanual'], '3', '.', ','
                                ) :
                                '0') . "</td>
             <td align=right >" . (($value['nivelactividadproduccion'] != null) ?
                                number_format(
                                        $value['nivelactividadproduccion'], '3', '.', ','
                                ) : '0') . "</td>
             <td align=right >" . number_format(
                                $value['nivelactividad'], '3', '.', ','
                        ) . "</td>
             <td align=right >" . number_format($value['ajuste'], '3', '.', ',')
                        . "</td>
                <td align=right >" . number_format(
                                $value['nivelactividad'] + $value['ajuste'], '3', '.', ','
                        ) . "</td>
             <td align=right >" . $arrayIdsaprobacion['id_' . round(
                                $value['idaprobacion']
                        )] .
                        "</td>
             <td align=left>" . (($value['denmodelo'] == null) ? "-" : utf8_decode($value['denmodelo'])) .
                        "</td>
			 <td align=right >" . $arrayIdsaprobacion['id_' . round(
                                $value['idaprobacion']
                        )] .
                        "</td>
             <td align=right>" . $value['importe'] . "</td>
             <td align=right>" . $value['importeajustado'] . "</td>
             <td align=right>" . $value['importefinal'] . "</td>";
                $datostabla .= "<td align=right>" . $valor['nivelactivdesglosado'] . "</td>";
                $denomDatos = explode(',', $valor['denominacion']);
                foreach ($denomDatos as $den) {
                    $datostabla .= "<td align=right>" . utf8_decode($den) . "</td>";
                }
            }
        }

        $pie .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
             <th>Importe Total:</th><td>" . $arrayNivsact->importe . "</td>
             <td>" . $arrayNivsact->importeajuste . "</td><td>" . $arrayNivsact->importefinal . "</td></tr></table>";

        $tabla = $encabezado . $datostabla . $pie;
        echo $tabla;
    }

    //importar NA
    //Importar fichero
    public function importarFichero($idusuario) {
        //creando el arreglo de las columnas fijas
        $columnas = array();
        $columnas[0][0] = "Código de la actividad";
        $columnas[0][1] = 0;

        $columnas[1][0] = "Denominación";
        $columnas[1][1] = 0;

        $columnas[2][0] = "Nivel de actividad manual";
        $columnas[2][1] = 0;

        //leyendo el excel
        $filename = $_FILES['file']['tmp_name'];
        $file = $filename;
        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($file);
        $dat = $data->sheets[0]['cells'];

        //obteniendo las columnas del excel
        $columnasExcel = array();
        foreach ($dat[0] as $k => $col) {
            $columnasExcel[$k][0] = $col;
            $columnasExcel[$k][1] = $k;
        }
        //convirtiendo el arreglo de datos en un text
        $datos = serialize($dat);

        //eliminando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarnivelesxls" . $idusuario);

        //creando tabla donde se guardan los datos del excel       
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarnivelesxls" . $idusuario . " (xls TEXT) WITH (OIDS = FALSE)");

        //almacenando los datos en la BD para usarlos en la próxima petición         
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importarnivelesxls" . $idusuario . "(xls) VALUES ('" . $datos . "')");

        $data = array('columnas' => $columnas, 'columnasExcel' => $columnasExcel);
        return $data;
    }

    //validar datos a importar
    public function importarDatosRelacionados($relaciones, $identidad, $idejercicio, $idespecialidad, $idusuario) {
        $datos = DatActividadentidad::obtenerDatosCargados($idusuario);
        //preparando datos para crear tabla dinamica
        //en esta variable se guarda, de las columnas,
        //la posicion de su columna correspondiente en el excel
        $posiciones = array();
        foreach ($relaciones as $rel) {
            if ($rel->denominacionOS == "Código de la actividad") {
                $posiciones['codigo'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Denominación") {
                $posiciones['denominacion'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Nivel de actividad manual") {
                $posiciones['namanual'] = $rel->posicioncolumnaExcel;
                continue;
            }
        }
        DatActividadentidad::crearTablaTemporal($idusuario);
        foreach ($datos as $j => $row) {
            //ignorando los datos del encabezado de la tabla
            if ($j == 0) {
                continue;
            }
            //dando valor a la codigo si viene vacio
            if ($row[$posiciones['codigo']]) {
                $codigo = utf8_encode($row[$posiciones['codigo']]);
            } else {
                $codigo = "-";
            }
            //dando valor al namanual si viene vacio
            $namanual = 0;
            if ($row[$posiciones['namanual']]) {
                $n = self::validarNumericPositivo($row[$posiciones['namanual']]);
                if ($n != 'no')
                    $namanual = $n;
            }
            DatActividadentidad::insertarDatosTablaTemporal($idusuario, $codigo, $namanual);
        }
        self::validarDatosImportados($idusuario, $idespecialidad, $idejercicio, $identidad);
    }

    private function validarNumericPositivo($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor) && $valor >= 0) {
            return $valor;
        }
        return 'no';
    }

//Validar datos importados
    private function validarDatosImportados($idusuario, $idespecialidad, $idejercicio, $identidad) {
        try {
            //Buscando los datosnomenclador para los mensajes de validación 
            $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
            foreach ($array_ests_dnom as $k => $dn) {
                unset($array_ests_dnom[$k]);
                $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
            }

            $formato = NomActividad::obtener_ConfFormato_UltimoNivel();
            $idformato = $formato[0];
            $ultimoNivel = $formato[1];

            $result = DatActividadentidad::listarDatosTablaTemporal($idusuario, $idejercicio, $idespecialidad, $identidad);
            foreach ($result as $value) {
                if ($idformato == null) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['noexisteformatoactividades']);
                    continue;
                }
                if ($value['idactividad'] == null) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['codigoactvacio']);
                    continue;
                }
                if ($value['nivel'] != $ultimoNivel) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['actividadnoesultimonivel']);
                    continue;
                }if ($value['idaprobacion'] != 4) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['laactividadestadesaprobada']);
                    continue;
                }
                if ($value['estado'] != 1) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['laactividadestadesactivada']);
                    continue;
                }
                if (!$value['norma']) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['laactividadnoestanormada']);
                    continue;
                }
                if ($value['aprobadonivel'] == 3 || $value['aprobadonivel'] == 4) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['elniveldeactividadestaaprobado']);
                    continue;
                }
                if (!$value['idactespcomportamiento']) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['laactividadnoestacompartida']);
                    continue;
                }
                DatActividadentidad::insertarEnLaTablaTemporal($value, $idusuario, $array_ests_uri);
            }
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //inserta todos los datos validados correctamente
    public function insertarDatosImportar($params, $idespecialidad, $idusuario) {

        $data = DatActividadentidad::listarDatosAImportar($idusuario);

        foreach ($data as $nivactividadOrigen) {
            $idactividadentidadOrigen = null;
            if ($nivactividadOrigen['namanual'] == 0) {
                if ($nivactividadOrigen['idactividadentidad'] != null) {
                    $idactividadentidadOrigen = $nivactividadOrigen['idactividadentidad'];
                    self::eliminarActividadEntidadOrigen($idactividadentidadOrigen);
                }
            } else {
                if ($nivactividadOrigen['idactividadentidad'] == null) {
                    //creo el idactividadentidad
                    $idactividadentidadOrigen = self::crearActividadEntidad($nivactividadOrigen['idactespcomportamiento'], $nivactividadOrigen['idactividad'], $params['identidad'], $params['idejercicio']);
                    //creo el nivel manual
                    self::crearNivelManual($idactividadentidadOrigen, $nivactividadOrigen['namanual']);
                } else {
                    $idactividadentidadOrigen = $nivactividadOrigen['idactividadentidad'];

                    $actEntManualOrigen = Doctrine::getTable('DatActividadentidadmanual')->findByDql("idactividadentidad = {$nivactividadOrigen['idactividadentidad']}");

                    if ($actEntManualOrigen[0]->idactividadentidad != null) {
                        //actualizar na manual
                        $actEntManualOrigen[0]->nivelactividadmanual = $nivactividadOrigen['namanual'];
                        $actEntManualOrigen[0]->save();
                    } else {
                        //creo el nivel manual
                        self::crearNivelManual($nivactividadOrigen['idactividadentidad'], $nivactividadOrigen['namanual']);
                    }
                }
            }
            if ($idactividadentidadOrigen != null) {
                //actualizando niveles automaticos
                $arrayreglas = Doctrine::getTable('DatRegla')->findByDql("idactividadorigen = {$nivactividadOrigen['idactividad']} and idejercicio={$params['idejercicio']}");
                foreach ($arrayreglas as $regla) {
                    //calculando nivel auto
                    $ajusteOrigen = Doctrine::getTable('DatActividadentidad')->findByDql("idactividadentidad = $idactividadentidadOrigen");
                    $nivelAutoOrigen = Doctrine::getTable('DatActividadentidadautomatico')->findByDql("idactividadentidad = $idactividadentidadOrigen");
                    if ($regla->idnorma == null) {
                        $nivelAutoDestino = ($nivactividadOrigen['namanual'] + $nivelAutoOrigen[0]->nivelactividadautomatico + $ajusteOrigen[0]->ajuste) / $regla->valorcontrol * $regla->nivelactividadbase;
                    } else {
                        $normaOrigen = Doctrine::getTable('DatNorma')->findByDql("idnorma = {$regla->idnorma}");
                        $nivelAutoDestino = $normaOrigen[0]->necesidad * ($nivactividadOrigen['namanual'] + $nivelAutoOrigen[0]->nivelactividadautomatico + $ajusteOrigen[0]->ajuste) / $regla->valorcontrol * $regla->nivelactividadbase;
                    }
                    $actEntDestino = Doctrine::getTable('DatActividadentidad')->findByDql("idactividad = $regla->idactividaddestino and idejercicio={$params['idejercicio']} and identidad={$params['identidad']}");
                    if ($actEntDestino[0]->idactividadentidad == null) {
                        $actEspDestino = Doctrine::getTable('DatActespcomportamiento')->findByDql("idactividad = $regla->idactividaddestino and idespecialidad=$idespecialidad");
                        //creo el idactividadentidad
                        if ($actEspDestino[0]->idactespcomportamiento != null) {
                            $idactividadentidadautoDestino = self::crearActividadEntidad($actEspDestino[0]->idactespcomportamiento, $regla->idactividaddestino, $params['identidad'], $params['idejercicio']);
                            //creo el nivel auomatico
                            self::crearNivelAutomatico($idactividadentidadautoDestino, $nivelAutoDestino, $regla->idregla);
                        }
                    } else {
                        $idactividadentidadautoDestino = $actEntDestino[0]->idactividadentidad;
                        $actEntAutoDestino = Doctrine::getTable('DatActividadentidadautomatico')->findByDql("idactividadentidad = $idactividadentidadautoDestino");
                        if ($actEntAutoDestino[0]->idactividadentidad != null) {
                            //actualizar na auto
                            $actEntAutoDestino[0]->nivelactividadautomatico = $nivelAutoDestino;
                            $actEntAutoDestino[0]->save();
                        } else {
                            //creo el nivel auto
                            self::crearNivelAutomatico($idactividadentidadautoDestino, $nivelAutoDestino, $regla->idregla);
                        }
                    }                //si $nivelAutoDestino es 0 y no hay mas niveles eliminar act ent sino eliminat actent automatico
                    if ($nivelAutoDestino == 0) {
                        self::eliminarActividadEntidadDestino($idactividadentidadautoDestino);
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarnivelesxls" . $idusuario);
        //eliminando tabla temporal dinámica
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarniveles" . $idusuario);
    }

    public function crearNivelManual($idactividadentidad, $nivelmanual) {
        $nuevaActEntManual = new DatActividadentidadmanual();
        $nuevaActEntManual->idactividadentidad = $idactividadentidad;
        $nuevaActEntManual->nivelactividadmanual = $nivelmanual;
        $nuevaActEntManual->save();
    }

    public function crearNivelAutomatico($idactividadentidad, $nivelautomatico, $idregla) {
        $nuevaActEntAuto = new DatActividadentidadautomatico();
        $nuevaActEntAuto->idactividadentidad = $idactividadentidad;
        $nuevaActEntAuto->nivelactividadautomatico = $nivelautomatico;
        $nuevaActEntAuto->idregla = $idregla;
        $nuevaActEntAuto->save();
    }

    public function crearActividadEntidad($idactespcomportamiento, $idactividad, $identidad, $idejercicio) {
        $de = Doctrine_Manager::getInstance();
        $conn = $de->getCurrentConnection();
        $nuevaAsocactent = new DatActividadentidad();
        $nuevaAsocactent->idactespcomportamiento = $idactespcomportamiento;
        $nuevaAsocactent->identidad = $identidad;
        $nuevaAsocactent->idactividad = $idactividad;
        $nuevaAsocactent->idejercicio = $idejercicio;
        $nuevaAsocactent->save();
        $conn->commit();
        $conn->beginTransaction();
        return $nuevaAsocactent->idactividadentidad;
    }

    public function eliminarActividadEntidadOrigen($idactividadentidad) {
        $nivelAutoOrigen = Doctrine::getTable('DatActividadentidadautomatico')->findByDql("idactividadentidad = $idactividadentidad");
        $nivelAutoOrigen = $nivelAutoOrigen[0]->nivelactividadautomatico;
        $nivelCartaTecOrigen = Doctrine::getTable('DatActividadentidadproduccion')->findByDql("idactividadentidad = $idactividadentidad");
        $nivelCartaTecOrigen = $nivelCartaTecOrigen[0]->nivelactividadproduccion;
        if (($nivelAutoOrigen == 0 || $nivelAutoOrigen == null) && ($nivelCartaTecOrigen == 0 || $nivelCartaTecOrigen == null)) {
            //no existe ningun otro nivel de actividad para esta actividadentidad
            $query = new Doctrine_Query();
            $query->delete()->from('DatActividadentidad')->where("idactividadentidad=$idactividadentidad")->execute();
        } else {
            //eliminar de ae manual
            $query = new Doctrine_Query();
            $query->delete()->from('DatActividadentidadmanual')->where("idactividadentidad=$idactividadentidad")->execute();
        }
    }

    public function eliminarActividadEntidadDestino($idactividadentidad) {
        $nivelmanualDestino = Doctrine::getTable('DatActividadentidadmanual')->findByDql("idactividadentidad = $idactividadentidad");
        $nivelmanualDestino = $nivelmanualDestino[0]->nivelactividadmanual;
        $nivelCartaTecDestino = Doctrine::getTable('DatActividadentidadproduccion')->findByDql("idactividadentidad = $idactividadentidad");
        $nivelCartaTecDestino = $nivelCartaTecDestino[0]->nivelactividadproduccion;
        if (($nivelmanualDestino == 0 || $nivelmanualDestino == null) && ($nivelCartaTecDestino == 0 || $nivelCartaTecDestino == null)) {
            //no existe ningun otro nivel de actividad para esta actividadentidad
            $query = new Doctrine_Query();
            $query->delete()->from('DatActividadentidad')->where("idactividadentidad=$idactividadentidad")->execute();
        } else {
            //eliminar de ae automatico
            $query = new Doctrine_Query();
            $query->delete()->from('DatActividadentidadautomatico')->where("idactividadentidad=$idactividadentidad")->execute();
        }
    }

}
