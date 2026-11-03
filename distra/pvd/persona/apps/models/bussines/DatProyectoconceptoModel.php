<?php

/**
 * Class DatProyectoconceptoModel
 */
class DatProyectoconceptoModel extends ZendExt_Model
{
    /**
     * @var DatProyectoconcepto
     */
    protected $objDatProjectConcept;
    /**
     * @var NomConcepto
     */
    protected $objNomConcept;

    /**
     *
     */
    function __construct()
    {
        $this->objDatProjectConcept = new DatProyectoconcepto();
        $this->objNomConcept = new NomConcepto();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param DatProyectoconcepto $proyecto
     *
     * @return mixed
     */
    public function Insertar(DatProyectoconcepto $proyecto)
    {
        $proyecto->save();

        return $proyecto->idproyectoconcepto;
    }

    /**
     * Elimina un elemento y actualiza el orden de los hermanos
     *
     * @param $idproyectoconcepto
     *
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function Eliminar($idproyectoconcepto)
    {
        try {
            $proyecto = Doctrine::getTable('DatProyectoconcepto')->find($idproyectoconcepto);
            if ($proyecto != false) {
                $order = $proyecto->orden;
                $idpadre = $proyecto->idpadre;
                $proyecto->delete();
                //Actualiza el orden de los elementos restantes
                $q = Doctrine_Query::create()->update('DatProyectoconcepto')->set('orden', 'orden - 1')->where(
                    'idpadre = ? AND orden > ?', array($idpadre, $order)
                );
                $q->execute();

                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    /**
     * Adiciona elementos al arbol de conceptos
     *
     * @param      $idproyectoconcepto
     * @param      $arrDatos
     * @param null $position
     * @param      $order
     */
    public function addConcept($idproyectoconcepto, $arrDatos, $position = null, $order)
    {
        $objProyectoConcepto = new DatProyectoconcepto();
        $objProyectoConcepto = $this->setObjectCreado($idproyectoconcepto, $arrDatos, $objProyectoConcepto);
        if ($position) {
            if ($position == 'append') {
                //En caso de que sea adicionar encuentra el maximo orden de los hijos del nuevo padre
                $maxorden = Doctrine_Query::create()->select('MAX(orden) as maxorden')->from('DatProyectoconcepto')->where(
                    'idpadre = ?', $arrDatos['idpadre']
                )->fetchOne()->maxorden;
                //Establece el orden
                $objProyectoConcepto->orden = $maxorden ? $maxorden + 1 : 1;
            } else {
                $q = Doctrine_Query::create()->update('DatProyectoconcepto')->set('orden', 'orden + 1');
                if ($position == 'above') {
                    $q->where('idpadre = ? AND orden >= ?', array($arrDatos['idpadre'], $order));
                    $objProyectoConcepto->orden = $order;
                } else { //$position == 'below'
                    $q->where('idpadre = ? and orden > ?', array($arrDatos['idpadre'], $order));
                    $objProyectoConcepto->orden = $order + 1;
                }
                $q->execute();
            }
        }
        $objProyectoConcepto->save();
    }

    /**
     * @param $idproyectoconcepto
     * @param $arrDatos
     * @param $objProyectoConcepto
     *
     * @return mixed
     * @throws Doctrine_Query_Exception
     */
    protected function setObjectCreado($idproyectoconcepto, $arrDatos, $objProyectoConcepto)
    {
//Caso en que el objeto ya esta creado
        if ($idproyectoconcepto) {
            //Busca el objeto en la Base de Datos
            $record = $objProyectoConcepto->getById($idproyectoconcepto, true);
            $objProyectoConcepto = (count($record) > 0) ? $record[0] : $objProyectoConcepto;
            //Esta accion pregunta si hay un cambio de padre
            if ($arrDatos['idpadre'] != $objProyectoConcepto->idpadre) {
                //Actualiza el orden de los elementos restantes
                Doctrine_Query::create()->update('DatProyectoconcepto')->set('orden', 'orden - 1')->where(
                    'idpadre = ? AND orden > ?', array($objProyectoConcepto->idpadre, $objProyectoConcepto->orden)
                )->execute();
                //Modifica quien sera su nuevo padre
                $objProyectoConcepto->idpadre = $arrDatos['idpadre'];

                return $objProyectoConcepto;
            }

            return $objProyectoConcepto;
        } else {
            //Caso en que hay que crear un nuevo objeto
            foreach ($arrDatos as $k => $v) {
                $objProyectoConcepto->$k = $v;
            }

            return $objProyectoConcepto;
        }
    }

    /**
     * Guarda los datos del concepto
     *
     * @param $idproyectoconcepto
     * @param $arrDatos
     *
     * @return mixed
     */
    public function saveConcept($idproyectoconcepto, $arrDatos)
    {
        $objProyectoConcepto = new DatProyectoconcepto();
        if ($idproyectoconcepto) {
            $resp = $objProyectoConcepto->getById($idproyectoconcepto, true);
            $objProyectoConcepto = count($resp) > 0 ? $resp[0] : $objProyectoConcepto;
        }
        foreach ($arrDatos as $k => $v) {
            switch ($k) {
                case 'idpadre':
                    $objProyectoConcepto->idpadre = ($v != 'root') ? $v : $objProyectoConcepto->getIncremented();
                    break;
                default:
                    $objProyectoConcepto->$k = $v;
                    break;
            }
        }
        $objProyectoConcepto->save();

        return $objProyectoConcepto->idproyectoconcepto;
    }

    /**
     * Obtiene las propiedades del componente
     *
     * @param $idproyectoconcepto
     * @param $arrPropertys
     *
     * @return array
     */
    public function getPropertys($idproyectoconcepto, $arrPropertys)
    {
        try {
            $arrPrpts = array();
            if (!empty($idproyectoconcepto)) {
                $proyecto = Doctrine::getTable('DatProyectoconcepto')->find($idproyectoconcepto);
                if (!empty($proyecto)) {
                    $proyecto = $proyecto->toArray();
                }
                $propiedades = json_decode($proyecto['propiedades']);
                $funcionesyeventos = json_decode($proyecto['codigo']);
                $arrPrpts = $this->setArryPropertys($arrPropertys, $arrPrpts, $funcionesyeventos, $propiedades);
            }

            return $arrPrpts;
        } catch (Exception $e) {

        }
    }

    /**
     * @param $arrPropertys
     * @param $arrPrpts
     * @param $funcionesyeventos
     * @param $propiedades
     *
     * @return mixed
     */
    protected function setArryPropertys($arrPropertys, $arrPrpts, $funcionesyeventos, $propiedades)
    {
        foreach ($arrPropertys as $k => $v) {
            $cont = count($arrPrpts);
            $arrPrpts[$cont]['denom'] = $k;
            $arrPrpts[$cont]['type'] = $v['type'];
            switch ($v['type']) {
                case 'array':
                case 'object':
                case 'function':
                    $arrPrpts[$cont]['valor'] = (!empty($funcionesyeventos->$k)) ? $funcionesyeventos->$k : $v['default'];
                    break;
                default:
                    $arrPrpts[$cont]['valor'] = (!empty($propiedades->$k)) ? $propiedades->$k : $v['default'];
                    break;
            }
            $arrPrpts[$cont]['origen'] = $v['origen'];
        }

        return $arrPrpts;
    }

    /**
     * Obtiene los conceptos del proyecto dado
     *
     * @param $idProject
     *
     * @return array
     * @throws Exception
     */
    public function getConceptsByProject($idProject, $idpadre, $treeFormat = false, $widthChecks = false)
    {
        try {
            $objDomain = new DatProyectoconcepto();
            $data = $objDomain->getConcepts($idProject, ($treeFormat == false) ? $idpadre : null);

            return ($treeFormat) ? $this->generateTreeConceptByProject($data, $widthChecks) : $data;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $array
     * @param       $idPadre
     * @param       $len
     *
     * @return array
     */
    private function generateTreeConceptByProject(array &$array, $widthChecks, $idPadre, &$len)
    {
        $treeFormat = array();
        $len = isset($len) ? $len : count($array);
        $cont = 0;
        while ($len > $cont) {
            $dataTree = $this->dataTree($array, $widthChecks, $idPadre, $len, $cont, $treeFormat);
            list($treeFormat, $array, $cont, $len) = $dataTree;
        }

        return $treeFormat;
    }

    /**
     * @param array $array
     * @param       $widthChecks
     * @param       $idPadre
     * @param       $len
     * @param       $cont
     * @param       $treeFormat
     *
     * @return array
     */
    private function dataTree(array &$array, $widthChecks, $idPadre, &$len, $cont, $treeFormat)
    {
        $v = $array[$cont];
        $lenght = count($treeFormat);
        if (empty($idPadre)) {
            if ($v['idproyectoconcepto'] == $v['idpadre']) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['expanded'] = true;
                array_splice($array, $cont, 1);
                $len--;
                $treeFormat[$lenght]['children'] = $this->generateTreeConceptByProject(
                    $array, $widthChecks, $v['idproyectoconcepto'], $len
                );

                return array($treeFormat, $array, $cont, $len);
            } else {
                $cont++;

                return array($treeFormat, $array, $cont, $len);
            }
        } else {
            if ($v['idpadre'] == $idPadre && $v['idproyectoconcepto'] != $idPadre) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['expanded'] = false;
                switch ($v['tipo']) {
                    case 3: {
                        $treeFormat[$lenght]['leaf'] = true;
                        if ($widthChecks) {
                            $treeFormat[$lenght]['checked'] = false;
                        }
                    }
                        break;
                    default:
                        break;
                }
                array_splice($array, $cont, 1);
                $len--;
                $treeFormat[$lenght]['children'] = $this->generateTreeConceptByProject(
                    $array, $widthChecks, $v['idproyectoconcepto'], $len
                );

                return array($treeFormat, $array, $cont, $len);
            } else {
                $cont++;

                return array($treeFormat, $array, $cont, $len);
            }
        }
    }

    /**
     * @param $idProject
     * @param $arrEvents
     *
     * @return array
     * @throws Exception
     */
    public function getEventsByProject($idproyectoconcepto, $arrEvents)
    {
        try {
            $events = array();
            $proyecto = Doctrine::getTable('DatProyectoconcepto')->find($idproyectoconcepto);
            if (!empty($proyecto)) {
                $proyecto = $proyecto->toArray();
            }
            $funcionesyeventos = json_decode($proyecto['codigo'])->listeners;
            foreach ($arrEvents as $k => $v) {
                $cont = count($events);
                $events[$cont]['denom'] = $k;
                $events[$cont]['type'] = $v['type'];
                $events[$cont]['valor'] = (!empty($funcionesyeventos->$k)) ? $funcionesyeventos->$k : $v['default'];
            }

            return $events;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idrol
     * @param $idproject
     *
     * @return array
     * @throws Exception
     */
    public function getTreeConceptByRol($idrol, $idproject)
    {
        try {
            return $this->objDatProjectConcept->getTreeConceptByRol($idrol, $idproject);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idProject
     * @param $idPadre
     * @param $arrConcept
     */
    public function cloneTreeConcepto($idProject, $idPadre, $arrConcept)
    {
        try {
            $concepts = $this->objNomConcept->getConceptos($arrConcept);
            if (count($concepts) > 0) {
                $cantChilds = $this->objDatProjectConcept->getCanChilds($idPadre);
                $collection = $this->generateCollectionToClone(
                    $concepts, $cantChilds > 0 ? $cantChilds-- : 0, $idProject, $idPadre
                );
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {

        }
    }

    /**
     * @param array $data
     * @param       $orden
     * @param       $idProject
     * @param       $idPadre
     * @param       $objCollection
     *
     * @return Doctrine_Collection
     */
    private function generateCollectionToClone(array $data, $orden, $idProject, $idPadre, $objCollection)
    {
        $collection = isset($objCollection) ? $objCollection : new  Doctrine_Collection('DatProyectoconcepto');
        $p = 0;
        while ($p < count($data)) {
            $v = $data[$p];
            if (($orden !== null && $v['tipo'] == 1) || ($orden === null && $v['tipo'] != 1)) {
                if ($v['tipo'] == 1) {
                    $collection[$p]->idpadre = $idPadre;
                }
                $collection[$p]->idproyecto = $idProject;
                $collection[$p]->denominacion = $v['denominacion'];
                $collection[$p]->tipo = $v['tipo'];
                $collection[$p]->descripcion = $v['descripcion'];
                $collection[$p]->propiedades = $v['propiedades'];
                $collection[$p]->iconcls = $v['iconcls'];
                $collection[$p]->codigo = $v['codigo'];
                $collection[$p]->cmpempleado = $v['cmpempleado'];
                if (isset($orden) && !empty($orden)) {
                    $collection[$p]->orden = $orden++;
                } else {
                    $collection[$p]->orden = $v['orden'];
                }
                if (count($v['NomConcepto']) > 0) {
                    $collection[$p]['DatProyectoconcepto'] = $this->generateCollectionToClone(
                        $v['NomConcepto'], null, $idProject, null, $collection[$p]['DatProyectoconcepto']
                    );
                }
                $p++;
            } else {
                array_splice($data, $p, 1);
            }
        }

        return $collection;
    }

    public function getConceptoByCampo($id, $getData = false)
    {
        try {
            do {
                $campo = $this->objDatProjectConcept->getById($id);
                if (count($campo) > 0) {
                    if ($campo[0]['tipo'] == 3) {
                        $denomcampo = $campo[0]['denominacion'];
                    }
                    $data = !empty($campo[0]['getdata']) ? json_decode($campo[0]['getdata']) : new stdClass();
                    if ($data->type) {
                        $type = $data->type;
                    }
                    $id = $campo[0]['idpadre'];
                } else {
                    break;
                }
            } while ($campo[0]['tipo'] != 1);
            $response = array(
                'denomcampo' => $denomcampo, 'denomconcepto' => $campo[0]['denominacion'],
                'idconcepto' => $campo[0]['idproyectoconcepto'], 'type' => $type);
            if ($getData) {
                $response['getdata'] = $data; //json_decode($campo[0]['getdata']);
            }

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDataExtration($id)
    {
        $data = $this->getConceptoByIds($id);
        $response = array();
        foreach ($data as $k => $v) {
            if (!empty($v['getdata'])) {
                $tmp = json_decode($v['getdata']);
                $response[$v['idproyectoconcepto']] = $tmp[0];
            }
        }

        return $response;
    }

    public function getConceptoByIds($id)
    {
        try {
            return $this->objDatProjectConcept->getById($id);
        } catch (Exception $e) {
            throw $e;
        }
    }
}

