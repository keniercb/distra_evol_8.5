<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpnuevocalendarioModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function CargarElementosCalendario($parametros)
    {
        $arraynom = array();
        $utilizacionFT = 0;
        $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuariosession, $idtipodoc = 3
        );
        if (isset($arrayestados[0])) {
            $utilizacionFT = 1;
        }
        $cero = 0;
        $uno = 1;
        //si se esta filtrando por autores o involucrados
        if (isset($parametros->arrayinvolucrados[0])) {
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $id = $involucrado->idusuario;
                if ($involucrado->tipo == 0) {
                    $id = $involucrado->idgrupo;
                }
                $arrayinvolact[]['llaveinvolucrado'] = $id . $cero;
                $arrayinvolact[]['llaveinvolucrado'] = $id . $uno;
                if ($involucrado->tipo == 1) {
                    $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $id
                    );
                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayinvolact[]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $cero;
                            $arrayinvolact[]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $uno;
                        }
                    }
                }
            }
        }
        if (isset($parametros->arrayautores[0])) {
            foreach ($parametros->arrayautores as $autor) {
                $arrayautoresact[]['idusuariocrea'] = $autor->idautor;
            }
        }
        //en caso de que no se este filtrando por autores e involucrados
        if (!isset($parametros->arrayinvolucrados[0])
            && !isset($parametros->arrayautores[0])
        ) {
            if ($parametros->personal || $parametros->busqueda) {
                $arrayinvolact[]['llaveinvolucrado']
                    = $parametros->idusuariosession . $cero;
                $arrayinvolact[]['llaveinvolucrado']
                    = $parametros->idusuariosession . $uno;
                $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $parametros->idusuariosession
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $cero;
                        $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $uno;
                    }
                }
            } else {
                $arrayinvolact[]['llaveinvolucrado']
                    = $parametros->idcalendario . $cero;
                $arrayinvolact[]['llaveinvolucrado']
                    = $parametros->idcalendario . $uno;
                $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $parametros->idcalendario
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $cero;
                        $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $uno;
                    }
                }
            }
        }
        //si se filtra por categoria o tipo de actividad
        if (isset($parametros->arraycategoriasact[0])) {
            foreach ($parametros->arraycategoriasact as $categ) {
                $arraynom[]['idnomenclador'] = $categ->idcategoria;
            }
        }
        if (isset($parametros->arraytipoact[0])) {
            foreach ($parametros->arraytipoact as $tipo) {
                $arraynom[]['idnomenclador'] = $tipo->idtipoactividad;
            }
        }
        $arrayactividadescalendario = DatElementos::DameActivdiadesCalendario(
            $parametros->fechainicio, $parametros->fechafin, $arrayinvolact,
            $arrayautoresact,
            $arraynom, $arrayestados, $parametros->arrayelementostributa
        );
        if (isset($arrayactividadescalendario[0])) {
            $arrayactcalendario = array();
            foreach ($arrayactividadescalendario as $key => $actividad) {
                //$colorcategoria = '';
                $color = $actividad['color'];
                if ($color) {
                    $colorcategoria = "#" . $color;
                } else {
                    $colorcategoria = "#FFFFFF";
                }
                $fechainicio = explode('/', $actividad['fechainicio']);
                $fechafin = explode('/', $actividad['fechafin']);
                $startdatelegible
                    = $fechainicio[1] . '/' . $fechainicio[0] . '/'
                    . $fechainicio[2];
                $enddatelegible
                    = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($actividad['idusuariocrea']
                    != $parametros->idusuariosession
                ) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $parametros->idusuariosession,
                        $actividad['idusuariocrea']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                    }
                    $subordinado
                        = $this->pIntegrator->configuracionpdo->existeSubordinacion(
                        $parametros->idusuariosession,
                        $actividad['idusuariocrea']
                    );
                }
                if ($utilizacionFT) {
                    $arraypermisos = array();
                    $arraypermisos
                        = $this->pIntegrator->workflow->obtenerPermisosPostAccion(
                        $parametros->idusuariosession,
                        $actividad['idestadoaprob'], $idtipoelemento = 3
                    );
                    $modificar = $arraypermisos['modificar'];
                    $eliminar = $arraypermisos['eliminar'];
                }
                $arrayactcalendario[$key]['id'] = $actividad['idelemento'];
                $arrayactcalendario[$key]['subject']
                    = $actividad['denelemento'];
                $horainicio = $this->ConvertirHora(
                    'militar', $actividad['horainicio']
                );
                $horafin = $this->ConvertirHora(
                    'militar', $actividad['horafin']
                );
                $arrayactcalendario[$key]['startdate']
                    = $startdatelegible . ' ' . $horainicio;
                $arrayactcalendario[$key]['enddate']
                    = $enddatelegible . ' ' . $horafin;
                $arrayactcalendario[$key]['color'] = $colorcategoria;

                $arrayactcalendario[$key]['idelemento']
                    = $actividad['idelemento'];
                $arrayactcalendario[$key]['categoria']
                    = $actividad['categoria'];
                $arrayactcalendario[$key]['lugar'] = $actividad['lugar'];
                $arrayactcalendario[$key]['participan']
                    = $actividad['participante'];
                $arrayactcalendario[$key]['modificar'] = $modificar;
                $arrayactcalendario[$key]['eliminar'] = $eliminar;
                $arrayactcalendario[$key]['activo'] = $actividad['activo'];
                $arrayactcalendario[$key]['estadocump']
                    = $actividad['estadocumpl'];
                $arrayactcalendario[$key]['gradocump']
                    = $actividad['gradocumplimiento'];
                $arrayactcalendario[$key]['superior'] = $superior;
                $arrayactcalendario[$key]['idautor']
                    = $actividad['idusuariocrea'];
                $arrayactcalendario[$key]['subordinado']
                    = $subordinado;//$actividad['subordinado'];
                //$contact ++;
            }
        }
        return $arrayactcalendario;
    }

    function ConvertirHora($convertirtipohora, $hora)
    {
        if ($convertirtipohora == 'militar') {
            $cadenahora = explode(' A', $hora);
            if ($cadenahora[1]) {

                $caden = explode(':', $cadenahora[0]);

                if (($caden[0] * 1) < 10) {
                    $hora = '0' . $cadenahora[0];
                } else {
                    if (($caden[0] * 1) == 12) {
                        $hora = '00' . $caden[1];
                    }
                }
            } else {
                $cadenahor = explode(' P', $hora);
                if ($cadenahor[1]) {
                    $cadenahoraini = explode(':', $cadenahor[0]);
                    switch ($cadenahoraini[0]) {
                        case '01':
                            $hora = '13:' . $cadenahoraini[1];
                            break;
                        case '02':
                            $hora = '14:' . $cadenahoraini[1];
                            break;
                        case '03':
                            $hora = '15:' . $cadenahoraini[1];
                            break;
                        case '04':
                            $hora = '16:' . $cadenahoraini[1];
                            break;
                        case '05':
                            $hora = '17:' . $cadenahoraini[1];
                            break;
                        case '06':
                            $hora = '18:' . $cadenahoraini[1];
                            break;
                        case '07':
                            $hora = '19:' . $cadenahoraini[1];
                            break;
                        case '08':
                            $hora = '20:' . $cadenahoraini[1];
                            break;
                        case '09':
                            $hora = '21:' . $cadenahoraini[1];
                            break;
                        case '10':
                            $hora = '22:' . $cadenahoraini[1];
                            break;
                        case '11':
                            $hora = '23:' . $cadenahoraini[1];
                            break;
                        case '12':
                            $hora = '00:' . $cadenahoraini[1];
                            break;
                    }
                }
            }
        } else {
            $cadenahora = explode(':', $hora);
            if (($cadenahora[0] * 1) < 13) {
                $hora = $cadenahora[0] . ':' . $cadenahora[1] . ' AM';
            } else {
                switch ($cadenahora[0]) {
                    case '13':
                        $hora = '01:' . $cadenahora[1] . ' PM';
                        break;
                    case '14':
                        $hora = '02:' . $cadenahora[1] . ' PM';
                        break;
                    case '15':
                        $hora = '03:' . $cadenahora[1] . ' PM';
                        break;
                    case '16':
                        $hora = '04:' . $cadenahora[1] . ' PM';
                        break;
                    case '17':
                        $hora = '05:' . $cadenahora[1] . ' PM';
                        break;
                    case '18':
                        $hora = '06:' . $cadenahora[1] . ' PM';
                        break;
                    case '19':
                        $hora = '07:' . $cadenahora[1] . ' PM';
                        break;
                    case '20':
                        $hora = '08:' . $cadenahora[1] . ' PM';
                        break;
                    case '21':
                        $hora = '09:' . $cadenahora[1] . ' PM';
                        break;
                    case '22':
                        $hora = '10:' . $cadenahora[1] . ' PM';
                        break;
                    case '23':
                        $hora = '11:' . $cadenahora[1] . ' PM';
                        break;
                    case '00':
                        $hora = '12:' . $cadenahora[1] . ' PM';
                        break;
                }
            }
        }
        return $hora;
    }

    /**
     * Funcion para cargar las actividades
     */
    public function CargarActividades(
        $idactividad, $idusuario, /*$iddominio, $certificado,*/
        $idelementotributa,
        $denominacion, $fechainicio, $fechafin,
        $enaprobacion, $estadoaprob, $arrayautores, $arrayinvolucrados,
        $categact, $tipoact, $car, $start, $limit, $idtipoelementotributa,
        $idtipoelementotributasuperior, $busqueda, $arrayelementosrelacionados
    ) {
        if ($estadoaprob != null) {
            $arrayestados['data'][0]['idestado'] = $estadoaprob;
        } else {
            $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuario, $idtipodoc = 3
            );
        }
        $cero = 0;
        $uno = 1;
        if (isset($arrayinvolucrados[0])) {
            foreach ($arrayinvolucrados as $involucrado) {
                $id = $involucrado->idusuario;
                if ($involucrado->tipo == 0) {
                    $id = $involucrado->idgrupo;
                }
                $arrayinvolact[]['llaveinvolucrado'] = $id . $cero;
                $arrayinvolact[]['llaveinvolucrado'] = $id . $uno;
                if ($involucrado->tipo == 1) {
                    $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $id
                    );
                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayinvolact[]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $cero;
                            $arrayinvolact[]['llaveinvolucrado']
                                = $grupo['idgrupo'] . $uno;
                        }
                    }
                }
            }
        }
        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $autor) {
                $arrayautoresact[]['idusuariocrea'] = $autor->idusuario;
            }
        }
        //aqui empiezo a definir las posibles cmbinaciones para obtener 
        //arreglo de inv y autores cuanod estos no vienen del client
        if (!isset($arrayautores[0]) && !isset($arrayinvolucrados[0])) {
            if ($enaprobacion == 0) {
                $arrayautoresact[]['idusuariocrea'] = $idusuario;
                $arrayinvolact[]['llaveinvolucrado'] = $idusuario . $cero;
                $arrayinvolact[]['llaveinvolucrado'] = $idusuario . $uno;
                $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $idusuario
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $cero;
                        $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $uno;
                    }
                }
            } else {
                $arrayautoresact[]['idusuariocrea'] = $idusuario;
                $permisosubordinados
                    = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
                    $idusuario
                );
                if (isset($permisosubordinados[0])) {
                    foreach ($permisosubordinados as $subordinado) {
                        $arrayautoresact[]['idusuariocrea']
                            = $subordinado['idpsobre'];
                    }
                }
            }
        }
        $objdatelementos = new DatElementos();
        $arrayactividades = $objdatelementos->CargarActividades(
            $idactividad, $idusuario, $idelementotributa, $denominacion,
            $fechainicio, $fechafin, $arrayautoresact,
            $arrayinvolact, $categact, $tipoact, $car, $start, $limit,
            $idtipoelementotributa,
            $idtipoelementotributasuperior, $arrayestados, $busqueda,
            $arrayelementosrelacionados
        );
        if (isset($arrayactividades['resultado'])) {
            foreach ($arrayactividades['resultado'] as $key => $actividad) {
                $parent = null;
                if ($idactividad) {
                    $parent = $idactividad;
                }
                $leaf = true;
                $tienehijos = $objdatelementos->CargarActividades(
                    $actividad['idelemento'], $idusuario, $idelementotributa,
                    $denominacion, $fechainicio, $fechafin, $arrayautoresact,
                    $arrayinvolact, $categact, $tipoact, $car, $start, $limit,
                    $idtipoelementotributa,
                    $idtipoelementotributasuperior, $arrayestados, $busqueda,
                    $arrayelementosrelacionados
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($actividad['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuario, $actividad['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($actividad['idestadoaprob'] != null) {
                    $arrayestadosaprob
                        = $this->pIntegrator->workflow->DenomEstado(
                        $actividad['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $arrayactividades['resultado'][$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $actividad['idautor']
                );
                $arrayactividades['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayactividades['resultado'][$key]['_parent'] = $parent;
                $arrayactividades['resultado'][$key]['superior'] = $superior;
                $arrayactividades['resultado'][$key]['subordinado']
                    = $subordinado;
                $arrayactividades['resultado'][$key]['modificar'] = $modificar;
                $arrayactividades['resultado'][$key]['eliminar'] = $eliminar;
                $arrayactividades['resultado'][$key]['estadocumplimiento']
                    = $actividad['estadocumplimiento'] . "("
                    . $actividad['gradocumplimiento'] . "%)";
                $arrayactividades['resultado'][$key]['nombreestadoaprob']
                    = $nombreestadoapro;
                $arrayactividades['resultado'][$key]['observaciones']
                    = $actividad['observaciones'];
            }
        }
        return $arrayactividades;
    }

    /**
     * Funcion para adicionar las actividades
     */
    public function AdicionarActividad($parametros)
    {
        $procede = 1;
        if ($parametros->eshija == 1) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                $parametros->idactividadpadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        if ($procede == 1) {
            $objelemmodel = new CmpgestionarelementoModel();
            $estadoaprobpordefcto = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                $parametros->idusuariocrea, $idtipodocumento = 3
            );
            //validar si retorna null....
            $estadocumplimiento = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $parametros->gradocumplimiento
            );
            //se crea el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();
            $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                $parametros->denelemento, $parametros->descelemento,
                $parametros->gradocumplimiento, $parametros->idtipoelemento,
                $activo = 1, $estadocumplimiento, $estadoaprobpordefcto,
                $parametros->idusuariocrea, $parametros->dirigentes,
                $parametros->participantes
            );
            //se procede a crear la relacion padre-hijo
            if ($parametros->eshija == 1) {
                $idautorelemento = $elementopadre->idusuariocrea;
                if ($parametros->idusuariocrea == $idautorelemento) {
                    $origen = 0;
                } else {
                    $origen = 3;
                }
                $objelemelem = new DatElementosDatElementos();
                $objelemelem->idelementopadre = $parametros->idactividadpadre;
                $objelemelem->idelementohijo = $datelemento->idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $parametros->idusuariocrea;
                $objelemelem->save();
            }
            //se crea el objeto 'nomenclador-elemento' y se registra
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                /*$elemnomcateg =*/
                $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $parametros->idcategoria, $tiponomenclador = 2
                );
            }
            if ($parametros->idtipo) {
                /*$elemnomtipo =*/
                $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $parametros->idtipo, $tiponomenclador = 3
                );
            }
            //se crea el objeto 'actividad' y se registra
            $datactividad = new DatActividades();
            $datactividad->idactividad = $datelemento->idelemento;
            $datactividad->fechainicio
                = $parametros->fechainicio;//adddate($fechainicio);
            $datactividad->fechafin
                = $parametros->fechafin;//$this->adddate($fechafin);
            $datactividad->horainicio = $parametros->hora;
            $datactividad->horafin = $parametros->horafin;
            $datactividad->lugar = $parametros->lugar;
            $datactividad->esprincipal = $parametros->principal;
            $datactividad->save();
            //se relacionan los involucrados al elemento o actividad
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                $parametros->arrayinvolucrados, $datelemento->idelemento,
                $parametros->idtipoelemento
            );
            //se relacionan los elementos relacionados
            $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                $datelemento->idelemento, $parametros->idtipoelemento,
                $parametros->arrayelementosrelacionados,
                $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
            );
            //procedo a crear las repeticiones de actividad
            if (isset($parametros->arrayrepeticiones[0])) {
                $this->AdicionarRepeticionesActividad(
                    $parametros->arrayelementosrelacionados, $datelemento,
                    $datactividad, $parametros->arrayrepeticiones,
                    $parametros->arrayinvolucrados, $parametros->idcategoria,
                    $parametros->idtipo, $estadocumplimiento,
                    $parametros->principal, $parametros->idusuariocrea
                );
            }
            if ($parametros->retornar == 1) {
                return $datactividad;
            }
        }
        return $procede;
    }

    /**
     * Funcion para modificar la actividad
     */
    public function ModificarActividad($parametros)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find(
            $parametros->idactividad
        );
        if (isset($objelemento->idelemento)) {
            $objelemmodel = new CmpgestionarelementoModel();
            $objelementoo = $objelemmodel->ModificarElemento(
                $objelemento->idelemento, $parametros->denelemento,
                $parametros->descelemento,
                $parametros->gradocumplimiento, $parametros->dirigentes,
                $parametros->participantes
            );
            $objactividad = Doctrine::getTable('DatActividades')->find(
                $parametros->idactividad
            );
            $objactividad->fechainicio = $parametros->fechainicio;
            $objactividad->fechafin = $parametros->fechafin;
            $objactividad->horainicio = $parametros->hora;
            $objactividad->horafin = $parametros->horafin;
            $objactividad->lugar = $parametros->lugar;
            $objactividad->esprincipal = $parametros->principal;
            $objactividad->save();
            //obtengo relacion con nomencladores y modifico
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                /* $elemnomcateg = */
                $objelemnom->ModificarRelacionNomElem(
                    $objelementoo, $parametros->idcategoria,
                    $tiponomenclador = 2
                );
            }
            if ($parametros->idtipo) {
                /*$elemnomtipo =*/
                $objelemnom->ModificarRelacionNomElem(
                    $objelementoo, $parametros->idtipo, $tiponomenclador = 3
                );
            }
            //obtengo todas las repticiones
            $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
                $idsubsistema = 15, $parametros->idusuariocrea, $idtipodoc = 3
            );
            $arrayestados = array();
            if (isset($arrayestadosverdoc['data'][0])) {
                foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                    $arrayestados[]['idestado'] = $estado['idestado'];
                }
            }
            $arrayrepeticiones = DatElementos::ObtenerRepeticiones(
                $parametros->idactividad, $arrayestados
            );
            if (isset($arrayrepeticiones[0])) {
                foreach ($arrayrepeticiones as $key => $repeticion) {
                    $objelementorep = Doctrine::getTable('DatElementos')->find(
                        $repeticion['idelemento']
                    );
                    if (isset($objelementorep->idelemento)) {
                        $objelementorep->denelemento = $parametros->denelemento;
                        $objelementorep->descelemento
                            = $parametros->descelemento;
                        $objelementorep->dirigente = $parametros->dirigentes;
                        $objelementorep->participante
                            = $parametros->participantes;
                        $objelementorep->save();
                        //obtengo relacion con nomencladores y modifico
                        /*$objelemnomrep = */
                        new DatElementosNomNomencladorModel();
                        if ($parametros->idcategoria) {
                            /*$elemnomcategrep
                                = */
                            $objelemnom->ModificarRelacionNomElem(
                                $objelementorep, $parametros->idcategoria,
                                $tiponomenclador = 2
                            );
                        }
                        if ($parametros->idtipo) {
                            /* $elemnomtiporep
                                 =*/
                            $objelemnom->ModificarRelacionNomElem(
                                $objelementorep, $parametros->idtipo,
                                $tiponomenclador = 3
                            );
                        }
                        $objactrep = Doctrine::getTable('DatActividades')->find(
                            $repeticion['idelemento']
                        );
                        $objactrep->esprincipal = $parametros->esprincipal;
                        if ($repeticion['tiporepeticion'] == 1) {
                            $objactrep->lugar = $parametros->lugar;
                            $objactrep->horainicio = $parametros->hora;
                            $objactrep->horafin = $parametros->horafin;
                            $objactrep->save();
                        }
                    }
                }
            }
            //actualizo las asignaciones
            $this->ActualizarReasignaciones(
                $objelementoo, $objactividad, $parametros->idcategoria,
                $parametros->idtipo
            );
            $respuesta = 1;
        } else {
            $respuesta = 3;
        }
        return $respuesta;
    }

    /**
     * Funcion para eliminar las actividades
     */
    public function EliminarActividades($arrayidactividades, $idusuariosession)
    {
        foreach ($arrayidactividades as $idactividad) {
            $noeliminados = 0;
            $respuesta = 1;
            $objelemento = Doctrine::getTable('DatElementos')->find(
                $idactividad
            );
            if (isset($objelemento->idelemento)) {
                $arrayrepeticiones
                    = DatElementosDatElementos::ObtenerRepeticiones(
                    $idactividad
                );
                if (isset($arrayrepeticiones[0])) {
                    foreach ($arrayrepeticiones as $repeticion) {
                        $objelementorep = Doctrine::getTable('DatElementos')
                            ->find($repeticion['idelementohijo']);
                        if (isset($objelementorep->idelemento)) {
                            $objelementorep->delete();
                        }
                    }
                }
                //obtengo y elimino las asignaciones
                $this->EliminarReasignaciones($objelemento, $idusuariosession);
                $objcmpelementosmodel = new CmpgestionarelementoModel();
                /*$mensaje =*/
                $objcmpelementosmodel->EliminarElementos(
                    $arrayidactividades
                );
            } else {
                $noeliminados++;
            }
        }
        if ($noeliminados > 0 && $noeliminados == count($arrayidactividades)) {
            $respuesta = 0;
        }
        return $respuesta;
    }

    /**
     * Funcion de trabajo con fecha para el plan
     */
    function adddate($fecha)
    {
        $data = explode("/", $fecha);
        $date = new DateTime();
        $date->setDate($data[2], $data[1], $data[0]);
        $format = $this->global->Formato->fecha;
        $day = $date->format("$format");
        return $day;
    }

    /**
     * Funcion para eliminar las repeticiones de una determinada actividad
     */
    public function EliminarRepeticiones($idactividad, $arrayrepeticiones)
    {
        $existeactividad = Doctrine::getTable('DatActividades')->find(
            $idactividad
        );
        if (isset($existeactividad->idactividad)) {
            if (isset($arrayrepeticiones[0])) {
                $contrepnoexistentes = 0;
                foreach ($arrayrepeticiones as $key => $repeticion) {
                    $objrepeticion = Doctrine::getTable('DatElementos')->find(
                        $repeticion->idactividad
                    );
                    if (isset($objrepeticion->idelemento)) {
                        $objrepeticion->delete();
                    } else {
                        $contrepnoexistentes++;
                    }
                }
                $totalrepeticiones = $key + 1;
                $respuesta = 1;//relaciones eliminadas correctamentes
                if ($contrepnoexistentes > 0) {
                    if ($totalrepeticiones == 1) {
                        $respuesta = 3;
                    }//no existe la repeticion
                }
            }
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    public function AdicionarRepeticionesActividad(
        $arrayrelaciones, $elemento, $actividad, $arrayrepeticiones,
        $arrayinvolucrados, $categoriaactividad, $tipoactividad,
        $estadocumplimiento/*, $esprincipal, $idautorrelacion*/
    )
    {
        if (isset($arrayrepeticiones[0])) {
            foreach ($arrayrepeticiones as $repeticion) {
                //se crea el objeto 'elemento' y se registra
                $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();
                $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                    $elemento->denelemento, $elemento->descelemento,
                    $elemento->gradocumplimiento, $elemento->idtipoelemento,
                    $activo = 1, $estadocumplimiento, $elemento->idestadoaprob,
                    $elemento->idusuariocrea, $elemento->dirigente,
                    $elemento->participante
                );
                //se crea el objeto 'nomenclador-elemento' y se registra
                $objelemnom = new DatElementosNomNomencladorModel();
                if ($categoriaactividad) {
                    /*$elemnomcateg =*/
                    $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $categoriaactividad, $tiponomenclador = 2
                    );
                }
                if ($tipoactividad) {
                    /*$elemnomtipo =*/
                    $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $tipoactividad, $tiponomenclador = 3
                    );
                }
                $horainicio = $repeticion->hora;
                $horafin = $repeticion->horafin;
                $lugar = $repeticion->lugar;
                //se relacionan los involucrados al elemento o actividad
                if ($repeticion->tiporepeticion == 1) {
                    $horainicio = $actividad->horainicio;
                    $horafin = $actividad->horafin;
                    $lugar = $actividad->lugar;
                    $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                        $arrayinvolucrados, $datelemento->idelemento,
                        $datelemento->idtipoelemento
                    );
                } else {
                    $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                        $repeticion->involucrados, $datelemento->idelemento,
                        $datelemento->idtipoelemento
                    );
                }
                //se crea el objeto 'actividad' y se registra
                $datactividad = new DatActividades();
                $datactividad->idactividad = $datelemento->idelemento;
                $datactividad->fechainicio
                    = $repeticion->fechainicio;//adddate($fechainicio);
                $datactividad->fechafin
                    = $repeticion->fechafin;//$this->adddate($fechafin);
                $datactividad->horainicio = $horainicio;//$repeticion->hora;
                $datactividad->horafin = $horafin;//$repeticion->horafin;
                $datactividad->lugar = $lugar;//$repeticion->lugar;
                $datactividad->tiporepeticion = $repeticion->tiporepeticion;
                $datactividad->esprincipal = $actividad->esprincipal;
                $datactividad->save();
                //se relacionan los elementos relacionados
                $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                    $datelemento->idelemento, $datelemento->idtipoelemento,
                    $arrayrelaciones, $parentrelacidelemento = 'hijo',
                    $datelemento->idusuariocrea
                );
                $objelemelemmodel = new DatElementosDatElementos();
                $objelemelemmodel->idelementopadre = $elemento->idelemento;
                $objelemelemmodel->idelementohijo = $datelemento->idelemento;
                $objelemelemmodel->origen = 4;
                $objelemelemmodel->idautor = $elemento->idusuariocrea;
                $objelemelemmodel->save();
            }
        }
    }

    public function ModificarRepeticion(
        $fechainicio, $fechafin, $horainicio, $horafin, $lugar, $tiporepeticion,
        $idactividad, $idactrepeticion/*, $arrayinvolucrados*/
    )
    {
        $objactividad = Doctrine::getTable('DatActividades')->find(
            $idactividad
        );
        if (isset($objactividad->idactividad)) {
            $objactrepeticion = Doctrine::getTable('DatActividades')->find(
                $idactrepeticion
            );
            if (isset($objactrepeticion->idactividad)) {
                $objactrepeticion->fechainicio = $fechainicio;
                $objactrepeticion->fechafin = $fechafin;
                $objactrepeticion->horainicio = $horainicio;
                $objactrepeticion->horafin = $horafin;
                $objactrepeticion->lugar = $lugar;
                $objactrepeticion->tiporepeticion = $tiporepeticion;
                $objactrepeticion->save();
                $respuesta = 1;
            } else {
                $respuesta = 3;
            }
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    public function ObtenerRepeticionesActividad(
        $idactividad, $idusuariosession
    ) {
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idsubsistema = 15, $idusuariosession, $idtipodoc = 3
        );
        $arrayestados = array();
        if (isset($arrayestadosverdoc['data'][0])) {
            foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                $arrayestados[]['idestado'] = $estado['idestado'];
            }
        }
        $arrayactiv = DatElementos::ObtenerRepeticiones(
            $idactividad, $arrayestados
        );
        $arrayact = array();
        if (isset($arrayactiv[0]['idelemento'])) {
            foreach ($arrayactiv as $key => $act) {
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
                if ($act['idusuariocrea'] != $idusuariosession) {
                    $superior = 1;
                    $objelemmodel = new DatElementosModel();
                    $estadoaprobpordefcto
                        = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                        $idsubsistema = 15, $idusuariosession,
                        $idtipodocumento = 3
                    );
                    if ($estadoaprobpordefcto == $act['idestadoaprob']) {
                        $entrada = 0;
                    }
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $act['idusuariocrea']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($entrada == 1) {
                    //verificando que el estado de aprobacion no sea el estado por
                    //defecto para las actividades de otras personas
                    $arrayact[$key]['identificador'] = $act['identificador'];
                    $arrayact[$key]['idactividad'] = $act['identificador'];
                    $arrayact[$key]['estadocumplimiento']
                        = $act['estadocumplimiento'] . '('
                        . $act['gradocumplimiento'] . '%)';
                    $arrayact[$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $act['idusuariocrea']
                    );
                    $arrayact[$key]['idautor'] = $act['idusuariocrea'];
                    $separador = '-';
                    $fechainicio = $act['fechai'];
                    $fechaI = $this->ConvertirFecha($fechainicio, $separador);
                    $fechafin = $act['fechaf'];
                    $fechaF = $this->ConvertirFecha($fechafin, $separador);
                    $arrayact[$key]['fechainicio'] = $fechaI;
                    $arrayact[$key]['fechafin'] = $fechaF;
                    $arrayact[$key]['hora'] = $act['hora'];
                    $arrayact[$key]['horafin'] = $act['horafin'];
                    $arrayact[$key]['lugar'] = $act['lugar'];
                    $arrayact[$key]['superior'] = $superior;
                    $arrayact[$key]['subordinado'] = $subordinado;
                    $arrayact[$key]['modificar'] = $modificar;
                    $arrayact[$key]['eliminar'] = $eliminar;
                    //$objelemmodel = new DatElementosDatInvolucradosModel();
                    $objclasificadorinvolmodel = new ClasificadorinvolModel();
                    $arrayact[$key]['involucrados']
                        = $objclasificadorinvolmodel->MostrarInvolucrados(
                        $act['identificador'], $idtipoelemento = 3
                    );//ObtenerInvolucradosPorElementos($act['identificador']);
                    $arraydatosmes = $this->ObtenerDatosMes($act['fechai']);
                    $arrayact[$key]['mes'] = $arraydatosmes['nombremes'];
                    $arrayact[$key]['numeroMes'] = $arraydatosmes['numeromes'];
                    $arrayact[$key]['tipoDeRep'] = 2;
                }
            }
        }
        return $arrayact;
    }

    public function ConvertirFecha($fecha, $tiposeparador)
    {
        switch ($tiposeparador) {
            case 'T':
                $fecha = explode('T', $fecha);
                list($annoinicio, $mesinicio, $diainicio) = explode(
                    '-', $fecha[0]
                );
                $numfecha = mktime(
                    0, 0, 0, $mesinicio, $diainicio, $annoinicio
                );
                $fechainstancia = date('d-m-Y', $numfecha);
                break;
            case '-':
                list($annoinicio, $mesinicio, $diainicio) = explode(
                    '-', $fecha
                );
                $numfecha = mktime(
                    0, 0, 0, $mesinicio, $diainicio, $annoinicio
                );
                $fechainstancia = date('d/m/Y', $numfecha);
                break;
        }
        return $fechainstancia;
    }

    public function ObtenerDatosMes($fecha)
    {
        $fecha = explode('-', $fecha);
        $numeromes = $fecha[1] * 1;
        $arraydatosmes['numeromes'] = $numeromes;
        switch ($numeromes) {
            case 1:
                $nombremes = 'Enero';
                break;
            case 2:
                $nombremes = 'Febrero';
                break;
            case 3:
                $nombremes = 'Marzo';
                break;
            case 4:
                $nombremes = 'Abril';
                break;
            case 5:
                $nombremes = 'Mayo';
                break;
            case 6:
                $nombremes = 'Junio';
                break;
            case 7:
                $nombremes = 'Julio';
                break;
            case 8:
                $nombremes = 'Agosto';
                break;
            case 9:
                $nombremes = 'Septiembre';
                break;
            case 10:
                $nombremes = 'Octubre';
                break;
            case 11:
                $nombremes = 'Noviembre';
                break;
            case 12:
                $nombremes = 'Diciembre';
                break;
        }
        $arraydatosmes['nombremes'] = $nombremes;
        return $arraydatosmes;
    }

    public function ActualizarReasignaciones(
        $objelemento, $objact, $idcategoria, $idtipo
    ) {
        $tienereasignaciones
            = DatElementosDatElementos::ObtenerReasignacionesDadoActividad(
            $objelemento->idelemento
        );
        if (isset($tienereasignaciones[0])) {
            foreach (
                $tienereasignaciones as /* $key =>*/
                $reasignacion
            ) {
                $existe = 0;
                $objelemreasig = Doctrine::getTable('DatElementos')->find(
                    $reasignacion['idelementohijo']
                );
                if (isset($objelemreasig->idelemento)) {
                    $existe = 1;
                    $objelemreasig->denelemento = $objelemento->denelemento;
                    $objelemreasig->descelemento = $objelemento->descelemento;
                    $objelemreasig->participante = $objelemento->participante;
                    $objelemreasig->dirigente = $objelemento->dirigente;
                    $objelemreasig->save();
                    //actualizo los  nomencladores relacionados a la actividad
                    $objelemnomreasig = new DatElementosNomNomencladorModel();
                    if ($idcategoria) {
                        /*$elemnomcategreasig
                            =*/
                        $objelemnomreasig->ModificarRelacionNomElem(
                            $objelemreasig, $idcategoria, $tiponomenclador = 2
                        );
                    }
                    if ($idtipo) {
                        /* $elemnomtiporeasig
                             =*/
                        $objelemnomreasig->ModificarRelacionNomElem(
                            $objelemreasig, $idtipo, $tiponomenclador = 3
                        );
                    }
                }
                $objactreasig = Doctrine::getTable('DatActividades')->find(
                    $reasignacion['idelementohijo']
                );
                if (isset($objactreasig->idactividad)) {
                    $existe = 1;
                    $objactreasig->fechainicio = $objact->fechainicio;
                    $objactreasig->fechafin = $objact->fechafin;
                    $objactreasig->lugar = $objact->lugar;
                    $objactreasig->horainicio = $objact->horainicio;
                    $objactreasig->horafin = $objact->horafin;
                    $objactreasig->esprincipal = $objact->esprincipal;
                    $objactreasig->save();
                }
                if ($existe == 1) {
                    $this->ActualizarReasignaciones(
                        $objelemreasig, $objactreasig, $idcategoria, $idtipo
                    );
                }

            }
        }
    }

    public function EliminarReasignaciones($objelemento, $idusuariosession)
    {
        $tienereasignaciones
            = DatElementosDatElementos::ObtenerReasignacionesDadoActividad(
            $objelemento->idelemento
        );
        if (isset($tienereasignaciones[0])) {
            foreach (
                $tienereasignaciones as /*$key =>*/
                $reasignacion
            ) {
                $arrayidactividades[] = $reasignacion['idelementohijo'];
            }
            $this->EliminarActividades($arrayidactividades, $idusuariosession);
        }
    }

}
