<?php

/**
 *
 */
class DocAltaCompraModel extends DocumentoActivoModel
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
        $cDatDocAltaCompra = 'DatDocAltaCompra';
        $cDatDocumentoCliente = 'DatDocumentoCliente';
        $cDatDocumentoClienteObj = new DatDocumentoCliente();
        $doc = parent::addActivoDoc($parametros);

        $doc->$cDatDocumentoActivo->$cDatDocAltaCompra->synchronizeWithArray($parametros);
        if ($parametros['iddocumento']) {
            $datDocCliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?',
                array($parametros['iddocumento']));

            if (count($datDocCliente) > 0) {
                $datDocCliente[0]->idcliente = $parametros['idclientesproveedores'];
                if(is_numeric($parametros['idcondicionpago'])){
                    $datDocCliente[0]->idcondicionpago = $parametros['idcondicionpago'];
                }
                $datDocCliente[0]->tipocliente = 1;
                $datDocCliente->save();
            } else {
                $cDatDocumentoClienteObj->idcliente = $parametros['idclientesproveedores'];
                if(is_numeric($parametros['idcondicionpago'])){
                    $cDatDocumentoClienteObj->idcondicionpago = $parametros['idcondicionpago'];
                }
                $cDatDocumentoClienteObj->tipocliente = 1;
                $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
            }
        } else {
            $cDatDocumentoClienteObj->idcliente = $parametros['idclientesproveedores'];
            if(is_numeric($parametros['idcondicionpago'])){
                $cDatDocumentoClienteObj->idcondicionpago = $parametros['idcondicionpago'];
            }
            $cDatDocumentoClienteObj->tipocliente = 1;
            $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
        }
        $doc->save();

        return $doc;
    }

}
