<?php

/**
 * Clase encargada de implementar los servicios del componente Configuración de secodenas.
 *
 * @copyright  XETID
 * @package    Servicios
 * @subpackage Configuración/DivisiónPolítica
 * @version    1.0
 * @author     Livan A Capote Valdés
 */

class ConfigsecodenaService extends ZendExt_Model
{

    //private $model;

    function __construct()
    {
        $this->model = new GestnivelestructuralModel();
    }

    function mostrarIUBuscarDPT()
    {
        $_dpt = $this->getScriptComponente('dpt');
        return $_dpt;
    }

    function mostrarIUBuscarABRAE()
    {
        $_abrae = $this->getScriptComponente('abrae');
        return $_abrae;
    }

    public function getScriptComponente($cmp)
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        return file_get_contents(
            $dirapps . '/configuracion/divisionpolitica/views/scripts/component/' . $cmp . '.phtml'
        );
    }

    /**
     * Para cargar la estructura de la base legal, este metodo es implementado
     * como parte del servicio que brinda esta configsecodena
     *
     * @param int $node
     *
     * @return array
     */
    function cargarEstruturabaselegal($node)
    {
        $datostabla = $this->model->cargarEstruturabaselegal($node);
        return $datostabla;
    }

    /**
     * Para cargar la estructura de la base legal, este metodo es implementado
     * como parte del servicio que brinda esta configsecodena
     *
     * @param mixed $descripcion Descripción
     *
     * @return array
     */
    function cargarEstruturabaselegaldenominacion($descripcion)
    {
        $datostabla = $this->model->cargarEstruturabaselegaldenominacion($descripcion);
        return $datostabla;
    }

    /**
     * Para cargar la estructura del DPA, este metodo es implementado
     * como parte del servicio que brinda esta configsecodena
     *
     * @param int $node
     * @param int $idpais Identificador de país
     *
     * @return array
     */
    function cargarEstruturadpa($node, $idpais = null)
    {
        $datostabla = $this->model->cargarEstruturadpa($node, $idpais);
        return $datostabla;
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
        $datostabla = $this->model->damePadresiddpa($iddpa);
        return $datostabla;
    }

    /**
     * Para devolver los padres de un elemento pasado por parametro
     * como parte del servicio que brinda esta configsecodena
     *
     * @param int $idbaselegal Identificador de base legal
     *
     * @return array
     */
    function damePadresidbaselegal($idbaselegal)
    {
        $datostabla = $this->model->damePadresidbaselegal($idbaselegal);
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
        return NomDpasecodena::getElementoid($iddpa);
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
     * @param int $idpadre Identificador padre
     * @param int $idhijo  Identificador hijo
     *
     * @return boolean
     */
    function dimesieshijo($idpadre, $idhijo)
    {
        return NomDpasecodena::dimesieshijo($idpadre, $idhijo);
    }

    /**
     * Devuelve un arreglo con los datos de la tabla que se
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
        return $this->model->getiddatosTabla($campo, $tabla, $id);
    }

    /**
     * Devuelve los datos de todos los países
     *
     * @param array $arrCond arreglo de condiciones
     *
     * @return array
     */
    function obtenerPaises($arrCond)
    {
        return $this->model->obtenerPaises($arrCond);
    }

    /**
     * Devuelve un pais dado el id
     *
     * @param int $idPais Identificador de país
     *
     * @return array
     */
    function obtenerPais($idPais)
    {
        return $this->model->obtenerPais($idPais);
    }

    /**
     * Devuelve los niveles dado un pais
     *
     * @param int $idPais Identificador de país
     *
     * @return array
     */
    function obtenerNivelesDadoPais($idpais)
    {
        return $this->model->obtenerNivelesDadoPais($idpais);
    }

    /**
     * Devuelve el padre inmediato del dpa
     *
     * @param int $idpadre Identificador padre
     *
     * @return array
     */
    function obtenerPadreDpa($idpadre)
    {
        return NomDpasecodena::obtenerPadre($idpadre);
    }

    /**
     * Devuelve el padre inmediato del dpa
     *
     * @param int $iddpt Identificador de División Político Territorial
     *
     * @return array
     */
    function obtenerRutaDPT($iddpt)
    {
        return NomDpasecodena::getRutaDPT($iddpt);
    }

    /**
     * Funcion que se utiliza para devolver el espacio de trabajo
     *
     * @param int $idsubsistema Identificador de subsistema
     * @param uri $uri          Uri
     *
     * @return object
     */
    function getEspaciotrabajo($idsubsistema, $uri)
    {
        return $this->model->getEspaciotrabajo($idsubsistema, $uri);
    }

    /**
     * Funcion que se utiliza para devolver los tipo de documentos
     *
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return object
     */
    function getTiposDocumento($idsubsistema)
    {
        return $this->model->getTiposDocumento($idsubsistema);
    }

    /**
     * Obtiene un nomenclador dado la tabla el valor y el nombre
     *
     * @param string $tabla      Tabla
     * @param mixed  $fieldName  Nombre del campo
     * @param mixed  $fieldValue Valor del campo
     *
     * @return array
     */
    function obtenerNomenclador($tabla, $fieldName, $fieldValue)
    {
        return GestnomencladoresModel::obtenerNomenclador($tabla, $fieldName, $fieldValue);
    }

    /**
     * Devuelve los datos de un nomenclador pasando el nomenclador y el filtro de busqueda
     *
     * @param string $tabla  Tabla
     * @param int    $start  Comienzo inferior
     * @param int    $limit  Límite superior
     * @param mixed  $filtro Filtro
     *
     * @return array
     */
    function getNomencladorLineal($tabla, $start, $limit = false, $filtro = '')
    {
        return GestnomencladoresModel::getNomenclador($tabla, $start, $limit, $filtro);
    }

    /**
     * Brinda todos los datos de un nomenclador tree
     *
     * @param string $tabla  Tabla
     * @param int    $idnodo Identificador de nodo
     * @param mixed  $filtro Filtro
     *
     * @return array
     */
    function getNomencladorTree($tabla, $idnodo, $filtro)
    {
        return GestnomencladoresModel::getNomencladorTree($tabla, $idnodo, $filtro);
    }

    /**
     * Devuelve los datos del grado de reserva
     *
     * @return array
     */
    public function getClasificacionInfo()
    {
        return NomClasificacioninformacion::GetTodos();
    }

    /**
     * Devuelve los datos del grado de reserva
     *
     * @return array
     */
    public function getGradoReserva()
    {
        return NomClasificacioninformacion::GetTodos();
    }

    /**
     * Obtiene un un ambito como objeto
     *
     * @param int $idabrae
     *
     * @return array
     */
    public function getABRAEObject($idabrae)
    {
        $modelAbrae = new NomZonaespecialModel();
        return $modelAbrae->getNomZonaespecial($idabrae);
    }

    /**
     * Obtiene un un ambito como objeto
     *
     * @param int $idabrae
     *
     * @return array
     */
    public function obtenerHijosAbraes($idabrae)
    {
        $modelAbrae = new NomZonaespecialModel();
        return $modelAbrae->getHijos($idabrae);
    }

    /**
     * Obtiene un un ambito como objeto
     *
     * @param int $idabrae
     *
     * @return array
     */
    public function obtenerAbraesDesdeArreglo($idabrae)
    {
        $modelAbrae = new NomZonaespecialModel();
        return $modelAbrae->obtenerAbraesDesdeArreglo($idabrae);
    }

    /**
     * Obtiene un un ambito como objeto
     *
     * @param int $idambito
     *
     * @return array
     */
    public function getAmbitoObject($idambito)
    {
        $modelAmbito = new NomAmbitosModel();
        $params->idambito = $idambito;
        return $modelAmbito->getAmbitoObject($params);
    }

    /**
     * Obtiene la ruta de un ambito
     *
     * @param int $idambito ID ambito
     *
     * @return string
     */
    public function getRutaAmbito($idambito)
    {
        $model = new NomAmbitosModel();
        return $model->getRuta($idambito);
    }

    /**
     * Devuelve los datos de la confiabilidad
     *
     * @return array
     */
    public function getConfiabilidad()
    {
        return NomConfiabilidad::getConfiabilidad();
    }

    /**
     * Devuelve los datos del tipo de medio de informacion
     *
     * @return array
     */
    public function getTiposMedios()
    {
        return NomMedioinformacion::getTiposMedios();
    }

    /**
     * Devuelve los datos del tipo de medio de informacion
     *
     * @param int $iddpt Identificador de División Político Territorial
     *
     * @return array
     */
    public function getComunasDadoDpt($iddpt)
    {
        return NomComuna::getComunasDadoDpt($iddpt);
    }

    /**
     * Devuelve los niveles estructurales dado una uri
     *
     * @param uri $uri Uri
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
     * @param array $ids
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
     * @param array $arrayids Arreglo de IDs
     * @param bool  $checked
     *
     * @return array
     * @author Dionisdel Ponce Santana.
     */
    public function getPaisesDadoArrayIds($arrayids, $checked = false)
    {
        return NomPaissecodena::getPaisesDadoArrayIds($arrayids, $checked);
    }

    /**
     * Devuelve en un arreglo los paises dado un arreglo de valores con id paises
     *
     * @param array $arrayids Arreglo de IDs
     * @param mixed $node
     * @param bool  $checked
     *
     * @return array
     * @author Dionisdel Ponce Santana.
     */
    public function getDpaParaRegistroInfEst($arrayids, $node, $checked = false)
    {

        $objsdpa = NomDpasecodena::getDpaDadoArrayIds($arrayids, $checked);

        $strpadres = '';
        foreach ($objsdpa as $k => $dpa) {
            if ($k) {
                $strpadres .= ' OR ';
            }
            $strpadres .= ' (n.ordender >= ' . $dpa ['ordender'] . ' AND  n.ordenizq <= ' . $dpa ['ordenizq'] . ') ';
        }

        $dpapararegistro = NomDpasecodena::getDpaDadoArrayIdsHijos($strpadres, $node, $checked);

        return $dpapararegistro;
    }

    /**
     * Devuelve en un arreglo de nodos de DPT dado un arreglo de valores con ids
     *
     * @param array $arrayids Arreglo de IDs
     *
     * @return array
     * @author Dionisdel Ponce Santana.
     */
    public function getDptDadoArrayIds($arrayids)
    {
        return NomDpasecodena::getDpaDadoArrayIds($arrayids);
    }

    /**
     * Devuelve el objeto medio de informacion dado un id
     *
     * @param int $idmedio Identificador de medio
     *
     * @return array
     * @author Dionisdel Ponce Santana.
     */
    public function obtenerMedioInfDadoId($idmedio)
    {
        $medio = Doctrine::getTable('NomMedioinformacion')->find($idmedio);
        if ($medio) {
            return $medio->toArray();
        }
        return array();
    }

    /**
     * Devuelve en un arreglo con los tipos de medios de contactos con sus formatos
     *
     * @return array
     * @author Ing. Yadir Martinez Vergara
     */
    public function getTipoMediosdeContactos()
    {
        $objTipoMedioCont = new NomTipomediocontactoModel();
        return $objTipoMedioCont->obtenerTodosActivos();
    }

    /**
     * Devuelve en un arreglo con los tipos de medios de contactos con sus formatos dado
     * un arreglo de idtipomediocontacto
     *
     * @param array $arr
     *
     * @return array
     * @author Ing. Yadir Martinez Vergara
     */
    public function getTipoMediosdeContactosporArrIds($arr)
    {
        $objTipoMedioCont = new NomTipomediocontactoModel();
        return $objTipoMedioCont->obtenerTodosporArrIds($arr);
    }

    /**
     * Funcion que se utiliza para devolver el espacio de trabajo dado un subsistema
     *
     * @param int $idsubsistema
     *
     * @autor Ing. Yadir Matinez Vergara
     * @return string
     */
    function getEspaciotrabajoporsubsistema($idsubsistema)
    {
        return $this->model->getEspaciotrabajoporsubsistema($idsubsistema);
    }

}
