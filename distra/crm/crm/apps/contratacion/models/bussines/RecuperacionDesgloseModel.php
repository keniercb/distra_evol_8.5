<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:39 PM
 */

class RecuperacionDesgloseModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->DatHitoContrato = new DatHitoContrato();
    }

    public function getMainRecuperacionDesglose($params){
        $result=array();
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $extraWhere='';
        $start=$params['start'];
        $limit=$params['limit'];
		//print_r($params);die;
		
		$fechainicio=$params[filter][50][data][value];
		//print_r($fechainicio);die;
		$fechafin=$params[filter][51][data][value];
		
//        $filters= $this->DatHitoContrato->getFilters($params['filter']);
//        if (count($filters))$extraWhere.= ' AND ' . implode(" AND ", $filters);
        $filters2=$this->getFilters($params['filter']);
        if (count($filters2))$extraWhere.= ' WHERE ' . implode(" AND ", $filters2);
        $query="SELECT count(a.idhito) over(), a.* FROM (SELECT  dh.*, 
           c.nombre as nombrecontrato, c.numerocontrato, 
           COALESCE (desop1.denominacion, des1.denominacion) as nombreareacontrato,
           e1.nombre as nombreestadocontrato,
           COALESCE (desop.denominacion, des.denominacion) as nombrearea,
           e.nombre as nombreestado, dhe.fechainicio, e.icono as iconoestado,
           COALESCE (round(ef.preciotarifaoriginal*ef.cantidad,2) , round(preciotarifabase*ef.cantidad,2) )as montofacturaunica, 
           ef.idelementofactura, df.nrofactura, d.estado,
           (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito) as montototal,
           (SELECT sum(hai.monto) FROM mod_crmcontratacion.dat_hitoareaimplicada hai WHERE hai.idhito=dh.idhito) as montodesglose,
           (SELECT count(hai.idhitoareaimplicada) FROM mod_crmcontratacion.dat_hitoareaimplicada hai WHERE hai.idhito=dh.idhito) as cantareas,
           (SELECT sum(round( mi.valor * ih.cantidad,2)) FROM mod_crmcontratacion.dat_monedaindicador mi 
            INNER JOIN mod_crmcontratacion.dat_indicadorhito ih ON(mi.idindicadorhito=ih.idindicadorhito) WHERE ih.idhito=dh.idhito)  as montoindicador,
           COALESCE (round(ef.preciotarifaoriginal*ef.cantidad,2) , round(preciotarifabase*ef.cantidad,2) ) as montofactura,
           (SELECT count(ef.idelementofactura) FROM  mod_logfacturacion.dat_elementosfactura ef
                 INNER JOIN mod_logistica.dat_documento d ON (d.iddocumento=df.idfactura AND d.estado = 4)
                 WHERE ef.idhito=dh.idhito) as cantfacturas
           FROM mod_crmcontratacion.dat_hito dh
           LEFT JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=dh.idcontrato
		   LEFT JOIN mod_estructuracomp.dat_estructura des ON (dh.idarea = des.idestructura and des.idproyecto = 0) 
           LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (dh.idarea = desop.idestructuraop and desop.idproyecto = 0) 
           LEFT JOIN mod_crmcontratacion.dat_hitoestado dhe ON (dh.idhito=dhe.idhito AND dhe.fechafin IS NULL)
           LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=dhe.idestado
           LEFT JOIN mod_estructuracomp.dat_estructura des1 ON (c.idarea = des1.idestructura and des1.idproyecto = 0) 
           LEFT JOIN mod_estructuracomp.dat_estructuraop desop1 ON (c.idarea = desop1.idestructuraop and desop1.idproyecto = 0) 
           LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (c.idcontrato=ce.idcontrato AND ce.fechafin IS NULL)
           LEFT JOIN mod_crmcontratacion.nom_estado e1 ON e1.idestado=ce.idestado
           INNER JOIN mod_logfacturacion.dat_elementosfactura ef ON (ef.idhito=dh.idhito)
           INNER JOIN mod_logfacturacion.dat_docfactura df ON (df.idfactura=ef.idfactura) 
           INNER JOIN mod_logistica.dat_documento d ON (d.iddocumento=df.idfactura)
		   INNER JOIN (SELECT n.*,VALUE FROM mod_crmcontratacion.nom_estado n,json_array_elements(n.acciones) ac 
           WHERE VALUE::VARCHAR = '\"postfact\"') fact ON fact.idestado = dhe.idestado
           WHERE c.cliente=1 AND (dhe.fechainicio BETWEEN '$fechainicio' AND '$fechafin' OR d.fechacontable BETWEEN '$fechainicio' AND '$fechafin') 
           AND d.estado=4
           ORDER BY c.idcontrato, dh.numero, dh.fechaestimada
           ) as a $extraWhere LIMIT $limit OFFSET $start";
		   
//((COALESCE(dh.fechareplanificada,dh.fechaestimada) BETWEEN '$fechainicio' AND '$fechafin') or (dhe.fechainicio BETWEEN '$fechainicio' AND '$fechafin' ) )
        //print($query);die;
        $result=$conexionActual->fetchAll($query);
		
//        foreach($result as &$r){
//           $infoareas=$conexionActual->fetchAll(
//               "SELECT count(ha.idhitoareaimplicada) as cantareas,sum(ha.monto) as montodesglose
//                FROM mod_crmcontratacion.dat_hitoareaimplicada ha
//                WHERE ha.idhito=".$r['idhito']
//           );
//           $r['cantareas']=$infoareas[0]['cantareas'];
//           $r['montodesglose']=0;
//           if($infoareas[0]['cantareas']>0)
//               $r['montodesglose']=$infoareas[0]['montodesglose'];
//
//           $pago = DatMonedaHito::cargarMonedasHito(
//               array(
//                   'idhito'       => $r['idhito'],
//                   'idestructura' => $this->global->Estructura->idestructura)
//           );
//           $total = 0;
//           foreach ($pago as $p) {
//               $total = $total + (float)$p['monto'];
//           }
//           $r['pago'] = $pago;
//           $r['montototal'] = $total;
//		   //$final +=  $r['montototal'];
//
//		   $indicador = $this->cargarindicadoreshito($r['idhito']);
//		   foreach ($indicador as $valoresindicador) {
//			   $totalindicador=0;
//			   $totalfinal=0;
//               $modenasindicador= $this->cargarvalorindicador($valoresindicador['idindicadorhito']);
//			   foreach ($modenasindicador as $valores) {
//                    $totalindicador = $totalindicador + (float)$valores['valor'];
//               }
//               $totalfinal = $totalfinal + $totalindicador;
//           }
//		   $r['montoindicador'] = $totalfinal;
//        }
//        $mostrarTipos=$this->getFilterValue($params['filter'], 'mostrartipos');
//        if ($mostrarTipos) {
//            $query
//                = "SELECT * FROM(" . $query . ")a WHERE " . $this->filtroMostrarTipos($mostrarTipos);
//        }
      
        $cant=count($result)>0?$result[0]['count']:0;
        return array('success' => true, 'data' => $result, 'total' => $cant,
            'monedasentidad'=>$this->getArrayMonedasEntidad($this->global->Estructura->idestructura));
    }

    private function getFilters($filtros){
       $where = [];
       foreach ($filtros as $f) {
           $value = $f['data']['value'];
           $type = $f['data']['type'];
           $comparison = $f['data']['comparison'];
           $field = in_array($f['field'], $columns) ? 'c.' . $f['field'] : $f['field'];
           if($type=='string'){
               $where[] = $this->getStringFilter($field, $value);
           }else if($type=='int') {
               $where[] = $this->getNumericFilter($field, $value);
           }else if($type=='list') {
               $where[] = $this->getListFilter($field, $value);
           }else if($type=='numeric') {
               $where[] = $this->getNumericFilter($field, $value);
           }else if ($f['field'] == 'mostrartipos') {
               $where[] = $this->filtroMostrarTipos($value);
           }/*else if($field=='fechafin'){
               if ($comparison == 'lt') {
                   $where[]="(COALESCE(dh.fechareplanificada,dh.fechaestimada) ='" . $value ."')";
               }
               if ($comparison == 'gt') {
                    $where[]="(COALESCE(dh.fechareplanificada,dh.fechaestimada) ='" . $value ."')";
               }
           }*/
       }
       return $where;
    }

    private function getStringFilter($field, $value)
    {
        if ($value) {
            return "a.$field ILIKE '%" . $value . "%'";
        }
    }

    private function getNumericFilter($field, $value)
    {
        if ($value) {
            return "a.$field =" . $value;
        }
    }

    private function getListFilter($field, $value)
    {
//        print($value);die;
        if ($value) {
            if (!is_array($value)) {
                $value = json_decode($value);
                $value = !is_array($value) ? [$value] : $value;
            }
            return "a.$field .  IN (" . implode(',', $value) . ")";
        }
    }

	public function cargarindicadoreshito($idhito)
    {
	    $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $query= "SELECT idindicadorhito
                 FROM mod_crmcontratacion.dat_indicadorhito where idhito=$idhito ";
				 
		$a = $conexionActual->fetchAll($query);		 
        return $a;
    }

	public function cargarvalorindicador($idindicador)
    {
	    $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $query= "SELECT idmonedaindicador, idmoneda, idindicadorhito, valor
                 FROM mod_crmcontratacion.dat_monedaindicador where idindicadorhito=$idindicador";
				 
		$ab = $conexionActual->fetchAll($query);		 
        return $ab;
    }

    private function filtroMostrarTipos($value){
        $tipos = [];
        foreach (explode(',', $value) as $tipo) {
            if ($tipo == 'correctos') {
                $tipos[] = "(a.cantareas>0 AND a.montototal=a.montodesglose AND a.montototal=a.montoindicador AND a.montototal=a.montofactura)";
            }else if ($tipo == 'incorrectos') {
                $tipos[] = "(a.cantareas>0 AND (a.montototal<>a.montodesglose OR a.montototal<>a.montoindicador OR a.montototal<>a.montofacturaunica))";
            }else if ($tipo == 'sindesglose') {
                $tipos[] = "(a.cantareas=0)";
            }else if ($tipo == 'incorrectosdesglose') {
                $tipos[] = "(a.cantareas>0 AND (a.montototal<>a.montodesglose))";
            }else if ($tipo == 'incorrectosindicador') {
                $tipos[] = "(a.cantareas>0 AND (a.montototal<>a.montoindicador))";
            }else if ($tipo == 'incorrectosfactura') {
                $tipos[] = "(a.cantareas>0 AND (a.montototal<>a.montofactura))";
            }
        }
        return '('.implode(' OR ', $tipos).')';
    }

    private function filtroMostrarTipos2($value){
       $tipos = [];
       foreach (explode(',', $value) as $tipo) {
           if ($tipo == 'correctos') {
               $tipos[] = "
                    EXISTS(SELECT hai.idhitoareaimplicada FROM mod_crmcontratacion.dat_hitoareaimplicada hai
                        WHERE hai.idhito=dh.idhito) AND 
                        (
                            (
                                (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito) =
                                (SELECT sum(hai.monto) FROM mod_crmcontratacion.dat_hitoareaimplicada hai WHERE hai.idhito=dh.idhito)
                            ) AND
                            (
                                (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito)=
                                (SELECT sum(ef.preciotarifaoriginal*ef.cantidad) FROM  mod_logfacturacion.dat_elementosfactura ef
                                 INNER JOIN mod_logistica.dat_documento d ON (d.iddocumento=df.idfactura AND d.estado = 4)
                                 WHERE ef.idhito=dh.idhito)
                            ) 
                        )
                        ";
//               AND
//               (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito)=
//                        (SELECT sum(hai.monto) FROM  mod_logfacturacion.dat_elementosfactura ef ON (ef.idhito=dh.idhito)
//                        INNER JOIN mod_logfacturacion.dat_docfactura df ON (df.idfactura=ef.idfactura) )
//               $tipos[]="(a.cantareas>0 AND a.montototal==a.montodesglose)";
           } else if ($tipo == 'incorrectos') {
               $tipos[] = "
               
                    EXISTS(SELECT hai.idhitoareaimplicada FROM mod_crmcontratacion.dat_hitoareaimplicada hai
                        WHERE hai.idhito=dh.idhito) AND 
                        (
                            (
                                (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito) <>
                                (SELECT sum(hai.monto) FROM mod_crmcontratacion.dat_hitoareaimplicada hai WHERE hai.idhito=dh.idhito)
                            ) OR
                            (
                                (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito)<>
                                (SELECT sum(ef.preciotarifaoriginal*ef.cantidad) FROM  mod_logfacturacion.dat_elementosfactura ef
                                 INNER JOIN mod_logistica.dat_documento d ON (d.iddocumento=df.idfactura AND d.estado = 4)
                                 WHERE ef.idhito=dh.idhito)
                            ) 
                        )
                ";
//               $tipos[]="(a.cantareas>0 AND a.montototal!=a.montodesglose)";
           } else if ($tipo == 'sindesglose') {
               $tipos[] = "NOT EXISTS(SELECT hai.idhitoareaimplicada FROM mod_crmcontratacion.dat_hitoareaimplicada hai
                        WHERE hai.idhito=dh.idhito)";
//               $tipos[]="a.cantareas==0";
           }else if ($tipo == 'indicador') {
               $tipos[] = "(EXISTS(SELECT id.idindicadorhito FROM mod_crmcontratacion.dat_indicadorhito id
                        WHERE id.idhito=dh.idhito) AND 
                        (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito)<>
                        (SELECT sum(mi.valor) FROM mod_crmcontratacion.dat_monedaindicador mi WHERE mi.idindicadorhito=id.idindicadorhito))";
//               $tipos[]="(a.cantareas>0 AND a.montototal!=a.montodesglose)";
           } 
       }
       return '('.implode(' OR ', $tipos).')';
    }

    private function getFilterValue($filter, $search)
    {
//        return $filter[0];
        foreach ($filter as $f) {
//            return $f;
            if ($f['field'] == $search) {
                return $f['data']['value'];
            }
        }
        return false;
    }

    private function getArrayMonedasEntidad($idestructura)
    {
        try {
            $resultado = $this->_datosmaestros->getMonedasEntidad(
                $idestructura
            );
//            foreach($resultado as $r){
//                $this->_extrafields['montomoneda_'.strtolower($r['codigoiso']).'_'.$r['idmoneda']]= array('type' => 'int');
//            }
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }
}
