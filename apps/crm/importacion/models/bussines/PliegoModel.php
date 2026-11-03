<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 04/02/2020
 * Time: 03:48 PM
 */
class PliegoModel extends ZendExt_Model
{
//    private $_idestadosolicitudofertainsertar;
//    private $_idlistopliego;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_solicitudDService = new SolicitudNegocioDService();
        $this->_ofertaDService = new OfertaNegocioDService();
        $this->_ofertaEstado = new OfertaNegocioEstado();
        $this->_estadoRepository = new OfertaNegocioEstadoRepository();
        $this->_estadoRepositorySolicitud = new SolicitudNegocioEstadoRepository();
        $this->_solicitudNegocioEstado = new SolicitudOfertaEstadoDService();
        $this->_ofertaNegocioEstado = new OfertaNegocioEstadoDService();
        $this->_ofertacontenedor = new DatOfertaContenedor();
        $this->_ultimacompra = new DatUltimaCompra();
    }

    public function obtenerdatosOfertasProductos($params){
        try {
            $params['idestructura']=$this->global->Estructura->idestructura;
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $productos = $conn->fetchAll("
                    SELECT i.denominacion, i.codigo, i.idindicador, i.cantidad, true as ensolicitud
                    FROM mod_crmcontratacion.dat_indicadorsolicitud i
                    WHERE i.idsolicitudnegocio = ".$params['idsolicitud']
            );
//            $conn->fetchAll("
//                    SELECT o.*,  FROM mod_crmcontratacion.dat_ofertanegocio o
//                    WHERE o.idsolicitud = ".$params['idsolicitud']
//            );
            $cantproductossolicitud=count($productos);
            $productoshallados=array();
            foreach($productos as $prod){
                $productoshallados[]=$prod['idindicador'];
            }
            $idlistopliego=NomEstado::getEstadoByAction('pliego');
            $estadosolicitudoferta=$this->_ofertaDService->getConfigOfertaNegocio()['idestadosolicitudofertainsertar'];
            $result = $conn->fetchAll("
                SELECT io.*, 0 as precio, 0 as preciodivisa , false as ensolicitud
                FROM mod_crmcontratacion.dat_indicadoroferta io 
                INNER JOIN mod_crmcontratacion.dat_ofertanegocio o ON (o.idoferta=io.idoferta)
                LEFT JOIN mod_crmcontratacion.dat_ofertanegocioestado oe ON(oe.idoferta=o.idoferta AND oe.fechafin IS NULL)
                WHERE o.idsolicitud = ".$params['idsolicitud'].
                " AND oe.idestado IN (".$estadosolicitudoferta.", ".$idlistopliego.")"
            );
            //FALTA FILTRO DEL ESTADO PERMITIDO !!!!!!
            $datosmonedas=array();
            foreach ($result as $indexindi => &$indi) {
                if(!in_array($indi['idindicador'], $productoshallados)) {
                    $productoshallados[] = $indi['idindicador'];
                    $productos[]=array('idindicador'=>$indi['idindicador'],'denominacion'=>$indi['denominacion'],
                        'codigo'=>$indi['codigo'],'ensolicitud'=>false);
                }
                $moneda = DatMonedaIndicadorOferta::cargarMonedasIndicador(
                    array('idindicador' => $indi['idindicadoroferta'], 'idestructura'=>$params['idestructura'])
                );
//                print_r($mon['monto']);die;
                if (count($moneda)) {
                    foreach ($moneda as $mon) {
                        $indi['montomoneda_'.strtolower($mon['moneda']).'_'.$mon['idmoneda']]=$mon['monto'];
                    }
                }
                $moneda = DatMonedaIndicadorOfertaConversion::cargarMonedasIndicador(
                    array('idindicador' => $indi['idindicadoroferta'], 'idestructura'=>$params['idestructura'])
                );
                if (count($moneda)) {
                    foreach ($moneda as $mon) {
                        $indi['montomonedaconversion_'.strtolower($mon['codigoiso']).'_'.$mon['idmoneda']]=$mon['valor'];
                        $indi['idtasa']=$mon['idtasa'];
                        $indi['venta']=$mon['venta'];
                        $indi['fechaconversion']=$mon['fecha'];
                        $indi['idmonedaoriginal']=$mon['idmonedaoriginal'];
                    }
                }
                if(!array_key_exists($indi['idoferta'], $datosmonedas)) {
//                    $datosmonedas[] = $indi['idoferta'];
                    $datosm=$this->devolverMonedaOferta(array($indi), $indi['idoferta']);
                    if($datosm)$datosmonedas[$indi['idoferta']]=$datosm;
                }
//                if(array_key_exists($indi['idoferta'], $datosmonedas)){
//                    $indi['precio']=
//                }
            }
            $ultimacompra=null;
//            $idcontrato=$this->obtenerUltimoContrato();
//            if($idcontrato){
//                $ultimacompra=$this->obtenerDatosContrato($idcontrato);
//            }

            $ultimacompra=$this->_ultimacompra->getUltimaCompra($params);
            return array('success' => true, 'datos' => $result,
                'cantproductossolicitud'=> $cantproductossolicitud,
                'productos'=>$productos, 'datosmonedas'=>$datosmonedas,
                'ultimacompra'=> $ultimacompra);
        } catch (Doctrine_Exception $e) {
//            print('/*hahaha*/');
            return array('success' => false, 'code' => $e->getCode(), 'msg' => $e->getMessage());
        }
    }

    public function getConfiguracion(){
        return array(
            'configsolicitud' => $this->_solicitudDService->getConfigSolicitudNegocio(),
            'configoferta' => $this->_ofertaDService->getConfigOfertaNegocio(),
            'idlistopliego'=> NomEstado::getEstadoByAction('pliego'),
            'monedasconfig'=> $this->_ofertaDService->getMonedasEstructura()
        );
    }

    public function crearPliego($params){
        try{
//            print_r($params['idofertas']);
            $estado = new NomEstado();
            $idestado=$estado->getEstadoByAction('pliego');
            if($idestado) {
                $params['idestado']=$idestado;
                foreach (json_decode($params['idofertas']) as $idoferta) {
//                    $this->guardarEstadoPliego($idoferta, $idestado);
                    $params['idoferta']=$idoferta;
                    $this->_ofertaNegocioEstado->cambiarOfertaEstado($params);
                }
//                $this->guardarEstadoPliegoSolicitud($params['idsolicitud'], $idestado);
                $this->_solicitudNegocioEstado->cambiarSolicitudEstado($params);
                $pliego=new DatPliego();
                $pliego->idofertas=$params['idofertas'];
                $pliego->relevancia=$params['relevancias'];
                $pliego->idsolicitud=$params['idsolicitud'];
                $pliego->save();
            }else{
                return array('success' => false,
                    'msg' => 'No se encuentra ningún estado configurado para pliego.');
            }
            return array('success' => true);
        }catch (Exception $e) {
            return array('success' => false, 'code' => $e->getCode(), 'msg' => $e->errorMessage());
        }

    }

    private function guardarEstadoPliego($idoferta, $idestado){
        try {

//            print_r($idestado);die;
//            print('aaaa');
            $this->_estadoRepository->modificarFechaFinEstadoCuliminado(date('d/m/Y'), $idoferta);

            $this->_estadoRepository->insertRecord(array(
                'idestado' => $idestado,
                'idoferta' => $idoferta,
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
            return array('success' => true);
        }catch (Exception $e) {
            throw $e;
        }
    }

    private function guardarEstadoPliegoSolicitud($idsolicitud, $idestado){
        try {
//            print_r($idestado);die;
            $this->_estadoRepositorySolicitud->modificarFechaFinEstadoCuliminado(date('d/m/Y'), $idsolicitud);
            $this->_estadoRepositorySolicitud->insertRecord(array(
                'idestado' => $idestado,
                'idsolicitud' =>  $idsolicitud,
                'fechainicio' => date('d/m/Y'),
                'idusuario' => $this->global->Perfil->idusuario
            ));
            return array('success' => true);
        }catch (Exception $e) {
            throw $e;
        }
    }

    public function cargarDatosPliego($params){
        $pliego=Doctrine::getTable('DatPliego')->findByDql('idsolicitud=?', array($params['idsolicitud']))->toArray();
        return count($pliego)?$pliego[0]:null;
    }

    private function obtenerUltimoContrato(){
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $result=$conn->fetchAll("
            SELECT c.idcontrato FROM mod_crmcontratacion.dat_contrato c
            WHERE (c.cumplimientoobligaciones=1 OR c.fechafirma <='" . date('d/m/Y')
            . "' AND (c.fechafin>='" . date('d/m/Y'). "' OR c.fechafin ISNULL )) AND 
            c.cliente=2 AND c.contratomarco=0 ORDER BY c.fechafin DESC LIMIT 5 OFFSET 0
        ");
        return count($result)?$result[0]['idcontrato']:null;
    }

    public function obtenerDatosContrato($idcontrato){
        $reportecontratacion=new GestionContratoModel();
        $result=$reportecontratacion->obtenerDatosContrato($idcontrato, true);
        return $result;
    }

    public function guardarUltimaCompra($params){
        try{
            $real=array();
            foreach(json_decode($params['productos']) as $producto){
                $producto=(array)$producto;
                $ultimacompra=$this->_ultimacompra->getUltimaCompra(
                    array('idindicador'=>$producto['idindicador'], 'idsolicitud'=>$producto['idsolicitud']));
                if(count($ultimacompra))
                    $producto['idultimacompra']=$ultimacompra[0]['idultimacompra'];
                $real[]=$this->_ultimacompra->saveUltimaCompra($producto);
            }
            $aeliminar=$this->_ultimacompra->getUltimaCompra(
                array('notIn'=>$real));
            if(count($aeliminar)){
                $ids=array();
                foreach($aeliminar as $el){
                    $ids[]=$el['idultimacompra'];
                }
                $this->_ultimacompra->eliminarUltimaCompra($ids);
            }
            return array('success'=>true);
        }catch (Exception $e) {
            return array('success'=>false, 'msg'=>$e->getMessage());
        }

    }

    public function exportarPliego($params){
//        die;

        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $ruta = substr($dirindex, 0, strrpos($dirindex, 'web')) .
            'lib/Adapters/PHPExcel/1.8.0/';
        include_once($ruta . 'PHPExcel.php');
        include_once($ruta . 'PHPExcel/Reader/Excel2007.php');
        include_once($ruta . 'PHPExcel/Reader/Excel5.php');
        include_once($ruta . 'PHPExcel/IOFactory.php');

        $abecedario=array(); $campostabla=array('cantidad', 'precio', 'importe');
        foreach(array('', 'A', 'B', 'C', 'D', 'E', 'F') as $l) {
            for ($i = 65; $i <= 90; $i++) {
                $abecedario[] = $l.chr($i);
            }
        }
//        print_r($abecedario);die;

        $solicitud=$this->_solicitudDService->getSolicitudes(array('filters'=>array(0=>
            array('field'=>'idsolicitud', 'data'=>array('comparison'=>'=', 'value'=>$params['idsolicitud'])))));
        $ofertas=$this->_ofertaDService->getOfertas($this->filtrosOfertas($params['idsolicitud']));
        if(count($solicitud['datos'])==0){
            return array('success'=>false, 'msg'=>'La solicitud de oferta no existe. Recargue la interfaz y compruebe.');
        }else{
            $solicitud=$solicitud['datos'][0];
//            print_r($solicitud);die;
            $objPHPExcel = new PHPExcel();
            $objPHPExcel->setActiveSheetIndex(0);
            // anchos
            $objPHPExcel->getActiveSheet()->setTitle('Pliego_'.date('d-m-Y'));
//            $objPHPExcel->getDefaultStyle()->applyFromArray($style);
            $objPHPExcel->getActiveSheet()->getDefaultColumnDimension()->setWidth(13);
            $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(8);
            $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(50);
            $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(25);
            for($i=1;$i<=9;$i++){
                $objPHPExcel->getActiveSheet()->freezePane('A'.$i);
            }
//            $objPHPExcel->getActiveSheet()->freezePane('A1');
//            $objPHPExcel->getActiveSheet()->freezePane('A2');
//            $objPHPExcel->getActiveSheet()->freezePane('A3');

            //titulos
            $objPHPExcel->getActiveSheet()->setCellValue('B1', 'Entidad: SASA');
            $objPHPExcel->getActiveSheet()->setCellValue('B2', 'Descripción de la mercancía: '.$solicitud['linea']);
            $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Especificaciones: ');
            $objPHPExcel->getActiveSheet()->setCellValue('B4', 'Fecha: '.date('d/m/Y'));
            //linea 5 libre
            $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Contratos Anteriores');
            $objPHPExcel->getActiveSheet()->setCellValue('B7', 'Fecha');
            $objPHPExcel->getActiveSheet()->setCellValue('B8', '# de contrato');

            $objPHPExcel->getActiveSheet()->setCellValue('B9', 'País');
            $objPHPExcel->getActiveSheet()->setCellValue('B10', 'Moneda');
            $objPHPExcel->getActiveSheet()->setCellValue('B11', 'Proveedor');
            $objPHPExcel->getActiveSheet()->setCellValue('B12', 'Fecha de Oferta');
            $objPHPExcel->getActiveSheet()->setCellValue('B13', 'Cantidad solicitada por contenedor');
//            $tiposcontenedores=$this->_nomencladorcontroller->getModelAction(
//                array('modelName'=>'NomTipoContenedor', 'page'=>1, 'start'=>1, 'limit'=>100));
            $tiposcontenedores=Doctrine::getTable('NomTipoContenedor')->findAll();
            $primerparo=14;
            $fila=$primerparo;

            //introducir tipos de contenedores
            foreach ($tiposcontenedores as $tipo){
                $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, $tipo['denominacion']);$fila++;
            }
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, 'Fecha de validez de la oferta');$fila++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, 'Fecha de entrega ofertada');$fila++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, 'Tasa de cambio');$fila++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, 'Condición de compra');$fila++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, 'Puerto de origen');$fila++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, 'Puerto de destino');
            $finaldatosgenerales=$fila;
            $fila++;

            // poner formato de los titulos en la columna
            $this->formatoTitulo($objPHPExcel, 'B1:B'.$fila);

            $objPHPExcel->getActiveSheet()->mergeCells('D6:F6');
            $objPHPExcel->getActiveSheet()->mergeCells('D7:F7');
            $objPHPExcel->getActiveSheet()->mergeCells('D8:F8');
            $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Ultima compra');
            $objPHPExcel->getActiveSheet()->setCellValue('D7', '<Fecha firma cont>');
            $objPHPExcel->getActiveSheet()->setCellValue('D8', '<# contrato>');
//            $objPHPExcel->getActiveSheet()->mergeCells('D9:F9');
            $this->formatoDatos($objPHPExcel, 'D9:F9');
            $this->formatoDatos($objPHPExcel, 'D10:F10');
            $this->formatoDatos($objPHPExcel, 'D11:F11');
            $objPHPExcel->getActiveSheet()->setCellValue('D9', '<pais>');
            $objPHPExcel->getActiveSheet()->setCellValue('D10', '<moneda');
            $objPHPExcel->getActiveSheet()->setCellValue('D11', '<proveedor>');
            $this->formatoTablaTitulo($objPHPExcel, 'D6:F6');
            $this->formatoTablaTitulo($objPHPExcel, 'D7:F7');
            $this->formatoTablaTitulo($objPHPExcel, 'D8:F8');
//            for($i=1; $i<=$fila; $i++){
//                $this->formatoTitulo($objPHPExcel, 'B'.$i);
//            }
            $objPHPExcel->getActiveSheet()->setCellValue('A'.$fila, 'ITEMS');
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, 'DESCRIPCIÓN DEL PRODUCTO');
            $objPHPExcel->getActiveSheet()->setCellValue('C'.$fila, 'CODIGO');
            $this->formatoTablaTitulo($objPHPExcel, 'A'.$fila);
            $this->formatoTablaTitulo($objPHPExcel, 'B'.$fila);
            $this->formatoTablaTitulo($objPHPExcel, 'C'.$fila);

            // introducir filas cantidad/precio/importe
//            for($i=3; $i<=count($ofertas['datos'])+5; $i=$i+3){
            $columna=3;
            for($i=0; $i<=count($ofertas['datos']); $i++){
                foreach ($campostabla as $c){
                    $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$columna].$fila, $c);
                    $this->formatoTablaTitulo($objPHPExcel, $abecedario[$columna].$fila);
                    $columna++;
                }
            }
            $datosproductos=$this->obtenerdatosOfertasProductos($params);
            $fila++;
            $objPHPExcel->getActiveSheet()->setAutoFilter('A'.$fila.':'.$abecedario[$columna-1].(count($datosproductos['productos'])+$fila));
            $objPHPExcel->getActiveSheet()->getStyle('A'.$fila.':'.$abecedario[$columna-1].$fila)->applyFromArray(
                array(
                    'fill' => array(
                        'type' => PHPExcel_Style_Fill::FILL_SOLID,
                        'color' => array('rgb' => 'f7f9c8')
                    )
                )
            );
//            $objPHPExcel->getActiveSheet()->setAutoFilter('C'.$fila.':C'.(count($datosproductos['productos'])+$fila));
            $fila++;
            $filainicialprod=$fila;
            //añadiendo productos


            foreach($datosproductos['productos'] as $i=>$prod){
                $objPHPExcel->getActiveSheet()->setCellValue('A'.$fila, $i+1);
                $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, $prod['denominacion']);
                $objPHPExcel->getActiveSheet()->setCellValue('C'.$fila, $prod['codigo']?'"'.$prod['codigo'].'"':null);
                $this->formatoTabla($objPHPExcel, 'A'.$fila, $prod['ensolicitud']?'008000':'6F6F6F');
                $this->formatoTabla($objPHPExcel, 'B'.$fila, $prod['ensolicitud']?'008000':'6F6F6F');
                $this->formatoTabla($objPHPExcel, 'C'.$fila, $prod['ensolicitud']?'008000':'6F6F6F');
                for($i=3; $i<=(count($ofertas['datos'])*3)+5; $i++){
                    $this->formatoTabla($objPHPExcel, $abecedario[$i].$fila);
                }
                $fila++;
            }
            if(count($datosproductos['ultimacompra'])){
                foreach($datosproductos['ultimacompra'] as $uc){
                    for($i=$filainicialprod; $i<(count($datosproductos['productos'])+$filainicialprod);$i++){
                        if($uc['codigo']==str_replace('"','',$objPHPExcel->getActiveSheet()->getCell('C'.$i)->getValue())){
                            $objPHPExcel->getActiveSheet()->setCellValue('D'.$i, $uc['cantidad']);
                            $objPHPExcel->getActiveSheet()->setCellValue('E'.$i, $uc['valor']);
                            $objPHPExcel->getActiveSheet()->setCellValue('F'.$i, $uc['cantidad']*$uc['valor']);
                        }
                    }

                }
            }
            // introducir ofertas horizontal
            $aux=6;
            foreach($ofertas['datos'] as $oferta){
                $objPHPExcel->getActiveSheet()->mergeCells($abecedario[$aux].'6:'.$abecedario[$aux+2].'6');
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].'6', '"'.$oferta['numero'].'"');
//                $this->formatoDatos($objPHPExcel, $abecedario[$aux].'6');
                $this->formatoTablaTitulo($objPHPExcel, $abecedario[$aux].'6:'.$abecedario[$aux+2].'6');
                $objPHPExcel->getActiveSheet()->mergeCells($abecedario[$aux].'7:'.$abecedario[$aux+2].'8');
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].'7', $oferta['nombre']);
//                $this->formatoDatos($objPHPExcel, $abecedario[$aux].'7');
                $this->formatoTablaTitulo($objPHPExcel, $abecedario[$aux].'7:'.$abecedario[$aux+2].'8');
//                print_r($oferta['paispuertoorigen']);die;

                $monedaoferta=$this->devolverMonedaOferta($datosproductos['datos'], $oferta['idoferta']);
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].'9', $oferta['paispuertoorigen']);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].'9:'.$abecedario[$aux+2].'9');
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].'10', $monedaoferta?strtoupper($monedaoferta['codigoiso']):null);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].'10:'.$abecedario[$aux+2].'10');
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].'11', $oferta['clienteproveedor']);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].'11:'.$abecedario[$aux+2].'11');
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].'12', $oferta['fechainicio']);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].'12:'.$abecedario[$aux+2].'12');
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].'13:'.$abecedario[$aux+2].'13');
                $contenedores=$this->_ofertacontenedor->getOfertasContenedores(array('idofertanegociosolicitud'=>$oferta['idofertanegociosolicitud']));
                $lineaaux=$primerparo;
                for($i=$primerparo; $i<count($tiposcontenedores)+$primerparo; $i++){
//                    $objPHPExcel->getActiveSheet()->mergeCells($abecedario[$aux].$i.':'.$abecedario[$aux+2].$i);
                    $this->formatoDatos($objPHPExcel, $abecedario[$aux].$i.':'.$abecedario[$aux+2].$i);
                    $lineaaux++;
                }
                
                foreach ($contenedores as $con){
                    for($i=$primerparo; $i<count($tiposcontenedores)+$primerparo; $i++){
//                        print_r('-'.$objPHPExcel->getActiveSheet()->getCell('B'.$i).'-'. $con['tipocontenedor']. '//');
                        if($con['tipocontenedor']==$objPHPExcel->getActiveSheet()->getCell('B'.$i)) {
                            $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux] . $i, $con['cantidad']);
                        }
                    }
                }
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].$lineaaux, $this->calcularFechaValidez($oferta));
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].$lineaaux.':'.$abecedario[$aux+2].$lineaaux);$lineaaux++;
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].$lineaaux, $oferta['tiempoentrega']);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].$lineaaux.':'.$abecedario[$aux+2].$lineaaux);$lineaaux++;
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].$lineaaux, $monedaoferta['monedaoriginal']?strtoupper($monedaoferta['monedaoriginal']).'/'.strtoupper($monedaoferta['codigoiso']):null);
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+1].$lineaaux, $monedaoferta['fechaconversion']?strtoupper($monedaoferta['fechaconversion']):null);
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].$lineaaux, $monedaoferta['venta']?strtoupper($monedaoferta['venta']):null);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].$lineaaux.':'.$abecedario[$aux+2].$lineaaux, false);$lineaaux++;
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].$lineaaux, $oferta['incoterms']);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].$lineaaux.':'.$abecedario[$aux+2].$lineaaux);$lineaaux++;
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].$lineaaux, $oferta['puertoorigen']);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].$lineaaux.':'.$abecedario[$aux+2].$lineaaux);$lineaaux++;
                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].$lineaaux, $oferta['puertodestino']);
                $this->formatoDatos($objPHPExcel, $abecedario[$aux].$lineaaux.':'.$abecedario[$aux+2].$lineaaux);$lineaaux++;$lineaaux++;
//                die;
//                $productos=$this->_ofertaDService->getProductosServicios($params);
               //print_r('pereira');die;
                $filafinalprod=count($datosproductos['productos'])+$lineaaux+1;
                $lineaaux++;

                foreach($datosproductos['datos'] as $actual){
                    if($actual['idoferta']==$oferta['idoferta']){
                        for($i=$lineaaux; $i<$filafinalprod; $i++){
//                        print_r('-'.$objPHPExcel->getActiveSheet()->getCell('B'.$i).'-'. $con['tipocontenedor']. '//');
//                        print_r($lineaaux.'-'.'B'.$i.'-'. $actual['denominacion']. '//');
                            if($actual['denominacion']==$objPHPExcel->getActiveSheet()->getCell('B'.$i) &&
                                    '"'.$actual['codigo'].'"'==$objPHPExcel->getActiveSheet()->getCell('C'.$i)) {
                                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux] . $i, $actual['cantidad']);
//                                if(preg_match('/montomonedaconversion_/i', $i) && $value && $value!=0){
//                                    $aux=explode('_', $i);
//                                    $modedaconversion=strtoupper($aux[1]);
//                                }
//                                if(preg_match('/montomoneda_/i', $i) && $value && $value!=0){
//                                    $aux=explode('_', $i);
//                                    $moneda=strtoupper($aux[1]);
//                                }
                                $monto=$actual[($monedaoferta['fechaconversion']?'montomonedaconversion_':'montomoneda_').
                                $monedaoferta['codigoiso'].'_'.$monedaoferta['idmoneda']];
                                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+1] . $i, $monto);
                                $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2] . $i,
                                    $actual['cantidad']*$monto);
                            }
                        }
                        // extra al final, total esas cosas
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].($filafinalprod+1),
                            '=SUM('.$abecedario[$aux+2].$lineaaux.':'.$abecedario[$aux+2].($filafinalprod).')'); //Precio FOB
//                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].($filafinalprod+2), 1);
//                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].($filafinalprod+2),
//                            '= REDONDEAR('.$objPHPExcel->getActiveSheet()->getCell($abecedario[$aux+2].($filafinalprod+1))->getValue().''.';2)'); // Descuento
                        //=REDONDEAR(I31*(G32/100);2)
//                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].($filafinalprod+2),
//                            '=REDONDEAR(I31*(G32/100);2)'); //Descuento
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].($filafinalprod+2),
                            '='.$abecedario[$aux+2].($filafinalprod+1).'*('.
                            $abecedario[$aux].($filafinalprod+2).'/100)'.''); // Descuento
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].($filafinalprod+3),
                            '='.$abecedario[$aux+2].($filafinalprod+1).'-'.$abecedario[$aux+2].($filafinalprod+2)); //Total FOB
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].($filafinalprod+5),
                            '='.$abecedario[$aux+2].($filafinalprod+3).'+'.$abecedario[$aux+2].($filafinalprod+4)); //Precio CFR
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].($filafinalprod+8),
                            '='.$abecedario[$aux+2].($filafinalprod+5).'+'.$abecedario[$aux+2].($filafinalprod+6).
                            '+'.$abecedario[$aux+2].($filafinalprod+7)); //Precio CIF
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux+2].($filafinalprod+10),
                            '='.$abecedario[$aux+2].($filafinalprod+8).'+'.$abecedario[$aux+2].($filafinalprod+9)); //Importe total

                        $objPHPExcel->getActiveSheet()->mergeCells($abecedario[$aux].($filafinalprod+11).':'.$abecedario[$aux+2].($filafinalprod+11));
                        $objPHPExcel->getActiveSheet()->mergeCells($abecedario[$aux].($filafinalprod+12).':'.$abecedario[$aux+2].($filafinalprod+12));
                        $objPHPExcel->getActiveSheet()->mergeCells($abecedario[$aux].($filafinalprod+13).':'.$abecedario[$aux+2].($filafinalprod+13));
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].($filafinalprod+11), $oferta['condicionpago']); // Forma de pago
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].($filafinalprod+12), $oferta['embalaje']); // Envase o embalaje
                        $objPHPExcel->getActiveSheet()->setCellValue($abecedario[$aux].($filafinalprod+13), $oferta['tiempoentrega']); // Tiempo de entrga
                        $this->formatoDatos($objPHPExcel, $abecedario[$aux].($filafinalprod+11).':'.$abecedario[$aux+2].($filafinalprod+11));
                        $this->formatoDatos($objPHPExcel, $abecedario[$aux].($filafinalprod+12).':'.$abecedario[$aux+2].($filafinalprod+12));
                        $this->formatoDatos($objPHPExcel, $abecedario[$aux].($filafinalprod+13).':'.$abecedario[$aux+2].($filafinalprod+13));
                        $this->formatoDatos($objPHPExcel, $abecedario[$aux].($filafinalprod+14).':'.$abecedario[$aux+2].($filafinalprod+14));
                    }
                }
//                die;
                $aux=$aux+3;
            }

            $lineaaux=$lineaaux+count($datosproductos['productos'])+1;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Precio FOB');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Descuento');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Total FOB');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Flete marítimo');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Precio CFR');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Seguro');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Inspección');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Precio CIF');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Intereses');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Importe total');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Forma de pago');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Envase o embalaje');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Tiempo de entrega');$lineaaux++;
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Garantia');$lineaaux++;
            $this->formatoTitulo($objPHPExcel, 'B'.($lineaaux-14).':B'.$lineaaux);
//            for($i=$lineaaux-14;$i<=$lineaaux; $i++){
//                $this->formatoTitulo($objPHPExcel, 'B'.$i);
//            }

            $objPHPExcel->getActiveSheet()->setCellValue('B'.$lineaaux, 'Observaciones');$lineaaux++;



            //finalizando
            ob_end_clean();
            //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
            header(
                'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            header(
                'Content-Disposition: attachment;filename="Pliego_'. date('d-m-Y') . '.xls" '
            );
            header('Cache-Control: max-age=0');
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            ob_end_clean();
            echo($objWriter->save('php://output'));
            $objPHPExcel->disconnectWorksheets();
            unset($objPHPExcel);
        }
    }

    private function filtrosOfertas($idsolicitud){
        return array('filters' => array(
            array('field' => 'solicitud',
                'data'  => array(
                    'type'  => 'numeric',
                    'value' => $idsolicitud)),
            array('field' => 'clasificacionclienteproveedor',
                'data'  => array(
                    'type'  => 'numeric',
                    'value' => 1)),
            array('field' => 'estado',
                'data'  => array(
                    'type'  => 'list',
                    'value' => [$this->_ofertaDService->getConfigOfertaNegocio()['idestadosolicitudofertainsertar'],
                        NomEstado::getEstadoByAction('pliego')]))  //#CAMBIAR #QUEDA #siseteolvidalolamentarasmastarde
        ));
    }

    private function calcularFechaValidez($params){
        $tiempo=array(1=>' days', 2=>' month', 3=>' year');
        $fecha= date_create_from_format('d/m/Y', $params['fechainicio']);
        return date('d/m/Y', strtotime($fecha->format('m/d/Y').'+ '.$params['garantia'].$tiempo[$params['garantiatiempo']]));
    }

    private function devolverMonedaOferta($datos, $idoferta){
        $moneda=null; $monedaconversion=null;
        foreach($datos as $actual){
            if($actual['idoferta']==$idoferta){
                foreach($actual as $i=>$value){
                    if(preg_match('/montomonedaconversion_/i', $i) && $value && $value!=0){
                        $aux=explode('_', $i);
                        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
                        $result=$conn->fetchAll("SELECT m.codigoiso FROM mod_datosmaestros.nom_moneda m 
                                                WHERE m.idmoneda=".$actual['idmonedaoriginal']);
                        $monedaconversion=array('codigoiso'=>$aux[1], 'idmoneda'=>$aux[2],
                            'venta'=>$actual['venta'], 'fechaconversion'=> $actual['fechaconversion'],
                            'monedaoriginal'=>count($result)?$result[0]['codigoiso']:null);
//                        $modedaconversion=strtoupper($aux[1]);
                    }
                    if(preg_match('/montomoneda_/i', $i) && $value && $value!=0){
                        $aux=explode('_', $i);
                        $moneda=array('codigoiso'=>$aux[1], 'idmoneda'=>$aux[2]);
//                        $moneda=strtoupper($aux[1]);
                    }
                }
//                if($monedaconversion || $moneda)break;
            }
        }
        return $monedaconversion?$monedaconversion:$moneda;
    }

    private function formatoTitulo(&$objPHPExcel, $celda){
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()
            ->applyFromArray(
                array(
                    'name'   => 'Arial',
                    'bold'   => true,
                    'italic' => false,
                    'strike' => false,
                    'size'   => 9,
                    'color'  => array(
                        'rgb' => '000000'
                    )
                )
            );
    }

    private function formatoTablaTitulo(&$objPHPExcel, $celda){

        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()
            ->applyFromArray(
                array(
                    'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                    'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                )
            );
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()
            ->applyFromArray(
                array(
                    'name'   => 'Arial',
                    'bold'   => true,
                    'italic' => false,
                    'strike' => false,
                    'size'   => 10,
                    'color'  => array(
                        'rgb' => '000000'
                    )
                )
            );
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()
            ->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    ),
                    'right'  => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    ),
                    'left'  => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    ),
                    'top'  => array(
                        'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
    }

    private function formatoTabla(&$objPHPExcel, $celda, $color='000000'){
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()->getColor()->setRGB($color);
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()
            ->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    ),
                    'right'  => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
    }

    private function formatoMarcadoTabla(&$objPHPExcel, $celda){
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()
            ->applyFromArray(
                array(
//                    'name'   => 'Arial',
//                    'bold'   => false,
//                    'italic' => false,
//                    'strike' => false,
//                    'size'   => 10,
                    'color'  => array(
                        'rgb' => '6F6F6F'
                    )
                )
            );
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()
            ->applyFromArray(
                array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    ),
                    'right'  => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
    }

    private function formatoDatos(&$objPHPExcel, $celda, $merge=true){
        if($merge && count(explode(':', $celda))>1)
            $objPHPExcel->getActiveSheet()->mergeCells($celda);
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()
            ->applyFromArray(
                array(
                    'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                )
            );
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()
            ->applyFromArray(
                array(
                    'left' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    ),
                    'right'  => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        )
                    )
                )
            );
    }

}
