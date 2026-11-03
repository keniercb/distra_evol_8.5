<?php

/**
 * Clase modelo de P\xE1rrafo Fiscal
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage P\xE1rrafoFiscal/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 */
class ParrafofiscalModel extends ZendExt_Model
{

    private $nomenclador;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
    }

    /**
     * Obtiene p\xE1rrafos fiscales
     *
     * @param mixed $argFilters Condiciones
     * @internal param \DatParrafoFiscalEntidad $datParrafoFiscalEntidad P\xE1rrafo fiscal a adicionar
     *
     * @return mixed True si adiciona correctamente, -4 si no adiciona
     */
    static public function obtenerParrafos($argFilters)
    {
        $parrafosFiscales = NomParrafoFiscal::getParrafosFiscales($argFilters);
        return $parrafosFiscales;
    }

    /**
     * Obtiene el \xE1rbol de p\xE1rrafos fiscales
     *
     * @param mixed $filter Condiciones
     * @param mixed $busqueda Búsqueda
     *
     * @return array Árbol
     */
    static public function obtenerArbol($filter, &$busqueda)
    {
        $results = NomParrafoFiscal::buscarDenominacion($filter);
        $count = count($results);
        $arbolesConst = array();
        if ($count <= 500) {
            $busqueda = 2;
            for ($i = 0; $i < $count; $i++) {
                if (!$results[$i]['visitado']) {
                    $results[$i]['visitado'] = true;
                    $arbolesConst = ParrafofiscalModel::construirArbol(
                                    $results, $results[$i], $arbolesConst
                    );
                }
            }
        } else {
            $busqueda = 3;
        }
        return $arbolesConst;
    }

    /**
     * Construye el \xE1rbol de p\xE1rrafos fiscales
     *
     * @param mixed $results Resultados
     * @param mixed $nodoBuscado Nodo que se busca
     * @param mixed $arbolesConst Árboles construidos
     *
     * @return array Árbol
     */
    static public function construirArbol(
    &$results, $nodoBuscado, $arbolesConst
    )
    {
        if ($nodoBuscado['idpadre'] != $nodoBuscado['idparrafofiscal']) {
            $encArbol = false;
            ParrafofiscalModel::buscaPadreEnArbol(
                    $nodoBuscado, $arbolesConst, $encArbol
            );
            if (!$encArbol) {
                $nodoPadre = ParrafofiscalModel::buscaPadreEnArray(
                                $nodoBuscado, $results
                );
                if (is_null($nodoPadre)) {
                    $getpadre = NomParrafoFiscal::obtenerPadre(
                                    $nodoBuscado['idpadre']
                    );
                    $nodoPadre = $getpadre[0];
                }
                $nodoPadre['children'] = array();
                $nodoPadre['expanded'] = true;
                $nodoPadre['children'][] = $nodoBuscado;
                $arbolesConst = ParrafofiscalModel::construirArbol(
                                $results, $nodoPadre, $arbolesConst
                );
            }
        } elseif (count($arbolesConst) == 0) {
            $arbolesConst[0] = $nodoBuscado;
        } else {
            $arbolesConst[] = $nodoBuscado;
        }
        return $arbolesConst;
    }

    /**
     * Obtiene el padre de un elemento en el \xE1rbol
     *
     * @param mixed $nodoBuscado Nodo que se busca
     * @param mixed $arbolesConst Árboles construidos
     * @param mixed $encArbol Árbol a encontrar
     *
     * @return void
     */
    static public function buscaPadreEnArbol(
    $nodoBuscado, &$arbolesConst, &$encArbol
    )
    {
        for ($j = 0; $j < count($arbolesConst); $j++) {
            if ($arbolesConst[$j]['idparrafofiscal'] == $nodoBuscado['idpadre']
            ) {
                $arbolesConst[$j]['expanded'] = true;
                $arbolesConst[$j]['children'][] = $nodoBuscado;
                $encArbol = true;
                break;
            } elseif (count($arbolesConst[$j]['children']) > 0) {
                ParrafofiscalModel::buscaPadreEnArbol(
                        $nodoBuscado, $arbolesConst[$j]['children'], $encArbol
                );
            }
        }
    }

    /**
     * Obtiene el padre de un elemento 
     *
     * @param mixed $nodoBuscado Nodo que se busca
     * @param mixed $results Resultados
     *
     * @return NULL
     */
    static public function buscaPadreEnArray($nodoBuscado, &$results)
    {
        for ($i = 0; $i < count($results); $i++) {
            if (!$results[$i]['visitado']) {
                if ($nodoBuscado['idpadre'] == $results[$i]['idparrafofiscal']
                ) {
                    $results[$i]['visitado'] = true;
                    return $results[$i];
                }
            }
        }
        return null;
    }

    /**
     * Adiciona un nomenclador de p\xE1rrafo fiscal
     *
     * @param mixed $datos Datos del p\xE1rrafo fiscal a adicionar
     *
     * @return boolean True si adicionó correctamente
     */
    /// Se agregó  los metodos  adicionar eliminar y modificar ya que los nomencladores ADT  daban error
    public function adicionarNomParrafoFiscal($datos)
    {
        $instance = new NomParrafoFiscal();
        $instance->codigo = $datos['codigo'];
        $instance->descripcion = $datos['descripcion'];
        $instance->fechafin = $datos['pformfin'];
        $instance->idformato = $datos['formato'];
        $instance->referencia = $datos['referencia'];
        $instance->idpadre = $datos['idpadre'];
        $instance->fechainicio = $datos['fechaStart'];
        $instance->nivel = $datos['nivel'];
        $esta = NomParrafoFiscal::verificar($instance->codigo, '', $instance->nivel, $instance->idpadre);

        if ($esta == 0) {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            try {

                $cc->beginTransaction();
                $instance->save();
                $cc->commit();
                return true;
            } catch (Exception $ee) {
                $cc->rollback();
                throw $ee;
            }
        } else {
            return false;
        }
    }

    /**
     * Elimina uno o varios nomencladores de p\xE1rrafo fiscal
     *
     * @param mixed $id Identificador del p\xE1rrafo fiscal a eliminar
     *
     * @return boolean
     */
    public function eliminarNomParrafoFiscal($id)
    {

        $idsToFind = array();
        //array de la forma idEspecialidad => nivel
        $idsNivel = array();
        //array de la forma idHijo => idPadre
        $hijoPadre = array();
        $idsToFind[] = $id;
        $idsNivel[] = $id;
        $firstTime = true;
        // Buscando hijos de $id
        while ($idsToFind) {
            $aux = array();
            foreach ($idsToFind as $idPadre) {
                $obt = Doctrine::getTable('NomParrafoFiscal')->findByDql(
                        "idpadre = $idPadre"
                );
                if ($obt) {
                    $firstTime = false;
                    foreach ($obt as $oneEl) {
                        if ($oneEl->idparrafofiscal !== $idPadre) {
                            $ident = $oneEl->idparrafofiscal;
                            $hijoPadre[$ident] = $idPadre;
                            $aux[] = $ident;
                            $idsNivel[] = $ident;
                        }
                    }
                }
            }
            $idsToFind = $aux;
        }
        if (count($idsNivel) == 1) {
            return $this->eliminarParrafoFiscal($id);
        }
        //$devolver = true;
        while ($idsNivel) {
            $llaveElem = array_pop($idsNivel);
            $this->eliminarParrafoFiscal($llaveElem);
            /* if ($elim == '-4') {
              $devolver = '-4';
              $value = $hijoPadre[$llaveElem];
              $eliminarEl = $this->eliminarElemArray($value, $idsNivel);
              $idsNivel = $eliminarEl;
              } */
        }
        return true;
    }

    /* private function eliminarElemArray($elem, $arrayElem)
      {
      $aux = array();
      for ($i = 0; $i < count($arrayElem); $i++) {
      if ($arrayElem[i] !== $elem) {
      $aux[] = $arrayElem[i];
      }
      }
      return $aux;

      } */

    /**
     * Elimina un p\xE1rrafo fiscal
     *
     * @param mixed $param P\xE1rrafo fiscal a eliminar
     *
     * @return boolean
     * 
     * @throws ZendExt_Exception
     */
    public function eliminarParrafoFiscal($param)
    {
        try {
            $objNomParrafoFiscal = Doctrine::getTable('NomParrafoFiscal')->find(
                    $param
            );
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objNomParrafoFiscal->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503) {
                throw new ZendExt_Exception('CONFI72', $ee);
            } else {
                throw new ZendExt_Exception('NOCONTROLLED', $ee);
            }
        }
    }

    /**
     * Modifica un nomenclador de p\xE1rrafo fiscal
     *
     * @param mixed $param P\xE1rrafo fiscal a modificar
     *
     * @return boolean
     * 
     * @throws Exception
     */
    public function modificarNomParrafoFiscal($param)
    {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $objNomParrafoFiscal = Doctrine::getTable('NomParrafoFiscal')->find(
                    $param['idparrafofiscal']
            );
            $objNomParrafoFiscal->codigo = $param['codigo'];
            $objNomParrafoFiscal->descripcion = $param['descripcion'];
            $objNomParrafoFiscal->fechainicio = $param['fechaStart'];
            $objNomParrafoFiscal->fechafin = $param['pformfin'];
            $objNomParrafoFiscal->referencia = $param['referencia'];
            $objNomParrafoFiscal->nivel = $param['nivel'];
            $cc->beginTransaction();
            $objNomParrafoFiscal->save();
            $cc->commit();
            return true;
        } catch (Exception $ee) {
            $cc->rollback();
            throw $ee;
        }
    }

    /**
     * Adiciona un p\xE1rrafo fiscal original
     *
     * @param mixed $datos P\xE1rrafo fiscal a adicionar
     *
     * @return boolean
     * 
     * @throws ZendExt_Exception
     */
    public function insertarParrafofiscalOriginal($datos)
    {
        try {
            if ($datos['idpadre']) {
                $where = "idpadre = " . $datos['idpadre'] . " AND codigo = '"
                        . $datos['codigo'] . "'";
            } else {
                $where = "idpadre = idparrafofiscal AND codigo = '"
                        . $datos['codigo'] . "'";
            }
            $parcod = $this->nomenclador->selectParam(
                    "nom_parrafofiscal", array('*'), $limit, $start, $where
            );
            $pardem = $this->nomenclador->selectParam(
                    "nom_parrafofiscal", array('*'), $limit, $start, "descripcion = '" . $datos['descripcion'] . "'"
            );

            $valid = false;
            if (count($parcod) > 0) {
                return false;
            } elseif (count($pardem) > 0) {
                return false;
            } else {
                $valid = true;
            }
            if ($valid) {
                $this->nomenclador->insertElements(
                        'nom_parrafofiscal', $datos
                );
                return true;
            }
            return false;
        } catch (Exception $ee) {
            throw new ZendExt_Exception('CONFE010', $ee);
        }
    }

    /**
     * Elimina un p\xE1rrafo fiscal original
     *
     * @param mixed $llave Identificador del p\xE1rrafo fiscal a eliminar
     *
     * @return boolean
     * 
     * @throws ZendExt_Exception
     */
    public function eliminarParrafofiscalOriginal($llave)
    {
        try {
            $this->nomenclador->deleteElements(
                    'nom_parrafofiscal', $llave
            );
            return true;
        } catch (Exception $ee) {
            throw new ZendExt_Exception('CONFE006', $ee);
        }
    }

    /**
     * Modifica un p\xE1rrafo fiscal original
     *
     * @param mixed $datos Datos del p\xE1rrafo fiscal a modificar
     * @param mixed $llave Identificador del p\xE1rrafo fiscal a modificar
     * @param mixed $oldvalue Valor anterior del p\xE1rrafo fiscal a modificar
     * @param mixed $olddenom Denominación anterior del p\xE1rrafo fiscal a modificar
     * @param mixed $idpadre Identificador del nodo padre del p\xE1rrafo fiscal a modificar
     *
     * @return boolean
     * 
     * @throws Exception
     */
    public function modificarParrafofiscalOriginal(
    $datos, $llave, $oldvalue = '', $olddenom = '', $idpadre = ''
    )
    {
        try {
            $valid = true;
            $start = 0;
            $limit = 10000;
            $parcod = array();
            $pardem = array();

            if ($oldvalue) {
                $parcod = $this->nomenclador->selectParam(
                        "nom_parrafofiscal", array('*'), $limit, $start, "idpadre = " . $idpadre . " AND codigo <> '" . $oldvalue
                        . "' AND codigo = '" . $datos['codigo'] . "'"
                );
            }
            $pardem = $this->nomenclador->selectParam(
                    "nom_parrafofiscal", array('*'), $limit, $start, "idpadre = " . $idpadre . " AND codigo <> '" . $olddenom
                    . "'  AND descripcion = '" . $datos['descripcion'] . "'"
            );

            if (count($parcod) > 0 || count($pardem) > 0) {
                $valid = false;
            } else {
                $valid = $this->auxModificarParrafofiscalOriginal($parcod, $pardem, $datos);
            }
            if ($valid) {
                $this->nomenclador->updateElements(
                        'nom_parrafofiscal', $datos, $llave
                );
                return true;
            } else {
                return false;
            }
        } catch (Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Método auxiliar de "modificarParrafofiscalOriginal"
     *
     * @param mixed $parcod Código de p\xE1rrafo fiscal
     * @param mixed $pardem Denominación de p\xE1rrafo fiscal
     * @param mixed $datos Datos de p\xE1rrafo fiscal
     *
     * @return boolean
     */
    private function auxModificarParrafofiscalOriginal($parcod, $pardem, $datos)
    {
        if (count($parcod) == 1 && count($pardem) == 1) {
            if ($parcod[0]['idparrafofiscal'] == $datos['idparrafofiscal'] && $pardem[0]['idparrafofiscal'] == $datos['idparrafofiscal']
            ) {
                $valid = true;
            } else {
                $valid = false;
            }
        } else {
            $valid = true;
        }
        return $valid;
    }

    /**
     * Obtiene el \xE1rbol de p\xE1rrafos fiscales
     *
     * @param mixed $tabla Tabla
     * @param mixed $idnode Identificador de nodo
     *
     * @return array Árbol
     */
    public function devolverarbol($tabla, $idnode)
    {
        if ($idnode == 0) {
            $arbol = $this->nomenclador->getForest($tabla);
            $k = 0;
            foreach ($arbol as $v) {
                $d = $v->getValues();
                $key = $v->_id;
                $result[$k] ['id'] = $v->_id;
                $result[$k] ['leaf'] = (($v->_rgt) - ($v->_lft) == 1) ? 1 : 0;
                $result[$k] ['idpadre'] = $v->_id;
                $result[$k] ['padre'] = 0;
                $result[$k] ['text'] = $d['codigo'] . ' ' . $d['descripcion'];
                $result[$k] ['codigo'] = $d['codigo'];
                $result[$k] ['descripcion'] = $d['descripcion'];
                $result[$k] ['fechaini'] = $d['fechainicio'];
                $result[$k] ['fechafin'] = $d['fechafin'];
                $result[$k] ['referencia'] = $d['referencia'];
                $result[$k] ['idformato'] = $d['idformato'];
                $k++;
            }
            return $this->auxDevolverarbol($result);
        } else {
            $padre = $this->nomenclador->getTree($tabla, $idnode);
            $arbol = $padre->Childrens();
            $k = 0;
            foreach ($arbol as $v) {
                $d = $v->getValues();
                $key = $v->_id;
                $result[$k] ['id'] = $v->_id;
                $result[$k] ['leaf'] = (($v->_rgt) - ($v->_lft) == 1) ? 1 : 0;
                $padre = $this->nomenclador->selectParam(
                        'nom_parrafofiscal', array('idpadre'), 0, 0, "idparrafofiscal = '" . $key . "'"
                );
                $result[$k] ['idpadre'] = $v->_id;
                $result[$k] ['padre'] = $padre[0]['idpadre'];
                $result[$k] ['text'] = $d['codigo'] . ' ' . $d['descripcion'];
                $result[$k] ['codigo'] = $d['codigo'];
                $result[$k] ['descripcion'] = $d['descripcion'];
                $result[$k] ['fechaini'] = $d['fechainicio'];
                $result[$k] ['fechafin'] = $d['fechafin'];
                $result[$k] ['referencia'] = $d['referencia'];
                $result[$k] ['idformato'] = $d['idformato'];
                $k++;
            }
            if ($result) {
                return $result;
            }
        }
    }

    /**
     * Método auxiliar de "devolverarbol"
     *
     * @param mixed $result Resultado
     *
     * @return array
     */
    private function auxDevolverarbol($result)
    {
        if ($result) {
            return $result;
        } else {
            return array();
        }
    }

    /**
     * Verifica la existencia de datos de un p\xE1rrafo fiscal en la Base de Datos
     *
     * @param mixed $datos Datos del p\xE1rrafo fiscal
     * @param mixed $llave Identificador del p\xE1rrafo fiscal
     *
     * @return boolean
     */
    public function verificar($datos, $llave)
    {
        $elemento = $this->nomenclador->selectParam(
                'nom_parrafofiscal', array('codigo', 'descripcion', 'fechafin',
            'fechainicio', 'referencia'), 0, 0, "idparrafofiscal = '" . $llave['idparrafofiscal'] . "'"
        );
        if ($elemento[0]['codigo'] != $datos['codigo'] || $elemento[0]['descripcion'] != $datos['descripcion'] || $elemento[0]['fechafin'] != $datos['fechafin'] || $elemento[0]['fechainicio'] != $datos['fechaini'] || $elemento[0]['referencia'] != $datos['referencia']
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Valida que un p\xE1rrafo fiscal pertenezca a una determinada estructura común
     *
     * @param mixed $idpadre Identificador de un p\xE1rrafo fiscal
     * @param mixed $codigo Código de p\xE1rrafo fiscal
     *
     * @return boolean
     */
    public function validar($codigo, $descripcion, $nivel, $idparrafofiscal, $idpadre)
    {
        return NomParrafoFiscal::validar($codigo, $descripcion, $nivel, $idparrafofiscal, $idpadre);
    }

    /**
     * Obtiene un p\xE1rrafo fiscal a partir de su identificador
     *
     * @param mixed $idparrafofiscal Identificador de un p\xE1rrafo fiscal
     *
     * @return mixed P\xE1rrafo fiscal
     */
    public function BuscarPorId($idparrafofiscal)
    {
        return $this->nomenclador->selectParam(
                        'nom_parrafofiscal', array('*'), 0, 0, "idparrafofiscal = " . $idparrafofiscal
        );
    }

    /**
     * Obtiene p\xE1rrafos fiscales a partir del identificador de una estructura común
     *
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return mixed P\xE1rrafos fiscales
     */
    public function buscarPorEntidad($idestructuracomun, $idnode)
    {
        $parrafosFiscales = NomParrafoFiscal::cargarParrafosFiscales($idnode);
        $datPF = new DatParrafoFiscalEntidadModel();
        $temp = array();
        if (!empty($parrafosFiscales)) {
            $cont = count($parrafosFiscales);
            for ($i = 0; $i < $cont; $i++) {
                $id = explode('-', $parrafosFiscales[$i]['id']);
                if (!isset($id[1]) || $id[1] == 'p') {
                    $get = $datPF->getPFEntidad($id[0], $idestructuracomun);
                    /*$this->modelp->getPFEntidad(
                        $idnode, $this->global->Estructura->idestructura
                    );*/
                    $parrafosFiscales[$i]['id']
                        = $parrafosFiscales[$i]['id'] . '-p';
                    if ($get) {
                        $temp[0] = $parrafosFiscales[$i];
                        $temp[0]['id']
                            = $get[0]['idparrafofiscalentidad'] . '-e';
                        $temp[0]['leaf'] = 1;
                        $temp[0]['text'] = '<b>' . $temp[0]['text'] . '</b>';
                        $temp[0]['fechaini'] = $get[0]['fechaini'];
                        $temp[0]['fechafin'] = $get[0]['fechafin'];
                        $temp[0]['referencia'] = $get[0]['referencia'];
                        $parrafosFiscales[$i]['orden'] = 1;
                        $temp[0]['orden'] = 2;
                        $parrafosFiscales = array_merge(
                            $parrafosFiscales, $temp
                        );
                        $temp = array();
                    }
                }
            }
            foreach ($parrafosFiscales as $llave => $fila) {
                $codigo[$llave] = $fila['codigo'];
                $orden[$llave] = $fila['orden'];
            }
            array_multisort(
                $codigo, SORT_ASC, $orden, SORT_ASC, $parrafosFiscales
            );

            for ($i = 0; $i < count($parrafosFiscales); $i++) {
                $parrafosFiscales[$i]['padre']
                    = $parrafosFiscales[$i]['padre'] . '-p';
            }
        }
        return $parrafosFiscales;


        /*return $this->nomenclador->selectParam('nom_parrafofiscal', array('*'), 0, 0);*/
    }

    /**
     * Obtiene los datos para imprimir un reporte
     *
     * @return array Datos para el reporte
     */
    public function obtenerDatosImprimirReporte()
    {
        $primerNivel = NomParrafoFiscal::cargarParrafosFiscales(false);
        $j = 0;
        $pFiscales = array();
        $aux = array();
        foreach ($primerNivel as $i) {
            $pFiscales [$j] = $i;
            $concat[$i['nivel']] = $i['codigo'];
            $pFiscales [$j]['concat'] = $concat[$i['nivel']];
            $aux[$j]['concat'] = $concat[$i['nivel']];
            $j++;
            $esp = NomParrafoFiscal::cargarHijosPF(
                            $i['ordenizq'], $i['ordender']
            );

            foreach ($esp as $k) {
                $pFiscales [$j] = $k;
                $concat[$k['nivel']] = $k['codigo'];
                for ($h = 1; $h <= $k['nivel']; $h++) {
                    if ($h == 1) {
                        $pFiscales [$j]['concat'] .= $concat[$h];
                        $aux[$j]['concat'] .= $concat[$h];
                    } else {
                        $pFiscales [$j]['concat'] .= "." . $concat[$h];
                        $aux [$j]['concat'] .= "." . $concat[$h];
                    }
                }
                $j++;
            }
        }
        array_multisort($aux, SORT_ASC, $pFiscales);
        list($dia, $mes, $year) = explode("/", date('d/m/Y'));
        $entidad = $this->global->Estructura;
        return array('datoGeneral' => array('reporte' => '20002',
                'titulo' => 'mod_datosmaestros.nom_parrafofiscal',
                'Entidad' => $entidad->denominacion,
                'dia' => $dia,
                'mes' => $mes,
                'year' => $year,
                'fechaactual' => date('d/m/Y')),
            'datoCuerpo' => $pFiscales);
    }

}
