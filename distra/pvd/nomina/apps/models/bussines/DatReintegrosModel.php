<?php

  /**
   * Modelo de negocio para gestionar el registro de salario y tiempo de servicio.
   *
   * @author 1er Tte. Frank Rodriguez Berroa.
   * @package Pvd.
   * @subpackage Nomina - Submayor.
   * @category Modelo de negocio
   * @uses GestRegistroSalarioTiempoServicioModel, (Clase del dominio).
   * @copyright UCID
   * @version 1.0
   */
  class DatReintegrosModel extends ZendExt_Model
  {

    /**
     * Constructor de la clase.
     */
    public function DatReintegrosModel()
    {
      parent::ZendExt_Model();
    }

    public function obtenerListadoReintegros($idpersona, $idestructura)
    {
      $cont           = 0;
      $total          = 0;
      $objNomTipoNomina = new NomTipoNomina();
      $arrayelementos = DatReintegros::obtenerListadoReintegros($idpersona, $idestructura);

      foreach ($arrayelementos as $i => $value) {
        $arrayreturn[$cont]['idreintegropersona'] = $value['idreintegropersona'];
        $arrayreturn[$cont]['fecha']              = $value['fecha'];
        $arrayreturn[$cont]['idpersona']          = $value['idpersona'];
        $arrayreturn[$cont]['idestructura']       = $value['idestructura'];
        $arrayreturn[$cont]['operacion']          = $value['operacion'];
        $arrayreturn[$cont]['importe']            = $value['importe'];
        $arrayreturn[$cont]['idestructura']       = $value['idestructura'];
        $arrayreturn[$cont]['tipomoneda']       = $value['tipomoneda'];
        $arrayreturn[$cont]['idtiponomina']       = $value['idtiponomina'];
        $arrayreturn[$cont]['tiponomina']       = $objNomTipoNomina::obtenerDenominacion($value['idtiponomina']);
        $arrayreturn[$cont]['idfechacierre']       = $value['idfechacierre'];
        $arrayreturn[$cont]['moneda']       = ($value['tipomoneda'] == '01')?'CUP':'CUC';
        $datNomina= DatNomina::obtenerObj($value['idnomina']);
//        print_r($datNomina);die;
        //$total+$value['importe']=$total;
        $cont++;
      }//print_r($arrayreturn);die;
      return $arrayreturn;
    }

    public function acumularreintegros($arraypersonas, $identidad)
    {
      $obj = new DatReintegros();

      foreach ($arraypersonas as $k => $v) {
        if (!$obj->existePersonaConNomina($v['idpersona'], $identidad, $v['idnomina'])) {
          $obj->operacion    = 2;
          $obj->importe      = $v['importe_n'];
          $obj->idpersona    = $v['idpersona'];
          $obj->idnomina     = $v['idnomina'];
          $obj->idestructura = $identidad;
          $obj->save();
        } else {
          return false;
        }

      }
      return true;

    }

    public function liquidarreintegros($arraypersonas, $identidad)
    {
      $obj = new DatReintegros();
      foreach ($arraypersonas as $k => $v) {
        if (!$obj->existePersonaConNomina($v['idpersona'], $identidad, $v['idnomina'])) {
          $obj->operacion    = 1;
          $obj->importe      = $v['importe_n'];
          $obj->idpersona    = $v['idpersona'];
          $obj->idnomina     = $v['idnomina'];
          $obj->idestructura = $identidad;
          $obj->save();
        } else {
          return false;
        }
      }
      return true;
    }

    public function calcularReintegros($idpersona)
    {
      $sqlreintegros           = "select rp.idreintegropersona,rp.operacion,rp.importe
        from mod_nomina.dat_reintegropersona rp
        where rp.idpersona = ?;";
      $mg                      = Doctrine_Manager::getInstance();
      $conn                    = $mg->getCurrentConnection();
      $arregloreintegropersona = $conn->fetchAll($sqlreintegros, array($idpersona));
      // print_r($arregloreintegropersona);die;
      if (count($arregloreintegropersona) > 0) {
        $valor = 0;
        foreach ($arregloreintegropersona as $k => $v) {
          if ($v['operacion'] == 1) {
            $valor -= $v['importe'];
          } else {
            $valor += $v['importe'];
          }

        }
        return $valor;
      } else {
        return 0;
      }
    }


  }
