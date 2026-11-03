<?php

/**
 *
 */
class DocInventarioModel extends DocumentoActivoModel
{

    private $_mDocAjuste;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent:: __construct($idsubsistema);
        $this->_mDocAjuste = new DocAjusteModel();
    }

    /**
     *
     */
    public function addActivoDoc($parametros)
    {
        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $cDatDocInventarioParcial = 'DatDocInventarioParcial';

        $documento = parent::addActivoDoc($parametros);

//        $parametros['personas'] = json_decode($parametros['personas']);
        (!$parametros['areas']) ? $parametros['areas'] = $parametros['iddeposito'] : '';

        $documento->$cDatDocumentoActivo->$cDatDocInventarioParcial->synchronizeWithArray($parametros);
        $documento->save();

        /* if ($parametros['personas']) {
          $iddoc = $documento->iddocumento;

          if ($parametros['modificar']) {
          DatPersonaInventarioModel::actualizarPersonas($iddoc);
          }

          $collecionPersonasInv = new Doctrine_Collection('DatPersonaInventario');

          foreach ($parametros['personas'] as $idPersona) {
          $oPersona = new DatPersonaInventario();
          $oPersona->iddocumento = $iddoc;
          $oPersona->idpersona = $idPersona;

          $collecionPersonasInv->add($oPersona);
          }

          $collecionPersonasInv->save();
          } */

        return $documento;
    }

    /**
     *
     */
    /* public function getNaturalezasEnArea($parametros)
      {
      $query = $this->mMaestroProd->getQueryIndicador('i');
      $this->sConfGeneral->innerJoinNomNaturaleza($query, 'i', 'nat', true);
      $this->mProdLog->getJoinDatProducto($query, 'i', 'p');

      $query = $this->mRegNumerico->addJoinModel($query, 'p', 'rn', false, false, false);

      $query->innerJoin('p.DatMovimientos m');
      $query->innerJoin('m.DatDocumento d');

      $query->select('DISTINCT nat.denominacion AS denominacionnaturaleza, nat.idnaturaleza AS idnaturaleza');
      $query->orderBy('nat.denominacion');

      if ($parametros['idespecialidad']) {
      $idespecialidades = preg_split("/[,]+/", $parametros['idespecialidad']);
      $query->andWhereIn("i.idespecialidad", $idespecialidades);
      }

      if ($parametros['idnaturalezaInventario']) {
      $query->addWhere("nat.idpadre", $parametros['idnaturalezaInventario']);
      }

      $estructuras = $this->mComunAFT->getIdEstructurasHijas($parametros['idestructura'], true);
      $query->whereIn('p.idestructura', $estructuras);
      $query->addWhere('d.estado = ?', array(3));

      return $query->fetchArray();
      } */

    /**
     *
     */
    /* public function getMediosEnArea($parametros)
      {
      $query = $this->mMaestroProd->getQueryIndicador('i');
      $this->mMaestroProd->addQueryJoinIndicadorHoja($query, 'i', 'ih', 1);
      $this->mMaestroProd->addQueryJoinMarcaModelo($query, 'ih', 'ma', 'mo', true, true);
      $this->mProdLog->getJoinDatProducto($query, 'i', 'p');
      $this->sConfGeneral->innerJoinNomNaturaleza($query, 'i', 'nat', true);
      $query->innerJoin('p.DatMovimientos m');
      $query->innerJoin('m.DatDocumento d');

      if (
      $parametros['idestructura']
      && (
      !is_array($parametros['areasseleccionadas']) || count($parametros['areasseleccionadas']) == 0
      )
      ) {
      $estructura = $this->mComunAFT->getIdEstructurasHijas($parametros['idestructura'], true);
      $query->whereIn('p.idestructura', $estructura);
      } else {
      $query->whereIn('p.idestructura', $parametros['areasseleccionadas']);
      }

      if ($parametros['idespecialidad']) {
      $idespecialidades = preg_split("/[,]+/", $parametros['idespecialidad']);
      $query->andWhereIn("i.idespecialidad", $idespecialidades);
      }

      if ($parametros['idnaturalezaInventario']) {
      $query->addWhere("nat.idpadre", $parametros['idnaturalezaInventario']);
      }

      $query->addWhere('d.estado = ?', array(3));

      return $query->fetchArray();
      } */

    /**
     *
     */
    /* public function getDatosIndicadorInventario($arrIdesIndicadores)
      {
      $query = $this->mMaestroProd->getQueryIndicador('i');
      $this->mMaestroProd->addQueryJoinIndicadorHoja($query, 'i', 'ih', 1);
      $this->mMaestroProd->addQueryJoinMarcaModelo($query, 'ih', 'ma', 'mo', true, true);
      $query->whereIn('i.idindicador', $arrIdesIndicadores);

      return $query->fetchArray();
      } */

    /**
     *
     */
    /* public function getDatosEspecialidadesInventario($arrIdesEspecialidades)
      {
      $datos = array();
      $especialidades = $this->sConfGeneral->ObtenerEspecialidadesHojas();

      foreach ($especialidades as $especialidad) {
      if (array_search($especialidad['idespecialidad'], $arrIdesEspecialidades)) {
      array_push($datos, $especialidad);
      }
      }

      return $datos;
      } */

    /**
     *
     */
    public function getDatEspecificosDoc($idDocumento)
    {
        $idPersonaas = DatPersonaInventarioModel::getIdPersonasByIdDoc($idDocumento);
        $personas = $this->_sRecHumanos->buscarPersonaPorArreglodeID($idPersonaas);

        $respuesta = array();
        $aux = 1;

        foreach ($personas as $persona) {

            $campo = new stdClass();
            $nombre = $persona['nombre'];
            $nombre .= ($persona['snombre']) ? ' ' . $persona['snombre'] : '';
            $nombre .= ($persona['papel']) ? ' ' . $persona['papel'] : '';
            $nombre .= ($persona['sapel']) ? ' ' . $persona['sapel'] : '';

            $campo->xtype = "textarea";
            $campo->anchor = "95%";
            $campo->fieldLabel = "Integrante comisión" . " Nro. " . $aux++;
            $campo->data = $nombre;

            array_push($respuesta, $campo);
        }
        return array("data" => $respuesta);
    }

    /**
     *
     */
    public function aprobarDocumento($parametros)
    {


        $serieService = new RegNumericoService();

        $idareaCmp = ($parametros['parcial']) ? $parametros['identidadpadre'] :
            $parametros['idarea'];

        $operConteo = ComunAFTModel::getInstance()->getOperacionSobreMediosById($parametros['idoperacion']);
        $codAjustSobranteAFT = 'OPER_AJUSTE_SOBRANTE';
        $codAjustFaltanteAFT = 'OPER_AJUSTE_FALTANTE';
        // Verificando si el codigo de la operacion de conteo termina con _UH (es utiles y herramientas)
        if(strpos($operConteo->codigooperacion, '_UH') > 0){
            $codAjustSobranteAFT = 'OPER_AJUSTE_SOBRA_UH';
            $codAjustFaltanteAFT = 'OPER_AJUSTE_FALTA_UH';
        }

        $opeAjusteS = $this->_mComunAFT->getDatosInterfazOperacion(
            false, false, $codAjustSobranteAFT, false, $idareaCmp
        );

        if (count($opeAjusteS) > 0) {
            $iddocS = $this->_sConfGeneral->obtenerOperaciones(null, null, null, $opeAjusteS[0]['idoperacion']);
            $opeAjusteF = $this->_mComunAFT->getDatosInterfazOperacion(
                false, false, $codAjustFaltanteAFT, false, $idareaCmp
            );
            $iddocF = $this->_sConfGeneral->obtenerOperaciones(null, null, null, $opeAjusteF[0]['idoperacion']);

            if (count($iddocF) == 0) {
                return 5;
            }
        } else {
            return 5;
        }

        $regContados = $this->getMovDadoIdDoc(false, $parametros['iddocumento']);

        $cantRNenDoc = $serieService->getCantRegNumDadoIdDocumento($parametros['iddocumento']);


        if (count($regContados) != $cantRNenDoc) {
            return 6;
        }

        $movDocFaltantes = $this->getMovDadoIdDoc('rojo', $parametros['iddocumento']);

        if (count($movDocFaltantes) > 0) {
            $parametros['iddoc'] = (is_array($iddocF[0])) ? $iddocF[0]['iddocentidad'] : $iddocF[0]->iddocentidad;
            $parametros['idoperacion'] = $opeAjusteF[0]['idoperacion'];
            $parametros['faltantes'] = 2;
            $respFaltantes = $this->_mDocAjuste->crearDocAjuste($parametros, $movDocFaltantes, false);
        } else {
            $respFaltantes = 2;
        }

        if ($respFaltantes) {
            $movDocSobrantes = $this->getMovDadoIdDoc('verde', $parametros['iddocumento']);

            if (count($movDocSobrantes) > 0) {
                $parametros['iddoc'] = (is_array($iddocS[0])) ? $iddocS[0]['iddocentidad'] : $iddocS[0]->iddocentidad;
                $parametros['idoperacion'] = $opeAjusteS[0]['idoperacion'];
                $respSobrantes = $this->_mDocAjuste->crearDocAjuste($parametros, $movDocSobrantes, false);
            } else {
                $respSobrantes = 2;
            }
        }

        if ($respSobrantes && $respFaltantes) {
            return DocumentoLogisticaModel::aprobarDocumento($parametros['iddocumento'], true);
        } else {
            return false;
        }
    }

    /**
     *
     */
    public function cancelarDocInventario($idDocumento)
    {
        /*$query = new Doctrine_Query();
        $query->delete()->from('DatMovimientos m')->where('m.iddocumento = ?', $idDocumento)->execute();*/
        if($idDocumento){
            $conn = Zend_Registry::get('conexion');
        $sql = "DELETE FROM mod_logistica.dat_movimiento m WHERE m.iddocumento = {$idDocumento}";
            $conn->execute($sql);

        } else {
            throw new Exception('Falta el iddocumento');
        }
    }

    /**
     *
     */
    public function validarDocPMensual($parametros, $objPeriodo, $idoperacion)
    {

        $query = new Doctrine_Query();
        $query->select('d.iddocumento')
            ->from('DatDocumento d')
            ->innerJoin('d.DatDocumentoActivo da')
            ->innerJoin('da.DatDocInventarioParcial dip');

        $query->addWhere("d.fechacontable >= ? AND d.fechacontable <= ?", array($objPeriodo->inicio, $objPeriodo->fin));
        $query->addWhere('dip.mensual = ?', array(1));
        $query->addWhere('d.idestructuracomun = ?', array($parametros['idestructuracomun']));
        if($idoperacion){
            $query->addWhere('d.idoperacion = ?', array($idoperacion));
        }
        if ($query->count() > 0) {
            throw new ZendExt_Exception('LOG_AFT_DOC_010');
        }
        return true;
    }

}
