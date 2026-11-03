<?php

/**
 *
 */
class DocTransferenciaEntreAreasModel extends DocumentoActivoModel
{

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent:: __construct($idsubsistema);
    }

    /**
     *
     */
    public function addActivoDoc($parametros)
    {
		$operTrasSalida = $this->_mComunAFT->getDatosInterfazByIdOperacion($parametros['idoperacion']);
		
		$codRecTrasInter = 'OPER_REC_TRAS_INTER';
		if($operTrasSalida['codigo'] == 'OPER_TRAS_INTER_UH'){
			$codRecTrasInter = 'OPER_REC_TRAS_INT_UH';
		}
		
        //  Busco la operación de tipo Proceso de Traslados Internos (Entrada) en el xml de configuración.
        $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
            false, false, $codRecTrasInter, false, $parametros['identidad'], $parametros['iddoc']
        );

        if (count($operaciones) == 0) {
            throw new ZendExt_Exception('LOG_AFT_DOC_006');
        } else {

            $datDocOrigen = parent::addActivoDoc($parametros); 
            $datDocOrigen->save(); 
            $estructura = $this->integrator->metadatos->DameEstructura($datDocOrigen->idestructuracomun);

            $parametros['observaciones'] = 'Documento generado automaticamente a partir de la transferencia interna #'
                . ($datDocOrigen->nrodoc) . ' del área: '
                . ($estructura[0]->denominacion) . '.';

            $parametros['idestructuracomun'] = $parametros['idAreaDestino'];
            $parametros['idcentrocosto'] = ($parametros['idcentrocostoDestino']) ?
                $parametros['idcentrocostoDestino'] : null;

            $parametros['idoperacion'] = $operaciones[0]['idoperacion'];
            $parametros['iddoc'] = $operaciones[0]['iddoc'];

			
			if ($parametros['iddocumento']) {
                if (ctype_digit($parametros['idAreaDestino'])) {
                    $parametros['idestructuracomun'] = $parametros['idAreaDestino'];
                } else {
                    unset($parametros['idestructuracomun']);
                }
                if (ctype_digit($parametros['idcentrocostoDestino'])) {
                    $parametros['idcentrocosto'] = ($parametros['idcentrocostoDestino']) ?
                        $parametros['idcentrocostoDestino'] : null;
                } else {
                    unset($parametros['idcentrocosto']);
                }

                $idransf = $this->getIdesDocsTranfEntreAreas($parametros['iddocumento']);

                $objDocPadre = Doctrine::getTable('DatDocumentoPadre')->find(
                    $idransf[0]['iddocumentopadre']
                );
                //$objDocDestino = Doctrine::getTable('DatDocumento')->find($objTransferencia->iddocdestino);
                $objDocDestino = Doctrine::getTable('DatDocumento')->find($objDocPadre->iddocumento);

                unset($parametros['iddocumento']);
                $objDocDestino->synchronizeWithArray($parametros);
                $objDocDestino->estado = 10;
                $objDocDestino->nrodoc = null;

                $classDatDocumentoActivo = 'DatDocumentoActivo';
                $objDocDestino->$classDatDocumentoActivo->synchronizeWithArray($parametros);
                $objDocDestino->save();

                return $objDocDestino; //------------
            } else {
                $datdocDestino = parent::addActivoDoc($parametros);
                $datdocDestino->estado = 10;
                $datdocDestino->nrodoc = null;
                $datdocDestino->save();

                $objDocPadre = new DatDocumentoPadre();
                $objDocPadre->idpadre = $datDocOrigen->iddocumento;
                $objDocPadre->iddocumento = $datdocDestino->iddocumento;

                $objDocPadre->save();

                return $datdocDestino;
            }
        }
    }

    /**
     *
     */
    public function aprobarDocumento($idDocumento, $idOperacion, $observaciones)
    {
        $logMovModel = new LogisticaMovimientoModel();

        $sRegNumActivo = new RegNumActivoService();
        
        $verifTransferencia = $this->getIdesDocsTranfEntreAreas($idDocumento);
        
        if (count($verifTransferencia) == 1) { // Documento traslado area salida
            $this->_sMovimiento->actualizarCantidadMedios($idDocumento, '-');
            
            $cronologiadoc = DocumentoLogisticaModel::aprobarDocumento($idDocumento, true);
            
            
            self::clonarMovimientos($verifTransferencia[0]['iddocumentopadre'], $idOperacion, $observaciones);
            
            $logMovModel->aprobarCronologiaProductos($idDocumento, $cronologiadoc);
            
        } else { // Documento traslado area entrada
            
            $this->_sMovimiento->actualizarCantidadMedios($idDocumento, '+');
            
            $this->actualizarCentrosCosto($idDocumento);
            
            $sRegNumActivo->actualizarRegNumByIdDocumento($idDocumento, false);
            
            $cronologiadoc = DocumentoLogisticaModel::aprobarDocumento($idDocumento, true);
            
            $logMovModel->aprobarCronologiaProductos($idDocumento, $cronologiadoc);
        }
        
        return $cronologiadoc;
    }

    /**
     *
     */
    public function clonarMovimientos($idDocTranf, $idOperacion, $observaciones)
    {
        $sRegNumActivo = new RegNumActivoService();

        $sRegNumActivo->initReNumActivoModel();
        $objRegNumAftModel = $sRegNumActivo->getObjRegNumActivoModel();
        $idProducto = null;
        $productoNew = null;
        
        $objDocPadre = Doctrine::getTable('DatDocumentoPadre')->find($idDocTranf);
        $docOrigen = Doctrine::getTable('DatDocumento')->find($objDocPadre->idpadre);
        $docDestino = Doctrine::getTable('DatDocumento')->find($objDocPadre->iddocumento);
		
		$idEstructura = $this->global->Estructura->idestructura;
		$idEjercicioActual = $this->integrator->datosmaestros->ejercicioActualSubsistema($idEstructura, LogisticaGlobal::SUBSISTEMA_AFT);
		
        $docDestino->save();

        $serieService = new RegNumericoService();
        $movimientosDocOrigen = $serieService->getMovDadoDocumento($docOrigen->iddocumento);
        $cantidadMovs = count($movimientosDocOrigen);

        for ($i = 0; $i < $cantidadMovs; $i++) {

            $objMovimientoClonado = new DatMovimientos();
            $objMovimiento = Doctrine::getTable('DatMovimientos')->find($movimientosDocOrigen[$i]['idmovimiento']);
            $productoOld = Doctrine::getTable('DatProductoLogistica')->find($objMovimiento->idproducto);

            if ($idProducto != $productoOld->idindicador) {
                $idProducto = $productoOld->idindicador;
                $prod = Doctrine_Query::create()
                    ->select('p.idproducto as idproducto')
                    ->from('DatProductoLogistica p')
                    ->where(
                        'p.idestructura = ? and p.idindicador = ?',
                        array($docDestino->idestructuracomun, $productoOld->idindicador)
                    )
                    ->fetchOne();
            }

            if ($prod && $prod->idproducto) {
                $productoNew = Doctrine::getTable('DatProductoLogistica')->find($prod->idproducto);
            } else {
                $productoNew = new DatProductoLogistica();
                $productoNew->idindicador = $productoOld->idindicador;
                $productoNew->idestructura = $docDestino->idestructuracomun;
                $productoNew->cronologia = 0;
                $productoNew->cantidad = 0;
                $productoNew->disponible = 0;
                $productoNew->save();
            }

            $objMovimientoClonado->synchronizeWithArray($objMovimiento->toArray());
            $objMovimientoClonado->idmovimiento = null;
            $objMovimientoClonado->idproducto = $productoNew->idproducto;
            $objMovimientoClonado->iddocumento = $docDestino->iddocumento;
            $objMovimientoClonado->save();
            
            for ($j = 0; $j < count($movimientosDocOrigen[$i]['DatMovRegnumerico']); $j++) {

                $objMovimientoRegnumerico = Doctrine::getTable('DatMovRegnumerico')
                    ->find($movimientosDocOrigen[$i]['DatMovRegnumerico'][$j]['idmovregnumerico']);

                $objDatRegNumerico = Doctrine::getTable('DatRegnumerico')->find(
                    $objMovimientoRegnumerico->idregnumerico
                );
                $objDatRegNumerico->idproducto = $productoNew->idproducto;
                $objDatRegNumerico->save();

                $objMovimientoRegnumericoClonado = new DatMovRegnumerico();
                $objMovimientoRegnumericoClonado->synchronizeWithArray($objMovimientoRegnumerico->toArray());
                $objMovimientoRegnumericoClonado->idmovregnumerico = null;
                $objMovimientoRegnumericoClonado->idmovimiento = $objMovimientoClonado->idmovimiento;
                $objMovimientoRegnumericoClonado->save();

                $objMovimientoRegnumericoActivo = Doctrine::getTable('DatMovRegnumericoActivo')
                    ->find($objMovimientoRegnumerico->idmovregnumerico);

                $objMovRegNumericoActivoClonado = new DatMovRegnumericoActivo();
                $objMovRegNumericoActivoClonado->synchronizeWithArray(
                    $objMovimientoRegnumericoActivo->toArray()
                );
                $objMovRegNumericoActivoClonado->idmovregnumerico = $objMovimientoRegnumericoClonado->idmovregnumerico;

                $objMovRegNumericoActivoClonado->idarearesp = $docDestino->idestructuracomun;
                $objMovRegNumericoActivoClonado->idubicacion = null;
                // Buscar el idresponsable
                $idNewResponsable = ConfiguracionActivosService::getResponsableByIdArea($docDestino->idestructuracomun);                
                
                
                // Actualizar los registros numericos de los movimientos de registros numericos                
                if($objMovRegNumericoActivoClonado->idresponsable == null && count($idNewResponsable)>0){
                    $objMovRegNumericoActivoClonado->idresponsable = $idNewResponsable[0]['idresponsable'];
                }/*else{
                    $objMovRegNumericoActivoClonado->idresponsable = null;
                }*/
                
                $objMovRegNumericoActivoClonado->save();

                // Recorro todos los plugins y clono los movimientos de registro numérico de cada plugin
                foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                    $plugin->clonarMovimiento(
                        $objMovimientoRegnumerico->idmovregnumerico, $objMovimientoRegnumericoClonado->idmovregnumerico
                    );
                }
            }
        }

        self::aprobarDocumento($docDestino->iddocumento, $idOperacion, $observaciones);
    }

    /**
     *
     */
    public function delDocActivo($parametros)
    {
        $idDocumento = $parametros['iddocumento'];
        $rnModel = new RegNumericoModel();
        $rnModel->actualizarEstadoEnProcesoRn($idDocumento);

        $verifTransferencia = $this->getIdesDocsTranfEntreAreas($parametros['iddocumento']);
        if (count($verifTransferencia) == 1) {
            $objTransfeEntreAreas = Doctrine::getTable('DatDocumentoPadre')
                ->find($verifTransferencia[0]['iddocumentopadre']);
            $docDestino = Doctrine::getTable('DatDocumento')->find($objTransfeEntreAreas->iddocumento);
            $objTransfeEntreAreas->delete();
            $docDestino->delete();
        }

        $respuesta = parent::eliminarDocumento($idDocumento);

        //Busco el concepto de la operación para modificar la disponibilidad
        $this->actualizarMovDeOperacion($parametros['idoperacion'], $parametros['iddocumento']);
        return $respuesta;
    }

    /**
     *
     */
    public function getDatEspecificosDoc($idDocumento)
    {
        $docTransfEntreAreas = Doctrine::getTable('DatDocTransfereciaEntreAreas')
            ->findByDql('iddocorigen = ?', array($idDocumento));

        if ($docTransfEntreAreas) {

            new DatDocumentoActivo();
            $cDatDocumentoActivo = 'DatDocumentoActivo';
            $objDocgenerado = Doctrine::getTable('DatDocumento')->find($docTransfEntreAreas[0]->iddocdestino);

            $idEstructuraDocGenerado = ($objDocgenerado->idestructuracomun) ?
                $objDocgenerado->idestructuracomun : null;
            $idCCostoDocGenerado = $objDocgenerado->$cDatDocumentoActivo->idcentrocosto;

            //$estructura = $this->_sEstrComposicion->getEstructura($idEstructuraDocGenerado);
            $estructura = $this->integrator->metadatos->DameEstructura($idEstructuraDocGenerado);

            $culumnas = array();

            $columna = new stdClass();
            $columna->xtype = "textarea";
            $columna->anchor = "95%";

            $colArea = $columna;
            $colArea->fieldLabel = "&Aacuterea de responsabilidad";
            $colArea->data = $estructura[0]->denominacion;
            array_push($culumnas, $colArea);


            if (ComunAFTModel::integradoContabilidad()) {
                $centroCosto = $this->_sContabilidad->ObtenerCentroNivelPorId($idCCostoDocGenerado);

                $colCCosto = $columna;

                $colCCosto->fieldLabel = "Centro de costo";
                $colCCosto->data = ($centroCosto) ? $centroCosto['descripcioncentrogrupo'] : '';
                array_push($culumnas, $colCCosto);
            }
            return array("data" => $culumnas);
        }
        return array("data" => array());
    }

    /**
     *
     */
    public function getIdesDocsTranfEntreAreas($idDocumento, $docDestino = false)
    {
        $query = new Doctrine_Query();
        if ($docDestino == true) {
            $query->addwhere('ddp.iddocumento = ?', array($idDocumento));
        } else {
            $query->addwhere('ddp.idpadre = ?', array($idDocumento));
        }
        return $query->select('ddp.*')
                ->from("DatDocumentoPadre ddp")
                ->fetchArray();
    }

}
