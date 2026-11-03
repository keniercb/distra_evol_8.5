<?php

/**
 * Clase para gestionar las búsqueda avanzada en \xE1rboles
 *
 * @author     Alien Fernandez Fuentes
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Común/Models/Bussines
 * @version    1.0
 */
class DoctrineDataSearch
{
    //  Varible que contiene una instancia de la clase Doctrine_Query
    //private $doctrineQuery;

    /**
     * Función para obtener un nodo del \xE1rbol dado su identificador
     *
     * @param $config
     * @param integer $value -  identificador del nodo
     *
     * @return array
     */
    public function getNodeById($config, $value)
    {
        $filter = "{$config['id']} = ?";
        $filterConfig = FactoryDataSearch::getFilterByConfig($config);
        $filter = (!$filterConfig) ? $filter : $filter . " AND $filterConfig";

        $_doctrineQuery = Doctrine_Query::create();
        $_doctrineQuery->addWhere($filter, $value);

        return $_doctrineQuery->select(
            "ts.*, ts.{$config['id']} as id, ts.{$config['code']},
							   ts.{$config['denominacion']},ts.{$config['idparent']},
							   ({$config['ordender']}-{$config['ordenizq']}=1) as leaf,
							   false as visited, true as expanded"
        )->from("{$config['tree']} ts")->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    /**
     * Función para obtener un nodo del \xE1rbol dado el identificador de su padre
     *
     * @param $config
     * @param integer $value -  identificador del nodo padre
     *
     * @return array
     */
    public function getNodeByParent($config, $value)
    {
        $filter = "{$config['idparent']} = ? ";
        $filterConfig = FactoryDataSearch::getFilterByConfig($config);
        $filter = (!$filterConfig) ? $filter : $filter . " AND $filterConfig";
        $_doctrineQuery = Doctrine_Query::create();
        $_doctrineQuery->addWhere($filter, $value);

        return $_doctrineQuery->select(
            "ts.*, ts.{$config['id']} as id, ts.{$config['code']},
							   ts.{$config['denominacion']},ts.{$config['idparent']},
							   ({$config['ordender']}-{$config['ordenizq']}=1) as leaf,
							   false as visited, true as expanded"
        )->from("{$config['tree']} ts")->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    /**
     * Función para obtener los datos relacionados con  búsqueda en el \xE1rbol
     *
     * @param $config
     * @param $objParams
     *
     * @return array
     */
    public function getNodeByParams($config, $objParams)
    {
        $filterQuery = "(ts.{$config['denominacion']} iLike '%{$objParams->query}%'
                       OR ts.{$config['code']} iLike '%{$objParams->query}%')";

        $filter = FactoryDataSearch::getFilterByConfig($config);
        $filter = (!$filter) ? $filterQuery : $filterQuery . " AND $filter";

        /* 
         * Si la configuracion tiene la longitud del formato el la hoja del arbol es 'Longitud del formato - 1'
         * el ultimo formato sera visualizado en un grid por lo que no entraria en la busqueda del arbol
         **/
        $level = ($config['formatLength']) ? "OR ({$config['formatLength']}-{$config['level']}=1)" : "";
        $_doctrineQuery = Doctrine_Query::create();
        $_doctrineQuery->addWhere($filter);

        return $_doctrineQuery->select(
            "ts.*, ts.{$config['id']} as id, ts.{$config['code']},
							   ts.{$config['denominacion']},ts.{$config['idparent']},
							   (({$config['ordender']}-{$config['ordenizq']}=1) $level) as leaf,
							   false as visited"
        )->from("{$config['tree']} ts")->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->orderBy("{$config['id']} ASC")
            ->execute();
    }

}
