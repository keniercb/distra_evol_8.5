<?php

/**
 *
 *
 * @author         Ing. Lisvany Alonso Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Domain
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class DatContratoImportacion extends BaseDatContratoImportacion
{

    public function setUp()
    {
        parent::setUp();
    }

    /**
     * @param $idestructura
     *
     * @return array
     */
    public function cargarcontrato($filter, $filter2, $sort, $limit = 25,
        $start = 0, $idestructuracomun
    ) {
        try {
//            $a=Array (0 =>Array ( 'field' => 'dominiofila', 'data' => Array ( 'type' => 'bit', 'value' => 1 ) ),
//            1 => Array ( 'field' => 'ultimocontrato', 'data' => Array ( 'type' => 'other', 'value' => 1 ) ) );
//            print_r($a);die;
//            $filter=(array)$filter;
//            return $filter;
            $listofacturar = self::getFilterValue($filter,'listofactura');
            $iddominio = self::getFilterValue($filter,'dominiofila');
            $iddominio=$iddominio?$iddominio:1;
            $ultimocontrato = self::getFilterValue($filter,'ultimocontrato');
            $hitosarea = self::getFilterValue($filter,'hitosarea');
//            print_r($filter);die;
            $filter = self::getFilter($filter);

            if ($filter) {
                $where[] = $filter;
            }
            $filter2 = self::getFilter($filter2);
            if ($filter2) {
                $where[] = $filter2;
            }
            if($idestructuracomun){
                $result=self::obtenerIdsAreasHijas($idestructuracomun);
                if($result){
                    $where[]=' c.idarea IN ('.$result.')';
                }
            }
            if (is_null($limit) && is_null($start)) {
                $start = 0;
                $limit = "NULL";
            }
            $ordenar = 'fechainicio DESC, numerocontrato DESC';
//            $ordenar = 'idpadre, numero ASC, fechafirma DESC, nombre ASC ';
            if ($sort) {
                $ordenar = '';
                foreach (json_decode($sort) as $s) {
                    $ordenar = $ordenar . $s->property . ' ' . $s->direction
                        . ',';
                }
                $ordenar = trim($ordenar, ',');
            }
//            print('--'.$ultimocontrato);
//            if ($ultimocontrato === 2) {   // *_* WHY???
            if ($ultimocontrato == 1) {
//                print('/*entro*/');
                $where[]
                    = "((c.idcontrato = c.idpadre AND (SELECT count(dc.idpadre)
                 FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) OR
                 (c.idcontrato != c.idpadre AND (SELECT count(dc.idpadre)
                 FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0))";
            }
            $dominio=" nfe.dominiofila[$iddominio] = 1::bit ";
            if($hitosarea==1){
                $dominio=' ('.$dominio.' OR EXISTS(SELECT h.idarea
                FROM mod_crmcontratacion.dat_contratoareaimplicada h 
                INNER JOIN mod_estructuracomp.nom_filaestruc nfe2 ON (h.idarea = nfe2.idfila)
                WHERE h.idcontrato=c.idcontrato AND nfe2.dominiofila['.$iddominio.'] = 1::bit))';
//                $dominio=' ('.$dominio.' OR (SELECT count(h.idarea)
//                FROM mod_crmcontratacion.dat_contratoareaimplicada h
//                INNER JOIN mod_estructuracomp.nom_filaestruc nfe2 ON (h.idarea = nfe2.idfila)
//                WHERE h.idcontrato=c.idcontrato AND nfe2.dominiofila['.$iddominio.'] = 1::bit) > 0)';
            }
            $where[]=$dominio;
            $where = implode(' AND ', $where);
//            print_r($where);die;

            $monedas = self::cargarMonedasContratoDominio($iddominio);
            $columnscrosstab = self::stringCrosstabMonedasColumns($monedas);
            $selectcrosstab = count($monedas) ? ','.self::stringCrosstabMonedasSelect($monedas) : '';
            $query = self::getStringSelectAll($selectcrosstab,$columnscrosstab,$iddominio, $idestructuracomun) .
                self::getSqlInnerJoinHitosFacturar($listofacturar) .
                "WHERE $where
                ORDER BY $ordenar 
                LIMIT $limit OFFSET $start;";
//            print_r($query);die;
//            return $query;
            $data = self::executeQuery($query);
            $count = count($data) ? $data[0]['count'] : 0;
//            print_r(array('cant' => array('count'=>$count), 'data'=>'mas'));die;
//            print_r(array('cant' => $count, 'data' => $data));die;
//            return array('cant' => array('count'=>$count), 'data'=>'mas');

            return array('cant' => $count, 'data' => $data);
        } catch (Exception $e) {
            throw $e;
        }

    }

    private function getStringSelectAll($selectcrosstab,$columnscrosstab,$iddominio, $idestructuracomun)
    {
        return "SELECT count(c.idcontrato) over(),c.idcontrato,c.numero,c.numerocontrato,c.idclienteproveedor,c.idtipocontrato,
                  c.nombre,c.fechafirma,c.fechainicio,c.idpadre, c.cumplimientoobligaciones, c.objetosuplemento, c.idcategoria, nc.denominacion as categoria,
                  c.idestructuracomun,c.elemento,c.registropago,c.montototal,c.fechafin,c.denominaciontipocontrato AS tipocontrato,
                  c.denominacionclienteproveedor AS clienteproveedor,c.proforma,c.idproforma,dpr.idplantilla,c.objeto,c.descripcion,c.contratomarco,
                  c.cliente,c.idcontratomarco,ce.idestado,ne.nombre as estadoinicial,ne.icono as iconoestadoinicial,ne.acciones,
                  c.idmediopago,c.version,c.idsector,ns.idsector,ns.denominacion as sector,nmp.nombre AS mediopago,c.numerojson,
                  c.vigencia,c.unidadtiempo,c.idresponsable as idpersona,c.idcondicionpago,ntp.nombre as condicionpago,
                  (CASE WHEN c.idresponsable NOTNULL THEN per.nombre||' '||per.papel||' '||per.sapel else '' END) as nombrepersona,
                  ce.fechainicio as fechaestado,fechamodificacion, COALESCE (ofn.idoferta) as idoferta,
                  (SELECT c2.numerocontrato FROM mod_crmcontratacion.dat_contrato c2 WHERE c.idcontratomarco = c2.idcontrato)
                  AS denominacioncontratomarco,c.idarea,COALESCE (desop.denominacion, des.denominacion) as nombrearea,
                  (CASE WHEN c.cumplimientoobligaciones=1 OR
                  c.fechafirma <='" . date('d/m/Y') . "' AND (c.fechafin>='"
            . date('d/m/Y') . "' OR c.fechafin ISNULL) THEN 1 ELSE 0 END) as vigente,
                   (CASE WHEN (c.fechafin NOTNULL AND (c.cumplimientoobligaciones=0 OR c.cumplimientoobligaciones ISNULL)) THEN c.fechafin-'"
            . date('d/m/Y') . "' ELSE 10000000 END) as diasrestantesvigencia  $selectcrosstab
                FROM mod_crmcontratacion.dat_contrato c
                LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (ce.idcontrato=c.idcontrato AND ce.fechafin IS NULL)
                LEFT JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = ce.idestado                
                
                LEFT JOIN mod_crmcontratacion.nom_mediodepago nmp ON nmp.idmediodepago = c.idmediopago
                LEFT JOIN mod_crmcontratacion.nom_sector ns ON ns.idsector = c.idsector
                LEFT JOIN mod_persona.dat_persona per ON (c.idresponsable = per.idpersona)
                LEFT JOIN mod_datosmaestros.nom_terminosdepago ntp ON c.idcondicionpago = ntp.idterminodepago
                LEFT JOIN mod_crmcontratacion.dat_proforma dpr ON c.idproforma = dpr.idproforma
                LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
                LEFT JOIN mod_crmcontratacion.dat_ofertanegocio ofn ON (c.idcontrato = ofn.idcontrato)
                LEFT JOIN mod_crmcontratacion.nom_categoria nc ON (c.idcategoria = nc.idcategoria)
                INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (c.idarea = nfe.idfila)
                LEFT JOIN crosstab('SELECT dmc.idcontrato,dmc.idmoneda,dmc.valor FROM mod_crmcontratacion.dat_monedacontrato dmc ORDER BY 1,2',
                'SELECT DISTINCT nm.idmoneda FROM mod_datosmaestros.dat_monedaentidad dme INNER JOIN mod_datosmaestros.nom_moneda nm ON
                nm.idmoneda = dme.idmoneda INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dme.idestructuracomun
                WHERE nfe.dominiofila[$iddominio] = 1::bit ORDER BY nm.idmoneda') AS dmc ($columnscrosstab) 
                on dmc.idcontrato = c.idcontrato ";
    }
//WHERE nfe.dominiofila[$iddominio] = 1::bit ORDER BY nm.idmoneda') AS dmc ($columnscrosstab)
// WHERE nfe.idfila=$idestructuracomun ORDER BY nm.idmoneda

//LEFT JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = c.idestado

//LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (ce.idcontrato=c.idcontrato AND ce.fechafin IS NULL)
//LEFT JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = ce.idestado

    private function getFilter($filtro)
    {
        $columns = Doctrine::getTable('DatContrato')->getColumnNames();
        $isstring = array('string', 'character varying', 'varchar');
        $isnumeric = array('int', 'numeric');
        $filter = $filtro[0];
        if ($filter) {
            $where = array();
            $whereList = array();
            foreach ($filter as $f) {
                $value = $f['data']['value'];
                $type = $f['data']['type'];
                $comparison = $f['data']['comparison'];
                $field = in_array($f['field'], $columns) ? 'c.' . $f['field']
                    : $f['field'];
                if ($value || (in_array($type, $isnumeric) && !is_null($value))) {

                    if (in_array($type, $isstring)) {
                        $where[] = $this->getFilterString(
                            $field, $value, $comparison
                        );
                    }
                    if ($type == 'boolean') {
                        $where[] = $this->getFilterBoolean(
                            $field, $value, $comparison
                        );
                    }
                    if (in_array($type, $isnumeric)) {
                        $where[] = $this->getFilterNumeric(
                            $field, $value, $comparison
                        );
                    }
                    if ($type == 'date') {
                        $where[] = $this->getFilterDate(
                            $field, $value, $comparison
                        );
                    }
                    if ($type == 'list') {
//                      from mod_estructuracomp.nom_filaestruc where parent_path ~ '*.100000534|100000533.*' or parent_path ~ '100000534|100000533.*'
                        if ($field == 'vigente') {
                            $valores = json_decode($value);
                            if (!is_array($valores)) {
                                $valores = [$valores];
                            }
                            if (count($valores) == 1) {
                                $where[] = $valores[0] == 1
                                    ?
                                    "(c.cumplimientoobligaciones=1 OR 
                                    c.fechafirma <='" . date('d/m/Y')
                                    . "' AND (c.fechafin>='" . date('d/m/Y')
                                    . "' OR c.fechafin ISNULL ))"
                                    : "(( c.fechafirma >'" . date('d/m/Y')
                                    . "' OR c.fechafin<'" . date('d/m/Y')
                                    . "' OR c.fechafirma ISNULL) AND c.cumplimientoobligaciones = 0)";
                            }
                        } else {
                            // print('FIELD:'.$field);
                            $temp = $this->getFilterList(
                                $field, $value, $comparison
                            );
                            //print_r($temp);
                            if ($temp) {
                                $whereList[] = $temp;
                            }
                        }
                    }
                    if ($type == 'bit') {
                        $where[] = $this->getFilterBit(
                            $field, $value, $comparison
                        );
                    }
                    if($type=='notNull'){
                        $where[] = $this->getFilterNotNull(
                            $field
                        );
                    }
                }
            }
            $tmp = '';
            if (!empty($where)) {
                $tmp = implode($filtro[1], $where);
                $tmp = " ( " . $tmp . " ) ";
            }
            if (!empty($whereList)) {
                if ($tmp != '') {
                    $tmp = $tmp . ' ' . $filtro[1] . ' ';
                }
                $tmp = $tmp . " ( " . implode(' AND ', $whereList) . " ) ";
            }
            return $tmp;
        }
        return '';
    }

    private function getFilterNumeric($field, $value, $comparison)
    {
        $value = !is_array($value) ? json_decode($value) : $value;
        if ($comparison == 'lt') {
            return $field . " < " . $value;
        }
        if ($comparison == 'gt') {
            return $field . " > " . $value;
        }
        if ($comparison == 'di') {
            if (is_array($value)) {
                return $field . " not in( " . implode(' , ', $value) . ")";
            } else {
                return $field . " <> " . $value;
            }
        }
        if (is_array($value)) {
            return $field . " in( " . implode(' , ', $value) . ")";
        } else {
            return $field . " = " . $value;
        }
    }

    private function getFilterString($field, $value, $comparison)
    {
        $newfield = array('tipocontrato'     => 'denominaciontipocontrato',
                          'clienteproveedor' => 'denominacionclienteproveedor',
                          'estado' => 'ne.idestado',
                          'nombrearea'       => 'COALESCE (desop.denominacion, des.denominacion)');
        $field = $newfield[$field] ? $newfield[$field] : $field;
        if ($comparison == 'eq') {
            return $field . "=" . $value;
        }
        return $field . " ILIKE '%" . $value . "%'";
    }

    private function getFilterDate($field, $value, $comparison)
    {
        if ($comparison == 'lt') {
            return $field . " < '" . $value . "'";
        }
        if ($comparison == 'gt') {
            return $field . " > '" . $value . "'";
        }
        if ($comparison == 'eq') {
            return $field . " = '" . $value . "'";
        }
        if ($comparison == 'in') {
            return $field . " ISNULL";
        }
        if ($comparison == 'nn') {
            return $field . " NOTNULL";
        }
    }

    private function getFilterBoolean($field, $value, $comparison)
    {
        $value = $value == 'true' ? 1 : 0;
        if ($field == 'vigente') {
            return $value
                ?
                "(c.cumplimientoobligaciones=1 OR 
                                    c.fechafirma <='" . date('d/m/Y')
                . "' AND (c.fechafin>='" . date('d/m/Y')
                . "' OR c.fechafin ISNULL ))"
                : "(( c.fechafirma >'" . date('d/m/Y') . "' OR c.fechafin<'"
                . date('d/m/Y')
                . "' OR c.fechafirma ISNULL) AND c.cumplimientoobligaciones = 0)";
        }else {
            return $field . " = " . $value;
        }
    }

    private function getFilterList($field, $value, $comparison)
    {
        $newfileds = array('tipocontrato'  => 'c.idtipocontrato',
                           'estadoinicial' => 'ne.idestado',
                            'sector' => 'c.idsector');
        $value = !is_array($value) ? json_decode($value) : $value;
        $field = $newfileds[$field] ? $newfileds[$field] : $field;
//        print('$value:');
//        print_r($value);
        if (is_array($value)) {
            $value = implode(',', $value);
        }
//        print('$value de nuevo:');
//        print_r($value);
//        if (!$value) {
        if ($value=='' || $value==null) {
            return false;
        }
        return $field . " IN (" . $value . ")";
    }

    private function getFilterBit($field, $value)
    {
        return $field . "[" . $value . "] = 1::bit";
    }

    private function getFilterNotNull($field)
    {
        return $field ." IS NOT NULL ";
    }

    public function cargarClienteProveedor($idestructura)
    {
        $query
            = "SELECT
                  clpr.idclientesproveedores,
                  (CASE WHEN clpr.registrado = 0
                    THEN clpr.nombre
                   ELSE COALESCE(estru.denominacion, per.nombre || ' ' || per.papel || ' ' || per.sapel) END) AS nombre,
                  ARRAY_TO_JSON(ARRAY [clpr.idtipo, clpr.idclasificacion]) AS tipo
                FROM mod_datosmaestros.nom_clientesproveedor clpr
                  LEFT JOIN mod_estructuracomp.dat_estructura estru
                    ON (clpr.idestructura = estru.idestructura AND estru.idproyecto = 0)
                  LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona)
                  LEFT JOIN mod_persona.dat_docidentidad ident ON (clpr.idpersona = ident.idpersona)
                  LEFT JOIN mod_persona.dat_direccion direc ON (clpr.idpersona = direc.idpersona)
                  LEFT JOIN mod_persona.dat_foto dfoto ON (clpr.idpersona = dfoto.idpersona)
                  LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (dpa = dpt.iddpt)
                  LEFT JOIN mod_seguridad.seg_usuario su ON (clpr.idusuario = su.idusuario)
                  LEFT JOIN mod_datosmaestros.dat_clientesproveedormapa tmp
                    ON (clpr.idclientesproveedores = tmp.idclientesproveedores)
                  LEFT JOIN mod_datosmaestros.nom_clasificacioncontable cc
                    ON clpr.idclasificacioncontable = cc.idclasificacioncontable
                  LEFT JOIN mod_estructuracomp.nom_icono ni ON estru.idicono = ni.idicono
                WHERE clpr.idestructuracomun = $idestructura
                ORDER BY clpr.idclientesproveedores ASC;";
        return self::executeQuery($query);
    }

    public function getModelData($params)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $agStart = $params[0];
        $agLimit = $params[1];
        $agFiltre = $params[4];
        $agFiltre[] = array('field' => 'dominiofila',
                            'data'  => array('type'  => 'bit',
                                             'value' => $iddominio));
        $result = self::cargarcontrato(
            array($agFiltre, ' AND '), array(), null, $agLimit, $agStart
        );
        return $result;
    }

    public function filterListStore($params, $idestructura)
    {
        return self::executeQuery(
            "SELECT DISTINCT $params
          FROM mod_crmcontratacion.dat_contrato c
                INNER JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = c.idestado
                LEFT JOIN mod_crmcontratacion.nom_mediodepago nmp ON nmp.idmediodepago = c.idmediopago
                LEFT JOIN mod_crmcontratacion.nom_sector ns ON ns.idsector = c.idsector
         WHERE 
            ((c.idcontrato = c.idpadre AND (SELECT count(dc.idpadre)
            FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) OR
              (c.idcontrato != c.idpadre AND (SELECT count(dc.idpadre)
              FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0));"
        );
        //WHERE c.idestructuracomun = $idestructura AND
    }

    private function executeQuery($query)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();

        return $conexionActual->fetchAll($query);
    }

    public function getCantContratosporClienteproveedor($idestructura)
    {
        $query
            = "SELECT c.denominacionclienteproveedor,c.idclienteproveedor,count(c.idclienteproveedor) as cant
                  FROM mod_crmcontratacion.dat_contrato c WHERE c.idestructuracomun = $idestructura
                  GROUP BY idclienteproveedor,denominacionclienteproveedor";
        return $this->executeQuery($query);
    }

    public function getCantContratosporTipoContrato($idestructura)
    {
        $query
            = "SELECT c.idtipocontrato,c.denominaciontipocontrato,count(c.idtipocontrato) as cant
                  FROM mod_crmcontratacion.dat_contrato c WHERE c.idestructuracomun = $idestructura
                  GROUP BY idtipocontrato,denominaciontipocontrato";
        return $this->executeQuery($query);
    }

    public function getCantContratosportipoCliente($idestructura)
    {
        $query
            = "SELECT c.cliente,
                (CASE WHEN c.cliente = 1 THEN 'Contratos con clientes' else 'Contratos con proveedores' END)
                    as nombretipo,count(c.cliente) as cant
                  FROM mod_crmcontratacion.dat_contrato c
                  WHERE c.idestructuracomun = $idestructura GROUP BY cliente";
        return $this->executeQuery($query);
    }

    public function cargarDatosElemento($data)
    {
        $clase = $data['clase'];
        $ruta = $data['ruta'];
        $campo = $data['campo'];
        $tablename = $data['tablename'];
        $campowhere = $data['campowhere'];
        $idsselection = json_decode($data['idsselection']);
        $result = array();
        if ($tablename) {
            $query = "SELECT " . ($campo ? $campo . ' AS text ' : " * ") .
                " FROM $tablename " .
                ($campowhere ? "WHERE $campowhere IN (" . implode(
                        ',', $idsselection
                    ) . ") " : " ") .
                ($campo ? "ORDER BY $campo ;" : " ;");
            $result = $this->executeQuery($query);
        }
        return $result;
    }

    public function cargarMonedas()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $global->Estructura->idestructura;
        return self::executeQuery(
            "SELECT dm.idmonedaentidad, dm.idmoneda, dm.tipomoneda, nm.codigoiso, nm.nombremoneda
              FROM mod_datosmaestros.nom_moneda nm INNER JOIN mod_datosmaestros.dat_monedaentidad dm
              ON nm.idmoneda = dm.idmoneda WHERE dm.idestructuracomun = $idestructura ORDER BY tipomoneda;"
        );
    }

    public function cargarMonedasDominio($iddominio)
    {
        try {
            return self::executeQuery(
                "SELECT dmc.idmoneda,dmc.idcontrato,dmc.valor,nm.codigoiso FROM mod_crmcontratacion.dat_monedacontrato dmc
                 INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idcontrato = dmc.idcontrato
                 INNER JOIN mod_datosmaestros.nom_moneda nm ON nm.idmoneda = dmc.idmoneda
                 INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dc.idarea
                 WHERE nfe.dominiofila[$iddominio]=1::bit"
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cargarTasas($data)
    {
        $datosMaestros = new DatosMaestrosComunicationInterface();
        return $data['idmonedaentidad'] ? $datosMaestros->getTasasByMoneda(
            $data['idmonedaentidad']
        ) : array();
    }

    public function historial($data)
    {
        $idpadre = $data['idpadre'];
        $result = array();
        $i = 0;
        $iddominio = $data['iddominio'] ? $data['iddominio'] : 1;
        do {
            $result[] = self::historialContrato($idpadre,$iddominio);
            $idpadre = $result[$i]['idpadre'];
        } while ($result[$i]
        && $result[$i]['idcontrato'] != $result[$i++]['idpadre']);
        return $result;
    }

    public function historialContrato($idpadre,$iddominio)
    {
        $monedas = self::cargarMonedasContratoDominio($iddominio);
        $columnscrosstab = self::stringCrosstabMonedasColumns($monedas);
        $selectcrosstab = count($monedas) ? ','.self::stringCrosstabMonedasSelect($monedas) : '';
        $query = self::getStringSelectAll($selectcrosstab,$columnscrosstab,$iddominio) . "WHERE c.idcontrato = $idpadre";
        return self::executeQuery($query)[0];
    }

    private function getSqlInnerJoinHitosFacturar($incluir)
    {
        $sql = "";
        if ($incluir) {
            $sql
                = " INNER JOIN (SELECT dh.idcontrato FROM mod_crmcontratacion.dat_hito dh
                INNER JOIN mod_crmcontratacion.dat_hitoestado dhe ON (dhe.idhito = dh.idhito and dhe.fechafin ISNULL)
                INNER JOIN mod_crmcontratacion.nom_estado ne1 ON (ne1.idestado = dhe.idestado)
                INNER JOIN (SELECT n.*,VALUE FROM mod_crmcontratacion.nom_estado n,json_array_elements(n.acciones) ac 
                WHERE VALUE::VARCHAR = '\"fact\"') fact ON fact.idestado = ne1.idestado
                GROUP BY dh.idcontrato) dh ON dh.idcontrato = c.idcontrato ";
        }
        return $sql;
    }

    private function getFilterValue($filter,$search)
    {
//        return $filter[0];
        foreach ($filter[0] as $f) {
//            return $f;
            if ($f['field'] == $search) {
                return $f['data']['value'];
            }
        }
        return false;
    }

    public function cargarMonedasContratoDominio($iddominio)
    {
        try {
            return self::executeQuery(
                "SELECT DISTINCT nm.idmoneda,nm.codigoiso FROM mod_datosmaestros.dat_monedaentidad dme 
                        INNER JOIN mod_datosmaestros.nom_moneda nm ON nm.idmoneda = dme.idmoneda 
                        INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dme.idestructuracomun
                        WHERE nfe.dominiofila[$iddominio] = 1::bit ORDER BY nm.idmoneda"
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function stringCrosstabMonedasColumns($monedas){
        $result = ['"idcontrato" NUMERIC'];
        foreach ($monedas as $moneda){
//            print('/*'.$moneda['codigoiso'].'*/');
            $result[] = '"montomoneda_'.strtolower($moneda['codigoiso']).'_'.$moneda['idmoneda'].'" NUMERIC';
//            $result[] = '"montomoneda_'.strtolower($moneda['codigoiso']).'" NUMERIC';
        }
//        print_r($result);die;
        return implode(',',$result);
    }

    public function stringCrosstabMonedasSelect($monedas){
        foreach ($monedas as $moneda){
            $result[] = 'dmc.montomoneda_'.strtolower($moneda['codigoiso']).'_'.$moneda['idmoneda'];
//            $result[] = 'dmc.montomoneda_'.strtolower($moneda['codigoiso']);
        }
        return implode(',', $result);
    }

    private function obtenerIdsAreasHijas($idpadre){
        $areas = self::executeQuery("
            SELECT fe.idfila
            FROM  mod_estructuracomp.nom_filaestruc fe
            WHERE fe.parent_path <@
            (SELECT parent_path FROM mod_estructuracomp.nom_filaestruc fe2
            WHERE fe2.idfila = $idpadre )");
        $resultado=array($idpadre);
        if(count($areas)>1){
            foreach($areas as $a){
                if(!in_array($a['idfila'], $resultado)){
                    $resultado[]=$a['idfila'];
                }
            }
            return implode(',', $resultado);
        }
        else{
            $estructuracom=new EstructuraComunicationInterface();
            $estructuras=$estructuracom->obtenerHijos($idpadre);
            foreach($estructuras as $a){
                if(!in_array($a['id'], $resultado)){
                    $resultado[]=$a['id'];
                }
            }
            return implode(',', $resultado);
        }
    }

}
