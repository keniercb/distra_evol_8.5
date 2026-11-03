<?php

/**
 * @class      TransferenciareaModel
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figueroa y Antonio Diaz Soutuyo
 * @copyright XETID
 * @version 1.0
 */
class TransferenciainternaModel extends MovimientosModel
{

    /**
     * @var UtilesubicacionService
     */
    protected $ubicacion;

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->tryInyector();
        $this->logisticaDoc = LogisticaDocumentosHelper::__init();
        $this->ubicacion = new UtilesubicacionService();
    }

    /**
     * Inyecta las relaciones entre clases.
     */
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatTransferenciaAreas',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idtransferenciaarea')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatTransferenciaAreas',
            'properties' => array('local' => 'idtipotransferencia', 'foreign' => 'idtipotransferencia')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new NomTipotransferencia(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatTransferenciaAreas',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatArea(), $relations);

        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatTransferenciaAreas',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatMovimientos(), $relations);
    }

    /**
     * Metodo para devolver los documentos de trasnferencia entre areas
     * @params array $datosDoc Arreglo con los parametros para filtrar los
     * documentos
     *
     * @return array
     */
    public function devolverDocumentos($filtro)
    {
        $query = parent::devolverDocumentos($filtro);
        $trasnferenciareas = new DatTransferenciaAreas();
        $trasnferenciareas->getJoinDatTransferenciareas($query, 'd');
        $trasnferenciareas->getDatosTransferenciaareas($query, $filtro);
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->logisticaDoctrine->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Elimina el documento seleccionado.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        Doctrine_Query::create()->delete('DatUbicacionComprometida')->where('iddocumento = ?', $iddocumento)->execute();
        return parent::eliminarDocumento($iddocumento);
    }

    public function validarProductosAprobar($iddocumento)
    {
        $query = "select sq.producto
            from (select pti.idproducto, po.cantidad as existencia,
            (coalesce(i.numeropieza,i.codigo)||' - '||i.denominacion) as producto,
            (pti.cantidad + (select coalesce(sum(cantidad),0) 
            from mod_logistica.dat_cantidadcomprometida
            where idproducto = pti.idproducto and estado = 1)) as cantidad
            from  mod_loginventario.dat_prodtransfinterna pti
            inner join mod_logistica.dat_producto po on po.idproducto = pti.idproducto
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = po.idindicador
            where pti.idtransfinterna = {$iddocumento}
            group by pti.idproducto, pti.cantidad, po.cantidad,
            i.codigo,i.denominacion,i.numeropieza) as sq
            where (sq.existencia - sq.cantidad) < 0"; 
        
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($query);
        
        /*$prodNegativos = LogisticaDoctrineHelper::__init()
        ->getConnection()->execute($query)->fetchAll(PDO::FETCH_ASSOC);*/
        if(count($result) > 0){
            $prodNegativos = array_map(function($elem){
                return "<b> {$elem['producto']} </b>";
            }, $result);
            $str_productos  = implode(', ', $prodNegativos);
        
            return array(
                'error' => true,
                'errMsg' => "No se puede aprobar el documento. "
                ."Existen productos que la existencia se hace negativa:</br></br>". $str_productos
            );
        }
        return;
    }

    public function aprobarDocumento($iddocumento)
    {
        $cronologia = parent::aprobarDocumento($iddocumento, true);
        $global = ZendExt_GlobalConcept::getInstance();
        $idusuario = $global->Perfil->idusuario;
        $this->doctrineHelper->getConnection()
            ->execute("SELECT mod_loginventario.f_aprobartransfinterna({$iddocumento},{$idusuario},{$cronologia})");
        //(new LogisticaProductoModel())->aprobarMovimientos($iddocumento, $cronologia, true, true, false, true, LogisticaMovimientoModel::SIGNO_MOV_SUMA);
        //(new LogisticaProductoModel())->aprobarMovimientos($iddocumento, $cronologia, false, true, false, true, LogisticaMovimientoModel::SIGNO_MOV_RESTA);
        //(new LoteService())->actualizarExistenciaLote($iddocumento, true, $cronologia, false, LogisticaMovimientoModel::SIGNO_MOV_SUMA);
        //(new LoteService())->actualizarExistenciaLote($iddocumento, false, $cronologia, false, LogisticaMovimientoModel::SIGNO_MOV_RESTA);
        /*$sql = "SELECT * FROM mod_logistica.dat_lote WHERE  numero = '5000'";
        print_r(Doctrine_Manager::connection()->fetchAll($sql));die(' aprobar.');*/
    }

    /**
     * Metodo para cargar las areas de origen y destino
     * @params Integer $iddeposito
     *
     * @return array
     */
    public function cargarAreasOrigenDestino($params)
    {
        
        $params['start'] = ($params['start'])?$params['start']:0;
        $params['limit'] = ($params['limit'])?$params['limit']:30;;

        /*if ($params['cmbArea']) {
            $params['start'] = 0;
            $params['limit'] = 1000;
            return parent::cargarAreas($params);
        }
        $start = $params['start'] ? $params['start'] : 0;
        $limit = $params['limit'] ? $params['limit'] : 30;
        $query = Doctrine_Query::create()->select('idestructuraop')->from('DatAreaventa')
            ->where('idestructuracomun = ?', array($this->global->Estructura->idestructura))->fetchArray();
        $arraIdsDeposit = $this->objectHelper->extractValueFromArrayColumn($query, 'idestructuraop');
        if (count($arraIdsDeposit) > 0) {
            $filtro = array('criterio' => $params['criterio'], 'idestructura' => $arraIdsDeposit);
        } else {
            $filtro = $params['criterio'];
        }*/
        $areas = $this->estructuraHelper->obtenerEstructurasNoFormales(
            $this->global->perfil->iddominio, $this->global->estructura->idestructura, $params['criterio'], $params['limit'], $params['start']
        );
        $total = count(
            $this->estructuraHelper->obtenerEstructurasNoFormales(
                $this->global->perfil->iddominio, $this->global->estructura->idestructura, $params['criterio']
            )
        );
        return array('datos' => $areas, 'cantidad' => $total);
    }
    
    public function cargarDatosConFarm()
    {
        $cFechaContable = 'FechaContable';
        $fechaContable = $this->global->$cFechaContable->fecha;
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;
        $select = "select *  from mod_loginventario.conf_generalfm where idestructura = $cEstructura";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll();
        $datos[0]['fechacontable'] = $fechaContable;
        return $datos;
    }

    /**
     * Devuelve las areas del deposito.
     * @params numeric $iddeposito
     * @return array
     */
    public function cargarAreasXTipoTransferencia($iddeposito)
    {
        $query = $this->ubicacion->devolverAreasPorDeposito($iddeposito, true);
        $query->addSelect(
            "(SELECT array_to_string(array_agg(tt.idtipotransferencia), ',') FROM NomTipoarea ta "
            . "INNER JOIN ta.NomTipotransferenciaarea tta ON tta.idnomtipoarea = ai.idnomtipoarea "
            . "INNER JOIN tta.NomTipotransferencia tt ON tt.idtipotransferencia = tta.idtipotransferencia "
            . "WHERE ta.idnomtipoarea = ai.idnomtipoarea) AS idtipotransferencia"
        )
            ->innerJoin('a.DatAreainventario ai');
        return $query->fetchArray();
    }

    public function cargarCodificador($params, $sql = false)
    {
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;
        
        $select = " select DISTINCT pp.cantidad as existencia, pp.precio as preciocosto, pp.idproducto,
        umm.abreviaturaunidadmedida as uemb, ni.denominacion, (case when ni.numeropieza is null or length(ni.numeropieza) = 0 then ni.codigo else ni.numeropieza end) as codigo,
        (select idmovimiento from mod_logistica.dat_movimiento where idproducto = pp.idproducto
        order by cronologia desc limit 1) as idmovimiento,pp.idestructura
        ";
        $from = " from mod_logistica.dat_producto pp
        left join mod_datosmaestros.nom_indicador ni on ni.idindicador = pp.idindicador
        left join mod_datosmaestros.nom_unidadmedida umm on umm.idunidadmedida = pp.idumedida";

        $where = " where pp.idestructuracomun = {$cEstructura} and pp.cronologia > 0
        and pp.idestructura = {$params['iddeposorigen']}";
        if ($params['excluir']) {
            $excluir = implode(',', $params['excluir']);
            $where .= " and pp.idproducto not in ($excluir)";
        }
        $where = $this->getFilter($params, 'ni', $where);
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll();

        if ($params['limit']) {

            $offset = " offset({$params['start']}) limit({$params['limit']})";

        }

        $orderBy = " ORDER BY idproducto ASC, denominacion ASC";
        if ($sql) {
            return array($select, $from, $where, $offset, $orderBy);
        } else {
            $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                $select . $from . $where . $orderBy . $offset
            )->fetchAll();

            return array($datos, count($total));
        }

    }

    public function cargarLoteAdd($params)
    {
        $iddoc = $this->getIddoc();
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;
        $select = " select l.idlote, l.idproducto,l.fechafabricacion, l.fechavencimiento, l.existencia as cantidad,
        l.numero as nrolote,
        (
            select estr.descripcion as ubicacion
            from mod_logistica.dat_producto ppp
            inner join mod_logistica.dat_lote ll on ll.idproducto = ppp.idproducto
            inner join mod_logistica.dat_movlote m on m.idlote = ll.idlote
            inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m.idmovimiento
            left join mod_logubicacion.dat_estructuraubicacion estr on estr.idestructuraubicacion = m.idubicacion
            where ppp.idestructuracomun = {$cEstructura} and mov.cronologia > 0
            order by mov.cronologia DESC limit 1
        ) as ubicacion
        ";
        $from = " from mod_logistica.dat_producto pp
        inner join mod_logistica.dat_lote l on l.idproducto = pp.idproducto";
        $where = " where pp.idestructuracomun = {$cEstructura} and l.idproducto = {$params['idproducto']}
            and l.cronologia > 0";
        $orderby = " order by l.fechavencimiento, l.existencia asc";
        if (count($params['excluir']) > 0) {
            $params['excluir'] = implode(',', $params['excluir']);
            $where .= " and l.idlote not in ({$params['excluir']})";
        }
        $where = $this->getFilter($params, 'l', $where);
		
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll();
        if ($params['limit']) {
            $orderby .= " offset({$params['start']}) limit({$params['limit']})";
        }

        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where. $orderby
        )->fetchAll();

        if (count($datos) > 0) {
            foreach ($datos as $index => $dat) {
                $sql = "  select dd.estado, til.idlote, dd.cronologia 
                from mod_logistica.dat_documento dd
                inner join mod_loginventario.dat_transfinternalote til on til.idtransfinterna = dd.iddocumento
                ";

                $whereaux = " where dd.iddoc = {$iddoc} and dd.estado = 1 and til.idlote = {$dat['idlote']} ";
                if (count($params['excluir']) > 0) {
                    $whereaux .= " and til.idlote not in ({$params['excluir']})";
                }
                // print_r($sql. $whereaux);die;
                $result = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                    $sql . $whereaux
                )->fetchAll();

                if (count($result) == 1) {
                    $datos[$index]['enuso'] = 1;
                } else {
                    $datos[$index]['enuso'] = 0;
                }
            }
        }
        return array($datos, count($total));
    }

    public function adicionarTransferanciaInterna($params)
    {//print_r($params);die;
        $documento = new DocumentoLogisticaModel();
        $data = $params['data'];
        $data['iddoc'] = $this->iddoc;
        $obj = new DatTransfinterna();
        $doc = $documento->adicionarDocumento($data);
        $doc->iddoc = $this->getIddoc();
        $doc->idoperacion = null;
        $doc->save();

        if ($data['iddocumento']) {
            $data['idtransfinterna'] = $data['iddocumento'];
            $obj->assignIdentifier($data['idtransfinterna']);
            $obj->synchronizeWithArray($data);
        } else {
            $data['idtransfinterna'] = $obj->idtransfinterna = $doc->iddocumento;
            $obj->synchronizeWithArray($data);
        }
        $obj->save();
        $params['iddocumento'] = $doc->iddocumento;
        
        if (count($params['productos']) > 0) {
            $this->adicionarProductosTransfInterna($params);
        }/*elseif($params['idprodtransfinterna']){            
            $this->adicionarProductosTransfInterna($params);
        }*/

        if (count($params['lote']) > 0) {
            $this->guardarLote($params);
        }
        return $doc->toArray();
    }

    public function adicionarProductosTransfInterna($params)
    { 
        if ($params['productos']) {
            $colection = new Doctrine_Collection("DatProdTransfInterna");

            foreach ($params['productos'] as $prod) {
                $prod['importe'] = round(($prod['precio'] * $prod['cantidad']),2);
                $obj = new DatProdTransfInterna();
                if ($prod['idprodtransfinterna']) {
                    $obj->assignIdentifier($prod['idprodtransfinterna']);
                }
                $prod['cantidad'] = ($prod['cantidad'])?$prod['cantidad']:0;
                $prod['idtransfinterna'] = $params['iddocumento'];
                $obj->synchronizeWithArray($prod);
                $colection[] = $obj;
                /*$existProd = Doctrine::getTable('DatProdTransfInterna')->findByDql(
                    'idproducto = ? and idtransfinterna = ?', 
                    array($prod['idproducto'],$params['iddocumento'])
                );
                if(count($existProd) == 0){
                    $prod['cantidad'] = ($prod['cantidad'])?$prod['cantidad']:0;
                    $prod['idtransfinterna'] = $params['iddocumento'];
                    $obj = new DatProdTransfInterna();
                    if ($prod['idprodtransfinterna']) {
                        $obj->assignIdentifier($prod['idprodtransfinterna']);
                    }
                    $obj->synchronizeWithArray($prod);
                    $colection[] = $obj;
                }*/
            }
            
            if (count($colection) > 0)
                $colection->save();
        }/*elseif($params['idprodtransfinterna']){            
            $obj = new DatProdTransfInterna();
            $obj->assignIdentifier($params['idprodtransfinterna']);
            $obj->synchronizeWithArray($params);
            print_r($obj->toArray());die;
            $obj->save();
        }*/
    }

    public function cargarDocumentos($params)
    {
        $sql = " SELECT d.*, tm.*, su.nombreusuario as creadopor, sua.idusuario as aprobadopor
         ,op.denominacion as areaorigen,opp.denominacion as areadestino,tm.idoperacionorigen,tm.idoperaciondestino,
         (
         select count(p.idtransfinterna) FROM mod_loginventario.dat_prodtransfinterna p
         where p.idtransfinterna = d.iddocumento
         ) as cantproductos";
        $from = " FROM mod_loginventario.dat_transfinterna tm
                 INNER JOIN mod_logistica.dat_documento d ON tm.idtransfinterna = d.iddocumento
                 LEFT JOIN mod_estructuracomp.v_dametodasestructuras op on op.idestructura = tm.iddeposorigen
                 LEFT JOIN mod_estructuracomp.v_dametodasestructuras opp on opp.idestructura = tm.iddeposdestino
                 LEFT JOIN mod_seguridad.seg_usuario su ON d.idusuario = su.idusuario
                 LEFT JOIN mod_seguridad.seg_usuario sua ON d.aprobadopor = sua.idusuario
                 ";
        $where = " WHERE (d.iddoc = {$this->getIddoc()} )and d.estado in (1, 2, 3)";

        $where = $this->getFilterDoc($where, $params);
        $orderBy = "ORDER BY d.iddocumento DESC  ";

        $conn = Zend_Registry::get('conexion');
//aqui
        $limit = " limit " . $params['limit'] . " offset " . $params['start'];

        $cantidad = $conn->fetchAll($sql . $from . $where . $orderBy);
        $result = $conn->fetchAll($sql . $from . $where . $orderBy . $limit);
        return array($result, count($cantidad));

    }

    public function getFilterDoc($where, $params)
    {
        if ($params['estado']) {
            $where .= " and d.estado = {$params['estado']}";
        }
        if ($params['idtipotransfinterna']) {
            $where .= " and tm.idtipotransfinterna = {$params['idtipotransfinterna']}";
        }
        if ($params['iddeposorigen']) {
            $where .= " and tm.iddeposorigen = {$params['iddeposorigen']}";
        }
        if ($params['iddeposdestino']) {
            $where .= " and tm.iddeposdestino = {$params['iddeposdestino']}";
        }
        if ($params['aprobadopor']) {
            $where .= " and d.aprobadopor = {$params['aprobadopor']}";
        }
        if ($params['creadopor']) {
            $where .= " and d.idusuario = {$params['creadopor']}";
        }
        if ($params['desde']) {
            $where .= " and d.fechacontable >= '{$params['desde']}'";
        }
        if ($params['hasta']) {
            $where .= " and d.fechacontable <= '{$params['hasta']}'";
        }
        if ($params['criterio']) {
            $where .= " and d.nrodoc ={$params['criterio']} or d.numeroref ={$params['criterio']}";
        }
       
        return $where;
    }

    public function cargarProductosTransferanciaInterna($params)
    {
        if ($params['idtransfinterna']) {

           $cod[0] = "SELECT DISTINCT pp.idproducto,coalesce(ni.numeropieza,ni.codigo)as codigo,ni.denominacion,
            umm.abreviaturaunidadmedida as um,nih.tienelote as tienelote,
            pr.cantidad,pr.precio,pr.importe,pr.idprodtransfinterna,pr.idtransfinterna as iddocumento,nat.denominacion as naturaleza,
            pp.cantidad as existencia, 0 as disponible, 
            (SELECT (count(up.idubicacion) = 1) FROM mod_logubicacion.dat_ubicacionproducto up WHERE up.idproducto = pr.idproducto AND up.cantidad > 0) AS ubicacionunica
            ";

            $cod[1] .= "from mod_loginventario.dat_prodtransfinterna pr
            inner join mod_logistica.dat_documento d on d.iddocumento = pr.idtransfinterna
            left join mod_logistica.dat_producto pp on pr.idproducto = pp.idproducto
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = pp.idindicador
            left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
            left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = pp.idindicador
            left join mod_logistica.dat_lote l on l.idproducto = pr.idproducto
            left join mod_datosmaestros.nom_unidadmedida umm on umm.idunidadmedida = pp.idumedida";

            $cod[2] = " where d.iddocumento = {$params['idtransfinterna']}";

            //print_r( $cod[0] . $cod[1] . $cod[2] . $cod[4] . $cod[3]);die;
            $result = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                $cod[0] . $cod[1] . $cod[2] . $cod[4] . $cod[3]
            )->fetchAll();

            $r = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                $cod[0] . $cod[1] . $cod[2] . $cod[4]
            )->fetchAll();

            return array('datos' => $result, 'cantidad' => count($r));
        }
        return array('datos' => array(), 'cantidad' => 0);
    }

    public function getFilter($params, $alias, $where)
    {
       
        if ($params['codigo']) {
            $where .= " and $alias.codigo ilike '%{$params['codigo']}%'";
        }
        if ($params['denominacion']) {
            $where .= " and $alias.descripcion ilike '%{$params['denominacion']}%'";
        }

        if ($params['nrolote']) {
            $where .= " and $alias.numero ilike '%{$params['nrolote']}%'";
        }

        if ($params['criterio']) {
            
            $where .= " and $alias.numeropieza ilike '%{$params['criterio']}%' or $alias.denominacion ilike '%{$params['criterio']}%'";
        }


        return $where;
    }

    public function guardarLote($params)
    {
        if ($params['lote']) {
            $params['record'] = $params['lote'];
            unset($params['lote']);
        }
        if ($params['record']) {
            $colection = new Doctrine_Collection("DatTransfinternaLote");
            foreach ($params['record'] as $prod) {

                $prod['idtransfinterna'] = $params['iddocumento'];
                $prod['idprodtransfinterna'] = ($params['idprodtransfinterna']) ? $params['idprodtransfinterna'] : $prod['idprodtransfinterna'];
                $obj = new DatTransfinternaLote();

                if ($prod['idtransfinternalote']) {
                    $obj->assignIdentifier($prod['idtransfinternalote']);
                }

                $obj->synchronizeWithArray($prod);
                $colection[] = $obj;
            }
            if (count($colection) > 0)
                $colection->save();
        }
        $this->actualizarProducto($params);
    }

    public function cargarLote($params)
    {
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;
        $select = " select l.idlote, l.idproducto,l.fechafabricacion, l.fechavencimiento, l.existencia as cantidad,
        l.numero as nrolote, tl.idtransfinternalote, tl.cantpasar,
        (
            select estr.descripcion as ubicacion
            from mod_loginventario.dat_transfinternalote  tll
            --inner join mod_logistica.dat_lote  ll on ll.idlote = tll.idlote
            inner join mod_logistica.dat_movlote m on m.idlote = tll.idlote
            inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m.idmovimiento
            left join mod_logubicacion.dat_estructuraubicacion estr on estr.idestructuraubicacion = m.idubicacion
            where tll.idtransfinterna = {$params['iddocumento']} and mov.cronologia > 0
            order by mov.cronologia DESC limit 1
        ) as ubicacion


        ";
        $from = " from mod_logistica.dat_producto pp
        inner join mod_logistica.dat_lote l on l.idproducto = pp.idproducto
        inner join mod_loginventario.dat_transfinternalote  tl on tl.idlote =  l.idlote
        ";

        $where = " where pp.idestructuracomun = {$cEstructura} and tl.idtransfinterna = {$params['iddocumento']}";

        if ($params['idproducto']) {
            $where .= " and tl.idproducto = {$params['idproducto']}";
        }
        $where = $this->getFilter($params, 'l', $where);

        if (count($params['excluir']) > 0) {
            $params['excluir'] = implode(',', $params['excluir']);
            $where .= " and l.idlote not in ({$params['excluir']})";
        }
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll();
        if ($params['limit']) {
            $where .= " offset({$params['start']}) limit({$params['limit']})";
        }
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select . $from . $where
        )->fetchAll();

        return array($datos, count($total));
    }

    public function eliminarLote($params)
    {
        foreach ($params['arrLoteDel'] as $dat) {
            Doctrine_Query::create()->delete('DatTransfinternaLote')
                ->where('idtransfinternalote = ?', $dat)->execute();
        }
        $this->actualizarProducto($params);
    }

    public function eliminarProductosTransfInterna($params)
    {
        foreach ($params['arrelimprodlogica'] as $datos) {
            Doctrine_Query::create()->delete('DatProdTransfInterna')
                ->where('idprodtransfinterna = ?', $datos['idprodtransfinterna'])
                ->execute();
        }
    }

    private function actualizarProducto($params){          
        $updateProd = "UPDATE mod_loginventario.dat_prodtransfinterna
        SET cantidad = (SELECT coalesce(sum(cantpasar),0) 
        FROM mod_loginventario.dat_transfinternalote 
        where idprodtransfinterna = {$params['idprodtransfinterna']})
        where idprodtransfinterna = {$params['idprodtransfinterna']}";
        LogisticaDoctrineHelper::__init()->getConnection()->execute($updateProd);
    }

    public function getValidarConfirmar($params)
    {
        $select = "select count(sq.idproducto) as productos,(select count(d.idproducto) from mod_loginventario.dat_prodtransfinterna d
                WHERE d.idtransfinterna = {$params['iddocumento']} and d.cantidad = 0) as cantcero
                from 
                (select d.idproducto,d.cantidad from mod_loginventario.dat_prodtransfinterna d
                WHERE d.idtransfinterna = {$params['iddocumento']} 
                )as sq";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            $select
        )->fetchObject();
        $cod = ($datos->cantcero > 0)?2:(($datos->productos == 0)?1:0);
        return array("msg" => $cod);
        /*if (count($datos) == 0) {
            return array("msg" => 1); // para cuando no hay producto
        } else {

            $valorcero = $this->getForValidarConfirmar($params, $datos[0]);

            if ($valorcero == 'true') {
                return array("msg" => 2); //para cuando hay productos con cantidad cero
            } else {
                // para validar los Lotes, la cantidad no puede estar en cero
                $selectLote = " select d.cantpasar as cantidad
                from mod_loginventario.dat_transfinternalote d                
                WHERE d.idtransfinterna = {$params['iddocumento']}";
                $datoslote = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                    $selectLote
                )->fetchAll();
                if (count($datoslote) == 0) {
                    return array("msg" => 1); // para cuando no hay lote
                } else {
                    $valorcero = $this->getForValidarConfirmar($params, $datoslote);
                    if ($valorcero == 'true') {
                        return array("msg" => 2); //para cuando hay productos con cantidad cero
                    } else {
                        return array("msg" => 0);
                    }
                }
            }
        }*/
    }

    public function getForValidarConfirmar($params, $datos)
    {
        $valorncero = 'false';
        foreach ($datos as $dat) {
            if ($dat['cantidad'] == 0) {
                $valorncero = 'true';
                break;
            }
        }
        return $valorncero;
    }

    public function cargarOperacionesOrigen()
    {
        $idestructuracomun = $this->global->Estructura->idestructura;
        $iddocSalida = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
            'transferenciaLog', $idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        $result = $this->configuracionHelper->obtenerOperaciones($idestructuracomun,
                    LogisticaGlobal::SUBSISTEMA_INV, $iddocSalida->iddoc
                );
                
        return array('total'=>count($result), 'datos'=>$result);
    }

    public function cargarOperacionesDestino()
    {
        $sql = "SELECT valor FROM 
            mod_logistica.nom_variableglobal WHERE nombre = 'OPRE_REC_TRANS_INT'";
        $operTransInt = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN)[0];
        $arrOper = explode(',',str_replace("'","", $operTransInt));
        $idestructuracomun = $this->global->Estructura->idestructura;
        $iddocRecepcion = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
            'recepcionLog', $idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        $result = $this->configuracionHelper->obtenerOperaciones($idestructuracomun,
                    LogisticaGlobal::SUBSISTEMA_INV, $iddocRecepcion->iddoc
                );
        $datos = array();
        foreach($result as $valor){
            if(in_array($valor['idnomoperaciones'],$arrOper)){
                $datos[] = $valor;
            }
        }
        return array('total'=>count($datos), 'datos'=>$datos);
    }

    public function ubicacionConDatosCorrectos($iddocumento)
    {
        $datosMovimiento = $this->cargarProductosTransferanciaInterna(array('idtransfinterna' => $iddocumento));
        foreach ($datosMovimiento['datos'] as $dmov) {
            $movUbic = $this->getMovDatosUbicacion($dmov['idprodtransfinterna']);
//                $prodDisponible = $objMovUbic->productoDisponible($dmov['idproducto'], $dmov['idmovimiento']);
            $unico = $this->getUbicacionUnica($dmov['idproducto']);
            if (!$unico && ($movUbic['cantidad'] == 0 ||
                    $dmov['cantidad'] > $movUbic['cantidad'])) {
                throw new ZendExt_Exception('LOG_LB_DOC_015');
            }

            if ($dmov['cantidad'] < $movUbic['cantidad']) {
                return false;
            }
        }
        return true;
    }

    public function getMovDatosUbicacion($idmovimiento)
    {
        $query = Doctrine_Query::create()
            ->select('coalesce(sum(coalesce(mu.cantidad, 0)), 0) AS cantidad')
            ->from('DatProdtranfintubicacion mu')
            ->where('mu.idprodtransfinterna = ?', $idmovimiento);
        return $query->fetchArray()[0];
    }

    public function getUbicacionUnica($idproducto)
    {
        $query = Doctrine_Query::create()
            ->select(
                'up.idubicacionproducto, up.idubicacion, up.idproducto, up.cantidad, '
                . '(up.cantidad - coalesce((SELECT sum(uc.cantidad) FROM DatUbicacionComprometida uc '
                . 'WHERE uc.idubicacion = up.idubicacion AND uc.idproducto = up.idproducto), 0)) AS disponible'
            )
            ->from('DatUbicacionproducto up')
            ->where('up.idproducto = ? AND up.cantidad > 0', $idproducto);
        if ($query->count() == 1) {
            return $query->fetchOne()->toArray();
        }
        return false;
    }

}
