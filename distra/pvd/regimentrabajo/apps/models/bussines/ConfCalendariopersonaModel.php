<?php

class ConfCalendariopersonaModel extends ZendExt_Model
{
    protected $confCalendariopersona;

    function __construct()
    {
        $this->confCalendariopersona = new ConfCalendariopersona();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
//        $this->confCalendario = new ConfCalendario();
    }

    public function saveCalendarioPersona($idtipodedia, $idgrupodescanso, $dates, $turnotrabajo)
    {
        $personascargo = array();
        $idpersonascargos = $this->getIdpersonasByIdgrupodescanso($idgrupodescanso);
        foreach($idpersonascargos as $v){
            $personascargo[$v['idpersona'].'-'.$v['idcargo']] = $v;
        }
        $deletePlanif = $this->deleteCalendarioPerByGrupodescanso($idgrupodescanso, $dates);
        if ($deletePlanif)
            return $this->planificarByIdpersonas($idtipodedia, $dates, $turnotrabajo, $personascargo);
        else
            return false;
    }

    public function deleteCalendarioPerByGrupodescanso($idgrupodescanso, $dates)
    {
        $idpersonascargos = $this->getIdpersonasByIdgrupodescanso($idgrupodescanso);
        $datDiaferiadohabilitado = new DatDiaferiadohabilitado();
        $datDiaferiadohabilitado->delDiasFeriadosHabByIdpersonas($idpersonascargos,$dates);
        return $this->deleteCelendarioPerByIdpersona($dates, $idpersonascargos);
    }

    public function deleteByIdgrupodescansoYear($idgrupodescanso, $year)
    {
        $idpersonascargos = $this->getIdpersonasByIdgrupodescanso($idgrupodescanso);
        return $this->confCalendariopersona->DelByIdgrupodescansoYear($idpersonascargos, $year);
    }

    public function deleteOnlyCalPersonaByIdpersYear($idpersona, $idgrupodescanso, $year)
    {
        return $this->confCalendariopersona->deleteOnlyCalPersonaByIdpersYear($idpersona, $idgrupodescanso, $year);
    }

    /**
     * @param $idgrupodescanso
     * @return array
     */
    public function getIdpersonasByIdgrupodescanso($idgrupodescanso)
    {
        $idpersonas = $this->confCalendariopersona->getPersonasByIdgrupodescanso($idgrupodescanso);
        return $idpersonas;
    }

    public function saveCalendarioPersonasMasivo($idpersonas, $idgrupodescanso, $fdesde)
    {
        $f = explode('/', $fdesde);
        $fechaHasta = '31/12/' . date('Y');
        $confCalend = new ConfCalendario();
        $calendario = $confCalend->getCalendarioByFdesde($fdesde, $idgrupodescanso, false);
        $filas = array();
        // $fechas = array();
        if (count($calendario) > 0) {
            foreach ($calendario as $index => $cal) {
                foreach ($idpersonas as $index => $idpersona) {
                    //array_push($fechas, $cal['fecha']);
                    $date = $cal['fecha'];
                    $turnotrabajo = $cal['idturnotrabajo'] ? $cal['idturnotrabajo'] : "NULL::numeric";
                    $horasTrabajo = $cal['horas'] ? $cal['horas'] : "NULL::timestamp";
                    $idtipodedia = $cal['idtipodedia'];
                    if($cal['horas'])
                        array_push($filas, "(CAST('" . $date . "' as date), " . $turnotrabajo . ", " . $idpersona['idpersona'] . ", '" . $horasTrabajo . "', " . $idtipodedia . "," . $idpersona['idcargo'] . ")");
                    else
                        array_push($filas, "(CAST('" . $date . "' as date), " . $turnotrabajo . ", " . $idpersona['idpersona'] . ", " . $horasTrabajo . ", " . $idtipodedia . "," . $idpersona['idcargo'] . ")");
                }
            }
        }
        if ($idpersonas > 0) {
            $resDelete = $this->deleteCelendarioPerByIdpersonaFDesde($fdesde, $idpersonas);
        }

        if ($resDelete) {
            $res = $this->confCalendariopersona->saveCalendarioPersona($filas);
        }
        // return true;
        return ($resDelete && $res);
    }

    /**
     * @param $dates
     * @param $idpersonas
     * @return bool
     * @throws Doctrine_Connection_Exception
     * @throws Doctrine_Record_Exception
     */
    public function deleteCelendarioPerByIdpersona($dates, $idpersonascargos)
    {
        return $this->confCalendariopersona->deleteByIdpersonasFechas($idpersonascargos, $dates);
    }

    public function deleteCelendarioPerByIdpersonaFDesde($fdesde, $idpersonascargos)
    {
        return $this->confCalendariopersona->deleteByIdpersonasFDesde($idpersonascargos, $fdesde);
    }

    public function deleteCelendarioPerByIdpersonaAndCargo($dates, $idpersonascargos)
    {
        return $this->confCalendariopersona->deleteByIdpersonasFechasAndCargo($idpersonascargos, $dates);
    }

    public function getCalendarioByIdpersonas($idpersonas, $year, $idcargo)
    {
        return $this->confCalendariopersona->getCalendarioByIdpersonas($idpersonas, $year, $idcargo);
    }

    public function saveCalendarioByIdpersonas($idtipodedia, $dates, $turnotrabajo, $idpersonascargos)
    {
        $deletePlanif = $this->deleteCelendarioPerByIdpersonaAndCargo($dates, $idpersonascargos);
        $datDiaferiadohabilitado = new DatDiaferiadohabilitado();
        $datDiaferiadohabilitado->delDiasFeriadosHabByIdpersonas($idpersonascargos,$dates);
        if ($deletePlanif)
            return $this->planificarByIdpersonas($idtipodedia, $dates, $turnotrabajo, $idpersonascargos);
        else
            return false;
    }

    /**
     * @param $idtipodedia
     * @param $dates
     * @param $turnotrabajo
     * @param $deletePlanif
     * @param $idpersonas
     * @return bool
     */
    public function planificarByIdpersonas($idtipodedia, $dates, $turnotrabajo, $idpersonascargos)
    {
        if (count($idpersonascargos) > 0) {
            $idpersonas = $this->confCalendariopersona->getArrayColumn($idpersonascargos, 'idpersona');
            //$idpersonas = array_unique($idspersonas);
            $idcargos = $this->confCalendariopersona->getArrayColumn($idpersonascargos, 'idcargo');
            //$idcargos = array_unique($idscargos);
            $filas = array();
            $calendario = new ConfCalendarioModel();
            foreach ($dates as $d => $date) {
                $horasTrabajo = $calendario->getHorasTrabajo($date, $turnotrabajo);
                foreach ($idpersonas as $p => $idpersona) {
                    $ttrabajo = " null::int";
                    if (!empty($turnotrabajo))
                        $ttrabajo = $turnotrabajo;
                    if (!empty($idcargos[$p]))
                        array_push($filas, "(CAST('" . $date . "' as date), " . $ttrabajo . ", " . $idpersona . ", '" . $horasTrabajo . "', " . $idtipodedia . ", " . $idcargos[$p] . ")");

                }
            }
            return $this->confCalendariopersona->saveCalendarioPersona($filas);
        } else {
            return true;
        }
    }

    public function getDiasFeriados($idspersona, $annoactual)
    {
        $fdesde = '01/01/' . $annoactual;
        $fhasta = '31/12/' . $annoactual;

        if (!empty($idspersona)) {
            $DiasFeriados = ConfCalendariopersona::getDiasFeriadosByIdpersona($fdesde, $fhasta, $idspersona);
        }
        $array = array();
        foreach ($DiasFeriados as $key => $dia) {
            $array[$key]['fecha'] = $dia['fecha'];
        }
        return $array;
    }

}