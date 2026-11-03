<?php

/**
 * Clase encargada de implementar los servicios del componente Configuración.
 *
 * @copyright  XETID
 * @package    Servicios
 * @subpackage Configuración/DivisiónPolítica
 * @version    1.0
 * @author     Angel R. Sanchez
 */

class GestdpaService extends ZendExt_Model
{

    /*private $dpaModel;
    private $paisModel;*/

    function __construct()
    {
        $this->dpaModel = new GestdpaModel();
        $this->paisModel = new NomPaisModel();
    }

    function mostrarIUBuscarDPT()
    {
        $_dpt = $this->getScriptComponente('componentes/buscarDpa');
        return $_dpt;
    }

    public function getScriptComponente($cmp)
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        return file_get_contents($dirapps . '/configuracion/gestdpa/views/scripts/' . $cmp . '.phtml');
    }

    /**
     * Para cargar la estructura del DPA, este metodo es implementado
     * como parte del servicio que brinda esta gestdpa
     *
     * @param int $node
     * @param int $idpais Identificador de país
     *
     * @return array
     */
    function cargarEstruturadpa($node, $idpais = null)
    {
        $datostabla = $this->dpaModel->cargarEstruturadpa($node, $idpais);
        return $datostabla;
    }

    /**
     * Para devolver los datos de un elemento determinado
     *
     * @param int $iddpa Identificador de División Político Administrativa
     *
     * @return array
     */
    function getElementoid($iddpa)
    {
        return NomDpa::getElementoid($iddpa);
    }

    /**
     * Para devolver los hijos dado el padre
     *
     * @param int $id
     *
     * @return array
     */
    function getHijos($id)
    {
        return NomDpa::getHijos($id);
    }

    /**
     * Para devolver los datos de un determinado nivel estructural haciendo union con conceptosnivel
     *
     * @param int $idnivelestructural Identificador de nivel estructural
     *
     * @return array
     */
    function getNivelestructuralid($idnivelestructural)
    {
        return NomNivelestructural::getNivelestructuralid($idnivelestructural);
    }

    /**
     * Para devolver si el nodo2 es hijo del nodo1
     *
     * @param int $idpadre
     * @param int $idhijo
     *
     * @return bool
     */
    function dimesieshijo($idpadre, $idhijo)
    {
        return NomDpa::dimesieshijo($idpadre, $idhijo);
    }

    /**
     * Devuelve los niveles dado un pais
     *
     * @param int $idpais
     *
     * @return array
     */
    function obtenerNivelesDadoPais($idpais)
    {
        return $this->dpaModel->obtenerNivelesDadoPais($idpais);
    }

    /**
     * Devuelve el padre inmediato del dpa
     * @method obtenerPadreDpa
     *
     * @param int $idpadre
     *
     * @return array
     */
    function obtenerPadreDpa($idpadre)
    {
        return NomDpa::obtenerPadre($idpadre);
    }

    /**
     * Obtiene una ruta DPT
     *
     * @param int $iddpt Identificador de División Político Territorial
     *
     * @return array
     */
    
    function obtenerRutaDPT($iddpt, $completo = false) {
        return NomDpa::getRutaDPT($iddpt, $completo);
    }

    /**
     * Obtiene un nomenclador dado la tabla el valor y el nombre
     *
     * @params string $tabla
     * @params mixed $fieldName nombre del campo
     * @params mixed $fieldValue valor del campo
     *
     * @return array
     */
    function obtenerNomenclador($tabla, $fieldName, $fieldValue)
    {
        return GestdpaModel::obtenerNomenclador($tabla, $fieldName, $fieldValue);
    }

    /**
     * Devuelve los datos de un nomenclador pasando el nomenclador y el filtro de busqueda
     *
     * @params string $tabla
     * @params int $start Comienzo inferior
     * @params int $limit Límite superior
     * @params mixed $filtro
     *
     * @return array
     */
    function getNomencladorLineal($tabla, $start, $limit = false, $filtro = null)
    {
        return GestdpaModel::getNomenclador($tabla, $start, $limit, $filtro);
    }

    /**
     * Devuelve los niveles estructurales dado una uri
     *
     * @params uri $uri Uri
     *
     * @return array
     * @author Victor L. Borroto A.
     */
    public function obtenerNivelesEstructuralesDadoUri($uri)
    {
        return NomNivelestructural::obtenerNivelesEstructuralesDadoUri($uri);
    }

    /**
     * Devuelve los niveles estructurales dado un grupo de identificadores de niveles
     *
     * @params array $ids
     *
     * @return array
     * @author Dionisdel Ponce Santana.
     */
    public function obtenerNivelesEstructuralesDadoIds($ids)
    {
        return NomNivelestructural::obtenerNivelesEstructuralesDadoIds($ids);
    }

    /**
     * Devuelve en un arreglo los paises dado un arreglo de valores con id paises
     *
     * @params array $arrayids
     * @params bool $checked
     *
     * @return array
     * @author Dionisdel Ponce Santana.
     */
    public function getPaisesDadoArrayIds($arrayids, $checked = false)
    {
        return NomPais::getPaisesDadoArrayIds($arrayids, $checked);
    }

    /**
     * Obtiene los IDs datos
     *
     * @params mixed $campo
     * @params string $tabla
     * @params int $id
     *
     * @return array
     */
    function getiddatosTabla($campo, $tabla, $id)
    {
        $_model = new GestdpaModel();
        return $_model->getiddatosTabla($campo, $tabla, $id);
    }

    /**
     * Para devolver los padres de un elemento pasado por parametro
     *
     * @param int $iddpa Identificador de División Político Administrativa
     *
     * @return array
     */
    function damePadresiddpa($iddpa)
    {
        $datostabla = $this->dpaModel->damePadresiddpa($iddpa);
        return $datostabla;
    }

    /**
     * Obtiene el primer nivel DPA
     *
     * @return array
     */
    public function obtenerPrimerNivleDPA()
    {
        $_result = NomPais::obtenerListadoEstados();
        return $_result;
    }

    /**
     * Obtiene los primeros niveles de DPA dado el país
     *
     * @param array $argIdPais Arreglo de Ids de país
     *
     * @return array
     */
    public function getPrimerNivelDPA($argIdPais)
    {
        $result = NomDpasecodena::obtenerListadoPrimerNivel($argIdPais);
        return $result;
    }

    /**
     * Servicio que dado el concepto de nivel brinda los niveles estructurales definidos para ese pais.
     *
     * @param int $idpais          Identificador de país
     * @param int $idconceptoNivel Identificador de concepto nivel
     *
     * @return array
     */
    public function getNivelEstructuralPorPais($idpais, $idconceptoNivel)
    {
        $_result = GestdpaModel::getNivelEstructuralPorPais($idpais, $idconceptoNivel);
        return $_result;
    }

}
