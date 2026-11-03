<?php

/**
 * @version 1.0
 */
class ConfiguracionControlMediosModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->limitOld = 0;
        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     * Método para devolver los atributos de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar los atributos
     *
     * @return array
     */
    public function devolverAtributosIndicador($parametros)
    {
        $arreglo['idtabla'] = $parametros['idtabla'];
        $arreglo['idindicador'] = $parametros['idindicador'];
        $dinamicos = $this->serviciosConfiguracion->getAtributosAgrupacionIndicador($arreglo);
        return $dinamicos;
    }

    /**
     * Método para guardar los atributos de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para almacenar los atributos
     *
     * @return array
     */
    public function guardarAtributos($parametros)
    {
        foreach ($parametros['atributosDinamicos'] as $row) {
            if (!$this->existsAtributoIndicador($parametros['idindicador'], $row['idcampo'])) {
                $datosAtbIndicador = array();
                $atributosIndicador = new DatControlMedios();
                $datosAtbIndicador['idcampo'] = $row['idcampo'];
                $datosAtbIndicador['idtabla'] = $parametros['idtabla'];
                $datosAtbIndicador['idindicador'] = $parametros['idindicador'];
                $datosAtbIndicador['nombretabla'] = $row['name'];
                $datosAtbIndicador['denominacion'] = $row['denominacion'];
                $atributosIndicador->synchronizeWithArray($datosAtbIndicador);
                $atributosIndicador->save();
            } else {
                return false;
            }
        }
        if ($parametros['eliminarDinamicos']) {
            foreach ($parametros['eliminarDinamicos'] as $index => $row) {
                $param[$index]['idindicador'] = $parametros['idindicador'];
                $param[$index]['idcampo'] = $row;
                $this->eliminarAtributos($param);
            }
        }
        return true;
    }

    /**
     * Método para eliminar los atributos de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar los atributos
     *
     * @return array
     */
    public function eliminarAtributos($parametros)
    {

        foreach ($parametros as $row) {
            $query = new Doctrine_Query();
            $query->delete()
                ->from('DatControlMedios ind')
                ->whereIn('ind.idindicador', $row['idindicador'])
                ->andWhereIn(
                    'ind.idcampo', $row['idcampo']
                )
                ->execute();
        }

        return true;
    }

    /**
     * Método para cargar los atributos de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar los atributos
     *
     * @return array
     */
    public function cargarAtributos($params)
    {
        $resultados = array();
        $query = new Doctrine_Query();
        $query->select('*')
            ->from('DatControlMedios ind')
            ->whereIn('ind.idindicador', $params['idindicador']);
        if ($params['criterio']) {
            $query->addWhere("ind.denominacion ilike '%" . $params['criterio'] . "%'");
        };
        $result = $query->fetchArray();
        if ($result) {
            $idcampos = array();
            $names = array();
            $denominacion = array();
            foreach ($result as $index => $row) {
                $idcampos[] = $row['idcampo'];
                $names[] = $row['nombretabla'];
                $denominacion[] = $row['denominacion'];
            }
        }
        $datos = $this->datosAtributos($idcampos, $params);
        foreach ($datos as $index => $row) {
            $resultados[$index]['idcampo'] = $row['idcampo'];
            $resultados[$index]['longitud'] = $row['longitud'];
            $resultados[$index]['idindicador'] = $params['idindicador'];
            $resultados[$index]['name'] = $names[$index];
            $resultados[$index]['denominacion'] = $denominacion[$index];
            $resultados[$index]['tipocomponente'] = $this->devolverTipoComponente($row['idtipocomponente']);
            $resultados[$index]['idtipocomponente'] = $row['idtipocomponente'];
        }
        return $this->addResultLimits($resultados, $params);
    }

    /**
     * Método para devolver el tipo de componente de un atributo dinamico de un indicador
     *
     * @param $idtipocomponente id del tipo de componete
     *
     * @return string
     */
    public function devolverTipoComponente($idtipocomponente)
    {
        if (!$idtipocomponente) {
            $idtipocomponente = -1;
        }
        $q = Doctrine_Query:: create();
        $q->from('NomTipoComponente  tcp')
            ->select('tcp.tipocomponente as tipocomponente')
            ->whereIn('tcp.idtipocomponente', $idtipocomponente)
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)
            ->execute();
        $result = $q->fetchArray();
        return array_pop($result)['tipocomponente'];
    }

    public function datosAtributos($atributos, $params)
    {
        $query = new Doctrine_Query();
        foreach ($atributos as $row) {
            $query->select(
                'f.idcampo as idcampo, f.longitud as longitud,
                cp.idtipocomponente as idtipocomponente'
            )
                ->from('DatCampo f')
                ->innerJoin('f.DatComponente cp')
                ->where("f.idcampo = {$row}");
            $data = $query->fetchArray();
            $result[] = $data[0];
        }
        return $result;
    }

    /**
     * Método para verificar la existencia de un atributo dinamico configurado para un indicador
     *
     * @param $idindicador id del indicador
     *                     $campo idcampo del atributo
     *
     * @return boolean
     */
    public function existsAtributoIndicador($idindicador, $campo)
    {
        $query = new Doctrine_Query();
        $query->select('*')
            ->from('DatControlMedios ind')
            ->whereIn('ind.idindicador', $idindicador);
        if ($campo) {
            $query->addWhere('ind.idcampo = ?', array($campo));
        }
        $result = $query->fetchArray();
        if ($result) {
            return true;
        }
        return false;
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

}
