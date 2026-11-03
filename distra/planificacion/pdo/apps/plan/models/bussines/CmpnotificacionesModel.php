<?php

/**
 * @author    Rodolfo Rodríguez
 * @version   1.0.0
 * @copyright ERP-CUBA
 */
class CmpnotificacionesModel extends ZendExt_Model
{

    public function CmpnotificacionesModel()
    {
        parent::ZendExt_Model();
    }

    public function cargarTipoNotificaciones()
    {
        $objAccion = new NomAccion();
        $result = $objAccion->GetTodos();
        return $result;
    }

    /**
     * Nombre de la función obtenerArrayUsuarios
     * Descripcion Permite obtener el array de los usuarios que pueden
     * ver la notificacion generada.
     *
     * @author * Ariadna Rendon Artola
     *
     * @param integer $idelemento - id del elemento que genera la
     *                                notificacion.
     * @param integer $idautorelem - id del usuario en seccion
     * @param integer $idtipoelemento - tipoelemento del elemento que genera
     *                                la notificacion.
     *
     * @return Array
     */
    public function obtenerArrayUsuarios(
        $idelemento, $idautorelem, $idtipoelemento, $idaccion, $sistema = 1
    )
    {
        $nameAtrib = 'idinvolucrado';
        if ($idaccion != 5) {
            if ($idtipoelemento == 0) {
                $objDatElemDatElem = new DatElementosDatElementos();
                $usuarios = $objDatElemDatElem->BuscarElementosHijo(
                    $idelemento
                );
                $nameAtrib = 'idautor';
            } elseif ($idtipoelemento == 4) {
                $objDatCriterio = new DatCriterioDatInvolucrados();
                $usuarios = $objDatCriterio->BuscarRelacionesDelCriterio(
                    $idelemento
                );
            } else {
                $objElemInv = new DatElementosDatInvolucradosModel();
                $usuarios = $objElemInv->ObtenerInvolucrados($idelemento);
            }
            $arrayusuarios = array();
            $objDatInvolucradosModel = new DatInvolucradosModel();
            if ($idtipoelemento != 0) {
                foreach ($usuarios as $key => $value) {
                    $invol = Doctrine::getTable('DatInvolucrados')->findByDql(
                        "idinvolucrado = $value[$nameAtrib]"
                    );
                    if (isset($invol)) {
                        if ($invol[0]->tipoinvolucrado == 0) {
                            $tieneusuarios
                                = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupoGU(
                                $invol[0]->idgrupo
                            );
                            if (isset($tieneusuarios[0])) {
                                foreach ($tieneusuarios as $index => $usuario) {
                                    $arrayusuarios[] = $usuario["idusuario"];
                                }
                            }
                        } else {
                            if ($sistema == null) {
                                $arrayusuarios[] = $value[$nameAtrib];
                            } else {
                                $arrayusuarios[] = $invol[0]->idusuario;
                            }
                        }
                    }
                }
            }
            $arrayusuarios = array_merge($arrayusuarios, array($idautorelem));
            $arrayusuarios = array_unique($arrayusuarios);
        }
        return $arrayusuarios;
    }

    /**
     * Nombre de la función cargarNotificaciones
     * Descripcion Permite cargar los datos de una notificacion.
     *
     * @author * Rodolfo Rodríguez
     *
     * @param integer $idaccion - id de la accion ejecutada.
     * @param integer $idusuariorelacionado - id de la notificacion
     *
     * @return integer - 1 se se ejecuto la operacion y 0 si no.
     */
    public function cargarNotificaciones(
        $idusuario, $idusuariorelacionado, $asunto, $idaccion, $arraytipoelem,
        $fecha, $autores, $limit, $start, $noleidas
    )
    {
        $objNotificacion = new DatNotificacion();
        $result = $objNotificacion->cargarNotificaciones(
            $idusuario, $idusuariorelacionado, $asunto, $idaccion,
            $arraytipoelem, $fecha, $autores, $limit, $start, $noleidas
        );
        $objElemento = new DatElementos();
        $fechahoy = date('d/m/Y');
        $fechaayer = date("d/m/Y", strtotime("yesterday"));

        foreach ($result['datos'] as $index => $notificaciones) {
            $idelemento = $notificaciones['idelemento'];
            $denominacion = $notificaciones['asunto'];
            $idaccion = $notificaciones['idaccion'];
            $idtipoelemento = $notificaciones['idtipoelemento'];

            $result['datos'][$index]['asunto'] = $this->construirAsunto($idaccion, $idelemento, $idtipoelemento, '');
            /* $fechaarreglada = $this->ConvertirFecha(
                 $notificaciones['fecha'], '-'
             );*/
            $fechaarreglada = $notificaciones['fecha'];
            $result['datos'][$index]['fecha'] = $fechaarreglada;

            if ($notificaciones['fechainicio'] && $notificaciones['fechafin']) {
                /* $fechainicioarreglada = $this->ConvertirFecha(
                     $notificaciones['fechainicio'], '-'
                 );
                 $fechafinarreglada = $this->ConvertirFecha(
                     $notificaciones['fechafin'], '-'
                 );*/
                $fechainicioarreglada = $notificaciones['fechainicio'];
                $fechafinarreglada = $notificaciones['fechafin'];
                $result['datos'][$index]['fechainicio'] = $fechainicioarreglada;
                $result['datos'][$index]['fechafin'] = $fechafinarreglada;
            }
            if ($fechaarreglada == $fechahoy) {
                $result['datos'][$index]['clasifTime'] = ' Hoy';
            } else {
                if ($fechaarreglada == $fechaayer) {
                    $result['datos'][$index]['clasifTime'] = 'Ayer';
                } else {
                    $result['datos'][$index]['clasifTime'] = 'Días anteriores';
                }
            }
            if ($notificaciones['idtipoelemento'] != 4) {
                $elemento = $objElemento->DameElementoDadoID($idelemento);
                $result['datos'][$index]['denelemento']
                    = (!empty($elemento['denelemento'])) ? $elemento['denelemento'] : '';
            } else {
                $objCriterio = new DatCriteriomedida();
                $elemento = $objCriterio->Buscar($idelemento);
                $result['datos'][$index]['denelemento']
                    = $elemento['dencriterio'];
            }
            /*$nombreautor = $this->integrator->seguridad->nombreUsuario(
                $notificaciones['idautor']
            );*/
            $nombreautor
                = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                $notificaciones['idautor'], 'usuario', null
            );
            $result['datos'][$index]['autor'] = $nombreautor;
        }

        return $result;
    }

    /**
     * Nombre de la función crearNotificacionesPorUsuario
     * Descripcion Permite asociar una notificacion a varios usuarios.
     *
     * @author * Ariadna Rendon Artola
     *
     * @param integer $idnotificacion - id de la notificacion.
     * @param integer $arrayusuarios - Array de usuarios
     *
     * @return void
     */
    public function crearNotificacionesPorUsuario(
        $idnotificacion, $arrayusuarios
    )
    {
        $idpersonas
            = $this->integrator->seguridad->getArrayIdPersonaByArrayUsers(
            $arrayusuarios
        );
        $arrayidpersonas
            = $this->integrator->seguridad->getArrayIdPersonaByArrayUsers(
            $arrayusuarios
        );
        $arrayidpersonas = self::toUnidimencional(
            $arrayidpersonas, 'idpersona'
        );
        if (isset($arrayusuarios)) {
            foreach ($arrayusuarios as $key => $idusuario) {
                if (isset($idusuario)) {
                    $notificacion = new DatUsuarioNotificacion();
                    $notificacion->idusuariorelacionado = $idusuario;
                    $notificacion->notificacionleida = 0;
                    $notificacion->idnotificacion = $idnotificacion;
                    $notificacion->save();
                }
            }
        }
    }

    private static function toUnidimencional($array, $indice)
    {
        $arrayResult = array();
        foreach ($array as $values) {
            array_push($arrayResult, $values[$indice]);
        }
        return $arrayResult;
    }

    /**
     * Nombre de la función crearHistorial
     * Descripcion Permite crear un historial cuando se ejecute una accion .
     *
     * @author * Ariadna Rendon Artola
     *
     * @param integer $idaccion - id de la accion ejecutada.
     * @param integer $idelemento - id del elemento sobre el que
     *                                se ejecuta la accion
     * @param integer $idtipoelemento -tipoelemento del elemento que
     *                                genera la notificacion.
     * @param integer $idautor - id del usuario en seccion.
     *
     * @return integer - id historial.
     */
    public function crearHistorial(
        $idaccion, $idelemento, $idtipoelemento, $idautor, $objcambiohorario,
        $objhisto, $arrayinvolucrados
    )
    {
        $arrayRelaciones = array();
        if (isset($objhisto->arrayelementosrelacionados[0])) {
            foreach ($objhisto->arrayelementosrelacionados as $relacion) {
                if (isset($relacion->idobjetivo)) {
                    $arrayRelaciones[] = $relacion->idobjetivo;
                }
                if (isset($relacion->idplan)) {
                    $arrayRelaciones[] = $relacion->idplan;
                }
            }
        }
        if ($idtipoelemento == 1) {
            if (isset($objhisto->idobjetivopadre)) {
                $arrayRelaciones[] = $objhisto->idobjetivopadre;
            }
        }
        if ($idaccion == 3) {
            foreach ($objhisto->relaciones as $relacion) {
                $arrayRelaciones[] = $relacion;
            }
        }

        $denominacionestadoaporb=DatElementos::getDenominacionEstadoAprob($idelemento);

        $relaciones = implode(',', $arrayRelaciones);
        $objhistorial = new DatHistorial();
        $objhistorial->idelemento = $idelemento;
        $objhistorial->idtipoelemento = $idtipoelemento;
        $objhistorial->idaccion = $idaccion;
        $objhistorial->idautor = $idautor;
        $objhistorial->denelemento = $objhisto->denelemento;
        $objhistorial->descelemento = $objhisto->descelemento;
        $objhistorial->dirigente = $objhisto->dirigente;
        $objhistorial->gradocumplimiento = $objhisto->gradocumplimiento;
        $objhistorial->participante = $objhisto->participante;
        $objhistorial->involucrados = $arrayinvolucrados;
        $objhistorial->fecha = date('d/m/Y H:i:s');
        $objhistorial->hora = date('H:i:s');
        $objhistorial->relaciones = $relaciones;
        $objhistorial->estado =$denominacionestadoaporb;
        if (isset($objcambiohorario)) {
            $objhistorial->fechainicio = $objcambiohorario->fechainicio;
            $objhistorial->fechafin = $objcambiohorario->fechafin;
            $objhistorial->horainicio = $objcambiohorario->horainicio;
            $objhistorial->horafin = $objcambiohorario->horafin;
        }
        $objhistorial->save();
        return $objhistorial->idhistorial;
    }

    public function generarNotificacionSistema($parametros)
    {
        $asunto = $parametros->asunto;
        $contenido = $parametros->contenido;
        $users = $parametros->usuarios;
        foreach ($users as $user) {
            $usuarios[] = $this->integrator->seguridad->nombreUsuario($user);
        }
        $arrayidpersonaIdUsuario
            = $this->integrator->seguridad->getArrayIdPersonaByUsersName(
            $usuarios
        );
        $this->integrator->notification->sendSistemMessage(
            $arrayidpersonaIdUsuario, $contenido, 4
        );

        /*$formato = 'Y-m-d H:i:s';
      $fecha = DateTime::createFromFormat($formato, '2016-06-07 13:55:00');
      $arguments = array("prueba1"=>"1", "campo2"=>"2", "campo3"=>"3" , "campo4"=>"4", "campo5"=>"5");
      $this->integrator->notification->sendSistemNotifiTime(
        array('98'), "algo", 4, 'planpdo-SeCumplenCondiciones', $fecha, $arguments
      );*/

        /* $object = new stdClass();
          $object->data = array();
          $object->data['contenido'] = $contenido;
          $object->data['asunto'] = $asunto;
          $object->destinatario_usuario = $arrayidpersonaIdUsuario;
          $object->remitente = $this->global->Perfil->idusuario;
          $object->fecha = date('Y-m-d H:i:s');
          $worker = new Amqp_Task_Mgr();
          $worker->runTask('gestorncnotification', $object); */
    }

    /**
     * Nombre de la función crearNotificacion
     * Descripcion Permite crear notificacion cuando se ejecute una accion.
     *
     * @author * Ariadna Rendon Artola
     *
     * @param integer $idaccion - id de la accion ejecutada.
     * @param integer $idelemento - id del elemento sobre el que se
     *                                ejecuta la accion
     * @param integer $idtipoelemento -tipoelemento del elemento que genera
     *                                la notificacion.
     * @param integer $idhistorial - id del historial que guarda la
     *                                accion ejecutada.
     *
     * @return integer - idnotificacion
     */
    public function crearNotificacion(
        $idhistorial, $idaccion, $idelemento, $idtipoelemento
    )
    {
        $objNotificacion = new DatNotificacion();
        $objNotificacion->idhistorial = $idhistorial;
        $objNotificacion->descripcion = $this->construirAsunto(
            $idaccion, $idelemento, $idtipoelemento
        );
        $objNotificacion->save();
        return $objNotificacion->idnotificacion;
    }

    /**
     * Nombre de la función generarNotificacion
     * Descripcion Permite crear notificacion cuando se ejecute una accion.
     *
     * @author * Ariadna Rendon Artola
     *
     * @param integer $idaccion - id de la accion ejecutada.
     * @param integer $idelemento - id del elemento sobre el que se
     *                                ejecuta la accion
     * @param integer $idtipoelemento -tipoelemento del elemento que genera
     *                                la notificacion.
     * @param integer $idhistorial - id del historial que guarda la accion
     *                                ejecutada.
     * @param integer $idautor - id del usuario en seccion.
     * @param date $fecha - fecha de generacion.
     *
     * @return void
     */
    public function generarNotificacion(
        $idaccion, $idelemento, $idtipoelemento, $idautor, $fecha,
        $objcambiohorario, $objhisto, $involucradoshisto
    )
    {

      $notificar=true;

      if($idaccion!=3){
        $array_idestados=array();
        self::getEstadosPorNotificar($idautor, $idelemento, $array_idestados);

        $obj_elemento = Doctrine::getTable('DatElementos')->find($idelemento);

        $notificar=(array_search($obj_elemento->idestadoaprob . "", $array_idestados) !== false);

      }

      if($notificar){
        try{
          $pathDataJson = $_SERVER['DOCUMENT_ROOT'];
          $pathDataJson = str_ireplace('/web', '/apps', $pathDataJson);
          $pathDataJson .= '/planificacion/comun/recursos/xmpp/';
          $idnotificacion = " ";
          if (/*$idtipoelemento != 2 && */
            $idtipoelemento != 5
          ) {
            if (is_array($idautor)) {
              $idautor = $idautor[0];
            }
            $datNotificacion = new CmpnotificacionesModel();
            if ($idtipoelemento == 4) {
              $objcriterio = Doctrine::getTable('DatCriteriomedida')->find(
                $idelemento
              );
              $objelemento = Doctrine::getTable('DatElementos')->find(
                $objcriterio->idobjetivo
              );
              $idautorelem = $objcriterio->idusuariocrea;
            } else {
              $objelemento = Doctrine::getTable('DatElementos')->find(
                $idelemento
              );
              $idautorelem = $objelemento->idusuariocrea;
            }

            $idnotificacion = " ";
//            print_r($objelemento->getData());die;
//            $objelemento->gennotificacion = (is_int($idtipoelemento)) ? 1 : null; // si es FIP genero notificacion (lo puse asi porque sino no generaba historial)

            if ($objelemento->gennotificacion) {
//                print_r('entra');
              $idhistorial = $datNotificacion->crearHistorial(
                $idaccion, $idelemento, $idtipoelemento, $idautor,
                $objcambiohorario, $objhisto, $involucradoshisto
              );
              $idnotificacion = $datNotificacion->crearNotificacion(
                $idhistorial, $idaccion, $idelemento, $idtipoelemento
              );

              $arrayusuarios = $datNotificacion->obtenerArrayUsuarios(
                $idelemento, $idautorelem, $idtipoelemento, $idaccion
              );
              $datNotificacion->crearNotificacionesPorUsuario(
                $idnotificacion, $arrayusuarios
              );
              $arrayidusuarios = $datNotificacion->obtenerArrayUsuarios(
                $idelemento, $idautorelem, $idtipoelemento, $idaccion, 1
              );

              $parametros->usuarios = $arrayidusuarios;
              $parametros->asunto = 'Nueva Notificación';
              $parametros->contenido = $this->construirAsunto(
                $idaccion, $idelemento, $idtipoelemento
              );
              $datNotificacion->generarNotificacionSistema($parametros);
              foreach ($arrayidusuarios as $idusuario) {
                if ($idusuario != $idautor) {
                  $nuevanotificacion = array($idnotificacion => array(
                    'usuario' => $idusuario,
                    'fecha' => date('d-m-Y h:i:s')
                  ));
                  file_put_contents(
                    $pathDataJson . $idusuario . '.json',
                    json_encode($nuevanotificacion)
                  );
                }
              }
            } else {
              if (!empty($objelemento->idestadoaprob)) {
                $objconfdocestado
                                                   = $this->pIntegrator->workflow->ObtenerConfDocEstado(
                  $objelemento->idtipoelemento,
                  $objelemento->idestadoaprob
                );
                $objconfdocestado[0]->notificacion = 1; // Valor fijo para probar la notificacion
                if ($objconfdocestado[0]->notificacion) {
                  //se pregunta si el idestado del elemento coincide con
                  //el idestado generador de la notificacion, si coincide
                  // entonces el elemento genera notificaciones
                  $objelemento->gennotificacion = 1;
                  $objelemento->ActualizarInfElemento();

                  $idhistorial = $datNotificacion->crearHistorial(
                    $idaccion, $idelemento, $idtipoelemento,
                    $idautor,
                    $objcambiohorario, $objhisto, $involucradoshisto
                  );

                  $idnotificacion = $datNotificacion->crearNotificacion(
                    $idhistorial, $idaccion, $idelemento,
                    $idtipoelemento
                  );
                  $arrayusuarios = $datNotificacion->obtenerArrayUsuarios(
                    $idelemento, $idautorelem, $idtipoelemento,
                    $idaccion/* , $involucrado */
                  );
                  $datNotificacion->crearNotificacionesPorUsuario(
                    $idnotificacion, $arrayusuarios
                  );
                } else {//auque no se genere notificacion se debe generar historial
                  self::crearHistorial(
                    $idaccion, $idelemento, $idtipoelemento,
                    $idautor,
                    $objcambiohorario, $objhisto, $involucradoshisto
                  );
                }
              }
            }
          }
          return $idnotificacion;
        }catch (Exception $e) {
          return  " ";
        }
      }
      if($notificar == 0 ){
        //print_r("entre akiiii");die;
        $datNotificacion = new CmpnotificacionesModel();
        $datNotificacion->crearHistorial(
            $idaccion, $idelemento, $idtipoelemento, $idautor,
            $objcambiohorario, $objhisto, $involucradoshisto
        );
        return  " ";
    }
      else{
        return  " ";
      }
    }

    public function getEstadoInicialPorAutor($idautor)
    {
      $cadena = " SELECT distinct(e.idestado),e.denominacion ,de.inicial,
                        de.notificacion, de.generacontrol
                        FROM mod_flujotrabajo.dat_estado e
                        INNER JOIN mod_flujotrabajo.conf_doc_dat_estado de 
                      ON de.idestado = e.idestado
              WHERE e.idautor = '$idautor' AND  de.idtipodoc = 3 AND de.notificacion = 1";
      
      $connA = Doctrine_Manager:: connection();
      $resnopag = $connA->execute($cadena);
      $resultnopag = $resnopag->fetchAll();
      $total = count($resultnopag);
      return  ($total>0) ? $resultnopag[0]['idestado']: 0;
    }

    public function EstadosMod($idusuario, $idtipodoc, $idestadoinicial)
    {
      if ($idtipodoc == 0) {
        $comp = " AND tipodocplan = 1 ";
      }
      if ($idtipodoc == 1) {
        $comp = " AND tipodocobjetivo = 1 ";
      }
      if ($idtipodoc == 3) {
        $comp = " AND tipodocactividad = 1 ";
      }
      $cadena = "SELECT distinct(t.idestadofinal),t.idestadofinal AS idestado,
              e.denominacion
              FROM mod_flujotrabajo.dat_estado e 
              INNER JOIN mod_flujotrabajo.dat_transicion t 
              ON t.idestadofinal = e.idestado
              LEFT JOIN mod_flujotrabajo.dat_transicion_conf_usuario tu 
              ON tu.idtransicion = t.idtransicion
              LEFT JOIN mod_flujotrabajo.conf_usuario_conf_doc_dat_estado ude 
              ON ude.idtransicion = t.idtransicion
              WHERE (e.idautor = '$idusuario' OR  tu.idusuario = '$idusuario') 
              AND (ude.tipo = 2 OR ude.tipo = 3)
              AND t.idestadoinicial = '$idestadoinicial' " . $comp;
      $connA = Doctrine_Manager:: connection();
      $res = $connA->execute($cadena);
      $resultado = $res->fetchAll();
      return $resultado;;
    }


    public function getEstadosPorNotificar($idautor, $idelemento, & $array_idestados){
      $idestado_inical=self::getEstadoInicialPorAutor($idautor);
      return self::getEstadoPorAutor($idautor, $idelemento, $idestado_inical, $array_idestados);
    }

    public function getEstadoPorAutor($idautor, $idelemento, $idestado_inical, & $array_idestados){
        if(array_search($idestado_inical, $array_idestados)===false){
            array_push($array_idestados, $idestado_inical);
            $estados = self::EstadosMod(
                $idautor, 3, $idestado_inical
            );

            foreach ($estados as $valor){
                self::getEstadoPorAutor($idautor, $idelemento, $valor['idestado'],$array_idestados);
            }
        }

      return $array_idestados;
    }

    /**
     * Nombre de la función construirAsunto
     * Descripcion Permite crear notificacion cuando se ejecute una accion .
     *
     * @author * Ariadna Rendon Artola'
     *
     * @param integer $idaccion - id de la accion ejecutada.
     * @param integer $idelemento - id del elemento sobre el que se
     *                                ejecuta la accion
     * @param integer $idtipoelemento -tipoelemento del elemento que genera
     *                                la notificacion.
     *
     * @return String - asunto de la notificacion
     */
    public function construirAsunto($idaccion, $idelemento, $idtipoelemento, $asuntoalarma)
    {
        $asunto = '';
        $objaccion = new NomAccion();
        $accion = $objaccion->Buscar($idaccion);
        $denaccion = (isset($accion['denominacion'])) ? strtolower($accion['denominacion']) : ' acción no definida';
        $paraaccionb = ' titulado';

        if ($idtipoelemento == 4) {
            $tipoelemento = ' El criterio de medida ';
            $criterio = Doctrine::getTable('DatCriteriomedida')->find(
                $idelemento
            );
            $car = $criterio->idcriteriomedida;
            $denelemento = $criterio->dencriterio;
        } else {
            $objelemento = new DatElementos();
            $elemento = $objelemento->GetElemento($idelemento);
            $car = $elemento[0]['idelemento'];
            $denelemento = $elemento[0]['denelemento'];
        }
        //determinando el comienzo del asunto
        switch ($idtipoelemento) {
            case 0:
                $tipoelemento = ' El plan: ';
                break;
            case 1:
                $tipoelemento = ' El objetivo: ';
                break;
            case 2:
                $tipoelemento = ' El FIP: ';
                break;
            case 3:
                $tipoelemento = ' La actividad: ';
                $paraaccionb = ' titulada';
                break;
            case 7:
                $tipoelemento = ' La puntualización: ';
                break;
            case 8:
                $tipoelemento = ' La proyecto: ';
                break;
            case 9:
                $tipoelemento = ' La hito: ';
                break;
            case 10:
                $tipoelemento = ' La tarea: ';
                break;
            default:
                $tipoelemento = ' El elemento: ';
                break;
        }

        //construyendo asunto srgun la accion
        if ($idaccion == 5) {
            /*$asunto = ' Usted ha sido liberado del cumplir con' . strtolower(
                    $tipoelemento
                ) .  ' de CAR "' . $car . '".';*/
            $asunto = ' Usted ha sido liberado del cumplir con' . strtolower(
                    $tipoelemento
                ) . '"' . $denelemento . '".';
        } else {
            if ($idaccion != 4) {
                $denaccion = strtolower($accion['denominacion']);
                if ($idtipoelemento == 3) {
                    $denaccion = substr_replace($denaccion, 'ada', -3);
                }
            } else {
                $denaccion = 'cambiado de estado';
                if ($idtipoelemento == 3) {
                    $denaccion = 'cambiada de estado';
                }
            }
            if ($idaccion == 3) {
                /*$asunto = $tipoelemento . $paraaccionb . ' "' . $denelemento
                    . '" ha sido ' . $denaccion . '.';*/
                $asunto = $tipoelemento  . '"' . $denelemento
                    . '" ha sido ' . $denaccion . '.';
            } elseif ($idaccion == 6) {
                $denaccion = strtoupper($accion['denominacion']);
                $asunto = ' AVISO : ' . $asuntoalarma;
            } else {
                /*$asunto
                    = $tipoelemento . ' de Código de Acceso Rápido(CAR) "' . $car . '"'
                    . ' ha sido ' . $denaccion . '.';*/

                $asunto = (trim($denaccion)=="creada")? $tipoelemento . '"' . $denelemento . '"' ." Nueva tarea" : $tipoelemento . '"' . $denelemento . '"'
                    . ' Nueva tarea ' . $denaccion . '.';

            }
        }
        return $asunto;
    }

    /**
     * Nombre de la función eliminarNotificacion
     * Descripcion Permite eliminar una notificacion.
     *
     * @author * Rodolfo Rodríguez
     *
     * @param integer $idaccion - id de la accion ejecutada.
     * @param integer $idnotificacion - id de la notificacion
     *
     * @return integer - 1 se se ejecuto la operacion y 0 si no.
     */
    public function eliminarArrayNotificaciones($arraynotif)
    {
        try {
            foreach ($arraynotif as $idnotificacion) {
                $objNotificacion = new DatNotificacion();
                $objNotificacion->eliminarNotificacionDB($idnotificacion);
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function eliminarNotificacion(
        $idusuario, $idusuariorelacionado, $arrayidnotificaciones
    )
    {
        $objUserNotificacion = new DatUsuarioNotificacion();
        foreach ($arrayidnotificaciones as $idnotificacion) {
            $result = $objUserNotificacion->eliminarUserNotificacion(
                $idusuario, $idusuariorelacionado, $idnotificacion
            );
            $existenotif = Doctrine::getTable('DatUsuarioNotificacion')
                ->findByDql("idnotificacion = $idnotificacion");
            if (!isset($existenotif[0])) {
                $objNotificacion = new DatNotificacion();
                $objNotificacion->eliminarNotificacionDB($idnotificacion);
            }
        }
        return $result;
    }

    public function getArrayIdNotificaciones($idusuariorelacionado, $idusuario)
    {

        $objNotificacion = new DatNotificacion();
        $result = $objNotificacion->obtenerArrayIdNotificaciones($idusuariorelacionado, $idusuario);

        return $result;

    }

    /**
     * Nombre de la función actualizarNotificacion
     * Descripcion Permite actualizar los datos de una notificacion.
     *
     * @author * Rodolfo Rodríguez
     *
     * @param integer $idaccion - id de la accion ejecutada.
     * @param integer $idnotificacion - id de la notificacion
     *
     * @return integer - 1 se se ejecuto la operacion y 0 si no.
     */
    public function actualizarNotificacion(
        $idusuario, $idusuariorelacionado, $idnotificacion
    )
    {
        $objUserNotificacion = new DatUsuarioNotificacion();
        $result = $objUserNotificacion->actualizarUserNotificacion(
            $idusuario, $idusuariorelacionado, $idnotificacion
        );
        return $result;
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
                /*print_r(mktime(
                        0, 0, 0, $mesinicio, $diainicio, $annoinicio));die;*/
                $fechainstancia = date('d/m/Y', $numfecha);
                break;
        }

        return ($fechainstancia) ? $fechainstancia : '';
    }

    public function crearHistorialDeAlarma($parametros)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find($parametros->idelemento);
        $objactividad = Doctrine::getTable('DatActividades')->find($parametros->idelemento);

        $objhistorial = new DatHistorial();
        $objhistorial->idelemento = $objelemento->idelemento;
        $objhistorial->idtipoelemento = $objelemento->idtipoelemento;
        $objhistorial->idautor = $parametros->idusuariocrea;
        $objhistorial->denelemento = $objelemento->denelemento;
        $objhistorial->descelemento = $objelemento->descelemento;
        $objhistorial->dirigente = $objelemento->dirigente;
        $objhistorial->gradocumplimiento = $objelemento->gradocumplimiento;
        $objhistorial->participante = $objelemento->participante;
        //$objhistorial->involucrados = $arrayinvolucrados;
        $objhistorial->fecha = date('d/m/Y H:i:s');
        $objhistorial->idaccion = $parametros->idaccion;
        $objhistorial->fechainicio = $objactividad->fechainicio;
        $objhistorial->fechafin = $objactividad->fechafin;
        $objhistorial->horainicio = $objactividad->horainicio;
        $objhistorial->horafin = $objactividad->horafin;
        $objhistorial->save();

        $objNotificacion = new DatNotificacion();
        $objNotificacion->idhistorial = $objhistorial->idhistorial;
        $objNotificacion->descripcion = $this->construirAsunto($objhistorial->idaccion, $objelemento->idelemento, $objelemento->idtipoelemento, $parametros->asuntoalarma);
        $parametros->asuntoalarma = $this->construirAsunto($objhistorial->idaccion, $objelemento->idelemento, $objelemento->idtipoelemento, $parametros->asuntoalarma);
        $objNotificacion->save();

        $notificacion = new DatUsuarioNotificacion();
        $notificacion->idusuariorelacionado = $objhistorial->idautor;
        $notificacion->notificacionleida = 0;
        $notificacion->idnotificacion = $objNotificacion->idnotificacion;
        $idnotificacion = $objNotificacion->idnotificacion;
        $notificacion->save();
        return $idnotificacion;
    }

    public function hayNuevasNotificaciones(/* $parametros */)
    {

    }

}
