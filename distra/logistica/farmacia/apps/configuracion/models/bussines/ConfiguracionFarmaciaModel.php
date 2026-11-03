<?php

/**
 * @class      ConfiguracionFarmaciaModel
 * @package    Farmacia
 * @subpackage Configuracion
 * @author     Daniel Arias Espinosa
 * @copyright  XETID
 * @version    1.0
 */
class ConfiguracionFarmaciaModel extends ZendExt_Model
{

    private $configuracioGeneral, $objectHelper;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->configuracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->objectHelper = LogisticaObjectHelper::__init();
    }

    /**
     * @param array $params
     */
    public function cargarAnnos($params = array())
    {
        $dql = Doctrine_Query::create();
        $dql->select("ca.idanno, ca.denominacion, ca.estado, ca.activo, ca.fechainicio, ca.fechafin")
            ->from("ConfAnno ca")->orderBy("ca.idanno DESC");
        if(!$params['idestructura']) {
            $params['idestructura'] = $this->global->Estructura->idestructura;
        }
        $dql->where("ca.identidad = ?", array($params['idestructura']));
        if($params['activo']) {
            $dql->where("ca.activo = ?", array($params['activo']));
        }
        if($params['start'])
        {
            $dql->offset($params['start']);
        }
        if($params['limit'])
        {
            $dql->limit($params['limit']);
        }
        return array('cantidad'=>$dql->count(), 'datos'=> $dql->fetchArray());
    }
    /**
     * @param array $params
     */
    public function adicionarAnnos($params = array())
    {
        /* $this->objectHelper->unsetNullValues($params);*/
        $params['identidad'] = $this->global->Estructura->idestructura;
        $anno = new ConfAnno();
        //Verificando que no se solapen las fechas.
        $conn = Zend_Registry::get('conexion');
        $select = " SELECT ca.idanno, ca.denominacion FROM mod_logfarmacia.conf_anno ca  ";
        $where = " WHERE  identidad = {$params['identidad']} AND ( 1=0 ";

        if ($params['idanno']) {
            $anno->assignIdentifier($params['idanno']);

            $objAnno = Doctrine::getTable('ConfAnno')->find($params['idanno']);
            if(!$params['fechainicio']) {
                $params['fechainicio'] = $objAnno->fechainicio;
            }
            if(!$params['fechafin']) {
                $params['fechafin'] = $objAnno->fechafin;
            }

        }

        //Condiciones para validar las fechas antes de adicionar
        if($params['fechainicio']){
            $where .= " OR  ( ca.fechainicio <= '{$params['fechainicio']}' AND  ca.fechafin >= '{$params['fechainicio']}') ";
        }
        if($params['fechafin']){
            $where .= " OR  ca.fechainicio <= '{$params['fechafin']}' AND  ca.fechafin >= '{$params['fechafin']}' ";
        }
        if( $params['fechainicio'] && $params['fechafin'] ) {
            $where .= " OR ( ca.fechainicio >= '{$params['fechainicio']}' AND  ca.fechainicio <= '{$params['fechafin']}'
                    OR ca.fechafin >= '{$params['fechainicio']}' AND ca.fechafin <= '{$params['fechafin']}' )";
        }
        $where .= " ) ";
        $limit = " limit(1) ";
        $colapso = $conn->execute($select. $where. $limit)->fetchAll();
        if(count($colapso) == 0) {
            $anno->synchronizeWithArray($params);
            $anno->save();
            if ($params['duplicar']) {
                $params['idanno'] = $params['duplicar'];
                $params['idannonew'] = $anno->idanno;
                $this->duplicarAnno($params);
            }
        }
        else throw new Exception("El rango de fecha es incorrecto. Conflicto con el rango de fecha del {$colapso[0]['denominacion']}");

    }
    public function modificarAnnos($params )
    {
        $conn = Zend_Registry::get('conexion');
        foreach ($params as $p)
        {
            if ($p['fechainicio'])
            {
                $p['fechainicio'] = substr($p['fechainicio'], 0, 10);
            }
            if ($p['fechafin'])
            {
                $p['fechafin'] = substr($p['fechafin'], 0, 10);
            }

            $update = "
            UPDATE
            mod_logfarmacia.conf_anno 
             SET 
             denominacion= '{$p['denominacion']}',
              fechainicio='{$p['fechainicio']}',
               fechafin='{$p['fechafin']}'
            WHERE 
            idanno ='{$p['idanno']}'";

            $conn->execute($update);
        }
    }
    public function eliminarAnno($params = array())
    {
        $dql = Doctrine_Query::create();
        $dql->delete("ConfAnno ca")->where("idanno = ? ", $params)->execute();
    }
    public function duplicarAnno($params = array())
    {
        $cBasicos = $this->cargarCuadroBasico(array('idanno'=>$params['idanno']));

        $arrColectionCB = new Doctrine_Collection("ConfCuadroBasico");
        foreach($cBasicos['datos'] as $producto ) {
            $objCB = new ConfCuadroBasico();
            $objCB->idcuadrobasico = null;
            $objCB->idanno = $params['idannonew'];
            $objCB->idindicador = $producto['idindicador'];
            $objCB->idtipocuadrobasico = $producto['idtipocuadrobasico'];
            $objCB->idgrupofarmacologico = $producto['idgrupofarmacologico'];
            $objCB->idclasificacionven = $producto['idclasificacionven'];
            $objCB->idproveedor = $producto['idproveedor'];
            $objCB->idviaadquicicion = $producto['idviaadquicicion'];
            $objCB->prioridad = $producto['prioridad'];
            $objCB->formulamagistral = $producto['formulamagistral'];
            $objCB->tienecertificado = $producto['tienecertificado'];
            $objCB->idtipounidadsalud = $producto['idtipounidadsalud'];
            $objCB->idtipodispensacion = $producto['idtipodispensacion'];
            $objCB->precioventa = $producto['precioventa'];
            $objCB->formulamagistral = $producto['formulamagistral'];
            $objCB->idestructura = $this->global->Estructura->idestructura;
            $usd = $this->cargarUnidadSaludDispensacion(array('idcuadrobasico' => $producto['idcuadrobasico']));
            foreach($usd['datos'] as $u){
                unset($u['idcuadrobasico']);
                unset($u['idunidadsaluddispensacion']);
                unset($u[0]);
                $unidad = new DatUnidadSaludDispensacion();
                $unidad->synchronizeWithArray($u);
                $objCB->DatUnidadSaludDispensacion->add($unidad);
            }
            $arrColectionCB->add($objCB);
        }
        $arrColectionCB->save();

    }
    public function aprobarAnno($params = array())
    {
        $dql = Doctrine_Query::create();
        $dql->update("ConfAnno ca")
            ->set(array('estado'=>1))
            ->where("idanno = ? ", $params['idanno'])
            ->execute();

    }
    public function cerrarAnno($params = array())
    {
        $dql = Doctrine_Query::create();
        $dql->update("ConfAnno")->where("idanno = ? ", $params['idanno'])
            ->set(array('estado'=>2, 'activo'=>0))
            ->execute();
    }
    public function activarAnno($params = array())
    {
        $alguienActivo = $this->cargarAnnos(array('activo'=>1));
        if($alguienActivo['cantidad']>0) {
            throw new Exception('Existe un año activo, debe cerrarlo antes de activar otro.');
        }
        $dql = Doctrine_Query::create();
        $dql->update("ConfAnno")->where("idanno = ? ", $params['idanno'])
            ->set(array('activo'=>1))
            ->execute();
    }

    public function adicionarCuadroBasico($params)
    {
        $data = Zend_Json::decode($params['data']);
        $this->objectHelper->unsetNullValues($data);
        $objCB = new ConfCuadroBasico();
        if(!$data['idestructura']) {
            $data['idestructura'] = $this->global->Estructura->idestructura;
        }
        if ($params['idpadre']) { //Si es una estructura hija entnces tiene padre.
            $params['idpadre'] = Zend_Json::decode($params['idpadre']);
            $params['idcuadrobasico'] = (is_array($params['idpadre'])) ? implode(",", $params['idpadre'])
                :$params['idpadre'];
            $params['sinestructura'] = true;
            $cuadroBasico = $this->cargarCuadroBasico($params);
            $arrColectionCB = new Doctrine_Collection("ConfCuadroBasico");
            foreach($cuadroBasico['datos'] as $producto ) {
                $objCB = new ConfCuadroBasico();
                //$objCB->idcuadrobasico = null;
                $objCB->idanno = $producto['idanno'];
                $objCB->idindicador = $producto['idindicador'];
                $objCB->idtipocuadrobasico = $producto['idtipocuadrobasico'];
                $objCB->idgrupofarmacologico = $producto['idgrupofarmacologico'];
                $objCB->idclasificacionven = $producto['idclasificacionven'];
                $objCB->idproveedor = $producto['idproveedor'];
                $objCB->idviaadquicicion = $producto['idviaadquicicion'];
                $objCB->prioridad = $producto['prioridad'];
                $objCB->formulamagistral = $producto['formulamagistral'];
                $objCB->tienecertificado = $producto['tienecertificado'];
                $objCB->idtipounidadsalud = $producto['idtipounidadsalud'];
                $objCB->idtipodispensacion = $producto['idtipodispensacion'];
                $objCB->precioventa = $producto['precioventa'];
                $objCB->idestructura = $this->global->Estructura->idestructura;
                $objCB->idpadre = $producto['idcuadrobasico'];
                /*$usd = $this->cargarUnidadSaludDispensacion(array('idcuadrobasico' => $params['idpadre']));
                foreach($usd['datos'] as $u){
                    unset($u['idcuadrobasico']);
                    unset($u['idunidadsaluddispensacion']);
                    unset($u[0]);
                    $unidad = new DatUnidadSaludDispensacion();
                    $unidad->synchronizeWithArray($u);
                    $objCB->DatUnidadSaludDispensacion->add($unidad);
                }*/
                $arrColectionCB->add($objCB);
            }
            $arrColectionCB->save();
        }
        else {
            if ($data['idcuadrobasico']) {
                $objCB->assignIdentifier($data['idcuadrobasico']);
            }
            $objCB->synchronizeWithArray($data);
            $objCB->save();
            $params['idcuadrobasico'] = $objCB->idcuadrobasico;
            unset($params['data']);
            $this->adicionarUnidadSaludDispensacion($params);
            return $params['idcuadrobasico'];
        }
    }
    public function adicionarUnidadSaludDispensacion($params)
    {
        if ($params['eliminarusd']) {
            //eliminar
            $ids = Zend_Json::decode($params['eliminarusd']);
            $dql = Doctrine_Query::create();
            $dql->delete("DatUnidadSaludDispensacion dusd")
                ->whereIn("dusd.idunidadsaluddispensacion ", $ids)->execute();
        }
        if($params['adicionarusd']) {
            //adicionar
            $elementos = (!is_array($params['adicionarusd']))?
                Zend_Json::decode($params['adicionarusd']): $params['adicionarusd'];
            $arrColection = new Doctrine_Collection("DatUnidadSaludDispensacion");
            foreach($elementos as $elem) {
                $elem['idcuadrobasico'] = $params['idcuadrobasico'];
                $obj = new  DatUnidadSaludDispensacion();
                if(!$params['duplicar']) {
                    if ($elem['idunidadsaluddispensacion']) {
                        $obj->assignIdentifier($elem['idunidadsaluddispensacion']);
                    }
                }
                else {
                    $elem['idunidadsaluddispensacion'] = null;
                }
                $obj->synchronizeWithArray($elem);
                $arrColection[] = $obj;
            }
            $arrColection->save();
        }
    }
    
    public function eliminarCuadroBasico($params = array())
    {
        $dql = Doctrine_Query::create();
        $dql->delete("ConfCuadroBasico cb")->whereIn("idcuadrobasico ", $params)->execute();
    }

    public function cargarCuadroBasico($params = array())
    {
        $conn = Zend_Registry::get('conexion');
        $subForma = "(select array_to_string(array (select gf.denominacion  from mod_logfarmacia.nom_grupofm gf
           where gf.idgrupofm in(select  cast(unnest(string_to_array(subcb.idgrupofarmacologico, ',')) as numeric)
           from mod_logfarmacia.conf_cuadrobasico subcb
           where subcb.idcuadrobasico = cb.idcuadrobasico)), ', ')
		) as denomgrupofarmacologico ";
        
        $select = " SELECT cb.idcuadrobasico, cb.idindicador as idindicador, cb.idtipocuadrobasico, cb.idgrupofarmacologico,
            cb.idclasificacionven, cb.idproveedor, cb.idviaadquicicion, cb.prioridad, cb.formulamagistral,
            cb.tienecertificado, cb.idanno, cb.precioventa, ni.denominacion, 
            (case when ni.numeropieza is null or length(ni.numeropieza) = 0 then ni.codigo else ni.numeropieza end) as codigo,
            ncp.nombre as denomproveedor, cb.modocobro, $subForma";
        $from = " FROM mod_logfarmacia.conf_cuadrobasico cb
            INNER JOIN mod_logfarmacia.conf_anno ca ON cb.idanno = ca.idanno
            --LEFT JOIN mod_logistica.dat_producto dp ON dp.idproducto = cb.idproducto
            LEFT JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = cb.idindicador
            LEFT JOIN mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = idproveedor";
        $where = " WHERE 0 = 0 ";
        $limit = "";
        if ($params['idanno']) {
            $where .= " AND cb.idanno = {$params['idanno']}";
        }
        if($params['activo']) {
            $where.=" AND ca.activo = 1 ";
        }
        if ($params['estructurahija']) {
            $from .= " INNER JOIN mod_logfarmacia.dat_unidadsaluddispensacion usd ON cb.idcuadrobasico = usd.idcuadrobasico";
            $select .= ", usd.idtipodispensacion, usd.idtipounidadsalud ";
            
            /*$where .=" AND usd.idtipounidadsalud = (select tea.idtipounidadsalud from mod_estructuracomp.dat_estructura st 
                    inner join mod_logfarmacia.conf_tipoentidadasociada tea ON st.idorgano = tea.idtipoentidad
                    where st.idestructura = {$this->global->Estructura->idestructura}) ";*/
        }
        if ($params['limit']) {
            $limit = " order by ni.denominacion ASC offset({$params['start']}) limit({$params['limit']}) ";
        }
        $where = $this->filtrosCB($params, $where);
        if ($params['damesql']) {
            return array('select'=>$select, 'from'=>$from, 'where'=>$where, 'limit'=>$limit);
        }
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($select. $from. $where)
                                        ->fetchAll(PDO::FETCH_ASSOC);
        $datos = $conn->execute($select. $from. $where. $limit)->fetchAll();
        return array('datos' =>$datos, 'cantidad'=>count($total));
    }

    public function filtrosCB($params, $where)
    {   
       // print_r($params['criterio']);die;

        if(!$params['sinestructura'] && !$params['estructurahija']) {
            if (!$params['idestructura']) {
                $params['idestructura'] = $this->global->Estructura->idestructura;
            }
            $where .= " AND cb.idestructura = {$params['idestructura']} ";
        }
        if ($params['idcuadrobasico']) {
            if(is_array($params['idcuadrobasico'])) {
                $params['idcuadrobasico'] = implode(",", $params['idcuadrobasico']);
            }
            $where.=" AND cb.idcuadrobasico in ( {$params['idcuadrobasico']} )";
        }
        if ($params['excluiridcuadrobasico']) {
            if(is_array($params['excluiridcuadrobasico'])) {
                $params['excluiridcuadrobasico'] = implode(",", $params['excluiridcuadrobasico']);
            }
            $where.=" AND cb.idcuadrobasico in ( {$params['excluiridcuadrobasico']} )";
        }
        if ($params['criterio']) {
            $where.=" AND
            (ni.codigo ilike '%{$params['criterio']}%' OR ni.descripcion ilike '%{$params['criterio']}%' OR ni.numeropieza ilike '%{$params['criterio']}%') ";
        }
        if ($params['codigo']) {
            $where.=" AND (ni.codigo ilike '%{$params['codigo']}%' OR ni.numeropieza ilike '%{$params['criterio']}%') ";
        }
        if ($params['denominacion']) {
            $where.=" AND (ni.descripcion ilike '%{$params['denominacion']}%') ";

        }
        if ($params['idtipocuadrobasico']) {
            if(is_array($params['idtipocuadrobasico'])) {
                $params['idtipocuadrobasico'] = implode(",",$params['idtipocuadrobasico']);
            }
            $where.=" AND cb.idtipocuadrobasico in ({$params['idtipocuadrobasico']}) ";
        }
        if ($params['denomproveedor']) {
            $where.=" AND ncp.nombre ilike '%{$params['denomproveedor']}%' ";
        }
        if ($params['idviaadquicicion']) {
            if(is_array($params['idviaadquicicion'])) {
                $params['idviaadquicicion'] = implode(",",$params['idviaadquicicion']);
            }
            $where.=" AND cb.idviaadquicicion in ({$params['idviaadquicicion']}) ";
        }
        if ($params['idclasificacionven']) {
            if(is_array($params['idclasificacionven'])) {
                $params['idclasificacionven'] = implode(",",$params['idclasificacionven']);
            }
            $where.=" AND cb.idclasificacionven in ({$params['idclasificacionven']}) ";
        }
        if ($params['prioridad']) {
            if(is_array($params['prioridad'])) {
                $params['prioridad'] = implode(",",$params['prioridad']);
            }
            $where.=" AND cb.prioridad in ({$params['prioridad']}) ";
        }
        if ($params['tienecertificado']) {
            if(is_array($params['tienecertificado'])) {
                $params['tienecertificado'] = implode(",",$params['tienecertificado']);
            }
            $where.=" AND cb.tienecertificado in ({$params['tienecertificado']}) ";
        }
        if ($params['denomforma']) {
            $where.=" AND (ff.denominacion ilike '%{$params['denomforma']}%') ";
        }
        if ($params['idtipodispensacion'] && $params['estructurahija']) { //este campo solo se filtra para las entidades hijas
            if(is_array($params['idtipodispensacion'])) {
                $params['idtipodispensacion'] = implode(",",$params['idtipodispensacion']);
            }
            $where.=" AND usd.idtipodispensacion in ({$params['idtipodispensacion']}) ";
        }
        if ($params['idgrupofarmacologico'] ) {
            $where.=" AND {$params['idgrupofarmacologico']} in (select  cast(unnest(string_to_array(subcb.idgrupofarmacologico, ',')) 
                as numeric) FROM mod_logfarmacia.conf_cuadrobasico subcb 
                WHERE subcb.idcuadrobasico = cb.idcuadrobasico) ";
        }
        return $where;
    }
    public function cargarUnidadSaludDispensacion($params)
    {
        $conn = Zend_Registry::get('conexion');
        $select = " SELECT dusd.*";
        $from = " FROM mod_logfarmacia.dat_unidadsaluddispensacion dusd  ";
        $where = " WHERE 0 = 0 ";
        if($params['idcuadrobasico']) {
            $where.=" AND idcuadrobasico = {$params['idcuadrobasico']} ";
        }
        if($params['idtipounidadsalud']) {
            $where.=" AND idtipounidadsalud = {$params['idtipounidadsalud']} ";
        }
        if($params['idtipodispensacion']) {
            $where.=" AND idtipodispensacion = {$params['idtipodispensacion']} ";
        }
        $datos = $conn->execute($select. $from. $where)->fetchAll();
        return array('datos' =>$datos, 'cantidad'=>count($datos));

    }

    public function cargarGrupoFarmacologico($params = array())
    {
        new NomGrupoFarmaceutico();
        $dql = Doctrine_Query::create();
        $dql->select("ngf.idgrupofm, ngf.idgrupofm as id, ngf.denominacion as text, ngf.estado, ngf.codigo, ngf.idpadre, ngf.idarbol, ngf.nivel,
        	ngf.fechainicio, ngf.parentpath, ngf.ordenizq, ngf.ordender, true = leaf")
            ->from('NomGrupoFarmaceutico ngf')-> where("ngf.estado = ?", array(1))->orderBy("ngf.denominacion",'ASC');
        if($params['criterio']) {
            //$dql->where("ngf.denominacion = ?", array(1));
        }
        $datos = $dql->fetchArray();
        return array('datos'=>$datos, 'cantidad'=>$dql->count());
    }
    public function cargarFormaFarmaceutica($params = array())
    {
        $dql = Doctrine_Query::create();
        $dql->select("nff.idforma, nff.idforma as id, nff.denominacion as text, nff.estado, nff.codigo, nff.idpadre, nff.idarbol, nff.nivel,
        	nff.fechainicio, nff.parentpath, nff.ordenizq, nff.ordender, true = leaf")
            ->from('NomFormaFarmaceutica nff')->where("nff.estado = ? and (nff.ordender - nff.ordenizq) = 1", array(1));
        if($params['criterio']) {
            //$dql->where("nff.denominacion = ?", array(1));
        }
        
        $datos = $dql->fetchArray();
        return array('datos'=>$datos, 'cantidad'=>$dql->count());
    }

    //Asociar tipo de entidad
    /**
     * @param $params
     */
    public function guardarTipoEntidadAsociadas($params)
    {
        $dql = Doctrine_Query::create();
        $dql->Delete("ConfTipoEntidadAsociada ctea")
            -> where("ctea.idtipounidadsalud = ?", array($params['idtipounidadsalud']))->execute();
        $collectionObj = new Doctrine_Collection('ConfTipoEntidadAsociada');
        if($params['idtipoentidad']) {
            foreach($params['idtipoentidad'] as $id)
            {
                $tipoEA = new ConfTipoEntidadAsociada();
                $tipoEA->idtipounidadsalud = $params['idtipounidadsalud'];
                $tipoEA->idtipoentidad = $id;
                $collectionObj[] = $tipoEA;
            }
            $collectionObj->save();
        }
    }
    /**
     * @param array $params
     *
     * @return array
     */
    public function cargarTipoEntidadAsociadas($params = array())
    {
        $subAsociado = " (SELECT count(ctea.idtipoentidad) FROM mod_logfarmacia.conf_tipoentidadasociada ctea
            WHERE  ctea.idtipoentidad = no.idorgano AND ctea.idtipounidadsalud = {$params['idtipounidadsalud']} )
            as tiene ";
        $sql =  " SELECT no.idorgano, no.idconcepto AS idconcepto, no.abreviatura AS abreviatura,
                 no.denominacion AS denominacion, no.orden AS orden, no.visible AS visible, no.actual AS actual,
                 no.fechainicio AS fechainicio, no.fechafin AS fechafin, $subAsociado, tea.idtipounidadsalud
                 ";
        $from = " FROM mod_estructuracomp.nom_organo no
                 INNER JOIN mod_estructuracomp.nom_concepto nc ON no.idconcepto = nc.idconcepto
                 LEFT JOIN mod_logfarmacia.conf_tipoentidadasociada tea ON no.idorgano = tea.idtipoentidad";
        $where = " WHERE (no.idconcepto = 1) AND no.actual = 1";
        $orderBy = "ORDER BY no.idorgano DESC LIMIT 100 ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql.$from.$where.$orderBy);
        return $result;
    }
    public function soloAsociadas($params = array())
    {

        $sql =  " SELECT no.idorgano, no.idconcepto AS idconcepto, no.abreviatura AS abreviatura,
                 no.denominacion AS denominacion, no.orden AS orden, no.visible AS visible, no.actual AS actual,
                 no.fechainicio AS fechainicio, no.fechafin AS fechafin ";
        $from = " FROM mod_estructuracomp.nom_organo no
                 INNER JOIN mod_estructuracomp.nom_concepto nc ON no.idconcepto = nc.idconcepto
                 INNER JOIN mod_logfarmacia.conf_tipoentidadasociada ctea ON no.idorgano = ctea.idtipoentidad";
        $where = " WHERE no.idconcepto = 1 AND no.actual = 1 AND ctea.idtipounidadsalud = {$params['idtipounidadsalud']} ";
        $orderBy = "ORDER BY no.idorgano DESC ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql.$from.$where.$orderBy);
        return $result;
    }

    public function cargarCodificador($params = array())
    {
        //throw new Exception("Error de prueba");
        //$modelCodf = new CodificacionModel();
        //return $modelCodf->cargarCodificadorService($params);
       
        $sql = " SELECT num.abreviaturaunidadmedida as unidadmedida, ni.denominacion as descripcion,
        coalesce(ni.numeropieza,ni.codigo) as codigo ";
        $from = "  FROM mod_datosmaestros.nom_indicador ni
        INNER JOIN mod_datosmaestros.nom_indicadorhoja h on h.idindicador = ni.idindicador
        LEFT JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida  ";
        

        if ($params['idindicador']) {
            $where .= " WHERE (ni.idindicador = {$params['idindicador']})";
        }else{
            $where = " WHERE ni.idindicador not in (select idindicador from mod_logfarmacia.conf_cuadrobasico where idanno = {$params['idanno']})";
        }
        $limit = "";
        if ($params['limit']) {
            $limit = " order by ni.denominacion ASC offset({$params['start']}) limit({$params['limit']})";
        } 

        if ($params['criterio']) {
            $where .= " and (ni.numeropieza ilike '%{$params['criterio']}%' or ni.codigo ilike '%{$params['criterio']}%' or ni.denominacion ilike '%{$params['criterio']}%')";
        } 
        
        $conn = Zend_Registry::get('conexion');
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql.$from.$where)->fetchAll(PDO::FETCH_ASSOC);
        //echo $sql.$from.$where.$limit;die;
        $datos = $conn->fetchAll($sql.$from.$where.$limit);
        return array('datos' => $datos, 'cantidad'=>count($total));

        /*$conn = Zend_Registry::get('conexion');
        $modelProducto = new LogisticaProductoModel();
        if ($datosDoc['criterio']) {
            $query->addWhere("i.numeropieza ilike '%{$datosDoc['criterio']}%' or i.codigo ilike '%{$datosDoc['criterio']}%' or i.denominacion ilike '%{$datosDoc['criterio']}%'");
        }
        $result = $modelProducto->cargarProductos($params, true);*/

        /*$query = new Doctrine_Query();
        $query->Select(
            "p.*, i.codigo as codigo, i.denominacion as denominacion"
        )
            ->from("DatProductoLogistica p")
            ->orderBy('p.idproducto ASC');
        $datosMaestros = new MaestroProductoModel();
        $datosMaestros->addQueryNomIndicador($query, 'p', 'i', 'ih');
        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'p', 'um', 'um.abreviaturaunidadmedida as unidadmedida', 'leftJoin'
        );
        $limit = "";
        if (is_numeric($params['limit']) && is_numeric($params['start'])) {
            $query->offset($params['start'])->limit($params['limit']);
        }

        if ($datosDoc['criterio']) {
            $query->addWhere("i.numeropieza ilike '%{$params['criterio']}%' or i.codigo ilike '%{$params['criterio']}%' or i.denominacion ilike '%{$params['criterio']}%'");
        }
        $cantidad = $query->count();
        $result = $query->fetchArray();

        return array(
                'cantidad' => $cantidad,
                'datos' => $result
        );*/


    }

    public function getEstructura()
    {
        $sql = " SELECT nfs.idpadre, nfs.idfila as idestructura, nfs.parent_path
            FROM mod_estructuracomp.nom_filaestruc nfs
            WHERE nfs.idfila = {$this->global->Estructura->idestructura} ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        $arrPath = explode(".", $result[0]['parent_path']);
        $idEstructuraRaiz = $arrPath[0];
        $resultAnno = $this->getAnnoActivoByEstrcturaRaiz($idEstructuraRaiz);
        $result[0]['idannoActivo'] = (count($resultAnno)>0)?$resultAnno[0]['idanno']:null;
        //cargar el idanno padre raiz para utilizar en la vista
        return $result[0];
    }

    private function getAnnoActivoByEstrcturaRaiz($idEstructuraRaiz)
    {
        $conn = Zend_Registry::get('conexion');
        $sqlAnno = " SELECT ca.idanno
            FROM  mod_logfarmacia.conf_anno ca
            WHERE ca.identidad = {$idEstructuraRaiz} AND ca.activo = 1 ";
        $resultAnno = $conn->fetchAll($sqlAnno);
        return $resultAnno;
    }

}
