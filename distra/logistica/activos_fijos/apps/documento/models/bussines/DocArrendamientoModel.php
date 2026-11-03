<?php

/**
 *
 */
class DocArrendamientoModel extends DocumentoActivoModel
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
        $cDatDocUsufructo = 'DatDocArrendamiento';
        
        $doc = parent::addActivoDoc($parametros);
        $doc->$cDatDocumentoActivo->$cDatDocUsufructo->synchronizeWithArray($parametros);
        $cDatDocumentoCliente = 'DatDocumentoCliente';
        $cDatDocumentoClienteObj = new DatDocumentoCliente();
        if ($parametros['iddocumento']) {
            $datDocCliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?',
                array($parametros['iddocumento']));
           
            if(count($datDocCliente) > 0){                
                $datDocCliente[0]->idcliente = $parametros['idcliente'];
                $datDocCliente[0]->idcondicionpago = $parametros['idcondicionpago'];
                $datDocCliente[0]->tipocliente = 1;
                $datDocCliente->save();
            }else{
                $cDatDocumentoClienteObj->idcliente = $parametros['idcliente'];
                $cDatDocumentoClienteObj->idcondicionpago = $parametros['idcondicionpago'];
                $cDatDocumentoClienteObj->tipocliente = 1;
                $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
            }           
        } else {           
            $cDatDocumentoClienteObj->idcliente = $parametros['idcliente'];
            $cDatDocumentoClienteObj->idcondicionpago = $parametros['idcondicionpago'];
            $cDatDocumentoClienteObj->tipocliente = 1;
            $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
        }        
        $doc->save();

        return $doc;
    }

}
