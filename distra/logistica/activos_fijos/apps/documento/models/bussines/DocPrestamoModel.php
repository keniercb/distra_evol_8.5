<?php

/**
 *
 */
class DocPrestamoModel extends DocumentoActivoModel
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
        $cDatDocPrestamo = 'DatDocPrestamo';
        if ($parametros['idpersona'] != null || $parametros['idpersona'] != '') {
            unset($parametros['idclientesproveedores']);
        } else {
            unset($parametros['idpersona']);
        }
        $doc = parent::addActivoDoc($parametros);
        $doc->$cDatDocumentoActivo->$cDatDocPrestamo->synchronizeWithArray($parametros);
        $cDatDocumentoCliente = 'DatDocumentoCliente';
        $cDatDocumentoClienteObj = new DatDocumentoCliente();
        if ($parametros['iddocumento']) {
            $datDocCliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?',
                array($parametros['iddocumento']));
           
            if(count($datDocCliente) > 0){                
                $datDocCliente[0]->idcliente = $parametros['idclientesproveedores'];
                $datDocCliente[0]->idcondicionpago = $parametros['idcondicionpago'];
                $datDocCliente[0]->tipocliente = 1;
                $datDocCliente->save();
            }else{
                $cDatDocumentoClienteObj->idcliente = $parametros['idclientesproveedores'];
                $cDatDocumentoClienteObj->idcondicionpago = $parametros['idcondicionpago'];
                $cDatDocumentoClienteObj->tipocliente = 1;
                $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
            }           
        } else {           
            $cDatDocumentoClienteObj->idcliente = $parametros['idclientesproveedores'];
            $cDatDocumentoClienteObj->idcondicionpago = $parametros['idcondicionpago'];
            $cDatDocumentoClienteObj->tipocliente = 1;
            $doc->$cDatDocumentoCliente->add($cDatDocumentoClienteObj);
        } 
        $doc->save();

        return $doc;
    }

    public function buscarPersona($idpersona)
    {
        $query = Doctrine_Query::create();
        $query->from('DatDocPrestamo prestamo');
        $query->addSelect('prestamo.idpersona');
        $query = ServiciosRecursosHumanosHelper::__init()->agregarDqlDatosPersona(
            $query, 'prestamo', 'persona', false, array(), 'leftjoin'
        );
        $query->where("prestamo.idpersona = {$idpersona}");
        $query->addSelect(
            "persona.nombre as nombreprestamo,persona.snombre as snombreprestamo,"
            . "persona.papel as papelprestamo,persona.sapel as sapleprestamo"
        );
        return $query->fetchArray();
    }

}
