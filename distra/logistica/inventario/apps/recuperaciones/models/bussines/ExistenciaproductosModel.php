<?php

class ExistenciaproductosModel extends BaseModel
{ 
    public function __construct()
    {
        parent::__construct();
    }

    public function cargarProductos($filtro)
    {  
        $orderby = "";
        $group2 = "";
        $espacialidades = $this->objectHelper->extractValueFromArrayColumn(
            $this->configuracionHelper->obtenerEspecialidades(array('restringir' => true)), 'idespecialidad'
        );
        /*if (count($espacialidades) == 0) {
            throw new ZendExt_Exception('LOG_INV_Prod_Exist_001');
        }*/
        if ($filtro['detalles']) {
            $select = ", dp.idproducto,nu.abreviaturaunidadmedida as um, dp.idestructura, coalesce (e.codigo || ' - ' || e.denominacion,e.denominacion) as entidad, coalesce (eop.codigo || ' - ' || eop.denominacion,eop.denominacion) as almacen, dp.precio as preciocontable, dp.precioalternativo,
            case when ( (split_part((dp.cantidad - coalesce((SELECT sum(dcc.cantidad) FROM mod_logistica.dat_cantidadcomprometida dcc where dcc.idproducto = dp.idproducto and dcc.estado = 1),0))::TEXT,'.', 2) ) like '000000' )
            then (split_part((dp.cantidad - coalesce((SELECT sum(dcc.cantidad) FROM mod_logistica.dat_cantidadcomprometida dcc where dcc.idproducto = dp.idproducto and dcc.estado = 1),0))::TEXT,'.', 1))::numeric
            else (dp.cantidad - coalesce((SELECT sum(dcc.cantidad) FROM mod_logistica.dat_cantidadcomprometida dcc where dcc.idproducto = dp.idproducto and dcc.estado = 1),0)) end as disponible,'' as delegacion,'' as ministerio,
				(select uumm.abreviaturaunidadmedida from mod_datosmaestros.nom_unidadmedida uumm where uumm.idunidadmedida = dp.idumedida ) as umop";
            $join = "inner join mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = dp.idumedida 
                inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = dp.idestructuracomun 
                inner join mod_estructuracomp.v_dametodasestructuras eop on eop.idestructura = dp.idestructura";
            $group = "dp.idestructuracomun, dp.idestructura,e.codigo, e.denominacion, eop.denominacion,eop.codigo,dp.cantidad,dp.idproducto,";
            $group2 = ",nu.abreviaturaunidadmedida, dp.idumedida";
            $orderby = "e.denominacion, eop.denominacion, ";
        }
        if ($filtro['idindicador']) {
            $where = "and ni.idindicador = '{$filtro['idindicador']}'";
        }
        if ($filtro['naturaleza']) {
            $where = "and ni.idnaturaleza = '{$filtro['naturaleza']}'";
        }
//        if ($filtro['idministerio']) {
//            $where = "and dp.idestructuracomun = '{$filtro['idministerio']}'";
//        }
        $filtro['identidad'] = $this->global->Estructura->idestructura;
        if ($filtro['idsubordinacion']) {
            $filtro['identidad'] = $filtro['idsubordinacion'];
        }
        $filtro['rol'] = $this->global->Perfil->idrol;
        if ($filtro['idnaturaleza']) {
            // $where = "and ni.idnaturaleza = {$filtro['idnaturaleza']}";
            $filtronat = "{$filtro['idnaturaleza']}";
        }
        if ($filtro['criterio']) {
            $where = "and (ni.numeropieza ILIKE '%{$filtro['criterio']}%' or ni.denominacion ILIKE '%{$filtro['criterio']}%')";
        }
		/**
		* TODO Cambiar este fragmento pues fueza q todos los usuarios vean el balance
		**/		
        /*$filtro['rol'] = ((new VariablesGlobalesModel())->obtenerValor('ROL_EXIST') != 1)
            ? (new VariablesGlobalesModel())->obtenerValor('ROL_EXIST')
            : $this->global->Perfil->idrol;
        $filtro['idusuario'] = ((new VariablesGlobalesModel())->obtenerValor('USUARIO_EXIST') != 1) ?
            (new VariablesGlobalesModel())->obtenerValor('USUARIO_EXIST')
            : $this->global->Perfil->idusuario;
        $filtro['identidad'] = ((new VariablesGlobalesModel())->obtenerValor('ENTIDAD_EXIST') != 1)
            ? (new VariablesGlobalesModel())->obtenerValor('ENTIDAD_EXIST')
            : $this->global->Estructura->idestructura;*/
		/**
		* END TODO Cambiar este fragmento pues fueza q todos los usuarios vean el balance
		**/
       
        $sql = " WITH parametro_busqueda AS (
                    SELECT idnaturaleza, denominacion, parent_path
                    FROM mod_datosmaestros.nom_naturaleza
                    ".($filtronat ? "WHERE idnaturaleza = {$filtronat}" : "")."
                    )        
        select ni.idindicador, ni.numeropieza as codigo, ni.denominacion as denominacion,

        (SELECT string_agg(t.denominacion, '-' ORDER BY public.nlevel(t.parent_path)) AS full_path
            FROM mod_datosmaestros.nom_naturaleza t
            WHERE
                t.parent_path operator(public.@>) (SELECT parent_path FROM mod_datosmaestros.nom_naturaleza WHERE idnaturaleza = nat.idnaturaleza)
        ) as naturaleza,
        
   
            case when ( (split_part(sum(dp.cantidad)::TEXT,'.', 2) ) like '000000' )
            then (split_part(sum(dp.cantidad)::TEXT,'.', 1))::numeric
            else sum(dp.cantidad) end as cantidad,

 
            case when ( (split_part(ni.precio::TEXT,'.', 2) ) like '000000' )
            then (split_part(ni.precio::TEXT,'.', 1))::numeric
            else ni.precio end as preciocentral,

    
            case when ( (split_part(ni.precioalternativo::TEXT,'.', 2) ) like '000000' )
            then (split_part(ni.precioalternativo::TEXT,'.', 1))::numeric
            else ni.precioalternativo end as preciocentralalt

             {$select},
            (nat.codigo||'-'||nat.denominacion) as naturaleza_old, 
            count(*) OVER() as total 
            from mod_logistica.dat_producto dp 
            inner join mod_estructuracomp.v_dametodasestructuras est on est.idestructura = dp.idestructura
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador 
             
            inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            {$join} 
     
            ".($filtronat ? " JOIN parametro_busqueda pb ON nat.parent_path operator(public.<@) pb.parent_path " : " ")."

            where est.idconcepto = 8 and est.idorgano = -1 and dp.cronologia > 0 {$where}              
            group by {$group} ni.idindicador, ni.numeropieza, ni.denominacion, nat.codigo,nat.denominacion, nat.idnaturaleza{$group2} 
            having sum(dp.cantidad) > 0
            order by {$orderby} ni.numeropieza";
            /*ni.idespecialidad in (select ce.idespecialidad from mod_logistica.conf_usuarioespecialidad ce where ce.idusuario = {$filtro['idusuario']} limit 1) {$where} 
            and dp.idestructuracomun in (select f.idfila from mod_estructuracomp.nom_filaestruc f where f.accesofila[(SELECT eur.identidad from mod_seguridad.dat_entidadusuariorol eur where eur.idusuario = {$filtro['idusuario']} and eur.idrol = {$filtro['rol']} limit 1)::numeric] = 1::bit) 
            and dp.cronologia > 0 and dp.idestructuracomun in (select  ds.idhijo from  mod_estructuracomp.dat_subordinacion ds where ds.parent_path operator(public.<@) (select ds.parent_path from  mod_estructuracomp.dat_subordinacion ds inner join mod_estructuracomp.nom_subordinacion ns on ns.denominacion = 'RESE' where ds.idhijo = {$filtro['identidad']} limit 1))  */
            $datos = Doctrine_Manager::connection()->fetchAll(
                $sql . " offset ? limit ?", array($filtro['start'], $filtro['limit'])
            );
        return array(
            'cantidad' => $datos[0]['total'],
            'datos' => $datos
        );
    }
    
    public function exportarExcel($filtro)
    {
        unlink("tmp/");
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = $this->cargarProductos($filtro);
        $columns = array(
            array('header' => 'Entidad', 'dataIndex' => 'entidad'),
            array('header' => 'Almac&eacute;n', 'dataIndex' => 'almacen'),
            array('header' => 'C&oacute;digo', 'dataIndex' => 'codigo'),
            array('header' => 'Naturaleza', 'dataIndex' => 'naturaleza'),
            array('header' => 'Producto', 'dataIndex' => 'denominacion'),
            array('header' => 'UM', 'dataIndex' => 'um'),
            array('header' => 'Cantidad', 'dataIndex' => 'cantidad'),
            array('header' => 'Disponible', 'dataIndex' => 'disponible'),
            array('header' => 'Precio CUP', 'dataIndex' => 'preciocontable'),
            array('header' => 'Precio CUC', 'dataIndex' => 'precioalternativo')
        );
        $excel->writeData($datos['datos'], $columns);
        $excel->close();
        return '/logistica/inventario/recuperaciones/' . $fichero;
    }
    
    public function cargarMinisterios($filtro)
    {
        return array();
    }
    
    public function cargarSubordinacion($filtro)
    {
        $sql = "SELECT q->>'id' AS id, q->>'denominacion' AS text, q->>'icon' AS icon, cast(q->>'leaf' AS bool) AS leaf "
            . "FROM mod_loginventario.f_107cargararbol({$filtro['idestructura']}, "
            . "{$this->global->Perfil->idusuario}, {$this->global->Perfil->idrol}, 3, null) q;";
        return Doctrine_Manager::connection()->fetchAll($sql);
    }

}
