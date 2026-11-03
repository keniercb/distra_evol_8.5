<?php
/**
 * Created by PhpStorm.
 * User: kcumba
 * Date: 4/06/18
 * Time: 15:03
 */

class ReposicionModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct(false);
    }

    public function getConfFarmacia()
    {
        $select = "select *  from mod_logfarmacia.conf_generalfm where idestructura = {$this->global->Estructura->idestructura}"; //print_r($select);die;
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarProductosReposicion($params)
    {
        $confGeneral = $this->getConfFarmacia();
        $confGeneral[0]['minarea'] = ($confGeneral[0]['minarea']) ? $confGeneral[0]['minarea'] : 0;
        $arrWhere = array();
        $arrWhere[] = "cf.idalmacen = dp.idestructura";
        $arrWhere[] = "dp.cronologia > 0";
        $arrWhere[] = "dp.cantidad > 0";
        $arrWhere[] = "dp.idestructuracomun = {$this->global->Estructura->idestructura}";
        if ($params['criterio']) {
            $criterio = $params['criterio'];
            $arrWhere[] = "(ni.numeropieza ILIKE '%{$criterio}%' OR ni.denominacion ILIKE '%{$criterio}%')";
        }

        $where = implode(' AND ', $arrWhere);
        $sqlData = "select distinct coalesce(ni.numeropieza,ni.codigo) as codigo,ni.descripcion,ni.denominacion, 
        COALESCE(dp.cantidad,0) as cantalmacen, drp.cantidadrep,ni.idindicador,
        drp.idreposicion, cf.idareaventa as iddeposdestino, cf.idalmacen as iddeposorigen,
        COALESCE(dpa.cantidad,0) as cantidad,COALESCE(dp.maximo*ext.fondofijo/100,0) as fondofijo,
        COALESCE(( COALESCE(dpa.maximo*ext.fondofijo/100,0)) * ext.minarea/100,0) as minimoventa,
        dp.idproducto as idproducto,dpa.idproducto as idproductodestino,cf.idestructura
        from mod_logistica.dat_producto dp
        inner join mod_logfarmacia.conf_generalfm cf on cf.idestructura = dp.idestructuracomun
        inner join mod_loginventario.conf_inventarioext ext on ext.idestructuracomun = dp.idestructuracomun
        inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
        left join mod_loginventario.dat_reposicion drp on drp.idestructura = cf.idestructura
            and drp.idindicador = dp.idindicador
        left join mod_logistica.dat_producto dpa on dpa.idindicador = dp.idindicador 
            and dpa.idestructura = cf.idareaventa
        where $where order by ni.descripcion limit {$params['limit']} offset {$params['start']}";

        $sqlCount = "select count(dp.idproducto) as cantidad from mod_logistica.dat_producto dp
            inner join mod_logfarmacia.conf_generalfm cf on cf.idestructura = dp.idestructuracomun
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador

            where  $where";
        //print_r($sqlData);die;
        return array(
            'datos' => $this->doctrineHelper->getConnection()->fetchAll($sqlData),
            'cantidad' => $this->doctrineHelper->getConnection()->fetchAll($sqlCount)[0]['cantidad'],
        );

    }
    /*
    ( SELECT dpp.idproducto  from mod_logistica.dat_producto dpp WHERE dpp.idcodificador = dc.idcodificador
    AND idestructura = cf.idalmacen )
     */

    public function guardarReposicion($paramas)
    {
        if ($paramas['valoresareponer']) {
            $datos = Zend_Json::decode($paramas['valoresareponer']);
            $coleccion = new Doctrine_Collection("DatReposicion");
            foreach ($datos as $dat) {
                $repo = new DatReposicion();
                if ($dat['idreposicion']) {
                    $repo->assignIdentifier($dat['idreposicion']);
                }
                $repo->synchronizeWithArray($dat);
                $coleccion->add($repo);
            }
            $coleccion->save();
        }
    }

    public function reponer($parametros)
    {

        $arrayData = array('alias' => 'transferenciainternaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        $transf = new TransferenciainternaModel($arrayData);
        $param['productos'] = Zend_Json::decode($parametros['productos']);
        //Buscando el tipo de transferencia interna
        $datosReposicion = $this->doctrineHelper->getConnection()->fetchAll("select distinct drp.idindicador,
            drp.cantidadrep as cantidad,cf.idareaventa as iddeposdestino, cf.idalmacen as iddeposorigen,
            p.idproducto, p.precio, pp.idproducto as idproductodestino
            from mod_loginventario.dat_reposicion drp 
            inner join mod_logfarmacia.conf_generalfm cf on drp.idestructura = cf.idestructura
            inner join mod_logistica.dat_producto p on p.idestructura = cf.idalmacen and p.idindicador = drp.idindicador
            left join mod_logistica.dat_producto pp on pp.idestructura = cf.idareaventa and pp.idindicador = drp.idindicador
            where drp.idestructura = {$this->global->Estructura->idestructura} and drp.cantidadrep > 0");
        
        if (count($datosReposicion)) {
            $iddeposorigen = $datosReposicion[0]['iddeposorigen'];
            $iddeposdestino = $datosReposicion[0]['iddeposdestino'];
            $param['productos'] = $datosReposicion;
            $param['data'] = array(
                'iddeposorigen' => $iddeposorigen, 'iddeposdestino' => $iddeposdestino
            );
            $doc = $transf->adicionarTransferanciaInterna($param);
            
            //Gestionar los lotes de donde se van a sacar los productos
            $lotesSalvar = array();
            $idEstructura = $this->global->Estructura->idestructura;
            /*foreach ($param['productos'] as $index => $prod) {

                //De cada producto buscar los lotes que suplan la cantidad que se necesita.
                $sqlLotes = " select l.idlote, l.idproducto,l.fechavencimiento, l.existencia as cantidad
                        from mod_logistica.dat_producto pp
                        inner join mod_logistica.dat_lote l on l.idproducto = pp.idproducto
                        where pp.idestructuracomun = {$idEstructura} and l.idproducto = {$prod['idproducto']}
                        ORDER BY l.fechavencimiento DESC ";
                $lotes = $this->doctrineHelper->getConnection()->fetchAll($sqlLotes);

                if (count($lotes)) {
                    for ($i = 0; $i < count($lotes) && $prod['cantidadrep'] > 0; $i++) {
                        $sqlProdTransf = " SELECT pr.idprodtransfinterna
                            FROM mod_logfarmacia.dat_prodtransfinterna pr  WHERE pr.idproducto = {$prod['idproducto']}
                            AND pr.idtransfinterna = {$doc['iddocumento']}";
                        $prodDoc = $this->doctrineHelper->getConnection()->fetchAll($sqlProdTransf);

                        $lot = array(
                            'idtransfinterna' => $doc['iddocumento'],
                            'idprodtransfinterna' => $prodDoc[0]['idprodtransfinterna'],
                            'idproducto' => $prod['idproducto'], 'idlote' => $lotes[$i]['idlote'],
                        );
                        if ($prod['cantidadrep'] > $lotes[$i]['cantidad']) {
                            $lot['cantpasar'] = $lotes[$i]['cantidad'];
                            $prod['cantidadrep'] = $prod['cantidadrep'] - $lotes[$i]['cantidad'];
                            $lotesSalvar[] = $lot;
                        } else {
                            $lot['cantpasar'] = $prod['cantidadrep'];
                            $prod['cantidadrep'] = 0;
                            $lotesSalvar[] = $lot;
                        }
                        $param['productos'][$index] = $prod;
                    }
                    $param['valoresareponer'] = Zend_Json::encode($param['productos']);
                    $this->guardarReposicion($param);
                } else {
                    //Controlar los que no se encontraron lotes para la transferencia.
                }
            }*/
            /*$param['iddocumento'] = $doc['iddocumento'];
            $param['lote'] = $lotesSalvar;
            $transf->guardarLote($param);
            $transf->confirmarDocumento($doc['iddocumento']);
            $transf->aprobarDocumento($doc['iddocumento']);
            $documentoT = Doctrine::getTable('DatDocumento')
                ->findBy('iddocumento', $doc['iddocumento'], Doctrine_Core::HYDRATE_ARRAY);*/
            return array('nrodoc' => $documentoT[0]['nrodoc'], 'fechacontable' => $documentoT[0]['fechacontable']);
        } else {
            return array('msg' => "Debe configurar el tipo de transferencia para dicha operaci\xf3n");
        }

    }

}
