<?php

/**
 * Clase dominio <b>Nomenclador de Desgloses</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class NomDezglozemonedas extends BaseNomDezglozemonedas
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasMany(
            'DatDezglozemoneda', array('local' => 'iddezglozemonedas',
                                       'foreign' => 'iddezglozemonedas')
        );
        parent::setUp();
    }

    /**
     * Obtiene todos los desgloses.
     *
     * @return mixed Monedas
     * @throws Doctrine_Exception
     */
    static public function GetNomDesglosesMonedas()
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->from('NomDezglozemonedas')
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
            $query->free();
            return $result;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene desgloses por rango.
     *
     * @param array $params Par\xE1metros del rango
     *
     * @return array Desgloses
     * @throws Doctrine_Exception
     */
    static public function GetNomDesglosesMonedasByRange($params = array())
    {
        try {
            $offset = isset($params['start']) ? $params['start'] : 0;
            $limit = isset($params['limit']) ? $params['limit'] : 20;
            $where = " 0=0 ";
            if ($params['sfFiltro'] != "") {
                $where
                    = " nd.denominacion ILIKE '%" . $params['sfFiltro'] . "%'";
            }
            $query = Doctrine_Query::create();
            $query->from('NomDezglozemonedas nd')
                ->orderBy("nd.categoria, nd.valor");
            $query->addWhere($where);
            $cant = $query->select("nd.iddezglozemonedas")
                ->count();
            $resultado['cant'] = $cant;
            return self::auxGetNomDesglosesMonedasByRange($resultado, $offset, $limit, $query, $params);
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }
    private function auxGetNomDesglosesMonedasByRange($resultado,$offset,$limit,$query, $params)
    {
        if ($resultado['cant']) {
            $resultado['datos'] = (isset($offset) && isset($limit))
                ? $query->select("nd.*")
                    ->offset($offset)
                    ->limit($limit)
                    ->fetchArray()
                :
                $query->select("nd.*")
                    ->fetchArray();
            if ($params['sfFiltro'] != "") {
                include_once Zend_Registry::get('config')->dir_aplication .
                    'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
                $resultado = UtilesDatosMaestros::colorSearch($resultado, 'denominacion', $params['sfFiltro'], true);
            }
        } else {
            $resultado['datos'] = array();
        }
        return $resultado;
    }

    /**
     * Obtiene desgloses  sin asociar.
     *
     * @param array $arrayIdNomDesgloses Identificadores de desgloses
     *
     * @return mixed Desgloses
     * @throws Doctrine_Exception
     */
    static public function getNomDesglosesSinAsociarAun($arrayIdNomDesgloses)
    {
        try {
            $query = Doctrine_Query::create();
            return $query
                ->from("NomDezglozemonedas nd")
                ->whereNotIn("nd.iddezglozemonedas", $arrayIdNomDesgloses)
                ->orderBy("nd.denominacion, nd.valor")
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Verifica si existe un desglose.
     *
     * @param mixed $objDesglose Desglose a verificar
     *
     * @return int -2 el valor ya existe,-3 la denominación ya existe,-1 no existe el desglose
     * @throws Doctrine_Exception
     */
    static public function verificar($objDesglose)
    {
        try {
            $objArray = $objDesglose->toArray();
            $query = Doctrine_Query::create();
            $where = ($objArray['iddezglozemonedas'])
                ? "nd.categoria = '$objDesglose->categoria' AND nd.valor = '$objDesglose->valor'
                AND nd.iddezglozemonedas <> '$objDesglose->iddezglozemonedas'"
                : "nd.categoria = '$objDesglose->categoria' AND nd.valor = '$objDesglose->valor'";
            $valorDesglose = $query->select('nd.iddezglozemonedas')
                ->from('NomDezglozemonedas nd')
                ->where($where)
                ->execute();
            $whereOne = ($objArray['iddezglozemonedas'])
                ? "nd.categoria = '$objDesglose->categoria' AND nd.denominacion = '$objDesglose->denominacion'
                AND nd.iddezglozemonedas <> '$objDesglose->iddezglozemonedas'"
                : "nd.categoria = '$objDesglose->categoria' AND nd.denominacion = '$objDesglose->denominacion'";
            $denominacionDesglose = $query->select('nd.iddezglozemonedas')
                ->from('NomDezglozemonedas nd')
                ->where($whereOne)
                ->execute();
            if ($valorDesglose->count() > 0) {
                return -2;
            } elseif ($denominacionDesglose->count() > 0) {
                return -3;
            }
            return -1;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

}