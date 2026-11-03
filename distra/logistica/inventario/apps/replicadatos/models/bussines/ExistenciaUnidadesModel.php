<?php

/**
 * Description of ExistenciaUnidadesModel
 *
 * @author maricet
 */
class ExistenciaUnidadesModel extends BaseModel
{

    private $espacialidades, $ubicacion;

    public function __construct()
    {
        parent::__construct();
        $this->getConexion();
        Doctrine_Manager::getInstance()->setCurrentConnection('logistica');
        $this->ubicacion = new DatEstructuraubicacionModel();
    }

    public function getConexion()
    {
        $dwh = 'logistica';
        $configApp = new ZendExt_App_Config();
        $configApp->addBdToConfig($dwh, $dwh);
        $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
        $connexion = $transactionManager->openConections($dwh);
        $this->espacialidades = $this->objectHelper->extractValueFromArrayColumn(
            $this->configuracionHelper->obtenerEspecialidades(array('restringir' => true)), 'idespecialidad'
        );
        return $connexion;
    }

    public function cargarEstructuras($nodo)
    {
        $query = Doctrine_Query::create();
        $query->select('e.idestructura, e.idestructura as id, e.denominacion as text, false as checked')
            ->from('DimEstructura e')
            ->innerJoin('e.ClousureEstructura ce')
            ->where('ce.idpadre = ?', $nodo['node']);
        $query->addWhere('ce.distancia = 1');

        if ($nodo['treeSearch']) {
            $query->addWhere("(e.denominacion ILIKE '%{$nodo['treeSearch']}%')");
        }
        $query->addSelect(
            "((SELECT COUNT(d.idhijo) FROM ClousureEstructura d "
            . "WHERE d.idpadre = e.idestructura AND d.distancia <> 0) = 0) as leaf"
        );
        $query->addSelect(
            "((SELECT COUNT(dd.idpadre) FROM ClousureEstructura dd "
            . "WHERE dd.idhijo = e.idestructura AND dd.distancia <> 1 AND dd.idpadre = 0) = 0) is_padre"
        );

        return $query->fetchArray();
    }

    public function cargarExistenciasxUnidad($params)
    {
        $where = array();
        $where[] = "cube.cantidad > 0";
        $strSelect = array();
        $strSelectSum = array();
        if ($params['idindicadores']) {
            $idindicadores = implode(',', $params['idindicadores']);
            $where[] = "cube.idindicador in ($idindicadores)";
        }
        if ($params['concepto']) {
            $where[] = "cube.idconceptop = {$params['concepto']}";
        }
        if ($params['concepto'] == 0 || $params['concepto'] == 5) {
            $strSelect[] = "(select (case when count(cub_aft.idproducto) > 0 then 1 else 0 end) 
                            from mod_loganalisis.cub_existencia cub_aft 
                            where cub_aft.idconceptop = 5 and cub_aft.idindicador = cube.idindicador
                            and cub_aft.idcategoria = cube.idcategoria) as enexplotacion"; //+ idcategoria
        }

        if ($params['concepto'] == 0 || $params['concepto'] == 8) {
            $strSelect[] = "(select (case when count(cub_aft.idproducto) > 0 then 1 else 0 end) 
                            from mod_loganalisis.cub_existencia cub_aft 
                            where cub_aft.idconceptop = 8 and cub_aft.idindicador = cube.idindicador
                            and cub_aft.idcategoria = cube.idcategoria) as enalmacen"; //+ idcategoria
        }
        if (count($params['idestructuras']) == 0) {
            $params['idestructuras'] = $this->getEstructuras($params);
            foreach ($params['idestructuras'] as $index => $est) {
                $as = 'cube_' . $index;
                $whereTmp = $est['tipo'] == 1 ? "{$as}.identidad in ({$est['idestructura']})" : "{$as}.idestructura in ({$est['idestructura']})";
                if ($params['concepto']) {
                    $whereTmp .= " AND {$as}.idconceptop = {$params['concepto']}";
                }
                $strSelect[] = "round(coalesce((SELECT sum({$as}.cantidad) FROM mod_loganalisis.cub_existencia {$as} "
                    . "WHERE $whereTmp  "
                    . "AND {$as}.idindicador = cube.idindicador AND coalesce({$as}.idcategoria,-1) = coalesce(cube.idcategoria,-1)),0),2) as id"
                    . $est['idestructura'];
                $strSelectSum[] = "coalesce((SELECT sum({$as}.cantidad) FROM mod_loganalisis.cub_existencia {$as} "
                    . "WHERE $whereTmp AND {$as}.idindicador = cube.idindicador "
                    . "AND coalesce({$as}.idcategoria,-1) = coalesce(cube.idcategoria,-1)),0)";
            }
        } else {
            $params['depositos'] = true;
            $arrIdHijos = array();
            // Variante de descarte de la entidad autenticada y desmarcadas. Dainier.
            $params['idestructuras'] = array_reverse($this->getEstructuras($params));
            $idComunes = $this->objectHelper->extractValueFromArrayColumn($params['idestructuras'], 'id');
            $todos = array();
            //..
            foreach ($params['idestructuras'] as $index => $est) {
                if (is_object($est)) {
                    $est = (array)$est;
                }
                $hijos = $this->integrator->metadatos
                    ->getHijosSubordinacion($est['idestructura'], $params['subordinacion']);
                if (count($hijos)) {
                    // Variante de descarte de la entidad autenticada y desmarcadas. Dainier.
                    $ids = $this->objectHelper->extractValueFromArrayColumn($hijos, 'id');
                    $idTemp = array_intersect($ids, $idComunes);
                    if ($est['id'] == $this->global->Estructura->idestructura) {
                        $idHijos = implode(',', $todos);
                    } else {
                        $todos = array_merge($todos, (count($idTemp) > 0 ? $idTemp : $ids));
                        $idHijos = implode(',', count($idTemp) > 0 ? $idTemp : $ids);
                    }
                    //..
                    $arrIdHijos = array_merge($arrIdHijos, $this->objectHelper->extractValueFromArrayColumn($hijos, 'id'));
                    $as = 'cube_' . $index;
                    $strSelect[] = "round(coalesce((SELECT sum({$as}.cantidad) FROM mod_loganalisis.cub_existencia {$as} "
                        . "WHERE {$as}.identidad in ({$idHijos})"
                        . " AND {$as}.idindicador = cube.idindicador AND coalesce({$as}.idcategoria,-1) = coalesce(cube.idcategoria,-1)),0),2) as id"
                        . $est['idestructura'];
                    $strSelectSum[] = "coalesce((SELECT sum({$as}.cantidad) FROM mod_loganalisis.cub_existencia {$as} "
                        . "WHERE {$as}.identidad in({$idHijos})"
                        . " AND {$as}.idindicador = cube.idindicador AND coalesce({$as}.idcategoria,-1) = coalesce(cube.idcategoria,-1)),0)";
                } else {
                    // Variante de descarte de la entidad autenticada y desmarcadas. Dainier.
                    $todos[] = $est['id'];
                    //..
                    $as = 'cube_' . $index;
                    $strSelect[] = "round(coalesce((SELECT sum({$as}.cantidad) FROM mod_loganalisis.cub_existencia {$as} "
                        . "WHERE {$as}.identidad in ({$est['idestructura']})"
                        . " AND {$as}.idindicador = cube.idindicador AND coalesce({$as}.idcategoria,-1) = coalesce(cube.idcategoria,-1)),0),2) as id"
                        . $est['idestructura'];
                    $strSelectSum[] = "coalesce((SELECT sum({$as}.cantidad) FROM mod_loganalisis.cub_existencia {$as} "
                        . "WHERE {$as}.identidad in({$est['idestructura']})"
                        . " AND {$as}.idindicador = cube.idindicador AND coalesce({$as}.idcategoria,-1) = coalesce(cube.idcategoria,-1)),0)";
                    $arrIdHijos[] = $est['idestructura'];
                }
            }
            if (count($arrIdHijos)) {
                $strIdEnt = implode(',', $arrIdHijos);
                $where[] = "cube.identidad in ({$strIdEnt})";
            }
        }
        $strSelect = count($strSelect) ? ',' . implode(',', $strSelect) : '';
        if (count($strSelectSum)) {
            $where [] = implode('+', $strSelectSum) . " > 0";
        }
        $strEspecialidad = implode(',', $this->espacialidades);
        //$where [] = " dprod.idespecialidad in({$strEspecialidad})";
        $strSelectSum = count($strSelectSum) ? ',' . implode('+', $strSelectSum) . ' as total' : '';
        $sql = "select distinct cube.idcategoria, dprod.codigo as codigo, dprod.denominacion ||' '|| coalesce(nmarc.denominacion,'') as denominacion,"
            . "dcat.denominacion as categoria, nat.idnaturaleza, nat.denominacion as naturaleza, upper(um.abreviaturaunidadmedida) as umedida, dprodh.*,"
            . "npais.siglas as pais {$strSelect} {$strSelectSum} ,cube.idproducto from mod_loganalisis.cub_existencia cube "
            . "inner join mod_datosmaestros.nom_indicador dprod on dprod.idindicador = cube.idindicador "
            . "inner join mod_datosmaestros.nom_indicadorhoja dprodh on dprodh.idindicador = cube.idindicador "
            . "inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = dprod.idnaturaleza "
            . "left join mod_loganalisis.dim_categoria dcat on dcat.idcategoria = cube.idcategoria "
            . "left join mod_datosmaestros.nom_pais npais on npais.idpais = dprod.idpais "
            . "left join mod_datosmaestros.nom_marca nmarc on nmarc.idmarca = dprodh.idmarca "
            . "left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = dprod.idumedida";
        $sqlCant = "select count (q.*) from (select distinct cube.idcategoria, dprod.codigo as codigo, "
            . "dprod.denominacion as denominacion, dcat.denominacion as categoria, "
            . "um.abreviaturaunidadmedida as umedida, npais.nombrepais as pais {$strSelect}  "
            . "from mod_loganalisis.cub_existencia cube "
            . "inner join mod_datosmaestros.nom_indicador dprod on dprod.idindicador = cube.idindicador "
            . "left join mod_loganalisis.dim_categoria dcat on dcat.idcategoria = cube.idcategoria "
            . "left join mod_datosmaestros.nom_pais npais on npais.idpais = dprod.idpais "
            . "left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = dprod.idumedida";
        $where = count($where) ? ' where ' . implode(' and ', $where) : '';
        $sql .= $where . " order by dprod.codigo, cube.idcategoria limit {$params['limit']} offset {$params['start']}";
        $sqlCant .= $where . ") q";
        $cant = Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sqlCant);
        return array(
            'cantidad' => $cant[0]['count'],
            'datos' => Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sql),
            'estructuras' => array_reverse($params['idestructuras'])
        );
    }

    public function cargarMovimiento($datos)
    {
        $datos['start'] = $datos['start'] ? $datos['start'] : 0;
        $datos['limit'] = $datos['limit'] ? $datos['limit'] : 30;
        if ($datos['activo']) {
            $addselect = "coalesce((SELECT sum(pn.valorcontable) FROM mod_loganalisis.cub_productonumericoactivo pn "
                . "INNER JOIN mod_loganalisis.cub_movproductonumericoactivo mpn "
                . "ON mpn.idregnumerico = pn.idproductonumericoactivo "
                . "WHERE pn.idproducto = cm.idproducto AND mpn.idmovimiento = cm.idmovimiento), 0) AS valorcontable,";
        }
        $campo = $datos['porentidad'] ? "identidad" : "idestructura";
        if ($datos['criterio'] && is_numeric($datos['criterio'])) {
            $where = "and cm.nrodoc = " . $datos['criterio'];
        }
        $query = " from mod_loganalisis.cub_movimiento cm
                        inner join mod_loganalisis.cub_existencia p on p.idproducto = cm.idproducto
                        inner join mod_loganalisis.dim_deposito d on d.iddeposito = p.idestructura
                        inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                        where i.idindicador in({$datos['idproducto']}) and p.{$campo} = {$datos['idDeposito']} 
                        and p.idcategoria = {$datos['idcategoria']} {$where}";
        $select = "cm.idmovimiento, cm.nrodoc,cm.fechadoc as fecha,cm.tipodocumento as denomdocumento, 
                        cm.denominacionoper as denomoperacion, p.idestructura, d.denominacion as deposito, {$addselect}
                        (case when cm.signo ='+' then round(cm.cantidad,6) end) as entradacant,
                        (case when cm.signo ='-' then round(cm.cantidad,6) end) as salidacant,
                        (case when cm.signo ='+' then round(cm.importecontable,2) end) as entradaimp,
                        (case when cm.signo ='-' then round(cm.importecontable,2) end) as salidaimp,
                        round(cm.existenciaactual,6) as existenciaactual,
                        cm.preciocontable,round(cm.preciopromedio,6) as preciopromedio,
                        round(cm.importetotal,2) as importetotal, cm.cronologia, cm.denominacioncliente as cliente";
        $cant = $this->doctrineHelper->getConnection()->execute("select count(*) as cant {$query}")
            ->fetchAll(PDO::FETCH_COLUMN);
        return array(
            'cantidad' => $cant[0],
            'datos' => $this->doctrineHelper->getConnection()
                ->execute("select {$select} {$query} order by p.idestructura, cm.cronologia asc offset {$datos['start']} limit {$datos['limit']}")
                ->fetchAll(PDO::FETCH_OBJ)
        );
    }

    public function cargarPartidas($filtro)
    {
        if ($filtro['porentidad']) {
            $estructuras = explode(',', $filtro['idestructuras']);
            $idestructura = array();
            foreach ($estructuras as $value) {
                $idestructura = array_merge($idestructura, array($value));
                $hijos = $this->integrator->metadatos->getHijosSubordinacion($value, $filtro['subordinacion']);
                $idestructura = array_merge(
                    $idestructura, $this->objectHelper->extractValueFromArrayColumn($hijos, 'idestructura')
                );
            }
            $filtro['idestructuras'] = implode(',', $idestructura);
        }
        $campo = $filtro['porentidad'] ? "identidad" : "idestructura";
        $sql = "SELECT m.*, i.denominacion as denominacion, i.codigo, p.identidad, p.idestructura, 
            (CASE WHEN m.idanno = '0' THEN 'S/Datos' ELSE m.idanno END) AS idanno, 
            (CASE WHEN m.idannopolvuno = '0' THEN 'S/Datos' ELSE m.idannopolvuno END) AS idannopolvuno, 
            (CASE WHEN m.idannopolvdos = '0' THEN 'S/Datos' ELSE m.idannopolvdos END) AS idannopolvdos, 
            (CASE WHEN m.idannoexplosivo = '0' THEN 'S/Datos' ELSE m.idannoexplosivo END) AS idannoexplosivo, 
            (CASE WHEN m.idannoespoleta = '0' THEN 'S/Datos' ELSE m.idannoespoleta END) AS idannoespoleta, 
            (CASE WHEN m.idannoestopin = '0' THEN 'S/Datos' ELSE m.idannoestopin END) AS idannoestopin,
            d.denominacion AS deposito 
                FROM mod_loganalisis.cub_productomunic m
                INNER JOIN mod_loganalisis.cub_existencia p on p.idproducto = m.idproducto
                INNER JOIN mod_loganalisis.dim_deposito d on d.iddeposito = p.idestructura
                INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador 
                WHERE i.idindicador in({$filtro['idproducto']}) and p.{$campo} in ({$filtro['idestructuras']})
                and p.idcategoria in ({$filtro['idcategoria']}) 
                GROUP BY i.idindicador, m.idproductomunic, p.identidad, p.idestructura, d.iddeposito 
                ORDER BY i.idindicador, p.identidad, p.idestructura, d.iddeposito";
        $cant = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $sql .= " offset {$filtro['start']} limit {$filtro['limit']}";
        $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($filtro['porentidad']) {
            foreach ($datos as $key => $value) {
                $padres = $this->integrator->metadatos->getPadresSubordinacion($value['identidad'], $filtro['subordinacion']);
                $entidad = $this->estructuraHelper->getEstructura($value['identidad']);
                $padres[] = $entidad[0];
                $value['entidad'] = $this->obtenerCamino($padres);
                $datos[$key] = $value;
            }
        }
        return array('cantidad' => count($cant), 'datos' => $datos);
    }

    public function cargarNroSerie($filtro = array())
    {
        if ($filtro['porentidad']) {
            $estructuras = explode(',', $filtro['idestructuras']);
            $idestructura = array();
            foreach ($estructuras as $value) {
                $idestructura = array_merge($idestructura, array($value));
                $hijos = $this->integrator->metadatos->getHijosSubordinacion($value, $filtro['subordinacion']);
                $idestructura = array_merge(
                    $idestructura, $this->objectHelper->extractValueFromArrayColumn($hijos, 'idestructura')
                );
            }
            $filtro['idestructuras'] = implode(',', $idestructura);
        }
        $campo = $filtro['porentidad'] ? "p.identidad" : "p.idestructura";
        $sql = "select m.*, i.denominacion as denominacion, i.codigo, p.identidad, p.idestructura, 
                d.denominacion AS deposito
            from mod_loganalisis.cub_productonroserie m
            inner join mod_loganalisis.cub_existencia  p on p.idproducto = m.idproducto
            inner join mod_loganalisis.dim_deposito d on d.iddeposito = p.idestructura
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            where i.idindicador in({$filtro['idproducto']}) and {$campo} in ({$filtro['idestructuras']})
            and p.idcategoria in ({$filtro['idcategoria']}) and m.estado in (2, 3) 
            group by i.idindicador, m.idnroserie, p.identidad, p.idestructura, d.iddeposito 
            order by i.idindicador, p.identidad, p.idestructura, d.iddeposito";
        $cant = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $sql .= " offset {$filtro['start']} limit {$filtro['limit']}";
        $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($filtro['porentidad']) {
            foreach ($datos as $key => $value) {
                $padres = $this->integrator->metadatos->getPadresSubordinacion($value['identidad'], $filtro['subordinacion']);
                $entidad = $this->estructuraHelper->getEstructura($value['identidad']);
                $padres[] = $entidad[0];
                $value['entidad'] = $this->obtenerCamino($padres);
                $datos[$key] = $value;
            }
        }
        return array('cantidad' => count($cant), 'datos' => $datos);
    }

    public function cargarNroSerieActivo($filtro = array())
    {
        if ($filtro['porentidad']) {
            $estructuras = explode(',', $filtro['idestructuras']);
            $idestructura = array();
            foreach ($estructuras as $value) {
                $idestructura = array_merge($idestructura, array($value));
                $hijos = $this->integrator->metadatos->getHijosSubordinacion($value, $filtro['subordinacion']);
                $idestructura = array_merge(
                    $idestructura, $this->objectHelper->extractValueFromArrayColumn($hijos, 'idestructura')
                );
            }
            $filtro['idestructuras'] = implode(',', $idestructura);
        }
        $campo = $filtro['porentidad'] ? "p.identidad" : "p.idestructura";
        $sql = "SELECT m.*, d.denominacion AS arearesponsabilidad, p.idestructura, p.identidad
                FROM mod_loganalisis.cub_productonumericoactivo m
                INNER JOIN mod_loganalisis.cub_existencia  p ON p.idproducto = m.idproducto
                INNER JOIN mod_loganalisis.dim_deposito d ON d.iddeposito = p.idestructura
                INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = p.idindicador
                WHERE i.idindicador IN ({$filtro['idproducto']}) AND p.idcategoria IN ({$filtro['idcategoria']})
                    AND {$campo} in ({$filtro['idestructuras']})
                ORDER BY p.idestructura";
        $cant = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $sql .= " offset {$filtro['start']} limit {$filtro['limit']}";
        $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($filtro['porentidad']) {
            foreach ($datos as $key => $value) {
                $padres = $this->integrator->metadatos->getPadresSubordinacion($value['identidad'], $filtro['subordinacion']);
                $entidad = $this->estructuraHelper->getEstructura($value['identidad']);
                $padres[] = $entidad[0];
                $value['entidad'] = $this->obtenerCamino($padres);
                $datos[$key] = $value;
            }
        }
        return array('cantidad' => count($cant), 'datos' => $datos);
    }

    public function cargarDepositos($datos)
    {
        if ($datos['porentidad']) {
            $estructuras = explode(',', $datos['idestructuras']);
            $result = array();
            foreach ($estructuras as $value) {
                $sql = "SELECT distinct m2.identidad FROM mod_loganalisis.cub_existencia  m2
                    WHERE m2.idindicador in ({$datos['idproducto']}) and m2.idcategoria in ({$datos['idcategoria']})
                    AND m2.identidad IN ({$value})";
                $cant = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                if (count($cant) > 0) {
                    $entidad = $this->estructuraHelper->getEstructura($value);
                    if ($entidad[0]->codigo) {
                        $entidad[0]->denominacion = $entidad[0]->codigo;
                    }
                    $result[] = (array)$entidad[0];
                }
                $hijos = $this->integrator->metadatos->getHijosSubordinacion($value, $datos['subordinacion']);
                foreach ($hijos as $item) {
                    $sql = "SELECT distinct m2.identidad AS idestructura FROM mod_loganalisis.cub_existencia  m2
                        WHERE m2.idindicador in ({$datos['idproducto']}) and m2.idcategoria in ({$datos['idcategoria']})
                        AND m2.identidad IN ({$item->id})";
                    $cant = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                    if (count($cant) > 0) {
                        if ($item->codigo) {
                            $item->denominacion = $item->codigo;
                        }
                        $result[] = (array)$item;
                    }
                }
            }
            return (array)$result;
        }
        $tipo = $datos['tipo'] == 2 ? -1 : 0;
        $logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
        $depositos = $logistEstrucUbica->cargardepositos(null, null, null, null, null, $tipo, null, null);
        $iddepositos = $this->objectHelper->extractValueFromArrayColumn($depositos['depositos'], 'id');
        $idest = explode(',', $datos['idestructuras']);
        $iddepositos = array_intersect($iddepositos, $idest);
        $iddepositos[] = -1;
        $strdepositos = implode(',', $iddepositos);
        $sql = "SELECT distinct eop.denominacion, eop.idestructuraop as idestructura
                FROM mod_loganalisis.cub_existencia  m2
                inner join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop =  m2.idestructura
                WHERE m2.idindicador in ({$datos['idproducto']}) and m2.idcategoria in ({$datos['idcategoria']})
                AND eop.idestructuraop IN ({$strdepositos})";
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEstructuras($parametros = array())
    {
        $subQuery = array('h.idconcepto in(3,8,5)');
        if ($parametros['concepto'] == 5) {
            $subQuery = array('h.idconcepto in(3,5)');
        }
        if ($parametros['concepto'] == 8) {
            $subQuery = array('h.idconcepto in(3,8)');
        }
        if (count($parametros['idestructuras']) > 0) {
            $resultado = array();
            // Desechando la entidad autenticada de las columnas del grid.
//            $entidad = $this->estructuraHelper->getEstructura($this->global->Estructura->idestructura);
//            $resultado[] = $entidad[0];
            foreach ($parametros['idestructuras'] as $identidad) {
                $entidad = $this->estructuraHelper->getEstructura($identidad);
                /* if ($entidad[0]->codigo) {
                  $entidad[0]->denominacion = $entidad[0]->codigo;
                  } */
                $entidad[0]->tipo = 1;
                array_push($resultado, $entidad[0]);
                $resultado = array_merge($resultado, $this->estructuraHelper
                    ->buscarHijoPorSubordinacion(array($identidad), array($parametros['subordinacion'])));
            }
            $arrayId = array();
            $arrayRes = array();
            foreach ($resultado as $est) {
                if (!array_key_exists($est->idestructura, $arrayId)) {
                    /* if ($est->codigo) {
                      $est->denominacion = $est->codigo;
                      } */
                    $info = $this->obtenerLocalizacion($est->idestructura);
                    $est->denominacion = $est->codigo ? $est->codigo : $est->denominacion;
                    $est->longitud = $info[0]['longitud'];
                    $est->latitud = $info[0]['latitud'];
                    $arrayId[$est->idestructura] = true;
                    $arrayRes[] = $est;
                }
            }
            return $arrayRes;
        } else {
            array_push($subQuery, "f.idfila in ({$this->global->Estructura->idestructura})");
        }
        if (count($parametros['idindicadores'])) {
            $strProd = implode(',', $parametros['idindicadores']);
            array_push($subQuery, "c.idindicador in ({$strProd})");
        }
        $subQuery = implode(' and ', $subQuery);

        $sql = "select DISTINCT h.idfila as idestructura, coalesce(e.abreviatura, op.denominacion) as denominacion,coalesce(e.codigo, op.codigo) as codigo,"
            . "h.lft,h.longitud, h.latitud, case when e.idestructura is not null then 1 else 2 end as tipo "
            . "from mod_estructuracomp.nom_filaestruc f "
            . "inner join mod_estructuracomp.nom_filaestruc h on h.lft >= f.lft and h.rgt <= f.rgt "
            . "left join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = h.idfila "
            . "left join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = h.idfila "
            . "inner join mod_loganalisis.cub_existencia c on (c.idestructura = h.idfila OR c.identidad = h.idfila)";
        $sql .= ' where ' . $subQuery . ' order by h.lft';
        return Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sql);
    }

    private function obtenerLocalizacion($idEntidad)
    {
        $sql = "select f.longitud, f.latitud "
            . "from mod_estructuracomp.nom_filaestruc f "
            . "where f.idfila = {$idEntidad}";
        return Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sql);
    }

    public function obtenerIndicadores($params)
    {
        $fiter = "p.idestructuracomun = {$this->global->Estructura->idestructura}";
        if (count($params['identidades']) > 0) {
            $id = implode(',', $params['identidades']);
            $fiter = "p.idestructuracomun in ({$id})";
        }
        $sql = 'select distinct i.idindicador as id from mod_datosmaestros.nom_indicadorhoja i inner join '
            . "mod_logistica.dat_producto p on i.idindicador = p.idindicador where {$fiter}";
        return Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sql);
    }

    /**
     * Inicio de los metos del 107 para la entidad
     */
    public function cargarEstructurasInternas($filtro)
    {
        if ($filtro['node'] == 0) {
            $logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
            $tipo = $filtro['tipo'] == 2 ? -1 : 0;
            $depositos = $logistEstrucUbica->cargardepositos(null, null, null, null, null, $tipo, null, null);
            $iddepositos = $this->objectHelper->extractValueFromArrayColumn($depositos['depositos'], 'id');
            $iddepositos[] = -1;
            $strdepositos = implode(',', $iddepositos);
            $conceptos = '(8,5)';
            if ($filtro['tipo'] == 3) {
                $conceptos = '(5)';
            } elseif ($filtro['tipo'] == 2) {
                $conceptos = '(8)';
            }
            $sql = "SELECT DISTINCT eop.idestructuraop AS id, eop.denominacion AS text, false AS checked, 
                'historial' AS iconCls, 0 AS leaf, eop.denominacion, eop.idestructuraop AS idestructura,
                (SELECT array_to_string(array_agg(da.idarea), ',') FROM mod_logubicacion.dat_area da 
                INNER JOIN mod_logubicacion.dat_areaproducto ap ON ap.idarea = da.idarea 
                WHERE da.idestructuracomun = eop.idestructuraop) AS idareas
                FROM mod_logistica.dat_producto p
                INNER JOIN mod_estructuracomp.dat_estructuraop eop ON eop.idestructuraop = p.idestructura
                INNER JOIN mod_estructuracomp.nom_filaestruc f ON f.idfila = p.idestructura
                WHERE f.idconcepto IN $conceptos AND p.cronologia > 0 AND p.idestructura IN ({$strdepositos})
                AND p.idestructuracomun = " . $this->global->Estructura->idestructura;
            return Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sql);
        }
        $query = $this->ubicacion->ObtenerEstructurasUbicacion($filtro['node'], null, -1, true);
        return $query->addSelect("{$filtro['node']} AS idantecesor, {$filtro['checked']} AS checked, 1 AS leaf")->fetchArray();
    }

    public function getEstructurasInternas($parametros)
    {
        $conceptos = $parametros['concepto'] != 0 ? $parametros['concepto'] : "5, 8";
        $idEstructura = implode(',', $parametros['idestructuras']);
        $sql = "SELECT DISTINCT eop.idestructuraop as id, eop.denominacion as text, eop.denominacion, f.latitud, 
                f.longitud, false as checked, 'historial' as iconCls, 1 as leaf, eop.idestructuraop as idestructura
                FROM mod_logistica.dat_producto p
                INNER JOIN mod_estructuracomp.dat_estructuraop eop ON eop.idestructuraop = p.idestructura
                INNER JOIN mod_estructuracomp.nom_filaestruc f ON f.idfila = p.idestructura
                WHERE f.idconcepto in ({$conceptos}) AND p.idestructura IN ($idEstructura)
                AND p.cronologia > 0 AND p.idestructuracomun = " . $this->global->Estructura->idestructura;
        $estructuras = Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sql);
        $entidad = (array)$this->estructuraHelper->getEstructura($this->global->Estructura->idestructura)[0];
        $entidad['tipo'] = 0;
        $entidad['denominacion'] = $entidad['codigo'] ? $entidad['codigo'] : $entidad['denominacion'];
        unset($entidad['logo']);
        unset($entidad['icon']);
        $result = array($entidad);
        if ($parametros['reporte'] == 2) {
            $sinubicacion = ", -1";
            $on = "OR da.idarea = -1";
        }
        if ($parametros['idareas']) {
            $where = "AND da.idarea IN (" . implode(',', $parametros['idareas']) . "{$sinubicacion})";
        }
        foreach ($estructuras as $est) {
            $est['tipo'] = 1;
            array_push($result, $est);
            $sqlArea = "SELECT DISTINCT deu.idestructuraubicacion AS idestructura, 
                        (CASE WHEN deu.idestructuraubicacion = -1 THEN {$est['id']}00 ELSE deu.idestructuraubicacion END) AS id,
                        (CASE WHEN deu.idestructuraubicacion = -1 THEN -1 END) AS idestructuraubic,
                        (CASE WHEN deu.idestructuraubicacion = -1 THEN {$est['id']} END) AS idalmacen,
                        deu.descripcion AS denominacion, 
                        (CASE WHEN deu.idestructuraubicacion = -1 THEN -1 ELSE 2 END) AS tipo 
                        FROM mod_logubicacion.dat_area da
                        INNER JOIN mod_logubicacion.dat_estructuraubicacion deu ON deu.idarea = da.idarea
                        AND deu.idpadre = deu.idestructuraubicacion {$where}
                        AND (da.idestructuracomun = {$est['id']} {$on})
                        WHERE coalesce((SELECT sum(ap.disponible) FROM mod_logubicacion.dat_areaproducto ap 
                        WHERE ap.idarea = da.idarea), 0) > 0 ORDER BY deu.idestructuraubicacion";
            $areas = Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sqlArea);
            $result = array_merge($result, $areas);
        }
        return $result;
    }

    public function existenciasEntidad($parametros = array())
    {
        $estructuras = $this->getEstructurasInternas($parametros);
        $arrSelect = array();
        foreach ($estructuras as $est) {
            $alias = 'p_' . $est['id'];
            $aliasProd = 'ap_' . $est['id'];
            $arrWhereLocal = array();
            $arrWhereLocal[] = 'p.idindicador = ' . $alias . '.idindicador';
            $arrWhereLocal[] = 'coalesce(p.idcategoria,-1) = coalesce(' . $alias . '.idcategoria,-1)';
            $_sql = $this->getSqlExistencias($est, $alias, $aliasProd, $parametros['idareas'], $parametros['reporte']) . ' AND ' . implode(' AND ', $arrWhereLocal).' limit 1';
            $arrSelect[] = "ROUND(($_sql),2) as id{$est['id']}";
        }
        $select = implode(',', $arrSelect);
        $idestruc = implode(',', $parametros['idestructuras']);
        $where[] = "p.cronologia > 0 AND p.idestructura IN ({$idestruc}) "
            . "AND p.idestructuracomun = " . $this->global->Estructura->idestructura;
        if ($parametros['idareas'] && $parametros['reporte'] == 2) {
            $where[] = "ap.idarea in (" . implode(',', $parametros['idareas']) . ", -1)";
            $inner = "inner join mod_logubicacion.dat_areaproducto ap on ap.idproducto = p.idproducto ";
        }
        if (count($parametros['idindicadores'])) {
            $idInd = implode(',', $parametros['idindicadores']);
            $where[] = "p.idindicador in ($idInd)";
        }
        $where = implode(' AND ', $where);
        $sql = "select distinct dprod.codigo as codigo, dprod.denominacion ||' '|| coalesce(m.denominacion,'')||' '|| coalesce(md.denominacion,'') as denominacion,
                    coalesce(ncat.idcategoria,-1) as idcategoria,coalesce(ncat.denominacion,'-') as categoria, nat.denominacion as naturaleza,
                    npais.siglas as pais,upper(um.abreviaturaunidadmedida) as umedida, {$select},p.idproducto,
                    ih.*,(select count(f.idfila) from mod_estructuracomp.nom_filaestruc f where f.idfila = p.idestructura and f.idconcepto = 8) as enalmacen,
                    (select count(f.idfila) from mod_estructuracomp.nom_filaestruc f where f.idfila = p.idestructura and f.idconcepto = 5) as enexplotacion,
                    {$parametros['concepto']} as concepto
                    from mod_datosmaestros.nom_indicador dprod
                    inner join mod_logistica.dat_producto p on p.idindicador = dprod.idindicador
                    inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = dprod.idindicador
                    inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = dprod.idnaturaleza
                    {$inner}
                    left join mod_datosmaestros.nom_marca m on m.idmarca = ih.idmarca
                    left join mod_datosmaestros.nom_modelo md on md.idmodelo = ih.idmodelo
                    left join mod_logistica.nom_categoria ncat on ncat.idcategoria = p.idcategoria
                    left join mod_datosmaestros.nom_pais npais on npais.idpais = dprod.idpais
                    left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = dprod.idumedida
                    where " . $where;
        $limit = " offset {$parametros['start']} limit {$parametros['limit']}";
        return array(
            'cantidad' => Doctrine_Manager::getInstance()->getConnection('logistica')->execute($sql)->rowCount(),
            'datos' => Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($sql . $limit),
            'estructuras' => $estructuras
        );
    }

    private function getSqlExistencias($estructura, $alias, $aliasProd, $idareas, $tipo = 2)
    {
        $idareas[] = -1;
        $str = implode(',', $idareas);
        if ($estructura['tipo'] == 0) {
            if ($tipo == 3) {
                return "SELECT sum({$alias}.cantidad) FROM mod_logistica.dat_producto {$alias}"
                    . " WHERE {$alias}.idestructuracomun = {$this->global->Estructura->idestructura}";
            }
            return "SELECT SUM({$aliasProd}.cantidad)
                    FROM mod_logubicacion.dat_estructuraubicacion eu 
                    INNER JOIN mod_logubicacion.dat_ubicacionproducto {$aliasProd} ON eu.idestructuraubicacion = {$aliasProd}.idubicacion
                    INNER JOIN mod_logistica.dat_producto {$alias} ON {$aliasProd}.idproducto = {$alias}.idproducto
                    WHERE eu.idarea IN ({$str})";
        } elseif ($estructura['tipo'] == 1) {
            return "SELECT {$alias}.cantidad FROM mod_logistica.dat_producto {$alias}"
            . " WHERE {$alias}.idestructura = " . $estructura['id']
            . " AND {$alias}.idestructuracomun = {$this->global->Estructura->idestructura}";
        } elseif ($estructura['idestructuraubic'] == -1) {
            return "SELECT {$aliasProd}.cantidad
                    FROM mod_logubicacion.dat_ubicacionproducto {$aliasProd} 
                    inner JOIN mod_logistica.dat_producto {$alias} on {$aliasProd}.idproducto = {$alias}.idproducto
                    WHERE {$aliasProd}.idubicacion = -1 AND {$alias}.idestructura = {$estructura['idalmacen']}";
        } else {
            return "SELECT SUM({$aliasProd}.cantidad)
                    FROM mod_logubicacion.dat_estructuraubicacion eu 
                    INNER JOIN mod_logubicacion.dat_ubicacionproducto {$aliasProd} ON eu.idestructuraubicacion = {$aliasProd}.idubicacion
                    INNER JOIN mod_logistica.dat_producto {$alias} ON {$aliasProd}.idproducto = {$alias}.idproducto
                    WHERE eu.idarbol = {$estructura['id']}";
        }
    }

    private function getEntidadesHijas($params,$index,$record,&$todos,&$arrIdHijos,$ids){
        $hijos = $this->integrator->metadatos
            ->getHijosSubordinacion($record['idestructura'], $params['subordinacion']);
        if (count($hijos)) {
            // Variante de descarte de la entidad autenticada y desmarcadas. Dainier.
            $idhs = $this->objectHelper->extractValueFromArrayColumn($hijos, 'id');
            $idTemp = array_intersect($idhs, $ids);
            if ($record['id'] == $this->global->Estructura->idestructura) {
                $idHijos = implode(',', $todos);
            } else {
                $todos = array_merge($todos, (count($idTemp) > 0 ? $idTemp : $idhs));
                $idHijos = implode(',', count($idTemp) > 0 ? $idTemp : $idhs);
            }
            $arrIdHijos = array_merge($arrIdHijos, $this->objectHelper->extractValueFromArrayColumn($hijos, 'id'));
        } else {
            $todos[] = $record['id'];
            $arrIdHijos[] = $record['idestructura'];
        }
        return $idHijos;

    }
    private function cargarExistenciasMediosMateriales($params)
    {
        if ($params['reporte'] == 1) {
            $estructuras = $this->unique_multidim_array($this->getEstructuras($params), 'id');
            $ids = implode(',', $this->objectHelper->extractValueFromArrayColumn($estructuras, 'id'));
            $todos = array();
            $arrIdHijos = array();
            foreach ($estructuras as $index => $record) {
                $idestructuras = $this->getEntidadesHijas($params,$index,$record,$todos,$arrIdHijos,$ids);
                $strSelect[] = $this->buildSqlEstructura($index, $params, (strpos($idestructuras,',') !== false )? $idestructuras : $record['idestructura'], "identidad", $record);
            }
            if (count($arrIdHijos)) {
                $arrIdHijos = array_unique($arrIdHijos);
                $strIdEnt = implode(',', $arrIdHijos);
                $where[] = "ce.identidad in ({$strIdEnt})";
            }
        } else {
            $estructuras = $this->unique_multidim_array($this->getEstructurasInternas($params), 'id');
            $ids = implode(',', $this->objectHelper->extractValueFromArrayColumn($estructuras, 'id'));
            foreach ($estructuras as $index => $record) {
                $strSelect[] = $this->buildSqlEstructura($index, $params, $record['id'], "idestructura", $record);
            }
            //$estructurass = implode(',', $params['idestructuras']);
            $where [] = "ce.idestructura in ({$ids})";
        }

        $params['sqlEstructura'] = count($strSelect) ? ',' . implode(',', $strSelect) : '';

        $where [] = "ni.idindicador = {$params['idindicador']}";
        $where [] = "coalesce(ce.idcategoria,-1) = coalesce({$params['idcategoria']},-1)";

        $params['where'] = $where;

        return array(
            'datos' => Doctrine_Manager::getInstance()->getConnection('logistica')->fetchAll($this->buildSqlExistencia($params)),
            'estructuras' => $estructuras
        );
    }

    function unique_multidim_array($array, $key)
    {
        $temp_array = array();
        $i = 0;
        $key_array = array();

        foreach ($array as $val) {
            settype($val, 'array');
            if (!in_array($val[$key], $key_array)) {
                $key_array[$i] = $val[$key];
                $temp_array[$i] = $val;
            }
            $i++;
        }
        return $temp_array;
    }

    public function buildSqlEstructura($index, $params, $idestructura, $field, $record)
    {
        $as = "";
        if ($field == "identidad") {
            $as = 'ce_' . $index;
            $cantidad = ($params['concepto'] == 8 && ($params['tipocontrol'] == 1 || $params['tipocontrol'] == 4 || $params['tipocontrol'] == 2)) ? (strpos($idestructura,',') !== false)? "SUM({$as}.cantidad)" : "{$as}.cantidad" : "(case when {$as}.cantidad >= 1 then 1 else 0 end)"; //?//producto normal : //producto numero serie
            return "COALESCE((SELECT {$cantidad}
              FROM mod_loganalisis.cub_movimiento cm_{$index}
                INNER JOIN mod_loganalisis.cub_existencia {$as} ON {$as}.idproducto = cm_{$index}.idproducto
              WHERE cm_{$index}.tipodocumento = cm.tipodocumento
                AND cm_{$index}.nrodoc = cm.nrodoc AND {$as}.{$field} IN ({$idestructura}) AND {$as}.{$field} = ce.{$field}  AND {$as}.idindicador = ce.idindicador
                AND coalesce({$as}.idcategoria,-1) = coalesce(ce.idcategoria,-1) LIMIT 1),0) AS id" . abs($record['id']);
        } else {
            $as = 'aux_' . $index;
            if ($record['tipo'] == 0) {
                $cantidad = ($params['concepto'] == 8 && ($params['tipocontrol'] == 1 || $params['tipocontrol'] == 4 || $params['tipocontrol'] == 2)) ? "{$as}.cantidad" : "(case when {$as}.cantidad >= 1 then 1 else 0 end)"; //?//producto normal : //producto numero serie
                $field = 'identidad';
                return "COALESCE((SELECT {$cantidad}
              FROM mod_loganalisis.cub_movimiento cm_{$index}
                INNER JOIN mod_loganalisis.cub_existencia {$as} ON {$as}.idproducto = cm_{$index}.idproducto
              WHERE cm_{$index}.tipodocumento = cm.tipodocumento
                AND cm_{$index}.nrodoc = cm.nrodoc AND {$as}.{$field} IN ({$idestructura}) AND {$as}.{$field} = ce.{$field}  AND {$as}.idindicador = ce.idindicador
                AND coalesce({$as}.idcategoria,-1) = coalesce(ce.idcategoria,-1) LIMIT 1),0) AS id" . abs($idestructura);

                /*return "COALESCE((SELECT SUM({$cantidad})
                  FROM mod_logubicacion.dat_estructuraubicacion eu
                  INNER JOIN mod_logubicacion.dat_ubicacionproducto {$as} ON eu.idestructuraubicacion = {$as}.idubicacion
                  INNER JOIN mod_logistica.dat_producto dp ON {$as}.idproducto = dp.idproducto
                  WHERE dp.idproducto = {$params['idproducto']} AND COALESCE(dp.idcategoria,-1) = COALESCE(ce.idcategoria,-1) AND eu.idarea = ANY ('{" . implode(',', $params['idareas']) . "}')),0) AS id". abs($idestructura);;
            */} elseif ($record['tipo'] == 1) {
                $cantidad = ($params['concepto'] == 8 && ($params['tipocontrol'] == 1 || $params['tipocontrol'] == 4 || $params['tipocontrol'] == 2)) ? "SUM({$as}.cantidad)" : "(case when {$as}.cantidad >= 1 then 1 else 0 end)"; //?//producto normal : //producto numero serie
                return "COALESCE((SELECT $cantidad
                  FROM mod_logistica.dat_producto {$as}
                  WHERE {$as}.idestructura = {$record['id']} AND COALESCE({$as}.idcategoria,-1) = COALESCE(ce.idcategoria,-1) AND {$as}.idindicador = ce.idindicador
                  AND {$as}.idestructuracomun = {$this->global->Estructura->idestructura}  LIMIT 1),0) AS id" . abs($idestructura);
            } elseif ($record['idestructuraubic'] == -1) {
                $cantidad = ($params['concepto'] == 8 && ($params['tipocontrol'] == 1 || $params['tipocontrol'] == 4 || $params['tipocontrol'] == 2)) ? "{$as}.cantidad" : "(case when {$as}.cantidad >= 1 then 1 else 0 end)"; //?//producto normal : //producto numero serie
                return "COALESCE((SELECT {$cantidad}
                  FROM mod_logubicacion.dat_ubicacionproducto {$as}
                  INNER JOIN mod_logistica.dat_producto dp on {$as}.idproducto = dp.idproducto
                  WHERE {$as}.idubicacion = -1 AND COALESCE(dp.idcategoria,-1) = COALESCE(ce.idcategoria,-1) AND dp.idindicador = ce.idindicador AND dp.idestructura = {$record['idalmacen']}  LIMIT 1),0) AS id" . abs($idestructura);
            } else {
                $cantidad = ($params['concepto'] == 8 && ($params['tipocontrol'] == 1 || $params['tipocontrol'] == 4 || $params['tipocontrol'] == 2)) ? "SUM({$as}.cantidad)" : "(case when {$as}.cantidad >= 1 then 1 else 0 end)"; //?//producto normal : //producto numero serie
                return "COALESCE((SELECT {$cantidad}
                  FROM mod_logubicacion.dat_estructuraubicacion eu
                  INNER JOIN mod_logubicacion.dat_ubicacionproducto {$as} ON eu.idestructuraubicacion = {$as}.idubicacion
                  INNER JOIN mod_logistica.dat_producto dp ON {$as}.idproducto = dp.idproducto
                  WHERE eu.idarbol = {$record['id']} AND COALESCE(dp.idcategoria,-1) = COALESCE(ce.idcategoria,-1) AND dp.idindicador = ce.idindicador  LIMIT 1),0) AS id" . abs($idestructura);
            }
/*
            if ($record['tipo'] == 0) {
                return "COALESCE((SELECT {$cantidad}
                  FROM mod_logubicacion.dat_ubicacionproducto $as
                  WHERE {$as}.idproducto = {$params['idproducto']} AND {$as}.idubicacion = cpns.idubicacion),0) AS id". abs($idestructura);
            } elseif ($record['tipo'] == 1) {
                return "COALESCE((SELECT {$cantidad}
                  FROM mod_loganalisis.cub_movimiento cm_{$index}
                  INNER JOIN mod_loganalisis.cub_existencia {$as} ON {$as}.idproducto = cm_{$index}.idproducto
                  WHERE cm_{$index}.tipodocumento = cm.tipodocumento
                  AND cm_{$index}.nrodoc = cm.nrodoc AND {$as}.{$field} IN ({$idestructura}) AND {$as}.{$field} = ce.{$field}  AND {$as}.idindicador = ce.idindicador
                  AND COALESCE({$as}.idcategoria,-1) = COALESCE(ce.idcategoria,-1)),0) AS id" . abs($idestructura);
            } elseif ($record['idestructuraubic'] == -1) {
                return "COALESCE((SELECT {$cantidad}
                  FROM mod_logubicacion.dat_ubicacionproducto {$as}
                  WHERE {$as}.idubicacion = -1 AND {$as}.idubicacion = cpns.idubicacion AND {$as}.idproducto = {$params['idproducto']}),0) AS id". abs($idestructura);
            } else {
                return "COALESCE((SELECT {$cantidad}
                  FROM mod_logubicacion.dat_estructuraubicacion eu
                  INNER JOIN mod_logubicacion.dat_ubicacionproducto {$as} ON eu.idestructuraubicacion = {$as}.idubicacion
                  WHERE eu.idarbol = {$record['id']} AND {$as}.idproducto = {$params['idproducto']} AND {$as}.idubicacion = cpns.idubicacion),0) AS id". abs($idestructura);
            }*/
        }
    }

    public function buildSqlExistencia($params)
    {
        $sqlEstructura = $params['sqlEstructura'];
        $sqlWhere = count($params['where']) ? implode(' AND ', $params['where']) : '';
        $sqlOrderBy = "cm.cronologia asc";
        $sqlComm = "ni.codigo,
            ni.denominacion,
            UPPER(um.abreviaturaunidadmedida) AS umedida,
            cm.fechadoc AS fecha,
            cm.tipodocumento AS denomdocumento,
            cm.denominacionoper AS operacion,
            cm.nrodoc,";

        $sqlFromComm = "
            INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = ce.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON nih.idindicador = ce.idindicador
            LEFT JOIN mod_loganalisis.dim_categoria dcat ON dcat.idcategoria = ce.idcategoria
            LEFT JOIN mod_datosmaestros.nom_pais npais ON npais.idpais = ni.idpais
            LEFT JOIN mod_datosmaestros.nom_marca nmarc ON nmarc.idmarca = nih.idmarca
            LEFT JOIN mod_datosmaestros.nom_unidadmedida um ON um.idunidadmedida = ni.idumedida";

        if ($params['concepto'] == 8 && $params['tipocontrol'] == 3) { //producto numero serie

            $sqlExistencia = "(CASE WHEN cm.signo = '+' THEN 1 ELSE 0 END) AS entradacant,
            (CASE WHEN cm.signo = '-' THEN 1 ELSE 0 END) AS salidacant,
            ((CASE WHEN cm.signo = '+' THEN 1 ELSE 0 END) - (CASE WHEN cm.signo = '-' THEN 1 ELSE 0 END))  AS existenciaactual,
            COALESCE((((CASE WHEN cm.signo = '+' THEN 1 ELSE 0 END) - (CASE WHEN cm.signo = '-' THEN 1 ELSE 0 END)) * COALESCE(cm.preciocontable,0)),1) AS valor,
            dcat.denominacion AS categoria,";

            $sqlSelect = "COALESCE(cpns.nroserie,'-') AS nroserie,
            '-' AS nroinventario,
            COALESCE(cpns.numero,'-') AS nrocaja,{$sqlExistencia}
            cpns.annoconservacion AS annoconservacion,
            cpns.denominacionconserv AS denominacionconserv {$sqlEstructura},
            '-' AS denominacionestatustecnico";

            $sqlFrom = "mod_loganalisis.cub_productonroserie cpns
            INNER JOIN mod_loganalisis.cub_existencia ce ON ce.idproducto = cpns.idproducto
            INNER JOIN mod_loganalisis.cub_movproductonroserie cmpns ON cmpns.idnroserie = cpns.idnroserie
            INNER JOIN mod_loganalisis.cub_movimiento cm ON cm.idmovimiento = cmpns.idmovimiento {$sqlFromComm}";

        } elseif ($params['concepto'] == 8 /*&& ($params['tipocontrol'] == 1 || $params['tipocontrol'] == 4 || $params['tipocontrol'] == 2)*/) { //producto normal

            $sqlExistencia = "COALESCE((CASE WHEN cm.signo = '+' THEN ROUND(cm.cantidad,6) ELSE 0 END),0) AS entradacant,
            COALESCE((CASE WHEN cm.signo = '-' THEN ROUND(cm.cantidad,6) ELSE 0 END),0) AS salidacant,
            ((CASE WHEN cm.signo = '+' THEN ROUND(cm.cantidad,6) ELSE 0 END) - (CASE WHEN cm.signo = '-' THEN ROUND(cm.cantidad,6) ELSE 0 END))  AS existenciaactual,
            COALESCE((((CASE WHEN cm.signo = '+' THEN ROUND(cm.cantidad,6) ELSE 0 END) - (CASE WHEN cm.signo = '-' THEN ROUND(cm.cantidad,6) ELSE 0 END)) * COALESCE(cm.preciocontable,0)),0) AS valor,
            dcat.denominacion AS categoria,";

            $sqlSelect = "'-' AS nroserie,
            '-' AS nroinventario,'-' as nrocaja, {$sqlExistencia}
            '-' AS annoconservacion,
            '-' AS denominacionconserv {$sqlEstructura},
            '-' AS denominacionestatustecnico";

            $sqlFrom = "mod_loganalisis.cub_movimiento cm
            INNER JOIN mod_loganalisis.cub_existencia ce ON ce.idproducto = cm.idproducto {$sqlFromComm}";

        } elseif ($params['concepto'] == 5 /*&& $params['tipocontrol'] == 3*/) { //producto registro numerico
            $sqlExistencia = "(CASE WHEN cm.signo = '+' THEN 1 ELSE 0 END) AS entradacant,
            (CASE WHEN cm.signo = '-' THEN 1 ELSE 0 END) AS salidacant,
            ((CASE WHEN cm.signo = '+' THEN 1 ELSE 0 END) - (CASE WHEN cm.signo = '-' THEN 1 ELSE 0 END))  AS existenciaactual,
            COALESCE((((CASE WHEN cm.signo = '+' THEN 1 ELSE 0 END) - (CASE WHEN cm.signo = '-' THEN 1 ELSE 0 END)) * COALESCE(cm.preciocontable,0)),1) AS valor,
            dcat.denominacion AS categoria,";

            $sqlSelect = "COALESCE(cpna.nroserie,'-') AS nroserie,
            COALESCE(cpna.nroinventario,'-') AS nroinventario,
            '-' AS nrocaja,{$sqlExistencia}
            '-' AS annoconservacion,
            '-' AS denominacionconserv {$sqlEstructura},
            cpna.denominacionestatustecnico";

            $sqlFrom = "mod_loganalisis.cub_productonumericoactivo cpna
            INNER JOIN mod_loganalisis.cub_existencia ce ON ce.idproducto = cpna.idproducto
            INNER JOIN mod_loganalisis.cub_movproductonumericoactivo cmpna ON cmpna.idregnumerico = cpna.idproductonumericoactivo
            INNER JOIN mod_loganalisis.cub_movimiento cm ON cm.idmovimiento = cmpna.idmovimiento {$sqlFromComm}";
        }
        return "SELECT {$sqlComm} {$sqlSelect}
                FROM {$sqlFrom}
                WHERE {$sqlWhere}
                ORDER BY {$sqlOrderBy}";
    }

    public function exportarNroSerieActivo($params)
    {
        unlink("tmp/");
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = $this->cargarNroSerieActivo($params)['datos'];
        $columns = array(
            array('header' => 'Entidad', 'dataIndex' => 'entidad'),
            array('header' => '&Aacute;rea de responsabilidad', 'dataIndex' => 'arearesponsabilidad'),
            array('header' => 'Nro de serie', 'dataIndex' => 'nroserie'),
            array('header' => 'Nro de inventario', 'dataIndex' => 'nroinventario'),
            array('header' => 'Categor&iacute;a', 'dataIndex' => 'denominacioncategoria'),
            array('header' => 'Ubicaci&oacute;n', 'dataIndex' => 'denominacionubicacion'),
            array('header' => 'Valor contable', 'dataIndex' => 'valorcontable'),
            array('header' => 'Estado t&eacute;cnico', 'dataIndex' => 'denominacionestatustecnico')
        );
        $excel->writeData($datos, $columns);
        $excel->close();
        return '/logistica/inventario/replicadatos/' . $fichero;
    }

    public function exportarNroSerie($filtro)
    {
        unlink("tmp/");
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = $this->cargarNroSerie($filtro)['datos'];
        foreach ($datos as $key => $nro) {
            if (!$nro['entidad']) {
                $estructura = $this->estructuraHelper->getEstructura($nro['identidad']);
                $datos[$key]['entidad'] = $estructura[0]->codigo ? $estructura[0]->codigo : $estructura[0]->denominacion;
            }
        }
        $columns = array(
            array('header' => 'Entidad', 'dataIndex' => 'entidad'),
            array('header' => 'Dep&oacute;sito', 'dataIndex' => 'deposito'),
            array('header' => 'Ubicaci&oacute;n', 'dataIndex' => 'denominacionubic'),
            array('header' => 'N&uacute;mero', 'dataIndex' => 'numero'),
            array('header' => 'C&oacute;digo', 'dataIndex' => 'codigo'),
            array('header' => 'Denominaci&oacute;n', 'dataIndex' => 'denominacion'),
            array('header' => 'Nro de serie', 'dataIndex' => 'nroserie'),
            array('header' => 'Año de fabricaci&oacute;n', 'dataIndex' => 'annofabricacion'),
            array('header' => 'Año', 'dataIndex' => 'annoconservacion'),
            array('header' => 'Situaci&oacute;n', 'dataIndex' => 'denominacionconserv') /* ,
                  array('header' => 'Marca', 'dataIndex' => 'marca'),
                  array('header' => 'Modelo', 'dataIndex' => 'modelo'),
                  array('header' => 'N&uacute;nmero de pieza', 'dataIndex' => 'nropieza') */
        );
        $excel->writeData($datos, $columns);
        $excel->close();
        return '/logistica/inventario/replicadatos/' . $fichero;
    }

    public function exportarPartidas($filtro)
    {
        unlink("tmp/");
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = $this->cargarPartidas($filtro)['datos'];
        foreach ($datos as $key => $value) {
            if (!$value['entidad']) {
                $estructura = $this->estructuraHelper->getEstructura($value['identidad']);
                $datos[$key]['entidad'] = $estructura[0]->codigo ? $estructura[0]->codigo : $estructura[0]->denominacion;
            }
        }
        $columns = array(
//            array(
//                'header' => 'Entidad', 'dataIndex' => 'codigoestructura'
//                // ,Para el MINFAR usan el codigo como nombre en vez de usar el nombre de la estructura
//            ),
            array('header' => 'Entidad', 'dataIndex' => 'entidad'),
            array('header' => 'Dep&oacute;sito', 'dataIndex' => 'deposito'),
            array('header' => 'C&oacute;digo', 'dataIndex' => 'codigo'),
            array('header' => 'Den&oacute;minacion', 'dataIndex' => 'denominacion'),
            array('header' => 'Ubicaci&oacute;n', 'dataIndex' => 'denominacionubic'),
            array('header' => 'Estiba', 'dataIndex' => 'estiba'),
            array('header' => 'Hilera', 'dataIndex' => 'hilera'),
            array('header' => 'MGP', 'dataIndex' => 'idpartida'),
            array('header' => 'MGA', 'dataIndex' => 'idanno'),
            array('header' => 'MGF', 'dataIndex' => 'idfab'),
            array('header' => 'Cantidad', 'dataIndex' => 'existencia'),
            array('header' => 'PIM', 'dataIndex' => 'denominacionmarcapolvuno'),
            array('header' => 'PIP', 'dataIndex' => 'idpartidapolvuno'),
            array('header' => 'PIA', 'dataIndex' => 'idannopolvuno'),
            array('header' => 'PIF', 'dataIndex' => 'idfabpolvuno'),
            array('header' => 'PIIM', 'dataIndex' => 'denominacionmarcapolvdos'),
            array('header' => 'PIIP', 'dataIndex' => 'idpartidapolvdos'),
            array('header' => 'PIIA', 'dataIndex' => 'idannopolvdos'),
            array('header' => 'PIIF', 'dataIndex' => 'idfabpolvdos'),
            array('header' => 'ExM', 'dataIndex' => 'denominacionmarcaexplosivo'),
            array('header' => 'ExP', 'dataIndex' => 'idpartidaexplosivo'),
            array('header' => 'ExA', 'dataIndex' => 'idannoexplosivo'),
            array('header' => 'ExF', 'dataIndex' => 'idfabexplosivo'),
            array('header' => 'EspM', 'dataIndex' => 'denominacionmarcaespoleta'),
            array('header' => 'EspP', 'dataIndex' => 'idpartidaespoleta'),
            array('header' => 'EspA', 'dataIndex' => 'idannoespoleta'),
            array('header' => 'EspF', 'dataIndex' => 'idfabespoleta'),
            array('header' => 'EstM', 'dataIndex' => 'denominacionmarcaestopin'),
            array('header' => 'EstP', 'dataIndex' => 'idpartidaestopin'),
            array('header' => 'EstA', 'dataIndex' => 'idannoestopin'),
            array('header' => 'EstF', 'dataIndex' => 'idfabestopin')
        );
        $excel->writeData($datos, $columns);
        $excel->close();
        return '/logistica/inventario/replicadatos/' . $fichero;
    }

    public function exportarExistencia($filtro)
    {
        $dirname = dirname($_SERVER['SCRIPT_FILENAME']) . "/tmp/";
        array_map('unlink', glob("$dirname/*.*"));
        mkdir('tmp');
        $buildExcel = "buildExcel" . ($filtro['isList'] == 'true' ? "Listado" : "Modelo");
        return $this->$buildExcel($filtro);
    }

    public function buildExcelListado($filtro)
    {
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = array();
        if ($filtro['reporte'] == 1) {
            $datos = $this->cargarExistenciasxUnidad($filtro);
            $datos['estructuras'] = $this->unique_multidim_array($this->getEstructuras($filtro), 'id');
        } else {
            $datos = $this->existenciasEntidad($filtro);
            $datos['estructuras'] = $this->unique_multidim_array($this->getEstructurasInternas($filtro), 'id');
        }
        $columns = array(
            array('header' => 'C&oacute;digo', 'dataIndex' => 'codigo'),
            array('header' => 'Denominaci&oacute;n', 'dataIndex' => 'denominacion'),
            array('header' => 'Categoría', 'dataIndex' => 'categoria'),
            array('header' => 'UM', 'dataIndex' => 'umedida'),
            array('header' => 'Nacionalidad', 'dataIndex' => 'pais')
        );
        foreach ($datos['estructuras'] as $dat) {
            settype($dat, 'Array');
            array_push($columns, array('header' => ($dat['codigo'] ? $dat['codigo'] : $dat['denominacion']), 'dataIndex' => "id{$dat['id']}"));
        }
        $excel->writeData($datos['datos'], $columns);
        $excel->close();
        return '/logistica/inventario/replicadatos/' . $fichero;
    }

    public function buildExcelModelo($params)
    {
        $semilla = mktime();
        $fichero = "tmp/Libro_Control_Existencia_{$semilla}_informe.xls";
        // Create new PHPExcel object
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        // Rename worksheet
        $objPHPExcel->getActiveSheet()->setTitle("EXISTENCIAS DE PRODUCTOS");
        $datos = $result = $this->cargarExistenciasMediosMateriales($params);
        $j = 7;
        $cant = count($datos["estructuras"]) + 13;
        foreach ($datos["datos"] as $index => &$item) {
            unset($item["codigo"]);
            unset($item["denominacion"]);
            unset($item["umedida"]);
            $this->buildCellValue($objPHPExcel, $this->buildCell($objPHPExcel, 0, $j), ++$index);
            $index--;
            $r = 1;
            $keys = array_keys($item);
            foreach ($keys as $pos => $key) {
                $value = $datos["datos"][$index][$key];
                if ($index != 0) {
                    if ($key == 'existenciaactual') {
                        $value += $datos["datos"][$index - 1][$key];
                        $datos["datos"][$index][$key] = $value;
                    }
                    if ($key == 'valor') {
                        $value += $datos["datos"][$index - 1][$key];
                        $datos["datos"][$index][$key] = $value;
                    }
                    if (($pos >= 13 && $pos <= $cant) && ($item[$key] != 0)) {
                        $value = $datos["datos"][$index - 1][$key] + $item['entradacant'] - $item['salidacant'];
                        $item[$key] = $value;
                    }
                } else {
                    if (($pos > 13 && $pos <= $cant) && ($item[$key] != 0)) {
                        $value = $item[$key] = $item['existenciaactual'];
                    }
                }
                $this->buildCellValue($objPHPExcel, $this->buildCell($objPHPExcel, $r, $j), $value);
                $r++;
            }
            $j++;
        }

        $this->buildHeaderModelo($objPHPExcel, $result);
        $objPHPExcel = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objPHPExcel->save($fichero);
        return '/logistica/inventario/replicadatos/' . $fichero;
    }
    public function buildHeaderModelo(&$objPHPExcel, $datos)
    {
        $styleArray = array(
            'font' => array(
                'bold' => true,
            ),
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
                'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'rotation'   => 0,
                'wrap'    => TRUE
            )
         );

        $this->renderCell($objPHPExcel,"A3:F3","Código: " . $datos["datos"][0]["codigo"],$styleArray);
        $this->renderCell($objPHPExcel,"G3:M3","Denominación: " . $datos["datos"][0]["denominacion"],$styleArray);
        $this->renderCell($objPHPExcel,"N3:P3","Unidad de medida: " . $datos["datos"][0]["umedida"],$styleArray);

        $styleArray['alignment'] = array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
            'rotation'   => 0,
            'wrap'    => TRUE
        );
        $this->renderCell($objPHPExcel,"A4:A6","No.",$styleArray);
        $this->renderCell($objPHPExcel,"B5:E5","Documento",$styleArray);
        $this->renderCell($objPHPExcel,"B6","Fecha",$styleArray);
        $this->renderCell($objPHPExcel,"C6","Clave",$styleArray);
        $this->renderCell($objPHPExcel,"D6","Operaciones",$styleArray);
        $this->renderCell($objPHPExcel,"E6","No.",$styleArray);
        $this->renderCell($objPHPExcel,"F4:F6","Serie",$styleArray);
        $this->renderCell($objPHPExcel,"G4:G6","No. Inventario",$styleArray);
        $this->renderCell($objPHPExcel,"H4:H6","No.Caja",$styleArray);
        $this->renderCell($objPHPExcel,"I5:K5", "Total",$styleArray);
        $this->renderCell($objPHPExcel,"I6", "Entrada",$styleArray);
        $this->renderCell($objPHPExcel,"J6", "Salida",$styleArray);
        $this->renderCell($objPHPExcel,"K6", "Existencia",$styleArray);
        $this->renderCell($objPHPExcel,"L5:L6", "Valor",$styleArray);
        $this->renderCell($objPHPExcel,"M5:M6", "Categoría",$styleArray);
        $this->renderCell($objPHPExcel,"N5:O5", "Conservación",$styleArray);
        $this->renderCell($objPHPExcel,"N6", "Año",$styleArray);
        $this->renderCell($objPHPExcel,"O6", "Tipo",$styleArray);
        $cell = $this->buildCell($objPHPExcel, count($datos["estructuras"]) + 14, 5);
        $this->renderCell($objPHPExcel,"P4:{$cell}", "Ubicación",$styleArray);
        $c = 15;
        foreach ($datos["estructuras"] as $data) {
            settype($data, 'array');
            $column = $objPHPExcel->getActiveSheet()->getCellByColumnAndRow($c, 6)->getColumn();
            $this->renderCell($objPHPExcel,$column . "6", $data['denominacion'],$styleArray);
            $c++;
        }
        $cell = $this->buildCell($objPHPExcel, $c, 6);
        $this->renderCell($objPHPExcel,$cell, "Estado técnico",$styleArray);

        $cell = $this->buildCell($objPHPExcel, $c, 2);

        $this->renderCell($objPHPExcel,"A1:{$cell}", "EXISTENCIAS DE PRODUCTOS POR ENTIDADES",$styleArray);

    }

    public function buildCell(&$objPHPExcel, $i, $c)
    {
        return ($objPHPExcel->getActiveSheet()->getCellByColumnAndRow($i, $c)->getColumn() . $c);
    }
    public function renderCell(&$objPHPExcel,$cell,$value,$style,$autoSize = true)
    {
        $cells = explode(':',$cell);
        $objPHPExcel->getActiveSheet()->getColumnDimension($cell{0})->setAutoSize($autoSize);
        $objPHPExcel->getActiveSheet()->setCellValue($cells[0],$value);
        if(!empty($cells[1])){
            $objPHPExcel->getActiveSheet()->mergeCells($cell);
        }
            $objPHPExcel->getActiveSheet()->getStyle($cell)->applyFromArray($style);
    }

    public function buildCellValue(&$objPHPExcel, $column, $datos)
    {
        $styleArray = array(
            'font' => array(
                'bold' => false,
            ),
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                'vertical' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                'rotation'   => 0,
                'wrap'    => TRUE
            )
        );
        $this->renderCell($objPHPExcel,$column, $datos,$styleArray,false);
    }

    private function obtenerCamino($estructuras)
    {
        foreach ($estructuras as $value) {
            if ($value->idestructura != $this->global->Estructura->idestructura) {
                $camino[] = $value->codigo ? $value->codigo : $value->text;
            }
        }
        return implode(' / ', $camino);
    }

}
