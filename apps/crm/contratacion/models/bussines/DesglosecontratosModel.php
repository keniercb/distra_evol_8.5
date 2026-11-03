<?php

/**
 * Clase encargada de la gestion de solicitudes del
 * comite de aprobacion
 *
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class DesglosecontratosModel extends ZendExt_Model
{
    /**
     * ///Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->DatHitoContrato = new DatHitoContrato();
		$this->DatHitoAreaImplicada=new DatHitoAreaImplicada();
		$this->DatMonedaHitoAreaImplicada=new DatMonedaHitoAreaImplicada();
		$this->GestionfacturasModel=new GestionfacturasModel();
        $this->DatHitoCertificoDesglose=new DatHitoCertificoDesglose();
    }
	
	public function cargarHitosAreas($params){
		try{
			$query = new Doctrine_Query();
			$query="SELECT ha.*,
					COALESCE (desop.denominacion, des.denominacion) as denominacion,
					COALESCE (ha.idservicio,(SELECT hi.idindicador FROM mod_crmcontratacion.dat_indicadorhito hi 
					WHERE hi.idhito=ha.idhito)) as idservicio,
					COALESCE (i2.denominacion, (SELECT i.denominacion FROM mod_crmcontratacion.dat_indicadorhito hi2
					INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador=hi2.idindicador
					WHERE hi2.idhito=ha.idhito)) as servicio,
					n.denominacion as lineanegocio, i.denominacion as producto
					FROM mod_crmcontratacion.dat_hitoareaimplicada ha
					LEFT JOIN mod_estructuracomp.dat_estructura des ON (ha.idarea = des.idestructura and des.idproyecto = 0)
					LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (ha.idarea = desop.idestructuraop and desop.idproyecto = 0) 
					LEFT JOIN mod_datosmaestros.nom_naturaleza n ON (n.idnaturaleza = ha.idlineanegocio) 
					LEFT JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = ha.idproducto) 
					LEFT JOIN mod_datosmaestros.nom_indicador i2 ON (i2.idindicador = ha.idservicio) 
					";
//            INNER JOIN mod_crmcontratacion.dat_hito h ON h.idhito=ha.idhito
//					LEFT JOIN mod_crmcontratacion.dat_indicadorhito ih ON ih.idhito=ha.idhito
			$filtros=array();
			if($params['filter']){	
				foreach(json_decode($params['filter']) as $filtro){
					$filtros[]=$filtro->property.'='.$filtro->value;
				}
			}
			if(count($filtros)){
				$query.=" WHERE ".implode(' AND ', $filtros);
			}
			$conn = Doctrine_Manager::getInstance()->getCurrentConnection();
			$result=$conn->fetchAll($query);
			foreach($result as &$r){
                $temp=$conn->fetchAll(
                    "SELECT mha.*, m.codigoiso 
                    FROM mod_crmcontratacion.dat_monedahitoareaimplicada mha
                    LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mha.idmoneda
                    WHERE mha.idhitoareaimplicada=".$r['idhitoareaimplicada']);
                foreach($temp as $t){
                    $r['montomoneda_'.strtolower($t['codigoiso']).'_'.$t['idmoneda']]=$t['valor'];
                    $r['porcientomoneda_'.strtolower($t['codigoiso']).'_'.$t['idmoneda']]=$t['porciento'];
                    $r['disribucionmonedas']=true;
                }
            }
			return array('success'=>true, 'data'=>$result);
		}catch (Doctrine_Exception $e) {
            return array(
				'success'=>false, 'code'=>$e->getCode(), 'msg'=>$e->getMessage());
        }
	}
	
	public function guardarAreasImplicadas($params){
		try{
			$datos=json_decode($params['areas']);
			$guardadas = $datos->guardadas;
			$eliminados = $datos->eliminadas;
			if(count($guardadas)){
				foreach($guardadas as $g){
					// print_r((array)$g);die;
//                    $indicador=Doctrine::getTable('DatIndicadorHito')->find($g->idindicadorhito);
//                    if($indicador){
//                        $indicador->denominacion=$g->servicio;
//                        $indicador->idindicador=$g->idservicio;
//                        $indicador->save();
//                    }
					$idhitoareaimplicada=$this->DatHitoAreaImplicada->guardar((array)$g);
					if($g->monedas){
					    foreach($g->monedas as $m){
					        $moneda=(array)$m;
					        $moneda['idhitoareaimplicada']=$idhitoareaimplicada;
                            $this->DatMonedaHitoAreaImplicada->guardar($moneda);
                        }
                    }
				}
			}
			if (count($eliminados)) {
			    foreach($eliminados as $e){
                    $this->DatHitoAreaImplicada->eliminarPorParametros((array)$e);
                }
//                $this->DatHitoAreaImplicada->eliminarLista($eliminados);
            }
            $this->guardarHitosDatosAdicionales(json_decode($params['datoshitos']));
			return array('success'=>true);
		}catch (Doctrine_Exception $e) {
            return array(
				'success'=>false, 'code'=>$e->getCode(), 'msg'=>$e->getMessage());
        }
	}

    private function guardarHitosDatosAdicionales($data)
    {
        try{
            foreach ($data as $actual) {
                $idhito = DatHitoContrato::guardarHitoDatosAdicionales(
                    $actual
                );
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

	public function getAreasTodas($params){
         $idestructura = $this->global->Estructura->idestructura;
        $idpadre = $params['node'] ? $params['node'] : $idestructura;
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $datos=$conn->fetchAll(
            "SELECT fila.idfila AS id, fila.idfila AS idarea,
            fila.idpadre AS _parent, i.icono as icon, fila.orden,
            CASE
                WHEN estructura.denominacion <> '' THEN estructura.abreviatura
                WHEN estructuraop.denominacion <> '' THEN estructuraop.abreviatura
            END AS abreviatura,
            CASE
                WHEN estructura.denominacion <> '' THEN estructura.denominacion
                WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
            END AS text,
            CASE
                WHEN estructura.denominacion <> '' THEN estructura.denominacion
                WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
            END AS denominacion,
            CASE
                WHEN estructura.denominacion <> '' THEN estructura.denominacion
                WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
            END AS qtip,
            NOT EXISTS(
              SELECT f.idfila
              FROM mod_estructuracomp.nom_filaestruc AS f
              LEFT JOIN mod_estructuracomp.dat_estructura e ON ( e.idestructura = f.idfila AND e.idproyecto = 0 )
              LEFT JOIN mod_estructuracomp.dat_estructuraop op ON ( op.idestructuraop = f.idfila AND op.idproyecto = 0)
              WHERE f.fechafin IS NULL AND 
              (e.idestructura IS NOT NULL OR op.idestructuraop IS NOT NULL)
              AND f.idpadre = fila.idfila AND f.idpadre <> f.idfila
            ) as leaf
            FROM mod_estructuracomp.nom_filaestruc fila
            INNER JOIN mod_estructuracomp.nom_concepto nomeav 
                ON fila.idconcepto = nomeav.idconcepto
            INNER JOIN mod_estructuracomp.nom_icono i 
                ON i.idicono = nomeav.idicono
            LEFT JOIN mod_estructuracomp.dat_estructura estructura
                ON (estructura.idestructura = fila.idfila AND estructura.idproyecto = 0)
            LEFT JOIN mod_estructuracomp.nom_icono iest 
                ON iest.idicono = estructura.idicono
            LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                ON (estructuraop.idestructuraop = fila.idfila AND estructuraop.idproyecto = 0)
            WHERE fila.fechafin IS NULL AND 
                (estructura.denominacion <> '' OR estructuraop.denominacion <> '') AND
                fila.idpadre = $idpadre AND fila.idfila <> fila.idpadre
                ORDER BY fila.orden"
        );
        if($params['node']){
            $result=$datos;
        }else{
            $padre=$conn->fetchAll("SELECT e.idestructura as id, e.idestructura as idarea,
                e.denominacion as text, e.abreviatura, e.denominacion as qtip, 
                false as leaf, true as expanded, c.denominacion as tipo_concepto, i.icono as icon
                FROM mod_estructuracomp.dat_estructura e
                INNER JOIN mod_estructuracomp.nom_filaestruc fe on(e.idestructura=fe.idfila)
                LEFT JOIN mod_estructuracomp.nom_concepto c ON(fe.idconcepto=c.idconcepto)
                LEFT JOIN mod_estructuracomp.nom_icono i ON i.idicono=c.idicono
                WHERE e.idestructura=".$this->global->Estructura->idestructura);
            $padre[0]['children']=$datos;
            $result=$padre;
        }
        return array('success'=>true, 'children'=>$result);
    }

    public function cargarHitos($params){
//        $filt = new stdClass();
//        if($params['idcontratos']) {
//            $filt->property = 'idcontrato';
//            $filt->value = json_decode($params['idcontratos']);
//        }
//        $filt->ultimocontrato=true;
//        $filt->idestructura = $this->global->Estructura->idestructura;
        $params=$this->crearFiltrosHitosPorDefecto($params);
        $filt->filter=$params['filter'];
        $params['ultimocontrato']=false;
        $params['idestructura']=$this->global->Estructura->idestructura;
		//print_r($params);die;
        $result = $this->DatHitoContrato->cargarhitoscontrato($params);
		
        $metaData = $this->GestionfacturasModel->getMetaData($result[0]);
        return array(
            'data'           => $result,
            'cant' => $result[0]['count'],
//            'monedasentidad' => $monedas['monedas'],
            'metaData'       => $metaData,
//            'estados' => $estados
            );
    }
    public function crearFiltrosHitosPorDefecto($params)
    {
        if (!$params['filter']) {
            $params['filter'] = [];
        }
//        if ($params['idcontratos']) {
//            $params['filter'][] = array('field' => 'dh.idcontrato',
//                'data'  => array('type'  => 'numeric',
//                    'value' => json_decode(
//                        $params['idcontratos']
//                    )));
//        }
//        $params['filter'][] = array('field' => 'nfe.dominiofila',
//            'data'  => array('type'  => 'bit',
//                'value' => 1));
        $params['filter'][] = array('field' => 'vigente',
            'data'  => array('type'  => 'boolean',
                'value' => false));
        $params['filter'][] = array('field' => 'dc.contratomarco',
            'data'  => array('type'  => 'numeric',
                'value' => 0));
        $params['filter'][] = array('field' => 'dc.cliente',
            'data'  => array('type'  => 'numeric',
                'value' => 1));
        /*$params['filter'][] = array('field' => 'dc.montototal',
                                    'data'  => array('type'       => 'numeric',
                                                     'comparison' => 'gt',
                                                     'value'      => 0));
        $params['filter'][] = array('field' => 'montototal',
                                    'data'  => array('type'       => 'numeric',
                                                     'comparison' => 'gt',
                                                     'value'      => 0));
        $params['filter'] = array_merge(
            $params['filter'], $this->crearFiltroMontosNull($params['monedas'])
        );*/
        return $params;
    }
    public function certificarDesglose($params){
        try {
            $dontwork=0;
            $hitos=json_decode($params['idhitos']);
            foreach ($hitos as $idhito) {
//                print('/*'.$params['certificar'].'*/');
                if($params['certificar']=='true'){
                    $lista=$this->DatHitoCertificoDesglose->listarPorCondicion(
                        'idusuario='.$this->global->Perfil->idusuario.' AND idhito='.$idhito);
//                    print_r($lista);die;
                    if(count($lista)==0){
                        $this->DatHitoCertificoDesglose->guardar(
                            array(
                                'idusuario' => $this->global->Perfil->idusuario,
                                'idhito' => $idhito,
                            )
                        );
                    }else{
                        $dontwork++;
                    }
                }else{
                    $this->DatHitoCertificoDesglose->eliminarPorCondicion(
                        'idhito='.$idhito);
                }
            }
            $respuesta=array('success'=>true, 'dontwork'=> $dontwork);
            if($dontwork)
                $respuesta['msg']=$dontwork==count($hitos)?
                    'No se pudo certificar. Los desgloses fueron certificados previamente.':
                    'No se pudo certificar algunos desgloses. Los demás desgloses fueron certificados satisfactoriamente.';
            return $respuesta;
		}catch (Doctrine_Exception $e) {
            return array(
                'success'=>false, 'code'=>$e->getCode(), 'msg'=>$e->getMessage());
        }
    }

    public function cargarHitosHeredar($params){
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $where='';
        if($params['filter']) {
            foreach ($params['filter'] as $f) {
                if($f['field']=='montototal'){
                    $conditions[]='a.montototal = '.$f['data']['value'];
                }else if($f['field']=='idhitos'){
                    $conditions[]='a.idhito NOT IN ('.$f['data']['value'].')';
                }
            }
            if(count($conditions))$where=' WHERE '.implode(' AND ', $conditions);
        }
//        print($where);die;
        $estado = new NomEstado();
        $estados=array();
        foreach($estado->getEstadoByAction('endedwork', false) as $est){
            $estados[]=$est['idestado'];
        }
        $query="SELECT h.*, c.numero as numerocontrato, c.nombre as nombrecontrato,
            (SELECT SUM(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh
            WHERE mh.idhito=h.idhito) as montototal
            FROM mod_crmcontratacion.dat_hito h
            INNER JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=h.idcontrato
            LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (ce.idcontrato=c.idcontrato AND ce.fechafin IS NULL)
            LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=ce.idestado
            WHERE c.cliente=1 AND c.contratomarco=0 AND 
            e.idestado IN (".implode(',', $estados).")";
//        ((c.idcontrato = c.idpadre AND (SELECT count(dc.idpadre)
//             FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) OR
//             (c.idcontrato != c.idpadre AND (SELECT count(dc.idpadre)
//             FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0))
        $result=$conn->fetchAll(
            "SELECT a.* FROM ($query) a $where"
        );
        return array('success'=>true, 'data'=>$result);
    }

    public function guardarHerencia($params){
        try{
            $aiheredar=Doctrine::getTable('DatHitoAreaImplicada')->findByDql(
                'idhito=?', array($params['idhitoheredar']));
//            print_r($aiheredar);die;
            if (count($aiheredar)) {
                foreach(json_decode($params['idhitos']) as $idhito){
                    $query = Doctrine_Query::create()->delete()->from('DatHitoAreaImplicada')
                        ->where('idhito=?', array($idhito))
                        ->execute();
                    foreach($aiheredar as $areaimpl){
                        $nueva=new DatHitoAreaImplicada();
                        $nueva->idhito=$idhito;
                        $nueva->idarea=$areaimpl['idarea'];
                        $nueva->porciento=$areaimpl['porciento'];
                        $nueva->monto=$areaimpl['monto'];
                        $nueva->idlineanegocio=$areaimpl['idlineanegocio'];
                        $nueva->idservicio=$areaimpl['idservicio'];
                        $nueva->idproducto=$areaimpl['idproducto'];
                        $nueva->save();
                    }
                }
            }
            return array('success'=> true);
        }catch (Doctrine_Exception $e) {
            return array(
                'success'=>false, 'code'=>$e->getCode(), 'msg'=>$e->getMessage());
        }
    }
   
} 