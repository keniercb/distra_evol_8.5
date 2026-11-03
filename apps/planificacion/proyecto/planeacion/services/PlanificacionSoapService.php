<?php

/**
 * Created by PhpStorm.
 * User: Ariel
 * Date: 05/10/2016
 * Time: 13:37
 */
class PlanificacionSoapService
{
  function _construct()
  {

  }

  /**
     Metodo para verificar credenciales
   **/

  public function autenticarUsuario($contenido)
  {
      $info=json_decode($contenido);
      $user=$info->user;
      $pass=$info->pass;
      $autenticado=0;
      $info_usuario=array();
      if(self::verificarUsuario($user, $pass,$info_usuario)){
        $autenticado=1;
      }
    return json_encode(array('autenticado' => $autenticado, 'nombreusuario'=>$info_usuario[0]['nombreusuario'],
                             'idusuario' => $info_usuario[0]['idusuario'],
                             'iddominio' => $info_usuario[0]['iddominio']
                       ));
  }


  /**
     metodo para cargar arbol de estructuras...
   **/

  public function cargarArbolEstructuras($contenido) {
    $info=json_decode($contenido);
    $node=$info->node;
    $denominacion=($info->denominacion=="")?null:$info->denominacion;
    $idEstructura = ($node != 'nodo2') ? (float) $node : 0;
    $valor = $denominacion;
    $iddominio = $info->iddominio;
    $integrator = ZendExt_IoC::getInstance();
    $dominios = $integrator->metadatos->buscarHijosEstructuras(
      $iddominio, $idEstructura, 0, 0, 3
    );
    $result = array();
    foreach ($dominios as $key => $val) {
      if ($valor != null) {
        $flag = stristr($val['text'], $valor);
      }
      if ($val['tipo'] != 7) {
        $result[$key] = $val;
        $result[$key]['qtip'] = $val['text'];
        $result[$key]['icon']="no";
      }

    }
    if ($valor != null) {
      foreach ($result as $key => $value) {
        if (stristr($value['text'], $valor) == false) {
          unset($result[$key]);
        }
      }
      $res = array();
      $i = 0;
      foreach ($result as $key => $val) {
        $res[$i++] = $val;
      }
    }
    if ($res != null) {
      $result = $res;
    }
    return json_encode(array('respuesta'=>$result));
  }

  /**
    metodo para cargar plantillas
   **/

  function cargarplantillas($contenido) {
    $info=json_decode($contenido);
    $parametros->padre = json_decode(stripslashes($info->padre));
    $parametros->inProyecto = null;
    $parametros->inPlantilla = null;
    $parametros->incluProyecto = 'true';
    $parametros->incluPlantilla = 'true';
    $parametros->incluRepeticiones = false;
    $parametros->incluReasignaciones = false;
    $parametros->anode = ($info->anode)?$info->anode:'';
    $parametros->filtros = null;
    $parametros->idusuariocrea = $info->idusuario;
    $parametros->dependenciaTotal = null;
    $parametros->dependenciaPorcentual = null;
    $parametros->dependenciaPuertaAbierta = null;
    $parametros->idelementoafiltrar = null;
    $parametros->relacionarTareas = null;
    $parametros->tipoelemento = null;
    $parametros->idproyectoParaFiltro = null;
    $parametros->limit = (int) $info->limit;
    $parametros->start = (int) $info->start;

    $parametros->arrayautores = [];
    $parametros->arrayinvolucrados = [];
    $parametros->idEstructura = (float) $info->idestructura;
    if (($info->idestructura == '' || $info->idestructura == 'node2') && $parametros->anode == ''
    ) {
      return json_encode(
        array('success' => true, 'total' => 0, 'campos' => array())
      );
    } else {
      $plantillamodel= new CmpgestionarplantillaModel();
      $arrayProyectos = $plantillamodel->cargarProyectos($parametros);
      if (isset($arrayProyectos['resultado'])) {
        $res = array();
        foreach ($arrayProyectos['resultado'] as $key => $val) {
          $res[$key]['idelemento'] = $val['idelemento'];
          $res[$key]['denominacion'] = $val['denominacion'];
          $res[$key]['_is_leaf'] = $val['_is_leaf'];
          $res[$key]['tipo'] = $val['tipoelemento'];
          $res[$key]['gradocumplimiento'] = $val['gradocumplimiento'];
          if($val['plantilla']=='0'){
            $res[$key]['plantilla']=false;
          }else{
            $res[$key]['plantilla']=true;
          }
        }
        return json_encode(
          array('success' => true,
                'total' => $arrayProyectos['total'],
                'campos' => $res)
        );
      } else {
        return json_encode(
          array('success' => true, 'total' => 0, 'campos' => array())
        );
      }
    }
  }


  /**
    Metodo para listar actividades a chequear
   **/
  function obtenerTareasParaChequear($contenido) {
    $info=json_decode($contenido);
    $parametros->idusuariosession = $info->idusuario;
    $parametros->start = ($info->start) ? $info->start : 0;
    $parametros->limit = ($info->limit) ? $info->limit : 10;
    $plantillamodel= new CmpgestionarplantillaModel();
    $arrayTareas = $plantillamodel->obtenerTareasParaChequear($parametros);
    if (isset($arrayTareas['resultado'][0])) {
      return json_encode(
        array('success' => true,
              'total' => $arrayTareas['total'],
              'data' => $arrayTareas['resultado'])
      );
    } elseif ($arrayTareas['total'] == 0) {
      return json_encode(
        array('success' => true,
              'total' => 0,
              'data' => array())
      );
    }
  }

  public function actualizarCumplimiento($contenido) {
    $info=json_decode($contenido);
    $parametros->cumplimiento = ($info->cumplimiento!=null) ? (int) $info->cumplimiento : 100;
    $parametros->arrayidelementos = json_decode(
      stripslashes($info->arrayidtareas)
    );
    $tarea=new CmpgestionartareaModel();
    if ($parametros->cumplimiento >= 100) {
      foreach ($parametros->arrayidelementos as $key => $elemento) {
        $proy=new DatProyecto();
        $arrayDependencias = $proy->getDependenciasAnteriores($elemento->id);

        if (count($arrayDependencias) != 0) {
          $respuesta = $tarea->verificarCumplimientoTareas($arrayDependencias);
        }
      }

      for ($i = 0; $i < count($arrayDependencias); $i++) {
        $arrayidelementos[$i]['id'] = $arrayDependencias[$i]['idelementopadre'];
        $arrayidelementos[$i]['gradocumplimiento'] = $parametros->cumplimiento;
      }
      for ($i = count($arrayDependencias); $i < count($arrayDependencias) + 1; $i++) {
        $arrayidelementos[$i]['id'] = $parametros->arrayidelementos[0]->id;
        $arrayidelementos[$i]['gradocumplimiento'] = $parametros->cumplimiento;
      }
    }

    if ($respuesta == 'no') {
      Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
      return json_encode(
        array('respuesta' => '0',
              'arrayidTareas' => $arrayidelementos)
      );
    } else {
      $parametros->metodo = 2;
      $respuesta = $tarea->actualizarCumplimiento($parametros);
      Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
      return json_encode(
        array('respuesta' => $respuesta,
              'arrayidTareas' => $parametros->arrayidelementos)
      );
    }
  }




  public function verificarUsuario($user, $pass, & $info_usuario)
  {
    $passs = md5($pass);
    $dm = Doctrine_Manager::getInstance();
    $conn = $dm->getCurrentConnection();
    $sql = "SELECT su.idusuario, su.nombreusuario, su.iddominio
        FROM mod_seguridad.seg_usuario su
    WHERE su.nombreusuario = '$user' AND su.contrasenna = '$passs' AND su.activo = true;";
    $info_usuario = $conn->fetchAll($sql);
    if ($info_usuario[0]['nombreusuario'] == $user) {
      return true;
    } else {
      return false;
    }

  }

}