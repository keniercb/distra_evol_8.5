<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @version    1.0
 */
class GestdpaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function GestnomencladoresModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene los datos de Nomenclador de acuerdo con el filtro definido
     *
     * @param string $tabla  Nombre de la tabla
     * @param int    $start  Comienzo inferior
     * @param int    $limit  Límite superior
     * @param array  $filtro Filtro
     *
     * @return array
     */
    public function getNomenclador($tabla, $start = 0, $limit = false, $filtro = '')
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
     * Obtiene los datos de Nomenclador de acuerdo con el filtro definido
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
     * Obtiene los datos de Nomenclador de acuerdo con las condiciones definidas
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
            $con = count($fieldName);
            if ($con == count($fieldValue)) {
                $temp = $fieldName[0];
                $where .= " $temp = ? ";
                for ($i = 1; $i < $con; $i++) {
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
     * Obtiene el \xE1rbol de la División Político Administrativa
     *
     * @param int $idnodo Identificador de nodo
     * @param int $idpais Identificador de país
     *
     * @return array
     */
    public function getTreeDPA($idnodo, $idpais)
    {
        $resultado = $this->cargarEstruturadpa($idnodo, $idpais);
        $resutlt = array();
        if (count($resultado) > 0) {
            foreach ($resultado as $res) {
                $resutlt[] = $res;
            }
        }
        return $resutlt;
    }

    /**
     * Para cargar la estructura del DPA, este metodo es implementado
     * como parte del servicio que brinda esta gestdpa
     *
     * @param int $node
     *
     * @return array
     */
    function cargarEstruturadpa($node, $idpais)
    {
        $idpais = ($idpais) ? $idpais : Zend_Registry::getInstance()->config->idpais;
        $sistemas = NomDpa::cargarEstructura($node, $idpais);
        return $sistemas;
    }

    /**
     * Obtiene todos los países
     *
     * @return array
     */
    public function getPaises()
    {
        $resultado = NomPais::gettodos(array());
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

    /**
     * Obtiene un arreglo con los datos del nomenclador que se
     * encontro dado el id del mismo
     *
     * @author     Livan A Capote Valdés
     *
     * @param int $id    -El valor que se va a buscar
     * @param int $campo -Campo por el que se va a realizar la consulta casi siempre es el id de la Tabla
     * @param int $tabla -Nombre de la Tabla
     *
     * @return array
     */
    function getiddatosTabla($campo, $tabla, $id)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('*')
            ->from($tabla)
            ->where("$campo = $id")
            ->execute()->toArray();
        return array('cantidad_filas' => count($result), 'root' => $result);
    }

    /**
     * Obtiene los países dependiendo de las condiciones dadas
     *
     * @param array $arrCond Arreglo de condiciones
     *
     * @return array
     */
    function obtenerPaises($arrCond)
    {
        return NomPais::gettodos($arrCond);
    }

    /**
     * Obtiene los niveles dada el ID del país
     *
     * @param int $idpais Identificador de país
     *
     * @return array
     */
    function obtenerNivelesDadoPais($idpais)
    {
        return NomDpa::obtenerNivelesDadoPais($idpais);
    }

    /**
     * Obtiene el padre inmediato del dpa
     *
     * @param int $idpadre Identificador padre
     *
     * @return array
     */
    function obtenerPadreDpa($idpadre)
    {
        return NomDpa::obtenerPadre($idpadre);
    }

    /**
     * Obtiene la ruta inmediato del DPA
     *
     * @param int $iddpt Identificador DPT
     *
     * @return array
     */
    function obtenerRutaDPT($iddpt)
    {
        return NomDpa::getRutaDPT($iddpt);
    }

    /**
     * Para devolver los padres de un elemento determinado
     *
     * @param int $iddpa Identificador DPA
     *
     * @return array
     */
    function damePadresiddpa($iddpa)
    {
        return NomDpa::buscarPadres($iddpa);
    }

    /**
     * Servicio que dado el concepto de nivel brinda los niveles estructurales definidos para ese pais.
     *
     * @param int $idpais          Indentificador de país
     * @param int $idconceptoNivel Identificador de concepto nivel
     *
     * @return array
     */
    function getNivelEstructuralPorPais($idpais, $idconceptoNivel)
    {
        return NomDpasecodena::getNivelEstructuralPorPais($idpais, $idconceptoNivel);
    }

}
