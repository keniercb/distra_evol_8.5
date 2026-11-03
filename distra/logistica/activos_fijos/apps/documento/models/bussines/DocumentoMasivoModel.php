<?php

/**
 *
 */
class DocumentoMasivoModel extends DocumentoActivoModel
{

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     *
     */

    public function getOperaciones($parametros, $paraLosDocumentos = false, $cargarInveParcialTotal = true)
    {
        if (!$parametros['iddoc'] && !$paraLosDocumentos) {
			$codigo = ($parametros['codigooper']) ? $parametros['codigooper'] : false;
            $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                $parametros['operacionEspecifica'], false, $codigo, false, $parametros['idestructura'], ($parametros['idDocPrim'])?$parametros['idDocPrim']:0,
                $parametros['idfuncionalidad']
            );
        } else {
            $configServ = new ConfiguracionActivosService();
            $result = $configServ->getConfiguracionPG($this->global->Estructura->idestructura, ($this->idsubsistema == LogisticaGlobal::SUBSISTEMA_AFT) ? 0 : 1);
            $flag = $this->objectHelper->getBooleanStr($result[0]['contabilidad']);
            $operaciones = self::getOperacionesAux($flag, $parametros);
        }

        if (
            $parametros['operacionEspecifica'] && $parametros['operacionEspecifica'] == 17 && count($operaciones) == 0
        ) {
            /**
             *  Exepción lanzada para el caso de no encontrarse operaciones configuradas para el caso de una recepción
             *  de un traslado desde otra entidad
             */
            throw new ZendExt_Exception('LOG_AFT_DOC_007');
        }
        //print_r($operaciones);die;
        foreach ($operaciones as $pos => $oper) {
            if ($oper['codigo'] != "OPER_TRASLADO_EXTER" && $oper['codigo'] != "OPER_TRAS_EXTER_UH") {
                unset($operaciones[$pos]);
            }
        }
        return array_values($operaciones);
    }
}
