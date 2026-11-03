<?php

/**
 * Incluye todas las clases necesarias para el servicio de recuperacion de la operacion
 */

$base_path = Zend_Registry::getInstance()->get('config')->dir_aplication . '/configuracion/';

if (!class_exists('BaseNomDocprim')) {
    require_once $base_path . 'documento/models/domain/generated/BaseNomDocprim.php';
}

if (!class_exists('NomDocprim')) {
    require_once $base_path . 'documento/models/domain/NomDocprim.php';
}

if (!class_exists('BaseDatDocumentoprim')) {
    require_once $base_path . 'documento/models/domain/generated/BaseDatDocumentoprim.php';
}

if (!class_exists('DatDocumentoprim')) {
    require_once $base_path . 'documento/models/domain/DatDocumentoprim.php';
}


class GestoperacionesServices extends ZendExt_Model
{

    public function __construct()
    {
        $this->dir_app = Zend_Registry::get('config')->dir_aplication;
        parent::ZendExt_Model();
        $this->operaciones = new GestoperacionesModel();
    }

    /**
     * Este servicio obtiene un todas las operaciones que cumplan con los parámetros entrados
     *
     * @param int $idestructura Identificador de la entidad logueada
     * @param int $idsubsistema Identificador del subsistema (Opcional)
     * @param int $iddocumento Identificador del documento primario (Opcional)
     * @param int $idoperacion Identificador de la operacion contable (Opcional)
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @author Ing. Alejandro Mengana Pérez <amengana@xetid.cu>
     * @version '1.0'
     *
     * @return array | int Relación de todas las operaciones que cumplan con los parámetros entrados, -1 si ocurrio un error
     * en la búsqueda o un array vacio si no existen operaciones con esos criterios de búsqueda.
     */
    public function obtenerOperaciones($idestructura, $idsubsistema = NULL, $iddocumento = NULL, $idoperacion = NULL,
                                       $start = NULL, $limit = NULL, $filtros = array())
    {
        if (empty($idestructura) || !$idestructura) {
            $idestructura = $this->global->Estructura->idestructura;
        }

        $result = GestoperacionesModel::GetBySqlQuery($idestructura, $idsubsistema, $iddocumento, $idoperacion, $start, $limit, $filtros);

        return $result;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_operaiones
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asExt alias de la tabla que se une con nom_operaiones
     * @param string $asLoc alias de la tabla nom_operaiones
     * @param numeric $join Si se unen las tablas con innerjoin o leftjoin
     * @return Doctrine_Query
     */
    public function addQueryJoinOperacion($dql, $asExt, $asLoc = 'no', $join = 1)
    {
        if(!empty($dql) && !empty($asExt)){
            return $this->operaciones->addQueryJoinOperacion($dql, $asExt, $asLoc, $join);
        }
        return -1;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_operaiones
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asLoc alias de la tabla nom_operaiones
     * @return Doctrine_Query
     */
    public function addQuerySelectOperacion($dql, $asLoc = 'no')
    {
        if(!empty($dql)){
            return $this->operaciones->addQuerySelectOperacion($dql,$asLoc);
        }
        return -1;
    }

}

?>
