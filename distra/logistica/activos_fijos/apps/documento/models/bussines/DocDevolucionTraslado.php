<?php
/**
 * Created by PhpStorm.
 * User: Gerardo
 * Date: 12-Nov-16
 * Time: 11:00 PM
 */

class DocDevolucionTraslado extends DocumentoActivoModel {

    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent:: __construct($idsubsistema);
    }

    public function addActivoDoc($parametros)
    {
        $parametros['iduebdestino'] = $parametros['identidadorigen'];
        $doc = parent::addActivoDoc($parametros);
        $this->addDocDesdeDatosTraslados($parametros['datosTraslado'], $doc, $parametros['iddeposito']);
        $this->agregarDocumentoCliente($doc,$parametros['idEstructuraOrigenDocSalida'])
            ->save();
        return $doc;
    }

    /**
     * Método que crea un documento con los registros numéricos optenidos a partir de una devolucion
     */
    public function addDocDesdeDatosTraslados($parametros, $datDocumento, $idAreaResp)
    {
        $rnClass = 'DatRegnumerico';
        $valores = array();
        $objRegNumAftModel = (new RegNumActivoService())->getObjRegNumActivoModel();
        foreach ($parametros as $key => $value) {
            $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
            $objDatRegnumericoActivo->idarearesp = $idAreaResp;
            $objDatRegnumericoActivo->save();
            $datos = $objDatRegnumericoActivo->toArray();
            if(!$value->idprod){
                $prod = Doctrine::getTable('DatProductoLogistica')->find($objDatRegnumericoActivo->$rnClass->idproducto);
                $value->idprod = $prod->idindicador;
            }
            $datos['idprod'] = $value->idprod;
            foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                $datosPlug = $plugin->getDatRegnumericoActivoplugin($value->idregnumerico);
                $datos = array_merge($datos, $datosPlug->toArray());
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
        $sMovimiento = new MovimientoService();
        $datDocumento = $sMovimiento->crearMovimiento($valores, $datDocumento);
        $datDocumento->save();

        //$this->addObjetosDatTransferencia($datDocumento, $parametros);
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


    public function delDocActivo($parametros)
    {
		$idoperacion = $parametros['idoperacion'];
		$comunModel = ComunAFTModel::getInstance();
		$datos = $comunModel->getDatosInterfazOperacion(false, false, false, false, false, 0, false, $idoperacion);
		if(count($datos) != 1)
			throw new ZendExt_Exception();
		
		if($datos[0]['codigo'] == 'OPER_REC_INVENTARIO' || $datos[0]['codigo'] == 'OPER_REC_INV_EXT'){
			parent::delDocActivo($parametros);
		}else {
			throw new LogisticaException('LOG_AFT_DOC_013');
		}
    }

} 