<?php

/**
 * @class     SolicitudModel
 * Clase que se encarga de manejar las acciones
 * para la recepción de las solicitudes.
 * @namespace Logistica\Talleres\Recepcion\Models
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   1.0
 */
class SolicitudModel extends DocumentoLogisticaModel
{
    private $_serviciosRecursosHumanos, $_utilesServices, $_serviciosPlanificacion, $_docAFTServices;

    public function __construct($arrayData, $aperturaAFT)
    {
        $arrayData['subsistema'] = LogisticaGlobal::SUBSISTEMA_TALLERES;
        parent::__construct($arrayData);
        $this->idestructuracomun = $this->global->Estructura->idestructura;
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatPlansolicitud',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idplansolicitud')
        );
        $this->logisticaDoctrine->tryInyectRelactions(
            new DatDocumento(), $relations
        );
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        if ($aperturaAFT) {
            $this->_utilesServices = new RegNumActivoService();
            $this->_docAFTServices = new DocumentoActivoService();
        }
    }

    public function getUtilesServices()
    {
        return $this->_utilesServices;
    }

    public function getDocAFTServices()
    {
        return $this->_docAFTServices;
    }

    /**
     * Método para devolver todas las solicitudes de servicio
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las solicitudes
     *
     * @return array
     */

    public function devolverSolicitudes($parametros)
    {
        $selectSol = 'sol.idplansolicitud as idplansolicitud, sol.garantia as garantia,
                       sol.fallostecnicos as fallostecnicos,sol.idproducto as idproducto,
                       sol.falloscliente as falloscliente,sol.idtecnico as idtecnico,
                       sol.fecha as fecha, sol.tipo as tipo, sol.idindicador as idindicador,
                        sol.idagencia as idagencia, sol.prioridad as prioridad,
                        sol.idestructura  as idestructura, sol.atributoidentificador  as atributoidentificador,
                        sol.idpadre  as idpadre';
        $parametros['idestructura'] = $this->idestructuracomun;
        $query = parent::devolverDocumentos($parametros);
        $query->innerJoin('d.DatPlansolicitud sol')->addSelect($selectSol)->innerJoin('sol.NomIndicador ind')
            ->innerJoin('ind.NomIndicadorhoja indh')->orderBy('sol.prioridad');
        $maestro = new MaestroProductoModel();
        $maestro->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        if ($parametros['criterio']) {
            if (is_numeric($parametros['criterio'])) {
                $query->addWhere(
                    "d.nrodoc = ? ", array($parametros['criterio'])
                );
            } else {
                return array("datos" => array(), "cantidad" => 0);
            }
        }
        if ($parametros['idregnomericos']) {
            $query->addWhere(
                "sol.idproducto is not null"
            );
        }
        $this->addFiltros($query, $parametros);
        $this->logisticaDoctrine->addQueryLimits($query, $parametros);
        $result = $query->fetchArray();
        $data = array();
        $i = 0;
        foreach ($result as $row) {
            if ($row['idestructura']) {
                $denominacion = $this->estructuraHelper->getEstructura($row['idestructura']);
                $row['entidad'] = $denominacion[0]->denominacion;
            }
            $data[$i] = $row;
            $i++;
        }
        return array("datos" => $data, "cantidad" => $query->count());
    }

    /**
     * Devuelve  las solicitudes y filtra por idcliente, producto, fechasolicitud
     *
     * @param $params
     *
     * @return array
     */
    public function addFiltros($query, $parametros)
    {
        if ($parametros['idagencia']) {
            $query->addWhere(
                "sol.idagencia = ?", array($parametros['idagencia'])
            );
        }
        if ($parametros['estructura']) {
            $query->addWhere(
                "sol.idestructura = ?", array($parametros['estructura'])
            );
        }
        if ($parametros['producto']) {
            $query->addWhere(
                "sol.idproducto = ?", array($parametros['producto'])
            );
        }
        if ($parametros['idindicador']) {
            $query->addWhere(
                "sol.idindicador = ?", array($parametros['idindicador'])
            );
        }
        if ($parametros['fechasolicitud']) {
            $query->addWhere(
                "sol.fecha = ?", array($parametros['fechasolicitud'])
            );
        }
        if ($parametros['atributoidentificador']) {
            $query->addWhere("sol.atributoidentificador ilike '%" . $parametros['atributoidentificador'] . "%'");
        };
        return $query;
    }

    /**
     * Método para adicionar una nueva solicitud de servicio
     *
     * @param Array $params Arreglo con los parametros para filtrar las solicitudes
     *
     * @return String
     */

    public function adicionarSolicitud($params)
    {
        $datosDoc = Zend_Json::decode($params);
        $datosDoc['garantia'] = ($datosDoc['garantia'] == "") ? 0 : 1;
        $datosDoc['atributoidentificador'] =
            ($datosDoc['atributoidentificador'] == "") ? null : $datosDoc['atributoidentificador'];
        $documento = parent:: adicionarDocumento($datosDoc);
        $documento->save();
        $solicitud = new DatPlansolicitud();
        $datosSol = array();
        if (!$datosDoc['servicios']) {
            parent::adicionarClientes(
                $documento->iddocumento, array(array('idcliente' => $datosDoc['idcliente'], 'tipocliente' => 1))
            );
            if (!$datosDoc['iddocumento']) {
                $datosSol['idplansolicitud'] = $documento->iddocumento;
                $datosSol['garantia'] = $datosDoc['garantia'];
                $datosSol['idproducto'] = $datosDoc['idproducto'];
                $datosSol['fallostecnicos'] = $datosDoc['fallostecnicos'];
                $datosSol['falloscliente'] = $datosDoc['falloscliente'];
                $datosSol['idtecnico'] = $datosDoc['idtecnico'];
                $datosSol['idindicador'] = $datosDoc['idindicador'];
                $datosSol['idpadre'] = $datosDoc['idpadre'];
                $datosSol['atributoidentificador'] = $datosDoc['atributoidentificador'];
                $datosSol['tipo'] = '1';
                $datosSol['fecha'] = Date('d/m/Y');
                $datosSol['prioridad'] = $this->devolverPrioridad();
                $solicitud->synchronizeWithArray($datosSol);
                if ($datosDoc['origenmedio'] == "tallaft") {
                    $docEnvTall =
                        $this->_docAFTServices->crearDocumentoEnvRepAutomatico(null, array(), $datosDoc['idproducto']);
                    $docEnvTall = $docEnvTall->toArray();
                }
            } else {
                $solicitud->assignIdentifier($datosDoc['iddocumento']);
                if (is_array($datosDoc)) {
                    LogisticaObjectHelper::__init()->unsetNullValues($datosDoc);
                    $solicitud->synchronizeWithArray($datosDoc);
                }
            }
            $solicitud->save();
        } else {
            $this->adicionarSolicitudTerceros($datosDoc, $documento, $solicitud);
        }
        return $documento->iddocumento;
    }

    /**
     * Método para adicionar las solicitudes a terceros
     *
     * @param Array $datosDoc array con atributos
     *                        Documento objeto de documento
     *                        DatPlansolicitud objeto de solicitud
     */

    public function adicionarSolicitudTerceros($datosDoc, $documento, $solicitud)
    {
        if ($datosDoc['servicios']['serviciosadicionados']) {
            $adicionar = $datosDoc['servicios']['serviciosadicionados'];
            if (!$datosDoc['iddocumento']) {
                $datosDoc['atributoidentificador'] =
                    ($datosDoc['atributoidentificador'] == "") ? null : $datosDoc['atributoidentificador'];
                $datosSol['idplansolicitud'] = $documento->iddocumento;
                $datosSol['idagencia'] = $datosDoc['idagencia'];
                $datosSol['idestructura'] = $datosDoc['idestructura'];
                $datosSol['idproducto'] = $datosDoc['idproducto'];
                $datosSol['idindicador'] = $datosDoc['idindicador'];
                $datosSol['idpadre'] = $datosDoc['idpadre'];
                $datosSol['atributoidentificador'] = $datosDoc['atributoidentificador'];
                $datosSol['tipo'] = '2';
                $datosSol['fecha'] = $datosDoc['fecha'];
                $datosSol['prioridad'] = $this->devolverPrioridad();
                $solicitud->synchronizeWithArray($datosSol);
                if ($datosDoc['origenmedio'] == "tallaft") {
                    $docEnvTall =
                        $this->_docAFTServices->crearDocumentoEnvRepAutomatico(null, array(), $datosDoc['idproducto']);
                    $docEnvTall = $docEnvTall->toArray();
                }
            } else {
                $solicitud->assignIdentifier($datosDoc['iddocumento']);
                if (is_array($datosDoc)) {
                    $this->actualizarTerceros(
                        ($datosDoc['idestructura']) ? true : false, $datosDoc, $solicitud
                    );
                    $solicitud->synchronizeWithArray($datosDoc);
                }
            }
            $solicitud->save();
            $this->adicionarServicios(
                $adicionar, $solicitud->idplansolicitud, $datosDoc['servicios']['tiposervicio']
            );
        }
        $this->auxAdicionarSolicitudTerceros($datosDoc, $solicitud);
    }

    private function auxAdicionarSolicitudTerceros($datosDoc, $solicitud)
    {
        if ($datosDoc['servicios']['servicioseliminados']) {
            $eliminar = $datosDoc['servicios']['servicioseliminados'];
            $this->eliminarServicios($eliminar);
        } else {
            $solicitud->assignIdentifier($datosDoc['iddocumento']);
            if (is_array($datosDoc)) {
                $this->actualizarTerceros(
                    ($datosDoc['idestructura']) ? true : false, $datosDoc, $solicitud
                );
                $solicitud->synchronizeWithArray($datosDoc);
            }
            $solicitud->save();
        }
    }

    /**
     * Método para actualizar las solicitudes a terceros
     *
     * @param Array $params array con parametros para filtrar
     */

    public function actualizarTerceros($isEstructura, $array, $obj)
    {
        if ($isEstructura) {
            $array['idagencia'] = null;
            $obj->synchronizeWithArray($array);
            $obj->save();
        } else {
            $array['idestructura'] = null;
            $obj->synchronizeWithArray($array);
            $obj->save();
        }

    }

    /**
     * Método para adicionar los servicios de las solicitudes a terceros
     *
     * @param Array $adicionar array con servicios
     *                         $idsolicitud id de la solicitud asociada
     */

    public function adicionarServicios($adicionar, $idsolicitud, $tipo)
    {
        foreach ($adicionar as $dat) {
            $servicio = new DatServiciosolicitud();
            $datosSer['idplansolicitud'] = $idsolicitud;
            if ($tipo == 1) {
                $datosSer['idindicador'] = $dat['id'];
                $datosSer['idactividad'] = null;
            } else {
                $datosSer['idactividad'] = $dat['id'];
                $datosSer['idindicador'] = null;
            }
            $datosSer['denominacion'] = $dat['denominacion'];
            $servicio->synchronizeWithArray($datosSer);
            $servicio->save();
        }
    }

    /**
     * Método para devolver los productos de una solicitud de servicio
     *
     * @param String $iddoc identificador de la solicitud
     *
     * @return String
     */

    public function devolverProductos($idsolicitud)
    {
        $query = new Doctrine_Query();
        $query->select('sol.productos as productos')->from('DatPlansolicitud sol')->where(
            "sol.idplansolicitud = {$idsolicitud}"
        );
        $result = $query->fetchArray();
        return $result[0]['productos'];
    }

    /**
     * Método para devolver la prioridad de una solicitud de servicio
     *
     * @param String $iddoc identificador de la solicitud
     *
     * @return Integer
     */
    public function devolverPrioridad()
    {
        $query = new Doctrine_Query();
        $query->select('sol.prioridad as prioridad')->from('DatPlansolicitud sol');
        $result = $query->fetchArray();
        $array = array();
        if ($result) {
            foreach ($result as $row) {
                array_push($array, $row['prioridad']);
            }
            asort($array);
            return array_pop($array) + 1;
        } else {
            return 0;
        }
    }

    /**
     * Método para eliminar una solicitud de servicio
     *
     * @param String $iddoc identificador del documento
     *
     * @return boolean
     */

    public function eliminarSolicitud($iddoc)
    {
        foreach ($iddoc as $row) {
            parent::eliminarDocumento($row);
            Doctrine_Query::create()->delete('DatPlansolicitud')->where('idplansolicitud = ?', array($iddoc[0]))
                ->execute();
        }
        return true;
    }

    /**
     * Método para confirmar una solicitud de servicio
     *
     * @param String $iddoc identificador del documento
     *
     * @return boolean
     */

    public function confirmarSolicitud($iddoc)
    {

        parent::confirmarDocumento($iddoc);

        return true;

    }

    /**
     * Método para anular el estado de una solicitud de servicio
     *
     * @param String $iddoc identificador del documento
     */

    public function anularEstadoSolicitud($iddoc)
    {
        return parent::anularEstadoDocumento($iddoc);
    }

    /**
     * Método para aprobar una solicitud de servicio
     *
     * @param String $iddoc identificador del documento
     */

    public function aprobarSolicitud($iddoc)
    {
        return parent::aprobarDocumento($iddoc, true);
    }

    /**
     * Método para devolver las solicitudes de servicio aprobadas
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las solicitudes
     *
     * @return Array
     */

    public function devolverSolicitudesAprobadas($parametros)
    {
        $query = new Doctrine_Query();
        $devolver = 'sol.idplansolicitud as idplansolicitud, sol.garantia as garantia,
                        sol.fallostecnicos as fallostecnicos,
                        sol.idproducto as idproducto, sol.falloscliente as falloscliente,
                        sol.idtecnico as idtecnico, sol.fecha as fecha, sol.tipo as tipo,
                        d.iddocumento, d.nrodoc, d.estado, sol.idindicador as idindicador,
                        sol.atributoidentificador  as atributoidentificador';
        $parametros['idestructura'] = $this->idestructuracomun;
        $query = parent::devolverDocumentos($parametros);
        $query->innerJoin('d.DatPlansolicitud sol')->addSelect($devolver)->innerJoin('sol.NomIndicador ind')->innerJoin(
            'ind.NomIndicadorhoja indh'
        )->whereIn('d.estado', 3)->andWhereIn('sol.tipo', 1);
        $maestro = new MaestroProductoModel();
        $maestro->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        if ($parametros['criterio']) {
            $query->addWhere("d.nrodoc = ? ", array($parametros['criterio']));
        };
        if ($parametros['excluir']) {
            $query->andWhereNotIn('sol.idplansolicitud ', $parametros['excluir']);
        }
        $result = $query->fetchArray();
        $data = array();
        $i = 0;
        foreach ($result as $row) {
            if (!$row['idproducto']) {
                $row['idproducto'] = $row['medios'];
            }
            $data[$i] = $row;
            $i++;
        }
        return array("datos" => $data, "cantidad" => count($data));
    }

    /**
     * Método para devolver las solicitudes de servicio a terceros aprobadas
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las solicitudes
     *
     * @return Array
     */
    public function devolverSolicitudesTercerosAprobadas($parametros)
    {
        $query = new Doctrine_Query();
        $devolver = 'sol.idplansolicitud as idplansolicitud, sol.garantia as garantia,
               sol.fallostecnicos as fallostecnicos,sol.idproducto as idproducto,
               sol.falloscliente as falloscliente,sol.idtecnico as idtecnico,
               sol.fecha as fecha, sol.tipo as tipo, sol.idindicador as idindicador,
               sol.idagencia as idagencia, sol.prioridad as prioridad,
               sol.idestructura  as idestructura,
               sol.atributoidentificador  as atributoidentificador';
        $parametros['idestructura'] = $this->idestructuracomun;
        $query = parent::devolverDocumentos($parametros);
        $query->innerJoin('d.DatPlansolicitud sol')->addSelect($devolver)->innerJoin('sol.NomIndicador ind')->innerJoin(
            'ind.NomIndicadorhoja indh'
        )->whereIn('d.estado', 3)->andWhereIn('sol.tipo', 2);
        $maestro = new MaestroProductoModel();
        $maestro->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        if ($parametros['criterio']) {
            $query->addWhere("d.nrodoc = ? ", array($parametros['criterio']));
        };
        if ($parametros['idestructurainterna']) {
            $query->addWhere("sol.idestructura = ? ", array($parametros['idestructurainterna']));
        };
        if ($parametros['idagencia']) {
            $query->addWhere("sol.idagencia = ? ", array($parametros['idagencia']));
        };
        if ($parametros['excluir']) {
            $query->andWhereNotIn('sol.idplansolicitud ', $parametros['excluir']);
        }
        $result = $query->fetchArray();
        $data = $this->auxDevolverSolicitudesTercerosAprobadas($result);
        return array("datos" => $data, "cantidad" => count($data));
    }

    private function auxDevolverSolicitudesTercerosAprobadas($result)
    {
        foreach ($result as $index => $row) {
            $datos['iddocumento'] = $row['idplansolicitud'];
            $params = array('idplansolicitud' => $datos['iddocumento']);
            $servSolicitud = $this->devolverServicios($params);
            $result[$index]['servicios'] = $servSolicitud;
        }
        $data = array();
        $i = 0;
        foreach ($result as $row) {
            if ($row['idestructura']) {
                $denominacion = $this->estructuraHelper->getEstructura($row['idestructura']);
                $row['entidad'] = $denominacion[0]->denominacion;
            }
            $data[$i] = $row;
            $i++;
        }
        return $data;
    }

    /**
     * Método para devolver los técnicos del taller
     *
     * @param
     *
     * @return Array
     */

    public function devolverTecnicos()
    {
        $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
            array(), '', 30, 0, array(), array(), $this->idestructuracomun
        );
        return $personas->data;
    }

    /**
     * Métodos para devolver los servicios correspondientes a una solicitus
     *
     * @param Array $id identificador para filtrar los servicios de una solicitud
     *
     * @return Array
     */

    public function devolverServicios($params)
    {

        $query = new Doctrine_Query();
        $devolver = 'ser.idservicio as idservicio, ser.idindicador as idindicador,
               ser.idactividad as idactividad, ser.denominacion as denominacion,
               ser.idplansolicitud as idplansolicitud';
        $query->select($devolver)->from('DatServiciosolicitud ser');
        if ($params['idplansolicitud']) {
            $query->addWhere(
                "ser.idplansolicitud = ? ", array($params['idplansolicitud'])
            );
        };
        if ($params['idservicio']) {
            $query->addWhere(
                "ser.idservicio = ? ", array($params['idservicio'])
            );
        };
        if ($params['criterio']) {
            $query->addWhere("ser.denominacion ilike '%" . $params['criterio'] . "%'");
        };
        $result = $query->fetchArray();
        return array('cantidad' => $query->count(), 'datos' => $result);
    }

    /**
     * Métodos para devolver las denominaciones de los servicios correspondientes a una solicitus
     *
     * @param Array $params Arreglo con los parametros para filtrar los servicios
     *
     * @return Array
     */

    public function denominacionServicios($params)
    {
        $query = new Doctrine_Query();
        $query->select('nom.idindicador, nom.denominacion')->from('NomIndicador nom');
        $result = $query->fetchArray();
        $servicios = array();
        $i = 0;
        foreach ($params as $row) {
            foreach ($result as $indicador) {
                if ($row['idindicador'] == $indicador['idindicador']) {
                    $servicios[$i]['idindicador'] = $row['idindicador'];
                    $servicios[$i]['idservicio'] = $row['idservicio'];
                    $servicios[$i]['idplansolicitud'] = $row['idplansolicitud'];
                    $servicios[$i]['denominacion'] = $indicador['denominacion'];
                    $i++;
                }
            }
        }
        return $servicios;
    }


    /**
     * Método para mostrar los servicios que se pueden adicionar una solicitus
     *
     * @param Array $parametros Arreglo con los parametros para filtrar los servicios
     *
     * @return Array
     */

    public function serviosExistenetes($parametros)
    {
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        $denominacion = ($parametros['criterio']) ? $parametros['criterio'] : null;
        $filtro = ($denominacion) ? array('denominacion' => $denominacion) : array();
        return $this->_serviciosPlanificacion->obtenerActividadyNorma(
            1, null, $filtro, $start, $limit, null
        );
    }

    /**
     * Método para eliminar los servicios correspondientes a una solicitus
     *
     * @param Array $params Arreglo con los identificadores de los servicios
     *
     * @return Array
     */

    public function eliminarServicios($params)
    {
        $query = new Doctrine_Query();
        $query->delete()->from('DatServiciosolicitud ser')->whereIn('ser.idservicio', $params)->execute();
        return true;
    }

    /**
     * Método para actualizar las prioridaddes de las solicitudes
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las solicitudes
     *
     * @return Array
     */

    public function actualizarPrioridades($parametros)
    {
        $solicitud = new DatPlansolicitud();
        foreach ($parametros as $row) {
            $solicitud->assignIdentifier($row['idsolicitud']);
            $solicitud->synchronizeWithArray($row);
            $solicitud->save();
        }
        return true;
    }

    /**
     * @method devuelve las actividades del nivel especificado o la actividad especificada con sus  hijos
     * @param $parametros
     *
     * @return array
     */

    public function cargarActividadesExistentes($parametros)
    {
        $denominacion = ($parametros['criterio']) ? $parametros['criterio'] : null;
        $filtro[0] = ($denominacion) ? array('valor' => $denominacion) : array();
        $hijos = ($parametros['hijos']) ? $parametros['hijos'] : 0;

        $result = $this->_serviciosPlanificacion->obtenerActividadyNorma(
            $parametros['nivel'], ($parametros['idservicio']) ? $parametros['idservicio'] : null, $filtro,
            ($parametros['start']) ? $parametros['start'] : 0, ($parametros['limit']) ? $parametros['limit'] : 30,
            $hijos
        );
        return $result;
    }

    public function cargarEstructuras($parametros)
    {
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        if ($parametros['tipo'] == 1) {
            $parametros['criterio'] = ($parametros['criterio']) ? $parametros['criterio'] : false;
            $arrayCompleto = $this->estructuraHelper->getEntidadesByDominio(
                $this->global->perfil->iddominio, false, $parametros['criterio']
            );
            $proveedores['cantidad'] = count($arrayCompleto);
            $proveedores['datos'] = array_slice(
                $arrayCompleto, $start, $limit
            );
        } else {
            if ($parametros['criterio']) {
                $filtro['filtronomb'] = $parametros['criterio'];
            }
            $proveedores = $this->configuracionHelper->getClientesProveedorByParams(
                null, $this->global->Estructura->idestructura, true, false, true, $filtro, $start, $limit
            );
        }
        return $proveedores;
    }

    public function devolverEnviadosAReparar($parametros)
    {
        if ($this->_utilesServices) {
            $params['idregnomericos'] = true;
            $result = $this->devolverSolicitudes($params)['datos'];
            if (count($result) > 0) {
                $ids = array();
                foreach ($result as $row) {
                    array_push($ids, $row['idproducto']);
                }
                $parametros['arrayidregNum'] = $ids;
                unset($parametros['tipo']);
                return $this->_utilesServices->getMediosDisponibles($parametros);
            } else {
                return array("datos" => array(), "cantidad" => 0);
            }
        } else {
            return array("datos" => array(), "cantidad" => 0);
        }
    }

}
