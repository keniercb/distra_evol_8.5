<?php
/**
 * Created by PhpStorm.
 * User: Chinete
 * Date: 12/11/2018
 * Time: 10:33
 */

//$address=dirname(dirname(__FILE__));
// $address=str_ireplace('o/plan/models','o/comun/recursos/',$address);
//require_once($address.'html2pdf.class.php');

class CmpgestionmonitoreoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    function correrFecha($fechaI, $dias)
    {
        $op = ($dias < 0) ? '-' : '+';
        $fechaI = explode('/', $fechaI);
        $fechaI = $fechaI[2] . '-' . $fechaI[1] . '-' . $fechaI[0];
        $nuevafecha = strtotime($op . abs($dias) . ' day', strtotime($fechaI));
        $nuevafecha = date('d/m/Y', $nuevafecha);
        return $nuevafecha;
    }

    public function InsertarAlarma_crontab($parametros)
    {
        $valora = $parametros->cantdiashoras;
        $parametros->fecha = $this->correrFecha(
            $parametros->fechainicio, $valora
        );
        $users = $parametros->involucrados;
        foreach ($users as $user) {
            $usuarios[] = $user->idusuario;
        }
        $parametros->usuarios = implode(',', $usuarios);

        $fechaI = explode('/', $parametros->fechainicio);
        $fechaI = $fechaI[2] . '-' . $fechaI[1] . '-' . $fechaI[0];
        $formato = 'Y-m-d H:i:s';
        $oper = DatElementosNomNomenclador::Nomenclador_Operador('', $parametros->operador);

        if (isset($oper[0])) {
            $parametros->idcomparacion = $oper[0]['idoperador'];
            $result = DatActividades::InsertarAlarma($parametros);
            if ($result) {
                $vianotificacion = explode(',', $parametros->vianotificacion);
                foreach ($vianotificacion as $via) {
                    switch ($via) {
                        case 2: //Notificacion del sistema
                            $fecha = DateTime::createFromFormat($formato, $fechaI . ' ' . $parametros->hora . ':00');
                            $estadocump = str_replace(' ', '_', $parametros->estadocump);
                            $arguments = array("idelemento" => $parametros->idelemento, "operadorcumplimiento" => $oper[0]['operador'],
                                "porccumplimiento" => $parametros->porciento, "estadocumplimiento" => $estadocump,
                                "estadoaprobacion" => $parametros->estadoaprov);

                            try {
                                $arrayidpersonaIdUsuario
                                    = $this->integrator->seguridad->getArrayIdPersonaByArrayUsers(
                                    $usuarios
                                );
                            } catch (Exception $e) {
                                $result = 4; //No existen personas asociadas a los usuarios
                            }
                            if (isset($arrayidpersonaIdUsuario[0])) {
                                $arrayidpersona = array();
                                foreach ($arrayidpersonaIdUsuario as $value) {
                                    array_push($arrayidpersona, $value['idpersona']);
                                }
                                try {
                                    self::sendSistemNotifiTime(
                                        $arrayidpersona, $parametros->asunto, intval($parametros->tipoaviso), 'planpdo-SeCumplenCondiciones', $fecha, $arguments
                                    );

                                } catch (Exception $e) {
                                    echo $e->getMessage();
                                    $result = 2;
                                }
                            } else $result = 4; //No existen personas asociadas a los usuarios

                            break;
                        case 3: //Notificacion por correo

                    }
                }
                return $result;
            } else return 0;
        } else return 3; //No existen datos en el nomenclador de operador
    }

    public function InsertarAlarma($parametros)
  {
    $valora = $parametros->cantdiashoras;
    $parametros->fecha = $this->correrFecha(
      $parametros->fechainicio, $valora
    );
    $users = $parametros->involucrados;
    foreach ($users as $user) {
      $usuarios[] = $user->idusuario;
    }
    $parametros->usuarios = implode(',', $usuarios);

    $fechaI = explode('/', $parametros->fechainicio);
    $fechaI = $fechaI[2] . '-' . $fechaI[1] . '-' . $fechaI[0];
    $formato = 'Y-m-d H:i:s';
    $oper = DatElementosNomNomenclador::Nomenclador_Operador('', $parametros->operador);

    if (isset($oper[0])) {
      $parametros->idcomparacion = $oper[0]['idoperador'];
      $result = DatActividades::InsertarAlarma($parametros);
      if ($result) {
//        $vianotificacion = explode(',', $parametros->vianotificacion);
//        foreach ($vianotificacion as $via) {
//          switch ($via) {
//            case 2: //Notificacion del sistema
//              $fecha = DateTime::createFromFormat($formato, $fechaI . ' ' . $parametros->hora . ':00');
//              $estadocump = str_replace(' ', '_', $parametros->estadocump);
//              $arguments = array("idelemento" => $parametros->idelemento, "operadorcumplimiento" => $oper[0]['operador'],
//                                 "porccumplimiento" => $parametros->porciento, "estadocumplimiento" => $estadocump,
//                                 "estadoaprobacion" => $parametros->estadoaprov);
//
//              try {
//                $arrayidpersonaIdUsuario
//                  = $this->integrator->seguridad->getArrayIdPersonaByArrayUsers(
//                  $usuarios
//                );
//              } catch (Exception $e) {
//                $result = 4; //No existen personas asociadas a los usuarios
//              }
//              if (isset($arrayidpersonaIdUsuario[0])) {
//                $arrayidpersona = array();
//                foreach ($arrayidpersonaIdUsuario as $value) {
//                  array_push($arrayidpersona, $value['idpersona']);
//                }
//                try {
//                  self::sendSistemNotifiTime(
//                    $arrayidpersona, $parametros->asunto, intval($parametros->tipoaviso), 'planpdo-SeCumplenCondiciones', $fecha, $arguments
//                  );
//
//                } catch (Exception $e) {
//                  echo $e->getMessage();
//                  $result = 2;
//                }
//              } else $result = 4; //No existen personas asociadas a los usuarios
//
//              break;
//            case 3: //Notificacion por correo
//
//          }
//        }
        return $result;
      } else return 0;
    } else return 3; //No existen datos en el nomenclador de operador
  }




  /**
   * sendSistemNotifiTime
   * Servicio que envía una notificacion en una fecha determinada a una lista de usuarios
   *
   * @param array $idPersonas Arreglo de identificadores de usuarios.
   * @param string $content Contenido del Aviso
   * @param string $tipoAviso (Informacio,Abvertencia,Error,Alerta) 1,2,3,4
   * @param string $cmd Servicio de validacion de los argumentos (componente-servicio)
   * @param string $fecha Fecha de ejecucion de la tarea (datatime)
   * @param array $arguments Argumentos a validar en el cmd
   * @return boolean
   */
  public function sendSistemNotifiTime($idPersonas, $content, $tipoAviso, $cmd, $fecha, $arguments)
  {

    $dir_www = $_SERVER ['DOCUMENT_ROOT'];
    $dir_rel_mt = '/';
    $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);


    $configFile = $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'herramientas' . DIRECTORY_SEPARATOR .
      'notificaciones' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'bussines' . DIRECTORY_SEPARATOR . 'SshCronManager.php';
    if (file_exists($configFile)) {
      $xmlCargado = simplexml_load_file($configFile);
    }

    require $dir_abs_mt . '/apps/herramientas/notificaciones/models/bussines/SshCronManager.php';

    $nameAviso = uniqid('Notificaciones_Crontab_');



    $id = uniqid('id_');
    $fecha = $fecha->format('i').' '.$fecha->format('H').' '.$fecha->format('d').' '.$fecha->format('m');
    if (isset($arguments['operadorcumplimiento'])) {
      $arguments['operadorcumplimiento'] = '"'. $arguments['operadorcumplimiento']. '"';
    }
    $arrayArgs = ($arguments) ? implode("/@", $arguments) : '';

    $idPersonas  = ($idPersonas) ? implode("/@", $idPersonas) : '';
    $content  = ($content) ? str_replace(' ',"/@", $content) : '';

    $dir_abs_mt = substr(DIR_ABS_MT, 0, strlen(DIR_ABS_MT) - 1);

//    if (class_exists('SshCronManager')) {

      try {
//        $arrayArgs="/@/@/@";
        $this->_sshCronMang = new SshCronManager();
//        $this->_sshCronMang->append_cronjob("$fecha * ID=$id sh $dir_abs_mt/lib/Amqp/Worker/consumer_notifica.sh $nameAviso $arrayArgs $tipoAviso $idPersonas $content>/opt/php.log 2>&1");
        $this->_sshCronMang->append_cronjob("$fecha * ID=$id sh $dir_abs_mt/lib/Amqp/Worker/consumer_notifica.sh  $nameAviso $arrayArgs $tipoAviso $idPersonas $content>/opt/php.log 2>&1");
        //$this->_sshCronMang->append_cronjob("$fecha * ID=$id sh $dir_abs_mt/lib/Amqp/Worker/consumer_notifica.sh $nameAviso $arrayArgs $tipoAviso $idPersonas $contenido>/dev/null 2>&1");
        //$this->_sshCronMang->clear_crontab_file();  //No se puede borrar el archivo sino pone una sola tarea en el cron
      } catch (Exception $e) {
        echo ($e->getMessage());
      }


//    }


    return true;
  }





    public function InsertarAlarmaOld($parametros)
    {
        /*if ($parametros->iguala != 0 || $parametros->mayorque != 0
            || $parametros->menorque != 0
        ) {
            $objCondicion = new NomComparacion();
            $objCondicion->igual = $parametros->iguala;
            $objCondicion->mayor = $parametros->mayorque;
            $objCondicion->menor = $parametros->menorque;
            $objCondicion->save();
            $parametros->idcomparacion = $objCondicion->idcomparacion;
        } else {
            $parametros->idcomparacion = '';
        }*/
        $valora = $parametros->cantdiashoras;
        $parametros->fecha = $this->correrFecha(
            $parametros->fechainicio, $valora
        );
        $users = $parametros->involucrados;
        foreach ($users as $user) {
            //$usuarios[] = $this->integrator->seguridad->nombreUsuario($user->idusuario);
            $usuarios[] = $user->idusuario;
        }
        $parametros->usuarios = implode(',', $usuarios);

        /* $result = $this->pIntegrator->planpdo->SeCumplenCondiciones(
             $parametros->idelemento, $parametros->idcomparacion, $parametros->porciento,
             $parametros->estadocump, $parametros->estadoaprov);*/

        $fechaI = explode('/', $parametros->fechainicio);
        $fechaI = $fechaI[2] . '-' . $fechaI[1] . '-' . $fechaI[0];
        $formato = 'Y-m-d H:i:s';
        $oper = DatElementosNomNomenclador::Nomenclador_Operador('', $parametros->operador);
        $parametros->idcomparacion = $oper[0]['idoperador'];

        $resultadofinal = DatActividades::InsertarAlarma($parametros);

        $fecha = DateTime::createFromFormat($formato, $fechaI . ' ' . $parametros->hora . ':00');

        $arguments = array("idelemento" => $parametros->idelemento, "operadorcumplimiento" => $oper[0]['operador'],
            "porccumplimiento" => $parametros->porciento, "estadocumplimiento" => $parametros->estadocump,
            "estadoaprobacion" => $parametros->estadoaprov);

        try {
            $arrayidpersonaIdUsuario
                = $this->integrator->seguridad->getArrayIdPersonaByArrayUsers(
                $usuarios
            );
        } catch (Exception $e) {
            $arrayidpersonaIdUsuario = array();
        }
        $arrayidpersona = array();
        foreach ($arrayidpersonaIdUsuario as $value) {
            array_push($arrayidpersona, $value['idpersona']);
        }
        try {
            $this->integrator->notification->sendSistemNotifiTime(
                $arrayidpersona, $parametros->asunto, intval($parametros->tipoaviso), 'planpdo-SeCumplenCondiciones', $fecha, $arguments
            );
        } catch (Exception $e) {
            echo $e->getMessage();
            return 2;
        }
        return 1;
    }

    public function validarHora($hora, $valor)
    {
        $hora = explode(':', $hora);
        if (($hora[0] + $valor) < 0 || ($hora[0] + $valor) > 24) {
            return -1;
        } else {
            return ($hora[0] + $valor) . ':' . $hora[1];
        }
    }

    public function crearExpRegular($valores)
    {
        $resp = 'Fecha = ' . $valores['fecha'] . ' Y Hora = ' . $valores['hora'];
        if ($valores['porciento'] != '')
            $resp = $resp . ' Y Porciento de cumplimiento ' . $valores['operador'] . ' ' . $valores['porciento'];
        if ($valores['cumplimiento'] != '')
            $resp = $resp . ' Y Estado de cumplimiento = ' . $valores['cumplimiento'];
        if ($valores['aprobacion'] != '')
            $resp = $resp . ' Y Estado de aprobacion = ' . $valores['aprobacion'];
        return $resp;
    }

    public function eliminarAlarma($arrayalarmas)
    {
        foreach ($arrayalarmas as $idalarma) {
            $result = DatActividades::EliminarAlarma($idalarma);
        }
        return 1;
    }

    public function obtenerListadoAlarmas($parametros)
    {
        $objNotificacion1 = new CmpnotificacionesModel();
        $respuesta = 0;
        $fecha_hora = date("Y-m-d H:i");
        $horafecha = explode(' ', $fecha_hora);
        $arrayNotificaciones = array();
        $arrayA = array();
        $arrayA['fecha'] = $horafecha[0];
        $arrayA['hora'] = $horafecha[1];
        $arrayA['idinvolucrado'] = $parametros->idusuariocrea;
        print_r($parametros->idusuariocrea);
        die;
        $listado = DatActividades::listarAlarmasHoraFechaInvolucrado($arrayA);
        foreach ($listado as $alarma) {
            //para generar notificaciones (ARA)
            if ($alarma['idelemento']) {
                $usuarios = explode(',', $alarma['involucrados']);
                if (in_array($parametros->idusuariocrea, $usuarios)) {
                    $parametros->idelemento = $alarma['idelemento'];
                    $parametros->idaccion = 6;
                    $parametros->asuntoalarma = $alarma['asunto'];
                    $idnotificacion = $objNotificacion1->crearHistorialDeAlarma($parametros);
                    $arrayaux = array();
                    $arrayaux['msg'] = $parametros->asuntoalarma;
                    $arrayaux['usuarios'] = $usuarios;
                    $arrayaux['idnotificacion'] = $idnotificacion;
                    $arrayaux['codMsg'] = $alarma['idtipoaviso'];
                    $arrayNotificaciones[] = $arrayaux;
                }
            }
            $respuesta = 1;
        }
        return $arrayNotificaciones;
    }


    public function verificarAlarma($parametros)
    {
      $cantidad_alarmas = DatActividades::verificarAlarma($parametros);
      $count=0;
      foreach ($cantidad_alarmas as $alarma) {

        if(self::validadorAlarma($alarma)){
          $des=DatActividades::desactivarAlarma($alarma['idalarma']);
          if($des){
            $users=explode(",", $alarma['involucrados']);

            foreach ($users as $user) {
              if($user!=''){
                $usuarios[] = $this->integrator->seguridad->nombreUsuario($user);
              }
            }
            $arrayidpersonaIdUsuario
              = $this->integrator->seguridad->getArrayIdPersonaByUsersName(
              $usuarios
            );

            $this->integrator->notification->sendSistemMessage(
              $arrayidpersonaIdUsuario, $alarma['asunto'], $alarma['idtipoaviso']
            );

            $count++;
          }
        }
      }

      return $count;
    }

    public function validadorAlarma($alarma){
      // Elemento en el historial
      $objElemento = Doctrine::getTable('DatElementos')->find(
        $alarma['idelemento']
      );
     /*************************
        Validacion para el porciento de cumplimiento
      ***********************/
      if($alarma['porciento']!=null && $objElemento->gradocumplimiento!=null){
        $operador = DatElementosNomNomenclador::getOperador($alarma['idcomparacion']);
        switch ($operador){
          case '=':
            if($objElemento->gradocumplimiento != $alarma['porciento']){
               return false;
            }
            break;
          case '>':
            if($objElemento->gradocumplimiento < $alarma['porciento']){
              return false;
            }
            break;
          case '<':
            if($objElemento->gradocumplimiento > $alarma['porciento']){
              return false;
            }
            break;
          case '>=':
            if($objElemento->gradocumplimiento < $alarma['porciento']){
              return false;
            }
            break;
          case '<=':
            if($objElemento->gradocumplimiento > $alarma['porciento']){
              return false;
            }
            break;
        }
      }

      /*************************
      Validacion para el estado de cumplimiento
       ***********************/

      if($alarma['estadocumplimiento']!=null && $objElemento->estadocumplimiento!=null){
          if($alarma['estadocumplimiento'] != $objElemento->estadocumplimiento){
            return false;
          }
      }

      /*************************
      Validacion para el estado de aprobacion
       ***********************/

      if($alarma['idestadoaprobacion']!=null && $objElemento->idestadoaprob!=null){
        if($alarma['idestadoaprobacion'] != $objElemento->idestadoaprob){
          return false;
        }
      }

     return true;
    }

    public function listarAlarmas($idelemento)
    {
        $arrayalarmas = DatActividades::listarAlarmas($idelemento);
        if (isset($arrayalarmas['resultado'])) {
            $eliminar = 0;
            $resp['total'] = $arrayalarmas['total'];
            $resp['resultado'] = array();
            $cant = 0;
            foreach ($arrayalarmas['resultado'] as $val) {
                /* if ($val['idusuariocrea'] == $idusuariocrea) {
                     $eliminar = 1;
                 }*/
                $arrayestadosaprob = $this->pIntegrator->workflow->DenomEstado(
                    $val['idestadoaprobacion']
                );
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $dat->data  [] = array('idalarma' => $val['idalarma'],
                    'idelem' => $val['idelemento'],
                    'fecha' => $val['fecha'],
                    'hora' => $val['hora'],
                    'porciento' => $val['porciento'],
                    'cumplimiento' => $val['estadocumplimiento'],
                    'idaprobacion' => $val['idestadoaprobacion'],
                    'aprobacion' => $nombreestadoapro,
                    'asunto' => $val['asunto'],
                    'tipoaviso' => $val['idtipoaviso'],
                    'via' => $val['idtipocont'],
                    'cantdias' => $val['cantidaddias'],
                    'involucrados' => $val['involucrados'],
                    'operador' => $val['operador'],
                    'textoperador' => $val['descripcion'],
                    'idoperador' => $val['idcomparacion']
                );
                $dat->data[$cant]['expregular'] = $this->crearExpRegular($dat->data[$cant]);
                $cant++;
                $nombreestadoapro = '';
            }
            $resp['resultado'] = $dat->data;
        } else {
            $resp['resultado'] = array();
        }
        return $resp;
    }

}