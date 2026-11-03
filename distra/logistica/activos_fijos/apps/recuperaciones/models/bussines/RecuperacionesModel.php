<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 2/23/2016
 * Time: 9:39 AM
 */
class RecuperacionesModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->doctrineHelper = LogisticaDoctrineHelper::__init();
    }

    public function getOperaciones($parametros)
    {
        $activoModel = new DocumentoActivoModel();

        $datos = $activoModel->getOperaciones($parametros);
        if ($parametros['criterio']) {
            $newDatos = array();
            foreach ($datos as $dat) {
                if (stristr($dat['denominacion'], $parametros['criterio'])) {
                    $newDatos[] = $dat;
                }
            }
            return $newDatos;
        }
        return $datos;
    }

    public function getActivosDepreciados($parametros)
    {
        $idestructura = $parametros['idestructura'];

        $select = "
            SELECT

                rna.denominacion, 
                rna.nroinventario, 
                g.denominacion as descripciongrupo,
                eop.denominacion as deposito,
                (ccosto.codigocentrogrupo || ' ' || ccosto.descripcioncentrogrupo) as centrocosto,
                (person.nombre || ' ' || person.papel || ' ' || person.sapel) as responsable, 
                nat.denominacion as naturaleza, 
                rna.tasafiscal, 
                rna.valorcontable, 
                coalesce(rna.valorcontablealternativo,0) as valorcontablealt, 
                rna.depreciacionacumulada,
                coalesce(rna.depreciacionacumuladaalternativo,0) as depreciacionalt, 
                coalesce(rna.depreciacionacumuladaalternativo,0) as depreciacionacumuladaalt,
                (rna.valorcontable - rna.depreciacionacumulada) as valorresidual,
                ( case when (rna.valorcontable - rna.depreciacionacumulada) + (rna.valorcontablealternativo - rna.depreciacionacumuladaalternativo) = 0 then 1 else 0 end ) as depreciado, 
                rna.idgruposubgrupo, 
                eop.idestructuraop,
                p.idestructuracomun as idestructura,
                rna.ultimadepreciacion,
                rna.fechaultimadep,
                dep.denominacion as metodo,
                rn.idregnumerico
        ";
        $from = "
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
            INNER JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = rna.idgruposubgrupo
            INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = rna.idnaturaleza
            INNER JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = rna.idarearesp and eop.idproyecto = 0 
            INNER JOIN mod_contabilidadcosto.nom_centrocosto ccosto on ccosto.idcentrogrupo = rna.idcentrocosto
            INNER JOIN mod_logactivofijotangible.nom_actividad act on act.idactividad = rna.idactividad
            INNER JOIN mod_logactivofijotangible.nom_depreciacion dep on dep.iddepreciacion = act.iddepreciacion
            LEFT JOIN mod_logactivofijotangible.dat_responsable resp on resp.idresponsable = rna.idresponsable 
            LEFT JOIN mod_persona.dat_persona person on person.idpersona = resp.idpersona    
        ";

        $where = " 
            WHERE p.idestructuracomun = $idestructura 
            AND ih.isuh <> 1 
        ";
        $filters = $this->useWhereActivosDepreciados($parametros);
        $sql_limit = " LIMIT {$parametros['limit']} OFFSET {$parametros['start']} ";
        
        $fullQuery = $select . $from . $where . $filters .$sql_limit;
        //print_r($fullQuery);die;
        $queryCount = " SELECT count(*) " . $from . $where . $filters;
        $datos = $this->doctrineHelper->getConnection()->execute($fullQuery)->fetchAll(PDO::FETCH_ASSOC);
        $total = $this->doctrineHelper->getConnection()->execute($queryCount)->fetchAll(PDO::FETCH_ASSOC);
        
        return array(
            'datos' => $datos,
            'total' => $total[0]['count']
        );
    }

    public function useWhereActivosDepreciados($parametros){
        //print_r($parametros);die;
        $arrWhere = [];

        if($parametros['denominacion']){
            array_push($arrWhere, " i.denominacion ilike '%{$parametros['denominacion']}%'");
        }
        if($parametros['nroinventario']){
            array_push($arrWhere, " rna.nroinventario ilike '%{$parametros['nroinventario']}%'");
        }
        if($parametros['descripciongrupo']){
            array_push($arrWhere, " ih.idgruposubgrupo = {$parametros['descripciongrupo']}");
        }
        if($parametros['deposito']){
            array_push($arrWhere, " rna.idarearesp = {$parametros['deposito']}");
        }
        if($parametros['centrocosto']){
            array_push($arrWhere, " rna.idcentrocosto = {$parametros['centrocosto']}");
        }
        if($parametros['responsable']){
            array_push($arrWhere, " rna.idresponsable = {$parametros['responsable']}");
        }
        if($parametros['naturaleza']){
            array_push($arrWhere, " i.idnaturaleza = {$parametros['naturaleza']}");
        }
        if($parametros['metodo']){
            array_push($arrWhere, " act.iddepreciacion = {$parametros['metodo']}");
        }

        foreach ($parametros['comparaciones'] as $cmp){
            if($cmp["campo"] == 'valorresidual'){
                array_push($arrWhere, " (rna.valorcontable - rna.depreciacionacumulada)  {$cmp["signo"]} {$cmp["valor"]} ");
            }else{
                if($cmp["campo"] == 'fechaultimadep'){
                    $cmp["valor"] = self::formatFecha($cmp["valor"]);
                }
                array_push($arrWhere, " rna.{$cmp["campo"]} {$cmp["signo"]} {$cmp["valor"]} ");
            }
        }
        

        
        if($parametros['tasafiscal']){
            array_push($arrWhere, " rna.tasafiscal = {$parametros['tasafiscal']}");
        }
        if($parametros['valorcontable']){
            array_push($arrWhere, " rna.valorcontable = {$parametros['valorcontable']}");
        }
        if($parametros['depreciacionacumulada']){
            array_push($arrWhere, " rna.depreciacionacumulada = {$parametros['depreciacionacumulada']}");
        }
        if($parametros['valorresidual']){
            array_push($arrWhere, " (rna.valorcontable - rna.depreciacionacumulada) = {$parametros['valorresidual']}");
        }
        if($parametros['ultimadepreciacion']){
            array_push($arrWhere, " rna.ultimadepreciacion = {$parametros['ultimadepreciacion']}");
        }
        
        if($parametros['fechaultimadep']){
            $parametros['fechaultimadep'] = self::formatFecha($parametros['fechaultimadep']);
            array_push($arrWhere, " rna.fechaultimadep = '{$parametros['fechaultimadep']}'");
        }
        if($parametros['depreciado']){
            $valor = array_sum($parametros['depreciado']);
            
            if($valor == 1){
                array_push($arrWhere, " rna.valorcontable = rna.depreciacionacumulada");
            }else if($valor == 2){
                array_push($arrWhere, " rna.valorcontable > rna.depreciacionacumulada");
            }
        }

        if(count($arrWhere) > 0){
            $arrWhere = implode($arrWhere, " and ");
            return " and " . $arrWhere;
        }
        return "";
        
    }

    public function formatFecha($date){
        
        $arr_date = explode('/', $date);
        $formated_date = [];
        array_push($formated_date, $arr_date[1], $arr_date[0], $arr_date[2]);
        $newdate = implode($formated_date, "/");
        return $newdate;
    }

    /*public function getFilter($comparacion){
        return " {$comparacion["campo"]} {$comparacion["signo"]} {$comparacion["valor"]}";
    }*/

    public function getMetodosDep()
    {
        $mDepEntidad = new DepreciarEntidadModel();
        return $mDepEntidad->getMetodosDepreciacion();

    }
    /*public function getDatosBalanceContable($parametros)
    {
        $regService = new RegNumActivoService();
        $query= $regService->getMediosDisponibles(Array(), true);


        $_mComunAFT = ComunAFTModel::getInstance();
        $operaciones = $_mComunAFT->getDatosInterfazOperacion(false, false, 'OPER_REC_ENV_REPARAR', false);
        $cEstructura = 'Estructura';
        $globalidEstructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $estructuraHelper = ServiciosEstructuraComposicionHelper::__init();
        $result = $estructuraHelper->getEstructurasHijasById(0, $globalidEstructura, false, true);
        $arrayAreas = Array();
        foreach ($result as $areas) {
            $arrayAreas[$areas['id']] = $areas['text'];
        }
        $areashijas = $this->getLlenarIDAreasHijas($result);
        $reparacion = " AND doc.idoperacion =  ".$operaciones[0]['idoperacion'];
        $query->addSelect("{$globalidEstructura} as idestructura");
doc.cronologia is null AND
        $query->Where(
            "drna.idregnumerico IN (
                SELECT dat_mov_reg.idregnumerico
                    FROM DatMovRegnumerico dat_mov_reg
                    INNER JOIN dat_mov_reg.DatMovimientos dat_mov ON dat_mov.idmovimiento = dat_mov_reg.idmovimiento
                    INNER JOIN dat_mov.DatDocumento doc ON doc.iddocumento = dat_mov.iddocumento
                    WHERE  drna.idregnumerico = dat_mov_reg.idregnumerico $reparacion
            )"
        );
        $query->addWhere('drna.valorcontable > drna.valoradquisicion');
        $query->addWhere("drna.esbaja = 0");
        $query->addWhere("drna.estaentidad = 1");
        $datos = $query->fetchArray();
        $query->WhereIn('drna.idarearesp', $areashijas);


        foreach ($datos as &$dat) {
            $dat['area'] = $arrayAreas[$dat['idarearesp']];
        }

        return $datos;

    }*/

    public function getLlenarIDAreasHijas($result)
    {
        foreach ($result as $resul) {
            $idareas[] = $resul['id'];
        }
        return $idareas;
    }

    /**
     * @param $parametros
     *
     * @return array
     */
    public function obtenerLecturasRecursosConsumidos($parametros)
    {

        $modelDepreciacion = new RegistroDepreciacionModel();
        return $modelDepreciacion->obtenerRecuperacionDepreciacion($parametros);
    }

    public function getDatosBalanceContableOld(){

        $sql = "select distinct cta.concatctax,
       q.importe as valorinv,
       coalesce(sum(ces.debito) - sum(ces.credito), 0.0) as saldo,
       cta.idcuenta
from mod_contabilidad.nom_cuenta cta
     inner join 
     (
       select ncc.idcuenta as idcuenta,
              round(sum(drega.valorcontable), 2) + coalesce((
                 select round(sum(drega2.valorcontablealternativo), 2) as importe
                 from mod_logistica.dat_producto dp2
                 inner join mod_logistica.nom_clasificacioncontable ncc2 on dp2.idclasificacioncontable = ncc2.idclasificacioncontable
                 inner join mod_logactivofijotangible.dat_registronumerico dreg2 on dreg2.idproducto = dp2.idproducto
                 inner join mod_logactivofijotangible.dat_regnumericoactivo drega2 on drega2.idregnumerico = dreg2.idregnumerico
                 where ncc2.idcuentaalt = ncc.idcuenta
                 
              ), 0) as importe
       from mod_logistica.dat_producto dp
       inner join mod_logistica.nom_clasificacioncontable ncc on dp.idclasificacioncontable = ncc.idclasificacioncontable
       inner join mod_logactivofijotangible.dat_registronumerico dreg on dreg.idproducto = dp.idproducto
       inner join mod_logactivofijotangible.dat_regnumericoactivo drega on drega.idregnumerico = dreg.idregnumerico
       where dp.idestructuracomun = {$this->global->Estructura->idestructura}
       group by ncc.idcuenta
       having sum(drega.valorcontable) > 0
       union
       select ncc.idcuentaalt as idcuenta,
              round(sum(drega.valorcontablealternativo), 2) as importe
       from mod_logistica.dat_producto dp
       inner join mod_logistica.nom_clasificacioncontable ncc on dp.idclasificacioncontable = ncc.idclasificacioncontable
       inner join mod_logactivofijotangible.dat_registronumerico dreg on dreg.idproducto = dp.idproducto
       inner join mod_logactivofijotangible.dat_regnumericoactivo drega on drega.idregnumerico = dreg.idregnumerico
       where dp.idestructuracomun = {$this->global->Estructura->idestructura} and
             ncc.idcuentaalt not in (
                   select ncc.idcuenta
                   from mod_logistica.dat_producto dp
                   inner join mod_logactivofijotangible.dat_registronumerico dreg on dreg.idproducto = dp.idproducto
      			   inner join mod_logactivofijotangible.dat_regnumericoactivo drega on drega.idregnumerico = dreg.idregnumerico
                   inner join  mod_logistica.nom_clasificacioncontable ncc on dp.idclasificacioncontable =  ncc.idclasificacioncontable
                   where dp.idestructuracomun = {$this->global->Estructura->idestructura}
             )
       group by ncc.idcuentaalt
       having sum(dp.importealternativo) > 0
     ) q on q.idcuenta = cta.idcuenta
     inner join mod_contabilidad.res_resumen_pase ces on ces.idcuenta =
       cta.idcuenta and ces.idestructuracomun = {$this->global->Estructura->idestructura}
        group by cta.concatctax,
                 q.importe,
                 cta.idcuenta
        order by cta.concatctax";
        $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getDatosBalanceContable($idEstructura)
    {
    //     $idEstructura = $this->global->Estructura->idestructura;
    //     $idEjercicioActual = $this->integrator->datosmaestros->ejercicioActualSubsistema($idEstructura, 4);
    //     $conn = Zend_Registry::get('conexion');
	// 	$sql = "select * from mod_logactivofijotangible.f_balancecontbaleaft({$idEstructura}, {$idEjercicioActual})";
    //     //$datos = $conn->fetchAll($sql);
       
    //     //$datos = Doctrine_Manager::connection()->fetchAll($sql);
    //   //  print_r($sql);die;
    //     return $datos;




        $idEstructura = $this->global->Estructura->idestructura;
        $idEjercicioActual = $this->integrator->datosmaestros->ejercicioActualSubsistema($idEstructura, 4);
		
		
		
        $datos = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logactivofijotangible.f_balancecontbaleaft({$idEstructura}, {$idEjercicioActual})"
        );
        return $datos;
    }

    public function getConfGruposCuentas($grupo)
    {
        $cfgGrupoCueta = new ConfgruposcuentasModel();
        $_sContabilidad = ServiciosContabilidadFinanzasHelper::__init();
        $conn = Zend_Registry::get('conexion');
        $query = "Select cfgp.idgruposubgrupo, cfgp.idcuentaactivo, cfgp.idcuentadepreciacion, cfgp.idestructura,
                 cfgp.idcuentaactivoalternativa, cfgp.idcuentadepreciacionalternativa 
                 from mod_logactivofijotangible.conf_gruposcuentas cfgp
                 where cfgp.idgruposubgrupo = {$grupo} and cfgp.idestructura = {$this->global->Estructura->idestructura}
                 ";

        $aux = $conn->fetchAll($query);
        $dualidad = $cfgGrupoCueta->devolverDualidadMonetaria();
        if(count($aux) > 0) {
            foreach ($aux as $index => $row) {
                if ($dualidad['alternativa']) {
                    $denoContable = strtolower($dualidad['monedas']['nomacontable']);
                    $denoAlter = strtolower($dualidad['monedas']['nomalternativa']);

                    $cuentas = $_sContabilidad->obtenerCuentaPorId($row['idcuentaactivo']);
                    $aux[$index]['desccuentaActivos'.$denoContable] = $cuentas->text;
                    $cuentas = $_sContabilidad->obtenerCuentaPorId($row['idcuentadepreciacion']);
                    $aux[$index]['desccuentaDepreciacion'.$denoContable] = $cuentas->text;
                    $cuentas = $_sContabilidad->obtenerCuentaPorId($row['idcuentaactivoalternativa']);
                    $aux[$index]['desccuentaActivos'.$denoAlter] = $cuentas->text;
                    $cuentas = $_sContabilidad->obtenerCuentaPorId($row['idcuentadepreciacionalternativa']);
                    $aux[$index]['desccuentaDepreciacion'.$denoAlter] = $cuentas->text;
                } else {
                    $cuentas = $_sContabilidad->obtenerCuentaPorId($row['idcuentaactivo']);
                    $aux[$index]['desccuentaActivos'] = $cuentas->text;
                    $cuentas = $_sContabilidad->obtenerCuentaPorId($row['idcuentadepreciacion']);
                    $aux[$index]['desccuentaDepreciacion'] = $cuentas->text;
                }
            }
            return $aux;
        } else {
            $array[0] = array();
            return $array;
        }

    }
    public function getEstructuraPadre()
    {
        $conn = Zend_Registry::get('conexion');
        $query = "Select f.parent_path
                 from mod_estructuracomp.nom_filaestruc f
                 where f.idfila = {$this->global->Estructura->idestructura}
                 ";
        $resp = $conn->fetchAll($query);
        $entidades_path = explode(".", $resp[0]['parent_path']);
        return $entidades_path[0];

    }
	
	public function getDatosValoresAreas($parametros)
    {
        $idEstructura = $this->global->Estructura->idestructura;
		$tiposMedios = ($parametros['tiposmedios']) ? $parametros['tiposmedios'] : 3 ;
		$datos = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logactivofijotangible.f_valoresareas({$idEstructura}, {$tiposMedios})"
        );
        return $datos;
    }

    public function guardarParamsReports($params) {
        $sqlDel = "delete from mod_logactivofijotangible.rep_params where idusuario = {$this->global->Perfil->idusuario} 
                  and reportname = '{$params['reportname']}'";

        Doctrine_Manager::connection()->execute($sqlDel);

        $sqlInsertMt = "INSERT INTO mod_logactivofijotangible.rep_params
                            (
                              idusuario,idareas,reportname
                            ) VALUES (
                              {$this->global->Perfil->idusuario}, '{$params['areas']}', '{$params['reportname']}'
                            )";

        Doctrine_Manager::connection()->fetchAll($sqlInsertMt);

       // return $this->global->Estructura->idestructura;
        return $this->global->Perfil->idusuario;
    }

}
