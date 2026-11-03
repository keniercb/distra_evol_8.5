<?php

/**
 *
 */
class MovimientoActivoFijoModel extends LogisticaMovimientoModel
{
    protected $_mProdLogistica, $_mMProducto, $_mComunAFT, $_sConfAFT, $_sRegNumerico, $_mRegNumerico;
    protected $idsubsistema;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        $this->idsubsistema = $idsubsistema;
        parent::__construct();


        $this->_mProdLogistica = new LogisticaProductoModel();
        $this->_mMProducto = new MaestroProductoModel();
        $this->_mComunAFT = ComunAFTModel::getInstance($this->idsubsistema);
        $this->_mRegNumerico = new RegNumericoModel();
        $this->_sConfAFT = new ConfiguracionActivosService();
        $this->_sRegNumerico = new RegNumericoService();
    }


    public function getDatosInventarioParcialMensual($parametros){
      
        $strProds = implode(',', $parametros['productos']);

        $sql = "
          SELECT 
            p.idproducto, 
            p.cantidad, 
            g.denominacion as descripciongrupo,
            gh.tasafiscalmin as tasafiscalmin,
            gh.tasafiscalmax as tasafiscalmax,
            gh.porcientorecuperacion as porcientorecuperacion,
            gh.vidautil as vidautil,
              ((Case When ih.idmarca is not null Then (marc.denominacion || (Case When ih.idmodelo is not null Then
                      ' - ' Else '' End)) Else '' End) || (Case When ih.idmodelo is not null Then mod.denominacion Else ''
                      End)) AS descripcionmarcamodelo,
            p.idestructuracomun as idestructuracomun,
            i.denominacion,
            i.codigo
          FROM mod_logistica.dat_producto p
          INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
          INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
          LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
          LEFT JOIN mod_datosmaestros.nom_gruposubgrupohoja gh on gh.idgruposubgrupo = g.idgruposubgrupo
          LEFT JOIN mod_datosmaestros.nom_marca marc on marc.idmarca = ih.idmarca
          LEFT JOIN mod_datosmaestros.nom_modelo mod on mod.idmodelo = ih.idmodelo
         

          WHERE p.idproducto in ($strProds)
        ";
        if ($parametros['idgruposubgrupo']) {
          $sql .= " AND g.idgruposubgrupo = {$parametros['idgruposubgrupo']} ";
        }
        if ($params['natinmuebleP'] && $params['natobjobraP']) {
          $sql .= " AND i.idnaturaleza NOT IN ({$params['natinmuebleP']},{$params['natobjobraP']}) ";
        }
        $sql .=  " ORDER BY p.idproducto";


        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        return $datos;

    }


    /**
     *  Devolver arreglo (datos, cantidad) de nomenclaturas de medios en un documento
     */
    public function getDatos($parametros)
    {
        $parametros['prodareas'] = true;
        if ($parametros['inventarioTotal']) {
            unset($parametros['idestructura']);
        }
        if ($parametros['elaboracion'] && ($parametros['inventarioTotal'] || $parametros['inventarioParcialMensual'])) {
            unset($parametros['iddocumento']);
        }
         
        if($parametros['inventarioParcialMensual'] && $parametros['elaboracion']){
          
          $datos = $this->getDatosInventarioParcialMensual($parametros);
          $cantidad = count($datos);
          return array('datos' => $datos, 'cantidad' => $cantidad); 
        
        } else {

        $query = $this->_mProdLogistica->devolverMovimientos($parametros, true);

        //   print_r($datosprod);die;
        //   print_r($idestructura);die;
        //   $regquery = "Select dmrna.denominacion, dmrna.idgruposubgrupo, dmrna.idnaturaleza,dp.cantidad, dmrna.codigo
        //                 from mod_logactivofijotangible.dat_movregnumericoactivo dmrna
        //                 left join mod_logactivofijotangible.dat_movregnumerico dmr on dmr.idmovregnumerico = dmrna.idmovregnumerico
        //                 left join  mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = dmr.idregnumerico
        //                 left join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
        //         where dmrna.idarearesp = $idestructura";   
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'NomGruposubgrupo',
            'properties' => array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'NomNaturaleza',
            'properties' => array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza')
        ); 
        
        $this->doctrineHelper->tryInyectRelactions(new DatMovRegnumericoActivo, $relations);
         
          //$query->leftJoin('p.DatRegnumerico drn');  
          $query->leftJoin('mov.DatMovRegnumerico dmrn');    
          $query->leftJoin('dmrn.DatMovRegnumericoActivo dmrna');  
          $query->leftJoin('dmrna.NomGruposubgrupo ngsub');
          $query->leftJoin('ngsub.NomGruposubgrupohoja ngsh');
          $query->leftJoin('dmrna.NomNaturaleza natu ');
          $query->leftJoin('ih.NomMarca marca');
          $query->leftJoin('ih.NomModelo modelo');
          $query->leftJoin('ih.NomGruposubgrupo ngsub1');
         // $query->leftJoin("dmrna.NomActividadMedio nact");

          $query->addSelect("ngsub1.denominacion AS descripciongrupo");          
         // $query->addSelect("nact.denominacion AS grupoexplotacion");
       //   $query->addSelect("nact.idactividad AS idactividad");
          $query->addSelect(
              'ngsh.tasafiscalmin as tasafiscalmin,
               ngsh.tasafiscalmax as tasafiscalmax,
               ngsh.porcientorecuperacion as porcientorecuperacion,
               ngsh.vidautil as vidautil'
          );
          $query->addSelect(
              "((Case When ih.idmarca is not null Then (marca.denominacion || (Case When ih.idmodelo is not null Then
               ' - ' Else '' End)) Else '' End) || (Case When ih.idmodelo is not null Then modelo.denominacion Else ''
               End)) AS descripcionmarcamodelo"
          );
          //$query->addSelect("coalesce(p.denominacion, i.denominacion) as denominacion");
          $query->addSelect('p.idestructuracomun as idestructuracomun');
          $query->addSelect('natu.denominacion as naturaleza');
          $query->orderBy('p.idestructura');
  
          if (($parametros['inventarioParcialMensual'] ||
              $parametros['inventarioTotal']) && $parametros['productos']) {
              $operEntrada = ComunAFTModel::getInstance()->getArrayOperacionEntrada();
              $query->andWhereIn('p.idproducto', $parametros['productos']);
              $query->innerJoin('mov.DatDocumento doc');
              $query->addSelect('doc.idoperacion as idoperacion');
              $query->addSelect('doc.nrodoc as nrodoc');
              $query->andWhere('doc.estado = 3');
             // $query->andWhere('doc.codigooperacion = OPER_MOD_PROPIEDAD');
              $query->andWhereIn('doc.idoperacion', $operEntrada);
          }
          $query->addSelect("(case when ih.idmarca is null or ih.idmodelo is null then COALESCE(dmrna.denominacion, i.denominacion) else i.denominacion end) AS denominacion");
         // $query->addSelect("dmrna.denominacion AS denominacion");
        //   
          //--
          if ($parametros['idgruposubgrupo']) {
              $query->addWhere("ngsub.idgruposubgrupo = {$parametros['idgruposubgrupo']}");
          }
  
          $this->filtrarDatos($parametros, $query);
  
         $cantidad = $query->count();
        
  
  
  
          if ($parametros['limit']) {
              $query->offset($parametros['start']);
              $query->limit($parametros['limit']);
          }
         // print_r($query->getSqlQuery());die;
         
  
  
          $datos = $query->fetchArray();
          $persona = ServiciosRecursosHumanosHelper::__init();
  
          foreach ($datos as $index => $dat) {
              $conn = Zend_Registry::get('conexion');
              $select = " select area.idresponsable, res.idpersona";
              if ($parametros['tipo'] == 1) {
                  $tabla = 'mod_logpatrimonio.conf_responsableareapatrimonio';
              } else {
                  $tabla = 'mod_logactivofijotangible.conf_responsablearea';
              }
              $from = " from $tabla area "
                  ." inner join mod_logactivofijotangible.dat_responsable res on res.idresponsable = area.idresponsable";
              $where = " WHERE area.idarearesp = {$dat['idestructura']}";
              $sqlDatos = $select.$from.$where;
              $resultsql = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
  
              $result = $persona->buscarPersonaPorArreglodeID(array($resultsql[0]['idpersona']));
              $datos[$index]['responsable'] = $result[0]['idpersona'];
              $datos[$index]['denomresponsable'] = $result[0]['nombre']." ".$result[0]['papel']." ".$result[0]['sapel'];
          }
        //   foreach ($resultemp as $index => $dat) {
        //     $conn = Zend_Registry::get('conexion');
        //     $select = " select area.idresponsable, res.idpersona";
        //     if ($parametros['tipo'] == 1) {
        //         $tabla = 'mod_logpatrimonio.conf_responsableareapatrimonio';
        //     } else {
        //         $tabla = 'mod_logactivofijotangible.conf_responsablearea';
        //     }
        //     $from = " from $tabla area "
        //         ." inner join mod_logactivofijotangible.dat_responsable res on res.idresponsable = area.idresponsable";
        //     $where = " WHERE area.idarearesp = {$dat['idestructura']}";
        //     $sqlDatos = $select.$from.$where;
        //     $resultsql = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

        //     $result = $persona->buscarPersonaPorArreglodeID(array($resultsql[0]['idpersona']));
        //     $resultemp[$index]['responsable'] = $result[0]['idpersona'];
        //     $resultemp[$index]['denomresponsable'] = $result[0]['nombre']." ".$result[0]['papel']." ".$result[0]['sapel'];
        // }
        // print_r($query);die;
          return array('datos' => $datos, 'cantidad' => $cantidad);
        
        }

    }

    /*     * *
     * @param $params
     * @param $query
     */

    public function filtrarDatos($params, &$query)
    {
        if ($params['natinmuebleP'] && $params['natobjobraP']) {
            $query->andWhereNotIn(
                'i.idnaturaleza', array($params['natinmuebleP'], $params['natobjobraP'])
            );
        }
    }


    public function verificarguardado($parametros){
        
        $datos = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logactivofijotangible.f_modelo_resumen({$parametros['iddocumento']})"
        );

        $estados = array_column($datos, 'estado');
        $estadosPermitidos = ["verificado", "faltante", "sobrante"];
        $guardado = count(array_intersect($estados, $estadosPermitidos)) > 0 ? 1 : 0;
        return $guardado;

    }

    /**
     *  Devolver arreglo de llaves de las nomenclaturas de medios insertadas en un documento
     */
    public function getArrActivosEnDoc($idDocumento)
    {
        $respuesta = array();

        $query = $this->_mProdLogistica->getQueryProducto('p');
        $query->select('p.idindicador');
      
        $query = parent::getInnerJoinDatMovimiento($query, 'p', 'm');
        $query->addWhere('m.iddocumento = ?', $idDocumento);
        foreach ($query->fetchArray() as $value) {
            $respuesta[] = $value['idindicador'];
        }

        return $respuesta;
    }

    /**
     *
     */
    public function adicionarProductos($idAreaResp, $arrayIdprod, $idDocumento, $idOperacion)
    {
        $operacion = $this->_mComunAFT->getDatosInterfazByIdOperacion($idOperacion);

        $collectionProductos = new Doctrine_Collection('DatProductoLogistica');
        $datosProducto = array('idestructura' => $idAreaResp,
            'iddocumento' => $idDocumento,
            'signo' => $operacion['signo']
        );
        foreach ($arrayIdprod as $idprod) {
            $datosProducto['idindicador'] = $idprod;
            $producto = $this->adicionarProducto($datosProducto);

            if (!$producto->idproducto) {
                $producto->cantidad = 0;
                $producto->disponible = 0;
            }

            $collectionProductos->add($producto);
        }
        if ($collectionProductos->count()) {
            $collectionProductos->save();
        }

        return true;
    }

    /**
     * @params $datos Arreglo que contiene los datos del producto
     */
    public function adicionarProducto($datos)
    {
        $producto = new DatProductoLogistica();
        $classMov = 'DatMovimientos';
        if (!$datos['idproducto']) {

            $query = Doctrine_Query::create()
                ->select('p.idproducto as idproducto')
                ->from('DatProductoLogistica p')
                ->where('p.idestructura = ? and p.idindicador = ?')
                ->fetchOne(array($datos['idestructura'], $datos['idindicador']));

            $datos['idproducto'] = $query->idproducto;
        }

        if ($datos['idproducto']) {
            $producto->assignIdentifier($datos['idproducto']);
        }

        $producto->synchronizeWithArray($datos);
        $movimientoProducto = $this->adicionarMovimiento($datos);

        if (!$movimientoProducto->idmovimiento) {
            $producto->$classMov->add($movimientoProducto);
        }
        return $producto;
    }

    public function getDatosBalanceContable($idEstructura)
    {
        $idEstructura = $this->global->Estructura->idestructura;
        $idEjercicioActual = $this->integrator->datosmaestros->ejercicioActualSubsistema($idEstructura, 4);	
        $datos = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logactivofijotangible.f_balancecontbaleaft({$idEstructura}, {$idEjercicioActual})"
        );
       // print_r($idEstructura);die;
        return $datos;
    }

    public function modificarProducto($datos)
    {
        //$producto = new DatProductoLogistica();
        // $producto = new DatRegnumericoActivo();
        // if ($datos['idproducto']) {
        //     $prod = Doctrine::getTable('DatRegnumerico')->findByDql('idproducto = ?', array($datos['idproducto']));
        //     //$prod = Doctrine::getTable('DatRegnumerico')->find( $datos['idproducto']);
        //    // print($prod);die;
        //     $datos['idregnumerico'] = $prod->idregnumerico;
        //     print_r($datos);die;
        //     $producto->assignIdentifier($datos['idregnumerico']);
        //     $producto->synchronizeWithArray($datos);
        //     //print_r($producto);die;
        // }
        // $producto->save();
        // return true;
        $producto = new DatMovRegnumericoActivo();
        if ($datos['idproducto']){
            $idmovimiento = $datos['movimiento'];
            $sqlregnume = "Select dmregnu.idregnumerico, dmregnu.idmovregnumerico 
                        from mod_logactivofijotangible.dat_movregnumerico dmregnu 
                        where dmregnu.idmovimiento = $idmovimiento ";
            $conn =  Zend_Registry::get('conexion');                         
            $resultemp = $conn->execute($sqlregnume)->fetchAll(PDO::FETCH_ASSOC);
            $datos['idmovregnumerico'] =  $resultemp[0]['idmovregnumerico']; 
            $producto->assignIdentifier($datos['idmovregnumerico']);
            $producto->synchronizeWithArray($datos); 
        }        
  $idestructura = $this->global->Estructura->idestructura;
        $this->getDatosBalanceContable($idestructura);
        $producto->save();
         return true;    
    }







    /**
     *
     */
    public function adicionarMovimiento($datos)
    {
        $objMovimiento = new DatMovimientos();

        if (!$datos['idmovimiento'] && $datos['idproducto']) {
            $query = Doctrine_Query::create()
                ->select('m.idmovimiento as idmovimiento')
                ->from('DatMovimientos m')
                ->where('m.idproducto = ? and m.iddocumento = ?')
                ->fetchOne(array($datos['idproducto'], $datos['iddocumento']));

            $datos['idmovimiento'] = $query->idmovimiento;
        }

        if ($datos['idmovimiento']) {
            $objMovimiento->assignIdentifier($datos['idmovimiento']);
        }

        $objMovimiento->synchronizeWithArray($datos);
        return $objMovimiento;
    }

    public function eliminarProductoDoc_old($idMovimiento)
    {
        $rnmodel = new RegNumericoModel();
        $rnmodel->actualizarEstadoEnProcesoRn(null, $idMovimiento);
        foreach ($idMovimiento as $idMov) {

            //  Busco el movimiento que deseo eliminar
            $mov = Doctrine::getTable('DatMovimientos')
                ->find($idMov);
            $idproducto = $mov->idproducto;
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura= $global->Estructura->idestructura;
            /**
             * Busco la cantidad de movrn que tienen los registro numéricos asociados al datproducto del movimiento,
             * donde esos movrn no pertenezcan a ese movimiento. Si esta cantidad es 0 borro el producto.
             * Y siempre borro el movimiento.
             */
            $query = new Doctrine_Query();
            $cantidad = $query->select('COUNT(movregn.idmovregnumerico) as cantidad')
                ->from('DatMovRegnumerico movregn')
                ->innerJoin('movregn.DatMovimientos m')
                ->innerJoin('m.DatProductoLogistica p')
                ->where('movregn.idmovimiento <> ? AND p.idproducto = ?', array($idMov, $idproducto))
                ->fetchArray();

            /*
             * Busco la cantidad de movimientos de registros numericos que tiene ese registro numerico que se creo.
             * Si la cantidad de es 1 significa que es el movRegNum que esta asociado al mov en cuestio, por lo que
             * en ese caso borro los regNum
             * */
            $querycantRN = new Doctrine_Query();
            $cantRN = $querycantRN->select('rn.idregnumerico, COUNT(mrn.idregnumerico) as cant')
                ->from('DatRegnumerico rn')
                ->innerjoin('rn.DatMovRegnumerico mrn')
                ->where("rn.idregnumerico IN (SELECT mrn1.idregnumerico "
                    ."FROM DatMovRegnumerico mrn1 WHERE mrn1.idmovimiento = $idMov)")
                //->where('rn.idproducto = ?', array($idproducto))
                ->groupBy('rn.idregnumerico')
                ->fetchArray();

            $idRnEliminar = array();
            $arridregnum = array();
            foreach ($cantRN as $rn) {
                array_push($arridregnum, $rn['idregnumerico']);
                if ($rn['cant'] <= 1) {
                    array_push($idRnEliminar, $rn['idregnumerico']);
                }
            }

            if (count($idRnEliminar) > 0) {
                $querDelRn = new Doctrine_Query();
                $querDelRn->delete()->from('DatRegnumerico rn')->whereIn('rn.idregnumerico', $idRnEliminar)->execute();
            }

            $cDatDocumento = 'DatDocumento';
            // Busco el concepto de la operación para modificar la disponibilidad
            $oper = $this->_mComunAFT->getOperacionSobreMediosById($mov->$cDatDocumento->idoperacion);
            if ($oper->signo == '-' && $oper->afectadisponible == 1) {
                $mDatActivoFijo = new ProductoActivoFijoModel();
                $mDatActivoFijo->modDisponibilidadMedios($mov['idproducto'], $mov['cantidad'], '+');            }

            $queryMov = new Doctrine_Query();
            $queryMov->delete()->from("DatMovimientos m")->where("m.idmovimiento = ?", $idMov)->execute();
            if ($cantidad[0]['cantidad'] == 0 && $oper->codigooperacion != "OPER_REC_TRAS_EXTER") {

                $prod = Doctrine::getTable('DatRegnumerico')->find($idproducto);

                //-- eliminar el producto
                $queryProd = new Doctrine_Query();
                $queryProd->delete()->from("DatRegnumericoActivo drna")->where("drna.idproducto = ?", $idproducto)->execute();
            }
            if($oper->codigooperacion == "OPER_REC_TRAS_EXTER"){
                $queryProd = new Doctrine_Query();
                $queryProd->update('DatRegnumericoActivo drna')
                    ->set('idarearesp',$idestructura)
                    ->whereIn('idregnumerico', $arridregnum)
            ->execute();
            }

        }
        return true;
    }

    /**
     *
     */

     //eliminar de movregnumericoactivo y de movregnumerico DE DAT_REGISTRONUMERICO NO C ELIMINA
    public function eliminarProductoDoc($idMovimiento)
    {
        if(count($idMovimiento) > 0){
          $global = ZendExt_GlobalConcept::getInstance();
          $idestructura= $global->Estructura->idestructura;
          $cDatDocumento = 'DatDocumento';


          $rnmodel = new RegNumericoModel();
          $rnmodel->actualizarEstadoEnProcesoRn(null, $idMovimiento);

          $conn = Zend_Registry::get('conexion');
          $strMov = (is_array($idMovimiento))? implode(",", $idMovimiento) : $idMovimiento;
          $sql = "
            select mr.idregnumerico ,mo.cantidad, mo.idproducto, doc.idoperacion
            from mod_logistica.dat_movimiento mo
            inner join mod_logistica.dat_documento doc on doc.iddocumento = mo.iddocumento
            inner join mod_logactivofijotangible.dat_movregnumerico mr on mo.idmovimiento = mr.idmovimiento
            where mo.idmovimiento IN (" . $strMov . ")
          ";

          $ids = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
          
          // Busco los idregistros numericos asociados a los movimientos
          
          $idregistros = array_map(function($el){
            return $el['idregnumerico'];
          },$ids);
          
          $codOPeracion = null;
          foreach ($ids as $mov) {

            // $mDatActivoFijo->modDisponibilidadMedios($idMov['idproducto'], $idMov['cantidad'], '+');

              //  Busco el movimiento que deseo eliminar

              // Busco el concepto de la operación para modificar la disponibilidad
              $oper = $this->_mComunAFT->getOperacionSobreMediosById($mov['idoperacion']);
              if ($oper->signo == '-' && $oper->afectadisponible == 1) {
                  $mDatActivoFijo = new ProductoActivoFijoModel();
                 $mDatActivoFijo->modDisponibilidadMedios($mov['idproducto'], $mov['cantidad'], '+');            
              }

              $codOPeracion = $oper->codigooperacion;
          }
          /*if ($cantidad[0]['cantidad'] == 0 && $oper->codigooperacion != "OPER_REC_TRAS_EXTER") {

            $prod = Doctrine::getTable('DatRegnumerico')->find($idproducto);

          
        }*/


        //   if($codOPeracion == "OPER_REC_TRAS_EXTER" || $codOPeracion == "OPER_REC_TRAS_EXT_UH"){
        //     if(count($idregistros) > 0){
        //       $queryProd = new Doctrine_Query();
        //       //$queryProd->update('DatMovRegnumericoActivo dmrna')
        //       $queryProd->update('DatRegnumericoActivo dmrna')
        //           ->set('idarearesp',$idestructura)
        //           ->whereIn('idregnumerico', $idregistros)
        //           ->execute();
                
        //     }
        //   }

        // $queryMov1 = new Doctrine_Query();
        //   $queryMov1->delete()
        //             ->from("DatProductoLogistica p")
        //             ->innerJoin('p.DatMovimientos mov')
        //             ->WhereIn('mov.idmovimiento', $idMovimiento)
        //             ->execute();   

          // Elimino los movimientos
          $queryMov = new Doctrine_Query();
          $queryMov->delete()
                    ->from("DatMovimientos m")
                    ->whereIN("m.idmovimiento", $idMovimiento)
                    ->execute();     


         

          if(count($idregistros) > 0){
            // Elimino los registros numericos
            $strIdRegistros = implode(',', $idregistros);
            $querDelRn = new Doctrine_Query();
            $querDelRn->delete()
                      ->from('DatRegnumerico rn')
                      //->whereIn('rn.idregnumerico', $idregistros)
                      ->addWhere("rn.idregnumerico IN (
                        SELECT rn1.idregnumerico 
                        FROM DatRegnumerico rn1
                        LEFT JOIN rn1.DatMovRegnumerico mrn1 on mrn1.idregnumerico = rn1.idregnumerico 
                        WHERE mrn1.idmovregnumerico IS NULL AND rn1.idregnumerico IN ($strIdRegistros)
                      )")
                      ->execute();
          }
        }
    //-- eliminar el producto
//   $queryProd = new Doctrine_Query();
//   $queryProd->delete()->from("DatRegnumericoActivo drna")->innerJoin('drna.DatRegnumerico drn')
//   ->where("drn.idproducto = ?", $idproducto)->execute();
    //$sqlelim = "Delete from mod_logactivofijotangible.dat_movregistronumericoactivo dmrna
       // where dmrna.idregnumerico = {$ids}  "
   // $conn = Zend_Registry::get('conexion');
//$resultemp = $conn->execute($sqlelim);
        return true;




    }

    /**
     *
     */
    public function getMovsConCantReal($parametros)
    {
        //  Para inicializar el setUp y mapear la relación
        new DatMovRegnumerico();
        $query = $this->getQueryMovimiento('mg', true);

        $query->innerJoin('mg.DatMovRegnumerico mrng');

        $query->addSelect(
            "COUNT(mrng.idmovregnumerico) as cantreal"
        );

        $query->groupBy(
            'mg.idmovimiento, mg.idproducto, mg.idmoneda, mg.recargodescuento,
             mg.tienedualidad, mg.preciocontable, mg.importecontable, mg.iddocumento, mg.idproducto, mg.cantidad'
        );

        $query->addWhere('mg.iddocumento = ?', array($parametros['iddocumento']));
        $cantidad = $query->count();

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        $datos = $query->fetchArray();
        return array('datos' => $datos, 'cantidad' => $cantidad);
    }

    /**
     *
     */
    public function crearMovDeDoc($datos, $objDoc)
    {
        /*
         * NOTA: Para optimizar el foreach, la variable datos tiene que estar ordenada por
         * idprod (no imposta si es ascendente o descendente)
         * NOTA: $objDoc es el objeto doctrine de documento..
         */
        //print_r($objDoc->toArray());die;
        // Para buscar el idestructura
        $queryInfo = new Doctrine_Query();

        $info = $queryInfo->select("des.idestructuracomun as idestructuracomun")
            ->from("DatDocumento dd")
            ->innerJoin("dd.DatDocumentoprim ddp")
            ->innerJoin("ddp.DatEstructurasubsist des")
            ->where('ddp.iddoc = ?', array($objDoc->iddoc));
        $idestructuracomun = ($objDoc->idestructuracomun)?$objDoc->idestructuracomun:null;

        new DatMovRegnumericoActivo();
        new DatMovRegnumerico();
        $classMov = 'DatMovimientos';
        $classReg = 'DatRegnumerico';
        $classProd = 'DatProductoLogistica';
        $classMovReg = 'DatMovRegnumerico';
        $classMovRegAct = 'DatMovRegnumericoActivo';

        /**
         * Si no tienen idestado busco el los próximos estados posibles para la operación del documento y selecciono
         * de ellos el 1ro y se los asigno.
         */
        /* if ($datos[0] && !$datos[0]->idestatustecnico) {

          $proximoestado = $this->_sConfAFT->getNextEstatusTecDadoOperacion($objDoc->idoperacion, 0);
          $idproximoestado = $proximoestado[0]->idproximoestado;
          } */

        $sRegNumActivo = new RegNumActivoService();
        $sRegNumActivo->initReNumActivoModel();

        foreach ($datos as $value) {
            /* $value['idestatustecnico'] = ($value['idestatustecnico']) ? $value['idestatustecnico'] :
              $idproximoestado; */

            if ($value['idproducto']) {
                unset($value['idproducto']);
            }
            if (!$value['idestructuracomun']) {
                if ($idestructuracomun == null) {
                    $idestructuracomun = $info->fetchArray();
                    $idestructuracomun = $idestructuracomun[0]['idestructuracomun'];
                }
                $value['idestructuracomun'] = $idestructuracomun;
            }
            /**
             * Esta línea lo que hace es que le adhiere al documento los movimientos sin tener que
             * ir a la BD a buscarlos.
             */
            $objDoc->$classMov;
            // Si existen movimientos
            if (count($objDoc->$classMov) > 0) {

                /**
                 * Busco si existe algún movimiento en que se pueda poner el MovRN iterado.
                 *
                 * ($flagHayMovParaRn) Variable bandera para saber si el MovRN se pudo poner dentro de alguno de
                 * los movimientos existentes.
                 */
                $flagHayMovParaRn = false;

                foreach ($objDoc->$classMov as $i => $mov) {
                    /**
                     * Esta línea lo que hace es que le adhiere al documento los movimientos sin tener que ir
                     * a la BD a buscarlos.
                     */
                    $mov->$classProd;
                    if ($objDoc->DatMovimientos[$i]->DatProductoLogistica->idindicador == $value['idprod']) {
                        // Se cambia el idproducto a dat_regnumerico
                        $objDatRegnumerico = Doctrine::getTable('DatRegnumerico')->find($value['idregnumerico']);

                        $objDatRegnumerico->idproducto = $objDoc->DatMovimientos[$i]->DatProductoLogistica->idproducto;
                        /**
                         * Busco la cantidad de RN que tiene el movimiento, para seguir insertando a partir
                         * de la última posición.
                         */
                        $mov->$classMovReg;
                        $posRegNum = count($objDoc->DatMovimientos[$i]->DatMovRegnumerico);
                        $objDoc->DatMovimientos[$i]->DatMovRegnumerico[$posRegNum]->DatRegnumerico = $objDatRegnumerico;
                        $objDoc->DatMovimientos[$i]->cantidad += 1;

                        /**
                         * Aquí incremento la cantidad del movimiento.
                         * Se crea el movimiento del registro numérico y del registro numérico activo para ese
                         * movimiento en especifico.
                         */
                        $objDoc->DatMovimientos[$i]->DatMovRegnumerico[$posRegNum]->synchronizeWithArray($value);
                        $objDoc->DatMovimientos[$i]->DatMovRegnumerico[$posRegNum]->DatMovRegnumericoActivo
                            ->synchronizeWithArray($value);

                        // Recorro todos los plugins y le inserto los movimientos de registro numérico de cada plugin
                        $this->innerJoinMovsPlugins($objDoc, $value, $i, $posRegNum);
                        $flagHayMovParaRn = true;
                        break;
                    }
                }
                /**
                 * En caso de que no existiera ningún movimiento que corresponda
                 * al Movimiento de Registro Numérico a insertar
                 */
                if (!$flagHayMovParaRn) {

                    // Si el idproducto no existe lo creo.
                    $prod = $this->getOrConstructProdEstructura($value['idprod'], $value['idarearesp'],
                        $value['idestructuracomun']);

                    // Creo el movimiento con sus datos.
                    $cantMovimientos = count($objDoc->$classMov);

                    $objDoc->DatMovimientos[$cantMovimientos]->synchronizeWithArray($value);
                    $objDoc->DatMovimientos[$cantMovimientos]->idproducto = $prod->idproducto;
                    $objDoc->DatMovimientos[$cantMovimientos]->cantidad = 1;
                    // Aquí incremento la cantidad del movimiento.
                    $objDoc->DatMovimientos[$cantMovimientos]->$classProd = $prod;

                    // Se le cambia el idproducto a dat_regnumerico
                    $objDatRegnumerico = Doctrine::getTable('DatRegnumerico')->find($value['idregnumerico']);
                    $objDatRegnumerico->idproducto = $prod->idproducto;

                    // Asocio el Registro Numérico al nuevo movimiento de Registro Numérico
                    $objDoc->DatMovimientos[$cantMovimientos]->DatMovRegnumerico[0]->$classReg = $objDatRegnumerico;

                    // Se llenan los valores de los movimientos.
                    $objDoc->DatMovimientos[$cantMovimientos]->DatMovRegnumerico[0]->synchronizeWithArray($value);
                    $objDoc->DatMovimientos[$cantMovimientos]->DatMovRegnumerico[0]->DatMovRegnumericoActivo
                        ->synchronizeWithArray($value);

                    // Recorro todos los plugins y le inserto los movimientos de registro numérico de cada plugin
                    $this->innerJoinMovsPlugins($objDoc, $value, $cantMovimientos, 0);
                }
                // Si no existen movimientos en el documento
            } else {

                // Si el idproducto no existe lo creo.

                $prod = $this->getOrConstructProdEstructura($value['idprod'], $value['idarearesp'],
                    $value['idestructuracomun']);

                // Creo el movimiento con sus datos.
                $mov = new $classMov();
                $mov->idproducto = $prod->idproducto;
                $mov->cantidad = 1;
                // Incremento la cantidad del movimiento.
                $mov->$classProd = $prod;

                // Se le cambia el idproducto a dat_regnumerico
                $objDatRegnumerico = Doctrine::getTable('DatRegnumerico')
                    ->find($value['idregnumerico']);
                $objDatRegnumerico->idproducto = $prod->idproducto;


                $movRegNum = new $classMovReg();
                $movRegNum->$classReg = $objDatRegnumerico;
                // Se llenan los valores de los movimientos.
                $movRegNum->synchronizeWithArray($value);
                $movRegNum->$classMovRegAct->synchronizeWithArray($value);
                $mov->$classMovReg->add($movRegNum);
                $objDoc->$classMov->add($mov);
                $this->innerJoinMovsPlugins($objDoc, $value, 0, 0);
            }
        }
        return $objDoc;
    }

    /**
     *
     */
    private function innerJoinMovsPlugins(&$objDoc, &$value, $posMov, $posRegNum)
    {
        $sRegNumActivo = new RegNumActivoService();
        $objRegNumAftModel = $sRegNumActivo->getObjRegNumActivoModel();
        $classMovRegActivo = 'DatMovRegnumericoActivo';
        foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
            $plugin->beforeSaveMov(
                $objDoc->DatMovimientos[$posMov]->DatMovRegnumerico[$posRegNum]->$classMovRegActivo, $value
            );
        }
    }

    /**
     * Devuelve la instacia de DatProductoLogistica en una ubicación, en caso de no existir, la crea
     * 
     * @param type $idIndicador
     * @param type $idEstructura es el area de responsabilidad
     * @param type $idestructuracomun es la entidad
     * @return \DatProductoLogistica
     */
    private function getOrConstructProdEstructura($idIndicador, $idEstructura, $idEstructuraComun)
    {
        $query = new Doctrine_Query();
        $prod = $query->from('DatProductoLogistica p')
            ->where('p.idestructura = ? and p.idindicador = ? and p.idestructuracomun = ?',
                array($idEstructura, $idIndicador, $idEstructuraComun))
            ->fetchOne();

        if ($prod) {
            return $prod;
        } else {// En caso de que la entidad no tenga una instancia de DatProductoLogistica, se crea una.
            $prod = new DatProductoLogistica();
            $prod->idindicador = $idIndicador;
            $prod->idestructura = ($idEstructura) ? $idEstructura : $idEstructuraComun;
            $prod->idestructuracomun = $idEstructuraComun;
            $prod->cantidad = 0;
            $prod->disponible = 0;
            $prod->save();
            return $prod;
        }
    }

    /***
     * @return array
     */
    public static function obtenerOperacionesEntrada(){
        $operacionesEntrada = array();
        $comun = ComunAFTModel::getInstance();
        $arrayOperacionesEntrada = array_keys($comun->getInterfacesDocumento(true));
        foreach ($arrayOperacionesEntrada as $oper) {
            $operacionesEntrada[] = "'" . $oper . "'";
        }

        return $operacionesEntrada;
    }

    /*
     * Obtener los registros numéricos asociados a los medios del documento de inventario
     *
     */

    public function getMediosNaturalezasInventario($parametros)
    {
        $conn = Zend_Registry::get('conexion');
        
        //$operacion = ($parametros['inventarioTotal']) ? 'OPER_INV_TOTAL' : 'OPER_INV_PAR_MENSUAL';
        $operacion = $parametros['codigoOperInv'];
        
        $utiles = new RegNumActivoService();
        $depreciacion = "";
        $comun = ComunAFTModel::getInstance();
        $operaciones = $comun->getDatosInterfazOperacion(
            11, false, false, false
        );

        $filtrarPorEjercicio = ($parametros['idejercicio']) ?
            " and doc2.idejercicio = {$parametros['idejercicio']} " :
            "";

        if (count($operaciones)) {
            $idoperacion = $operaciones[0]['idoperacion'];
            $depreciacion = " and doc.idoperacion <> $idoperacion";
        }
        $sql = "
           SELECT  DISTINCT p.idproducto,
           (CASE WHEN p.idproducto IN (SELECT p2.idproducto
           FROM mod_datosmaestros.nom_indicador i2
           INNER JOIN mod_datosmaestros.nom_indicadorhoja ih2 ON i2.idindicador = ih2.idindicador
           INNER JOIN mod_logistica.dat_producto p2 on i2.idindicador = p2.idindicador
           INNER JOIN mod_logactivofijotangible.dat_registronumerico reg2 on p2.idproducto = reg2.idproducto
           INNER JOIN mod_datosmaestros.nom_naturaleza nat2 on i2.idnaturaleza = nat2.idnaturaleza
           INNER JOIN mod_logistica.dat_movimiento mov2 on p2.idproducto = mov2.idproducto
           INNER JOIN mod_logistica.dat_documento doc2 on mov2.iddocumento = doc2.iddocumento
           INNER JOIN mod_logactivofijotangible.dat_docinventarioparcial docp on
           docp.iddocinventarioparcial = doc2.iddocumento
           INNER JOIN mod_datosmaestros.nom_operacion nop2 ON doc2.idoperacion = nop2.idnomoperaciones

           WHERE nop2.codigooperacion = '$operacion' AND docp.mensual = 1 $filtrarPorEjercicio ) THEN TRUE ELSE FALSE END ) AS enuso,
           doc.fechacontable AS fecha

           FROM mod_datosmaestros.nom_indicador i
           INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
           INNER JOIN mod_logistica.dat_producto p on i.idindicador = p.idindicador
           INNER JOIN mod_logactivofijotangible.dat_registronumerico reg on p.idproducto = reg.idproducto
           INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rega on rega.idregnumerico = reg.idregnumerico
           INNER JOIN mod_datosmaestros.nom_naturaleza nat on i.idnaturaleza = nat.idnaturaleza
           INNER JOIN mod_logistica.dat_movimiento mov on p.idproducto = mov.idproducto
           INNER JOIN mod_logistica.dat_documento doc on mov.iddocumento = doc.iddocumento
           INNER JOIN mod_datosmaestros.nom_operacion nop ON doc.idoperacion = nop.idnomoperaciones
           
         

           INNER JOIN mod_estructuracomp.nom_filaestruc f on f.idfila = p.idestructura
            
           
          WHERE rega.idestadoperacion not in (7,6) 

          AND doc.estado = 3 ". $depreciacion;

/*
 * rega.idregnumerico not in(SELECT dat_mov_reg.idregnumerico
                    FROM mod_logactivofijotangible.dat_movregnumerico dat_mov_reg
                    INNER JOIN mod_logistica.dat_movimiento dat_mov on dat_mov.idmovimiento = dat_mov_reg.idmovimiento
                    INNER JOIN mod_logistica.dat_documento doc2 ON doc2.iddocumento = dat_mov.iddocumento
                    WHERE doc2.cronologia = 0 and rega.idregnumerico = dat_mov_reg.idregnumerico $depreciacion
 * */


        if($parametros['idestructura']){
            $areas = json_decode($parametros['idestructura']);
        } else {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;
            $areas = array(0 => $idestructura);
        }

        if ($areas && count($areas) > 1) {
            $sql .= " AND p.idestructura IN (".implode(",", $areas).")";
        /*} else if ($parametros['inventarioTotal'] && (
                    $parametros['inventarioTotal'] == "OPER_INV_TOTAL" || $parametros['inventarioTotal'] == "OPER_INV_TOTAL_UH"
                    ) && count($areas) == 1) {*/
        } else if ($parametros['codigoOperInv'] && (
                    $parametros['codigoOperInv'] == "OPER_INV_TOTAL" || $parametros['codigoOperInv'] == "OPER_INV_TOTAL_UH"
                    ) && count($areas) == 1) {

            //$arrIdesAreas = ComunAFTModel::getInstance()->getIdsAreasHijas();
            //$sql .= " AND p.idestructura IN (".implode(",", $arrIdesAreas).")";
            $sql .= " AND p.idestructuracomun = {$areas[0]} ";
        } else if (count($areas) == 1) {
            $sql .= " AND p.idestructura  = ".$areas[0];
        }

        $sql = $this->queryMediosNaturalezasInventario($parametros, $sql);


        $sql .= ' ORDER BY p.idproducto';

        //print_r($sql);//die;
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        //print_r($sql);die;
        return $datos;
    }

    public function queryMediosNaturalezasInventario($parametros, &$sql)
    {
        if ($parametros['idespecialidadesInventario'] && count($parametros['idespecialidadesInventario']) > 0) {
            $sql .= " AND i.idespecialidad IN (".implode(",", $parametros['idespecialidadesInventario']).")";
        }

        if ($parametros['idnaturalezasInventario']) {
            $sql .= " AND nat.idnaturaleza IN (".implode(",", $parametros['idnaturalezasInventario']).")";
        }

        if ($parametros['idmediosInventario'] && $parametros['idmediosInventario'] != "") {
            $sql .= " AND i.idindicador IN (".implode(",", $parametros['idmediosInventario']).")";
        }

        if($parametros['utiles'] == true)
            //$sql .= " AND nat.idnaturaleza = -5 ";
            $sql .= " AND ih.isuh = 1 ";
        else
            //$sql .= " AND nat.idnaturaleza <> -5 ";
            $sql .= " AND ih.isuh <> 1  ";

        return $sql;
    }

    /**
     *
     */
    public function getIndicadorByMarcaModelo($idMarca, $idModelo)
    {
        $query = $this->_mMProducto->getQueryIndicador('ind');
        $this->_mMProducto->addQueryJoinIndicadorHoja($query, 'ind', 'ih', 1);
        $this->_mMProducto->addQueryJoinMarcaModelo($query, 'ih', 'ma', 'mo', true, true);
        $query->addSelect(
            "(ma.denominacion || ' - ' || mo.denominacion) as descripcionmarcamodelo"
        );

        $query->addWhere('ma.idmarca = ? AND mo.idmodelo = ?', array($idMarca, $idModelo));

        $query->limit(1);
        return $query->fetchArray();
    }

    /**
     *
     */
    public function getMovimientosDocRegNum($parametros, $relacionOperaciones)
    {
        $query = Doctrine_Query::create();

        new DatMovRegnumerico();
        new DatMovRegnumericoActivo();
        $sConfGen = ServiciosConfiguracionGeneralHelper::__init();

        $idAreaResp = $parametros['idarearesp'];
        $arrIdesAreaResp = $parametros['arrayIdarearesp'];

        $query->addSelect('d.iddocumento, d.observaciones, d.idoperacion, d.nrodoc, d.numeroref, d.fechacontable, d.estado, d.idcomprobante');
        $query->addSelect("(CASE WHEN dder.identidaddestino NOTNULL THEN dder.identidaddestino 
        WHEN ddte.identidaddestino NOTNULL THEN ddte.identidaddestino 
        WHEN ddbd.iddestinofinal NOTNULL THEN ddbd.iddestinofinal
        WHEN ddbv.iddestinofinal NOTNULL THEN ddbv.iddestinofinal ELSE p.idestructuracomun END) as identidad");
        $query->addSelect('mrna.idmovregnumerico as idmovregnumerico, mrna.idarearesp as idarearesp');
        //$query->addSelect('ope.denominacion as denominacion');
        $query->addSelect('d.cronologia as cronologia');
        $query->orderBy('d.nrodoc DESC');

        $query->from('DatDocumento d');
        $query->innerJoin('d.DatMovimientos mov');
        $query->innerJoin('mov.DatProductoLogistica p');

        $this->_mMProducto->addQueryNomIndicador($query, 'p', 'i', 'ih', false, 'ngsubg');
        new DatDocumentoActivo();
        $query->innerJoin('mov.DatMovRegnumerico mrn on mrn.idmovimiento = mov.idmovimiento');
        $query->innerJoin('mrn.DatMovRegnumericoActivo mrna');
        $query->leftJoin('d.DatDocumentoActivo dda');
        $query->leftJoin('dda.DatDocEnviadoReparar dder');
        $query->leftJoin('dda.DatDocTransferenciaEntidades ddte');
        $query->leftJoin('dda.DatDocBajaDesarme ddbd');
        $query->leftJoin('dda.DatDocBajaVenta ddbv');

        //$sConfGen->addQueryJoinOperacion($query, 'd', 'ope', 1);

        $query = $this->queryMovimientosDocRegNum($query, $parametros, $arrIdesAreaResp, $idAreaResp);

        $total = $query->count();

        if ($parametros["limit"]) {
            $query->limit($parametros["limit"]);
            $query->offset($parametros["start"]);
        }
        $query->orderBy('d.fechacontable ASC');

        $datos = $query->fetchArray();

        if ($relacionOperaciones) {
            foreach ($datos as $i => $operaciones) {
                $oper = $sConfGen->obtenerOperaciones(null, null, null, $operaciones['idoperacion'], null, null, null);
                $datos[$i]['denominacion'] = $oper[0]['denominacion'];
            }
        }

        return array('datos' => (count($datos) > 0) ? $datos : array(), 'total' => $total);
    }

    public function queryMovimientosDocRegNum(&$query, $parametros, $arrIdesAreaResp, $idAreaResp)
    {
        $query->addWhere('mrn.idregnumerico = ?', array($parametros['idregnumerico']));

        if ($parametros['idespecialidad']) {
            $query->addWhere('i.idespecialidad = ?', array($parametros['idespecialidad']));
        }

        if ($parametros['iddocumento']) { 
            $query->addWhere('mov.iddocumento = ?', array($parametros['iddocumento']));
        }

        if ($arrIdesAreaResp && is_array($arrIdesAreaResp)) {
            if (count($arrIdesAreaResp) == 1) {
                $arrIdesEstructuras = $this->_mComunAFT->getIdEstructurasHijas($arrIdesAreaResp[0], false);
            } else {
                $arrIdesEstructuras = "(".implode(",", $arrIdesAreaResp).")";
            }
        } else {
            $arrIdesEstructuras = $this->_mComunAFT->getIdEstructurasHijas($idAreaResp, false);
        }

        $query->WhereIn('mrna.idarearesp', $arrIdesEstructuras);
        return $query;
    }

    public function getCantMediosEnMovByIdDocumento($idDocumento)
    {
        $query = $this->getQueryMovimiento('m', false);
        return $query->addSelect('SUM(m.cantidad) AS total')
                ->addWhere('m.iddocumento = ?', array($idDocumento))
                ->fetchOne()->total;
    }

    public function adicionarProductosConfirmar($datos)
    {
        $sRegnum = new RegNumActivoService();
        $objRegNumAftModel = $sRegnum->getObjRegNumActivoModel();
        $classMovRegActivo = 'DatMovRegnumericoActivo';
        $classMovRegnumerico = 'DatMovRegnumerico';

        new DatMovRegnumericoActivo();
        $salvar = false;
        $productosRegistros = array(); //Arreglo que contiene los registros numéricos de los productos
        $movimientosArray = array(); //Arreglo que contiene los movimientos antes de pasarlos al colecction


        // Dataloader
        $allIdProds = array();
        foreach ($datos['medios'] as $prod) {
            array_push($allIdProds, $prod->idproducto);
        }
        
        $allRegNumericos = $this->getRegNumericoDadoProd_v2($allIdProds);
        
        $iterations = count($allRegNumericos);
        $i = 0;
        $idproducto = $allRegNumericos[0]["idproducto"];
        $movimiento = new DatMovimientos(); //Creo el movimiento por primera vez
        $movimiento->iddocumento = $datos['iddocumento'];
        $movimiento->idproducto = $idproducto;
        $idxRn = 0;
        while($i < $iterations) {
            
            $movimiento->cantidad = $idxRn + 1;
            unset($allRegNumericos[$i]['idmovregnumerico']);
            unset($allRegNumericos[$i]['idmovimiento']);
            $movimiento->DatMovRegnumerico[$idxRn]->idregnumerico = $allRegNumericos[$i]['idregnumerico'];
            $movimiento->DatMovRegnumerico[$idxRn]->synchronizeWithArray(
                $allRegNumericos[$i]
            );
            $movimiento->DatMovRegnumerico[$idxRn]->$classMovRegActivo->synchronizeWithArray(
                $allRegNumericos[$i]
            );

            foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                $plugin->beforeSaveMov(
                    $movimiento->DatMovRegnumerico[$idxRn]->$classMovRegActivo, $allRegNumericos[$i]
                );
            }
            $idxRn++;
            $i++;
            if($allRegNumericos[$i] && $idproducto != $allRegNumericos[$i]["idproducto"]){
                $movimientosArray[$idproducto] = $movimiento;
                $idproducto = $allRegNumericos[$i]["idproducto"];
                $movimiento = new DatMovimientos(); //Creo el movimiento por primera vez
                $movimiento->iddocumento = $datos['iddocumento'];
                $movimiento->idproducto = $idproducto;
                $idxRn = 0;
            } else if (!$allRegNumericos[$i]) {
                $movimientosArray[$idproducto] = $movimiento;
            }
            $salvar = true;
        }


        /*foreach ($datos['medios'] as $prod) {//Recorro todos los productos de los parámetros
            if ($movimientosArray[$prod->idproducto]) {//pregunto para no duplicar el producto
                $movimientosArray[$prod->idproducto]->cantidad += $prod->cantidad; //Actualizo la cantidad del movimiento
            } else {
                $idregnumericos = $this->getRegnumericoDadoProd($prod->idproducto); //Por cada producto obtengo los Rn
                $key = 0;
				if(count($idregnumericos)>0){
					$productosRegistros[$prod->idproducto] = $idregnumericos; //Adiciono el producto y los Rn
					$movimiento = new DatMovimientos(); //Creo el movimiento por primera vez
					$movimiento->iddocumento = $datos['iddocumento'];
					$movimiento->cantidad = count($idregnumericos);// $prod->cantidad;
					$movimiento->idproducto = $prod->idproducto;

					foreach ($idregnumericos as $idreg) {
						unset($idreg['idmovregnumerico']);
						unset($idreg['idmovimiento']);
						$movimiento->DatMovRegnumerico[$key]->idregnumerico = $idreg['idregnumerico'];
						$movimiento->DatMovRegnumerico[$key]->synchronizeWithArray(
							$idreg
						);
						$movimiento->DatMovRegnumerico[$key]->$classMovRegActivo->synchronizeWithArray(
							$idreg
						);

						foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
							$plugin->beforeSaveMov(
								$movimiento->DatMovRegnumerico[$key]->$classMovRegActivo, $idreg
							);
						}
						$key++;
					}
					$movimientosArray[$prod->idproducto] = $movimiento;

					$salvar = true;
				}
                
            }

//            $movimientosCollection->add($movimiento);
        }*/
//print_r($movimientosArray);die;

        if ($salvar) {
            $movimientosCollection = new Doctrine_Collection('DatMovimientos');
            foreach ($movimientosArray as $mov) {
                $movimientosCollection->add($mov);
            }
            $movimientosCollection->save();

            $documentoM = new DocumentoActivoModel();
            if ($datos['confirmar']) {
                return $documentoM->confirmarDocumento($datos['iddocumento']);
            }
        }
    }

    public function getRegNumericoDadoProd_v2($idproducto){
        
        $sql_select = " SELECT rn.*, rna.*, rnat.*, rn.idregnumerico as idregnumerico ";
        $sql_from = " 
            FROM mod_logactivofijotangible.dat_registronumerico rn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
            LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rnat.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto 
        "; 
        $sql_where = "
            WHERE     
                rna.esbaja = 0
                AND rna.estaentidad = 1
                AND rna.idestadoperacion <> 7
        ";
        

        if(!is_array($idproducto)){
            $sql_where .= " AND p.idproducto = {$idproducto} ";
        } else {
            $strIdproductos = implode(',', $idproducto);
            $sql_where .= " AND p.idproducto IN ($strIdproductos) ";
            $sql_select .= " ,p.idproducto ";
            $sql_where.= " ORDER BY p.idproducto";
        }
        $sql = $sql_select . $sql_from . $sql_where;

        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getRegnumericoDadoProd($idprodcuto)
    {
        $utiles = new RegNumActivoService();
        /*$depreciacion = "";
        $comun = ComunAFTModel::getInstance();
        $operaciones = $comun->getDatosInterfazOperacion(
            11, false, false, false
        );
        if (count($operaciones)) {
            $idoperacion = $operaciones[0]['idoperacion'];
            $depreciacion = " and doc2.idoperacion <> $idoperacion";
        }*/
        $query = $utiles->cargarMovimientosActivos()['query'];
        $query->addSelect("ncp.denominacion AS colorprim");
        $query->addSelect("ncs.denominacion AS colorsec");
        $query->addSelect("act.denominacion AS actividad");
        $query->innerJoin("p.DatMovimientos mov");
        $query->innerJoin("mov.DatDocumento doc");
        $query->innerJoin("rn.DatMovRegnumerico mvReg");
        $query->innerJoin("rn.DatRegnumericoActivo drna");
        $query->leftJoin("drna.NomColor ncp ON drna.idcolorprim = ncp.idcolor");
        $query->leftJoin("drna.NomColor ncs ON drna.idcolorsec = ncs.idcolor");
        $query->leftJoin("drna.NomActividadMedio act ON drna.idactividad = act.idactividad");
        $query->addWhere("doc.estado = 3");
        $query->addWhere("drna.esbaja = 0");
        
        if(!is_array($idprodcuto)){
            $query->addWhere("p.idproducto = $idprodcuto");
        } else {
            $query->whereIn("p.idproducto", $idprodcuto);
            $query->addSelect("p.idproducto AS idproducto");
            $query->orderBy("p.idproducto");
        }
        /* $query->addWhere(
          "drna.idregnumerico not in (
          SELECT dat_mov_reg.idregnumerico
          FROM DatMovRegnumerico dat_mov_reg
          INNER JOIN dat_mov_reg.DatMovimientos dat_mov on dat_mov.idmovimiento = dat_mov_reg.idmovimiento
          INNER JOIN dat_mov.DatDocumento doc2 ON doc2.iddocumento = dat_mov.iddocumento
          WHERE doc2.cronologia = 0 and drna.idregnumerico = dat_mov_reg.idregnumerico $depreciacion
          )"
          ); */

        $query->addWhere("drna.estaentidad = 1");
        $query->addWhere("drna.idestadoperacion <> 7");

        

        return $query->fetchArray();
    }

    public function obtenerColumnasEditables($arrDatMovGrid, $parametros)
    {
        $mRegNumericoView = new RegNumericoViewModel();
        foreach ($arrDatMovGrid as $arrDatMov) {
            $columnasMostrar = $mRegNumericoView->devolverColumnas(
                $arrDatMov ['idnaturaleza'], $arrDatMov['idgruposubgrupo'], $parametros['idestructurapadre']
            );
            $parametros['idmovimiento'] = $arrDatMov['idmovimiento'];
            $parametros['idproducto'] = $arrDatMov['idproducto'];
            $parametros['tipo_interfaz'] = $arrDatMov['tipo_interfaz'];
            $parametros['action'] = cargarseriesdemovimiento;
            $mRegNumActivo = new RegNumericoActivoModel();
            $resultado = $mRegNumActivo->cargarMovimientosActivos($parametros);
            $dataRegNum = $resultado['query']->fetchArray();
            self::compararColumnasConRegNum($columnasMostrar, $dataRegNum);
        }
        return true;
    }

    public function compararColumnasConRegNum($columnasMostrar, $dataRegNum)
    {
        foreach ($columnasMostrar['columnas'] as $columnMostrar) {
            foreach ($dataRegNum as $regNum) {
                if ($columnMostrar[1]['obligatorio']) {
                    if ($regNum[$columnMostrar[1]['dataIndex']] == null) {
                        return false;
                        break;
                    }
                }
            }
        }

        return true;
    }

    public function cargarGridClasificador($parametros)
    {


        $select = "SELECT
                (
                    SELECT count(rn2.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 AND p.idestructura = {$parametros['idestructura']}  AND rna.idestadoperacion = 1
                ) AS disponible,
                (
                    SELECT count(rn2.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 AND p.idestructura = {$parametros['idestructura']} AND rna.idestadoperacion not in (0,7)
                ) AS existencia,
                     i.codigo,
                     i.denominacion as denominacion,
                     i.numeropieza as codigoproveedor,
                     (marc.denominacion || '-' || model.denominacion) as marcamodelo,
                     um.abreviaturaunidadmedida as umedida,
                     pp.idproducto as idproducto,
                     pp.idestructura as idestructura,
                     pp.precio as precio,
                     i.idnaturaleza as idnaturaleza,
                     i.idespecialidad as idespecialidad,
                     i.idindicador

                ";

        $from = " FROM mod_datosmaestros.nom_indicador i
                      inner join mod_logistica.dat_producto pp on pp.idindicador = i.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                      INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza

                      left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = pp.idumedida
                      left join mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo

                      LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca
                      LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo";

        $where = " WHERE (SELECT p.idestructura FROM mod_logistica.dat_producto p
                      INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = p.idproducto
                      WHERE p.idindicador = i.idindicador
                      AND p.cronologia > 0
                      AND p.idestructura = {$parametros['idestructura']}
                      LIMIT 1
              ) IS NOT NULL AND ih.explotacion = 1";

        $groupby = " GROUP BY
                      i.denominacion,
					  i.codigo,
                      i.numeropieza,
                      marc.denominacion,
                      model.denominacion,
                      um.abreviaturaunidadmedida,
                      pp.idproducto,
                      pp.precio,
                      pp.idestructura,
                      i.idnaturaleza,
                      i.idespecialidad,
                      i.idindicador
                        ORDER BY i.codigo, marc.denominacion ";

        if ($parametros['idnaturalezaexcluir']) {
            $idnaturaleza = (is_array($parametros['idnaturalezaexcluir'])) ? implode(
                ",", $parametros['idnaturalezaexcluir']) : $parametros['idnaturalezaexcluir'];
            $where .= "AND i.idnaturaleza not in ($idnaturaleza) ";
        }
        if ($parametros['codigo']) {
            $where .= "AND i.codigo ILIKE '%{$parametros['codigo']}%' ";
        }
        if ($parametros['codigoproveedor']) {
            $where .= "AND i.numeropieza ILIKE '%{$parametros['codigoproveedor']}%' ";
        }
        if ($parametros['denominacion']) {
            $where .= "AND i.denominacion ILIKE '%{$parametros['denominacion']}%' ";
        }
        if ($parametros['nacionalidad']) {
            $where .= "AND i.idpais ILIKE '%{$parametros['nacionalidad']}%' ";
        }
        $conn = Zend_Registry::get('conexion');
        $sqlDatos = $select . $from . $where . $groupby;

        $sqlCount = 'SELECT count (distinct i.idindicador) ' . $from . $where;
        if ($parametros['limit']) {
            $start = $parametros['start'];
            $limit = $parametros['limit'];
            $sqlDatos .= " offset $start limit $limit";
        }
        //print_r($sqlDatos);die;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
        $total = $total[0]['count'];
        return array($datos, $total);
    }

    public function addAllRegistrosMovimientos($iddocumento, $idoperacion, $parametros) {
        unset($parametros['start']);
        unset($parametros['limit']);
        $mRegNumActivo = new RegNumericoActivoModel();
        $registrosDisponibles = $mRegNumActivo->getRegistrosDisponibles($parametros);
        $idregistros = array();
        if (count($registrosDisponibles['datos'])) {
            foreach ($registrosDisponibles['datos'] as $r) {
                array_push($idregistros, $r['idregnumerico']);
            }
        }
        return $this->addRegistrosMovimientos($idregistros, $iddocumento, $idoperacion);
    }

    public function addRegistrosMovimientos($idregistros, $iddocumento, $idoperacion)
    {
        // 1- Ordenar los registros por idproducto y agruparlos bidimiencionalmente (un arr para cada prod)
        
        $conn = Zend_Registry::get('conexion');
        $selectProd = " SELECT dp.idproducto, rn.idregnumerico,dp.cantidad,i.denominacion, i.codigo "
                . " FROM mod_logistica.dat_producto dp "
                . " INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON ih.idindicador = dp.idindicador "
                . " INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = ih.idindicador "
                . " INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = dp.idproducto "
                . " WHERE rn.idregnumerico IN (" . implode(",", $idregistros) . ") "
                . " ORDER BY dp.idproducto";        
        
        $datos = $conn->execute($selectProd)->fetchAll(PDO::FETCH_ASSOC);
        
        //print_r($datos);//die;
        
        if(count($datos) > 0){
            // 2- Por cada producto preguntar si existe mov, en caso que no crearlo, y siempre crear movrn
            $idprod = -1;
            $mov = false;
            
            foreach($datos as $i => &$dato){
                
                $dato = (object) $dato;                
                if($dato->idproducto != $idprod){
                    
                    $mov = Doctrine::getTable("DatMovimientos")->findByDql('idproducto = ? AND iddocumento = ?', array(
                        $dato->idproducto,
                        $iddocumento
                    ));
                }
                
                if(count($mov) == 0){ 
                    // Creo el movimiento
                    $mov = new DatMovimientos ();
                    $mov->iddocumento = $iddocumento;
                    $mov->idproducto = $dato->idproducto;
                    $mov->save();
                }else{
                    $mov = $mov[0];
                }                    
                $dato->idmovimiento = $mov->idmovimiento;
                $dato->iddocumento = $mov->iddocumento;
                    
                
            }
            $regNumActModel = new RegNumericoActivoModel();
            $regNumActModel->loadPluginsFromFile('listaplugins')->buildRelations();
            
            
            $idmovimiento = $datos[0]->idmovimiento;
            $regByMov = array();
            foreach($datos as $data){
                if($data->idmovimiento == $idmovimiento)
                    array_push ($regByMov, $data);
                else{
                    $resp = $regNumActModel->adicionarRegNumericoActivoNoEntrada($regByMov, $idoperacion, null);
                    if(count($resp) == 0) return false;
                    $regByMov = array($data);
                    $idmovimiento = $data->idmovimiento;
                }                
            }
            $resp = $regNumActModel->adicionarRegNumericoActivoNoEntrada($regByMov, $idoperacion, null);
            
            return (count($resp) > 0) ? true : false;
        }
        else
            return false;
    }

    public function getDocumento($iddocumento){
        return Doctrine::getTable('DatDocumento')->find($iddocumento);
    }
}
