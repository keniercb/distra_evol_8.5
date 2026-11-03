<?php

/**
 *
 */
class DocRecepTransfEntreEntidadesModel extends DocumentoActivoModel
{

    protected $_domain;
    protected $_sRegNumerico;
    protected $_sMovimiento;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent:: __construct($idsubsistema);
        $this->_domain = new DatDocTransferenciaEntidades();
        $this->_sRegNumerico = new RegNumericoService();
        $this->_sMovimiento = new MovimientoService();
    }

    /**
     *
     */
    public function addActivoDoc($parametros)
    {
        $parametros['iduebdestino'] = $parametros['identidadorigen'];// Esto se hizo para la contabilizacion
        $doc = parent::addActivoDoc($parametros);
        $this->addDocDesdeDatosTraslados($parametros['datosTraslado'], $doc, $parametros['iddeposito']);
        $doc = $this->agregarDocumentoCliente($doc, $parametros['identidadorigen']);
        $doc->save();
        return $doc;
    }

    /**
     *
     */
    public function aprobarDocumento($idDocumento, $idOperacion, $observaciones, $idEntidadPadre)
    {
        $arrRegNumericos = $this->_sRegNumerico->getIdesRegNumByIdDocumento($idDocumento);
        $cronologia = parent::aprobarDocumento($idDocumento, $idOperacion, $observaciones, $idEntidadPadre);
        
        $docActivo = Doctrine::getTable('DatDocumentoActivo')->find($idDocumento)->toArray();
        //$operacion = ServiciosConfiguracionGeneralHelper::__init()->obtenerOperaciones(0, 0, 0, $idOperacion);
        //$operacion = $this->_mComunAFT->getDatosInterfazOperacion(false, false, $operacion[0]['codigooperacion']);
        $regNumActService = new RegNumActivoService();
        $queryActivo = $regNumActService->getQueryRegNumActivo($asLoc = 'rna');
        $queryActivo->andWhereIn('rna.idregnumerico', $arrRegNumericos);
        $rnas = $queryActivo->execute();
        foreach ($rnas as $key => $rna) {
            $rnas[$key]->idestadoperacion = 1;
            $rnas[$key]->idcentrocosto = $docActivo['idcentrocosto'];
        }
        $rnas->save();

        foreach ($arrRegNumericos as $value) {
            $producto = $this->getIdProducto($idEntidadPadre, $value);

            if ($producto) {

                $query = new Doctrine_Query();
                $query->from('DatProductoLogistica p');
                $query->select('p.cantidad, p.disponible');
                $query->where('p.idproducto = ?', array($producto->idproducto));

                $arrActivosFijos = $query->fetchArray();

                if ($arrActivosFijos[0]['cantidad'] >= 1) {
                    $objProducto = Doctrine::getTable('DatProductoLogistica')->find($producto->idproducto);
                    $objProducto->delete();
                } else {

                    $objProducto = Doctrine::getTable('DatProductoLogistica')->find($producto->idproducto);
                    $salvar = false;

                    if ($objProducto->cantidad > 0) {
                        $objProducto->cantidad = $objProducto->cantidad - 1;
                        $salvar = true;
                    }
					
					if ($objProducto->disponible > 0) {
						$objProducto->disponible = $objProducto->disponible - 1;
						$salvar = true;
					}

					if ($salvar) {
						$objProducto->save();
					}
                }

                
            }
        }

        return $cronologia;
    }

    /**
     * Comprobar si existe un iddocumento en un arreglo
     *
     * @param int   $idDocumento
     * @param array $arreglo
     *
     * @return bool
     */
    private function isValueInArray($idDocumento, $arreglo)
    {
        for ($i = 0; $i < count($arreglo); $i++) {
            if ($arreglo[$i]['iddocumentoOld'] == $idDocumento) {
                return true;
            }
        }
        return false;
    }

    private function delIdesDocRepetidos($parametros)
    {
        $arrIdesDocLineal = array();

        foreach ($parametros AS $value) {
            if (count($arrIdesDocLineal) == 0) {
                $arrIdesDocLineal[0]['iddocumentoOld'] = $value->iddocumentoOld;
            } else {
                $existe = $this->isValueInArray($value->iddocumentoOld, $arrIdesDocLineal);
                if ($existe == false) {
                    $arrIdesDocLineal[count($arrIdesDocLineal)]['iddocumentoOld'] = $value->iddocumentoOld;
                }
            }
        }

        return $arrIdesDocLineal;
    }

    /**
     * Método para obtener los datos necesarios para cargar la interfaz de registro numérico
     */
    public function addObjetosDatTransferencia($datDocumento, $parametros)
    {
        $arrIdesDocOld = $this->delIdesDocRepetidos($parametros);
        $collectionDocPadre = new Doctrine_Collection('DatDocumentoPadre');

        foreach ($arrIdesDocOld as $valor) {
            $objDocPadre = new DatDocumentoPadre();
            $objDocPadre->idpadre = $valor['iddocumentoOld'];
            $objDocPadre->iddocumento = $datDocumento->iddocumento;
            $collectionDocPadre->add($objDocPadre);
        }
        $collectionDocPadre->save();
    }

    /**
     * Método que crea un documento con los registros numéricos obtenidos a partir de un traslado
     */
    public function addDocDesdeDatosTraslados($parametros, $datDocumento, $idAreaResp)
    {
        $valores = array();
        $objRegNumAftModel = (new RegNumActivoService())->getObjRegNumActivoModel();
        $idNewResponsable = ConfiguracionActivosService::getResponsableByIdArea($idAreaResp);

        foreach ($parametros as $key => $value) {
            $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
            $objDatRegnumericoActivo->idarearesp = $idAreaResp;
            $objDatRegnumericoActivo->save();            
            $datos = $objDatRegnumericoActivo->toArray();
            $datos['idprod'] = $value->idprod;
            foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                $datosPlug = $plugin->getDatRegnumericoActivoplugin($value->idregnumerico);
                if($datosPlug){
                    $datos = array_merge($datos, $datosPlug->toArray());
                }
            }
            
            if(count($idNewResponsable)>0){
                $datos['idresponsable'] = $idNewResponsable[0]['idresponsable'];
            }else{
                $datos['idresponsable'] = null;
            }
            $datos['idestructuracomun'] = $this->global->Estructura->idestructura;
            $valores[$key] = $datos;
        }
        /*
         *  Para inyectar las relaciones hasMany/hasOne desde DatMovimientos para DatMovRegnumerico
         *  y desde DatMovRegnumericoActivo para DatMovRegnumerico
         */
        new DatMovRegnumerico();
        new DatMovRegnumericoActivo();
        $datDocumento = $this->_sMovimiento->crearMovimiento($valores, $datDocumento);
        $datDocumento->save();

        $this->addObjetosDatTransferencia($datDocumento, $parametros);
    }

    /**
     *
     */
    public function delDocActivo($parametros)
    {

        $this->resetRegNumerico($parametros['identidadpadre'], $parametros['iddocumento']);
        $doc = Doctrine::getTable('DatDocumento')->find($parametros['iddocumento']);

        $oDocTranfArea = new DocTransferenciaEntreAreasModel();
        $verificarTransf = $oDocTranfArea->getIdesDocsTranfEntreAreas($parametros['iddocumento'], true);

        if (count($verificarTransf) == 1) {
            $documentoOrigen = Doctrine::getTable('DatDocumentoPadre')
            ->findByDql('idpadre =?', array($verificarTransf[0]['iddocumentopadre']));
            $documentoOrigen->delete();
        }

        // Busco el concepto de la operacion para modificar la disponibilidad
        $this->actualizarMovDeOperacion($parametros['idoperacion'], $parametros['iddocumento']);

        $doc->delete();
        return true;
    }

    /**
     * Le cambia al registro numérico el área de responsabilidad por
     * el id de la entidad padre del área donde se había asignado
     */
    public function resetRegNumerico($idEntidadPadre, $idDocumento)
    {
        $arrRegNumericos = $this->_sRegNumerico->getIdesRegNumByIdDocumento($idDocumento);
        $collecionDatRegNumActivo = new Doctrine_Collection('DatRegnumericoActivo');
        $collecionDatRegNumerico = new Doctrine_Collection('DatRegnumerico');

        foreach ($arrRegNumericos as $value) {
            $oRegNumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value);
            $producto = $this->getIdProducto($idEntidadPadre, $value);
            $objDatregnum = Doctrine::getTable('DatRegnumerico')->find($value);
            // Esto es para conocer que el registro esta siendo usado en un documento que no esta aprobado.
            $objDatregnum->enproceso = 0;
            if(!$producto['idproducto']){
                $newprod = new DatProductoLogistica();
                $oRegNum = Doctrine::getTable('DatRegnumerico')->find($value);
                $oProducto = Doctrine::getTable('DatProductoLogistica')->find($oRegNum->idproducto);
                $newprod->idestructuracomun = $idEntidadPadre;
                $newprod->idestructura = $idEntidadPadre;
                $newprod->idindicador = $oProducto->idindicador;
                $newprod->save();
                //$newprod->idproducto
                $objDatregnum->idproducto = $newprod->idproducto;
            }else
            $objDatregnum->idproducto = $producto['idproducto'];

            $collecionDatRegNumerico->add($objDatregnum);
            $oRegNumActivo->idarearesp = $idEntidadPadre;
            $collecionDatRegNumActivo->add($oRegNumActivo);
        }
        $collecionDatRegNumActivo->save();
        $collecionDatRegNumerico->save();
    }

    /**
     *
     */
    public function getIdProducto($idEntidadPadre, $idRegNumerico)
    {
        $oRegNum = Doctrine::getTable('DatRegnumerico')->find($idRegNumerico);
        $oProducto = Doctrine::getTable('DatProductoLogistica')->find($oRegNum->idproducto);

        $query = new Doctrine_Query();
        $query->select('p.idproducto as idproducto');
        $query->from('DatProductoLogistica p');
        $query->where('p.idestructura = ? and p.idindicador = ?', array($idEntidadPadre, $oProducto->idindicador));
        return $query->fetchOne();
    }

}
