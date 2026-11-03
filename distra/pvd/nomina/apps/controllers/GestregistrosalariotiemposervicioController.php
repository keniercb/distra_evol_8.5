<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/*Componente para gestionar el registro de Salarios y tiempo de servicio (SNC - 225)
 *@author 1er Tte. Frank Rodriguez Berroa
 *@email fberroa@xetid.cu
 */

class GestregistrosalariotiemposervicioController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista.
     */
    public function gestregistrosalariotiemposervicioAction()
    {
        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar el snc 225.
     */
    public function obtenerListadoRegistroSalarioAction()
    {
        $idpersona = $this->_request->getPost('idpersona');
        $idestructura = $this->_request->getPost('idestructura');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $objDomain = new GestRegistroSalarioTiempoServicioModel();
        $objDatSTS = new DatRegistroSalarioTiempoServicio();
        $arrayreturn = $objDomain->obtenerListadoRegistroSalarioTiempoServicioPersona($idpersona, $idestructura, $start, $limit);
        $cantRegSala = $objDatSTS->cantRegistroSalarioTiempoServicioPersona($idpersona, $idestructura);
        echo Zend_Json::encode(array('datos' => $arrayreturn, 'cantidad' => $cantRegSala));
    }

    public function obtenerMesesAction()
    {
        echo json_encode(array('datos' => NomMes::obteneTodosNomMes(), 'cantidad' => count(NomMes::obteneTodosNomMes())));
    }

    /**
     * Accion para adicionar.
     */
    public function adicionarRegistroSalarioAction()
    {
        $idpersona = $this->_request->getPost('idpersona');
        $anno = $this->_request->getPost('anno');
        $mes = $this->_request->getPost('mes');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $diasacum = $this->_request->getPost('diasacum');
        $salariodev = $this->_request->getPost('salariodev');
        $idestructura = $this->_request->getPost('idestructura');
        $objDomain = new GestRegistroSalarioTiempoServicioModel();
        $add = $objDomain->adicionarRegistroSalario($idpersona, $anno, $mes, $diasacum, $salariodev, $idestructura, $idtiponomina);
        echo json_encode($add);
    }

    /**
     * Accion para modificar un RegistroSalario.
     */
    public function modificarRegistroSalarioAction()
    {
        $idregistrosalario = $this->_request->getPost('idregistrosalario');
        $anno = $this->_request->getPost('anno');
        $mes = $this->_request->getPost('mes');
        $idtiponomina = $this->_request->getPost('idtiponomina');
        $diasacum = $this->_request->getPost('diasacum');
        $salariodev = $this->_request->getPost('salariodev');
        $objDomain = new GestRegistroSalarioTiempoServicioModel();
        $mod = $objDomain->modificarRegistroSalario($idregistrosalario, $anno, $mes, $diasacum, $salariodev, $idtiponomina);
        echo json_encode($mod);
    }

    /**
     * Accion para eliminar.
     */
    public function eliminarRegistroSalarioAction()
    {
        $idregistrosalariotiemposervicio = $this->_request->getPost('idregistrosalariotiemposervicio');
        $objDomain = new GestRegistroSalarioTiempoServicioModel();
        $delete = $objDomain->eliminarRegistroSalario($idregistrosalariotiemposervicio);
        echo json_encode($delete);
    }

    /**
     * Accion usada para obtener el reporte del snc 225.
     */
    public function exportarSNC225Action()
    {
        $idpersona = $this->_getParam('idpersona');
        $idestructura = $this->_getParam('idestructura');
        $tiporeporte = $this->_getParam('tiporeporte');
        $annos = $this->_getParam('annos');
        $ordenannos = $this->_getParam('ordenannos');
        $model = new GestRegistroSalarioTiempoServicioModel();
        $respuesta = $model->exportarSNC225($idpersona, $idestructura, $tiporeporte, $annos, $ordenannos);
        echo json_encode($respuesta);
    }

    public function restaurarSNC225Action()
    {
        $idestructura = $this->_getParam('idestructura');
    	if (empty($idestructura)) {
        	echo json_encode(['error' => 'idestructura es requerido']);
        	return;
    	}
        $tipo = $this->_getParam('tipo');
        $tiporeportebusqueda = $this->_getParam('tiporeportebusqueda');
        $idexpresionmatematica = $this->_getParam('idexpresionmatematica');
        $arrids = Zend_Json::decode(stripslashes($this->_getParam('arridelaborarpagos')));
        $objNomTipoNomina = new NomTipoNomina();
        $objDatNominaDatos = new DatNominaDatos();
        $objConfigModeloNomina = new ConfigModeloNomina();
        $objDatElaborarPagos = new DatElaborarPagos();
        $objDatDatosCertificadosElaborarpago = new DatDatosCertificadosElaborarpago();
        $objConfigRegistroSalarioTiempoServicio = new ConfigRegistroSalarioTiempoServicio();
        $objGestRegistroSalarioTiempoServicioModel = new GestRegistroSalarioTiempoServicioModel();
        $objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $arridselaborarpagos = array();
        //General
        if ($tipo == 1) {
			try {
		            $r = DatElaborarPagos::obtenePeriodoPagoEntidad($idestructura);
		            foreach ($r as $idep) {
		                $arridselaborarpagos[$idep['idelaborarpagos']]['idelaborarpagos'] = $idep['idelaborarpagos'];
		                $arridselaborarpagos[$idep['idelaborarpagos']]['idtiponomina'] = $objConfigModeloNomina->obtenerIdTiposNominaporTipoPago($idep['idelaborarpagos'])[0]['idtiponomina'];
		                $arraypago = $objDatElaborarPagos->obtenerPeriodosPagoEntidad($idep['idelaborarpagos']);
		                list(, $messnc, $annosnc) = explode('/', $arraypago[0]['fechapago']);
		                $arridselaborarpagos[$idep['idelaborarpagos']]['mes'] = ($messnc != 1) ? $messnc - 1 : 12;
		                $arridselaborarpagos[$idep['idelaborarpagos']]['anno'] = ($messnc != 1) ? $annosnc : $annosnc - 1;
		            }
		
		            //Borrando los datos del submayor para la entidad a restaurar
		            $sqlsnc = "DELETE FROM mod_nomina.dat_registrosalariotiemposervcio 
		                       where idestructura = ? and idtiponomina is not null and (registrotiponominamanual = 0 or registrotiponominamanual is null)";
		            $conn->execute($sqlsnc, array($idestructura));
				} catch (Exception $e) {
        			echo json_encode(['error' => $e->getMessage()]);
        			return;
    			}
        //Especificos
        } else {
            foreach ($arrids as $idep) {
                $arridselaborarpagos[$idep]['idelaborarpagos'] = $idep;
                $arridselaborarpagos[$idep]['idtiponomina'] = $objConfigModeloNomina->obtenerIdTiposNominaporTipoPago($idep)[0]['idtiponomina'];
                $arraypago = $objDatElaborarPagos->obtenerPeriodosPagoEntidad($idep);
                list(, $messnc, $annosnc) = explode('/', $arraypago[0]['fechapago']);
                $arridselaborarpagos[$idep]['mes'] = ($messnc != 1) ? $messnc - 1 : 12;
                $arridselaborarpagos[$idep]['anno'] = ($messnc != 1) ? $annosnc : $annosnc - 1;
                list(, $mesinicio, ) = explode('/', $arraypago[0]['fechainicioperiodo']);
                $arridselaborarpagos[$idep]['mesinicio'] =  ($mesinicio != 1) ? $mesinicio - 1 : 12;
            }
		    try {
		        $conn->beginTransaction();
		        
		        // Construir condiciones para DELETE masivo (con mes+1)
		        $deleteConditions = [];
		        foreach ($arridselaborarpagos as $periodopago) {
		            // Calcular mes para DELETE (modificado)
		            $mesDelete = $periodopago['mes'];
		            if ($periodopago['mes'] == $periodopago['mesinicio']) {
		                $mesDelete = ($periodopago['mes'] == 12) ? 1 : $periodopago['mes'] + 1;
		            }
		            
		            // Crear clave única por combinación
		            $key = $periodopago['anno'] . '_' . $mesDelete . '_' . $periodopago['idtiponomina'];
		            $deleteConditions[$key] = [
		                'anno' => $periodopago['anno'],
		                'mes' => $mesDelete,
		                'idtiponomina' => $periodopago['idtiponomina']
		            ];
		        }
		        
		        // DELETE masivo
		        if (!empty($deleteConditions)) {
		            $conditions = [];
		            $params = [$idestructura];
		            
		            foreach ($deleteConditions as $cond) {
		                $conditions[] = "(anno = ? AND idmes = ? AND idtiponomina = ?)";
		                $params[] = $cond['anno'];
		                $params[] = $cond['mes'];
		                $params[] = $cond['idtiponomina'];
		            }
		            
		            $sqlsnc = "DELETE FROM mod_nomina.dat_registrosalariotiemposervcio 
		                       WHERE idestructura = ? 
		                       AND (" . implode(" OR ", $conditions) . ")
		                       AND (registrotiponominamanual = 0 OR registrotiponominamanual IS NULL)";
		            
		            $conn->execute($sqlsnc, $params);
		        }
		        
		        $conn->commit();
		    } catch (Exception $e) {
		        $conn->rollback();
		        echo json_encode(['error' => $e->getMessage()]);
		        return;
		    }
		}
        //Si hay periodos de pago
        if (count($arridselaborarpagos)) {
            foreach ($arridselaborarpagos as $id => $ridelaborarpago) {
                $arrayidnominas = array();
                //Si acumula en el snc se valida, sino, se aprueba
                $acumulasnc = $objNomTipoNomina->obtenerAcumulaLiquidaSNC225($ridelaborarpago['idtiponomina']);
                //Si la nomina acumula en el snc
                if ($acumulasnc == 1) {
                    $arraynominas = $objDatNominaDatos->obtenerIdNominaPorElaborarPago($id);
                    //Si tiene nominas aprobadas con personas
                    if (count($arraynominas)) {
                        foreach ($arraynominas as $rn) {
                            //Array lineal de idnominas
                            $arrayidnominas[] = $rn['idnomina'];
                        }
                    }
                    $result = '';
                    $camposregsalarionomina = $objConfigRegistroSalarioTiempoServicio->obtenerListadoCamposRegistroSalario($ridelaborarpago['idtiponomina']);
                    if (count($camposregsalarionomina) > 0) {
                        $prep = new stdClass();
                        //Si se va a restaurar a partir de los reportes serializados en dat_datoscertificadoselaborarpagos
                        if($tiporeportebusqueda == 1){
                            $personasreporte = $objDatDatosCertificadosElaborarpago->obtenerDatosCertificadosSerializados($id);
                            $prep = unserialize($personasreporte);
                            //Si se va a restaurar a partir de los reportes de dat_reportescertificaciones
                        }else{
                            $finicio = $objDatElaborarPagos->obtenerFechaInicioPeriodoPago($id);
                            $ffin = $objDatElaborarPagos->obtenerFechaFinPeriodoPago($id);
                            $prep->reportes = $objDatVariablesElementosReportesCertificaciones->cargarValorPersonasReportes($idestructura, $finicio, $ffin);
                        }

                        //Acumulando en el snc
                        $objGestRegistroSalarioTiempoServicioModel->acumularSNC225($idestructura, $arrayidnominas, $camposregsalarionomina, $id, $prep->reportes, $ridelaborarpago['idtiponomina'], $idexpresionmatematica);
                    }
                }
            }
        }
        echo json_encode('ok');
    }

    public function importarCargaInicialSNCAction()
    {
        $identidad = $this->_getParam('identidad');
        $arraypersonasnomacheadas = array();
        $contador = 0;
        //Para archivos xls. OJO no pincha para .xlsx
        $inputFileType = 'Excel5';
        $dir_file = $_FILES['fileUpload']['tmp_name'];
        //Creando un Reader de PhpExcel para 2005
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objReader->setReadDataOnly(true);
        //Si la direccion del archivo existe
        $nombresnoinfo = '';
        if (file_exists($dir_file)) {
            //Cargando el archivo
            $objPHPExcel = $objReader->load($dir_file);
            //Obteniendo los datos en un array
            $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
            if (count($worksheettoarray) > 1) {
                //Borrando los registros de salario y tiempo de servicio de la entidad
                DatRegistroSalarioTiempoServicio::eliminarDatRegistroSalarioEntidadManuales($identidad);

                //Recorro el array para insertar en dat_registrosalariotiemposervcio
                foreach ($worksheettoarray as $i => $arrworksheet) {
                    if ($i > 1) {
                        $ci = $arrworksheet['A'];
                        $arrdatpersona = array();
                        //Si el SNC se va a comportar como en el Sigerh
                        $sql = "select sncsigerh from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $sncsigerh = $conn->fetchOne($sql);
                        if($sncsigerh == 1){
                            //Dame los datos de las personas que estan de alta en Centros de Costo en esta Entidad pasandole su # de carnet
                            $sqlDatosPersona = "select dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel
                           from mod_persona.dat_persona dp
						   inner join mod_persona.dat_docidentidad dpdoc on(dpdoc.idpersona = dp.idpersona)
						   where dpdoc.numero ilike '$ci' and dp.feliminado is null and dpdoc.principal = 1;";
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
                        //Distra
                        }else{
                            //Dame los datos de las personas que estan de alta en Centros de Costo en esta Entidad pasandole su # de carnet
                            $sqlDatosPersona = "select dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
						   inner join mod_persona.dat_docidentidad dpdoc on(dpdoc.idpersona = dp.idpersona)
						   inner join mod_nomina.dat_cargosocupados dco on(dco.idpersona = dp.idpersona and dco.identidad = $identidad)
						   where dpdoc.numero ilike '$ci' and dp.feliminado is null and dpdoc.principal = 1;";
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
                        }


                        if (!empty($arrdatpersona[0]['idpersona'])) {
                            $diasacumuladosexcel = str_ireplace(',', '.', $arrworksheet['E']);
                            $importeacumuladosexcel = str_ireplace(',', '.', $arrworksheet['F']);
                            //Obj Registro de Salario
                            $obj = new DatRegistroSalarioTiempoServicio();
                            $idMes = 0;
                            if (is_numeric($arrworksheet['D']) && $arrworksheet['D'] >= 1 && $arrworksheet['D'] <= 12) {
                                $idMes = $arrworksheet['D'];
                            } else if (is_string($arrworksheet['D'])) {
                                $nomMes = NomMes::obtenerNoMesXDenominacion(trim($arrworksheet['D']));
                                if ($nomMes->idmes) {
                                    $idMes = $nomMes->idmes;
                                }
                            }

                            if (is_string($arrworksheet['G'])) {
                                $nomTipoNomina = NomTipoNomina::findByDenom(trim($arrworksheet['G']));
                                if ($nomTipoNomina->idtiponomina) {
                                    $obj->idtiponomina = $nomTipoNomina->idtiponomina;

                                    $leyenda = ConfigRegistroSalarioTiempoServicio::obtenerListadoCamposRegistroSalario($nomTipoNomina->idtiponomina);
                                    if (count($leyenda) > 0) {
                                        $obj->idconfregistsalartiempservc = $leyenda[0]['idregistsalartiempservc'];
                                    }
                                }
                            }
                            $obj->idpersona = $arrdatpersona[0]['idpersona'];
                            $obj->idestructura = $identidad;
                            $obj->anno = ($arrworksheet['C']) ? $arrworksheet['C'] : 0;
                            $obj->idmes = $idMes;
                            $obj->diasacumulados = ($diasacumuladosexcel) ? $diasacumuladosexcel : 0.00;
                            $obj->salariodevengado = ($importeacumuladosexcel) ? $importeacumuladosexcel : 0.00;
                            $obj->registrotiponominamanual = 1;
                            $obj->save();
                        } else {
                            //Lleno el array con los nombres de los que no machearon
                            if (!empty($arrworksheet['B'])) {
                                $arraypersonasnomacheadas[$contador] = $arrworksheet['B'];
                                $contador++;
                            }
                        }
                    }
                }
            }
        }
        $texto = '';
        //Concatenando los nombres de los que no machearon
        foreach ($arraypersonasnomacheadas as $cc => $nomach)
            $texto .= $nomach . ', ';

        $objreturn = new stdClass();
        if (count($arraypersonasnomacheadas) > 0) {
            $objreturn->mach = -1;
            $objreturn->texto = trim($texto, ', ');
        } else
            $objreturn->mach = 1;
        $r['success'] = true;
        $r['personas'] = $objreturn;
        echo json_encode($r);
    }

    public function obtenerIndicadoresExpresionMatematicaAction(){
        $idelaborarpagosrestformespecifica = $this->_request->getPost('idelaborarpagosrestformespecifica');
        //Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $objDatNominaDatos = new DatNominaDatos();
        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVariablesG = new NomVariableGlobalModel();
        //Obteniendo el arreglo de estructura de nomina.
        $estnomina = $objDatNominaDatos->obtenerEstructuraNominaPorElaborarPago($idelaborarpagosrestformespecifica);
        $arrEMN = unserialize($estnomina[0]['estructura']);
        //Obteniendo el arreglo de variables globales.
        $arrVG = $modeloNegocioVariablesG->obtenerTodasVariablesGlobales();
        $arrR = array();
        foreach($arrEMN as $k => $v){
            if($v['tipocampo'] != 1){
                $arrR[] = array('idindicador'=>'EMN_'.$v['id'], 'indicador'=>$v['denominacion'], 'tipo'=>'Campos de la nómina');
            }
        }
        foreach($arrVG as $k => $v){
            $arrR[] = array('idindicador'=>'VG_'.$v['idvariableglobal'], 'indicador'=>$v['denominacion'], 'tipo'=>'Variables globales');
        }
        $this->datosModelo->indicadores = $arrR;

        echo json_encode($this->datosModelo);
    }

    public function obtenerTiposNominaAction(){
        $objTiposNominas = new NomTipoNomina();
        $arrtiposnominas = $objTiposNominas->obtenerIdTipoNominaDenominacion();
        echo json_encode(array('datos'=>$arrtiposnominas, 'cantidad'=>count($arrtiposnominas)));
    }
    //trabajo con los tipos de nómina
    public function exportarRegistroSalarioRangoFechaAction()
    {
        $idpersona = $this->_getParam('idpersona');
        $idestructura = $this->_getParam('idestructura');
        $idtiponomina = $this->_getParam('idtiponomina');
        $fechadesde = $this->_getParam('fechadesde');
        $fechahasta = $this->_getParam('fechahasta');
        $mesdesde = explode('/', $fechadesde)[1];
        $annodesde = explode('/', $fechadesde)[2];
        $meshasta = explode('/', $fechahasta)[1];
        $annohasta = explode('/', $fechahasta)[2];
        $resultado = DatRegistroSalarioTiempoServicio::obtenerListadoDatRegistroSalarioRangoFechas($idestructura,$fechadesde, $fechahasta, $idtiponomina, $idpersona);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlpersona = "select distinct dp.idpersona, dpdi.numero, concat(dp.nombre,' ', dp.snombre,' ', dp.papel,' ', dp.sapel) as nombre_completo
                       from mod_persona.dat_persona dp
                       inner join mod_persona.dat_docidentidad dpdi on (dpdi.idpersona = dp.idpersona and dpdi.principal = 1)  
                       where dp.idpersona = $idpersona";
            $arraydatospersona = $conn->fetchAll($sqlpersona);

        //Pintando el Excel 
        $objReporteExcel = new ReporteExportarExcelModel();
        $objPHPExcel = new PHPExcel();
        $row = 1;
        $objPHPExcel->getActiveSheet()->getStyle('A') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('B') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('C') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('D') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('E') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('F') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        $objPHPExcel->getActiveSheet()->getStyle('G') ->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
        
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(50);

        //Encabezado
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'A', $row, 'CI', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'B', $row, 'Nombre y Apellidos', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'C', $row, 'Año', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'D', $row, 'Mes', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, 'Días Acomulados', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, 'Salario Devengado', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, 'Nómina', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        
        foreach ($arraydatospersona as $dp){
            $nombre_fichero = $dp['nombre_completo']; 
            foreach ($resultado as $i=> $ps){
                if($ps['idpersona'] == $dp['idpersona']){
                    $denommes = NomMes::obtenerNomMes($ps['idmes'])->denominacion;
                    $row++;
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'A', $row, $dp['numero'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'B', $row, $dp['nombre_completo'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'C', $row, $ps['anno'] , 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);  
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'D', $row, $denommes, 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1); 
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, $ps['diasacumulados'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);    
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, $ps['salariodevengado'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                    $objReporteExcel->fnPintarCelda($objPHPExcel, 'G', $row, $ps['denomnomina'], 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
                }
            }
            $row=$row+2;
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'E', $row, 'Salario Total: ', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $objReporteExcel->fnPintarCelda($objPHPExcel, 'F', $row, '=SUM(F2:F'.($row-1).')', 'l,t,r,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
        }
        
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Registro_Salario_'.$nombre_fichero.'('.$fechadesde.'_'.$fechahasta.')'.'.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;

    }

}
