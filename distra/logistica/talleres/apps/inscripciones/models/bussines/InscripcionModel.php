<?php

/**
 * @class     InscripcionModel
 * Clase que se encarga de manejar las acciones
 * para la inscripción de medios.
 * @namespace Logistica\Talleres\Recepcion\Models
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   1.0
 */
class InscripcionModel extends DocumentoLogisticaModel
{
    private $_serviciosRecursosHumanos, $_ordenTrabajoService;

    public function __construct($arrayData)
    {
        $arrayData['subsistema'] = LogisticaGlobal::SUBSISTEMA_TALLERES;
        parent::__construct($arrayData);
        $this->idestructuracomun = $this->global->Estructura->idestructura;
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatInscripcion',
            'properties'   => array('local' => 'iddocumento', 'foreign' => 'idinscripcion')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();

    }

    /**
     * Método para devolver todas las inscripciones
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las inscripciones
     *
     * @return array
     */

    public function devolverInscripciones($parametros = array(), $dqlResult = false)
    {
        $select = 'ins.idinscripcion as idinscripcion, ins.idmedio as idmedio, ins.tipo as tipo,
            ins.fechainicio as fechainicio, ins.datosmedio as datosmedio, ins.fechafin as fechafin,
            ins.atributoidentificador as atributoidentificador';
        $parametros['idestructura'] = $this->idestructuracomun;
        $query = parent::devolverDocumentos($parametros);
        $query->innerJoin('d.DatInscripcion ins')->addSelect($select)->innerJoin('ins.NomIndicador ind')->innerJoin(
            'ind.NomIndicadorhoja indh'
        )->orderBy('d.nrodoc');
        $maestro = new MaestroProductoModel();
        $maestro->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        $this->addFiltros($query, $parametros);
        $this->logisticaDoctrine->addQueryLimits($query, $parametros);
        $result = $query->fetchArray();
        foreach ($result as $index => $row) {
            $datos['iddocumentoorigen'] = $row['idinscripcion'];
            $orden = $this->datosOrden($datos);
            if ($orden['estado']) {
                $result[$index]['ordenabierta'] = 1;
            } else {
                $result[$index]['ordenabierta'] = 0;
            }
        }
        if ($dqlResult) {
            return $query;
        } else {
            return array("datos" => $result, "cantidad" => $query->count());
        }
    }

    /**
     * Devuelve  las inscripciones y filtra por idcliente, idproducto, fechainicio y estado
     *
     * @param      $params
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */

    public function addFiltros($query, $parametros = array())
    {
        if ($parametros['criterio']) {
            $query->where("ins.atributoidentificador ilike '%" . $parametros['criterio'] . "%'");
        }
        if ($parametros['idindicador']) {
            $query->addWhere("ins.idmedio = ?", array($parametros['idindicador']));
        }
        if ($parametros['fecha']) {
            $query->addWhere("ins.fechainicio = ?", array($parametros['fecha']));
        }
        if ($parametros['estado']) {
            $query->addWhere("d.estado = ? ", array($parametros['estado']));
        }
        if ($parametros['iddocumento']) {
            $query->addWhere("ins.idinscripcion = ? ", array($parametros['iddocumento']));
        }
        if ($parametros['excluir']) {
            $query->andWhereNotIn("ins.idinscripcion", $parametros['excluir']);
        }
        return $query;
    }

    /**
     * Método para eliminar una inscripción
     *
     * @param String $datos identificador del documento
     *
     * @return boolean
     */

    public function  eliminarInscripcion($datos)
    {
        foreach ($datos as $row) {
            parent::eliminarDocumento($row);
            Doctrine_Query::create()->delete('DatInscripcion')->where('idinscripcion = ?', array($row))->execute();
        }
        return true;
    }

    /**
     * Método para confirmar una inscripción
     *
     * @param String $iddoc identificador del documento
     *
     * @return boolean
     */

    public function confirmarInscripcion($iddoc)
    {
        parent::confirmarDocumento($iddoc);
        return true;
    }

    /**
     * Método para anular el estado de una inscripción
     *
     * @param String $iddoc identificador del documento
     */

    public function anularEstadoInscripcion($iddoc)
    {
        Doctrine_Query::create()->update('DatDocumento d')->set('d.estado', 1)->where(
            "d.iddocumento = ?", array($iddoc)
        )->execute();
        return true;
    }

    /**
     * Método para aprobar una inscripción
     *
     * @param String $iddoc identificador del documento
     */

    public function aprobarInscripcion($iddoc)
    {
        parent::confirmarDocumento($iddoc);
        return parent::aprobarDocumento($iddoc, true);
    }

    /**
     * Método para obtener los datos de la persona
     *
     * @param Array $datos Arreglo con los parametros para filtrar la persona
     */

    public function inscripcionesParaOrden($datos)
    {
        $param = $datos;
        $param['estado'] = array(1, 2);
        $dqlAux = $this->_ordenTrabajoService->devolverOrdenesTrabajo($param, true);
        $dqlAux->andWhere('ord.documentoorigen = 2');
        foreach ($dqlAux->fetchArray() as $index => $ids) {
            $parametros['excluir'][$index] = $ids['iddocumentoorigen'];
        }
        $parametros['excluir'] = (count($parametros['excluir']) > 0) ? $parametros['excluir'] : array();
        $parametros['estado'] = 3;
        $result = $this->devolverInscripciones($parametros);
        return $result;
    }

    /**
     * Método para adicionar una nueva inscripción
     *
     * @param Array $params Arreglo con los parametros para filtrar las inscripciones
     *
     * @return String
     */

    public function adicionarInscripcion($params)
    {
        $documento = parent:: adicionarDocumento($params);
        $documento->save();
        $inscripcion = new DatInscripcion();
        $datosIns = array();
        if (!$params['iddocumento']) {
            if (!$this->comprobarExistencia($params)) {
                parent::adicionarClientes(
                    $documento->iddocumento, array(array('idcliente' => $params['idcliente'], 'tipocliente' => 1))
                );
                $datosIns['idinscripcion'] = $documento->iddocumento;
                $datosIns['tipo'] = $params['tipo'];
                $datosIns['idmedio'] = $params['idmedio'];
                $datosIns['datosmedio'] = json_encode($params['datosmedios']);
                $datosIns['fechainicio'] = Date('d/m/Y');
                $datosIns['atributoidentificador'] = $this->addAtributoIdentificador($params);
                if ($params['tipo'] == 2) {
                    $datosIns['fechafin'] = $params['fechafin'];
                }
                $inscripcion->synchronizeWithArray($datosIns);
            } else {
                return null;
            }
        } else {
            $inscripcion->assignIdentifier($params['iddocumento']);
            $params['atributoidentificador'] = $this->addAtributoIdentificador($params);
            if (is_array($params)) {
                $params['datosmedio'] = json_encode($params['datosmedios']);
                $inscripcion->synchronizeWithArray($params);
            }
        }
        $inscripcion->save();
        $param['iddocumento'] = $documento->iddocumento;
        return $this->devolverInscripciones($param);
    }

    /**
     * Método para añadir el atributo identificador al medio
     *
     * @param Array $params Arreglo con los parametros para adicionar
     *
     * @return String
     */

    public function addAtributoIdentificador($params)
    {
        $datosIns = array();
        foreach ($params['datosmedios'] as $row) {
            if ($row['identificador'] == 1) {
                $datosIns['atributoidentificador'] = $row[$row['name']];
                break;
            }
        }
        return $datosIns['atributoidentificador'];
    }

    /**
     * Método para comprobar la existencia de una inscripción
     *
     * @param Array $params Arreglo con los parametros para filtrar las inscripciones
     *
     * @return String
     */

    public function comprobarExistencia($params)
    {
        $identificador = '';
        foreach ($params['datosmedios'] as $row) {
            if ($row['identificador'] == 1) {
                $identificador = $row[$row['name']];
                break;
            }
        }
        $select = 'ins.idinscripcion as idinscripcion, ins.idmedio as idmedio, ins.tipo as tipo,
        ins.fechainicio as fechainicio, ins.datosmedio as datosmedio, ins.fechafin as fechafin,
        ins.atributoidentificador as atributoidentificador';
        $query = parent::devolverDocumentos($params);
        $query->innerJoin('d.DatInscripcion ins')->addSelect($select)->andWhereIn("ins.idmedio", $params['idmedio'])
              ->andWhereIn("ins.atributoidentificador", $identificador);
        $result = $query->fetchArray();
        if ($result) {
            return true;
        }
        return false;
    }

    /**
     * Método para obtener los datos de la orden de trabajo
     *
     * @param Array $datos Arreglo con los parametros para filtrar la orden
     */

    public function datosOrden($datos)
    {
        $datos['estado'] = [1, 2];
        $orden = $this->_ordenTrabajoService->devolverOrdenesTrabajo($datos, false);
        $datosOrden['estado'] = $orden['datos'][0]['estado'];
        $datosOrden['nrodoc'] = $orden['datos'][0]['nrodoc'];
        return $datosOrden;
    }


}