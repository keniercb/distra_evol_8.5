<?php

  class ConfTipoPagoDependenciaModel extends ZendExt_Model
  {

    public function ConfTipoPagoDependenciaModel()
    {
      parent::ZendExt_Model();
    }


    public function obtenerArregloConfTipoPagoDependencia($idtipopago, $inicio = 0, $limite = 10)
    {
      //Retornando el listado de tipos de reportes.
      return ConfTipoPagoDependencia::obtenerListadoTipoPagoDependencia($idtipopago, $inicio, $limite);
    }

    public function obtenerCantidadTipoPagoDependencia($idtipopago)
    {
      //Retornando el listado de tipos de reportes.
      return ConfTipoPagoDependencia::obtenerCantidadTipoPagoDependencia($idtipopago);
    }

    public function obtenerArregloConfTipoPagoDependenciaRestante($idtipopago, $inicio = 0, $limite = 10)
    {
      //Retornando el listado de tipos de reportes.
      return ConfTipoPagoDependencia::obtenerListadoTipoPagoDependenciaRestante($idtipopago, $inicio, $limite);
    }

    public function obtenerCantidadTipoPagoDependenciaRestante($idtipopago)
    {
      //Retornando el listado de tipos de reportes.
      return ConfTipoPagoDependencia::obtenerCantidadTipoPagoDependenciaRestante($idtipopago);
    }

    public function adicionarConfTipoPagoDependencia($idtipopago, $arrayidtipopagodepencia)
    {
      $huboFallo = false;
      foreach ($arrayidtipopagodepencia as $clave => $idtipopagodependencia) {
        $obj       = new ConfTipoPagoDependencia();
        if (!$obj->existeDependenciaPorTipoPago($idtipopago, $idtipopagodependencia)) {
          /*if($clave==3){
            print_r($idtipopagodependencia);die;
          }*/
          $obj->idtipopago         = $idtipopago;
          $obj->idtipopagodepencia = $idtipopagodependencia;
          $obj->save();
        } else {
          $huboFallo = true;
        }
      }

      if (!$huboFallo) {
        return 1;
      } else {
        return 0;
      }


    }

    public function eliminarConfTipoPagoDependencia($arrayids)
    {

      foreach($arrayids as $c=>$id){
        $r->cantRowAfected = Doctrine_Query::create()
          ->delete()
          ->from('ConfTipoPagoDependencia')
          ->where('iddependencia = ?', $id)
          ->execute();
      }


      return $r;

    }
  }