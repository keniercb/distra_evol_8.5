<?php

class DocMedicionModel extends DocumentoLogModel
{

    public function DocMedicionModel()
    {
        parent::__construct(array('alias' => 'LecturaMedidorLog'));
        $this->comun = new comunModel();
    }

    private function obtenerIdsDocumentos($docs)
    {
        $result = array();
        foreach ($docs as $doc) {
            $result[] = $doc['iddocumento'];
        }
        return implode(",", $result);
    }

    public function obtenerDocumentos($params)
    {
        if ($params['idclienteruta']) {
            array_push($params['idcliente'], $params['idclienteruta']);
        }
        if ($params['idcliente']) {
            $docsMed = DocMedCliente::buscarDocsPosIdsClientes(implode(',', $params['idcliente']));
        } else {
            $docsMed = DocMedicion::listar($params);
        }
        $filterArr = array();
        $p = new DatDocumento();
        $p->setTableName('mod_logistica.dat_documento');
        if (!empty($params['iddocumento'])) {
            $filterArr[] = "dm.iddocumento = " . $params['iddocumento'];
        }
        if (!empty($params['anno'])) {
            $filterArr[] = "dm.anno = " . $params['anno'];
        }
        if (!empty($params['estado'])) {
            $filterArr[] = "dm.estado = " . $params['estado'];
        } else {
            $filterArr[] = "dm.estado <> 5";
        }
        if (!empty($params['estadoIgual'])) {
            $filterArr[] = "dm.estado in ({$params['estadoIgual']})";
        }
        if (!empty($params['fechacontable'])) {
            $filterArr[] = "dm.fechacontable = " . $params['fechacontable'];
        }
        if (!empty($params['fechainicio'])) {
            $filterArr[] = "dm.fechacontable >=  '{$params['fechainicio']}'";
        }
        if (!empty($params['fechafin'])) {
            $filterArr[] = "dm.fechacontable <= '{$params['fechafin']}'";
        }
        if (!empty($params['iddoc'])) {
            $filterArr[] = "dm.iddoc = " . $params['iddoc'];
        }
        if (!empty($params['nrodoc'])) {
            $filterArr[] = "dm.nrodoc = " . $params['nrodoc'];
        }
        if (!empty($params['observaciones'])) {
            $filterArr[] = "dm.observaciones = " . $params['observaciones'];
        }
        if (!empty($params['idestructuracomun'])) {
            $filterArr[] = "dm.idestructuracomun = " . $params['idestructuracomun'];
        }
        $q = $this->dameDocumentosOrdenEstadoNroDoc();
        $filter = implode(" and ", $filterArr);
        if ($filter) {
            $q->where($filter);
        }
        if ($docsMed) {
            $iddocs = $this->obtenerIdsDocumentos($docsMed);
            $q->addWhere("dm.iddocumento in ({$iddocs})");
        }
        $cant = $q->count();
        if ($params['limit']) {
            $q->limit($params['limit'])
                ->offset($params['start']);
        }
        $result = $q->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        return array('cantidad' => $cant, 'result' => $result);
    }

    public function getDatasUltimaLectura($contrato)
    {
        $data = Array();
        $result = DocMedCliente::getDataByIdDocuments();
        foreach ($result as $record) {
            $doc = DatDocumento::getEstadoByIdDocuments($record['iddocumento']);
            if ($doc['estado'] == 3) {
                $data = $record;
                break;
            }
        }
        return $data;
    }

    public function listDocuments($params)
    {
        if (!empty($params['idclientes'])) {
            $cliente = "";
            foreach ($params['idclientes'] as $clientes) {
                $cliente .= $clientes->idcliente . ',';
            }
            $params['clientes'] = substr($cliente, 0, -1);
            $documents = DocMedCliente::getIdDocumentsByIdsCustomer($params);
            $index = 0;
            $result = Array();
            foreach ($documents['datos'] as $documento) {
                $contratosClientes = DocMedClienteModel::obtenerClientesXiddocumento(
                    $documento['iddocumento'], $params['idestructuracomun'], $params
                );
                foreach ($contratosClientes as $clientes) {
                    $result[$index]['estado'] = $this->devolverEstadoDocumento($documento['DatDocumento']['estado']);
                    $result[$index]['fechacontable'] = $documento['DatDocumento']['fechacontable'];
                    $result[$index]['nrodoc'] = $documento['DatDocumento']['nrodoc'];
                    $contratos = $this->integrator->contratacion->obtenerContratosXIdcontrato(
                        array($clientes['idcontrato'])
                    );
                    $cliente = $contratos['resultado'][0];
                    $result[$index]['clientes'] = $cliente['cliente'];
                    $result[$index]['codigocontrato'] = $cliente['codigocontrato'];
                    $index++;
                }
            }
        }
        return array('cantidad' => count($result), 'datos' => $result);
    }

    /*     * ----------------Listar documentos--------------------------------* */
    public function listar($params)
    { //xxx
        $alias = 'd';
        $query = $this->getQueryDocumento('d');
        $params['numdoc'] = $params['nrodoc'];
        $query = $this->addFiltersQueryDocumento($query, $params, $alias);
        $query->addWhere("d.estado not in (4,5)");
        $total = $query->count();
        $docMedc = new DocMedClienteModel();
        if ($params['start'] || $params['start'] === 0) {
            $query->offset($params['start']);
        }
        if ($params['limit']) {
            $query->limit($params['limit']);
        }
        $documentos = $query->fetchArray();
        $result = Array();
        $index = 0;
        foreach ($documentos as $documento) {
            $result[$index] = $documento;
            $result[$index]['idestado'] = $documento['estado'];
            $result[$index]['estado'] = $this->devolverEstadoDocumento($documento['estado']);
            $servicio = DocMedicion::buscarIdServicio($documento['iddocumento']);
            $arrParams = array('idservicio' => $servicio[0]['idservicio']);
            $denomservicio = $this->integrator->planificacion->obtenerServicios($arrParams);
            $result[$index]['idservicio'] = $servicio[0]['idservicio'];
            $result[$index]['servicio'] = $denomservicio[0]['denominacion'];
            $contratosClientes = $docMedc->obtenerClientesXiddocumento(
                $documento['iddocumento'], $params['idestructuracomun']
            );
            if (count($contratosClientes) == 1) {
                $clientes = DocMedCliente::buscarPorIdDoc($documento['iddocumento']);
                $contratos = $this->integrator->contratacion->obtenerContratosXIdcontrato(
                    array($clientes[0]['idcontrato'])
                );
                $cliente = $contratos['resultado'][0];
                $result[$index]['clientes'] = $cliente['cliente'];
            } else {
                $result[$index]['clientes'] = count($contratosClientes) . ' Consumidore(s)';
            }
            $index++;
        }
        return array('cantidad' => $total, 'datos' => $result);
    }

    /*     * ----------Obtener nombres de rutas--------------------------------------* */
    /* public function obtenerNombreRutas($rutas)
      {
      $result = array();
      foreach ($rutas as $ruta)
      {
      $result[] = $ruta['ruta'];
      }
      return implode(',', $result);
      } */
    /*     * -------------Obtener documentos en elaboracion(1)/confirmados(2)------------------------------------* */
    public function obtenerDocsElaboracionConfirmacion()
    {
        $params = array();
        $params['estadoIgual'] = implode(',', array(1, 2));
        $docsElaboracion = $this->obtenerDocumentos($params);
        return $docsElaboracion['result'];
    }

    /*     * -------------Obtener ids documentos en elaboracion------------------------------------* */
    public function obtenerIdsDocsElaboracionConfirmacion()
    {
        $result = array();
        $docs = $this->obtenerDocsElaboracionConfirmacion();
        foreach ($docs as $doc) {
            $result[] = $doc['iddocumento'];
        }
        return implode(",", $result);
    }

    /*     * ------------Obtener ids clientes dados contratos------------------------------------* */
    public function obtenerIdsClientes($contratos)
    {
        $ids = array();
        foreach ($contratos as $contrato) {
            $ids[] = $contrato['idcliente'];
        }
        return $ids;
    }

    /*     * ------------Obtener ids contratos dados contratos------------------------------------* */
    public function obtenerIdsContratos($contratos)
    {
        $ids = array();
        foreach ($contratos as $contrato) {
            if ($contrato['idcontrato']) {
                $ids[] = $contrato['idcontrato'];
            }
        }
        return $ids;
    }

    /*     * --------------Eliminar documento-----------------------------------* */
    public function eliminarDocumento($iddocumento)
    {
        try {
            $q = Doctrine_Query::create()
                ->delete('DocMedicion dm')
                ->where("dm.iddocumento= ?", $iddocumento);
            return $q->execute();
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    public function existsConsumidoresInDocumentsNotConfirmed($params)
    {
        $flags = true;
        if (!empty($params['clientes'])) {
            $cliente = "";
            foreach ($params['clientes'] as $clientes) {
                $cliente .= $clientes->idcliente . ',';
            }
            $params['clientes'] = substr($cliente, 0, -1);
            $documents = DocMedCliente::getIdDocumentsByIdsCustomer($params);
            if (!empty($documents)) {
                $flags = false;
            }
        }
        return $flags;
    }

    public function isAnularStatus($params)
    {
        $documents = DocMedicion::isAnularStatus($params);
        if (!empty($documents)) {
            return false;
        }
        return true;
    }

    public function existsDocumentosByStatus()
    {
        $documents = DocMedicion::getLastDocumentPreparated();
        if (!empty($documents)) {
            return $documents[0]['fechacontable'];
        }
        return false;
    }

    public function guardar($params)
    {
        $result = new stdClass();
        $notExistsConsumidores = $this->existsConsumidoresInDocumentsNotConfirmed($params);
        if ($notExistsConsumidores) {
            $fecha = $this->existsDocumentosByStatus();
            $documento = $this->adicionarDocumento($params);
            $docMedicion = new DocMedicion();
            $docMedicion->synchronizeWithArray($params);
            $documento->DocMedicion = $docMedicion;
            /* if ($fecha) {
              $documento->fechacontable = $fecha;
              } */
            $documento->save();
            if ($params['clientes']) {
                $model = new MedClienteModel();
                $model->guardarClientes($params, $documento->iddocumento);
                $result->success = true;
            }
        } else {
            $result->success = false;
            $result->codigo = 1;
        }
        return $result;
    }

    public function modificar($params)
    {
        try {
            $result = new stdClass();
            $notExistsConsumidores = $this->existsConsumidoresInDocumentsNotConfirmed($params);
            if ($notExistsConsumidores) {
                $documento = $this->findDocumento($params['iddocumento']);
                $documento->observaciones = $params['observaciones'];
                $documento->save();
                $result->success = true;
            } else {
                $result->success = false;
                $result->codigo = 1;
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return $result->codigo = 3;
        }
    }

    public function generarFacturasClientes($iddocumento, $idservicio, $contratosParams = null)
    {
        $docMedc = new DocMedClienteModel();
        $contratos = ($contratosParams) ? $contratosParams : $docMedc->obtenerClientesXiddocumento($iddocumento);
        $parametros['idestructura'] = $this->global->Estructura->idestructura;
        $parametros['idservicio'] = $idservicio;
        $datos = ConfFacturacionService::getServiciosporConfproductosMedidor($parametros);
        $result = new stdClass();
        if ($datos['datos']) {
            if ($datos['datos'][0]['idoperacionid']) {
                $facturaService = new FacturacionService();
                $generarFact = $facturaService->generarFacturas($contratos);
                $collection = new Doctrine_Collection('DatDocumentoPadre');
                foreach ($generarFact as $i => $generada) {
                    $obDocPadre = new DatDocumentoPadre();
                    $obDocPadre->iddocumento = $generada->idfactura;
                    $obDocPadre->idpadre = $iddocumento;
                    $collection->add($obDocPadre);
                }
                $collection->save();
                if ($generarFact) {
                    $result->success = true;
                    return $result;
                } else {
                    $result->success = false;
                    $result->cod = 2;
                    return $result;
                }
            } else {
                $result->success = false;
                $result->cod = 1;
                return $result;
            }
        } else {
            $result->success = false;
            $result->cod = 3;
            return $result;
        }
    }
}
