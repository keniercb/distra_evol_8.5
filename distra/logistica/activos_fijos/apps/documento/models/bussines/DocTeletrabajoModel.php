<?php

/**
 *
 */
class DocTeletrabajoModel extends DocumentoActivoModel
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
        
        unset($parametros['idclientesproveedores']);
        $doc = parent::addActivoDoc($parametros);
        $doc->$cDatDocumentoActivo->$cDatDocPrestamo->synchronizeWithArray($parametros);
        
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
