<?php

//set_include_path('/lib/Adapters/PHPExcel/1.8.0/PHPExcel.php');
class DatSolicitud711Model extends ZendExt_Model {
    
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function adicionarSolicitud711($parametros){
	$nosolicit= DatSolicitud711::UltimoNoSolicitud($parametros);
	$parametros ['nosolicit'] = $nosolicit+1;
        $solicitud = DatSolicitud711::adicionarSolicitud711($parametros);
        //var_dump('asas'); die;
//        if($parametros['esconsolidada']==true){
//            DatSolicitud711::adicionarListaConsolidada($parametros['solconsolidar'], $solicitud->idsolicitud711);
//            DatSolicitud711::ActualizarListaConsolidada($parametros['solconsolidar']);
//        }
	$addproductos = DatSolicitud711::AdicionarProductos($parametros['productos'], $solicitud->idsolicitud711);
        $addservsol = DatSolicitud711::AdicionarServSol($parametros['servsol'], $solicitud->idsolicitud711);
        //$addfuentessol = DatSolicitud711::AdicionarFuenteSol($parametros['idff'], $solicitud->idsolicitud711, $parametros['totalg']);
        return 1;
    }
    
    public function modificarSolicitud711($parametros){
        $solicitudold = Doctrine::getTable('DatSolicitud711')->find($parametros['idsolicitud711']);
	$solicitud = DatSolicitud711::modificarSolicitud711($parametros);	
	DatSolicitud711::EliminarProductos($parametros['idsolicitud711']);
	$addproductos = DatSolicitud711::AdicionarProductos($parametros['productos'], $parametros['idsolicitud711']);
        DatSolicitud711::EliminarServSol($parametros['idsolicitud711']);
        $addservsol = DatSolicitud711::AdicionarServSol($parametros['servsol'], $parametros['idsolicitud711']);
        if($parametros['esconsolidada']==true){            
            DatSolicitud711::EliminarListaSolCons($parametros['idsolicitud711']);
            DatSolicitud711::adicionarListaConsolidada($parametros['solconsolidar'], $parametros['idsolicitud711']);
            DatSolicitud711::ActualizarListaConsolidada($parametros['solconsolidar']);
            if($solicitudold->totalgeneral!= $parametros['totalg']){
                DatSolicitud711::ActualizarSolicitudesConsolidada($parametros);
            }
        }
        return 1;
    }
    
    public function listarSolicitudes711($parametros) {
        $result = DatSolicitud711::listarSolicitudes711($parametros);
        return $result;
    }
    
    public function listarConsolidadas($parametros) {
        $result = DatSolicitud711::listarConsolidadas($parametros);
        return $result;
    }
	
    public function Solicitudes711TotalImporte($parametros) {
        $result = DatSolicitud711::Solicitudes711TotalImporte($parametros);
        return $result;
    }
    
    public function listarProductos($parametros) {
        $result = DatSolicitud711::listarProductos($parametros);
        return $result;
    }
    public function listarProductosFAR($parametros) {
        $result = DatSolicitud711::listarProductosFAR($parametros);
        return $result;
    }
    public function listarProdEnSol($parametros) {
        $result = DatSolicitud711::listarProdEnSol($parametros);
        return $result;
    }
    
    public function RevisarSolicitudes($parametros) {
        $result = DatSolicitud711::RevisarSolicitudes($parametros);
        return $result;
    }
    
    public function ExportarRevision($parametros) {
          $result = DatSolicitud711::RevisarSolicitudes($parametros);
//          $result = $parametros['lista'];
          
    //        header("Content-Type: application/vnd.ms-word");
    //        header("Expires: 0");
    //        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    //        header("content-disposition: attachment;filename=Report.doc");

            header('Pragma: public');
            header('Expires: ' . date('D:M:Y'));
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Content-Type: application/force-download');
            header('Content-Type: application/octet-stream');
            header('Content-Type: application/download');
            header('Content-Disposition: attachment;filename=RevisionAlConsolidar.xls');
            header('Content-Transfer-Encoding: binary ');

            echo
            "<meta charset='UTF-8'/>
                <TABLE border=1 align=left cellpadding=1 cellspacing=0>
                <TR>
                    <TD style='border: none;' align=left COLSPAN=4>
                        <FONT face=Arial size=2 color=#000000><B>Productos que pueden presentar problemas en la consolidación</B></FONT>
                     </TD>
                    <TD style='border: none;' >
                        <img align=right width=50 height=20 id='dos' src='http://".$_SERVER['SERVER_NAME']."/planificacion/plan711/views/images/logo-UIM.png'/>
                    </TD>
                </TR> 
                <TR>
                </TR> 
                <TR>
                    <TD width=50 align=center><FONT face=Arial size=2 color=#000000><B>Ítem</B></FONT></TD>
                    <TD width=180 align=center><FONT face=Arial size=2 color=#000000><B>Solicitud</B></FONT></TD>
                    <TD width=250 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Descripción del Suministro</B></FONT></TD>
                    <TD width=120 align=center><FONT face=Arial size=2 color=#000000><B>Código (CUP)</B></FONT></TD>
                    <TD width=120 align=center><FONT face=Arial size=2 color=#000000><B>Precio</B></FONT></TD>
                </TR>"; 
                $cont=1;
                foreach ($result as $value){
                    echo "
                <TR>
                    <TD width=31 align=center><FONT face=Arial size=2 color=#000000><B>$cont</B></FONT></TD>                
                    <TD width=180 align=left><FONT face=Arial size=2>{$value['textnosolicitudo']}</FONT></TD>
                    <TD width=250 COLSPAN=2 align=left><FONT face=Arial size=2>{$value['nombre']}</FONT></TD>
                    <TD width=120 align=center><FONT face=Arial size=2>{$value['codigo']}</FONT></TD>
                    <TD width=120 align=rigth style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['precio'], 6)."</B></TD>";
                    $cont++;
            }
            echo
            "</TR>

            </TABLE>"
            ;     
    }
    
    public function listarPersonas($parametros) {
        $result = DatSolicitud711::listarPersonas($parametros);
        return $result;
    }
    public function Aprobar($parametros) {
        $result = DatSolicitud711::Aprobar($parametros);
        $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
        $listaUsuarios=[];
        $parametros['tiponotificacion']=1;
        $notificaiones = new Notificaciones711Model();
        $correos=$notificaiones->DameUsuariosANotificar($parametros);
        $aux=[];
        $pos=0;
        foreach ($correos as $value) {
            $listaUsuarios[$pos]['idusuario']=$value['idusuario'];
            $listaUsuarios[$pos]['nombreusuario']=$value['nombreusuario'];
            $listaUsuarios[$pos]['idcontacto']=$value['idcontacto'];
            $listaUsuarios[$pos]['contacto']=$value['contacto'];
            $listaUsuarios[$pos]['idsolicitud711']=$solicitud[0]['idsolicitud711'];
            $listaUsuarios[$pos]['solicitud']=''.$solicitud[0]['nosolicitud'].' '.$solicitud[0]['descripciongeneral'];
            $aux[$pos]=$value['idusuario'];
            $pos++;
            
        }
        
        $arrayResult= DatSolicitud711::DameSolicitudesConsolidadas($parametros);
        foreach ($arrayResult as $value) {
            $parametros['idsolicitud711']= $value['idsolicitud711'];
            $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
            $correos2=$notificaiones->DameUsuariosANotificar($parametros);
            foreach ($correos2 as $value) {
                if(!in_array($value['idusuario'], $aux)){
                    $listaUsuarios[$pos]['idusuario']=$value['idusuario'];
                    $listaUsuarios[$pos]['nombreusuario']=$value['nombreusuario'];
                    $listaUsuarios[$pos]['idcontacto']=$value['idcontacto'];
                    $listaUsuarios[$pos]['contacto']=$value['contacto'];
                    $listaUsuarios[$pos]['idsolicitud711']=$solicitud[0]['idsolicitud711'];
                    $listaUsuarios[$pos]['solicitud']=''.$solicitud[0]['nosolicitud'].' '.$solicitud[0]['descripciongeneral'];
                    $pos++;
                }
            }
        }
        
        return array('resulatdo'=>$result,'usuarios'=>$listaUsuarios);
    }
    public function Desaprobar($parametros) {
        //$result= array();
        $result = DatSolicitud711::Desaprobar($parametros);
        $parametros['tiponotificacion']=1;
        $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
        $listaUsuarios=[];
        $notificaiones = new Notificaciones711Model();
        $correos=$notificaiones->DameUsuariosANotificar($parametros);
        
        $aux=[];
        $pos=0;
        foreach ($correos as $value) {
            $listaUsuarios[$pos]['idusuario']=$value['idusuario'];
            $listaUsuarios[$pos]['nombreusuario']=$value['nombreusuario'];
            $listaUsuarios[$pos]['idcontacto']=$value['idcontacto'];
            $listaUsuarios[$pos]['contacto']=$value['contacto'];
            $listaUsuarios[$pos]['idsolicitud711']=$solicitud[0]['idsolicitud711'];
            $listaUsuarios[$pos]['solicitud']=''.$solicitud[0]['nosolicitud'].' '.$solicitud[0]['descripciongeneral'];
            $aux[$pos]=$value['idusuario'];
            $pos++;
            
        }
        $arrayResult= DatSolicitud711::DameSolicitudesConsolidadas($parametros);
        foreach ($arrayResult as $value) {
            $parametros['idsolicitud711']= $value['idsolicitud711'];
            $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
            $correos2=$notificaiones->DameUsuariosANotificar($parametros);
            foreach ($correos2 as $value) {
                if(!in_array($value['idusuario'], $aux)){
                    $listaUsuarios[$pos]['idusuario']=$value['idusuario'];
                    $listaUsuarios[$pos]['nombreusuario']=$value['nombreusuario'];
                    $listaUsuarios[$pos]['idcontacto']=$value['idcontacto'];
                    $listaUsuarios[$pos]['contacto']=$value['contacto'];
                    $listaUsuarios[$pos]['idsolicitud711']=$solicitud[0]['idsolicitud711'];
                    $listaUsuarios[$pos]['solicitud']=''.$solicitud[0]['nosolicitud'].' '.$solicitud[0]['descripciongeneral'];
                    $pos++;
                }
            }
        }
        
        return array('resulatdo'=>$result,'usuarios'=>$listaUsuarios);
    }
    public function ActualizarDatosGerente($parametros) {
        $result = DatSolicitud711::ActualizarDatosGerente($parametros);
        return $result;
    }
    public function listarServicEnSol($parametros) {
        $result = DatSolicitud711::listarServicEnSol($parametros);
        return $result;
    }
    public function listarProductosSolitud($parametros) {
        $result = DatSolicitud711::listarProductosSolitud($parametros);
        return $result;
    }
    public function ActualizarFechaPresentacion($parametros) {
        $result = DatSolicitud711::ActualizarFechaPresentacion($parametros);
        return $result;
    }
    public function CambiarSituacionPedido($parametros) {
        $result = DatSolicitud711::CambiarSituacionPedido($parametros);
//        print('asd'); die;
        $parametros['tiponotificacion']=2;
        $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
        $listaUsuarios=[];
        $notificaiones = new Notificaciones711Model();
        $correos=$notificaiones->DameUsuariosANotificar($parametros);
        $aux=[];
        $pos=0;
        foreach ($correos as $value) {
            $listaUsuarios[$pos]['idusuario']=$value['idusuario'];
            $listaUsuarios[$pos]['nombreusuario']=$value['nombreusuario'];
            $listaUsuarios[$pos]['idcontacto']=$value['idcontacto'];
            $listaUsuarios[$pos]['contacto']=$value['contacto'];
            $listaUsuarios[$pos]['idsolicitud711']=$solicitud[0]['idsolicitud711'];
            $listaUsuarios[$pos]['solicitud']=''.$solicitud[0]['nosolicitud'].' '.$solicitud[0]['descripciongeneral'];
            $aux[$pos]=$value['idusuario'];
            $pos++;
            
        }
        
        $arrayResult= DatSolicitud711::DameSolicitudesConsolidadas($parametros);
        foreach ($arrayResult as $value) {
            $parametros['idsolicitud711']= $value['idsolicitud711'];
            $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
            $correos2=$notificaiones->DameUsuariosANotificar($parametros);
            foreach ($correos2 as $value) {
                if(!in_array($value['idusuario'], $aux)){
                    $listaUsuarios[$pos]['idusuario']=$value['idusuario'];
                    $listaUsuarios[$pos]['nombreusuario']=$value['nombreusuario'];
                    $listaUsuarios[$pos]['idcontacto']=$value['idcontacto'];
                    $listaUsuarios[$pos]['contacto']=$value['contacto'];
                    $listaUsuarios[$pos]['idsolicitud711']=$solicitud[0]['idsolicitud711'];
                    $listaUsuarios[$pos]['solicitud']=''.$solicitud[0]['nosolicitud'].' '.$solicitud[0]['descripciongeneral'];
                    $pos++;
                }
            }
        }
        
        return array('resulatdo'=>$result,'usuarios'=>$listaUsuarios);
    }
    public function AperturarCancelar($parametros) {
        $result = DatSolicitud711::AperturarCancelar($parametros);
        return $result;
    }
    
    public function ActualizarSuministros($parametros) {
        $contcontrato=0;
        $conttotal=0;

        if($parametros['esconsolidada']=='true'){
            $total=0;
            
            foreach ($parametros['productos'] as $value){
                DatSolicitud711::ActualizarSuministros($value['idsolicitud711'],$value['idproducto711'], $value['distribuido']);
                $total+= $value['distribuido'];
            }
            $result=DatSolicitud711::ActualizarSuministros($parametros['idsolicitud711'],$parametros['productos'][0]['idproducto711'], $total);
        }else{
            foreach ($parametros['productos'] as $value){
                $result=DatSolicitud711::ActualizarSuministros($parametros['idsolicitud711'],$value['idproducto711'], $value['distribuido']);
                if($value['distribuido']==0){
                    $contcontrato++;
                }
                if($value['distribuido']==$value['cantidad']){
                    $conttotal++;
                }
            }
            if($contcontrato==count($parametros['productos'])){
                $parametros['idsituacionpedido']= 1;
                $result = DatSolicitud711::CambiarSituacionPedido($parametros);
            }else if($conttotal==count($parametros['productos'])){
                $parametros['idsituacionpedido']= 9;
                $result = DatSolicitud711::CambiarSituacionPedido($parametros);
            }else{
                $parametros['idsituacionpedido']= 8;
                $result = DatSolicitud711::CambiarSituacionPedido($parametros);
            }
        }
        return $result;
    }
    
    public function ActualizarPreciosConsolidados($parametros) {
            
            foreach ($parametros['solicitudes'] as $value){
                DatSolicitud711::ActualizarPreciosConsolidados($value);
            }
            
        return 1;
    }
    
    public function ListarEntProdConsolidado($parametros) {
        $result = DatSolicitud711::ListarEntProdConsolidado($parametros);
        return $result;
    }

    public function Exportar711($parametros) {

        $modelonomenclador = new NomDatosnomenclador();
        $solicitud = DatSolicitud711::listarSolicitudes711($parametros);
        $imp = $modelonomenclador->ObtenerDatosDadoIdDatosNom($solicitud[0]['iddatosempimp']);
        $integrator = ZendExt_IoC::getInstance();
        $entcliente = $integrator->metadatos->DameEstructura($solicitud[0]['identidadcliente']);
        $cliente= $entcliente[0]->denominacion."(".$entcliente[0]->abreviatura.")";
        
        $ff = $modelonomenclador->ObtenerDatosDadoIdDatosNom($solicitud[0]['idfuente']);
        $cod= DatSolicitud711::DameFuenteCodigoCC($solicitud[0]['idcodigodecc']);
        $id['idsolicitud711']=$solicitud[0]['idsolicitud711'];
        $servsol= DatSolicitud711::listarServicEnSol($id);
        $grupcomercial = $modelonomenclador->ObtenerDatosDadoIdDatosNom($solicitud['iddatosgrupcomercial']);
        
        $prod= DatSolicitud711::listarProductosSolitud($parametros);
        $dir= DatSolicitud711::DameDatosPersona($solicitud[0]['iddirector']);
        $direcon= DatSolicitud711::DameDatosPersona($solicitud[0]['iddirectorecon']);
        $especemp= DatSolicitud711::DameDatosPersona($solicitud[0]['idespecialista']);
        if($solicitud[0]['idespecialistacs']){
            $espcs= DatSolicitud711::DameDatosPersona($solicitud[0]['idespecialistacs']);
        }
        
        $espcs= "";
        if($solicitud[0]['idcomprador']){
            $comprador= DatSolicitud711::DameDatosPersona($solicitud[0]['idcomprador']);
        }
        $comprador= "";
        
        $fechapresped=split(' ', $solicitud[0]['fechapresped']);
        $fechapresped=split('/', $fechapresped[0]);
        $aperturacredito=split(' ', $solicitud[0]['aperturacredito']);
        $aperturacredito=split('/', $aperturacredito[0]);
        
        
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=solictud711.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo 
        "   <meta charset='UTF-8'/>
                <TABLE border=1 align=left cellpadding=1 cellspacing=0>
                    <TR>
            <TD width=333 COLSPAN=5 align=left><FONT face=Arial size=2 color=#000000><B>PLAN DE ABASTECIMIENTO AÑO: {$parametros['ejercicio']}</B></FONT></TD>
            <TD width=544 COLSPAN=8 align=center><FONT face=Arial size=2 color=#000000><B>MODELO 711: SOLICITUD DE IMPORTACIÓN</B></FONT></TD>
            <TD width=85 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>No.711: {$solicitud[0]['nosolicitud']}</B></FONT></TD>
            <TD width=193 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Importadora: {$imp[0]['denominacion']}</B></FONT></TD>
                    </TR>
                    <TR>
            <TD width=878 COLSPAN=13 align=left><FONT face=Arial size=2 color=#000000><B>Código REEUP: {$entcliente[0]->codigo}</B></FONT></TD>
            <TD width=278 COLSPAN=4 align=center><FONT face=Arial size=2 color=#000000><B>Fuente de Financiamiento</B></FONT></TD>
                    </TR>
                    <TR>
            <TD width=878 ROWSPAN=2 COLSPAN=13 align=left><FONT face=Arial size=2 color=#000000><B>Cliente: $cliente</B></FONT></TD>
            <TD width=278 COLSPAN=4 align=left><FONT face=Times New Roman size=2 color=#000000><B>{$ff[0]['denominacion']}</B></FONT></TD>
                    </TR>
                    <TR>
            <TD width=85 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Crédito Financiero:</B></FONT></TD>
            <TD width=193 ROWSPAN=2 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>{$cod[0]['codigo']}</B></FONT></TD>
                    </TR>
                    <TR>
            <TD width=405 ROWSPAN=2 COLSPAN=6 align=left><FONT face=Arial size=2 color=#000000><B>Descripcion General: {$solicitud[0]['descripciongeneral']}</B></FONT></TD>
            <TD width=473 COLSPAN=7 align=center><FONT face=Arial size=2 color=#000000><B>Para uso del cliente</B></FONT></TD>
                    </TR>
                    <TR>
            <TD width=251 COLSPAN=3 align=center><FONT face=Arial size=2 color=#000000><B>Solicitud</B></FONT></TD>
            <TD width=222 COLSPAN=4 align=center><FONT face=Arial size=2 color=#000000><B>Cantidad asignada</B></FONT></TD>
            <TD width=278 COLSPAN=4 align=center><FONT face=Arial size=2 color=#000000><B>Antecedentes de Compra:</B></FONT></TD>
                    </TR>
                    <TR>
            <TD width=32 align=center><FONT face=Arial size=2 color=#000000><B>Ítem</B></FONT></TD>
            <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Descripción del Suministro</B></FONT></TD>
            <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>UM</B></FONT></TD>
            <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>Código (CUP)</B></FONT></TD>
            <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>Código de Pieza</B></FONT></TD>
            <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>Precio</B></FONT></TD>
            <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>Cant.</B></FONT></TD>
            <TD width=141 align=center><FONT face=Arial size=2 color=#000000><B>Valor</B></FONT></TD>
            <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>I</B></FONT></TD>
            <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>II</B></FONT></TD>
            <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>III</B></FONT></TD>
            <TD width=58 align=center><FONT face=Arial size=2 color=#000000><B>IV</B></FONT></TD>";
            $long= count($prod)+4;
            echo " 
            <TD width=278 ROWSPAN=$long COLSPAN=4 align=left><FONT face=Arial size=2 color=#000000><B>{$solicitud[0]['antecedentes']}</B></FONT></TD>
                    </TR>";
                    $cont=1;
                    foreach ($prod as $value){
                            echo "
                        <TR>
                            <TD width=32 align=center><FONT face=Arial size=2 color=#000000><B>$cont</B></FONT></TD>
                    <TD width=172 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>{$value['suministro']}</B></FONT></TD>
                    <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>{$value['descrip']}</B></FONT></TD>
                    <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>{$value['codigo']}</B></FONT></TD>
                    <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>{$value['numeropieza']}</B></FONT></TD>
                    <TD width=55 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['precio'], 6)."</B></TD>    
                    <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>{$value['cantidad']}</B></FONT></TD>
                    <TD width=141 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['valor'], 6)."</B></TD>   
                    <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>{$value['trimestre1']}</B></FONT></TD>
                    <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>{$value['trimestre2']}</B></FONT></TD>
                    <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>{$value['trimestre2']}</B></FONT></TD>
                    <TD width=58 align=center><FONT face=Arial size=2 color=#000000><B>{$value['trimestre4']}</B></FONT></TD>";
                        $cont++;
                    }
                    echo
            "</TR>
                    <TR>
                <TD width=514 COLSPAN=8 align=right><FONT face=Arial size=2 color=#000000><B>Total de Suministro:</B></FONT></TD>
                    <TD width=141 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($solicitud[0]['suministrototal'], 6)."</B></TD>   
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=58 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                    </TR>    
                    <TR>
                <TD width=514 COLSPAN=8 align=right><FONT face=Arial size=2 color=#000000><B>Otros gastos de operación:</B></FONT></TD>
                <TD width=141 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($solicitud[0]['otrosgastos'], 6)."</B></TD> 
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=58 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                    </TR>
                    <TR>
                <TD width=514 COLSPAN=8 align=right><FONT face=Arial size=2 color=#000000><B>Total General:</B></FONT></TD>
                <TD width=141 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($solicitud[0]['totalgeneral'], 6)."</B></TD>
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=55 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                <TD width=58 align=left><FONT face=Arial size=2 color=#000000><B>&nbsp;</B></FONT></TD>
                    </TR>
                    <TR>
                <TD width=204 COLSPAN=3 align=center><FONT face=Arial size=2 color=#000000><B>Representante del suministrador:</B></FONT></TD>
                <TD width=451 COLSPAN=6 align=center><FONT face=Arial size=2 color=#000000><B>Representante del cliente:</B></FONT></TD>
                <TD width=307 COLSPAN=6 align=center><FONT face=Arial size=2 color=#000000><B>Fechas</B></FONT></TD>
                <TD width=193 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Lugar de Entrega Mercancía</B></FONT></TD>
                    </TR>
                    <TR>
                <TD width=106 ROWSPAN=3 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Especialista de CS: {$espcs[0]['nombrecompleto']}</B></FONT></TD>
                <TD width=98 ROWSPAN=5 align=left><FONT face=Arial size=2 color=#000000><B>Unidad de Compra: {$espcs[0]['idunidadcompra']}</B></FONT></TD>
                <TD width=130 ROWSPAN=3 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Director(a) Económico: {$direcon[0]['nombrecompleto']}</B></FONT></TD>
                <TD width=126 ROWSPAN=3 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Especialista que elabora la solicitud: {$especemp[0]['nombrecompleto']}</B></FONT></TD>
                <TD width=196 ROWSPAN=3 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Director(a) General: {$dir[0]['nombrecompleto']}</B></FONT></TD>
                <TD width=164 COLSPAN=3 align=center><FONT face=Arial size=2 color=#000000><B>Fecha de Presentación</B></FONT></TD>
                <TD width=143 COLSPAN=3 align=center><FONT face=Arial size=2 color=#000000><B>Fecha de Aprobación</B></FONT></TD>
                <TD width=193 ROWSPAN=3 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>{$solicitud[0]['lugarentrega']}</B></FONT></TD>
                    </TR>    
                    <TR>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>D</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>M</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>A</B></FONT></TD>
                <TD width=58 align=center><FONT face=Arial size=2 color=#000000><B>D</B></FONT></TD>
                <TD width=39 align=center><FONT face=Arial size=2 color=#000000><B>M</B></FONT></TD>
                <TD width=46 align=center><FONT face=Arial size=2 color=#000000><B>A</B></FONT></TD>
                    </TR>
                    <TR>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>$fechapresped[0]</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>$fechapresped[1]</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>$fechapresped[2]</B></FONT></TD>
                <TD width=58 align=center><FONT face=Arial size=2 color=#000000><B>$aperturacredito[0]</B></FONT></TD>
                <TD width=39 align=center><FONT face=Arial size=2 color=#000000><B>$aperturacredito[1]</B></FONT></TD>
                <TD width=46 align=center><FONT face=Arial size=2 color=#000000><B>$aperturacredito[2]</B></FONT></TD>
                    </TR>
                    <TR>
                <TD width=106 ROWSPAN=2 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Firma :</B></FONT></TD>
                <TD width=130 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Firma:</B></FONT></TD>
                <TD width=126 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Firma:</B></FONT></TD>
                <TD width=196 COLSPAN=2 align=left><FONT face=Arial size=2 color=#000000><B>Firma:</B></FONT></TD>
                <TD width=164 COLSPAN=6 align=left><FONT face=Arial size=2 color=#000000><B>Servicios solicitados:</B></FONT></TD>
                <TD width=193 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Grupo Comercial</B></FONT></TD>
                    </TR>
                    <TR>
                <TD width=201 COLSPAN=3 align=left><FONT face=Arial size=2 color=#000000><B>Teléfonos:<br/>{$dir[0]['telefono']}<br/>{$direcon[0]['telefono']}<br/>{$especemp[0]['telefono']}</B></FONT></TD>
                <TD width=251 COLSPAN=3 align=left><FONT face=Arial size=2 color=#000000><B>Correos:<br/>{$dir[0]['correoelec']}<br/>{$direcon[0]['correoelec']}<br/>{$especemp[0]['correoelec']}</B></FONT></TD>";
                $servicios='';
                foreach ($servsol as $value){
                       $servicios.= $value['denominacion'].'<br/>';
                }
            echo "
                    <TD width=164 COLSPAN=6 align=left><FONT face=Arial size=2 color=#000000><B>$servicios</B></FONT></TD>
                <TD width=193 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>{$grupcomercial[0]['denominacion']}</B></FONT></TD>
                    </TR>
        </TABLE>"
        ;
            
    }
    
    public function Exportar711FAR($parametros) {

        $modelonomenclador = new NomDatosnomenclador();
        //var_dump('asd');die;
        $solicitud = DatSolicitud711::listarSolicitudes711($parametros);
        
        $imp = $modelonomenclador->ObtenerDatosDadoIdDatosNom($solicitud[0]['iddatosempimp']);
        $integrator = ZendExt_IoC::getInstance();
        $entcliente = $integrator->metadatos->DameEstructura($solicitud[0]['identidadcliente']);
        $cliente= $entcliente[0]->denominacion."(".$entcliente[0]->abreviatura.")";
        $tarea= Doctrine::getTable('DatProducto711')
                    ->findByDql("idproducto711= {$solicitud[0]['iddatostarea']}");
        
        $cc = $modelonomenclador->ObtenerDatosDadoIdDatosNom($solicitud[0]['iddatoscc']);
        
        $prod= DatSolicitud711::listarProductosSolitud($parametros);
        if($solicitud[0]['iddirector']){
            $dir= DatSolicitud711::DameDatosPersona($solicitud[0]['iddirector']);
        }
        //$direcon= DatSolicitud711::DameDatosPersona($solicitud[0]['iddirectorecon']);
        if($solicitud[0]['idespecialista']){
            $especemp= DatSolicitud711::DameDatosPersona($solicitud[0]['idespecialista']);
        }
        $id['idsolicitud711']=$solicitud[0]['idsolicitud711'];
        $servsol= DatSolicitud711::listarServicEnSol($id);
        $grupcomercial = $modelonomenclador->ObtenerDatosDadoIdDatosNom($solicitud[0]['iddatosgrupcomercial']);
        $codigocupdunas = $modelonomenclador->ObtenerDatosDadoIdDatosNom($solicitud[0]['idcodigocupdunas']);
        $denominaciondunas = $codigocupdunas[0]['denominacion'].'-'.$codigocupdunas[0]['descripcion'];
        
        if($solicitud[0]['idespecialistacs']){
            $espcs= DatSolicitud711::DameDatosPersona($solicitud[0]['idespecialistacs']);
        }
        
        $espcs= "";
        if($solicitud[0]['idcomprador']){
            $comprador= DatSolicitud711::DameDatosPersona($solicitud[0]['idcomprador']);
        }
        $comprador= "";
        
        $fechapresped=split(' ', $solicitud[0]['fechapresped']);
        $fechapresped=split('/', $fechapresped[0]);
        $aperturacredito=split(' ', $solicitud[0]['aperturacredito']);
        $aperturacredito=split('/', $aperturacredito[0]);
                
        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=solictud711.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo "
               <meta charset='UTF-8'/>
                <TABLE border=1 align=left cellpadding=1 cellspacing=0>
                    <TR>
                        <TD ROWSPAN=2 COLSPAN=8><B>{$solicitud[0]['descripciongeneral']} {$parametros['ejercicio']}</B></TD>
                        <TD ROWSPAN=5 COLSPAN=2><B>MODELO 711</B></TD>
                    </TR>
                    <TR>
                    </TR>
                    <TR>
                        <TD COLSPAN=2><B>Nombre del Cliente: {$solicitud[0]['nombrecliente']} </B></TD>
                        <TD COLSPAN=2><B>Procedencia: $cliente</B></TD>
                        <TD ROWSPAN=3 COLSPAN=2><B>Importador: DUNA S.A</B></TD>
                        <TD ROWSPAN=3 COLSPAN=2><B>Solicitud Puerto Destino: {$solicitud[0]['lugarentrega']}</B></TD>
                    </TR>
                    <TR>
                        <TD COLSPAN=4><B>No. Aprobación:</B></TD>
                    </TR>
                    <TR>
                        <TD COLSPAN=4><B>Código de la Aprobación:</B></TD>
                    </TR>
                    <TR>
                        <TD COLSPAN=4><B>CUP: $denominaciondunas</B></TD>
                        <TD COLSPAN=2><B>Para el Consumidor</B></TD>
                        <TD COLSPAN=4><B>Para uso del Importador</B></TD>
                    </TR>
                    <TR>
                        <TD COLSPAN=2><B>Esp.COMEX:</B></TD>
                        <TD COLSPAN=2><B>711-0200-23</B></TD>
                        <TD COLSPAN=2><B>Solicitado</B></TD>
                        <TD><B>Precio</B></TD>
                        <TD ROWSPAN=2><B>Valor</B></TD>
                        <TD ROWSPAN=2 COLSPAN=2><B>Posibles Proveedores</B></TD>
                    </TR>
                    <TR>
                        <TD><B>No.</B></TD>
                        <TD><B>DESCRIPCIÓN</B></TD>
                        <TD><B>CODIGO</B></TD>
                        <TD><B>UM</B></TD>
                        <TD><B>Cantidad</B></TD>
                        <TD><B>Valor unitario (USD)</B></TD>
                        <TD><B>Valor unitario (USD)</B></TD>
                    </TR>";
                    $cont=1;
                    foreach ($prod as $value){
                            echo "
                        <TR>
                            <TD width=32 align=center><FONT face=Arial size=2 color=#000000>$cont</FONT></TD>
                            <TD ><FONT face=Arial size=2 color=#000000>{$value['suministro']}</FONT></TD>
                            <TD ><FONT face=Arial size=2 color=#000000>{$value['codigo']}</FONT></TD>
                            <TD ><FONT face=Arial size=2 color=#000000>{$value['descrip']}</FONT></TD>
                            <TD ><FONT face=Arial size=2 color=#000000>{$value['cantidad']}</FONT></TD>
                            <TD style=\"mso-number-format:'#,##0.000000';\">".round($value['precio'], 6)."</TD>    
                            <TD style=\"mso-number-format:'#,##0.000000';\">".round($value['precio'], 6)."</TD>
                            <TD style=\"mso-number-format:'#,##0.000000';\">".round($value['valor'], 6)."</TD>
                            <TD>&nbsp;</TD>
                            <TD>&nbsp;</TD>";
                        $cont++;
                    }
                    echo
                    "
                    
                    <TR>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                    </TR>    
                    <TR>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD><B>Precio FOB</B></TD>
                        <TD><B>{$solicitud[0]['suministrototal']}</B></TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                    </TR>
                    <TR>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD><B>Flete</B></TD>
                        <TD><B>{$solicitud[0]['valorflete']}</B></TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                    </TR>
                    <TR>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD><B>Seguro</B></TD>
                        <TD><B>{$solicitud[0]['valorseguro']}</B></TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                    </TR>
                    <TR>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD><B>TOTAL</B></TD>
                        <TD><B>{$solicitud[0]['totalgeneral']}</B></TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                    </TR>    
                    </TR>
                    <TR>
                        <TD COLSPAN=2>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                    </TR>
                    <TR>
                        <TD COLSPAN=2><B>Representante del Suministrador:</B></TD>
                        <TD>&nbsp;</TD>
                        <TD COLSPAN=3><B>Representante del Consumidor:</B></TD>
                        <TD COLSPAN=2><B>Fechas</B></TD>
                        <TD><B>No. Control</B></TD>
                        <TD><B>No. Control</B></TD>
                    </TR>
                    <TR>
                        <TD COLSPAN=2><B>Nombre:</B></TD>
                        <TD>&nbsp;</TD>
                        <TD COLSPAN=3><B>Nombre:  {$dir[0]['nombrecompleto']}</B></TD>
                        <TD><B>Presentación</B></TD>
                        <TD><B>Aprobación</B></TD>
                        <TD><B>Consumidor</B></TD>
                        <TD><B>Suministrador</B></TD>
                    </TR>
                    <TR>
                        <TD COLSPAN=2><B>Firma:</B></TD>
                        <TD>&nbsp;</TD>
                        <TD COLSPAN=3><B>Firma:</B></TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                        <TD>&nbsp;</TD>
                    </TR>
                    <TR>";
                $servicios='';
                foreach ($servsol as $value){
                       $servicios.= $value['denominacion'].'<br/>';
                }
                echo "
                    <TD ROWSPAN=2 COLSPAN=8><B>Observaciones:</B> {$solicitud[0]['antecedentes']}. <B>Servicios solicitados:</B> $servicios</TD>
                </TABLE>
            ";
    }

    public function ExportarDescripcion($parametros) {
        $prod= DatSolicitud711::listarProductosSolitud($parametros);
        $solicitud = DatSolicitud711::listarSolicitudes711($parametros);

//        header("Content-Type: application/vnd.ms-word");
//        header("Expires: 0");
//        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
//        header("content-disposition: attachment;filename=Report.doc");

        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=EspecfTec.xls');
        header('Content-Transfer-Encoding: binary ');
        
        echo
        "  <meta charset='UTF-8'/>
           <TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
                <TD style='border: none;' align=left COLSPAN=10>
                    <FONT face=Arial size=2 color=#000000><B>Especificaciones técnicas de la solicitud 711 No. {$solicitud[0]['nosolicitud']}</B></FONT>
                 </TD>
                <TD style='border: none;' >
                        <!--<img align=right width=50 height=20 id='dos' src='https://".$_SERVER['SERVER_NAME']."/planificacion/plan711/views/images/logo-UIM.png'/> -->
                </TD>
            </TR> 
            <TR>
                <TD align=left COLSPAN=11><FONT face=Arial size=2 color=#000000><B>Descripción General: {$solicitud[0]['descripciongeneral']}</B></FONT></TD>
            </TR> 
            <TR>
                <TD width=50 align=center><FONT face=Arial size=2 color=#000000><B>Ítem</B></FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>Código (CUP)</B></FONT></TD>
                <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Descripción del Suministro</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>Cant.</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>Precio</B></FONT></TD>
                <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Especificaciones técnicas</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>UM</B></FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>Código de Pieza</B></FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>Imagen</B></FONT></TD>
            </TR>"; 
            $cont=1;
            foreach ($prod as $value){
                echo "
            <TR>
                <TD width=31 align=center><FONT face=Arial size=2 color=#000000><B>$cont</B></FONT></TD>                
                <TD width=100 align=center><FONT face=Arial size=2>{$value['codigo']}</FONT></TD>
                <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2>{$value['suministro']}</FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2>{$value['cantidad']}</FONT></TD>
                <TD width=55 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['precio'], 6)."</B></TD>
                <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2>{$value['descripcion']}</FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2>{$value['descrip']}</FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2>{$value['numeropieza']}</FONT></TD>
                <TD align=width=150 height=70>";
                    if($value['urlimagen']){
                        echo "<img align=right width=150 height=70 id='dos' src='https://{$value['urlimagen']}'/>";
                    }
                echo "</TD>";
                $cont++;
        }
        echo
        "</TR>
    
        </TABLE>"
        ;
    }
    public function importarProductos_old($parametros){
        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($parametros['file']);
        $indicadores = $data->sheets[0]['cells'];
        $this->tablaTemp = "temp_indicador_".$parametros['usuario'];
        DatSolicitud711::CrearTablaTemporal($this->tablaTemp);
        $start=0;
        $limit=5;
        $tipoplan=0;
        $filtros[0]['field'] = 'viaadquisicion';
        $filtros[0]['data']['type'] = 'string';
        $filtros[0]['data']['value'] = 'Importacion directa';
        $dataresult1=[];
        $dataresult2=[];
                $datos=[];
                $cont = 0;
                $cont1 = 0;
                $cont2 = 0;
                foreach ($indicadores as $row) {
                    //Ignorando los datos del encabezado de la tabla
                    if ($cont < 1) {
                        $cont++;
                        continue;
                    }
                    $datos['codigo'] = utf8_encode($row[0]);
                    $datos['denominacion'] = utf8_encode($row[1]);
                    $precio = self::validarNumericPositivo($row[2]);
                    $datos['precio'] = $precio;
                    $datos['cantidad'] = utf8_encode($row[3]);
                    $datos['descripcion'] = utf8_encode($row[4]);
                    $filtros[1]['field'] = 'codigo';
                    $filtros[1]['data']['type'] = 'string';
                    $filtros[1]['data']['value'] = $datos['codigo'];
                    if(strlen($datos['codigo'])== strlen('7909030229')){
                        $indicador = DatSolicitud711::ListarIndNivelPlanif(
                            $filtros, $start, $limit, $tipoplan
                        );
                    }else{
                        $indicador->total=0;
                    }
                    if($indicador->total==0){
                        /*$dataresult2[$cont2]['codigo']= $datos['codigo'];
                        $dataresult2[$cont2]['codigo']= $datos['denominacion'];
                        $dataresult2[$cont2]['precio']= $precio;
                        $dataresult2[$cont2]['cantidad']= $datos['cantidad'];
                        $dataresult2[$cont2]['descripcion']= $datos['descripcion'];*/
                     //print_r($datos); die;
                        DatSolicitud711::InsertarTablaTemporal($this->tablaTemp, $datos);
                        $cont2++;
                        continue;
                    }
                    $dataresult1[$cont1]['idindicador']= $indicador->data[0]['idindicador'];
                    $dataresult1[$cont1]['codigo']= $datos['codigo'];
                    $dataresult1[$cont1]['denominacion']= $indicador->data[0]['denominacion'];
                    $dataresult1[$cont1]['precio']= $precio;
                    $dataresult1[$cont1]['cantidad']= $datos['cantidad'];
                    $dataresult1[$cont1]['descripcion']= $datos['descripcion'];
                    $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($indicador->data[0]['idumedida']));
                    $dataresult1[$cont1]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
                    $cont1++;
                    /*DatSolicitud711::InsertarTablaTemporal($this->tablaTemp, $datos);*/
                }
                if($cont2==0){
                    DatSolicitud711::EliminarTablaTemporal($this->tablaTemp);
                }
        //DatSolicitud711::EliminarTablaTemporal($parametros['usuario']);
                //print_r($dataresult2);
                //print_r($dataresult1); die;
                /*unset($model[$cont]);
                $model->save();*/

         return array('insertar' => $dataresult1, 'excel'=>$cont2);
    }
    
    public function importarProductos($parametros){
        if($parametros['tipoaccion']==1){
            $data = $this->importarProductosCUP($parametros);
            return $data;
        }
        if($parametros['tipoaccion']==2){
            $data = $this->importarProductosNumP($parametros);
            return $data;
        }
        if($parametros['tipoaccion']==3){
            $data = $this->importarProductosNumP($parametros);
            return $data;
        }
    }
    
    public function importarProductosCUP($parametros){
        require (substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) . 'lib/Adapters/PHPExcel/1.8.0/PHPExcel.php');        
        $inputFileType = PHPExcel_IOFactory::identify($parametros['file']);
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objPHPExcel = $objReader->load($parametros['file']);
        $sheet = $objPHPExcel->getSheet(0); 
        $highestRow = $sheet->getHighestRow(); 
        $highestColumn = $sheet->getHighestColumn();
        //print_r($highestRow);
        //print_r($sheet);die;
        $this->tablaTemp = "temp_indicador_".$parametros['usuario'];
        DatSolicitud711::CrearTablaTemporalCUP($this->tablaTemp);
        $start=0;
        $limit=5;
        $tipoplan=0;
        $filtros[0]['field'] = 'viaadquisicion';
        $filtros[0]['data']['type'] = 'string';
        $filtros[0]['data']['value'] = 'Importacion directa';
        $dataresult1=[];
        $dataresult2=[];
                $datos=[];
                $cont = 0;
                $cont1 = 0;
                $cont2 = 0;
                for ($row = 2; $row <= $highestRow; $row++){                    
                    $datos['codigo'] = $sheet->getCell("A".$row)->getValue();
                    if($datos['codigo']!==null){
                        $datos['denominacion'] = $sheet->getCell("B".$row)->getValue();
                        $datos['precio'] = $sheet->getCell("C".$row)->getValue();
                        $datos['cantidad'] = $sheet->getCell("D".$row)->getValue();
                        $datos['descripcion'] = $sheet->getCell("E".$row)->getValue();
                        $filtros[1]['field'] = 'codigo';
                        $filtros[1]['data']['type'] = 'string';
                        $filtros[1]['data']['value'] = $datos['codigo'];
                        if(strlen($datos['codigo'])== strlen('7909030229')){
                            $indicador = DatSolicitud711::ListarIndNivelPlanif(
                                $filtros, $start, $limit, $tipoplan
                            );
                        }else{
                            $indicador->total=0;
                        }
                        if($indicador->total==0){
                            if($datos['codigo']!='' || $datos['denominacion']!='' || $datos['precio']!='' || $datos['cantidad']!='' || $datos['descripcion']!=''){    
                                DatSolicitud711::InsertarTablaTemporal($this->tablaTemp, $datos);
                                $cont2++;
                            }
                            continue;
                        }
                        $dataresult1[$cont1]['idindicador']= $indicador->data[0]['idindicador'];
                        $dataresult1[$cont1]['codigo']= $datos['codigo'];
                        $dataresult1[$cont1]['denominacion']= $indicador->data[0]['denominacion'];
                        $dataresult1[$cont1]['precio']= $indicador->data[0]['precio'];
                        $dataresult1[$cont1]['cantidad']= $datos['cantidad'];
                        $dataresult1[$cont1]['descripcion']= $datos['descripcion'];
                        $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($indicador->data[0]['idumedida']));
                        $dataresult1[$cont1]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
                        $dataresult1[$cont1]['numeropieza'] = $indicador->data[0]['numeropieza'];
                        $cont1++;
                    }
                }
                if($cont2==0){
                    DatSolicitud711::EliminarTablaTemporal($this->tablaTemp);
                }
         return array('insertar' => $dataresult1, 'excel'=>$cont2);
    }
    
    public function importarProductosNumP($parametros){
        require (substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) . 'lib/Adapters/PHPExcel/1.8.0/PHPExcel.php');        
        $inputFileType = PHPExcel_IOFactory::identify($parametros['file']);
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objPHPExcel = $objReader->load($parametros['file']);
        $sheet = $objPHPExcel->getSheet(0); 
        $highestRow = $sheet->getHighestRow(); 
        $highestColumn = $sheet->getHighestColumn();
        //var_dump($highestRow); die;
        
        $this->tablaTemp = "temp_indicador_".$parametros['usuario'];
        DatSolicitud711::CrearTablaTemporalNumP($this->tablaTemp.'nump');
        $start=0;
        $limit=5;
        $tipoplan=0;
        $filtros[0]['field'] = 'viaadquisicion';
        $filtros[0]['data']['type'] = 'string';
        $filtros[0]['data']['value'] = 'Importacion directa';
        $dataresult1=[];
        $dataresult2=[];
                $datos=[];
                $cont = 0;
                $cont1 = 0;
                $cont2 = 0;
                for ($row = 2; $row <= $highestRow; $row++){ 
                    $datos['numeropieza'] = $sheet->getCell("A".$row)->getValue();
                    if($datos['numeropieza']!==null){
                        //var_dump($datos['numeropieza']);
                        $datos['denominacion'] = $sheet->getCell("B".$row)->getValue();
                        $datos['precio'] = $sheet->getCell("C".$row)->getValue();
                        $datos['cantidad'] = $sheet->getCell("D".$row)->getValue();
                        $filtros[1]['field'] = 'numeropieza';
                        $filtros[1]['data']['type'] = 'string';
                        $filtros[1]['data']['value'] = $datos['numeropieza'];
                        //print_r($filtros); die;
                        $indicador = DatSolicitud711::ListarIndNivelPlanif(
                                $filtros, $start, $limit, $tipoplan
                            );
                        //print_r($indicador); die;
                        if($indicador->total==0){
                            DatSolicitud711::InsertarTablaTemporalNumP($this->tablaTemp.'nump', $datos);
                            $cont2++;
                            continue;
                        }
                        foreach ($indicador->data as $val) {
                            $dataresult1[$cont1]['idindicador']= $indicador->data[0]['idindicador'];
                            $dataresult1[$cont1]['codigo']= $datos['codigo'];
                            $dataresult1[$cont1]['denominacion']= $indicador->data[0]['denominacion'];
                            $dataresult1[$cont1]['precio']= $indicador->data[0]['precio'];
                            if($parametros['tipoaccion']==3){
              								$dataresult1[$cont1]['precio']= $datos['precio'];
              							}
                            $dataresult1[$cont1]['cantidad']= $datos['cantidad'];
                            $dataresult1[$cont1]['descripcion']= $datos['descripcion'];
                            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($indicador->data[0]['idumedida']));
                            $dataresult1[$cont1]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
                            $dataresult1[$cont1]['numeropieza'] = $indicador->data[0]['numeropieza'];
                            $cont1++;
                        }
                    }
                    /*DatSolicitud711::InsertarTablaTemporal($this->tablaTemp, $datos);*/
                }
                //var_dump('fin'); die;
                //print_r($dataresult1); die;
                if($cont2==0){
                    DatSolicitud711::EliminarTablaTemporal($this->tablaTemp.'nump');
                }
        //DatSolicitud711::EliminarTablaTemporal($parametros['usuario']);
                //print_r($dataresult2);
                //print_r($dataresult1); die;
                /*unset($model[$cont]);
                $model->save();*/

         return array('insertar' => $dataresult1, 'excel'=>$cont2);
    }
    
    

    private function validarNumericPositivo($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor) && $valor >= 0) {
            return $valor;
        }
        return '0.0';
    }

    public function ExportarIndicadoresExcel($parametros) {
        $this->tablaTemp = "temp_indicador_".$parametros['usuario'];
        $nump='';
        $valorcolumna1='Código (CUP)';
            $valorcolumna2='codigo';
        if($parametros['tipoaccion']==2){
            $nump='nump';
            $valorcolumna1='Nùmero Pieza';
            $valorcolumna2='numero_pieza';
        }
        $prod= DatSolicitud711::SelectAllTablaTemporal($this->tablaTemp.''.$nump, $parametros['tipoaccion']);
        DatSolicitud711::EliminarTablaTemporal($this->tablaTemp.''.$nump);

//        header("Content-Type: application/vnd.ms-word");
//        header("Expires: 0");
//        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
//        header("content-disposition: attachment;filename=Report.doc");

        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=Ind-NoImportados.xls');
        header('Content-Transfer-Encoding: binary ');

        echo
            "<meta charset='UTF-8'/>
                <TABLE border=1 align=left cellpadding=1 cellspacing=0>
            <TR>
                <TD style='border: none;' align=left COLSPAN=10>
                    <FONT face=Arial size=2 color=#000000><B>Indicadores que no se pudieron importar al 711</B></FONT>
                 </TD>
            </TR>
             <TR>    
                <TD style='border: none;' align=left COLSPAN=10>
                    <FONT face=Arial size=2 color=#000000><B>Causas posibles:</B></FONT>
                    <br/>
                    <FONT face=Arial size=2 color=#000000>1-El(Los) producto(s) no existe(n) en la base de datos</FONT>
                    <br/>
                    <FONT face=Arial size=2 color=#000000>2-(Para el caso de importar con códigos)El(Los) código(s) no son los correctos del(los) producto(s)</FONT>
                    <br/>
                    <FONT face=Arial size=2 color=#000000>3-(Para el caso de importar con número de pieza)El(Los) número de pieza(s) no son los correctos del(los) producto(s)</FONT>
                    <br/>
                    <FONT face=Arial size=2 color=#000000>4-El(Los) producto(s) no estan abropados para su utilización en el maestro de productos del sistema</FONT>
                    <br/>
                    <FONT face=Arial size=2 color=#000000>5-El(Los) producto(s) no tienen el nivel de planificación correcto para su uso</FONT>
                    <br/>
                    <FONT face=Arial size=2 color=#000000>6-El(Los) producto(s) su vía de adquisición no es Importación directa</FONT>
                    <br/>
                 </TD>
            </TR> 
            <TR>
                <TD width=50 align=center><FONT face=Arial size=2 color=#000000><B>Ítem</B></FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>$valorcolumna1</B></FONT></TD>
                <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Descripción del Suministro</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>Precio</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>Cant.</B></FONT></TD>
                <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2 color=#000000><B>Especificaciones técnicas</B></FONT></TD>
            </TR>";
        $cont=1;
        foreach ($prod as $value){
            echo "
            <TR>
                <TD width=31 align=center><FONT face=Arial size=2 color=#000000><B>$cont</B></FONT></TD>                
                <TD width=100 align=center><FONT face=Arial size=2>{$value[$valorcolumna2]}</FONT></TD>
                <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2>{$value['denominacion']}</FONT></TD>
                <TD width=55 align=center style=\"mso-number-format:'#,##0.000000';\">"."<B>".round($value['precio'], 6)."</B></TD>
                <TD width=55 align=center><FONT face=Arial size=2>{$value['cantidad']}</FONT></TD>
                <TD width=172 COLSPAN=2 align=center><FONT face=Arial size=2>{$value['descripcion']}</FONT></TD>  ";
            $cont++;
        }
        echo
        "</TR>
    
        </TABLE>"
        ;
    }

    public function ExportarIndicadoresPlanilla() {

//        header("Content-Type: application/vnd.ms-word");
//        header("Expires: 0");
//        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
//        header("content-disposition: attachment;filename=Report.doc");


        header('Pragma: public');
        header('Expires: ' . date('D:M:Y'));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/force-download');
        header('Content-Type: application/octet-stream');
        header('Content-Type: application/download');
        header('Content-Disposition: attachment;filename=Ind-NoImportados.xls');
        header('Content-Transfer-Encoding: binary ');

        echo
            "<meta charset='UTF-8'/>
                <TABLE border=1 align=left cellpadding=1 cellspacing=0> 
            <TR>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>Código (CUP)</B></FONT></TD>
                <TD width=172 align=center><FONT face=Arial size=2 color=#000000><B>Descripción del Suministro</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>Precio</B></FONT></TD>
                <TD width=55 align=center><FONT face=Arial size=2 color=#000000><B>Cant.</B></FONT></TD>
                <TD width=172 align=center><FONT face=Arial size=2 color=#000000><B>Especificaciones técnicas</B></FONT></TD>
            </TR>
            <TR>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000></FONT></TD>
                <TD width=172 align=center><FONT face=Arial size=2 color=#000000></FONT></TD>
                <TD width=55 align=center style=\"mso-number-format:'#,##0.000000';\"></TD>
                <TD width=55 align=center style=\"mso-number-format:'#,##0.000000';\"></TD>
                <TD width=172 align=center><FONT face=Arial size=2 color=#000000></FONT></TD>
            </TR>
    
        </TABLE>"
        ;
    }
    
}
