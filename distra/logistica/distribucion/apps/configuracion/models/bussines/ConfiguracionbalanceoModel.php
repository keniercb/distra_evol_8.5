<?php

class ConfiguracionbalanceoModel extends BaseModel
{

 private $idestructuracomun;
 private $configuracionHelper;
 private $idejercicio;
 private $fechainicio;
 private $fechafin;

 public function setUp()
 {
  parent::ZendExt_Model();
 }

 public function __construct()
 {
  parent::__construct();
  $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
  $this->idestructuracomun = $this->global->Estructura->idestructura;

  $this->idejercicio = $this->configuracionHelper->getEjercicioActualSubsistema(
   $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
  );
  $ejercicio = $this->integrator->datosmaestros->obtenerEjercicio($this->idejercicio, $this->idestructuracomun);
  $this->fechainicio = "'" . $ejercicio[0]->inicio . "'";
  $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->idestructuracomun, 10);
  $this->fechafin = "'" . $fecha->fecha . "'";
 }

 public function getDepositosEntidad($parametros)
 {
  $sql = "select distinct
        v_est.idestructura as iddeposito,
        p.idestructuracomun as idestructura,
        v_est_entidad.denominacion as entidad,
        (
         (
          CASE WHEN
             v_est.codigo is not null
             and trim(v_est.codigo) <> ''
             then (v_est.codigo || ' - ' || v_est.denominacion)
             else v_est.denominacion
             END
          )
        ) as deposito,
         (CASE WHEN cfgbal.iddeposito IS NOT NULL THEN 1 ELSE 0 END) as excluido,
         (CASE WHEN depcd.iddeposito IS NOT NULL THEN 1 ELSE 0 END) as cuadrediario,
         (CASE WHEN cfgpub.iddeposito IS NOT NULL THEN 1 ELSE 0 END) as publico
         from mod_estructuracomp.v_dametodasestructuras v_est
         inner join mod_logistica.dat_producto p on p.idestructura = v_est.idestructura
         inner join mod_estructuracomp.v_dametodasestructuras v_est_entidad on p.idestructuracomun = v_est_entidad.idestructura
         left join mod_logdistribucion.conf_depositobalanceo cfgbal on cfgbal.iddeposito = v_est.idestructura
         left join mod_logdistribucion.conf_depositocuadrediario depcd on depcd.iddeposito = v_est.idestructura
         left join mod_logdistribucion.conf_depositopublico cfgpub on cfgpub.iddeposito = v_est.idestructura
         where v_est.idconcepto = 8

        ";
  // est estop -> v_est_entidad
  // estop1 -> v_est

  $where = array();

  if ($parametros['entidad']) {
   array_push($where, " v_est_entidad.denominacion ILIKE '%{$parametros['entidad']}%' ");
  }
  if ($parametros['deposito']) {
   array_push($where, " v_est.denominacion ILIKE '%{$parametros['deposito']}%' ");
  }
  if ($parametros['excluido']) {
   $whereExc = array();
   foreach ($parametros['excluido'] as $key => $value) {
    if ($value == 'si') {
     // excluidos
     array_push($whereExc, " cfgbal.iddeposito IS NOT NULL ");
    } else {
     // no excluidos
     array_push($whereExc, " cfgbal.iddeposito IS NULL ");
    }
   }
   array_push($where, ' (' . implode(' OR ', $whereExc) . ') ');
  }
     if ($parametros['publico']) {
         $wherePub = array();
         foreach ($parametros['publico'] as $key => $value) {
             if ($value == 'si') {
                 // excluidos
                 array_push($wherePub, " cfgpub.iddeposito IS NOT NULL ");
             } else {
                 // no excluidos
                 array_push($wherePub, " cfgpub.iddeposito IS NULL ");
             }
         }
         array_push($where, ' (' . implode(' OR ', $wherePub) . ') ');
     }

  if ($parametros['criterio']) {
   array_push($where, "((v_est_entidad.denominacion ILIKE '%{$parametros['criterio']}%' AND v_est_entidad.idestructura is not null)
                    OR v_est.denominacion ILIKE '%{$parametros['criterio']}%'
                    OR v_est.codigo ILIKE '%{$parametros['criterio']}%')");
  }

  if (count($where) > 0) {
   $sql .= " AND " . implode(' AND ', $where);
  }

  $conn = Zend_Registry::get('conexion');
  $sqlTotal = "
            select count (sub.iddeposito) as total
            from ( $sql ) sub
        ";

  $total = $conn->fetchAll($sqlTotal);
  $sql .= " ORDER BY entidad, deposito ";
  if ($parametros['limit'] && $parametros['start'] >= 0) {
   $sql .= " limit {$parametros['limit']} offset {$parametros['start']} ";
  }

  $arraydatos = $conn->fetchAll($sql);

  return array(
   'datos' => $arraydatos,
   'total' => $total[0]['total'],
  );
 }

 public function adicionarExcluidos($iddepositos)
 {
  $sqlparams = implode('),(', $iddepositos);
  $delete = implode(',', $iddepositos);
  $sqlDelete = "delete from mod_logdistribucion.conf_depositobalanceo where iddeposito in ({$delete});";
  $sql = "
            INSERT INTO
                mod_logdistribucion.conf_depositobalanceo
            (
                iddeposito
            )
            VALUES ($sqlparams);
        ";
  /*
  ON CONFLICT ON CONSTRAINT conf_depositocuadrediario_pkey
  DO NOTHING*/
  $conn = Zend_Registry::get('conexion');
  $conn->execute($sqlDelete);
  $iddepositosExcluidos = $conn->execute($sql);
  return true;
 }

 public function eliminarExcluidos($iddepositos)
 {
  $sqlparams = implode(',', $iddepositos);
  $sql = "
            DELETE FROM
                mod_logdistribucion.conf_depositobalanceo
            WHERE
                iddeposito IN ($sqlparams)
            ;
        ";
  $conn = Zend_Registry::get('conexion');
  $iddepositosExcluidos = $conn->execute($sql);
  return true;
 }

    public function adicionarPublicos($iddepositos)
    {
        $sqlparams = implode('),(', $iddepositos);
        $delete = implode(',', $iddepositos);
        $sqlDelete = "delete from mod_logdistribucion.conf_depositopublico where iddeposito in ({$delete});";
        $sql = "
            INSERT INTO
                mod_logdistribucion.conf_depositopublico
            (
                iddeposito
            )
            VALUES ($sqlparams);
        ";
        /*
        ON CONFLICT ON CONSTRAINT conf_depositocuadrediario_pkey
        DO NOTHING*/
        $conn = Zend_Registry::get('conexion');
        $conn->execute($sqlDelete);
        $iddepositosExcluidos = $conn->execute($sql);
        return true;
    }

    public function eliminarPublicos($iddepositos)
    {
        $sqlparams = implode(',', $iddepositos);
        $sql = "
            DELETE FROM
                mod_logdistribucion.conf_depositopublico
            WHERE
                iddeposito IN ($sqlparams)
            ;
        ";
        $conn = Zend_Registry::get('conexion');
        $iddepositosExcluidos = $conn->execute($sql);
        return true;
    }

/*  public function adicionarCuadreDiario($iddepositos)
{
$sqlparams = implode('),(', $iddepositos);
$sql = "INSERT INTO
mod_logdistribucion.conf_depositocuadrediario
(
iddeposito
)
VALUES ($sqlparams);
";
$conn = Zend_Registry::get('conexion');
$iddepositosCuadreSi = $conn->execute($sql);
return true;
} */

/*  public function eliminarCuadreDiario($iddepositos)
{
$sqlparams = implode(',', $iddepositos);
$sql = "
DELETE FROM
mod_logdistribucion.conf_depositocuadrediario
WHERE
iddeposito IN ($sqlparams)
;
";
$conn = Zend_Registry::get('conexion');
$iddepositosCuadreNo = $conn->execute($sql);
return true;
} */

 public function cargarClasificacion($params)
 {
  $conn = Zend_Registry::get('conexion');
  $sql = "select distinct p.idestructura,ncc.idclasificacioncontable,ncc.denominacion,
            p.idestructuracomun,coalesce(c.idcuenta,ncc.idcuenta) as idcuenta,
            (case when c.idcuenta is null then nc.concatcta else c.concatcta end) as concatcta,
            (case when cf.idconfdeposito is null then 0 else 1 end) as activo
            from mod_logistica.nom_clasificacioncontable ncc
            inner join mod_logistica.dat_producto p on p.idclasificacioncontable = ncc.idclasificacioncontable
            left join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = p.idestructura
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = ncc.idcuenta
            inner join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = p.idestructura
            left join mod_contabilidad.nom_cuenta c on c.concatcta = nc.concatcta||'.'||op.codigo
            where p.idestructura = {$params['idestructuracomun']}";

  /*$sql = "select distinct ncc.idclasificacioncontable,ncc.denominacion,
  case when ncc.idclasificacioncontable > 0 then 1 else 0 end as activo,
  nc.idcuenta
  from mod_logistica.nom_clasificacioncontable ncc
  inner join mod_logistica.dat_producto p on p.idclasificacioncontable = ncc.idclasificacioncontable
  left join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = p.idestructura

  inner join mod_contabilidad.nom_cuenta nc on (nc.idcuentapadre = ncc.idcuenta or nc.idcuenta = ncc.idcuenta)
  LEFT join mod_contabilidad.dat_comprobante_documento cp on cp.iddeposito = p.idestructura
  LEFT join mod_contabilidad.res_centroelem_saldo rs on rs.idcomprobante = cp.idcomprobante and rs.idcuenta = nc.idcuenta

  where p.idestructura = {$params['idestructuracomun']}
  and rs.fechaemision between {$this->fechainicio} and {$this->fechafin}
  order by ncc.denominacion";*/
  /*  select distinct ncc.idclasificacioncontable,ncc.denominacion,
  case when cf.idconfdeposito is null then 0 else 1 end as activo
  from mod_logistica.nom_clasificacioncontable ncc
  inner join mod_logistica.dat_producto p on
  p.idclasificacioncontable = ncc.idclasificacioncontable
  left join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = {$params['idestructuracomun']}
  and cf.idclasificacioncontable = p.idclasificacioncontable
  where p.idestructura = {$params['idestructuracomun']} order by ncc.denominacion */
  $addStartLimit = " offset {$params['start']} limit {$params['limit']}";

  $total = count($conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN));
  return array(
   'cantidad' => $total,
   'datos' => $conn->execute($sql . $addStartLimit)->fetchAll(PDO::FETCH_ASSOC),
  );

 }

 public function adicionarEntidadeClasificaciones($iddeposito, $clasifSelecionadas, $idestructura)
 {
  $sql = "delete from mod_logdistribucion.conf_depositocuadrediario where iddeposito = {$iddeposito}";
  $conn = Zend_Registry::get('conexion');
  $conn->fetchAll($sql);
  foreach ($clasifSelecionadas as $datosClasif) {
   $sql = "INSERT INTO mod_logdistribucion.conf_depositocuadrediario
				(
				  iddeposito, idclasificacioncontable, idestructura, idcuenta
				)
				VALUES (
				  $iddeposito,$datosClasif->idclasificacioncontable, $idestructura, $datosClasif->idcuenta
				)";
   $conn->fetchAll($sql);
  }
  return true;
 }

 public function guardarcargainicial()
 {
  $conn = Zend_Registry::get('conexion');
  $sql = "SELECT * FROM mod_loginventario.fn_cuadrediario_apertura({$this->fechainicio},{$this->fechafin}, 1, 1)";
  return $conn->fetchAll($sql);
 }

 public function guardarNaturalezas($params) {
     foreach ($params['data'] as $d) {
         $sql = "INSERT INTO mod_logdistribucion.dat_depositonaturaleza
				(
				  iddeposito, idnaturaleza
				)
				VALUES (
				  {$params['iddeposito']}, {$d->idnaturaleza}
				)";
         $this->doctrineHelper->getConnection()->execute($sql)->fetchAll();
     }

     return true;
 }

 public function devolverNaturalezasByDeposito($params)
 {
     $limit = $filtro = "";
     if ($params['query']) {
         $filtro .= " and (nat.codigo ilike '%{$params['query']}%' or 
            nat.denominacion ilike '%{$params['query']}%') ";
     }
     if (isset($parametros['start']) && isset($parametros['limit'])) {
         $limit .= " offset {$params['start']} limit {$params['limit']} ";
     }
     $respuesta = $this->doctrineHelper->getConnection()->execute(
         "select dn.iddepositonaturaleza, nat.codigo, nat.denominacion, COUNT(*) OVER() as total from mod_logdistribucion.dat_depositonaturaleza dn
          inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = dn.idnaturaleza
          where dn.iddeposito = {$params['iddeposito']}{$filtro} 
          order by nat.codigo{$limit}"
     )->fetchAll(PDO::FETCH_ASSOC);

     return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
 }

 public function cargarNaturalezas($params) {
     $params['dql'] = 1;
     $query = $this->configuracionHelper->obtenerDatosArbolNaturaleza($params);
     $ids = $this->doctrineHelper->getConnection()->execute(
         "select nat.idnaturaleza from mod_logdistribucion.dat_depositonaturaleza dn
          inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = dn.idnaturaleza
          where dn.iddeposito = {$params['iddeposito']}"
     )->fetchAll(PDO::FETCH_COLUMN);

     $query->addSelect('codigo')->whereNotIn('idnaturaleza', $ids);
     if($params['criterio']) {
         $query->andWhere("(denominacion ilike '%{$params['criterio']}%' OR codigo ilike '%{$params['criterio']}%')");
     }
     $cantidad = $query->count();
     $query->offset($params['start'])->limit($params['limit']);
     $naturalezas = $query->fetchArray();
     foreach ($naturalezas as &$nat){
         //if (!in_array($nat['idnaturaleza'], $ids)){
         $nat['denominacion'] = $nat['codigo'].' '.$nat['text'];
         //$opernew[] = $nat;
         // }
     }
     return array('datos'=>$naturalezas, 'cantidad'=>$cantidad);
 }

 public function eliminarNaturalezas($params) {
     $naturalezas = implode(',', $params['naturalezas']);
     $sql = "delete from mod_logdistribucion.dat_depositonaturaleza where iddepositonaturaleza in ({$naturalezas})";
     Doctrine_Manager::connection()->fetchAll($sql);

     return true;
 }

}
