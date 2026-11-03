<?php

class ReportesModel extends ZendExt_Model {
    
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function DamelistaMeses($idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idtiempoxnomenclador, idejercicio, fechainicio, 
                    fechafin, nom_datosnomenclador.denominacion as mes,nom_datosnomenclador.iddatosnomenclador
               FROM mod_planificacion.conf_tiempoxnomenclador
                   inner join mod_planificacion.nom_datosnomenclador on (nom_datosnomenclador.iddatosnomenclador = conf_tiempoxnomenclador.iddatosnomenclador) 
                   where idejercicio = $idejercicio and idtiponomenclador = 195 order by fechainicio";        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function DamelistaEntidas($entidad){
        $data = array();
        $cont = 0;
        if($entidad==null){
            $integrator = ZendExt_IoC::getInstance();
            $dominios = $integrator->metadatos->DameHijosEstructura(100000532);
            foreach ($dominios as $value){
                $data[$cont]['identidad']=$value->id;
                $data[$cont]['nombreentidad']=$value->text;
                $cont++;
            }
        }else{
            $integrator = ZendExt_IoC::getInstance();
            $dominios = $integrator->metadatos->DameEstructura($entidad);
            $data[$cont]['identidad']=$dominios[0]->id;
            $data[$cont]['nombreentidad']=$dominios[0]->text;
        }
        return $data;
    }
    
    public function ConstruirListaSalida($parametros){
        $arrayexportar = array();
		 
        $cont = 0;
        $result1 = DatDistribucion::listarDistribucion($parametros);
        $aprobado = ($result1[0]['total'] != null) ? $result1[0]['total'] : 0;

        $result2 = DatDistribucion::MontoTotal($parametros);
        $disponible = ($result2[0]['montototal'] != null) ? $result2[0]['montototal'] : 0;

        $presentado = floatval($aprobado) - floatval($disponible);
        $porcientofalta1 = (floatval($disponible) * 100) / floatval($aprobado);
        $porcientofalta = ($porcientofalta1 != null) ? $porcientofalta1 : 0;
        $arrayexportar[$cont]['aprobado'] = $aprobado;
        $arrayexportar[$cont]['presentado'] = $presentado;
        $arrayexportar[$cont]['disponible'] = $disponible;
        $arrayexportar[$cont]['porcientofalta'] = $porcientofalta;
        return $arrayexportar;
    }
    
    public function ConstruirListaSalidaConContrato($parametros){
        $arrayexportar = array();
        $cont = 0;
        
        $result1 = DatDistribucion::listarDistribucion($parametros);
        $aprobado = ($result1[0]['total'] != null) ? $result1[0]['total'] : 0;
        
        $result2 = DatDistribucion::MontoTotal($parametros);
        $disponible = ($result2[0]['montototal'] != null) ? $result2[0]['montototal'] : 0;
        
        $presentado = floatval($aprobado) - floatval($disponible);
        
        $result3 = DatContrato::listarContratoPlanEntidad($parametros);
        $contratado=floatval($result3[$cont]['totalcontratado']);
        $pendientecontratar = floatval($presentado) - floatval($result3[$cont]['totalcontratado']);
        $result4=DatContrato::listarSuministradosDelAnno($parametros);
        $ejecutadofisico=floatval($result4[$cont]['montopagado']);
        
        $arrayexportar[$cont]['aprobado'] = $aprobado;
        $arrayexportar[$cont]['presentado'] = $presentado;
        $arrayexportar[$cont]['disponible'] = $disponible;
        
        $arrayexportar[$cont]['contratado'] = $contratado;
        $arrayexportar[$cont]['pendientecontratar'] = $pendientecontratar;
        $arrayexportar[$cont]['ejecutadofisico'] = $ejecutadofisico;
        
        return $arrayexportar;
    }
    
    public function ConstruirListaSalidaFar($parametros){
        $arrayexportar = array();
        $cont = 0;

        $result1 = DatDistribucioncodentidad::MontoTotal($parametros);
        //var_dump($result1); die;
        $aprobado = 0;
        foreach ($result1 as $value1) {
            if($value1['idproducto711']==null){
                $aprobado+=floatval($value1['monto']);
            }
        }
        //var_dump($aprobado); die;
        $model= new DatDistribucioncodentidadModel();
        $result2 = $model->MontoTotal($parametros);
        //var_dump($result2); die;    
        $disponible = $result2;
        
        $presentado = floatval($aprobado) - floatval($disponible);
        
        $result3 = DatContrato::listarContratoPlanEntidad($parametros);
        //var_dump($result3); die;
        $contratado=floatval($result3[$cont]['total']);

        $pendientecontratar = floatval($presentado) - floatval($contratado);
        $result4=DatContrato::listarSuministradosDelAnno($parametros);
        $ejecutadofisico=floatval($result4[$cont]['montopagado']);
        //var_dump($result4); die;
        if($parametros['tipoplan']==1255){
            $result5=DatContrato::listarPendientesSumDelAnno($parametros);
            //var_dump($result5); die;
            $pendienteejecutar=floatval($result5[$cont]['total']);
            $arrayexportar[$cont]['pendienteejecutar'] = $pendienteejecutar;
        }
        
        $arrayexportar[$cont]['aprobado'] = $aprobado;
        $arrayexportar[$cont]['presentado'] = $presentado;
        $arrayexportar[$cont]['disponible'] = $disponible;
        
        $arrayexportar[$cont]['contratado'] = $contratado;
        $arrayexportar[$cont]['pendientecontratar'] = $pendientecontratar;
        $arrayexportar[$cont]['ejecutadofisico'] = $ejecutadofisico;
        
        return $arrayexportar;
    }
    
    public function ConstruirListaSalidaResumen($parametros, $tiposalida){
        //print_r($parametros); die;
        if($tiposalida==1){
            $result1 = DatSolicitud711::listarSolicitudes711($parametros);
            return ($result1[0]['totalpresentado'] != null) ? $result1[0]['totalpresentado'] : 0;
        }
        if($tiposalida==2){
            $result3 = DatContrato::listarContratoPlanEntidad($parametros);
             return ($result3[0]['totalcontratado'] != null) ? $result3[0]['totalcontratado'] : 0;
        }
        if($tiposalida==3){
            $result4 = DatContrato::listarSuministradosDelAnno($parametros);
             return ($result4[0]['montopagado'] != null) ? $result4[0]['montopagado'] : 0;
        }
    }

    public function TotalImportacionesF1($parametros) {
        
        $data=$this->DamelistaEntidas($parametros['entidad']);
        $cc="";
        if($parametros['idcc']!=null){
            $cc=$result = Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador= {$parametros['idcc']}");
        }
        //Llenar arreglo con datos a exportar
        $arrayexportar = array();
        $cont = 0;
        foreach ($data as $value) {
            $parametros['identidad']= $value['identidad'];
            //Busqueda de datos
            $result1 = DatDistribucion::listarDistribucion($parametros);
            $aprobado= ($result1[0]['total']!=null)? $result1[0]['total']:0;
            
            $result2 = DatDistribucion::MontoTotal($parametros);
            $disponible = ($result2[0]['montototal']!=null)? $result2[0]['montototal']:0;
            
            $presentado= floatval($aprobado)-floatval($disponible);
            $porcientofalta1 = (floatval($disponible)*100)/floatval($aprobado);
            $porcientofalta = ($porcientofalta1!=null)? $porcientofalta1:0;
            
            $arrayexportar[$cont]['nombreentidad']= $value['nombreentidad'];            
            $arrayexportar[$cont]['aprobado']= $aprobado;            
            $arrayexportar[$cont]['presentado']= $presentado;            
            $arrayexportar[$cont]['disponible']= $disponible;            
            $arrayexportar[$cont]['porcientofalta']= $porcientofalta; 
            $cont++;
        }
        $this->ExportarTotalImportacionesF1($arrayexportar, $cc[0]->denominacion, $parametros['anno']);        
    }
    
    public function ExportarTotalImportacionesF1($arrayexportar,$cc, $anno) {
        $fecha= date('d/m/Y');
        $ta1=0;
        $tp1=0;
        $td1=0;
        $tpp1=0;
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=FinanzasTotalImportaciones.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "
        <meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
            </TR>
            <TR>
				<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
				<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
				<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
				<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
				<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000><B>CAPACIDAD DE IMPORTACIONES UIM $anno</B></FONT></TD>
            </TR>
			<TR>
				<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
			</TR>
			<TR>
				<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000><B>Reporte total de importaciones</B></FONT></TD>
            </TR>
			<TR>
				<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
			</TR>";
        if($cc!=""){
        echo"
        <TR>
			<TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=2 color=#000000><B>$cc</B></FONT></TD>
        </TR>
        ";
        }
        echo"  
        <TR>
        <TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>
            <TR>
                <TD width=78 style='border: none;' COLSPAN=4 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
                <TD width=78 style='border: none;' align=left><FONT face=Arial size=2 color=#000000><B>$fecha</B></FONT></TD>
            </TR>
			<TR>
                <TD width=78 COLSPAN=5 align=center><FONT face=Arial size=2 color=#000000><B>Reporte Total de Importaciones</B></FONT></TD>
            </TR>
            <TR>
                <TD width=300 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Entidades</B></FONT></TD>
                
                <TD width=150 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Aprobado</B></FONT></TD>
                <TD width=150 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Presentado</B></FONT></TD>
                <TD width=150 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Disponible</B></FONT></TD>
                <TD width=150 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>% Pendiente de Presentar</B></FONT></TD>
            </TR><TR></TR>";
        foreach ($arrayexportar as $value){
            echo "
            <TR>
                <TD width=300 align=left><FONT face=Arial size=2 color=#000000>{$value['nombreentidad']}</FONT></TD>
                <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['aprobado'], 6)."</TD>
                <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['presentado'], 6)."</TD>
                <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['disponible'], 6)."</TD>
                <TD width=150 align=right style=\"mso-number-format:'#,##0.00';\">".round($value['porcientofalta'], 2)."</TD>
            </TR>";
            $ta1+=$value['aprobado'];
            $tp1+=$value['presentado'];
            $td1+=$value['disponible'];                                    
        }
        $tpp1+=100-((floatval($tp1)*100)/floatval($ta1));
        echo 
            "<TR>
                <TD width=300 align=left><FONT face=Arial size=2 color=#000000><B>TOTAL</B></FONT></TD>
                <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($ta1, 6)."</B></TD>
                <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($tp1, 6)."</B></TD>
                <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($td1, 6)."</B></TD>
                <TD width=150 align=right style=\"mso-number-format:'#,##0.00';\">"."<B>".round($tpp1, 2)."</B></TD>
            </TR>
            </TABLE>";
    }
    
    public function TotalImportacionesF2($parametros){
        $data = $this->DamelistaEntidas($parametros['entidad']);
        $cc="";
        if($parametros['idcc']!=null){
            $cc=$result = Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador= {$parametros['idcc']}");
        }
        
        $imp="";
        if($parametros['idempimp']!=null){
            $imp=$result = Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador= {$parametros['idempimp']}");
        }
        
        $dataff = array();
        $arrayexportar = new stdClass();
        
        $cont =1;
        if($parametros['idff']==null){
            $ff= Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("idtiponomenclador = 5001");
            foreach ($ff as $value){
                if ($value->denominacion != '-') {
                    $dataff[$cont]['iddatosnomenclador']=$value->iddatosnomenclador;
                    $dataff[$cont]['denominacion']=$value->denominacion;
                    $cont++;
                }
            }                
        }else{
            $ff= Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador = {$parametros['idff']}");
            $dataff[$cont]['iddatosnomenclador']=$ff[0]->iddatosnomenclador;
            $dataff[$cont]['denominacion']=$ff[0]->denominacion;
        }
        $arrayexportar->total[0]['nombreentidad']='Total';
        for ($index = 0; $index < count($data); $index++) {
            
            //$arrayexportar[$index][0]['denominacion'] = 'Total';
            $arrayexportar->lista[$index]['nombreentidad']= $data[$index]['nombreentidad'];
			$atotal=0;
			$ptotal=0;
			
            foreach ($dataff as $value) {
				$parametros['identidad']= $data[$index]['identidad'];
                $parametros['idff']= $value['iddatosnomenclador'];
				
                $arrayexportar->lista[$index][$value['iddatosnomenclador']]['idff'] = $value['iddatosnomenclador'];
                $arrayexportar->lista[$index][$value['iddatosnomenclador']]['denom'] = $value['denominacion'];
				$aprobado = DatDistribucion::listarDistribucion($parametros); 
				
                $arrayexportar->lista[$index][$value['iddatosnomenclador']]['aprobado'] =$aprobado[0]['total'];
				$presentado = DatSolicitud711::listarSolicitudes711Reportes($parametros);
				$arrayexportar->lista[$index][$value['iddatosnomenclador']]['presentado'] =$presentado[0]['totalsolicitado'];
				
				$atotal+=floatval($aprobado[0]['total']);
				$ptotal+=floatval($presentado[0]['totalsolicitado']);
				
				$disponible= floatval($aprobado[0]['total'])-floatval($presentado[0]['totalsolicitado']);
				$arrayexportar->lista[$index][$value['iddatosnomenclador']]['disponible'] = $disponible;
				
				$porcientofalta= (floatval($disponible)*100)/floatval($aprobado[0]['total']);
				$arrayexportar->lista[$index][$value['iddatosnomenclador']]['porcientofalta'] = $porcientofalta;
				$arrayexportar->total[0][$value['iddatosnomenclador']]['aprobado']+=floatval($aprobado[0]['total']);
				$arrayexportar->total[0][$value['iddatosnomenclador']]['presentado']+=floatval($presentado[0]['totalsolicitado']);				
            }
			$arrayexportar->lista[$index]['aprobado']= $atotal;
			$arrayexportar->lista[$index]['presentado']= $ptotal;
			$arrayexportar->lista[$index]['disponible']= floatval($atotal)-floatval($ptotal);
			$arrayexportar->lista[$index]['porcientofalta']= (floatval($arrayexportar->lista[$index]['disponible'])*100)/floatval($atotal);
			$arrayexportar->total[0]['aprobado']+= $atotal;
			$arrayexportar->total[0]['presentado']+= $ptotal;
        }
		$arrayexportar->total[0]['disponible']= floatval($arrayexportar->total[0]['aprobado'])-floatval($arrayexportar->total[0]['presentado']);
		$arrayexportar->total[0]['porcientofalta']= (floatval($arrayexportar->total[0]['disponible'])*100)/floatval($arrayexportar->total[0]['aprobado']);		
		//print_r('<pre>');print_r($arrayexportar); die;
        $this->ExportarTotalImportacionesF2($arrayexportar, $cc[0]->denominacion, $dataff, $imp[0]->denominacion, $parametros['anno']);       
        
    }
    
    public function ExportarTotalImportacionesF2($arrayexportar,$cc,$ff, $empimp, $anno) {
            
        $cp= count($ff)*4+4;
        $cp1= $cp+1;
        $cp2= $cp1/2;
        $fecha= date('d/m/Y');
        $auxtotales = array();
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=FinanzasTotalImportaciones2.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "
        <meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
               
            </TR>
            <TR>
            <TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
			<TR>
            <TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD width=78 style='border: none;' COLSPAN=5 align=right><FONT face=Arial size=3 color=#000000><B>CAPACIDAD DE IMPORTACIONES UIM $anno</B></FONT></TD>
            </TR>
            <TR>
            <TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
                <TD width=78  style='border: none;' COLSPAN=$cp2 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
                <TD width=78 style='border: none;' COLSPAN=$cp2 align=left><FONT face=Arial size=3 color=#000000><B>$fecha</B></FONT></TD>
            </TR>
			<TR>
                <TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000><B>Reporte Total de Importaciones por importadora</B></FONT></TD>
            </TR>";
            if($cc!=""){
            echo"
            <TR>
                <TD width=78 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=2 color=#000000><B>$cc</B></FONT></TD>
            </TR>
            ";
            }
            echo"
            <TR>
                <TD width=78 ROWSPAN=3 align=center><FONT face=Arial size=2 color=#000000><B>EMPRESAS</B></FONT></TD>
                <TD width=78 COLSPAN=$cp align=left><FONT face=Arial size=2 color=#000000>Importadora: $empimp</FONT></TD>
            </TR>
            <TR>
                <TD  COLSPAN=4 align=center><FONT face=Arial size=2 color=#000000><B>Total</B></FONT></TD>";        
            foreach ($ff as $value){
                echo "
                <TD width=78 COLSPAN=4 align=center><FONT face=Arial size=2 color=#000000>{$value['denominacion']}</FONT></TD>";
                }
            echo "
            </TR>
            <TR>
                <TD width=150 align=center><FONT face=Arial size=2 color=#000000><B>Aprobado</B></FONT></TD>
                <TD width=150 align=center><FONT face=Arial size=2 color=#000000><B>Presentado</B></FONT></TD>
                <TD width=150 align=center><FONT face=Arial size=2 color=#000000><B>Disponible</B></FONT></TD>
                <TD width=150 align=center><FONT face=Arial size=2 color=#000000><B>% Pendiente de Presentar</B></FONT></TD>";        
            foreach ($ff as $value){
                echo "
                <TD width=150 align=center><FONT face=Arial size=2 color=#000000><B>Aprobado</B></FONT></TD>
                <TD width=150 align=center><FONT face=Arial size=2 color=#000000><B>Presentado</B></FONT></TD>
                <TD width=150 align=center><FONT face=Arial size=2 color=#000000><B>Disponible</B></FONT></TD>
                <TD width=150 align=center><FONT face=Arial size=2 color=#000000><B>% Pendiente de Presentar</B></FONT></TD>";
            }
            echo "
            </TR>";        
            foreach ($arrayexportar->lista as $value1){
                echo " 
					<TR>
                      <TD width=300 align=left><FONT face=Arial size=2 color=#000000>{$value1['nombreentidad']}</FONT></TD>
                      <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value1['aprobado'], 6)."</B></TD>
                      <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value1['presentado'], 6)."</B></TD>
                      <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value1['disponible'], 6)."</B></TD>
                      <TD width=150 align=right style=\"mso-number-format:'#,##0.00';\">".round($value1['porcientofalta'], 2)."</B></TD>
                      ";
                foreach ($ff as $value2){
                   echo "
                    <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value1[$value2['iddatosnomenclador']]['aprobado'], 6)."</TD>   
                    <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value1[$value2['iddatosnomenclador']]['presentado'], 6)."</TD>   
                    <TD width=150 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value1[$value2['iddatosnomenclador']]['disponible'], 6)."</TD>   
                    <TD width=150 align=right style=\"mso-number-format:'#,##0.00';\">".round($value1[$value2['iddatosnomenclador']]['porcientofalta'], 2)."</TD>";
                }
                echo 
            "</TR>";
            }
            $porcientofalta = (floatval($auxtotales[0]['disponible']) * 100) / floatval($auxtotales[0]['aprobado']);
            echo 
            "
            <TR>
                <TD width=300 align=left><FONT face=Arial size=2 color=#000000><B>TOTAL</B></FONT></TD>
                <TD width=78 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar->total[0]['aprobado'], 6)."</B></TD>
                <TD width=78 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar->total[0]['presentado'], 6)."</B></TD>
                <TD width=78 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar->total[0]['disponible'], 6)."</B></TD>
                <TD width=78 align=right style=\"mso-number-format:'#,##0.00';\">"."<B>".round($arrayexportar->total[0]['porcientofalta'], 2)."</B></TD>
                    ";
            foreach ($ff as $value){
                $disponible= floatval($arrayexportar->total[0][$value['iddatosnomenclador']]['aprobado'])-floatval($arrayexportar->total[0][$value['iddatosnomenclador']]['presentado']);
				$porcientofalta= (floatval($disponible)*100)/floatval($arrayexportar->total[0][$value['iddatosnomenclador']]['aprobado']);	
                echo " 
                <TD width=78 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar->total[0][$value['iddatosnomenclador']]['aprobado'], 6)."</B></TD>   
                <TD width=78 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar->total[0][$value['iddatosnomenclador']]['presentado'], 6)."</B></TD>   
                <TD width=78 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($disponible, 6)."</B></TD>   
                <TD width=78 align=right style=\"mso-number-format:'#,##0.00';\">"."<B>".round($porcientofalta, 2)."</B></TD>
                 ";
                }
            echo "
            </TR>
            <TR>
        </TABLE>";
    }
    
    public function TotalImportacionesA1($parametros){
        $data = $this->DamelistaEntidas($parametros['entidad']);
        $cc="";
        $ff="";
        if($parametros['idcc']!=null){
            $cc=$result = Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador= {$parametros['idcc']}");
        }
        
        $imp="";
        if($parametros['idempimp']!=null){
            $imp=$result = Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador= {$parametros['idempimp']}");
        }
        
        $dataff = array();
        $arrayexportar = array();
        if($parametros['idff']!=null){
            $ff= Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador = {$parametros['idff']}");
        }
        
        for ($index = 0; $index < count($data); $index++) {
            $parametros['identidad']= $data[$index]['identidad'];
            $arrayexportar[$index]['nombreentidad']= $data[$index]['nombreentidad']; 
            $arrayexportar[$index]['datos']=$this->ConstruirListaSalidaConContrato($parametros);
        }
        $this->ExportarTotalImportacionesA1($arrayexportar, $cc[0]->denominacion, $ff[0]->denominacion, $imp[0]->denominacion, $parametros['anno']); 
    }
    
    public function ExportarTotalImportacionesA1($arrayexportar,$cc,$ff, $empimp, $anno) {
        $fecha= date('d/m/Y');        
        $auxtotales = array();
        
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=AseguramientoTotalImportaciones1.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "
        <meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
            </TR>
            <TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000><B>CAPACIDAD DE IMPORTACIONES UIM $anno</B></FONT></TD>
            </TR>
			<TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000><B>Reporte de aseguramiento total de importaciones</B></FONT></TD>
			<TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            </TR>
        <TR>
        </TR>";
        if($cc!=""){
        echo"
        <TR>
        <TD width=583 COLSPAN=7 align=center><FONT face=Arial size=3 color=#000000><B>$cc</B></FONT></TD>
        </TR>
        ";
        }
        if($ff!=""){
        echo"
        <TR>
        <TD width=583 COLSPAN=7 align=center><FONT face=Arial size=3 color=#000000><B>$ff</B></FONT></TD>
        </TR>
        ";
        }
        if($empimp!=""){
        echo"
        <TR>
            <TD width=583 COLSPAN=7 align=center><FONT face=Arial size=3 color=#000000><B>$empimp</B></FONT></TD>
        </TR>
        ";
        }
        echo"  
        <TR>
            <TD width=583 style='border: none;' COLSPAN=7 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>
            <TR>
                <TD width=505 style='border: none;' COLSPAN=6 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
                <TD width=78 style='border: none;' align=center><FONT face=Arial size=3 color=#000000><B>$fecha</B></FONT></TD>
            </TR>
            <TR>
                <TD width=293 ROWSPAN=1 align=center><FONT face=Arial size=2 color=#000000><B>EMPRESA</B></FONT></TD>
                <TD width=108 ROWSPAN=1 align=center><FONT face=Arial size=2 color=#000000><B>APROBADO</B></FONT></TD>
                <TD width=120 ROWSPAN=1 align=center><FONT face=Arial size=2 color=#000000><B>PRESENTADO</B></FONT></TD>
                <TD width=123 ROWSPAN=1 align=center><FONT face=Arial size=2 color=#000000><B>PENDIENTE DE PRESENTAR</B></FONT></TD>
                <TD width=126 ROWSPAN=1 align=center><FONT face=Arial size=2 color=#000000><B>CONTRATADO</B></FONT></TD>
                <TD width=138 ROWSPAN=1 align=center><FONT face=Arial size=2 color=#000000><B>PENDIENTE DE CONTRATAR</B></FONT></TD>
                <TD width=109 ROWSPAN=1 align=center><FONT face=Arial size=2 color=#000000><B>EJECUTADO F�?SICO</B></FONT></TD>
            </TR>";
        foreach ($arrayexportar as $value){
            echo "
            <TR>
                <TD width=293 align=left><FONT face=Arial size=2 color=#000000>{$value['nombreentidad']}</FONT></TD>
                <TD width=108 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['datos'][0]['aprobado'], 6)."</TD>
                <TD width=120 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['datos'][0]['presentado'], 6)."</TD>
                <TD width=123 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['datos'][0]['disponible'], 6)."</TD>
                <TD width=126 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['datos'][0]['contratado'], 6)."</TD>
                <TD width=138 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['datos'][0]['pendientecontratar'], 6)."</TD>
                <TD width=109 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value['datos'][0]['ejecutadofisico'], 6)."</TD>
                
            </TR>";
            $auxtotales['aprobado']+=$value['datos'][0]['aprobado'];                                    
            $auxtotales['presentado']+=$value['datos'][0]['presentado'];                                    
            $auxtotales['disponible']+=$value['datos'][0]['disponible'];                                    
            $auxtotales['contratado']+=$value['datos'][0]['contratado'];                                    
            $auxtotales['pendientecontratar']+=$value['datos'][0]['pendientecontratar'];                                    
            $auxtotales['ejecutadofisico']+=$value['datos'][0]['ejecutadofisico'];                                    
        }
        $porcientos['presentado'] = ($auxtotales['presentado']*100)/$auxtotales['aprobado'];
        $porcientos['contratado'] = ($auxtotales['contratado']*100)/$auxtotales['aprobado'];
        $porcientos['ejecutadofisico'] = ($auxtotales['ejecutadofisico']*100)/$auxtotales['aprobado'];
        echo 
            "<TR>
                <TD width=293 align=left><FONT face=Arial size=3 color=#000000><B>TOTALES</B></FONT></TD>
                <TD width=108 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['aprobado'], 6)."</B></TD>
                <TD width=120 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['presentado'], 6)."</B></TD>
                <TD width=123 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['disponible'], 6)."</B></TD>
                <TD width=126 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['contratado'], 6)."</B></TD>
                <TD width=138 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['pendientecontratar'], 6)."</B></TD>
                <TD width=109 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['ejecutadofisico'], 6)."</B></TD>
                
            </TR>
            <TR>
                <TD width=293 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=108 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=120 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=123 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=126 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=138 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=109 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
                <TD width=293 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=108 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>APROBADO</B></FONT></TD>
                <TD width=120 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PRESENTADO</B></FONT></TD>
                <TD width=123 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>CONTRATADO</B></FONT></TD>
                <TD width=126 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>SUMINISTADO</B></FONT></TD>
                <TD width=138 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=109 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
                <TD width=293 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=138 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=109 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
                <TD width=293 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=108 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['aprobado'], 6)."</B></TD>
                <TD width=120 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['presentado'], 6)."</B></TD>
                <TD width=123 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['contratado'], 6)."</B></TD>
                <TD width=126 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($auxtotales['ejecutadofisico'], 6)."</B></TD>
                    
                <TD width=138 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
                <TD width=109 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            <TD width=293 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=108 align=center><FONT face=Calibri size=2 color=#000000>%</FONT></TD>
            <TD width=120 align=right style=\"mso-number-format:'#,##0.00';\">"."<B>".round($porcientos['presentado'], 2)."</B></TD>
            <TD width=120 align=right style=\"mso-number-format:'#,##0.00';\">"."<B>".round($porcientos['contratado'], 2)."</B></TD>
            <TD width=120 align=right style=\"mso-number-format:'#,##0.00';\">"."<B>".round($porcientos['ejecutadofisico'], 2)."</B></TD>
                
            <TD width=138 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=109 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            </TR>
            <TR>
            </TABLE>";
    }
    
    public function ResumenImportacionesA2($parametros){
		
        $data = $this->DamelistaMeses($parametros['idejer']);
        $dataentidad = array();
        if($parametros['entidad']){
            $dataentidad = $this->DamelistaEntidas($parametros['entidad']);
			$parametros['identidad']= $parametros['entidad'];
        }
        $cc="";
        if($parametros['idcc']!=null){
            $cc=$result = Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador= {$parametros['idcc']}");
        }
        
        $arrayexportar = array();
		$tiposalida = array();
        if($parametros['idff']!=null){
            $ff= Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador = {$parametros['idff']}");
        }
		if($parametros['tiposalida']==null){
			$tiposalida[0]=1;
			$tiposalida[1]=2;
			$tiposalida[2]=3;
		}else{
			$tiposalida[0]=$parametros['tiposalida'];
		}
		//print_r($tiposalida); die;
        foreach($tiposalida as $value){
			for ($index = 0; $index < count($data); $index++) {
				$fechainicio= date_parse($data[$index]['fechainicio']);
				$fechasplitin= split('/', $data[$index]['fechainicio']);
				$fechafin= date_parse($data[$index]['fechafin']);
				$parametros['fechainicio']= ''.$fechasplitin[2].'-'.$fechasplitin[1].'-'.$fechasplitin[0];
				$fechasplitfin= split('/', $data[$index]['fechafin']);
				$parametros['fechafin']= ''.$fechasplitfin[2].'-'.$fechasplitfin[1].'-'.$fechasplitfin[0];
				//var_dump($fechafin);
				$arrayexportar[$value][$index]['mes']= $data[$index]['mes']; 
				$arrayexportar[$value][$index]['dato']=$this->ConstruirListaSalidaResumen($parametros, $value);
			}
		}
		//print_r('<pre>');print_r($arrayexportar); die;
        $this->ExportarResumenImportacionesA2($arrayexportar, $cc[0]->denominacion, $dataentidad[0]['nombreentidad'],$tiposalida, $parametros['anno']); 
    }
    
    public function ExportarResumenImportacionesA2($arrayexportar,$cc, $nombreentidad, $tiposalida, $anno) {
        $fecha= date('d/m/Y');
        $acumulado=0;
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=AseguramientoTotalImportaciones2.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "
        <meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
               
            </TR>
            <TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD  style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=14 align=center><FONT face=Arial size=3 color=#000000><B>RESUMEN DE IMPORTACIONES UIM $anno</B></FONT></TD>
            </TR>
            <TR>
            <TD width=583 style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
        <TR>
            <TD style='border: none;' width=505 COLSPAN=11 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
            <TD style='border: none;' COLSPAN=2 align=left><FONT face=Arial size=3 color=#000000><B>$fecha</B></FONT></TD>
        </TR>";
        if($nombreentidad!=""){
        echo"
        <TR>
            <TD width=583 COLSPAN=14 align=center><FONT face=Arial size=3 color=#000000><B>$nombreentidad</B></FONT></TD>
        </TR>
        ";
        }
		foreach($tiposalida as $value){
			if($value==1){
				$texto=' presentadas';
			}
			if($value==2){
				$texto=' contratadas';
			}
			if($value==3){
				$texto=' suministradas';
			}
			echo"
				<TR>
					<TD width=583 COLSPAN=14 align=center><FONT face=Arial size=3 color=#000000><B>Dato: Importaciones $texto</B></FONT></TD>
				</TR>
				";
			echo"  
			<TR>
				<TD width=134 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
				<TD width=89 align=left><FONT face=Calibri size=2 color=#000000><B>ACUMULADO</B></FONT></TD>";
			foreach ($arrayexportar[$value] as $value1){
				echo "
					<TD width=83 align=center><FONT face=Calibri size=2 color=#000000><B>{$value1['mes']}</B></FONT></TD>
				";
				$acumulado+=$value1['dato'];                                    
			}
			echo 
            "</TR>
             <TR>
               <TD width=134 align=left><FONT face=Calibri size=2 color=#000000><B>$cc</B></FONT></TD>
               <TD width=89 align=right style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($acumulado, 6)."</B></TD>";
			foreach ($arrayexportar[$value] as $value2){
				echo "
					<TD width=83 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value2['dato'], 6)."</TD>
				";                                 
			}	
		}
		
        
        
        echo 
            "</TR>
        </TABLE>";
    }
    
    public function InformacionGAEA3($parametros){
        $cc="";
        if($parametros['idcc']!=null){
            $cc=$result = Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador= {$parametros['idcc']}");
        }
//        $plan=$result = Doctrine::getTable('DatPlan711')
//                            ->findByDql("idejercicio= {$parametros['idejercicio']}");
        $parametros['idplan711']=$parametros['idejercicio'];
        
        $arrayexportarfila = array();
        $cont = 0;
        $ff= Doctrine::getTable('NomDatosnomenclador')
                        ->findByDql("idtiponomenclador = 5001");
        foreach ($ff as $value){
            if ($value->denominacion != '-') {
                $dataff[$cont]['iddatosnomenclador']=$value->iddatosnomenclador;
                $dataff[$cont]['denominacion']=$value->denominacion;
                $cont++;
            }
        }

        //print_r($parametros); die;
        $parametros2=$parametros;
        //Todos los datos de la fila1
        $parametros['idcc']=null;
        $result1 = DatPlan711::listarFFyCC($parametros);
        $arrayexportarfila['T']['total'] = ($result1[0]['total'] != null) ? $result1[0]['total'] : 0;
        //Total de lo suministrado
        $arrayexportarfila['T']['acumulado'] = 0;
        foreach ($ff as $value){
            $parametros['idff']=$value['iddatosnomenclador'];
            $result4 = DatContrato::listarSuministradosDelAnno($parametros);
            $arrayexportarfila['T'][$value['iddatosnomenclador']] = ($result4[0]['montopagado'] != null) ? $result4[0]['montopagado'] : 0;
            $arrayexportarfila['T']['acumulado'] += ($result4[0]['montopagado'] != null) ? $result4[0]['montopagado'] : 0;
        }
        $parametros['idff']=NULL;
        //TotalTecnotex
        $parametros['idempimp']=5013;
        $result2 = DatPlan711::listarFFyCC($parametros);
        $arrayexportarfila['T']['T-TX'] = ($result2[0]['total'] != null) ? $result2[0]['total'] : 0;
        $result2 = DatSolicitud711::listarSolicitudes711($parametros);
        $arrayexportarfila['T']['P-TX'] = ($result2[0]['totalpresentado'] != null) ? $result2[0]['totalpresentado'] : 0;
        $result3 = DatContrato::listarContratoPlanEntidad($parametros);
        $arrayexportarfila['T']['C-TX']= ($result3[0]['totalcontratado'] != null) ? $result3[0]['totalcontratado'] : 0;
        //TotalTecnoImport
        $parametros['idempimp']=5014;
        $result3 = DatPlan711::listarFFyCC($parametros);
        $arrayexportarfila['T']['T-TI'] = ($result3[0]['total'] != null) ? $result3[0]['total'] : 0;
        $result3 = DatSolicitud711::listarSolicitudes711($parametros);
        $arrayexportarfila['T']['P-TI'] = ($result3[0]['totalpresentado'] != null) ? $result3[0]['totalpresentado'] : 0;
        $result3 = DatContrato::listarContratoPlanEntidad($parametros);
        $arrayexportarfila['T']['C-TI']= ($result3[0]['totalcontratado'] != null) ? $result3[0]['totalcontratado'] : 0;
        
        //Comienza fila2
        $result1 = DatPlan711::listarFFyCC($parametros2);
        $arrayexportarfila['F']['total'] = ($result1[0]['total'] != null) ? $result1[0]['total'] : 0;
        //Total de lo suministrado
        $arrayexportarfila['F']['acumulado'] = 0;
        foreach ($ff as $value){
            $parametros2['idff']=$value['iddatosnomenclador'];
            $result4 = DatContrato::listarSuministradosDelAnno($parametros2);
            $arrayexportarfila['F'][$value['iddatosnomenclador']] = ($result4[0]['montopagado'] != null) ? $result4[0]['montopagado'] : 0;
            $arrayexportarfila['F']['acumulado'] += ($result4[0]['montopagado'] != null) ? $result4[0]['montopagado'] : 0;
        }
        $parametros2['idff']=NULL;
        //TotalTecnotex
        $parametros2['idempimp']=5013;
        $result2 = DatPlan711::listarFFyCC($parametros2);
        $arrayexportarfila['F']['T-TX'] = ($result2[0]['total'] != null) ? $result2[0]['total'] : 0;
        $result2 = DatSolicitud711::listarSolicitudes711($parametros2);
        $arrayexportarfila['F']['P-TX'] = ($result2[0]['totalpresentado'] != null) ? $result2[0]['totalpresentado'] : 0;
        $result3 = DatContrato::listarContratoPlanEntidad($parametros2);
        $arrayexportarfila['F']['C-TX']= ($result3[0]['totalcontratado'] != null) ? $result3[0]['totalcontratado'] : 0;
        //TotalTecnoImport
        $parametros2['idempimp']=5014;
        $result3 = DatPlan711::listarFFyCC($parametros2);
        $arrayexportarfila['F']['T-TI'] = ($result3[0]['total'] != null) ? $result3[0]['total'] : 0;
        $result3 = DatSolicitud711::listarSolicitudes711($parametros2);
        $arrayexportarfila['F']['P-TI'] = ($result3[0]['totalpresentado'] != null) ? $result3[0]['totalpresentado'] : 0;
        $result3 = DatContrato::listarContratoPlanEntidad($parametros2);
        $arrayexportarfila['F']['C-TI']= ($result3[0]['totalcontratado'] != null) ? $result3[0]['totalcontratado'] : 0;
        
        
        $this->ExportarConstruirListaSalidaResumenGAE($arrayexportarfila, $cc[0]->denominacion,$dataff, $parametros['anno']); 
    }
    
    public function ExportarConstruirListaSalidaResumenGAE($arrayexportar,$cc,$ff,$anno) {
        $fecha= date('d/m/Y');
        $acumulado=0;
        $cp= count($ff);
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=ResumenTotalImportaciones3.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "
        <meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=16 align=center><FONT face=Arial size=3 color=#000000><B>INFORMACIÓN DE IMPORTACIONES UIM AL GAE PLAN $anno</B></FONT></TD>
            </TR>
        <TR>
        <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
        </TR>
            <TR>
                <TD style='border: none;' COLSPAN=14 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
                <TD style='border: none;' COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>$fecha</B></FONT></TD>
            </TR>
        <TR>
            <TD style='border: none;' COLSPAN=14 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>";
        echo"  
        <TR>
            <TD width=168 ROWSPAN=3 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=213 ROWSPAN=2 COLSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>PLAN</B></FONT></TD>
            <TD width=213 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>PRESENTADO</B></FONT></TD>
            <TD width=600 COLSPAN=$cp align=center><FONT face=Calibri size=2 color=#000000><B>IMPORTADO POR FUENTES DE FINANCIAMIENTO</B></FONT></TD>
            <TD width=50 ROWSPAN=3 align=center><FONT face=Calibri size=2 color=#000000><B>REAL ACUMULADO</B></FONT></TD>
            <TD width=200 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>CONTRATADO</B></FONT></TD>
        </TR>
        <TR>";        
            foreach ($ff as $value){
                echo "
                <TD width=100 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>{$value['denominacion']}</B></FONT></TD>";
                }
            echo "
        </TR>
        <TR>
            <TD width=130 align=center><FONT face=Calibri size=2 color=#000000><B>TOTAL GENERAL</B></FONT></TD>
            <TD width=113 align=center><FONT face=Calibri size=2 color=#000000><B>TX</B></FONT></TD>
            <TD width=100 align=center><FONT face=Calibri size=2 color=#000000><B>TI</B></FONT></TD>
            <TD width=113 align=center><FONT face=Calibri size=2 color=#000000><B>TX</B></FONT></TD>
            <TD width=100 align=center><FONT face=Calibri size=2 color=#000000><B>TI</B></FONT></TD>
            <TD width=100 align=center><FONT face=Calibri size=2 color=#000000><B>TX</B></FONT></TD>
            <TD width=100 align=center><FONT face=Calibri size=2 color=#000000><B>TI</B></FONT></TD>
        </TR>
        <TR>
            <TD width=168 align=left><FONT face=Calibri size=2 color=#000000><B>TOTAL</B></FONT></TD>
                <TD width=130 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar['T']['total'], 6)."</B></TD>
                <TD width=113 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar['T']['T-TX'], 6)."</B></TD>
                <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar['T']['T-TI'], 6)."</B></TD>
                <TD width=113 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar['T']['P-TX'], 6)."</B></TD>
                <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($arrayexportar['T']['P-TI'], 6)."</B></TD>";        
                foreach ($ff as $value){
                    echo "
                    <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['T'][$value['iddatosnomenclador']], 6)."</TD>";
                    }
                echo "
                <TD width=50 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['T']['acumulado'], 6)."</TD>
                <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['T']['C-TX'], 6)."</TD>
                <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['T']['C-TI'], 6)."</TD>
        </TR>
        <TR>
            <TD width=168 align=left><FONT face=Calibri size=2 color=#000000><B>De ello: $cc</B></FONT></TD>
                <TD width=130 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F']['total'], 6)."</TD>
                <TD width=113 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F']['T-TX'], 6)."</TD>
                <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F']['T-TI'], 6)."</TD>
                <TD width=113 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F']['P-TX'], 6)."</TD>
                <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F']['P-TI'], 6)."</TD>";        
                foreach ($ff as $value){
                    echo "
                    <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F'][$value['iddatosnomenclador']], 6)."</TD>";
                    
                    }
                echo "
                <TD width=50 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F']['acumulado'], 6)."</TD>
                <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F']['C-TX'], 6)."</TD>
                <TD width=100 align=center style=\"mso-number-format:'#,##0.000000';\">".round($arrayexportar['F']['C-TI'], 6)."</TD>
                    
        </TR>
        <TR>
            <TD width=168 align=left><FONT face=Calibri size=2 color=#000000><B>(*) Importan por la propia entidad</B></FONT></TD>
            <TD width=130 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=113 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=113 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=50 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=left><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
        </TR>
        <TR>
            <TD width=168 align=left><FONT face=Calibri size=2 color=#000000><B>De ello: Importaciones de servicios</B></FONT></TD>
            <TD width=130 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=113 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
        </TR>
        <TR>
            <TD width=168 align=left><FONT face=Calibri size=2 color=#000000><B>De ello: para $cc</B></FONT></TD>
            <TD width=130 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=113 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
        </TR>
        <TR>
            <TD width=168 align=left><FONT face=Calibri size=2 color=#000000><B>Gastos de viajes</B></FONT></TD>
            <TD width=130 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=113 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
            <TD width=100 align=right><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT></TD>
        </TR>
        
        </TABLE>";
    }
    
    public function ValoresGeneralesFAR($parametros){
        $arrayexportar = array();
        $cont=0;
        if($parametros['idff']!=null){
            $ff= Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador = {$parametros['idff']}");
        }
        ////////////////////
        if($parametros['tiposalida']==1){
            $arrayexportar['tiposalida'] = 'Plan';
            $arrayexportar['datos'][$cont]['denominacion'] = 'Plan';
            $arrayexportar['datos'][$cont]['datos']= $this->ConstruirListaSalidaFar($parametros);
        }
        
        ///////////////////////
        if($parametros['tiposalida']==2){
            $arrayexportar['tiposalida'] = 'Código';
            if($parametros['idcc']==null){
            $cc= Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("idtiponomenclador = 15092");
            foreach ($cc as $value){
                if ($value->denominacion != '-') {
                    $datacc[$cont]['iddatosnomenclador']=$value->iddatosnomenclador;
                    $datacc[$cont]['denominacion']=$value->denominacion.'--'.$value->descripcion;
                    $datacc[$cont]['denominacion1']=$value->denominacion;
                    $datacc[$cont]['denominacion2']=$value->descripcion;
                    $cont++;
                }
            }                
        }else{
            $cc= Doctrine::getTable('NomDatosnomenclador')
                            ->findByDql("iddatosnomenclador = {$parametros['idcc']}");
            $datacc[$cont]['iddatosnomenclador']=$cc[0]->iddatosnomenclador;
            $datacc[$cont]['denominacion']=$cc[0]->denominacion.'--'.$value->descripcion;
            $datacc[$cont]['denominacion1']=$cc[0]->denominacion;
            $datacc[$cont]['denominacion2']=$value->descripcion;
            $cont++;
        }
        $cont=0;
        foreach ($datacc as $value) {
                $parametros['idcc']= $value['iddatosnomenclador'];
                $arrayexportar['datos'][$cont]['denominacion'] = $value['denominacion'];
                $arrayexportar['datos'][$cont]['denominacion1'] = $value['denominacion1'];
                $arrayexportar['datos'][$cont]['denominacion2'] = $value['denominacion2'];
                $arrayexportar['datos'][$cont]['datos'] = $this->ConstruirListaSalidaFar($parametros);      
                $cont++;
            }
        }
        ///////////////
        if($parametros['tiposalida']==3){
            $arrayexportar['tiposalida'] = 'Entidades';
            $data = $this->DamelistaEntidas($parametros['entidad']);
            foreach ($data as $value) {
                $parametros['identidad']= $value['identidad'];
                $arrayexportar['datos'][$cont]['denominacion'] = $value['nombreentidad'];
                $arrayexportar['datos'][$cont]['datos'] = $this->ConstruirListaSalidaFar($parametros);      
                $cont++;              
            }
        }
        
        $this->ExportarValoresGeneralesFAR($arrayexportar, $parametros['anno']); 
    }
    
    public function ExportarValoresGeneralesFAR($arrayexportar, $anno) {

        $fecha= date('d/m/Y');
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=FarImportaciones1.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "
        <meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
            </TR>
            <TR>
                <TD style='border: none;' width=583 COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000><B>ESTADO DE EJECUCIÓN PLAN FAR $anno</B></FONT></TD>
            </TR>
            <TR>
                <TD style='border: none;' width=583 COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
                <TD style='border: none;' width=583 COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000><B>CLIENTE: UNIÓN DE INDUSTRIAS MILITARES</B></FONT></TD>
            </TR>
        <TR>
            <TD style='border: none;' width=583 COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>
        <TR>
            <TD style='border: none;' width=505 COLSPAN=7 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
            <TD style='border: none;' width=78 align=center><FONT face=Arial size=3 color=#000000><B>$fecha</B></FONT></TD>
        </TR>
        <TR> 
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>{$arrayexportar['tiposalida']}</B></FONT></TD>
            <TD width=112 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>APROBADO</B></FONT></TD>
            <TD width=154 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PRESENTADO</B></FONT></TD>
            <TD width=139 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PENDIENTE DE PRESENTAR</B></FONT></TD>
            <TD width=163 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>CONTRATADO</B></FONT></TD>
            <TD width=187 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PENDIENTE DE CONTRATAR</B></FONT></TD>
            <TD width=172 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>SUMINISTRADO</B></FONT></TD>
            <TD width=248 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PENDIENTE DE SUMINISTRAR</B></FONT></TD>
        </TR>
        <TR>
        </TR>";
        foreach ($arrayexportar['datos'] as $value){
            echo "
            <TR>
                <TD width=173 align=left><FONT face=Calibri size=2 color=#000000>{$value['denominacion']}</FONT></TD>
                <TD width=112 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['aprobado'], 6)."</B></TD>
                <TD width=154 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['presentado'], 6)."</B></TD>
                <TD width=139 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['disponible'], 6)."</B></TD>
                <TD width=163 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['contratado'], 6)."</B></TD>
                <TD width=187 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['pendientecontratar'], 6)."</B></TD>
                <TD width=172 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['ejecutadofisico'], 6)."</B></TD>
                <TD width=248 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['pendienteejecutar'], 6)."</B></TD>

            </TR>";                                  
        }
        echo 
            "
            </TABLE>";
        
    }
    
    public function ValoresPorCyEFAR($parametros){
        $arrayexportar = array();
        $cont=0;
        $query = Doctrine_Query::create();
        //print_r($parametros); die;
        if($parametros['idcc']==null){
            $cc = $query->select(
                '*'
            )
                ->from('NomDatosnomenclador d')
                ->where('d.idtiponomenclador =?', 15092)
                ->orderby('d.denominacion')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            foreach ($cc as $value){
                if ($value['denominacion'] != '-') {
                    $datacc[$cont]['iddatosnomenclador']=$value['iddatosnomenclador'];
                    $datacc[$cont]['denominacion']=$value['denominacion'];
                    $datacc[$cont]['denominacioncod']=$value['denominacion'].'--'.$value['descripcion'];
                    $cont++;
                }
            }
            //var_dump($datacc); die;
        }else{
            $cc = $query->select(
                '*'
            )
                ->from('NomDatosnomenclador d')
                ->where('d.iddatosnomenclador =?', $parametros['idcc'])
                ->orderby('d.denominacion')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            foreach ($cc as $value){
                if ($value['denominacion'] != '-') {
                    $datacc[$cont]['iddatosnomenclador']=$value['iddatosnomenclador'];
                    $datacc[$cont]['denominacion']=$value['denominacion'];
                    $datacc[$cont]['denominacioncod']=$value['denominacion'].'--'.$value['descripcion'];
                    $cont++;
                }
            }
        }
        $cont=0;
        $data = $this->DamelistaEntidas($parametros['entidad']);
        foreach ($datacc as $value1) {
            $parametros['idcc']= $value1['iddatosnomenclador'];
            foreach ($data as $value) {
                $parametros['identidad']= $value['identidad'];
                $arrayexportar['datos'][$cont][$value1['iddatosnomenclador']] = $value1['denominacion'];
                $arrayexportar['datos'][$cont]['idcc'] = $value1['iddatosnomenclador'];
                $arrayexportar['datos'][$cont]['denominacion'] = $value['nombreentidad'];
                $arrayexportar['datos'][$cont]['datos'] = $this->ConstruirListaSalidaFar($parametros);      
                $cont++;              
            }
        }
        
        
        $this->ExportarValoresPorCyEFAR($arrayexportar, $datacc, $parametros['anno']); 
    }
    
    public function ExportarValoresPorCyEFAR($arrayexportar, $datacc, $anno) {
        //var_dump($datacc); die;
        $fecha= date('d/m/Y');
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=FARImportaciones2.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "
        <meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
             <TR>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=9 align=center><FONT face=Arial size=3 color=#000000><B>ESTADO DE EJECUCIÓN PLAN FAR $anno</B></FONT></TD>
            </TR>
            <TR>
                <TD style='border: none;' COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
                <TD COLSPAN=9 align=center><FONT face=Arial size=3 color=#000000>CLIENTE: UNIÓN DE INDUSTRIAS MILITARES</FONT></TD>
            </TR>
        <TR>
        <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
        </TR>               
        <TR>
        <TD style='border: none;' COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>
        <TR>
            <TD style='border: none;' COLSPAN=7 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
            <TD style='border: none;' align=center><FONT face=Arial size=3 color=#000000><B>$fecha</B></FONT></TD>
        </TR>
        <TR>";
        $totalaprobadog = 0;
        $totalpresentadog = 0;
        $pendientepresentarg = 0;
        $contratadog = 0;
        $pendientecontratadog = 0;
        $suministradog = 0;
        $pendientesuministradog = 0;
        foreach ($datacc as $value1){
            $totalaprobado = 0;
            $totalpresentado = 0;
            $pendientepresentar = 0;
            $contratado = 0;
            $pendientecontratado = 0;
            $suministrado = 0;
            $pendientesuministrado = 0;
            echo " 
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>{$value1['denominacioncod']}</B></FONT></TD>
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>ENTIDADES</B></FONT></TD>
            <TD width=112 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>APROBADO</B></FONT></TD>
            <TD width=154 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PRESENTADO</B></FONT></TD>
            <TD width=139 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PENDIENTE DE PRESENTAR</B></FONT></TD>
            <TD width=163 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>CONTRATADO</B></FONT></TD>
            <TD width=187 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PENDIENTE DE CONTRATAR</B></FONT></TD>
            <TD width=172 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>SUMINISTRADO</B></FONT></TD>
            <TD width=248 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>PENDIENTE DE SUMINISTRAR</B></FONT></TD>
        </TR>
        <TR>
        </TR>";
            foreach ($arrayexportar['datos'] as $value){
                if($value['idcc']==$value1['iddatosnomenclador']){
                    $denom = $value['denominacion'];
                    $totalaprobado +=$value['datos'][0]['aprobado'];
                    $totalpresentado += $value['datos'][0]['presentado'];
                    $pendientepresentar += $value['datos'][0]['disponible'];
                    $contratado += $value['datos'][0]['contratado'];
                    $pendientecontratado +=$value['datos'][0]['pendientecontratar'];
                    $suministrado +=$value['datos'][0]['ejecutadofisico'];
                    $pendientesuministrado +=$value['datos'][0]['pendienteejecutar'];
                echo "
                <TR>
                    <TD width=173 align=left><FONT face=Calibri size=2 color=#000000>{$value[$value1['iddatosnomenclador']]}</FONT></TD>
                    <TD width=173 align=left><FONT face=Calibri size=2 color=#000000>{$denom}</FONT></TD>

                    <TD width=112 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['aprobado'], 6)."</B></TD>
                    <TD width=154 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['presentado'], 6)."</B></TD>
                    <TD width=139 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['disponible'], 6)."</B></TD>
                    <TD width=163 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['contratado'], 6)."</B></TD>
                    <TD width=187 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['pendientecontratar'], 6)."</B></TD>
                    <TD width=172 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['ejecutadofisico'], 6)."</B></TD>
                    <TD width=248 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['datos'][0]['pendienteejecutar'], 6)."</B></TD>
                    
                </TR>";  
                }
            }
            echo "<TR>
                    <TD width=173 align=left COLSPAN=2><FONT face=Calibri size=2 color=#000000><B>TOTALES</B></FONT></TD>
                    
                    <TD width=112 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($totalaprobado, 6)."</B></TD>
                    <TD width=154 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($totalpresentado, 6)."</B></TD>
                    <TD width=139 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($pendientepresentar, 6)."</B></TD>
                    <TD width=163 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($contratado, 6)."</B></TD>
                    <TD width=187 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($pendientecontratado, 6)."</B></TD>
                    <TD width=172 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($suministrado, 6)."</B></TD>
                    <TD width=248 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($pendientesuministrado, 6)."</B></TD>
                        
                </TR>";
            $totalaprobadog += $totalaprobado;
            $totalpresentadog += $totalpresentado;
            $pendientepresentarg += $pendientepresentar;
            $contratadog += $contratado;
            $pendientecontratadog += $pendientecontratado;
            $suministradog += $suministradog;
            $pendientesuministradog += $pendientesuministrado;
        }
        echo 
            "<TR>
                    <TD width=173 align=left COLSPAN=2><FONT face=Calibri size=2 color=#000000><B>TOTAl GENERAL</B></FONT></TD>
                    
                    <TD width=112 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($totalaprobadog, 6)."</B></TD>
                    <TD width=154 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($totalpresentadog, 6)."</B></TD>
                    <TD width=139 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($pendientepresentarg, 6)."</B></TD>
                    <TD width=163 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($contratadog, 6)."</B></TD>
                    <TD width=187 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($pendientecontratadog, 6)."</B></TD>
                    <TD width=172 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($suministradog, 6)."</B></TD>
                    <TD width=248 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($pendientesuministradog, 6)."</B></TD>
                        
                </TR>
            </TABLE>";
        
    }
    
	public function DesgloseConsolidado($parametros) {
		$parametros['idsolicitud711']= $parametros['entidad'];
		$enidades = DatSolicitud711::listarEmpresasEnConsolidado($parametros);
		$productos = DatSolicitud711::listarProductosSolitud($parametros);
		
		self::ExportarDesgloseConsolidado($enidades, $productos, $parametros['anno']);
	}	
		
	public function ExportarDesgloseConsolidado($enidades, $productos, $anno) {	
        //var_dump($datacc); die;
		$cantemp = count($enidades);
        $fecha= date('d/m/Y');
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=DesgloseConsolidado.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "
        <meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
             <TR>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=9 align=center><FONT face=Arial size=3 color=#000000><B>ESTADO DE EJECUCIÓN PLAN FAR $anno</B></FONT></TD>
            </TR>
            <TR>
                <TD style='border: none;' COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
                <TD COLSPAN=9 align=center><FONT face=Arial size=3 color=#000000><B>CLIENTE: UNIÓN DE INDUSTRIAS MILITARES</B></FONT></TD>
            </TR>
        <TR>
        <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
        </TR>  
        <TR>
			<TD style='border: none;' COLSPAN=7 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
            <TD style='border: none;' align=center><FONT face=Arial size=2 color=#000000><B>$fecha</B></FONT></TD>
        </TR>       
        <TR>
        <TD style='border: none;' COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>
		<TR>
            <TD COLSPAN=7 align=left><FONT face=Arial size=2 color=#000000><B>DESGLOSE DE UN CONSOLIDADO</B></FONT></TD>
        </TR> 
		<TR>
            <TD  align=right><FONT face=Arial size=2 color=#000000><B>No. Solicitud:</B></FONT></TD>
            <TD  COLSPAN=6 align=left><FONT face=Arial size=2 color=#000000><B>{$productos[0]['textnosolicitudo']}</B></FONT></TD>
        </TR>       
        <TR>
			<TD  align=right><FONT face=Arial size=2 color=#000000><B>Descripción General:</B></FONT></TD>
            <TD  COLSPAN=6 align=left><FONT face=Arial size=2 color=#000000><B>{$productos[0]['descripciongeneral']}</B></FONT></TD>
        </TR>
		<TR>
			<TD  align=right><FONT face=Arial size=2 color=#000000><B>Monto Total:</B></FONT></TD>
            <TD  COLSPAN=6 align=left face=Arial size=3 style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($productos[0]['totalgeneral'], 6)."</B></TD>
        </TR> 	
        <TR>
        <TD style='border: none;' COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>
		
		<TR>
            <TD style='border: none;' COLSPAN=7 align=right><FONT face=Arial size=2 color=#000000><B></B></FONT>
			<TD COLSPAN=".($cantemp*2)." align=center><FONT face=Arial size=2 color=#000000><B>Cantidad de cada empresa</B></FONT>
        </TR>
		<TR>
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>ITEM</B></FONT></TD>
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Denominación</B></FONT></TD>
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Código CUP</B></FONT></TD>
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Número de Pieza</B></FONT></TD>
            <TD width=112 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Precio</B></FONT></TD>
            <TD width=154 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Cantidad</B></FONT></TD>
            <TD width=139 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Valor total</B></FONT></TD>";
		foreach ($enidades as $value1){
            echo " 	
            <TD width=163 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>{$value1['nombreentidad']}</B></FONT></TD>"
            . "<TD width=139 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Importe</B></FONT></TD>";
		}
        echo "</TR><TR></TR>";
		$cont=1;
		foreach ($productos as $value1){
			echo "
			<TR>	
				<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>$cont</B></FONT></TD>
				<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['suministro']}</FONT></TD>
				<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['codigo']}</FONT></TD>
				<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['numeropieza']}</FONT></TD>
				<TD width=112 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['precio']}</FONT></TD>
				<TD width=154 ROWSPAN=2 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value1['cantidad'], 6)."</TD>
				<TD width=139 ROWSPAN=2 align=right style=\"mso-number-format:'#,##0.000000';\">".round($value1['valor'], 6)."</TD>";
			$parametros['idsolicitud711']= $value1['idsolicitud711'];	
			$parametros['idproducto711']= $value1['idproducto711'];	
			$entPorproductos = DatSolicitud711::ListarEntProdConsolidado($parametros);
			foreach ($enidades as $value2){
				$aux=0;	
				foreach ($entPorproductos as $value3){
					if($value3['identidadcliente']== $value2['identidadcliente']){
						$aux+=$value3['cantidad'];
					}
				}
                                $vtotalemp= floatval($value1['precio'])*floatval($aux);
				echo "
					<TD width=163 ROWSPAN=2 align=center style=\"mso-number-format:'#,##0.000000';\">".round($aux, 6)."</TD>
					"
                                        . "<TD width=139 ROWSPAN=2 align=center style=\"mso-number-format:'#,##0.000000';\">".round($vtotalemp, 6)."</TD>";
						
					
			}
			echo "</TR><TR></TR>";
			$cont++;
		}
        echo "<TR>
                <TD width=173 ROWSPAN=2 COLSPAN=7 align=right><FONT face=Arial size=2 color=#000000><B>Monto total por entidad</B></FONT></TD>";
                foreach ($enidades as $value1){
            echo " 	
                <TD width=163 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000></FONT></TD>"
                . "<TD width=139 ROWSPAN=2 align=center style=\"mso-number-format:'#,##0.000000';\"><B>".round($value1['totalgeneral'], 6)."</B></TD>";
	    }
             
        echo "<TR>";
        echo "    </TABLE>";
        
    }
	
	public function SolicitudesRealizadas($parametros) {
		$parametros['identidad']=$parametros['entidad'];
			
		$parametros['idsp']=$parametros['idcc'];
		$parametros['idcc']=null;
		if ($parametros['idsp']=='p'){
			$parametros['presentado']=true;
		}
		
		//$parametros['esconsolidada']==false;
		if ($parametros['idff']=='1'){
			$parametros['esconsolidada']=true;
		}
		$parametros['idff']=null;
		$solicitudes = DatSolicitud711::listarSolicitudes711Reportes($parametros);
		
		self::ExportarSolicitudesRealizadas($solicitudes, $solicitudes[0]['idtiposolicitudplan'], $parametros['anno']);
	}	
		
	public function ExportarSolicitudesRealizadas($solicitudes, $tipoplan, $anno) {	
        $dir1 = split("web", $_SERVER['DOCUMENT_ROOT']);
		
	//var_dump($dir1); die;
        $pathimagen = '' . $dir1[0] . 'web/planificacion/plan711/views/images/' ;
	$arraytoales = array();
	$cantemp = count($enidades);
        $fecha= date('d/m/Y');
        //var_dump("https://".$_SERVER['SERVER_NAME']."/planificacion/plan711/views/images/logo-UIM.png"); die;
//        <TD style='border: none;' COLSPAN=6 align=left><img width=306 height=86 id='uno' src='https://".$_SERVER['SERVER_NAME']."/planificacion/plan711/views/images/logo-UIM.png'/></TD>
//                <TD style='border: none;' COLSPAN=0 align=left><img align=left width=250 height=86 id='dos' src='https://".$_SERVER['SERVER_NAME']."/planificacion/plan711/views/images/logo-distra.png'/></TD>
        
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=ResumenSolicitudes.xls');
        header('Content-Transfer-Encoding: binary ');
		 if($tipoplan==1254){
			$arraytoales[1]='totalsolicitado';
			$arraytoales[2]='totalpresentadonegocio';
			$arraytoales[3]='totalcontratado';	
			$arraytoales[4]='suministrototal';	
		 }else{
			$arraytoales[1]='totalsolicitadofar';
			$arraytoales[2]='totalpresentadofar';
			$arraytoales[3]='totalcontratadofar';	
			$arraytoales[4]='totalgeneral';	
		 }
        
        echo
        "<meta charset='UTF-8'/>
        <TABLE border=1 align=left cellpadding=1 cellspacing=0>
             <TR>
               
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
            <TD style='border: none;' COLSPAN=9 align=center><FONT face=Arial size=3 color=#000000><B>ESTADO DE EJECUCIÓN PLAN FAR $anno</B></FONT></TD>
            </TR>
            <TR>
                <TD style='border: none;' COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
            </TR>
            <TR>
                <TD COLSPAN=9 align=center><FONT face=Arial size=3 color=#000000><B>CLIENTE: UNIÓN DE INDUSTRIAS MILITARES</B></FONT></TD>
            </TR>
        <TR>
        <TD style='border: none;' COLSPAN=5 align=center><FONT face=Arial size=3 color=#000000></FONT></TD>
        </TR>  
        <TR>
			<TD style='border: none;' COLSPAN=7 align=right><FONT face=Arial size=2 color=#000000><B>Fecha Emisión:</B></FONT></TD>
            <TD style='border: none;' align=center><FONT face=Arial size=2 color=#000000><B>$fecha</B></FONT></TD>
        </TR>       
        <TR>
        <TD style='border: none;' COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>
		<TR>
            <TD COLSPAN=7 align=left><FONT face=Arial size=2 color=#000000><B>Resumen de solicitudes realizadas</B></FONT></TD>
        </TR> 
		<TR>
            <TD  align=right><FONT face=Arial size=2 color=#000000><B>Total de solicitudes</B></FONT></TD>
            <TD  COLSPAN=6 align=left><FONT face=Arial size=2 color=#000000><B>{$solicitudes[0]['totalsolitudes']}</B></FONT></TD>
        </TR>       
        <TR>
			<TD  align=right><FONT face=Arial size=2 color=#000000><B>Importe total en las solicitudes</B></FONT></TD>
			<TD  COLSPAN=6 align=left face=Arial size=3 style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($solicitudes[0][$arraytoales[1]], 6)."</B></TD>
        </TR>
		<TR>
			<TD  align=right><FONT face=Arial size=2 color=#000000><B>Importe total en las solicitudes presentadas:</B></FONT></TD>
            <TD  COLSPAN=6 align=left face=Arial size=3 style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($solicitudes[0][$arraytoales[2]], 6)."</B></TD>
        </TR>
        <TR>
            <TD  align=right><FONT face=Arial size=2 color=#000000><B>Importe total en las solicitudes presentadas a la importadora:</B></FONT></TD>
            <TD  COLSPAN=6 align=left face=Arial size=3 style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($solicitudes[0][$arraytoales[2]], 6)."</B></TD>
        </TR>
		<TR>
			<TD  align=right><FONT face=Arial size=2 color=#000000><B>Importe total en las solicitudes contratadas:</B></FONT></TD>
            <TD  COLSPAN=6 align=left face=Arial size=3 style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($solicitudes[0][$arraytoales[3]], 6)."</B></TD>
        </TR> 	
        <TR>
        <TD style='border: none;' COLSPAN=8 align=center><FONT face=Arial size=3 color=#000000><B>&nbsp;</B></FONT></TD>
        </TR>

		<TR>
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>ITEM</B></FONT></TD>
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Descripción pedido</B></FONT></TD>
            <TD width=112 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>No del pedido</B></FONT></TD>
            <TD width=154 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Importe en solicitud</B></FONT></TD>
			<TD width=139 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Fecha de creación solicitud</B></FONT></TD>
            <TD width=139 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Fecha de presentación en la importadora </B></FONT></TD>
			<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>No en Importadora</B></FONT></TD>
			<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Situación del pedido</B></FONT></TD>";
		if($tipoplan==1255 && $solicitudes[0]['esconsolidada']!=true){
			echo "<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Para consolidar</B></FONT></TD>
				<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Está consolidada</B></FONT></TD>
                <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Es consolidada</B></FONT></TD>  ";
		 }	
		echo "</TR>
		<TR></TR>";
		
		$cont=1;
		foreach ($solicitudes as $value1){
			$para = ($value1['paraconsolidar']==True)? 'Sí': 'No';
			$esta = ($value1['estaconsolidada']==True)? 'Sí': 'No';
            $es = ($value1['esconsolidada']==True)? 'Sí': 'No';
			echo "
			<TR>
            <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>$cont</B></FONT></TD>
            <TD width=173 ROWSPAN=2 align=left><FONT face=Arial size=2 color=#000000>{$value1['descripciongeneral']}</FONT></TD>
            <TD width=112 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['nosolicitud']}</FONT></TD>
            <TD width=154 ROWSPAN=2 align=right face=Arial size=3 style=\"mso-number-format:'#,##0.000000';\">".round($value1[$arraytoales[4]], 6)."</TD>
			<TD width=139 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['fechacreacion']}</FONT></TD>
            <TD width=139 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['fechapresped']}</FONT></TD>
			<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['nopedido']}</FONT></TD>
			<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$value1['situacionpedido']}</FONT></TD>";
			if($tipoplan==1255 && $solicitudes[0]['esconsolidada']!=true){
			echo "<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$para}</FONT></TD>
				<TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$esta}</FONT></TD>
                <TD width=173 ROWSPAN=2 align=center><FONT face=Arial size=2 color=#000000>{$es}</FONT></TD>  ";
		 }	
		echo "</TR>
		<TR></TR>";
			$cont++;
		}
        echo "<TR>";
        echo "</TABLE>";
        
        /*//$dir2 = split("web", $_SERVER['DOCUMENT_ROOT']);
        $path = '' . $dir2 . 'web/planificacion/plan711/views/plantillas/ResumenSolicitudes.xls' ;
        
        $gestor = fopen($path, 'w');
	fwrite($gestor, $echo);
	fclose($gestor);
        
        var_dump(file_exists($path)); die;
        if (!file_exists($path)) {
            $data[0]['existe']= 'Ya esta creado el archivo config_mailer.xml';
            echo json_encode(array("data" => $data, "total" => 1));
        }
//        $archivo = "e:\clientes\empresa\prueba.xlsx";
//$nombre = "prueba.xlsx";

        header('Content-Disposition: attachment; filename=ResumenSolicitudes.xls');

		header("Content-Type: application/vnd.openxmlformats-   officedocument.spreadsheetml.sheet");

		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');

		header('Content-Length: '.filesize($path));

		readfile($path);

        readfile($path);*/
    }
}