<?php


/**
 * Componente que gestiona las especialidades por subsistemas
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Especialidad/Models/Bussines
 * @version    1.0
 */
class EspecialidadModel extends ZendExt_Model
{

    public $nomenclador;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
    }


    /**
     * Adicionar Especialidad
     *
     * @param object $datos Objeto de tipo especialidad
     *
     * @return int Retorna un entero indicando si la especialidad esta o no
     * @throws Exception $ee
     */
    public function adicionarNomEspecialidad($datos)
    {
        $instance = new NomEspecialidad();
        $instance->codespecialidad = $datos['codespecialidad'];
        $instance->abrevespecialidad = $datos['abrevespecialidad'];
        $instance->denespecialidad = $datos['denespecialidad'];
        $instance->nivel = $datos['nivel'];
        $instance->idpadre = $datos['idpadre'];
        $instance->fechaini = $datos['fechaini'];
        $instance->fechafin = $datos['fechafin'];
        $instance->controlmaterial = json_decode($datos['controlmaterial']) ? 1 : 0;
        $esta = NomEspecialidad::verificar($instance);
        if ($esta == -1) {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            try {

                $cc->beginTransaction();
                $instance->save();
                $cc->commit();
                return $esta;
            } catch (Exception $ee) {
                $cc->rollback();
                throw $ee;
            }
        } else {
            return $esta;
        }
    }

    /**
     * Eliminar Especialidad
     *
     * @param int $id Identificador de especialidad
     *
     * @return boolean Retorna verdadero en caso de eliminar la especialidad
     */
    public function eliminarNomEspecialidad($id)
    {

        $idsToFind = array();
        //array de la forma idEspecialidad => nivel
        $idsNivel = array();
        //array de la forma idHijo => idPadre
        $hijoPadre = array();
        $idsToFind[] = $id;
        $idsNivel[] = $id;
        // Buscando hijos de $id
        while ($idsToFind) {
            $aux = array();
            foreach ($idsToFind as $idPadre) {
                $obt = Doctrine::getTable('NomEspecialidad')->findByDql("idpadre = $idPadre");
                if ($obt) {
                    foreach ($obt as $oneEl) {
                        if ($oneEl->idespecialidad !== $idPadre) {
                            $ident = $oneEl->idespecialidad;
                            $hijoPadre[$ident] = $idPadre;
                            $aux[] = $ident;
                            $idsNivel[] = $ident;
                        }
                    }
                }
            }
            $idsToFind = $aux;
        }
        $devolver = ' ';
        while ($idsNivel) {
            $llaveElem = array_pop($idsNivel);

            $elim = $this->eliminarEsp($llaveElem);
            if ($elim === '-4') {
                $devolver = '-4';
                $hijoPadre[$llaveElem] = $value;
                $eliminarEl = $this->eliminarElemArray($value, $idsNivel);
                $idsNivel = $eliminarEl;
            }
        }
        if ($devolver === '-4') {
            return '-4';
        } else {
            return true;
        }
    }

    /**
     * Eliminar elemento de un arreglo
     *
     * @param object $elem      Objeto a eliminar
     * @param array  $arrayElem Arreglos de elemetos
     *
     * @return array Retorna el arreglo sin en elemento
     */
    private function eliminarElemArray($elem, $arrayElem)
    {
        $aux = array();
        for ($i = 0; $i < count($arrayElem); $i++) {
            if ($arrayElem[i] !== $elem) {
                $aux[] = $arrayElem[i];
            }
        }
        return $aux;
    }

    /**
     * Eliminar Especialidad
     *
     * @param int $id Identificador de especialidad
     *
     * @return boolean Retorna verdadero en caso de eliminar la especialidad falso en otro caso
     * @throws Doctrine_Exception $ee Excepción de doctrine ocurrida durante la transacción
     */
    private function eliminarEsp($id)
    {
        try {
            $objNomEspecialidad = Doctrine::getTable('NomEspecialidad')->find($id);
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objNomEspecialidad->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503) {
                return '-4';
            }
        }
    }

    /**
     * Modificar Especialidad
     *
     * @param object $datos Objeto de tipo especialidad
     *
     * @return int Retorna un entero indicando si la especialidad esta o no
     * @throws Exception $ee
     */
    public function modificarNomEspecialidad($datos)
    {
        $objNomEspecialidad = Doctrine::getTable('NomEspecialidad')->find($datos['idespecialidad']);
        $objNomEspecialidad->codespecialidad = $datos['codespecialidad'];
        $objNomEspecialidad->abrevespecialidad = $datos['abrevespecialidad'];
        $objNomEspecialidad->denespecialidad = $datos['denespecialidad'];
        $objNomEspecialidad->fechaini = $datos['fechaini'];
        $objNomEspecialidad->fechafin = $datos['fechafin'];
        $objNomEspecialidad->nivel = $datos['nivel'];
        $objNomEspecialidad->idpadre = $datos['idpadre'] != 0 ? $datos['idpadre'] : $datos['idespecialidad'];
        $objNomEspecialidad->idespecialidad = $datos['idespecialidad'];
        $objNomEspecialidad->controlmaterial = json_decode($datos['controlmaterial']) ? 1 : 0;
        $esta = NomEspecialidad::verificarMod($objNomEspecialidad, $datos['idespecialidad']);
        if ($esta == -1) {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            try {
                $cc->beginTransaction();
                $objNomEspecialidad->save();
                $cc->commit();
                return $esta;
            } catch (Exception $ee) {
                $cc->rollback();
                throw $ee;
            }
        } else {
            return $esta;
        }
    }

    /**
     * Obtener Especialidades
     *
     * @param string $argFilters Filtros
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad
     */
    static public function obtenerEspecialidades($argFilters)
    {
        $especialidades = NomEspecialidad::getEspecialidades($argFilters);
        return $especialidades;
    }

    /**
     * Obtener Arbol
     *
     * @param string $filter   Filtros
     * @param int    $busqueda Referencia de la busqueda
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad
     */
    static public function obtenerArbol($filter, &$busqueda, $onlywithcontcode = false)
    {
        $results = NomEspecialidad::buscarDenominacion($filter, $onlywithcontcode);
        $count = count($results);
        $arbolesConst = array();
        if ($count <= 500) {
            $busqueda = 2;
            for ($i = 0; $i < $count; $i++) {
                if (!$results[$i]['visitado']) {
                    $results[$i]['visitado'] = true;
                    $arbolesConst = EspecialidadModel::construirArbol($results, $results[$i], $arbolesConst);
                }
            }
        } else {
            $busqueda = 3;
        }
        return $arbolesConst;
    }

    /**
     * Construir Arbol
     *
     * @param object $results      Referencia al resultado
     * @param object $nodoBuscado  Objeto de tipo especialidad
     * @param array  $arbolesConst Arreglo donde se va a retornar el resultado
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad
     */
    static public function construirArbol(&$results, $nodoBuscado, $arbolesConst, $onlywithcontcode = false)
    {
        if ($nodoBuscado['idpadre'] != $nodoBuscado['idespecialidad']) {
            $encArbol = false;
            EspecialidadModel::buscaPadreEnArbol($nodoBuscado, $arbolesConst, $encArbol);
            if (!$encArbol) {
                $nodoPadre = EspecialidadModel::buscaPadreEnArray($nodoBuscado, $results);
                if (is_null($nodoPadre)) {
                    $getpadre = NomEspecialidad::obtenerPadre($nodoBuscado['idpadre']);
                    $nodoPadre = $getpadre[0];
                }
                $nodoPadre['children'] = array();
                $nodoPadre['expanded'] = true;
                $nodoPadre['children'][] = $nodoBuscado;
                $arbolesConst = EspecialidadModel::construirArbol($results, $nodoPadre, $arbolesConst);
            }
        } elseif (count($arbolesConst) == 0) {
            $arbolesConst[0] = $nodoBuscado;
        } else {
            $arbolesConst[] = $nodoBuscado;
        }
        return $arbolesConst;
    }

    /**
     * Buscar padre en el arbol
     *
     * @param object  $results      Referencia al resultado
     * @param object  $nodoBuscado  Objeto de tipo especialidad
     * @param array   $arbolesConst Referencia a un arreglo de tipo especialidad
     * @param boolean $encArbol     Referncia si se encuantra el arbol o no
     */
    static public function buscaPadreEnArbol($nodoBuscado, &$arbolesConst, &$encArbol)
    {
        for ($j = 0; $j < count($arbolesConst); $j++) {
            if ($arbolesConst[$j]['idespecialidad'] == $nodoBuscado['idpadre']) {
                $arbolesConst[$j]['expanded'] = true;
                $arbolesConst[$j]['children'][] = $nodoBuscado;
                $encArbol = true;
                break;
            } elseif (count($arbolesConst[$j]['children']) > 0) {
                EspecialidadModel::buscaPadreEnArbol($nodoBuscado, $arbolesConst[$j]['children'], $encArbol);
            }
        }
    }

    /**
     * Buscar padre en un arreglo
     *
     * @param object $nodoBuscado Objeto de tipo especialidad
     * @param array  $results     Referencia a un arreglo de resultados
     *
     * @return object Retorna el elemento si esta en el array sino retorna null
     */
    static public function buscaPadreEnArray($nodoBuscado, &$results)
    {
        for ($i = 0; $i < count($results); $i++) {
            if (!$results[$i]['visitado']) {
                if ($nodoBuscado['idpadre'] == $results[$i]['idespecialidad']) {
                    $results[$i]['visitado'] = true;
                    return $results[$i];
                }
            }
        }
        return null;
    }

    /**
     * Devolver Arbol
     *
     * @param object $tabla  Objeto de tipo tabla
     * @param int    $idnode Identificador del nodo
     * @param string $filtro Filtro
     *
     * @return array Retorna una arreglo con los datos del arbol
     */
    public function devolverarbolAction($tabla, $idnode, $filtro)
    {
        if ($idnode == 0) {
            $arbol = $this->nomenclador->getForest($tabla);
            $k = 0;
            if ($filtro != '') {
                $where = "(codespecialidad ILIKE '%" . $filtro . "%'
                 OR denespecialidad ILIKE '%" . $filtro . "%' OR denespecialidad ILIKE '%" . $filtro . "%')";
            }
            foreach ($arbol as $v) {
                // if para que no mostrar en la en el arbol la especialidad "Ninguna"
                if ($v->_id == 1) {
                    continue;
                }
                $data = false;
                $d = $v->getValues();
                $key = $v->_id;
                if ($filtro != '') {
                    $data = $this->nomenclador
                        ->selectParam(
                            'nom_especialidad', array('idespecialidad'), 0, 0, $where . "AND idespecialidad = $key"
                        );
                }
                if ($filtro == '' || $data) {
                    $result[$k] ['id'] = $v->_id;
                    $result[$k] ['leaf'] = (($v->_rgt) - ($v->_lft) == 1) ? 1 : 0;
                    $result[$k] ['idpadre'] = $v->_id;
                    $result[$k] ['padre'] = 0;
                    $result[$k] ['text'] = $d['codespecialidad'] . ' ' . $d['denespecialidad'];
                    $result[$k] ['codespecialidad'] = $d['codespecialidad'];
                    $result[$k] ['denespecialidad'] = $d['denespecialidad'];
                    $result[$k] ['abrevespecialidad'] = $d['abrevespecialidad'];
                    $result[$k] ['orden'] = $d['orden'];
                    $result[$k] ['fechaini'] = $d['fechaini'];
                    $result[$k] ['fechafin'] = $d['fechafin'];
                    $result[$k] ['nivel'] = $d['nivel'];
                    $k++;
                }
            }
            if ($result) {
                if ($filtro != '') {
                    $this->goTreeColoringFilter($result, $filtro);
                }
                return $result;
            } else {
                return array();
            }
        } else {
            $padre = $this->nomenclador->getTree($tabla, $idnode);
            $arbol = $padre->Childrens();
            $k = 0;
            if ($filtro != '') {
                $where = " AND (codespecialidad LIKE $filtro
                 OR denespecialidad ILIKE $filtro OR denespecialidad ILIKE $filtro)";
            }
            foreach ($arbol as $v) {
                $d = $v->getValues();
                $key = $v->_id;
                $result[$k] ['id'] = $v->_id;
                $result[$k] ['leaf'] = (($v->_rgt) - ($v->_lft) == 1) ? 1 : 0;
                if ($filtro != '') {
                    $padre = $this->nomenclador
                        ->selectParam('nom_especialidad', array('idpadre'), 0, 0, "idespecialidad = '" . $key . "'");
                } else {
                    $padre = $this->nomenclador
                        ->selectParam(
                            'nom_especialidad', array('idpadre'), 0, 0, "idespecialidad = '" . $key . $where . "'"
                        );
                }
                $result[$k] ['idpadre'] = $v->_id;
                $result[$k] ['padre'] = $padre[0]['idpadre'];
                $result[$k] ['text'] = $d['codespecialidad'] . ' ' . $d['denespecialidad'];
                $result[$k] ['codespecialidad'] = $d['codespecialidad'];
                $result[$k] ['denespecialidad'] = $d['denespecialidad'];
                $result[$k] ['abrevespecialidad'] = $d['abrevespecialidad'];
                $result[$k] ['orden'] = $d['orden'];
                $result[$k] ['fechaini'] = $d['fechaini'];
                $result[$k] ['fechafin'] = $d['fechafin'];
                $result[$k] ['nivel'] = $d['nivel'];
                $k++;
            }
            if ($result) {
                if ($filtro != '') {
                    $this->goTreeColoringFilter($result, $filtro);
                }
                return $result;
            } else {
                return array();
            }
        }
    }

    /**
     * Verificar
     *
     * @param object $datos Objeto de tipo especialidad
     * @param int    $llave Identificador de la especialidad
     *
     * @return boolean Retorna verdadero en caso de que la especialidad existe falso en otro caso
     */
    public function verificar($datos, $llave)
    {
        $elemento = $this->nomenclador
            ->selectParam(
                'nom_especialidad', array(
                    'codespecialidad', 'denespecialidad', 'abrevespecialidad',
                    'nivel', 'fechaini', 'fechafin'
                )
                , 0, 0, "idespecialidad = '" . $llave['idespecialidad'] . "'"
            );
        if (count($elemento) > 0) {
            if ($elemento[0]['codespecialidad'] === $datos['codespecialidad']
                && $elemento[0]['denespecialidad'] == $datos['denespecialidad']
                && $elemento[0]['abrevespecialidad'] == $datos['abrevespecialidad']
                && $elemento[0]['fechaini'] == $datos['fechaini']
                && $elemento[0]['fechafin'] == $datos['fechafin']
                && $elemento[0]['controlmaterial'] == $datos['controlmaterial']
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Buscar especialidad por id
     *
     * @param int $llave Identificador de la especialidad
     *
     * @return object Retorna un objeto de tipo especialidad
     */
    public function BuscarPorId($idespecialidad)
    {
        return Doctrine::getTable('NomEspecialidad')
            ->findBy('idespecialidad', $idespecialidad, Doctrine_Core::HYDRATE_ARRAY);
    }

    /**
     * Obtener especialidades
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad
     */
    public function GetEspecialidadesHoja($service = null)
    {
        return NomEspecialidad::getEspecialidades($service);
    }

    /**
     * Darle color al arbol por filtros
     *
     * @param array  $agResult Referencia a un arreglo de especialidades
     * @param string $agFilter Filtro
     */
    public function goTreeColoringFilter(& $agResult, $agFilter)
    {
        foreach ($agResult as & $objConcept) {
            $objConcept['text'] = str_replace(
                $agFilter, "<span style=\"background-color: rgb(255, 255, 0);\">" .
                $agFilter . "</span>", $objConcept['text']
            );
        }
    }

    /**
     * Obtener datos para imprimir reporte
     *
     * @return array Retorna un arreglo con los datos seleccionados de los objetos especialidad
     */
    public function obtenerDatosImprimirReporte()
    {
        $primerNivel = NomEspecialidad::cargarEspecialidades(false);
        $j = 0;
        $especialidades = array();
        $aux = array();
        foreach ($primerNivel as $i) {
            $especialidades [$j] = $i;
            $concat[$i['nivel']] = $i['codespecialidad'];
            $especialidades [$j]['concat'] = $concat[$i['nivel']];
            $aux[$j]['concat'] = $concat[$i['nivel']];
            $j++;
            $esp = NomEspecialidad::cargarHijosEspecialidad(
                $i['ordenizq'], $i['ordender']
            );

            foreach ($esp as $k) {
                $especialidades [$j] = $k;
                $concat[$k['nivel']] = $k['codespecialidad'];
                for ($h = 1; $h <= $k['nivel']; $h++) {
                    if ($h == 1) {
                        $especialidades [$j]['concat'] .= $concat[$h];
                        $aux[$j]['concat'] .= $concat[$h];
                    } else {
                        $especialidades [$j]['concat'] .= "." . $concat[$h];
                        $aux [$j]['concat'] .= "." . $concat[$h];
                    }
                }
                $j++;

            }
        }
        array_multisort($aux, SORT_ASC, $especialidades);
        list($dia, $mes, $year) = explode("/", date('d/m/Y'));
        $entidad = $this->global->Estructura;
        return array(
            'datoGeneral'  => array(
                'reporte' => '20001', 'titulo' => 'nomespecialidad',
                'Entidad' => $entidad->denominacion,
                'dia'     => $dia, 'mes' => $mes, 'year' => $year, 'fechaactual' => date('d/m/Y')
            )
            , 'datoCuerpo' => $especialidades
        );
    }

    /**
     * Obtiene todos los hijos de un nodo dado su identificador
     *
     * @param int $idEspecialidad
     *
     * @author Ing. Lisvany Alonso Martinez
     *
     * @return bool|string
     */
    public function getTodosHijosEspecialidad($idEspecialidad)
    {
        $result = NomEspecialidad::obtenerPadre($idEspecialidad);
        return NomEspecialidad::cargarHijosEspecialidad(
            $result[0]['ordenizq'], $result[0]['ordender']
        );
    }

    public function obtenerEspecialidadParametros($parametros){
        $nomespecialidad = new NomEspecialidad();
        return $nomespecialidad->obtenerEspecialidadParametros($parametros);
    }

}
