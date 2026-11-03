<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
//$address=dirname(dirname(__FILE__));
// $address=str_ireplace('o/plan/models','o/comun/recursos/',$address);
//require_once($address.'html2pdf.class.php');

class CmpgestionarpuntualizacionModel extends ZendExt_Model
{

    public function CmpgestionarpuntualizacionModel()
    {
        parent::ZendExt_Model();
    }

    public function getInvolucradosActividad($idelemento)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = " SELECT 
                      *
                    FROM
                      mod_objetivos.dat_elementos_dat_involucrados di
                      INNER JOIN mod_objetivos.dat_involucrados i 
                      ON (di.idinvolucrado = i.idinvolucrado)
                      WHERE di.idelemento= '$idelemento' ";
        $info = $conn->fetchAll($sql);
        return $info;
    }


    /**
     * Funcion para cambiar estado de las puntualizaciones
     */
    public function cambiarEstPuntualizacion($idusuariosession, $idestado, $arrayidpuntualizaciones)
    {
        $respuesta = 1;

        foreach ($arrayidpuntualizaciones as $elemento) {
            $puntualizacion = Doctrine::getTable('DatPuntualizacion')->find($elemento);
            $actividad_original = Doctrine::getTable('DatActividades')->find($puntualizacion->idactividad);
            $actividad_puntualizacion = Doctrine::getTable('DatActividades')->find($puntualizacion->idactividadpuntualizacion);
            $datelemento_puntualizacion = Doctrine::getTable('DatElementos')->find($puntualizacion->idactividadpuntualizacion);
            $datelemento_actividad_origen = Doctrine::getTable('DatElementos')->find($puntualizacion->idactividad);


            if ($idestado == $datelemento_actividad_origen->idestadoaprob) {

                //Notificacion
                //***historial***

                $parametros = new stdClass();
                $parametros->idactividad=$actividad_original->idactividad;
                $parametros->denelemento=$datelemento_actividad_origen->denelemento;
                $parametros->fechainicio=$actividad_original->fechainicio;
                $parametros->fechafin=$actividad_original->fechafin;
                $parametros->horainicio=$actividad_original->horainicio;
                $parametros->horafin=$actividad_original->horafin;
                $parametros->participante = $datelemento_actividad_origen->participante;
                $parametros->dirigente = $datelemento_actividad_origen->dirigente;
                $parametros->dirigente = $datelemento_actividad_origen->dirigente;
                $parametros->gradocumplimiento = $datelemento_actividad_origen->gradocumplimiento;

                $arrayinvolucrados=array();
                $parametros->arrayinvolucrados = self::getInvolucradosActividad($actividad_original->idactividad);
                foreach ($parametros->arrayinvolucrados as $involucrado) {
                    if($involucrado['idusuario']!=null){
                        $arrayinvolucrados[] = $involucrado['idusuario'];
                    }
                }

                $involucradoshisto = implode(',', $arrayinvolucrados);
                //***fin historial**
                $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
                $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
                    $parametros
                );
                $accion = 2;
                $idelemento = $puntualizacion->idactividad;
                $idtipoelemento = 3;
                $idautor = $idusuariosession;
                //$arrayinvol = $parametros->arrayinvolucrados;
                $fecha = date('d/m/Y H:i:s');
                $objNotificacion = new CmpnotificacionesModel();
                $objNotificacion->generarNotificacion(
                    $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
                );

                /***
                 * Sustituir datos de la puntualizacion en la actividad original
                 **/
                if ($puntualizacion->suspendida == 1) {
                    $actividad_original->suspendida = 1;
                    $actividad_original->save();

                    //***Generar notificacion de actividad suspendida***
                    $parametros->idactividad = $actividad_original->idactividad;
                    $parametros->fechainicio = $actividad_original->fechainicio;
                    $parametros->fechafin = $actividad_original->fechafin;
                    $parametros->horainicio = $actividad_original->horainicio;
                    $parametros->horafin = $actividad_original->horafin;
                    $parametros->lugar = $actividad_original->lugar;
                    $parametros->esprincipal = $actividad_original->esprincipal;
                    $parametros->tiempoestimado = $actividad_original->tiempoestimado;
                    $parametros->criterioevaluacion = $actividad_original->criterioevaluacion;
                    $parametros->categoria = $actividad_original->categoria;
                    $parametros->tipo = $actividad_original->tipo;
                    $parametros->duracion = $actividad_original->duracion;
                    $parametros->suspendida = $actividad_original->suspendida;

                    $parametros->idelemento = $datelemento_actividad_origen->idelemento;
                    $parametros->activo = $datelemento_actividad_origen->activo;
                    $parametros->denelemento = $datelemento_actividad_origen->denelemento;
                    $parametros->descelemento = $datelemento_actividad_origen->descelemento;
                    $parametros->gradocumplimiento = $datelemento_actividad_origen->gradocumplimiento;
                    $parametros->idtipoelemento = $datelemento_actividad_origen->idtipoelemento;
                    $parametros->idusuariocrea = $datelemento_actividad_origen->idusuariocrea;
                    $parametros->llevahistorial = $datelemento_actividad_origen->llevahistorial;
                    $parametros->privado = $datelemento_actividad_origen->privado;
                    $parametros->participante = $datelemento_actividad_origen->participante;
                    $parametros->dirigente = $datelemento_actividad_origen->dirigente;
                    $parametros->idestadoaprob = $datelemento_actividad_origen->idestadoaprob;
                    $parametros->estadocumplimiento = $datelemento_actividad_origen->estadocumplimiento;
                    $parametros->gennotificacion = $datelemento_actividad_origen->gennotificacion;
                    $parametros->fechacreacion = $datelemento_actividad_origen->fechacreacion;

                } else {
                    /******************
                     * Salvar en la tabla puntualizaciones aprobadas
                     ********************/
                    $puntualizacion_aprobada = new DatPuntualizacionAprobada();
                    $puntualizacion_aprobada->idactividad = $puntualizacion->idactividad;
                    $puntualizacion_aprobada->idautorpunt = $puntualizacion->idautorpunt;
                    $puntualizacion_aprobada->fechainicio = $actividad_puntualizacion->fechainicio;
                    $puntualizacion_aprobada->fechafin = $actividad_puntualizacion->fechafin;
                    $puntualizacion_aprobada->horainicio = $actividad_puntualizacion->horainicio;
                    $puntualizacion_aprobada->horafin = $actividad_puntualizacion->horafin;
                    $puntualizacion_aprobada->fechacreacionpunt = $puntualizacion->fechacreacionpunt;
                    $puntualizacion_aprobada->fechacontrolcambiopunt = $puntualizacion->fechacontrolcambiopunt;
                    $puntualizacion_aprobada->fechacontrolcambio = date('d/m/Y H:i:s', time());
                    $puntualizacion_aprobada->save();

                    $datelemento_actividad_origen->denelemento = $datelemento_puntualizacion->denelemento;
                    $datelemento_actividad_origen->gradocumplimiento = $datelemento_puntualizacion->gradocumplimiento;
                    $datelemento_actividad_origen->dirigente = $datelemento_puntualizacion->dirigente;
                    $datelemento_actividad_origen->llevahistorial = $datelemento_puntualizacion->llevahistorial;
                    $datelemento_actividad_origen->activo = $datelemento_puntualizacion->activo;
                    $datelemento_actividad_origen->privado = $datelemento_puntualizacion->privado;
                    $datelemento_actividad_origen->participante = $datelemento_puntualizacion->participante;
                    $datelemento_actividad_origen->estadocumplimiento = $datelemento_puntualizacion->estadocumplimiento;
                    $datelemento_actividad_origen->cantrelacdescorigen1 = $datelemento_puntualizacion->cantrelacdescorigen1;
                    $datelemento_actividad_origen->cantrelacdescorigen3 = $datelemento_puntualizacion->cantrelacdescorigen3;
                    $datelemento_actividad_origen->cantrelacdescorigen4 = $datelemento_puntualizacion->cantrelacdescorigen4;
                    $datelemento_actividad_origen->cantrelacascdcorigen0 = $datelemento_puntualizacion->cantrelacascdcorigen0;
                    $datelemento_actividad_origen->cantrelacascdcorigen1 = $datelemento_puntualizacion->cantrelacascdcorigen1;
                    $datelemento_actividad_origen->cantrelacascdcorigen3 = $datelemento_puntualizacion->cantrelacascdcorigen3;
                    $datelemento_actividad_origen->cantrelacascdcorigen4 = $datelemento_puntualizacion->cantrelacascdcorigen4;
                    $datelemento_actividad_origen->cantrelacdescorigen0 = $datelemento_puntualizacion->cantrelacdescorigen0;
                    $datelemento_actividad_origen->gennotificacion = $datelemento_puntualizacion->gennotificacion;
                    $datelemento_actividad_origen->cantobserv = $datelemento_puntualizacion->cantobserv;
                    $datelemento_actividad_origen->cantrelacdescorigen5 = $datelemento_puntualizacion->cantrelacdescorigen5;
                    $datelemento_actividad_origen->cantrelacascdcorigen5 = $datelemento_puntualizacion->cantrelacascdcorigen5;
                    $datelemento_actividad_origen->cantrelacdescorigen2 = $datelemento_puntualizacion->cantrelacdescorigen2;
                    $datelemento_actividad_origen->cantrelacascdcorigen2 = $datelemento_puntualizacion->cantrelacascdcorigen2;
                    $datelemento_actividad_origen->peso = $datelemento_puntualizacion->peso;
                    $datelemento_actividad_origen->actualizarporciento = $datelemento_puntualizacion->actualizarporciento;
                    $datelemento_actividad_origen->save();

                    $actividad_original->tiporepeticion = $actividad_puntualizacion->tiporepeticion;
                    $actividad_original->fechainicio = $actividad_puntualizacion->fechainicio;
                    $actividad_original->fechafin = $actividad_puntualizacion->fechafin;
                    $actividad_original->horainicio = $actividad_puntualizacion->horainicio;
                    $actividad_original->horafin = $actividad_puntualizacion->horafin;
                    $actividad_original->lugar = $actividad_puntualizacion->lugar;
                    $actividad_original->esprincipal = $actividad_puntualizacion->esprincipal;
                    $actividad_original->tiempoestimado = $actividad_puntualizacion->tiempoestimado;
                    $actividad_original->criterioevaluacion = $actividad_puntualizacion->criterioevaluacion;
                    $actividad_original->categoria = $actividad_puntualizacion->categoria;
                    $actividad_original->tipo = $actividad_puntualizacion->tipo;
                    $actividad_original->duracion = $actividad_puntualizacion->duracion;
                    $actividad_original->save();

                }
                $respuesta = 2;
            } else {
                $puntualizacion->fechacontrolcambiopunt = date('d/m/Y H:i:s', time());
                $puntualizacion->idestadoaprobpunt = $idestado;
                if ($actividad_original->fechafin < date('d/m/Y H:i:s', time())) {
                    $puntualizacion->ejecutada = 1;
                }
                $puntualizacion->save();
            }
        }
        return $respuesta;
    }

    /**
     * Funcion para adicionar las puntualizaciones
     */
    public function adicionarPuntualizacion($parametros)
    {

        $procede = 1;
        if ($parametros->eshija == 0) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                $parametros->idactividadpadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        if ($procede == 1) {
            $objelemmodel = new CmpgestionarelementoModel();
            if ($parametros->retornar == 1) {
                $estadoaprobpordefcto = $parametros->idestadoaprob;
            } else {
                $estadoaprobpordefcto
                    = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $parametros->idusuariocrea, $idtipodocumento = 3
                );
            }
            //validar si retorna null....
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $parametros->gradocumplimiento
            );
            //se crea el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
            $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                $parametros->denelemento, $parametros->descelemento,
                $parametros->gradocumplimiento, 7,
                $activo = 1, $estadocumplimiento, $estadoaprobpordefcto,
                $parametros->idusuariocrea, $parametros->dirigentes,
                $parametros->participantes, $parametros->autoManual,
                $parametros->peso
            );
            //se procede a crear la relacion padre-hijo
            if ($parametros->eshija == 1) {
                $idautorelemento = $elementopadre->idusuariocrea;
                $origen = 9;
                $objelemelem = new DatElementosDatElementos();
                $objelemelem->idelementopadre
                    = $parametros->idactividadpadre;
                $objelemelem->idelementohijo = $datelemento->idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $parametros->idusuariocrea;
                $objelemelem->porcientoinicio
                    = $parametros->gradocumplimiento;// $parametros->porcientoRe;
                $objelemelem->porcientoelemento = 100;
                $objelemelem->ponderacion
                    = 1; //($parametros->porcientoRe) / 10;

                $objelemelem->save();
            }

            //se crea el objeto 'nomenclador-elemento' y se registra
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                $elemnomcateg = $objelemnom->AdicionarRelacionNomElem(
                    $datelemento->idelemento, $parametros->idcategoria,
                    $tiponomenclador = 2
                );
            }

            if ($parametros->idtipo) {
                $elemnomtipo = $objelemnom->AdicionarRelacionNomElem(
                    $datelemento->idelemento, $parametros->idtipo, $tiponomenclador = 3
                );
            }
            //se crea el objeto 'actividad' y se registra
            $datactividad = new DatActividades();
            $datactividad->idactividad = $datelemento->idelemento;
            $datactividad->fechainicio
                = $parametros->fechainicio; //adddate($fechainicio);
            $datactividad->fechafin
                = $parametros->fechafin; //$this->adddate($fechafin);
            $datactividad->horainicio = $parametros->horainicio;
            $datactividad->horafin = $parametros->horafin;
            $datactividad->lugar = $parametros->lugar;
            $datactividad->esprincipal = $parametros->principal;
            $datactividad->tiempoestimado = ($parametros->tiempoestimado == '')
                ? 0 : $parametros->tiempoestimado;
            $datactividad->criterioevaluacion = $parametros->criterioeval;
            $datactividad->save();

            //  Guardando en la tabla Puntualizacion

            $datapuntualizacion = new DatPuntualizacion();
            $datapuntualizacion->idactividadpuntualizacion = $datelemento->idelemento;
            $datapuntualizacion->idactividad = $parametros->idactividadpadre;
            $datapuntualizacion->idautorpunt = $parametros->idusuariocrea;
            $datapuntualizacion->idestadoaprobpunt = $estadoaprobpordefcto;
            $datapuntualizacion->activa = 1;
            $datapuntualizacion->ejecutada = 0;
            if ($parametros->accion == 'Suspender') {
                $datapuntualizacion->suspendida = 1;
            }

            $datapuntualizacion->fechacreacionpunt = date('d/m/Y H:i:s', time());
            $datapuntualizacion->fechacontrolcambiopunt = date('d/m/Y H:i:s', time());
            $datapuntualizacion->save();


            $parametros->idactividad = $datelemento->idelemento;

            //se relacionan los involucrados al elemento o actividad
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                $parametros->arrayinvolucrados, $datelemento->idelemento,
                $parametros->idtipoelemento
            );
            if (isset($parametros->arrayelementosrelacionados)) {
                $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                    $datelemento->idelemento, $parametros->idtipoelemento,
                    $parametros->arrayelementosrelacionados,
                    $parentrelacidelemento = 'hijo',
                    $parametros->idusuariocrea
                );
            }

            if ($parametros->accion == 'Suspender') {
                /**
                 * Relaciones de la actividad origen con la punstualizacion a suspender
                 **/

                $elemento_suspender = Doctrine::getTable('DatElementos')->find(
                    $parametros->idelemento_suspender
                );

                $datelemento->cantrelacdescorigen1 = $elemento_suspender->cantrelacdescorigen1;
                $datelemento->cantrelacdescorigen3 = $elemento_suspender->cantrelacdescorigen3;
                $datelemento->cantrelacdescorigen4 = $elemento_suspender->cantrelacdescorigen4;
                $datelemento->cantrelacascdcorigen0 = $elemento_suspender->cantrelacascdcorigen0;
                $datelemento->cantrelacascdcorigen1 = $elemento_suspender->cantrelacascdcorigen1;
                $datelemento->cantrelacascdcorigen3 = $elemento_suspender->cantrelacascdcorigen3;
                $datelemento->cantrelacascdcorigen4 = $elemento_suspender->cantrelacascdcorigen4;
                $datelemento->cantrelacdescorigen0 = $elemento_suspender->cantrelacdescorigen0;
                $datelemento->cantrelacdescorigen5 = $elemento_suspender->cantrelacdescorigen5;
                $datelemento->cantrelacascdcorigen5 = $elemento_suspender->cantrelacascdcorigen5;
                $datelemento->cantrelacdescorigen2 = $elemento_suspender->cantrelacdescorigen2;
                $datelemento->cantrelacascdcorigen2 = $elemento_suspender->cantrelacascdcorigen2;
                $datelemento->participante = $elemento_suspender->participante;
                $datelemento->activo = $elemento_suspender->activo;
                $datelemento->privado = $elemento_suspender->privado;
                $datelemento->save();

            }

        }
        return $procede;
    }

    public function cargarPuntualizacion(
        $hijo, $idactividad, $idusuario, $idelementotributa, $arrayautores,
        $arrayinvolucrados, $categact, $tipoact, $start, $limit,
        $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados,
        $busqueda, $arrayelementosrelacionados, $filtros, $parametros
    )
    {
        if (isset($arrayautores[0]) || isset($arrayinvolucrados[0])) {
            if (isset($arrayautores)) {
                $arrayautores = implode(',', $arrayautores);
            }
            if (isset($arrayinvolucrados)) {
                $arrayinvolucrados = implode(',', $arrayinvolucrados);
            }
            $ifReorganizarIN = "";
            if (isset($parametros->reorganizar[0])) {
                $reorganizar = implode(',', $parametros->reorganizar);
                $ifReorganizar
                    = " AND (e.idelemento NOT IN (" . $reorganizar . ")) ";
                $ifReorganizarIN
                    = " AND (eg.idelemento NOT IN (" . $reorganizar . ")) ";
            }

            $connA = Doctrine_Manager:: connection();
            $cadenaautoresinvol = $this->CrearCadenaAutorOrigen(
                'e', $arrayautores, $arrayinvolucrados
            );
            $cadenarelacion = '';
            //cadena sql con los estados en que puedo ver el documento
            $cadenaestados = '  ';
            if (isset($arrayestados[0])) {
                $cadenaestados
                    = " AND (e.idestadoaprob IN (" . $arrayestados . ")) ";
            }
            //query con sintaxis general a usar en todos los casos
            $cadena
                = "SELECT distinct(e.idelemento),e.denelemento AS denominacion,
                    e.descelemento,e.llevahistorial, e.idestadoaprob,
                    e.estadocumplimiento,e.gradocumplimiento,e.activo,
                    e.idusuariocrea AS idautor,e.participante AS participantes,
                    a.fechainicio, e.cantobserv AS observaciones,a.horainicio,
                    a.fechafin,e.fechacreacion,e.cantobserv AS observaciones,
                    e.cantrelacdescorigen0,e.cantrelacdescorigen2,
                    dep.idelementohijo,
                    a.tiporepeticion,e.actualizarporciento,
                    FROM mod_objetivos.dat_elementos e
                    INNER JOIN mod_objetivos.dat_actividades a
                    ON a.idactividad = e.idelemento INNER JOIN mod_objetivos.dat_elementos_dat_elementos dep
                    ON dep.idelementopadre = e.idelemento
                    WHERE dep.origen=9";


            $filtrofechas = 0;
            if (isset($arrayelementosrelacionados[0])) {
                $cadenarelacion .= "(";
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON ei.idelemento = e.idelemento ";
                $inneree = 0;
                $innerapa = 0;
                $existetipoelCicta = 0;
                $existereldifCicta = 0;
                foreach (
                    $arrayelementosrelacionados as $key => $elementorelacionado
                ) {
                    if ($elementorelacionado->tipoelemento == 50) {
                        $existetipoelCicta = 1;
                        $idarc = $elementorelacionado->idarc;
                        $idplan = $elementorelacionado->idplan;
                        if ($key != 0) {
                            $cadenarelacion .= " OR ";
                        }
                        $cadenarelacion
                            .= " (apa.idarc = '$idarc'
                            AND apa.idplan = '$idplan') ";
                    } else {
                        $existereldifCicta = 1;
                        $idelementopadre = $elementorelacionado->idplan;
                        if ($elementorelacionado->tipoelemento == 1) {
                            $idelementopadre = $elementorelacionado->idobjetivo;
                        }
                        if ($elementorelacionado->tipoelemento == 2) {
                            $idelementopadre = $elementorelacionado->idfip;
                        }
                        if ($elementorelacionado->tipoelemento == 6) {
                            $idelementopadre
                                = $elementorelacionado->iddesviacion;
                        }
                        if ($key != 0) {
                            $cadenarelacion .= " OR ";
                        }
                        $cadenarelacion .= " (ee.idelementopadre = '$idelementopadre') ";
                    }
                }
                $muletilla = ' INNER ';
                if ($existetipoelCicta && $existereldifCicta) {
                    $muletilla = ' LEFT ';
                }
                if ($existetipoelCicta) {
                    $cadena .= $muletilla
                        . "JOIN mod_objetivos.dat_arc_dat_plan_actividades apa
                            ON apa.idactividad = a.idactividad ";
                }
                if ($existereldifCicta) {
                    $cadena .= $muletilla
                        . "JOIN mod_objetivos.dat_elementos_dat_elementos ee
                            ON e.idelemento = ee.idelementohijo ";
                }
                $cadenarelacion .= ")";
                $cadena .= " WHERE ";
                $wherefiltro = "";
                $cadena .= $cadenarelacion;
                if ($filtros) {
                    $busqueda = 1;
                    foreach ($filtros as $datos) {
                        if ($datos ['field'] == 'idelemento') {
                            $cadena = $cadena . "AND e.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                            $wherefiltro .= " AND eg.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                        } elseif ($datos ['field'] == 'denominacion') {
                            $cadena
                                = $cadena . " AND upper(e.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                            $wherefiltro .= " AND upper(eg.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                        } elseif ($datos ['field'] == 'fechainicio') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            //la fecha como un entero
                            $arrayfechainicio = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechainicio = explode('-', $arrayfechainicio[0]);
                            $cadena = $cadena . " AND a.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                            $wherefiltro .= " AND act.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                        } elseif ($datos ['field'] == 'fechafin') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            //la fecha como un entero
                            $arrayfechafin = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechafin = explode('-', $arrayfechafin[0]);
                            $cadena = $cadena . " AND a.fechafin {$cond} '"
                                . $fechafin[0] . '-' . $fechafin[1] . '-'
                                . $fechafin[2] . "'";
                            $wherefiltro
                                .= " AND act.fechafin {$cond} '" . $fechafin[0]
                                . '-' . $fechafin[1] . '-' . $fechafin[2] . "'";
                        } elseif ($datos ['field'] == 'textocumplimiento') {
                            $cadena = $cadena
                                . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                        } elseif ($datos ['field'] == 'gradocumplimiento') {
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//menor
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//mayor
                                    $cond = ">";
                                }
                            }
                            $cadena
                                = $cadena . " AND e.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                            $wherefiltro .= " AND eg.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                        } elseif ($datos ['field'] == 'observaciones') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.cantobserv > '0' ";
                            } else {
                                $cadena = $cadena . " AND e.cantobserv = '0' ";
                            }
                        } elseif ($datos ['field'] == 'tienedependencias') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.idelemento IN
                                                (SELECT dep.idelementopadre
                                                FROM mod_objetivos.dat_elementos_dat_elementos dep
                                                WHERE dep.idelementopadre = e.idelemento
                                                AND dep.origen >= 6) ";
                            } else {
                                $cadena = $cadena . "AND e.idelemento NOT IN
                                                (SELECT dep.idelementopadre
                                                FROM mod_objetivos.dat_elementos_dat_elementos dep
                                                WHERE dep.idelementopadre = e.idelemento
                                                AND dep.origen >= 6) ";
                            }
                        }
                    }
                }
            } else {
                //creo la cadena a utilizar en todos los casos
                $cadena
                    .= " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados
                    ei ON e.idelemento = ei.idelemento ";
                $cadena .= " WHERE e.idtipoelemento = '7'";
                $wherefiltro = "";
                if ($filtros) {
                    $busqueda = 1;
                    foreach ($filtros as $datos) {
                        if ($datos ['field'] == 'idelemento') {
                            $cadena = $cadena . "AND e.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                            $wherefiltro .= " AND eg.uriidelemento LIKE '%"
                                . $datos ['data'] ['value'] . "%'";
                        } elseif ($datos ['field'] == 'denominacion') {
                            $cadena
                                = $cadena . " AND upper(e.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                            $wherefiltro .= " AND upper(eg.denelemento) LIKE '%"
                                . strtoupper($datos ['data'] ['value']) . "%'";
                        } elseif ($datos ['field'] == 'fechainicio') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            //la fecha como un entero
                            $arrayfechainicio = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechainicio = explode('-', $arrayfechainicio[0]);
                            $cadena = $cadena . " AND a.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                            $wherefiltro .= " AND act.fechainicio {$cond} '"
                                . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                                . $fechainicio[2] . "'";
                        } elseif ($datos ['field'] == 'fechafin') {
                            $filtrofechas = 1;
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//antes
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//despues
                                    $cond = ">";
                                }
                            }
                            //esto es necesario debido a que interpreta
                            //la fecha como un entero
                            $arrayfechafin = explode(
                                ' ', $datos ['data'] ['value']
                            );
                            $fechafin = explode('-', $arrayfechafin[0]);
                            $cadena = $cadena . " AND a.fechafin {$cond} '"
                                . $fechafin[0] . '-' . $fechafin[1] . '-'
                                . $fechafin[2] . "'";
                            $wherefiltro
                                .= " AND act.fechafin {$cond} '" . $fechafin[0]
                                . '-' . $fechafin[1] . '-' . $fechafin[2] . "'";
                        } elseif ($datos ['field'] == 'textocumplimiento') {
                            $cadena = $cadena
                                . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                            $wherefiltro
                                .= "
                                AND eg.estadocumplimiento = '{$datos ['data'] ['value']}'";
                        } elseif ($datos ['field'] == 'gradocumplimiento') {
                            $cond = " = ";
                            if ($datos ['data']['comparison'] == 'lt') {//menor
                                $cond = "<";
                            } else {
                                if ($datos ['data']['comparison'] == 'gt'
                                ) {//mayor
                                    $cond = ">";
                                }
                            }
                            $cadena
                                = $cadena . " AND e.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                            $wherefiltro .= " AND eg.gradocumplimiento {$cond} "
                                . ($datos ['data'] ['value'] * 1);
                        } elseif ($datos ['field'] == 'observaciones') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.cantobserv > '0' ";
                            } else {
                                $cadena = $cadena . " AND e.cantobserv = '0' ";
                            }
                        } elseif ($datos ['field'] == 'tienedependencias') {
                            if ($datos ['data'] ['value'] == 'Si') {
                                $cadena = $cadena . " AND e.idelemento IN
                                                (SELECT dep.idelementopadre
                                                FROM mod_objetivos.dat_elementos_dat_elementos dep
                                                WHERE dep.idelementopadre = e.idelemento
                                                AND dep.origen >= 6) ";
                            } else {
                                $cadena = $cadena . "AND e.idelemento NOT IN
                                                (SELECT dep.idelementopadre
                                                FROM mod_objetivos.dat_elementos_dat_elementos dep
                                                WHERE dep.idelementopadre = e.idelemento
                                                AND dep.origen >= 6) ";
                            }
                        }
                    }
                }
            }
            if ($filtrofechas == 0) {
                // del año actual
                $fechainicio = '01-01-' . date('Y');
                $fechafin = '31-12-' . date('Y');
                $cadena = $cadena . " AND (a.fechainicio >= '" . $fechainicio
                    . "' OR a.fechafin >= '" . $fechainicio . "') ";
                //if(!$filtros)
                $wherefiltro .= " AND (act.fechainicio >= '" . $fechainicio
                    . "' OR act.fechafin >= '" . $fechainicio . "') ";
                //a partir del dia de hoy
                /* $fechainicio = date('Y-m-d');
                  $cadena = $cadena." AND (a.fechainicio >= '".$fechainicio."'
                  OR  a.fechafin >= '".$fechainicio."') "; */
            }
            $cadena .= $cadenaautoresinvol . $ifReorganizar;
            if (isset($arrayestados[0])) {
                $cadena .= $cadenaestados;
            }
            $resultado['total'] = count($connA->execute($cadena)->fetchAll());
            print_r($cadena);
            die;
            if ($parametros->sort) {
                if ($parametros->sort != 'fechafin'
                    && $parametros->sort != 'fechainicio'
                    && $parametros->sort != 'textocumplimiento'
                    && $parametros->sort != 'observaciones'
                    && $parametros->sort != 'nombreautor'
                    && $parametros->sort != 'nombreestadoaprob'
                    && $parametros->sort != 'horainicio'
                    && $parametros->sort != 'horafin'
                ) {
                    $comparar = ($parametros->sort == 'denominacion')
                        ? "denelemento" : $parametros->sort;
                    $cadena .= " ORDER BY e.{$comparar} {$parametros->dir}";
                } else {
                    if ($parametros->sort == 'fechafin'
                        || $parametros->sort == 'fechainicio'
                    ) {
                        $cadena .= "ORDER BY a.{$parametros->sort} {$parametros->dir}";
                    }
                    if ($parametros->sort == 'horainicio'
                        || $parametros->sort == 'horafin'
                    ) {
                        $cadena .= "ORDER BY a.{$parametros->sort} {$parametros->dir}";
                    }
                }
            } else {
                $cadena .= " ORDER BY a.fechainicio ASC, a.horainicio ASC";
                //  $cadena .= " ORDER BY a.fechainicio DESC ";
            }
            $cadena .= " LIMIT(" . $limit . ") OFFSET(" . $start . ") ";
            $result = $connA->execute($cadena)->fetchAll();
            $resultado['resultado'] = $result;
        } else {
            $resultado['total'] = 0;
            $resultado['resultado'] = array();
        }
        return $resultado;
    }


}