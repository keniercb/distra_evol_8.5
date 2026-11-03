<?php

class ParalizacionTalleresModel extends ZendExt_Model {

    private $_ordenTrabajoService, $_serviciosConfiguracionGeneral;

    public function __construct() {
        parent::__construct();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function getEstructuras() {
        $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        return array('datos' => $estructuras, 'cantidad' => count($estructuras));
    }

    public function getMediosParalizados($parametros) {
        $parametros['estructura'] = ($parametros['estructura']) ? $parametros['estructura'] : $this->global->Estructura->idestructura;

        if ($parametros['tipomedio'] || $parametros['imprimir'] == true) {
            $conn = Zend_Registry::get('conexion');
            $idusuario = $this->global->perfil->idusuario;

            if ($parametros['imprimir'] != true) {
                $idconfiguracion = "{" . $parametros['tipomedio'] . "}";
                $idestructura = "{" . $parametros['estructura'] . "}";

                if ($parametros['clienteba'] == "") {
                    //si no hay clientes seleccionados, se buscan todos los clientes del sector seleccionado... o todos los clientes
                    $param['idsector'] = $parametros['idsector'];
                    $cliente = self::cargarClientesobtenidos($param);
                    unset($param);
                    $cliente = array_column($cliente['datos'], 'idclientesproveedores');
                    $cliente = implode(',', $cliente);
                } else {
                    $cliente = $parametros['clienteba'];
                }

                $cliente = "{" . $cliente . "}";
                //ejecutando funcion de busqueda de datos segun configuracion del reporte
                $consulta = " SELECT * from mod_logtaller.f_parte('{$idestructura}', '{$idconfiguracion}', $idusuario, '$cliente')";
                $result = $conn->fetchAll($consulta);
                unset($idestructura, $idconfiguracion, $cliente);
            }
            //procesando filtros
            if ($parametros['filter']) {
                $addWhereFiltros = "";
                foreach ($parametros['filter'] as $filtro) {
                    if ($filtro->value == "" && $filtro->value != 0) {
                        continue;
                    }
                    if ($filtro->type == 'string') {
                        $addWhereFiltros .= " AND $filtro->field ILIKE '%" . mb_convert_case($filtro->value, MB_CASE_UPPER, 'UTF-8') . "%'";
                    } else
                    if ($filtro->type == 'numeric' || $filtro->type == 'date') {
                        if ($filtro->comparison == 'lt') {
                            $addWhereFiltros .= " AND $filtro->field < '$filtro->value' ";
                        } else
                        if ($filtro->comparison == 'gt') {
                            $addWhereFiltros .= " AND $filtro->field > '$filtro->value' ";
                        } else
                        if ($filtro->comparison == 'eq') {
                            $addWhereFiltros .= " AND $filtro->field = '$filtro->value' ";
                        }
                    } else {
                        $addWhereFiltros .= " AND $filtro->field = $filtro->value ";
                    }
                }
            }

            if ($parametros['interno'] == 1) {
                $addWhereFiltros .= " AND garantia = 1 ";
            } else
            if ($parametros['externo'] == 1) {
                $addWhereFiltros .= " AND garantia = 0 ";
            }

            if ($parametros['rangotodos'] == 0) {
                $rangos = "";
                if ($parametros['primerrango'] == 1) {
                    if ($rangos == "")
                        $rangos .= " AND (diasparalizado between 0 and 30 ";
                }
                if ($parametros['segundorango'] == 1) {
                    if ($rangos == "")
                        $rangos .= " AND (diasparalizado between 31 and 60 ";
                    else
                        $rangos .= " OR diasparalizado between 31 and 60 ";
                }
                if ($parametros['tercerrango'] == 1) {
                    if ($rangos == "")
                        $rangos .= " AND (diasparalizado between 61 and 90 ";
                    else
                        $rangos .= " OR diasparalizado between 61 and 90 ";
                }
                if ($parametros['cuartorango'] == 1) {
                    if ($rangos == "")
                        $rangos .= " AND (diasparalizado between 91 and 120 ";
                    else
                        $rangos .= " OR diasparalizado between 91 and 120 ";
                }
                if ($parametros['quintorango'] == 1) {
                    if ($rangos == "")
                        $rangos .= " AND (diasparalizado between 121 and 360 ";
                    else
                        $rangos .= " OR diasparalizado between 121 and 360 ";
                }
                if ($parametros['maxrango'] == 1) {
                    if ($rangos == "")
                        $rangos .= " AND (diasparalizado > 361 ";
                    else
                        $rangos .= " OR diasparalizado > 361 ";
                }
                if ($rangos != "")
                    $addWhereFiltros .= $rangos . " ) ";
            };

            if ($parametros['imprimir'] != true) {
                $limite = "OFFSET {$parametros['start']} LIMIT {$parametros['limit']}";
            }

            $consulta = " SELECT DISTINCT idordentrabajo,
                                    agencia,
                                    nroorden,
                                    ubicacion,
                                    cliente,
                                    matricula,
                                    marca,
                                    modelo,
                                    fechainicio,
                                    CASE
                                      WHEN diasparalizado > 0 THEN diasparalizado
                                      ELSE 0
                                    END as diasparalizado,
                                    indicativo,
                                    dictamentecnico,
                                    fechafin,
                                    CASE
                                      WHEN sobreestadia > 0 THEN sobreestadia
                                      ELSE 0
                                    END as sobreestadia,
                                    importepiezas,
                                    importeactividad,
                                    nropedido,
                                    fechapedido,
                                    observaciones,
                                    public.list(denoconfiguracion) as denoconfiguracion,
                                    garantia,
                                    count(*) OVER() as total
                             FROM mod_logtaller.rep_parteparalizacion
                             WHERE idusuario =  $idusuario $addWhereFiltros
                             GROUP BY idordentrabajo,
                                      agencia,
                                      nroorden,
                                      ubicacion,
                                      cliente,
                                      matricula,
                                      marca,
                                      modelo,
                                      fechainicio,
                                      diasparalizado,
                                      indicativo,
                                      dictamentecnico,
                                      fechafin,
                                      sobreestadia,
                                      importepiezas,
                                      importeactividad,
                                      nropedido,
                                      fechapedido,
                                      observaciones,
                                      garantia
                             ORDER BY diasparalizado DESC $limite ";
            $result = $conn->fetchAll($consulta);
        }
        return array('datos' => $result, 'cantidad' => $result[0]['total']);
    }

    public function obtenerParalizacionGeneralSQL($parametros) {
        $parametros['estructura'] = ($parametros['estructura']) ? $parametros['estructura'] : $this->global->Estructura->idestructura;

        if ($parametros['tipomedio'] || $parametros['imprimir'] == true) {
            $conn = Zend_Registry::get('conexion');
            $idusuario = $this->global->perfil->idusuario;
            $idconfiguracion = "{" . $parametros['tipomedio'] . "}";
            $idestructura = "{" . $parametros['estructura'] . "}";

            //ejecutando funcion de busqueda de datos segun configuracion del reporte
            $consulta = " SELECT * from mod_logtaller.f_parte_general_sql('{$idestructura}', '{$idconfiguracion}', $idusuario)";
            $conn->fetchAll($consulta);
            unset($idestructura, $idconfiguracion);

            $consulta = "SELECT *
                        FROM mod_logtaller.rep_parteparalizaciongeneral
                        WHERE idusuario =  $idusuario 
                               ORDER BY idestructuracomun, idconfiguracion, idparteparalizaciongeneral";
            $result = $conn->fetchAll($consulta);
        }
        return $result;
    }

    public function obtenerParalizacionGeneralSQLPHP($parametros) {
        $parametros['estructura'] = ($parametros['estructura']) ? $parametros['estructura'] : $this->global->Estructura->idestructura;

        if ($parametros['tipomedio'] || $parametros['imprimir'] == true) {
            $conn = Zend_Registry::get('conexion');
            $idusuario = $this->global->perfil->idusuario;
            $idconfiguracion = "{" . $parametros['tipomedio'] . "}";
            $idestructura = "{" . $parametros['estructura'] . "}";

            //ejecutando funcion de busqueda de datos segun configuracion del reporte
            $consulta = " SELECT * from mod_logtaller.f_parte_general('{$idestructura}', '{$idconfiguracion}', $idusuario)";
            $conn->fetchAll($consulta);
            unset($idestructura, $idconfiguracion);

            $consulta = "SELECT idconfiguracion,
                            denoconfiguracion,
                            agencia,
                            total,
                            sum(total) OVER(PARTITION BY idestructuracomun) as sub_total,
                            sum(total) OVER(PARTITION BY idconfiguracion) as tipo_total,
                            sum(total) OVER(PARTITION BY idusuario) as total_total,
                            buenestado,
                            sum(buenestado) OVER(PARTITION BY idestructuracomun) as sub_buenestado,
                            sum(buenestado) OVER(PARTITION BY idconfiguracion) as tipo_buenestado,
                            sum(buenestado) OVER(PARTITION BY idusuario) as total_buenestado,
                            paralizadosenbase,
                            sum(paralizadosenbase) OVER(PARTITION BY idestructuracomun) as sub_paralizadosenbase,
                            sum(paralizadosenbase) OVER(PARTITION BY idconfiguracion) as tipo_paralizadosenbase,
                            sum(paralizadosenbase) OVER(PARTITION BY idusuario) as total_paralizadosenbase,
                            paralizadosotrostalleres,
                            sum(paralizadosotrostalleres) OVER(PARTITION BY idestructuracomun) as sub_paralizadosotrostalleres,
                            sum(paralizadosotrostalleres) OVER(PARTITION BY idconfiguracion) as tipo_paralizadosotrostalleres,
                            sum(paralizadosotrostalleres) OVER(PARTITION BY idusuario) as total_paralizadosotrostalleres,
                            paralizados,
                            sum(paralizados) OVER(PARTITION BY idestructuracomun) as sub_paralizados,
                            sum(paralizados) OVER(PARTITION BY idconfiguracion) as tipo_paralizados,
                            sum(paralizados) OVER(PARTITION BY idusuario) as total_paralizados,
                            rango1_30,
                            sum(rango1_30) OVER(PARTITION BY idestructuracomun) as sub_rango1_30,
                            sum(rango1_30) OVER(PARTITION BY idconfiguracion) as tipo_rango1_30,
                            sum(rango1_30) OVER(PARTITION BY idusuario) as total_rango1_30,
                            rango31_60,
                            sum(rango31_60) OVER(PARTITION BY idestructuracomun) as sub_rango31_60,
                            sum(rango31_60) OVER(PARTITION BY idconfiguracion) as tipo_rango31_60,
                            sum(rango31_60) OVER(PARTITION BY idusuario) as total_rango31_60,
                            rango61_90,
                            sum(rango61_90) OVER(PARTITION BY idestructuracomun) as sub_rango61_90,
                            sum(rango61_90) OVER(PARTITION BY idconfiguracion) as tipo_rango61_90,
                            sum(rango61_90) OVER(PARTITION BY idusuario) as total_rango61_90,
                            rango91_120,
                            sum(rango91_120) OVER(PARTITION BY idestructuracomun) as sub_rango91_120,
                            sum(rango91_120) OVER(PARTITION BY idconfiguracion) as tipo_rango91_120,
                            sum(rango91_120) OVER(PARTITION BY idusuario) as total_rango91_120,
                            rango121_360,
                            sum(rango121_360) OVER(PARTITION BY idestructuracomun) as sub_rango121_360,
                            sum(rango121_360) OVER(PARTITION BY idconfiguracion) as tipo_rango121_360,
                            sum(rango121_360) OVER(PARTITION BY idusuario) as total_rango121_360,
                            rango360,
                            sum(rango360) OVER(PARTITION BY idestructuracomun) as sub_rango360,
                            sum(rango360) OVER(PARTITION BY idconfiguracion) as tipo_rango360,
                            sum(rango360) OVER(PARTITION BY idusuario) as total_rango360,
                            cdt,
                            round((CASE
                                     WHEN (sum(total) OVER(PARTITION BY idestructuracomun)) > 0 THEN (sum(buenestado) OVER(PARTITION BY idestructuracomun)) /(sum(total)
                                       OVER(PARTITION BY idestructuracomun))
                                     ELSE 0
                                   END), 2) as sub_cdt,
                            round((CASE
                                     WHEN (sum(total) OVER(PARTITION BY idconfiguracion)) > 0 THEN (sum(buenestado) OVER(PARTITION BY idconfiguracion)) /(sum(total) OVER(
                                       PARTITION BY idconfiguracion))
                                     ELSE 0
                                   END), 2) as tipo_cdt,
                            round((CASE
                                     WHEN (sum(total) OVER(PARTITION BY idusuario)) > 0 THEN (sum(buenestado) OVER(PARTITION BY idusuario)) /(sum(total) OVER(
                                       PARTITION BY idusuario))
                                     ELSE 0
                                   END), 2) as total_cdt,
                            idestructuracomun,
                            idparteparalizaciongeneral
                     FROM mod_logtaller.rep_parteparalizaciongeneral
                     WHERE idusuario =  $idusuario 
                            ORDER BY agencia, idparteparalizaciongeneral";
            $result = $conn->fetchAll($consulta);

            $tipomedio = explode(',', $parametros['tipomedio']);
            $total_medio = array();

            $entidad = $result[0]['idestructuracomun'];
            $new_result = array();
            $contador_entidadtipomedio = 0;
            $contador_entidad = 1;
            foreach ($result as $key => $value) {
                $record = array();
                if ($entidad != $value['idestructuracomun']) {
                    if ($contador_entidadtipomedio > 1) {
                        $record['idconfiguracion'] = 0;
                        $record['denoconfiguracion'] = 'TOTAL';
                        $record['agencia'] = $result[$key - 1]['agencia'];
                        $record['total'] = $result[$key - 1]['sub_total'];
                        $record['buenestado'] = $result[$key - 1]['sub_buenestado'];
                        $record['paralizadosenbase'] = $result[$key - 1]['sub_paralizadosenbase'];
                        $record['paralizadosotrostalleres'] = $result[$key - 1]['sub_paralizadosotrostalleres'];
                        $record['paralizados'] = $result[$key - 1]['sub_paralizados'];
                        $record['rango1_30'] = $result[$key - 1]['sub_rango1_30'];
                        $record['rango31_60'] = $result[$key - 1]['sub_rango31_60'];
                        $record['rango61_90'] = $result[$key - 1]['sub_rango61_90'];
                        $record['rango91_120'] = $result[$key - 1]['sub_rango91_120'];
                        $record['rango121_360'] = $result[$key - 1]['sub_rango121_360'];
                        $record['rango360'] = $result[$key - 1]['sub_rango360'];
                        $record['cdt'] = $result[$key - 1]['sub_cdt'];
                        $new_result[] = $record;
                    }
                    $entidad = $value['idestructuracomun'];
                    $contador_entidadtipomedio = 1;
                    $contador_entidad++;
                    $new_result[] = $value;
                } else {
                    $contador_entidadtipomedio++;
                    $new_result[] = $value;
                }
                $total_medio[$value['idconfiguracion']]['idconfiguracion'] = $value['idconfiguracion'];
                $total_medio[$value['idconfiguracion']]['denoconfiguracion'] = $value['denoconfiguracion'];
                $total_medio[$value['idconfiguracion']]['agencia'] = 'TOTAL GENERAL';
                $total_medio[$value['idconfiguracion']]['total'] = $value['tipo_total'];
                $total_medio[$value['idconfiguracion']]['buenestado'] = $value['tipo_buenestado'];
                $total_medio[$value['idconfiguracion']]['paralizadosenbase'] = $value['tipo_paralizadosenbase'];
                $total_medio[$value['idconfiguracion']]['paralizadosotrostalleres'] = $value['tipo_paralizadosotrostalleres'];
                $total_medio[$value['idconfiguracion']]['paralizados'] = $value['tipo_paralizados'];
                $total_medio[$value['idconfiguracion']]['rango1_30'] = $value['tipo_rango1_30'];
                $total_medio[$value['idconfiguracion']]['rango31_60'] = $value['tipo_rango31_60'];
                $total_medio[$value['idconfiguracion']]['rango61_90'] = $value['tipo_rango61_90'];
                $total_medio[$value['idconfiguracion']]['rango91_120'] = $value['tipo_rango91_120'];
                $total_medio[$value['idconfiguracion']]['rango121_360'] = $value['tipo_rango121_360'];
                $total_medio[$value['idconfiguracion']]['rango360'] = $value['tipo_rango360'];
                $total_medio[$value['idconfiguracion']]['cdt'] = $value['tipo_cdt'];
            }
            if ($contador_entidadtipomedio > 1) {
                $record = array();
                $record['idconfiguracion'] = 0;
                $record['denoconfiguracion'] = 'TOTAL';
                $record['agencia'] = $value['agencia'];
                $record['total'] = $value['sub_total'];
                $record['buenestado'] = $value['sub_buenestado'];
                $record['paralizadosenbase'] = $value['sub_paralizadosenbase'];
                $record['paralizadosotrostalleres'] = $value['sub_paralizadosotrostalleres'];
                $record['paralizados'] = $value['sub_paralizados'];
                $record['rango1_30'] = $value['sub_rango1_30'];
                $record['rango31_60'] = $value['sub_rango31_60'];
                $record['rango61_90'] = $value['sub_rango61_90'];
                $record['rango91_120'] = $value['sub_rango91_120'];
                $record['rango121_360'] = $value['sub_rango121_360'];
                $record['rango360'] = $value['sub_rango360'];
                $record['cdt'] = $value['sub_cdt'];
                $new_result[] = $record;
            }
            if ($contador_entidad > 1) {
                foreach ($total_medio as $medio) {
                    $new_result[] = $medio;
                }

                $record = array();
                $record['idconfiguracion'] = 0;
                $record['denoconfiguracion'] = 'TOTAL';
                $record['agencia'] = 'TOTAL GENERAL';
                $record['total'] = $value['total_total'];
                $record['buenestado'] = $value['total_buenestado'];
                $record['paralizadosenbase'] = $value['total_paralizadosenbase'];
                $record['paralizadosotrostalleres'] = $value['total_paralizadosotrostalleres'];
                $record['paralizados'] = $value['total_paralizados'];
                $record['rango1_30'] = $value['total_rango1_30'];
                $record['rango31_60'] = $value['total_rango31_60'];
                $record['rango61_90'] = $value['total_rango61_90'];
                $record['rango91_120'] = $value['total_rango91_120'];
                $record['rango121_360'] = $value['total_rango121_360'];
                $record['rango360'] = $value['total_rango360'];
                $record['cdt'] = $value['total_cdt'];
                $new_result[] = $record;
            }
        }
        return $new_result;
    }

    /**
     * @descripcion obtiene las edades configuradas
     *
     * @param $parametros
     *
     * @return array
     */
    public function cargarEdades($parametros) {
        $query = Doctrine_Query::create();
        $query->select('ne.idnomedades, ne.denominacion as denominacion, ne.desde, ne.hasta')->from('NomEdades ne')
                ->innerJoin('ne.DatEdadesEntidad de')->where(
                'de.idestructuracomun = ?', array($this->global->Estructura->idestructura)
        );
        if ($parametros['idsedades']) {
            $query->andWhereIn('ne.idnomedades ', $parametros['idsedades']);
        }
        if ($parametros['excluir']) {
            $query->andWhereNotIn('ne.idnomedades ', array($parametros['excluir']));
        }
        $query->orderBy("ne.denominacion ASC");
        if ($parametros['criterio']) {
            $query->andWhere("nfm.denominacion ilike '%{$parametros['criterio']}%'");
        }
        if ($parametros['start']) {
            $query->offset($parametros['start']);
        }
        if ($parametros['limit']) {
            $query->limit($parametros['limit']);
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    /**
     * @descripcion crrea los subSelect correspondientes a las edades
     *
     * @param $edades
     * @param $sql
     */
    /* Para Transgaviota que agrupa por marca modelo */
    public function crearSubSqlEdades($edades, &$sql) {
        $parametros['idsedades'] = ($edades) ? explode(",", $edades) : array(1);
        $rangos = $this->cargarEdades($parametros);
        foreach ($rangos['datos'] as $rango) {
            $sql .= ",(Select count(ots.idordentrabajo) FROM mod_logistica.dat_documento doc
             INNER JOIN mod_logtaller.dat_ordentrabajo ots on (doc.iddocumento = ots.idordentrabajo)
             INNER JOIN mod_logtaller.dat_medioorden mo  on (mo.idordentrabajo = ots.idordentrabajo)
             WHERE ots.documentoorigen IN (0,1,3,5,6) AND mo.idindicador = m.idindicador ";
            if ($rango['desde']) {
                $sql .= " and (now()::date - fechainicio::date) >= {$rango['desde']} ";
            }
            if ($rango['hasta']) {
                $sql .= " and (now()::date - fechainicio::date) <= {$rango['hasta']} ";
            }

            $sql .= " and  doc.idestructuracomun = d.idestructuracomun AND doc.estado = 2 AND doc.iddoc = d.iddoc
             ) as edad_{$rango['idnomedades']}";
        }
    }

    public function getSector() {
        $sql = "select ns.idsector, ns.denominacion from mod_crmcontratacion.nom_sector ns";
        return array('datos' => LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC));
    }

    public function cargarPiezasFaltantesDeUnaOrden($params) {
        $params['estado'] = 1;
        return $this->_ordenTrabajoService->devolverMaterialesOrden($params['idordentrabajo'], false, $params);
    }

    /**
     * @return mixed
     */
    public function cargarMarcas($params) {
        $conn = Zend_Registry::get('conexion');
        $consulta = "SELECT denominacion FROM mod_datosmaestros.nom_marca order by 1;";
        $result = $conn->fetchAll($consulta);
        // return $this->_serviciosConfiguracionGeneral->obtenerMarcas($params);
        return array('datos' => $result, 'cantidad' => count($result));
    }

    /**
     * @return mixed
     */
    public function cargarModelos($params) {
        $conn = Zend_Registry::get('conexion');
        $consulta = "SELECT denominacion FROM mod_datosmaestros.nom_modelo order by 1 ;";
        $result = $conn->fetchAll($consulta);
        return array('datos' => $result, 'cantidad' => count($result));
        // return $this->_serviciosConfiguracionGeneral->obtenerModelos($params);
    }

    public function cargarClientesobtenidos($params) {
        if ($params['idsector']) {
            $addWhere = " WHERE cp.idsector IN ({$params['idsector']}) ";
        }
        if ($params['start'] && $params['limit']) {
            $limit = " OFFSET {$params['start']} LIMIT {$params['limit']} ";
        }

        $conn = Zend_Registry::get('conexion');
        $consulta = "SELECT DISTINCT cp.idclientesproveedores,
                            CASE
                              WHEN cp.codigonit IS NULL THEN cp.codigo || ' ' || cp.nombre
                              ELSE cp.codigonit || ' ' || cp.nombre
                            END as cliente
                     FROM mod_logtaller.dat_ordentrabajo ot
                          INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores = ot.idcliente $addWhere
                     order by 2  
                     $limit
                     ;";

        $result = $conn->fetchAll($consulta);
        return array('datos' => $result, 'cantidad' => count($result));
    }

    public function cargarSector($params) {
        $conn = Zend_Registry::get('conexion');
        $consulta = "SELECT DISTINCT ns.idsector,
                        ns.denominacion
                 FROM mod_crmcontratacion.nom_sector ns
                      INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idsector = ns.idsector
                      INNER JOIN mod_logtaller.dat_ordentrabajo ot ON cp.idclientesproveedores = ot.idcliente
                      INNER JOIN mod_logistica.dat_documento doc ON doc.iddocumento = ot.idordentrabajo AND doc.estado = 1
                 ORDER BY 2";
        $result = $conn->fetchAll($consulta);
        return array('datos' => $result, 'cantidad' => count($result));
    }

    /**
     * @return mixed
     */
    public function cargarPiezasFaltantes($params) {
        return $this->_ordenTrabajoService->cargarPiezasFaltantesEnLasOrdenes($params, false);
    }

    public function crearExcel($params) {
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
//        $params['tipomodelo'] = ($params['tiporeporte']) ? $params['tiporeporte'] : 2;
        unset($params['tiporeporte']);
        $datos = $this->getMediosParalizados($params);
        $params['columns'] = Zend_Json::decode($params['columns']);
        if ($params['tipomodelo'] == 1) {
            $columns = array(
                'Tipo', 'Agencia', 'Marca', 'Modelo', 'Indicativo', 'Matrícula', 'Motivos paralización',
                'Fecha entrada', 'Días paralizado', 'Pronóstico salida', 'Sobreestadía', 'No. pedido', 'Fecha pedido',
                'Pendiente por', 'OT', 'Observaciones', 'Tipo Medio'
            );
            $excel->writeLine($columns);
            foreach ($datos['datos'] as $d) {
                $excel->writeRow();
                $excel->writeCol($d['tipo']);
                $excel->writeCol($d['agencia']);
                $excel->writeCol($d['marca']);
                $excel->writeCol($d['modelo']);
                $excel->writeCol($d['indicativo']);
                $excel->writeCol($d['matricula']);
                $excel->writeCol($d['dictamentecnico']);
                $excel->writeCol($d['fechainicio']);
                $excel->writeCol($d['diasparalizado']);
                $excel->writeCol($d['fechafin']);
                $excel->writeCol($d['sobreestadia']);
                $excel->writeCol($d['nropedido']);
                $excel->writeCol($d['fechapedido']);
                $excel->writeCol($d['pendientepor']);
                $excel->writeCol($d['nrodoc']);
                $excel->writeCol($d['observaciones']);
                $excel->writeCol($d['denoconfiguracion']);
            }
            $excel->close();
            return '/logistica/talleres/recuperaciones/' . $fichero;
        } else {
            $columns = array(
                'Tipo', 'Total vehículos', 'Buen estado técnico', 'Paralizados en otros talleres',
                'Paralizados en la base', 'Total paralizados', 'CDT'
            );
            if ($params['columns']) {
                foreach ($params['columns'] as $p) {
                    $columns[] = $p[$p['etiqueta']];
                }
            }

            $excel->writeLine($columns);
            $pos = 0;
            foreach ($datos['datos'] as $d) {
                $excel->writeRow();
                $excel->writeCol($d['tipo']);
                $excel->writeCol(round($d['total']));
                $bet = $d['total'] - $d['totalparalizado'];
                $excel->writeCol($bet);
                $excel->writeCol($d['paralizacionterceros']);
                $excel->writeCol($d['paralizacionbase']);
                $excel->writeCol($d['totalparalizado']);
                $excel->writeCol(round($bet / $d['total'], 2));

                if ($params['columns']) {

                    foreach ($params['columns'] as $etiquueta) {
                        $excel->writeCol($etiquueta['data'][$pos]);
                    }
                }
                $pos++;
            }
            $excel->close();
            return '/logistica/talleres/recuperaciones/' . $fichero;
        }
    }

    public function cargarProveedores($parametros) {
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        if ($parametros['criterio']) {
            $filtro['nombre'] = $parametros['criterio'];
        }
        $proveedores = $this->_serviciosConfiguracionGeneral->getClientesProveedorByParams(
                null, $this->global->Estructura->idestructura, true, true, true, $filtro, $start, $limit
        );
        return $proveedores;
    }

    public function addResultLimits($array = array(), $params = array()) {
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

    public function crearexcelparalizadosenbase($params) {
        mkdir('tmp');
        $fecha = date("y-m-d-H-i-s");
        $conn = Zend_Registry::get('conexion');
        $usuario = $this->global->perfil->idusuario;
        $fichero = "tmp/Paralizados_en_base{$fecha}.xls";
        $excel = new ExcelWriter($fichero);
        $params['imprimir'] = true;
        $arraydata = $this->getMediosParalizados($params);

        $datos = $arraydata['datos'];
        $cantidadTotal = $arraydata['cantidad'];

        $columns = array(
            array('header' => '<b>Agencia</b>', 'dataIndex' => 'agencia'),
            array('header' => '<b>OT</b>', 'dataIndex' => 'nroorden'),
            array('header' => '<b>Ubicación</b>', 'dataIndex' => 'ubicacion'),
            array('header' => '<b>Cliente</b>', 'dataIndex' => 'cliente'),
            array('header' => '<b>Matrícula</b>', 'dataIndex' => 'matricula'),
            array('header' => '<b>Marca</b>', 'dataIndex' => 'marca'),
            array('header' => '<b>Modelo</b>', 'dataIndex' => 'modelo'),
            array('header' => '<b>Fecha entrada</b>', 'dataIndex' => 'fechainicio'),
            array('header' => '<b>Días paralizados</b>', 'dataIndex' => 'diasparalizado'),
            array('header' => '<b>Indicativo</b>', 'dataIndex' => 'indicativo'),
            array('header' => '<b>Motivos paralización</b>', 'dataIndex' => 'dictamentecnico'),
            array('header' => '<b>Pronóstico salida</b>', 'dataIndex' => 'fechafin'),
            array('header' => '<b>Sobreestadía</b>', 'dataIndex' => 'sobreestadia'),
            array('header' => '<b>Costo de piezas</b>', 'dataIndex' => 'importepiezas'),
            array('header' => '<b>Costo de actividades</b>', 'dataIndex' => 'importeactividad'),
            array('header' => '<b>No. pedido</b>', 'dataIndex' => 'nropedido'),
            array('header' => '<b>Observaciones</b>', 'dataIndex' => 'observaciones'),
            array('header' => '<b>Tipo de Medio</b>', 'dataIndex' => 'denoconfiguracion')
        );

        foreach ($columns as $col) {
            $excel->writeCol($col['header']);
        }

        $excel->writeRow();

        $this->crearExcelbasepara($columns, $datos, $excel);
        $excel->close();
        return '/logistica/talleres/recuperaciones/' . $fichero;
    }

    public function imprimirexcelresumengeneral($params) {
        mkdir('tmp');
        $fecha = date("y-m-d-H-i-s");
        $fichero = "tmp/Paralizados_general{$fecha}.xls";
        $excel = new ExcelWriter($fichero);
        $params['imprimir'] = true;
        //datos con procesamiento solo SQL
        $datos = $this->obtenerParalizacionGeneralSQL($params);
        //datos con procesamiento mixto PHP/SQL
//        $datos = $this->obtenerParalizacionGeneralSQLPHP($params);

        $columns = array(
            array('header' => '<b>Entidad</b>', 'dataIndex' => 'agencia'),
            array('header' => '<b>Tipo medio</b>', 'dataIndex' => 'denoconfiguracion'),
            array('header' => '<b>TOTAL</b>', 'dataIndex' => 'total'),
            array('header' => '<b>B.E.T.</b>', 'dataIndex' => 'buenestado'),
            array('header' => '<b>Paralizados en base</b>', 'dataIndex' => 'paralizadosenbase'),
            array('header' => '<b>Paralizados en otros talleres</b>', 'dataIndex' => 'paralizadosotrostalleres'),
            array('header' => '<b>Total paralizados</b>', 'dataIndex' => 'paralizados'),
            array('header' => '<b>De 1-30 días</b>', 'dataIndex' => 'rango1_30'),
            array('header' => '<b>De 31-60 días</b>', 'dataIndex' => 'rango31_60'),
            array('header' => '<b>De 61-90 días</b>', 'dataIndex' => 'rango61_90'),
            array('header' => '<b>De 91-120 días</b>', 'dataIndex' => 'rango91_120'),
            array('header' => '<b>De 121-360 días</b>', 'dataIndex' => 'rango121_360'),
            array('header' => '<b>Más de 360 días</b>', 'dataIndex' => 'rango360'),
            array('header' => '<b>C.D.T.</b>', 'dataIndex' => 'cdt'),
        );

        foreach ($columns as $col) {
            $excel->writeCol($col['header']);
        }

        $excel->writeRow();
        $this->crearExcelbasepara($columns, $datos, $excel);
        $excel->close();
        return '/logistica/talleres/recuperaciones/' . $fichero;
    }

    public function crearExcelbasepara($columns, $datos, &$excel) {
        foreach ($datos as $dato) {
            foreach ($columns as $col) {
                $index = $col['dataIndex'];
                if ($dato[$index]) {
                    $excel->writeCol($dato[$index]);
                } else {
                    $excel->writeCol('');
                }
            }
            $excel->writeRow();
        }
    }

}
