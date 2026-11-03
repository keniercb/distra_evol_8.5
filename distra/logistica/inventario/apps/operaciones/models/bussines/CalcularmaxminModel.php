<?php

/**
 * @class      ConfiguracioninventarioModel
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class CalcularmaxminModel extends ZendExt_Model {

    public function __construct() {
        parent::ZendExt_Model();
        $this->configuracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    /* ((select count(distinct fechacontable) from
      (
      select m.existenciaactual, d.fechacontable
      from  mod_logistica.dat_movimiento m
      inner join mod_logistica.dat_producto pp on pp.idproducto = m.idproducto
      inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento

      where pp.idcodificador = co.idcodificador
      and d.fechacontable  BETWEEN '$fechainicio' and '$fechafin'
      and pp.idestructura in ({$confGeneral[0]['idalmacen']},{$confGeneral[0]['idareaventa']})
      and d.cronologia > 0 and d.estado <> 5
      )q
      where q.existenciaactual > 0)) as diasabastecidos
     */

    /**
     * @param $params
     * @param bool $sql
     * @return array
     */
    public function cargarGridPrincipal($params, $sql = false) {
        $cEstructura = $this->global->Estructura->idestructura;
        $confGeneral = $this->cargarDatosIniciales();

        $arra[0] = $confGeneral[0]['idalmacen'];
        $arra[1] = $confGeneral[0]['idareaventa'];
        $arra = implode(',', $arra);
        $fechainicio = $params['fechainicio'];
        $fechafin = $params['fechafin'];

        $select = " select DISTINCT co.codigo as codigo, co.descripcion as denominacion,
        um.abreviaturaunidadmedida as um, lp.denominacion as lineaprod, pp.idcodificador,
        usd.idtipodispensacion as idtipodispensacion, pp.idcodificador,        
        (SELECT * FROM mod_loghistorico.f_diasbastecido(co.idcodificador, '$fechainicio', '$fechafin', {$confGeneral[0]['idalmacen']}, {$confGeneral[0]['idareaventa']})) as diasabastecidos
        ,(case when pc.estado = 1 then 1 else 0 end) as estado, pc.calculado as calculado, pc.idanalisis as idanalisis,        ";

        if (!$params['grid']) {
            $select .= " pp.idproducto, trunc(pp.minimo) as minimoantes, trunc(pp.maximo) as maximoantes, pp.precioventa, pp.precio,".
                " ee.denominacion as deposito,trunc(pc.maximo) as maximo, trunc(pc.minimo) as minimo, pc.idprodcalculomaxmin as idprodcalculomaxmin".
                " ,pp.idestructura as idarea ";
        }else{
            $select .= " (select trunc(pp1.minimo) from mod_logistica.dat_producto pp1 where pp1.idcodificador = pp
            .idcodificador and pp1.idestructura = {$confGeneral[0]['idalmacen']} and pp1.cronologia > 0) as minimoantes, ".
            "(select trunc(pp1.maximo) from mod_logistica.dat_producto pp1 where pp1.idcodificador = pp
            .idcodificador and pp1.idestructura = {$confGeneral[0]['idalmacen']} and pp1.cronologia > 0) as maximoantes,".
            "(select cb.precioventa from mod_logfarmacia.conf_cuadrobasico cb ". 
            "inner join mod_logfarmacia.conf_anno cfa on cfa.idanno = cb.idanno ".
            "where cb.idcodificador = pp.idcodificador and cfa.activo = 1 limit 1) as precioventa," .
            "(select pp1.precio from mod_logistica.dat_producto pp1 where pp1.idcodificador = pp
            .idcodificador and pp1.idestructura = {$confGeneral[0]['idalmacen']} and pp1.cronologia > 0) as precio,".
            "(select trunc(pc1.maximo) from mod_logfarmacia.dat_prodcalculomaxmin pc1 inner join mod_logistica
            .dat_producto dp1 on dp1.idproducto = pc1.idproducto where dp1.idestructura =
            {$confGeneral[0]['idalmacen']} and pc1.idcodificador = pp.idcodificador) as maximo,".
            "(select trunc(pc1.minimo) from mod_logfarmacia.dat_prodcalculomaxmin pc1 inner join mod_logistica
            .dat_producto dp1 on dp1.idproducto = pc1.idproducto where dp1.idestructura =
            {$confGeneral[0]['idalmacen']} and pc1.idcodificador = pp.idcodificador) as minimo";
        }

        //if ($params['combo'] && $params['idcodificador']) {
        $select .= " ,(select sum(ppp.cantidad)
        from mod_logistica.dat_producto ppp
        inner join mod_datosmaestros.dat_codificador coo on coo.idcodificador = ppp.idcodificador
        --inner join mod_estructuracomp.nom_filaestruc fff on fff.idfila = ppp.idestructura
        --inner join mod_estructuracomp.dat_estructuraop eee on fff.idfila = eee.idestructuraop
        --inner join mod_logfarmacia.conf_cuadrobasico cbb on cbb.idcodificador = coo.idcodificador
        --inner join mod_logfarmacia.dat_unidadsaluddispensacion usdd on usdd.idcuadrobasico = cbb.idpadre
        left join mod_logfarmacia.dat_prodcalculomaxmin pcc on pcc.idproducto = ppp.idproducto
        left join mod_datosmaestros.nom_unidadmedida umm on umm.idunidadmedida = ppp.idumedida
        left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = ppp.idlineaprod
        where ppp.idestructuracomun = $cEstructura and ppp.cronologia > 0 
        --and usdd.idtipodispensacion <> 3
        --and eee.idestructuraop in ($arra) 
        and coo.idcodificador = co.idcodificador) as existencia,
        (
          select coalesce(sum(coalesce(mov.cantidad,0)),0)
            from  mod_logistica.dat_producto prod 
            inner join mod_logistica.dat_movimiento mov on mov.idproducto = prod.idproducto
            inner join mod_datosmaestros.dat_codificador cod on cod.idcodificador = prod.idcodificador                     
            inner join mod_logistica.dat_documento doc on doc.iddocumento = mov.iddocumento
            inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = doc.iddocumento
            where prod.idestructura = {$confGeneral[0]['idareaventa']} and prod.idcodificador = co.idcodificador
            and dv.fechaventa >= '$fechainicio' and dv.fechaventa <= '$fechafin' and doc.estado = 4
         ) as consumo";
         
        $from = " from mod_logistica.dat_producto pp
        inner join mod_datosmaestros.dat_codificador co on co.idcodificador = pp.idcodificador
        left join mod_estructuracomp.nom_filaestruc ff on ff.idfila = pp.idestructura
        left join mod_estructuracomp.dat_estructuraop ee on ff.idfila = ee.idestructuraop
        left join mod_logfarmacia.conf_cuadrobasico cb on cb.idcodificador = co.idcodificador
        left join mod_logfarmacia.dat_unidadsaluddispensacion usd on usd.idcuadrobasico = cb.idpadre and usd.idtipodispensacion <> 3
        left join mod_logfarmacia.dat_prodcalculomaxmin pc on pc.idproducto = pp.idproducto
        left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = pp.idumedida
        left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = pp.idlineaprod
        ";
        if ($confGeneral[0]['fondofijo'] && $params['grid']) {
            $fondofijo = $confGeneral[0]['fondofijo'] / 100;
            $select .= " ,((select pp1.maximo from mod_logistica.dat_producto pp1 where pp1.idcodificador = pp
            .idcodificador and pp1.idestructura = {$confGeneral[0]['idalmacen']} and pp1.cronologia > 0) * $fondofijo) as fondofijoantes,
            ((select pc1.maximo from mod_logfarmacia.dat_prodcalculomaxmin pc1 inner join mod_logistica
            .dat_producto dp1 on dp1.idproducto = pc1.idproducto where dp1.idestructura =
            {$confGeneral[0]['idalmacen']} and pc1.idcodificador = pp.idcodificador) * $fondofijo) as fondofijo ";
        }
        $where = " where pp.idestructuracomun = {$cEstructura} and pp.cronologia > 0
        and pp.idestructura in ({$arra})";
        $where = $this->getFilterWhere($where, $params);
        $where .= " order by co.descripcion";
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($select . $from . $where)->fetchAll();
        if ($params['limit']) {
            $where .= " offset({$params['start']}) limit({$params['limit']})";
        }
        if ($sql) {
            return array($select, $from, $where);
        }

        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute($select . $from . $where)->fetchAll(
            PDO::FETCH_ASSOC);

        return array(count($total), $datos);
    }

    public function getFilterWhere($where, $params) {
        if ($params['lineaprod']) {
            $where .= " and pp.idlineaprod = {$params['lineaprod']}";
        }
        if ($params['idlineaprod']) {
            $where .= " and pp.idlineaprod in ({$params['idlineaprod']})";
        }

        if ($params['codigo']) {
            $where .= " and co.codigo ilike '%{$params['codigo']}%'";
        }
        if ($params['denominacion']) {
            $where .= " and co.descripcion ilike '%{$params['denominacion']}%'";
        }
        if ($params['criterio']) {
            $where .= " and co.codigo ilike '%{$params['criterio']}%' or co.descripcion ilike '%{$params['criterio']}%'";
        }
        if ($params['idcodificador']) {
            $where .= " and co.idcodificador = {$params['idcodificador']}";
        }
        return $where;
    }

    public function cargarDatosIniciales($params) {
        $cFechaContable = 'FechaContable';
        $fechaContable = $this->global->$cFechaContable->fecha;
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;

        $select = "select *  from mod_logfarmacia.conf_generalfm where idestructura = $cEstructura";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll();
        $datos[0]['fechacontable'] = $fechaContable;

        return $datos;
    }

    public function getCalcularDatos($params) {
        /* $select = " select p.idanalisis from mod_logfarmacia.dat_prodcalculomaxmin p
          order  by p.idanalisis DESC limit 1";
          $idanalisis = LogisticaDoctrineHelper::__init()->getConnection()->execute($select )->fetchAll(); */
        if (count($params['calcular'] == 0)) {
            $parametros['combo'] = 'true';
            $parametros['idlineaprod'] = ($params['idlineaprod']) ? $params['idlineaprod'] : null;
            $parametros['idcodificador'] = $params['idcodificador'] ? $params['idcodificador'] : null;
            $parametros['fechainicio'] = $params['form']->fechainicio;
            $parametros['fechafin'] = $params['form']->fechafin;
            $datos = $this->cargarGridPrincipal($parametros);

            $params['calcular'] = $datos[1];
        }
        else {
            $params['calcular'] = $this->objectHelper->stdClassToArray($params['calcular']);
        }
        $cargarConf = $this->cargarDatosIniciales($params);

        $norma = $cargarConf[0]['normabast'];
        $cFechaContable = 'FechaContable';
        foreach ($params['calcular'] as $calcu) {
            $maximo = round(($calcu['consumo'] / $calcu['diasabastecidos']) * $norma,6);
            
            if($cargarConf[0]['idareaventa'] == $calcu['idarea']){
                $maximo = $cargarConf[0]['fondofijo'] / 100 * $maximo;
                $minimo = $cargarConf[0]['minarea'] / 100 * $maximo;
            } else {
                $minimo = $cargarConf[0]['minimo'] / 100 * $maximo;
            }
            
            if (is_null($calcu['idprodcalculomaxmin'])) {
                $obj = new CalculoMaxMin();
                $obj->idproducto = $calcu['idproducto'];
                $obj->idcodificador = $calcu['idcodificador'];
                $obj->minimo = $minimo;
                $obj->maximo = $maximo;
                $obj->estado = 0;
                $obj->calculado = 1;
                $obj->fechainicio = $params['form']->fechainicio;
                $obj->fechafin = $params['form']->fechafin;
                $obj->fechacargo = $this->global->$cFechaContable->fecha;
                $obj->save();
            }
            else {
                $update = "UPDATE mod_logfarmacia.dat_prodcalculomaxmin
                    SET minimo = $minimo,maximo = $maximo,
                      fechainicio = '{$params['form']->fechainicio}',
                      fechafin = '{$params['form']->fechafin}',
                      fechacargo = '{$this->global->$cFechaContable->fecha}',
                      calculado = 1
                    WHERE
                      idprodcalculomaxmin = {$calcu['idprodcalculomaxmin']}
                    ";
                LogisticaDoctrineHelper::__init()->getConnection()->execute($update);
            }
        }
    }

    public function aprobarMaxMin($params) {
        if (count($params['calcular']) == 0) {
            $parametros['combo'] = 'true';
            $parametros['idlineaprod'] = ($params['idlineaprod']) ? $params['idlineaprod'] : null;
            $parametros['idcodificador'] = $params['idcodificador'] ? $params['idcodificador'] : null;
            $parametros['fechainicio'] = $params['form']->fechainicio;
            $parametros['fechafin'] = $params['form']->fechafin;
            $datos = $this->cargarGridPrincipal($parametros);
            $params['calcular'] = $datos[1];
        }
        else {
            // $params['calcular'] = $this->objectHelper->stdClassToArray($params['calcular']);
        }
        
        //buscar el ultimo idanalisis para incrementarlo
        $select = " select p.idanalisis from mod_loghistorico.his_eprodcalculomaxmin p
        order  by p.idanalisis DESC limit 1";
        $idanalisis = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll();
        foreach ($params['calcular'] as $calcu) {
            //buscar los datos del peod calculado
            $selectaux = " select p.* from mod_logfarmacia.dat_prodcalculomaxmin p
            where p.idprodcalculomaxmin = {$calcu['idprodcalculomaxmin']}";
            $calcilados = LogisticaDoctrineHelper::__init()->getConnection()->execute($selectaux)->fetchAll();
            $idanalisis = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll();
            $idanalisis = (count($idanalisis) == 0) ? 1 : $idanalisis[0]['idanalisis'] + 1;
            //actualizar el producto

            $update = "UPDATE mod_logistica.dat_producto
                    SET minimo = {$calcilados[0]['minimo']}, maximo = {$calcilados[0]['maximo']}                     
                    WHERE idproducto = {$calcu['idproducto']} ";

            LogisticaDoctrineHelper::__init()->getConnection()->execute($update);


            $insert = "INSERT INTO mod_loghistorico.his_eprodcalculomaxmin(idproducto,minimo,maximo,fechainicio,
                        fechafin,fechacargo,estado,calculado,idanalisis)
            VALUES ({$calcilados[0]['idproducto']},{$calcilados[0]['minimo']},{$calcilados[0]['maximo']},'{$calcilados[0]['fechainicio']}',
            '{$calcilados[0]['fechafin']}','{$calcilados[0]['fechacargo']}',1,{$calcilados[0]['calculado']},{$idanalisis});";

            LogisticaDoctrineHelper::__init()->getConnection()->execute($insert);

            $dell = "DELETE FROM mod_logfarmacia.dat_prodcalculomaxmin 
                    WHERE idprodcalculomaxmin = {$calcu['idprodcalculomaxmin']}";
            LogisticaDoctrineHelper::__init()->getConnection()->execute($dell);
        }
    }

    public function getEliminarDatos($params) {

        $params['eliminar'] = implode(',', $params['eliminar']);

        $eliminar = "
                    DELETE FROM
                      mod_logfarmacia.dat_prodcalculomaxmin
                    WHERE
                      idprodcalculomaxmin in ({$params['eliminar']}) and estado = 0
                    ";
        LogisticaDoctrineHelper::__init()->getConnection()->execute($eliminar);
    }

    public function cargarAnalisis($params) {
        $select = " select h.idanalisis as nroregistro, 
        (case when lp.denominacion is not null then lp.denominacion  else cc.descripcion end )as lineaprod,
-- (lp.denominacion || ' / ' || cc.descripcion) as lineaprod,
                h.fechacargo as fechacalculo, h.fechainicio, h.fechafin, lp.idlineaprod
                from mod_loghistorico.his_eprodcalculomaxmin h    
                inner join mod_logistica.dat_producto pp on pp.idproducto = h.idproducto 
                inner join mod_datosmaestros.dat_codificador cc on cc.idcodificador = pp.idcodificador
                left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = pp.idlineaprod
        
        ";



        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll();
        return $datos;
    }

}
