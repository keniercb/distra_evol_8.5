<?php

/**
 *
 */
class DocBajaDesarmeModel extends DocumentoActivoModel
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
        $cDatDocBajaDesarme = 'DatDocBajaDesarme';

        $doc = parent::addActivoDoc($parametros);
        $doc->$cDatDocumentoActivo->$cDatDocBajaDesarme->synchronizeWithArray($parametros);
        $doc->save();

        return $doc;
    }

    /**
     *
     */
    public function getDatEspecificosDoc($idDocumento)
    {
        $oEnvReparar = Doctrine::getTable('DatDocBajaDesarme')->find($idDocumento);

        $respuesta = array();
        $campo = new stdClass();
        $campo->xtype = "textarea";
        $campo->anchor = "95%";

        $objEntidad = $campo;
        $objEntidad->fieldLabel = "Entidad";
        $objEntidad->data = $oEnvReparar->entidad;
        array_push($respuesta, $objEntidad);

        $objInforme = $campo;
        $objInforme->fieldLabel = "Informe t&eacutecnico";
        $objInforme->data = $oEnvReparar->informetecnico;
        array_push($respuesta, $objInforme);


        $objDesFinal = $campo;
        $objDesFinal->fieldLabel = "Destino final";
        $objDesFinal->data = $oEnvReparar->destinofinal;
        array_push($respuesta, $objDesFinal);

        return array("data" => $respuesta);
    }

}
