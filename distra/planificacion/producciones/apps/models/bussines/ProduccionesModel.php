<?php

class ProduccionesModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarProducciones($params) {
        $result = DatAplicacioncartatec::listarProducciones($params);
        return $result;
    }

    public function obtenerActividadesProducciones($params) {
        $result = DatAplicacioncartatec::obtenerActividadesProducciones($params);
        return $result;
    }

    public function obtenerIndicadoresProducciones($params) {
        $result = DatAplicacioncartatec::obtenerIndicadoresProducciones($params);
        return $result;
    }

    public function listarActividadesProduccion($params) {
        $result = DatActividadentidadprodcartatec::listarActividadesProduccion($params);
        return $result;
    }

    public function listarServiciosActividadesProduccion($params) {
        $result = DatServicio::listarServiciosActividadesProduccion($params);
        return $result;
    }

    public function guardarProducciones($params) {
        $integrator = ZendExt_IoC::getInstance();
        $iddatosnomenclador = $params['pIntegrator']->planmeta->obtenerIdDatosNomEspComp();
        $arrayIddatosnomenclador = array($iddatosnomenclador['demandada'], $iddatosnomenclador['compartida'], $iddatosnomenclador['propia']);
        unset($iddatosnomenclador);
        $datosentidad = $integrator->metadatos->DameEstructura($params['identidad']);
        $params['idespecialidad'] = $datosentidad[0]->idespecialidad;
        $actualizados = 0;
        $totalPoducciones = 0;
        $totalSinNorma = 0;
        foreach ($params['producciones'] as $prod) {
            $totalPoducciones++;
            $produccionModificada = 0;
            $arrayNiveles = array();
            $posNivel = 0;

            //obteniendo objeto produccion
            $objProduccion = Doctrine::getTable('DatAplicacioncartatec')->findByDql("idaplicacioncartatec={$prod->idaplicacioncartatec}");

            if ($prod->volumenproduccionhistorico) {
                $objProduccion[0]->volumenproduccionhistorico = $prod->volumenproduccionhistorico;
                $produccionModificada++;
            }

            if ($prod->asegurado) {
                $objProduccion[0]->asegurado = 1;
                $produccionModificada++;
            }

            if ($prod->nivelactividad) {
                $objCarta = Doctrine::getTable('DatCartatecnologica')->findByDql("idcartatecnologica={$objProduccion[0]->idcartatecnologica}");
                $objProduccion[0]->productividadest = $prod->nivelactividad * $objCarta[0]->valorrendimiento;
                $objProduccion[0]->nivelactividad = $prod->nivelactividad;
                $produccionModificada++;
            }

            if ($prod->fecha) {
                $fechaFueraEjercicioSinNorma = 0;
                //insertar las fechas inicio y fin de las actividades en la produccion
                //obteniendo actividades de la carta
                $objActividadesCarta = Doctrine::getTable('DatCartatecnologicaactividad')->findByDql("idcartatecnologica={$objProduccion[0]->idcartatecnologica}");
                $iddatNom = NomDatosnomenclador::getDatosNomPorUriTipoNom('Estadodelasproducciones', 'Sincumplir');
                $minfecha = null;
                $maxfecha = null;
                foreach ($objActividadesCarta as $key => $value) {
                    $objActividadProduccion = Doctrine::getTable('DatActividadentidadprodcartatec')->findByDql("idaplicacioncartatec={$prod->idaplicacioncartatec} and idcartatecnologicaactividad={$value->idcartatecnologicaactividad}");
                    $objActividadProduccion[0]->nivelactividadproduccion = 0;
                    $objActividadProduccion[0]->idaplicacioncartatec = $objProduccion[0]->idaplicacioncartatec;
                    $objActividadProduccion[0]->nivelactividadejecucion = 0;
                    $objActividadProduccion[0]->fechaejecucion = null;
                    $objActividadProduccion[0]->iddatosnomenclador = $iddatNom[0]['iddatosnomenclador'];
                    $objActividadProduccion[0]->idcartatecnologicaactividad = $value->idcartatecnologicaactividad;

                    $objServicio = Doctrine::getTable('DatServicio')->findByDql("idcartatecnologicaactividad={$value->idcartatecnologicaactividad} and idaplicacioncartatec={$objProduccion[0]->idaplicacioncartatec}");
                    if ($objServicio[0]->idservicio != null) {
                        $idactividad = $objServicio[0]->idactividad;
                    } else {
                        $idactividad = $value->idactividad;
                    }
                    //aqui calcular las fechas
                    if ($value->plazo == 0) {
                        $nuevafecha = date('d-m-Y', strtotime($prod->fecha));
                        $objActividadProduccion[0]->fechainicio = $nuevafecha;
                    } else {
                        $nuevafecha = strtotime('+' . $value->plazo . ' day', strtotime($prod->fecha));
                        $nuevafecha = date('d-m-Y', $nuevafecha);
                        $objActividadProduccion[0]->fechainicio = $nuevafecha;
                    }
                    /* Integracion con fondo de tiempo
                      Necesita optimizarse para un array de fechas
                      try {
                      $fechaini = str_replace('-', '/', $nuevafecha);
                      $fechafin = $integrator->configuracionpdo->obtenerFechaFinActividad($params['identidad'], $fechaini, $value->duracion, '');
                      $nuevafechafin = str_replace('/', '-', $fechafin['fechafin']);
                      $objActividadProduccion[0]->fechafin = $nuevafechafin;
                      } catch (Exception $e) {
                      $duracion = ($value->duracion / 8);
                      if ($value->duracion % 8 == 0) {
                      $duracion = $duracion - 1;
                      } else {
                      $duracion = (int)$duracion;
                      }
                      $nuevafechafin = strtotime('+' . $duracion . ' day', strtotime($nuevafecha));
                      $nuevafechafin = date('d-m-Y', $nuevafechafin);
                      $objActividadProduccion[0]->fechafin = $nuevafechafin;
                      } */
                    $duracion = ($value->duracion / 8);
                    if ($value->duracion % 8 == 0) {
                        $duracion = $duracion - 1;
                    } else {
                        $duracion = (int) $duracion;
                    }
                    $nuevafechafin = strtotime('+' . $duracion . ' day', strtotime($nuevafecha));
                    $nuevafechafin = date('d-m-Y', $nuevafechafin);
                    $objActividadProduccion[0]->fechafin = $nuevafechafin;

                    if ($key == 0) {
                        $minfecha = $nuevafecha;
                        $maxfecha = $nuevafechafin;
                    } else {
                        $string_minfecha = strtotime($minfecha);
                        $string_nuevafecha = strtotime($nuevafecha);
                        if ($string_nuevafecha < $string_minfecha)
                            $minfecha = $nuevafecha;

                        $string_maxfecha = strtotime($maxfecha);
                        $string_nuevafecha = strtotime($nuevafechafin);
                        if ($string_nuevafecha > $string_maxfecha)
                            $maxfecha = $nuevafechafin;
                    }
                    //obteniendo ejercicio en que se ejecutarán estos NA segun la fecha de inicio
                    $idejercicio = NomEjercicioplanificacion::servicioObtenerEjercicioFecha($nuevafecha);
                    if ($idejercicio) {
                        //saber si la actividad tiene norma en el ejercicio que le corresponde
                        $normasenEjercicio = DatNorma::buscarNormasEjercicioAprobacion($idactividad, $idejercicio);
                        if (isset($normasenEjercicio[0])) {
                            $arrayNiveles[$posNivel]['objeto'] = $objActividadProduccion[0];
                            $arrayNiveles[$posNivel]['idactividad'] = $idactividad;
                            $arrayNiveles[$posNivel]['idejercicio'] = $idejercicio;
                            $posNivel++;
                        } else {
                            $fechaFueraEjercicioSinNorma++;
                            $totalSinNorma++;
                        }
                    } else {
                        $fechaFueraEjercicioSinNorma++;
                        $totalSinNorma++;
                    }
                }
                if ($fechaFueraEjercicioSinNorma == 0) {
                    foreach ($arrayNiveles as $value) {
                        $actEnt = $params['pIntegrator']->planmeta->obtenerIdActividadEntidad($params['identidad'], $value['idactividad'], $value['idejercicio'])->getFirst()->idactividadentidad;
                        if ($actEnt == null || $actEnt == '') {
                            //craendo relacion activ-ent-ejercicio
                            $nuevaAsocactent = $params['pIntegrator']->planmeta->crearAsociacionActEnt(
                                    $value['idactividad'], $arrayIddatosnomenclador, $params['idespecialidad'], $params['identidad'], $value['idejercicio']
                            );
                            $actEnt = $nuevaAsocactent->idactividadentidad;
                        }
                        $value['objeto']->idactividadentidad = $actEnt;
                        $value['objeto']->save();
                    }
                    unset($arrayNiveles);
                    //modificando la fecha de la produccion                    
                    $objProduccion[0]->fecha = $prod->fecha;
                    $objProduccion[0]->fechainicio = $minfecha;
                    $objProduccion[0]->fechafin = $maxfecha;
                    $produccionModificada++;
                }
            }
            if ($produccionModificada > 0) {
                $objProduccion[0]->idusuario = $params['idusuario'];
                $objProduccion[0]->save();
                $actualizados++;
            }
        }

        if ($totalPoducciones == $actualizados) {
            //todas ok
            return 1;
        } else if ($actualizados == 0 && $totalSinNorma > 0) {
            //ninguno actualizado y problemas con fechas-normas
            return 2;
        } else if ($actualizados == 0) {
            //ninguno actualizado 
            return 0;
        } else if ($actualizados > 0 && $totalSinNorma > 0) {
            //algunos actualizado y problemas con fechas-normas
            return 3;
        } else if ($actualizados > 0) {
            //algunos actualizado
            return 4;
        }
    }

    public function desAprobProducciones($params) {
        $result = array();
        $result['codIntegracionProy'] = 1;
        $actualizados = 0;
        foreach ($params['producciones'] as $prod) {
            $objProduccion = Doctrine::getTable('DatAplicacioncartatec')->findByDql("idaplicacioncartatec={$prod->idaplicacioncartatec}");
            if ($params['idaprobacion'] == 1) {
                //desaprobar
                $objNAProduccion = Doctrine::getTable('DatActividadentidadprodcartatec')->findByDql("idaplicacioncartatec={$prod->idaplicacioncartatec}");
                foreach ($objNAProduccion as $value) {
                    //reinicio los NA a 0
                    $value->nivelactividadproduccion = 0;
                    //si no hay na>0 asosiado a ese idactividadentidad la desapruebo
                    $nivelFinal = DatActividadentidad::ObtenerNivelesActEntidad($value->idactividadentidad);
                    if ($nivelFinal[0] == 0) {
                        $objActEnt = Doctrine::getTable('DatActividadentidad')->findByDql("idactividadentidad={$value->idactividadentidad}");
                        $objActEnt[0]->idaprobacion = 1;
                        $objActEnt[0]->save();
                    }
                    $value->save();
                }

                //llamar servicio que elimina proyecto
                if ($params['integracion_proyecto'] == 1) {
                    try {
                        $params['pIntegrator']->proyecto->eliminarProyectoProduccion($prod->idaplicacioncartatec);
                    } catch (Exception $e) {
                        $result['codIntegracionProy'] = 0;
                    }
                }
                //

                $objProduccion[0]->idaprobacion = $params['idaprobacion'];
                $objProduccion[0]->save();
                $actualizados++;
            } else {
                //aprobar
                //si tiene fecha y na mayor que 0 se puede aprobar
                if ($objProduccion[0]->nivelactividad > 0 && $objProduccion[0]->fecha != null) {
                    //si no estaba ya aprobada escribo los NA en actentidad
                    if ($objProduccion[0]->idaprobacion != 3 && $objProduccion[0]->idaprobacion != 4) {
                        //obteniendo los niveles de la produccion
                        $objNAProduccion = Doctrine::getTable('DatActividadentidadprodcartatec')->findByDql("idaplicacioncartatec={$prod->idaplicacioncartatec}");

                        foreach ($objNAProduccion as $value) {
                            if ($params['integracion_proyecto'] == 1) {
                                $de = Doctrine_Manager::getInstance();
                                $conn = $de->getCurrentConnection();
                            }
                            $objServicio = Doctrine::getTable('DatServicio')->findByDql("idcartatecnologicaactividad={$value->idcartatecnologicaactividad} and idaplicacioncartatec={$value->idaplicacioncartatec}");
                            if ($objServicio[0]->idservicio != null) {
                                $value->nivelactividadproduccion = $objProduccion[0]->nivelactividad * $objServicio[0]->gasto;
                            } else {
                                $value->nivelactividadproduccion = $objProduccion[0]->nivelactividad;
                            }
                            $value->save();
                            if ($params['integracion_proyecto'] == 1) {
                                $conn->commit();
                                $conn->beginTransaction();
                            }
                        }
                        //OJO TODO LO COMENTAREADO DEBAJO Y EN EL CICLO DE ARRIBA ES PARA LA INTEGRACION CON PROYECTO
                        if ($params['integracion_proyecto'] == 1) {
                            //buscando datos para crear el proyecto
                            //datos del proyecto
                            $datosProyecto['idproduccion'] = $objProduccion[0]->idaplicacioncartatec;
                            $datosProyecto['identidad'] = $objProduccion[0]->identidad;
                            $objCarta = Doctrine::getTable('DatCartatecnologica')->findByDql("idcartatecnologica={$objProduccion[0]->idcartatecnologica}");
                            $fecha = split(' ', $objProduccion[0]->fecha);
                            $datosProyecto['denominacionproduccion'] = $objCarta[0]->denominacion . "_ NA_" . $objProduccion[0]->nivelactividad . "_ Fecha_" . $fecha[0];
                            $datosProyecto['fechainicio'] = $objProduccion[0]->fechainicio;
                            $datosProyecto['fechafin'] = $objProduccion[0]->fechafin;
                            $datosProyecto['duracionestimada'] = self::diffDias($objProduccion[0]->fechainicio, $objProduccion[0]->fechafin);

                            //datos de las etapas
                            $datosEtapas = DatCartatecnologicaactividad::obtenerEtapasCarta($objProduccion[0]->idaplicacioncartatec);

                            //datos de los NA de las actividades en la produccion
                            $niveles = DatActividadentidadprodcartatec::obtenerNivelesProduccion($objProduccion[0]->idaplicacioncartatec);
                            $duracionProyecto = 0;
                            foreach ($niveles as $key => $value) {
                                $objServicio = Doctrine::getTable('DatServicio')->findByDql("idcartatecnologicaactividad={$value['idcartatecnologicaactividad']} and idaplicacioncartatec={$objProduccion[0]->idaplicacioncartatec}");
                                $objCartaAct = Doctrine::getTable('DatCartatecnologicaactividad')->findByDql("idcartatecnologicaactividad={$value['idcartatecnologicaactividad']}");
                                if ($objServicio[0]->idservicio != null) {
                                    $idactividad = $objServicio[0]->idactividad;
                                } else {
                                    $idactividad = $objCartaAct[0]->idactividad;
                                }
                                $objAct = Doctrine::getTable('NomActividad')->findByDql("idactividad={$idactividad}");
                                $niveles[$key]['denominacionactividad'] = $objAct[0]->codigo . "_" . $objAct[0]->denominacion;
                                $niveles[$key]['idetapa'] = $objCartaAct[0]->idetapa;
                                //buscar los recursos
                                //obteniendo ejercicio en que se ejecutarán estos NA segun la fecha de inicio
                                $idejercicio = NomEjercicioplanificacion::servicioObtenerEjercicioFecha($value['fechainicio']);
                                $niveles[$key]['recursos'] = DatActividadentidadprodcartatec::obtenerRecursos($idactividad, $value['nivelactividadproduccion'], $idejercicio);
                                unset($niveles[$key]['idcartatecnologicaactividad']);
                                $unaetapa = 0;
                                if (count($datosEtapas) == 1) {
                                    $datosEtapas[0]['fechainicioetapa'] = $objProduccion[0]->fechainicio;
                                    $datosEtapas[0]['fechafinetapa'] = $objProduccion[0]->fechafin;
                                    $unaetapa = 1;
                                }
                                foreach ($datosEtapas as $k => $value) {
                                    if ($value['idetapa'] == $objCartaAct[0]->idetapa) {
                                        $duracion = intval($niveles[$key]['duracion']);
                                        $datosEtapas[$k]['duracionrealhoras'] += $duracion;
                                        $duracionProyecto += $duracion;
                                        if (!$unaetapa) {
                                            $fechaininew = $niveles[$key]['fechainicio'];
                                            $fechafinnew = $niveles[$key]['fechafin'];
                                            if (!isset($datosEtapas[$k]['fechainicioetapa'])) {
                                                $datosEtapas[$k]['fechainicioetapa'] = $fechaininew;
                                                $datosEtapas[$k]['fechafinetapa'] = $fechafinnew;
                                            } else {
                                                $fechaini = $datosEtapas[$k]['fechainicioetapa'];
                                                $fechafin = $datosEtapas[$k]['fechafinetapa'];
                                                $fechaininew = self::compararFechas('menor_que', $fechaini, $fechaininew);
                                                $fechafinnew = self::compararFechas('mayor_que', $fechafin, $fechafinnew);

                                                $datosEtapas[$k]['fechainicioetapa'] = $fechaininew;
                                                $datosEtapas[$k]['fechafinetapa'] = $fechafinnew;
                                            }
                                        }
                                        $datosEtapas[$k]['actividades'][] = $niveles[$key];
                                    }
                                }
                            }
                            $datosProyecto['duracionrealhoras'] = $duracionProyecto;
                            //generando el proyecto
                            try {
                                $params['pIntegrator']->proyecto->generarProyecto($datosProyecto, $datosEtapas, $params['idusuario']);
                            } catch (Exception $e) {
                                $result['codIntegracionProy'] = 0;
                            }
                        }
                        //fin de la integracion con proyecto
                    }
                    $objProduccion[0]->idaprobacion = $params['idaprobacion'];
                    $objProduccion[0]->save();
                    $actualizados++;
                }
            }
        }
        $result['codMsgN'] = $actualizados;
        return $result;
    }

    public function compararFechas($operacion, $fecha, $fechanew) {
        $fecha1 = explode(' ', $fecha);
        $fecha1 = str_replace('/', '-', $fecha1[0]);
        $string_fecha = strtotime($fecha1);

        $fechanew1 = explode(' ', $fechanew);
        $fechanew1 = str_replace('/', '-', $fechanew1[0]);
        $string_fechanew = strtotime($fechanew1);

        if ($operacion == 'mayor_que') {
            if ($string_fechanew > $string_fecha)
                $fecha = $fechanew;
        } else {
            if ($string_fechanew < $string_fecha)
                $fecha = $fechanew;
        }
        return $fecha;
    }

    function diffDias($fechaInicio, $fechaFin) {
        $fechaInicial = explode(' ', $fechaInicio);
        $fechaInicial = explode('/', $fechaInicial[0]);
        $fechaFinal = explode(' ', $fechaFin);
        $fechaFinal = explode('/', $fechaFinal[0]);

        $fechaInicial = new DateTime($fechaInicial[2] . '-' . $fechaInicial[1] . '-' . $fechaInicial[0]);
        $fechaFinal = new DateTime($fechaFinal[2] . '-' . $fechaFinal[1] . '-' . $fechaFinal[0]);

        $dias_diferencia = $fechaInicial->diff($fechaFinal);
        return $dias_diferencia;
    }

    function diffDias2($fechaInicio, $fechaFin) {
        $tempFI = explode(' ', $fechaInicio);
        $fechaInicial = explode('/', $tempFI[0]);
        $tempFF = explode(' ', $fechaFin);
        $fechaFinal = explode('/', $tempFF[0]);

        $timestamp1 = mktime(0, 0, 0, $fechaInicial[1], $fechaInicial[0], $fechaInicial[2]);
        $timestamp2 = mktime(0, 0, 0, $fechaFinal[1], $fechaFinal[0], $fechaFinal[2]);

        $segundos_diferencia = $timestamp1 - $timestamp2;
        $dias_diferencia = $segundos_diferencia / (60 * 60 * 24);
        $dias_diferencia = abs($dias_diferencia);
        $dias_diferencia = floor($dias_diferencia);

        return $dias_diferencia;
    }

    public function eliminarProducciones($params) {
        $actualizados = 0;
        if ($params['producciones'][0]->idaplicacioncartatec != null) {
            $idaplicacioncartatec_array = array();
            foreach ($params['producciones'] as $produccion) {
                $idaplicacioncartatec_array[] = $produccion->idaplicacioncartatec;
                $actualizados++;
            }
            $idaplicacioncartatec_lista = implode(',', $idaplicacioncartatec_array);
            DatAplicacioncartatec::eliminarProducciones($idaplicacioncartatec_lista);

            CartaTecnologicaModel::actualizarEnUso();
        }
        return $actualizados;
    }

    public function adicionarProduccion($params) {
        $almacenados = 0;
        if ($params['producciones'][0]->idcartatecnologica != null) {
            foreach ($params['producciones'] as $produccion) {
                $objDatAplicacioncartatec = new DatAplicacioncartatec();
                if (is_object($objDatAplicacioncartatec)) {
                    $objDatAplicacioncartatec->idcartatecnologica = $produccion->idcartatecnologica;
                    $objDatAplicacioncartatec->identidad = $params['identidad'];
                    $objDatAplicacioncartatec->idcartatecnologicaentidad = $produccion->idcartatecnologicaentidad;
                    $objDatAplicacioncartatec->idusuario = $params['idusuario'];
                    $objDatAplicacioncartatec->save();
                    $almacenados++;
                }
            }
            CartaTecnologicaModel::actualizarEnUso();
        }
        return $almacenados;
    }

    public function adicionarServicio($params) {
        $almacenados = 0;
        if ($params['idactividad'] != null && $params['idaplicacioncartatec'] != null && $params['idcartatecnologicaactividad'] != null) {
            $objDatServicio = Doctrine::getTable('DatServicio')->findByDql("idaplicacioncartatec = {$params['idaplicacioncartatec']} AND idcartatecnologicaactividad = {$params['idcartatecnologicaactividad']}");
            $objDatServicio[0]->idactividad = $params['idactividad'];
            $objDatServicio[0]->idaplicacioncartatec = $params['idaplicacioncartatec'];
            $objDatServicio[0]->idcartatecnologicaactividad = $params['idcartatecnologicaactividad'];
            $objDatServicio[0]->gasto = 0;
            $objDatServicio[0]->idusuario = $params['idusuario'];
            $objDatServicio[0]->save();
            $almacenados++;
            self::actualizarActEntPorServicio($params, $objDatServicio);
        }
        return $almacenados;
    }

    public function actualizarServicio($params) {
        $almacenados = 0;
        if ($params['servicios'][0]->idservicio != null) {
            foreach ($params['servicios'] as $servicio) {
                $objDatServicio = Doctrine::getTable('DatServicio')->findByDql("idservicio = {$servicio->idservicio}");
                $objDatServicio[0]->gasto = $servicio->gasto;
                $objDatServicio[0]->idusuario = $params['idusuario'];
                $objDatServicio[0]->save();
                $almacenados++;
            }
        }
        return $almacenados;
    }

    public function eliminarServicio($params) {
        $almacenados = 0;
        if ($params['servicios'][0]->idservicio != null) {
            foreach ($params['servicios'] as $servicio) {
                $objDatServicio = Doctrine::getTable('DatServicio')->findByDql("idservicio = {$servicio->idservicio}");
                $objCartaAct = Doctrine::getTable('DatCartatecnologicaactividad')->findByDql("idcartatecnologicaactividad = {$objDatServicio[0]->idcartatecnologicaactividad}");
                self::actualizarActEntPorServicio($params, $objDatServicio, $objCartaAct[0]->idactividad);
                $objDatServicio[0]->delete();
                $almacenados++;
            }
        }
        return $almacenados;
    }

    public function actualizarActEntPorServicio($params, $objDatServicio, $idactividad = false) {
        $objActividadProduccion = Doctrine::getTable('DatActividadentidadprodcartatec')->findByDql("idaplicacioncartatec = {$objDatServicio[0]->idaplicacioncartatec} and idcartatecnologicaactividad = {$objDatServicio[0]->idcartatecnologicaactividad}");
        if ($objActividadProduccion[0]->idactividadentidadprodcartatec) {
            //obteniendo ejercicio en que se ejecutarán estos NA segun la fecha de inicio
            $idejercicio = NomEjercicioplanificacion::servicioObtenerEjercicioFecha($objActividadProduccion[0]->fechainicio);
            if (!$idactividad)
                $idactividad = $objDatServicio[0]->idactividad;

            $actEnt = $params['pIntegrator']->planmeta->obtenerIdActividadEntidad($params['identidad'], $idactividad, $idejercicio)->getFirst()->idactividadentidad;

            if ($actEnt == null || $actEnt == '') {

                $iddatosnomenclador = $params['pIntegrator']->planmeta->obtenerIdDatosNomEspComp();
                $arrayIddatosnomenclador = array($iddatosnomenclador['demandada'], $iddatosnomenclador['compartida'], $iddatosnomenclador['propia']);
                unset($iddatosnomenclador);

                //craendo relacion activ-ent-ejercicio
                $nuevaAsocactent = $params['pIntegrator']->planmeta->crearAsociacionActEnt(
                        $idactividad, $arrayIddatosnomenclador, $params['idespecialidad'], $params['identidad'], $idejercicio
                );
                $actEnt = $nuevaAsocactent->idactividadentidad;
            }

            $objActividadProduccion[0]->idactividadentidad = $actEnt;
            $objActividadProduccion[0]->save();
        }
    }

    public function exportarProducciones($params) {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        $params['unidadesmedida'] = array();
        foreach ($unidades as $unidad) {
            $params['unidadesmedida'][$unidad['idunidadmedida']] = $unidad['denominacionunidadmedida'];
        }
        unset($unidades);

        $variables = CaracterizacionentidadModel::cargarVariables();
        $params['variables'] = array();
        foreach ($variables as $variable) {
            $params['variables'][$variable['idvariable']] = $variable['denominacionvariable'];
        }
        unset($variables);


        foreach ($params['filtros'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $obj_filtro['data']['value'] = $filtro->data->value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }

        $params['filtros'] = $nuevos_filtros;
        $params['ordenarProd'] = true;
        $data = $this->listarProducciones($params);

        //html para el excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=producciones.xls");
        header("Content-Transfer-Encoding: binary ");

        echo "<H2 align=center>Producciones</H2>";
        echo "<H3>Entidad: " . $params['denoentidad'] . "<br/>";

        $filtro_fechaInicio = "";
        if ($params['fechaInicio']) {
            $filtro_fechaInicio = split("T", $params['fechaInicio']);
            $filtro_fechaInicio = explode('-', $filtro_fechaInicio[0]);
            $filtro_fechaInicio = $filtro_fechaInicio[2] . '/' . $filtro_fechaInicio[1] . '/' . $filtro_fechaInicio[0];
            echo "Desde: {$filtro_fechaInicio} <br/>";
        }

        $filtro_fechaFin = "";
        if ($params['fechaFin']) {
            $filtro_fechaFin = split("T", $params['fechaFin']);
            $filtro_fechaFin = explode('-', $filtro_fechaFin[0]);
            $filtro_fechaFin = $filtro_fechaFin[2] . '/' . $filtro_fechaFin[1] . '/' . $filtro_fechaFin[0];
            echo "Hasta: {$filtro_fechaFin} <br/>";
        }

        $primeraparte = " <table border=1 cellspacing=0 width=60%>
        
        <tr>
             <th align=left>Denominación</th>
             <th align=left>Producto</th>
             <th align=left>Rendimiento</th>             
             <th align=left>UM rendimiento</th>
             <th align=left>Variable</th>
             <th align=left>NA</th>
             <th align=left>VPH</th>
             <th align=left>VPE</th>
             <th align=left>Fecha de inicio</th>
             <th align=left>Fecha</th>
             <th align=left>Fecha de fin</th>
             <th align=left>Asegurado</th>
             <th align=left>Aprobado</th>
             <th align=left>Importe</th>";
        echo $primeraparte;

        foreach ($data as $prod) {
            echo "<tr><td align=left style=\"mso-number-format:'@';\">" . $prod['denominacion'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\">" . $prod['producto'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.00';\">" . $prod['valorrendimiento'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\">" . $params['unidadesmedida'][$prod['idumedidarendimiento']] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\">" . $params['variables'][$prod['idvariablecontrol']] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.00';\">" . $prod['nivelactividad'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.00';\">" . $prod['volumenproduccionhistorico'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.00';\">" . $prod['productividadest'] . "</td>";
            $fechaI = split(" ", $prod['fechainicio']);
            echo "<td align=center style=\"mso-number-format:'@';\">" . $fechaI[0] . "</td>";
            $fecha = split(" ", $prod['fecha']);
            echo "<td align=center style=\"mso-number-format:'@';\">" . $fecha[0] . "</td>";
            $fechaF = split(" ", $prod['fechafin']);
            echo "<td align=center style=\"mso-number-format:'@';\">" . $fechaF[0] . "</td>";
            if ($prod['asegurado'] == true) {
                $asegurado = "Asegurado";
            } else {
                $asegurado = "No asegurado";
            }
            echo "<td align=left style=\"mso-number-format:'@';\">" . $asegurado . "</td>";
            if ($prod['idaprobacion'] == 4) {
                $aprobacion = "Aprobado rector";
            } else if ($prod['idaprobacion'] == 3) {
                $aprobacion = "Aprobado especialista";
            } else {
                $aprobacion = "Desaprobado";
            }
            echo "<td align=left style=\"mso-number-format:'@';\">" . $aprobacion . "</td>";
            $imp = DatAplicacioncartatec::obtenerImporteProduccion($prod['idaplicacioncartatec']);
            echo "<td align=right style=\"mso-number-format:'0.00';\">" . $imp[0]['importe'] . "</td>";
        }

        echo "</table>";
    }

    public function exportarActividadesOIndicadoresProducciones($params) {

        //html para el excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        if ($params['tipo'] == 'ind') {
            $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            $params['unidadesmedida'] = array();
            foreach ($unidades as $unidad) {
                $params['unidadesmedida'][$unidad['idunidadmedida']] = $unidad['denominacionunidadmedida'];
            }
            unset($unidades);

            $naturalezas = DatBasescalculoModel::obtenerNaturalezas();
            $params['naturaleza'] = array();
            foreach ($naturalezas as $naturaleza) {
                $params['naturaleza'][$naturaleza['naturaleza']] = $naturaleza['denominacion'];
            }
            unset($naturalezas);
        }
        if ($params['tipo'] == 'act')
            header("Content-Disposition: attachment;filename=actividadesProduccion.xls");
        else
            header("Content-Disposition: attachment;filename=indicadoresProduccion.xls");
        header("Content-Transfer-Encoding: binary ");

        $fechaIni = split(" ", $params['fechainicio']);
        $fechaFin = split(" ", $params['fechafin']);
        $fecha = split(" ", $params['fecha']);
        if ($params['tipo'] == 'act') {
            echo "<H2 align=center>Actividades y servicios de la producci&oacute;n</H2>";
            $data = $this->obtenerActividadesProducciones($params);
            $collValue = 9;
            $collValueEnc = 3;
        } else {
            $data = $this->obtenerIndicadoresProducciones($params);
            $collValue = 7;
            $collValueEnc = 2;
            echo "<H2 align=center>Indicadores de la producci&oacute;n</H2>";
        }
        echo "<H3>Entidad:" . utf8_decode($params['denoentidad']) . " <br/>";

        $primeraparte = " <table border=1 cellspacing=0 width=60%>

        <tr align=left colspan='$collValue'>
            <th align=left colspan='$collValueEnc'>Producci&oacute;n: " . utf8_decode($params['denominacion']) . " </th>
            <th align=left colspan='$collValueEnc'>Producto: " . utf8_decode($params['producto']) . " </th>
            <th align=left colspan='2'>Rendimiento: " . ($params['valorrendimiento']) . " </th>
            <th align=left colspan='1'>NA: " . ($params['nivelactividad']) . " </th>
        </tr>
        
        <tr align=left colspan='$collValue'><th align=left colspan='$collValueEnc'>Fecha de inicio: " . ($fechaIni[0]) . " </th>
            <th align=left colspan='$collValueEnc'>Fecha: " . ($fecha[0]) . " </th>
            <th align=left colspan='3'>Fecha de fin: " . ($fechaFin[0]) . " </th>
        <tr><td align=left colspan='$collValue'> </td></tr>    
        
        <tr align=left colspan='$collValue'>
             <th align=left>C&oacute;digo</th>";
        if ($params['tipo'] == 'act') {
            $primeraparte = $primeraparte . "<th align=left>Actividades o servicios</th>
             <th align=left>Plazo de inicio</th>
             <th align=left>Fecha de inicio</th>
             <th align=left>Fecha de fin</th>
             <th align=left>Etapa</th>
             <th align=left>Porciento</th>
             <th align=left>Importe seg&uacute;n norma</th>
             <th align=left>Actividad original</th>
        </tr>";
        } else {
            $primeraparte = $primeraparte . "<th align=left>Denominaci&oacute;n</th>
             <th align = left>Unidad de medida</th>
        <th align = left>Naturaleza</th>
        <th align = left>Precio</th>
        <th align = left>Cantidad</th>
        <th align = left>Importe</th>
        </tr>";
        }

        echo $primeraparte;

        $importeTotal = 0;
        foreach ($data as $i) {
            echo "<tr><td align=left style=\"mso-number-format:'@';\">" . $i['codigo'] . "</td>";
            if ($params['tipo'] == 'act') {
                echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($i['denominacion']) . "</td>";
                echo "<td align=right style=\"mso-number-format:'0';\">" . $i['plazo'] . "</td>";
                $fechaI = split(" ", $i['fechainicio']);
                echo "<td align=center style=\"mso-number-format:'@';\">" . $fechaI[0] . "</td>";
                $fechaF = split(" ", $i['fechafin']);
                echo "<td align=center style=\"mso-number-format:'@';\">" . $fechaF[0] . "</td>";
                echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($i['etapa']) . "</td>";
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['porciento'] . "</td>";
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['importe'] . "</td>";
                echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($i['actividadorigen']) . "</td></tr>";
            } else {
                echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($i['denominacion']) . "</td>";
                echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($params['unidadesmedida'][$i['idumedida']]) . "</td>";
                echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($params['naturaleza'][$i['idnaturaleza']]) . "</td>";
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['precio'] . "</td>";
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['cantidad'] . "</td>";
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['importe'] . "</td></tr>";
            }
            $importeTotal += $i['importe'];
        }
        if ($params['tipo'] == 'act')
            $collValue = $collValue - 2;
        else
            $collValue = $collValue - 1;
        echo "<tr></tr>";
        echo "<tr><th colspan='$collValue' align=right style=\"mso-number-format:'@';\">Importe total: </th>";
        echo "<td align=right style=\"mso-number-format:'0.00';\">" . $importeTotal . "</td></tr>";

        echo "</table>";
    }

    public function adicionarAPlan($params) {
        $datosAddPlan = DatAplicacioncartatec::obtenerDatosActualizarPlan($params['identidad'], $params['idmodelo'], $params['idejercicio']);
        if ($datosAddPlan[0]['idindicador'] != null) {
            $integrator = ZendExt_IoC::getInstance();
            //eliminar datos de plan que fueron generados por producciones
            DatPlanificacion::eliminarPlanifGenerado($params['identidad'], $params['idmodelo'], $params['idejercicio'], 3);
            // se insertan los datos en plan
            foreach ($datosAddPlan as $indicador) {
                //buscando denominacion de cb
                $cbind = DatEntidaddatosnomenclador::getEntidadDadoIdDatos($indicador['idcentrobalance']);
                $datosCB = $integrator->metadatos->DameEstructura($cbind[0]['identidad']);
                $planif = new DatPlanificacion();
                //seteo los valores para insertar en DatPlanificacion los atributos de esa tabla
                $planif->idindicador = $indicador['idindicador'];
                $planif->centrosbalance = $datosCB[0]->denominacion;
                $planif->viasadquisicion = $indicador['via'];
                $planif->organossatisface = $indicador['organo'];
                $planif->identidadmodelo = $indicador['identidadmodelo'];
                $planif->precio = $indicador['precio'];
                $planif->preciodivisa = $indicador['preciodivisa'];
                $planif->idunidadmedida = $indicador['idumedida'];
                $planif->idcentrobalance = $indicador['idcentrobalance'];
                $planif->cantidad = $indicador['valorplan'];
                $planif->importe = 0;
                $planif->generadobasesplan = 3;
                $planif->idejercicio = $params['idejercicio'];
                $planif->idaprobaciondemanda = 1;
                $de = Doctrine_Manager::getInstance();
                $conn = $de->getCurrentConnection();
                $planif->save();
                $conn->commit();
                $conn->beginTransaction();
                $id = $planif->idplanificacion;
                //busco el tipo de modelo para saber en que tabla de metadatos insertar
                $this->_meta = ZendExt_Metadata::getInstance();
                $datosTM = NomTipomodelo::ObtenerIdTipoModelo($params['idmodelo']);
                $campos = $this->_meta->Metadata()->obtenerConfigFormulario($datosTM[0]['idtabla']);
                //solo obtengo las nomencladas para poder introducirles un valor por defecto sino no funciona
                foreach ($campos->items as $c) {
                    if ($c['xtype'] == 'combo') {
                        $array[] = $c['hiddenName'];
                    }
                }
                if (isset($array)) {
                    //selecciono el primer valor del nomenclador que sea y se lo pongo
                    foreach ($array as $a) {
                        $explode = explode('_', $a);
                        //cojo el arreglo 4 que es el que me dice que tipo de nomenclador es
                        $data = ereg_replace("[^0-9]", "", $explode[4]);
                        //busco en mi tabla que valor es ese nomenclador para adicionarle el primer valor
                        $dn = NomDatosnomenclador::ObtenerDatosprimeto($data); //poner una excepcion para cuando no este el nomenclador (-)
                        $parametros[$a] = $dn->iddatosnomenclador;
                    }
                }
                //mando a insertar ese indicador en metadatos y asi con el arreglo entero
                $this->_meta->Metadata()->insertarEnMetadatos($datosTM[0]['idtabla'], $parametros, array('idplanificacion' => $id));
            }
            return 1;
        } else
            return 3; //No existen produccines listas para insertar al plan
    }

    public function listarActividadesAddServicio($params) {
        $params['idejercicio'] = NomEjercicioplanificacion::servicioObtenerEjercicioFecha($params['fechainicio']);
        $res = DatAplicacioncartatec::listarActividadesAddServicio($params);
        return $res;
    }

    public function listarModelosAct($identidad, $tipo, $node, $idejercicio) {

        /*
         * si tipo == 0 : devuelvo las agrupaciones
         * si tipo == 1 : devuelvo los planes
         */
        switch ($tipo) {
            case 0:
                $arrayagrupaciones = DatAplicacioncartatec::getPlanesEntidad($identidad, $idejercicio);
                // print_r($arrayagrupaciones);die;
                if (isset($arrayagrupaciones[0])) {
                    foreach ($arrayagrupaciones as $i => $agrupacion) {
                        $arrayagrupaciones[$i]['icon'] = '/lib/ExtJS/temas/default/images/tree/folder.gif';
                        $arrayagrupaciones[$i]['qtip'] = "<p><b>Código: </b>" . $agrupacion['codigo'] . "</p>" .
                                "<p><b>Denominación: </b>" . $agrupacion['denominacion'] . "</p>" .
                                "<p><b>Descripción: </b>" . $agrupacion['descripcion'] . "</p>";
                        $arrayagrupaciones[$i]['text'] = $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'];
                    }
                }
                $elementos = $arrayagrupaciones;
                break;
            case 1:
                $arrayplanes = DatAplicacioncartatec::getModelosPlan($identidad, $node, $idejercicio);
                if (isset($arrayplanes[0])) {
                    foreach ($arrayplanes as $i => $plan) {
                        if ($arrayplanes[$i]['ruta']) {
                            $ruta = explode('*', $arrayplanes[$i]['ruta']);
                            $arrayplanes[$i]['ruta'] = $ruta[1];
                            $arrayplanes[$i]['rutaids'] = $ruta[0];
                        }
                        $arrayplanes[$i]['text'] = $plan['denominacion'];

                        $arrayplanes[$i]['qtip'] = "<p><b>Denominación:</b> &nbsp;&nbsp;" . $plan[denominacion] . "</p>" .
                                "<p><b>Descripción:</b> &nbsp;&nbsp;" . $plan[descripcion] . "</p>" .
                                "<p><b>Tipo de Modelo:</b> &nbsp;&nbsp;" . $plan['tipomodelo'] . "</p>" .
                                "<p><b>Tipo de plan:</b> &nbsp;&nbsp;" . $ruta[1] . "</p>";
                    }
                }
                $elementos = $arrayplanes;
                break;
        }

        return $elementos;
    }

}
