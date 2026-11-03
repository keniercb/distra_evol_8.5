<?php

class DatApaModel extends ZendExt_Model
{
    protected $DatApa;

    function __construct()
    {
        $this->DatApa = new DatApa();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->DatApa = new DatApa();
    }

    public function Insertar($tipodia, $grupodescanso, $fechas)
    {
        try {
            $calendar = $this->DatApa->DelFechasGrupoExisten($grupodescanso, $fechas);
            $calendario = new Doctrine_Collection('DatApa');
            foreach ($fechas as $key => $fecha) {
                $calendario[$key]->fecha = $fecha;
                $calendario[$key]->idgrupodescanso = $grupodescanso;
                $calendario[$key]->idtipodedia = $tipodia;
            }
            $calendario->save();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function Actualizar(DatApa $DatApa)
    {
        $DatApa->save();
    }

    public function Eliminar($arrfechas, $idgrupodescanso)
    {
        try {
            $dates = array();
            foreach ($arrfechas as $key => $fecha) {
                $dates[$key] = "'" . $fecha . "'";
            }
            $calendariocollection = Doctrine::getTable('DatApa')->findByDql('idgrupodescanso = ' . $idgrupodescanso . ' and fecha in (' . implode(',', $dates) . ')');
            $calendariocollection->delete();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /***********************************************************************************************************/
    /*                REVISAR ESTE METODO CON DATOS A VER QUE DEVUELVE Y OPTIMIZAR LA LOGICA                   */
    /***********************************************************************************************************/
    public function getIndicadoresValores($idestructura, $idreporte, $mes, $year, $limit, $start)
    {
        $array1 = array();
        $ids = array();
        $idsF = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura =
            ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura,
                $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $objDatos =
            ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(null,
                null, $limit, $start, null, $cargosPeople, null);
        if ($objDatos->quantity == 0) {
            return -1;
        }
        $APA = $objDatos->data;
        foreach ($APA as $ind => $pers) {
            $idpers[$ind] = $pers['idpersona'];
        }
        $datAsistencia = new DatAsistencia();
        $finicio = '2016-04-01';
        $ffin = '2016-05-30';
        $asistencia = $datAsistencia->GetAllByDates($finicio, $ffin, $idpers);
        $modelcausa = new NomCausaModel();
        $tienecausas = 1;
        $totalhoras = array();
        $tieneDatos = false;
        $calendario = new ConfCalendario();
        foreach ($asistencia as $key => $valor) {
            $person = array();
            $person[0] = $valor['idpersona'];
            $personasGrupo =
                ZendExt_IoC_Inter::getInstance()->persona->getRegimenByPerson($person,
                    null, null, null);
            $tieneDatos = true;
            if (!empty($valor['idcausa']) && !empty($valor['hrsdescontadas'])) {
                if ($valor['idcausa']) {
                    $index = $valor['idcausa'];

                    $fi = new DateTime($finicio);
                    $ff = new DateTime($ffin);
                    if (!empty($valor['fdesde']) && !empty($valor['fhasta'])) {
                        $fdes = explode('/', $valor['fdesde']);
                        $fdesde = new DateTime($fdes[2] . '-' . $fdes[1] . '-' .
                            $fdes[0]);
                        $fhas = explode('/', $valor['fhasta']);
                        $fhasta = new DateTime($fhas[2] . '-' . $fhas[1] . '-' .
                            $fhas[0]);
                    }
                    if ((empty($valor['fdesde']) && empty($valor['fhasta'])) ||
                        (($fi <= $fdesde && $fdesde <= $ff) &&
                            ($fi <= $fhasta && $fhasta <= $ff))
                    ) {
                        if (empty($totalhoras[$index])) {
                            $horas = explode(':', $valor['hrsdescontadas']);
                            $minutos = ($horas[0] * 60) + ($horas[1]);
                            $totalhoras[$index] = $minutos;
                        } else {
                            $horas = explode(':', $valor['hrsdescontadas']);
                            $minutos = $totalhoras[$index] + ($horas[0] * 60) +
                                ($horas[1]);
                            $totalhoras[$index] = $minutos;
                        }
                    } else {
                        if (count($personasGrupo) > 0) {
                            if ($fdesde < $fi && $fi <= $fhasta &&
                                $fhasta <= $ff
                            ) {
                                $hrs = $calendario->HrsByDateRange($finicio,
                                    $valor['fhasta'],
                                    $personasGrupo[0]['idgrupodescanso']);

                                if (empty($totalhoras[$index])) {
                                    $horas =
                                        explode(':', $hrs[0]['sum'] . ':00');
                                    $minutos = ($horas[0] * 60) + ($horas[1]);
                                    $totalhoras[$index] = $minutos;
                                } else {
                                    $horas =
                                        explode(':', $hrs[0]['sum'] . ':00');
                                    $minutos =
                                        $totalhoras[$index] + ($horas[0] * 60) +
                                        ($horas[1]);
                                    $totalhoras[$index] = $minutos;
                                }

                            } else {
                                if ($fi <= $fdesde && $fdesde <= $ff &&
                                    $fhasta > $ff
                                ) {
                                    $hrs =
                                        $calendario->HrsByDateRange($valor['fdesde'],
                                            $ffin,
                                            $personasGrupo[0]['idgrupodescanso']);
                                    if (empty($totalhoras[$index])) {
                                        $horas = explode(':',
                                            $hrs[0]['sum'] . ':00');
                                        $minutos =
                                            ($horas[0] * 60) + ($horas[1]);
                                        $totalhoras[$index] = $minutos;
                                    } else {
                                        $horas = explode(':',
                                            $hrs[0]['sum'] . ':00');
                                        $minutos = $totalhoras[$index] +
                                            ($horas[0] * 60) + ($horas[1]);
                                        $totalhoras[$index] = $minutos;
                                    }

                                } else {
                                    $hrs = $calendario->HrsByDateRange($finicio,
                                        $ffin,
                                        $personasGrupo[0]['idgrupodescanso']);

                                    if (empty($totalhoras[$index])) {
                                        $horas = explode(':',
                                            $hrs[0]['sum'] . ':00');
                                        $minutos =
                                            ($horas[0] * 60) + ($horas[1]);
                                        $totalhoras[$index] = $minutos;
                                    } else {
                                        $horas = explode(':',
                                            $hrs[0]['sum'] . ':00');
                                        $minutos = $totalhoras[$index] +
                                            ($horas[0] * 60) + ($horas[1]);
                                        $totalhoras[$index] = $minutos;
                                    }
                                }
                            }
                        }
                    }
                    $APA[$ind]['idcausa'] = $valor['idcausa'];
                }
            }
        }
        $total = array();
        foreach ($totalhoras as $key => $value) {
            $implode[0] = (int)($value / 60);
            $implode[1] = $value % 60;
            if ($implode[1] > 30) {
                $implode[0] = $implode[0] + 1;
            }
            $total[$key] = $implode[0];
        }
        $rep = new DatIndicadorModel();
        $indicadores = $rep->getIndicadoresReporte($idreporte)->data;
        foreach ($indicadores as $value) {
            $arrindicadores = array();
            if ($value['formula'] == 1) {
                if ($value['idexpresionmatematica']) {
                    $arrindicadores =
                        ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($value['idexpresionmatematica']);
                }
                array_push($idsF, ['idindicador' => $value['idindicador'],
                    'denominacion' => $value['denominacion'],
                    'ids' => $arrindicadores,
                    'orden' => $value['orden'],
                    'unidadmedida' => $value['unidadmedida'],
                    'idexpresionmatematica' => $value['idexpresionmatematica']]);
            } else if ($value['formula'] == 2) {
                array_push($ids, ['idindicador' => $value['idindicador'],
                    'denominacion' => $value['denominacion'],
                    'orden' => $value['orden']]);
            }
        }


        foreach ($total as $key => $valueA) {
            foreach ($ids as $value) {
                if ($key == $value['idindicador']) {
                    $array1[$value['orden']] =
                        ['idindicador' => $value['idindicador'],
                            'denominacion' => $value['denominacion'],
                            'valor' => $valueA];
                } else {
                    if (empty($array1[$value['orden']])) {
                        $array1[$value['orden']] =
                            ['idindicador' => $value['idindicador'],
                                'denominacion' => $value['denominacion'],
                                'valor' => 0];
                    }
                }
            }
        }
        foreach ($idsF as $value) {
            $array2 = array();
            $array3 = array();
            if (count($value['ids']) > 0) {
                foreach ($total as $k => $valueB) {
                    foreach ($value['ids'] as $key => $val) {
                        if ($k == $val) {
                            if ($array2[$key]) {
                                $horas = explode(':', $valueB);
                                $minutos = $array2[$key]['valor'] + $valueB;
                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => $minutos];

                            } else {
                                $horas = explode(':', $valueB);
                                $minutos = $valueB;
                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => $minutos];
                            }
                        } else {
                            if ($val == 'F3') {

                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => count($APA)];
                            } else if ($val == 'F4') {
                                $hrsTrabajoMes =
                                    $calendario->HrsByDateRange($finicio, $ffin,
                                        3);
                                $minutos = ($hrsTrabajoMes[0]['sum']);
                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => $minutos];
                            } else {
                                $horas = explode(':', '00:00');
                                $minutos =
                                    $array2[$key]['valor'] + ($horas[0] * 60) +
                                    ($horas[1]);
                                $array2[$key] = ['idindicador' => $val,
                                    'valor' => $minutos];
                            }
                        }
                    }
                }
                $a = ksort($array2);
                array_push($array3, ['unidadmedida' => $value['unidadmedida'],
                    'idexpresionmatematica' => $value['idexpresionmatematica'],
                    'denominacion' => $value['denominacion'],
                    'idsformula' => $array2]);
                $array1[$value['orden']] = $array3;
            } else {
                if ($value['idindicador'] == 3) {
                    $array1[$value['orden']] =
                        ['idindicador' => $value['idindicador'],
                            'unidadmedida' => $value['unidadmedida'],
                            'denominacion' => $value['denominacion'],
                            'valor' => count($APA)];
                } else if ($value['idindicador'] == 4) {
                    $hrsTrabajoMes =
                        $calendario->HrsByDateRange($finicio, $ffin, 3);
                    $array1[$value['orden']] =
                        ['idindicador' => $value['idindicador'],
                            'unidadmedida' => $value['unidadmedida'],
                            'denominacion' => $value['denominacion'],
                            'valor' => $hrsTrabajoMes[0]['sum']];
                }
            }
        }
        $resultado = array();
        foreach ($array1 as $key => $value) {
            if (!(is_array($value[0]))) {
                $resultado[$key]['orden'] = $key;
                $resultado[$key]['datos'] = $value['valor'];
                $resultado[$key]['unidadmedida'] = $value['unidadmedida'];
                $resultado[$key]['denominacion'] = $value['denominacion'];
            } else {
                foreach ($value as $key1 => $val) {
                    if ($val['idsformula']) {
                        $formulaeval =
                            ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($val['idexpresionmatematica'],
                                $val['idsformula']);
                        $resultado[$key]['orden'] = $key;
                        $resultado[$key]['datos'] =
                            round($formulaeval->valor, 2);
                        $resultado[$key]['unidadmedida'] = $val['unidadmedida'];
                        $resultado[$key]['denominacion'] = $val['denominacion'];
                    }
                }
            }
        }
        return $resultado;
    }
     /***********************************************************************************************************/
    /*                REVISAR ESTE METODO CON DATOS A VER QUE DEVUELVE Y OPTIMIZAR LA LOGICA                   */
    /***********************************************************************************************************/

    public function getReporte($idreporte, $idestructura, $fini, $ffin)
    {
       // print_r(array($idreporte,$idestructura,$fini,$ffin));die;
        //Causas
        $rep = new DatIndicadorModel();
        $datAsistenciaModel = new DatAsistenciaModel();
        $datAsistencia = new DatAsistencia();
        $indicadores = $rep->getIndicadoresReporte($idreporte)->data;

        $arrindicadores = array();
        foreach ($indicadores as $value) {
            array_push($arrindicadores, $value['idindicador']);
        }

        if (!empty($idestructura)) {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;;
        }

        $estructuras = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);
        $cargosEstructura = array();
        $arrcargos = array();
        $arridspersona = array();
        $grupos = array();

        $tipodia = new NomTipodia();
        $dialaborable = $tipodia->DiaLaborable();
        $diaferiado = $tipodia->DiaFeriado();


        $datos = array();
        //  $datos = array();
        foreach ($estructuras as $i => $est) {
            $datos[$i]['identidad'] = $est->id;
            $datos[$i]['denom'] = $est->denominacion;
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($est->id, false);
            foreach ($cargosEstructura as $car) {
                array_push($arrcargos, $car['idcargo']);
            }

            $objDatos = $datAsistencia->GetDatosPersonaReporte($arrcargos, null, null, 0, $fini, $ffin);

            $idspersona = array();

            if (count($objDatos) > 0) {

                $denomarea = array();
                foreach ($objDatos as $p => $dat) {
                    if (!empty($dat['idgrupodescanso'])) {
                        array_push($idspersona, $dat['idpersona']);
                        array_push($grupos, $dat['idgrupodescanso']);
                    }
                };
                $datAsistencia = new DatAsistencia();
                $asistenciaAPA = $datAsistencia->getAsistenciabyCausa($arrindicadores, $idspersona, $grupos, $fini, $ffin, array($dialaborable[0]['idtipodedia'], $diaferiado[0]['idtipodedia'], 13, 8));
//                print_r($asistenciaAPA);die;
                $tiempos = array();
                $obj = new DatAsistenciaModel();
                foreach ($asistenciaAPA as $persona) {
                    foreach ($persona as $as) {
                        $suma = ($tiempos[$as['idcausa']]) ? $datos[$as['idcausa']] : '00:00:00';
                        $datos[$i][$as['idcausa']] = $obj->SumOnlyTime($suma, $as['tiempo']);
                    }
                }
            }
        }

        $result = new stdClass();
        $result->data = $datos;
        $result->quantity = count($result->data);
        $result->indicadores = $indicadores;
        return $result;
    }


}

