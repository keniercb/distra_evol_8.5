<?php

/**
 * @author    Osleidy Quiala Fernández
 * @version   1.0.0
 * @copyright ERP-CUBA
 */
class CmpestadisticaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /*
     * carga el combo proyectos
     */
    public function cargarComboProyectos($parametros)
    {
        $proy = DatProyecto::cargarComboProyectos($parametros);
        return $proy;
    }
    public function cargarComboHitos($parametros)
    {
        $hitos = DatHito::cargarComboHitos($parametros);
        return $hitos;
    }

    public function getTareasProyecto($id, &$arrayTareas, $params)
    {
        $hijos = DatProyecto::obtenerHijosInmediatos($id);
        foreach ($hijos as $hijo) {
            if ($hijo['idtipoelemento'] == 10) {
                $temp = DatTarea::obtenerDatosTarea(
                    $hijo['idelemento'], $params
                );
                if ($temp[0]['fechainicio'] != '') {
                    $hijo['duracionestimada'] = $temp[0]['duracionestimada'];
                    $hijo['fechainicio'] = $temp[0]['fechainicio'];
                    $hijo['fechafin'] = $temp[0]['fechafin'];
                    $hijo['horainicio'] = $temp[0]['horainicio'];
                    $hijo['horafin'] = $temp[0]['horafin'];
                    $hijo['gradocumplimiento'] = $temp[0]['gradocumplimiento'];
                    $hijo['peso'] = $temp[0]['peso'];
                    if ($params->tiponom != '') {
                        $tipoTarea = DatTarea::getTipoTarea(
                            $hijo['idelemento'], $params
                        );
                        $hijo['idnomenclador'] = $tipoTarea[0]['idnomenclador'];
                        $hijo['dennomenclador']
                            = $tipoTarea[0]['dennomenclador'];
                    }
                    array_push($arrayTareas, $hijo);
                }
            }
            self::getTareasProyecto($hijo['idelemento'], $arrayTareas, $params);
        }
        return $arrayTareas;
    }

    function cargarDisciplinaProy($params)
    {
        $arrayTareas = array();
        self::getTareasProyecto($params->idproy, $arrayTareas, $params);
        $incumplidas = 0;
        $parcialmenteCumplidas = 0;
        $noIniciadas = 0;
        $cumplidas = 0;
        $fechaActual = date('d/m/Y');
        //Por cada actividad calculo sus datos
        foreach ($arrayTareas as $k => $act) {
            $duracionF = self::dias_transcurridos(
                $act['fechafin'], $fechaActual
            );
            $duracionI = self::dias_transcurridos(
                $act['fechainicio'], $fechaActual
            );
            if ($params->peso == 1) {
                if ($act['gradocumplimiento'] < 100 && $duracionF < 0) {
                    $incumplidas += $act['peso'];
                }
                if ($act['gradocumplimiento'] < 100
                    && $act['gradocumplimiento'] > 0
                    && $duracionF >= 0
                ) {
                    $parcialmenteCumplidas += $act['peso'];
                }
                if ($act['gradocumplimiento'] == 0 && $duracionF >= 0
                    && $duracionI <= 0
                ) {
                    $noIniciadas += $act['peso'];
                }
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidas += $act['peso'];
                }
            } else {
                if ($act['gradocumplimiento'] < 100 && $duracionF < 0) {
                    $incumplidas++;
                }
                if ($act['gradocumplimiento'] < 100
                    && $act['gradocumplimiento'] > 0
                    && $duracionF >= 0
                ) {
                    $parcialmenteCumplidas++;
                }
                if ($act['gradocumplimiento'] == 0 && $duracionF >= 0
                    && $duracionI <= 0
                ) {
                    $noIniciadas++;
                }
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidas++;
                }
            }
        }
        $total = $incumplidas + $parcialmenteCumplidas + $noIniciadas
            + $cumplidas;
        $pIncumplidas = ($incumplidas * 100) / $total;
        $pParcialmenteCumplidas = ($parcialmenteCumplidas * 100) / $total;
        $pNoIniciadas = ($noIniciadas * 100) / $total;
        $pCumplidas = ($cumplidas * 100) / $total;
        $data = Array(
            array(
                "name"  => 'Cumplidas',
                "y"     => $pCumplidas,
                "color" => '#72D572',
                "cant"  => $cumplidas
            ), array(
                "name"  => 'Parcialmente cumplidas',
                "y"     => $pParcialmenteCumplidas,
                "color" => '#F9E58B',
                "cant"  => $parcialmenteCumplidas
            ), array(
                "name"  => 'Incumplidas',
                "y"     => $pIncumplidas,
                "color" => '#FF5261',
                "cant"  => $incumplidas
            ), array(
                "name"  => 'No iniciadas',
                "y"     => $pNoIniciadas,
                "color" => '#F6915C',
                "cant"  => $noIniciadas
            )
        );
        return $data;
    }

    function cargarDisciplina($parametros)
    {
        $objDatAct = new DatTarea();
        $incumplidas = $objDatAct->tareasIncumplidas($parametros);
        $parcialmenteCumplidas = $objDatAct->tareasPcumplidas($parametros);
        $noIniciadas = $objDatAct->tareasNoIniciadas($parametros);
        $cumplidas = $objDatAct->tareasCumplidas($parametros);
        $total = $incumplidas[0] + $parcialmenteCumplidas[0] + $noIniciadas[0]
            + $cumplidas[0];
        $pIncumplidas = ($incumplidas[0] * 100) / $total;
        $pParcialmenteCumplidas = ($parcialmenteCumplidas[0] * 100) / $total;
        $pNoIniciadas = ($noIniciadas[0] * 100) / $total;
        $pCumplidas = ($cumplidas[0] * 100) / $total;
        $data = Array(
            array(
                "name"  => 'Cumplidas',
                "y"     => $pCumplidas,
                "color" => '#72D572',
                "cant"  => $cumplidas[0]
            ), array(
                "name"  => 'Parcialmente cumplidas',
                "y"     => $pParcialmenteCumplidas,
                "color" => '#F9E58B',
                "cant"  => $parcialmenteCumplidas[0]
            ), array(
                "name"  => 'Incumplidas',
                "y"     => $pIncumplidas,
                "color" => '#FF5261',
                "cant"  => $incumplidas[0]
            ), array(
                "name"  => 'No iniciadas',
                "y"     => $pNoIniciadas,
                "color" => '#F6915C',
                "cant"  => $noIniciadas[0]
            )
        );
        return $data;
    }

    function cargarBalanceProy($parametros)
    {
        $arrayTareas = array();
        self::getTareasProyecto($parametros->idproy, $arrayTareas, $parametros);
        $fechaActual = date('d/m/Y');
        $incumpSinIFueraFecha = 0;
        $parcialCFueraFecha = 0;
        $parcialCEnTiempo = 0;
        $noIniciadasEnTiempo = 0;
        $proximoLunes = date('Y-m-d', strtotime('next monday'));
        $proximoDomingo = date(
            'Y-m-d', strtotime('+6 day', strtotime($proximoLunes))
        );
        $proximoLunes = date('d/m/Y', strtotime($proximoLunes));
        $proximoDomingo = date('d/m/Y', strtotime($proximoDomingo));
        $proximaSemana = 0;
        //Por cada actividad calculo sus datos
        foreach ($arrayTareas as $k => $act) {
            $duracionL = self::dias_transcurridos(
                $act['fechainicio'], $proximoLunes
            ); //ISE
            $duracionD = self::dias_transcurridos(
                $act['fechainicio'], $proximoDomingo
            ); //ISE
            $duracionF = self::dias_transcurridos(
                $act['fechafin'], $fechaActual
            );
            $duracionT = self::dias_transcurridos(
                $act['fechafin'], $proximoLunes
            ); //NIET - fechafin < proximo Lunes
            if ($parametros->peso == 1) {
                if ($act['gradocumplimiento'] == 0 && $duracionF < 0) {
                    $incumpSinIFueraFecha += $act['peso'];
                }
                if ($act['gradocumplimiento'] < 100
                    && $act['gradocumplimiento'] > 0
                    && $duracionF < 0
                ) {
                    $parcialCFueraFecha += $act['peso'];
                }
                if ($act['gradocumplimiento'] < 100
                    && $act['gradocumplimiento'] > 0
                    && $duracionF >= 0
                ) {
                    $parcialCEnTiempo += $act['peso'];
                }
                if ($act['gradocumplimiento'] == 0 && $duracionT >= 0) {
                    $noIniciadasEnTiempo += $act['peso'];
                }
                if ($act['gradocumplimiento'] == 0 && $duracionL >= 0
                    && $duracionD <= 0
                ) {
                    $proximaSemana += $act['peso'];
                }
            } else {
                if ($act['gradocumplimiento'] == 0 && $duracionF < 0) {
                    $incumpSinIFueraFecha++;
                }
                if ($act['gradocumplimiento'] < 100
                    && $act['gradocumplimiento'] > 0
                    && $duracionF < 0
                ) {
                    $parcialCFueraFecha++;
                }
                if ($act['gradocumplimiento'] < 100
                    && $act['gradocumplimiento'] > 0
                    && $duracionF >= 0
                ) {
                    $parcialCEnTiempo++;
                }
                if ($act['gradocumplimiento'] == 0 && $duracionT >= 0) {
                    $noIniciadasEnTiempo++;
                }
                if ($act['gradocumplimiento'] == 0 && $duracionL >= 0
                    && $duracionD <= 0
                ) {
                    $proximaSemana++;
                }
            }
        }
        $acumulado = $incumpSinIFueraFecha + $parcialCFueraFecha
            + $parcialCEnTiempo + $noIniciadasEnTiempo;
        $pronostico = $acumulado + $proximaSemana;
        $data = Array(
            array(
                "name"  => 'ISIFF',
                "y"     => $incumpSinIFueraFecha,
                "color" => '#FF5261',
                "text"  => 'Incumplidas sin iniciar fuera de fecha',
            ), array(
                "name"  => 'PCFF',
                "y"     => $parcialCFueraFecha,
                "color" => '#F6915C',
                "text"  => 'Parcialmente cumplidas fuera de fecha',
            ), array(
                "name"  => 'PCET',
                "y"     => $parcialCEnTiempo,
                "color" => '#F9E58B',
                "text"  => 'Parcialmente cumplidas y en tiempo',
            ), array(
                "name"  => 'NIET',
                "y"     => $noIniciadasEnTiempo,
                "color" => '#77C2F8',
                "text"  => 'No iniciadas y en tiempo',
            ), array(
                "name"  => 'AP',
                "y"     => $acumulado,
                "color" => '#959299',
                "text"  => 'Acumulado de pendientes',
            ), array(
                "name"  => 'ISE',
                "y"     => $proximaSemana,
                "color" => '#9394DF',
                "text"  => 'Inician la semana entrante',
            ), array(
                "name"  => 'PEASE',
                "y"     => $pronostico,
                "color" => '#72D572',
                "text"  => 'Pronostico de eventos activos para la semana entrante',
            )
        );
        return $data;
    }

    function cargarBalance($parametros)
    {
        $objDatAct = new DatTarea();
        $incumpSinIFueraFecha = $objDatAct->incumpSinIFueraFecha(
            $parametros
        );
        $parcialCFueraFecha = $objDatAct->parcialCFueraFecha($parametros);
        $parcialCEnTiempo = $objDatAct->parcialCEnTiempo($parametros);
        $noIniciadasEnTiempo = $objDatAct->noIniciadasEnTiempo($parametros);
        $acumulado = $incumpSinIFueraFecha[0] + $parcialCFueraFecha[0]
            + $parcialCEnTiempo[0] + $noIniciadasEnTiempo[0];
        $proximoLunes = date('Y-m-d', strtotime('next monday'));
        $proximoDomingo = date(
            "Y-m-d", strtotime("+6 day", strtotime($proximoLunes))
        );
        $proximaSemana = $objDatAct->proximaSemana(
            $proximoLunes, $proximoDomingo, $parametros
        );
        $pronostico = $acumulado + $proximaSemana[0];
        $data = Array(
            array(
                "name"  => 'ISIFF',
                "y"     => (integer)$incumpSinIFueraFecha[0],
                "color" => '#FF5261',
                "text"  => 'Incumplidas sin iniciar fuera de fecha',
            ), array(
                "name"  => 'PCFF',
                "y"     => (integer)$parcialCFueraFecha[0],
                "color" => '#F6915C',
                "text"  => 'Parcialmente cumplidas fuera de fecha',
            ), array(
                "name"  => 'PCET',
                "y"     => (integer)$parcialCEnTiempo[0],
                "color" => '#F9E58B',
                "text"  => 'Parcialmente cumplidas y en tiempo',
            ), array(
                "name"  => 'NIET',
                "y"     => (integer)$noIniciadasEnTiempo[0],
                "color" => '#77C2F8',
                "text"  => 'No iniciadas y en tiempo',
            ), array(
                "name"  => 'AP',
                "y"     => $acumulado,
                "color" => '#959299',
                "text"  => 'Acumulado de pendientes',
            ), array(
                "name"  => 'ISE',
                "y"     => (integer)$proximaSemana[0],
                "color" => '#9394DF',
                "text"  => 'Inician la semana entrante',
            ), array(
                "name"  => 'PEASE',
                "y"     => $pronostico,
                "color" => '#72D572',
                "text"  => 'Pronostico de eventos activos para la semana entrante',
            )
        );
        return $data;
    }

    function cargarTipoTareaProy($parametros)
    {
        //Trabajo con el id-proy que me pasan por parametro.
        //busco sus tareas asociadas y el nomenclador
        $arrayTareas = array();
        self::getTareasProyecto($parametros->idproy, $arrayTareas, $parametros);

        //busco los tipos de tareas
        $objDatTarea = new DatTarea();
        $arrayTiposTarea = $objDatTarea->tipoNomenclador($parametros);

        $total = 0;
        $cont = 0;
        foreach ($arrayTiposTarea as $key => $value) {
            $tiempo = 0;
            $cantAct = 0; //Cantidad de actividades por tipo de act
            foreach ($arrayTareas as $valor) {
                if ($value['idnomenclador'] == $valor['idnomenclador']) {
                    $duracion = self::dias_transcurridos(
                            $valor['fechafin'], $valor['fechainicio']
                        ) + 1;
                    $horas = self::diferenciaHoras(
                        $valor['horainicio'], $valor['horafin']
                    );
                    $tiempo += $horas * $duracion;
                    $cantAct++;
                }
            }
            if ($parametros->peso == 1) {
                foreach ($arrayTareas as $valor) {
                    if ($value['idnomenclador'] == $valor['idnomenclador']) {
                        $tiempo += $valor['peso'];
                        $total += $valor['peso'];
                    }
                }
            }
            if ($cantAct > 0) {
                $data[$cont]['name'] = $value['dennomenclador'];
                $data[$cont]['y'] = $tiempo;
                $data[$cont]['act'] = $cantAct;
                $cont++;
            }
        }
        if ($parametros->peso == 1) {
            foreach ($data as $key => $valor) {
                $data[$key]['cant'] = $valor['y'];
                $data[$key]['y'] = ($valor['y'] * 100) / $total;
            }
        }
        return $data;
    }

    function cargarTipoTarea($parametros)
    {
        $objDatTarea = new DatTarea();
        $arrayTiposAct = $objDatTarea->tipoNomenclador($parametros);
        $total = 0;
        $cont = 0;
        foreach ($arrayTiposAct as $key => $value) {
            $tiempo = 0;
            $parametros->idnomenclador = $value['idnomenclador'];
            $arrayActPorTiposAct = $objDatTarea->tareasPorTipos($parametros);

            if (isset($arrayActPorTiposAct[0]['fechainicio'])) {
                foreach ($arrayActPorTiposAct as $valor) {
                    $duracion = self::dias_transcurridos(
                            $valor['fechafin'], $valor['fechainicio']
                        ) + 1;
                    $horas = self::diferenciaHoras(
                        $valor['horainicio'], $valor['horafin']
                    );
                    $tiempo += $horas * $duracion;
                }
            }
            if (isset($arrayActPorTiposAct[0]['peso'])) {
                foreach ($arrayActPorTiposAct as $valor) {
                    $tiempo += $valor['peso'];
                    $total += $valor['peso'];
                }
            }
            if (count($arrayActPorTiposAct) > 0) {
                $data[$cont]['name'] = $value['dennomenclador'];
                $data[$cont]['y'] = $tiempo;
                $data[$cont]['act'] = count($arrayActPorTiposAct);
                $cont++;
            }
        }
        if ($parametros->peso == 1) {
            foreach ($data as $key => $valor) {
                $data[$key]['cant'] = $valor['y'];
                $data[$key]['y'] = ($valor['y'] * 100) / $total;
            }
        }
        return $data;
    }

    function dias_transcurridos($fechaI, $fechaF)
    {
        $fechaI = explode('/', $fechaI);
        $fechaI = $fechaI[2] . '-' . $fechaI[1] . '-' . $fechaI[0];
        $fechaF = explode('/', $fechaF);
        $fechaF = $fechaF[2] . '-' . $fechaF[1] . '-' . $fechaF[0];
        $dias = (strtotime($fechaI) - strtotime($fechaF)) / 86400;
        $dias = floor($dias);
        return $dias;
    }

    function diferenciaHoras($hInicio, $hFin)
    {
        $dif = date(
            "H:i:s",
            strtotime("00:00:00") + strtotime($hFin) - strtotime($hInicio)
        );
        $arrayH = explode(':', $dif);
        $min = $arrayH[1] / 60; //que porciento representa de una hora
        $dif = $arrayH[0] + $min;
        return $dif;
    }

    /*
     * Tiempo planificado vs tiempo disponible de todas las acts
     * */
    function cargarTiempoPlanif($params)
    {
        $objDatTarea = new DatTarea();
        $params->eje = 1;
        $fechaI = date('01/01/Y');
        $fechaF = date('31/12/Y');
        if ($params->fechainicio != '') {
            $fechaI = $params->fechainicio;
        }
        if ($params->fechafin != '') {
            $fechaF = $params->fechafin;
        }
        $arrayTareas = $objDatTarea->actividadesPlanif(
            $params, $fechaI, $fechaF
        );
        //Si se selecciona el id proy, busco sus tareas relacionadas
        if ($params->idproy != '') {
            $arrayTareas = array();
            self::getTareasProyecto($params->idproy, $arrayTareas, $params);
        }
        $tiempoTotal = self::dias_transcurridos($fechaF, $fechaI) * 24;
        $tiempoPlanif = 0;
        foreach ($arrayTareas as $key => $value) {
            //Calcular la duracion de la actividad
            if ($value['fechainicio'] < $fechaI) {
                $fechaInicio = $fechaI;
            } else {
                $fechaInicio = $value['fechainicio'];
            }
            if ($value['fechafin'] > $fechaF) {
                $fechaFin = $fechaF;
            } else {
                $fechaFin = $value['fechafin'];
            }
            $duracion = self::dias_transcurridos(
                    $fechaFin, $fechaInicio
                ) + 1;
            $horas = self::diferenciaHoras(
                $value['horainicio'], $value['horafin']
            );
            $tiempoPlanif += $horas * $duracion;
        }
        $tiempoDisponible = round($tiempoTotal - $tiempoPlanif, 2);
        $porcientoLibre = round(($tiempoDisponible * 100) / $tiempoTotal, 2);
        $porcientoPlanif = round(($tiempoPlanif * 100) / $tiempoTotal, 2);
        $tiempoPlanif = round($tiempoPlanif, 2);
        $data = Array(
            array(
                "name"  => 'Tiempo total planificado',
                "cant"  => $tiempoPlanif,
                "y"     => $porcientoPlanif,
                "color" => '#72D572'
            ), array(
                "name"  => 'Tiempo disponible',
                "cant"  => $tiempoDisponible,
                "y"     => $porcientoLibre,
                "color" => '#FF5261'
            )
        );
        return $data;
    }

    /*
     * Carga la ejecucion(planificadas, cumplidas) de las actividades
     * de los planes despues que estos estan
     * en un estado determinado(puede ser Aporobacion)
     * */
    public function cargarEjecucion($params)
    {
        $objDatTarea = new DatTarea();
        $fechaI = date('01/01/Y');
        $fechaF = date('31/12/Y');
        if ($params->fechainicio != '') {
            $fechaI = $params->fechainicio;
        }
        if ($params->fechafin != '') {
            $fechaF = $params->fechafin;
        }
        $params->eje = 1;
        $arrayActHijas = $objDatTarea->actividadesPlanif(
            $params, $fechaI, $fechaF
        );
        //Si se selecciona el id proy, busco sus tareas relacionadas
        if ($params->idproy != '') {
            $arrayActHijas = array();
            self::getTareasProyecto($params->idproy, $arrayActHijas, $params);
        }
        if ($params->trimestre == 1) {
            $data = self::evolucionTrimestres($arrayActHijas);
        } elseif ($params->ejecucion == 1) {
            $data = self::ejecucion($arrayActHijas);
        } else {
            $data = self::evolucionMeses($arrayActHijas);
        }
        return $data;
    }

    public function evolucionTrimestres($arrayActHijas)
    {
        $arrayPlanificadas = array(0, 0, 0, 0);
        $arrayCumplidas = array(0, 0, 0, 0);
        //Recorro todas las acts hijas del plan para calculares sus valores
        foreach ($arrayActHijas as $k => $act) {
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/01/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/03/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[0]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[0]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/04/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('30/06/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[1]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[1]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/07/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/09/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[2]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[2]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/10/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/12/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[3]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[3]++;
                }
            }
        }
        //Acumulado de planificadas
        $arrayAcumuladoP[0] = $arrayPlanificadas[0];
        $arrayAcumuladoP[1] = $arrayAcumuladoP[0] + $arrayPlanificadas[1];
        $arrayAcumuladoP[2] = $arrayAcumuladoP[1] + $arrayPlanificadas[2];
        $arrayAcumuladoP[3] = $arrayAcumuladoP[2] + $arrayPlanificadas[3];
        //Acumulado de Cumplidas
        $arrayAcumuladoE[0] = $arrayCumplidas[0];
        $arrayAcumuladoE[1] = $arrayAcumuladoE[0] + $arrayCumplidas[1];
        $arrayAcumuladoE[2] = $arrayAcumuladoE[1] + $arrayCumplidas[2];
        $arrayAcumuladoE[3] = $arrayAcumuladoE[2] + $arrayCumplidas[3];
        $data = Array(
            array(
                "type"       => 'column',
                "name"       => 'Planificadas',
                "color"      => '#72D572',
                "data"       => $arrayPlanificadas,
                "shadow"     => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                )
            ), array(
                "type"       => 'column',
                "name"       => 'Cumplidas',
                "color"      => '#FF5261',
                "data"       => $arrayCumplidas,
                "shadow"     => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                ),
            ),
            array(
                "type"       => 'spline',
                "name"       => 'Acumulado de planificadas',
                "color"      => '#72D572',
                "data"       => $arrayAcumuladoP,
                "shadow"     => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                )
            ), array(
                "type"       => 'spline',
                "name"       => 'Acumulado de cumplidas',
                "color"      => '#FF5261',
                "data"       => $arrayAcumuladoE,
                "shadow"     => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                ),
            )
        );
        return $data;
    }


    public function ejecucion($arrayActHijas)
    {
        //Recorro todas las acts hijas del plan para calculares sus valores
        $arrayPlanificadas = array(0, 0, 0);
        $arrayPlanificadas[0] = count($arrayActHijas);//total
        $arrayCumplidas = array(0, 0, 0);
        foreach ($arrayActHijas as $k => $act) {
            if ($act['gradocumplimiento'] == 100) {
                $arrayCumplidas[0]++;
            }
            //Ultimo mes
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/m/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/m/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[1]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[1]++;
                }
            }
            //ultima semana
            if (date('D') == 'Mon') {
                $esteL = date('Y-m-d');
            } else {
                $esteL = date('Y-m-d', strtotime('last monday'));
            }
            $esteD = date(
                'Y-m-d', strtotime('+6 day', strtotime($esteL))
            );
            $esteLunes = date('d/m/Y', strtotime($esteL));
            $esteDomingo = date('d/m/Y', strtotime($esteD));

            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], $esteLunes
            );
            $tiempo2 = self::dias_transcurridos(
                $esteDomingo, $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[2]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[2]++;
                }
            }
        }
        $data = Array(
            array(
                "name"  => 'Planificadas',
                "color" => '#72D572',
                "data"  => $arrayPlanificadas
            ), array(
                "name"  => 'Cumplidas',
                "color" => '#FF5261',
                "data"  => $arrayCumplidas
            )
        );
        return $data;
    }

    public function evolucionMeses($arrayActHijas)
    {
        $arrayPlanificadas = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        $arrayCumplidas = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        //Recorro todas las acts hijas del plan para calculares sus valores
        foreach ($arrayActHijas as $k => $act) {
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/01/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/01/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[0]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[0]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/02/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('29/02/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[1]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[1]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/03/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/03/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[2]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[2]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/04/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('30/04/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[3]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[3]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/05/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/05/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[4]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[4]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/06/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('30/06/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[5]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[5]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/07/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/07/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[6]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[6]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/08/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/08/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[7]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[7]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/09/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('30/09/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[8]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[8]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/10/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/10/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[9]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[9]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/11/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('30/11/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[10]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[10]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/12/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/12/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $arrayPlanificadas[11]++;
                if ($act['gradocumplimiento'] == 100) {
                    $arrayCumplidas[11]++;
                }
            }
        }
        //Acumulado de planificadas
        $acumuladoP[0] = $arrayPlanificadas[0];
        for ($k = 1; $k < 12; $k++) {
            $acumuladoP[$k] = $acumuladoP[$k - 1] + $arrayPlanificadas[$k];
        }
        //Acumulado de Cumplidas
        $acumuladoE[0] = $arrayCumplidas[0];
        for ($k = 1; $k < 12; $k++) {
            $acumuladoE[$k] = $acumuladoE[$k - 1] + $arrayCumplidas[$k];
        }
        $data = Array(
            array(
                "type"       => 'column',
                "name"       => 'Planificadas',
                "color"      => '#72D572',
                "data"       => $arrayPlanificadas,
                "shadow"     => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                )
            ), array(
                "type"       => 'column',
                "name"       => 'Cumplidas',
                "color"      => '#FF5261',
                "data"       => $arrayCumplidas,
                "shadow"     => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                ),
            ),
            array(
                "type"       => 'spline',
                "name"       => 'Acumulado de planificadas',
                "color"      => '#72D572',
                "data"       => $acumuladoP,
                "shadow"     => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                )
            ), array(
                "type"       => 'spline',
                "name"       => 'Acumulado de cumplidas',
                "color"      => '#FF5261',
                "data"       => $acumuladoE,
                "shadow"     => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                ),
            )
        );
        return $data;
    }

    function cargarCalidadProy($params)
    {
        //Trabajo con el id-proy que me pasan por parametro.
        //busco sus tareas asociadas y el nomenclador
        $arrayTareas = array();
        self::getTareasProyecto($params->idproy, $arrayTareas, $params);
        //busco los criterios de evaluacion
        $objDatTarea = new DatTarea();
        $arrayEvalTarea = $objDatTarea->tipoNomenclador($params);
        $total = 0;
        $cont = 0;
        foreach ($arrayEvalTarea as $key => $value) {
            foreach ($arrayTareas as $tarea) {
                if ($value['idnomenclador'] == $tarea['idnomenclador']) {
                    $data[$cont]['name'] = $value['dennomenclador'];
                    if ($params->peso == 1) {
                        $data[$cont]['cant'] += $tarea['peso'];
                        $total += $tarea['peso'];
                    } else {
                        $data[$cont]['cant']++;
                        $total++;
                    }
                }
            }
            if ($data[$cont]['cant'] > 0) {
                $cont++;
            }
        }
        foreach ($data as $key => $valor) {
            $data[$key]['y'] = ($valor['cant'] * 100) / $total;
        }
        return $data;
    }

    function cargarCalidad($params)
    {
        $objDatTarea = new DatTarea();
        $arrayEval = $objDatTarea->tipoNomenclador($params);
        $total = 0;
        foreach ($arrayEval as $key => $value) {
            $params->idnomenclador = $value['idnomenclador'];
            $arrayActPorEval = $objDatTarea->tareasPorTipos($params);
            $data[$key]['name'] = $value['dennomenclador'];
            if ($params->peso == 1) {
                foreach ($arrayActPorEval as $eval) {
                    $data[$key]['cant'] += $eval['peso'];
                }
                $total += $data[$key]['cant'];
            } else {
                $data[$key]['cant'] = count($arrayActPorEval);
                $total += count($arrayActPorEval);
            }
        }
        foreach ($data as $key => $valor) {
            $data[$key]['y'] = ($valor['cant'] * 100) / $total;
        }
        return $data;
    }

    function cargarCalidadTriProy($params)
    {
        //Trabajo con el id-proy que me pasan por parametro.
        //busco sus tareas asociadas y el nomenclador
        $arrayTareas = array();
        self::getTareasProyecto($params->idproy, $arrayTareas, $params);
        //busco los criterios de evaluacion
        $objDatTarea = new DatTarea();
        $arrayEvalTarea = $objDatTarea->tipoNomenclador($params);
        $total = 0;
        $cont = 0;
        foreach ($arrayEvalTarea as $value) {
            $arrayCriterio = array(0, 0, 0, 0);
            $catidad = 0;
            foreach ($arrayTareas as $tarea) {
                if ($value['idnomenclador'] == $tarea['idnomenclador']) {
                    //--1er Trimestre
                    $tiempo1 = self::dias_transcurridos(
                        $tarea['fechainicio'], date('01/01/Y')
                    );
                    $tiempo2 = self::dias_transcurridos(
                        date('31/03/Y'), $tarea['fechainicio']
                    );
                    if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                        $arrayCriterio[0]++;
                    }
                    //--2do Trimestre
                    $tiempo1 = self::dias_transcurridos(
                        $tarea['fechainicio'], date('01/04/Y')
                    );
                    $tiempo2 = self::dias_transcurridos(
                        date('30/06/Y'), $tarea['fechainicio']
                    );
                    if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                        $arrayCriterio[1]++;
                    }
                    //--3er Trimestre
                    $tiempo1 = self::dias_transcurridos(
                        $tarea['fechainicio'], date('01/07/Y')
                    );
                    $tiempo2 = self::dias_transcurridos(
                        date('31/09/Y'), $tarea['fechainicio']
                    );
                    if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                        $arrayCriterio[2]++;
                    }
                    //--4to Trimestre
                    $tiempo1 = self::dias_transcurridos(
                        $tarea['fechainicio'], date('01/10/Y')
                    );
                    $tiempo2 = self::dias_transcurridos(
                        date('31/12/Y'), $tarea['fechainicio']
                    );
                    if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                        $arrayCriterio[3]++;
                    }
                    $catidad++;
                }
            }
            if ($catidad > 0) {
                //--Acumulado
                $arrayAcumulado[0] = $arrayCriterio[0];
                $arrayAcumulado[1] = $arrayAcumulado[0] + $arrayCriterio[1];
                $arrayAcumulado[2] = $arrayAcumulado[1] + $arrayCriterio[2];
                $arrayAcumulado[3] = $arrayAcumulado[2] + $arrayCriterio[3];
                //--data
                $data[$cont]['type'] = 'column';
                $data[$cont]['name'] = $value['dennomenclador'];
                $data[$cont]['data'] = $arrayCriterio;
                $data[$cont]['shadow'] = true;
                $data[$cont]['dataLabels'] = array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                );
                $cont++;
                $data[$cont]['type'] = 'spline';
                $data[$cont]['name'] = 'Acumulado de '
                    . $value['dennomenclador'];
                $data[$cont]['data'] = $arrayAcumulado;
                $data[$cont]['shadow'] = true;
                $data[$cont]['dataLabels'] = array(
                    "enabled" => true,
                    "format"  => '{point.y}'
                );
                $cont++;
            }
        }
        return $data;
    }

    function cargarCalidadTri($params)
    {
        $objDatTarea = new DatTarea();
        $arrayEval = $objDatTarea->tipoNomenclador($params);
        $cont = 0;
        foreach ($arrayEval as $key => $value) {
            $params->idnomenclador = $value['idnomenclador'];
            $arrayTareaPorEval = $objDatTarea->tareasPorTipos($params);
            $arrayCriterio = array(0, 0, 0, 0);
            foreach ($arrayTareaPorEval as $k => $tarea) {
                //--1er Trimestre
                $tiempo1 = self::dias_transcurridos(
                    $tarea['fechainicio'], date('01/01/Y')
                );
                $tiempo2 = self::dias_transcurridos(
                    date('31/03/Y'), $tarea['fechainicio']
                );
                if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                    $arrayCriterio[0]++;
                }
                //--2do Trimestre
                $tiempo1 = self::dias_transcurridos(
                    $tarea['fechainicio'], date('01/04/Y')
                );
                $tiempo2 = self::dias_transcurridos(
                    date('30/06/Y'), $tarea['fechainicio']
                );
                if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                    $arrayCriterio[1]++;
                }
                //--3er Trimestre
                $tiempo1 = self::dias_transcurridos(
                    $tarea['fechainicio'], date('01/07/Y')
                );
                $tiempo2 = self::dias_transcurridos(
                    date('31/09/Y'), $tarea['fechainicio']
                );
                if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                    $arrayCriterio[2]++;
                }
                //--4to Trimestre
                $tiempo1 = self::dias_transcurridos(
                    $tarea['fechainicio'], date('01/10/Y')
                );
                $tiempo2 = self::dias_transcurridos(
                    date('31/12/Y'), $tarea['fechainicio']
                );
                if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                    $arrayCriterio[3]++;
                }
            }
            //--Acumulado
            $arrayAcumulado[0] = $arrayCriterio[0];
            $arrayAcumulado[1] = $arrayAcumulado[0] + $arrayCriterio[1];
            $arrayAcumulado[2] = $arrayAcumulado[1] + $arrayCriterio[2];
            $arrayAcumulado[3] = $arrayAcumulado[2] + $arrayCriterio[3];
            //--data
            $data[$cont]['type'] = 'column';
            $data[$cont]['name'] = $value['dennomenclador'];
            $data[$cont]['data'] = $arrayCriterio;
            $data[$cont]['shadow'] = true;
            $data[$cont]['dataLabels'] = array(
                "enabled" => true,
                "format"  => '{point.y}'
            );
            $cont++;
            $data[$cont]['type'] = 'spline';
            $data[$cont]['name'] = 'Acumulado de ' . $value['dennomenclador'];
            $data[$cont]['data'] = $arrayAcumulado;
            $data[$cont]['shadow'] = true;
            $data[$cont]['dataLabels'] = array(
                "enabled" => true,
                "format"  => '{point.y}'
            );
            $cont++;
        }
        return $data;
    }


}


