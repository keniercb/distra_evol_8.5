<?php

class ConfCalendarioModel extends ZendExt_Model
{
    protected $confCalendario;

    function __construct()
    {
        $this->confCalendario = new ConfCalendario();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->confCalendario = new ConfCalendario();
    }

    public function Insertar($tipodia, $grupodescanso, $fechas, $idturnotrabajo)
    {
        try {
            $calendar = $this->confCalendario->DelFechasGrupoExisten($grupodescanso, $fechas);
            $turno = new NomTurnotrabajo();
            $datAsistenciaModel = new DatAsistenciaModel();
            $turnotrabajo = $turno->getHorariodelTurno($idturnotrabajo);
            $filas = array();
            foreach ($fechas as $key => $fecha) {
                $f = explode('/', $fecha);
                $horaini = explode(':', $turnotrabajo[0]['horainicio']);
                $horainicio = new DateTime(date('Y-m-d H:i:s', mktime($horaini[0], $horaini[1], 0, $f[1], $f[0], $f[2])));
                if ($turnotrabajo[0]['otrodia'] == 1) {
                    $f2 = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
                    $fechsalturno = date_add($f2, date_interval_create_from_date_string('1 day'));
                    $FIT = explode('/', $f2->format('d/m/Y'));
                    $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                    $ff = explode('/', $fechsalturno->format('d/m/Y'));
                } else {
                    $ff = $f;
                }
                $horaf = explode(':', $turnotrabajo[0]['horafin']);
                $horafin = new DateTime(date('Y-m-d H:i:s', mktime($horaf[0], $horaf[1], 0, $ff[1], $ff[0], $ff[2])));
                $horasdifftt = date_diff($horainicio, $horafin);
                $hlab = $horasdifftt->h . ':' . $horasdifftt->i . ':' . $horasdifftt->s;
                if ($turnotrabajo[0]['otrodia'] == 1 && $hlab == '0:0:0') {
                    $horas = $datAsistenciaModel->RestOnlyTime('24:00:00', $turnotrabajo[0]['tiempodescanso']);
                } else {
                    $horas = $datAsistenciaModel->RestOnlyTime($hlab, $turnotrabajo[0]['tiempodescanso']);
                }
                if (!empty($idturnotrabajo))
                    array_push($filas, "(CAST('" . $fecha . "' as date), " . $tipodia . ", " . $grupodescanso . ", '" . $horas . "', " . $idturnotrabajo . ")");
                else
                    array_push($filas, "(CAST('" . $fecha . "' as date), " . $tipodia . ", " . $grupodescanso . ", '" . $horas . "', null::int)");
            }
            $this->confCalendario->insertPlanifMasiva($filas);
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getHorasTrabajo($fecha, $idturnotrabajo)
    {
        $turno = new NomTurnotrabajo();
        $datAsistenciaModel = new DatAsistenciaModel();
        $turnotrabajo = $turno->getHorariodelTurno($idturnotrabajo);
        $f = explode('/', $fecha);
        $horaini = explode(':', $turnotrabajo[0]['horainicio']);
        $horainicio = new DateTime(date('Y-m-d H:i:s', mktime($horaini[0], $horaini[1], 0, $f[1], $f[0], $f[2])));
        if ($turnotrabajo[0]['otrodia'] == 1) {
            $f2 = date_create($f[2] . '-' . $f[1] . '-' . $f[0]);
            $fechsalturno = date_add($f2, date_interval_create_from_date_string('1 day'));
            $FIT = explode('/', $f2->format('d/m/Y'));
            $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
            $ff = explode('/', $fechsalturno->format('d/m/Y'));
        } else {
            $ff = $f;
        }
        $horaf = explode(':', $turnotrabajo[0]['horafin']);
        $horafin = new DateTime(date('Y-m-d H:i:s', mktime($horaf[0], $horaf[1], 0, $ff[1], $ff[0], $ff[2])));
        $horasdifftt = date_diff($horainicio, $horafin);
        $hlab = $horasdifftt->h . ':' . $horasdifftt->i . ':' . $horasdifftt->s;
        if ($turnotrabajo[0]['otrodia'] == 1 && $hlab == '0:0:0') {
            $horas = $datAsistenciaModel->RestOnlyTime('24:00:00', $turnotrabajo[0]['tiempodescanso']);
        } else {
            $horas = $datAsistenciaModel->RestOnlyTime($hlab, $turnotrabajo[0]['tiempodescanso']);
        }
        return $horas;
    }

    public function Actualizar(ConfCalendario $ConfCalendario)
    {
        $ConfCalendario->save();
    }

    public function Eliminar($arrfechas, $arridgrupodescanso)
    {
        try {
            $this->confCalendario->DelFechasGrupos($arridgrupodescanso, $arrfechas);
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getByGrupodescansoLimit($idgrupodescanso, $year, $limit, $start)
    {

        try {
            $data = $this->confCalendario->GetPorLimite($idgrupodescanso, $year, $limit, $start);
            return $data;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function GetAll()
    {
        $tipodia = new ConfCalendario();
        return $tipodia->GetTodos();
    }

    public function GetByLimitFind($criterio, $limit, $start)
    {
        $tipodia = new ConfCalendario();
        return $tipodia->GetByLimitFind($criterio, $limit, $start);
    }

    public function GetAllFind($criterio)
    {
        $tipodia = new ConfCalendario();
        return $tipodia->GetAllFind($criterio);
    }

    public function Existe($idgrupodescanso)
    {
        $confcalend = Doctrine::getTable('ConfCalendario')->findBy('idgrupodescanso', $idgrupodescanso);
        return $confcalend;
    }

    public function GetHrsByDateRange($fdesde, $fhasta, $idgrupo)
    {
        $hrs = $this->confCalendario->HrsByDateRange($fdesde, $fhasta, $idgrupo);
        return $hrs;
    }

    public function EliminarByIdgrupodescanso($idgrupodescanso, $year)
    {
        $tipodia = new ConfCalendario();
        return $tipodia->DelByIdgrupodescanso($idgrupodescanso, $year);
    }

    public function guardarPeriodos($arreglo)
    {
        try {
            foreach ($arreglo as $key => $value) {
                $DatPeriodomes = new DatPeriodomes();
                if ($DatPeriodomes->getPeriodoMes($value->mes, $value->anno) != null) {
                    $result[] = DatPeriodomes:: eliminarPeriodo($value->mes, $value->anno);
                }
                $DatPeriodomes->fdesde = $value->fdesde;
                $DatPeriodomes->fhasta = $value->fhasta;
                $DatPeriodomes->mes = $value->mes;
                $DatPeriodomes->anno = $value->anno;
                $DatPeriodomes->save();
            }
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function guardarPeriodosQuincenal($arreglo)
    {
        try {
            foreach ($arreglo as $key => $value) {
                $DatPeriodomes = new DatPeriodoquincena();
                if ($DatPeriodomes->getPeriodoQuincenal($value->mes, $value->anno) != null) {
                    $result[] = DatPeriodoquincena:: eliminarPeriodo($value->mes, $value->anno);
                }
                $DatPeriodomes->fdesdeprimquincena = $value->fdesdeprimquincena;
                $DatPeriodomes->fdesdesegquincena = $value->fdesdesegquincena;
                $DatPeriodomes->fhastaprimquincena = $value->fhastaprimquincena;
                $DatPeriodomes->fhastasegquincena = $value->fhastasegquincena;
                $DatPeriodomes->mes = $value->mes;
                $DatPeriodomes->anno = $value->anno;
                $DatPeriodomes->save();
            }
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDiasFeriados($idgrupodescanso, $annoactual)
    {
        $annoanterior = $annoactual-1;
        $fdesde = '01/12/' . $annoanterior;
        $fhasta = '31/12/' . $annoactual;

        if (!empty($idgrupodescanso)) {
            $Model = new NomGrupodescansoModel();
            $idspersona = array();
            $ids = NomGrupodescanso::getpersonasByIdsGrupoDescanso(array($idgrupodescanso));
            if (!empty($ids)) {
                foreach ($ids as $ind => $idpersona) {
                    array_push($idspersona, $idpersona['idpersona']);
                }
                $DiasFeriados = ConfCalendariopersona::getDiasFeriadosByIdpersona($fdesde, $fhasta, $idspersona);
            }
        } else {
            $DiasFeriados = ConfCalendario::getDiasFeriados($fdesde, $fhasta);
        }
        $array = array();
        if (!empty($DiasFeriados)) {
            foreach ($DiasFeriados as $key => $dia) {
                $array[$key]['fecha'] = $dia['fecha'];
            }
        }
        return $array;
    }

    public function getDiasFeriadosHabilitados($idspersona)
    {
        $DiasFeriados = ConfCalendario::getDiasFeriadosHabilitados($idspersona);
        return $DiasFeriados;
    }

    public function guardarDiasFeriadosHabiles($fechashoras, $datos, $tipo)
    {
        try {
            $idspersona = array();
            if ($tipo == 2) {
                $ids = NomGrupodescanso::getpersonasByIdsGrupoDescanso($datos[0]);
                foreach ($ids as $ind => $idpersona) {
                    array_push($idspersona, $idpersona['idpersona']);
                }
            } else {
                $idspersona = $datos[0];
            }
            $sql = array();
            foreach ($idspersona as $ind => $idpersona) {
                foreach ($fechashoras as $key => $fechahora) {
                    //array_push($sql,"(cast('".$fechahora->fecha."' as date),".$idpersona.",'".$fechahora->horas."')");
                    array_push($sql, "(cast('" . $fechahora->fecha . "' as date)," . $idpersona . ",null)");
                }
            }
            $calendar = new ConfCalendario();

            $calendar->Insert($sql);
            return true;
        } catch (Exception $e) {
            throw $e;
        }

    }

    public function delDiasFeriadosHabiles($datos, $tipo, $fechas)
    {
        $arrfechas = array();
        foreach ($fechas as $key => $fecha) {
            array_push($arrfechas, "'" . $fecha . "'");
        }
        $idspersona = array();
        if ($tipo == 2) {
            $ids = NomGrupodescanso::getpersonasByIdsGrupoDescanso($datos[0]);
            foreach ($ids as $ind => $idpersona) {
                array_push($idspersona, $idpersona['idpersona']);
            }
        } else {
            $idspersona = $datos[0];
        }
        $tipodia = new ConfCalendario();
        return $tipodia->delDiasFeriadosHabiles($idspersona, $arrfechas);
    }

    public function planificarTurnosRotativos($grupos, $turnos, $desde, $hasta, $horainicio, $horafin, $rotate, $otrodia)
    {
        $fd = explode('/', $desde);
        $fh = explode('/', $hasta);

        $fdesde = new DateTime($fd[2] . '-' . $fd[1] . '-' . $fd[0]);
        $fhasta = new DateTime($fh[2] . '-' . $fh[1] . '-' . $fh[0]);
        $dias = $fdesde->diff($fhasta)->days + 1;

        /*$horas = array();
        $fecha1 = new DateTime('2000-01-01');
        $fecha2 = new DateTime('2000-01-01');
        foreach ($horainicio as $key => $hora) {
            if ($otrodia[$key] == 1) {
                $fecha2 = new DateTime('2000-01-02');
            }
            $hi = explode(':', $horainicio[$key]);
            $hf = explode(':', $horafin[$key]);

            $fecha1->setTime($hi[0], $hi[1], 0);
            $fecha2->setTime($hf[0], $hf[1], 0);
            //$fecha2->add()

            $diff = $fecha2->diff($fecha1);
            $horasByDia = 0;
            if ($diff->d > 0)
                $horasByDia = $diff->d * 24;
            $h = ($diff->h + $horasByDia < 10) ? '0' . $diff->h + $horasByDia : $diff->h + $horasByDia;
            $i = ($diff->i < 10) ? '0' . $diff->i : $diff->i;
            $s = ($diff->s < 10) ? '0' . $diff->s : $diff->s;
            array_push($horas, $h . ':' . $i . ':' . $s);
        }*/
        $horas = array();
        foreach ($turnos as $key => $turno) {
            $horasTrabajo = $this->getHorasTrabajo($desde, $turno);
            array_push($horas, $horasTrabajo);
        }

        $confCalenPersona = new ConfCalendariopersonaModel();
        $personascargoGrupo = array();
        $idperscargoEliminar = array();
        foreach ($grupos as $index => $grupo) {
            $personascargoGrupo[$grupo] = $confCalenPersona->getIdpersonasByIdgrupodescanso($grupo);
            if ($index > 0) {
                $idperscargoEliminar = array_merge($idperscargoEliminar, $personascargoGrupo[$grupo]);
            } else {
                $idperscargoEliminar = $personascargoGrupo[$grupo];
            }
        }

        $planificacion = array();
        $planificacionPersona = array();
        $dates = array();
        $fechas = array();
        array_push($dates, "'" . $fdesde->format('d/m/Y') . "'");
        array_push($fechas, "CAST('" . $fdesde->format('d/m/Y') . "' as date)");
        $contg = 0;
        $contt = 0;
        $contp = 0;
        $GruposPlanificados = array();

        for ($i = 0; $i < $dias * count($turnos); $i++) {
            array_push($GruposPlanificados, $grupos[$contg]);
            array_push($planificacion, "(CAST('" . $fdesde->format('d/m/Y') . "' as date), 3, " . $grupos[$contg] . ", CAST('" . $horas[$contt] . "' as time), " . $turnos[$contt] . ")");

            foreach ($personascargoGrupo[$grupos[$contg]] as $k => $personacargogrupo) {
                array_push($planificacionPersona, "(CAST('" . $fdesde->format('d/m/Y') . "' as date), " . $turnos[$contt] . ", " . $personacargogrupo['idpersona'] . ", '" . $horas[$contt] . "', 3, " . $personacargogrupo['idcargo'] . ")");
            }

//            if($rotate == 1 && $contg == count($grupos) -1){
//                $firstGroup = array_shift($grupos);
//                array_push($grupos, $firstGroup);
//            }

            if ($rotate == 1 && ($contg == count($grupos) - 1 || $contt == count($turnos) - 1)) {
                $lastGroup = array_pop($grupos);
                array_unshift($grupos, $lastGroup);
            }

            if ($contg == count($grupos) - 1 || $contt == count($turnos) - 1) {
                $contg = 0;
            } else {
                $contg++;
            }

            if ($contt == count($turnos) - 1) {
                $gruposNoTrabajan = array_diff($grupos, $GruposPlanificados);
                foreach ($gruposNoTrabajan as $index => $item) {
                    array_push($planificacion, "(CAST('" . $fdesde->format('d/m/Y') . "' as date), 4, " . $item . ", null::time, null::numeric)");
                    foreach ($personascargoGrupo[$item] as $index => $pgnt) {
                        array_push($planificacionPersona, "(CAST('" . $fdesde->format('d/m/Y') . "' as date),null::numeric, " . $pgnt['idpersona'] . ",  null::time, 4, " . $pgnt['idcargo'] . ")");

                    }
                }
                $GruposPlanificados = array();
                $gruposNoTrabajan = array();
                $contt = 0;
                $fdesde = $fdesde->add(new DateInterval('P1D'));
                array_push($dates, "'" . $fdesde->format('d/m/Y') . "'");
                array_push($fechas, "CAST('" . $fdesde->format('d/m/Y') . "' as date)");
            } else {
                $contt++;
            }
            $contp++;
        }
        $delCal = $this->Eliminar($dates, $grupos);
        $CC = new ConfCalendario();
        $resPM = $CC->insertPlanifMasiva($planificacion);
        $CP = new ConfCalendariopersona();
        $resDelCal = $CP->delByIdpersonasFechas($idperscargoEliminar, $fechas);
        $resCP = $CP->saveCalendarioPersona($planificacionPersona);
        return ($resPM && $resCP && $resDelCal);
    }

}