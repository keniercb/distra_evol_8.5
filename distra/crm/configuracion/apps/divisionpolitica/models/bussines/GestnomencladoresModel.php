<?php

/**
 * Clase modelo utilizada para gestionar nomencladores
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @version    1.0
 */
class GestnomencladoresModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene los Nomencladores correspondientes a las restricciones dadas
     *
     * @param string $tabla  Nombre de la tabla
     * @param int    $start  Comienzo inferior
     * @param int    $limit  Límite superior
     * @param array  $filtro Filtro
     *
     * @return array
     */
    public function getNomenclador($tabla, $start, $limit = false, $filtro = '')
    {
        $denom = $filtro['denominacion'];
        $fechaini = $filtro['$fechaini'];
        $fechafin = $filtro['$fechafin'];

        $query = Doctrine_Query::create();

        $cant = $query->from($tabla);
        $cant = self::whereGetNomenclador($cant, $denom, $fechaini, $fechafin);
        $cantfinal = $cant->execute()->toArray();

        $result = $query->from($tabla)->offset($start);
        $result = ($limit) ? $result->limit($limit) : $result;
        $result = self::whereGetNomenclador($result, $denom, $fechaini, $fechafin);
        $final = $result->execute()->toArray();
        return array('cantidad_filas' => count($cantfinal), 'root' => $final);
    }

    /**
     * Aplica las verificaciones correspondiendes a los par\xE1metros dados
     *
     * @param object $cant     Doctrine_Query
     * @param mixed  $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return object $cant Doctrine_Query
     */
    private function whereGetNomenclador($cant, $denom, $fechaini, $fechafin)
    {
        $cant = ($denom != '') ? $cant->addWhere("lower(denominacion) LIKE lower ('%$denom%')") : $cant;
        $cant = ($fechaini != '') ? $cant->addWhere("fechaini = ('%$fechaini%')") : $cant;
        $cant = ($fechafin != '') ? $cant->addWhere("fechafin = ('%$fechafin%')") : $cant;
        return $cant;
    }

    /**
     * Obtiene los Nomencladores correspondientes a las restricciones dadas
     *
     * @param string $tabla      Nombre de la tabla
     * @param array  $fieldName  Campo nombre
     * @param array  $fieldValue Campo valor
     *
     * @return array
     */
    public function obtenerNomenclador($tabla, $fieldName, $fieldValue)
    {
        $query = Doctrine_Query::create();
        $where = '';
        if (is_array($fieldName) && is_array($fieldValue)) {
            if (count($fieldName) == count($fieldValue)) {
                $temp = $fieldName[0];
                $where .= " $temp = ? ";
                for ($i = 1; $i < count($fieldName); $i++) {
                    $where .= " and $fieldName[$i] = ? ";
                }
            } else {
                return array();
            }
        } else {
            $where .= "$fieldName = ?";
        }
        $result = $query->from($tabla)
            ->where($where, $fieldValue)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result[0] ? $result[0] : array();
    }

    /**
     * Obtiene el \xE1rbol de Nomenclador
     *
     * @param string $tabla      Nombre de la tabla
     * @param array  $fieldName  Campo nombre
     * @param array  $fieldValue Campo valor
     *
     * @return array
     */
    public function getNomencladorTree($tabla, $idnodo, $filtro)
    {
        $id = $filtro['id'];
        $idpadre = $filtro['idpadre'];

        $query = Doctrine_Query::create();

        $result = $query->from($tabla);
        if (is_numeric($idnodo)) {
            $result = $result->addWhere("$idpadre = $idnodo");
            $result = $result->addWhere("$id <> $idpadre");
        } else {
            $result = $result->addWhere("$id = $idpadre");
        }
        $array = $result->execute()->toArray();
        return $array;
    }

    /**
     * Obtiene el \xE1rbol de la División Político Administrativa
     *
     * @param int $idnodo Identificador del nodo
     * @param int $idpais Identificador de país
     *
     * @return array
     */
    public function getTreeDPA($idnodo, $idpais)
    {
        $this->model = new GestnivelestructuralModel();
        $resultado = $this->model->cargarEstruturadpa($idnodo, $idpais);
        $resutlt = array();
        if (count($resultado) > 0) {
            foreach ($resultado as $res) {
                $resutlt[] = $res;
            }
        }
        return $resutlt;
    }

    /**
     * Obtiene las comunas carrespondientes al ID de DPT
     *
     * @param int $iddpt Identificador de la División Político Territorial
     *
     * @return array
     */
    public function getComunas($iddpt)
    {
        $resultado = NomComuna::getComunasDadoDpt($iddpt);
        ;
        $resutlt = array(
            'cantidad_filas' => count($resultado),
            'root'           => $resultado);
        return $resutlt;
    }

    /**
     * Obtiene todos los países
     *
     * @return array
     */
    public function getPaises()
    {
        $this->model = new GestnivelestructuralModel();
        $resultado = $this->model->obtenerNomPaises(array());
        $resutlt = array();
        if (count($resultado) > 0) {
            foreach ($resultado as $res) {
                $res['id'] = 'pais' . $res['idpais'];
                $res['text'] = $res['nombrepais'];
                $res['denominacion'] = $res['nombrepais'];
                $res['codigo'] = $res['codigopais'];
                $res['alias'] = $res['siglas'];
                $resutlt[] = $res;
            }
        }
        return $resutlt;
    }

}
