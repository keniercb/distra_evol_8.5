<?php

/**
 * Jorge Luis Cuellar Mondeja
 */
if (!class_exists('ComunAFTModel')) {
    $dirAFT = Zend_Registry::getInstance()
            ->get('config')->dir_aplication . '/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ControlDisponibilidadModel extends BaseModel
{

    public function __construct()
    {
        
    }

    public function GetMediosTransporte($parametros)
    {

        $integrator = ZendExt_IoC::getInstance();
        $unidadesTransporte = array();
        $bandera = true;

        if ($parametros['idestatusoperativo']) {
            $respuesta = DatTransDisponibilidad::GetTransDisponibilidad(
                    array('idestatusoperativo' => $parametros['idestatusoperativo'])
            );
            foreach ($respuesta as $value) {
                $parametros['idregnumericoMostrar'] [] = $value['idregnumerico'];
            }

            $bandera = (count($parametros['idregnumericoMostrar'])) ? true : false;
        }

        if ($bandera) {

            $unidadesTransporte = $integrator->activos_fijos->GetUnidadesArrastreTransporte(
                $parametros
            );

            foreach ($unidadesTransporte['datos'] as &$value) {
                $subEstado = DatTransDisponibilidad::GetSubStatusAsignado(
                        $value['idregnumerico']
                );

                if (count($subEstado)) {
                    $estado = $integrator->activos_fijos->getEstatusOperativos(
                        array('idestatusoperativo' => $subEstado[0]['idestatustecnico'])
                    );

                    $value['denominacionestado'] = $estado[0]['denominacion'];
                    $value['idestatustecnico'] = $subEstado[0]['idestatustecnico'];
                    $value['descripcionestado'] = $subEstado[0]['descripcion'];
                } else {
                    $value['denominacionestado'] = '';
                    $value['idestatustecnico'] = '';
                    $value['descripcionestado'] = '';
                }
            }
        }

        if (count($unidadesTransporte) > 0) {
            return $unidadesTransporte;
        } else {
            return array('datos' => array(), 'total' => 0);
        }
    }

    public function ModificarEstadoMedio($parametros)
    {
        $objeto = Doctrine::getTable('DatTransDisponibilidad')->find($parametros['idregnumerico']);
        if (!$objeto) {
            $objeto = new DatTransDisponibilidad();
            $objeto->idregnumerico = $parametros['idregnumerico'];
        }
        $objeto->idestatusoperativo = $parametros['idestatusoperativo'];
        $objeto->descripcion = $parametros['observaciones'];
        $objeto->idindicador = $parametros['idprod'];
        $objeto->save();
        if ($parametros['paralizado'] == 2) {
            $objeto2 = Doctrine::getTable('DatDatosEspTransDisponibilidad')->find($parametros['idregnumerico']);
            if (!$objeto2) {
                $objeto2 = new DatDatosEspTransDisponibilidad();
                $objeto2->idregnumerico = $parametros['idregnumerico'];
            }
            $objeto2->causa = $parametros['causa'];
            $objeto2->motivo = $parametros['motivo'];
            $objeto2->ubicacion = $parametros['ubicacion'];
            $objeto2->pendiente = $parametros['pendiente'];
            $objeto2->save();
        }

        if ($parametros['paralizado'] == 3) {
            $obj = Doctrine::getTable('DatDatosEspTransDisponibilidad')->find($parametros['idregnumerico']);
            if ($obj->idregnumerico) {
                $obj->delete();
            }
        }
    }

    public function GetSubEstatus($parametros)
    {
        return NomencladoresActivosService::getEstatusOperativos($parametros);
    }


    public function GetDisponibilidadTransporte($parametros)
    {
        if ($parametros['idindicador'] == null) {
            $sql = "SELECT i.idpadre, i.idindicador, i.denominacion,
                    marca.denominacion as marca,
                    modelo.denominacion as modelo, i.codigo,
                    i.ordenizq, i.ordender, i.nivel as _level, i.idindicador as id
                    FROM mod_datosmaestros.nom_indicador i
                    LEFT JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                    LEFT JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                    LEFT JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
					WHERE i.idindicador = i.idpadre";
            $conn = Zend_Registry::get('conexion');
			$respdata = $conn->execute($sql);
            $indicadores = $respdata->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $sql = "SELECT i.idpadre, i.idindicador, i.denominacion,
                    marca.denominacion as marca,
                    modelo.denominacion as modelo, i.codigo,
                    i.ordenizq, i.ordender, i.nivel as _level, i.idindicador as id
                    FROM mod_datosmaestros.nom_indicador i
                    LEFT JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                    LEFT JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                    LEFT JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
                    WHERE  i.idindicador <> i.idpadre AND i.idpadre = ". $parametros['idindicador'];
            $conn = Zend_Registry::get('conexion');
            $respdata = $conn->execute($sql);
            $indicadores = $respdata->fetchAll(PDO::FETCH_ASSOC);
        }

		$resp = array();
        $strInEstructuras = implode(",", $parametros['estructuras']);
        foreach($indicadores as $pos => $indicador){
			$idindicador = $indicador['idindicador'];
			$sql_filtro_ind = "SELECT 
						(
							SELECT COUNT (ind1.idindicador)
							FROM mod_datosmaestros.nom_indicador ind1 
							INNER JOIN mod_logistica.dat_producto dp1 ON dp1.idindicador = ind1.idindicador
							WHERE ind1.idarbol = ind.idarbol AND dp1.idestructura IN ($strInEstructuras)
						) AS cantidad

					FROM mod_datosmaestros.nom_indicador ind
					WHERE ind.idindicador = $idindicador";
			$connection = Zend_Registry::get('conexion');
            $resdat = $connection->execute($sql_filtro_ind);
            $cantidad = $resdat->fetchAll(PDO::FETCH_ASSOC);
			$cantidad = $cantidad[0]['cantidad'];
			if($cantidad > 0){
				$indicadores[$pos]['text'] = $indicadores[$pos]['denominacion'];
				if($indicador['marca'] != null){
					$indicadores[$pos]['text'] = $indicadores[$pos]['denominacion'] . " ". $indicador['marca'];
				}
				if ($indicador['modelo'] != null) {
					$indicadores[$pos]['text'] = $indicadores[$pos]['denominacion'] . " " . $indicador['modelo'];
				}
				if($indicador['ordender'] - $indicador['ordenizq'] == 1){
					$indicadores[$pos]['leaf'] = true;
					$indicadores[$pos]['_is_leaf'] = true;
				}else{
					$indicadores[$pos]['leaf'] = false;
					$indicadores[$pos]['_is_leaf'] = false;
				}
				$indicadores[$pos]['_is_loaded'] = true;
				$sql = "SELECT
							ni.idindicador,
							count(drna.idregnumerico) as cantidad,
							(
								SELECT count(dtd.idregnumerico)
								FROM mod_logactivofijotangible.dat_transdisponibilidad dtd
								INNER JOIN mod_logactivofijotangible.nom_estatusoperativo neop ON neop.idestatusoperativo = dtd.idestatusoperativo
								INNER JOIN mod_logactivofijotangible.dat_estatustecnicoestatusoperativo deto ON neop.idestatusoperativo =  deto.idestatusoperativo
								INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = dtd.idregnumerico
								INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna1 ON drn1.idregnumerico
								= drna1.idregnumerico
								INNER JOIN mod_logistica.dat_producto dp1 ON drn1.idproducto = dp1.idproducto
								WHERE deto.afectacdt = 0 AND dp1.idindicador = ni.idindicador AND drna1
								 .idestadoperacion IN (1,3)
							) as disponibilidad,
							marca.denominacion as marca,
							modelo.denominacion as modelo

						FROM mod_datosmaestros.nom_indicador ni
						INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON nih.idindicador = ni.idindicador
						INNER JOIN mod_logistica.dat_producto dp ON nih.idindicador = dp.idindicador
						INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON drn.idproducto = dp.idproducto
						INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna ON drna.idregnumerico = drn.idregnumerico
						LEFT JOIN mod_datosmaestros.nom_marca marca ON nih.idmarca = marca.idmarca
						LEFT JOIN mod_datosmaestros.nom_modelo modelo ON modelo.idmodelo = nih.idmodelo
						WHERE dp.idestructura IN ($strInEstructuras)
						AND drna.idestadoperacion IN (1,3)
						AND ni.idindicador IN (
							  SELECT ni1.idindicador
							  FROM mod_datosmaestros.nom_indicador ni1
							  WHERE ni1.idarbol = (SELECT i1.idarbol FROM mod_datosmaestros.nom_indicador i1
								WHERE i1.idindicador = $idindicador)
							  AND ni1.ordenizq >= (SELECT i1.ordenizq FROM mod_datosmaestros.nom_indicador i1
								WHERE i1.idindicador = $idindicador)
							  AND ni1.ordender <= (SELECT i1.ordender FROM mod_datosmaestros.nom_indicador i1
								WHERE i1.idindicador = $idindicador)
						)
						GROUP BY ni.idindicador, marca.denominacion, modelo.denominacion";
				$conn1 = Zend_Registry::get('conexion');
				$respdata1 = $conn1->execute($sql);
				$datos = $respdata1->fetchAll(PDO::FETCH_ASSOC);
				$cantidades = 0;
				$disponibles = 0;
				foreach($datos as $d){
					$cantidades += $d['cantidad'];
					$disponibles += $d['disponibilidad'];
				}
				$indicadores[$pos]['uiProvider'] = "col";
				$indicadores[$pos]['cantidad'] = $cantidades;
				$indicadores[$pos]['disponible'] = $disponibles;
				// Calculo el porciento de disponibilidad
				$porciento = round(
					$disponibles / $cantidades * 100
				);
				$indicadores[$pos]['porciento'] = $porciento/100;
				
				array_push($resp, $indicadores[$pos]);
			}
        }
        return array('datos'=>$resp);
    }

    public function GetDisponibilidadTransporteOld($parametros)
    {
        /*if ($parametros['idindicador'] == null) {
            $sql = "SELECT i.idpadre, i.idindicador, i.denominacion,
                    marca.denominacion as marca,
                    modelo.denominacion as modelo, i.codigo,
                    i.ordenizq, i.ordender, i.nivel as _level
                    FROM mod_datosmaestros.nom_indicador i
                    LEFT JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                    LEFT JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                    LEFT JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
                    WHERE i.idindicador = i.idpadre";
            $conn = Zend_Registry::get('conexion');
            $respdata = $conn->execute($sql);
            $indicadores = $respdata->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $sql = "SELECT i.idpadre, i.idindicador, i.denominacion,
                    marca.denominacion as marca,
                    modelo.denominacion as modelo, i.codigo,
                    i.ordenizq, i.ordender, i.nivel as _level
                    FROM mod_datosmaestros.nom_indicador i
                    LEFT JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                    LEFT JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                    LEFT JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
                    WHERE  i.idindicador <> i.idpadre AND i.idpadre = ". $parametros['idindicador'];
            $conn = Zend_Registry::get('conexion');
            $respdata = $conn->execute($sql);
            $indicadores = $respdata->fetchAll(PDO::FETCH_ASSOC);
        }

        $strInEstructuras = implode(",", $parametros['estructuras']);
        foreach($indicadores as $pos => $indicador){
            $indicadores[$pos]['text'] = $indicadores[$pos]['denominacion'];
            if($indicador['marca'] != null){
                $indicadores[$pos]['text'] = $indicadores[$pos]['denominacion'] . " ". $indicador['marca'];
            }
            if ($indicador['modelo'] != null) {
                $indicadores[$pos]['text'] = $indicadores[$pos]['denominacion'] . " " . $indicador['modelo'];
            }
            if($indicador['ordender'] - $indicador['ordenizq'] == 1){
                $indicadores[$pos]['leaf'] = true;
                $indicadores[$pos]['_is_leaf'] = true;
            }else{
                $indicadores[$pos]['leaf'] = false;
                $indicadores[$pos]['_is_leaf'] = false;
            }
            $indicadores[$pos]['_is_loaded'] = true;



            $idindicador = $indicador['idindicador'];
            $sql = "SELECT
                        ni.idindicador,
                        count(drna.idregnumerico) as cantidad,
                        (
                            SELECT count(dtd.idregnumerico)
                            FROM mod_logactivofijotangible.dat_transdisponibilidad dtd
                            INNER JOIN mod_logactivofijotangible.nom_estatusoperativo neop ON neop.idestatusoperativo = dtd.idestatusoperativo
                            INNER JOIN mod_logactivofijotangible.dat_estatustecnicoestatusoperativo deto ON neop.idestatusoperativo =  deto.idestatusoperativo
                            INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = dtd.idregnumerico
                            INNER JOIN mod_logistica.dat_producto dp1 ON drn1.idproducto = dp1.idproducto
                            WHERE deto.afectacdt = 0 AND dp1.idindicador = ni.idindicador
                        ) as disponibilidad,
                        marca.denominacion as marca,
                        modelo.denominacion as modelo

                    FROM mod_datosmaestros.nom_indicador ni
                    INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON nih.idindicador = ni.idindicador
                    INNER JOIN mod_logistica.dat_producto dp ON nih.idindicador = dp.idindicador
                    INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON drn.idproducto = dp.idproducto
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna ON drna.idregnumerico = drn.idregnumerico
                    LEFT JOIN mod_datosmaestros.nom_marca marca ON nih.idmarca = marca.idmarca
                    LEFT JOIN mod_datosmaestros.nom_modelo modelo ON modelo.idmodelo = nih.idmodelo
                    WHERE dp.idestructura IN ($strInEstructuras)
                    AND ni.idindicador IN (
                          SELECT ni1.idindicador
                          FROM mod_datosmaestros.nom_indicador ni1
                          WHERE ni1.idarbol = (SELECT i1.idarbol FROM mod_datosmaestros.nom_indicador i1
                            WHERE i1.idindicador = $idindicador)
                          AND ni1.ordenizq > (SELECT i1.ordenizq FROM mod_datosmaestros.nom_indicador i1
                            WHERE i1.idindicador = $idindicador)
                          AND ni1.ordender < (SELECT i1.ordender FROM mod_datosmaestros.nom_indicador i1
                            WHERE i1.idindicador = $idindicador)
                    )
                    GROUP BY ni.idindicador, marca.denominacion, modelo.denominacion";
            $conn1 = Zend_Registry::get('conexion');
            $respdata1 = $conn1->execute($sql);
            $datos = $respdata1->fetchAll(PDO::FETCH_ASSOC);



            $cantidades = 0;
            $disponibles = 0;
            foreach($datos as $d){
                $cantidades += $d['cantidad'];
                $disponibles += $d['disponibilidad'];
            }
            $indicadores[$pos]['cantidad'] = $cantidades;
            $indicadores[$pos]['disponibilidad'] = $disponibles;
            // Calculo el porciento de disponibilidad
            $porciento = round(
                $disponibles / $cantidades * 100
            );
            $indicadores[$pos]['porciento'] = $porciento;

        }


return $indicadores;*/






//        $naturalezas
//            = $integrator->activos_fijos->GetArrayNaturalezasUnidArrastreTransporte(
//        );

        $parametros['idnaturalezaMostrar'] = array(); //$naturalezas
        // Obtengo las nomenclaturas de los medios de transporte
        if (is_numeric($parametros['node'])) {
            $parametros['idnodo'] = $parametros['node'];
        } else {
            unset($parametros['node']);
        }

        $indicadores = self::getDatosTreeGridDisponibilidad(
                $parametros, $parametros['formatos']
        );
        //print_r($indicadores);
        $datos = Array();
        foreach ($indicadores as $value) {

            // Busco todas las nomenclaturezas hijas (entre izq y der y con mismo idarbol)
            $descendencia = ($value['ordender'] - $value['ordenizq'] > 1) ? $this->configuracionHelper->getArrIndicadoresDescendencia(
                    $value['idarbol'], $value['ordenizq'], $value['ordender'],
                    $parametros['idnaturalezaMostrar']//$naturalezas
                ) : $value['idindicador'];

            $cantidadMedios = (count($descendencia)) ? self::GetCantMediosDisponibles(
                    json_decode($parametros['estructurasIn']), $descendencia
                ) : 0;



            $cantidadMediosDisponibles = (count($descendencia)) ? self::GetCantMediosDisponibles(
                    json_decode($parametros['estructurasIn']), $descendencia, true
                ) : 0;
            // Calculo el porciento de disponibilidad
            $porciento = round(
                $cantidadMediosDisponibles[0] / $cantidadMedios[0] * 100
            );




//print_r($value);

            //if (!$value['leaf'] || ($value['leaf'] && $value['idregnumerico'])
            if ($value['leaf'] && $cantidadMedios[0] > 0
            ) {
                $dat = array('id' => $value['idindicador'],
                    'codigo' => $value['codigo'],
                    'leaf' => $value['leaf'],
                    'porciento' => $porciento, 'uiProvider' => 'col',
                    'cantidad' => $cantidadMedios,
                    'disponible' => $cantidadMediosDisponibles,
                    'text' => $value['denominacion'] . ' '
                    . $value['descripcionmarcamodelo']);
                $bandera = true;
                foreach ($datos as $d) {
                    if ($d['id'] == $dat['id']) {
                        $bandera = false;
                        break;
                    }
                }

                if ($bandera) {
                    $datos[] = $dat;
                }
            }
        }

        return $datos;
    }

    public function GetRegNumericosDisponibles($parametros)
    {
        return DatTransDisponibilidad::GetRegNumericosDisponibles($parametros);
    }

    public function GetCantMediosDisponibles($estructuras, $arregloIdsProd = false, $disponibles = false)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT COUNT(r.idregnumerico)
        FROM mod_logactivofijotangible.dat_registronumerico r
        INNER JOIN mod_logistica.dat_producto p ON p.idproducto =  r.idproducto
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo ra ON r.idregnumerico =  ra.idregnumerico
        LEFT JOIN mod_logactivofijotangible.dat_transdisponibilidad td ON ra.idregnumerico =  td.idregnumerico
        LEFT JOIN mod_logactivofijotangible.nom_estatusoperativo eu ON td.idestatusoperativo =  eu.idestatusoperativo
        LEFT JOIN mod_logactivofijotangible.dat_estatustecnicoestatusoperativo eto ON eu.idestatusoperativo =  eto.idestatusoperativo
        WHERE  p.idestructura IN
        ";
        $sql .= "(" . implode(',', $estructuras) . ")";

        if (is_array($arregloIdsProd) && count($arregloIdsProd) > 0) {
            $sql .= " AND  p.idindicador IN (" . implode(',', $arregloIdsProd) . ")";
        } elseif (is_numeric($arregloIdsProd)) {
            $sql .= " AND  p.idindicador =  $arregloIdsProd";
        }
        if ($disponibles) {
            $sql .= " AND  eto.afectacdt = 0";
        }

        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function GetTodasMarcas()
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT DISTINCT  marca.idmarca,
                                    marca.denominacion
                FROM mod_datosmaestros.nom_indicadorhoja ih
                INNER JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                where marca.estado = 1 ";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    //Autor:Rajiv Rondon Padilla
    public function GetModelos($idmarca)
    {
        if ($idmarca) {
            $where = "WHERE ih.idmarca = $idmarca";
        } else {
            $where = '';
        }
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT DISTINCT modelo.denominacion, modelo.idmodelo
                FROM mod_datosmaestros.nom_modelo modelo
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON modelo.idmodelo = ih.idmodelo
                $where and modelo.estado = 1";

        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function GetEstatus()
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT DISTINCT estado.denominacion,estado.idestatustecnico
              FROM mod_logactivofijotangible.nom_estatustecnico estado
              WHERE estado.estado = 1 ";

        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getEstatusOperativos($idestatus)
    {
        if ($idestatus) {
            $where = "WHERE ih.idestatustecnico = $idestatus";
        } else {
            $where = '';
        }

        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT DISTINCT estado.denominacion,estado.idestatusoperativo
             FROM mod_logactivofijotangible.nom_estatusoperativo estado
             INNER JOIN dat_estatustecnicoestatusoperativo ih ON estado.idestatusoperativo = ih.idestatusoperativo
             $where and estado.estado = 1";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ExportarResumen()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        /*$ent = $this->estructuraHelper->getEstructura(
            $global->Estructura->idestructura
        );*/
        $ent = $this->integrator->metadatos->DameEstructura($global->Estructura->idestructura);

        // Crear objeto excel
        $objPHPExcel = new PHPExcel();

        // Cambiando las propiedades del documento
        $objPHPExcel->getProperties()->setCreator("SISTEMA DISTRA-BETA");
        $objPHPExcel->getProperties()->setLastModifiedBy("SISTEMA DISTRA-BETA");
        $objPHPExcel->getProperties()->setTitle(
            "REPORTE: DISPONIBILIDAD-FLOTA"
        );
        $objPHPExcel->getProperties()->setSubject(
            "REPORTE: DISPONIBILIDAD-FLOTA"
        );
        $objPHPExcel->getProperties()->setDescription(
            "Reporte de disponibilidad de la flota."
        );
        $objPHPExcel->getProperties()->setKeywords(
            "Disponibilidad, Flota, Medio de transporte"
        );
        $objPHPExcel->getProperties()->setCategory("REPORTE");

        // Configurando encabezado
        $objPHPExcel->setActiveSheetIndex(0);
        $conn = Zend_Registry::get('conexion');

        $sql = " SELECT
                i.denominacion,
                marca.denominacion as marca,
                modelo.denominacion as modelo,
                act.denominacion as actividad,
                rnat.nromatricula as nromatricula,
                rnat.indicativo as indicativo,
                e.denominacion as estatus,
                d.descripcion as observaciones,
                d2.ubicacion as ubicacion,
                d2.motivo as motivo,
                d2.pendiente as pendiente,
                d2.causa as causa

            FROM mod_logactivofijotangible.dat_transdisponibilidad d
            INNER JOIN mod_datosmaestros.nom_indicador i ON d.idindicador = i.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
            INNER JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
            INNER JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
            INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON d.idregnumerico = rn.idregnumerico
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rn.idregnumerico = rna.idregnumerico
            INNER JOIN mod_logactivofijotangible.nom_actividad act on rna.idactividad = act.idactividad
            LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp rnat ON rna.idregnumerico = rnat.idregnumerico
            LEFT JOIN mod_logactivofijotangible.dat_datosesptransdisp d2 ON rnat.idregnumerico = d2.idregnumerico
            INNER JOIN mod_logactivofijotangible.nom_estatusoperativo e ON d.idestatusoperativo = e.idestatusoperativo
        ";

        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($datos as $key => $value) {

            $f = $key + 7;

            $objPHPExcel->getActiveSheet()->setCellValue('A' . $f, $key);
            $objPHPExcel->getActiveSheet()->setCellValue(
                'B' . $f, $value['denominacion']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'C' . $f, $value['marca']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'D' . $f, $value['modelo']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'E' . $f, $value['nromatricula']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'F' . $f, $value['indicativo']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'G' . $f, $value['estatus']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'H' . $f, $value['actividad']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'I' . $f, $value['observaciones']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'J' . $f, $value['ubicacion']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'K' . $f, $value['motivo']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'L' . $f, $value['pendiente']
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'M' . $f, $value['causa']
            );
        }

        $boders = new PHPExcel_Style();
        $boders->applyFromArray(
            array('borders' => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN)))
        );

        if (count($datos) > 0) {
            $objPHPExcel->getActiveSheet()->setSharedStyle($boders, "A6:M{$f}");
        }

        $objPHPExcel->getActiveSheet()->setCellValue(
            'D1', 'Modelo de disponibilidad técnica de la flota'
        );
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Entidad/UEB');
        $objPHPExcel->getActiveSheet()->setCellValue(
            'C3', $ent[0]->denominacion
        );

        $objPHPExcel->getActiveSheet()->setCellValue('A6', 'No.');
        $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Tipo de medio');
        $objPHPExcel->getActiveSheet()->setCellValue('C6', 'Marca');
        $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Modelo');
        $objPHPExcel->getActiveSheet()->setCellValue('E6', 'Matrícula');
        $objPHPExcel->getActiveSheet()->setCellValue('F6', 'Indicativo');
        $objPHPExcel->getActiveSheet()->setCellValue('G6', 'Estatus operativo');
        $objPHPExcel->getActiveSheet()->setCellValue('H6', 'Actividad');
        $objPHPExcel->getActiveSheet()->setCellValue('I6', 'Observaciones');
        $objPHPExcel->getActiveSheet()->setCellValue('J6', 'Ubicación');
        $objPHPExcel->getActiveSheet()->setCellValue('K6', 'Motivo');
        $objPHPExcel->getActiveSheet()->setCellValue('L6', 'Pendiente por');
        $objPHPExcel->getActiveSheet()->setCellValue('M6', 'Causa');


        $objPHPExcel->getActiveSheet()->getColumnDimension(A)->setWidth(5);
        $objPHPExcel->getActiveSheet()->getColumnDimension(B)->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension(C)->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension(D)->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension(E)->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension(F)->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension(G)->setWidth(16);
        $objPHPExcel->getActiveSheet()->getColumnDimension(H)->setWidth(16);
        $objPHPExcel->getActiveSheet()->getColumnDimension(I)->setWidth(16);
        $objPHPExcel->getActiveSheet()->getColumnDimension(J)->setWidth(16);
        $objPHPExcel->getActiveSheet()->getColumnDimension(K)->setWidth(16);
        $objPHPExcel->getActiveSheet()->getColumnDimension(L)->setWidth(16);
        $objPHPExcel->getActiveSheet()->getColumnDimension(M)->setWidth(16);


        $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('I3')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('J6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('K6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('L6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('M6')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('J3')->getFont()->setBold(
            true
        );
        $objPHPExcel->getActiveSheet()->getStyle('K3')->getFont()->setBold(
            true
        );

        // Título del libro
        $objPHPExcel->getActiveSheet()->setTitle('DISPONIBILIDAD DE LA FLOTA');

        // Save Excel 95 file
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

        error_reporting(E_ALL);
        ini_set('display_errors', true);
        ini_set('display_startup_errors', true);

        define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

        // Generate the server headers

        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename="ResumenDeDisponibiliadTecnica.xls"');
        header("Content-Transfer-Encoding: binary");
        header('Expires: 0');
        header('Cache-Control: max-age=0');
        header('Cache-Control: max-age=1');
        header('Cache-Control: cache, must-revalidate');
        header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

        if (strpos($_SERVER['HTTP_USER_AGENT'], "MSIE") !== false) {
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public', true);
        } else {
            header('Pragma: no-cache');
        }

        $objWriter->save('php://output');
    }

    public function actualizarDisponibilidad($parametros)
    {
        return DatTransDisponibilidad::actualizarDisponibilidad($parametros);
    }

    public function GetMediosRutasUnaColumna($parametros)
    {

        $query = new Doctrine_Query();
        $query->from('DatTransDisponibilidad d')->innerJoin(
            'd.DatRegnumericoActivo rna'
        )->innerJoin(
            'rna.DatRegnumerico rn'
        );

        $query = ZendExt_IoC::getInstance(
            )->parametros->dameQueryJoinNomIndicadores(
            $query, 'd', 'i', 'ih', true, $parametros, true, true, false, false
        );
        $query = OperacionesService::GetQueryTripulacionesCompletas(
                $query, 'd', true, 't', $parametros, true
        );

        $query->addSelect("d.idregnumerico");
        $query->addSelect(DatRegnumericoActivo::getSelect('rna'));
        $query->addSelect(DatRegnumerico::getSelect('rn'));

        $query = DatRegnumericoActivo::GetWhere($query, 'rna', $parametros);


        $respuesta = $query->fetchArray();

        foreach ($respuesta as $key => &$value) {

            $arrRutas = array();
            foreach ($value['DatTransTripulacion']['DatTransRuta'] as $ruta) {
                $arrRutas[] = $ruta['DatRutahoja'][0]['DatRuta']['denominacion'];
            }

            $respuesta[$key]['rutas'] = implode(', ', $arrRutas);
            unset($value['DatTransTripulacion']);
        }

        return $respuesta;
    }

    public function getWheres($query, $parametros)
    {
        if ($parametros['idnodo']) {  //Entra en los hijos 
            $idnodo = $parametros['idnodo'];
            $query->addWhere("i.idpadre = $idnodo and i.idpadre <> i.idindicador");
        }
        if ($parametros['denominacionestado']) {
            $query->addWhere("eo.denominacionestado = ?", array($parametros['denominacionestado']));
        }
        if ($parametros['causa']) {
            $causa = $parametros['causa'];
            $query->addWhere("trade.causa iLIKE  '%$causa%'");
        }
        if ($parametros['pendiente']) {
            $pendiente = $parametros['pendiente'];
            $query->addWhere("trade.pendiente iLIKE  '%$pendiente%'");
        }
        if ($parametros['status']) {
            $query->addWhere("eo.idestatusoperativo = ?", array($parametros['status']));
        }
        if ($parametros['motivo']) {
            $motivo = $parametros['motivo'];
            $query->addWhere("trade.motivo iLIKE  '%$motivo%'");
        }
        return $query;
    }

    public function getDatosTreeGridDisponibilidad($params, $formatos)
    {
        $conn = Zend_Registry::get('conexion');
        $parametros = ($params['parametros']) ? json_decode(
                $params['parametros']
            ) : $params;

        $parametros->filtros = $params['filtros'];
        $parametros->disponibilidad = $params['disponibilidad'];
        $parametros->estructuras = $params['estructuras'];
        $parametros = (array) $parametros;
        if (count($parametros['filtros'])) {
            $parametros = array_merge($parametros, $parametros['filtros']);
        }
        unset($parametros['filtros']);
        if (!$parametros['nivel'] && !$parametros['idnodo']) {
            $parametros['nivel'] = 1;
        }
        $service = new RegNumActivoService();
        $maestroProducto = new MaestroProductoModel();
        new NomIndicador();
        new DatProductoLogistica();
        new DatRegnumericoActivo();
        new DatTransDisponibilidad();
        $query = $maestroProducto->getQueryIndicador('i');

        $query->addSelect($service->getSelectFilesDatRegNumActivo("drna", false));
        $query->addSelect("drn.idregnumerico");
        $query->leftJoin("DatProductoLogistica p");
        $query->leftJoin("p.DatRegnumerico rn");
        $query->leftJoin("rn.DatRegnumericoActivo drna");
        $query->leftJoin("drna.DatTransDisponibilidad dtd");
        $query->leftJoin('dtd.NomEstatusoperativo eo');
        $query->leftJoin('dtd.DatDatosEspTransDisponibilidad ddetd');
        $query->addSelect('eo.denominacion AS denominacionestado');

        $query = self::getWheres($query, $parametros);
        $query = $service->getFiltrosDatRegNumActivo($query, 'drna', $parametros);

        $sql = "SELECT DISTINCT i.idarbol as idarbol from mod_datosmaestros.nom_indicador i
                  inner join mod_datosmaestros.nom_indicadorhoja ind on ind.idindicador = i.idindicador
                  inner join mod_logistica.dat_producto p on ind.idindicador = p.idindicador
                  where p.idestructura IN ";
        $sql .= "(" . implode(',', $parametros['estructuras'])
            . ")";
        $sql.=" and (i.ordender - i.ordenizq =1) ";
        $conn = Zend_Registry::get('conexion');



        $idsarbol = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        $query->andWhereIn('i.idarbol', $idsarbol);

        $query->addWhere("drna.idregnumerico not in (
                SELECT dat_mov_reg.idregnumerico
                    FROM DatMovRegnumerico dat_mov_reg
                    INNER JOIN dat_mov_reg.DatMovimientos dat_mov on dat_mov.idmovimiento = dat_mov_reg.idmovimiento
                    INNER JOIN dat_mov.DatDocumento doc ON doc.iddocumento = dat_mov.iddocumento
                    WHERE doc.cronologia = 0 and drna.idregnumerico = dat_mov_reg.idregnumerico
            )");



//print_r($query->getSqlQuery());die;
        $datos = $query->fetchArray();
        //print_r($datos);die;
        foreach ($datos as $key => &$value) {
            if (is_null($parametros['parametros']->ultimonivel)) {
                $partes = $formatos[$datos[$key]['idformato']]->partes;
                $datos[$key]['leaf'] = (count($partes) == ($datos[$key]['nivel'] + 0)) ? true : false;
                $datos[$key]['_is_leaf'] = $datos[$key]['leaf'];
                $datos[$key]['_level'] = $datos[$key]['nivel'];
                $datos[$key]['_is_loaded'] = true;
            }
        }

        return $datos;
    }

///este es el metodo viejo hecho en sql, quedo comentariado por si acaso =>By=>Gerardo
     public function getDatosTreeGridDisponibilidadSql($params, $formatos) {
         $conn = Zend_Registry::get('conexion');
         $parametros = ($params['parametros']) ? json_decode(
             $params['parametros']
         ) : $params;
         $parametros->filtros = $params['filtros'];
         $parametros->disponibilidad = $params['disponibilidad'];
         $parametros->estructuras = $params['estructuras'];
         $parametros = (array)$parametros;
         $nivel = $parametros['nivel'];
         if (!$nivel && !$parametros['idnodo']) {
             //     print_r('entro');die();
             $nivel = 1;
         }
         $filtros = "";
         if ($parametros['filtros']) {
             foreach ($parametros['filtros'] as $filtro) {
                 $campo = $filtro['field'];
                 $valor = $filtro['data']['value'];
                 if ($campo == 'marca' || $campo == 'modelo') {
                     $filtros .= " AND ma.denominacion ilike '%{$valor}%'";
                 } else {
                     if ($campo == 'nromatricula') {
                         $filtros .= " AND rat.{$campo} ilike '%{$valor}%'";
                     } else {
                         if ($campo == 'nroserie') {
                             $filtros .= " AND r.{$campo} ilike '%{$valor}%'";
                         } else {
                             if ($campo == 'denominacionestado') {
                                 $filtros .= " AND eo.{$campo} ilike '%{$valor}%'";
                             }
                         }
                     }
                 }
             }
         } else {
             if ($params['nroserie']) {
                 $filtros .= " AND r.nroserie ilike '%{$params['nroserie']}%'";
             }
             if ($params['nromatricula']) {
                 $filtros .= " AND rat.nromatricula ilike '%{$params['nromatricula']}%'";
             }
             if ($params['indicativo']) {
                 $filtros .= " AND rat.indicativo ilike '%{$params['indicativo']}%'";
             }
             if ($params['denominacion']) {
                 $filtros .= " AND i.denominacion ilike '%{$params['denominacion']}%'";
             }
             if ($params['motivo']) {
                 $filtros .= " AND trade.motivo ilike '%{$params['motivo']}%'";
             }
             if ($params['causa']) {
                 $filtros .= " AND trade.causa ilike '%{$params['causa']}%'";
             }
             if ($params['pendiente']) {
                 $filtros .= " AND trade.pendiente ilike '%{$params['pendiente']}%'";
             }
             if ($params['marca']) {
                 $filtros .= " AND marca.idmarca = {$params['marca']}";
             }
             if ($params['modelo']) {
                 $filtros .= " AND modelo.idmodelo = {$params['modelo']}";
             }
             if ($params['status']) {
                 $filtros .= " AND eo.idestatusoperativo = {$params['status']}";
             }
         }
         $where = "";
         if ($parametros['idnodo']) {  //Entra en los hijos
             $where .= " AND  i.idpadre = {$parametros['idnodo']} and i.idpadre <> i.idindicador";
             if ($parametros['idarbol']) {
                 $where .= " AND  i.idarbol = {$parametros['idarbol']}";
             }
             if ($parametros['ultimonivel'] == $parametros['nivel']) {
                 $where .= " AND ra.idestadoperacion IN (1,3) AND p.idestructura IN  (" . implode(',', $parametros['estructuras']) .")";
             }
         }
         $query = "SELECT  DISTINCT  i.idindicador, i.codigo,
      i.idindicador AS idindicador,
      i.idindicador AS idprod,
      (i.codigo || ' - ' || i.denominacion) AS text,
      i.idpadre AS idpadre, i.idarbol AS idarbol,
      i.ordenizq AS ordenizq, i.ordender AS ordender, i.idpais AS idpais,
      i.idumedida AS idumedida, i.idformato AS idformato,
      i.codigo AS codigo, i.denominacion AS denominacion,
      i.descripcion AS descripcion, i.nivel AS nivel,
      ih.idmarca AS idmarca, ih.idmodelo AS idmodelo,
      r.*,
      rat.*,
      ra.*,
      eo.denominacion as denominacionestado,
      eo.idestatusoperativo AS idestatusoperativo,
      act.idactividad AS idactividad,
      cfgim.identificador AS identificador,
      act.denominacion AS actividad,

      ((Case When ih.idmarca is not null Then (marca.denominacion || (Case When ih.idmodelo is not null Then ' - ' Else '' End)) Else '' End) ||
      (Case When ih.idmodelo is not null Then modelo.denominacion Else '' End)) as descripcionmarcamodelo,
      (Case When i.idindicador <> i.idpadre Then i.idpadre Else null End) AS _parent

      FROM mod_datosmaestros.nom_indicador i
      LEFT JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
      LEFT JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
      LEFT JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
      left join mod_logistica.dat_producto p on i.idindicador = p.idindicador
      left join mod_logactivofijotangible.dat_registronumerico r on p.idproducto = r.idproducto
      left join mod_logactivofijotangible.dat_regnumericoactivo ra on ra.idregnumerico = r.idregnumerico
      left join mod_logactivofijotangible.dat_regnumericoactivotransp rat on ra.idregnumerico = rat.idregnumerico
      left join mod_logactivofijotangible.dat_transdisponibilidad trad on ra.idregnumerico = trad.idregnumerico
      left join mod_logactivofijotangible.dat_datosesptransdisp trade on trad.idregnumerico = trade.idregnumerico
      left join mod_logactivofijotangible.nom_estatusoperativo eo on trad.idestatusoperativo = eo.idestatusoperativo
      left join mod_logactivofijotangible.nom_actividad act on ra.idactividad = act.idactividad
      left join mod_logactivofijotangible.conf_identificadormedio cfgim on cfgim.idindicador = i.idindicador
      WHERE i.idarbol IN (SELECT i.idarbol as idarbol from mod_datosmaestros.nom_indicador i
      inner join mod_datosmaestros.nom_indicadorhoja ind on ind.idindicador = i.idindicador
      inner join mod_logistica.dat_producto p on ind.idindicador = p.idindicador
      where p.idestructura IN  ";
         if ($nivel) {
             $addNivel = "AND i.nivel = {$nivel}";
         } else {
             $addNivel = "";
         }

         $query .= "(" . implode(',', $parametros['estructuras']) . ") and (i.ordender - i.ordenizq =1) ) {$addNivel}";

      /*"AND ra.idregnumerico not in (
      SELECT dat_mov_reg.idregnumerico
      FROM mod_logactivofijotangible.dat_movregnumerico dat_mov_reg
      INNER JOIN mod_logistica.dat_movimiento dat_mov on dat_mov.idmovimiento = dat_mov_reg.idmovimiento
      INNER JOIN mod_logistica.dat_documento dat_doc on dat_doc.iddocumento = dat_mov.iddocumento
      WHERE dat_doc.cronologia = 0 and ra.idregnumerico = dat_mov_reg.idregnumerico ORDER BY i.codigo
      ) ";*/
         $query .= $where . $filtros;
         $datos = $conn->execute($query)
             ->fetchAll(PDO::FETCH_ASSOC);
         foreach ($datos as $key => &$value) {
                 $partes = $formatos[$datos[$key]['idformato']]->partes;
                 $datos[$key]['leaf'] = (count($partes) == ($datos[$key]['nivel'] + 0)) ? true : false;
                 $datos[$key]['_is_leaf'] = $datos[$key]['leaf'];
                 $datos[$key]['_level'] = $datos[$key]['nivel'];
                 $datos[$key]['_is_loaded'] = true;
                 $datos[$key]['ultimonivel'] = count($partes);
         }
         return $datos;
      }
}
