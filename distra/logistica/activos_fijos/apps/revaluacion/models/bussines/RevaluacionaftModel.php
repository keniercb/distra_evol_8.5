<?php

/**
 * @class      RevaluacioninventarioModel
 * @package    Inventario
 * @subpackage Revaluacion
 * @author     Jorge Luis Cuellar Mondeja
 * @copyright  XETID
 * @version    2.0.1
 */
class RevaluacionaftModel extends BaseModel
{
    private $urlFireConfuracion;
    private $docModel;
    private $movModel;

    public function __construct()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $this->urlFireConfuracion = $dirApps.'logistica/activos_fijos/revaluacion/models/domain/revaluacion.json';
        $this->docModel = new DocumentoLogisticaModel(
            array('alias' => 'revaluacionLog', 'subistema' => LogisticaGlobal::SUBSISTEMA_AFT)
        );
        $this->movModel = new LogisticaMovimientoModel();
        parent::__construct();
    }
    /**
     *  Devuelve el listado de productos ha evaluar
     */
    public function getProductosEvaluacion($start = 0, $limit = 50, $idestructura = '', $criterio)
    {
        return $this->getProductosSinEvaluacion($start, $limit, $idestructura, $criterio);
    }

    /**
     *  Devuelve el listado de productos sin evaluar
     */
    private function getProductosSinEvaluacion($start = null, $limit = null, $idestructura, $criterio,$regnum = false)
    {
        $respuesta = array();
        
                
        $selectData = "
            SELECT DISTINCT
                    dp.idproducto as idproducto,
                    dp.idindicador as idindicador,
                    ni.idnaturaleza,
                    ni.codigo || ' - ' || ni.denominacion AS denominacion,
                    dp.cantidad as existencia,
                    (SELECT SUM(rna.valorcontable) + SUM(rna.valorcontablealternativo)) as importe,
                    (SELECT SUM(rna.depreciacionacumulada) + SUM(rna.depreciacionacumuladaalternativo)) as depreciacion,
					-- Valores reevaluados
                    SUM(rnr.valorcontablerevaluado) as importereevaluado,
                    SUM(rnr.depreciacionrevaluado) as depreciacionreevaluado,
                    -- Diferencias
                    SUM(rnr.diferencia) as importediferencia,
                    sum(rnr.depreciaciondiferencia) as depreciaciondiferencia,
                    
                    -- Otros datos
                    (SELECT u.nombreusuario FROM  mod_seguridad.seg_usuario u WHERE u.idusuario =
                    rnr.idrevisado) AS revisadopor,
                    (SELECT u.nombreusuario FROM  mod_seguridad.seg_usuario u WHERE u.idusuario = 
                    rnr.idaprobado) AS aprobadopor
        ";
        
        
        $sqlGroupBy = " GROUP BY ni.codigo, ni.denominacion, dp.cantidad, dp.idproducto, dp.idindicador,
            ni.idnaturaleza, rnr.idrevisado, rnr.idaprobado";
        
        if (is_numeric($start) && is_numeric($limit)) {
            $sqlPaginado = " OFFSET($start) LIMIT($limit)";
        } else {
            $sqlPaginado = "";
        }
            
        if ($regnum) {
            $selectData .= ' ,rnr.idregnumerico, rnr.idestructura, rnr.valorcontablerevaluado,
            rnr.depreciacionrevaluado as depreciacionrev';
            $sqlGroupBy .= ' ,rnr.idregnumerico,rnr.idestructura, rnr.valorcontablerevaluado';
        }
        $sqlFrom = "
            FROM  mod_datosmaestros.nom_indicador  ni
            inner join mod_logistica.dat_producto dp on dp.idindicador = ni.idindicador
            inner join mod_logactivofijotangible.dat_registronumerico rn on  dp.idproducto = rn.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico 
            --INNER JOIN mod_estructuracomp.dat_estructuraop eop ON dp.idestructura = eop.idestructuraop
            LEFT JOIN mod_logactivofijotangible.dat_regnumericorevaluacion rnr on rn.idregnumerico = rnr.idregnumerico            
            ";

        $sqlWhere = ' WHERE dp.cronologia > 0 AND rna.idestadoperacion IN (1,2,3,4,5,6,8)';
        
        if ($criterio) {
            $sqlWhere = " AND ( 
                ni.codigo iLike '%$criterio%' OR 
                ni.denominacion iLike '%$criterio%')
            ";
        }
        if ($idestructura && strlen($idestructura)) {
            $sqlWhere .= (strlen($sqlWhere)) ? " AND dp.idestructura = $idestructura" : "
            WHERE dp.idestructura = $idestructura";
        }
            
        
        $sqlSelectCount = "SELECT COUNT(ni.idindicador) as cantidad";
        $sqlGroupByTotal = " GROUP BY ni.idindicador";
        $sqlOrderBy = " ORDER BY denominacion";
		$respuesta['datos'] = LogisticaDoctrineHelper::__init()
            ->getConnection()->execute($selectData.$sqlFrom.$sqlWhere.$sqlGroupBy.$sqlOrderBy.$sqlPaginado)
            ->fetchAll(PDO::FETCH_OBJ);
		$respuesta['total'] = count(LogisticaDoctrineHelper::__init()
            ->getConnection()->execute($sqlSelectCount.$sqlFrom.$sqlWhere.$sqlGroupByTotal)->fetchAll(PDO::FETCH_OBJ)
        );
        
		
		foreach ($respuesta['datos'] as $value) {
			$respuesta['impTotal'] += $value->importe;
			$respuesta['impRevTotal'] += $value->importereevaluado;
		}
		
        
		
        $respuesta['difTotal'] = $respuesta['impRevTotal'] - $respuesta['impTotal'];
        $sql = "select rnr.* FROM mod_logactivofijotangible.dat_regnumericorevaluacion rnr "
            . " where rnr.idestructura = {$idestructura}";        
        $evaluado = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);        
        $respuesta['evaluado'] = (count($evaluado) > 0 ? true: false);
        $respuesta['revisado'] = (strlen($respuesta['datos'][0]->revisadopor)) ? true : false;
        $respuesta['aprobado'] = (strlen($respuesta['datos'][0]->aprobadopor)) ? true : false;;
        
        return $respuesta;
    }

    /**
     *  Devuelve el listado de productos ya evaluados
     */
   /* private function getProductosEvaluados($start, $limit, $idestructura, $criterio)
    {
        $respuesta = array();

        $selectData = "
            SELECT 
                ni.codigo || ' - ' || ni.denominacion AS denominacion,
                ni.numeropieza,
                nc.denominacion AS categoria,
                num.abreviaturaunidadmedida AS um,                
                pe.valorcontable,
                pe.idregnumerico,
                pe.valorcontablerevaluado,
                (
                    SELECT u.nombreusuario FROM  mod_seguridad.seg_usuario u WHERE u.idusuario = pe.idrevisado
                ) AS revisadopor,
                (
                    SELECT u.nombreusuario FROM  mod_seguridad.seg_usuario u WHERE u.idusuario = pe.idaprobado
                ) AS aprobadopor,
                ni.idnaturaleza
        ";

        $selectTotal = " SELECT COUNT(pe.idregnumerico) ";

        $sqlPaginado = ($limit) ? " OFFSET($start) LIMIT($limit)" : "";

        $sqlFrom = "
              
           FROM mod_logactivofijotangible.dat_regnumericorevaluacion pe          
          INNER JOIN mod_logistica.dat_producto dp ON pe.idproducto = dp.idproducto
          INNER JOIN mod_datosmaestros.nom_indicador ni ON dp.idindicador = ni.idindicador
          LEFT  JOIN mod_logistica.nom_categoria nc ON dp.idcategoria = nc.idcategoria
          LEFT  JOIN mod_datosmaestros.nom_unidadmedida num ON dp.idumedida = num.idunidadmedida 
                
                    ";

        $sqlWhere = '';

        if ($criterio) {
            $sqlWhere = " WHERE 
                ni.codigo iLike '%$criterio%' OR 
                ni.denominacion iLike '%$criterio%' OR 
                ni.numeropieza iLike '%$criterio%' OR 
                nc.denominacion iLike '%$criterio%' OR 
                num.abreviaturaunidadmedida iLike '%$criterio% ' 
            ";
        }

        if ($idestructura && strlen($idestructura)) {
            $sqlWhere .= (strlen($sqlWhere)) ? " AND dp.idestructura = $idestructura" :
            " WHERE dp.idestructura = $idestructura";
        }

        $sqlOrderBy = " ORDER BY ni.denominacion ASC ";
        $respuesta['datos'] = LogisticaDoctrineHelper::__init()->getConnection()
        ->execute($selectData.$sqlFrom.$sqlWhere.$sqlOrderBy.$sqlPaginado)->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = LogisticaDoctrineHelper::__init()->getConnection()
        ->execute($selectTotal.$sqlFrom.$sqlWhere)->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = $respuesta['total'][0]->count;

        $respuesta['impTotal'] = 0;
        $respuesta['impRevTotal'] = 0;

        foreach ($respuesta['datos'] as $value) {
            $respuesta['impTotal'] += $value->importe;
            $respuesta['impRevTotal'] += $value->importerevaluado;
        }

        $respuesta['difTotal'] = $respuesta['impRevTotal'] - $respuesta['impTotal'];

        $respuesta['evaluado'] = true;
        $respuesta['revisado'] = (strlen($respuesta['datos'][0]->revisadopor)) ? true : false;
        $respuesta['aprobado'] = (strlen($respuesta['datos'][0]->aprobadopor)) ? true : false;
        return $respuesta;
    }*/

    /**
     *  Inserta el listado de productos ha evaluar en una tabla temporal
     */
    public function insertProductosEvaluacion($parametros)
    {
        $confRevaluacion = self::getConfiguracionEvaluacion();

        /**
         *  Primero se limpia la tabla de la revaluacion anterior
         */
        self::deleteProductosEvaluacion();
        
        $idestructura = ($parametros['idestructura']) ? $parametros['idestructura'] : 'NULL';
        $coeficiente = $confRevaluacion->coeficiente;
        
        /**
         *  Segundo se inserta la nueva revaluacion
         */
        $sqlInsert = "
            INSERT INTO mod_logactivofijotangible.dat_regnumericorevaluacion(
            idregnumerico, 
            valorcontable,
            valorcontablerevaluado,
            diferencia, 
            idestructura, 
            iddocumento, 
            tasa,   
            depreciacion, 
            depreciacionrevaluado, 
            depreciaciondiferencia
          )
          SELECT
              rn.idregnumerico,

              COALESCE(rna.valorcontable,0) + COALESCE(rna.valorcontablealternativo, 0) as valorcontable,
              (COALESCE(rna.valorcontable,0) + COALESCE(rna.valorcontablealternativo, 0)) * $coeficiente as reevaluado,
              ((COALESCE(rna.valorcontable,0) + COALESCE(rna.valorcontablealternativo, 0)) *
              $coeficiente) - (COALESCE(rna.valorcontable,0) + COALESCE(rna.valorcontablealternativo, 0)) as diferencia,

              dp.idestructura as idestructura,
              NULL as iddocumento,
              $coeficiente as coeficiente,

              COALESCE(rna.depreciacionacumulada,0) + COALESCE(rna.depreciacionacumuladaalternativo,0) as depreciacion,
              (COALESCE(rna.depreciacionacumulada,0) + COALESCE(rna.depreciacionacumuladaalternativo,0)) *
              $coeficiente as depreciacionreevaluado,
              ((COALESCE(rna.depreciacionacumulada,0) + COALESCE(rna.depreciacionacumuladaalternativo,0)) *
              $coeficiente) - (COALESCE(rna.depreciacionacumulada,0) + COALESCE(rna.depreciacionacumuladaalternativo,0))
               as depreciaciondiferencia

          FROM mod_logactivofijotangible.dat_regnumericoactivo rna
          INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idregnumerico = rna.idregnumerico
          INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = rn.idproducto
          WHERE dp.cronologia > 0 AND rna.idestadoperacion IN (1,2,3,4,5,6,8)
        ";
        
        if ($idestructura != 'NULL') {
            $sqlInsert .= " AND dp.idestructuracomun = $idestructura";
        } 

        LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlInsert);
    }

    /**
     *  Limpia el listado de productos ha evaluar guardados de forma temporal
     */
    private function deleteProductosEvaluacion()
    {
        $sqlLimpiarTabla = "DELETE FROM mod_logactivofijotangible.dat_regnumericorevaluacion";
        LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlLimpiarTabla);
    }
    
    public function getConfiguracionEvaluacion()
    {
        return json_decode(file_get_contents($this->urlFireConfuracion, true));
    }

    
    
    /**
     *  Devuelve el listado de documentos segun un arreglo de estados
     */
    public function getDocumentos($start, $limit, $idestructura = '', $arrEstados)
    {
        $respuesta = array();
        unset($idestructura);
        $arrEstados = '{'.implode(',', $arrEstados).'}';

        $selectData = "
             SELECT 
                dd.iddocumento, 
                dd.numeroref, 
                dd.nrodoc,                
                ddp.sigla,
				ndp.denominacion as tipodoc, 
                (
                    SELECT SUM(m.cantidad) FROM mod_logistica.dat_movimiento m WHERE m.iddocumento = dd.iddocumento
                ) AS cantidad,
                (
                    SELECT u.nombreusuario FROM  mod_seguridad.seg_usuario u WHERE u.idusuario = dd.idusuario
                ) AS creadopor,
				noper.denominacion as operacion,
				coalesce(est.denominacion, estop.denominacion) as entidad
				
        ";

        $selectTotal = " SELECT COUNT(dd.iddocumento) ";

        $sqlPaginado = " ORDER BY fila.idfila OFFSET($start) LIMIT($limit) ";


        $sqlFrom = "
            FROM mod_logistica.dat_documento dd
                INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON dd.iddoc = ddp.iddoc
                INNER JOIN mod_datosmaestros.dat_estructurasubsist deb ON
                deb.idestructurasubsist = ddp.idestructurasubsist
                INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
				INNER JOIN mod_datosmaestros.nom_operacion noper on noper.idnomoperaciones = dd.idoperacion
				INNER JOIN mod_datosmaestros.dat_estructurasubsist esubsist on esubsist.idestructurasubsist = ddp.idestructurasubsist
				INNER JOIN mod_estructuracomp.nom_filaestruc fila on fila.idfila = esubsist.idestructuracomun
				LEFT JOIN mod_estructuracomp.dat_estructura est on est.idestructura = fila.idfila and est.idproyecto = 0
				LEFT JOIN mod_estructuracomp.dat_estructuraop estop on estop.idestructuraop = fila.idfila and estop.idproyecto = 0
                --AFT
                LEFT JOIN mod_logactivofijotangible.dat_documentoactivo docaft ON
                docaft.iddocumentoactivo = dd.iddocumento
            ";


        $sqlWhere = " WHERE 
            dd.estado = any(cast('$arrEstados' as numeric[])) and deb.idsubsistema in(11)          
        ";


        /*if ($idestructura && strlen($idestructura)) {
            $sqlWhere .= " AND ((df.iddeposito = $idestructura  or pm.idestructura = $idestructura
            or po.idestructura = $idestructura ) or $idestructura is null)";
        }*/     
        $respuesta['datos'] = LogisticaDoctrineHelper::__init()->getConnection()
            ->execute($selectData.$sqlFrom.$sqlWhere.$sqlPaginado)
            ->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = LogisticaDoctrineHelper::__init()->getConnection()
            ->execute($selectTotal.$sqlFrom.$sqlWhere)
            ->fetchAll(PDO::FETCH_OBJ);
        $respuesta['total'] = $respuesta['total'][0]->count;

        return $respuesta;
    }

    

    public function setConfiguracionEvaluacion(/* $tasa, */$coeficiente)
    {
        //$datos['tasa'] = $tasa;
        $datos['coeficiente'] = $coeficiente;

        unlink($this->urlFireConfuracion);
        file_put_contents($this->urlFireConfuracion, json_encode($datos, JSON_UNESCAPED_UNICODE));
    }

    public function revisarRevaluacion($idUsuario, $idEstructura)
    {
       
        $sql = "UPDATE mod_logactivofijotangible.dat_regnumericorevaluacion SET idrevisado = $idUsuario
                  WHERE idestructura = $idEstructura"; 
        LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
    }

	public function aprobarRevaluacion_v2($idUsuario, $idarearesp){
		
		$idestructura = $this->global->Estructura->idestructura;
		
		$operacion = ComunAFTModel::getInstance()->getDatosInterfazOperacion(false, false, 'OPER_REEVALUACION', false);
        if(count($operacion) > 0){
			$iddoc = $operacion[0]['iddoc'];
			$paramsDocumento = array('idoperacion' => $operacion[0]['idoperacion'],
				'observaciones' => "Reevaluacion de activos fijos tangibles y utiles y herramientas",
				'iddoc' => $iddoc,
				'idestructuracomun' => $idarearesp
			);
			$cDatDocumentoActivo = 'DatDocumentoActivo';
			$oDocumentoAFT = new DocumentoActivoModel();
			$documento = $oDocumentoAFT->adicionarDocumento($paramsDocumento);
			$documento->estado = 2;
			$documento->$cDatDocumentoActivo;
			//print_r($documento->toArray());die;
			$documento->save();
			
			$iddocumento = $documento->iddocumento;
			
			
			
			$conn = Zend_Registry::get('conexion');
			$var = $conn->fetchAll(
				"SELECT * FROM \"mod_logactivofijotangible\".\"f_aprobrevaluacionarea\"" .
				"($idarearesp, $idUsuario, $idestructura, $iddocumento)"
			);	

			// Esto no se para que es
			$this->integrator->contabilidad->unificacionSubsistema(
				LogisticaGlobal::SUBSISTEMA_AFT, $this->global->Estructura->idestructura, $flag
			);
			
			
		}else{
			//die('No está configurada la operación');
			throw new ZendExt_Exception('LOG_AFT_OPER_REEVALUACION_NOTFOUND');
		}
	}

    public function aprobarRevaluacion($idUsuario, $idarearesp)
    {
        $docGenerado = $this->preAprobarRevaluacion($idUsuario, $idarearesp);
        
        $sql = "UPDATE mod_logactivofijotangible.dat_regnumericorevaluacion SET idaprobado = $idUsuario
                    WHERE idestructura = $idarearesp";

        $this->postAprobarReevaluacion($docGenerado['iddocumento'], $idarearesp);

        LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
        $flag = true;
        $this->integrator->contabilidad->unificacionSubsistema(
            LogisticaGlobal::SUBSISTEMA_AFT, $this->global->Estructura->idestructura, $flag
        );
    }

    private function preAprobarRevaluacion($idUsuario, $idarearesp)
    {
        $arrProdEvaluados = $this->getProductosSinEvaluacion(false, false, $idarearesp, false, true);
        unset($idUsuario);
        $cEstructura = 'Estructura';
        $identidad = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $obj = new DocumentoActivoService();
        $parametros['codigooperacion'] = 'OPER_REEVALUACION';
        $parametros['idestructuracomun'] = $idarearesp;
        $parametros['idarearesp'] = $idarearesp;
        $parametros['idestructuraEntidad'] = $identidad;
        
        foreach ($arrProdEvaluados['datos'] as $index =>$value) {
            $arrProdEvaluados['datos'][$index]->idprod = $value->idindicador;
            $arrProdEvaluados['datos'][$index]->idestructuraEntidad = $parametros['idestructuraEntidad'];            
        }        
        $parametros['datos'] = $arrProdEvaluados['datos'];
        $parametros['revaluado'] = true;
        $doc = $obj->generarDocumento($parametros);
        $iddocumento = $doc->iddocumento;
        $idoperacion = $doc->idoperacion;
        $doc->estado = 2;
        $doc->save();
        // Aprobando el documento
        $obj->aprobarDocumento(
            $iddocumento, $idoperacion, $identidad, "Reevaluacion de activos fijos tangibles"
        );
        return $doc;
    }
    
    /**
     * Guarda los datos en la tabla dat_resumenrevaluacion para poder generar comprobante. 
     * @param type $iddocumento
     * @param type $idestructura
     */
    private function postAprobarReevaluacion($iddocumento, $idarearesp)
    {
        $cEstructura = 'Estructura';
        $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        
        
        $sql = "INSERT INTO 
        mod_logactivofijotangible.dat_resumenrevaluacion
        (
          idgruposubgrupo,
          idcuentaactivo,
          idcuentadepreciacion,  
          idcuentaactivoalt, 
          idcuentadepreciacionalt,

          diferencia,
          valorcontablealeternativo,
          diferenciadepreciacion,
          depreciacionalternativo,
          signo,
          iddocumentorevaluacion
        ) 
        SELECT 
            ngs.idgruposubgrupo, 
            cgc.idcuentaactivo, 
            cgc.idcuentadepreciacion, 
            cgc.idcuentaactivoalternativa, 
            cgc.idcuentadepreciacionalternativa,

            abs(SUM(COALESCE(rnr.diferencia,0))) as diferencia,
            SUM(COALESCE(rna.valorcontablealternativo,0)) as valorcontablealeternativo,
            abs(SUM(COALESCE(rnr.depreciaciondiferencia,0))) as diferenciadepreciacion,
            SUM(COALESCE(rna.depreciacionacumuladaalternativo,0)) as depreciacionalternativo,


            (CASE WHEN rnr.tasa >= 1 THEN 1 ELSE 0 END) as signo,
            $iddocumento as iddocumento

        FROM mod_datosmaestros.nom_gruposubgrupo ngs
        INNER JOIN mod_logactivofijotangible.conf_gruposcuentas cgc on cgc.idgruposubgrupo = ngs.idgruposubgrupo
        INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON nih.idgruposubgrupo = ngs.idgruposubgrupo
        INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = nih.idindicador
        INNER JOIN mod_logistica.dat_producto dp ON dp.idindicador = ni.idindicador
        INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = dp.idproducto
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rn.idregnumerico = rna.idregnumerico
        INNER JOIN mod_logactivofijotangible.dat_regnumericorevaluacion rnr ON rnr.idregnumerico = rn.idregnumerico



        WHERE cgc.idestructura = $idestructura AND dp.idestructuracomun = $idestructura AND
        dp.idestructura = $idarearesp
        AND dp.cronologia > 0 AND rna.idestadoperacion IN (1,2,3,4,5,6,8)
        GROUP BY ngs.idgruposubgrupo, cgc.idcuentaactivo, cgc.idcuentadepreciacion, cgc.idcuentaactivoalternativa,
        cgc.idcuentadepreciacionalternativa,rnr.tasa
        ";
        LogisticaDoctrineHelper::__init()->getConnection()->execute($sql);
    }
    
    private function updateProductos($arrProdEvaluados, $cronologia)
    {
        $collProductos = new Doctrine_Collection('DatProductoLogistica');

        foreach ($arrProdEvaluados['datos'] as $value) {           
            $producto = Doctrine::getTable('DatProductoLogistica')->find($value->idproducto);
            $producto->cronologia = $cronologia;
            //$producto->precio = $value->preciorevaluado;
            $producto->cantidad = $value->existencia;
            $producto->disponible = $value->existencia;
            $producto->importe = $value->importerevaluado;
            //$producto->precioalternativo = 0;
            //$producto->importealternativo = 0;
            $collProductos->add($producto);
        }
       
        $collProductos->save();
    }
	
	public function validarDatosRevaluacionEntidad()
	{
		$cEstructura = 'Estructura';
        $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
		
		$validation = new StdClass(); 
		$validation->isValid = true;
		$validation->message = "";
		
		// Buscar activos con estado 0-> sin estar en documentos o 6 -> trasladados sin recepcionar.
		$sql = "SELECT rn.idregnumerico
			FROM mod_logactivofijotangible.dat_registronumerico rn
			INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
			INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
			where p.idestructuracomun = {$idestructura} and rna.idestadoperacion in (0,6)
			";
		
		$conn = Zend_Registry::get('conexion');
		$registros = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
		
		if(count($registros) > 0){
			$validation->isValid = false;
			$validation->message = 'Revise la funcionalidad <b>Registro de activos</b> para comprobar que no tenga medios sin movimientos.<br> Revise tambien la funcionalidad de recepcion de medios en <b>Gestión de documentos</b>."';
		}
		
		$sql2 = "
			SELECT rn.idregnumerico
			FROM mod_logactivofijotangible.dat_registronumerico rn
			INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
			inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
			inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
			inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
			where d.estado in (1,2) and p.idestructuracomun = {$idestructura}
		";
		$conn2 = Zend_Registry::get('conexion');
		$registrosEnMovs = $conn2->execute($sql2)->fetchAll(PDO::FETCH_ASSOC);
		if(count($registrosEnMovs) > 0){
			$validation->isValid = false;
			$validation->message = $validation->message . "<br>Existen activos o útiles en documentos que no están aprobados.";
		}
		
		return $validation;
	}

}
