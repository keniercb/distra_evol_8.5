<?php

class PlanServices extends ZendExt_Model
{

    public function VerificarGrupoInvolucradoArc($idgrupo, $idarc, $nivelinvol)
    {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresp = $idgrupo . $cero;
        $idinvolucradoejec = $idgrupo . $uno;
        $existe = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolucradoresp
        );
        if ($existe) {
            $nivelinvol = 0;
        }
        $existe = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolucradoejec
        );
        if ($existe) {
            $nivelinvol = 1;
        }
        return $nivelinvol;
    }

    public function verificarGestorDoc()
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $gestordocumental
            = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/gestordocumental/comun/recursos/xml/ioc.xml';
        if (file_exists($gestordocumental)) {
            /*$configuracion = new ConfiguracionGD(
                (string)Zend_Registry::getInstance()->config->xml->RepositorioAlfresco
            );
            $data = parse_url(
                $configuracion->obtenerDireccionRepositorio() . 'api'
            ); /* $this->direccionRepositorio */
            /*$fp = fsockopen(
                $data['host'], isset($data['port']) ? $data['port'] : 80, $errno, $errstr, 30
            );
            //if ($fp) {
            /* && $this->integrator->gestordocumental->estaAutenticadoUsuarioActual() == 1 */
            //$autenticacion = $this->integrator->gestordocumental->obtenerAutenticacion();
            //}
            if ($fp) {
                return true;
            }
        }

        return false;
    }

    public function VerificarUsuarioInvolucradoArc(
        $idusuario, $idarc, $nivelinvol
    )
    {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresp = $idusuario . $cero;
        $idinvolucradoejec = $idusuario . $uno;
        $existe = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolucradoresp
        );
        if ($existe) {
            $nivelinvol = 0;
        }
        $existe = DatArcDatInvolucrados::ExisteElemento(
            $idarc, $idinvolucradoejec
        );
        if ($existe) {
            $nivelinvol = 1;
        }
        return $nivelinvol;
    }

    public function DameGrupoPublico($idincidencia, $idgrupo)
    {

        $cadena
            = "SELECT COUNT(*)
        FROM mod_objetivos.dat_grupo_incidencia
        WHERE dat_grupo_incidencia.idgrupo = '$idgrupo' 
        AND dat_grupo_incidencia.idincidencia   '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function DameDatosActividad($idelemento)
    {
        $objactividad = Doctrine::getTable('DatActividades')->find($idelemento);
        return $objactividad;
    }

    public function VerificarInvolucradoAct($idinvolucrado, $idvariable)
    {
        $objactividadinvol = Doctrine::getTable('DatVariableDatInvolucrados')
            ->findByDql(
                "idinvolucrado = $idinvolucrado AND idvariable = $idvariable "
            );
        return $objactividadinvol;
    }

    public function VerificarInvolucrado(
        $llaveinvolucrado, $idelemento, $tipoelemento
    )
    {
        if ($tipoelemento == 5) {
            $objelementoinvol = Doctrine::getTable('DatArcDatInvolucrados')
                ->findByDql(
                    "llaveinvolucrado = $llaveinvolucrado AND idarc = $idelemento "
                );
        } else {
            $objelementoinvol = Doctrine::getTable(
                'DatElementosDatInvolucrados'
            )->findByDql(
                "llaveinvolucrado = $llaveinvolucrado AND idelemento = $idelemento "
            );
        }
        return $objelementoinvol;
    }

    public function DameActividadesPorInvolucrados(
        $idusuariosession, $arrayinvolucrados, $arrayarrayautores, $fechainicio, $fechafin, $arraynomencladores, $certificado, $iddominio, $arrayestados, $arrayplanes
    )
    {
        $objelementomodel = new DatElementosModel();
        $arrayactividadescal = $objelementomodel->CargarActividadesCalendario(
            $idusuariosession, $arrayinvolucrados, $arrayarrayautores, $fechainicio, $fechafin, $arraynomencladores, $certificado, $iddominio, $arrayestados, $arrayplanes
        );
        return $arrayactividadescal;
    }

    public function DameNumFecha($fechainicio, $fechafin)
    {
        $fechainicio = explode('/', $fechainicio);
        krsort($fechainicio);
        $fechainicio = implode($fechainicio);
        $fechafin = explode('/', $fechafin);
        krsort($fechafin);
        $fechafin = implode($fechafin);
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }

    public function DameFechaLegible($fechainicio, $fechafin)
    {
        $fechainicio = explode('-', $fechainicio);
        $fechainicio
            = $fechainicio[1] . '/' . $fechainicio[2] . '/' . $fechainicio[0];
        $fechafin = explode('-', $fechafin);
        $fechafin = $fechafin[1] . '/' . $fechafin[2] . '/' . $fechafin[0];
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }

    public function DameNumFechaVariable($fechainicio, $fechafin)
    {
        $fechainicio = explode('-', $fechainicio);
        $fechainicio = implode($fechainicio);
        $fechafin = explode('-', $fechafin);
        $fechafin = implode($fechafin);
        $arrayfechas['fechainicio'] = $fechainicio;
        $arrayfechas['fechafin'] = $fechafin;
        return $arrayfechas;
    }

    public function DameRangoDeTiempo($diainicio, $diafin)
    {
        $diferenciadias = $diafin - $diainicio;
        if ($diferenciadias == 0) {
            $rangodetiempo = 'dia';
        }
        if ($diferenciadias == 6) {
            $rangodetiempo = 'semana';
        }
        if ($diferenciadias >= 27) {
            $rangodetiempo = 'mes';
        }
        return $rangodetiempo;
    }

    public function DimeSiEstaEnRango(
        $arraynumfechasvariable, $arraynumfechasbusqueda
    )
    {
        $numerofechainiciovariable = $arraynumfechasvariable['fechainicio'];
        $numerofechafinvariable = $arraynumfechasvariable['fechafin'];
        $numerofechainiciobusqueda = $arraynumfechasbusqueda['fechainicio'];
        $numerofechafinbusqueda = $arraynumfechasbusqueda['fechafin'];
        $result = 0;
        if (($numerofechainiciovariable >= $numerofechainiciobusqueda)) {
            $result = 1;
        }
        if ($numerofechafinvariable >= $numerofechainiciobusqueda && $numerofechafinvariable <= $numerofechafinbusqueda
        ) {
            $result = 1;
        }
        if ($numerofechainiciovariable <= $numerofechainiciobusqueda && $numerofechafinvariable >= $numerofechafinbusqueda
        ) {
            $result = 1;
        }
        return $result;
    }

    public function DameIdNomenclador($idelemento, $tiponomenclador)
    {
        $nomenclador = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
            $idelemento, $tiponomenclador
        );
        $idnomenclador = $nomcategoriaact[0]['idnomenclador'];
        return $idnomenclador;
    }

    public function ArmarArregloDeActividades(
        $idvariable, $fechainicio, $fechafin
    )
    {
        $variable = Doctrine::getTable('DatVariable')->find($idvariable);
        $fechainiciovariable = $variable->fechainicio;
        $fechafinvariable = $variable->fechafin;
        $arrayfechaslegibles = $this->DameFechaLegible(
            $fechainiciovariable, $fechafinvariable
        );
        $arraynumfechasvariable = $this->DameNumFechaVariable(
            $fechainiciovariable, $fechafinvariable
        );
        $arraynumfechasbusqueda = $this->DameNumFecha($fechainicio, $fechafin);
        $estaenrango = $this->DimeSiEstaEnRango(
            $arraynumfechasvariable, $arraynumfechasbusqueda
        );
        if ($estaenrango == 1) {//esta en rango
            $variable = Doctrine::getTable('DatVariable')->find($idvariable);

            $idactividad = $variable->idactividad;
            $arraydatosactividad
                = DatElementos::DameDatosActividadDadoIdactividad($idactividad);
            $idnomencladorcategact = $this->DameIdNomenclador(
                $idactividad, $tiponomenclador = 2
            );
            $coloractividad
                = $this->pIntegrator->configuracionpdo->DameColorCategoriaActividad(
                $idnomencladorcategact
            );
            $idnomencladortipoact = $this->DameIdNomenclador(
                $idactividad, $tiponomenclador = 3
            );
            $arrayactividadescal[$cont]['id'] = $variable->idvariable;
            $arrayactividadescal[$cont]['subject']
                = $arraydatosactividad[0]['denelemento'];
            $arrayactividadescal[$cont]['description']
                = $arraydatosactividad[0]['descelemento'];
            $arrayactividadescal[$cont]['startdate']
                = $arrayfechaslegibles['fechainicio'] . ' ' . $variable->hora;
            $arrayactividadescal[$cont]['enddate']
                = $arrayfechaslegibles['fechafin'] . ' ' . $variable->horafin;
            $arrayactividadescal[$cont]['color'] = "";
            $arrayactividadescal[$cont]['idcat'] = 0;
            $arrayactividadescal[$cont]['caducidad'] = 5;
            $arrayactividadescal[$cont]['categoria'] = 'cat1';
            $arrayactividadescal[$cont]['tipoact'] = 'oficial';
            $arrayactividadescal[$cont]['lugar'] = 'UCID';
            $arrayactividadescal[$cont]['participan'] = 'lideres de linea';
            $arrayactividadescal[$cont]['estado_cump'] = 'bajo';
            $arrayactividadescal[$cont]['grado_cump'] = 'alto';
            $cont++;
        }
    }

    public function DameActvPorUsuarioTipoNomenclador(
        $idusuariocrea, $tiponom, $fechainicio, $fechafin
    )
    {
        $arrayactv = DatElementos::GetActvPorUsuarioTipoNomenclador(
            $idusuariocrea, $tiponom, $fechainicio, $fechafin
        );
        return $arrayactv;
    }

    public function DameRelacionElementoNomencladorByTipoNom(
        $idelemento, $tiponomenclador
    )
    {
        $relacion = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
            $idelemento, $tiponomenclador
        );
        return $relacion;
    }

    public function ExisteGrupoInvolucradoARC($idgrupo)
    {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresponsable = $idgrupo . $cero;
        $idinvolucradoejecutor = $idgrupo . $uno;
        $existegrupoinvolresp
            = DatArcDatInvolucrados::dameIdARCDadoIdInvolucrado(
            $idinvolucradoresponsable
        );
        if ($existegrupoinvolresp) {
            $existeinvol['responsable'] = $existegrupoinvolresp;
        }
        $existegrupoinvolejec
            = DatArcDatInvolucrados::dameIdARCDadoIdInvolucrado(
            $idinvolucradoejecutor
        );
        if ($existegrupoinvolejec) {
            $existeinvol['ejecutor'] = $existegrupoinvolejec;
        }
        return $existeinvol;
    }

    public function VerificarInvolucradoConElementos($idgou)
    {
        $uno = 1;
        $cero = 0;
        $idinvolejec = $idgou . $uno;
        $idinvolresp = $idgou . $cero;
        $elementosinvol
            = DatElementosDatInvolucrados::GetElementosPorIdInvolucrado(
            $idinvolejec
        );
        if (isset($elementosinvol[0])) {
            return $elementosinvol;
        }
        $elementosinvol
            = DatElementosDatInvolucrados::GetElementosPorIdInvolucrado(
            $idinvolresp
        );
        if (isset($elementosinvol[0])) {
            return $elementosinvol;
        }
    }

    public function ExisteGrupoInvolucradoObjFIP($idgrupo)
    {
        $fechainiciob = $fechafinb = $denominacionb = null;
        $cero = 0;
        $uno = 1;
        $idinvolucradoresponsable = $idgrupo . $cero;
        $idinvolucradoejecutor = $idgrupo . $uno;
        $existegrupoinvolresp
            = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
            $idusuariocrea, $idinvolucradoresponsable, $idinvolucradoejecutor, $tipoelemento = 2, $fechainiciob, $fechafinb, $denominacionb
        );
        if ($existegrupoinvolresp) {
            $existeinvol['responsable'] = $existegrupoinvolresp;
        }
        $existegrupoinvolejec
            = DatElementosDatInvolucrados::ExisteInvolucradoConElementos(
            $idinvolucradoejecutor, $tipoelemento = 2
        );
        if ($existegrupoinvolejec) {
            $existeinvol['ejecutor'] = $existegrupoinvolejec;
        }
        return $existeinvol;
    }

    public function ExisteGrupoInvolucradoAct($idgrupo)
    {
        $cero = 0;
        $uno = 1;
        $idinvolucradoresponsable = $idgrupo . $cero;
        $idinvolucradoejecutor = $idgrupo . $uno;
        $existegrupoinvolresp = DatVariableDatInvolucrados::BuscarInvolucrado(
            $idinvolucradoresponsable
        );
        if ($existegrupoinvolresp) {
            $existeinvol['responsable'] = $existegrupoinvolresp;
        }
        $existegrupoinvolejec = DatVariableDatInvolucrados::BuscarInvolucrado(
            $idinvolucradoejecutor
        );
        if ($existegrupoinvolejec) {
            $existeinvol['ejecutor'] = $existegrupoinvolejec;
        }
        return $existeinvol;
    }

    public function EliminarActividad($idactividad)
    {
        $objactmodel = new GestionarActividadesModel();
        $objactmodel->EliminarActividad($idactividad);
    }

    public function ModificarActivacionActividad($idactividad, $activo)
    {
        $objact = Doctrine::getTable('DatElementos')->find($idactividad);
        $objact->activo = $activo;
        $objact->save();
    }

    public function ModificarHoraActividad($idactividad, $horainicio, $horafin)
    {
        $objact = Doctrine::getTable('DatActividades')->find($idactividad);
        if (isset($objact)) {
            $objact->horainicio = $horainicio;
            $objact->horafin = $horafin;
            $objact->save();
            $mensaje = 1;
            $msg = 'La actividad ha sido modificada correctamente';
        } else {
            $mensaje = 3;
            $msg
                = 'La actividad que desea modificar no se encuentra en los registros';
        }
        $arrayresp = array('mensaje' => $mensaje, 'msg' => $msg);
        return $arrayresp;
    }

    public function CargarPlanes($nodo, $idusuario)
    {
        $objplamodel = new DatPlanPdoModel();
        $dat = $objplamodel->CargarPlanes($nodo, $idusuario);
        return $dat;
    }

    public function ObtenerActividadesPorDia(
        $arrayinvol, $fechainicio, $fechafin
    )
    {
        $arrayactividades = DatElementos::ObtenerActividadesPorDia(
            $arrayinvol, $fechainicio, $fechafin
        );
        return $arrayactividades;
    }

    public function existeNomencladorElemento($idNom)
    {
        $existe = DatElementosNomNomencladorModel::existeNomencladorSegunId(
            $idNom
        );
        return $existe;
    }

    public function existeNomencladorCriterioMedidida($idNom)
    {
        $existe = DatCriteriomedidaModel::existeNomencladorSegunId($idNom);
        return $existe;
    }

    public function ObtenerActividadesReporte(
        $fechainicio, $fechafin, $fechainicioD, $fechafinD, $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
    )
    {
        $arrayidactividades = DatElementos::ObtenerActividadesReporte(
            $fechainicio, $fechafin, $fechainicioD, $fechafinD, $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
        );
        return $arrayidactividades;
    }

    public function ObtenerAreasPorPlan($idplan)
    {
        $arrayareasenplan = DatArcDatPlan::ObtenerAreasPorPlanes($idplan);
        return $arrayareasenplan;
    }

    public function ObtenerActividadesPorAreas(
        $idarc, $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
    )
    {
        $arrayidact = DatElementos::ObtenerActividadesPorAreas(
            $idarc, $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
        );
        return $arrayidact;
    }

    public function ActividadesDirectasAlPlan(
        $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
    )
    {
        $arrayidact = DatElementos::ActividadesDirectasAlPlan(
            $idplan, $arrayidautor, $arrayidinvol, $operador, $arrayidnom, $arrayestados, $todoscrit
        );
        return $arrayidact;
    }

    public function ModificarBanderaDeNotificacion(
        $idtipo, $estadossiguientes, $estadosanteriores
    )
    {
        $objelemento = new DatElementos();
        $result = $objelemento->ModificarBanderaDeNotificacionBD(
            $idtipo, $estadossiguientes, $estadosanteriores
        );
        return $result;
    }

    public function ListarObjetivos($limit, $start)
    {
        $objelemento = new DatObjetivo();
        $result = $objelemento->ObtenerTodosObjetivosyElementos($limit, $start);
        return $result;
    }

    public function SeCumplenCondicionesOld($arguments)
    {
        $idelemento = $arguments[0];
        $operadormayormenorque = $arguments[1];
        $operadorigual = $arguments[2];
        $porccumplimiento = $arguments[3];
        $estadocumplimiento = $arguments[4];
        $estadoaprobacion = $arguments[5];

        $operadorcumplimiento = trim($operadormayormenorque . $operadorigual);

        //print_r($operadorcumplimiento);die;

        //ZendExt_Logger::write($arguments->idelemento);
        $flag = 1;
        if (isset($idelemento)) {//$flag==0)
            $obj = Doctrine::getTable('DatElementos')->find($idelemento);
            if ($estadoaprobacion != 0) {
                if ($obj->idestadoaprob <> $estadoaprobacion) {
                    $flag = 0;
                }
            }
            if ($estadocumplimiento <> '' && $flag == 1) {
                if ($obj->estadocumplimiento <> $estadocumplimiento) {
                    $flag = 0;
                }
            }
            if ($porccumplimiento <> 0 && $flag == 1) {
                switch ($operadorcumplimiento) {
                    case '=':
                        if ($obj->gradocumplimiento == $porccumplimiento) {
                            $flag = 0;
                        }
                        break;
                    case ">=":
                        if ($obj->gradocumplimiento >= $porccumplimiento) {
                            $flag = 0;
                        }
                        break;
                    case '<=':
                        if ($obj->gradocumplimiento <= $porccumplimiento) {
                            $flag = 0;
                        }
                        break;
                    case ">":
                        if ($obj->gradocumplimiento > $porccumplimiento) {
                            $flag = 0;
                        }
                        break;
                    case "<":
                        if ($obj->gradocumplimiento < $porccumplimiento) {
                            $flag = 0;
                        }
                        break;
                }
            }
        }
        if ($flag == 0) {
            return array('success' => true, 'result' => 1);
        } else {
            return array('success' => false, 'result' => 0);
        }
    }

    public function SeCumplenCondiciones($arguments)
    {
        //print_r($arguments);die;
        $idelemento = $arguments[0];
        $operadorcumplimiento = $arguments[1];
        $porccumplimiento = $arguments[2];
        $estadocumplimiento = str_replace('_',' ', $arguments[3]);
        $estadoaprobacion = $arguments[4];
        //ZendExt_Logger::write($arguments->idelemento);
        $flag = 1;
        if (!empty($idelemento)) {//$flag==0)
            $obj = Doctrine::getTable('DatElementos')->find($idelemento);
            if (isset($obj->idelemento)) {
                if (!empty($estadoaprobacion)) {
                    if ($obj->idestadoaprob <> $estadoaprobacion) {
                        $flag = 0;
                    }
                }

                if (!empty($estadocumplimiento) && $flag == 1) {
                    if ($obj->estadocumplimiento <> $estadocumplimiento) {
                        $flag = 0;
                    }
                }

                if (!empty($porccumplimiento) && $flag == 1) {
                    switch ($operadorcumplimiento) {
                        case '=':
                            if ($obj->gradocumplimiento == $porccumplimiento) {
                                $flag = 1;
                            }
                            break;
                        case ">=":
                            if ($obj->gradocumplimiento >= $porccumplimiento) {
                                $flag = 1;
                            }
                            break;
                        case '<=':
                            if ($obj->gradocumplimiento <= $porccumplimiento) {
                                $flag = 1;
                            }
                            break;
                        case ">":
                            if ($obj->gradocumplimiento > $porccumplimiento) {
                                $flag = 1;
                            }
                            break;
                        case "<":
                            if ($obj->gradocumplimiento < $porccumplimiento) {
                                $flag = 1;
                            }
                            break;
                    }
                }
            }

        }
        if ($flag == 1) {
            return 1;
        } else {
            return 0;
        }
    }


    public function getInvolucrados($consulta, $idelemento)
    {
        $obj = new ClasificadorinvolModel();
        return $obj->obtenerInvolucrados($consulta, $idelemento);
    }

    public function obtenerObjConCriteriosDeMedidas($parametros)
    {
        $arrayObjetivos = [];
        $objDatObjetivo = new DatObjetivo();
        $result = $objDatObjetivo->obtenerObjConCriteriosDeMedidas($parametros);
        foreach ($result as $key => $objetivo) {
            $arrayObjetivos[$key]['denominacion'] = $objetivo['denelemento'];
            $arrayObjetivos[$key]['idobjetivo'] = $objetivo['idobjetivo'];
            $arrayObjetivos[$key]['fechainicio'] = $objetivo['fechainicio'];
            $arrayObjetivos[$key]['fechafin'] = $objetivo['fechafin'];
            $arrayObjetivos[$key]['porcientodecumplimiento'] = $objetivo['gradocumplimiento'];
            $arrayObjetivos[$key]['total'] = $objetivo['total'];
        }
        //return $arrayObjetivos;
        echo json_encode(array('data' => $arrayObjetivos, 'cantidad_filas' => $arrayObjetivos[0]['total']));
    }

    public function obtenerDatosDadoArrayObjetivos($parametros)
    {
        $arrayObjetivos = [];
        $objDatObjetivo = new DatObjetivo();
        $result = $objDatObjetivo->obtenerDatosDadoArrayObjetivos($parametros);
        foreach ($result as $key => $objetivo) {
            $arrayObjetivos[$key]['denominacion'] = $objetivo['denelemento'];
            $arrayObjetivos[$key]['idobjetivo'] = $objetivo['idobjetivo'];
            $arrayObjetivos[$key]['fechainicio'] = $objetivo['fechainicio'];
            $arrayObjetivos[$key]['fechafin'] = $objetivo['fechafin'];
            $arrayObjetivos[$key]['porcientodecumplimiento'] = $objetivo['gradocumplimiento'];
        }
        return $arrayObjetivos;
    }

    public function obtenerDatosCriteriosMedidasDadoIdObj($parametros)
    {
        $arrayCriteriosMedidas = [];
        $objDatObjetivo = new DatObjetivo();
        $result = $objDatObjetivo->obtenerDatosCriteriosMedidasDadoIdObj($parametros);
        foreach ($result as $key => $criterio) {
            $arrayCriteriosMedidas[$key]['denominacion'] = $criterio['dencriterio'];
            $arrayCriteriosMedidas[$key]['idcriteriomedida'] = $criterio['idcriteriomedida'];
            $arrayCriteriosMedidas[$key]['idobjetivo'] = $criterio['idobjetivo'];
            $arrayCriteriosMedidas[$key]['fechainicio'] = $criterio['fechainicio'];
            $arrayCriteriosMedidas[$key]['fechafin'] = $criterio['fechafin'];
            $arrayCriteriosMedidas[$key]['valormeta'] = $criterio['valormeta'];
            $arrayCriteriosMedidas[$key]['valoreal'] = $criterio['valoreal'];
        }
        return $arrayCriteriosMedidas;
    }

    public function obtenerDatosCriteriosMedidasDadoArrayIdObjetivos($parametros)
    {
        $arrayCriteriosMedidas = [];
        $objDatObjetivo = new DatObjetivo();
        $result = $objDatObjetivo->obtenerDatosCriteriosMedidasDadoArrayIdObjetivos($parametros);
        foreach ($result as $key => $criterio) {
            $arrayCriteriosMedidas[$key]['denominacion'] = $criterio['dencriterio'];
            $arrayCriteriosMedidas[$key]['idcriteriomedida'] = $criterio['idcriteriomedida'];
            $arrayCriteriosMedidas[$key]['idobjetivo'] = $criterio['idobjetivo'];
            $arrayCriteriosMedidas[$key]['fechainicio'] = $criterio['fechainicio'];
            $arrayCriteriosMedidas[$key]['fechafin'] = $criterio['fechafin'];
            $arrayCriteriosMedidas[$key]['valormeta'] = $criterio['valormeta'];
            $arrayCriteriosMedidas[$key]['valoreal'] = $criterio['valoreal'];
        }
        return $arrayCriteriosMedidas;
    }

    public function getJSRelaciones()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/pdo/plan/views/scripts/cmpgestionaractividades/obtenerJSRelaciones.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    public function getJSPert()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/pdo/plan/views/scripts/cmpdiagramapert/obtenerJSPert.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    function devolverJS_Elementos()
    {

        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . 'planificacion/pdo/plan/views/scripts/cmpgestionardesviaciones/cmpgestionardesviaciones.phtml';
        $phtml = '
        <script type="text/javascript" id="vtype" src="/planificacion/pdo/comun/js/vtype.js"></script>
        <script type="text/javascript" id="CmpBase"  src="/planificacion/pdo/comun/js/CmpBase.js"></script>
        <script type="text/javascript" id="notificaciones" src="/planificacion/pdo/comun/js/notificaciones.js"></script>
        <script type="text/javascript" id="CmpBarraProgreso" src="/planificacion/pdo/comun/js/CmpBarraProgreso.js"></script>
        <script type="text/javascript" id="RowExpander" src="/planificacion/pdo/comun/js/RowExpander.js"></script>
        <script type="text/javascript" id="TreeGridjs" src="/planificacion/pdo/comun/js/TreeGrid.js"></script>
        <script type="text/javascript" id="CmpPaginadoTreegrid" src="/planificacion/pdo/comun/js/CmpPaginadoTreegrid.js"></script>
        <script type="text/javascript" id="CmpMenuRelacionesDinamicas" src="/planificacion/pdo/comun/js/CmpMenuRelacionesDinamicas.js"></script>
        <script type="text/javascript" id="FileUploadField" src="/planificacion/pdo/comun/js/FileUploadField.js"></script>
        <script type="text/javascript" id="examplesjs" src="/planificacion/pdo/comun/js/examples.js"></script>
        <script type="text/javascript" id="arboleslogica" src="/planificacion/pdo/comun/js/arboleslogica.js"></script>
        <script type="text/javascript" id="FechasBase" src="/planificacion/pdo/comun/js/FechasBase.js"></script>
        <script type="text/javascript" id="cmphistorial" src="/planificacion/pdo/plan/views/js/cmphistorial/cmphistorial.js"></script>
        <script type="text/javascript" id="cmphistorial" src="/planificacion/pdo/plan/views/js/cmppuntualizacion/cmppuntualizacion.js"></script>
        
        <script type="text/javascript" id="cmpgestionarpareto" src="/planificacion/pdo/plan/views/js/cmpgraficas/cmpgestionargraficas.js"></script>
        
        <script type="text/javascript" id="cmpgestionarobservaciones" src="/planificacion/pdo/plan/views/js/cmpgestionarobservaciones/cmpgestionarobservaciones.js"></script>
        <script type="text/javascript" id="cmpclasificadorinvol" src="/planificacion/pdo/plan/views/js/cmpclasificadorinvol/cmpclasificadorinvol.js"></script>
        <script type="text/javascript" id="cmpfondodetiempo" src="/planificacion/pdo/plan/views/js/cmpfondodetiempo/cmpfondodetiempo.js"></script>
        <script type="text/javascript" id="cmpgestordocumental" src="/planificacion/pdo/plan/views/js/cmpgestordocumental/cmpgestordocumental.js"></script>
        <script type="text/javascript" id="cmprelaciones" src="/planificacion/pdo/plan/views/js/cmprelaciones/cmprelaciones.js"></script>
        <script type="text/javascript" id="cmpctrlreasignaciones" src="/planificacion/pdo/plan/views/js/cmpctrlreasignaciones/cmpctrlreasignaciones.js"></script>
        
        
        <script type="text/javascript" id="go-debug" src="/planificacion/pdo/comun/pert/go-debug.js"></script>
        <script type="text/javascript" id="cmphistorial" src="/planificacion/pdo/plan/views/js/cmphistorial/cmphistorial.js"></script>
        <script type="text/javascript" id="cmpgestionarobservaciones" src="/planificacion/pdo/plan/views/js/cmpgestionarobservaciones/cmpgestionarobservaciones.js"></script>
        <script type="text/javascript" id="cmpfondodetiempo" src="/planificacion/pdo/plan/views/js/cmpfondodetiempo/cmpfondodetiempo.js"></script>
        <script type="text/javascript" id="cmpgestordocumental" src="/planificacion/pdo/plan/views/js/cmpgestordocumental/cmpgestordocumental.js"></script>
        <script type="text/javascript" id="cmprelaciones" src="/planificacion/pdo/plan/views/js/cmprelaciones/cmprelaciones.js"></script>
        <script type="text/javascript" id="cmpctrlreasignaciones" src="/planificacion/pdo/plan/views/js/cmpctrlreasignaciones/cmpctrlreasignaciones.js"></script>
        <script type="text/javascript" id="cmpconfigurarperfil" src="/planificacion/pdo/plan/views/js/cmpconfigurarperfil/cmpconfigurarperfil.js"></script>
        <script type="text/javascript" id="cmpcrudcargapordefecto" src="/planificacion/pdo/plan/views/js/cmpconfigurarperfil/cmpcrudcargapordefecto.js"></script>
        <script type="text/javascript" id="cmpcrudconfigurarperfil" src="/planificacion/pdo/plan/views/js/cmpconfigurarperfil/cmpcrudconfigurarperfil.js"></script>
        <script type="text/javascript" id="cmpexportarimportar" src="/planificacion/pdo/plan/views/js/cmpexportarimportar/cmpexportarimportar.js"></script>
        <script type="text/javascript" id="cmpcrudplan" src="/planificacion/pdo/plan/views/js/cmpcrudplan/cmpcrudplan.js"></script>
        <script type="text/javascript" id="cmpgestionarplan" src="/planificacion/pdo/plan/views/js/cmpgestionarplan/cmpgestionarplan.js"></script>
        <script type="text/javascript" id="cmpcrudobjetivos" src="/planificacion/pdo/plan/views/js/cmpcrudobjetivos/cmpcrudobjetivos.js"></script>
        <script type="text/javascript" id="cmpgestionarobjetivos" src="/planificacion/pdo/plan/views/js/cmpgestionarobjetivos/cmpgestionarobjetivos.js"></script>
        <script type="text/javascript" id="cmpreportes" src="/planificacion/pdo/plan/views/js/cmpreportes/cmpreportes.js"></script>
        <script type="text/javascript" id="cmpgestionarpareto" src="/planificacion/pdo/plan/views/js/cmppert/cmpgestionarpert.js"></script>
        <script type="text/javascript" src="/planificacion/proyecto/planeacion/views/js/cmpgestionarestructura/cmpgestionarestructura.js"></script>
        
        
        <link href="/planificacion/herramientasintegracion/comun/ExtExtend/css/_ExtBase.css" rel="stylesheet" type="text/css" media="screen"/>
        
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/ExtExtend/js/_ExtBase(dev).js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/ExtExtend/js/ExtExtends.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/ExtExtend/js/ExtButtonsExtend.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/ExtExtend/js/ExtFieldsExtend.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/ExtExtend/js/ExtExtrasExtend.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/ExtExtend/js/FormValidator.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun//ExtExtend/js/ExtContainersExtend.js"></script>
        
        <!-- Grid editable -->
        <link rel="stylesheet" type="text/css" href="/planificacion/herramientasintegracion/comun/recursos/js/RowEditor/css/StdBaseUtilesRowEditor.css"/>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/recursos/js/RowEditor/StdBaseUtilesRowEditor.js"></script>
        
        
        <!-- JQuery -->
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/recursos/js/jquery/jquery.js"></script>
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/jquery/jquery.flot.js"></script>
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/jquery/jquery.flot.symbol.js"></script>
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/jquery/jquery.flot.navigate.js"></script>
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/jquery/jquery.flot.grow.js"></script>
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/jquery/jquery.flot.zeroaxes.js"></script>
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/jquery/jquery.flot.resize.js"></script>
        
        <!-- Springy -->
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/springy/springy.js"></script>
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/springy/springyui.js"></script>
        
        <!-- Libreria vis -->
        <link href="/planificacion/herramientasintegracion/comun/recursos/css/vis/vis.css" rel="stylesheet" type="text/css"
              media="screen"/>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/recursos/js/vis/vis.js"></script>
        
        <link href="/planificacion/herramientasintegracion/comun/recursos/css/columnLock.css" rel="stylesheet" type="text/css"
              media="screen"/>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/recursos/js/columnLock.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/recursos/js/CheckColumn.js"></script>
        
        <link href="/planificacion/herramientasintegracion/comun/recursos/css/causaefecto/causaefecto.css" rel="stylesheet"
              type="text/css" media="screen"/>
        
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/config.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/idioma/es/PyecomunLabel.js"></script>
        
        <!--Clases modelos-->
        <script type="text/javascript" src="/lib/UCID/js/utiles/ViewModel.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/model/PyecomunModel.js"></script>
        
        <!--Clase controladora-->
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/comun/recursos/js/controllers/Std_Base_Controller.js"></script>
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/views/js/controllers/PyecomunController.js"></script>
        <!--Vista-->
        <script type="text/javascript"
                src="/planificacion/herramientasintegracion/views/js/views/pyecomun/Pyecomun.js"></script>
        
        <!--Configuración para el modulo-->
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/config.js"></script>
        <!-- Elementos comunes-->
        <script type="text/javascript" src="/lib/UCID/js/utiles/ViewModel.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/comun/recursos/js/controllers/Std_Base_Controller.js"></script>
        
        <!-- Js para las etiquetas-->
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/idioma/es/PyELabel.js"></script>
        
        <!-- estilos
        <link href="/planificacion/herramientasintegracion/comun/recursos/css/matrizrelaciones.css" rel="stylesheet" type="text/css" media="screen"/>
        <link href="/planificacion/herramientasintegracion/comun/recursos/css/dafo/metro.css" rel="stylesheet" type="text/css" media="screen"/>
        <link href="/planificacion/herramientasintegracion/comun/recursos/css/dafo/metro-icons.css" rel="stylesheet" type="text/css" media="screen"/> -->
        
        <!--Clases modelos-->
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/model/MatrizrelacionesModel.js"></script>
        <!--Clase controladora-->
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/controllers/MatrizrelacionesController.js"></script>
        <!--Vistas-->
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/views/matrizrelaciones/ExportarWindowRelaciones.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/views/matrizrelaciones/MatrizrelacionesPanel.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/views/matrizrelaciones/componentsMatrizRelacion.js"></script>
        <script type="text/javascript" src="/planificacion/herramientasintegracion/views/js/views/matrizrelaciones/GridEstudioMatrizRelaciones.js"></script>
        
        <form name="exportarResultadoMatriz" id="exportarResultadoMatriz" method="POST" target="_blank">
            <input type="hidden" name="filename" id="filename" value=""/>
            <input type="hidden" name="html" id="html" value=""/>
            <input type="hidden" name="type" id="type" value=""/>
        </form>
        
        
         <script type="text/javascript" src="/planificacion/proyecto/planeacion/views/js/cmpgestionarplantilla/cmpcrudproyecto.js"></script>
        <script type="text/javascript" src="/planificacion/proyecto/planeacion/views/js/cmpgestionarplantilla/cmpcrudhito.js"></script>
        <script type="text/javascript" src="/planificacion/proyecto/planeacion/views/js/cmpgestionarplantilla/cmpcrudtarea.js"></script>
        <script type="text/javascript" src="/planificacion/proyecto/planeacion/views/js/cmpgestionarplantilla/cmpgestionarplantilla.js"></script>
        <script type="text/javascript" src="/planificacion/proyectointegracion/planeacion/views/js/cmpgestionarplantillaintegracion/cmpintegracionproyectonivelesact.js"></script>
        <script type="text/javascript" src="/planificacion/proyectointegracion/planeacion/views/js/cmpgestionarplantillaintegracion/cmpgestionarplantillaintegracion.js"></script>
        '; //file_get_contents($dir_phtml);
        return $phtml;
    }

    public function buscarInferioresGantt(
        $idelementopadre, $resultado, $comparacion, $origen
    )
    {
        $obj = new CmpgestionaractividadesModel();
        $obj->buscarInferioresGantt($idelementopadre, $resultado, $comparacion, $origen);
        return $resultado;
    }

    public function buscarInferioresPert(
        $idelementopadre, $resultado, $comparacion, $origen, $tioelemento
    )
    {
        $obj = new CmpgestionaractividadesModel();
        $obj->buscarInferioresPert($idelementopadre, $resultado, $comparacion, $origen, $tioelemento);
        return $resultado;
    }

    public function buscarSuperioresGantt(
        $idelementopadre, $resultado, $comparacion, $origen
    )
    {
        $obj = new CmpgestionaractividadesModel();
        $obj->BuscarSuperiores($idelementopadre, $resultado, $comparacion, $origen);
        return $resultado;
    }

    public function insertarInvolucradosTarea($arrayinvolucrados, $idElemen, $tipo, $idautor)
    {
        $model = new CmpgestionarelementoModel();
        $model->InvolucrarUsuariosAElementos($arrayinvolucrados, $idElemen, $tipo, $idautor);
    }

    public function eliminarUsuariosAElemento($arrayinvolucrados, $idElemen, $tipo)
    {
        //print_r($arrayinvolucrados);die;
        $model = new CmpgestionarelementoModel();
        $model->EliminarUsuariosAElementos($arrayinvolucrados, $idElemen, $tipo);
    }

    public function insertarElemento($parametros)
    {
        $model = new CmpgestionarelementoModel();
        $result = $model->AdicionarElemento($parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->tipo, $parametros->activo, $parametros->estadocumplimiento, $parametros->estadoaprobpordefcto, $parametros->idusuariocrea, $parametros->dirgente, $parametros->participante, $parametros->autoManual = 0, $parametros->peso);
        return $result;
    }

}

