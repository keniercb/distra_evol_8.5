<?php
/**
 * Clase para gestionar las busqueda avanzada en arboles
 * @author    Alien Fernandez Fuentes
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Común/Models/Bussines
 * @version    1.0
 */
class TreeSearch
{
    //  Varible que guarda la configuracion de la búsqueda
    private $_config;


    private $_arrConfigDefault
        = array('driver'       => FactoryDataSearch::_DEFAULT_DOCTRINE_DRIVER_,
                'idparent'     => FactoryDataSearch::_DEFAULT_IDPARENT_TREE_,
                'code'         => FactoryDataSearch::_DEFAULT_CODE_TREE_,
                'denominacion' => FactoryDataSearch::_DEFAULT_DESCRIPTION_TREE_,
                'level'        => FactoryDataSearch::_DEFAULT_LEVEL_TREE_,
                'ordenizq'     => FactoryDataSearch::_DEFAULT_LEFT_ORDER_TREE_,
                'ordender'     => FactoryDataSearch::_DEFAULT_RIGHT_ORDER_TREE_, 'highlight' => true);

    //  Varible que guarda la configuracion de la búsqueda
    private $_dataSearch;

    /**
     * Constructor de la clase, es privado para impedir que pueda ser instanciado
     * y de esta forma garantizar que la instancia sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {
        $this->_config = array();
    }

    /**
     * Obtener la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return AutoLoadPath | NULL - Instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }

        return $instance;
    }

    /**
     * @name setConfigSearch - Funcion para modificar la variable de configuracion de la búsqueda en el \xE1rbol
     *
     * @param array $arrConfig - Array de configuracion de la búsqueda en el \xE1rbol
     *                ['tree']        -> Fuente de búsqueda en el \xE1rbol [tabla]
     *                ['id']            -> Campo identificador de la tabla
     *                ['idparent']    -> Identificador del padre del nodo "default (idpadre)"
     *                ['code']        -> Codigo del nodo \xE1rbol "default (codigo)"
     *                ['denominacion'] -> Descripcion del nodo \xE1rbol "default (denominacion)"
     *                ['level']        -> Nivel al que esta el nodo "default (nivel)"
     *                ['lft']        -> Orden izquierdo del nodo en el \xE1rbol "default (lft)"
     *                ['rgt']        -> Orden derecho del nodo en el \xE1rbol "default (rgt)"
     *                ['formatLength']-> Longitud del formato del \xE1rbol
     *
     * @return void
     */
    public function setConfigSearch($arrConfig)
    {
        $this->_config = $arrConfig;

        //  Agregando valores por defecto a la configuración
        foreach ($this->_arrConfigDefault as $index => $default) {
            if (!array_key_exists($index, $this->_config)) {
                $this->_config[$index] = $default;
            }
        }
        $this->_dataSearch = FactoryDataSearch::getDriver($this->_config['driver']);
    }

    /**
     * Función para obtener la variable de configuracion
     * @return array
     */
    public function getConfigSearch()
    {
        return $this->_config;
    }

    /**
     * Función para realizar una búsqueda recursiva en una tabla con comportamiento \xE1rboleo
     *
     * @param object $objParams Objeto con los parametros de la búsqueda en el \xE1rbol
     *                  ->query    - Clave a buscar en el \xE1rbol
     *
     * @return json - JSON del \xE1rbol
     */
    public function recursiveTreeSearch($objParams)
    {
        $result = $this->_dataSearch->getNodeByParams($this->_config, $objParams);
        $jsonTreeReturn = $this->recursiveTreeSearchByResult($result, $objParams);

        return $jsonTreeReturn;
    }

    /**
     * Construye un \xE1rbol recursivamente
     *
     * @param $arrSearchTree
     * @param $objParams
     *
     * @return array
     */
    public function recursiveTreeSearchByResult($arrSearchTree, $objParams)
    {

        $arrJsonDataTree = array();
        if (!empty($this->_config['tree']) || !empty($this->_config['id'])) {
            foreach ($arrSearchTree as $result) {

                //Resaltando la búsqueda en el \xE1rbol
                $textNode = $result[$this->_config['code']] . ' ' . $result[$this->_config['denominacion']];
                $posResultQuery = strpos(strtolower($textNode), strtolower($objParams->query));
                $subStrQuery = substr($textNode, $posResultQuery, strlen($objParams->query));

                $strQuery = '';
                if ($this->_config['highlight']) {
                    $strQuery = eregi_replace(
                        $objParams->query, '<span style="background-color: yellow">' . $subStrQuery . '</span>',
                        $textNode
                    );
                } else {
                    $strQuery = eregi_replace($objParams->query, "<b>$subStrQuery</b>", $textNode);
                }
                $result['text'] = $strQuery;
                if (!$result['visited']) {
                    $result['visited'] = true;

                    $arrJsonDataTree = $this->treeBuilding($arrSearchTree, $result, $arrJsonDataTree);
                }
            }
        } else {
            return "La variable de configuración debe contener al menos la fuente de datos <br>
                    y el identificador de la misma.";
        }

        return json_encode($arrJsonDataTree);
    }

    /**
     * Función para construir el \xE1rbol de búsqueda a mostrar
     *
     * @param array $arrSearchTree   - Array con los datos resultantes de la búsqueda en el \xE1rbol
     * @param array $searchedNode    - Array con los datos del nodo que se esta procesando del \xE1rbol
     * @param array $arrJsonDataTree - Array a conformar a partir de la búsqueda resultante de $arrSearchTree
     *
     * @return array $arrJsonDataTree - Array a conformar a partir de la búsqueda resultante de $arrSearchTree
     */
    public function treeBuilding(&$arrSearchTree, $searchedNode, $arrJsonDataTree)
    {

        //  Verificar si el nodo que se analiza no es hoja y si tiene hijos asociados
        if (!$searchedNode['leaf']) {
            $childExist = $this->_dataSearch->getNodeByParent($this->_config, $searchedNode[$this->_config['id']]);
            if (count($childExist) == 0) {
                $searchedNode['leaf'] = true;
            }
        }

        //  Verificar si el nodo que se analiza tiene un padre asociados
        if (strcmp($searchedNode[$this->_config['idparent']], $searchedNode['id']) != 0) {
            $encArbol = false;
            $this->parentSearchTree($searchedNode, $arrJsonDataTree, $encArbol);

            //  Si el nodo que se analiza no esta el el json del \xE1rbol
            if (!$encArbol) {

                //Se busca en el resultado de la busqueda
                $parentNode = $this->parentSearchInResult($searchedNode, $arrSearchTree);
                if (is_null($parentNode)) {

                    //  Se obtiene el nodo padre de la db ya que no se encuentra en la busqueda
                    $getParent = $this->_dataSearch->getNodeById(
                        $this->_config, $searchedNode[$this->_config['idparent']]
                    );
                    $parentNode = $getParent[0];
                }

                $parentNode['text']
                    = $parentNode[$this->_config['code']] . " " . $parentNode[$this->_config['denominacion']];
                $parentNode['children'] = array();
                $parentNode['expanded'] = true;
                $parentNode['children'][] = $searchedNode;

                //  Llamada recursiva para analizar el siquiente nodo encontrado
                $arrJsonDataTree = $this->treeBuilding($arrSearchTree, $parentNode, $arrJsonDataTree);
            }
        } elseif (count($arrJsonDataTree) == 0) {
            $arrJsonDataTree[0] = $searchedNode;
        } else {
            $arrJsonDataTree[] = $searchedNode;
        }

        return $arrJsonDataTree;
    }

    /**
     *  Función para verificar si el padre de un nodo se encuentra en el array de búsqueda a la búsqueda
     *
     * @param array $searchedNode  - Array con los datos del nodo que se esta procesando del \xE1rbol
     * @param array $arrSearchTree - Array con los datos resultantes de la búsqueda en el \xE1rbol
     *
     * @return array $result | NULL
     */
    public function parentSearchInResult($searchedNode, &$arrSearchTree)
    {
        foreach ($arrSearchTree as $index => $result) {
            if (!$result['visited']) {
                if (strcmp($searchedNode[$this->_config['idparent']], $result['id']) == 0) {
                    $arrSearchTree[$index]['visited'] = true;

                    return $result;
                }
            }
        }

        return null;
    }

    /**
     *  Función para verificar si el padre de un nodo se encuentra en el array de búsqueda
     *
     * @param array $searchedNode  - Array con los datos del nodo que se esta procesando del \xE1rbol
     * @param array $arrJsonDataTree
     * @param       $encArbol
     *
     * @return void
     */
    public function parentSearchTree($searchedNode, &$arrJsonDataTree, &$encArbol)
    {
        foreach ($arrJsonDataTree as $index => $tree) {

            //  Verificando si el nodo que se procesa ya tiene el padre en el \xE1rbol
            if (strcmp($tree['id'], $searchedNode[$this->_config['idparent']]) == 0) {
                $arrJsonDataTree[$index]['expanded'] = true;
                $arrJsonDataTree[$index]['children'][] = $searchedNode;
                $encArbol = true;
                break;
            } elseif (count($tree['children']) > 0) {
                $this->parentSearchTree($searchedNode, $arrJsonDataTree[$index]['children'], $encArbol);
            }
        }
    }
}