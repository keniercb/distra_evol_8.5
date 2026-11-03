<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpDiagramaPertModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function ObtenerActividadesPert($parametros) {

        $filtroestados = 0;
        $parametros->utilizacionFT = 0;
        $arrayestados = array();
        if (isset($parametros->filtros[0])) {
            foreach ($parametros->filtros as $k => $filtro) {
                if ($parametros->filtro['field'] == 'nombreestadoaprob') {
                    $filtroestados = 1;
                    $utilizacionFT = 1;
                    $arrayestados[] = $parametros->filtro['data']['value'];
                }
            }
            $arrayestados = implode(',', $arrayestados);
        }

        if ($filtroestados == 0) {
            $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
                    $parametros->idusuario, $idtipodoc = 3
            );
            if (isset($arrayestadosver[0])) {
                $parametros->utilizacionFT = 1;
                foreach ($arrayestadosver as $estado) {
                    $arrayestados[] = $estado['idestado'];
                }
            }
            $arrayestados = implode(',', $arrayestados);
        }
        $parametros->arrayEstados = $arrayestados;

        $arrayautoresact = array();
        $cero = 0;
        $uno = 1;
        //aqui empiezo a definir las posibles cmbinaciones para obtener
        //arreglo de inv y autores cuanod estos no vienen del client
        if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])) {
            $arrayautoresact[] = $parametros->idusuario;
            $arrayinvolact[] = $parametros->idusuario . $cero;
            $arrayinvolact[] = $parametros->idusuario . $uno;
            $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $parametros->idusuario
            );
            if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                    $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                    $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                }
            }
        }
        $objdatelementos = new DatElementos();
        $arrayActividadesPert = array();
        $arrayRelacionesPert = array();
        $duracionPlan = 0;
        $duracionPlanTotal = "";
        $nodosCriticos = array();
        $relacionNodosCriticos = array();
        if (isset($parametros->elemento[0])) {

            $idelemento = $parametros->elemento->idelemento;
            $parametros->idElementoPadre = $idelemento;
            $elementoo = Doctrine::getTable("DatElementos")->find($idelemento);
            $parametros->idusuario = $elementoo->idusuariocrea;
            $arrayActividades = $objdatelementos->ObtenerActividadesPert($parametros);
            $arrayCaminoCritico = array();

            if (isset($arrayActividades[0])) {
                $parametros->arregloCaminos = array();

                $parametros->caminoCritico = array();
                $parametros->actividadPadre = array();
                $parametros->actividadesPert = array();
                $parametros->arrayRelacionesPert = array();
                $parametros->caminoCriticoNumerico = array();
                $parametros->longitudCaminoMasLargo = 0;
                $parametros->contadorActividades = 1;

                foreach ($arrayActividades as $key => $actividad) {

                    $duracionDias = $actividad['tiempoestimado'] * 60; /* $this->ObtenerDuracionEnDias($actividad['fechainicio'], $actividad['horainicio'], $actividad['fechafin'], $actividad['horafin']); */
                    $arrayActividades[$key]['duracion'] = $duracionDias;
                    $actividad['duracion'] = $duracionDias;
                    $actividad['numero'] = $parametros->contadorActividades;
                    $parametros->contadorActividades++;
                    $parametros->duracionPadre = $duracionDias;
                    $parametros->idActividadPadre = $actividad['idelemento'];
                    $parametros->arrayActividadesCamino[] = $actividad;

                    $result = $this->ObtenerArbolDependenciasTotales($parametros);
                    $parametros = $result['parametros'];

                    $descendencia = $result['arrayActividades'];
                    $arrayActividades[$key]['descendencia'] = $descendencia;
                    if (!isset($descendencia[0])) {
                        $arrayActividadesCamino = $parametros->arrayActividadesCamino;
                        $camino = array();
                        $camino['camino'] = $arrayActividadesCamino;
                        $camino['duracion'] = $duracionDias + $parametros->duracionPadre;

                        if ($camino['duracion'] >= $parametros->longitudCaminoMasLargo) {
                            $parametros->longitudCaminoMasLargo = $camino['duracion'];
                            $parametros->caminoCritico[] = $camino;
                        }
                        $parametros->arregloCaminos[] = $camino;
                    }
                    $parametros = $this->ConformarArregloActividadesPert($parametros, $actividad);
                }

                $parametros = $this->MarcarActividadesCriticas($parametros);
                $arrayActividadesPert = $parametros->actividadesPert;
                $arrayRelacionesPert = $parametros->arrayRelacionesPert;
                $duracionPlan = $parametros->duracionPlan;
                $duracionPlanTotal = $parametros->duracionPlanTotal;
                $nodosCriticos = $parametros->nodosCriticos;
                $relacionNodosCriticos = $parametros->relacionNodosCriticos;
                $caminoCritico = $parametros->caminoCritico;
                //print_r($caminoCritico);die;
            }
        }

        $resultado['arrayActividadesPert'] = $arrayActividadesPert;
        $resultado['arrayRelacionesPert'] = $arrayRelacionesPert;
        $resultado['duracionPlan'] = $duracionPlan;
        $resultado['duracionPlanTotal'] = $duracionPlanTotal;
        $resultado['nodosCriticos'] = $nodosCriticos;
        $resultado['relacionNodosCriticos'] = $relacionNodosCriticos;
        $resultado['caminoCritico'] = $caminoCritico;
        //print_r($resultado['caminoCritico']); die;
        return $resultado;
    }

    public function ObtenerArbolDependenciasTotales($parametros) {

        $resultado = array();
        $objdatelementos = new DatElementos();
        $arrayActividades = $objdatelementos->ObtenerActividadesPertDependientes($parametros);
        if (isset($arrayActividades[0])) {
            $idActividadPadre = $parametros->idActividadPadre;
            $duracionPadre = $parametros->duracionPadre;
            $caminoRecorrido = $parametros->arrayActividadesCamino;
            foreach ($arrayActividades as $key => $actividad) {

                $parametros = $this->ConformarArregloRelacionesPert($parametros, $idActividadPadre, $actividad['idelemento']);

                $duracionDias = $actividad['tiempoestimado'] * 60; /* $this->ObtenerDuracionEnDias($actividad['fechainicio'], $actividad['horainicio'], $actividad['fechafin'], $actividad['horafin']); */
                $actividad['duracion'] = $duracionDias;
                $actividad['numero'] = $parametros->contadorActividades;
                $parametros->contadorActividades++;
                $arrayActividades[$key]['duracion'] = $duracionDias;

                $params = $parametros;
                $params->idActividadPadre = $actividad['idelemento'];
                $params->duracionPadre = $duracionDias + $duracionPadre;
                $params->arrayActividadesCamino[] = $actividad;

                $result = $this->ObtenerArbolDependenciasTotales($params);

                $parametros = $result['parametros'];

                $descendencia = $result['arrayActividades'];
                $arrayActividades[$key]['descendencia'] = $descendencia;
                if (!isset($descendencia[0])) {

                    $arrayActividadesCamino = $params->arrayActividadesCamino;
                    $camino = array();
                    $camino['camino'] = $arrayActividadesCamino;
                    $camino['duracion'] = $duracionDias + $duracionPadre;


                    if ($camino['duracion'] == $parametros->longitudCaminoMasLargo) {
                        $parametros->longitudCaminoMasLargo = $camino['duracion'];
                        $parametros->caminoCritico[] = $camino;
                    } else if
                    ($camino['duracion'] > $parametros->longitudCaminoMasLargo) {
                        $parametros->longitudCaminoMasLargo = $camino['duracion'];
                        $parametros->caminoCritico = array();
                        $parametros->caminoCritico[] = $camino;
                    }

                    $parametros->arregloCaminos[] = $camino;
                }

                $parametros->arrayActividadesCamino = $caminoRecorrido;
                $parametros->duracionPadre = $duracionPadre;
                $parametros = $this->ConformarArregloActividadesPert($parametros, $actividad);
            }
        }
        $resultado['arrayActividades'] = $arrayActividades;
        $resultado['parametros'] = $parametros;
        return $resultado;
    }

    public function ObtenerDuracionEnDias($fechaInicio, $horaInicio, $fechaFin, $horaFin) {

        // print_r("fecha inicio-->".$fechaInicio." ".$horaInicio."---fecha fin-->".$fechaFin." ".$horaFin);die;
        //esto es necesario porque la fecha aunque viene con formato d/m/Y desde BD el server la asume como m/d/Y
        $arrayFechaInicio = explode("/", $fechaInicio);
        $fechaInicio = $arrayFechaInicio[1] . "/" . $arrayFechaInicio[0] . "/" . $arrayFechaInicio[2];
        $fechaInicio = new DateTime($fechaInicio . " " . $horaInicio);

        $arrayFechaFin = explode("/", $fechaFin);
        $fechaFin = $arrayFechaFin[1] . "/" . $arrayFechaFin[0] . "/" . $arrayFechaFin[2];
        $fechaFin = new DateTime($fechaFin . " " . $horaFin);

        $intervalo = $fechaInicio->diff($fechaFin);
        //cantidad de dias transcurridos en total
        $totalDiasTranscurridos = $intervalo->days;
        //cantidad de minutos transcurridos en total
        $totalMinutosTranscurridos = $totalDiasTranscurridos * 24 * 60;

        return $totalMinutosTranscurridos;
    }

    public function ObtenerDuracion($fechaInicio, $horaInicio, $fechaFin, $horaFin) {

        //esto es necesario porque la fecha aunque viene con formato d/m/Y desde BD el server la asume como m/d/Y
        $arrayFechaInicio = explode("/", $fechaInicio);
        $fechaInicio = $arrayFechaInicio[1] . "/" . $arrayFechaInicio[0] . "/" . $arrayFechaInicio[2];
        $fechaInicio = new DateTime($fechaInicio . " " . $horaInicio);

        $arrayFechaFin = explode("/", $fechaFin);
        $fechaFin = $arrayFechaFin[1] . "/" . $arrayFechaFin[0] . "/" . $arrayFechaFin[2];
        $fechaFin = new DateTime($fechaFin . " " . $horaFin);

        $intervalo = $fechaInicio->diff($fechaFin);
        $totalDiasTranscurridos = $intervalo->days;
        //cantidad de dias transcurridos en total
        $totalDuracion = /* $intervalo->d($totalDiasTranscurridos) */$intervalo->y . " años - " . $intervalo->m . " meses - " . $intervalo->d . " dias - " . $intervalo->h . " horas - " . $intervalo->i . " minutos";

        return $totalDuracion;
    }

    public function ConformarArregloActividadesPert($parametros, $actividad) {
        $existe = 0;
        if (isset($parametros->actividadesPert[0])) {
            foreach ($parametros->actividadesPert as $actividadPert) {
                if ($actividadPert['key'] == $actividad['idelemento']) {
                    $existe = 1;
                }
            }
        }
        if (!$existe) {
            $actividadPert['key'] = $actividad['idelemento'];
            $actividadPert['text'] = $actividad['denelemento'];
            $actividadPert['length'] = $actividad['duracion'];
            $actividadPert['numero'] = $actividad['numero'];
            $actividadPert['fechainicio'] = "Inicia : " . $actividad['fechainicio'] . " " . $actividad['horainicio'];
            $actividadPert['fechafin'] = "Termina : " . $actividad['fechafin'] . " " . $actividad['horafin'];
            $actividadPert['idautor'] = $actividad['idusuariocrea'];
            $actividadPert['porcientocumpl'] = $actividad['gradocumplimiento'];
            $actividadPert['tiempoestimado'] = $actividad['tiempoestimado'] * 60; //  
            $actividadPert['earlyStart'] = 0;
            $actividadPert['lateFinish'] = 0;
            $actividadPert['critical'] = false;
            $parametros->actividadesPert[] = $actividadPert;
        }
        return $parametros;
    }

    public function ConformarArregloRelacionesPert($parametros, $desde, $hacia) {
        $relacionPert['from'] = $desde;
        $relacionPert['to'] = $hacia;
        $parametros->arrayRelacionesPert[] = $relacionPert;
        return $parametros;
    }

    public function MarcarActividadesCriticas($parametros) {
        $fechaInicioPlan = "";
        $horaInicioPlan = "";
        $fechaFinPlan = "";
        $horaFinPlan = "";
        /* $cantidadNodosCriticos = 0; */
        $cantidadActividadesCriticas = sizeof($parametros->caminoCritico[0]['camino']);
        if (isset($parametros->caminoCritico[0])) {
            foreach ($parametros->caminoCritico as $posRC => $caminoCritico) {
                foreach ($caminoCritico['camino'] as $pos => $camino) {

                    if ($pos == 0) {
                        $fechaInicioPlan = $camino['fechainicio'];
                        $horaInicioPlan = $camino['horainicio'];
                    }

                    if ($pos == ($cantidadActividadesCriticas - 1)) {
                        $fechaFinPlan = $camino['fechafin'];
                        $horaFinPlan = $camino['horafin'];
                    }

                    foreach ($parametros->actividadesPert as $key => $actividadPert) {
                        if ($actividadPert['key'] == $camino['idelemento']) {
                            $parametros->actividadesPert[$key]['critical'] = true;
                            $parametros->caminoCritico[$posRC]['camino'][$pos]['numero'] = $actividadPert['numero'];
                        }
                    }
                }
            }
        }

        $parametros->duracionPlan = $this->ObtenerDuracionEnDias($fechaInicioPlan, $horaInicioPlan, $fechaFinPlan, $horaFinPlan);
        $parametros->duracionPlanTotal = $this->ObtenerDuracion($fechaInicioPlan, $horaInicioPlan, $fechaFinPlan, $horaFinPlan);
        return $parametros;
    }

}
