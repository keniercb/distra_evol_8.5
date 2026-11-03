<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 30/05/2018
 * Time: 13:31
 */

class RotacionloteModel extends DocumentoLogisticaModel
{#
    public function __construct($data)
    {
        parent::__construct($data);
    }

    public function cargarAreasTipoRotacion($idtiporotacion)
    {
        $query = "Select distinct 
                  ntra.idtiporotacionarea as idtiporotacionarea, ntra.iddeposito as iddeposito
                  from mod_logfarmacia.nom_tiporotacionarea ntra
                  where ntra.idtiporotacion = {$idtiporotacion}";
        $result = LogisticaDoctrineHelper::__init()->getConnection()->execute($query)->fetchAll(PDO::FETCH_OBJ);
        $datos = array();
        foreach ($result as $res) {
            $datos[] = $res->iddeposito;
        }
        return $datos;
    }

    public function cargarCodificador($params)
    {
        $select = " select pp.cantidad, pp.precio as preciocosto, pp.precioventa, pp.idcodificador, pp.idproducto,
        pp.idlineaprod, lp.denominacion as denomlineaprod, co.codigo, co.descripcion as denominacion,
        (select idmovimiento from mod_logistica.dat_movimiento where idproducto = pp.idproducto
        order by cronologia desc limit 1) as idmovimiento,
        (select existenciaactual from mod_logistica.dat_movimiento where idproducto = pp.idproducto
        order by cronologia desc limit 1) as existenciaactual, um.abreviaturaunidadmedida as um, 
        pre.denominacion as presentacion, co.idabc as clasificacion
        ";
        $from = " from mod_logistica.dat_producto pp
        inner join mod_datosmaestros.dat_codificador co on co.idcodificador = pp.idcodificador
        inner join mod_logistica.dat_producto pp2 on co.idcodificador = pp2.idcodificador
        left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = pp.idlineaprod 
        left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = co.idumedida 
        left join mod_datosmaestros.nom_tipoenvase pre on pre.idtipoenvase = co.idpresentacion 
        ";
        $where = " where pp.idestructura = {$params['iddeposito']}  and pp2.idestructura = {$params['iddepositodestino']}";
        if ($params['idrotacionlote']) {
            $from .= " inner join mod_logfarmacia.dat_rotacioncodificador rc on rc.idcodificador = pp.idcodificador";
            $where .= " and rc.idrotacionlote = {$params['idrotacionlote']}";
        }
        $where .= " and pp.cronologia > 0 ";

        if ($params['excluir']) {
            $excluir = implode(',', $params['excluir']);
            $where .= " and pp.idcodificador not in ($excluir)";
        }
        if ($params['criterio']) {
            $where .= " and (co.codigo ilike '%{$params['criterio']}%' or co.descripcion ilike'%{$params['criterio']}%')";
        }
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll();
        if ($params['limit']) {
            $where .= " offset({$params['start']}) limit({$params['limit']})";
        }
//        print_r($select. $from. $where);die;
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll();

        return array($datos, count($total));

    }

    public function cargarLotes($params)
    {
        $select = " 
        select l.idlote, 
        l.idproducto,
        l.fechafabricacion, 
        l.fechavencimiento, 
        l.numero as nrolote,
        l.existencia as existencia";
        $from = " from mod_logistica.dat_producto pp
        inner join mod_logistica.dat_lote  l on l.idproducto = pp.idproducto";
        if (!isset($params['ventana'])) {

            $select .= ", rpl.cantidad as cantidad ";
            $from .= " inner join mod_logfarmacia.dat_rotacionproductolote  rpl on l.idlote = rpl.idlote ";
            $where = " where rpl.idrotacionlote ={$params['idrotacionlote']} 
            and rpl.tipo = {$params['tipo']} 
            and rpl.idcodificador = {$params['idcodificador']}";
        } else {
            $select .= ",             
            l.existencia as cantidad, 
            ( SELECT DISTINCT pp2.idproducto 
            From mod_logistica.dat_producto pp2
            inner join mod_logistica.dat_lote  l2 on l2.idproducto = pp2.idproducto
            where pp2.idestructura = {$params['iddepositodestino']} and pp2.idcodificador = {$params['idcodificador']}            
            ) as idproductodestino, (
            select estr.descripcion as ubicacion
            from mod_logistica.dat_movlote ml  
            inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = ml.idmovimiento
            left join mod_logubicacion.dat_estructuraubicacion estr on estr.idestructuraubicacion = ml.idubicacion
            where ml.idlote = l.idlote and mov.cronologia > 0
            order by mov.cronologia DESC limit 1
        ) as ubicacion ";
            $where = " where pp.idestructura = {$params['iddeposito']} and pp.idcodificador= {$params['idcodificador']}";
        }
        $params['excluir'] = json_decode($params['excluir']);
        if (count($params['excluir'])) {
            $where .= " and l.idlote not in (" . implode(",", $params['excluir']) . ") ";
        }
        if ($params['criterio']) {
            $where .= " and l.numero ilike '%{$params['criterio']}%' ";
        }
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll(PDO::FETCH_OBJ);
        if ($params['limit']) {
            $where .= " offset({$params['start']}) limit({$params['limit']})";
        }

        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll(PDO::FETCH_OBJ);

        return array($datos, count($total));
    }

    public function salvarDatos($params)
    {
        if (!isset($params['idrotacionlote'])) {
            $rotacionObj = new Rotacionlote();

        } else {
            $params['iddocumento'] = $params['idrotacionlote'];
            $rotacionObj = Doctrine::getTable('Rotacionlote')->find($params['idrotacionlote']);
        }
        $documento = $this->adicionarDocumento($params);
        $documento->save();
        $params['idrotacionlote'] = $documento->iddocumento;
        $rotacionObj->synchronizeWithArray($params);
        $rotacionObj->save();
        if (count($params['idcodificadores'])) {
            $this->salvarCodificadores($params);
            $rotacionObj->cantidad = $rotacionObj->cantidad + count($params['idcodificadores']);
            $rotacionObj->save();
        }

        return array('idrotacionlote' => $rotacionObj->idrotacionlote, 'estado' => $documento->estado);

    }

    public function salvarCodificadores($params)
    {

        $rotCodCol = new Doctrine_Collection('RotacionCodificador');
//        $movCol = new Doctrine_Collection('DatMovimientos');
        $idrotacion = $params['idrotacionlote'];
        foreach ($params['idcodificadores'] as $cod) {
            $rtcObj = new RotacionCodificador();
            $rtcObj->idrotacionlote = $idrotacion;
            $rtcObj->idcodificador = $cod['idcodificador'];
            $rotCodCol->add($rtcObj);

            /* $movObj = new DatMovimientos();
             $movObj->iddocumento = $params['idrotacionlote'];
             $movObj->idproducto = $cod['idproducto'];*/
        }
        $rotCodCol->save();

    }

    public function cargarRotaciones($params)
    {

        $objIddocFac = $this->documentosHelper->devuelveIddocByIdEstructura(
            'rotacionloteLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV);
        $select = " 
        select 
        rl.idrotacionlote,
        rl.idtiporotacion,
        rl.idorigen,
        rl.iddestino,
        rl.cantidad,
       
        doc.numeroref as nrorotacionlote,
        doc.fechacontable as fecharotacionlote,
        doc.estado as estado,
        doc.observaciones as observaciones,
        ntr.denominacion as tiporotacionlote,
        eo.denominacion as areaorigen,
        ed.denominacion as areadestino,
        u.nombreusuario as usuario       
         
       ";
        $from = " 
        from mod_logfarmacia.dat_rotacionlote rl
        inner join mod_logistica.dat_documento doc on doc.iddocumento = rl.idrotacionlote
        inner join mod_logfarmacia.nom_tiporotacion ntr on ntr.idtiporotacion = rl.idtiporotacion
        inner join mod_estructuracomp.dat_estructuraop eo on eo.idestructuraop = rl.idorigen
        inner join mod_estructuracomp.dat_estructuraop ed on ed.idestructuraop = rl.iddestino
        left join mod_seguridad.seg_usuario u on doc.aprobadopor = u.idusuario";

//        $where = " where pp.idestructura = {$params['iddeposito']} and pp.idcodificador= {$params['idcodificador']}";
        $where = " where doc.iddoc = {$objIddocFac->iddoc} ";
        if ($params['fecha']) {
            $where .= " and doc.fechacontable = '{$params['fecha']}'";
        }
        $where .= " ORDER BY rl.idrotacionlote DESC ";

        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll(PDO::FETCH_OBJ);
        if ($params['limit']) {
            $where .= " offset({$params['start']}) limit({$params['limit']})";
        }

        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where)->fetchAll(PDO::FETCH_OBJ);
        //print_r($datos);die;
        return array($datos, count($total));
    }

    public function eliminarRotacion($params)
    {
        $this->eliminarDocumento($params['idrotacionlote']);
    }

    public function eliminarProducto($params)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('RotacionCodificador')
            ->whereIn('idcodificador', $params['idcodificadores'])
            ->execute();
        $this->eliminarLotes($params);
    }

    public function eliminarLotes($params)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('RotacionProductoLote');
        if ($params['idcodificadores']) {
            $query->whereIn('idcodificador', $params['idcodificadores']);
        }
        if ($params['idlotes']) {
            $query->whereIn('idlote', $params['idlotes']);
        }
        $query->execute();
    }

    public function adicionarLotes($params)
    {
        $objColect = new Doctrine_Collection('RotacionProductoLote');
        foreach ($params['idlotes'] as $lote) {
            $obj = new RotacionProductoLote();
            $obj->synchronizeWithArray($lote);
            $objColect->add($obj);

        }
        $objColect->save();

    }

    public function rotarLotes($params)
    {
        $select = " 
        select distinct 
        rpl.idlote,
        rpl.idproductodestino,
        rpl.idcodificador,
        rpl.tipo ,
        rpl.cantidad as cantlote,
        rl.idorigen,
        l.existencia,
        l.numero,
        rl.iddestino,
        p.idproducto,       
        p.cantidad,       
        p.disponible       
        
        from mod_logfarmacia.dat_rotacionproductolote  rpl
        inner join mod_logistica.dat_lote  l on l.idlote = rpl.idlote
        inner join mod_logfarmacia.dat_rotacionlote  rl on rpl.idrotacionlote = rl.idrotacionlote
        inner join mod_logistica.dat_producto p on p.idproducto = l.idproducto
        where rpl.idrotacionlote = {$params['idrotacionlote']}
         
       ";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select
        )->fetchAll(PDO::FETCH_OBJ);

        $prodAdd = array();
        $prodRest = array();
        $prodAddNew = array();

        if (!count($datos)) {
            return -3;
        }
        foreach ($datos as $dat) {
            settype($dat, "array");
            $estaL = self::existeLote($dat['numero'], $dat['idproductodestino']);
            if ($dat['cantlote'] != $dat['existencia'] && !$estaL['existe']) {
                $prodAddNew[$dat['idproductodestino']][] = array('idlote' => $dat['idlote'], 'cantlote' => $dat['cantlote'], 'tipo' => $dat['tipo']);
            } else {
                $prodAdd[$dat['idproductodestino']][] = array('idlote' => $dat['idlote'], 'cantlote' => $dat['cantlote'], 'existencia' => $dat['existencia'], 'tipo' => $dat['tipo'], 'numero' => $dat['numero']);
            }
            $prodRest[$dat['idproducto']][] = array('cantidad' => $dat['cantidad'], 'numero' => $dat['numero'], 'cantlote' => $dat['cantlote'], 'disponible' => $dat['disponible'], 'idlote' => $dat['idlote'], 'existencia' => $dat['existencia'], 'tipo' => $dat['tipo']);
        }

        foreach ($prodRest as $k => $pr) {
            $cantidadRestar = $pr[0]['cantidad'];
            $disponibilidadRestar = $pr[0]['disponible'];
            self::modificarResProd($disponibilidadRestar, $cantidadRestar, $k, $pr);
            $movObj = self::crearMovimiento($params, $k);
            self::crearMovLotes($movObj->idmovimiento, $k, $pr, 1);


        }
        foreach ($prodAdd as $j => $p) {
            self::modificarAddProd($j, $p);
            $movObj = self::crearMovimiento($params, $j);
            self::crearMovLotes($movObj->idmovimiento, $j, $p, 2);
        }
        foreach ($prodAddNew as $m => $pn) {
            $movObj = self::crearMovimiento($params, $m);
            self::crearLote($m, $pn, $movObj->idmovimiento);
        }

        $this->confirmarDocumento($params['idrotacionlote']);
        $this->aprobarDocumento($params['idrotacionlote']);
        return 1;
    }

    public static function crearLote($idproducto, $lotes, $idmov)
    {
        $cant = 0;

        foreach ($lotes as $lot) {
            $lote = Doctrine::getTable('DatLote')->find($lot['idlote']);
            $arrL = $lote->toArray();
            $arrL['idproducto'] = $idproducto;
            $arrL['existencia'] = $lot['cantlote'];
            unset($arrL['idlote']);
            $loteN = new DatLote();
            $loteN->synchronizeWithArray($arrL);
            $loteN->save();
            $cant += $lot['cantlote'];

            $movLote = new DatMovlote();
            $movLote->idlote = $loteN->idlote;
            $movLote->idmovimiento = $idmov;
            $movLote->cantidad = $lot['cantlote'];//            $movLote->idubicacion = $producto->idestructura;
            $movLote->save();
            $lote->existencia = $lote->existencia - $lot['cantlote'];
            $lote->save();

        }

        $prod = new DatProductoLogistica();
        $prod->assignIdentifier($idproducto);
        $prod->cantidad = $prod->cantidad + $cant;
        $prod->disponible = $prod->disponible + $cant;
        $prod->save();
    }

    public static function modificarResProd($disponibilidadRestar, $cantidadRestar, $k, $lotes)
    {

        $cant = 0;
        foreach ($lotes as $lot) {
            $cant += $lot['cantlote'];
            $existeL = self::existeLote($lot['numero'], $k);
            if ($existeL['existe']) {
                $resta = $existeL['lotes'][0]->existencia - $lot['cantlote'];
                $existeL['lotes'][0]->existencia = ($resta) ? $resta : 0;
                $existeL['lotes'][0]->save();
            }
        }

        $query = Doctrine_Query::create();
        $query->update('DatProductoLogistica')
            ->set('cantidad', $cantidadRestar - $cant)
            ->set('disponible', $disponibilidadRestar - $cant)
            ->where('idproducto = ?', $k)
            ->execute();
    }

    public static function modificarAddProd($j, $lotes, $new)
    {
        $cantidad = 0;
        foreach ($lotes as &$lot) {
            $cantidad += $lot['cantlote'];
        }
        $prod = new DatProductoLogistica();
        $prod->assignIdentifier($j);
        $prod->cantidad = $prod->cantidad + $cantidad;
        $prod->disponible = $prod->disponible + $cantidad;
        $prod->save();

        foreach ($lotes as $lot) {
            $respLote = self::existeLote($lot['numero'], $j);
            self::actualizarLote($j, $lot['idlote'], $respLote, $lot['cantlote']);

        }

    }

    public function actualizarLote($idproducto, $idlote, $arreglo, $cantidad)
    {
        $query = Doctrine_Query::create();
        if ($arreglo['existe']) {
            $query->update('DatLote')
                ->set('existencia', $arreglo['lotes'][0]->existencia + $cantidad)
                ->where('idlote=?', $arreglo['lotes'][0]->idlote)
                ->execute();

            $loteOld = new DatLote();
            $loteOld->assignIdentifier($idlote);
            if ($cantidad == $loteOld->existencia) {
                $loteOld->existencia = 0;
                $loteOld->save();
            }
        } else {
            $query->update('DatLote')
                ->set('idproducto', $idproducto)
                ->where('idlote=?', $idlote)
                ->execute();
        }
    }

    public static function existeLote($numero, $idprod)
    {
        $lotes = Doctrine::getTable('DatLote')->findByDql('numero = ? and idproducto = ?', array($numero, $idprod));
        return array('existe' => count($lotes->toArray()), 'lotes' => $lotes);

    }

    public static function crearMovLotes($idmov, $idprod, $lotes, $tipo)
    {

        foreach ($lotes as $lot) {
            if ($lot['tipo'] == $tipo) {

                $movLote = new DatMovlote();
                $movLote->idlote = $lot['idlote'];
                $movLote->idmovimiento = $idmov;
                $movLote->cantidad = $lot['cantlote'];//            $movLote->idubicacion = $producto->idestructura;
                $movLote->save();
            }

        }


    }

    public static function crearMovimiento($params, $idprod)
    {
        $mov = Doctrine::getTable('DatMovimientos')->findByDql('iddocumento = ? and idproducto = ?', array($params['idrotacionlote'], $idprod));
        if (count($mov->toArray())) {
            $movObj = $mov[0];
        } else {
            $movObj = new DatMovimientos();
            $movObj->iddocumento = $params['idrotacionlote'];
            $movObj->idproducto = $idprod;
            $movObj->save();
        }

        return $movObj;
    }

}