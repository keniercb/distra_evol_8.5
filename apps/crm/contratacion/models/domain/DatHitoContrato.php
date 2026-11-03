<?php

/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:44 PM
 */
class DatHitoContrato extends BaseDatHitoContrato
{

    public function setUp()
    {
        parent::setUp();
    }

    public function cargarhitoscontrato($post)
    {
        try {
            //print_r($post);die;
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $where = '';
            if ($post['idcontratos']) {
                $idcontratos=json_decode($post['idcontratos']);
                if (is_array($idcontratos)) {
                    $where = "WHERE dh.idcontrato in (" . implode(
                            ',', $idcontratos) . ")";
                } else {
                    $where = "WHERE dh.idcontrato = " . $idcontratos;
                }
            }
            if ($post['listofactura'] == 1) {
                $where .= ($where != '' ? ' AND ' : ' WHERE ')
                    . 'fact.idestado NOTNULL';
            }
//            print_r($post->filter);die;
            $filters= DatHitoContrato::getFilters($post['filter']);
//            $filters= $this->getFilters($post['filter']);
            if($post['ultimocontrato']){
                $filters[] = $this->getFilterSuplemento();
            }
			$start=$post['start'];
			$limit=$post['limit'];
			
			if (is_null($limit) && is_null($start)) {
                $start = 0;
                $limit = "NULL";
            }
			else{			
                $start=$post['start'];
                $limit=$post['limit'];
			}
            if (count($filters)) {
                $where.= ($where != '' ? ' AND ' : ' WHERE ') . implode(" AND ", $filters);
            }
            //dh.idiguala as idperiodicidad , p.denominacion as periodicidad, , (CASE WHEN fact.idestado NOTNULL THEN 1 ELSE 0 END) as listofactura
            $order=DatHitoContrato::getSort($post['sort']);
//            $order=$this->getSort($post['sort']);
            $query
                = "SELECT  dh.*, dh.fechaestimada as fechafin, 
            dc.numerocontrato,dc.idcontrato,dc.idcondicionpago,dc.fechafirma,ncp.idclientesproveedores,
            (CASE WHEN ncp.registrado = 0 THEN ncp.nombre else COALESCE (dest.denominacion, dper.nombre||' '||dper.papel||' '||dper.sapel) END) as nombre,
            (CASE WHEN ncp.registrado = 0 THEN ncp.codigo else COALESCE (dest.codigo, did.numero) END) as codigo,
            COALESCE (desop.denominacion, des.denominacion) as nombrearea, 
            e.idestado, e.nombre AS nombreestado, e.icono as iconoestado,
            e.inicial, dhe.fechainicio, ln.denominacion as lineanegocio,
            EXISTS(SELECT hai.idhitoareaimplicada FROM mod_crmcontratacion.dat_hitoareaimplicada hai
                WHERE hai.idhito=dh.idhito) as tieneareasimplicadas,
            EXISTS(SELECT ef.idelementofactura FROM mod_logfacturacion.dat_elementosfactura ef
                WHERE ef.idhito=dh.idhito) as tienefactura,
            p.idperiodicidad , p.denominacion as periodicidad,
            (CASE WHEN fact.idestado NOTNULL THEN 1 ELSE 0 END) as listofactura,
            hcd.idusuario as idusuariocertifico, hcd.fecha as fechacertifico, u.nombreusuario as usuariocertifico
            FROM mod_crmcontratacion.dat_hito dh 
            INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idcontrato = dh.idcontrato
            LEFT JOIN mod_crmcontratacion.dat_hitoestado dhe ON (dh.idhito=dhe.idhito AND dhe.fechafin IS NULL)
            LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=dhe.idestado
            LEFT JOIN (SELECT n.idestado FROM mod_crmcontratacion.nom_estado n,json_array_elements(n.acciones) ac 
            WHERE VALUE::VARCHAR = '\"fact\"') fact ON fact.idestado = dhe.idestado
            LEFT JOIN mod_estructuracomp.dat_estructura des ON (dh.idarea = des.idestructura and des.idproyecto = 0) 
            LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (dh.idarea = desop.idestructuraop and desop.idproyecto = 0) 
            LEFT JOIN mod_crmcontratacion.nom_periodicidad p ON p.idperiodicidad=dh.idiguala
            INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (dc.idarea = nfe.idfila)
            INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp ON ncp.idclientesproveedores = dc.idclienteproveedor
            LEFT JOIN mod_estructuracomp.dat_estructura dest ON (ncp.idestructura = dest.idestructura and dest.idproyecto=0)
            LEFT JOIN mod_persona.dat_persona dper ON (ncp.idpersona = dper.idpersona)
            LEFT JOIN mod_persona.dat_docidentidad did ON (dper.idpersona = did.idpersona)
            LEFT JOIN mod_crmcontratacion.dat_hitocertificodesglose hcd ON (dh.idhito=hcd.idhito)
            LEFT JOIN mod_seguridad.seg_usuario u on (hcd.idusuario = u.idusuario)
            LEFT JOIN mod_datosmaestros.nom_naturaleza ln on (ln.idnaturaleza = dh.idlineanegocio)
            " . $where . "  $order LIMIT $limit OFFSET $start";
//           print($query);die;
//            SELECT table_name FROM information_schema.columns
//            WHERE table_name='nom_lineanegocio'
//            AND table_catalog = 'TUDB'
//            AND table_schema = 'mod_crmcontratacion'

		   
		   $querytotal
                = "SELECT count(dh.idhito) 
            FROM mod_crmcontratacion.dat_hito dh 
            INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idcontrato = dh.idcontrato
            LEFT JOIN mod_crmcontratacion.dat_hitoestado dhe ON (dh.idhito=dhe.idhito AND dhe.fechafin IS NULL)
            LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=dhe.idestado
            LEFT JOIN (SELECT n.idestado FROM mod_crmcontratacion.nom_estado n,json_array_elements(n.acciones) ac 
            WHERE VALUE::VARCHAR = '\"fact\"') fact ON fact.idestado = dhe.idestado
            LEFT JOIN mod_estructuracomp.dat_estructura des ON (dh.idarea = des.idestructura and des.idproyecto = 0) 
            LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (dh.idarea = desop.idestructuraop and desop.idproyecto = 0) 
            LEFT JOIN mod_crmcontratacion.nom_periodicidad p ON p.idperiodicidad=dh.idiguala
            INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (dc.idarea = nfe.idfila)
            INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp ON ncp.idclientesproveedores = dc.idclienteproveedor
            LEFT JOIN mod_estructuracomp.dat_estructura dest ON (ncp.idestructura = dest.idestructura and dest.idproyecto=0)
            LEFT JOIN mod_persona.dat_persona dper ON (ncp.idpersona = dper.idpersona)
            LEFT JOIN mod_persona.dat_docidentidad did ON (dper.idpersona = did.idpersona)
            " . $where . "";
           
		   
		   
            $datoshito = $conexionActual->fetchAll($query);
			$counttotal = $conexionActual->fetchAll($querytotal);
			
			//print_r($counttotal);die;
//            print_r($post->idestructura);die;
            foreach ($datoshito as $index => $hito) {
			    $datoshito[$index]['count']=$counttotal[0]['count'];
                $pago = DatMonedaHito::cargarMonedasHito(
                    array(
                        'idhito'       => $hito['idhito'],
                        'idestructura' => $post['idestructura'])
                );
                $total = 0;
                foreach ($pago as $p) {
                    $total = $total + (float)$p['monto'];
                }
                $datoshito[$index]['pago'] = $pago;
//                $datoshito[$index]['monto'] = $total;
                $datoshito[$index]['montototal'] = $total;
                foreach($pago as $p){
                    $datoshito[$index]['montomoneda_'.strtolower($p['moneda']).'_'.$p['idmoneda']]=$p['monto'];
                }
            }
            foreach ($datoshito as $index => $hito) {
			    
                $indicadores = DatIndicadorHito::cargarIndicadoresHito(
                    array('idhito' => $hito['idhito'])
                );
                foreach ($indicadores as $indexindi => $indi) {
                    $moneda = DatMonedaIndicador::cargarMonedasIndicador(
                        array('idindicador'  => $indi['idindicadorcontrato'],
                              'idestructura' => $post['idestructura'])
                    );
                    if (count($moneda)) {
                        foreach ($moneda as $mon) {
                            if ($mon['moneda'] == 'CUP') {
                                $indicadores[$indexindi]['precio']
                                    = $mon['monto'];
                            }
                            if ($mon['moneda'] == 'CUC') {
                                $indicadores[$indexindi]['preciodivisa']
                                    = $mon['monto'];
                            }
                        }
                    }
                }
                 $datoshito[$index]['indicadores'] = $indicadores;
            }
			//print_r($datoshito);die;
            return $datoshito;
        } catch (Doctrine_Exception $e) {
//            throw $e;
            throw $e;
        }
    }

    private function getSort($sort){
        if ($sort) {
            $sort = json_decode($sort);
            $query = " ORDER BY";
            $result = [];
            foreach ($sort as $field) {
                $result[] = " $field->property $field->direction";
            }
            return $query . implode(',', $result);
        }
        return " ORDER BY numero ASC";
    
    }

    static function eliminarHitos($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatHitoContrato')
            ->whereIn('idhito', $array)
            ->execute();
    }

    static function eliminarHitosPermitidos($array)
    {
        $final=[];
        foreach($array as $a){
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $aux=$conexionActual->fetchAll(
                "SELECT count(idelementofactura) FROM mod_logfacturacion.dat_elementosfactura WHERE idhito=".$a
            );
            if($aux[0]['count']==0)$final[]=$a;
//            print('/*'.$aux[0]['count'].'*/');
        }
        if(count($final)) {
            $query = Doctrine_Query::create();
            $query->delete()->from('DatHitoContrato')
                ->whereIn('idhito', $final)
                ->execute();
        }
//        return array('cant'=>$aux[0]['count']);
    }

    public function guardarHitoContrato($valor, $idcontrato, $addsuplemento)
    {
        try {
            $hito = $valor->idhito ? Doctrine::getTable('DatHitoContrato')
                ->find($valor->idhito)
                : new DatHitoContrato();
            if (!$valor->idhito) {
                $hito->fechacreacion = date('Y-m-d');
            }
            $hito->descripcion = $valor->descripcion;
            $hito->vigencia = $valor->vigencia ? $valor->vigencia : null;
            $hito->unidadtiempo = $valor->unidadtiempo ? $valor->unidadtiempo
                : null;
            $hito->numero = $valor->numero;
            // $hito->fechacreacion = $valor->fechacreacion;
            $hito->fechaestimada = $valor->fechafin ? $valor->fechafin : null;
            $hito->idcontrato = $idcontrato;
            $hito->idarea = $valor->idarea;
            $hito->idiguala = $valor->idperiodicidad ? $valor->idperiodicidad : null;
            $hito->idlineanegocio = $valor->idlineanegocio ? $valor->idlineanegocio : null;
            $hito->save();
            $idhito = $hito->idhito;
            foreach ($valor->pago as $moneda) {
                if ($addsuplemento == 'true') {
                    $moneda->idmonedahito = null;
                }
                DatMonedaHito::guardarMonedaHito($moneda, $hito);
            }
            $idsIndicadores=array();
            if ($valor->arrayIndicadores) {
                if (count($valor->arrayIndicadores->modificados)) {
                    foreach ($valor->arrayIndicadores->modificados as $indicador) {
                        $idsIndicadores[]=$indicador->idindicadorcontrato;
                        if ($addsuplemento == 'true') {
                            $indicador->idindicadorcontrato = null;
                        }
                        DatIndicadorHito::guardarIndicadorHito($indicador, $hito);
                    }
                }
                if (count($valor->arrayIndicadores->eliminados)) {
                    DatIndicadorHito::eliminarIndicadoresHitos(
                        $valor->arrayIndicadores->eliminados
                    );
                }
            }
            if ($addsuplemento == 'true') {
                if (count($valor->indicadores)) {
                    foreach ($valor->indicadores as $indicador) {
                        if(!in_array($indicador->idindicadorcontrato, $idsIndicadores)){
                            $indicador->idindicadorcontrato = null;
                            DatIndicadorHito::guardarIndicadorHito($indicador, $hito);
                        }
                    }
                }
            }
            return $idhito;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function guardarHitoDatosAdicionales($valor){
        try{
            $hito = $valor->idhito ? Doctrine::getTable('DatHitoContrato')
                ->find($valor->idhito)
                : new DatHitoContrato();
            if (!$valor->idhito) {
                $hito->fechacreacion = date('Y-m-d');
            }
            $hito->idlineanegocio = $valor->idlineanegocio ? $valor->idlineanegocio : null;
            $hito->save();
            if ($valor->arrayIndicadores) {
                if (count($valor->arrayIndicadores->modificados)) {
                    foreach ($valor->arrayIndicadores->modificados as $indicador) {
                        $idsIndicadores[]=$indicador->idindicadorcontrato;
                        DatIndicadorHito::guardarIndicadorHitoDatosAdicionales($indicador, $hito);
                    }
                }
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getHitosDominio($params, $columnas, $group, $sum)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            $filters = $this->getFilters($params['filter']);
            $dominiofilter = $this->findFilter('dominio', $filters);
            $query = $this->getMainQuery($columnas, $sum, $dominiofilter);
            if($params['ultimocontrato']){
                $filters[] = $this->getFilterSuplemento();
            }
            if (count($filters)) {
                $where = " WHERE " . implode(" AND ", $filters);
                $query .= $where;
            }
            $query .= $this->getGroupQuery($group);
            $query .= $this->getSortQuery($params['sort']);
            if (!is_null($params['start']) && !is_null($params['limit'])) {
                $query .= " offset " . $params['start'] . " limit "
                    . $params['limit'];
            }
            $result = $conexion->fetchAll($query);

            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function getMainQuery($columns, $sum, $dominiofilter)
    {
        if ($dominiofilter) {
            $crosstabwhere = "WHERE $dominiofilter";
        }
        return "SELECT dh.*,dh.fechareplanificada, dh.fechaestimada,COALESCE (dh.fechareplanificada, dh.fechaestimada) as fechafin,dmh.*,("
            . implode('+', $sum) . ") as montototal,
                count(dh.idhito) over(),dc.numerocontrato,dc.idcontrato,dc.idcondicionpago,dc.fechafirma,ncp.idclientesproveedores,
                (CASE WHEN ncp.registrado = 0 THEN ncp.nombre else COALESCE (dest.denominacion, dper.nombre||' '||dper.papel||' '||dper.sapel) END) as nombre,
                (CASE WHEN ncp.registrado = 0 THEN ncp.codigo else COALESCE (dest.codigo, did.numero) END) as codigo,
                COALESCE (desop.denominacion, des1.denominacion) as nombrearea,
                dhe.idestado,ne.nombre as nombreestado,ne.icono as iconoestado,ne.inicial,dhe.fechainicio,
                EXISTS(SELECT hai.idhitoareaimplicada FROM mod_crmcontratacion.dat_hitoareaimplicada hai
                WHERE hai.idhito=dh.idhito) as tieneareasimplicadas
                FROM mod_crmcontratacion.dat_hito dh
                LEFT JOIN mod_crmcontratacion.dat_indicadorhito dih ON dh.idhito = dih.idhito
                INNER JOIN crosstab('SELECT dmh.idhito,dmh.idmoneda,dmh.valor FROM mod_crmcontratacion.dat_monedahito dmh ORDER BY 1,2',
                'SELECT DISTINCT nm.idmoneda FROM mod_datosmaestros.dat_monedaentidad dme INNER JOIN mod_datosmaestros.nom_moneda nm ON
                nm.idmoneda = dme.idmoneda INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dme.idestructuracomun
                INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idestructuracomun = dme.idestructuracomun
                $crosstabwhere ORDER BY nm.idmoneda') AS dmh ("
            . implode(",", $columns) . ") on dh.idhito = dmh.idhito
                INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idcontrato = dh.idcontrato
                LEFT JOIN mod_crmcontratacion.dat_hitoestado dhe ON (dh.idhito = dhe.idhito and dhe.fechafin ISNULL)
                INNER JOIN mod_datosmaestros.nom_clientesproveedor ncp ON ncp.idclientesproveedores = dc.idclienteproveedor
                LEFT JOIN mod_estructuracomp.dat_estructura dest ON (ncp.idestructura = dest.idestructura and dest.idproyecto=0)
                LEFT JOIN mod_estructuracomp.dat_estructura des1 ON (dh.idarea = des1.idestructura and des1.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (dh.idarea = desop.idestructuraop and desop.idproyecto = 0)
                LEFT JOIN mod_persona.dat_persona dper ON (ncp.idpersona = dper.idpersona)
                LEFT JOIN mod_persona.dat_docidentidad did ON (dper.idpersona = did.idpersona)
                INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (dc.idarea = nfe.idfila)
                INNER JOIN mod_crmcontratacion.nom_estado ne ON (ne.idestado = dhe.idestado)";
    }

    private function getSortQuery($sort)
    {
        if ($sort) {
            $sort = json_decode($sort);
            $query = " ORDER BY";
            $result = [];
            foreach ($sort as $field) {
                $result[] = " $field->property $field->direction";
            }
            return $query . implode(',', $result);
        }
        return " ORDER BY fechafin ASC";
    }

    private function getGroupQuery($group)
    {
        return " GROUP BY dh.idhito,dc.numerocontrato,dc.idcontrato,ncp.idclientesproveedores,dest.idestructura,
            dest.denominacion,dper.nombre,dper.papel,dper.sapel,dest.codigo,did.numero,dhe.idestado,desop.denominacion,
            des1.denominacion,ne.nombre,ne.icono,ne.inicial,dhe.fechainicio," . implode(
                ",", $group
            );
    }

    public function getFilters($params)
    {
        $isstring = array('string', 'character varying', 'varchar');
        $isnumeric = array('int', 'numeric');
        $filter = array();
		//print_r($params);die;
        foreach ($params as $param) {
            $field = $param['field'];
            $type = $param['data']['type'];
            $value = $param['data']['value'];
            $comparison = $param['data']['comparison'];
            if (in_array($type, $isnumeric)) {
                $result = $this->getNumericFilter($field, $value, $comparison);
            }
            if (in_array($type, $isstring)) {
                $result = $this->getStringFilter($field, $value);
            }
            if ($type == 'bit') {
                $result = $this->getBitFilter($field, $value);
            }
            if ($type == 'date') {
                $result = $this->getDateFilter($field, $value, $comparison);
            }
            if ($type == 'boolean') {
                $result = $this->getBooleanFilter($field, $value);
            }
            if ($type == 'list') {
                $result = $this->getListFilter($field, $value);
            }
            if ($result) {
                $filter[] = $result;
            }
        }
        return $filter;
    }

    private function getNumericFilter($field, $value, $comparison)
    {
        if ($value || $value == 0) {
            $field = $this->changeFieldName($field);
            if ($comparison) {
                if ($comparison == 'lt') {
                    return $field . " < " . $value;
                }
                if ($comparison == 'gt') {
                    return $field . " > " . $value;
                }
                if ($comparison == 'eq') {
                    return $field . " = " . $value;
                }
                if ($comparison == 'null') {
                    return $field . $value;
                }
            } else {
                if (is_array($value)) {
                    return $field . " IN (" . implode(',', $value) . ")";
                } else {
                    return $field . " = " . $value;
                }
            }
        }
    }

    private function getStringFilter($field, $value)
    {
        $field = $this->changeFieldName($field);
        if ($value) {
            return "$field ILIKE '%" . $value . "%'";
        }
    }

    private function getBitFilter($field, $value)
    {
        $field = $this->changeFieldName($field);
        if ($value) {
            return $field . "[" . $value . "] = 1::bit";
        }
    }

    private function getDateFilter($field, $value, $comparison)
    {
        $field = $this->changeFieldName($field);
        if ($value) {
            list($moth, $day, $year) = explode(
                '/', $value
            );
            $value = "$day/$moth/$year";
            if($field=='fechafin'){
                if ($comparison == 'lt') {
                    return " COALESCE(dh.fechareplanificada, dh.fechaestimada) <= '" . $value . "' ";
                }
                if ($comparison == 'gt') {
                    return " COALESCE(dh.fechareplanificada, dh.fechaestimada) >= '" . $value . "' ";
                }
            }else{
                if ($comparison == 'lt') {
                    return $field . " <= '" . $value . "'";
                }
                if ($comparison == 'gt') {
                    return $field . " >= '" . $value . "'";
                }
                if ($comparison == 'eq') {
                    return $field . " = '" . $value . "'";
                }
            }
        }
    }

    private function findFilter($name, $filters)
    {
        foreach ($filters as $value) {
            if (strpos($value, $name) !== false) {
                return $value;
            }
        }
        return false;
    }

    public function getBooleanFilter($field, $value)
    {
        $field = $this->changeFieldName($field);
        if ($value) {
            if ($field == 'vigente') {
                return $value
                    ?
                    "(dc.cumplimientoobligaciones=1 OR 
                                    dc.fechafirma <='" . date('d/m/Y')
                    . "' AND (dc.fechafin>='" . date('d/m/Y')
                    . "' OR dc.fechafin ISNULL ))"
                    : "(( dc.fechafirma >'" . date('d/m/Y') . "' OR dc.fechafin<'"
                    . date('d/m/Y')
                    . "' OR dc.fechafirma ISNULL) AND dc.cumplimientoobligaciones = 0)";
            }
            return $field . " = " . $value;
        }
    }

    public function getListFilter($field, $value)
    {
        $field = $this->changeFieldName($field);
        $fields = array('idestado' => 'dhe.idestado');
        if ($value) {
            if (!is_array($value)) {
                $value = json_decode($value);
                $value = !is_array($value) ? [$value] : $value;
            }
            $field = $fields[$field] ? $fields[$field] : $field;
            return $field . " IN (" . implode(',', $value) . ")";
        }
    }

    public function refactorResponse($result)
    {
        foreach ($result as $key => $row) {
            $result[$key]['indicadores'] = json_decode($row['indicadores']);
        }
        return $result;
    }

    public function obtenerMonedaDominio($iddominio)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            if (!$iddominio) {
                return array();
            }
            $query
                = "SELECT DISTINCT nm.idmoneda,nm.codigoiso FROM mod_datosmaestros.dat_monedaentidad dme
                      INNER JOIN mod_datosmaestros.nom_moneda nm ON nm.idmoneda = dme.idmoneda
                      INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dme.idestructuracomun
                      INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idestructuracomun = dme.idestructuracomun
                      WHERE nfe.dominiofila[$iddominio] = 1::bit ORDER BY nm.idmoneda;";
            $result = $conexion->fetchAll($query);
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function changeFieldName($field)
    {
        $map=array("nombrearea"=>'desop.denominacion');
        if($map[$field])return $map[$field];
//        if(in_array($field, array()))
        $columns = $this->getTable()->getColumnNames();
        if (in_array($field, $columns)) {
            $field = 'dh.' . $field;
        }
        return $field;
    }

    private function getFilterSuplemento(){
        return "((dc.idcontrato = dc.idpadre AND (SELECT count(dc1.idpadre)
                 FROM mod_crmcontratacion.dat_contrato dc1 WHERE dc.idcontrato = dc1.idpadre) = 1) OR
                 (dc.idcontrato != dc.idpadre AND (SELECT count(dc2.idpadre)
                 FROM mod_crmcontratacion.dat_contrato dc2 WHERE dc.idcontrato = dc2.idpadre) = 0))";
    }

}