<?php
/*
 * Clase que se encarga de almacenar todos los datos de los comprobantes de las nominas como trazas (generar comprobante, cancelar comprobante)
 * Ing. Aroldo L. Hechavarría Hechavarría
 * 2/02/2024
 */
class HisElaborarpagos extends BaseHisElaborarpagos
{

    public static function obtenerObjHisElaborarpagosDadoId($idelaborarpagos)
    {
        return Doctrine::getTable('HisElaborarpagos')->find($idelaborarpagos);
    }

    public static function insertarDatosHistoricosElaborarPagoComCanc($idelaborarpagos, $idtipopago, $idperiodopago, $fechapago, $fechainicioperiodo, $fechafinperiodo, $identidad, $idcomprobanteoperaciones, 
    $numerocomprobanteoperaciones, $idcomprobantecancelacion, $numerocomprobantecancelacion, $idcomprobantecuentasporcobrar, $numerocomprobantecuentaxcobrar, $descripcion, $idusuario, $tipocomprobante)
    {
        $sql = "INSERT INTO mod_nomina.his_elaborarpagos
            (
                idelaborarpagos,
                idtipopago,
                idperiodopago,
                fechapago,
                fechainicioperiodo,
                fechafinperiodo,
                tipocomprobante,
                identidad,
                idcomprobanteoperaciones,
                numerocomprobanteoperaciones,
                idcomprobantecancelacion,
                numerocomprobantecancelacion,
                idcomprobantecuentasporcobrar,
                numerocomprobantecuentaxcobrar,
                idusuario,
                descripcion
            )
            VALUES (
                $idelaborarpagos,
                $idtipopago,
                $idperiodopago,
                '$fechapago',
                '$fechainicioperiodo',
                '$fechafinperiodo',
                $tipocomprobante,
                $identidad,
                null,
                null,
                $idcomprobantecancelacion,
                $numerocomprobantecancelacion,
                null,
                null,
                $idusuario,
                null
        );";    
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->execute($sql); 
    }

    public static function insertarDatosHistoricosElaborarPagoCompObl($idelaborarpagos, $idtipopago, $idperiodopago, $fechapago, $fechainicioperiodo, $fechafinperiodo, $identidad, $idcomprobanteoperaciones, 
    $numerocomprobanteoperaciones, $idcomprobantecancelacion, $numerocomprobantecancelacion, $idcomprobantecuentasporcobrar, $numerocomprobantecuentaxcobrar, $descripcion, $idusuario, $tipocomprobante)
    {
        $sql = "INSERT INTO mod_nomina.his_elaborarpagos
            (
                idelaborarpagos,
                idtipopago,
                idperiodopago,
                fechapago,
                fechainicioperiodo,
                fechafinperiodo,
                tipocomprobante,
                identidad,
                idcomprobanteoperaciones,
                numerocomprobanteoperaciones,
                idcomprobantecancelacion,
                numerocomprobantecancelacion,
                idcomprobantecuentasporcobrar,
                numerocomprobantecuentaxcobrar,
                idusuario,
                descripcion
            )
            VALUES (
                $idelaborarpagos,
                $idtipopago,
                $idperiodopago,
                '$fechapago',
                '$fechainicioperiodo',
                '$fechafinperiodo',
                $tipocomprobante,
                $identidad,
                $idcomprobanteoperaciones,
                $numerocomprobanteoperaciones,
                null,
                null,
                null,
                null,
                $idusuario,
                null
        );";       
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->execute($sql);
    }

    // public function valid($identidad){
    //     print_r("okk");die;
    // }

    public function obtenerListadoHistComp($identidad, $texto, $start, $limit){ 
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlconcat = (!empty($texto)) ? " and (replace(concat(trim(dp.nombre),' ',trim(dp.snombre), ' ',trim(dp.papel), ' ',trim(dp.sapel)),'  ',' ') ilike '%$texto%' or su.nombreusuario ilike '%$texto%')" : "";
        $sql = "SELECT hep.idhiselaborarpagos, ntp.denominacion, hep.fechainicioperiodo, hep.fechafinperiodo, hep.fechapago, hep.tipocomprobante, hep.idcomprobanteoperaciones, hep.numerocomprobanteoperaciones,
                hep.idcomprobantecancelacion, hep.numerocomprobantecancelacion, su.nombreusuario, replace (concat(trim(dp.nombre), ' ', trim(dp.snombre), ' ', trim(dp.papel), ' ', trim(dp.sapel)), ' ', ' ') as nombreapell,
                hep.descripcion, hep.idelaborarpagos                    
                FROM mod_nomina.his_elaborarpagos hep                
                INNER JOIN mod_seguridad.seg_usuario su on (su.idusuario = hep.idusuario)
                inner join mod_persona.dat_persona dp on (dp.idpersona = su.idpersona)
                INNER JOIN mod_nomina.nom_tipopago ntp on (ntp.idtipopago = hep.idtipopago)                 
                WHERE hep.identidad = $identidad " . $sqlconcat . "ORDER BY hep.fechainicioperiodo ASC;"; 
        $r = $conn->fetchAll($sql);
        foreach ($r as $i => &$v) {
            $fexplode = explode('/', $v['fechainicioperiodo']);
            $v['anno'] = $fexplode[2];
        }
        return $r;
    }

    public function exportarTrazasComprobantes($arraydatos, $identidad){
        //Pintando el Excel 
        $objPHPExcel = new PHPExcel();
        $objReporteExcel = new ReporteExportarExcelModel();

        $row = 1;
        $objPHPExcel->getActiveSheet()->getStyle('A') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('B') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('C') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('D') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('E') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('F') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('G') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('H') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('I') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('J') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('K') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('L') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(23);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(20);

        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(60);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(25);

        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(60);
        $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setWidth(25);
    
        //Encabezado
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'A', $row, 'Tipo de Comprobante', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'B', $row, 'ID ELABORAR PAGO', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'C', $row, 'Denominación', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        $objReporteExcel->fnPintarCelda($objPHPExcel, 'D', $row, 'Usuario', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, 'Nombre del Usuario', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, 'Fecha Inicio', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, 'Fecha Fin', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'H', $row, 'Fecha Pago', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1); 

        $objReporteExcel->fnPintarCelda($objPHPExcel, 'I', $row, 'ID. Comp Oper', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'J', $row, 'No. Comp Oper', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        $objReporteExcel->fnPintarCelda($objPHPExcel, 'K', $row, 'ID. Comp Canc', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'L', $row, 'No. Comp Canc', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
    
        foreach ($arraydatos as $pn){
            if ($pn['tipocomprobante'] == 1) {
                $tipocomprobante = 'Obligaciones';
            } else {
                $tipocomprobante = 'Canselación';
            }
            $idcompobl = $pn['idcomprobanteoperaciones'];
            $idcompcanc = $pn['idcomprobantecancelacion'];
            
            $row ++;
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'A', $row, $tipocomprobante, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'B', $row, $pn['idelaborarpagos'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'C', $row, $pn['denominacion'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

            $objReporteExcel->fnPintarCelda($objPHPExcel, 'D', $row, $pn['nombreusuario'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, $pn['nombreapell'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

            $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, $pn['fechainicioperiodo'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, $pn['fechafinperiodo'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'H', $row, $pn['fechapago'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

            $objReporteExcel->fnPintarCelda($objPHPExcel, 'I', $row, "$idcompobl", 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'J', $row, $pn['numerocomprobanteoperaciones'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'K', $row, "$idcompcanc", 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'L', $row, $pn['numerocomprobantecancelacion'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
    
        }
        
        // TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Listado de trazas de comprobantes.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    public function contComprobanteOperaciones($val){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT count(numerocomprobanteoperaciones)  FROM mod_nomina.his_elaborarpagos WHERE numerocomprobanteoperaciones = $val;";
        $resultado = $conn->fetchOne($sql);
        return $resultado;
    }

    public function contComprobanteCancelacion($val){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT count(numerocomprobantecancelacion)  FROM mod_nomina.his_elaborarpagos WHERE numerocomprobantecancelacion = $val;";
    $resultado = $conn->fetchOne($sql);
        return $resultado;
    }
}
