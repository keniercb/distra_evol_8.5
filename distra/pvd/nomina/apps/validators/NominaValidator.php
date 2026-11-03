<?php

  /**
   * Validator para validar la gesti�n de los elementos del subsistema.
   *
   * @author Tte. Frank Rodriguez Berroa.
   * @package Pvd.
   * @subpackage Nomina - Nomencladores.
   * @category Clase validadora.
   * @copyright UCID
   * @version 1.0
   */
  class NominaValidator
  {
    //Arreglo de valores obtenidos como par�metros.
    public $post = array();

    function nominaValidator()
    {
      $this->post = $_POST;
    }

    /**
     *  Nomenclador de causas de exclusi�n de la n�mina.
     */
    public function adicionarDenomCausaExclusion($denominacion)
    {
      /*$result = NomCausasExclusionNomina::existeCausaExclusion(null, $denominacion);

      if (empty($result)) {
        return true;
      } else {
        return false;
      }*/
    }

    public function modificarDenomCausaExclusion($idcausaexclusion,$denominacion)
    {
      $result = NomCausasExclusionNomina::existeCausaExclusion($idcausaexclusion, $denominacion);
//      print_r($result); die;
      if ($result) {
//        print_r('hola'); die;
        return false;
      }else{
        return true;
      }



    }

    /**
     *  Nomenclador de conceptos de la retribuci�n monetaria.
     */
    public function adicionarDenomConceptoRM($abre,$denominacion)
    {

      /*$result = NomConceptoRM::existeDenominacionRM( $denominacion);
      $result1 = NomConceptoRM::existeAbreviaturaRM($abre);

      if ($result) {
        if($result1)
        return false;
      } else {
        return true;
      }*/
    }

    public function adicionarAbrevConceptoRM()
    {
      /*$result = NomConceptoRM::existeConceptoRM(null, $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }*/
    }

    public function modificarDenomConceptoRM()
    {
      /*$result = NomConceptoRM::existeDenominacionRM($this->post['denominacion'],
        $this->post['idconceptorm']);
      $result1 = NomConceptoRM::existeAbreviaturaRM($this->post['abreviatura'],
        $this->post['idconceptorm']);
        //print_r($result);die;
      if ($result ||$result1) {

        return false;
      } else {
        return true;
      }*/
    }

    public function modificarAbrevConceptoRM()
    {
      $result = NomConceptoRM::existeConceptoRM($this->post['idconceptorm'], $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de formas y sistemas de pago.
     */
    public function adicionarDenomFormaPago()
    {
      $result = NomFormaPago::existeFormaPago(null, $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomFormaPago()
    {
      $result = NomFormaPago::existeFormaPago($this->post['idformapago'], $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarDenomSistemaPago()
    {
      $result = NomSistemaPago::existeSistemaPago($this->post['idformapago'], null, $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomSistemaPago()
    {
      $result = NomSistemaPago::existeSistemaPago($this->post['idformapago'], $this->post['idsistemapago'], $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de grupos escalas.
     */
    public function adicionarDenomGrupoEscala()
    {
      $result = NomGrupoEscala::existeGrupoEscala(null, $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomGrupoEscala()
    {
      $result = NomGrupoEscala::existeGrupoEscala($this->post['idgrupoescala'], $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de per�odos de pagos.
     */
    public function adicionarDenomPeriodoPago()
    {
      $result = NomPeriodoPago::existePeriodoPago(null, null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarCantDiasPeriodoPago()
    {
      $result = NomPeriodoPago::existePeriodoPago(null, $this->post['cantdias'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomPeriodoPago()
    {
      $result = NomPeriodoPago::existePeriodoPago($this->post['idperiodopago'], null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarCantDiasPeriodoPago()
    {
      $result = NomPeriodoPago::existePeriodoPago($this->post['idperiodopago'], $this->post['cantdias'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de per�odos de vacaciones.
     */
    public function adicionarDiasPeriodoVacaciones()
    {
      $result = NomPeriodoVacaciones::existePeriodoVacaciones(null, $this->post['tiempootorgar'], $this->post['tiempodescontar']);

      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDiasPeriodoVacaciones()
    {
      $result = NomPeriodoVacaciones::existePeriodoVacaciones($this->post['idperiodovacaciones'], $this->post['tiempootorgar'], $this->post['tiempodescontar']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de salarios escalas.
     */
    public function adicionarGrupoESalarioEscala()
    {
      //Se obtiene el arreglo de sectores a partir del array de salarios.
      $salarios  = Zend_Json::decode(stripslashes($this->post['salarios']));
      $arraysect = Array();
      foreach ($salarios as $key => $value) {

        //Se obtiene el id del sector y el importe.
        list($aux, $idsector, $salario) = split('[_-]', $value);
        $arraysect[] = $idsector;
      }
      $result = NomSalarioEscala::existeSalarioEscala($arraysect, $this->post['idgrupoescala'], Zend_Json::decode(stripslashes($this->post['idsalescal'])));

      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarGrupoESalarioEscala()
    {
      //Se obtiene el arreglo de sectores a partir del array de salarios.
      $salarios  = Zend_Json::decode(stripslashes($this->post['salarios']));
      $arraysect = Array();
      foreach ($salarios as $key => $value) {

        //Se obtiene el id del sector y el importe.
        list($aux, $idsector, $salario) = split('[_-]', $value);
        $arraysect[] = $idsector;
      }

      $result = NomSalarioEscala::existeSalarioEscala($arraysect, $this->post['idgrupoescala'], Zend_Json::decode(stripslashes($this->post['idsalescal'])));
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de salarios espec�ficos.
     */
    public function adicionarDenomCargoSalarioEspecifico()
    {
      $result = NomSalarioEspecifico::existeSalarioEspecifico(null, $this->post['denominacion'], $this->post['idsector']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomCargoSalarioEspecifico()
    {
      $result = NomSalarioEspecifico::existeSalarioEspecifico($this->post['idsalarioesp'], $this->post['denominacion'], $this->post['idsector']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de sectores salariales.
     */
    public function adicionarDenomSectorSalarial()
    {
      $result = NomSectorSalarial::existeSectorSalarial(null, null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarAbrevSectorSalarial()
    {
      $result = NomSectorSalarial::existeSectorSalarial(null, $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomSectorSalarial()
    {
      $result = NomSectorSalarial::existeSectorSalarial($this->post['idsector'], null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarAbrevSectorSalarial()
    {
      $result = NomSectorSalarial::existeSectorSalarial($this->post['idsector'], $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de situaciones laborales.
     */
    public function adicionarDenomSituacionLaboral()
    {
      $result = NomSituacionLaboral::existeSituacionLaboral(null, null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarAbrevSituacionLaboral()
    {
      $result = NomSituacionLaboral::existeSituacionLaboral(null, $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomSituacionLaboral()
    {
      $result = NomSituacionLaboral::existeSituacionLaboral($this->post['idsituacionlaboral'], null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarAbrevSituacionLaboral()
    {
      $result = NomSituacionLaboral::existeSituacionLaboral($this->post['idsituacionlaboral'], $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }




    
    /**
     *  Nomenclador de cuentas del cierre.
     */
    public function adicionarDenomCuentasCierre()
    {
      $result = NomCuentasCierre::existeCC(null, null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }
    
    public function modificarDenomCuentasCierre()
    {
      $result = NomCuentasCierre::existeCC($this->post['idcuenta'], null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

 


    /**
     *  Nomenclador de tarifas.
     */
    public function adicionarDenomTarifa()
    {
      $result = NomTarifa::existeTarifa(null, $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomTarifa()
    {
      $result = NomTarifa::existeTarifa($this->post['idtarifa'], $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de tarifas.
     */
    public function adicionarDenomTipoNomina()
    {
      /*$result = NomTipoNomina::existeTipoNomina(null, $this->post['denominacion']);
      if ($result == 0) {
        return true;
      } else {
        return false;
      }*/
    }

    public function modificarDenomTipoNomina()
    {
      /*$result = NomTipoNomina::existeTipoNomina($this->post['idtiponomina'], $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }*/
    }

    /**
     *  Nomenclador de tipos de conceptos de pd.
     */
    public function adicionarDenomTipoConceptoPD()
    {
      /*$result = NomTipoConceptoPD::existeTipoConceptoPD(null, $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }*/
    }

    public function modificarDenomTipoConceptoPD()
    {
      /*$result = NomTipoConceptoPD::existeTipoConceptoPD($this->post['idtipoconceptopd'], $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }*/
    }

    /**
     *  Nomenclador de tipos de pagos.
     */
    public function adicionarDenomTipoPago()
    {
      /*$result = NomTipoPago::existeTipoPago(null, $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }*/
    }

    public function modificarDenomTipoPago()
    {
      /*$result = NomTipoPago::existeTipoPago($this->post['idtipopago'], $this->post['denominacion']);
      if ($result) {
        return false;
      } else {
        return true;
      }*/
    }

    /**
     *  Nomenclador de tipos de retenciones.
     */
    public function adicionarDenomTipoRetencion()
    {
      /*$result = NomTipoRetencion::existeTipoRetencion(null, null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }*/
    }

    public function adicionarAbrevTipoRetencion()
    {
      /*$result = NomTipoRetencion::existeTipoRetencion(null, $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }*/
    }

    public function modificarDenomTipoRetencion()
    {
      /*$result = NomTipoRetencion::existeTipoRetencion($this->post['idtiporetencion'], null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }*/
    }

    public function modificarAbrevTipoRetencion()
    {
      $result = NomTipoRetencion::existeTipoRetencion($this->post['idtiporetencion'], $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    /**
     *  Nomenclador de variables globales.
     */
    public function adicionarDenomVariableGlobal()
    {
      $result = NomVariableGlobal::existeVariableGlobal(null, null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarAbrevVariableGlobal()
    {
      $result = NomVariableGlobal::existeVariableGlobal(null, $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarDenomVariableGlobal()
    {
      $result = NomVariableGlobal::existeVariableGlobal($this->post['idvariableglobal'], null, $this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function modificarAbrevVariableGlobal()
    {
      $result = NomVariableGlobal::existeVariableGlobal($this->post['idvariableglobal'], $this->post['abreviatura'], null);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }


    public function eliminarSector()
    {
      return false;

    }


    public function adicionarAbrevConceptoPercepcionDescuento()
    {
      $result = NomConceptoPercepcionDescuento::existeAbreviaturaConcepto($this->post['abreviatura']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarDenomConceptoPercepcionDescuento()
    {
      $result = NomConceptoPercepcionDescuento::existeDenominacionConcepto($this->post['denominacion']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarDenomTarifaConcepto()
    {
      $result = NomConceptoPDTarifa::existeIdTarifaxIdConcepto($this->post['idconcepto'], $this->post['idtarifa']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarDenomVariableAuxiliarFormula()
    {
      $result = NomVariableAuxiliarFormula::existeDenominacionVariableAuxiliar($this->post['denomvariable']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarDenomEstructuraEscalar()
    {
      $result = NomEstructuraEscalar::existeDenomEstructuraEscalarIdConcepto($this->post['denomestruc'], $this->post['idtarifaconcepto']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }


    public function adicionarIdConceptoPD()
    {
      $Elementos = Zend_Json::decode(stripslashes($this->post['idelemsalcargo']));
      $result    = ConfigConceptospdElementosSalarialesModel::existeidConceptoArrElementos($this->post['idconcepto'], $Elementos);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function adicionarIdConceptoPDSituacionServicio()
    {
      $result = ConfigConceptospdElementosSalarialesSituacionServicio::existeidConcepto($this->post['idconcepto'], $this->post['idcargosocupados']);
      if ($result == 1) {
        return false;
      } else {
        return true;
      }
    }

    public function obtenerListadoConfigElementoSalarial()
    {
      $count   = -1;
      $idcargo = $this->post['idcargo'];
      $result  = ConfigElementoSalarialSituacionServicio::obtenerElemSalPersonaCargoOcupado($this->post['idpersona'], $this->post['idcargoocupado']);
      if ($idcargo == "") {
        $count = count($result);
      }
      if ($count == 0) {
        return false;
      } else {
        return true;
      }

    }

    //Funcion encargada de validar que si se elimina una cargo en la estructura y halla una persona en nomina con ese cargo que no lo elimina
    public function validarEliminar($arrayIdEstructura)
      {
          $sqlcargoocupado = "select count (idcargosocupados) cantidad
					from mod_nomina.dat_cargosocupados 
					where idcargo in (" . implode(',', (is_array($arrayIdEstructura))?$arrayIdEstructura:array($arrayIdEstructura)) . ");";
          $mg = Doctrine_Manager::getInstance();
          $conn = $mg->getCurrentConnection();
          $cantcargoocupado = $conn->fetchOne($sqlcargoocupado);
          if ($cantcargoocupado>0) {
              throw new ZendExt_Exception("NOMINA_PVD_ELIM_ESTRUC_001");
          }
          return true;
      }
  }
