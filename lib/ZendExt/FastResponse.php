<?php
/**
 * ZendExt_FastResponse
 *
 * Cargador de respuesta rapida para nomencadores
 *
 * @author    : Omar Antonio Diaz Peña
 * @package   : ZendExt
 * @copyright UCID-ERP Cuba
 * @version   1.0-0
 */
class ZendExt_FastResponse
{
    /**
     * Objeto de tipo SimpleXMLElement, creado a partir del mapeo del
     * xml de nomencladores
     *
     * @var SimpleXMLElement
     */
    static private $xml_object;

    /**
     * Nomencladores cargados
     *
     * @var array of ZendExt_FastResponse_NomLoader
     */
    static private $noms;

    /**
     * Gestor de XML del cargador
     *
     * @var ZendExt_FastResponse_XMLHandler
     */
    static private $xml_loader;

    static private $arrayIdXml = array();

    /**
     * getNomInstance
     *
     * Busca un elemento dentro del arreglo estático de nomencladores
     * si el que buscamos no está ahi se manda a cargar y luego se pone
     * dentro del arreglo de nomencladores.
     *
     * @param string $pNomId - Identificador del nomenclador.
     *
     * @return ZendExt_FastResponse_NomLoader - cargador de nomencladores
     **/
    private function getNomInstance($pNomId)
    {
        if (isset (self::$noms [$pNomId])) {
            $nom = self::$noms [$pNomId];
        } else {
            $nom = $this->loadNom($pNomId);
            self::$noms [$pNomId] = $nom;
        }

        return $nom;
    }

    /**
     * init
     *
     * Inicializa el cargador de nomencladores.
     *
     * @return SimpleXMLElement - xml de nomencladores mapeado en un objeto
     */
    private static function init()
    {
        $registro = Zend_Registry::getInstance();

        if (!isset (self::$xml_loader)) {
            self::$xml_loader = new ZendExt_FastResponse_XMLHandler();
        }

        $xml = self :: getXML('cargador');
        self::$xml_object = $xml;
        return $xml;
    }

    /**
     * reloadNom
     *
     * Devuelve un nomenclador a partir de un identificador
     *
     * @param string $pNomId - identificador del nomenclador
     */
    public function reloadNom($pNomId)
    {
        $nom = $this->getNomInstance($pNomId);
        $nom->Load();
    }

    /**
     * getNomsByAction
     *
     * Devuelve un arreglo con los nomencladores que necesita
     * una acción dentro del controlador.
     *
     * @param string $pController - Controlador.
     * @param string $pAction     - Accion.
     * @param array  $pParameterq - valores para formar el where de las consultas asociadas
     *
     * @return array - arreglo de nomencladores.
     */
    public static function getNomsByAction($pController, $pAction, $pParameterq = array())
    {
        if (self::$xml_object == null) {
            self::init();
        }
        $resp = array();
        try {

            if (isset (self::$xml_object->$pController->$pAction)) {
                foreach (self::$xml_object->$pController->$pAction->children() as $nom) {
                    $name = (string)$nom;
                    $query = (string)$nom ['consulta'];
                    $param = array();
                    //indice de las condiciones para formar el where de las consultas
                    if ($nom ['cond']) {
                        $filtro = split('\|', $nom['cond']);
                        $param = self::VerifyCond($filtro, $pParameterq);
                        $filtro = $param[0];
                        if ($param) {
                            $query .= " WHERE " . implode(' = ? AND ', $filtro) . ' = ?' . (($nom ['order']) ?
                                    " order by " . $nom ['order'] : '') . (($pParameterq['limit']
                                    && $pParameterq['start']) ?
                                    " LIMIT " . $pParameterq['limit'] . " OFFSET " . $pParameterq['start'] : '');
                        }
                    }
                    if (self::$noms [$name] != null) {
                        return self::$noms [$nom];
                    } else {
                        $new = self::loadNom($nom, $query, $param[1]);
                        self::$noms [$name] = $new;
                        $resp[$name] = $new;
                    }
                }
            }
        } catch (Exception $pE) {
            echo $pE;
        }
        return $resp;
    }

    /**
     * getXML
     *
     * Devuelve un XML a partir de un identificador
     *
     * @param string $pIdXML - identificador del xml
     *
     * @throws ZendExt_Exception - Excepcion declarada
     * @return SimpleXMLElement - objeto mapeado a partir del xml cargado
     */
    public static function  getXML($pIdXML)
    {
        if (!isset (self::$xml_loader)) {
            self::$xml_loader = new ZendExt_FastResponse_XMLHandler();
        }
        if (!isset (self::$arrayIdXml[$pIdXML])) {
            self::$arrayIdXml[$pIdXML] = self::$xml_loader->getXML($pIdXML);
        }
        return self::$arrayIdXml[$pIdXML];
    }

    /**
     * loadNom
     *
     * Devuelve un nomenclador.
     *
     * @param string $pId - identificador del nomenclador.
     *
     * @return ZendExt_FastResponse_NomLoader - nomenclador.
     * */
    private static function loadNom($pId, $pQuery, $pParameterq)
    {
        $nom = new ZendExt_FastResponse_NomLoader($pQuery, $pParameterq);
        return $nom;
    }

    /**
     * VerifyCond
     *
     * verifica los elementos para poner las condiciones en las consulas.
     *
     * @param array pCond arreglo con los campos de las condiciones de las consultas
     * @param array pParameterq arreglo con: campos y valores de las condiciones de la consulta
     *
     * @return array.
     */
    private static function VerifyCond($pCond, $pParameterq)
    {
        $enc = array();
        $field = array();
        foreach ($pCond as $c) {
            $cp = (!strpos($c, '.')) ? $c : substr($c, strpos($c, '.') + 1);
            if ($pParameterq[$cp] && $cp != 'limit' && $cp != 'offset') {
                $field[] = $c;
                $enc[] = $pParameterq[$cp];
            }

        }
        return (count($enc) > 0) ? array($field, $enc) : null;
    }
}
