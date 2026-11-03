<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:39 PM
 */

class ReporteContratacionModel extends ZendExt_Model
{

    private $_idestructura;
    private $_estructuracomunicacion;
    private $_solicitudpago;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_estructuracomunicacion = new EstructuraComunicationInterface();
        $this->_solicitudpago = new SolicitudPagoModel();
    }

    public function obtenerEstados(){
        return $this->_solicitudpago->cargarEstados('hitospagos', false);
    }

    private function getFiltroContratoVigente(){
        return "  c.cliente=1 
                AND 
                  c.contratomarco=0 
                AND 
                  (c.cumplimientoobligaciones=1 
                  OR 
                  c.fechafirma <='" . date('d/m/Y') . "' 
                AND 
                  (c.fechafin>='" . date('d/m/Y') . "' 
                  OR 
                  c.fechafin ISNULL)) 
                AND 
                  ((c.idcontrato = c.idpadre 
                   AND 
                  (SELECT count(dc.idpadre) FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) 
                   OR
                  (c.idcontrato != c.idpadre 
                   AND 
                  (SELECT count(dc.idpadre) FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0)) ";
    }

    private function filtroContratoSinFirmar(){
        return "  c.cliente=1 
                AND 
                  c.contratomarco=0 
                AND 
                  c.fechafirma IS NULL
                AND 
                  ((c.idcontrato = c.idpadre 
                  AND 
                  (SELECT count(dc.idpadre) FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) 
                  OR
                 (c.idcontrato != c.idpadre 
                  AND 
                 (SELECT count(dc.idpadre) FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0)) ";
    }

    private function filtroContratosTodos(){
        return "  c.cliente=1 
                AND 
                  c.contratomarco=0 
                AND 
                  ((c.idcontrato = c.idpadre 
                  AND 
                  (SELECT count(dc.idpadre) FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1) 
                  OR
                 (c.idcontrato != c.idpadre 
                  AND 
                 (SELECT count(dc.idpadre) FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0)) ";
    }

    private function calcularTotales($obj, $concepto, $valores){
        if(!$obj[$concepto]){
            $obj[$concepto]=array();
        }
        foreach($valores as $value){
            if(count($obj[$concepto])>0){
                $existe=false;
                foreach($obj[$concepto] as $index=>$o){
                    if($o['codigoiso']==$value['codigoiso']){
                        $obj[$concepto][$index]['valor']=floatval($obj[$concepto][$index]['valor'])+floatval($value['valor']);
                        $existe=true;
                    }
                }
                if($existe==false){
                    $obj[$concepto][]=array('valor'=>floatval($value['valor']), 'codigoiso'=>$value['codigoiso']);
                }
            }else{
                $obj[$concepto][]=array('valor'=>floatval($value['valor']), 'codigoiso'=>$value['codigoiso']);
            }
        }
        return $obj;
    }

    public function cargarContratosXArea($params, $listarContratos=true){
        try {
            $idpadre = $this->global->Estructura->idestructura;
            if ($params['node'] != 'root') {
                $idpadre = $params['node'];
            }
            if($params['node']=='root'){
                $padre=$this->doQuery(
                    "SELECT e.denominacion as text, e.abreviatura, e.denominacion as qtip, 
                false as leaf, true as expanded, c.denominacion as tipo_concepto, i.icono as icon
                FROM mod_estructuracomp.dat_estructura e
                INNER JOIN mod_estructuracomp.nom_filaestruc fe on(e.idestructura=fe.idfila)
                LEFT JOIN mod_estructuracomp.nom_concepto c ON(fe.idconcepto=c.idconcepto)
                LEFT JOIN mod_estructuracomp.nom_icono i ON i.idicono=c.idicono
                WHERE idestructura=".$this->global->Estructura->idestructura);
            }
//            $data = $this->integrator->metadatos->DameHijosEstructura($idpadre);
            $data = $this->_estructuracomunicacion->getEstructura($idpadre);
            $extraparams="";
//            print('/*1:'.count($data).'*/');
            if($params['filter']){
                $data=$this->doFilterArea($data, $params['filter']);
                $extraparams=$this->obtenerFiltrosGenerales($params);
                if($extraparams!=""){$extraparams=' AND '.$extraparams;}
            }
//            print_r($data);die;
//            print('/*3:'.$extraparams.'*/');die;
            $estados=$this->_solicitudpago->cargarEstados('hitospagos', false);
//            $areasdivisiones=array(100530047,100531789,100531801,100531185,100530195,100530196,100530197,100531677,100530223,100531601,100531579,100531589,100531615,100531621,100531631,100531697,100531717,100531703,100530399,100530234,100530233,100531395,100530232,100530136,100530132,100530137,100530312,100530322,100530331,100530337,100530343,100530317,100530227,100530229,100530228,100530230,100530166,100530165,100530168,100530433,100530284,100530289,100530135,100530133,100531042,100531033,100531645,100531671,100530306,100530422,100530164,100530279,100530294,100530274,100531039,100531038,100531171,100531196,100531806,100531037,100531651,100531035,100531687,100531661,100531854,100531855,100531856,100531760,100531775,100531779,100531845,100530134,100531163,100530349,100531201,100530231,100531770,100530198,100531034,100531036,100530167);
//            $array_centros=array();
            foreach ($data as $index => $value) {
//                $data[$index]->tipo = 'Área';
                $areas=$this->obtenerIdsAreasHijas($value->id);
//                $array_areas=$this->obtenerIdsAreasHijas($value->id)['1'];
//                foreach($array_areas as $rrr){
//                    $array_centros[]=$rrr;
//                }
                //listar contratos
//                if($listarContratos){
//                    // identificar cantidad de contratos del area
////                    $existenCont = $this->doQuery("
////                            SELECT count(c.idcontrato) FROM mod_crmcontratacion.dat_contrato c
////                            INNER JOIN mod_crmcontratacion.dat_hito h ON h.idcontrato=c.idcontrato
////                            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito and he.fechafin is NULL)
////                            WHERE ".$this->filtroContratosTodos()."
////                             AND c.idarea IN (" . $areas.") ".$extraparams
////                    );
//                    $existenCont = $this->doQuery("
//                            SELECT count(c.idcontrato) FROM mod_crmcontratacion.dat_contrato c
//                            INNER JOIN mod_crmcontratacion.dat_hito h ON h.idcontrato=c.idcontrato
//                            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito and he.fechafin is NULL)
//                            WHERE ".$this->getFiltroContratoVigente()." AND he.idestado=894
//                             AND c.fechafirma IS NOT NULL AND c.idarea IN (" . $areas.") ".$extraparams
//                    );
//                    if($value->id==100530047){
////                        $areasdivisiones=$areas;
////                        print($areas);die;
//                    }
////                    WHERE ".$this->getFiltroContratoVigente()." AND c.idarea=" . $value->id." ".$extraparams
////                    print('/*4: '.$value->text.'...cant:'.$existenCont[0]['count'].'...leaf:'.$data[$index]->leaf.'*/');
//                    $data[$index]->cantcontratos=$existenCont[0]['count'];
//                    if ($existenCont[0]['count'] > 0) {
//                        $data[$index]->leaf = false;
//                    }
//                }
                // total monedas contrato  //100530444 comedores

//                if($value->id=='100530132'){print('/*areas:'.$areas.'*/');die;}
                $todosFirmados=$this->obtenerTotalesAreasFirmadosTodos($areas, $extraparams);
                $totalContratado=array();
                $totalSinEjecutar=array();
                foreach($todosFirmados as $tf){
                    if($tf['inicial']==1){
                        if(!$totalSinEjecutar[$tf['codigoiso']]) {
                            $totalSinEjecutar[$tf['codigoiso']]=0;
                        }
                        $totalSinEjecutar[$tf['codigoiso']]+=floatval($tf['valor']);
                    }
                    if(!$totalContratado[$tf['codigoiso']]) {
                        $totalContratado[$tf['codigoiso']]=0;
                    }
                    $totalContratado[$tf['codigoiso']]+=floatval($tf['valor']);
                }
                $finalContratado=[];$finalSinEjecutar=[];
                foreach($totalContratado as $indtc=>$tc){
                    $finalContratado[]=array('valor'=>$tc, 'codigoiso'=>$indtc);
                }
                foreach($totalSinEjecutar as $indtse=>$tse){
                    $finalSinEjecutar[]=array('valor'=>$tse, 'codigoiso'=>$indtse);
                }
                $finalSinFirmar=$this->obtenerTotalesAreaSinFirmar($areas, $extraparams);
                $data[$index]->total_sinfirmar=$finalSinFirmar;
                $data[$index]->total_contratado=$finalContratado;
                $data[$index]->total_sinejecutar=$finalSinEjecutar;
//                $data[$index]->total_contratado=$this->obtenerTotalesAreaFirmados($areas, $extraparams);
//                $data[$index]->total_sinejecutar=$this->obteneroneiinEjecutar($areas, $extraparams);
                foreach($estados as $estado){
                    $monhitos=$this->obtenerTotalesPorEstados($areas, $estado['idestado'], $extraparams);
                    if(count($monhitos)>0) {
                        $data[$index]->{'fac_' . str_replace([' ', '.'], '', strtolower($estado['nombre']))} = $monhitos;
                        if(in_array($estado['acciones'],array('["readyfact"]','["postfact"]', '["newfact"]', '["historial"]'))){
                            if($data[$index]->total_facturado){
                                foreach($monhitos as $aux){
                                    foreach($data[$index]->total_facturado as $ind=>$aux2) {
                                        if($aux2['codigoiso']==$aux['codigoiso']){
                                            $data[$index]->total_facturado[$ind]['valor']=
                                                floatval($aux['valor'])+floatval($aux2['valor']);
                                        }
                                    }
                                }
                            }else{
                                $data[$index]->total_facturado=$monhitos;
                            }
                        }else{
                            if($data[$index]->total_ejecutado){
                                foreach($monhitos as $aux){
                                    foreach($data[$index]->total_ejecutado as $ind=>$aux2) {
                                        if($aux2['codigoiso']==$aux['codigoiso']){
                                            $data[$index]->total_ejecutado[$ind]['valor']=
                                                floatval($aux['valor'])+floatval($aux2['valor']);
                                        }
                                    }
                                }
                            }else{
                                $data[$index]->total_ejecutado=$monhitos;
                            }
//                        $data[$index]->{'fac_' . strtolower($estado['nombre'])} = $monhitos;
                        }

                    }
                }
                if($params['node']=='root'){
                    foreach($value as $ind=>$val){
                        if(strpos($ind, 'total_')===0 || strpos($ind, 'fac_')===0){
                            $padre[0]=$this->calcularTotales($padre[0], $ind, $val);
                        }
                    }
//                    $padre[0]=$this->calcularTotales($padre[0], 'total_sinfirmar',$finalSinFirmar );
//                    $padre[0]=$this->calcularTotales($padre[0], 'total_contratado',$finalContratado );
//                    $padre[0]=$this->calcularTotales($padre[0], 'total_sinejecutar',$finalSinEjecutar );
                }
            }

//            $array_centros=array_unique($array_centros);
//            $aaa=array_diff($areasdivisiones,$array_centros);
//            print_r($aaa);die;

            $contratos=array();
            if($listarContratos) {
                $contratos = $this->cargarContratos($idpadre, $extraparams, $estados);
            }

            $datos = array_merge($data, $contratos);
            // version sin cargar nodo por nodo
//                    $datos=$this->listarAreas($this->_idestructura);
            //estados
//            $estados=$this->_solicitudpago->cargarEstados('hitospagos');
            $result=$datos;
            if($params['node']=='root') {
                $padre[0]['children'] = $datos;
                $result=$padre[0];
            }
            return $result;
//            return array('success' => true, 'children' => $datos, 'cant' => count($datos));
        }catch(Exception $e){
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
//            throw $e
        }
    }

    private function obtenerIdsParentPath($consulta){
        $aux=array();
        foreach($consulta as $cons){
            foreach(explode('.', $cons['parent_path']) as $id){
                if(!in_array($id, $aux)){
                    $aux[]=$id;
                }
            }
//                    $aux[]=$cons['idestructuraop'];
        }
        return $aux;
    }

    private function doFilterArea($data, $params){
        $result=array();
        $pertenecen=array();
        $filtros=json_decode($params);
        foreach($filtros as $filt) {
            if($filt->property=='area'){
                $aux=array();
                foreach ($data as $area) {
                    if (stristr($area->text, $filt->value)) {
                        $aux[] = $area->id;
                    }
                }
                $pertenecen[]=$aux;
            }else if($filt->property=='idarea'){
                $consulta=$this->doQuery(
                    "SELECT DISTINCT fe.parent_path
                     FROM mod_estructuracomp.dat_estructuraop e
                     INNER JOIN mod_estructuracomp.nom_filaestruc fe 
                     ON fe.idfila=e.idestructuraop
                     WHERE e.idestructuraop IN (".implode(',', $filt->value).")"
                );
                $pertenecen[]=$this->obtenerIdsParentPath($consulta);
            }
            else if(stristr($filt->property, 'rangofechas')){
                $aux=[];
                foreach($data as $da){
                    $aux[]=$da->id;
                }
                $pertenecen[]=$aux;
////            }else if($filt->property=='rangofechas'){
//                $where=" WHERE ".$this->obtenerFiltroFecha(
//                    $filt->value, $filt->property=='rangofechas_fe'?'fechaestimada':'fechareplanificada');
////                print_r("SELECT DISTINCT fe.parent_path
////                     FROM mod_estructuracomp.dat_estructuraop e
////                     INNER JOIN mod_estructuracomp.nom_filaestruc fe
////                     ON fe.idfila=e.idestructuraop
////                     INNER JOIN mod_crmcontratacion.dat_hito h
////                     ON h.idarea=e.idestructuraop
////                     LEFT JOIN mod_crmcontratacion.dat_hitoestado he
////                     ON (h.idhito=he.idhito AND he.fechafin is NULL)
////                     ".$where);die;
//                $consulta=$this->doQuery(
//                    "SELECT DISTINCT fe.parent_path
//                     FROM mod_estructuracomp.dat_estructuraop e
//                     INNER JOIN mod_estructuracomp.nom_filaestruc fe
//                     ON fe.idfila=e.idestructuraop
//                     INNER JOIN mod_crmcontratacion.dat_hito h
//                     ON h.idarea=e.idestructuraop
//                     LEFT JOIN mod_crmcontratacion.dat_hitoestado he
//                     ON (h.idhito=he.idhito AND he.fechafin is NULL)
//                     ".$where
//                );
////                print(count($consulta));
////                print("SELECT DISTINCT e.idestructuraop
////                     FROM mod_estructuracomp.dat_estructuraop e
////                     INNER JOIN mod_crmcontratacion.dat_hito h
////                     ON h.idarea=e.idestructuraop ".$where);die;
////                foreach($consulta as $cons){
////                    foreach(explode('.', $cons['parent_path']) as $id){
////                        if(!in_array($id, $aux)){
////                            $aux[]=$id;
////                        }
////                    }
//////                    $aux[]=$cons['idestructuraop'];
////                }
//                $pertenecen[]=$this->obtenerIdsParentPath($consulta);
            }
            else if($filt->property=='contrato'){
                $consulta=$this->doQuery(
                    "SELECT DISTINCT fe.parent_path
                     FROM mod_estructuracomp.dat_estructuraop e
                     INNER JOIN mod_estructuracomp.nom_filaestruc fe 
                     ON fe.idfila=e.idestructuraop
                     INNER JOIN mod_crmcontratacion.dat_hito h 
                     ON h.idarea=e.idestructuraop 
                     INNER JOIN mod_crmcontratacion.dat_contrato c 
                     ON c.idcontrato=h.idcontrato 
                     WHERE c.nombre ILIKE '%".$filt->value."%'"
                );
//                foreach($consulta as $cons){
//                    foreach(explode('.', $cons['parent_path']) as $id){
//                        if(!in_array($id, $aux)){
//                            $aux[]=$id;
//                        }
//                    }
////                    $aux[]=$cons['idestructuraop'];
//                }
                $pertenecen[]=$this->obtenerIdsParentPath($consulta);
            }
        }
        $validos=array_shift($pertenecen);
        if(count($pertenecen)>0){
            while(count($pertenecen)>0){
                $validos=array_intersect($validos,array_shift($pertenecen));
            }
        }
        foreach ($data as $area) {
//            $ids=explode('.', $area->parent_path);
//            foreach($ids as $i){
//                if(in_array($i, $validos)){
//                    $result[]=$area;
//                }
//            }
            if(in_array($area->id, $validos)){
                $result[]=$area;
            }
        }
        return $result;
    }

    private function obtenerFiltrosGenerales($params){
        $extraparams="";
        if($params['filter']) {
            $filtros = json_decode($params['filter']);
            $aux = array();
            foreach ($filtros as $filt) {
                if(stristr($filt->property, 'rangofechas')){
                    $aux[]=$this->obtenerFiltroFecha($filt->value,
                        $filt->property=='rangofechas_fe'?'fechaestimada':'fechareplanificada');
                }else if($filt->property=='contrato'){
                    $aux[]=" c.nombre ILIKE '%".$filt->value."%' ";
                }else if($filt->property=='idsector'){
                    $aux[]=" c.idsector = ".$filt->value." ";
                }
            }
        }
        if(count($aux)>0){
            $extraparams=implode($aux, ' AND ');
        }
        return $extraparams;
    }

    private function obtenerFiltroFecha($fechas, $fecha='fechaestimada'){
//        $fechas=json_decode($filtrofecha);
        $where="";
        //'2017-12-10'
        if($fechas->inicial!='' && $fechas->final!=''){
            if($fecha=='fechaestimada'){
                $where.=" he.fechainicio BETWEEN '".$fechas->inicial."' 
                    AND '".$fechas->final."' ";
            }else{
                $where.=" h.".$fecha." BETWEEN '".$fechas->inicial."'
                    AND '".$fechas->final."' ";
            }
        }else{
            if($fecha=='fechaestimada') {
                if ($fechas->inicial != '') {
                    $where .= " he.fechainicio >'" . $fechas->inicial . "' ";
                }
                if ($fechas->final != '') {
                    $where .= " he.fechainicio <'" . $fechas->final . "' ";
                }
            }else{
                if($fechas->inicial!=''){$where.=" h.".$fecha.">'".$fechas->inicial."' ";}
                if($fechas->final!=''){$where.=" h.".$fecha."<'".$fechas->final."' ";}
            }

        }
        return $where;
    }

    private function sumarFormatoRaroInventao($data, $atributo, $montos){
        if($data){
            foreach($montos as $aux){

                foreach($data as $ind=>$aux2) {
                    if($aux2['codigoiso']==$aux['codigoiso']){
                        $data[$ind]['valor']=
                            floatval($aux['valor'])+floatval($aux2['valor']);
                    }
                }
            }
        }else{
            $data=$montos;
        }
    }

    private function obtenerIdsAreasHijas($idpadre){
        $nombres=array();
        $areas = $this->doQuery("
            SELECT e.idestructuraop, e.denominacion, e.idproyecto
            FROM mod_estructuracomp.dat_estructuraop e
              LEFT JOIN mod_estructuracomp.nom_filaestruc fe ON fe.idfila=e.idestructuraop
            WHERE fe.parent_path <@
            (SELECT parent_path FROM mod_estructuracomp.nom_filaestruc fe2
              LEFT JOIN mod_estructuracomp.dat_estructuraop e2 ON fe2.idfila=e2.idestructuraop
            WHERE fe2.idfila = $idpadre AND e2.idproyecto=0) AND e.idproyecto=0");
        $resultado=array($idpadre);
        foreach($areas as $a){
            if(!in_array($a['idestructuraop'], $resultado) && $a['idproyecto']==0){
                $resultado[]=$a['idestructuraop'];
                $nombres[]=$a['denominacion'];
            }
        }
//        if($idpadre==100530047){
//        if($idpadre==10053004733333333){
////            print(count($resultado));
////            print_r($nombres);
//            $aux=array();
//            $nombresaux=array();
//            foreach($resultado as $i){
//                $areasaux = $this->doQuery("
//                    SELECT e.idestructuraop, e.denominacion
//                    FROM mod_estructuracomp.dat_estructuraop e
//                      LEFT JOIN mod_estructuracomp.nom_filaestruc fe ON fe.idfila=e.idestructuraop
//                    WHERE fe.parent_path <@
//                    (SELECT parent_path FROM mod_estructuracomp.nom_filaestruc
//                    WHERE idfila = $i) AND e.idproyecto=0");
//                foreach($areasaux as $aa){
//                    if(!in_array($aa['idestructuraop'], $aux)){
//                        $aux[]=$aa['idestructuraop'];
//                        $nombresaux[]=$aa['denominacion'];
//                    }
//                }
//            }
////            print(count($aux));
////            print_r($nombresaux);die;
//        }
        return implode(',', $resultado);
//        return array('1'=>$resultado, '2'=>implode(',', $resultado));
    }

    private function obtenerTotalesAreaSinFirmar($areas, $extraparams=""){
        return $this->doQuery("
            SELECT sum(mh.valor) as valor, m.codigoiso
            FROM mod_crmcontratacion.dat_contrato c
            LEFT JOIN mod_crmcontratacion.dat_hito h ON h.idcontrato=c.idcontrato
            INNER JOIN mod_crmcontratacion.dat_monedahito mh ON mh.idhito=h.idhito
            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito and he.fechafin is NULL)
            LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
            WHERE ".$this->filtroContratoSinFirmar()." AND
            c.fechafirma IS NULL AND c.idarea IN (" . $areas . ") ".$extraparams."
            GROUP BY m.codigoiso ORDER BY m.codigoiso"
        );
    }

    private function obtenerTotalesAreaFirmados($areas, $extraparams=""){
//        print("SELECT sum(mh.valor) as valor, m.codigoiso
//            FROM mod_crmcontratacion.dat_contrato c
//            LEFT JOIN mod_crmcontratacion.dat_hito h ON h.idcontrato=c.idcontrato
//            INNER JOIN mod_crmcontratacion.dat_monedahito mh ON mh.idhito=h.idhito
//            LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
//            WHERE ".$this->getFiltroContrato()." AND
//        c.fechafirma IS NOT NULL AND h.idarea IN (" . $areas . ") ".$extraparams."
//            GROUP BY m.codigoiso ORDER BY m.codigoiso ");die;
        return $this->doQuery("
            SELECT sum(mh.valor) as valor, m.codigoiso
            FROM mod_crmcontratacion.dat_contrato c
            LEFT JOIN mod_crmcontratacion.dat_hito h ON h.idcontrato=c.idcontrato
            INNER JOIN mod_crmcontratacion.dat_monedahito mh ON mh.idhito=h.idhito
            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito and he.fechafin is NULL)
            LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
            WHERE ".$this->getFiltroContratoVigente()." AND
            c.fechafirma IS NOT NULL AND c.idarea IN (" . $areas . ") ".$extraparams."
            GROUP BY m.codigoiso ORDER BY m.codigoiso "
        );
    }

    private function obtenerTotalesAreasFirmadosTodos($areas, $extraparams=""){  //contratado
        return $this->doQuery("
            SELECT sum(mh.valor) as valor, m.codigoiso, e.inicial
            FROM mod_crmcontratacion.dat_contrato c
            LEFT JOIN mod_crmcontratacion.dat_hito h ON h.idcontrato=c.idcontrato
            INNER JOIN mod_crmcontratacion.dat_monedahito mh ON mh.idhito=h.idhito
            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito AND he.fechafin IS NULL)
            LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
            LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=he.idestado
            WHERE ".$this->getFiltroContratoVigente()." AND
            c.fechafirma IS NOT NULL AND c.idarea IN (" . $areas . ") ".$extraparams."
            GROUP BY m.codigoiso, e.inicial ORDER BY m.codigoiso "
        );
    }

    private function obteneroneiinEjecutar($areas, $extraparams=""){
        return $this->doQuery("
            SELECT sum(mh.valor) as valor, m.codigoiso
            FROM  mod_crmcontratacion.dat_monedahito mh
            INNER JOIN mod_crmcontratacion.dat_hito h ON h.idhito=mh.idhito
            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito AND he.fechafin IS NULL)
            LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=he.idestado
            LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
            LEFT JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=h.idcontrato
            WHERE ".$this->getFiltroContratoVigente()." AND
            c.fechafirma IS NOT NULL AND he.fechafin IS NULL AND e.inicial=1 AND c.idarea IN (" . $areas . ") ".$extraparams."
            GROUP BY m.codigoiso ORDER BY m.codigoiso"
        );
//        SELECT (sum(mc.valor)-sum(mh.valor)) as valor, m.codigoiso
//        LEFT JOIN mod_crmcontratacion.dat_monedacontrato mc ON c.idcontrato=mc.idcontrato

    }

    private function obtenerTotalesEjecutados($areas, $extraparams=""){
        return $this->doQuery("
            SELECT sum(mh.valor) as valor, m.codigoiso
            FROM  mod_crmcontratacion.dat_monedahito
            LEFT JOIN mod_crmcontratacion.dat_hito h mh ON h.idhito=mh.idhito
            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito AND he.fechafin IS NULL)
            LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=he.idestado
            LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
            LEFT JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=h.idcontrato
            WHERE ".$this->getFiltroContratoVigente()." AND he.fechafin IS NULL AND
            e.inicial=0 AND c.fechafirma IS NOT NULL AND c.idarea IN (" . $areas . ") ".$extraparams."
            GROUP BY m.codigoiso ORDER BY m.codigoiso"
        );
    }

    private function obtenerTotalesPorEstados($areas, $idestado, $extraparams=""){
        return $this->doQuery(
            "SELECT sum(mh.valor) as valor, m.codigoiso
            FROM  mod_crmcontratacion.dat_monedahito mh
            LEFT JOIN mod_crmcontratacion.dat_hito h ON h.idhito=mh.idhito
            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito AND he.fechafin IS NULL)
            LEFT JOIN mod_crmcontratacion.dat_contrato c ON h.idcontrato=c.idcontrato
            LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
            WHERE ".$this->getFiltroContratoVigente()." AND
            he.fechafin IS NULL  AND c.fechafirma IS NOT NULL AND  
            he.idestado=".$idestado." AND c.idarea IN (" . $areas . ") ".$extraparams."
            GROUP BY m.codigoiso ORDER BY m.codigoiso"
        );
    }

    public function listarAreas($idpadre){
//        $objDoctrine = Doctrine_Manager::getInstance();
//        $conexionActual = $objDoctrine->getCurrentConnection();

        $datos=$this->doQuery(
            "SELECT *, e.denominacion as text
            FROM mod_estructuracomp.dat_estructuraop e
            LEFT JOIN mod_estructuracomp.nom_filaestruc fe ON fe.idfila=e.idestructuraop
            LEFT JOIN mod_estructuracomp.nom_concepto c ON c.idconcepto=e.idconcepto
            LEFT JOIN mod_estructuracomp.nom_icono i ON i.idicono=c.idicono
            WHERE fe.idpadre=".$idpadre." AND fe.idfila<>fe.idpadre AND e.idproyecto=0 
            AND dominiofila [" . $this->global->Perfil->iddominio . "] = 1::bit"
        );
//        e.denominacion as text, TRUE as leaf, 'Área' AS tipo,
//            e.abreviatura, e.idestructuraop, i.icono AS icon,
//            fe.*
        $cantest=$this->doQuery(
            "SELECT count(e.idestructuraop) FROM mod_estructuracomp.dat_estructuraop e
            LEFT JOIN mod_estructuracomp.nom_filaestruc fe
            ON fe.idfila=e.idestructuraop
                                WHERE  fe.idpadre=".$idpadre);
        $cantfil=$this->doQuery("SELECT count(fe.idfila) FROM mod_estructuracomp.nom_filaestruc fe
                                WHERE  fe.idpadre=".$idpadre);
        foreach($datos as $index=>$hijo){
            $datos[$index]['children']=$this->cargarContratos($hijo['idestructuraop']);
            $tienehijos=$this->doQuery(
                'SELECT count(fe.idfila) FROM mod_estructuracomp.nom_filaestruc fe 
                WHERE fe.idpadre='.$hijo['idestructuraop']
            );
            if($tienehijos[0]['count']>0){
                $datos[$index]['children']=array_merge($datos[$index]['children'],
                    $this->listarAreas($hijo['idestructuraop']));
            }
            if(count($datos[$index]['children'])>0){
                $datos[$index]['leaf']=false;
            }

        }
        return $datos;
    }

    public function cargarContratos($idarea, $extrawhere, $estados){
//        $extrawhere=$this->obtenerFiltrosGenerales($params);
//        if($extrawhere!=""){$extrawhere=" AND ".$extrawhere;}
//        print('/*'.$extrawhere.'*/');
        // variante hitos
//        FROM mod_crmcontratacion.dat_hito h
//            LEFT JOIN mod_crmcontratacion.dat_contrato c ON h.idcontrato=c.idcontrato
        $contratos=$this->doQuery(
            "SELECT DISTINCT c.nombre as text,  TRUE as leaf, 'Contrato' AS tipo_concepto,
            c.idcontrato, c.fechafirma, c.montototal, c.numerocontrato as abreviatura
            FROM mod_crmcontratacion.dat_hito h
            LEFT JOIN mod_crmcontratacion.dat_contrato c ON h.idcontrato=c.idcontrato
            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito AND he.fechafin IS NULL)
            WHERE ".$this->filtroContratosTodos()." AND c.idarea=".$idarea." ".$extrawhere."
            ORDER BY c.nombre"
        );
//        FROM mod_crmcontratacion.dat_contrato c
//            LEFT JOIN mod_crmcontratacion.dat_hito h ON h.idcontrato=c.idcontrato
        $totales_cont = array();
        foreach($contratos as $index=>$con){
            // hitos e indicadores
            $hitos=$this->cargarHitosXContrato($con, $idarea, $extrawhere, $estados);
            //sumar montos hijos
            $indicadores=$this->cargarIndicadoresXContrato($con['idcontrato']);
            $hijos=array_merge($hitos, $indicadores);
            $contratos[$index]['children']=$hijos;
            if(count($hijos)>0){
                $contratos[$index]['leaf']=false;
            }
            // total montos segun contrato
            $moncontrato = $this->doQuery("
                SELECT mc.valor,  m.codigoiso
                FROM mod_crmcontratacion.dat_monedacontrato mc
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mc.idmoneda
                WHERE mc.idcontrato=".$con['idcontrato']." ORDER BY m.codigoiso"
            );
            // total montos segun hitos
//            print($extrawhere);
            $sumamonhitos = $this->doQuery("
                SELECT sum(mh.valor) as valor, m.codigoiso
                FROM mod_crmcontratacion.dat_monedahito mh
                LEFT JOIN mod_crmcontratacion.dat_hito h ON mh.idhito=h.idhito
                LEFT JOIN mod_crmcontratacion.dat_contrato c on (c.idcontrato=h.idcontrato)
                LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (he.idhito=h.idhito AND he.fechafin IS NULL)
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
                WHERE h.idcontrato=".$con['idcontrato']."  ".$extrawhere."
                GROUP BY m.codigoiso ORDER BY m.codigoiso"
            );

            $class = 'total_sinfirmar';
            if($con['fechafirma']){
                $class='total_contratado';
                $sumamonhitossinEjecutar = $this->doQuery("
                    SELECT sum(mh.valor) as valor, m.codigoiso
                    FROM mod_crmcontratacion.dat_monedahito mh
                    LEFT JOIN mod_crmcontratacion.dat_hito h ON mh.idhito=h.idhito
                    LEFT JOIN mod_crmcontratacion.dat_contrato c on (c.idcontrato=h.idcontrato)
                    LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
                    LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito and he.fechafin is NULL)
                    LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=he.idestado
                    WHERE h.idcontrato=".$con['idcontrato']." AND e.inicial=1 ".$extrawhere."
                    GROUP BY m.codigoiso ORDER BY m.codigoiso"
                );
                $contratos[$index]['total_sinejecutar']=$sumamonhitossinEjecutar;
            }
            $contratos[$index][$class]=$sumamonhitos;
            $contratos[$index][$class.'_contrato']=$moncontrato;

            //montos por estados de los hitos
//            $estados=$this->_solicitudpago->cargarEstados('hitospagos', false);
            if($con['fechafirma']) {
                foreach($estados as $est) {
                    $monhitos = $this->doQuery(
                        "SELECT sum(mh.valor) as valor, m.codigoiso
                      FROM mod_crmcontratacion.dat_hito h 
                      LEFT JOIN mod_crmcontratacion.dat_contrato c on (c.idcontrato=h.idcontrato)
                      INNER JOIN mod_crmcontratacion.dat_monedahito mh ON h.idhito=mh.idhito
                      LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON (h.idhito=he.idhito AND he.fechafin IS NULL)
                      LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
                      WHERE  he.fechafin IS NULL AND 
                      (c.cumplimientoobligaciones=1 OR c.fechafirma <='" . date('d/m/Y') . "' AND 
                      (c.fechafin>='" . date('d/m/Y') . "' OR c.fechafin ISNULL)) AND
                      he.idestado=" . $est['idestado'] . " AND
                      h.idcontrato=" . $con['idcontrato'] . " " . $extrawhere . "
                      GROUP BY m.codigoiso ORDER BY m.codigoiso"
                    );
                    //" . $con['idcontrato'] . "  OR 900
                    if (count($monhitos) > 0) {
                        $contratos[$index]['fac_' . str_replace([' ', '.'], '', strtolower($est['nombre']))] = $monhitos;
                        if (in_array($est['acciones'], array('["readyfact"]', '["postfact"]', '["newfact"]', '["historial"]'))) {
                            if ($contratos[$index]['total_facturado']) {
                                foreach ($monhitos as $aux) {
                                    foreach ($contratos[$index]['total_facturado'] as $ind => $aux2) {
                                        if ($aux2['codigoiso'] == $aux['codigoiso']) {
                                            $contratos[$index]['total_facturado'][$ind]['valor'] =
                                                floatval($aux['valor']) + floatval($aux2['valor']);
                                        }
                                    }
                                }
                            } else {
                                $contratos[$index]['total_facturado'] = $monhitos;
                            }
                        } else {
                            if ($contratos[$index]['total_ejecutado']) {
                                foreach ($monhitos as $aux) {
                                    foreach ($contratos[$index]['total_ejecutado'] as $ind => $aux2) {
                                        if ($aux2['codigoiso'] == $aux['codigoiso']) {
                                            $contratos[$index]['total_ejecutado'][$ind]['valor'] =
                                                floatval($aux['valor']) + floatval($aux2['valor']);
                                        }
                                    }
                                }
                            } else {
                                $contratos[$index]['total_ejecutado'] = $monhitos;
                            }
                        }
                    }
                }
            }
//            if($contratos[$index]['total_contratado']){
//                $contratos[$index]['total_sinejecutar']=array();
//                if(!$contratos[$index]['total_ejecutado']){
//                    $contratos[$index]['total_ejecutado']=$contratos[$index]['total_contratado'];
//                }else{
//                    if($contratos[$index]['total_contratado'] != $contratos[$index]['total_ejecutado']) {
//                        foreach ($contratos[$index]['total_contratado'] as $aux) {
//                            foreach ($contratos[$index]['total_ejecutado'] as $aux2) {
//                                if ($aux2['codigoiso'] == $aux['codigoiso']) {
//                                    $contratos[$index]['total_sinejecutar'][] = array(
//                                        'valor' => floatval($aux['valor']) - floatval($aux2['valor']),
//                                        'codigoiso' => $aux['codigoiso']);
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//            die;
        }
        return $contratos;
    }

    public function cargarHitosXContrato($contrato, $idarea, $extrawhere, $estados){
        $hitos=$this->doQuery(
            "SELECT h.numero||' - '||h.descripcion AS text, TRUE as leaf, h.idhito, 
            e.nombre, e.inicial, h.fechaestimada,
            'Obligación financiera' AS tipo_concepto
            FROM mod_crmcontratacion.dat_hito h
            LEFT JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=h.idcontrato
            LEFT JOIN mod_crmcontratacion.dat_hitoestado he ON 
            (h.idhito=he.idhito AND he.fechafin IS NULL)
            LEFT JOIN mod_crmcontratacion.nom_estado e ON he.idestado=e.idestado
            WHERE h.idcontrato=".$contrato['idcontrato'].
            " ".$extrawhere." ORDER BY h.numero"
        );
        foreach($hitos as $index=>$h){
            $mon=$this->doQuery(
                "SELECT mh.valor, m.codigoiso
                FROM mod_crmcontratacion.dat_monedahito mh
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
                WHERE mh.idhito=".$h['idhito']." ORDER BY m.codigoiso"
            );
            $class = 'total_sinfirmar';
            if($contrato['fechafirma']){
                $class='total_contratado';
                if($h['inicial']==1){
                    $hitos[$index]['total_sinejecutar']=$mon;
                }
//                else{
//                    $hitos[$index]['total_ejecutado']=$mon;
//                }
                foreach($estados as $est){
                    if($est['nombre']==$h['nombre']){
                        $hitos[$index]['fac_'.str_replace([' ', '.'], '',strtolower($h['nombre']))]=$mon;
                        if (in_array($est['acciones'], array('["readyfact"]', '["postfact"]', '["newfact"]', '["historial"]'))) {
                            $hitos[$index]['total_facturado']=$mon;
                        }else{
                            $hitos[$index]['total_ejecutado']=$mon;
                        }

                    }
                }

            }
            $hitos[$index][$class]=$mon;
        }
        return $hitos;
    }

    public function cargarIndicadoresXContrato($contrato){
        $indicadores=$this->doQuery(
            "SELECT 
            (CASE WHEN i.denominacion IS NOT NULL 
            THEN i.denominacion ELSE ni.denominacion END) AS text, 
            TRUE as leaf, 'Producto/Servicio' AS tipo_concepto ,
            i.idindicadorcontrato AS idindicador 
            FROM mod_crmcontratacion.dat_indicadorcontrato i
            LEFT JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador=i.idindicador
            WHERE i.idcontrato=".$contrato
        );
        foreach($indicadores as $index=>$i){
            $mon=$this->doQuery(
                "SELECT i.valor, m.codigoiso
                FROM mod_crmcontratacion.dat_monedaindicadorcontrato i
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=i.idmoneda
                WHERE i.idindicadorcontrato=".$i['idindicador']." ORDER BY m.codigoiso"
            );
            $class = 'total_sinfirmar';
//            print('/*'+$contrato['fechafirma']+'*/');
            if($contrato['fechafirma']){
                $class='total_contratado';
            }
            $indicadores[$index][$class]=$mon;
        }
        return $indicadores;
    }

    public function obtenerDatosEntidad(){
        $areas=$this->obtenerIdsAreasHijas($this->_idestructura);
        $estructura=$this->doQuery("
            SELECT denominacion, abreviatura FROM mod_estructuracomp.dat_estructura
            WHERE idestructura=".$this->_idestructura);
        return array(
            'text'=>$estructura[0]['denominacion'],
            'qtip'=>$estructura[0]['denominacion'],
            'abreviatura'=>$estructura[0]['abreviatura'],
            'total_sinfirmar'=>$this->obtenerTotalesAreaSinFirmar($areas),
            'total_contratado'=>$this->obtenerTotalesAreaFirmados($areas),
            'total_sinejecutar'=>$this->obteneroneiinEjecutar($areas),
            'total_ejecutado'=>$this->obtenerTotalesEjecutados($areas),
        );
    }

    public function obtenerDatosContrato($idcontrato){
        $result= $this->doQuery(
            "SELECT c.*, 
                c.denominacionclienteproveedor AS clienteproveedor,
                c.denominaciontipocontrato AS tipocontrato,
                s.denominacion AS sector,
                ntp.nombre AS condicionpago,
                ne.nombre as estadoinicial,ne.icono as iconoestadoinicial,
                (CASE WHEN c.idresponsable NOTNULL THEN per.nombre||' '||per.papel||' '||per.sapel else '' END) as nombrepersona,
                COALESCE (desop.denominacion, des.denominacion) as nombrearea,
                COALESCE (desop2.denominacion, des2.denominacion) as nombreareacreado,
                (SELECT c2.numerocontrato FROM mod_crmcontratacion.dat_contrato c2 WHERE c.idcontratomarco = c2.idcontrato)
                  AS denominacioncontratomarco,
                (CASE WHEN c.cumplimientoobligaciones=1 OR
                  c.fechafirma <='" . date('d/m/Y') . "' AND (c.fechafin>='"
                . date('d/m/Y') . "' OR c.fechafin ISNULL) THEN 1 ELSE 0 END) as vigente,
                       (CASE WHEN (c.fechafin NOTNULL AND (c.cumplimientoobligaciones=0 OR c.cumplimientoobligaciones ISNULL)) THEN c.fechafin-'"
                . date('d/m/Y') . "' ELSE 1000000000 END) as diasrestantesvigencia
                FROM mod_crmcontratacion.dat_contrato c 
                LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (ce.idcontrato=c.idcontrato AND ce.fechafin IS NULL)
                LEFT JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = ce.idestado
                LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores=c.idclienteproveedor 
                LEFT JOIN mod_crmcontratacion.nom_sector s ON s.idsector=c.idsector
                LEFT JOIN mod_datosmaestros.nom_terminosdepago ntp ON c.idcondicionpago = ntp.idterminodepago
                LEFT JOIN mod_persona.dat_persona per ON (c.idresponsable = per.idpersona)
                LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (c.idarea = nfe.idfila)
                LEFT JOIN mod_estructuracomp.dat_estructura des2 ON (c.idestructuracomun = des2.idestructura and des2.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop2 ON (c.idestructuracomun = desop2.idestructuraop and desop2.idproyecto = 0)

            WHERE c.idcontrato=$idcontrato "
        )[0];
        $mediospagos=$this->doQuery(
            'SELECT nmp.nombre
                  FROM mod_crmcontratacion.dat_mediopagocontrato mp
                  LEFT JOIN mod_crmcontratacion.nom_mediodepago nmp ON nmp.idmediodepago=mp.idmediopago
                  WHERE mp.idcontrato=' .$idcontrato
        );
        $arraymp=array();
        foreach($mediospagos as $mp){
            $arraymp[]=$mp['nombre'];
        }
//        $result['mediopago']=implode($arraymp, ',');
        $result['mediopago']=implode( ',', $arraymp);
        $monedas=$this->doQuery(
            'SELECT m.codigoiso, mc.valor AS monto
                  FROM mod_crmcontratacion.dat_monedacontrato mc
                  INNER JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mc.idmoneda 
                  WHERE mc.idcontrato=' .$idcontrato
        );
        $result['monedas']=$monedas;
        return $result;
    }

    private function obtainConnection($query){
        $objDoctrine = Doctrine_Manager::getInstance();
        return $objDoctrine->getCurrentConnection();
    }

    private function doQuery($query){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        return $conexionActual->fetchAll($query);
    }

}
