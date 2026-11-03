<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
/**
 * Controlador para las configuraciones asociadas a los cargos.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses ConfigelementosalarialcargoController
 * @copyright UCID
 * @version 1.0
 */
class ConfigelementosalarialcargoController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de nómina.
     */
    public function configelementosalarialcargoAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //  $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        // $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los tipos de nómina.
     */
    public function obtenerListadoConfigElementoSalarialAction()
    {
        $flag = $this->_request->getPost('flag');
        $cargararbol = $this->_request->getPost('cargararbol');
        if ($flag == 1) {
            $id = 0;
        } else {
            $id = $this->_request->getPost('_id');
        }
        $arrEntidad = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);

        if ($id == 0) {
            $r->data[0]->descripcion = '<img src="' . $arrEntidad[0]->icon . '" height=16 width=16 />' . '' . $arrEntidad[0]->denominacion;

            $r->data[0]->_id = $arrEntidad[0]->idestructura;
            $r->data[0]->_parent = null;
            $r->data[0]->_is_leaf = 0;
            $r->data[0]->idtipo = 1000;
            $r->data[0]->icon = '';
            $r->data[0]->idelementosalarialcargo = '';
            $r->data[0]->idsistemapago = '';
            $r->data[0]->sistemapago = '';
            $r->data[0]->idperiodopago = '';
            $r->data[0]->periodopago = '';
            $r->data[0]->idgrupoescala = '';
            $r->data[0]->grupoescala = '';
            $r->data[0]->idsectorsalarial = '';
            $r->data[0]->sectorsalarial = '';
            $r->data[0]->idescalasueldocargo = '';
            $r->data[0]->escalasueldocargo = '';
            $r->data[0]->importe = '';
            $r->data[0]->fechainicio = '';
            $r->data[0]->fechafin = '';
            $r->data[0]->idcargo = '';
        } else {
            $r->data = $this->dameHijosEstructura($id);
        }

        $r->success = true;
        echo json_encode($r);
    }

    public function dameHijosEstructura($idestructura)
    {

        $arbolestructurae = $this->integrator->metadatos->DameHijosEstructura($idestructura);
        // print_r($arbolestructurae);die;
        if (count($arbolestructurae) > 0) {
            $i = 0;
            $arr = array();
            foreach ($arbolestructurae as $valores => $valor) {
                $arr[$i]->_id = $valor->id;
                $arr[$i]->descripcion = '<img src="' . $valor->icon . '" height=16 width=16 />' . ' ' . $valor->text;
                $arr[$i]->_parent = $valor->_parent;
                if ($valor->idconcepto == 7) {
                    $arr[$i]->_is_leaf = true;
                } else {
                    $arr[$i]->_is_leaf = $valor->leaf;
                }
                $arr[$i]->idtipo = $valor->idconcepto;
                /* $cad = $valor->icon;
                 $arrCad = explode('/', $cad);
                 $arraux = explode('.', $arrCad[5]);
                 $nombreicono = $arraux[0];
                 $arr[$i]->icon = "/metadatos/comun/recursos/iconos/" . $nombreicono[0] . ".gif";*/

                $objModel = new ConfigElementoSalarialCargo();
                $arrelemsal = $objModel->obtenerElemSalCargo($valor->id);
                
                /*
                 * Obteniendo el idelementosalarialcargo y asignandoselo al grid
                 */
                $arr[$i]->idelementosalarialcargo = $arrelemsal[0]['idelementosalarialcargo'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]->idsistemapago = $arrelemsal[0]['idsistemapago'];
                $objDomainSistemaPago = new NomSistemaPago();
                $arrSistemaPago = $objDomainSistemaPago->obtenerObjSistemaPagoDadoId($arrelemsal[0]['idsistemapago']);
                $arr[$i]->sistemapago = $arrSistemaPago['denominacion'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]->idperiodopago = $arrelemsal[0]['idperiodopago'];
                $objDomainPeriodoPago = new NomPeriodoPago();
                $arrSistemaPago = $objDomainPeriodoPago->obtenerObjPeriodoPagoDadoId($arrelemsal[0]['idperiodopago']);
                $arr[$i]->periodopago = $arrSistemaPago['denominacion'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]->idgrupoescala = $arrelemsal[0]['idgrupoescala'];

                if ($arrelemsal[0]['idelementosalarialcargo'] != null) {
                    $datoscargo = $this->integrator->metadatos->obtenerDatosCargo($valor->id);

                    if ($arrelemsal[0]['idescalasueldocargo'] == 1) {
                        $arr[$i]->grupoescala = $datoscargo[0]['grupocomplejidad'];
                    } else if ($arrelemsal[0]['idescalasueldocargo'] == 2) {
                        $objDomainPeriodoPago = new NomGrupoEscala();
                        $arrSistemaPago = $objDomainPeriodoPago->obtenerObjGrupoEscala($arrelemsal[0]['idgrupoescala']);

                        $datoscargo = ($arrelemsal[0]['tiposalarioescala'] == 0) ?
                            $this->integrator->metadatos->obtenerDatosCargo($arrelemsal[0]['idcargo']) : null;
                        $arr[$i]->grupoescala = (!empty($datoscargo)) ? $datoscargo[0]['grupocomplejidad']
                            : $arrSistemaPago[0]['denominacion'];
                    }

                } else {
                    $arr[$i]->grupoescala = $datoscargo[0][" "];
                }
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]->idsectorsalarial = $arrelemsal[0]['idsectorsalarial'];
                $objDomainSectorSalarial = new NomSectorSalarial();

                $arrGrupoEscala = $objDomainSectorSalarial->obtenerObjSectorDadoId($arrelemsal[0]['idsectorsalarial']);

                $arr[$i]->sectorsalarial = $arrGrupoEscala['denominacion'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]->idescalasueldocargo = $arrelemsal[0]['idescalasueldocargo'];
                $objDomainEscalaSueldoCargo = new NomEscalaSueldoCargo();
                $arrEscalaSueldoCargo = $objDomainEscalaSueldoCargo->obtenerObjEscalaSueldoCargoDadoId($arrelemsal[0]['idescalasueldocargo']);
                $arr[$i]->escalasueldocargo = $arrEscalaSueldoCargo['denominacion'];

                $arr[$i]->importe = $arrelemsal[0]['importe'];
                // $arr[$i]->importe = $arrelemsal[0]['tiposalarioescala'];
                $arr[$i]->fechainicio = $arrelemsal[0]['fechainicio'];
                $arr[$i]->fechafin = $arrelemsal[0]['fechafin'];
                $arr[$i]->idcargo = $arrelemsal[0]['idcargo'];
                $i++;
            }
            return $arr;
        } else
            return array();
    }

    /**
     * Accion utilizada para listar los datos de los conceptos.
     */
    public function obtenerListadoConceptosPDAction()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el listado de conceptos.
        $arrConcepto = $modeloNegocioConcepto->obtenerListadoConceptosPD(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );

        //Obteniendo la cantidad total de conceptos.
        $cantTotalConcepto = $modeloNegocioConcepto->obtenerCantidadTotalConceptosPD();

        //Imprimiendo el listado de conceptos.
        echo Zend_Json::encode(array('datos' => $arrConcepto, 'cantidad' => $cantTotalConcepto));
    }

    public function cargarEstructuraCargoAction()
    {
        echo "{'codMsg':'1'}";
    }

    public function cargarSistemaPagoAction()
    {
        $objdomaiFormaP = new NomFormaPago();
        $formasP = $objdomaiFormaP->obtenerListadoFormasPago(0, 500);
        foreach ($formasP as $k => $v) {
            $objdomaiSistemaP = new NomSistemaPago();
            $arrHijos = $objdomaiSistemaP->obtenerListadoSistemasPago(0, 500, $v['idformapago']);

            $arr[$k]['id'] = "sector" . "" . $v['idformapago'] . "";
            $arr[$k]['text'] = $v['denominacion'];
            $arr[$k]['leaf'] = false;
            $arr[$k]['children'] = $this->cargarHijos($v['idformapago']);
        }
        //print_r($arr);die;
        echo(json_encode($arr));
        return;
    }

    function cargarHijos($idformapago)
    {
        $objdomaiSistemaP = new NomSistemaPago();
        $hijos = $objdomaiSistemaP->obtenerListadoSistemasPago(0, 500, $idformapago);
        foreach ($hijos as $m => $b) {
            $arreg[$m]['id'] = $b['idsistemapago'];
            $arreg[$m]['text'] = $b['denominacion'];
            $arreg[$m]['leaf'] = true;
        }
        return $arreg;
    }

    public function cargarPeriodoPagoAction()
    {
        $objdomain = New NomPeriodoPago();
        $array = $objdomain->obtenerListadoPeriodosPago(0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idperiodopago'] = $valor['idperiodopago'];
            $arr[$valores]['denominacion'] = $valor['denominacion'];
        }
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

    public function cargarGrupoEscalaAction()
    {
        $objdomain = New NomGrupoEscala();
        $array = $objdomain->obtenerListadoGruposEscala(0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idgrupoescala'] = $valor['idgrupoescala'];
            $arr[$valores]['denominacion'] = $valor['denominacion'];
        }
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

    public function cargarSectorSalarialAction()
    {
        $objdomain = New NomSectorSalarial();
        $array = $objdomain->obtenerListadoSectores(0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idsectorsalarial'] = $valor['idsectorsalarial'];
            $arr[$valores]['denominacion'] = $valor['denominacion'];
        }
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

    public function cargarEscalaSueldoxCargoAction()
    {
        $arr[0]['idescalasueldocargo'] = 1;
        $arr[0]['denominacion'] = 'Sueldo por cargo plantilla';
        $arr[1]['idescalasueldocargo'] = 2;
        $arr[1]['denominacion'] = 'Sueldo por cargo nomenclador';
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

    public function cargarcargarcategoriaAction()
    {
        $arr[0]['idescalasueldocargo'] = 1;
        $arr[0]['denominacion'] = 'Sueldo por cargo plantilla';
        $arr[1]['idescalasueldocargo'] = 2;
        $arr[1]['denominacion'] = 'Sueldo por cargo nomenclador';
        $arr = ConfEscalaElementoSalarialPersonaModel::cargarcargarcategoria();
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

    function buscarImporteSalarioEscalaAction()
    {
        $idcargo = $this->_request->getPost('idcargo');
        $datoscargo = $this->integrator->metadatos->obtenerDatosCargo($idcargo);
        $obj->grupoescala = $datoscargo[0]['grupocomplejidad'];
        $obj->salario = $datoscargo[0]['salario'];
        echo(json_encode($obj));
    }

    function buscarImporteSalarioEscalaSectorsalarialAction()
    {
        $idgrupoescala = $this->_request->getPost('idgrupoescala');
        $idsectorsalarial = $this->_request->getPost('idsectorsalarial');
        $denom = $this->_request->getPost('denom');
        $objsalarioscala = New NomSalarioEscala();
        $array = $objsalarioscala->obtenerSalario($idgrupoescala, $idsectorsalarial);
        //print_r($array);die;

        //$obj->grupoescala =$denom;
        $obj->salario = $array;
        echo(json_encode($obj));
    }

    /**
     * Accion para adicionar un tipo de nómina.
     */
    public function adicionarConfigElementoSalarialAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $idsistpago = $this->_request->getPost('idsistpago');
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $idgrupoescala = $this->_request->getPost('idgrupoescala');
        $idcbgrupoescala = $this->_request->getPost('idcbgrupoescala');
        $tiposalarioescala = $this->_request->getPost('tiposalarioescala');
        // print_r($tiposalarioescala);die;
        $idsector = $this->_request->getPost('idsector');
        $idescalasueldocargo = $this->_request->getPost('idescalasueldocargo');
        $importe = $this->_request->getPost('importe');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $todoscargos = $this->_request->getPost('todoscargos');
        $idcargo = Zend_Json::decode(stripslashes($this->_getParam('idcargo')));

        if($todoscargos == 'true'){
            $arrcargos = array();
            //Obteniendo todos los cargos de la estructura
            $ioc = ZendExt_IoC::getInstance();
            $arrCargosPorIdEstructura = $ioc->metadatos->obtenerCargosEstructura($idestructura);
            foreach ($arrCargosPorIdEstructura as $rc){
                $arrcargos[] = $rc['idcargo'];
            }
            $idcargo = $arrcargos;
        }

        if ($idcbgrupoescala) {
            $idgrupoescala = $idcbgrupoescala;
        }

        $objModel = new ConfigElementoSalarialCargoModel();
        $objModel->adicionarElementoSalarial($tiposalarioescala, $idsistpago, $idperiodopago, $idgrupoescala, $idsector
            , $idescalasueldocargo, $importe, $fechainicio, $fechafin, $idcargo);

        //Mensaje a mostrar
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para sincronizar un tipo de nómina.
     */
    public function sincronizarConfigElementoSalarialAction()
    {
        $salario = Zend_Json::decode(stripslashes($this->_getParam('salario')));        
        $arrayidcargo = Zend_Json::decode(stripslashes($this->_getParam('idcargo')));
        $idelementosalarial = Zend_Json::decode(stripslashes($this->_getParam('idelementosalarial')));
        $objModel = new ConfigElementoSalarialCargoModel();

        $count = 0;

        foreach ($arrayidcargo as $k => $idcargo) {
            foreach ($salario as $y => $imp) {
                //buscando el salario de la escala salarial secun el idcargo
                $escalasal = $objModel->obtenerSalarioEscalaXidcargo($idcargo);
                if ($salario[$k] == $escalasal) {
                    $count = 0;
                }else { 
                    $objModel->sincronizarElementoSalarial($idcargo, $escalasal);
                    $count ++;
                }
            }
        }        
        echo "{'codMsg':'$count'}";
    }

    /**
     * Accion para modificar un tipo de nómina.
     */
    public function modificarConfigElementoSalarialAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $idelementosalarial = Zend_Json::decode(stripslashes($this->_getParam('idelementosalarial')));
        $idsistpago = $this->_request->getPost('idsistpago');
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $idgrupoescala = $this->_request->getPost('idgrupoescala');
        $idcbgrupoescala = $this->_request->getPost('idcbgrupoescala');
        $tiposalarioescala = $this->_request->getPost('tiposalarioescala');
        $idsector = $this->_request->getPost('idsector');
        $idescalasueldocargo = $this->_request->getPost('idescalasueldocargo');
        $importe = $this->_request->getPost('importe');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $todoscargos = $this->_request->getPost('todoscargos');
        $idcargo = Zend_Json::decode(stripslashes($this->_getParam('idcargo')));

        if($todoscargos == 'true'){
            $arrcargos = array();
            //Obteniendo todos los cargos de la estructura
            $ioc = ZendExt_IoC::getInstance();
            $arrCargosPorIdEstructura = $ioc->metadatos->obtenerCargosEstructura($idestructura);
            foreach ($arrCargosPorIdEstructura as $rc){
                $arrcargos[] = $rc['idcargo'];
            }
            $idcargo = $arrcargos;
        }

        if ($idcbgrupoescala) {
            $idgrupoescala = $idcbgrupoescala;
        }
        $objModel = new ConfigElementoSalarialCargoModel();
        $objConfigElementoSalarialCargo = new ConfigElementoSalarialCargo();
        $objDomainDatSueldoPorCargo = new DatSueldoPorCargo();
        foreach ($idcargo as $contador => $ridc) {
            $elemento = $objConfigElementoSalarialCargo->obtenerIdElemSalCargo($ridc);
            if($elemento){
                $objModel->modificarElementoSalarial($tiposalarioescala, $elemento, $idsistpago, $idperiodopago, $idgrupoescala, $idsector
                    , $idescalasueldocargo, $importe, $fechainicio, $fechafin, $idcargo[$contador]);
            }
        }
        //Mensaje a mostrar
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para eliminar un tipo de nómina.
     */
    public function eliminarConfigElementoSalarialAction()
    {
        $idelementosalarial = Zend_Json::decode(stripslashes($this->_getParam('idelementosalarial')));
        $count = 0;
        //Creando el modelo de negocio de gestion de tipos de nómina.
        $objModel = new ConfigElementoSalarialCargoModel();
        foreach ($idelementosalarial as $contador => $idelemt) {
            //Eliminando el tipo de nómina.
            $bool = $objModel->eliminarElementoSalarial($idelemt);
            if ($bool == 2) {
                $count++;
            }
        }
        if ($count > 0) {
            echo "{'codMsg':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codMsg':'1'}";
        }
    }


    /**
     * Accion para exportar reporte de elementos salariales al cargo no configurados.
     */
    public function exportarReportgElementoSalarialAction()
    {
        $idestructura = Zend_Json::decode($this->_getParam('idestructura'));
        $ioc = ZendExt_IoC::getInstance();
        $w = 0;
        $x = 0;

        $arrCargosPorIdEstructura = $ioc->metadatos->obtenerCargosEstructura($idestructura);

        $IdEstructura = $ioc->metadatos->DameEstructura($idestructura);
        $DenomEstructura = $IdEstructura[0]->denominacion;
        $CodigoEstructura = $IdEstructura[0]->codigo;

        foreach($arrCargosPorIdEstructura as $ko => $vo) {
            $arraAuxCargos[$w] = $vo['idcargo'];
            $w++;
        }
        $obj = new ConfigElementoSalarialCargo();
        $elementos = $obj->obtenerconfiguracionesESC($arraAuxCargos);

        $consulta = array();
        foreach($elementos as $ke => $ve) {
            $arraAuxCargosESC[$x] = $ve['idcargo'];
            $consulta[$ke] = 'select pn.idplantillanominal,pn.orden,pn.denominacion as plantilla,pd.denominacion,pd.abreviatura,cres.idconceptopd,' . $ve['idcargo'] . ' as idcargo from mod_nomina.conf_reporteconceptoselementossalariales cres
                            inner join mod_nomina.nom_conceptopercepciondescuento pd on	(pd.idconceptopercepciondescuento = cres.idconceptopd)
                            inner join mod_nomina.conf_plantillanominalcargo pnc on (pnc.idcargo = ' . $ve['idcargo'] . ')
                            inner join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = pnc.idplantillanominal)
                            where cres.idconceptopd in(select ncpd.idconceptopercepciondescuento
                            from mod_nomina.nom_conceptopercepciondescuento ncpd
                            inner join mod_nomina.conf_conceptospdelementossalariales elem on (elem.idconceptopercepciondescuento = ncpd.idconceptopercepciondescuento) 
                            inner join mod_nomina.conf_elementosalarialcargo es on (es.idelementosalarialcargo = elem.idelementosalarialcargo)
                            where es.idcargo = ' . $ve['idcargo'] . ')';
            $consultaEscala[$ke] = 'select pn.idplantillanominal,pn.orden,pn.denominacion as plantilla,pd.denominacion,pd.abreviatura,cres.idconceptopd,' . $ve['idcargo'] . ' as idcargo from mod_nomina.conf_reporteconceptoselementossalariales cres
                            inner join mod_nomina.nom_conceptopercepciondescuento pd on	(pd.idconceptopercepciondescuento = cres.idconceptopd)
                            inner join mod_nomina.nom_conceptopdtarifa ct on (ct.idconceptopercepciondescuento = cres.idconceptopd)
                            inner join mod_nomina.nom_estructuraescalar ee on (ee.idconceptopdtarifa = ct.idconceptopdtarifa)
                            inner join mod_nomina.nom_tipoentrada te on (te.idtipoentrada = ee.idtipoentrada)
                             inner join mod_nomina.conf_plantillanominalcargo pnc on (pnc.idcargo = ' . $ve['idcargo'] . ')
                            inner join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = pnc.idplantillanominal)
                            where ct.idformacalculo = 3 and te.idtipoentrada=3 and
                            cres.idconceptopd in(select ncpd.idconceptopercepciondescuento
                            from mod_nomina.nom_conceptopercepciondescuento ncpd
                            inner join mod_nomina.conf_conceptospdelementossalariales elem on (elem.idconceptopercepciondescuento = ncpd.idconceptopercepciondescuento) 
                            inner join mod_nomina.conf_elementosalarialcargo es on (es.idelementosalarialcargo = elem.idelementosalarialcargo)
                            where es.idcargo = ' . $ve['idcargo'] . ')';
            $x++;
        }

        $string = implode(' UNION ',$consulta);

        $stringEscala = implode(' UNION ',$consultaEscala);
        $query = "Select result.* from (".$string.") as result order by result.orden ASC,result.idplantillanominal ASC,result.idcargo ASC ";
        $queryEscala = "Select result.* from (".$stringEscala.") as result order by result.orden ASC,result.idplantillanominal ASC,result.idcargo ASC ";

        //Cargos sin elementos salarial al cargo
//        $arraSESC = array_diff($arraAuxCargos,$arraAuxCargosESC);
//        if(count($arraSESC)==0){
//            $arraPlanSinESC = [];
//            $arrCargosSinESC = [];
//        }else{
//            $arraPlanSinESC = $obj->obtenerconfiguracionesESCPlantillaNominal($arraSESC);
//            $arrCargosSinESC = $ioc->metadatos->obtenerDatosCargo($arraSESC);
//        }
        //cargos con elementos salariales al cargo
        $arraPlanESC = $obj->obtenerconfiguracionesESCPlantillaNominal($arraAuxCargosESC);
        foreach($arraPlanESC as $kp=>$vp){
            $arraPlanESC[$kp]['denomcargo']=$ioc->metadatos->obtenerDatosCargo($vp['idcargo'])[0]['denominacion'];
        }


        //conceptos q no existen en la configuracion
        $Objconceptosdelcargo = new ConfigConceptospdElementosSalariales();
        $conceptoNoexisten = $Objconceptosdelcargo->obtenerConceptospdElementoSalarialxElementoSalCargoExiste($query);
        $aux=$conceptoNoexisten[0]['idcargo'];
        $auxArr=array();
        $cont=0;
        $auxArrF=array();
        $contF=0;
        foreach($conceptoNoexisten as $k=>$v){
            if($v['idcargo']== $aux){
//                $auxArr[$cont]=$v['abreviatura'];
                $auxArr[$cont]=$v['denominacion'];
                $cont++;
            }else{
                $auxArrF[$contF]['plantilla']=$conceptoNoexisten[$k-1]['plantilla'];
                $auxArrF[$contF]['idplantillanominal']=$conceptoNoexisten[$k-1]['idplantillanominal'];
                $auxArrF[$contF]['idcargo']=$conceptoNoexisten[$k-1]['idcargo'];
                $arrCargosSinESC1 = $ioc->metadatos->obtenerDatosCargo($conceptoNoexisten[$k-1]['idcargo']);
                $auxArrF[$contF]['idcargo']=$arrCargosSinESC1[0]['denominacion'];
                $auxArrF[$contF]['arra']=$auxArr;
                $contF++;
                $cont=0;
                $auxArr=array();
                $aux = $v['idcargo'];
//                $auxArr[$cont]=$v['abreviatura'];
                $auxArr[$cont]=$v['denominacion'];
                $cont++;
            }

        }


        //Conceptos q se calculan las escalas
        $Escalas = $Objconceptosdelcargo->obtenerConceptospdElementoSalarialxElementoSalCargoExiste($queryEscala);

        $auxEs=$Escalas[0]['idcargo'];
        $auxArrEs=array();
        $contEs=0;
        $auxArrFEs=array();
        $contFEs=0;

//        foreach($Escalas as $kes=>$ves){
//
//            if($ves['idcargo']== $auxEs){
////                $auxArrEs[$contEs]=$ves['abreviatura'];
//                $auxArrEs[$contEs]=$ves['denominacion'];
//                $contEs++;
//            }
//            else{
//                $auxArrFEs[$contFEs]['plantilla']=$Escalas[$kes-1]['plantilla'];
//                $auxArrFEs[$contFEs]['idplantillanominal']=$Escalas[$kes-1]['idplantillanominal'];
//                $auxArrFEs[$contFEs]['idcargo']=$Escalas[$kes-1]['idcargo'];
//                $arrESC = $ioc->metadatos->obtenerDatosCargo($Escalas[$kes-1]['idcargo']);
//                $auxArrFEs[$contFEs]['denominacion']=$arrESC[0]['denominacion'];
//                $auxArrFEs[$contFEs]['arra']=$auxArrEs;
//                $contFEs++;
//                $contEs=0;
//                $auxArrEs=array();
//                $auxEs = $ves['idcargo'];
////                $auxArrEs[$contEs]=$ves['abreviatura'];
//                $auxArrEs[$contEs]=$ves['denominacion'];
//                $contEs++;
//            }
//
//        }

//
        foreach($Escalas as $kes=>$ves){

            if($ves['idcargo']== $auxEs){
                $auxArrEs[$contEs]= $ves['denominacion'];
                $auxArrFEs[$contFEs]['plantilla']=$ves['plantilla'];
                $auxArrFEs[$contFEs]['idplantillanominal']=$ves['idplantillanominal'];
                $auxArrFEs[$contFEs]['idcargo']=$Escalas[$kes]['idcargo'];
                $arrESC = $ioc->metadatos->obtenerDatosCargo($ves['idcargo']);
                $auxArrFEs[$contFEs]['denominacion']=$arrESC[0]['denominacion'];
                $auxArrFEs[$contFEs]['arra']= $auxArrEs;
                $contEs++;
            }else{
                $contFEs++;
                $contEs=0;
                $auxArrEs=array();
                $auxEs = $ves['idcargo'];
                $auxArrEs[$contEs]=$ves['denominacion'];
                $auxArrFEs[$contFEs]['plantilla']=$ves['plantilla'];
                $auxArrFEs[$contFEs]['idplantillanominal']=$ves['idplantillanominal'];
                $auxArrFEs[$contFEs]['idcargo']=$Escalas[$kes]['idcargo'];
                $arrESC = $ioc->metadatos->obtenerDatosCargo($ves['idcargo']);
                $auxArrFEs[$contFEs]['denominacion']=$arrESC[0]['denominacion'];
                $auxArrFEs[$contFEs]['arra']= $auxArrEs;
                $contEs++;
            }
//
        }


//        $objPlantilla = new ConfPlantillaNominal();
//        $arrPlantilla = $objPlantilla->obtenerListadoPlantillasNominales($idestructura);
//
//        foreach($arrPlantilla as $k=>$v){
//            $objPlantillaCargo =  new ConfPlantillaNominalCargo();
//            $arrPlantilla[$k]['cargos'] = $objPlantillaCargo->obtenerCargosByIdPlantilla($v['idplantillanominal']);
//
//        }
//        $ioc = ZendExt_IoC::getInstance();
//        $arrCargos= $ioc->metadatos->obtenerDatosCargo($arraAuxCargos);


        //Crear reporte

        $objModel = new ReporteElemSalarialesCargoModel();

//        $reporte = $objModel->exportarReporte($arraPlanSinESC,$arrCargosSinESC,$auxArrF,$auxArrFEs,$DenomEstructura,$CodigoEstructura);
        $reporte = $objModel->exportarReporte($arraPlanESC,$auxArrF,$auxArrFEs,$DenomEstructura,$CodigoEstructura);





//        $count = 0;
//        $objPlantilla = new ConfPlantillaNominal();
//        $arrPlantilla = $objPlantilla->obtenerListadoPlantillasNominales($idestructura);
//        $objConfigElementoSalarialCargo = new ConfigElementoSalarialCargo();
//        $ioc = ZendExt_IoC::getInstance();
//
//        foreach($arrPlantilla as $k=>$v){
//            $objPlantillaCargo =  new ConfPlantillaNominalCargo();
//            $arrPlantilla[$k]['cargos'] = $objPlantillaCargo->obtenerCargosByIdPlantilla($v['idplantillanominal']);
//
//        }
//        //Listado de conceptos q debe llevar cada cargo de la tabla ConfigReporteConceptosElementossalariales
//        $Objconceptos = new ConfigReporteConceptosElementossalariales();
//        $conceptos = $Objconceptos ->obtenerListadoConceptos();
//
////Existe configuracion de elemento salarial
//        foreach($arrPlantilla as $ke=>$ve){
//            foreach($ve['cargos'] as $cargo=>$valorcargo){
//                $arrCargosPorIdEstructura= $ioc->metadatos->obtenerDatosCargo($valorcargo['idcargo']);
//                $arrPlantilla[$ke]['cargos'][$cargo]=$arrCargosPorIdEstructura[0];
//                $existeelementosalarial = $objConfigElementoSalarialCargo->existeConfElementoSalarialCargoXIdCargo($valorcargo['idcargo']);
//                if($existeelementosalarial == 1){
//                    $arrPlantilla[$ke]['cargos'][$cargo]['elementoS']=2;//existe elemento salarial al cargo
//                    $ElemSalarial = $objConfigElementoSalarialCargo->obtenerIdElemSalCargo($valorcargo['idcargo']);
//
//////                //Listado de los conceptos q ya tine el cargo
//                $Objconceptosdelcargo = new ConfigConceptospdElementosSalariales();
//                $conceptoPagoDescuento = $Objconceptosdelcargo->obtenerConceptospdElementoSalarialxElementoSalCargoExiste($ElemSalarial);
//
//                    $arrPlantilla[$ke]['cargos'][$cargo]['conceptos']=$conceptoPagoDescuento;
//
//
//                }else{
//                    $arrPlantilla[$ke]['cargo'][$cargo]['elementoS']=3;//no existe elemento salarial al cargo
//                }
//            }
//        }

//
//        $count = 0;
//        $i = 0;
//        $j = 0;
//        $w=0;
//        $x=0;
//        $s=0;
//
//        $arraAuxCargos=array();
//        $arraconceptos=array();
//        $arraescala=array();
//        $ArraySinConfiguracion = array();
//
//
//
//        $objDomainEscala = new ConfEscalaElementoSalarial();
//        $objConceptopdTarifa = new NomConceptoPDTarifa();
//        $objConfigElementoSalarialCargo = new ConfigElementoSalarialCargo();
//        $Objconceptos = new ConfigReporteConceptosElementossalariales();
//        $ioc = ZendExt_IoC::getInstance();
//
//        //Listado de conceptos q debe llevar cada cargo de la tabla ConfigReporteConceptosElementossalariales
//        $conceptos = $Objconceptos ->obtenerListadoConceptos();
//
//        //Buscar cargos de la estructura selecionada
//        $arrCargosPorIdEstructura = $ioc->metadatos->obtenerCargosEstructura($idestructura);
//        foreach($arrCargosPorIdEstructura as $ko=>$vo){
//            $arraAuxCargos[$w] = $vo['idcargo'];
//            $w++;
//        }
//        $a = implode(",",$arrCargosPorIdEstructura);
//        print_r($a);die;
//        $arrCargosPorIdEstructura= $ioc->metadatos->obtenerDatosCargo($arraAuxCargos);
//
//
//        //Buscar la configuracion de de cada estructura q falta
//
//        foreach($arrCargosPorIdEstructura as $n => $value) {
//
//            $existeelementosalarial = $objConfigElementoSalarialCargo->existeConfElementoSalarialCargoXIdCargo($value['idcargo']);
//
//            //pregunto si existe la configuracion de elementos salariales al cargo
//            if($existeelementosalarial == 1){
//                $ElemSalarial = $objConfigElementoSalarialCargo->obtenerIdElemSalCargo($value['idcargo']);
//
//                //Listado de los conceptos q ya tine el cargo
//                $Objconceptosdelcargo = new ConfigConceptospdElementosSalarialesModel();
//                $conceptoPagoDescuento = $Objconceptosdelcargo->obtenerConceptosxElementoSalCargo($ElemSalarial, 1, "");
//               $aa=new ConfigConceptospdElementosSalariales();
//               $prueba= $aa->obtenerConceptospdElementoSalarialxElementoSalCargoExiste($ElemSalarial);
//                print_r($arrCargosPorIdEstructura);die;
////               foreach($conceptos as $k =>$v){
////                   $igual=0;
////                   foreach($conceptoPagoDescuento as $kc=>$vc){
////                       if($v['idconceptopd']== $vc['idconceptopercepciondescuento']){
////                           $conceptos[$k]["existe"]= 2;//2existe 3noexiste
////                           $idformacalculoTarifa = $objConceptopdTarifa->obtenerIdFormaCalcXIdConceptoTarifa($vc['idtarifa'],$vc['idconceptopercepciondescuento']);
////                           $conceptos[$k]['idformacalculo'] = $idformacalculoTarifa;
////
////                           if($idformacalculoTarifa == 3){
////                               $arr = $objDomainEscala->obtenerConfEscalaElementoSalarialDadoIdConfConfepto($vc['idconfconceptospdelementossalariales']);
////                               if(count($arr)==0){
////                                   $conceptos[$k]['escala'] = 3;//no existe
////                               }
////
////                           }
////                           $igual++;
////                       }
////                   }
////
////                    if($igual==0){
////
////                        $arraconceptos[$x] = $v;
////                        $x++;
////                    }else{
////                        $arraescala [$s]= $v;
////                        $s++;
////                    }
////               }
//
////                $arrCargosPorIdEstructura[$n]['datos']= $arraconceptos;
//                $arrCargosPorIdEstructura[$n]['datos']= $prueba;
//
//                $i++;
//            }else{
//                $ArraySinConfiguracion[$count] = $value;
//                $count++;
//            }
//        }
//       // print_r($arrCargosPorIdEstructura);die;
//
//


            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codMsg':'1'}";

    }




}

