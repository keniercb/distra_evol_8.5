<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpDiagramaPertModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function ObtenerActividadesPert($parametros)
    {

        $filtroestados = 0;
        $parametros->utilizacionFT = 0;
        $idusuario = $parametros->idusuario;
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
        if (isset($parametros->elemento)) {
            $idelemento = $parametros->elemento->idelemento;
            $parametros->idElementoPadre = $idelemento;
            $elementoo = Doctrine::getTable("DatElementos")->find($idelemento);
            $parametros->idusuario = $elementoo->idusuariocrea;
            if ($parametros->elemento->tipoelemento == 8) {
                $parametros->esProyecto = true;
                $arrayActividades = $this->ObtenerHitosDadoProyecto($parametros);
            } else {
                $params->idusuario = $idusuario;
                $params->start = $parametros->start;
                $params->limit = $parametros->limit;
                $params->idplan = $parametros->elemento->idelemento;
                $params->arrayEstados = $arrayestados;
                $params->utilizacionFT =  $parametros->utilizacionFT;

                if ($parametros->generarDiagramaDesde == 'Plan') {
                    $arrayplan[0]['key'] = $params->idplan;
                    $arrayplan[0]['text'] = $parametros->elemento->denominacion;
                    $arrayplan[0]['isGroup'] = true;
                    $arrayplan[0]['color'] = '#5F5F5F';
                    $grupoHitos = $arrayplan;
                    $params->limit = 100;
                    $params->strActividades = $this->obtenerActividadesPlan($params);
                    $arrayActividades = $objdatelementos->obtenerDatosActividades($params);
                    //print_r($arrayActividades);die;
                } else { //generarDiagramaDesde == 'Pert')
                    $grupoHitos = $this->obtenerPlanes($params);
                    $arrayActividades = $objdatelementos->ObtenerActividadesPert($parametros);
                }
            }
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

                    $duracionDias = $actividad['tiempoestimado']; /* $this->ObtenerDuracionEnDias($actividad['fechainicio'], $actividad['horainicio'], $actividad['fechafin'], $actividad['horafin']); */
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
                $numero = 1;
                for ($i = count($parametros->actividadesPert); $i > 0; $i--) {
                    $parametros->actividadesPert[$i - 1]['numero'] = $numero++;
                }
                $parametros = $this->MarcarActividadesCriticas($parametros);
                $arrayActividadesPert = $parametros->actividadesPert;
                $arrayRelacionesPert = $parametros->arrayRelacionesPert;
                $duracionPlan = $parametros->duracionPlan;
                $duracionPlanTotal = $parametros->duracionPlanTotal;
                $nodosCriticos = $parametros->nodosCriticos;
                $relacionNodosCriticos = $parametros->relacionNodosCriticos;
                $caminoCritico = $parametros->caminoCritico;
                $cantTareasEjecutadasEnParalelo = array();
                if ($parametros->elemento->tipoelemento == 8) {
                    $cantTareasEjecutadasEnParalelo = $objdatelementos->ObtenerCantTareasEjecutadasEnParalelo($parametros);
                    $grupoHitos = $parametros->arrayGrupoHitos;
                }
            }
        }

        $resultado['arrayActividadesPert'] = $arrayActividadesPert;
        $resultado['arrayRelacionesPert'] = $arrayRelacionesPert;
        if ($parametros->elemento->plantilla == 0)
            $resultado['arrayActividadesPert'] = $this->calcularHolguraRealPorActividad($resultado);

        $resultado['duracionPlan'] = $duracionPlan;
        $resultado['duracionPlanTotal'] = $duracionPlanTotal;
        $resultado['nodosCriticos'] = $nodosCriticos;
        $resultado['relacionNodosCriticos'] = $relacionNodosCriticos;
        $resultado['caminoCritico'] = $caminoCritico;
        $resultado['cantTareasParalelas'] = $cantTareasEjecutadasEnParalelo[0]['tareasparalelas'];
        $resultado['arrayGrupoHitos'] = $grupoHitos;
        return $resultado;
    }

    public function obtenerActividadesPlan($datos)
    {
        $arrayTareas = array();
        $datos->str_idelementos = "";
        if (!empty($datos->idplan)) {
            DatArcDatPlan::getActPlan($datos->idplan, $datos->idusuario, $arrayTareas);
            foreach ($arrayTareas as $value) {
                $datos->str_idelementos .= (empty($datos->str_idelementos)) ? $value : "," . $value;
            }
        }
        return $datos->str_idelementos;
    }

    public function obtenerPlanes($params)
    {
        $model = new CmpgestionaractividadesModel();
        $arrayplanes = $model->cargarComboPlanes($params);
        if (isset($arrayplanes[0])) {
            foreach ($arrayplanes as $plan => $value) {
                $arrayplanes[$plan]['key'] = $value['idplan'];
                $arrayplanes[$plan]['text'] = $value['denominacion'];
                $arrayplanes[$plan]['isGroup'] = true;
                $arrayplanes[$plan]['color'] = '#5F5F5F';
            }
        }
        return $arrayplanes;
    }

    public function ObtenerArbolDependenciasTotales($parametros)
    {

        $resultado = array();
        $objdatelementos = new DatElementos();
        $arrayActividades = $objdatelementos->ObtenerActividadesPertDependientes($parametros);

        if (isset($arrayActividades[0])) {
            $idActividadPadre = $parametros->idActividadPadre;
            $duracionPadre = $parametros->duracionPadre;
            $caminoRecorrido = $parametros->arrayActividadesCamino;
            foreach ($arrayActividades as $key => $actividad) {

                $parametros = $this->ConformarArregloRelacionesPert($parametros, $idActividadPadre, $actividad['idelemento']);

                $duracionDias = $actividad['tiempoestimado']; /* $this->ObtenerDuracionEnDias($actividad['fechainicio'], $actividad['horainicio'], $actividad['fechafin'], $actividad['horafin']); */
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

    public function ObtenerDuracionEnDias($fechaInicio, $horaInicio, $fechaFin, $horaFin)
    {

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

    public function ObtenerDuracionEnMinutos($fechaInicio, $horaInicio, $fechaFin, $horaFin)
    {
        if (!empty($fechaInicio) && !empty($horaInicio) && !empty($fechaFin) && !empty($horaFin)) {
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
            //$totalDiasTranscurridos = $intervalo->days;
            //cantidad de minutos transcurridos en total
            //$totalMinutos = $totalDiasTranscurridos * 24 * 60;
            //print_r($totalDiasTranscurridos);die;
            $totalMinutos = $intervalo->d * 24 * 60;
            $totalMinutos += $intervalo->h * 60;
            $totalMinutos += $intervalo->i;
            $tiempoTotal['totalMinutos'] = $totalMinutos;
            return $tiempoTotal;
        } else return 0;
    }

    public function ObtenerDuracion($fechaInicio, $horaInicio, $fechaFin, $horaFin)
    {

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
        $totalDuracion = /* $intervalo->d($totalDiasTranscurridos) */
            $intervalo->y . " años - " . $intervalo->m . " meses - " . $intervalo->d . " dias - " . $intervalo->h . " horas - " . $intervalo->i . " minutos";

        return $totalDuracion;
    }

    function Mayus($variable)
    {
        setlocale(LC_CTYPE, 'es');
        $variable = strtr(strtoupper($variable), "àèìòùáéíóúçñäëïöü", "ÀÈÌÒÙÁÉÍÓÚÇÑÄËÏÖÜ");
        return $variable;
    }

    public function ConformarArregloActividadesPert($parametros, $actividad)
    {
        //print_r(date('d/m/Y H:i:s'));die; //retorna fecha en el siguiente formato 14/10/2016 15:02:31
        $fecha_hora_servidor = strtotime(date("d-m-Y H:i:00", time()));

        $existe = 0;
        if (isset($parametros->actividadesPert[0])) {
            foreach ($parametros->actividadesPert as $actividadPert) {
                if ($actividadPert['key'] == $actividad['idelemento']) {
                    $existe = 1;
                    break;
                }
            }
        }
        if (!$existe) {
            $actividadPert['key'] = $actividad['idelemento'];
            $actividadPert['group'] = empty($actividad['idhito']) ? (!empty($actividad['idplan']) ? $actividad['idplan'] : '1') : $actividad['idhito'];//$actividad['idhito'];
            $actividadPert['text'] = self::Mayus($actividad['denelemento']); //. " - " . $actividad['idelemento'];
            $actividadPert['denelemento'] = $actividad['denelemento'];
            $actividadPert['length'] = $actividad['duracion'];
            $actividadPert['numero'] = $parametros->contadorActividades++;
            $actividadPert['fechainicio'] = "Inicia: " . $actividad['fechainicio'] . " " . $actividad['horainicio'];
            $actividadPert['fechafin'] = "Termina: " . $actividad['fechafin'] . " " . $actividad['horafin'];

            $actividadPert['fechaInicio'] = $actividad['fechainicio'];
            $actividadPert['fechaFin'] = $actividad['fechafin'];

            $actividadPert['horainicio'] = $actividad['horainicio'];
            $actividadPert['horafin'] = $actividad['horafin'];

            $actividadPert['idautor'] = $actividad['idusuariocrea'];
            $actividadPert['gradocumplimiento'] = $actividad['gradocumplimiento'];

            $actividadPert['tiempooptimista'] = $actividad['tiempooptimista'];
            $actividadPert['tiempomedio'] = $actividad['tiempomedio'];
            $actividadPert['tiempopesimista'] = $actividad['tiempopesimista'];

            $fecha_hora_fin = strtotime(date(str_replace("/", "-", $actividad['fechafin']) . " " . $actividad['horafin']));
            $fecha_hora_inicio = strtotime(date(str_replace("/", "-", $actividad['fechainicio']) . " " . $actividad['horainicio']));
            // print_r($fecha_hora_servidor . '>=' . $fecha_hora_fin . ' ');
            if (($fecha_hora_servidor <= $fecha_hora_fin) && ($fecha_hora_servidor >= $fecha_hora_inicio) && $actividad['gradocumplimiento'] == 0) {
                $actividadPert['es'] = 5;
            } else if (($fecha_hora_servidor >= $fecha_hora_fin) && $actividad['gradocumplimiento'] != 100) {
                $actividadPert['es'] = 4;
            } else {
                if ($actividad['gradocumplimiento'] == 100)
                    $actividadPert['es'] = true;
                else if ($actividad['gradocumplimiento'] >= 1) {
                    $actividadPert['es'] = false;
                } else {
                    $actividadPert['es'] = null;
                }
            }
            $actividadPert['tiempoestimado'] = round($actividad['tiempoestimado']); //
            $actividadPert['earlyStart'] = 0;
            $actividadPert['lateFinish'] = 0;
            $actividadPert['critical'] = false;
            $actividadPert['descelemento'] = empty($actividad['descelemento']) ? '-' : preg_replace("/\s|&nbsp;/", '', strip_tags($actividad['descelemento'])); //($actividad['descelemento'] != '') ? $actividad['descelemento'] : 9000020830;
            $actividadPert['antecedente'] = $actividad['antecedente'];
            $parametros->actividadesPert[] = $actividadPert;
        }
        return $parametros;
    }

    public function ConformarArregloActividadesPertOld($parametros, $actividad)
    {
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

    public function ConformarArregloRelacionesPert($parametros, $desde, $hacia)
    {
        $existe = 0;
        if (isset($parametros->arrayRelacionesPert[0])) {
            foreach ($parametros->arrayRelacionesPert as $relacionPert) {
                if ($relacionPert['from'] == $desde && $relacionPert['to'] == $hacia) {
                    $existe = 1;
                    break;
                }
            }
        }
        if (!$existe) {
            $relacionPert['from'] = $desde;
            $relacionPert['to'] = $hacia;
            $parametros->arrayRelacionesPert[] = $relacionPert;
        }
        return $parametros;
    }

    public function ConformarArregloRelacionesPertOld($parametros, $desde, $hacia)
    {
        $relacionPert['from'] = $desde;
        $relacionPert['to'] = $hacia;
        $parametros->arrayRelacionesPert[] = $relacionPert;
        return $parametros;
    }

    public function MarcarActividadesCriticas($parametros)
    {
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

    public function ObtenerHitosDadoProyecto($parametros)
    {
        $objactividadmodel = new CmpgestionaractividadesModel();
        $arrayHitos = array();
        $arrayTareas = array();
        $objactividadmodel->buscarInferioresPert($parametros->elemento->idelemento, $arrayHitos, '<=', 3, 9);

        $parametros->arrayGrupoHitos = $objactividadmodel->buscarGrupoHitos($arrayHitos);
        $parametros->arrayhitos = $arrayHitos;
        $objdatelementos = new DatElementos();
        if (isset($arrayHitos[0])) {
            $arrayTareas = $objdatelementos->ObtenerTareasPertDadoHitos($parametros);
        }
        $arrayTareasDirectasProyectos = $objdatelementos->ObtenerTareasPertDirectasProyecto($parametros);
        if (isset($arrayTareasDirectasProyectos[0])) {
            $arrayTareas = array_merge($arrayTareas, $arrayTareasDirectasProyectos);
        }
        //print_r($arrayTareas);die;
        return $arrayTareas;
    }

    public function ObtenerTareasOrganizadasReporteMatrices($parametros)
    {
        $objactividadmodel = new CmpgestionaractividadesModel();
        $arrayHitos = array();
        $arrayTareas = array();
        $objactividadmodel->buscarInferioresPert($parametros->elemento->idelemento, $arrayHitos, '<=', 3, 9);
        $parametros->arrayhitos = $arrayHitos;
        $objdatelementos = new DatElementos();
        if (isset($arrayHitos[0])) {
            $arrayTareas = $objdatelementos->ObtenerTareasReporteMatrizAntecedentes($parametros);
        }
        //print_r($arrayHitos);die;
        return $arrayTareas;
    }

    public function ObtenerTareasParaGestionarEjecucion($parametros)
    {
        $objactividadmodel = new CmpgestionaractividadesModel();
        $arrayHitos = array();
        $arrayTareas = array();
        $objactividadmodel->buscarInferioresPert($parametros->idproyecto, $arrayHitos, '<=', 3, 9);
        $parametros->arrayhitos = $arrayHitos;
        $objdatelementos = new DatElementos();
        if (isset($arrayHitos[0])) {
            $arrayTareas = $objdatelementos->ObtenerTareasParaGestionarEjecucion($parametros);
        }

        if (isset($arrayTareas[0])) {

            foreach ($arrayTareas as $key => $tarea) {
                $parent = null;
                if ($parametros->anode) {
                    $parent = $parametros->anode;
                }
                $parametros->idelementopadre = $tarea['idelemento'];

                $tienehijos = $objdatelementos->tieneHijos($parametros);
                $leaf = true;
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }

                $arrayTareasAEjecutar['resultado'][$key]['fechainicio'] = $tarea['fechainicio'];
                $arrayTareasAEjecutar['resultado'][$key]['fechafin'] = $tarea['fechafin'];
                $arrayTareasAEjecutar['resultado'][$key]['tiempoestimado'] = $tarea['tiempoestimado'];
                $arrayTareasAEjecutar['resultado'][$key]['origen'] = $tarea['origen'];

                $denominacion = str_ireplace('"', '%', $tarea['denelemento']);
                $arrayTareasAEjecutar['resultado'][$key]['nombreautor'] = $this->integrator->seguridad->nombreUsuario($tarea['idusuariocrea']);
                $arrayTareasAEjecutar['resultado'][$key]['idelemento'] = $tarea['idelemento'];
                $arrayTareasAEjecutar['resultado'][$key]['idautor'] = $tarea['idusuariocrea'];
                $arrayTareasAEjecutar['resultado'][$key]['_parent'] = $parent;
                $arrayTareasAEjecutar['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayTareasAEjecutar['resultado'][$key]['denominacion'] = $denominacion;
                $arrayTareasAEjecutar['resultado'][$key]['gradocumplimiento'] = $tarea['gradocumplimiento'];
                $arrayTareasAEjecutar['resultado'][$key]['tipoelemento'] = $tarea['idtipoelemento'];
                $arrayTareasAEjecutar['resultado'][$key]['textocumplimiento'] = $tarea['estadocumplimiento'];
                $arrayTareasAEjecutar['resultado'][$key]['estadocumplimiento'] = $tarea['estadocumplimiento'] . "(" . $tarea['gradocumplimiento'] . "%)";
            }
        }
        //print_r($arrayTareasAEjecutar);die;
        return $arrayTareasAEjecutar;
    }

    public function obtenerTareasDeUnProyectoOPlantilla($parametros)
    {
        $objactividadmodel = new CmpgestionaractividadesModel();
        $arrayHitos = array();
        $arrayTareas = array();
        $objactividadmodel->buscarInferioresPert($parametros->idproyecto, $arrayHitos, '<=', 3, 9);
        $parametros->arrayhitos = $arrayHitos;
        $objdatelementos = new DatElementos();
        if (isset($arrayHitos[0])) {
            $arrayTareas = $objdatelementos->ObtenerTareasDadoProyectoOPlantilla($parametros);
        }

        if (isset($arrayTareas[0])) {

            foreach ($arrayTareas as $key => $tarea) {
                $parent = null;
                if ($parametros->anode) {
                    $parent = $parametros->anode;
                }
                $parametros->idelementopadre = $tarea['idelemento'];

                $tienehijos = $objdatelementos->tieneHijos($parametros);
                $leaf = true;
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }

                $arrayTareasAEjecutar['resultado'][$key]['fechainicio'] = $tarea['fechainicio'];
                $arrayTareasAEjecutar['resultado'][$key]['fechafin'] = $tarea['fechafin'];
                $arrayTareasAEjecutar['resultado'][$key]['tiempoestimado'] = $tarea['tiempoestimado'];
                $arrayTareasAEjecutar['resultado'][$key]['origen'] = $tarea['origen'];

                $denominacion = str_ireplace('"', '%', $tarea['denelemento']);
                $arrayTareasAEjecutar['resultado'][$key]['nombreautor'] = $this->integrator->seguridad->nombreUsuario($tarea['idusuariocrea']);
                $arrayTareasAEjecutar['resultado'][$key]['idelemento'] = $tarea['idelemento'];
                $arrayTareasAEjecutar['resultado'][$key]['idautor'] = $tarea['idusuariocrea'];
                $arrayTareasAEjecutar['resultado'][$key]['_parent'] = $parent;
                $arrayTareasAEjecutar['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayTareasAEjecutar['resultado'][$key]['denominacion'] = $denominacion;
                $arrayTareasAEjecutar['resultado'][$key]['gradocumplimiento'] = $tarea['gradocumplimiento'];
                $arrayTareasAEjecutar['resultado'][$key]['tipoelemento'] = $tarea['idtipoelemento'];
                $arrayTareasAEjecutar['resultado'][$key]['textocumplimiento'] = $tarea['estadocumplimiento'];
                $arrayTareasAEjecutar['resultado'][$key]['estadocumplimiento'] = $tarea['estadocumplimiento'] . "(" . $tarea['gradocumplimiento'] . "%)";
            }
        }
        //print_r($arrayTareasAEjecutar);die;
        return $arrayTareasAEjecutar;
    }

    public function obtenerHitosDadoElemento($parametros)
    {

        /* $objactividadmodel = new CmpgestionaractividadesModel();
          $arrayHitos = array();
          $objactividadmodel->buscarInferioresPert($parametros->idproyecto, $arrayHitos, '<=', 3, 9);
          $parametros->arrayGrupoHitos = $objactividadmodel->buscarGrupoHitos($arrayHitos); */

        $objdatelementos = new DatElementos();
        $arrayHitos = $objdatelementos->ObtenerHitosDadoElemento($parametros);
        foreach ($arrayHitos as $key => $idhito) {

            //{key: 5, text: "Epsilon", color: "green", isGroup: true}
            $parametros->arrayGrupoHitos[$key]['key'] = $idhito['idelemento'];
            $parametros->arrayGrupoHitos[$key]['text'] = $idhito['denelemento'];
            $parametros->arrayGrupoHitos[$key]['isGroup'] = true;
            $parametros->arrayGrupoHitos[$key]['color'] = "#5F5F5F";
        }

        return $parametros->arrayGrupoHitos;
    }

    public function calcularHolguraRealPorActividad($resultado)
    {

        for ($i = count($resultado['arrayActividadesPert']); $i > 0; $i--) {
            $actividad = $resultado['arrayActividadesPert'][$i - 1];
            $holgura = 0;
            $arraySucesores = array();
            $arraySucesores = $this->buscarSucesores($actividad, $resultado['arrayRelacionesPert'], $resultado['arrayActividadesPert']);

            if (count($arraySucesores) != 0) {
                $holgura = $this->buscarHolguraEntreTareasSucesoras($actividad, $arraySucesores);
                $actividad['holgura'] = $this->desglozarHolgura($holgura);
            }
            if ($actividad['numero'] == 1) {
                $actividad['tiempoprevio'] = "Tiempo previo: - ";
                $actividad['tiempopreviomin'] = 0;
            } else {
                $arrayAntecesores = $this->buscarAntecesor($actividad, $resultado['arrayRelacionesPert'], $resultado['arrayActividadesPert']);
                $tiempoprevio = $this->tiempoPrevioDeLaActividad($arrayAntecesores);

                $actividad['tiempoprevio'] = "Tiempo previo: " . $tiempoprevio['tiempoprevio'];
                $actividad['tiempopreviomin'] = $tiempoprevio['tiempopreviomin'];
            }
            $resultado['arrayActividadesPert'][$i - 1] = $actividad;
        }
        return $resultado['arrayActividadesPert'];
    }

    public function buscarHolguraEntreTareasSucesoras($tarea, $arraySucesores)
    {

        $arrayHolguras = array();
        for ($i = 0; $i < count($arraySucesores); $i++) {
            //$duracionEnMinutos = $this->diferenciaHoras($tarea['fechafin'], $arraySucesores[$i]['fechainicio']) * 60; // Queda restar esta dos fechas, ver ObtenerDuracionEnDias
            //print_r("fecha inicio-->".$tarea['fechaFin']." ".$tarea['horafin']."---fecha fin-->".$arraySucesores[$i]['fechaInicio']." ".$arraySucesores[$i]['horainicio']);die;
            $duracionEnMinutos = $this->ObtenerDuracionEnMinutos($tarea['fechaFin'], $tarea['horafin'], $arraySucesores[$i]['fechaInicio'], $arraySucesores[$i]['horainicio']);
            //print_r(['totalMinutos']);die;
            $arrayHolguras[$i] = $duracionEnMinutos['totalMinutos'];
        }

        $holgura = $arrayHolguras[0];
        for ($i = 0; $i < count($arrayHolguras); $i++) {
            if ($arrayHolguras[$i] < $holgura) {
                $holgura = $arrayHolguras[$i];
            }
        }

        return $holgura;
    }

    public function buscarSucesores($actividad, $arrayRelacionesPert, $arrayActividadesPert)
    {

        $arraySucesores = array();
        $pos = 0;
        for ($i = 0; $i < count($arrayRelacionesPert); $i++) {
            $tareaSucesora;
            if ($arrayRelacionesPert[$i]['from'] == $actividad['key']) {
                $tareaSucesora = $this->buscarDatosTareaAntecedente($arrayRelacionesPert[$i]['to'], $arrayActividadesPert);
                $arraySucesores[$pos++] = $tareaSucesora;
            }
        }
        return $arraySucesores;
    }

    public function buscarAntecesor($actividad, $arrayRelacionesPert, $arrayActividadesPert)
    {

        $arrayAntecesor = array();
        $pos = 0;
        for ($i = 0; $i < count($arrayRelacionesPert); $i++) {
            $tareaAntecesora;
            if ($arrayRelacionesPert[$i]['to'] == $actividad['key']) {
                $tareaAntecesora = $this->buscarDatosTareaAntecedente($arrayRelacionesPert[$i]['from'], $arrayActividadesPert);
                $arrayAntecesor[$pos++] = $tareaAntecesora;
            }
        }
        return $arrayAntecesor;
    }

    public function buscarDatosTareaAntecedente($idtarea, $arrayTareas)
    {
        $tarea;
        for ($j = 0; $j < count($arrayTareas); $j++) {
            if ($arrayTareas[$j]['key'] == $idtarea) {
                $tarea = $arrayTareas[$j];
                break;
            }
        }
        return $tarea;
    }

    public function extraerFechaHoraInicio($fechaHoraInicio)
    {

        $fechaHoraInicio = explode("Inicia: ", $fechaHoraInicio);
        $FechaHora = explode(" ", $fechaHoraInicio);
        $resultado['fechainicio'] = $FechaHora[0];
        $resultado['horainicio'] = $FechaHora[1];

        return $resultado;
    }

    public function extraerFechaHoraFin($fechaHoraFin)
    {

        $fechaHoraFin = explode("Termina: ", $fechaHoraFin);
        $FechaHora = explode(" ", $fechaHoraFin);
        $resultado['fechafin'] = $FechaHora[0];
        $resultado['horafin'] = $FechaHora[1];

        return $resultado;
    }

    public function desglozarHolgura($equivalenciaMinutos)
    {

        $restoDias = $equivalenciaMinutos % (1440);
        $equivalenciaDias = $equivalenciaMinutos / (1440);
        $equivalenciaHoras = $restoDias / (60);
        $restoMinutos = $restoDias % (60);


        if ($equivalenciaMinutos >= 60) {
            if ($equivalenciaDias != 0)
                $tiempo = intval($equivalenciaDias) . ' dias';
            else
                $tiempo = '';
            if ($equivalenciaHoras != 0)
                $tiempo .= ' ' . intval($equivalenciaHoras) . ' horas';
            else
                $tiempo .= '';
            if ($restoMinutos != 0)
                $tiempo .= ' ' . round($restoMinutos) . ' min';
            else
                $tiempo .= '';
        } else {
            $tiempo = round($equivalenciaMinutos) . ' min';
        }

        return $tiempo;
    }

    public function tiempoPrevioDeLaActividad($arrayAntecesores)
    {
        $tiempoprevio = 0;
        $arraytiempoprevio = array();
        foreach ($arrayAntecesores as $antecesor) {
            $tiempoprevio = $antecesor['tiempoestimado'] + $antecesor['tiempopreviomin'];
            array_push($arraytiempoprevio, $tiempoprevio);
        }
        $tiempoprevio = max($arraytiempoprevio);
        $result['tiempopreviomin'] = $tiempoprevio;
        $result['tiempoprevio'] = $this->desglozarHolgura($tiempoprevio);

        return $result;
    }


}
