<?php

class PenalizacionTercerosModel extends ZendExt_Model
{
    private $_ordenTrabajoService, $_serviciosPlanificacion, $_logisticaDoctrine;

    public function __construct()
    {
        parent::__construct();
        $this->solicitudService = new SolicitudService();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatPlansolicitud',
            'properties'   => array('local' => 'iddocumentoorigen', 'foreign' => 'idplansolicitud')
        );
        $this->_logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->_logisticaDoctrine->tryInyectRelactions(new DatOrdenTrabajo(), $relations);
        $this->estructuraHelper = ServiciosEstructuraComposicionHelper::__init();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
    }

    public function obtenerOrdenesPenalizacion($params)
    {
        if ($params['idestructuracomun']) {
            $params['idestructura'] = explode(",", $params['idestructuracomun']);
            $arrIdDoc = array();
            foreach ($params['idestructura'] as $idEstructura) {
                $respIds = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
                    'ordenServicioLOG', $idEstructura, LogisticaGlobal::SUBSISTEMA_TALLERES
                );
                if ($respIds->iddoc) {
                    $arrIdDoc[] = $respIds->iddoc;
                }
            }
            $params['filtraiddoc'] = true;
            $params['iddoc'] = $arrIdDoc;
        } else {
            $params['idestructura'] = array($this->global->Estructura->idestructura);
        }
        unset($params['idestructuracomun']);
        $params['orderby'] = "idestructuracomun";
        $params['documentoorigen'] = array();
        $temp = array();
        array_push($params['documentoorigen'], 1);
        array_push($params['documentoorigen'], 3);
        if ($params['idservicio']) {
            $array = array('idservicio' => $params['idservicio']);
            $result = $this->solicitudService->getServiciosTerceros($array)['datos'];
            $params['iddocumentoorigen'] = array();
            if (count($result) > 0) {
                foreach ($result as $row) {
                    if ($row['idactividad']) {
                        $params['idservicio'] = $row['idactividad'];
                        $respOrdenes = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, false);
                        $temp = $respOrdenes['datos'];
                        $tempCount = $respOrdenes['cantidad'];
                    }
                    array_push($params['iddocumentoorigen'], $row['idplansolicitud']);
                }
                unset($params['idservicio']);
                unset($params['idindicador']);
            }
        }
        if ($params['idestructurainterna']) {
            $result = $this->solicitudService->getSolicitudTerceros($params)['datos'];
            $params['iddocumentoorigen'] = array();
            foreach ($result as $row) {
                array_push($params['iddocumentoorigen'], $row['idplansolicitud']);
            }
        }
        if ($params['idagencia']) {
            $result = $this->solicitudService->getSolicitudTerceros($params)['datos'];
            $params['iddocumentoorigen'] = array();
            foreach ($result as $row) {
                array_push($params['iddocumentoorigen'], $row['idplansolicitud']);
            }
        }
        if ($params['tipo'] == 1) {
            $params['documentoorigen'] = 1;
            unset($params['idservicio']);
            unset($params['idindicador']);
            unset($params['idagencia']);
            unset($params['idcliente']);
            unset($params['idestructurainterna']);
        }
        if ($params['tipo'] == 2) {
            $params['documentoorigen'] = 3;
            unset($params['idservicio']);
            unset($params['idindicador']);
            unset($params['idagencia']);
            unset($params['idcliente']);
            unset($params['idestructurainterna']);
        }
        $params['recsolicitudservicio'] = true;
        $respOrdenes = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, false);
        $resultado = $respOrdenes['datos'];
        $resultadoCount = $respOrdenes['cantidad'];
        $resultadoCount = $resultadoCount + $tempCount;
        $data = array_merge($resultado, $temp);
        $this->ordenar($data, 'idestructuracomun');
        $ordIdDocs = array('ordenes' => $data, 'idDocs' => $arrIdDoc);
        $data = $this->estadiaEnTaller($ordIdDocs);
        return array('datos' => $data['datos'], 'cantidad' => $data['cantidad']);
    }

    /**
     * @param     $arrIni
     * @param     $col
     * @param int $order
     *
     * @descripcion Ordena un arreglo de arreglos o de objetos por el parametro especificado
     */
    public function ordenar(&$arrIni, $col, $order = SORT_ASC)
    {
        $arrAux = array();
        foreach ($arrIni as $key => $row) {
            $arrAux[$key] = is_object($row) ? $arrAux[$key] = $row->$col : $row[$col];
            //$arrAux[$key] = strtolower($arrAux[$key]);
        }
        array_multisort($arrAux, $order, $arrIni);
    }

    public function estadiaEnTaller($ordenes)
    {
        $result = array();
        $actual = Date('Y-m-d');
        $i = 0;
        foreach ($ordenes['ordenes'] as $row) {
            $result[$i]['nrodoc'] = ($row['nrodoc']) ? $row['nrodoc'] : $row['numeroref'];
            $result[$i]['idcliente'] = $row['idcliente'];
            $result[$i]['entidad'] = $row['agencia'];
            $result[$i]['documentoorigen'] = $row['documentoorigen'];
            $result[$i]['descripcionmarcamodelo'] = $row['descripcionmarcamodelo'];
            $result[$i]['marca'] = $row['marca'];
            $result[$i]['modelo'] = $row['modelo'];
            $result[$i]['fechainicio'] = $row['fechainicio'];
            $result[$i]['fechafin'] = $row['fechafin'];
            $result[$i]['fechacierre'] = $row['fechacierre'];
            $result[$i]['idestructuracomun'] = $row['idestructuracomun'];
            $result[$i]['atributoidentificador'] = $row['atributoidentificador'];
            $result[$i]['iddocs'] = $ordenes['idDocs'];
            $params = array('idplansolicitud' => $row['iddocumentoorigen']);
            if ($row['documentoorigen'] == 3) {
                $result[$i]['servicios'] =
                    $this->addServicios($this->solicitudService->getServiciosTerceros($params)['datos']);
            } else {
                if ($row['documentoorigen'] == 1) {
                    $datos = $this->_serviciosPlanificacion->obtenerActividadyNorma(
                        2, array($row['idservicio']), null, 0, 30, 0
                    );
                    $result[$i]['servicios'] = $datos['datos'][0]['denominacion'];
                }
            }
            $cierre = str_replace('/', '-', $row['fechacierre']);
            $fechacierre = (new DateTime($cierre))->format('Y-m-d');
            $inicio = str_replace('/', '-', $row['fechainicio']);
            $fechainicio = (new DateTime($inicio))->format('Y-m-d');
            $fin = str_replace('/', '-', $row['fechafin']);
            $fechafin = (new DateTime($fin))->format('Y-m-d');

            if ($fechacierre != null) {
                $diasB = $this->diasTranscurridos($fechainicio, $fechacierre);
                $result[$i]['estadia'] = $diasB;
            } else {
                $diasA = $this->diasTranscurridos($fechainicio, $actual);
                if ($fechafin < $actual) {
                    $diasA = '<span style="color:#bf0200">' . $diasA . '</span>';
                }
                $result[$i]['estadia'] = $diasA;
            }

            $i++;
        }
        return array('cantidad' => count($result), 'datos' => $result);
    }

    public function addServicios($array)
    {
        $servicios = array();
        foreach ($array as $row) {
            array_push($servicios, ' ' . $row['denominacion']);
        }
        return $servicios;
    }

    public function diasTranscurridos($fechaI, $fechaF)
    {
        $dias = (strtotime($fechaI) - strtotime($fechaF)) / 86400;
        $dias = abs($dias);
        $dias = floor($dias);
        return $dias;
    }

    public function obtenerMediosPenalizacion($params)
    {
        $params['documentoorigen'] = array();
        array_push($params['documentoorigen'], 1);
        array_push($params['documentoorigen'], 3);
        $resultado = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, false);
        return $resultado;
    }

    public function obtenerServiciosPenalizacion($params)
    {
        $servicios = array();
        $aTerceros = array();
        $params['documentoorigen'] = array(1, 3);
        $ordenes = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, false)['datos'];
        $index = 0;
        foreach ($ordenes as $row) {
            if ($row['documentoorigen'] == 3) {
                array_push($aTerceros, $row['iddocumentoorigen']);
            } else {
                $datos = $this->_serviciosPlanificacion->obtenerActividadyNorma(
                    2, array($row['idservicio']), null, 0, 30, 0
                );
                $servicios[$index]['denominacion'] = $datos['datos'][0]['denominacion'];
                $servicios[$index]['idservicio'] = $datos['datos'][0]['idactividad'];
                $index++;
            }
        }
        return $this->addServiciosTerceros($servicios, $aTerceros, $index);
    }

    public function addServiciosTerceros($servicios, $aTerceros, $index)
    {
        $datos = $this->solicitudService->getServiciosTerceros($aTerceros)['datos'];
        foreach ($datos as $row) {
            $match = false;
            foreach ($servicios as $i => $serv) {
                if ($row['idactividad'] == $serv['idservicio']) {
                    $servicios[$i]['idservicio'] = $row['idservicio'];
                    $match = true;
                }
            }
            if (!$match) {
                $servicios[$index]['denominacion'] = $row['denominacion'];
                $servicios[$index]['idservicio'] = $row['idservicio'];
                $index++;
            }
        }
        return array("datos" => $servicios, "cantidad" => count($servicios));
    }

    public function obtenerClientesPenalizacion($params)
    {
        $params['documentoorigen'] = 1;
        $result = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, false);
        return $result;

    }

    public function obtenerAgenciasPenalizacion($params)
    {
        $params['documentoorigen'] = 3;
        $query = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, true);
        $query->innerJoin('ord.DatPlansolicitud sol')->addSelect(
            'sol.idestructura as idestructura, sol.idagencia as idagencia'
        );
        if ($params['tipo'] == 1) {
            $query->addWhere('sol.idestructura is not null');
        } else {
            $query->addWhere('sol.idagencia is not null');
        }
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
        return $data;

    }

}