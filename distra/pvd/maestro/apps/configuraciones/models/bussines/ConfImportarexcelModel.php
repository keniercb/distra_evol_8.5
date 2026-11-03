<?php

  /**
   * @name ConfImportarexcelModel - Clase de logica de negocio para la configuracion para importar excel.
   * @package   maestro.configuraciones
   * @copyright XETID.
   * @author    Centro RRHH. División Gestión de Entidades. XETID.
   * @version   1.0
   */
  class ConfImportarexcelModel extends ZendExt_Model
  {
    /**
     * Constructor de la clase
     */
    public function init()
    {
      parent::ZendExt_Model();
    }


    public function existeConfImportarExcel($iddominio, $identidad, $idelemento)
    {
      try {
        return ConfImportarexcel::existeConfImportarExcel($iddominio, $identidad, $idelemento);
      } catch (Exception $e) {
        return Array();
      }
    }

    public function guardarConfImportarCamposExcel($idimportarexcel, $idcampo, $columna, $fila)
    {
      try {
        $arrayExiste = ConfImportarcamposexcel::existeConfImportarCamposExcel($idimportarexcel, $idcampo);
        if (count($arrayExiste) > 0) {
          $objDoc = ConfImportarcamposexcel::obtenerPorId($arrayExiste[0]['idimportarcampoexcel']);
        } else {
          $objDoc = new ConfImportarcamposexcel();
        }

        $objDoc->idimportarexcel = $idimportarexcel;
        $objDoc->idcampo         = $idcampo;
        $objDoc->columnafila     = strtoupper($columna) . ':' . $fila;
        $objDoc->save();
        return 1;
      } catch (Exception $e) {
        return 3;
      }
    }

    public function guardarConfImportarExcel($iddominio, $identidad, $idelemento, $arraycamposmodificados, $arrayelementosconfiguracion)
    {
      try {
        $arrayExiste = $this->existeConfImportarExcel($iddominio, $identidad, $idelemento);
        //print_r($arrayExiste);die;
        if (count($arrayExiste) > 0) {
          $objDoc = ConfImportarexcel::obtenerPorId($arrayExiste[0]['idimportarexcel']);
        } else {
          $objDoc = new ConfImportarexcel();
        }

        $objDoc->iddominio            = $iddominio;
        $objDoc->identidad            = $identidad;
        $objDoc->idelemento           = $idelemento;
        $objDoc->extension            = $arrayelementosconfiguracion['extension'];
        $objDoc->tipoconfiguracion    = $arrayelementosconfiguracion['tipoconfiguracion'];
        $objDoc->columnaclavebusqueda = $arrayelementosconfiguracion['columnaclavebusqueda'];
        if ($arrayelementosconfiguracion['filafinal']) {
          $objDoc->filafinal = $arrayelementosconfiguracion['filafinal'];
        }else{
          $objDoc->filafinal = -1;
        }
        $objDoc->filainicial = $arrayelementosconfiguracion['filainicial'];

        $objDoc->save();

        $idimportarexcel = $objDoc->idimportarexcel;

        foreach ($arraycamposmodificados as $valor) {
          $idcampo = $valor['idcampo'];
          $columna = $valor['columna'];
          $fila    = $valor['fila'];
          $this->guardarConfImportarCamposExcel($idimportarexcel, $idcampo, $columna, $fila);
        }
        return 1;
      } catch (Exception $e) {
        return 3;
      }
    }


    public function obtenerConfImportarExcel($idimportarexcel, $idelemento)
    {
      try {
        return ConfImportarexcel::obtenerConfImportarExcel($idimportarexcel, $idelemento);
      } catch (Exception $e) {
        return 3;
      }
    }

    public function obtenerModulos()
    {
      try {
        return NomDominio::getDominiosAll();
      } catch (Exception $e) {
        return 3;
      }
    }

    public function obtenerElementos($idmodulo)
    {
      try {
        return ConfImportarexcel::obtenerElementos($idmodulo);
      } catch (Exception $e) {
        return Array();
      }
    }
  }
