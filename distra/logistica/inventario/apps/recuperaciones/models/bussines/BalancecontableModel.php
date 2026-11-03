<?php

class BalancecontableModel extends BaseModel {

    private $doctrineHelper, $fRedondeo;

    public function __construct() {
        parent::__construct();
        $this->doctrineHelper = LogisticaDoctrineHelper::__init();
        $this->fRedondeo = LogisticaGlobal::FACTOR_REDONDEO;
    }

    public function getDatosPrincipales($fecha = null) {
        $fecha = is_null($fecha) ? 'now()' : "'$fecha'::date";
        $sqlNameQuerY = "select case when {$fecha} >= '01/01/2021'::date then 'sbqAfter2021' else  'sbqBefore2021' end as _query;";
        $queryName = $this->doctrineHelper->getConnection()->execute($sqlNameQuerY)->fetchAll(PDO::FETCH_ASSOC);
        $queryName = $queryName[0]['_query'];
        $sql = "with sbqBefore2021 as (select sbq.idcuenta, sbq.concatcta, sum(sbq.valor) as valor
                       from (
                                select nc.idcuenta,
                                       nc.concatcta,
                                       round((coalesce((
                                                           select sum(v.importemb)
                                                           from mod_logistica.v_importetotalmov v
                                                           where v.idestructuracomun = {$this->global->Estructura->idestructura} 
                                                             and v.idclasificacion = ncc.idclasificacioncontable
                                                             and v.signo = '+'
                                                             and v.fechacontable <= {$fecha}
                                                       ), 0) - coalesce((
                                                                            select sum(v.importemb)
                                                                            from mod_logistica.v_importetotalmov v
                                                                            where v.idestructuracomun = {$this->global->Estructura->idestructura} 
                                                                              and v.idclasificacion = ncc.idclasificacioncontable
                                                                              and v.signo = '-'
                                                                              and v.fechacontable <= {$fecha}), 0)),
                                             2) as valor
                                from mod_logistica.nom_clasificacioncontable ncc
                                         join mod_contabilidad.nom_cuenta nc on nc.idcuenta = ncc.idcuenta
                                         join mod_logistica.dat_clasificacioncontableentidad cce
                                              on ncc.idclasificacioncontable = cce.idclasificacioncontable
                                where cce.idestructuracomun = {$this->global->Estructura->idestructura} 
                                  and ncc.idclasificacioncontable in (
                                    select distinct idclasificacioncontable
                                    from mod_logistica.dat_producto
                                    where cce.idestructuracomun = {$this->global->Estructura->idestructura} 
                                      and cce.idclasificacioncontable is not null
                                )
                                union
                                select nc.idcuenta,
                                       nc.concatcta,
                                       round((coalesce((
                                                           select sum(v.importema)
                                                           from mod_logistica.v_importetotalmov v
                                                           where v.idestructuracomun = {$this->global->Estructura->idestructura} 
                                                             and v.idclasificacion = ncc.idclasificacioncontable
                                                             and v.signo = '+'
                                                             and v.fechacontable <= {$fecha}
                                                       ), 0) - coalesce((
                                                                            select sum(v.importema)
                                                                            from mod_logistica.v_importetotalmov v
                                                                            where v.idestructuracomun = {$this->global->Estructura->idestructura} 
                                                                              and v.idclasificacion = ncc.idclasificacioncontable
                                                                              and v.signo = '-'
                                                                              and v.fechacontable <= {$fecha}), 0)),
                                             2) as valor
                                from mod_logistica.nom_clasificacioncontable ncc
                                         join mod_contabilidad.nom_cuenta nc on nc.idcuenta = ncc.idcuentaalt
                                         join mod_logistica.dat_clasificacioncontableentidad cce
                                              on ncc.idclasificacioncontable = cce.idclasificacioncontable
                                where cce.idestructuracomun = {$this->global->Estructura->idestructura} 
                                  and ncc.idclasificacioncontable in (
                                    select distinct idclasificacioncontable
                                    from mod_logistica.dat_producto
                                    where cce.idestructuracomun = {$this->global->Estructura->idestructura} 
                                      and cce.idclasificacioncontable is not null
                                )) sbq
                       group by sbq.idcuenta, sbq.concatcta
                       order by sbq.concatcta),
     sbqAfter2021 as (select nc.idcuenta,
                             nc.concatcta,
                             sum(round((coalesce((
                                        select sum(v.importetotal)
                                        from mod_logistica.v_importetotalmov v
                                        where v.idestructuracomun = {$this->global->Estructura->idestructura} 
                                          and v.idclasificacion = ncc.idclasificacioncontable
                                          and v.signo = '+'
                                          and v.fechacontable <= {$fecha}
                                    ),0) - coalesce((
                                        select sum(v.importetotal)
                                        from mod_logistica.v_importetotalmov v
                                        where v.idestructuracomun = {$this->global->Estructura->idestructura} 
                                          and v.idclasificacion = ncc.idclasificacioncontable
                                          and v.signo = '-'
                                          and v.fechacontable <= {$fecha}),0)), 2)) as valor
                      from mod_logistica.nom_clasificacioncontable ncc
                               join mod_contabilidad.nom_cuenta nc on nc.idcuenta = ncc.idcuenta
                               join mod_logistica.dat_clasificacioncontableentidad cce
                                    on ncc.idclasificacioncontable = cce.idclasificacioncontable
                      where cce.idestructuracomun = {$this->global->Estructura->idestructura} 
                        and ncc.idclasificacioncontable in (
                          select distinct idclasificacioncontable
                          from mod_logistica.dat_producto
                          where cce.idestructuracomun = {$this->global->Estructura->idestructura} 
                            and cce.idclasificacioncontable is not null
                      ) group by nc.idcuenta, nc.concatcta
                      order by nc.concatcta asc)
select {$queryName}.idcuenta, {$queryName}.concatcta as concatctax, {$queryName}.valor as valorinv  from {$queryName}";

        $sql = "select f.*, f.concat as concatctax,e.denominacion as estructura from mod_loginventario.f_balancecontable({$this->global->Estructura->idestructura},{$fecha}::date ) f
left join mod_estructuracomp.v_dametodasestructuras e ON e.idestructura = {$this->global->Estructura->idestructura}
order by f.concat";
        $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($datos as $pos => $cuenta) {
            $saldoCuenta = $this->getSaldoCuentaPorFecha($fecha, $cuenta['idcuenta']);
            $datos[$pos]['saldo'] = $saldoCuenta ? $saldoCuenta : 0.0;
            $datos[$pos]['diff'] = $datos[$pos]['valorinv'] - $datos[$pos]['saldo'];
            $datos[$pos]['entidad'] = $this->global->Estructura->idestructura;
        }
        return $datos;
    }

    public function getBalanceApertua() {
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
                'aperturaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $sql = "select c.concatcta as cuenta,coalesce(sum(ces.saldomb),0.0) as saldo,
                    (
                     SELECT round(sum(m.importecontable), {$this->fRedondeo}) 
                                From mod_logistica.dat_documento d
                                inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
                                inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
                                inner join mod_logistica.nom_clasificacioncontable cc on                                 
                                p.idclasificacioncontable = cc.idclasificacioncontable
                                where d.iddoc = {$objDocPrim->iddoc} and p.idestructuracomun = {$this->global->Estructura->idestructura} AND cc.idcuenta = c.idcuenta
                    ) as saldoinvcup,
                    (
                     SELECT round(sum(m.importealternativo), {$this->fRedondeo}) 
                                From mod_logistica.dat_documento d
                                inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
                                inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
                                inner join mod_logistica.nom_clasificacioncontable cc on 
                                p.idclasificacioncontable = cc.idclasificacioncontable
                                where d.iddoc = {$objDocPrim->iddoc} and p.idestructuracomun = {$this->global->Estructura->idestructura} AND cc.idcuentaalt = c.idcuenta
                    ) as saldoinvcuc,
                    {$objDocPrim->iddoc} as iddoc
                  from mod_contabilidad.nom_cuenta c 
                  inner join mod_contabilidad.res_centroelem_saldo ces on ces.idcuenta = c.idcuenta 
                            
				  inner join mod_contabilidad.dat_comprobante dco on dco.idcomprobante = ces.idcomprobante
				  inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = ces.idestructurae 
							and eec.idestructuracomun = {$this->global->Estructura->idestructura}
                  where (c.idcuenta in (
                     select distinct ncc.idcuenta from  mod_logistica.nom_clasificacioncontable ncc 
                     inner join mod_logistica.dat_producto dp on dp.idclasificacioncontable = ncc.idclasificacioncontable
                     where dp.idestructuracomun = {$this->global->Estructura->idestructura}
                  ) 
                  or c.idcuenta in (
                     select distinct ncc.idcuentaalt from  mod_logistica.nom_clasificacioncontable ncc 
                     inner join mod_logistica.dat_producto dp on dp.idclasificacioncontable = ncc.idclasificacioncontable
                     where dp.idestructuracomun = {$this->global->Estructura->idestructura}
                  )) and dco.cierreoapertura = 1
                  group by  c.idcuenta, c.concatcta order by c.concatcta";
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getSaldoCuentaPorFecha($fecha, $idCuenta) {
        $sql = "select ec.idejercicio, ec.inicio, ec.fin
				from mod_datosmaestros.dat_ejerciciocontable ec 
				where {$fecha} between ec.inicio and ec.fin";
        $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $ejercicio = $datos[0];
        $sqlSaldo = "select sum(rp.saldomb) as saldo from mod_contabilidad.res_centroelem_saldo rp
							inner join mod_contabilidad.dat_estructurae eec on eec.idestructurae = rp.idestructurae
                            where rp.idcuenta in (
                            
            SELECT ncue.idcuenta from mod_contabilidad.nom_cuenta ncue
               inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cuta where cuta.idcuenta = {$idCuenta}) c on (ncue.parent_path OPERATOR(public.<@) c.parent_path) 
            
                            
                            ) and rp.fechaemision between '{$ejercicio['inicio']}' and '{$ejercicio['fin']}'
							and eec.idestructuracomun ={$this->global->Estructura->idestructura} and rp.fechaemision <= {$fecha} 
							";
        $datos = $this->doctrineHelper->getConnection()->execute($sqlSaldo)->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0]['saldo'];
    }


    public function adicionarBalance($params)
    { 
        try {
           
            $idEstructura = $this->global->EstructuraEconomica->idestructuracomun;
            $fechaSubsist = $this->integrator->datosmaestros->fechaContableSubsistema($idEstructura, 10);
            $idusuario = $this->global->Perfil->idusuario;
           
            $collDatBalance = new Doctrine_Collection('DatBalanceContable');   
         
            foreach ($params['arrayCuentas'] as $per) {
            
                if ($per['idcuenta']){
                    $existe = Doctrine::getTable('DatBalanceContable')
                        ->findByDql('idcuenta = ? and identidad = ? and fecha = ?', array($per['idcuenta'],$per['entidad'],$fechaSubsist));                   
                }
               
                if (count($existe) == 0) {       
                    $balance = new DatBalanceContable();
                    $balance->idcuenta = $per['idcuenta'];
                    $balance->identidad =$per['entidad'];
                    $balance->fecha = $fechaSubsist;
                    $balance->idusuario = $idusuario;
                    $balance->cuenta = $per['cuenta'];
                } else {
                    $balance = $existe[0];           
                }
                $balance->valorcontable = $per['valorcontable'];
                $balance->valorinventario = $per['valorinventario'];
                $balance->diferencia = $per['diferencia'];
               

                $collDatBalance->add($balance);
                unset($existe);

            }
            if ($collDatBalance->count() > 0) {
                $collDatBalance->save();
                
            }
          
           
    } catch (Exception $e) {
        return array(
            'success' => false,
            'details' => $e->getMessage(),
            'message' => "Failed to create record"
        );
    }
   
    }

    public function cargarHistorialBalance($params){
      $conn = Zend_Registry::get('conexion');
      $sqlWhere = " ";

      if(($params['desdeBA']) && ($params['hastaBA'])){
          $sqlWhere = " AND (db.fecha BETWEEN '{$params['desdeBA']}'::date AND '{$params['hastaBA']}'::date) ";
      }
      else  if(($params['desdeBA'])){
          $sqlWhere = " AND (db.fecha >= '{$params['desdeBA']}'::date) ";
      }
      else  if(($params['hastaBA'])){
          $sqlWhere = " AND (db.fecha <= '{$params['hastaBA']}'::date) ";
      }
      $sql = "Select db.*,
      nc.descripcion as descripcion,nc.concatcta,
      su.nombreusuario
From mod_loginventario.dat_balancecontable db
    INNER JOIN mod_contabilidad.nom_cuenta nc on nc.idcuenta = db.idcuenta
    INNER JOIN mod_seguridad.seg_usuario su on su.idusuario = db.idusuario
where db.identidad = {$this->global->Estructura->idestructura} ".$sqlWhere."ORDER BY db.fecha";

   return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
   
  }    

}
