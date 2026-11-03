<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 11/10/2018
 * Time: 11:04
 */

class RecuperacionesFarmaciaModel extends BaseModel
{
    private static $instance;
    public function __construct()
    {
        parent::__construct();
    }
    public static function getInstance()
    {
        if (!isset(self::$instance)) {
            $miClass = __CLASS__;
            self::$instance = new $miClass();
        }

        return self::$instance;
    }
    public function crearSql($select, $addFrom, $params)
    {
        $conn = Zend_Registry::get('conexion');
        $from = " from mod_logistica.dat_producto dp
		inner join mod_logfarmacia.conf_cuadrobasico c on c.idindicador = dp.idindicador
		inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
		inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
                left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
                inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
                inner join mod_datosmaestros.nom_naturaleza lp on lp.idnaturaleza = ni.idnaturaleza ";
        $sql = $select.$from.$addFrom;
        $cnt = $conn->fetchAll($sql);
        $sql.=" limit ". (($params['limit'])? $params['limit'] : 30 ) ." offset ". (($params['start'])? $params['start'] : 0 );

        $respuesta = $conn->fetchAll($sql);
        return array('datos'=>$respuesta, 'cantidad'=>count($cnt));
    }
    public function getDatosCoberturaProd($params)
    {
	$select = " SELECT DISTINCT ni.denominacion as denominacion, ni.codigo as codigo, u.abreviaturaunidadmedida as uemb, lp.denominacion as lineaprod,
			( select max(dp2.maximo)
				from mod_logistica.dat_producto dp2
			        inner join mod_logfarmacia.conf_cuadrobasico  c2 on c2.idindicador = dp2.idindicador
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			        where eo2.idestructuraop in (cfgf.idalmacen)
					and c2.idindicador = c.idindicador and lp2.idnaturaleza = lp.idnaturaleza

			) as maximo, cfgf.normabast as norma,
			( select sum(dp2.cantidad)
			        from mod_logistica.dat_producto dp2
			        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
				inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			        where eo2.idestructuraop in (cfgf.idalmacen, cfgf.idareaventa)
				        and c2.idindicador = c.idindicador and lp2.idnaturaleza = lp.idnaturaleza

			) as existencia ";
        $addFrom = " where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0 order by lp.denominacion ";
        return $this->crearSql($select, $addFrom, $params);

    }
    public function getDatosConsultaProd($params)
    {
        $select = " SELECT DISTINCT ni.codigo as codigo, ni.denominacion as denominacion, u.abreviaturaunidadmedida as uemb, lp.denominacion as lineaprod,
        		spc.precio as preciocosto, spv.precio as precioventa, smax.cantidad as maximo, smin.cantidad as minimo, cfgf.fondofijo as porfondofijo,
	                sexist.cantidad as existencia, sret.cantidad as retenidos ";
        $addFrom =" left join ( select max(dp2.maximo) as cantidad, c2.idindicador, lp2.idnaturaleza
		                    from mod_logistica.dat_producto dp2
                		    inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
		                    inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                		    inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		                    inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
		                    inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                		    inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
		                    where eo2.idestructuraop in (cfgf.idalmacen) and dp2.cronologia > 0
		                    group by c2.idindicador,lp2.idnaturaleza
		            ) smax on smax.idindicador = c.idindicador and smax.idnaturaleza = lp.idnaturaleza
	            left join ( select min(dp2.minimo) as cantidad, c2.idindicador,lp2.idnaturaleza
		                    from mod_logistica.dat_producto dp2
                		    inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
		                    inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
		                    inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
                		    inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
		                    inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                		    inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
		                    where eo2.idestructuraop in (cfgf.idalmacen) and dp2.cronologia > 0

		                    group by c2.idindicador,lp2.idnaturaleza
		            ) smin on smin.idindicador = c.idindicador and smin.idnaturaleza = lp.idnaturaleza
	            left join ( select sum(dp2.cantidad) as cantidad, c2.idindicador,lp2.idnaturaleza
		                    from mod_logistica.dat_producto dp2
                		    inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
		                    inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                		    inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		                    inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
		                    inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                		    inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza

		                    where eo2.idestructuraop in (cfgf.idalmacen, cfgf.idareaventa) and dp2.cronologia > 0
		                    group by c2.idindicador, lp2.idnaturaleza
		            ) sexist on sexist.idindicador = c.idindicador and lp.idnaturaleza = sexist.idnaturaleza
	            left join ( select sum(dp2.cantidad) as cantidad, c2.idindicador,lp2.idnaturaleza
		                    from mod_logistica.dat_producto dp2
                		    inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
		                    inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                		    inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		                    inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
                		    inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
		                    inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
				    where eo2.idestructuraop in (cfgf.idretenido) and dp2.cronologia > 0
		                    group by c2.idindicador,lp2.idnaturaleza
		            ) sret on sret.idindicador = c.idindicador and sret.idnaturaleza = lp.idnaturaleza
	            left join ( select dp2.precio as precio, c2.idindicador,lp2.idnaturaleza
		                    from mod_logistica.dat_producto dp2
                		    inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
		                    inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                		    inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		                    inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
                		    inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
		                    inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
		                    where eo2.idestructuraop in (cfgf.idalmacen) and dp2.cronologia > 0
		                    group by c2.idindicador,dp2.precio,lp2.idnaturaleza
		            ) spc on spc.idindicador = c.idindicador and spc.idnaturaleza = lp.idnaturaleza
	            left join ( select dp2.precio as precio, c2.idindicador,lp2.idnaturaleza
		                    from mod_logistica.dat_producto dp2
                		    inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
		                    inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                		    inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		                    inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
		                    inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                		    inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
		                    where eo2.idestructuraop in (cfgf.idareaventa) and dp2.cronologia > 0
		                    group by c2.idindicador,dp2.precio,lp2.idnaturaleza
		            ) spv on spv.idindicador = c.idindicador and spv.idnaturaleza = lp.idnaturaleza
	            where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0
	            order by ni.denominacion";

	return $this->crearSql($select, $addFrom, $params);
    }
    public function getDatosDisponibilidadProd($params)
    {

        $this->reduceFilter($params);
        $select = "
                SELECT DISTINCT
                ni.codigo as codigo,
                ni.denominacion as denominacion,
                u.abreviaturaunidadmedida as uemb,
                eo.denominacion as arearesp,
                lp.denominacion as lineaprod,
                sqc.cantidad as cantidad,
                (
                        select dp2.precio as precio
                        from mod_logistica.dat_producto dp2
                        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
                        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
                        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
                        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
                        where dp2.cronologia > 0
                        and eo2.idestructuraop in (cfgf.idalmacen)
                        and c2.idindicador = c.idindicador and lp2.idnaturaleza = lp.idnaturaleza
                ) as preciocosto,
                (COALESCE((
                        select dp2.precio as precio
                        from mod_logistica.dat_producto dp2
                        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
                        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
                        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
                        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
                        where dp2.cronologia > 0
                        and eo2.idestructuraop in (cfgf.idareaventa)
                        and c2.idindicador = c.idindicador and lp2.idnaturaleza = lp.idnaturaleza
                ), dp.precio)) as precioventa

		";
        $addFrom =" inner join (
			select sum(dp2.cantidad) as cantidad, c2.idindicador,lp2.idnaturaleza
			from mod_logistica.dat_producto dp2
			inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
			inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
                        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			where dp2.cronologia > 0 and dp2.idestructura in (cfgf.idalmacen, cfgf.idareaventa)
			group by c2.idindicador, lp2.idnaturaleza
		) sqc on sqc.idindicador = c.idindicador
		where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0 and dp.idestructura in (cfgf.idalmacen, cfgf.idareaventa)". (($params['iddeposito'])?" and dp.idestructura = {$params['iddeposito']}": " ")."  ". (!empty($params['idlineaprod'])?" and lp.idnaturaleza in ({$params['idlineaprod']})": " ")."  ". (($params['criterio'])?" and lp.denominacion iLike '%{$params['criterio']}%'": " ");

        foreach($params['comparaciones'] as $comp){
            $this->compararQuery($comp, $addFrom, $params);
        }
        $addFrom .="
        GROUP BY c.idindicador,ni.codigo,ni.denominacion,u.abreviaturaunidadmedida,eo.denominacion,sqc.cantidad,dp.precio,lp.idnaturaleza
        order by eo.denominacion
        ";

       return  $this->crearSql($select, $addFrom, $params);
    }
    public function getDatosConsumoProd($params)
    {
        $select = "SELECT DISTINCT

ni.codigo as codigo,
ni.denominacion as denominacion,
u.abreviaturaunidadmedida as uemb,
sqc.cantidad as cantidad,
(

        select DISTINCT dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
        inner join mod_logistica.dat_movimiento mov2 on mov2.idproducto = dp2.idproducto
        inner join mod_logistica.dat_documento dc2 on dc2.iddocumento = mov2.iddocumento
        inner join mod_logfarmacia.dat_transfinterna dt2 on dt2.idtransfinterna = dc2.iddocumento
        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and dt2.iddeposorigen = cfgf.idalmacen and dt2.iddeposdestino = cfgf.idareaventa
        and c2.idindicador = c.idindicador and lp2.idnaturaleza = lp.idnaturaleza
) as precioventa,
eo.denominacion as arearesp,
lp.denominacion as lineaprod
";
        $addFrom = "
            inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
            inner join mod_logistica.dat_documento dc on dc.iddocumento = mov.iddocumento
            inner join mod_logfarmacia.dat_transfinterna dt on dt.idtransfinterna = dc.iddocumento
            inner join (
                    select sum(mov2.cantidad) as cantidad, c2.idindicador
                    from mod_logistica.dat_producto dp2
                    inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
                    inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                    inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
                    inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
                    inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                    inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
                    inner join mod_logistica.dat_movimiento mov2 on mov2.idproducto = dp2.idproducto
                    inner join mod_logistica.dat_documento dc2 on dc2.iddocumento = mov2.iddocumento
                    inner join mod_logfarmacia.dat_transfinterna dt2 on dt2.idtransfinterna = dc2.iddocumento
                    where dp2.cronologia > 0
                    and dt2.iddeposorigen = cfgf.idalmacen and dt2.iddeposdestino = cfgf.idareaventa
                    and dp2.idestructura = cfgf.idalmacen
                    ".(($params['fechaIni'])?" and
                    (dc2.fechacontable >= '{$params['fechaIni']}' or '{$params['fechaIni']}' is null) ":" ")
                    . (($params['fechalFin'])?
                        "and
                    (dc2.fechacontable <= '{$params['fechaFin']}' or '{$params['fechalFin']}' is null)":" ")  ."
                    group by c2.idindicador,lp2.idnaturaleza
            ) sqc on sqc.idindicador = c.idindicador
            where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0
            and eo.idestructuraop in (cfgf.idareaventa)
            and dt.iddeposorigen = cfgf.idalmacen and dt.iddeposdestino = cfgf.idareaventa
            ".(($params['fechaIni'])?" and
                    (dc.fechacontable >= '{$params['fechaIni']}' or '{$params['fechaIni']}' is null) ":" ")
                        . (($params['fechaFin'])?
                            "and
                    (dc.fechacontable <= '{$params['fechaFin']}' or '{$params['fechalFin']}' is null)":" ")  ."
            order by eo.denominacion";
        return  $this->crearSql($select, $addFrom, $params);

    }
    public function getDatosDisponibilidadProdLote($params)
    {
        $this->reduceFilter($params);

        $select = "

SELECT DISTINCT
ni.codigo as codigo,
ni.denominacion as denominacion,
u.abreviaturaunidadmedida as uemb,
eo.denominacion as arearesp,
lp.denominacion as lineaprod,
sqc.cantidad as cantidad,
(       select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idindicador = c.idindicador
) as preciocosto,
(COALESCE((
        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idindicador = c.idindicador and lp2.idnaturaleza=lp.idnaturaleza

), dp.precio)) as precioventa ,
l.numero as lote,
l.existencia as cantidadlote
";
        $addFrom = " inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto
		inner join (
			        select sum(dp2.cantidad) as cantidad, c2.idindicador,lp2.idnaturaleza
			        from mod_logistica.dat_producto dp2
			        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			        where dp2.cronologia > 0 and dp2.idestructura in (cfgf.idalmacen, cfgf.idareaventa)
			        group by c2.idindicador,lp2.idnaturaleza
			) sqc on sqc.idindicador = c.idindicador and sqc.idnaturaleza = lp.idnaturaleza
		where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0 ". (($params['iddeposito'])?" and dp.idestructura = {$params['iddeposito']}": " ")."
		";
        foreach($params['comparaciones'] as $comp){
            $this->compararQuery($comp, $addFrom, $params);
        }
        $addFrom .= " GROUP BY c.idindicador,ni.codigo,ni.denominacion,u.abreviaturaunidadmedida,eo.denominacion,sqc.cantidad,l.numero,l.existencia,dp.precio,lp.idnaturaleza
                  order by eo.denominacion, ni.denominacion ";
        return  $this->crearSql($select, $addFrom, $params);
    }

    public function getDatosInventarioProducto($params)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = " SELECT DISTINCT ni.codigo as codigo, ni.denominacion as denominacion, u.abreviaturaunidadmedida as uemb, eo.denominacion as arearesp, lp.denominacion as lineaprod,
			( select sum(dp2.cantidad) from mod_logistica.dat_producto dp2
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			        where dp2.cronologia > 0 and dp2.idproducto = dp.idproducto and lp2.idnaturaleza = lp.idnaturaleza
			) as existencia,
			( select DISTINCT dp2.precio from mod_logistica.dat_producto dp2
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			        where dp2.cronologia > 0 and eo2.idestructuraop in (cfgf.idalmacen)
				        and dp2.idproducto = dp.idproducto and lp2.idnaturaleza = lp.idnaturaleza
			) as preciocosto,
			( select DISTINCT dp2.precio from mod_logistica.dat_producto dp2
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			        where dp2.cronologia > 0 and eo2.idestructuraop in (cfgf.idareaventa)
			        and dp2.idproducto = dp.idproducto and lp2.idnaturaleza = lp.idnaturaleza
			) as precioventa,
			( select sum(dp2.cantidad) from mod_logistica.dat_producto dp2
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			        where dp2.cronologia > 0 and eo2.idestructuraop in (cfgf.idareaventa) and dp2.idproducto = dp.idproducto and lp2.idnaturaleza = lp.idnaturaleza
			) as existecia_venta,
			l.numero as lote,
			( select sum(l2.existencia) from mod_logistica.dat_producto dp2
			        inner join mod_logistica.dat_lote l2 on l2.idproducto = dp2.idproducto
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
			        where dp2.cronologia > 0 and dp2.idproducto = dp.idproducto and l2.numero = l.numero and lp2.idnaturaleza = lp.idnaturaleza

			) as cantidad,
			l.fechavencimiento as fechavencimiento,
			eo.denominacion as deposito
		from mod_logistica.dat_producto dp
		inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto
		inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
		inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
		inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
		inner join mod_datosmaestros.nom_naturaleza lp on lp.idnaturaleza = ni.idnaturaleza
		left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
		where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0
			and ( select sum(l2.existencia)
			        from mod_logistica.dat_producto dp2
			        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
			        inner join mod_logistica.dat_lote l2 on l2.idproducto = dp2.idproducto
			        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
			        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
			        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
				where dp2.cronologia > 0 and dp2.idproducto = dp.idproducto and l2.numero = l.numero and lp2.idnaturaleza = lp.idnaturaleza
			) > 0
		order by lp.denominacion,ni.denominacion ";
        $cnt = $conn->fetchAll($sql);
        $sql.=" limit ".$params['limit']." offset ". $params['start'];
        $respuesta = $conn->fetchAll($sql);
        return array('datos'=>$respuesta, 'cantidad'=>count($cnt));
    }
    public function getDatosMovProducto($params)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "

SELECT DISTINCT

ni.codigo as codigo,
ni.denominacion as denominacion,
lp.denominacion as lineaprod,
d.fechacontable as fecha,
ndp.denominacion as tipodoc,
d.nrodoc as numerodoc,
(
select eop.denominacion from mod_estructuracomp.dat_estructuraop eop
where eop.idestructuraop = dti.iddeposorigen
) as origen,
 (
select eop.denominacion from mod_estructuracomp.dat_estructuraop eop
where eop.idestructuraop = dti.iddeposdestino
) as destino,
m.cantidad as cantidad,
m.preciocontable as precio,
m.importecontable as importe,
m.existenciaactual as existencia,
eo.denominacion as deposito

from mod_logistica.dat_producto dp
inner join mod_logfarmacia.conf_cuadrobasico c on c.idindicador = dp.idindicador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logistica.dat_movimiento m on m.idproducto = dp.idproducto
inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = d.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_datosmaestros.nom_operacion o on o.idnomoperaciones = d.idoperacion
left join mod_logfarmacia.dat_transfinterna dti on dti.idtransfinterna = d.iddocumento
inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_naturaleza lp on lp.idnaturaleza = ni.idnaturaleza

where dp.cronologia > 0 and d.estado = 3
and d.idestructuracomun = {$params['idestructura']}
".(($params['fechaIni'])?" and
        (d.fechacontable >= '{$params['fechaIni']}' or '{$params['fechaIni']}' is null) ":" ")
            . (($params['fechalFin'])?
                "and
        (d.fechacontable <= '{$params['fechaFin']}' or '{$params['fechalFin']}' is null)":" ")  ."

order by ni.denominacion,ni.codigo
";
        $cnt = $conn->fetchAll($sql);
        $sql.=" limit ". (($params['limit'])?$params['limit']:30 )." offset ".(($params['start'])?$params['start']:0);
        $respuesta = $conn->fetchAll($sql);
        return array('datos'=>$respuesta, 'cantidad'=>count($cnt));
    }
    public function getDatosProdRetenido($params)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "

SELECT DISTINCT

ni.codigo as codigo,
ni.denominacion as denominacion,
u.abreviaturaunidadmedida as uemb,
sq.cantidad as existencia,
l.numero as lote,
l.existencia as cantidad,
l.fechavencimiento as fechavencimiento,
eo.denominacion as arearesp,
lp.denominacion as lineaprod


from mod_logistica.dat_producto dp
inner join mod_logfarmacia.conf_cuadrobasico c on c.idindicador = dp.idindicador
inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_naturaleza lp on lp.idnaturaleza = ni.idnaturaleza
inner join ( select sum(l2.existencia) as cantidad, c2.idindicador,l2.numero,lp2.idnaturaleza
	        from mod_logistica.dat_producto dp2
	        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
	        inner join mod_logistica.dat_lote l2 on l2.idproducto = dp2.idproducto
	        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
	        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
	        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp2.idestructuracomun
	        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
	        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
	        where dp2.cronologia > 0 and eo2.idestructuraop in (cfgf.idretenido)
	        group by c2.idindicador,l2.numero,lp2.idnaturaleza
) sq on sq.idindicador = c.idindicador and sq.numero = l.numero and sq.idnaturaleza = lp.idnaturaleza
where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0 and dp.idestructura in(cfgf.idretenido)

order by eo.denominacion, ni.denominacion, l.numero
";
        $cnt = $conn->fetchAll($sql);
        $sql.=" limit ".$params['limit']." offset ". $params['start'];
        $respuesta = $conn->fetchAll($sql);
        return array('datos'=>$respuesta, 'cantidad'=>count($cnt));
    }
    public function getDatosProdFalta($params)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "

SELECT DISTINCT

ni.codigo as codigo,
ni.denominacion as denominacion,
u.abreviaturaunidadmedida as uemb,
lp.denominacion as lineaprod,
(

        select max(dp2.maximo)
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
        where eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idindicador = c.idindicador and lp2.idnaturaleza = lp.idnaturaleza
        and dp2.cronologia > 0

) as maximo,
( select min(dp2.minimo)
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
        where eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idindicador = c.idindicador and lp2.idnaturaleza = lp.idnaturaleza
        and dp2.cronologia > 0

) as minimo

from mod_logistica.dat_producto dp
inner join mod_logfarmacia.conf_cuadrobasico c on c.idindicador = dp.idindicador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0
group by ni.codigo,ni.denominacion,u.abreviaturaunidadmedida,cfgf.idalmacen,cfgf.idareaventa,c.idindicador,lp.denominacion
having (
        select sum(dp3.cantidad)
        from mod_logistica.dat_producto dp3
        inner join mod_logfarmacia.conf_cuadrobasico c3 on c3.idindicador = dp3.idindicador
        inner join mod_estructuracomp.nom_filaestruc f3 on f3.idfila = dp3.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo3 on f3.idfila = eo3.idestructuraop
        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp3.idindicador
        inner join mod_datosmaestros.nom_naturaleza lp3 on lp3.idnaturaleza = ni.idnaturaleza
        where eo3.idestructuraop in (cfgf.idalmacen,cfgf.idareaventa) and c3.idindicador = c.idindicador and lp3.idnaturaleza = lp.idnaturaleza and dp3.cronologia > 0
) = 0
order by c3.descripcion
";
        $cnt = $conn->fetchAll($sql);
        $sql.=" limit ".$params['limit']." offset ". $params['start'];
        $respuesta = $conn->fetchAll($sql);
        return array('datos'=>$respuesta, 'cantidad'=>count($cnt));
    }
    public function getDatosRecepcionProd($params)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "

SELECT DISTINCT

ni.codigo as codigo,
ni.denominacion as denominacion,
u.abreviaturaunidadmedida as uemb,
sqc.cantidad as cantidad,
sqp.precio as preciocosto,
eo.denominacion as arearesp,
lp.denominacion as lineaprod


from mod_logistica.dat_producto dp
inner join mod_logfarmacia.conf_cuadrobasico c on c.idindicador = dp.idindicador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}

inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
inner join mod_logistica.dat_documento dc on dc.iddocumento = mov.iddocumento
inner join mod_loginventario.dat_recepcion dr on dr.iddocumento = dc.iddocumento

left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_naturaleza lp on lp.idnaturaleza = ni.idnaturaleza
left join (

        select sum(mov2.cantidad) as cantidad, c2.idindicador, lp2.idnaturaleza
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp2.idestructuracomun
        inner join mod_logistica.dat_movimiento mov2 on mov2.idproducto = dp2.idproducto
        inner join mod_logistica.dat_documento dc2 on dc2.iddocumento = mov2.iddocumento
        inner join mod_loginventario.dat_recepcion dr2 on dr2.iddocumento = dc2.iddocumento
        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza

        where dp2.cronologia > 0    and mov2.cronologia > 0
        and dc2.idestructuracomun = cfgf.idalmacen
         ".(($params['fechaIni'])?" and
        (dc2.fechacontable >= '{$params['fechaIni']}' or '{$params['fechaIni']}' is null) ":" ")
            . (($params['fechalFin'])?
                "and
        (dc2.fechacontable <= '{$params['fechaFin']}' or '{$params['fechalFin']}' is null)":" ")  ."
        group by c2.idindicador,lp2.idnaturaleza

) sqc on sqc.idindicador = c.idindicador and sqc.idnaturaleza = lp.idnaturaleza
left join (

        select avg(dp2.precio) as precio, c2.idindicador, lp2.idnaturaleza
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp2.idestructuracomun
        inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
        inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        group by lp2.idnaturaleza, c2.idindicador

) sqp on sqp.idindicador = c.idindicador and sqp.idnaturaleza = lp.idnaturaleza
where dp.cronologia > 0
and dp.idestructura = cfgf.idalmacen

order by  ni.denominacion
";
        $cnt = $conn->fetchAll($sql);
        $sql.=" limit ".$params['limit']." offset ". $params['start'];
        $respuesta = $conn->fetchAll($sql);
        return array('datos'=>$respuesta, 'cantidad'=>count($cnt));
    }
    public function getDatosVencimientoProd($params)
    {   $conn = Zend_Registry::get('conexion');
        $sql = "
		SELECT DISTINCT
		ni.codigo as codigo,
		ni.denominacion as denominacion,
		u.abreviaturaunidadmedida as uemb,
		(
				select sum(dp2.cantidad)
				from mod_logistica.dat_producto dp2
				inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
				inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
				inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
                                inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                                inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza

				where dp2.idestructuracomun = {$params['idestructura']} and dp2.cronologia > 0
				and eo2.idestructuraop in (eo.idestructuraop)
				and c2.idindicador = c.idindicador
		) as existencia,
		l.numero as lote,
		l.existencia as cantidad,
		l.fechavencimiento as fechavencimiento,
		case
				  when l.fechavencimiento < '{$params['fechasub']}' then 'Vencido'
				  when l.fechavencimiento < '{$params['fechaposiven']}' then 'Posible vencimiento'
				  when l.fechavencimiento < '{$params['fechaproxven']}' then 'Próximo a vencer'
				  else 'Normal'
		end as estado,
                eo.denominacion as arearesp,
                lp2.denominacion as lineaprod,
		eo.denominacion as deposito
		from mod_logistica.dat_producto dp
		inner join mod_logfarmacia.conf_cuadrobasico c on c.idindicador = dp.idindicador
		inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto
		inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
		inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
		left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
                inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
                inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza

		where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0 and l.existencia > 0
		";
        if(!empty($params['criterio'])) $sql.=" AND (ni.denominacion ILIKE '%{$params['criterio']}%' OR ni.codigo ILIKE '%{$params['criterio']}%')";
        if($params['idestadoven'])$this->filtrarEstados($sql, $params);
        $sql.=" order by  ni.denominacion ";
        $cnt = $conn->fetchAll($sql);
        $sql.=" limit ".(($params['limit'])?$params['limit']:30)." offset ". (($params['start'])?$params['start']:0);
        $respuesta = $conn->fetchAll($sql);
        return array('datos'=>$respuesta, 'cantidad'=>count($cnt));
    }
    public function getDatosMaximoMinimo($params)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "
		select DISTINCT
		ni.codigo as codigo,
		ni.denominacion as denominacion,
                u.abreviaturaunidadmedida as uemb,
                lp.denominacion as lineaprod,
		(
				select max(dp2.maximo)
				from mod_logistica.dat_producto dp2
				inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
				inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                                inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
                                inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                                inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
				where dp2.idestructura = dp.idestructura
				and c2.idindicador = c.idindicador
				and dp2.cronologia > 0 and lp2.idnaturaleza = lp.idnaturaleza
		) as maximo,
		(
				select min(dp2.minimo)
				from mod_logistica.dat_producto dp2
				inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
				inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                                inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
                                inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                                inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
				where dp2.idestructura = dp.idestructura
				and c2.idindicador = c.idindicador
				and dp2.cronologia > 0 and lp2.idnaturaleza = lp.idnaturaleza
		) as minimo,
		(
				select sum(dp2.cantidad)
				from mod_logistica.dat_producto dp2
				inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
				inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
                                inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
                                inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp2.idindicador
                                inner join mod_datosmaestros.nom_naturaleza lp2 on lp2.idnaturaleza = ni.idnaturaleza
				where  dp2.cronologia > 0 and lp2.idnaturaleza = lp.idnaturaleza
				and dp2.idestructura = dp.idestructura and c2.idindicador = c.idindicador
		) as existencia,
		eo.denominacion as arearesp
		from mod_logistica.dat_producto dp
		inner join mod_logfarmacia.conf_cuadrobasico c on c.idindicador = dp.idindicador
		inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
		inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
		left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
                inner join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador
                inner join mod_datosmaestros.nom_naturaleza lp on lp.idnaturaleza = ni.idnaturaleza
		where dp.idestructuracomun = {$params['idestructura']} and dp.cronologia > 0
		order by eo.denominacion,lp.denominacion, ni.denominacion";
        $cnt = $conn->fetchAll($sql);
        $sql.=" limit ".$params['limit']." offset ". $params['start'];
        $respuesta = $conn->fetchAll($sql);
        return array('datos'=>$respuesta, 'cantidad'=>count($cnt));
    }
    public  function compararQuery($comp, &$sql, $params){

        switch ($comp['campo']){
            case 'preciocosto':
                $sql .= " and (

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idindicador = c.idindicador

            ) {$comp['signo']} {$comp['valor']}";
                break;
            case 'precioventa':
                $sql .= " and (COALESCE((

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idindicador = c.idindicador

        ), dp.precio)) {$comp['signo']} {$comp['valor']}";
                break;
          case 'importecosto':
                $sql .= " and (sqc.cantidad *
                ( select dp2.precio as precio
		        from mod_logistica.dat_producto dp2
		        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
		        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
		        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
		        where dp2.cronologia > 0 and eo2.idestructuraop in (cfgf.idalmacen) and c2.idindicador = c.idindicador
            )) {$comp['signo']} {$comp['valor']}";
                break;
         case 'importeventa':
                $sql .= " and (sqc.cantidad *
                (COALESCE((
        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_logfarmacia.conf_cuadrobasico c2 on c2.idindicador = dp2.idindicador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = {$params['idestructura']}
        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idindicador = c.idindicador

        ), dp.precio))) {$comp['signo']} {$comp['valor']}";
                break;

        case 'cantidad':
                $sql .= " and sqc.cantidad {$comp['signo']} {$comp['valor']}";
                break;
        }
    }
    public function reduceFilter(&$params){
        if($params['precioventa'])
            $params['comparaciones'][]= array("campo"=>"precioventa", "valor"=>$params['precioventa'], "signo"=>"=");
        if($params['preciocosto'])
            $params['comparaciones'][]= array("campo"=>"preciocosto", "valor"=>$params['preciocosto'], "signo"=>"=");
        if($params['importecosto'])
            $params['comparaciones'][]= array("campo"=>"importecosto", "valor"=>$params['importecosto'], "signo"=>"=");
        if($params['importeventa'])
            $params['comparaciones'][]= array("campo"=>"importeventa", "valor"=>$params['importeventa'], "signo"=>"=");
        if($params['cantidad'])
            $params['comparaciones'][]= array("campo"=>"cantidad", "valor"=>$params['cantidad'], "signo"=>"=");


    }
    public function filtrarEstados(&$sql, $params)
    {
        switch ($params['idestadoven']) {
            case 1:
                $sql .= " and l.fechavencimiento > '{$params['fechaproxven']}' ";
                break;
            case 2:
                $sql .= " and l.fechavencimiento < '{$params['fechaproxven']}' and l.fechavencimiento > '{$params['fechaposiven']}'  ";
                break;
            case 3:
                $sql .= " and l.fechavencimiento < '{$params['fechaposiven']}' and  l.fechavencimiento > '{$params['fechasub']}'  ";
                break;
            case 4:
                $sql .= " and l.fechavencimiento < '{$params['fechasub']}' ";
                break;
        }
    }
}