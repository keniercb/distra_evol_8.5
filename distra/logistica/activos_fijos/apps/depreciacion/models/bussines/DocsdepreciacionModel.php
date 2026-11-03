<?php

if (!class_exists('ComunAFTModel')) {
    $dirAFT = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class DocsdepreciacionModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->mComunAFT = ComunAFTModel::getInstance();
    }


    public function cargarDocumentosDepreciacion($params){
        $idestructura = $this->global->Estructura->idestructura;
        $sql = "
        SELECT *
        FROM (
            SELECT
                d.iddocumento,
                d.idcomprobante,
                d.nrodoc,
                d.anno,
                d.fechacontable as fecha,
                (CASE WHEN d.estado = 3 THEN 'APROBADO' ELSE CASE WHEN d.estado = 5 THEN 'REVERTIDO' END END) as estado,
                nprim.denominacion as tipodoc,
                oper.denominacion as operacion,
                (
                    select count(dmrn.idmovregnumerico)
                    from mod_logactivofijotangible.dat_movregnumerico dmrn
                    inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmrn.idmovimiento
                    where dm.iddocumento = d.iddocumento
                ) as activos,
                (
                    select sum(dmrna.depreciacion)
                    from mod_logactivofijotangible.dat_movregnumerico dmrn
                    inner join mod_logactivofijotangible.dat_movregnumericoactivo dmrna on dmrna.idmovregnumerico = dmrn.idmovregnumerico
                    inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dmrn.idmovimiento
                    where dm.iddocumento = d.iddocumento
                ) as importe,
                comp.numerocomprobante as comprobante,
                seg.nombreusuario as usuario,
                d.observaciones

                FROM mod_logistica.dat_documento d
                INNER JOIN mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = d.idoperacion
                INNER JOIN mod_datosmaestros.dat_documentoprim dprim on dprim.iddoc = d.iddoc
                INNER JOIN mod_datosmaestros.nom_docprim nprim on nprim.iddocumentos = dprim.iddocumentos
                LEFT JOIN mod_contabilidad.dat_comprobante comp on comp.idcomprobante = d.idcomprobante
                INNER JOIN mod_seguridad.seg_usuario seg on seg.idusuario = d.idusuario
                
                WHERE
                    oper.codigooperacion = 'OPER_DEPRECIACION'
                    AND d.idestructuracomun = $idestructura
            
		) sub
                    
        ";
        $sql_filtrado = $this->filtro($params,$sql);
        if($params['limit'] && $params['start'] >= 0 ){
            $sql_filtrado .= " limit {$params['limit']} offset {$params['start']} ";
        }


        $conn = Zend_Registry::get('conexion');
        $result = $conn->execute($sql_filtrado)->fetchAll(PDO::FETCH_ASSOC);
       
        $sql_total = "SELECT COUNT(sub.*) AS cantidad FROM ($sql) sub ";
        $total = $conn->execute($sql_total)->fetchAll(PDO::FETCH_ASSOC);
        
        return array(
            "cantidad" => $total[0]['cantidad'],
            'datos'=>$result
        );
    }


    public function filtro($params,$sql){
        $where = array();
        $order='ORDER BY sub.fecha DESC';
        if($params['criterio']){

            array_push($where," sub.nrodoc = {$params['criterio']} ");         
        }
        if($params['nrodoc']){

            array_push($where," sub.nrodoc = {$params['nrodoc']} ");     
        }
        if($params['anno']){

            array_push($where," sub.anno  = {$params['anno']} ");
        }
        if($params['fecha']){
            $newDate = date("d/m/Y", strtotime($params['fecha']));
            array_push($where," sub.fecha = '$newDate' ");
        }
        if($params['estado']){

            array_push($where," sub.estado ILIKE '%{$params['estado']}%' ");
        }
       if($params['comprobante']){

            array_push($where, " sub.comprobante = {$params['comprobante']} ");
        }
        if($params['usuario']){

            array_push($where, " sub.usuario ILIKE '%{$params['usuario']}%' ");
        }
        if($params['observaciones']){

            array_push($where, " sub.observaciones ILIKE '%{$params['observaciones']}%' ");
        }
       if($params['activos']){

            array_push($where, " sub.activos = {$params['activos']} ");
        }
        if($params['importe']){

            array_push($where, " sub.importe = {$params['importe']} ");
        }
        if ($params['comparaciones']){
            foreach ($params['comparaciones'] as $key => $value) {
                if($value['campo'] == 'importe' ){
                    array_push($where, " sub.importe {$value['signo']} {$value['valor']} ");
                }
                if($value['campo'] == 'anno' ){
                    array_push($where, " sub.anno {$value['signo']} {$value['valor']} ");
                }
                if($value['campo'] == 'activos' ){
                    array_push($where, " sub.activos {$value['signo']} {$value['valor']} ");
                } 
                if($value['campo'] == 'comprobante' ){
                    array_push($where, " sub.comprobante {$value['signo']} {$value['valor']} ");
                }
                if($value['campo'] == 'nrodoc' ){ 
                    array_push($where, " sub.nrodoc {$value['signo']} {$value['valor']} ");
                }
            }}

        if(count($where) > 0) {
            $implode = "where" .implode('AND', $where);
            $final=$sql.$implode.$order;
        }
        else {     
            $final=$sql.$order;  
        }
        return $final;
                
}



    public function cargarSustitutos($parametros){
        $consulta ="
        select 
        rna.nroinventario,
        mrna.valorcontable,
        mrna.depreciacion,
        mrna.depreciacionacumulada,
        mrna.tasafiscal,
        dep.denominacion as metodo,    
        i.denominacion,
        g.denominacion as grupo,
        n.denominacion as naturaleza,
        (cc.codigocentrogrupo || ' ' || cc.descripcioncentrogrupo ) as centrocosto,
        
        cta.concatcta as cuenta,
        rrna.lecturarecurso as recursoconsumido,
        rnat.nromatricula,
        marca.denominacion as marca,
        modelo.denominacion as modelo
    
    from mod_logactivofijotangible.dat_movregnumerico mrn
    inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
    inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = mrn.idregnumerico
    inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
    left join mod_logactivofijotangible.dat_recursoregnumericoactivo rrna on rrna.idregnumericoactivo = rna.idregnumerico
    
    inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
    inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
    inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
    inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
    inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
    
    left join mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = rna.idgruposubgrupo
    left join mod_contabilidadcosto.nom_centrocosto cc on cc.idcentrogrupo = mrna.idcentrocosto
    left join mod_logactivofijotangible.conf_gruposcuentas cgc on cgc.idgruposubgrupo = g.idgruposubgrupo and cgc.idestructura = p.idestructuracomun
    left join mod_contabilidad.nom_cuenta cta on cta.idcuenta = cgc.idcuentadepreciacion
    left join mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
    left join mod_logactivofijotangible.nom_actividad act on act.idactividad = mrna.idactividad
    left join mod_logactivofijotangible.nom_depreciacion dep on dep.iddepreciacion = act.iddepreciacion
    left join mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rnat.idregnumerico = rna.idregnumerico
    left join mod_datosmaestros.nom_marca marca on ih.idmarca = marca.idmarca
       left join mod_datosmaestros.nom_modelo modelo on ih.idmodelo = modelo.idmodelo
    where m.iddocumento =  {$parametros['iddocumento']}
    and (extract (month from rrna.fecha)||'-'||extract (year from rrna.fecha))::text 
    = (extract (month from d.fechacontable)||'-'||extract (year from d.fechacontable))::text ";

       
        $filtro = $this->filtros($parametros,$consulta);
        /*$filtroB = '';
        if($parametros['limit'] && $parametros['start'] >= 0 ){
            $filtroB = " limit {$parametros['limit']} offset {$parametros['start']} ";
        }
       
         $conn = Zend_Registry::get('conexion');  
         $result = $conn->execute($filtro. $filtroB)->fetchAll(PDO::FETCH_ASSOC);

         $sql_total = "SELECT COUNT(sub.*) AS cantidad FROM ($filtro) sub ";
        
         $total = $conn->execute($sql_total)->fetchAll(PDO::FETCH_ASSOC);*/
         $conn = Zend_Registry::get('conexion');  

        $cantidadTotal = count($conn->fetchAll($filtro));
        if ($parametros['limit']) {
            $filtro = $filtro . "LIMIT {$parametros['limit']} ";
        }
        if ($parametros['start']) {
            $filtro = $filtro . "OFFSET {$parametros['start']} ";
        }
        
        $result = $conn->fetchAll($filtro);


      
    
        return array(
            'datos'=>$result,
            "cantidad" => $cantidadTotal,     
            'filtro'=> $filtro,
          );
    }

    public function crearexcelactivosdepre($parametros){
        $params['iddocumento'] = $parametros['iddocumento'];
        mkdir('tmp');
        $fecha = date("y.m.d");
        $fichero = "tmp/Activos_depreciados_{$fecha}.xls";
        $excel = new ExcelWriter($fichero);
        // $parametros['iddocumento'] = $iddocumento;  
        $arrIdesAreas = $this->global->Estructura->idestructura;
        $arraydata = $this->cargarSustitutos($params, $arrIdesAreas);
        $datos = $arraydata['datos'];
        $cantidadTotal = $arraydata['cantidad'];
        $aumento = 10000;

        $columns = array(
            array('header' => '<b>Nro inventario</b>', 'dataIndex' => 'nroinventario'),
            array('header' => '<b>Valor contable</b>', 'dataIndex' => 'valorcontable'),
            array('header' => '<b>Depreciación del mes</b>', 'dataIndex' => 'depreciacion'),
            array('header' => '<b>Depreciación acumulada</b>', 'dataIndex' => 'depreciacionacumulada'),
            array('header' => '<b>Tasa fiscal</b>', 'dataIndex' => 'tasafiscal'),
            array('header' => '<b>Método</b>', 'dataIndex' => 'metodo'),
            array('header' => '<b>Denominación</b>', 'dataIndex' => 'denominacion'),
            array('header' => '<b>Matrícula</b>', 'dataIndex' => 'nromatricula'),
            array('header' => '<b>Marca</b>', 'dataIndex' => 'marca'),
            array('header' => '<b>Modelo</b>', 'dataIndex' => 'modelo'),
            array('header' => '<b>Recursos consumidos</b>', 'dataIndex' => 'recursoconsumido'),
            array('header' => '<b>Grupo</b>', 'dataIndex' => 'grupo'),
            array('header' => '<b>Naturaleza</b>', 'dataIndex' => 'naturaleza'),
            array('header' => '<b>Centro costo</b>', 'dataIndex' => 'centrocosto'),
            array('header' => '<b>Cuenta</b>', 'dataIndex' => 'cuenta')

        );
        
        foreach ($columns as $col) {
            $excel->writeCol($col['header']);
        }

        $excel->writeRow();

        $this->crearExcel($columns, $datos, $excel);
        $excel->close();
        return '/logistica/activos_fijos/depreciacion/' . $fichero;
    }
    public function crearExcel($columns, $datos, &$excel)
    {
           foreach ($datos as $dato) {
               foreach ($columns as $col) {
                   $index = $col['dataIndex'];
                   if($dato[$index]){
                       $excel->writeCol($dato[$index]);   
                   } else {
                       $excel->writeCol('');   
                   }
               }
            $excel->writeRow();
           }
    }

    public function filtros($parametros,$consulta){
        
        $and = array();
        if($parametros['criterio']){
            array_push($and," rna.nroinventario  ILIKE '%{$parametros['criterio']}%'  ");         
        }
        if($parametros['nroinventario']){
            array_push($and," rna.nroinventario  ILIKE '%{$parametros['nroinventario']}%' ");     
        }
        if($parametros['valorcontable']){
            array_push($and," mrna.valorcontable = {$parametros['valorcontable']} ");
        }
        if($parametros['depreciacion']){
            array_push($and," mrna.depreciacion = {$parametros['depreciacion']} ");
        }
        if($parametros['depreciacionacumulada']){
            array_push($and, " mrna.depreciacionacumulada = {$parametros['depreciacionacumulada']} ");
        }
        if($parametros['tasafiscal']){
            array_push($and, " mrna.tasafiscal = {$parametros['tasafiscal']} ");
        }
         if($parametros['metodo']){
            array_push($and, " dep.denominacion ILIKE '%{$parametros['metodo']}%' ");
        } 
        if($parametros['denominacion']){
            array_push($and, "  i.denominacion ILIKE '%{$parametros['denominacion']}%' ");
        }
        if($parametros['grupo']){
            array_push($and, " g.denominacion ILIKE '%{$parametros['grupo']}%' ");
        }
        if($parametros['naturaleza']){
            array_push($and, " n.denominacion ILIKE '%{{$parametros['naturaleza']}%' ");
        }
         
        if($params['centrocosto']){
            array_push($and, " cc.codigocentrogrupo ILIKE '%{{$params['centrocosto']}%' OR cc.descripcioncentrogrupo ILIKE '%{{$params['centrocosto']}%' ");
        }
    
        if ($parametros['comparaciones']){
            foreach ($parametros['comparaciones'] as $key => $value) {
                if($value['campo'] == 'valorcontable' ){
                    array_push($and, " mrna.valorcontable {$value['signo']} {$value['valor']} ");
                }
                if($value['campo'] == 'depreciacion' ){
                    array_push($and, " mrna.depreciacion {$value['signo']} {$value['valor']} ");
                }
                if($value['campo'] == 'depreciacionacumulada' ){
                    array_push($and, " mrna.depreciacionacumulada {$value['signo']} {$value['valor']} ");
                } 
                if($value['campo'] == 'tasafiscal' ){
                    array_push($and, " mrna.tasafiscal {$value['signo']} {$value['valor']} ");
                }
            
            }}

        if(count($and) > 0) {
            $implode = "AND" .implode('AND', $and);
            $final=$consulta.$implode;
        }
        else {     
            $final = $consulta;  
        }
        return $final;
    }

    public function revertirUltimaDepreciacion($iddocumento, $idperiodo)
    {
        $docSql = "
            SELECT d.idperiodo as idperiodo, d.estado as estado, d.idcomprobante, comp.numerocomprobante as comprobante
            FROM mod_logistica.dat_documento d
            LEFT JOIN mod_contabilidad.dat_comprobante comp on comp.idcomprobante = d.idcomprobante
            WHERE d.iddocumento = {$iddocumento}
        ";
        $conn = Zend_Registry::get('conexion');
        $doc = $conn->execute($docSql)->fetchAll(PDO::FETCH_ASSOC);

        $idperiodoDoc = $doc[0]['idperiodo'];
        if($idperiodoDoc != $idperiodo){
            return array(
                'codigoMsg' => 3,
                'errorMessage' => 'No puede revertir depreciaciones de periodos anteriores.'
            );
        }
        $estadoDoc = $doc[0]['estado'];
        if($estadoDoc != 3){
            return array(
                'codigoMsg' => 3,
                'errorMessage' => 'El documento debe tener estado "APROBADO".'
            );
        }

        $conn = Zend_Registry::get('conexion');
        $var = $conn->fetchAll(
            "SELECT * FROM \"mod_logactivofijotangible\".\"f_revertirultimadepreciacion\"" .
            "($iddocumento)"
        );

        $comprobante=$doc[0]['idcomprobante'];
        if($comprobante){
            return array(
                'codigoMsg' => 2,
                'titleMessage' => 'Depreciación revertida correctamente',
                'message' => "Esta depreciación está posteada en contabilidad. Debe revertir el comprobante #{$doc[0]['comprobante']} manualmente."
            );
        }
        
        return array(
            'codigoMsg' => 1
        );
}
            
}