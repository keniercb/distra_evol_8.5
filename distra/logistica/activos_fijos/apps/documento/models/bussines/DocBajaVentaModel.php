<?php

/**
 *
 */
class DocBajaVentaModel extends DocumentoActivoModel
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
        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $cDatDocBajaVenta = 'DatDocBajaVenta';        
        $doc = parent::addActivoDoc($parametros);
        $doc->$cDatDocumentoActivo->$cDatDocBajaVenta->synchronizeWithArray($parametros);
        $doc->$cDatDocumentoActivo->$cDatDocBajaVenta->idclientesproveedoresbajaventa = (
            $parametros['idcliente'] != null
        ) ? $parametros['idcliente']: null;   
        $doc->$cDatDocumentoActivo->$cDatDocBajaVenta->iddestinofinal = (
            $parametros['iddestinofinal'] != null
            )? $parametros['iddestinofinal']: null;
        $cDatDocumentoCliente = 'DatDocumentoCliente';
        $cDatDocumentoClienteObj = new DatDocumentoCliente();
       if ($parametros['iddocumento']) {
            $datDocCliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?',
                array($parametros['iddocumento']));
           
            if(count($datDocCliente) > 0){                
                $datDocCliente[0]->idcliente = ($parametros['idcliente'] != null) ? $parametros['idcliente']: null;
                $datDocCliente[0]->idcondicionpago = $parametros['idcondicionpago'];
                $datDocCliente[0]->tipocliente = 1;
                $datDocCliente->save();
            }else{
                $cDatDocumentoClienteObj->idcliente = (
                    $parametros['idcliente'] != null
                ) ? $parametros['idcliente']: null;
                $cDatDocumentoClienteObj->idcondicionpago = $cDatDocumentoClienteObj->idcondicionpago = (
                $parametros['idcondicionpago'] != null
            )? $parametros['idcondicionpago']: null;
                $cDatDocumentoClienteObj->tipocliente = 1;
                $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
            }           
        } else {           
            $cDatDocumentoClienteObj->idcliente = ($parametros['idcliente'] != null) ? $parametros['idcliente']: null;
            $cDatDocumentoClienteObj->idcondicionpago = (
                $parametros['idcondicionpago'] != null
            )? $parametros['idcondicionpago']: null;
            $cDatDocumentoClienteObj->tipocliente = 1;
            $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
        } 
        $doc->save();

        return $doc;
    }

    public function getDatEspecificosDoc($idDocumento)
    {
        $oBajaVenta = Doctrine::getTable('DatDocBajaVenta')->find($idDocumento);

        $respuesta = array();
        $campo = new stdClass();
        $campo->xtype = "textarea";
        $campo->anchor = "95%";

        $objEntidad = $campo;
        $objEntidad->fieldLabel = "Entidad";
        $objEntidad->data = $oBajaVenta->entidad;
        array_push($respuesta, $objEntidad);

        $objInforme = $campo;
        $objInforme->fieldLabel = "Informe t&eacutecnico";
        $objInforme->data = $oBajaVenta->informetecnico;
        array_push($respuesta, $objInforme);

        $objDireccion = $campo;
        $objDireccion->fieldLabel = "Direcci&oacute;n";
        $objDireccion->data = $oBajaVenta->direccion;
        array_push($respuesta, $objDireccion);


        $objNroContrato = $campo;
        $objNroContrato->fieldLabel = "N.\xb0 contrato";
        $objNroContrato->data = $oBajaVenta->nrocontrato;
        array_push($respuesta, $objNroContrato);

        return array("data" => $respuesta);
    }
    
    

}
