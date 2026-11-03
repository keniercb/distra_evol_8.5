<?php

class PartesPiezasAgregadosModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::__construct();
        $relationsInd[] = array(
            'cardinalidad' => 'many',
            'relation' => 'DatControlMedios',
            'properties' => array('local' => 'idpadre', 'foreign' => 'idindicador'));
        $this->doctrineHelper = LogisticaDoctrineHelper::__init();
        $this->doctrineHelper->tryInyectRelactions(new NomIndicador, $relationsInd);
    }

    /**
     * Método para adicionar una nueva pieza
     *
     * @param Array $params Arreglo con los parametros para adicionar las piezas
     *
     * @return String
     */
    public function adicionarPieza($params)
    {
        $datosPieza = array();
        if ($params['idpiezaagregado']) {
            //$id = $this->asignarId($pieza['idregnumerico'], $pieza['idindicador']);
            $pieza = Doctrine::getTable('DatPartesPiezasAgregados')->find($params['idpiezaagregado']);
            $datosPieza['datos'] = json_encode($params['atributosDinamicos']);
            $datosPieza['fechaadquisicion'] = $params['fechaadquisicion'];
        }
        else {
            $pieza = new DatPartesPiezasAgregados();
            $datosPieza['idregnumerico'] = $params['idregnumerico'];
            $datosPieza['idindicador'] = $params['idindicador'];
            $datosPieza['denominacion'] = $params['denominacion'];
            $datosPieza['idpadre'] = $params['idpadre'];
            $datosPieza['fechaadquisicion'] = $params['fechaadquisicion'];
            $datosPieza['datos'] = json_encode($params['atributosDinamicos']);
        }
        $pieza->synchronizeWithArray($datosPieza);
        $pieza->save();
        return true;
    }

    /**
     * Método para cargar las piezas
     *
     * @param Array $params Arreglo con los parametros para filtrar los atributos
     *
     * @return array
     */
    public function cargarPiezas($params)
    {
        $query = new Doctrine_Query();
        $query->select(
            'pz.idpiezaagregado,pz.idindicador, pz.denominacion , pz.datos, pz.idregnumerico, pz.idpadre,
            pz.fechaadquisicion, pz.fechacierre, pz.idordentrabajo, (SELECT d.nrodoc
            FROM DatDocumento d WHERE d.iddocumento = pz.idordentrabajo) as nroorden'
        )
            ->from('DatPartesPiezasAgregados pz');
        $mproducto = new MaestroProductoModel();
        $query->innerJoin('pz.NomIndicador ind')->addSelect("ind.codigo as codigo");
        $mproducto->addQueryJoinIndicadorHoja($query, 'ind', 'indh', 1);
        $mproducto->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true);
        $query->addSelect($mproducto->getSelectStringForQueryIndHoja('indh'));

        if ($params['criterio']) {
            $query->addWhere("pz.denominacion ilike '%" . $params['criterio'] . "%'");
        };
        if ($params['idregnumerico']) {
            $query->addWhere("pz.idregnumerico = ?", array($params['idregnumerico']));
        };
        if ($params['idproducto']) {
            $query->addWhere("pz.idregnumerico = ?", array($params['idproducto']));
        };
        if ($params['disponible']) {
            $query->addWhere("pz.fechacierre is null ");
        };
        $result = $query->fetchArray();
        return $this->addResultLimits($result, $params);
    }

    /**
     * Método para eliminar las piezas
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las piezas
     *
     * @return array
     */
    public function eliminarPieza($parametros)
    {
        foreach ($parametros as $row) {
            $query = new Doctrine_Query();
            $query->delete()
                ->from('DatPartesPiezasAgregados pz')
                ->whereIn('pz.idpiezaagregado', $row)
                ->execute();
        }

        return true;
    }

    /**
     * Método para verificar la existencia de una pieza
     *
     * @param $idindicador id del indicador
     *        $idregnumerico id del registro numerico
     *
     * @return boolean
     */
    public function existencia($idregnumerico, $idindicador)
    {
        $query = new Doctrine_Query();
        $query->select('*')
            ->from('DatPartesPiezasAgregados pz')
            ->where('pz.idregnumerico = ?', array($idregnumerico))
            ->andWhere('pz.idindicador = ?', array($idindicador));
        $result = $query->fetchArray();
        if ($result) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Funcion que devuelve el id de la pieza a modificar
     *
     * @param integer $idregnumerico identificador del regustro numerico
     * @param integer $idindicador identificador del indicador
     *
     * @return integer $result
     */
    public function asignarId($idregnumerico, $idindicador)
    {
        $query = new Doctrine_Query();
        $query->select('pz.idpiezaagregado as idpiezaagregado')
            ->from('DatPartesPiezasAgregados pz')
            ->where('pz.idregnumerico = ?', array($idregnumerico))
            ->andWhere('pz.idindicador = ?', array($idindicador));
        $result = $query->fetchArray();
        return $result[0]['idpiezaagregado'];
    }

    /**
     * Funcion que parametriza la cantidad de resultados que se devuelve
     *
     * @param Array $array
     * @param Array $params Arreglo que contiene los parametros de offset y limite
     *
     * @return Array $result
     */
    public function addResultLimits($array = array(), $params = array())
    {
        $result = array();
        $valores = array();
        $this->limitOld += $params['start'] + $params['limit'];
        for ($i = $params['start']; $i < $this->limitOld; $i++) {
            if (count($array) == $i) {
                break;
            }
            array_push($valores, $array[$i]);
        }
        $result['datos'] = $valores;
        $result['cantidad'] = count($array);
        return $result;
    }

    /**
     * Método para actualizar el cierre de las piezas
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las piezas
     *
     * @return array
     */
    public function actualizarFechaCierre($params)
    {
        $datosPieza = array();
        //$id = $this->asignarId($params['idregnumerico'], $params['idindicador']);
        $pieza = Doctrine::getTable('DatPartesPiezasAgregados')->find($params['idpiezaagregado']);
        //$datosPieza['fechacierre'] = $params['fechacierre'];
        $pieza->fechacierre = $params['fechacierre'];
        //$pieza->synchronizeWithArray($datosPieza);
        $pieza->save();
        return true;
    }

    /**
     * Método para adicionar un arreglo de piezas
     *
     * @param Array $params Arreglo con los parametros para filtrar las piezas
     *
     * @return String
     */
    public function adicionarPiezas($arrPiezas)
    {
        $piezasArray = new Doctrine_Collection('DatPartesPiezasAgregados');
        foreach ($arrPiezas as $pieza) {
            $datosPieza = array();
            $piezaObj = new DatPartesPiezasAgregados();
            if ($pieza['idpiezaagregado']) {
                //$id = $this->asignarId($pieza['idregnumerico'], $pieza['idindicador']);
                $piezaObj = Doctrine::getTable('DatPartesPiezasAgregados')->find($pieza['idpiezaagregado']);
            }
            $datosPieza['idregnumerico'] = $pieza['idregnumerico'];
            $datosPieza['idindicador'] = $pieza['idindicador'];
            $datosPieza['denominacion'] = $pieza['denominacion'];
            $datosPieza['idpadre'] = $pieza['idpadre'];
            $datosPieza['fechaadquisicion'] = $pieza['fechaadquisicion'];
            $datosPieza['datos'] = json_encode($pieza['datos']);
            $datosPieza['idordentrabajo'] = $pieza['idordentrabajo'];

            $piezaObj->synchronizeWithArray($datosPieza);
            $piezasArray[] = $piezaObj;
        }

        $piezasArray->save();
        return true;
    }

    /**
     * Método para actualizar el cierre de las piezas
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las piezas
     *
     * @return array
     */
    public function cargarPiezasConfiguradas($params)
    {
        $maestro = new MaestroProductoModel();
        $dql = $maestro->cargarGridNomenclador($params, true);
        $dql->innerJoin('ind.DatControlMedios ctrl');
        $result = $dql->fetchArray();
        $data = array();
        $consumidos = $this->recursosConsumidos($params['idregnumerico']);
        foreach ($result as $index => $row) {
            $data[$index]['idindicador'] = $row['idindicador'];
            $data[$index]['denominacion'] = $row['denominacion'];
            $data[$index]['codigo'] = $row['codigo'];
            $data[$index]['idpadre'] = $row['idpadre'];
            $data[$index]['consumidos'] = $consumidos['consumidos'];
            $data[$index]['marca'] = $row['marca'];
            $data[$index]['modelo'] = $row['modelo'];
        }
        return $data;
    }

    public function recursosConsumidos($idreg)
    {
        $query = new Doctrine_Query();
        $query->select('rna.cantidadrecursoconsumido as consumidos')
            ->from("DatRegnumericoActivo rna")
            ->where('rna.idregnumerico = ?', array($idreg));
        $result = $query->fetchArray();
        return $result[0];
    }

    /**
     * @param $idIndicador
     *  Verifica si el indicador esta configurado con algun atributo para recuperarse.
     * @return array
     */
    public function estaConfigurado($idIndicador)
    {
        $query = new Doctrine_Query();
        $query->select('cm.idatributocontrol')
            ->from("DatControlMedios cm")
            ->where('cm.idindicador = ?', array($idIndicador))->limit(1);
        return $query->fetchArray();
    }

}
